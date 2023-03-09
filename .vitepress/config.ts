import { defineConfig } from 'vitepress'
import { userConfig as vite } from '../vite.config'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'

export default defineConfig({
  title: 'fanの🏡',
  description: 'my personal website powered by vitepress',

  srcDir: './docs',
  lastUpdated: true,

  vite,

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
  },

  themeConfig: {
    nav,
    sidebar,
  },
})
