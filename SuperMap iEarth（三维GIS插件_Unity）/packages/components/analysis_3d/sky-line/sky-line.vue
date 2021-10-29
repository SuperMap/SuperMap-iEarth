<template>
  <n-space justify="end">
    <n-button text @click="startSkyline" class="iconfont iconVue-Skyline" :title="locale.Skyline"></n-button>
    <n-button text @click="clear" class="iconfont iconVue-measure-clear" :title="locale.Clear"></n-button>
  </n-space>
</template>

<script setup>
import {inject,onBeforeUnmount } from "vue";
import {NSpace ,NButton} from "naive-ui";

let {  locale } = inject("storeData");
let sceneControl = viewer;
let skyline;
function startSkyline() {
  if (!sceneControl) return;
  if (!skyline) skyline = new SuperMap.Web.Realspace.Skyline(sceneControl);
  skyline.build();
}

function clear() {
  if(skyline) skyline.clear();
}

onBeforeUnmount(()=>{
  clear();
  skyline = undefined;
})
</script>

<style lang="scss" scoped>
button {
  padding: 6px;
  font-size: 24px;
}
</style>



