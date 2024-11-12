<template>
  <!-- 淹没分析 -->
  <div class="row-item">
    <div>{{ $t("maximumVisibleElevation") }}</div>
    <n-input-number
      v-model:value="state.maxHeight"
      style="width: 1.96rem"
      :show-button="false"
      :min="1"
      :max="10000"
    >
      <template #suffix>{{ $t("meter") }}</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <div>{{ $t("minimumVisibleElevation") }}</div>
    <n-input-number
      v-model:value="state.minHeight"
      style="width: 1.96rem"
      :bordered="false"
      :min="-20"
      :max="10000"
      :show-button="false"
    >
      <template #suffix>{{ $t("meter") }}</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t("inundationSpeed") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 70%"
        v-model:value="state.floodSpeed"
        :step="1"
        :min="1"
        :max="100"
      />
      <div class="row-slider-num" style="width: 0.6rem">
        <span>{{ state.floodSpeed }}</span
        ><span>{{ $t("meterSecond") }}</span>
      </div>
    </div>
  </div>

  <div class="btn-row-item" style="margin-left: 0.83rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="floodBegin"
      style="margin-right: 0.1rem"
      >{{ $t("analysis") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

const layerStore = useLayerStore();

type stateType = {
  maxHeight: number; //最大可见高程
  minHeight: number; //最小可见高程
  currentHeight: number; //当前高程
  floodSpeed: number; //速度
  selectedIndex: number; //默认选择图层index
};

// 设置默认值数据
let state = reactive<stateType>({
  maxHeight: 300, //最大可见高程
  minHeight: -10, //最小可见高程
  currentHeight: 0, //当前高程
  floodSpeed: 20, //速度
  selectedIndex: 0, //默认选择图层index
});

// 初始化变量
const windowGlobal: any = window;
let handlerPolygon, interval, floodPosition, layers;
let hypFlood = new SuperMap3D.HypsometricSetting();
let floodColorTable = new SuperMap3D.ColorTable();

function init() {
  colorTableInit(floodColorTable);
  hypFlood.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.FACE;
  hypFlood._lineColor = new SuperMap3D.Color(1.0, 0.0, 0.0, 1.0);
  hypFlood.MinVisibleValue = state.minHeight;
  hypFlood.MaxVisibleValue = 0;
  hypFlood.ColorTableMinKey = 1;
  hypFlood.ColorTableMaxKey = 9000;
  hypFlood.Opacity = 0.5;
  hypFlood.ColorTable = floodColorTable;
  hypFlood.LineInterval = 200.0;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
  hypFlood.destroy();
  floodColorTable.destroy();
  hypFlood = undefined;
  floodColorTable = undefined;
});

// 开始淹没分析
function floodBegin() {
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let positions = tool.CartesiantoDegrees(res.object.positions);
      floodUpdate(positions);
      floodPosition = positions;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

// 更新
function floodUpdate(positions: any) {
  let currentH = Math.floor(state.minHeight);
  hypFlood.CoverageArea = positions;
  interval = setInterval("flood()", 100);
  layers = viewer.scene.layers.layerQueue;
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  windowGlobal.flood = () => {
    if (currentH <= state.maxHeight) {
      state.currentHeight = Math.floor(currentH);
    }
    if (currentH > state.maxHeight) {
      state.currentHeight = state.maxHeight;
      clearInterval(interval);
      return;
    }
    hypFlood.MaxVisibleValue = currentH;

    // 指定图层
    // viewer.scene.layers._layerQueue.forEach - 全部图层
    layers[state.selectedIndex].hypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode:
        SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
    };

    try {
      viewer.scene.globe.HypsometricSetting = {
        hypsometricSetting: hypFlood,
        analysisMode:
          SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
      };
    } catch (err) {
      console.log(err);
      clearInterval(interval);
    }
    currentH += Math.floor(state.floodSpeed) / 10;
  };
}

// 默认设置淹没分析颜色插值
function colorTableInit(colorTable: any) {
  colorTable.insert(71, new SuperMap3D.Color(0, 39 / 255, 148 / 255));
  colorTable.insert(0, new SuperMap3D.Color(149 / 255, 232 / 255, 249 / 255));
}

// 设置colorTable
/** 
   let colors = tool.gradientColors("#95E9F9", "#002794", 20, 0.8);
   colors.forEach((color, index) => {
    // 0-4500米颜色取值
    let h = 500 + 200 * index;
    colorTable.insert(h, SuperMap3D.Color.fromCssColorString(color));
   });
*/

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  viewer.scene.globe.HypsometricSetting = undefined;
  clearInterval(interval);
  floodPosition = null;

  hypFlood.MaxVisibleValue = -1000;
  state.currentHeight = 0;

  // 指定图层
  if (layers) {
    layers[state.selectedIndex].hypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode:
        SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
    };
  }
}

//监听
watch(
  () => state.minHeight,
  (val: any) => {
    const checkeResult = inputRuleCheck(val, RuleCheckTypeEnum.Number);
    if (!checkeResult.isPass) { 
      window["$message"].warning(checkeResult.message); 
      state.minHeight = val = -10;
    };
    hypFlood.MinVisibleValue = parseInt(val);
    if (!floodPosition) return (state.currentHeight = parseInt(val));
    viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode:
        SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
    };
  }
);
watch(
  () => state.maxHeight,
  (val: any) => {
    const checkeResult = inputRuleCheck(val, RuleCheckTypeEnum.Number);
    if (!checkeResult.isPass) { 
      window["$message"].warning(checkeResult.message); 
      state.maxHeight = val = 300;
    };
    hypFlood.MaxVisibleValue = parseInt(val);
    if (!floodPosition) return;
    viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode:
        SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
    };
  }
);
watch(
  () => layerStore.s3mLayerSelectIndex,
  (val) => {
    state.selectedIndex = Number(val);
    // reset();
  }
);
</script>
