<template>
    <div class="sence-config-container">
      <div class="row-item">
        <span>{{ $t("intensity") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.bloomScale" :step="0.1" :min="0" :max="5" />
          <n-input-number v-model:value="state.bloomScale" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="5" placeholder="" size="small" />
        </div>
      </div>

      <div class="row-item">
        <span>{{ $t("maxBrightness") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.maxBrightness" :step="0.1" :min="0" :max="20" />
          <n-input-number v-model:value="state.maxBrightness" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="20" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

const state = reactive({ 
  bloomScale: 0.7, // 控制光束泛光强度
  maxBrightness: 1.0, // 控制光束泛光最大亮度
});

const scene = viewer.scene;

// 挂载的时候就是打开
onMounted(() => {
  scene.postProcessStages.lightShaft.enabled = true;
  state.bloomScale = scene.postProcessStages.lightShaft.bloomScale;
  state.maxBrightness = scene.postProcessStages.lightShaft.maxBrightness;
})

watch(
  () => state.bloomScale,
  (val) => {
    scene.postProcessStages.lightShaft.bloomScale = val;
  }
);
watch(
  () => state.maxBrightness,
  (val) => {
    scene.postProcessStages.lightShaft.maxBrightness = val;
  }
);
</script>
  