<script lang="ts" setup>
import { useIntervalFn, useWebWorkerFn } from '@vueuse/core'
import { NQueen } from './n-queens-solution'

const MAX = 13

const n = ref(8)
const playing = ref(false)
const solving = ref(false)
const results = ref<ReturnType<typeof NQueen>>([])
const modelIndex = ref(1)
const index = computed(() => indexGuard() - 1)
const timer = ref(0)
const current = computed(() => results.value[index.value])

const { workerFn, workerTerminate } = useWebWorkerFn(NQueen)

watch(n, () => doCalculate(), {
  immediate: true,
})

const { resume, pause } = useIntervalFn(
  () => {
    const value = modelIndex.value
    modelIndex.value = value === results.value.length ? 1 : value + 1
  },
  1500,
  {
    immediate: false,
  }
)

function doCalculate() {
  const cachePlaying = playing.value
  const start = Date.now()
  playing.value = false
  solving.value = true
  workerFn(n.value)
    .then(value => {
      results.value = value
      timer.value = Date.now() - start
      playing.value = cachePlaying
      solving.value = false
    })
    .catch(() => {
      terminateCalculate()
    })
}

function terminateCalculate() {
  workerTerminate()
  n.value = 8
  solving.value = true
}

function toggleN(value: number) {
  if (solving.value) {
    return
  }
  value = value < 1 ? 1 : value
  value = value > MAX ? MAX : value
  n.value = value
}

function toggleAutoPlay() {
  playing.value ? pause() : resume()
  playing.value = !playing.value
}

function indexGuard() {
  if (modelIndex.value > results.value.length) {
    modelIndex.value = 1
  } else if (modelIndex.value < 1) {
    modelIndex.value = results.value.length
  }
  return modelIndex.value
}
</script>

<template>
  <div class="flex flex-col gap-2 p-3">
    <div class="flex items-center">
      <div class="text-2xl font-bold">N</div>
      <div class="mx-2 text-2xl">=</div>
      <div
        class="select-none overflow-hidden rounded border border-solid border-gray-400/40"
      >
        <div class="flex">
          <button
            class="flex w-8 items-center justify-center bg-gray-400/20"
            @click="toggleN(n - 1)"
          >
            ➖
          </button>
          <div class="flex w-16 items-center p-1">
            <input
              v-model.lazy="n"
              class="w-full text-center text-xl"
              type="number"
              readonly
            />
          </div>
          <button
            class="flex w-8 items-center justify-center bg-gray-400/20"
            @click="toggleN(n + 1)"
          >
            ➕
          </button>
        </div>
      </div>
      <div class="ml-2 self-end text-sm">N不超过{{ MAX }}</div>
    </div>

    <div class="flex items-center text-sm">
      <div>
        找到<span class="mx-1 text-base underline">{{
          !solving ? results.length : '???'
        }}</span
        >种摆法，
      </div>
      <div>
        用时<span class="mx-1 text-base underline">{{
          !solving ? (timer / 1000).toFixed(2) : '???'
        }}</span
        >秒
      </div>
    </div>

    <div v-if="!solving && results.length">
      <div class="relative mb-2 inline-block shadow-md">
        <div
          v-for="col in n"
          class="flex"
        >
          <div
            v-for="row in n"
            :class="[(row + col) % 2 ? 'bg-amber-600/90' : 'bg-orange-300/90']"
            class="h-9 w-9 flex-shrink-0 select-none text-center text-3xl"
          >
            {{ current[row - 1][col - 1] === 'Q' ? '&#9813;' : '' }}
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <button
          :title="playing ? '点击停止轮播' : '点击自动轮播'"
          @click="toggleAutoPlay"
          class="mr-2 w-10 text-4xl"
        >
          <i v-if="playing">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M13 16V8h2v8h-2m-4 0V8h2v8H9m3-14a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"
              ></path>
            </svg>
          </i>
          <i v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-2 14.5l6-4.5l-6-4.5v9Z"
              />
            </svg>
          </i>
        </button>

        <div class="flex items-center text-sm">
          <div>第</div>
          <div
            class="mx-2 select-none overflow-hidden rounded border border-solid border-gray-400/40"
          >
            <div class="flex">
              <button
                class="flex w-8 items-center justify-center bg-gray-400/20"
                @click="
                  modelIndex =
                    modelIndex === 1 ? results.length : modelIndex - 1
                "
              >
                ➖
              </button>
              <div class="flex w-20 items-center p-1">
                <input
                  v-model.lazy="modelIndex"
                  class="w-full text-center text-base"
                  type="number"
                  @change="indexGuard"
                />
              </div>
              <button
                class="flex w-8 items-center justify-center bg-gray-400/20"
                @click="
                  modelIndex =
                    modelIndex === results.length ? 1 : modelIndex + 1
                "
              >
                ➕
              </button>
            </div>
          </div>
          <div>种摆法</div>
        </div>
      </div>
    </div>

    <div
      v-else-if="solving"
      class="flex items-center"
    >
      <button
        class="btn btn-classic h-10"
        @click="terminateCalculate"
        title="点击取消"
      >
        <svg
          class="mr-2 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g transform="rotate(-90 12 12)">
            <path
              fill="currentColor"
              d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z"
            />
          </g>
        </svg>
        计算中...
      </button>
    </div>
  </div>
</template>
