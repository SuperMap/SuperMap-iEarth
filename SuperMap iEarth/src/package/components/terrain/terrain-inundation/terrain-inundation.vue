<template>
  <!-- 淹没分析 -->
  <n-space vertical>
    <div class="terrain-inundation-container">
      <sm-rowLayOut>
        <template #item-lable>{{ locale.MaxVisibleHeight }}</template>
        <template #item-content>
          <n-input-number
            v-model:value="state.maxHeight"
            :show-button="false"
            :min="1"
            :max="10000"
          >
            <template #suffix>M</template>
          </n-input-number>
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.MinVisibleHeight }}</template>
        <template #item-content>
          <n-input-number
            v-model:value="state.minHeight"
            :bordered="false"
            :min="1"
            :max="10000"
            :show-button="false"
          >
            <template #suffix>M</template>
          </n-input-number>
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.CurrentHeight }}</template>
        <template #item-content>
          <n-input-number
            v-model:value="state.currentHeight"
            :bordered="false"
            :show-button="false"
          >
            <template #suffix>M</template>
          </n-input-number>
        </template>
      </sm-rowLayOut>
      <!-- 透明度 -->
      <sm-rowLayOut
        lableWidth="0.6rem"
        marginbottom="0.15rem"
        contentWidth="1.93rem"
        slotType="slider"
      >
        <template #item-lable>{{ locale.Transparency }}</template>
        <template #item-content-slider>
          <n-slider
            v-model:value="state.floodTrans"
            style="width: 100%"
            :min="0"
            :max="100"
          />
          <div style="font-size: 0.12rem; margin-left: 0.12rem">
            {{ state.floodTrans }}
          </div>
        </template>
      </sm-rowLayOut>
      <!-- 速度 -->
      <sm-rowLayOut
        lableWidth="0.6rem"
        marginbottom="0.15rem"
        contentWidth="1.93rem"
        slotType="slider"
      >
        <template #item-lable>{{ locale.Speed }}</template>
        <template #item-content-slider>
          <n-slider
            v-model:value="state.floodSpeed"
            style="width: 100%"
            :min="1"
            :max="2000"
          />
          <div style="font-size: 0.12rem; margin-left: 0.12rem">
            {{ state.floodSpeed }}
          </div>
        </template>
      </sm-rowLayOut>
    </div>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="floodBegin"
          >分析</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">清除</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import tool from "@/tools/tool";
import initHandler from "@/tools/drawHandler";
import locale from "@/tools/locateTemp";

const windowGlobal: any = window;
// 设置默认值数据
let state = reactive({
  maxHeight: 9000, //最大可见高程
  minHeight: 1000, //最小可见高程
  currentHeight: 1000, //当前高程
  floodSpeed: 800, //速度
  floodTrans: 80, //透明度
  cheackedBand: "band1", //当前选择颜色
  colorBandShow: false, //颜色下拉框显隐
});

// 初始化数据
let hypFlood = new Cesium.HypsometricSetting();
let floodColorTable = new Cesium.ColorTable();
colorTableInit(floodColorTable);
hypFlood.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
hypFlood._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
hypFlood.MinVisibleValue = state.minHeight;
hypFlood.MaxVisibleValue = 0;
hypFlood.ColorTableMinKey = 1;
hypFlood.ColorTableMaxKey = 9000;
hypFlood.ColorTable = floodColorTable;
hypFlood.Opacity = state.floodTrans;
hypFlood.LineInterval = 200.0;
let handlerPolygon, interval, floodPosition;

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
          Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
      };
    } catch (err) {
      console.log(err);
      clearInterval(interval);
    }
    currentH += Math.floor(state.floodSpeed) / 10;
  };
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
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
    };
  }
);

watch(
  () => state.minHeight,
  (val: any) => {
    hypFlood.MinVisibleValue = parseInt(val);
    if (!floodPosition) return (state.currentHeight = parseInt(val));
    viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: hypFlood,
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
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
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
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
          Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
      };
    }
  }
);

// 销毁
onBeforeUnmount(() => {
  clear();
  hypFlood.destroy();
  floodColorTable.destroy();
  hypFlood = undefined;
  floodColorTable = undefined;
});

// 默认设置淹没分析颜色插值
function colorTableInit(colorTable) {
  let colors = tool.gradientColors("#95E9F9", "#002794", 20, 0.8);
  colors.forEach((color, index) => {
    // 0-4500米颜色取值
    let h = 500 + 200 * index;
    colorTable.insert(h, Cesium.Color.fromCssColorString(color));
  });
  colorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255, 1));
  colorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255, 0.5));
}

// 其他淹没颜色色带
function colorBandsChange(val) {
  let floodColorTable = new Cesium.ColorTable();
  switch (val) {
    case "band1":
      floodColorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255));
      floodColorTable.insert(
        0,
        new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
      );
      break;
    case "band2":
      floodColorTable.insert(
        9000,
        new Cesium.Color(162 / 255, 251 / 255, 194 / 255)
      );
      floodColorTable.insert(0, new Cesium.Color(1, 103 / 255, 103 / 255));
      break;
    case "band3":
      floodColorTable.insert(9000, new Cesium.Color(230 / 255, 198 / 255, 1));
      floodColorTable.insert(0, new Cesium.Color(157 / 255, 0, 1));
      break;
    case "band4":
      floodColorTable.insert(
        9000,
        new Cesium.Color(210 / 255, 15 / 255, 15 / 255)
      );
      floodColorTable.insert(
        6000,
        new Cesium.Color(221 / 255, 224 / 255, 7 / 255)
      );
      floodColorTable.insert(
        5000,
        new Cesium.Color(20 / 255, 187 / 255, 18 / 255)
      );
      floodColorTable.insert(4000, new Cesium.Color(0, 161 / 255, 1));
      floodColorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 212 / 255));
      break;
    case "band5":
      floodColorTable.insert(9000, new Cesium.Color(186 / 255, 1, 229 / 255));
      floodColorTable.insert(
        0,
        new Cesium.Color(26 / 255, 185 / 255, 156 / 255)
      );
      break;
    default:
      floodColorTable.insert(9000, new Cesium.Color(0, 39 / 255, 148 / 255));
      floodColorTable.insert(
        0,
        new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
      );
      break;
  }
  return floodColorTable;
}
</script>

<style lang="scss" scoped>
.terrain-inundation-container {
  @include panelContainer(100%, 100%);
}
</style>

