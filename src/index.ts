import path from 'path'
import { getInput } from '@actions/core'
import * as github from '@actions/github'
import { run } from './runner'

const { pusher, repository } = github.context.payload

const token = getInput('token') || process.env.GITHUB_TOKEN || ''
const branch = getInput('branch') || 'gh-pages'
const hostname = 'github.com'
const repositoryName =
  repository?.full_name || process.env.GITHUB_REPOSITORY || ''
const repoPath = process.env.GITHUB_WORKSPACE || path.join(__dirname, '../')
const outputDir = path.join(repoPath, 'output')

run({
  token,
  pusherName: pusher?.name || process.env.GITHUB_PUSHER_NAME,
  pusherEmail: pusher?.email || process.env.GITHUB_PUSHER_EMAIL,
  repositoryName,
  hostname,
  repoPath,
  repoUrl: `https://x-access-token:${token}@${hostname}/${repositoryName}.git`,
  outputDir,
  branch,
  themeDir: path.join(__dirname, '../theme')
})
