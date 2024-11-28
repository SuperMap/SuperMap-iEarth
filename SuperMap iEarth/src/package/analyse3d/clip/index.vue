<template>
  <div class="clip-box">
    <n-tabs type="line" animated justify-content="space-between">
      <!-- box裁剪 -->
      <n-tab-pane name="boxclip" :tab="$t('boxClip')">
        <SmClipBox></SmClipBox>
      </n-tab-pane>
      <!-- 平面裁剪 -->
      <n-tab-pane name="planeclip" :tab="$t('planeClip')">
        <SmClipPlane></SmClipPlane>
      </n-tab-pane>
      <!-- Cross裁剪 -->
      <n-tab-pane name="crossclip" :tab="$t('crossClip')">
        <SmClipCross></SmClipCross>
      </n-tab-pane>
      <!-- 多边形裁剪 -->
      <n-tab-pane name="polygonclip" :tab="$t('polygonClip')">
        <SmClipPolygon></SmClipPolygon>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import SmClipBox from "./clip-box/index";
import SmClipCross from "./clip-cross/index";
import SmClipPlane from "./clip-plane/index";
import SmClipPolygon from "./clip-polygon/index";
</script>

<style lang="scss" scoped>
.clip-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 0.12rem;

  :deep(.n-tabs-tab-wrapper) {
    margin-right: 0.05rem;
  }
}
</style>
