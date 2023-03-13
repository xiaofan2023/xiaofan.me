<script lang="ts" setup>
import { useCycleList, useStorage } from '@vueuse/core'

const presets = [
  {
    id: 'google',
    text: '谷歌',
    href: 'https://www.google.com/search?q=',
  },
  {
    id: 'bing',
    text: '必应',
    href: 'https://cn.bing.com/search?q=',
  },
  {
    id: 'baidu',
    text: '百度',
    href: 'https://www.baidu.com/s?wd=',
  },
  {
    id: 'github',
    text: 'GitHub',
    href: 'https://github.com/search?q=',
  },
]

const { state, next, index } = useCycleList(presets)

const searchEngine = useStorage('searchEngine', index)

index.value = searchEngine.value

const icon = computed(() => {
  const path = './icons/' + state.value.id + '.vue'
  return defineAsyncComponent(() => import(path))
})

const keyword = ref('')

function onRequestSearch() {
  const url = encodeURI(state.value.href + keyword.value)
  window.open(url)
}
</script>

<template>
  <div
    class="active::border-gray-400/80 flex h-10 items-center overflow-hidden rounded-full border border-solid border-gray-400/20"
  >
    <div
      class="flex h-full w-10 items-center p-2.5 transition hover:bg-gray-400/30"
      @click="next()"
    >
      <Component :is="icon" />
    </div>

    <div class="flex-1 px-3">
      <input
        class="text-base"
        :placeholder="`使用 ${state.text} 搜索`"
        v-model="keyword"
        @keydown.enter="onRequestSearch"
        @keydown.prevent.tab="next()"
      />
    </div>

    <div
      class="flex h-full w-10 items-center p-2 transition hover:bg-gray-400/30"
      @click="onRequestSearch"
    >
      <i-carbon-search />
    </div>
  </div>
</template>
