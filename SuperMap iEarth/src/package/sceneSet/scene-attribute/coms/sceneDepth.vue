<template>
    <div class="sence-config-container">
      <div class="row-item">
        <span :title="$t('fStopTitle')">{{ $t("fStop") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.fStop" :step="1" :min="1" :max="32" />
          <n-input-number v-model:value="state.fStop" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="32" placeholder="" size="small" />
        </div>
      </div>

      <div class="row-item">
        <span>{{ $t("focalDistance") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.focalDistance" :step="1" :min="1" :max="500" />
          <n-input-number v-model:value="state.focalDistance" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="500" placeholder="" size="small" />
        </div>
      </div>

      <div class="row-item">
        <span :title="$t('focalRangeTitle')">{{ $t("focalRange") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.focalRange" :step="1" :min="1" :max="5000" />
          <n-input-number v-model:value="state.focalRange" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="5000" placeholder="" size="small" />
        </div>
      </div>

      <div class="row-item">
        <span :title="$t('blurRadiusTitle')">{{ $t("blurRadius") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.blurRadius" :step="1" :min="-10" :max="100" />
          <n-input-number v-model:value="state.blurRadius" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="-10" :max="100" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

let state = reactive({ 
  fStop: 2.8, // 镜头的F值,值越小景深越浅
  focalDistance: 50.0, // 焦距
  focalRange: 20, // 完全聚焦的区域范围，在此范围内的物体完全清晰，不会模糊
  blurRadius: 10 // 焦外的模糊半径
});

// 挂载的时候就是打开
onMounted(() => {
  viewer.scene.depthOfFieldEffect.show = true;
  state.fStop = viewer.scene.depthOfFieldEffect.fStop;
  state.focalDistance = viewer.scene.depthOfFieldEffect.focalDistance;
  state.focalRange = viewer.scene.depthOfFieldEffect.focalRange;
  state.blurRadius = viewer.scene.depthOfFieldEffect.blurRadius;
})

watch(
  () => state.fStop,
  (val) => {
    viewer.scene.depthOfFieldEffect.fStop = val;
  }
);
watch(
  () => state.focalDistance,
  (val) => {
    viewer.scene.depthOfFieldEffect.focalDistance = val;
  }
);
watch(
  () => state.focalRange,
  (val) => {
    viewer.scene.depthOfFieldEffect.focalRange = val;
  }
);
watch(
  () => state.blurRadius,
  (val) => {
    viewer.scene.depthOfFieldEffect.blurRadius = val;
  }
);
</script>
  