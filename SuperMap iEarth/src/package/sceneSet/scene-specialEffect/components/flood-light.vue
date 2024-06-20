<template>
  <div class="row-item">
    <span>{{ $t("openFloodlight") }}</span>
    <div style="width: 1.96rem">
      <n-switch
        v-model:value="state.bloomShow"
        @update:value="setBloom"
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-show="state.bloomShow">
    <span>{{ $t("brightnessThreshold") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.threshold"
        :step="0.01"
        :min="0"
        :max="1"
      />
      <n-input-number
        v-model:value="state.threshold"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="1"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-show="state.bloomShow">
    <span>{{ $t("floodlightThreshold") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.bloomIntensity"
        :step="0.01"
        :min="0"
        :max="2"
      />
      <n-input-number
        v-model:value="state.bloomIntensity"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="2"
        placeholder=""
        size="small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";

type stateType = {
  bloomShow: boolean; // 是否开启泛光
  threshold: number; // 亮度阈值
  bloomIntensity: number; // 泛光强度
  showHeatMap: boolean;
};

let state = reactive<stateType>({
  bloomShow: viewer.scene.bloomEffect.show,
  threshold: viewer.scene.bloomEffect.threshold || 0.65,
  bloomIntensity: viewer.scene.bloomEffect.bloomIntensity || 1,
  showHeatMap: false,
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

</script>
