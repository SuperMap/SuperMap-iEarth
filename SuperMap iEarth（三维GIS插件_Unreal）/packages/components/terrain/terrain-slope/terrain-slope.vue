<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px;">{{locale.DisplayMode}}</n-ellipsis>
      <n-select size="small" v-model:value="state.displayMode" :options="state.options" />
    </div>
  </n-space>
</template>

<script setup>
import { inject, onBeforeUnmount, reactive, watch } from "vue";
import { NSpace, NButton, NEllipsis, NSelect } from "naive-ui";

let { locale } = inject("storeData");
let sceneControl = viewer;

let state = reactive({
  displayMode: "NONE", //显示模式
  options: [
       {
      label: () => locale.value.NoneDisplay,
      value: "NONE"
    },
    {
      label: () => locale.value.ArrowAndFaceDisplay,
      value: "ARROW_AND_COLORS"
    },
    {
      label: () => locale.value.FaceDisplay,
      value: "COLORS"
    },
    {
      label: () => locale.value.ArrowDisplay,
      value: "ARROW"
    }
  ]
});

let slopemap;
function init(){
  if (!sceneControl) return;
    slopemap = new SuperMap.Web.Realspace.SlopeMap(sceneControl);
    slopemap.set_displayStyle(0); 
      slopemap.build();
}
init();


function clear() {
  if (slopemap) slopemap.clear();
}

watch(
  () => state.displayMode,
  val => {
    if (!slopemap) return;
    switch (val) {
      case "NONE":
        slopemap.set_displayStyle(
          SuperMap.Web.Realspace.SlopeDisplayStyle.NONE
        );
        break;
      case "COLORS":
        slopemap.set_displayStyle(
          SuperMap.Web.Realspace.SlopeDisplayStyle.COLORS
        );
        break;
      case "ARROW":
        slopemap.set_displayStyle(
          SuperMap.Web.Realspace.SlopeDisplayStyle.ARROW
        );
        break;
      case "ARROW_AND_COLORS":
        slopemap.set_displayStyle(
          SuperMap.Web.Realspace.SlopeDisplayStyle.ARROW_AND_COLORS
        );
        break;
    }
  }
);

onBeforeUnmount(() => {
  clear();
  slopemap = undefined;
});
</script>

<style lang="scss">
@import "../../../assets/style/common.scss";
</style>



