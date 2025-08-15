<template>
  <div class="right-panel-container">
    <n-tabs type="line" animated justify-content="space-between">
      <!-- 通视 -->
      <n-tab-pane name="sightLine" :tab="$t('Intervisibility')">
        <SmAnalyseSightLine></SmAnalyseSightLine>
      </n-tab-pane>
      <!-- 可视域 -->
      <n-tab-pane name="viewshed" :tab="$t('viewableRange')">
        <SmAnalyseViewshed></SmAnalyseViewshed>
      </n-tab-pane>
      <!-- 阴影 -->
      <n-tab-pane name="shadow" :tab="$t('ligShadowAnalysisth')">
        <SmAnalyseShadow></SmAnalyseShadow>
      </n-tab-pane>
      <!-- 剖面 -->
      <n-tab-pane name="profile" :tab="$t('profile')">
        <SmAnalyseProfile></SmAnalyseProfile>
      </n-tab-pane>
      <!-- 天际线 -->
      <n-tab-pane name="skyline" :tab="$t('Skyline')">
        <SmAnalyseSkyline></SmAnalyseSkyline>
      </n-tab-pane>
      <n-tab-pane name="facadeImage" :tab="$t('FacePlot')">
        <SmAnalyseFacadeImage></SmAnalyseFacadeImage>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import SmAnalyseSightLine from "./analyse-sightLine/index";
import SmAnalyseViewshed from "./analyse-viewshed/index";
import SmAnalyseShadow from "./analyse-shadow/index";
import SmAnalyseProfile from "./analyse-profile/index";
import SmAnalyseSkyline from "./analyse-skyline/index";
import SmAnalyseFacadeImage from "./analyse-facadeImage/index";
</script>