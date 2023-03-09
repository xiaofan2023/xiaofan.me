export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface SnapMeta {
  x: number
  y: number
  level: number
}

export interface TileMeta extends SnapMeta {
  key?: number /** as v-for key*/
  mergeFrom?: SnapMeta
}

export interface StorageOptions {
  best: number
  score: number
  snaps: SnapMeta[]
}

export function levelToScore(level: number) {
  return 2 ** level
}

export function normalizeTiles(tiles: TileMeta[]): SnapMeta[] {
  return tiles.map(({ x, y, level }) => ({ x, y, level }))
}

let key = 0

export class Model {
  over = false
  best = 0
  score = 0
  tiles: TileMeta[] = []
  snaps: (SnapMeta | null)[][] = []

  init(storages?: StorageOptions) {
    this.best = storages?.score || 0
    this.score = storages?.score || 0
    this.tiles = storages?.snaps || []
    this.updateTiles(true)
    // start new game
    if (this.tiles.length === 0) {
      this.popup(2)
    }
  }

  popup(count = 1) {
    const candidates: number[] = []
    this.snaps.flat().forEach((tile, index) => !tile && candidates.push(index))
    if (candidates.length < count) {
      return
    }
    const target = shuffle(candidates, count)
    target.forEach(i => {
      const x = i % 4,
        y = Math.floor(i / 4),
        level = Math.random() < 0.8 ? 1 : 2
      const newTile: TileMeta = {
        x,
        y,
        level,
        key: key++,
      }
      this.tiles.push(newTile)
      this.snaps[y][x] = newTile
    })
    this.over = this.isGameOver()
  }

  move(dir: Direction) {
    if (this.over) {
      return
    }
    // before move
    const prevSnaps = JSON.stringify(normalizeTiles(this.tiles))

    // move
    const reverse = dir === 'LEFT' || dir === 'UP'
    let prop: 'x' | 'y'
    let getItems: (i: number) => (TileMeta | null)[]
    if (dir === 'LEFT' || dir === 'RIGHT') {
      prop = 'x'
      getItems = (y: number) => this.snaps[y]
    } else {
      prop = 'y'
      getItems = (x: number) => [
        this.snaps[0][x],
        this.snaps[1][x],
        this.snaps[2][x],
        this.snaps[3][x],
      ]
    }
    for (let i = 0; i < 4; i++) {
      let items = getItems(i).filter(Boolean)
      items = this.mergeTileItems(items, reverse)
      const offset = reverse ? 0 : 4 - items.length
      items.forEach((item, index) => (item[prop] = offset + index))
    }

    // after move
    this.updateTiles()
    if (JSON.stringify(normalizeTiles(this.tiles)) === prevSnaps) {
      return
    }
    if (this.score > this.best) {
      this.best = this.score
    }
    this.popup()
  }

  isGameOver() {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const t = this.snaps[y][x]
        if (!t) {
          return false
        }

        if (x < 3) {
          const tx = this.snaps[y][x + 1]
          if (!tx || canIMerge(t, tx)) {
            return false
          }
        }
        if (y < 3) {
          const ty = this.snaps[y + 1][x]
          if (!ty || canIMerge(t, ty)) {
            return false
          }
        }
      }
    }
    return true
  }

  updateTiles(resetKey = false) {
    const snaps = Array.from({ length: 4 }, () => new Array(4).fill(null))
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      const tile = this.tiles[i]
      if (!tile.level) {
        this.tiles.splice(i, 1)
        continue
      }
      resetKey && (tile.key = key++)
      snaps[tile.y][tile.x] = tile
    }
    this.snaps = snaps
  }

  mergeTileItems(items: TileMeta[], reverse?: boolean) {
    if (items.length < 2) {
      return items
    }
    reverse && items.reverse()
    if (items.length === 2) {
      this.tryMerge(items[0], items[1])
    } else if (items.length === 3) {
      !this.tryMerge(items[1], items[2]) && this.tryMerge(items[0], items[1])
    } else if (items.length === 4) {
      if (this.tryMerge(items[2], items[3])) {
        this.tryMerge(items[0], items[1])
      } else {
        !this.tryMerge(items[1], items[2]) && this.tryMerge(items[0], items[1])
      }
    }
    reverse && items.reverse()
    return items.filter(item => item.level)
  }

  tryMerge(from: TileMeta, to: TileMeta) {
    if (canIMerge(from, to)) {
      from.level++
      from.mergeFrom = { x: from.x, y: from.y, level: from.level }
      to.level = 0
      this.score += levelToScore(from.level)
      return true
    }
  }
}

function shuffle<T>(array: T[], target: number): T[] {
  const { length } = array
  for (let i = 0; i < length && i < target; i++) {
    const j = Math.floor(Math.random() * (length - i)) + i
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.slice(0, target)
}

function canIMerge(from: TileMeta, to: TileMeta) {
  return from.level === to.level
}
