<template>
  <div class="scene-set-box">
    <n-tabs type="line" animated :on-update:value="tabsChange" justify-content="left">
      <!-- 场景属性 -->
      <n-tab-pane name="publicService" :tab="$t('global.baseAttribute')" class="use-scroll">
        <SmSceneAttribute></SmSceneAttribute>
      </n-tab-pane>
      <!-- 飞行 -->
      <n-tab-pane name="customService" :tab="$t('global.flying')">
        <SmFlyRoute></SmFlyRoute>
      </n-tab-pane>
      <!-- 灯光 -->
      <n-tab-pane name="onlineBaseMap" :tab="$t('global.ligth')">
        <SmSceneLight></SmSceneLight>
      </n-tab-pane>
      <!-- 视口 -->
      <n-tab-pane name="onlineTerrain" :tab="$t('global.viewPorts')">
        <SmSceneViewPort></SmSceneViewPort>
      </n-tab-pane>
      <!-- 特效 -->
      <n-tab-pane name="SmSceneSpecialEffect" :tab="$t('global.speciallyEffect')">
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
  // padding: 0 0.12rem;
  box-sizing: border-box;
}
:deep(.n-tabs-tab-wrapper){
  margin-right:0.16rem;
}
  :deep(.n-tabs-nav){
    padding:0 0.12rem;
  };
  :deep(.n-tab-pane) {
    box-sizing: border-box;
    padding-left: 0.12rem;
    padding-right: 0.12rem;
  }
  .use-scroll{
    padding-right: 0px;
  }
</style>
