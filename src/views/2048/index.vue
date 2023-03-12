<script lang="ts" setup>
import use2048 from './use2048'

const domSwipe = ref(null)
const { best, score, tiles, over, init, preset, nextPreset } = use2048({
  target: domSwipe,
})

watch(score, (value, oldValue) => {
  // const diff = value - oldValue
})

function getTileClassName(level: number) {
  const suffix = 2 ** level
  return ['tile-' + (suffix > 2048 ? 'super' : suffix)]
}
</script>

<template>
  <GameCard>
    <div
      class="relative inline-flex select-none flex-col space-y-2"
      @touchmove.stop.prevent
    >
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div
            class="tile-2048 w-32 cursor-pointer self-stretch rounded p-2 text-4xl font-bold shadow"
            style="box-shadow: none"
            @click="nextPreset()"
          >
            {{ preset.getTileText(11) }}
          </div>
          <div class="flex space-x-2 self-end">
            <div
              class="flex w-20 flex-col items-center rounded bg-orange-600/30 py-0.5"
            >
              <div>得分</div>
              <div class="text-xl font-bold">
                {{ score }}
              </div>
            </div>
            <div
              class="flex w-20 flex-col items-center rounded bg-orange-600/30 py-0.5"
            >
              <div>最高分</div>
              <div class="text-xl font-bold">
                {{ best }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="underline underline-offset-4">
            移动方块🎯组合出{{ preset.getTileText(11) }}
          </div>
          <div
            class="w-[5.5rem] cursor-pointer rounded bg-yellow-600/40 py-2 text-center text-xl"
            @click="init()"
          >
            新游戏
          </div>
        </div>
      </div>

      <div class="relative">
        <div
          class="relative rounded bg-[#bbada0] p-3"
          ref="domSwipe"
        >
          <div class="flex space-x-3">
            <div
              v-for="_ in 4"
              class="flex flex-col space-y-3"
            >
              <div
                v-for="_ in 4"
                class="h-[4.5rem] w-[4.5rem] rounded bg-[#eee4da] opacity-30"
              />
            </div>
          </div>

          <div class="absolute inset-0 p-3">
            <template
              v-for="tile in tiles.filter(i => i.level)"
              :key="tile.key"
            >
              <div
                class="absolute h-[4.5rem] w-[4.5rem] rounded transition"
                :style="{
                  transform: `translate(${5.25 * tile.x}rem, ${
                    5.25 * tile.y
                  }rem)`,
                }"
              >
                <div
                  class="tile-spawn flex h-full w-full items-center justify-center rounded font-bold"
                  :class="[
                    ...getTileClassName(tile.level),
                    preset.getFontSize(tile.level),
                  ]"
                >
                  {{ preset.getTileText(tile.level) }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <Transition>
          <div
            v-if="over"
            class="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(238,228,218,.5)] p-3 dark:bg-black/50"
          >
            <div class="mb-3 text-5xl font-bold">Game over!</div>
            <button
              class="w-20 rounded bg-yellow-600 py-2 text-xl"
              @click="init()"
            >
              再来
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </GameCard>
</template>

<style scoped>
@import url('./index.css');

.tile-spawn {
  animation: spawn 0.2s;
}

@keyframes spawn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.v-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.v-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: 0.7s;
}
</style>
