<template>
  <div class="layerSeries-box">
    <div class="row-item">
      <span>{{ $t("chooseLayer") }}</span>
      <n-select
        style="width: 62%"
        v-model:value="state.selectedIndex"
        :options="state.s3mlayers"
      />
    </div>

    <div class="row-item">
      <span>{{ $t("renderMode") }}</span>
      <n-radio-group
        v-model:value="state.cullEnabled"
        name="operationType"
        class="radio-group"
      >
        <n-radio :value="true">{{ $t("singleRender") }}</n-radio>
        <n-radio :value="false">{{ $t("doubleRender") }}</n-radio>
      </n-radio-group>
    </div>

    <div class="row-item">
      <span>{{ $t("showShadow") }}</span>
      <n-switch
        v-model:value="state.shadowMode"
        size="small"
        style="width: 62%; justify-content: left"
      />
    </div>

    <div class="row-item">
      <span>{{ $t("shadowBrightness") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.shadowDarkness"
          style="width: 70%"
          :step="0.05"
          :min="0"
          :max="1"
        />
        <n-input-number
          v-model:value="state.shadowDarkness"
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

    <div class="row-item">
      <span>{{ $t("objectHiding") }}</span>
      <n-select
        v-model:value="state.visibility"
        style="width: 62%"
        :options="state.visibilityMode"
      />
    </div>

    <div class="row-item" style="justify-content: left; margin-left: 38%">
      <n-checkbox v-model:checked="state.multiChoose">{{
        $t("multiple")
      }}</n-checkbox>
      <!-- <n-checkbox v-model:checked="state.selectEnabled">是否可选</n-checkbox> -->
      <!-- <n-checkbox v-model:checked="state.cullEnabled">双面渲染</n-checkbox> -->
    </div>

    <div class="row-item">
      <span>{{ $t("MinVisibleDistance") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.visibleDistanceMin"
          style="width: 70%"
          :step="10"
          :min="-100"
          :max="20000"
        />
        <div class="row-slider-num" style="width: 0.5rem">
          <span>{{ state.visibleDistanceMin }}</span
          ><span>{{ $t("meter") }}</span>
        </div>
      </div>
    </div>

    <div class="row-item" style="margin-bottom: 0px">
      <span>{{ $t("MaxVisibleDistance") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.visibleDistanceMax"
          style="width: 70%"
          :step="10"
          :min="-100"
          :max="20000"
        />
        <div class="row-slider-num" style="width: 0.5rem">
          <span>{{ state.visibleDistanceMax }}</span
          ><span>{{ $t("meter") }}</span>
        </div>
      </div>
    </div>
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
  shadowMode: number;
  shadowDarkness: number;
  selectEnabled: boolean;
  multiChoose: boolean;
  cullEnabled: boolean;
  visibility: number;
  visibilityMode: any;
  visibleDistanceMin: number; //最小可见距离
  visibleDistanceMax: number; //最大可见距离
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
  shadowMode: 0,
  shadowDarkness: 0.2,
  selectEnabled: true,
  multiChoose: false,
  cullEnabled: false,
  visibility: 2,
  visibleDistanceMin: 0, //最小可见距离
  visibleDistanceMax: 12000, //最大可见距离
  visibilityMode: [
    { label: () => $t("disPlayAll"), value: 2 },
    { label: () => $t("disPlaySelected"), value: 0 },
    { label: () => $t("hideSelected"), value: 1 },
  ],
});
let layers: any;

function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  layers[state.selectedIndex].selectEnabled = true;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {});

// 获取当前图层的属性值
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
  state.shadowMode = SuperMap3D.defaultValue(
    selectLayer.shadowMode,
    SuperMap3D.ShadowType.NONE
  );
  state.shadowDarkness = SuperMap3D.defaultValue(
    selectLayer.shadowDarkness,
    0.3
  );
  state.selectEnabled = SuperMap3D.defaultValue(
    selectLayer.selectEnabled,
    true
  );
  state.multiChoose = SuperMap3D.defaultValue(selectLayer.multiChoose, false);
  state.cullEnabled = SuperMap3D.defaultValue(selectLayer.cullEnabled, false);
  state.visibility = SuperMap3D.defaultValue(selectLayer.visibility, 2);
  state.visibleDistanceMin = SuperMap3D.defaultValue(
    selectLayer.visibleDistanceMin,
    0
  );
  state.visibleDistanceMax = SuperMap3D.defaultValue(
    selectLayer.visibleDistanceMax,
    12000
  );
  if (state.visibleDistanceMax > 20000) {
    state.visibleDistanceMax = 20000;
  }
}

// 更新图层
function updateLayers() {
  layers = viewer.scene.layers.layerQueue;
  if (!layers || layers.length < 1) {
    state.s3mlayers = [{ label: () => $t("noLayer"), value: 0 }];
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
  layers[state.selectedIndex].selectEnabled = true;
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
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].brightness = Number(val);
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
  () => state.shadowMode,
  (val) => {
    if (layers[state.selectedIndex])
      if (val) {
        viewer.shadows = true;
        layers[state.selectedIndex].shadowType = SuperMap3D.ShadowType.ALL; // SELECTION
      } else {
        viewer.shadows = false;
        layers[state.selectedIndex].shadowType = SuperMap3D.ShadowType.NONE;
      }
  }
);
watch(
  () => state.shadowDarkness,
  (val) => {
    viewer.shadowMap.darkness = 1 - Number(val); // 相当于取反了
    // viewer.shadowMap.darkness = Number(val);
  }
);
watch(
  () => state.multiChoose,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].multiChoose = val;
  }
);
watch(
  () => state.selectEnabled,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].selectEnabled = val;
  }
);
watch(
  () => state.cullEnabled,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].cullEnabled = val;
  }
);
watch(
  () => state.visibleDistanceMin,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].visibleDistanceMin = Number(val);
  }
);
watch(
  () => state.visibleDistanceMax,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].visibleDistanceMax = Number(val);
  }
);
watch(
  () => state.visibility,
  (val) => {
    if (layers[state.selectedIndex])
      switch (val) {
        case 2:
          layers[state.selectedIndex].setObjsVisible([], false);
          break;
        case 1:
          let chooseIDs = layers[state.selectedIndex].getSelection();
          layers[state.selectedIndex].setObjsVisible(chooseIDs, false);
          break;
        case 0:
          let chooseIDs2 = layers[state.selectedIndex].getSelection();
          layers[state.selectedIndex].setObjsVisible(chooseIDs2, true);
          break;
        default:
          null;
          break;
      }
  }
);
watch(
  () => layerStore.s3mLayerSelectIndex,
  (val) => {
    // reset();
    state.selectedIndex = Number(val);
  }
);
</script>

<style lang="scss" scoped>
.layerSeries-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 0.2rem;
}
</style>
