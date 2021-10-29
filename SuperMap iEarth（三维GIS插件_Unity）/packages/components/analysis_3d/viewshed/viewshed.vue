<template>
  <n-space justify="end">
    <n-button text @click="startViewshed" class="iconfont iconVue-viewshed" :title="locale.Viewshed"></n-button>
    <n-button text @click="clear" class="iconfont iconVue-measure-clear" :title="locale.Clear"></n-button>
  </n-space>
</template>

<script setup>
import {inject,onBeforeUnmount } from "vue";
import {NSpace ,NButton} from "naive-ui";

let {  locale } = inject("storeData");
let sceneControl = viewer;

let viewshed;
function startViewshed() {
  if (!sceneControl) return;
  if (!viewshed) viewshed = new SuperMap.Web.Realspace.ViewShed3D(sceneControl);
  viewshed.build();
}

function clear() {
  if (viewshed) viewshed.clear();
}

onBeforeUnmount(()=>{
  clear();
  viewshed = undefined;
})
</script>

<style lang="scss" scoped>
button {
  padding: 6px;
  font-size: 24px;
}
</style>



