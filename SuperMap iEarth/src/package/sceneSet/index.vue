<template>
  <div class="scene-set-box">
    <n-tabs type="line" animated :on-update:value="tabsChange">
      <!-- 场景属性 -->
      <n-tab-pane name="publicService" tab="场景属性">
        <SmSceneAttribute></SmSceneAttribute>
      </n-tab-pane>
      <!-- 飞行 -->
      <n-tab-pane name="customService" tab="飞行">
        <SmFlyRoute></SmFlyRoute>
      </n-tab-pane>
      <!-- 灯光 -->
      <n-tab-pane name="onlineBaseMap" tab="灯光">
        <SmSceneLight></SmSceneLight>
      </n-tab-pane>
      <!-- 视口 -->
      <n-tab-pane name="onlineTerrain" tab="视口">
        <SmSceneViewPort></SmSceneViewPort>
      </n-tab-pane>
      <!-- 特效 -->
      <n-tab-pane name="SmSceneSpecialEffect" tab="特效">
        <SmSceneSpecialEffect></SmSceneSpecialEffect>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
// import { usePanelStore } from "@/store/index";
import SmSceneAttribute from "./scene-attribute/index";
import SmFlyRoute from "./fly-route/index";
import SmSceneLight from "./scene-light/index";
import SmSceneViewPort from "./scene-viewPort/index";
import SmSceneSpecialEffect from "./scene-specialEffect/index";

// const panelStore = usePanelStore();
function tabsChange() {}

// 关闭弹窗
// function panelCloseHandle() {}
</script>

<style lang="scss" scoped>
.scene-set-box {
  width: 100%;
  height: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
</style>
