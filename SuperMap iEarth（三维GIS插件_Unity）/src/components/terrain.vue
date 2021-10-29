<template>
  <n-card closable @close="seletcedComponent = null" content-style="padding: 0 20px 15px 20px;">
    <n-tabs type="line" size="large">
      <n-tab-pane name="TerrainSlope" display-directive="show" :tab="resource.TerrainSlope">
        <sm-terrain-slope />
      </n-tab-pane>
      <n-tab-pane name="TerrainIsoline" display-directive="show" :tab="resource.TerrainIsoline">
        <sm-terrain-isoline />
      </n-tab-pane>
       <n-tab-pane name="Flood" display-directive="show" :tab='resource.Flood'> <sm-flood/>   </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { inject } from "vue";

let { resource, seletcedComponent } = inject("state");
</script>

<style lang="scss" scoped>
.n-card {
  max-width: 360px;
  min-width: 310px;
  width: auto;
  position: absolute;
  right: 6%;
  top: 6%;
  z-index: 999;
}
</style>