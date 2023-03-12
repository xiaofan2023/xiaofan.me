<script lang="ts" setup>
defineProps(['modelValue', 'title', 'appendToBody', 'maskClosable'])
defineEmits(['update:modelValue', 'onOk', 'onCancel'])
</script>

<template>
  <Teleport
    to="body"
    :disabled="!appendToBody"
  >
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        @click="maskClosable && $emit('onCancel')"
      >
        <div
          class="relative mx-4 w-full max-w-md rounded-md bg-white p-6 shadow dark:bg-[#1f1f1f] md:m-auto"
        >
          <template v-if="title || $slots.header">
            <slot name="header">
              <div class="mb-2 text-lg">{{ title }}</div>
            </slot>
          </template>
          <slot />
          <slot name="footer">
            <div
              class="flex flex-col items-center gap-2 pt-3 md:flex-row md:justify-end"
            >
              <div
                class="btn btn-classic h-8 w-full md:w-20"
                @click.stop="$emit('onCancel')"
              >
                取消
              </div>
              <div
                class="btn h-8 w-full bg-[#1677ff] text-white hover:bg-[#4096ff] dark:bg-[#1668dc] hover:dark:bg-[#3c89e8] md:w-20"
                @click.stop="$emit('onOk')"
              >
                确认
              </div>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
