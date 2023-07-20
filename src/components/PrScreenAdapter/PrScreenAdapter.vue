<!-- 屏幕适配组件 参数fixedWidth设计稿宽度 fixedHeight设计稿高度-->
<template>
  <div ref="screenAdapterRef" class="screen-adapter" :style="[StyleScreenAdapter]">
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
import { ref, computed, onMounted, watch } from 'vue'
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
  // 最大宽高比 在基数内自动校准宽度 以达到充满两边
  maxAspectRatio: {
    type: [Number],
    default: () => 4
  },
  // 模式 纵横比缩放
  // none 关闭时会开启滚动条
  // aspectFit 宽度高度自适应缩放到完整显示
  // widthFix 宽度铺满，高度自动变化
  // heightFix 高度铺满，宽度自动变化
  mode: {
    type: [String],
    default: () => 'aspectFit'
  },
  // 背景
  bg: {
    type: [String],
    default: () => 'rgba(5, 21, 39, 0.9)'
  },
  // 布局同步 （当外层修改 width height mode 时 会重新加载内部布局和缩放）
  layoutSync: {
    type: [Boolean],
    default: () => false
  }
})

const screenAdapterRef: Ref = ref()

// 要用到的一些参数
const options = ref({
  width: 0, // 真实宽度
  height: 0, // 真实高度
  innerWidth: 0, // 当前屏幕宽度
  innerHeight: 0, // 当前屏幕高度
  scale: 1 // 缩放
})

// 初始化屏幕参数
const initOptions = () => {
  let dom = screenAdapterRef.value
  const innerWidth = dom.innerWidth || dom.clientWidth
  const innerHeight = dom.innerHeight || dom.clientHeight
  let { width, height, maxAspectRatio, mode } = props
  // 计算缩放值
  let scale = 1
  switch (mode) {
    // 宽高自适应
    case 'aspectFit': {
      const ratio = width / height // 真实缩放比例
      const _ratio = Math.min(innerWidth / innerHeight, maxAspectRatio) // 计算自适应最佳缩放比例
      // 校准宽度
      if (ratio < _ratio) {
        width = (width / ratio) * _ratio
      }
      // 计算缩放值
      const scaleX = innerWidth / width
      const scaleY = innerHeight / height
      // 根据屏幕宽高 取最小缩放比例
      scale = Math.min(scaleX, scaleY)
      break
    }
    // 宽度不变 高度自适应
    case 'widthFix': {
      // 计算缩放值
      scale = innerWidth / width
      break
    }
    // 高度不变 宽度自适应
    case 'heightFix': {
      // 计算缩放值
      scale = innerHeight / height
      break
    }
  }

  options.value = { ...options.value, width, height, innerWidth, innerHeight, scale }
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

// 容器样式
const StyleScreenAdapter = computed(() => {
  const { bg, mode } = props
  let style: any = { 'background-color': bg }
  switch (mode) {
    case 'none':
      style['overflow'] = 'auto'
      break
    case 'widthFix':
      style['overflow-y'] = 'auto'
      break
    case 'heightFix':
      style['overflow-x'] = 'auto'
      break
  }
  return style
})

// 外部容器样式
const StyleScreenAdapterOuter = computed(() => {
  const { width, innerWidth, height, innerHeight, scale } = options.value
  // 计算距离上边距离
  let offsetY = (innerHeight - height * scale) * 0.5
  offsetY = Math.max(0, offsetY)
  // 计算距离左边距离
  let offsetX = (innerWidth - width * scale) * 0.5
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
  const { width, height, scale } = options.value
  let style = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `scale(${scale})`
  }
  return style
})

if (props.layoutSync) {
  watch(
    () => `${props.width}-${props.height}-${props.mode}`,
    () => {
      initOptions()
    }
  )
}
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
</style>
