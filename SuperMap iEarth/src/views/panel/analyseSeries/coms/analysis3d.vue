<template>
  <n-tabs type="line" animated @update:value="update">
    <n-tab-pane name="intervisibility" :tab="$t('global.Intervisibility')">
      <sm-analyse-sightLine></sm-analyse-sightLine>
    </n-tab-pane>
    <n-tab-pane name="viewableRange" :tab="$t('global.viewableRange')">
      <sm-analyse-viewshed></sm-analyse-viewshed>
    </n-tab-pane>
    <n-tab-pane name="shadowAnalysis" :tab="$t('global.ligShadowAnalysisth')">
      <sm-analyse-shadow></sm-analyse-shadow>
    </n-tab-pane>
    <n-tab-pane name="profile" :tab="$t('global.profile')">
      <sm-analyse-profile></sm-analyse-profile>
    </n-tab-pane>
    <n-tab-pane name="skyline" :tab="$t('global.Skyline')">
      <sm-analyse-skyline></sm-analyse-skyline>
    </n-tab-pane>
    <!-- <n-tab-pane name="热力图" tab="热力图">
      <HeatMap></HeatMap>
    </n-tab-pane> -->
  </n-tabs>
</template>

<script lang="ts" setup>
import { useChangePanelStore } from "@/store/changePanelbg/index";
import { ref } from "vue";

const changePanelStore = useChangePanelStore();

function update(value: string | number) {
  changePanelStore.setAnalyserPanel(value);
}
</script>

<style lang="scss" scoped>
</style>

