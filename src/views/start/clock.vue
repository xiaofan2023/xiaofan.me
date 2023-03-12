<script lang="ts" setup>
import { useDateFormat, useNow } from '@vueuse/core'

const now = useNow()
const timeFormatter = ref('HH:mm')
const showSecond = ref(false)

const dateFormatter = computed(() => 'M月D日 ddd')
const time = useDateFormat(now, timeFormatter)
const date = useDateFormat(now, dateFormatter)

function toggleSecond() {
  showSecond.value = !showSecond.value
  timeFormatter.value = showSecond.value ? 'HH:mm:ss' : 'HH:mm'
}
</script>

<template>
  <div class="relative flex flex-col items-center space-y-2">
    <div
      class="text-6xl"
      :class="[showSecond && 'font-mono']"
      @click="toggleSecond"
    >
      {{ time }}
    </div>
    <div class="flex justify-center space-x-2">
      <div>{{ date }}</div>
      <!-- TODO:lunar -->
      <div></div>
    </div>
  </div>
</template>
