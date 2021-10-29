<template>
  <n-card content-style="padding:6px;" v-show="show">
    <sm-layer-tree :is-update='show'/>
  </n-card>
</template>

<script setup>
let props = defineProps({
  show: Boolean
});

</script>

<style lang="scss" scoped>
.n-card {
  width: auto;
  max-width: 400px;
  min-width: 242px;
  position: absolute;
  left: 10px;
  top: 65px;
  z-index: 999;
  overflow: hidden;
}
</style>