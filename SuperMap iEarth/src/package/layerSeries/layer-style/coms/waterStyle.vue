<template>
  <div class="row-item">
    <span>{{ $t("waterRange") }}</span>
    <n-select style="width: 1.96rem" @update:value="handleSelectSize" v-model:value="state.sizeValue"
      :options="state.sizeOptions" />
  </div>
  <div class="row-item">
    <span>{{ $t("waterIntensity") }}</span>
    <n-select style="width: 1.96rem" @update:value="handleSelectWave" v-model:value="state.waveValue"
      :options="state.waveOptions" />
  </div>

  <div class="row-item" style="margin-right: 0.1rem">
    <span>{{ $t("waterDirection") }}</span>
    <n-checkbox v-model:checked="state.openwaveDirection" style="margin-right: -0.4rem;"></n-checkbox>
    <div class="slider-box" style="margin-right: -0.1rem; width: 1.5rem;">
      <n-slider style="width: 1.5rem" v-model:value="state.direction" :step="1" :min="0" :max="360"
        :disabled="!state.openwaveDirection" />
      <n-input-number v-model:value="state.direction" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0" :max="360" placeholder="" :disabled="!state.openwaveDirection"
        size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("waterColor") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker v-model:value="state.color" :render-label="() => {
        return '';
      }
        " size="small"></n-color-picker>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive } from "vue";
import tool from "@/tools/tool";

// 传参并监听
const props = defineProps({
  selectS3MLayerName: String
});

const viewer = window.viewer;

type StateType = {
  direction: number;// 水流方向
  color: string; // 水面颜色
  sizeValue: number;
  sizeOptions: any; // 水域范围
  waveOptions: any; // 波纹强度
  waveValue: number;
  openwaveDirection: boolean
};

// 开启地下
const state = reactive<StateType>({
  direction: 0,
  color: "rgba(66,126,120,1.0)",
  sizeValue: 0,
  sizeOptions: [
    { label: () => $t('lessRange'), value: 0 },
    { label: () => $t('mediumRange'), value: 1 },
    { label: () => $t('widerRange'), value: 2 },
  ],
  waveValue: 0,
  waveOptions: [
    { label: () => $t('peaceWave'), value: 0 },
    { label: () => $t('microWave'), value: 1 },
    { label: () => $t('mediumWave'), value: 2 },
    { label: () => $t('widerWave'), value: 3 },
  ],
  openwaveDirection: true
})

let selectLayer: any = undefined;

onMounted(() => {
  let s3mLayerName = props.selectS3MLayerName;
  selectLayer = viewer.scene.layers.find(s3mLayerName);
  updateStateValue(selectLayer);
});

function handleSelectSize(value) {
  if (selectLayer && selectLayer.waterParameter) {
    selectLayer.waterParameter.waterbodySize = value;
  }
}

function handleSelectWave(value) {
  if (selectLayer && selectLayer.waterParameter) {
    selectLayer.waterParameter.waveStrength = value;
  }
}

// 更新State
function updateStateValue(selectLayer) {
  if (selectLayer && selectLayer.waterParameter) {
    const waterParameter = selectLayer.waterParameter;
    state.direction = waterParameter.waveDirection || 0;
    state.color = tool.rgbaToCssString(waterParameter.color) || "rgba(66,126,120,1.0)";
    state.sizeValue = waterParameter.waterbodySize || 0;
    state.waveValue = waterParameter.waveStrength || 0;

    handleSelectSize(state.sizeValue);
    handleSelectWave(state.waveValue);
  } else {
    state.direction = 0;
    state.color = "rgba(66,126,120,1.0)";
    state.sizeValue = 0;
    state.waveValue = 0;
  }
}

watch(
  () => props.selectS3MLayerName,
  (val) => {
    if (val) {
      selectLayer = viewer.scene.layers.find(val);
      updateStateValue(selectLayer);
    }
  }
);
watch(
  () => state.color,
  (val) => {
    if (selectLayer && selectLayer.waterParameter) {
      selectLayer.waterParameter.color = SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.direction,
  (val) => {
    if (selectLayer && selectLayer.waterParameter) {
      selectLayer.waterParameter.waveDirection = val;
    }
  }
);
watch(
  () => state.openwaveDirection,
  (val) => {
    if (selectLayer && selectLayer.waterParameter) {
      if(val) {
        selectLayer.waterParameter.waveDirection= state.direction; 
      }else{
        selectLayer.waterParameter.waveDirection= null; 
      }
    }
  }
);
</script>
