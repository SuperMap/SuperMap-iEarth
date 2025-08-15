<!-- S3M图层淹没分析 -->
<template>
  <!-- 最大可见高程 -->
  <div class="row-wrap">
    <div class="label">{{ $t("maximumVisibleElevation") }}</div>
    <div class="content">
      <n-input-number v-model:value="state.maxHeight" :show-button="false" :min="1" :max="10000">
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>
  </div>

  <!-- 最小可见高程 -->
  <div class="row-wrap">
    <div class="label">{{ $t("minimumVisibleElevation") }}</div>
    <div class="content">
      <n-input-number v-model:value="state.minHeight" :bordered="false" :min="-20" :max="10000" :show-button="false">
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>
  </div>

  <!-- 淹没速度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("inundationSpeed") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider class="shorter" v-model:value="state.floodSpeed" :step="1" :min="1" :max="100" />
        <n-input-number v-model:value="state.floodSpeed" :update-value-on-input="false" :bordered="false"
          :show-button="false" placeholder="" size="small" style="width: 31%" />
        <span style="width: 0.6rem">{{ $t("meterSecond") }}</span>
      </div>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="floodBegin" class="operate" type="info" :focusable="false">{{
    $t("analysis") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import DrawHandler from "@/lib/DrawHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  maxHeight: number; //最大可见高程
  minHeight: number; //最小可见高程
  currentHeight: number; //当前高程
  floodSpeed: number; //速度
};

// 设置默认值数据
let state = reactive<stateType>({
  maxHeight: 300, //最大可见高程
  minHeight: -10, //最小可见高程
  currentHeight: 0, //当前高程
  floodSpeed: 20, //速度
});

// 初始化变量
const windowGlobal: any = window;
let interval, floodPosition;
let hypFlood = new SuperMap3D.HypsometricSetting();
let floodColorTable = new SuperMap3D.ColorTable();
let currentS3MLayer:any = undefined;

function init() {
  const selectS3MName = window.iEarthBindData.CurrentS3MLayerName;
  currentS3MLayer = viewer.scene.layers.find(selectS3MName);
  if(!currentS3MLayer) return;
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
async function floodBegin() {
  const positions_c3 = await drawHandler.startPolygon();
  let positions = window.iEarthTool.Cartesian3ToDegreeArray(positions_c3);
  floodUpdate(positions);
  floodPosition = positions;
}

// 更新
function floodUpdate(positions: any) {
  let currentH = Math.floor(state.minHeight);
  hypFlood.CoverageArea = positions;
  interval = setInterval("flood()", 100);
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
    currentS3MLayer.hypsometricSetting = {
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
  drawHandler.destroy();
  viewer.scene.globe.HypsometricSetting = undefined;
  clearInterval(interval);
  floodPosition = null;

  hypFlood.MaxVisibleValue = -1000;
  state.currentHeight = 0;

  // 指定图层
  currentS3MLayer.hypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
  };
}

//监听
watch(
  () => state.minHeight,
  (val: any) => {
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
    hypFlood.MaxVisibleValue = parseInt(val);
    if (!floodPosition) return;
    viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode:
        SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
    };
  }
);
</script>

<style lang="scss" scoped>
:deep(.shorter) .n-slider-rail {
  width: 2rem !important;
}
</style>