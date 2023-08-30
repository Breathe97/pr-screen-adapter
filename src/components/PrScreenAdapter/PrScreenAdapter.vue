<template>
  <div ref="screenAdapterRef" class="screen-adapter" :style="[StyleScreenAdapter]">
    <div class="screen-adapter-tips">
      <div class="screen-adapter-tips-quickZoom backdrop-filter" :class="[{ 'screen-adapter-tips-quickZoom-show': tipsQuickZoom }]">缩放 : {{ Math.floor(options.wheelScale * 100) }}%</div>
    </div>
    <div class="screen-adapter-outer" :style="[StyleScreenAdapterOuter]">
      <div class="screen-adapter-inner" :style="[StyleScreenAdapterInner]">
        <div class="screen-adapter-inner-content" :style="[StyleScreenAdapterInnerContent]" :class="{ 'will-change': quickZoom }">
          <div class="event-mask" :class="[{ 'event-mask-active': quickZoomActive }]"></div>
          <div class="screen-adapter-content-view" :style="[StyleScreenAdapterContentView]">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import type { Ref, PropType } from 'vue'

const emit = defineEmits(['change'])

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
  // 最大宽高比 在当前比值内自动校准宽度 以达到充满两边适配宽屏
  maxAspectRatio: {
    type: [Number],
    default: () => 4
  },
  // 模式 纵横比缩放
  // none 关闭时会开启滚动条 (一般本地开发可能会用到，比如台式、笔记本不能缩放页面时)
  // aspectFit 全屏适应，宽度高度自适应缩放到完整显示
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
  },
  // 快捷缩放 功能键 + 鼠标滚轮
  quickZoom: {
    type: [Boolean],
    default: () => false
  },
  // 快捷键
  quickKey: {
    type: String as PropType<'Shift' | 'Alt'>,
    default: () => 'Alt'
  },
  // 鼠标滚轮事件 默认关闭 在触发快捷功能时会强行关闭
  mouseEvent: {
    type: [Boolean],
    default: () => false
  }
})

const screenAdapterRef: Ref = ref()

const tipsQuickZoom = ref(false)
const quickZoomActive = ref(false)

// 要用到的一些参数
const options = ref({
  width: 0, // 真实宽度
  height: 0, // 真实高度
  innerWidth: 0, // 当前屏幕宽度
  innerHeight: 0, // 当前屏幕高度
  scale: 1, // 缩放
  scaleX: 1, // 缩放
  scaleY: 1, // 缩放
  wheelScale: 1, // 鼠标缩放
  mouseClientX: 0, // 快捷缩放时 鼠标的位置
  mouseClientY: 0 // 快捷缩放时 鼠标的位置
})

// 初始化屏幕参数
const initOptions = () => {
  let dom = screenAdapterRef.value
  const innerWidth = dom.innerWidth || dom.clientWidth
  const innerHeight = dom.innerHeight || dom.clientHeight
  let { width, height, maxAspectRatio, mode } = props
  // 计算缩放值
  let scale = 1
  let scaleX = innerWidth / width
  let scaleY = innerHeight / height
  switch (mode) {
    // 宽高自适应
    case 'aspectFit': {
      const ratio = width / height // 正常渲染时真实缩放比例
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
  options.value = { ...options.value, width, height, innerWidth, innerHeight, scale, scaleX, scaleY }
  emit('change', options.value)
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:options.value`, options.value)
}

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

// 内部容器样式
const StyleScreenAdapterInnerContent = computed(() => {
  const { wheelScale, mouseClientX, mouseClientY } = options.value
  let style = {}
  style = {
    transform: `scale(${wheelScale})`,
    'transform-origin': `${mouseClientX}px ${mouseClientY}px`
  }
  // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:style`, style)
  return style
})

// 真实容器样式
const StyleScreenAdapterContentView = computed(() => {
  const { width, height } = options.value
  let style = {
    width: `${width}px`,
    height: `${height}px`
  }
  return style
})

let observer: ResizeObserver
let timer: any = 0
onMounted(() => {
  // 实时校准布局 额外添加监听器
  if (props.layoutSync) {
    watch(
      () => `${props.width}-${props.height}-${props.mode}-${props.maxAspectRatio}`,
      () => {
        initOptions()
      }
    )
    // 创建dom监听
    const createObserver = () => {
      observer = new ResizeObserver(initOptions)
      observer.observe(screenAdapterRef.value, { box: 'border-box' })
    }
    createObserver()
  } else {
    initOptions() // 仅第一次初始化
  }
  // 注册鼠标快捷缩放事件
  if (props.quickZoom) {
    const mousemove = (e: any) => {
      let isActive = e.getModifierState(props.quickKey)
      // 按下Shift才生效
      if (isActive) {
        // 获取当前鼠标在浏览器的位置
        const { clientX, clientY } = e
        let info = screenAdapterRef.value.getBoundingClientRect()
        // 获取当前容器的位置
        const { x, y } = info
        let mouseClientX = (clientX - x) / options.value.scaleX
        let mouseClientY = (clientY - y) / options.value.scaleY
        options.value.mouseClientX = mouseClientX
        options.value.mouseClientY = mouseClientY
      }
      quickZoomActive.value = isActive
    }
    screenAdapterRef.value.onmousemove = mousemove

    const mousewheel = (e: any) => {
      // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:`, e)
      // 按下功能键才生效
      const isActive = e.getModifierState(props.quickKey)
      if (props.mouseEvent === false || isActive) {
        e.preventDefault()
      }
      if (isActive) {
        tipsQuickZoom.value = true
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          tipsQuickZoom.value = false
        }, 1000)
        let wheelScale = options.value.wheelScale + (e.wheelDeltaY > 0 ? 0.1 : -0.1)
        wheelScale = Number(wheelScale.toFixed(1))
        if (wheelScale < 1) {
          wheelScale = 1
        }
        if (wheelScale > 4) {
          wheelScale = 4
        }
        options.value.wheelScale = wheelScale
        emit('change', options.value)
      }
    }
    screenAdapterRef.value.addEventListener('mousewheel', mousewheel, { useCapture: true })
  }
})

onBeforeUnmount(() => {
  observer.disconnect()
})
</script>

<style scoped>
.screen-adapter {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: background 500ms ease-out;
}
.screen-adapter-outer {
  position: relative;
  height: 100%;
  box-sizing: border-box;
}
.screen-adapter-inner {
  position: relative;
  height: 100%;
  transform-origin: 0 0;
}
.screen-adapter-inner-content {
  position: relative;
  height: 100%;
  transform-origin: center center;
  overflow: hidden;
  transition: all 500ms ease-out;
}
.event-mask {
  position: absolute;
  left: 0;
  height: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: rgba(0, 151, 255, 0.7);
  opacity: 0;
  z-index: 2;
}
.event-mask-active {
  pointer-events: all;
  /* opacity: 1; */
}

.will-change {
  will-change: transform;
}
.screen-adapter-content-view {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.screen-adapter-tips {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.backdrop-filter {
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}
.screen-adapter-tips-quickZoom {
  width: 180px;
  height: 60px;
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  line-height: 1;
  transition: all 230ms ease-out;
}
.screen-adapter-tips-quickZoom-show {
  opacity: 1;
}
</style>
