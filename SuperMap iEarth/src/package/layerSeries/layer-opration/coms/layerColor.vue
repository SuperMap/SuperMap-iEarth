<template>
  <div class="row-item">
    <span>{{ $t("brightness") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.brightness"
        style="width: 70%"
        :step="0.05"
        :min="0"
        :max="3"
      />
      <n-input-number
        v-model:value="state.brightness"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="3"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("contrastRatio") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.contrast"
        style="width: 70%"
        :step="0.05"
        :min="0"
        :max="3"
      />
      <n-input-number
        v-model:value="state.contrast"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="3"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("colorTone") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.hue"
        style="width: 70%"
        :step="0.05"
        :min="0"
        :max="3"
      />
      <n-input-number
        v-model:value="state.hue"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="3"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("saturation") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.saturation"
        style="width: 70%"
        :step="0.05"
        :min="0"
        :max="3"
      />
      <n-input-number
        v-model:value="state.saturation"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="3"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("gamma") }}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.gamma"
        style="width: 70%"
        :step="0.05"
        :min="0"
        :max="3"
      />
      <n-input-number
        v-model:value="state.saturation"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="3"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="btn-row-item" style="margin-left: 0.83rem">
    <n-button @click="reset">{{ $t("reset") }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
const layerStore = useLayerStore();

type StateType = {
  s3mlayers: any;
  selectedIndex: number; //默认选择图层index
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  gamma: number;
};

// 初始化变量
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedIndex: 0, //默认选择图层index
  brightness: 1,
  contrast: 1,
  hue: 0,
  saturation: 1,
  gamma: 1,
});

let layers;

function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  reset();
});

function updateLayers() {
  layers = viewer.scene.layers.layerQueue;
  if (!layers || layers.length < 1) {
    state.s3mlayers = [{ label: () => "暂无图层", value: 0 }];
    return;
  }
  state.s3mlayers.length = 0;
  layers.forEach((layer, index) => {
    let name = layer._name;
    state.s3mlayers.push({
      label: name,
      value: index,
    });
  });
  if (state.selectedIndex > layers.length - 1) state.selectedIndex = 0;
}

function getAttributes() {
  if (
    !SuperMap3D.defined(layers) ||
    !SuperMap3D.defined(layers[state.selectedIndex])
  )
    return;
  let selectLayer = layers[state.selectedIndex];
  state.brightness = SuperMap3D.defaultValue(selectLayer.brightness, 1);
  state.contrast = SuperMap3D.defaultValue(selectLayer.contrast, 1);
  state.hue = SuperMap3D.defaultValue(selectLayer.hue, 0);
  state.saturation = SuperMap3D.defaultValue(selectLayer.saturation, 1);
  state.gamma = SuperMap3D.defaultValue(selectLayer.gamma, 1);
}

function reset() {
  let selectLayer = layers[state.selectedIndex];

  selectLayer.brightness = 1;
  selectLayer.contrast = 1;
  selectLayer.hue = 0;
  selectLayer.saturation = 1;
  selectLayer.gamma = 1;

  state.brightness = 1;
  state.contrast = 1;
  state.hue = 0;
  state.saturation = 1;
  state.gamma = 1;

  selectLayer.refresh();
}

// 监听
watch(
  () => layerStore.layerChangeCount,
  () => {
    updateLayers();
  }
);
watch(
  () => state.selectedIndex,
  () => {
    getAttributes();
  }
);
watch(
  () => state.brightness,
  (val) => {
    if (layers[state.selectedIndex]) {
      layers[state.selectedIndex].brightness = Number(val);
    }
  }
);
watch(
  () => state.contrast,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].contrast = Number(val);
  }
);
watch(
  () => state.hue,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].hue = Number(val);
  }
);
watch(
  () => state.saturation,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].saturation = Number(val);
  }
);
watch(
  () => state.gamma,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].gamma = Number(val);
  }
);
watch(
  () => layerStore.s3mLayerSelectIndex,
  (val) => {
    reset();
    state.selectedIndex = Number(val);
  }
);
</script>
