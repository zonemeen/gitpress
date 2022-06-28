<p align="center">
  <img height="120" src="./.github/assets/logo.png" />
  <h2 align="center">Gitpress</h2>
  <p align="center">通过Github Actions创建一个简约的markdown博客平台<p>
  <p align="center">
    <a href="https://zonemeen.github.io">
    	<img src="https://img.shields.io/badge/-Visit%20Sample%20Blog%20‎ ‎ -blue.svg?style=flat&colorA=blue" alt="zonemeen.github.io" />
    </a>
    <a href="https://github.com/zonemeen/gitpress/blob/main/LICENSE">
    	<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Gitpress is released under the MIT license." />
    </a>
  </p>
</p>

## 使用示例

- [代码库](https://github.com/zonemeen/zonemeen.github.io)
- [博客地址](https://zonemeen.github.io/)
- [English](./README.md)

## 配置博客

在GitHub上创建一个仓库（通过GitHub Pages部署，通常命名为yourname.github.io）来托管你的博客，其目录结构如下：

```shell
├── about.md
├── site.json
├── posts
      ├── better-javascript.md
      ├── Vue vs React.md
      └── technique-in-typescript.md
└── static
      ├── resume.pdf
      └── assets
            └── me.jpg
```

### 关于页面

`about.md` 是包含关于页面内容的markdown文件。

### 站点配置

`site.json` 包含博客站点的配置，下面是JSON配置的例子：

```json
{
  "title": "zonemeen",
  "subtitle": "I'm a passionate, self-taught, career-changed front-end developer since 2021",
  "owner": {
    "name": "zonemeen",
    "email": "miqilin18@gmail.com"
  },
  "social": [
    {
      "type": "Github",
      "url": "https://github.com/zonemeen"
    },
    {
      "type": "Twitter",
      "url": "https://twitter.com/zonemeen"
    }
  ],
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

`cname`是你的个人域名（如果适用的话）。

### 博客文章

`posts/` 是包含你所有markdown格式的博客文章的目录，它支持在每篇博文的顶部有以下的头字段（front-matter）：

```shell
---
title: Your first blog on GitHub Pages
date: 2022-06-20
permalink: /first-blog-ghpages
---

Content for your bog post
```

其中`title`是博客文章的标题，显示在主页和文章详情页上；`date`是博客文章的日期；`permalink`是通往文章详情页的路径。

### 静态资源

`static` 文件夹的内容会被复制到你的博客根部，并可通过 `http://[blogurl]/filename` 访问。

## 配置GitHub Actions

一旦你创建好了你的博客仓库，需要在你的仓库中配置GitHub Actions，在 `.github/workflows/deploy.yml` 创建GitHub Actions自动部署流程文件，内容如下：

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
        uses: zonemeen/gitpress@v1.0.12 # 查看 https://github.com/marketplace/actions/gitpress-deploy-blog-action，使用最新版本
        with:
          branch: gh-pages # GitHub Pages的可选分支
```
