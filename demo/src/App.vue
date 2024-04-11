<script setup lang="ts">
// import { PrScreenAdapter } from '../../dist/index.js'
// import { PrScreenAdapter } from 'pr-screen-adapter'
import ContentContainer from './components/ContentContainer/ContentContainer.vue'
</script>

<template>
  <div id="app" style="position: relative; width: 100vw; height: 100vh">
    <PrScreenAdapter :width="3840" :height="1080" :layoutSync="true" :maxAspectRatio="3.6" :quickZoom="true" bg="#2f3030">
      <ContentContainer>
        <template #left>
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px">自定义左侧区域</div>
        </template>
        <template #center>
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px">按住ALT+鼠标滚轮实现缩放查看</div>
        </template>
        <template #right>
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; font-size: 42px">自定义左侧区域</div>
        </template>
      </ContentContainer>
    </PrScreenAdapter>
  </div>
</template>

<style scoped>

</style>
