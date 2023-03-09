<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title?: string
    defaultOpen?: boolean
  }>(),
  {
    title: '💡',
  }
)

const visible = ref(props.defaultOpen)
</script>

<template>
  <button
    class="inline-block rounded-md border border-solid border-gray-400/20 py-1.5 px-3.5 text-center transition hover:shadow"
    @click="visible = !visible"
  >
    {{ title }}
  </button>

  <Transition name="fade">
    <div v-if="visible">
      <slot />
    </div>
  </Transition>
</template>
