<template>
  <div class="row-item">
    <span>{{ $t("renderQualityType") }}</span>
    <n-select style="width: 1.96rem" v-model:value="state.renderQualityType" :options="state.renderQualityOption"
      :focusable="false" />
  </div>

  <div class="row-item">
    <span>{{ $t("cloudThickness") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.2rem" v-model:value="state.thickness" :min="2000" :max="20000" :step="10" />
      <n-input-number v-model:value="state.thickness" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="2000" :max="20000" :step="10" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("cloudCoverage") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.2rem" v-model:value="state.coverage" :min="0.0" :max="1.0" :step="0.01" />
      <n-input-number v-model:value="state.coverage" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0.0" :max="1.0" :step="0.01" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("cloudSpeed") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.2rem" v-model:value="state.speed" :min="0.0" :max="200.0" :step="1" />
      <n-input-number v-model:value="state.speed" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0.0" :max="200.0" :step="1" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("cloudDirection")+"（&deg;）" }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.2rem" v-model:value="state.direction" :min="0.0" :max="360.0" :step="1" />
      <n-input-number v-model:value="state.direction" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0.0" :max="360.0" :step="1" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("showHighCloud") }}</span>
    <div style="width: 1.96rem">
      <n-checkbox v-model:checked="state.useHighCloud"></n-checkbox>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

const VolumetricCloudsQuality: any = SuperMap3D.VolumetricCloudsQuality;
const volumetricClouds = scene.volumetricClouds;
const state = reactive({
  useHighCloud: false,
  renderQualityType: VolumetricCloudsQuality.Middle,
  renderQualityOption: [
    { label: () => $t("advance"), value: VolumetricCloudsQuality.High, },
    { label: () => $t("middle"), value: VolumetricCloudsQuality.Middle, },
    { label: () => $t("low"), value: VolumetricCloudsQuality.Low, },
  ],
  thickness: 8000,
  coverage: 0.5,
  speed: 50.0,
  direction: 0.0,
});

// 挂载的时候就是打开
onMounted(() => {
  viewer.scene.volumetricClouds.enabled = true; // 体积云要起作用，需要设置 useSuperMapOIT 为true
  state.useHighCloud = volumetricClouds.cirrusEnabled;
  state.renderQualityType = volumetricClouds.quality;
  state.thickness = volumetricClouds.thickness;
  state.coverage = volumetricClouds.shapeCoverage;
  state.speed = volumetricClouds.windSpeed;
  state.direction = volumetricClouds.windHeading;
})


watch(() => state.useHighCloud,
  (val) => {
    volumetricClouds.cirrusEnabled = Boolean(val);
  }
);

watch(() => state.renderQualityType,
  (val) => {
    volumetricClouds.quality = Number(val);
  }
);

watch(() => state.thickness,
  (val) => {
    volumetricClouds.thickness = Number(val);
  }
);

watch(() => state.coverage,
  (val) => {
    volumetricClouds.shapeCoverage = Number(val);
  }
);

watch(() => state.speed,
  (val) => {
    volumetricClouds.windSpeed = Number(val);
  }
);

watch(() => state.direction,
  (val) => {
    volumetricClouds.windHeading = Number(val);
  }
);
</script>
  