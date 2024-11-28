<template>
  <div class="row-item">
    <span>{{ $t("openRain") }}</span>
    <div style="width: 1.96rem">
      <n-switch v-model:value="state.rainShow" size="small" />
    </div>
  </div>

  <div class="row-item" v-show="state.rainShow">
    <span>{{ $t("rainAngle") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.rainAngle"
        style="width: 70%"
        :min="0"
        :max="90"
        :step="1"
      />
      <n-input-number
        v-model:value="state.rainAngle"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="90"
        placeholder=""
        size="small"
      />
      <span> °</span>
    </div>
  </div>

  <div class="row-item" v-show="state.rainShow">
    <span>{{ $t("rainSpeed") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.rainSpeed"
        style="width: 70%"
        :min="0"
        :max="100"
        :step="1"
      />
      <n-input-number
        v-model:value="state.rainSpeed"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="100"
        placeholder=""
        size="small"
      />
      <div class="text-ellipsis-box" style="width: 0.5rem;" :title="$t('meterSecond')">{{ $t("meterSecond") }}</div>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("openSnow") }}</span>
    <div style="width: 1.96rem">
      <n-switch v-model:value="state.snowShow" size="small" />
    </div>
  </div>

  <div class="row-item" v-show="state.snowShow">
    <span>{{ $t("snowAngle") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.snowAngle"
        style="width: 70%"
        :min="0"
        :max="90"
        :step="1"
      />
      <n-input-number
        v-model:value="state.snowAngle"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="90"
        placeholder=""
        size="small"
      />
      <span> °</span>
    </div>
  </div>

  <div class="row-item" v-show="state.snowShow">
    <span>{{ $t("snowSpeed") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.snowSpeed"
        style="width: 70%"
        :min="0"
        :max="100"
        :step="1"
      />
      <n-input-number
        v-model:value="state.snowSpeed"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="100"
        placeholder=""
        size="small"
      />
      <div class="text-ellipsis-box" style="width: 0.5rem;" :title="$t('meterSecond')">{{ $t("meterSecond") }}</div>
    </div>
  </div>

  <div class="row-item" v-show="state.snowShow">
    <span>{{ $t("snowDensity") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.snowDesity"
        style="width: 70%"
        :min="0"
        :max="60"
        :step="1"
      />
      <n-input-number
        v-model:value="state.snowDesity"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="60"
        placeholder=""
        size="small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";

type stateType = {
  // 雨景
  rainShow: boolean; // 是否开启雨景
  rainAngle: number; // 雨角度
  rainSpeed: number; // 雨速度
  // 雪景
  snowShow: boolean; // 是否开启雪景
  snowAngle: number; // 雪角度
  snowSpeed: number; // 雪速度
  snowDesity: number; // 雪密度
};

let state = reactive<stateType>({
  rainShow: false,
  rainAngle: 0,
  rainSpeed: 14,
  snowShow: false,
  snowAngle: 0,
  snowSpeed: 2,
  snowDesity: 16,
});

const scene = viewer.scene;

onMounted(() => {});

onUnmounted(() => {
  viewer.scene.postProcessStages.rain.enabled = false;
  viewer.scene.postProcessStages.snow.enabled = false;
  for (let i = 0; i < scene.layers.layerQueue.length; i++) {
    let layer = scene.layers.layerQueue[i];
    layer.removePBRMaterial();
  }
});

// 开启雨景
function setRain() {
  viewer.scene.postProcessStages.rain.enabled = state.rainShow;
  viewer.scene.postProcessStages.rain.uniforms.angle = state.rainAngle;
  viewer.scene.postProcessStages.rain.uniforms.speed = state.rainSpeed;

  if (state.rainShow) {
    for (let i = 0; i < scene.layers.layerQueue.length; i++) {
      let layer = scene.layers.layerQueue[i];
      layer.setPBRMaterialFromJSON("./Resource/pbr/MaterialJson/rain_.json");
      // layer.rainEffect.wetnessFactor = 0.65;
      // 实现雨水渐增的效果
      let intervalValue = setInterval(() => {
        if (layer.rainEffect !== undefined) {
          layer.rainEffect.wetnessFactor += 0.005;
        }
        if (
          layer.rainEffect !== undefined &&
          layer.rainEffect.wetnessFactor > 0.65
        )
          clearInterval(intervalValue);
      }, 40);
    }
  } else {
    for (let i = 0; i < scene.layers.layerQueue.length; i++) {
      let layer = scene.layers.layerQueue[i];
      layer.removePBRMaterial();
    }
  }
}

// 开启雪景
function setSnow() {
  viewer.scene.postProcessStages.snow.enabled = state.snowShow;
  viewer.scene.postProcessStages.snow.uniforms.angle = state.snowAngle;
  viewer.scene.postProcessStages.snow.uniforms.speed = state.snowSpeed;
  viewer.scene.postProcessStages.snow.uniforms.density = state.snowDesity;

  if (state.snowShow) {
    for (let i = 0; i < scene.layers.layerQueue.length; i++) {
      let layer = scene.layers.layerQueue[i];
      layer.setPBRMaterialFromJSON(
        "./Resource/pbr/MaterialJson/M_Brick_Clay_Old_.json"
      );
      let intervalValue = setInterval(() => {
        if (
          layer._PBRMaterialParams.pbrMetallicRoughness.snowEffect !== undefined
        ) {
          layer._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage += 0.0006;
        }
        if (
          layer._PBRMaterialParams.pbrMetallicRoughness.snowEffect !==
            undefined &&
          layer._PBRMaterialParams.pbrMetallicRoughness.snowEffect
            .snow_coverage -
            1 >
            0
        )
          clearInterval(intervalValue);
      }, 30);
    }
  } else {
    for (let i = 0; i < scene.layers.layerQueue.length; i++) {
      let layer = scene.layers.layerQueue[i];
      layer.removePBRMaterial();
    }
  }
}

watch(
  () => state.rainShow,
  () => {
    state.snowShow = false;
    setRain();
  }
);
watch(
  () => state.snowShow,
  () => {
    state.rainShow = false;
    setSnow();
  }
);
watch(
  () => state.rainAngle,
  (newVal: number) => {
    viewer.scene.postProcessStages.rain.uniforms.angle = newVal;
  }
);
watch(
  () => state.rainSpeed,
  (newVal: number) => {
    viewer.scene.postProcessStages.rain.uniforms.speed = newVal;
  }
);
watch(
  () => state.snowAngle,
  (newVal: number) => {
    viewer.scene.postProcessStages.snow.uniforms.angle = newVal;
  }
);
watch(
  () => state.snowSpeed,
  (newVal: number) => {
    viewer.scene.postProcessStages.snow.uniforms.speed = newVal;
  }
);
watch(
  () => state.snowDesity,
  (newVal: number) => {
    viewer.scene.postProcessStages.snow.uniforms.density = newVal;
  }
);
</script>
