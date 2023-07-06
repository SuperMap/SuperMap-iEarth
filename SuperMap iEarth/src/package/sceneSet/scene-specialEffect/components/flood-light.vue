<template>

  <div class="row-item">
    <span>开启泛光</span>
    <div style="width: 1.96rem;height: 0.32rem;">
      <n-switch v-model:value="state.bloomShow" @update:value="setBloom" size="small"/>
    </div>
  </div>

  <div class="row-item" v-show="state.bloomShow">
      <span>亮度阈值</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.2rem;"
          v-model:value="state.threshold"
          :step="0.01" :min="0" :max="1"
        />
        <div class="slider-suffix">
          <span>{{ state.threshold }}</span>
        </div>
      </div>
    </div>


  <div class="row-item" v-show="state.bloomShow">
      <span>泛光强度</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.2rem;"
          v-model:value="state.bloomIntensity"
          :step="0.01" :min="0" :max="1"
        />
        <div class="slider-suffix">
          <span>{{ state.bloomIntensity }}</span>
        </div>
      </div>
    </div>

</template>

<script lang="ts" setup>
import { onUnmounted, reactive, watch } from "vue";

type stateType = {
  bloomShow: boolean, // 是否开启泛光
  threshold: number, // 亮度阈值
  bloomIntensity: number, // 泛光强度
}

let state = reactive<stateType>({
  bloomShow: false,
  threshold: 0.65,
  bloomIntensity: 1,
});

// 启动泛光
function setBloom() {
  viewer.scene.bloomEffect.show = state.bloomShow;
  viewer.scene.bloomEffect.threshold = state.threshold;
  viewer.scene.bloomEffect.bloomIntensity = state.bloomIntensity;
}

watch(
  () => state.threshold,
  (newVal: number) => {
    viewer.scene.bloomEffect.threshold = newVal;
  }
);
watch(
  () => state.bloomIntensity,
  (newVal: number) => {
    viewer.scene.bloomEffect.bloomIntensity = newVal;
  }
);

onUnmounted(() => {
  viewer.scene.bloomEffect.show = false;
  viewer.scene.bloomEffect.threshold = 0.65;
  viewer.scene.bloomEffect.bloomIntensity = 1;
});
</script>
<style lang="scss" scoped>
:deep(.n-slider-handle){
  background-color: #414141 !important;
  border: 1.5px solid #3499E5 !important;
}
</style>