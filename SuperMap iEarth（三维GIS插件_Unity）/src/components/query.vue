<template>
  <n-card closable @close="seletcedComponent = null"  content-style="padding: 0 20px 15px 20px;" >
    <n-tabs type="line" size="large" >
      <n-tab-pane name="Query" display-directive="show" :tab='resource.AttributesQuery'> <sm-attributes-query/>   </n-tab-pane>
      <!-- <n-tab-pane name="Coordinate" display-directive="show" tab='坐标查询'> <sm-coordinate-query/>   </n-tab-pane> -->
    </n-tabs>
  </n-card>
</template>

<script setup>
import {inject} from 'vue'

let { resource,seletcedComponent } = inject("state");

</script>

<style lang="scss" scoped>
.n-card {
  max-width: 360px;
  min-width: 300px;
  width: auto;
  position: absolute;
  right: 6%;
  top: 6%;
  z-index: 999;
}
</style>