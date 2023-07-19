<template>
  <div class="scene-set-box">
    <n-tabs type="line" animated :on-update:value="tabsChange" justify-content="left">
      <n-tab-pane name="QingXieModel" :tab="$t('global.qxModel')" class="use-scroll">
        <QingXieModel></QingXieModel>
      </n-tab-pane>
      <n-tab-pane name="Inundation" :tab="$t('global.inundationAnalysis')">
        <Inundation></Inundation>
      </n-tab-pane>
      <n-tab-pane name="Offset" :tab="$t('global.offSet')">
        <Offset></Offset>
      </n-tab-pane>
      <n-tab-pane name="LayerColor" :tab="$t('global.layerColor')">
        <LayerColor></LayerColor>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
// import { usePanelStore } from "@/store/index";
import QingXieModel from "./coms/qingXieModel.vue";
import Inundation from "./coms/inundation.vue";
import Offset from "./coms/offset.vue";
import LayerColor from "./coms/layerColor.vue";

// const panelStore = usePanelStore();
function tabsChange() {}

// 关闭弹窗
// function panelCloseHandle() {}
</script>

<style lang="scss" scoped>
.scene-set-box {
  width: 100%;
  height: 100%;
  // padding: 0 0.12rem;
  box-sizing: border-box;
}
:deep(.n-tabs-tab-wrapper){
  margin-right:0.16rem;
}
  :deep(.n-tabs-nav){
    padding:0 0.12rem;
  };
  :deep(.n-tab-pane) {
    box-sizing: border-box;
    padding-left: 0.12rem;
    padding-right: 0.12rem;
  }
  .use-scroll{
    padding-right: 0px;
  }
</style>
