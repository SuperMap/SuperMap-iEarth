<!-- 场景颜色 -->
<template>
  <div class="sence-config-container">
    <!-- 亮度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("brightness") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.brightness" :step="0.1" :min="0" :max="5" />
          <n-input-number v-model:value="state.brightness"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="5" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 对比度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("contrastRatio") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.contrast" :step="0.1" :min="0" :max="5" />
          <n-input-number v-model:value="state.contrast"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="5" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 色调 -->
    <div class="row-wrap">
      <div class="label">{{ $t("colorTone") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.hue" :step="0.05" :min="-1" :max="1" />
          <n-input-number v-model:value="state.hue"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="-1" :max="1" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 饱和度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("saturation") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.saturation" :step="0.1" :min="0" :max="5" />
          <n-input-number v-model:value="state.saturation"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="5" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive } from "vue";

// 场景颜色
const state = reactive({
  brightness: 1,// 亮度
  contrast: 1,// 对比度
  hue: 0,// 色调
  saturation: 1,// 饱和度
})

// 开启场景颜色调节
onMounted(() => {
  viewer.scene.colorCorrection.show = true;

  const colorCorrection = viewer.scene.colorCorrection;
  state.brightness = colorCorrection.brightness;
  state.contrast = colorCorrection.contrast;
  state.hue = colorCorrection.hue;
  state.saturation = colorCorrection.saturation;
})

watch(
  () => state.brightness,
  (val) => {
    viewer.scene.colorCorrection.brightness = val;
  }
);
watch(
  () => state.contrast,
  (val) => {
    viewer.scene.colorCorrection.contrast = val;
  }
);
watch(
  () => state.hue,
  (val) => {
    viewer.scene.colorCorrection.hue = val;
  }
);
watch(
  () => state.saturation,
  (val) => {
    viewer.scene.colorCorrection.saturation = val;
  }
);
</script>
