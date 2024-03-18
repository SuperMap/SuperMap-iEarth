<template>
  <div class="object-pain-box">
    <!-- <n-tabs type="line" animated :on-update:value="tabsChange" justify-content="left"> -->
    <n-tabs type="line" animated justify-content="left">
      <!-- 绘制线 -->
      <n-tab-pane name="draw-line" :tab="$t('drawLine')">
        <SmDrawLine></SmDrawLine>
      </n-tab-pane>
      <!-- 绘制面 -->
      <n-tab-pane name="draw-surface" :tab="$t('drawPolygon')">
        <SmDrawSurface></SmDrawSurface>
      </n-tab-pane>
      <!-- 小品 -->
      <n-tab-pane name="draw-skit" :tab="$t('skit')">
        <SmDrawSkit></SmDrawSkit>
      </n-tab-pane>
      <!-- 几何体 -->
      <n-tab-pane name="draw-particle" :tab="$t('geometry')">
        <SmDrawGeomety></SmDrawGeomety>
      </n-tab-pane>
      <!-- 粒子 -->
      <n-tab-pane name="onlineTerrain" :tab="$t('particle')">
        <SmDrawParticle></SmDrawParticle>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import SmDrawLine from "./draw-line/index";
import SmDrawSurface from "./draw-surface/index";
import SmDrawParticle from "./draw-particle/index";
import SmDrawSkit from "./draw-skit/index";
import SmDrawGeomety from "./draw-geomety/index";

// function tabsChange(value) { }
</script>

<style lang="scss" scoped>
.object-pain-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: 0 0.05rem;
}

:deep(.n-tabs-tab-wrapper) {
  margin-right: 0.3rem;
}

:deep(.n-tabs-nav) {
  padding: 0 0.12rem;
}

:deep(.n-tab-pane) {
  box-sizing: border-box;
  padding-left: 0.12rem;
  padding-right: 0.12rem;
}
</style>
