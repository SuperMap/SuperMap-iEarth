<template>
  <div class="terrain-box">
    <n-tabs type="line" animated :on-update:value="tabsChange">
      <!-- 地形操作 -->
      <n-tab-pane name="operation" :tab="$t('global.terrainOperation')">
        <SmTerrainOperation></SmTerrainOperation>
        <!-- <sm-layer-service></sm-layer-service> -->
      </n-tab-pane>
      <!-- 淹没分析 -->
      <n-tab-pane name="inundation" :tab="$t('global.inundationAnalysis')">
        <SmTerrainInundation></SmTerrainInundation>
      </n-tab-pane>
      <!-- 坡度坡向 -->
      <n-tab-pane name="slope"  :tab="$t('global.slopeAspect')">
        <SmTerrainSlope></SmTerrainSlope>
      </n-tab-pane>
      <!-- 等值线 -->
      <n-tab-pane name="isoline"  :tab="$t('global.Isoline')">
        <SmTerrainIsoline></SmTerrainIsoline>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { usePanelStore } from "@/store/index";
import SmTerrainInundation from "./terrain-inundation/index";
import SmTerrainIsoline from "./terrain-isoline/index";
import SmTerrainOperation from "./terrain-operation/index";
import SmTerrainSlope from "./terrain-slope/index";

const panelStore = usePanelStore();
function tabsChange(value) {
  // panelBgName.value = value;
  // panelStore.setAnalyse3dPanel(value);
}

// 关闭弹窗
function panelCloseHandle() {}
</script>

<style lang="scss" scoped>
.terrain-box {
  width: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
</style>
