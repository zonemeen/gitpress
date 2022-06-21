export interface FrontMatterType {
  title: string
  date: string
  permalink: string
  externalUrl: string
}

export interface PostType {
  title: string
  date: string
  permalink: string
  externalUrl: string
  html: string
}

export interface SiteConfigType {
  title: string
  subtitle: string
  baseUrl: string
  owner: {
    name: string
    email: string
  }
  social: {
    github: string
    twitter: string
    medium: string
  }
  seo: {
    title: string
    description: string
    author: string
    keywords: string[]
  }
  cname: string
}

export interface ConfigurationType {
  repoPath: string
  pusherName: string
  pusherEmail: string
  repoUrl: string
  token: string
  repositoryName: string
  hostname: string
  outputDir: string
  branch: string
  themeDir: string
}
