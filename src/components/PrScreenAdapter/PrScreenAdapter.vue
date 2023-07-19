<!-- 屏幕适配组件 参数fixedWidth设计稿宽度 fixedHeight设计稿高度-->
<template>
  <div ref="screenAdapterRef" class="screen-adapter" :class="[{ 'overflow-scroll': scrollView }]" :style="[{ 'background-color': bg }]">
    <div class="screen-adapter-outer" :style="[StyleScreenAdapterOuter]">
      <div class="screen-adapter-inner" :style="[StyleScreenAdapterInner]">
        <div class="screen-adapter-inner-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'

const props = defineProps({
  // 期望宽度
  width: {
    type: [Number],
    default: () => 5760
  },
  // 期望高度
  height: {
    type: [Number],
    default: () => 1620
  },
  // 自动校准比例
  autoRatio: {
    type: [Boolean],
    default: () => true
  },
  // 最大宽高比 在基数内自动校准宽度 以达到充满两边
  maxAspectRatio: {
    type: [Number],
    default: () => 4
  },
  // 滚动容器 默认关闭 开启时不缩放 但是可以左右滚动
  scrollView: {
    type: [Boolean],
    default: () => false
  },
  // 背景
  bg: {
    type: [String],
    default: () => 'rgba(5, 21, 39, 0.9)'
  }
})

const screenAdapterRef: Ref = ref()

// 要用到的一些参数
const options = ref({
  width: 0, // 真实宽度
  height: 0, // 真实高度
  innerWidth: 0, // 当前屏幕宽度
  innerHeight: 0 // 当前屏幕高度
})

// 初始化屏幕参数
const initOptions = () => {
  let dom = screenAdapterRef.value
  const innerWidth = dom.innerWidth || dom.clientWidth
  const innerHeight = dom.innerHeight || dom.clientHeight
  let { width, height, maxAspectRatio, autoRatio } = props
  const ratio = width / height
  let _ratio = innerWidth / innerHeight
  _ratio = Math.min(_ratio, maxAspectRatio)
  // 适配宽度
  if (autoRatio && ratio < _ratio) {
    width = (width / ratio) * _ratio
  }
  options.value = { ...options.value, width, height, innerWidth, innerHeight }
  // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:options.value`, options.value)
}

// 创建dom监听
const createObserver = () => {
  let observer = new ResizeObserver(initOptions)
  observer.observe(screenAdapterRef.value, { box: 'border-box' })
}
onMounted(() => {
  createObserver()
})

// 计算缩放
const Scale = computed(() => {
  const { width, innerWidth, height, innerHeight } = options.value
  if (!innerWidth) return 1
  const scaleX = innerWidth / width
  const scaleY = innerHeight / height
  // 根据屏幕宽高 取最小缩放比例
  let scale = Math.min(scaleX, scaleY)
  return props.scrollView ? 1 : scale
})

// 外部容器样式
const StyleScreenAdapterOuter = computed(() => {
  const { width, innerWidth, height, innerHeight } = options.value
  // 计算距离上边距离
  let offsetY = (innerHeight - height * Scale.value) * 0.5
  offsetY = Math.max(0, offsetY)
  // 计算距离左边距离
  let offsetX = (innerWidth - width * Scale.value) * 0.5
  offsetX = Math.max(0, offsetX)
  let style = {
    'padding-top': `${offsetY}px`,
    'padding-bottom': `${offsetY}px`,
    'padding-left': `${offsetX}px`,
    'padding-right': `${offsetX}px`
  }
  return style
})

// 内部容器样式
const StyleScreenAdapterInner = computed(() => {
  const { width, height } = options.value
  let style = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${Scale.value})`
  }
  return style
})
</script>

<style scoped>
.screen-adapter {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.screen-adapter-outer {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}
.screen-adapter-inner {
  height: 100%;
  transform-origin: 0 0;
}
.screen-adapter-inner-content {
  position: relative;
  height: 100%;
  transform-origin: center center;
  overflow: hidden;
}

.overflow-scroll {
  overflow: scroll;
}
</style>
