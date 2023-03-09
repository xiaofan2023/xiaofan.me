import { type DefaultTheme } from 'vitepress/theme'

type Sidebar = DefaultTheme.Config['sidebar']

const notes: Sidebar = {
  '/notes/': [],
}

const plays: Sidebar = {
  '/plays/': [
    {
      text: '经典小游戏',
      collapsed: false,
      items: [
        {
          text: '🕹️ 2048',
          link: '/plays/g-2048',
        },
        {
          text: '🚩 扫雷',
          link: '/plays/g-mine-sweeper',
        },
      ],
    },
    {
      items: [
        {
          text: '八皇后问题',
          link: '/plays/n-queens',
        },
      ],
    },
  ],
}

export const sidebar = {
  ...notes,
  ...plays,
}
