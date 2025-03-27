<template>
  <div class="row-item">
    <span>{{ $t("brightness") }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.brightness" style="width: 70%" :step="0.05" :min="0" :max="3" />
      <n-input-number v-model:value="state.brightness" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0" :max="3" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("contrastRatio") }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.contrast" style="width: 70%" :step="0.05" :min="0" :max="3" />
      <n-input-number v-model:value="state.contrast" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0" :max="3" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("colorTone") }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.hue" style="width: 70%" :step="0.05" :min="-1" :max="1" />
      <n-input-number v-model:value="state.hue" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="-1" :max="1" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("saturation") }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.saturation" style="width: 70%" :step="0.05" :min="0" :max="3" />
      <n-input-number v-model:value="state.saturation" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0" :max="3" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("gamma") }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.gamma" style="width: 70%" :step="0.05" :min="0" :max="3" />
      <n-input-number v-model:value="state.gamma" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0" :max="3" placeholder="" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from "vue";
import { defineProps } from 'vue';

// 传参并监听
const props = defineProps({
  selectS3MLayerName: String
});

const viewer = window.viewer;

// 初始化变量
const state = reactive({
  brightness: 1,
  contrast: 1,
  hue: 0,
  saturation: 1,
  gamma: 1,
});


let selectLayer: any = undefined;

onMounted(() => {
  const s3mLayerName = props.selectS3MLayerName;
  selectLayer = viewer.scene.layers.find(s3mLayerName);
  updateStateValue(selectLayer);
});

// 更新State
function updateStateValue(selectLayer){
  if(selectLayer){
    state.brightness = selectLayer.brightness || 1;
    state.contrast = selectLayer.contrast || 1;
    state.hue = selectLayer.hue || 0;
    state.saturation = selectLayer.saturation || 1;
    state.gamma = selectLayer.gamma || 1;
  }else{
    state.brightness = 1;
    state.contrast = 1;
    state.hue = 10
    state.saturation = 1;
    state.gamma = 1;
  }
}

// 切换图层
watch(
  () => props.selectS3MLayerName, 
  (val) => {
    if(val){
      selectLayer = viewer.scene.layers.find(val);
      updateStateValue(selectLayer);
    }
  }
);

watch(
  () => state.brightness,
  (val) => {
    if (selectLayer) selectLayer.brightness = Number(val);
  }
);
watch(
  () => state.contrast,
  (val) => {
    if (selectLayer) selectLayer.contrast = Number(val);
  }
);
watch(
  () => state.hue,
  (val) => {
    if (selectLayer) selectLayer.hue = Number(val);
  }
);
watch(
  () => state.saturation,
  (val) => {
    if (selectLayer) selectLayer.saturation = Number(val);
  }
);
watch(
  () => state.gamma,
  (val) => {
    if (selectLayer) selectLayer.gamma = Number(val);
  }
);
</script>
