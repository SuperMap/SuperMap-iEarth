<template>
  <n-tabs type="line" animated :on-update:value="tabsChange">
    <n-tab-pane name="Terrain-operation" :tab="$t('global.terrainOperation')">
      <sm-terrain-operation></sm-terrain-operation>
    </n-tab-pane>
    <n-tab-pane
      name="Inundation-analysis"
      :tab="$t('global.inundationAnalysis')"
    >
      <sm-terrain-inundation></sm-terrain-inundation>
    </n-tab-pane>
    <n-tab-pane name="Slope-aspect" :tab="$t('global.slopeAspect')">
      <sm-terrain-slope></sm-terrain-slope>
    </n-tab-pane>
    <n-tab-pane name="Isoline" :tab="$t('global.Isoline')">
      <sm-terrain-isoline></sm-terrain-isoline>
    </n-tab-pane>
  </n-tabs>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useChangePanelStore } from "@/store/changePanelbg/index";

const changePanelStore = useChangePanelStore();

function tabsChange(value) {
  changePanelStore.setAnalyserPanel(value);
}

// function update(value: string | number) {
//   changePanelStore.setAnalyserPanel(value);
// }
</script>