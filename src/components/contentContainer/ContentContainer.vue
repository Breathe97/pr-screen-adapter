<template>
  <div v-if="visiable" class="content-container">
    <!-- 中间 -->
    <div class="content-container-center" :style="{ width: `calc( 100% - ${Number(containerWidth) * 2 + 96}px)` }">
      <div class="content-container-center-border-bg" :style="[{ 'background-image': `url(${centerBg || ''})` }]"></div>
      <slot v-if="doms_visiable[1]" name="center"></slot>
    </div>
    <!-- 左侧 -->
    <div v-if="!isBg" class="content-sideView content-container-left" :style="[StyleContainerWidth]">
      <div class="content-sideView-box">
        <slot v-if="doms_visiable[0]" name="left"></slot>
      </div>
    </div>
    <!-- 右侧 -->
    <div v-if="!isBg" class="content-sideView content-container-right" :style="[StyleContainerWidth]">
      <div class="content-sideView-box">
        <slot v-if="doms_visiable[2]" name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, computed } from 'vue'

const emit = defineEmits(['changeScenario', 'render-end'])

const props = defineProps({
  // 左右容器宽度 2340
  containerWidth: {
    type: [Number, String],
    default: 1170,
  },
  // 开启背景模式 登录页用
  isBg: {
    type: [Boolean],
    default: false,
  },
  // 背景
  bg: {
    type: [Boolean],
    default: false,
  },
  // 中间背景
  centerBg: {
    type: [Boolean],
    default: false,
  },
})

// 两侧宽度
const StyleContainerWidth = computed(() => {
  return { width: `${props['containerWidth']}px` }
})

const doms_visiable = ref([false, false, false])
const visiable = ref(false)
const init = async () => {
  visiable.value = false
  await nextTick()
  await new Promise((a) => setTimeout(() => a(true), 300))
  visiable.value = true
  await nextTick()
  await new Promise((a) => setTimeout(() => a(true), 300))
  doms_visiable.value[0] = true
  await nextTick()
  await new Promise((a) => setTimeout(() => a(true), 300))
  doms_visiable.value[1] = true
  await nextTick()
  await new Promise((a) => setTimeout(() => a(true), 300))
  doms_visiable.value[2] = true
  await new Promise((a) => setTimeout(() => a(true), 300))
  emit('render-end')
}
init()
</script>
<style lang="scss" scoped>
// 首页 大体布局
.content-container {
  width: 100%;
  height: 100%;
  // 侧边栏
  .content-sideView {
    position: absolute;
    width: 585px;
    height: 100%;
    pointer-events: all;
    padding: 30px 0;
    box-sizing: border-box;
    z-index: auto;
    .content-sideView-box {
      position: relative;
      height: 100%;
      width: 100%;
    }
    .right-menus {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateX(-50px);
      pointer-events: all;
    }
    // 侧边栏列表
    .content-sideView-list {
      position: absolute;
      top: 30px;
      right: 0;
      box-sizing: border-box;
      width: 0;
      height: calc(100% - 60px);
      .list-card {
        position: absolute;
        padding: 15px;
        box-sizing: border-box;
        width: 450px;
        z-index: 9;
        background-color: rgba(9, 37, 71, 0.8);
        box-shadow: inset 0 0 1px 1px #31a8ff;
        border: 1px solid #31a8ff;
        border-radius: 20px;
        // filter: grayscale(0.3);
        .list-content {
          height: calc(100% - 52px);
        }
      }

      .list-top {
        top: 0;
        min-height: calc(40% - 30px);
      }
      .list-bottom {
        bottom: 0;
        min-height: 60%;
        .list-bottom-details {
          position: absolute;
          padding: 10px 0;
          bottom: 0;
          width: 1150px;
          box-sizing: border-box;
          border: 1px solid #31a8ff;
          background-color: rgba(10, 42, 74, 0.8);
          z-index: 9;
        }
        .list-bottom-details-left {
          right: -1170px;
        }
        .list-bottom-details-right {
          left: -1170px;
        }
      }
      .list-top + .list-bottom .list-bottom {
        margin-top: 15px;
      }
    }
    .content-sideView-list-left {
      right: -30px;
      .list-card {
        right: -470px;
      }
    }
    .content-sideView-list-right {
      left: -30px;
      .list-card {
        position: absolute;
        left: -470px;
      }
    }
  }
  .content-container-left {
    left: 48px;
    top: 0;
    &::after {
      content: '';
      position: absolute;
      left: -48px;
      bottom: -60px;
      width: calc(100% + 500px + 48px);
      height: calc(100% + 60px);
      background: linear-gradient(to right, rgba(5, 21, 39, 0.9) calc(100% - 548px), rgba(5, 21, 39, 0.88) calc(100% - 498px), rgba(5, 21, 39, 0));
      z-index: -1;
      pointer-events: none;
      transform: translateZ(-20px);
    }
    .list-top {
      right: 0;
    }
    .list-bottom {
      right: 0;
    }
  }
  .content-container-right {
    right: 48px;
    top: 0;
    &::after {
      content: '';
      position: absolute;
      right: -96px;
      bottom: -60px;
      width: calc(100% + 500px + 48px);
      height: calc(100% + 60px);
      background: linear-gradient(to left, rgba(5, 21, 39, 0.9) calc(100% - 548px), rgba(5, 21, 39, 0.88) calc(100% - 498px), rgba(5, 21, 39, 0));
      z-index: -1;
      pointer-events: none;
      transform: translateZ(-10px);
    }
    .list-top {
      left: 0;
    }
    .list-bottom {
      left: 0;
    }
  }
  .content-container-center {
    margin-top: 0;
    height: 100%;
    pointer-events: none;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    z-index: 0;
    .content-container-center-border-bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: calc(100% - 40px) calc(100% - 20px);
      background-position: 20px 0;
      filter: grayscale(0.3);
    }
  }
}
</style>
