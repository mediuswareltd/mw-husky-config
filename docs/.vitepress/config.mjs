import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "MW Husky Config",
  description: "A reusable Husky configuration package for consistent pre-commit quality checks and conventional commit messages.",
  base: '/mw-husky-config/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  themeConfig: {
    logo: { light: '/logo.png', dark: '/logo.png' },
    siteTitle: "MW Husky Config",
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Getting started', link: '/getting-started' },
      {
        text: 'GitHub',
        link: 'https://github.com/mediuswareltd/mw-husky-config'
      }
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Guide', link: '/guide' },
          { text: 'About', link: '/about' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mediuswareltd/mw-husky-config' }
    ],
    footer: {
      message: 'Built by Mediusware',
      copyright: 'Copyright © Mediusware Ltd'
    },
    editLink: {
      pattern: 'https://github.com/mediuswareltd/mw-husky-config/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    search: {
      provider: 'local'
    }
  }
,
  vite: {
    css: {
      postcss: {
        plugins: []
      }
    }
  }
})
