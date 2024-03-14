<template>
  <div class="terrain-box">
    <n-tabs type="line" animated justify-content="left">
      <!-- 地形操作 -->
      <n-tab-pane name="operation" :tab="$t('terrainOperation')">
        <SmTerrainOperation></SmTerrainOperation>
      </n-tab-pane>
      <!-- 淹没分析 -->
      <n-tab-pane name="inundation" :tab="$t('inundationAnalysis')">
        <SmTerrainInundation></SmTerrainInundation>
      </n-tab-pane>
      <!-- 坡度坡向 -->
      <n-tab-pane name="slope" :tab="$t('slopeAspect')">
        <SmTerrainSlope></SmTerrainSlope>
      </n-tab-pane>
      <!-- 等值线 -->
      <n-tab-pane name="isoline" :tab="$t('Isoline')">
        <SmTerrainIsoline></SmTerrainIsoline>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import SmTerrainInundation from "./terrain-inundation/index";
import SmTerrainIsoline from "./terrain-isoline/index";
import SmTerrainOperation from "./terrain-operation/index";
import SmTerrainSlope from "./terrain-slope/index";
</script>

<style lang="scss" scoped>
.terrain-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: 0 0.01rem;
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
