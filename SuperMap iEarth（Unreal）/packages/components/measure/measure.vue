<template>
   <n-space>
      <n-button text @click="MeasureDistance" class="iconfont iconVue-measure-distance" :title="locale.MeasureDistance"></n-button>
      <n-button text @click="MeasureHeight" class="iconfont iconVue-measure-height" :title="locale.MeasureHeight"></n-button>
      <n-button text @click="MeasureArea" class="iconfont  iconVue-measure-area" :title="locale.MeasureSurface"></n-button>
      <n-button text @click="MeasureHorizontalDistance" class="iconfont  iconVue-measure" :title="locale.HorizontalMeasureDistance"></n-button>
      <n-button text @click="clear" class="iconfont iconVue-measure-clear" :title="locale.Clear"></n-button>
    </n-space>
</template>

<script setup>
import { ref,inject,onBeforeUnmount } from "vue";
import {NSpace ,NButton} from "naive-ui";

let {locale} = inject('storeData');
let sceneControl = viewer;


function MeasureDistance() {
  let ac = new SuperMap.Web.UI.Action3Ds.MeasureDistance(sceneControl); 
  sceneControl.set_sceneAction(ac);
}

function MeasureHeight() {
  let ac = new SuperMap.Web.UI.Action3Ds.MeasureHeight(sceneControl); 
  sceneControl.set_sceneAction(ac);
}

function MeasureArea() {
  let ac = new SuperMap.Web.UI.Action3Ds.MeasureArea(sceneControl); 
  sceneControl.set_sceneAction(ac);
}

function MeasureHorizontalDistance() {
  let ac = new SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance(sceneControl); 
  sceneControl.set_sceneAction(ac);
}


function clear() {
  sceneControl.get_scene().get_trackingLayer3D().removeAll();
}

onBeforeUnmount(()=>{
  clear();
  sceneControl = undefined;
})
</script>

<style lang="scss" scoped>
 button {
    padding: 6px;
    font-size: 24px;
  }
</style>



