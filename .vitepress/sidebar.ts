import { type DefaultTheme } from 'vitepress/theme'

type Sidebar = DefaultTheme.Config['sidebar']

const notes: Sidebar = {
  '/notes/': [
    {
      items: [
        {
          text: 'TS handbook 阅读笔记',
          link: '/notes/ts/handbook',
        },
        {
          text: 'TS 类型挑战の内置类型',
          link: '/notes/ts/built-in',
        },
        {
          text: 'TS 类型挑战 🍚',
          link: '/notes/ts/type-challenges',
        },
        {
          text: 'Git 撤销操作',
          link: '/notes/git/withdraw',
        },
      ],
    },
  ],
}

const plays: Sidebar = {
  '/plays/': [
    {
      text: '经典小游戏',
      items: [
        {
          text: '扫雷',
          link: '/plays/g-minesweeper',
        },
        {
          text: '2048',
          link: '/plays/g-2048',
        },
      ],
    },
    {
      items: [
        {
          text: 'N皇后问题',
          link: '/plays/n-queens',
        },
      ],
    },
  ],
}

const sidebar = {
  ...notes,
  ...plays,
}

export default sidebar
