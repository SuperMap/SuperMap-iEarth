<template>
  <n-card closable @close="seletcedComponent = null" content-style="padding:6px;">
      <sm-measure/>
  </n-card>
</template>

<script setup>
// import measure from "ucomps/measure/index.js";
// import {NCard} from "naive-ui";
import {inject} from 'vue'

let { resource,seletcedComponent } = inject("state");

</script>

<style lang="scss" scoped>
.n-card {
  width: auto;
  position: absolute;
  right: 6%;
  top: 6%;
  z-index: 999;
}
</style>