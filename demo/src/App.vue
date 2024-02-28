<script setup lang="ts">
// import { PrScreenAdapter } from '../../dist/index.js'
// import { PrScreenAdapter } from 'pr-screen-adapter'
import contentContainer from './components/contentContainer/ContentContainer.vue'
</script>

<template>
  <div id="app" style="position: relative; width: 100vw; height: 100vh">
    <PrScreenAdapter :width="3840" :height="1080" :layoutSync="true" :maxAspectRatio="3.6" :quickZoom="true" bg="#2f3030">
      <contentContainer>
        <template #left>
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px">自定义左侧区域</div>
        </template>
        <template #center>
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px">按住ALT+鼠标滚轮实现缩放查看</div>
        </template>
        <template #right>
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px">自定义左侧区域</div>
        </template>
      </contentContainer>
    </PrScreenAdapter>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
