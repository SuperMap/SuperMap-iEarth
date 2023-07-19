<template>
  <div class="object-pain-box">
    <n-tabs type="line" animated :on-update:value="tabsChange">
      <!-- 绘制线 -->
      <n-tab-pane name="draw-line" :tab="$t('global.drawLine')">
        <SmDrawLine></SmDrawLine>
      </n-tab-pane>
      <!-- 绘制面 -->
      <n-tab-pane name="draw-surface" :tab="$t('global.drawPolygon')">
        <SmDrawSurface></SmDrawSurface>
      </n-tab-pane>
      <!-- 小品 -->
      <n-tab-pane name="draw-skit" :tab="$t('global.skit')">
        <SmDrawSkit></SmDrawSkit>
      </n-tab-pane>
      <!-- 几何体 -->
      <n-tab-pane name="draw-particle" :tab="$t('global.geometry')">
        <SmDrawGeomety></SmDrawGeomety>
      </n-tab-pane>
      <!-- 粒子 -->
      <n-tab-pane name="onlineTerrain" :tab="$t('global.particle')">
        <SmDrawParticle></SmDrawParticle>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { usePanelStore } from "@/store/index";
import SmDrawLine from "./draw-line/index";
import SmDrawSurface from "./draw-surface/index";
import SmDrawParticle from "./draw-particle/index";
import SmDrawSkit from "./draw-skit/index";
import SmDrawGeomety from "./draw-geomety/index";

const panelStore = usePanelStore();
function tabsChange(value) {}

// 关闭弹窗
function panelCloseHandle() {}
</script>

<style lang="scss" scoped>
.object-pain-box {
  width: 100%;
  height: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
</style>
