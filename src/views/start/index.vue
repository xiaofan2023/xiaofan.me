<script lang="ts" setup>
import Clock from './clock.vue'
import Search from './search.vue'

const word = ref('乐观心态😄积极作为')
</script>

<template>
  <div class="fixed inset-0">
    <div class="flex h-[80vh] flex-col items-center justify-center gap-2">
      <Clock />
      <Search />
    </div>
    <div class="absolute left-0 right-0 bottom-20 text-center">
      {{ word }}
    </div>
  </div>
</template>
