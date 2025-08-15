<!-- 地图叠加倾斜 -->
<template>
  <div class="right-panel-container-not-tabs">
    <!-- 选择倾斜图层 -->
    <div class="row-wrap">
      <div class="label">{{ $t("selectQxLayer") }}</div>
      <div class="content">
        <n-select v-model:value="state.selectS3MName" :options="state.s3mlayers" />
      </div>
    </div>

    <!-- 透明度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("transparency") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.transparency" :step="0.1" :min="0.1" :max="1" />
          <n-input-number v-model:value="state.transparency" :update-value-on-input="false" :bordered="false"
            :show-button="false" :min="0.1" :max="1" :step="0.1" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <div class="row-btns">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button @click="startCover" class="operate" type="info" :focusable="false">{{
            $t("cover") }}</n-button>
        </template>
        {{ $t("mapCoverTip") }}
      </n-tooltip>
      <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import layerManagement from "@/tools/layerManagement";

const scene = viewer.scene;

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectS3MName: string; 
  transparency: number; 
};

let state = reactive<StateType>({
  s3mlayers: [], 
  selectS3MName: '',
  transparency: 0.7,
});

let currentIMGLayer:any = undefined;
let currentS3MLayer:any = undefined;
function init() {
  state.s3mlayers = layerManagement.getS3MLayerList();

  currentS3MLayer = scene.layers.find(state.selectS3MName);
  if(currentS3MLayer) currentS3MLayer.selectEnabled = true;
  viewer.imageryLayers._layers.forEach(imageLayer => {
    if(imageLayer.customName == window.iEarthBindData.CurrentIMGLayerName){
      currentIMGLayer = imageLayer;
    }
  });
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});


function startCover() {
  if (!currentIMGLayer) return;
  currentIMGLayer.alpha = Number(state.transparency);
  if (currentS3MLayer) currentS3MLayer.coverImageryLayer = currentIMGLayer;
}

// 清除
function clear() {
  if (currentIMGLayer) currentIMGLayer.alpha = 1;
  if (currentS3MLayer) currentS3MLayer.coverImageryLayer = undefined;
}

watch(
  () => state.transparency,
  (val) => {
    if (currentIMGLayer) currentIMGLayer.alpha = val;
  }
);

watch(
  () => state.selectS3MName,
  (val) => {
    currentS3MLayer = scene.layers.find(val);
    if(currentS3MLayer) currentS3MLayer.selectEnabled = true;
  }
);
</script>
