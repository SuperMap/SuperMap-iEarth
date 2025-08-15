<template>
  <div class="right-panel-container">
    <n-tabs type="line" animated justify-content="left">
      <n-tab-pane name="IndexDBQuery" :tab="$t('layerQuery')">
        <IndexDBQuery></IndexDBQuery>
      </n-tab-pane>
      <n-tab-pane name="CoordinateQuery" :tab="$t('coordinateQuery')">
        <CoordinateQuery></CoordinateQuery>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import IndexDBQuery from "./coms/indexDBQuery.vue";
import CoordinateQuery from "./coms/coordinateQuery.vue";
</script>