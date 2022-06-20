<p align="center">
  <h2 align="center">gitpress</h2>
  <p align="center">Create good looking blog from your markdown files on GitHub<p>
  <p align="center">
    <a href="https://zonemeen.github.io/">
    	<img src="https://img.shields.io/badge/-Visit%20Sample%20Blog%20‎ ‎ -teal.svg?style=flat&colorA=teal" alt="kamranahmed.info" />
    </a>
    <a href="license">
    	<img src="https://img.shields.io/badge/License-MIT-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="license mit" />
    </a>
  </p>
</p>

<br>

## Usage Example

* [Codebase](https://github.com/zonemeen/zonemeen.github.io)
* [Live Blog](https://zonemeen.github.io/)


## Setting Up the Blog

Create a repository on GitHub to hold your blog content with the following directory structure:

```shell
├── about.md
├── posts
  ├── code-better-javascript.md
  ├── Vue vs React.md
  └── technique-in-typescript.md
├── site.json
└── static
    ├── resume.pdf
    └── ebook.pdf
```

### About Page
`about.md` is the markdown file containing the content for your about page.

### Blog Posts
`posts/` is the directory containing all your blog posts in markdown format. It supports the following frontmatter on top of each of the blog post

```shell
---
title: Your first blog on GitHub Pages
date: 2022-06-20
permalink: /first-blog-ghpages
---

Content for your bog post
```

Where `title` is the blog post title shown on the homepage as well as on the post detail page. `date` is the blog post date. `permalink` is the optional parameter to let you override the slug of the blog post.

### Site Configuration

`site.json` contains the configuration to setup the blog. Given below is the sample JSON configuration.

```json
{
  "title": "zonemeen",
  "subtitle": "I'm a passionate, self-taught, career-changed front-end developer since 2021",
  "owner": {
    "name": "zonemeen",
    "email": "miqilin18@gmail.com"
  },
  "social": {
    "github": "zonemeen",
    "twitter": "zonemeen"
  },
  "newsletter": {
    "currentCount": "2,000",
    "revueUsername": "zonemeen"
  },
  "seo": {
    "title": "zonemeen's blog",
    "description": "A front-end engineer's article sharing",
    "author": "zonemeen",
    "keywords": [
      "blog",
      "javascript",
      "typescript",
      "passionate",
      "self-taught",
      "career-changed",
      "front-end developer"
    ]
  },
  "cname": "zonemeen.github.io"
}
```

For the `newsletter`, you can remove the object if you don't have [revue newsletter](https://www.getrevue.co/). And `cname` is your personal domain if applicable.

### Static Assets

The contents of the `static` folder will simply be copied at the root of your blog and will be accessible via `http://[blogurl]/filename`

## Setting Up GitHub Action

Once you have the blog repository setup, you need to setup the GitHub action in your repository. Create the action file at `.github/workflows/deploy.yml` with the following content

```yaml
name: Build and Deploy
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Deploy
        uses: zonemeen/gitpress@v1.0.0
        with:
          branch: gh-pages # Optional branch for GitHub Pages
```
