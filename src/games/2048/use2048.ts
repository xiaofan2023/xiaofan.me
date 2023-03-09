import {
  useCycleList,
  useEventListener,
  useStorage,
  useSwipe,
} from '@vueuse/core'
import { Direction, Model, normalizeTiles } from './model'
import { presetList } from './presets'

export interface Use2048Options {
  target?: Ref<HTMLElement | undefined | null>
  bestKey?: string
  prevKey?: string
  presetKey?: string
  autoSaveWhenExit?: boolean
}

const eventKeyMap: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  a: 'LEFT',
  s: 'DOWN',
  d: 'RIGHT',
}

export default function use2048(options: Use2048Options = {}) {
  const {
    target,
    prevKey = 'g-2048-prev',
    bestKey = 'g-2048-best',
    presetKey = 'g-2048-preset',
    autoSaveWhenExit = true,
  } = options

  const model = reactive(new Model())
  const { over, best, score, tiles } = toRefs(model)
  useStorage(bestKey, best)

  const presetIndex = useStorage(presetKey, 0)
  const { state, index, next } = useCycleList(presetList)
  index.value = presetIndex.value

  useEventListener('keydown', event => {
    const direction = eventKeyMap[event.key]
    if (direction) {
      event.preventDefault()
      model.move(direction)
    }
  })

  const { direction } = useSwipe(target, {
    threshold: 20,
    passive: false,
  })

  const stops = [
    watch(index, value => (presetIndex.value = value)),
    watch(direction, value => {
      if (value && value !== 'NONE') {
        model.move(value)
      }
    }),
  ]

  function doResume() {
    let prevData
    try {
      prevData = JSON.parse(localStorage.getItem(prevKey)!)
    } catch (e: any) {}
    model.init(prevData)
  }

  function doAutoSave() {
    if (over.value) {
      return
    }
    localStorage.setItem(
      prevKey,
      JSON.stringify({ score: score.value, snaps: normalizeTiles(tiles.value) })
    )
  }

  if (autoSaveWhenExit) {
    let called = false
    const saveOnce = () => {
      if (!called) {
        called = true
        doAutoSave()
      }
    }
    onUnmounted(() => saveOnce())
    useEventListener('unload', () => saveOnce())
  }

  doResume()

  onScopeDispose(() => stops.forEach(stop => stop()))

  return {
    over,
    best,
    score,
    tiles,
    init: model.init.bind(model),
    preset: state,
    nextPreset: next,
  }
}
