<template>
  <div class="clip-box">
    <n-tabs type="line" animated :on-update:value="tabsChange" justify-content="space-between">
      <!-- box裁剪 -->
      <n-tab-pane name="boxclip" :tab="$t('global.boxClip')">
        <SmClipBox></SmClipBox>
      </n-tab-pane>
      <!-- 平面裁剪 -->
      <n-tab-pane name="planeclip" :tab="$t('global.planeClip')">
        <SmClipPlane></SmClipPlane>
      </n-tab-pane>
      <!-- Cross裁剪 -->
      <n-tab-pane name="crossclip" :tab="$t('global.crossClip')">
        <SmClipCross></SmClipCross>
      </n-tab-pane>
      <!-- 多边形裁剪 -->
      <n-tab-pane name="polygonclip" :tab="$t('global.polygonClip')">
        <SmClipPolygon></SmClipPolygon>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { usePanelStore } from "@/store/index";
import SmClipBox from "./clip-box/index";
import SmClipCross from "./clip-cross/index";
import SmClipPlane from "./clip-plane/index";
import SmClipPolygon from "./clip-polygon/index";

const panelStore = usePanelStore();
function tabsChange(value) {
  // panelBgName.value = value;
  // panelStore.setAnalyse3dPanel(value);
}

// 关闭弹窗
function panelCloseHandle() {}
</script>

<style lang="scss" scoped>
.clip-box {
  width: 100%;
  height: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
</style>
