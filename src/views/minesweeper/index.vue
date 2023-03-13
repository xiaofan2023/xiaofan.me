<script lang="ts" setup>
import {
  useEventListener,
  useMouseInElement,
  useStorage,
  useTimestamp,
} from '@vueuse/core'
import GridItem from './item.vue'
import {
  GridLabelPresets,
  LevelLocalize,
  LevelPresets,
  StateEmojiPresets,
} from './presets'
import type { Level } from './types'
import useModel from './useModel'

const model = useModel()
const { state, board, grids, timer, flags } = model

const gameLevel = computed(() => {
  for (const [level, values] of Object.entries(LevelPresets)) {
    if (values.m === board.value.m) {
      return level
    }
  }
  return 'custom'
})

const duration = ref(0)
const timeStamp = useTimestamp()

watchEffect(() => {
  if (state.value === 'ready') {
    duration.value = 0
  } else if (state.value === 'playing') {
    duration.value =
      (timeStamp.value - timer.value.start + timer.value.duration) / 1000
  } else if (state.value === 'defeat') {
  } else if (state.value === 'victory') {
    setTimeout(() => {
      alert('😎 恭喜你扫雷成功 👍👍👍')
    }, 700)
  }
})

function format(value: number) {
  return Math.floor(value).toString().padStart(3, '0')
}

function levelOptions() {
  return Object.keys(LevelPresets) as Level[]
}

/* ------------------------------------ - ----------------------------------- */
const itemWidth = ref(32)
const fastModel = useStorage('g-minesweeper-fast', true)
const flagModel = useStorage('g-minesweeper-flag', false)

const domBoard = ref<HTMLElement>()
const elementX = ref(0)
const elementY = ref(0)
const highlightFlag = ref(false)
const highlightList = ref<number[]>([])

function onPointerDown(event: PointerEvent) {
  highlightFlag.value = true
  updateElement(event)
  highlightList.value = model.getHighlight(getClickGridPosition())
}

function onMoveHandler(event: PointerEvent) {
  if (highlightFlag.value) {
    updateElement(event)
    highlightList.value = model.getHighlight(getClickGridPosition())
  }
}

function onPointerUp(event: PointerEvent) {
  highlightFlag.value = false
  highlightList.value = []
}

function onClick() {
  const position = getClickGridPosition()
  flagModel.value ? model.mark(position) : model.open(position, fastModel.value)
}

function onRightClick() {
  model.mark(getClickGridPosition())
}

function updateElement(event: PointerEvent) {
  const { x, y, width, height } = domBoard.value!.getBoundingClientRect()
  let diffX = event.clientX - x
  let diffY = event.clientY - y
  if (diffX < 0 || diffX > width || diffY < 0 || diffY > height) {
    return
  }
  elementX.value = diffX
  elementY.value = diffY
}

function getClickGridPosition(
  clickX = elementX.value,
  clickY = elementY.value,
  length = itemWidth.value + 2
) {
  return {
    x: Math.floor(clickX / length),
    y: Math.floor(clickY / length),
  }
}

//#region save & load
const storageKey = 'g-minesweeper-prev'
const showResumeDialog = ref(!!localStorage.getItem(storageKey))
const storageData = computed(() => {
  if (showResumeDialog.value) {
    try {
      return JSON.parse(localStorage.getItem(storageKey)!)
    } catch (e: any) {}
  }
})

const autoSave = (() => {
  let called = false
  return () => {
    if (called) {
      return
    }
    called = true
    if (state.value !== 'playing') {
      return
    }
    localStorage.setItem(storageKey, JSON.stringify(model.save()))
  }
})()

onUnmounted(() => autoSave())

useEventListener('unload', () => autoSave())

function tryResume() {
  try {
    model.load(storageData.value)
  } catch (e: any) {
    model.init()
  }
  closeResumeDialog()
}

function closeResumeDialog() {
  showResumeDialog.value = false
  localStorage.removeItem(storageKey)
}
//#endregion
</script>

<template>
  <GameCard>
    <div class="select-none space-y-2">
      <div class="flex justify-between px-2">
        <div class="flex space-x-2">
          <button
            v-for="level in levelOptions()"
            class="btn text-sm transition-none"
            :class="[gameLevel === level ? 'btn-highlight' : 'btn-classic']"
            @click="model.init(level)"
          >
            {{ LevelLocalize[level] }}
          </button>
          <button
            v-if="false"
            class="btn text-sm"
            :class="[gameLevel === 'custom' ? 'btn-highlight' : 'btn-classic']"
            @click=""
          >
            自定义
          </button>
        </div>
        <div
          class="btn btn-classic"
          @click="model.redo()"
          title="重玩本局游戏"
        >
          <i-carbon-repeat-one />
        </div>
      </div>

      <div
        class="flex justify-center space-x-2 px-2 font-mono text-xl font-bold"
      >
        <div class="btn btn-classic w-24">
          <span>{{ GridLabelPresets.mine }}</span>
          <span class="ml-1 w-10 text-red-500">
            {{ format(board.m - flags.length) }}
          </span>
        </div>
        <div
          class="btn btn-classic w-24"
          @click="model.init()"
        >
          {{ StateEmojiPresets[state] }}
        </div>
        <div class="btn btn-classic w-24">
          <span>{{ GridLabelPresets.time }}</span>
          <span class="ml-1 w-10 text-red-500">{{ format(duration) }}</span>
        </div>
      </div>

      <div class="overflow-auto">
        <div
          v-if="board"
          ref="domBoard"
          class="inline-flex flex-col space-y-[2px]"
          @pointerdown="onPointerDown"
          @pointermove="onMoveHandler"
          @pointerup="onPointerUp"
          @click="onClick"
          @click.right="onRightClick"
          @contextmenu.prevent
        >
          <div
            v-for="(_, y) in board.h"
            class="flex space-x-[2px]"
          >
            <GridItem
              v-for="(_, x) in board.w"
              :style="{
                width: itemWidth + 'px',
                height: itemWidth + 'px',
              }"
              :meta="grids[model.posToUid({ x, y })]"
              :highlight="
                highlightFlag &&
                highlightList.includes(model.posToUid({ x, y }))
              "
            >
            </GridItem>
          </div>
        </div>
      </div>

      <div class="flex justify-center space-x-3">
        <label
          for="toggleQuick"
          class="btn btn-classic w-20"
        >
          <input
            id="toggleQuick"
            type="checkbox"
            v-model="fastModel"
            class="mr-2"
          />
          <span class="text-base">🚀</span>
        </label>
        <label
          for="toggleFlag"
          class="btn btn-classic w-20"
        >
          <input
            id="toggleFlag"
            type="checkbox"
            v-model="flagModel"
            class="mr-2"
          />
          <span class="text-base">{{ GridLabelPresets.flag }}</span>
        </label>
      </div>
    </div>
  </GameCard>

  <Modal
    v-model="showResumeDialog"
    title="恢复对局 🤔"
    maskClosable="true"
    appendToBody="true"
    @onOk="tryResume"
    @onCancel="closeResumeDialog"
  >
    <div class="flex flex-col items-center p-2">
      <div>
        有上次未完成的对局
        <span class="text-sm"
          >({{ new Date(storageData.timer.start).toLocaleString() }})</span
        >
      </div>
      <div>是否继续?</div>
    </div>
  </Modal>
</template>
