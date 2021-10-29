<template>
  <n-space justify="end">
    <n-button text @click="startSightline" class="iconfont iconVue-sightline" :title="locale.Sightline"></n-button>
    <n-button text @click="clear" class="iconfont iconVue-measure-clear" :title="locale.Clear"></n-button>
  </n-space>
</template>

<script setup>
import {inject,onBeforeUnmount } from "vue";
import {NSpace ,NButton} from "naive-ui";

let {  locale } = inject("storeData");
let sceneControl = viewer;

let sightline;
function startSightline() {
  if (!sceneControl) return;
  if (!sightline) sightline = new SuperMap.Web.Realspace.Sightline(sceneControl);
  sightline.build();
}

function clear() {
  if (sightline) sightline.clear();
}

onBeforeUnmount(()=>{
  clear();
  sightline = undefined;
})
</script>

<style lang="scss" scoped>
button {
  padding: 6px;
  font-size: 24px;
}
</style>



