import ejs from 'ejs'
import dayjs from 'dayjs'
import grayMatter from 'gray-matter'
import path from 'path'
import fsExtra from 'fs-extra'
import fs from 'fs'
import { info } from '@actions/core'
import MarkdownIt from 'markdown-it'
import Prism from 'markdown-it-prism'
import anchor from 'markdown-it-anchor'
// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'
import LinkAttributes from 'markdown-it-link-attributes'
import { PostType, SiteConfigType, ConfigurationType } from './types'
import { slugify } from './utils'

import 'prismjs/components/prism-regex'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-xml-doc'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javadoclike'
import 'prismjs/components/prism-javadoc'
import 'prismjs/components/prism-jsdoc'

const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
})
  .use(Prism)
  .use(anchor, {
    slugify,
    permalink: anchor.permalink.linkInsideHeader({
      symbol: '#',
      renderAttrs: () => ({ 'aria-hidden': 'true' })
    })
  })
  .use(LinkAttributes, {
    matcher: (link: string) => /^https?:\/\//.test(link),
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  })
  .use(TOC, {
    includeLevel: [1, 2, 3],
    slugify
  })

export async function prepareTheme(configuration: ConfigurationType) {
  const outputDir = configuration.outputDir
  const repoPath = configuration.repoPath
  const siteConfig: SiteConfigType = require(path.join(
    configuration.repoPath,
    './site.json'
  ))
  const postsDir = path.join(configuration.repoPath, './posts')
  const themePath = path.join(__dirname, '../theme')

  async function prepareThemeFiles() {
    info('Preparing theme files')
    const nonPageFiles = fs
      .readdirSync(themePath)
      .filter(file => !file.endsWith('.ejs') && !file.startsWith('_'))

    for (const file of nonPageFiles) {
      const nonPageFilePath = path.join(themePath, file)
      const outputPath = path.join(outputDir, file)

      fsExtra.copySync(nonPageFilePath, outputPath)
    }

    if (siteConfig.cname) {
      fs.writeFileSync(path.join(outputDir, 'CNAME'), siteConfig.cname)
    }

    // Create the file to bypass jekyll execution by github pages
    fs.writeFileSync(path.join(outputDir, '.nojekyll'), '')
  }

  async function prepareBlogPosts() {
    info('Preparing blog posts')
    const postFiles = fs.readdirSync(postsDir)
    const posts: PostType[] = []

    for (let contentFile of postFiles) {
      const contentFilePath = path.join(postsDir, contentFile)
      const rawContent = fs.readFileSync(contentFilePath, 'utf-8')
      const { data, content } = grayMatter(rawContent)

      let { title, date, permalink, externalUrl } = data

      if (!date) {
        date = dayjs().format('ddd, MMMM DD, YYYY')
      } else {
        date = dayjs(date).format('ddd, MMMM DD, YYYY')
      }

      const postHtml = markdown.render(content)
      const fullFileName = (permalink || slugify(title).toLowerCase()).replace(
        /^\//,
        ''
      )
      const fullFileNameParts = fullFileName.replace(/\/$/, '').split('/')
      const fileName = fullFileNameParts.pop() || ''

      const nestedPostDir = fullFileNameParts.join('/')
      if (nestedPostDir) {
        fsExtra.ensureDirSync(path.join(outputDir, nestedPostDir))
      }

      const postMeta = {
        title,
        date,
        permalink: path.join('/', nestedPostDir, fileName),
        externalUrl,
        html: postHtml
      }

      const postFileTemplate = path.join(themePath, 'post.ejs')
      const populatedTemplate = await ejs.renderFile(postFileTemplate, {
        post: postMeta,
        siteConfig
      })

      fs.writeFileSync(
        path.join(outputDir, nestedPostDir, `${fileName}.html`),
        populatedTemplate
      )

      posts.push(postMeta)
    }

    return posts
  }

  async function prepareAbout() {
    info('Preparing about page')
    const aboutContent = fs.readFileSync(
      path.join(repoPath, 'about.md'),
      'utf-8'
    )
    const html = markdown.render(aboutContent)

    const populatedTemplate = await ejs.renderFile(
      path.join(themePath, 'about.ejs'),
      {
        siteConfig,
        html
      }
    )

    fs.writeFileSync(path.join(outputDir, 'about.html'), populatedTemplate)
  }

  async function prepareStaticPages() {
    info('Preparing 404 page')
    const populatedTemplate = await ejs.renderFile(
      path.join(themePath, '404.ejs'),
      { siteConfig }
    )
    fs.writeFileSync(path.join(outputDir, '404.html'), populatedTemplate)
  }

  async function prepareHome(posts: PostType[]) {
    info('Preparing homepage')
    const groupedPosts = posts.reduce((aggMap, postItem) => {
      const year = dayjs(postItem.date).format('YYYY')

      const postItems = [...(aggMap.get(year) || []), postItem]
      postItems.sort(
        (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
      )
      aggMap.set(year, postItems)

      return aggMap
    }, new Map())

    const homeHtml = await ejs.renderFile(path.join(themePath, 'index.ejs'), {
      siteConfig,
      groupedPosts
    })

    fs.writeFileSync(path.join(outputDir, 'index.html'), homeHtml)
  }

  async function copyStaticAssets() {
    info('Copying static assets')
    const staticAssetsPath = path.join(repoPath, 'static')
    fsExtra.copySync(staticAssetsPath, outputDir)
  }

  // Remove and recreate the output directory
  fsExtra.removeSync(configuration.outputDir)
  fsExtra.ensureDirSync(configuration.outputDir)

  await prepareThemeFiles()
  await prepareAbout()
  await prepareStaticPages()
  const posts = await prepareBlogPosts()
  await prepareHome(posts)
  await copyStaticAssets()
}
