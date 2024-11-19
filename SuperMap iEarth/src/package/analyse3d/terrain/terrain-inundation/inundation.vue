<template>
  <!-- 淹没分析 -->
  <div class="row-item">
    <span>{{ $t("maximumVisibleElevation") }}</span>
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
    <span>{{ $t("minimumVisibleElevation") }}</span>
    <n-input-number
      v-model:value="state.minHeight"
      style="width: 1.96rem"
      :bordered="false"
      :min="1"
      :max="state.maxHeight-1"
      :show-button="false"
    >
      <template #suffix>{{ $t("meter") }}</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t("currentElevation") }}</span>
    <n-input-number
      style="width: 1.96rem"
      v-model:value="state.currentHeight"
      disabled
      :bordered="false"
      :show-button="false"
    >
      <template #suffix>{{ $t("meter") }}</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t("transparency") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.floodTrans"
        :step="0.01"
        :min="0"
        :max="1"
      />
      <n-input-number
        v-model:value="state.floodTrans"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="100"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("inundationSpeed") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1rem"
        v-model:value="state.floodSpeed"
        :step="10"
        :min="1"
        :max="2000"
      />
      <n-input-number
        v-model:value="state.floodSpeed"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        placeholder=""
        size="small"
        style="width: 31%"
      />
      <span style="width: 0.4rem">{{ $t("meterSecond") }}</span>
    </div>
  </div>

  <div class="btn-row-item">
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
import tool from "@/tools/tool";
import initHandler from "@/tools/drawHandler";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

type stateType = {
  maxHeight: number; //最大可见高程
  minHeight: number; //最小可见高程
  currentHeight: number; //当前高程
  floodSpeed: number; //速度
  floodTrans: number; //透明度
  cheackedBand: string; //当前选择颜色
  colorBandShow: boolean; //颜色下拉框显隐
};

// 设置默认值数据
let state = reactive<stateType>({
  maxHeight: 9000, //最大可见高程
  minHeight: 1000, //最小可见高程
  currentHeight: 1000, //当前高程
  floodSpeed: 800, //速度
  floodTrans: 0.5, //透明度
  cheackedBand: "band1", //当前选择颜色 "rgb(16, 30, 222)"
  colorBandShow: false, //颜色下拉框显隐
});

// 初始化变量
const windowGlobal: any = window;
let handlerPolygon, interval, floodPosition;
let hypFlood = new SuperMap3D.HypsometricSetting();
let floodColorTable = new SuperMap3D.ColorTable();

onMounted(() => {
  colorTableInit(floodColorTable);
  hypFlood.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.FACE;
  hypFlood._lineColor = new SuperMap3D.Color(1.0, 0.0, 0.0, 1.0);
  hypFlood.MinVisibleValue = state.minHeight;
  hypFlood.MaxVisibleValue = 0;
  hypFlood.ColorTableMinKey = 1;
  hypFlood.ColorTableMaxKey = 9000;
  hypFlood.ColorTable = floodColorTable;
  hypFlood.Opacity = state.floodTrans;
  hypFlood.LineInterval = 200.0;
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
  let colors = tool.gradientColors("#95E9F9", "#002794", 20, 0.8);
  colors.forEach((color, index) => {
    // 0-4500米颜色取值
    let h = 500 + 200 * index;
    colorTable.insert(h, SuperMap3D.Color.fromCssColorString(color));
  });
  colorTable.insert(9000, new SuperMap3D.Color(0, 39 / 255, 148 / 255, 1));
  colorTable.insert(
    0,
    new SuperMap3D.Color(149 / 255, 232 / 255, 249 / 255, 0.5)
  );
}

// 其他淹没颜色色带
function colorBandsChange(val: string) {
  let floodColorTable = new SuperMap3D.ColorTable();
  switch (val) {
    case "band1":
      floodColorTable.insert(
        9000,
        new SuperMap3D.Color(0, 39 / 255, 148 / 255)
      );
      floodColorTable.insert(
        0,
        new SuperMap3D.Color(149 / 255, 232 / 255, 249 / 255)
      );
      break;
    case "band2":
      floodColorTable.insert(
        9000,
        new SuperMap3D.Color(162 / 255, 251 / 255, 194 / 255)
      );
      floodColorTable.insert(0, new SuperMap3D.Color(1, 103 / 255, 103 / 255));
      break;
    case "band3":
      floodColorTable.insert(
        9000,
        new SuperMap3D.Color(230 / 255, 198 / 255, 1)
      );
      floodColorTable.insert(0, new SuperMap3D.Color(157 / 255, 0, 1));
      break;
    case "band4":
      floodColorTable.insert(
        9000,
        new SuperMap3D.Color(210 / 255, 15 / 255, 15 / 255)
      );
      floodColorTable.insert(
        6000,
        new SuperMap3D.Color(221 / 255, 224 / 255, 7 / 255)
      );
      floodColorTable.insert(
        5000,
        new SuperMap3D.Color(20 / 255, 187 / 255, 18 / 255)
      );
      floodColorTable.insert(4000, new SuperMap3D.Color(0, 161 / 255, 1));
      floodColorTable.insert(
        0,
        new SuperMap3D.Color(9 / 255, 9 / 255, 212 / 255)
      );
      break;
    case "band5":
      floodColorTable.insert(
        9000,
        new SuperMap3D.Color(186 / 255, 1, 229 / 255)
      );
      floodColorTable.insert(
        0,
        new SuperMap3D.Color(26 / 255, 185 / 255, 156 / 255)
      );
      break;
    default:
      floodColorTable.insert(
        9000,
        new SuperMap3D.Color(0, 39 / 255, 148 / 255)
      );
      floodColorTable.insert(
        0,
        new SuperMap3D.Color(149 / 255, 232 / 255, 249 / 255)
      );
      break;
  }
  return floodColorTable;
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  viewer.scene.globe.HypsometricSetting = undefined;
  clearInterval(interval);
  floodPosition = null;
}

//监听
watch(
  () => state.floodTrans,
  (val: any) => {
    hypFlood.Opacity = parseFloat(val);
    if (!floodPosition) return;
    viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode:
        SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
    };
  }
);
watch(
  () => state.minHeight,
  (val: any) => {
    const checkeResult = inputRuleCheck(val, RuleCheckTypeEnum.Number);
    if (!checkeResult.isPass) { 
      window["$message"].warning(checkeResult.message); 
      state.minHeight = val = 1000;
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
      state.maxHeight = val = 9000;
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
  () => state.cheackedBand,
  (val: any) => {
    floodColorTable = colorBandsChange(val);
    hypFlood.ColorTable = floodColorTable;
    if (!floodPosition) return;
    if (interval) {
      viewer.scene.globe.HypsometricSetting = {
        hypsometricSetting: hypFlood,
        analysisMode:
          SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
      };
    }
  }
);
</script>
