<script lang="ts" setup>
import { GridLabelPresets, GridStylePresets } from './presets'
import { GridMeta } from './types'

defineProps<{
  meta: GridMeta
  highlight: boolean
}>()
</script>

<template>
  <div
    class="flex items-center justify-center rounded-sm border border-solid border-gray-400/30 text-xl dark:border-gray-400/10"
    :class="[
      !meta.open &&
        !highlight &&
        'bg-gray-600/10 hover:bg-gray-500/30 dark:bg-gray-500/10 dark:hover:bg-gray-400/30',
    ]"
  >
    <template v-if="meta.flag">
      <div :class="[meta.open && !meta.mine && 'bg-red-500/40']">
        {{ GridLabelPresets.flag }}
      </div>
    </template>
    <template v-else-if="meta.open">
      <div
        v-if="meta.boom"
        class="bg-red-500/60"
      >
        {{ GridLabelPresets.boom }}
      </div>
      <div v-else-if="meta.mine">
        {{ GridLabelPresets.mine }}
      </div>
      <div
        v-else
        :class="[GridStylePresets[meta.adjacentMines!], 'font-bold', 'font-mono']"
      >
        {{ meta.adjacentMines }}
      </div>
    </template>
  </div>
</template>
