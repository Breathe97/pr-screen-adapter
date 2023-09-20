<script setup lang="ts">
// import { PrScreenAdapter } from '../core/dist/index.js'
import { PrScreenAdapter } from 'pr-screen-adapter'
</script>

<template>
  <div id="app" style="position: relative; width: 100vw; height: 100vh">
    <PrScreenAdapter :width="3840" :height="2160" :layoutSync="true" :maxAspectRatio="3.6" :quickZoom="true" bg="#2f3030">
      <div style="position: relative; height: 100%; width: 100%; background-color: #16294d; display: flex; align-items: center; justify-content: center; font-size: 42px">自定义内容</div>
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
