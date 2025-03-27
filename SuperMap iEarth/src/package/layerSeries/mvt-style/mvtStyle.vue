<template>
  <div class="layerSeries-box" style="padding: 1px 0.16rem;">
    <div class="row-item">
      <span>{{ $t("selectMVTLayer") }}</span>
      <n-select
        style="width: 2.1rem"
        v-model:value="state.selectMVTStyleName"
        :options="state.mvtStyleLayers"
      />
    </div>

    <div class="row-item">
      <span>{{ $t("transparency") }}</span>
      <div class="slider-box" style="width: 1.9rem">
        <n-slider
          style="width: 2.2rem"
          v-model:value="state.alpha"
          :step="0.1"
          :min="0"
          :max="1"
        />
        <n-input-number
          v-model:value="state.alpha"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="0"
          :max="1"
          :step="0.1"
          placeholder=""
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import layerManagement from "@/tools/layerManagement";

type StateType = {
  mvtStyleLayers: any; 
  selectMVTStyleName: string; 
  alpha: number; 
};

let state = reactive<StateType>({
  mvtStyleLayers: [], 
  selectMVTStyleName: '',
  alpha: 0.7,
});

let currentMVTLayer:any = undefined;
function init() {
  state.mvtStyleLayers = layerManagement.getMVTStyleLayerList();
  
  state.selectMVTStyleName = window.iEarthBindData.CurrentMVTStyleLayerSourceName;
  // currentMVTLayer = viewer.scene.getVectorTilesMap(state.selectMVTStyleName);
  currentMVTLayer = layerManagement.getMVTLayerByStyleSourceName(state.selectMVTStyleName);
  if(currentMVTLayer) state.alpha = currentMVTLayer.alpha;
}


onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});


// 清除
function clear() {
  if (currentMVTLayer) currentMVTLayer.alpha = 1;
  state.alpha = 1;
}

watch(
  () => state.alpha,
  (val) => {
    if (currentMVTLayer) currentMVTLayer.alpha = val;
  }
);

watch(
  () => state.selectMVTStyleName,
  (val) => {
    // currentMVTLayer = viewer.scene.getVectorTilesMap(val);
    currentMVTLayer = layerManagement.getMVTLayerByStyleSourceName(val);
    if(currentMVTLayer) state.alpha = currentMVTLayer.alpha;
  }
);
</script>