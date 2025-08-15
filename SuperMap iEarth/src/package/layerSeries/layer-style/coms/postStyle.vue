<!-- S3M图层后处理 -->
<template>
  <!-- 亮度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("brightness") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.brightness" :step="0.05" :min="0" :max="3" />
        <n-input-number v-model:value="state.brightness" :update-value-on-input="false" :bordered="false"
          :show-button="false" :min="0" :max="3" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 对比度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("contrastRatio") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.contrast" :step="0.05" :min="0" :max="3" />
        <n-input-number v-model:value="state.contrast" :update-value-on-input="false" :bordered="false"
          :show-button="false" :min="0" :max="3" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 色调 -->
  <div class="row-wrap">
    <div class="label">{{ $t("colorTone") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.hue" :step="0.05" :min="-1" :max="1" />
        <n-input-number v-model:value="state.hue" :update-value-on-input="false" :bordered="false" :show-button="false"
          :min="-1" :max="1" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 饱和度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("saturation") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.saturation" :step="0.05" :min="0" :max="3" />
        <n-input-number v-model:value="state.saturation" :update-value-on-input="false" :bordered="false"
          :show-button="false" :min="0" :max="3" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 伽马 -->
  <div class="row-wrap">
    <div class="label">{{ $t("gamma") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.gamma" :step="0.05" :min="0" :max="3" />
        <n-input-number v-model:value="state.gamma" :update-value-on-input="false" :bordered="false"
          :show-button="false" :min="0" :max="3" placeholder="" size="small" />
      </div>
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
