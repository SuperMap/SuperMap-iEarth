<template>
  <div class="right-panel-container">
    <n-tabs type="line" animated justify-content="left">
      <n-tab-pane name="QingXieModel" :tab="$t('qxModel')">
        <QingXieModel></QingXieModel>
      </n-tab-pane>
      <n-tab-pane name="Inundation" :tab="$t('inundationAnalysis')">
        <Inundation></Inundation>
      </n-tab-pane>
      <n-tab-pane name="Offset" :tab="$t('offSet')">
        <Offset></Offset>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import QingXieModel from "./coms/qingXieModel.vue";
import Inundation from "./coms/inundation.vue";
import Offset from "./coms/offset.vue";
</script>