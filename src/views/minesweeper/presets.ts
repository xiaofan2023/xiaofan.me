import type { BoardMeta, Level, State } from './types'

export const StateEmojiPresets: Record<State, string> = {
  ready: '🙂',
  playing: '🤔',
  victory: '😎',
  defeat: '😵',
}

export const GridLabelPresets = {
  flag: '🚩',
  mine: '💣',
  boom: '💥',
  time: '⏱️',
}

export const GridStylePresets: Record<string, string> = {
  0: 'text-transparent',
  1: 'text-blue-500',
  2: 'text-green-500',
  3: 'text-red-500',
  4: 'text-indigo-500',
  5: 'text-orange-500',
  6: 'text-purple-500',
  7: 'text-teal-500',
  8: 'text-pink-500',
}

export const LevelPresets: Record<Exclude<Level, 'custom'>, BoardMeta> = {
  easy: { w: 9, h: 9, m: 10 },
  medium: { w: 16, h: 16, m: 40 },
  hard: { w: 30, h: 16, m: 99 },
} as const

export const LevelLocalize: Record<Level, string> = {
  easy: '初级',
  medium: '中级',
  hard: '高级',
  custom: '自定义',
}
