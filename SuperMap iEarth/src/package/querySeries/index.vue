<template>
  <div class="layerSeries-box">
    <n-tabs type="line" animated justify-content="left">
      <n-tab-pane name="IndexDBQuery" :tab="$t('layerQuery')" class="use-scroll">
        <IndexDBQuery></IndexDBQuery>
      </n-tab-pane>
      <n-tab-pane name="CoordinateQuery" :tab="$t('coordinateQuery')">
        <CoordinateQuery></CoordinateQuery>
      </n-tab-pane>
      <!-- <n-tab-pane name="Offset" :tab="$t('spatialQuery')">
        <SpatialQuery></SpatialQuery>
      </n-tab-pane> -->
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import IndexDBQuery from "./coms/indexDBQuery.vue";
import CoordinateQuery from "./coms/coordinateQuery.vue";
// import SpatialQuery from "./coms/spatialQuery.vue";
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
