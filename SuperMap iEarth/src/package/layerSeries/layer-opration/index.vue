<template>
  <div class="layerSeries-box">
    <n-tabs type="line" animated justify-content="left">
      <n-tab-pane name="QingXieModel" :tab="$t('qxModel')" class="use-scroll">
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

<style lang="scss" scoped>
.layerSeries-box {
  width: 100%;
  height: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}

:deep(.n-tabs-tab-wrapper) {
  margin-right: 0.16rem;
}

:deep(.n-tabs-nav) {
  padding: 0 0.12rem;
}

:deep(.n-tab-pane) {
  box-sizing: border-box;
  padding-left: 0.12rem;
  padding-right: 0.12rem;
}

.use-scroll {
  padding-right: 0px;
}
</style>
