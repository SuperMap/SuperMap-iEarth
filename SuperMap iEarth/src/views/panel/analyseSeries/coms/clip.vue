<template>
  <n-tabs type="line" animated :on-update:value="tabsChange">
    <n-tab-pane name="box" :tab="$t('global.boxClip')">
      <sm-clip-box></sm-clip-box>
    </n-tab-pane>
    <n-tab-pane name="plane" :tab="$t('global.planeClip')">
      <sm-clip-plane></sm-clip-plane>
    </n-tab-pane>
    <n-tab-pane name="cross" :tab="$t('global.crossClip')">
      <sm-clip-cross></sm-clip-cross>
    </n-tab-pane>
    <n-tab-pane name="polygon" :tab="$t('global.polygonClip')">
      <sm-clip-polygon></sm-clip-polygon>
    </n-tab-pane>
  </n-tabs>
</template>


<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { PanelStoreCreate } from "@/store/panel/panel";
import { useChangePanelStore } from "@/store/changePanelbg/index";

const panelStore = PanelStoreCreate();
const { panelBgName } = storeToRefs(panelStore);
const changePanelStore = useChangePanelStore();

function tabsChange(value) {
  panelBgName.value = value;
  changePanelStore.setAnalyserPanel(value);
}
</script>