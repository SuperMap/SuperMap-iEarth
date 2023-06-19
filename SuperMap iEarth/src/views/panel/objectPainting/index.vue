<template>
  <!-- 对象绘制 -->
  <!-- <div class="panle-box" v-dialogDrag="true"> -->
  <div class="panle-box">
    <div class="panle-header">
      <span class="panle-title">对象绘制</span>
      <span class="zst1"></span>
      <span class="zst2"></span>
      <div class="panel-close" @click="panelCloseHandle">
        <svg-icon name="ui-close" class="close-btn" />
      </div>
    </div>
    <div class="panle-container">
      <n-tabs type="line" animated>
        <n-tab-pane name="drawSkit" :tab="$t('global.Skit')">
          <sm-draw-skit></sm-draw-skit>
        </n-tab-pane>
        <n-tab-pane name="drawLine" :tab="$t('global.Line')">
          <sm-draw-line></sm-draw-line>
        </n-tab-pane>
        <n-tab-pane name="drawPolygon" :tab="$t('global.Polygon')">
          <sm-draw-surface></sm-draw-surface>
        </n-tab-pane>
        <!-- <n-tab-pane name="drawParticle" :tab="$t('global.Particle')">
          <sm-draw-particle></sm-draw-particle>
        </n-tab-pane> -->
      </n-tabs>
    </div>
    <div class="panle-footer"></div>
  </div>
</template>


<script lang="ts" setup>
import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
const toolBarStore = toolBarStoreCreate();
// 关闭面板
function panelCloseHandle() {
  toolBarStore.setToolBarShow(5, false);
}
</script>

<style lang="scss" scoped>
.panle-box {
  @include rightTooHead();
}
</style>