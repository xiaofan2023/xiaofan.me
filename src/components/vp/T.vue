<script lang="ts" setup>
import IconCarbonDataEnrichment from '~icons/carbon/data-enrichment'
import IconCarbonIdea from '~icons/carbon/idea'

const props = defineProps<{
  title?: string
  defaultOpen?: boolean
}>()

const visible = ref(props.defaultOpen)
</script>

<template>
  <div
    class="inline-flex cursor-pointer items-center justify-center rounded border border-solid border-gray-400/30 py-1.5 px-4 transition hover:shadow"
    @click="visible = !visible"
  >
    <icon-carbon-idea v-if="!visible" />
    <icon-carbon-data-enrichment v-else />
    <div
      class="ml-2"
      v-if="title"
    >
      {{ title }}
    </div>
  </div>

  <Transition name="fade">
    <div v-if="visible">
      <slot />
    </div>
  </Transition>
</template>
