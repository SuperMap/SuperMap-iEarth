<!-- 体积云 -->
<template>
  <!-- 渲染质量 -->
  <div class="row-wrap">
    <div class="label">{{ $t("renderQualityType") }}</div>
    <div class="content">
      <n-select v-model:value="state.renderQualityType" :options="state.renderQualityOption" :focusable="false" />
    </div>
  </div>

  <!-- 云层厚度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("cloudThickness") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.thickness" :min="2000" :max="20000" :step="10" />
        <n-input-number v-model:value="state.thickness"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="2000" :max="20000" :step="10" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 云层高度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("cloudAltitude") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.altitude" :min="200" :max="20000" :step="10" />
        <n-input-number v-model:value="state.altitude"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="200" :max="20000" :step="10" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 云层密度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("cloudDensity") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.density" :min="0.01" :max="1" :step="0.01" />
        <n-input-number v-model:value="state.density"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0.01" :max="1" :step="0.01" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 云层覆盖度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("cloudCoverage") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.coverage" :min="0.0" :max="1.0" :step="0.01" />
        <n-input-number v-model:value="state.coverage"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0.0" :max="1.0" :step="0.01" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 风速 -->
  <div class="row-wrap">
    <div class="label">{{ $t("cloudSpeed") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.speed" :min="0.0" :max="200.0" :step="1" />
        <n-input-number v-model:value="state.speed"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0.0" :max="200.0" :step="1" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 风向 -->
  <div class="row-wrap">
    <div class="label">{{ $t("cloudDirection")+"（&deg;）" }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.direction" :min="0.0" :max="360.0" :step="1" />
        <n-input-number v-model:value="state.direction"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0.0" :max="360.0" :step="1" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 显示高层云 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.useHighCloud" :label="$t('showHighCloud')" />
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="reset" class="operate" type="info" :focusable="false" style="width: 1.2rem;">{{
    $t("resetOrigin") }}</n-button>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

const VolumetricCloudsQuality: any = SuperMap3D.VolumetricCloudsQuality;
const volumetricClouds = scene.volumetricClouds;
const state = reactive({
  useHighCloud: true,
  renderQualityType: VolumetricCloudsQuality.Middle,
  renderQualityOption: [
    { label: () => $t("advance"), value: VolumetricCloudsQuality.High, },
    { label: () => $t("middle"), value: VolumetricCloudsQuality.Middle, },
    { label: () => $t("low"), value: VolumetricCloudsQuality.Low, },
  ],
  thickness: 6000,
  altitude: 2000,
  density:0.35,
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
  state.altitude = volumetricClouds.lowestCloudAltitude;
  state.density = volumetricClouds.densityMultiplier;
  state.coverage = volumetricClouds.shapeCoverage;
  state.speed = volumetricClouds.windSpeed;
  state.direction = volumetricClouds.windHeading;
})

const reset = function(){
  if(window.iEarthBindData.originParam && window.iEarthBindData.originParam.volumetricCloud){
    const option = window.iEarthBindData.originParam.volumetricCloud;

    // 还原参数
    volumetricClouds.cirrusEnabled = option.cirrusEnabled; // 是否显示高层云
    volumetricClouds.quality = option.quality; // 渲染质量
    volumetricClouds.thickness = option.thickness; // 云层厚度
    volumetricClouds.densityMultiplier = option.densityMultiplier; // 云层密度
    volumetricClouds.lowestCloudAltitude = option.lowestCloudAltitude; // 云层底部高度
    volumetricClouds.shapeCoverage = option.shapeCoverage; // 云层覆盖度
    volumetricClouds.windSpeed = option.windSpeed; // 风速
    volumetricClouds.windHeading = option.windHeading; // 风向

    // 还原界面
    state.useHighCloud = option.cirrusEnabled; // 是否显示高层云
    state.renderQualityType = option.quality; // 渲染质量
    state.thickness = option.thickness; // 云层厚度
    state.altitude = option.lowestCloudAltitude; // 云层底部高度
    state.density = option.densityMultiplier; // 云层密度
    state.coverage = option.shapeCoverage; // 云层覆盖度
    state.speed = option.windSpeed; // 风速
    state.direction = option.windHeading; // 风向
  }
}

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

watch(() => state.altitude,
  (val) => {
    volumetricClouds.lowestCloudAltitude = Number(val);
  }
);

watch(() => state.density,
  (val) => {
    volumetricClouds.densityMultiplier = Number(val);
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
  