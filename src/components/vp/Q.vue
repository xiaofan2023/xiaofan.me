<script lang="ts" setup>
defineProps<{
  tags?: string[]
}>()

provide('activeTag', [])

computed(() => {})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
