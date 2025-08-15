<!-- 景深 -->
<template>
  <div class="sence-config-container">
    <!-- 相机F值 -->
    <div class="row-wrap">
      <div class="label">{{ $t("fStop") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.fStop" :step="1" :min="1" :max="32" />
          <n-input-number v-model:value="state.fStop"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="32" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 焦距 -->
    <div class="row-wrap">
      <div class="label">{{ $t("focalDistance") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.focalDistance" :step="1" :min="1" :max="500" />
          <n-input-number v-model:value="state.focalDistance"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="500" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 对焦范围 -->
    <div class="row-wrap">
      <div class="label">{{ $t("focalRange") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.focalRange" :step="1" :min="1" :max="5000" />
          <n-input-number v-model:value="state.focalRange"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="5000" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 模糊半径 -->
    <div class="row-wrap">
      <div class="label">{{ $t("blurRadius") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.blurRadius" :step="1" :min="-10" :max="100" />
          <n-input-number v-model:value="state.blurRadius"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="-10" :max="100" placeholder="" size="small" />
        </div>
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
  