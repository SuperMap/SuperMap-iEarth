<template>
  <div class="analyse-box">
    <n-tabs type="line" animated justify-content="space-between">
      <!-- 通视 -->
      <n-tab-pane name="sightLine" :tab="$t('global.Intervisibility')">
        <SmAnalyseSightLine></SmAnalyseSightLine>
      </n-tab-pane>
      <!-- 可视域 -->
      <n-tab-pane name="viewshed" :tab="$t('global.viewableRange')" class="use-scroll">
        <SmAnalyseViewshed></SmAnalyseViewshed>
      </n-tab-pane>
      <!-- 阴影 -->
      <n-tab-pane name="shadow" :tab="$t('global.ligShadowAnalysisth')">
        <SmAnalyseShadow></SmAnalyseShadow>
      </n-tab-pane>
      <!-- 剖面 -->
      <n-tab-pane name="profile" :tab="$t('global.profile')">
        <SmAnalyseProfile></SmAnalyseProfile>
      </n-tab-pane>
      <!-- 天际线 -->
      <n-tab-pane name="skyline" :tab="$t('global.Skyline')">
        <SmAnalyseSkyline></SmAnalyseSkyline>
      </n-tab-pane>
      <n-tab-pane name="facadeImage" :tab="$t('global.FacePlot')">
        <SmAnalyseFacadeImage></SmAnalyseFacadeImage>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { usePanelStore } from "@/store/index";
import SmAnalyseSightLine from "./analyse-sightLine/index";
import SmAnalyseViewshed from "./analyse-viewshed/index";
import SmAnalyseShadow from "./analyse-shadow/index";
import SmAnalyseProfile from "./analyse-profile/index";
import SmAnalyseSkyline from "./analyse-skyline/index";
import SmAnalyseFacadeImage from "./analyse-facadeImage/index";

const panelStore = usePanelStore();
function tabsChange(value) {}
</script>

<style lang="scss" scoped>
.analyse-box {
  width: 100%;
  height: 100%;
  // padding: 0 0.12rem;
  box-sizing: border-box;
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
}
</style>
