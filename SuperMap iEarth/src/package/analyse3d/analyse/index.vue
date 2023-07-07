<template>
  <div class="analyse-box">
    <n-tabs type="line" animated justify-content="space-between">
      <!-- 通视 -->
      <n-tab-pane name="sightLine" tab="通视">
        <SmAnalyseSightLine></SmAnalyseSightLine>
      </n-tab-pane>
      <!-- 可视域 -->
      <n-tab-pane name="viewshed" tab="可视域">
        <SmAnalyseViewshed></SmAnalyseViewshed>
      </n-tab-pane>
      <!-- 阴影 -->
      <n-tab-pane name="shadow" tab="阴影">
        <SmAnalyseShadow></SmAnalyseShadow>
      </n-tab-pane>
      <!-- 剖面 -->
      <n-tab-pane name="profile" tab="剖面">
        <SmAnalyseProfile></SmAnalyseProfile>
      </n-tab-pane>
      <!-- 天际线 -->
      <n-tab-pane name="skyline" tab="天际线">
        <SmAnalyseSkyline></SmAnalyseSkyline>
      </n-tab-pane>
      <n-tab-pane name="facadeImage" tab="立面图">
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
import SmAnalyseFacadeImage from "./analyse_facadeImage/index";

const panelStore = usePanelStore();
function tabsChange(value) {}
</script>

<style lang="scss" scoped>
.analyse-box {
  width: 100%;
  height: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
</style>
