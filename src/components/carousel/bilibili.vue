<script lang="ts">
export type MockDataOptions = (typeof MockData)[0]

export const MockData = [
  {
    img: 'https://i0.hdslb.com/bfs/banner/c04dd3180334343304391d6e150ba1a072897584.jpg@976w_550h_1c.webp',
    href: 'https://www.bilibili.com/blackboard/campus-singer.html?spm_id_from=333.1007.0.0#/stage2',
    mask: '#545B82',
    text: '寻找校园好声音，投稿瓜分十万奖金！',
  },
  {
    img: 'https://i0.hdslb.com/bfs/banner/7ead4b49f94804cc5d60c1278a721aa0377c8571.jpg@976w_550h_1c.webp',
    href: 'https://www.bilibili.com/blackboard/activity-ndCZvD8FHU.html?spm_id_from=333.1007.0.0',
    mask: '#3F5959',
    text: '青年汽车视频大赛，下一个汽车明星就是你',
  },
  {
    img: 'https://i0.hdslb.com/bfs/banner/e962cfec3d6178806eebfb135b2010545a59967f.png@976w_550h_1c.webp',
    href: 'https://www.bilibili.com/blackboard/2022MuseumDay_W.html?spm_id_from=333.1007.0.0',
    mask: '#4A4B3D',
    text: '来，感受人类世界的奇妙和魅力',
  },
  {
    img: 'https://i0.hdslb.com/bfs/banner/fe735537e4af12efcc0dff0e777d617ee7011965.jpg@976w_550h_1c.webp',
    href: 'https://www.bilibili.com/blackboard/live/activity-PBcUEk1f49.html?spm_id_from=333.1007.0.0',
    mask: '#50A4AD',
    text: '开播赢取10万现金红包',
  },
  {
    img: 'https://i0.hdslb.com/bfs/banner/21649d64be0cbbf9fabc3780c10fafadcc0f2769.png@976w_550h_1c.webp',
    href: 'https://www.bilibili.com/blackboard/activity-wclaD2nkse.html?spm_id_from=333.1007.0.0',
    mask: '#160802',
    text: '翻开百年相册，感受历久弥新的青春热血',
  },
]
</script>

<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core'

type Direction = -1 | 0 | 1 // left | none | right

interface Props {
  mainIndex?: number
  interval?: number
  duration?: number
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mainIndex: 1,
  interval: 3500,
  duration: 300,
  autoplay: true,
})

const loading = ref(false)
const items = ref<MockDataOptions[]>([])
const remoteItems = ref<MockDataOptions[]>([])
const activeIndex = ref(0)
const count = computed(() => remoteItems.value.length)

const slideDirection = ref<Direction>(0)
const slideAnimation = ref<Record<string, string | number>>({})

const slideMaskStyle = computed(() => {
  if (remoteItems.value[activeIndex.value]) {
    return {
      'mask-image': 'linear-gradient(0,#2f3238 11%,transparent 20%)',
      'background-color': remoteItems.value[activeIndex.value]['mask'],
    }
  }
})

watch(activeIndex, index => {
  const { mainIndex } = props
  items.value[mainIndex] = remoteItems.value[index]
  if (slideDirection.value === -1) {
    items.value[mainIndex + 1] = remoteItems.value[index]
  } else if (slideDirection.value === 1) {
    items.value[mainIndex - 1] = remoteItems.value[index]
  }
})

watchEffect(() => {
  let transform = ''
  let transition = `transform ${props.duration / 1000}s`
  if (slideDirection.value === 0) {
    transform = `translateX(-${100 / (1 + count.value)}%)`
    transition = ''
  } else if (slideDirection.value === -1) {
    transform = `translateX(-${200 / (1 + count.value)}%)`
  } else if (slideDirection.value === 1) {
    transform = `translateX(0)`
  } else {
    let shouldNotGoThere: never = slideDirection.value
  }
  slideAnimation.value = {
    transform,
    transition,
  }
})

const { resume, pause } = useIntervalFn(() => next(), props.interval, {
  immediate: false,
})

const prev = () => toggle(activeIndex.value - 1, 1)
const next = () => toggle(activeIndex.value + 1, -1)
const onSlideTransitionEnd = () => {
  items.value[props.mainIndex] = remoteItems.value[activeIndex.value]
  slideDirection.value = 0
}

doRequest()

function doRequest() {
  if (loading.value) {
    return
  }
  loading.value = true
  const delay = Math.random() * 1500 + 300
  setTimeout(() => {
    remoteItems.value = MockData
    items.value = [MockData[MockData.length - 1], ...MockData]
    loading.value = false
    props.autoplay && resume()
  }, delay)
}

function toggle(index: number, dir: Direction = 0) {
  if (loading.value) {
    return
  }
  if (index >= count.value) {
    index = 0
  } else if (index < 0) {
    index = count.value - 1
  }
  slideDirection.value = dir
  activeIndex.value = index
}
</script>

<template>
  <div class="m-2">
    模仿<a
      href="https://www.bilibili.com"
      target="_blank"
      class="mx-1 underline underline-offset-2 hover:text-blue-500"
      >B站首页</a
    >轮播图
  </div>

  <div
    v-if="!loading"
    class="relative flex h-[360px] w-[488px] flex-col overflow-hidden rounded-md"
    @mouseenter="autoplay && pause()"
    @mouseleave="autoplay && resume()"
  >
    <div
      class="relative flex flex-shrink-0"
      @transitionend="onSlideTransitionEnd"
      :style="{
        ...slideAnimation,
        width: (count + 1) * 100 + '%',
      }"
    >
      <template
        v-for="(item, _) in items"
        :key="_"
      >
        <a
          :href="item.href"
          targe="_blank"
          rel="noreferrer"
        >
          <img
            :src="item.img"
            :alt="item.text"
            class="h-full w-[488px]"
            referrerpolicy="no-referrer"
          />
        </a>
      </template>
    </div>

    <div class="relative flex-grow">
      <div
        class="absolute bottom-0 left-0 right-0 h-[780px]"
        :style="slideMaskStyle"
      ></div>

      <div class="relative z-10">
        <a
          href="#"
          target="_blank"
          class="absolute left-3 top-3 text-lg text-white no-underline"
        >
          {{ remoteItems[activeIndex]['text'] ?? '#' }}
        </a>
        <div
          class="absolute left-3 top-11 flex items-center space-x-2 text-white"
        >
          <button
            v-for="i in count"
            class="relative inline-block h-2 w-2 overflow-hidden rounded-full bg-white/40 transition"
            :class="activeIndex === i - 1 && 'h-3.5 w-3.5 bg-white/90'"
            @click="toggle(i - 1)"
          ></button>
        </div>
        <div class="absolute bottom-0 right-4 top-4 space-x-2 text-white">
          <button
            @click="prev()"
            class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.1)] text-white transition hover:bg-[rgba(255,255,255,0.2)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2rem"
              height="2rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.42Z"
              />
            </svg>
          </button>
          <button
            @click="next()"
            class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.1)] text-white transition hover:bg-[rgba(255,255,255,0.2)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2rem"
              height="2rem"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <a
        :href="remoteItems[activeIndex]['href'] ?? '#'"
        target="_blank"
        rel="noreferrer"
        class="absolute top-0 left-0 right-0 h-[270px]"
      ></a>
    </div>
  </div>
</template>
