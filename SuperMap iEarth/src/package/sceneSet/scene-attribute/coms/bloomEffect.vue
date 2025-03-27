<template>
  <div class="sence-config-container">
    <div class="row-item">
      <span>{{ $t("brightnessThreshold") }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.2rem" v-model:value="state.threshold" :step="0.01" :min="0" :max="1" />
        <n-input-number v-model:value="state.threshold" class="slider-input-number" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="1" placeholder="" size="small" />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("floodlightThreshold") }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.2rem" v-model:value="state.bloomIntensity" :step="0.01" :min="0" :max="10" />
        <n-input-number v-model:value="state.bloomIntensity" class="slider-input-number" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="10" placeholder="" size="small" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

let state = reactive({
  threshold: 0,  // 亮度阈值
  bloomIntensity: 1.34,  // 泛光强度
});

// 挂载的时候就是打开
onMounted(() => {
  viewer.scene.bloomEffect.show = true;
  state.threshold = viewer.scene.bloomEffect.threshold;
  state.bloomIntensity = viewer.scene.bloomEffect.bloomIntensity;
})

watch(
  () => state.threshold,
  (val) => {
    viewer.scene.bloomEffect.threshold = val;
  }
);
watch(
  () => state.bloomIntensity,
  (val) => {
    viewer.scene.bloomEffect.bloomIntensity = val;
  }
);
</script>
