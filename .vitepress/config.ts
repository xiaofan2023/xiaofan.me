import { defineConfig } from 'vitepress'
import { userConfig as vite } from '../vite.config'
import sidebar from './sidebar'

export default defineConfig({
  title: '🏡',
  description: 'my personal website powered by vitepress',

  srcDir: './docs',
  lastUpdated: true,

  markdown: {
    theme: 'vitesse-dark'
    // theme: {
    //   light: 'github-light',
    //   dark: 'vitesse-dark',
    // },
  },

  themeConfig: {
    nav: [
      {
        text: '📅 存档',
        link: '/posts/',
        activeMatch: '/posts/',
      },
      {
        text: '📝 笔记',
        link: '/notes/',
        activeMatch: '/notes/',
      },
      {
        text: '☕ 练习',
        link: '/plays/',
        activeMatch: '/plays/',
      },
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/xiaofan2023/xiaofan.me' },
    ],
    editLink: {
      pattern: 'https://github.com/xiaofan2023/xiaofan.me/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },

  vite,
})
