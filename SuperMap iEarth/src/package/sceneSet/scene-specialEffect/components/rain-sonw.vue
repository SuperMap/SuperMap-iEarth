<template>

  <div class="row-item">
    <span>{{$t('global.openRain')}}</span>
    <div style="width: 1.96rem;">
      <n-switch v-model:value="state.rainShow" @update:value="setRain" size="small"/>
    </div>
  </div>

  <div class="row-item" v-show="state.rainShow">
    <span>{{$t('global.rainAngle')}}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.rainAngle" style="width: 70%" 
      :min="0"
      :max="90"
      :step="10"/>
      <div class="row-slider-num" >{{ state.rainAngle }} <span> °</span></div>
    </div>
  </div>
  <div class="row-item" v-show="state.rainShow">
    <span>{{$t('global.rainSpeed')}}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.rainSpeed" style="width: 70%" 
      :min="0"
      :max="30"
      :step="2"/>
      <div class="row-slider-num" >{{ state.rainSpeed }} <span>{{$t('global.meterSecond')}}</span></div>
    </div>
  </div>


  <div class="row-item">
    <span>{{$t('global.openSnow')}}</span>
    <div style="width: 1.96rem;">
      <n-switch v-model:value="state.snowShow" @update:value="setSnow" size="small"/>
    </div>
  </div>

  <div class="row-item" v-show="state.snowShow">
    <span>{{$t('global.snowAngle')}}</span>
    <div class="slider-box" >
      <n-slider v-model:value="state.snowAngle" style="width: 70%" 
      :min="0"
      :max="90"
      :step="10"/>
      <div class="row-slider-num" >{{ state.snowAngle }} <span> °</span></div>
    </div>
  </div>
  
  <div class="row-item" v-show="state.snowShow">
    <span>{{$t('global.snowSpeed')}}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.snowSpeed" style="width: 70%" 
      :min="0"
      :max="30"
      :step="1"/>
      <div class="row-slider-num" >{{ state.snowSpeed }} <span>{{$t('global.meterSecond')}}</span></div>
    </div>
  </div>

  <div class="row-item" v-show="state.snowShow">
    <span>{{$t('global.snowDensity')}}</span>
    <div class="slider-box" >
      <n-slider v-model:value="state.snowDesity" style="width: 70%" 
      :min="0"
      :max="30"
      :step="1"/>
      <div class="row-slider-num" >{{ state.snowDesity }} <span> °</span></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onUnmounted } from "vue";

type stateType = {
  // 雨景
  rainShow: boolean, // 是否开启雨景
  rainAngle: number, // 雨角度
  rainSpeed: number, // 雨速度
  // 雪景
  snowShow: boolean, // 是否开启雪景
  snowAngle: number, // 雪角度
  snowSpeed: number, // 雪速度
  snowDesity: number, // 雪密度
}

let state = reactive<stateType>({
  rainShow: false,
  rainAngle: 0,
  rainSpeed: 14,
  snowShow: false,
  snowAngle: 0,
  snowSpeed: 2,
  snowDesity: 16,
});

// 开启雨景
function setRain() {
  viewer.scene.postProcessStages.rain.enabled = state.rainShow;
  viewer.scene.postProcessStages.rain.uniforms.angle = state.rainAngle;
  viewer.scene.postProcessStages.rain.uniforms.speed = state.rainSpeed;
}

// 开启雪景
function setSnow() {
  viewer.scene.postProcessStages.snow.enabled = state.snowShow;
  viewer.scene.postProcessStages.snow.uniforms.angle = state.snowAngle;
  viewer.scene.postProcessStages.snow.uniforms.speed = state.snowSpeed;
  viewer.scene.postProcessStages.snow.uniforms.density = state.snowDesity;
}

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

onUnmounted(() => {
  // state.rainShow = false;
  // state.snowShow = false;
  viewer.scene.postProcessStages.rain.enabled = false;
  viewer.scene.postProcessStages.snow.enabled = false;
});
</script>
<style lang="scss" scoped>
</style>