<!-- 屏幕适配组件 参数fixedWidth设计稿宽度 fixedHeight设计稿高度-->
<template>
  <div class="screen-adapter" :class="[{ 'overflow-hide': overflowHidden }]">
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
import { ref, computed } from 'vue'

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
  // 最大宽高比 在基数内自动校准宽度 以达到充满两边
  maxAspectRatio: {
    type: [Number],
    default: () => 4
  },
  // 超出隐藏 默认开启 关闭时不缩放 但是可以左右滚动
  overflowHidden: {
    type: [Boolean],
    default: () => true
  }
})

// 要用到的一些参数
const options = ref({
  width: 0, // 真实宽度
  height: 0, // 真实高度
  clientWidth: 0, // 当前屏幕宽度
  clientHeight: 0 // 当前屏幕高度
})

// 初始化屏幕参数
const initOptions = () => {
  const { clientWidth, clientHeight } = document.documentElement
  let { width, height, maxAspectRatio } = props
  const ratio = width / height
  let _ratio = clientWidth / clientHeight
  _ratio = Math.min(_ratio, maxAspectRatio)
  // 适配宽度
  if (ratio < _ratio) {
    width = (width / ratio) * _ratio
  }
  options.value = { ...options.value, width, height, clientWidth, clientHeight }

  // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:options.value`, options.value)
}
initOptions()
window.addEventListener('resize', initOptions) // 监听外层宽高

// 截取数字
const fixedMunber = (num: number) => {
  const fixedNum = 100000
  return parseInt(`${num * fixedNum}`) / fixedNum
}

// 计算缩放
const Scale = computed(() => {
  const { width, clientWidth, height, clientHeight } = options.value
  if (!clientWidth) return 1
  const scaleX = clientWidth / width
  const scaleY = clientHeight / height
  // 根据屏幕宽高 取最小缩放比例
  let scale = Math.min(scaleX, scaleY)
  return props.overflowHidden ? scale : 1
})

// 外部容器样式
const StyleScreenAdapterOuter = computed(() => {
  const { width, clientWidth, height, clientHeight } = options.value
  // 计算距离上边距离
  let top = (clientHeight - height * Scale.value) * 0.5
  top = Math.max(0, top)
  // 计算距离左边距离
  let left = (clientWidth - width * Scale.value) * 0.5
  left = Math.max(0, left)
  let style = {
    'padding-top': `${top}px`,
    'padding-left': `${left}px`
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
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgba(5, 21, 39, 0.9);
}
.screen-adapter-outer {
  position: relative;
  height: 100%;
}
.screen-adapter-inner {
  height: 100%;
  transform-origin: 0 0;
}
.screen-adapter-inner-content {
  position: relative;
  height: 100%;
  transform-origin: center center;
}

.overflow-hide {
  overflow: hidden;
}
</style>
