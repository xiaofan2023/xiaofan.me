export type State = 'ready' | 'playing' | 'victory' | 'defeat'

export type Level = 'easy' | 'medium' | 'hard' | 'custom'

export interface Position {
  x: number
  y: number
}

export interface BoardMeta {
  w: number
  h: number
  m: number
}

export interface TimerMeta {
  start: number
  duration: number
}

export interface GridMeta {
  uid: number
  open?: boolean
  flag?: boolean
  mine?: boolean
  boom?: boolean
  adjacentMines?: number
}

export interface StorageOptions {
  timer: TimerMeta
  board: BoardMeta
  grids: GridMeta[]
}
