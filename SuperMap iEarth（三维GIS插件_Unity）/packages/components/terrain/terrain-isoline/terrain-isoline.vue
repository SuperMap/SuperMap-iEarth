<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px;">{{locale.DisplayMode}}</n-ellipsis>
      <n-select size="small" v-model:value="state.displayMode" :options="state.options" />
    </div>
    <div class="sm-box">
      <n-ellipsis>{{locale.Equidistance}}</n-ellipsis>
      <n-input-number v-model:value="state.equivalentIsoline" size="small" style="width:100%"></n-input-number>
    </div>
    <n-space justify="end">
      <n-button @click="start">{{locale.Analyze}}</n-button>
      <n-button @click="clear">{{locale.Clear}}</n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { inject, onBeforeUnmount, reactive, watch } from "vue";
import { NSpace, NButton, NEllipsis, NSelect ,NInputNumber} from "naive-ui";

let { locale } = inject("storeData");
let sceneControl = viewer;

let state = reactive({
  displayMode: "LINES_AND_COLORS", //显示模式
  equivalentIsoline: 100, //等值距
  options: [
    {
      label: () => locale.value.IsolineSurfaceFill,
      value: "LINES_AND_COLORS"
    },
    {
      label: () => locale.value.IsosurfaceFill,
      value: "COLORS"
    },
    {
      label: () => locale.value.IsolineFill,
      value: "LINES"
    }
  ]
});

let contourMap;
function init(){
  if (!sceneControl) return;
    contourMap = new SuperMap.Web.Realspace.ContourMap(sceneControl);
    contourMap.set_displayStyle(3); 
    contourMap.set_interval(state.equivalentIsoline);
}
init();

function start() {
  if (!contourMap) return;
  contourMap.build();
}

function clear() {
  if (contourMap) contourMap.clear();
}

watch(
  () => state.displayMode,
  val => {
    if (!contourMap) return;
    switch (val) {
      case "COLORS":
        contourMap.set_displayStyle(
          SuperMap.Web.Realspace.ContourDisplayStyle.COLORS
        );
        break;
      case "LINES":
        contourMap.set_displayStyle(
          SuperMap.Web.Realspace.ContourDisplayStyle.LINES
        );
        break;
      case "LINES_AND_COLORS":
        contourMap.set_displayStyle(
         SuperMap.Web.Realspace.ContourDisplayStyle.LINES_AND_COLORS
        );
        break;
    }
  }
);

watch(
  () => state.equivalentIsoline,
  val => {
    if (!contourMap) return;
    contourMap.set_interval(val);
  }
);

onBeforeUnmount(() => {
  clear();
  contourMap = undefined;
});
</script>





