<template>
  <n-card closable @close="closePanel">
    <n-tabs type="line" size="large" justify-content="space-evenly">
      <n-tab-pane name="PublicService" display-directive="show" :tab='resource.PublicService'>
        <sm-public-service @addCallback="closePanel" :service-options="options" />
      </n-tab-pane>
      <n-tab-pane name="CustomService" display-directive="show" :tab='resource.CustomService'>
        <sm-custom-service @addCallback="closePanel" />
      </n-tab-pane>
      <n-tab-pane name="LocalData" display-directive="show" :tab='resource.LocalData'>本地数据</n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import options from "@/js/public-service-config";
import { inject } from "vue";

let { resource,seletcedComponent } = inject("state");
function closePanel(data,layer){
  seletcedComponent.value = null;
}
</script>

<style lang="scss" scoped>
.n-card {
  max-width: 600px;
  position: absolute;
  left: 50%;
  margin-left: -300px;
  top: 30%;
  z-index: 999;
}
</style>