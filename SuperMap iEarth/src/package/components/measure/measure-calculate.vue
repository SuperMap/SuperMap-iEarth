<template>
  <n-space vertical>
    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>量算模式</template>
      <template #item-content>
        <n-select
          v-model:value="state.measureMode"
          :options="state.options"
          @update:value="update_mode"
        />
      </template>
    </sm-rowLayOut>

    <div class="icon-container">
      <div class="icon-list">
        <span
          v-for="(line, index) in state.itemOptions"
          :key="index"
          :title="line.lable"
          class="icon-span"
          :class="line.isSelect ? 'is-select' : ''"
          @click="btnClick(line)"
        >
          <svg-icon :name="line.iconName" class="icon-size" />
        </span>
      </div>
    </div>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-content>
        <n-checkbox
          @update:checked="openPickPoint"
          :default-checked="state.pickPointEnabled"
        >
          顶点捕捉
        </n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-show="state.currentItemIndex === 3">
      <template #item-content>
        <n-checkbox
          @update:checked="update_showDVH"
          :default-checked="state.isShowLine"
        >
          等高线
        </n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="StartMeasure"
          >测量</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">清除</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import tool from "@/tools/tool";
import locale from "@/tools/locateTemp";
import { GlobalStoreCreate } from "@/store/global/global";
import { storeToRefs } from "pinia";

const GlobalStore = GlobalStoreCreate();
const { isViewer, SceneLayerChangeCount } = storeToRefs(GlobalStore);

let state = reactive({
  measureMode: "Space", //测量模式
  clampMode: Cesium.ClampMode.Space, //贴地模式
  Ellipsoid: null, //椭球选择
  contourColor: "#ff7d00", //等高线颜色
  isShowLine: true, //显示等高线
  pickPointEnabled: false, //开启顶点捕捉
  currentItemIndex: 1,
  options: [
    {
      label: () => locale.SpaceMeasure,
      value: "Space",
    },
    {
      label: () => locale.LandMeasure,
      value: "Ground",
    },
    {
      label: () => locale.CGCS2000,
      value: "CGCS2000",
    },
    {
      label: () => locale.XIAN80,
      value: "XIAN80",
    },
    {
      label: () => locale.WGS84,
      value: "WGS84",
    },
    {
      label: () => locale.PlaneProjection,
      value: "null",
    },
  ],
  itemOptions: [
    {
      id: 1,
      lable: "测量距离",
      iconName: "measure-distence",
      isSelect: true,
    },
    {
      id: 2,
      lable: "测量面积",
      iconName: "measure-Aear",
      isSelect: false,
    },
    {
      id: 3,
      lable: "测量高度",
      iconName: "measure-altitude",
      isSelect: false,
    },
  ],
});

// 改变当前item索引
function btnClick(item: any) {
  state.currentItemIndex = item.id;
  for (let i = 0; i < state.itemOptions.length; i++) {
    if (state.itemOptions[i].id == item.id) {
      state.itemOptions[i].isSelect = true;
    } else {
      state.itemOptions[i].isSelect = false;
    }
  }
}

// 初始化数据
let layers,
  handlerDis,
  handlerArea,
  handlerHeight,
  isoline,
  lineHeight,
  setHypFlag;
// height_0 = 0;
// 等高线
isoline = new Cesium.HypsometricSetting();
isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
let colorTable = new Cesium.ColorTable();
isoline._lineColor = Cesium.Color.fromCssColorString(state.contourColor);
isoline.ColorTable = colorTable;
isoline.Opacity = 0.6;
isoline.MaxVisibleValue = -100;
isoline.MinVisibleValue = -100;

//监听图层改变
watch(SceneLayerChangeCount, (val) => {
  setHypsometricSetting();
});
//viewer 初始化完成的监听
watch(isViewer, (val) => {
  if (val) init();
});

function init() {
  if (!viewer) return;
  layers = viewer.scene.layers.layerQueue;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: isoline,
    analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
  };
  if (SceneLayerChangeCount) {
    setHypsometricSetting();
  }

  handlerDis = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Distance,
    state.clampMode
  );
  handlerArea = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Area,
    state.clampMode
  );
  handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);

  //初始化测量距离
  handlerDis.activeEvt.addEventListener((isActive) => {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      document.body.classList.add("measureCur");
      viewer.scene.pickPointEnabled = state.pickPointEnabled;
    } else {
      viewer.enableCursorStyle = true;
      document.body.classList.remove("measureCur");
      viewer.scene.pickPointEnabled = false;
    }
  });

  //注册测距功能事件
  handlerDis.measureEvt.addEventListener((result) => {
    let dis = Number(result.distance);
    let mode = state.measureMode;
    if (mode == "CGCS2000" || mode == "XIAN80" || mode == "WGS84") {
      dis = Number(calcClampDistance(result.positions));
    }
    let distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
    handlerDis.disLabel.text = "距离:" + distance;
  });

  //初始化测量面积
  handlerArea.activeEvt.addEventListener((isActive) => {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      document.body.classList.add("measureCur");
      viewer.scene.pickPointEnabled = state.pickPointEnabled;
    } else {
      viewer.enableCursorStyle = true;
      document.body.classList.remove("measureCur");
      viewer.scene.pickPointEnabled = false;
    }
  });

  handlerArea.measureEvt.addEventListener((result) => {
    let mj = Number(result.area);
    let mode = state.measureMode;
    if (mode == "CGCS2000" || mode == "XIAN80" || mode == "WGS84") {
      mj = Number(calcClampValue(result.positions));
    } else if (mode == "6") {
      mj = Number(calcAreaWithoutHeight(result.positions));
    }
    let area =
      mj > 1000000 ? (mj / 1000000).toFixed(2) + "km²" : mj.toFixed(2) + "㎡";
    handlerArea.areaLabel.text = "面积:" + area;
  });

  // let point1, point2;
  //初始化测量高度
  handlerHeight.measureEvt.addEventListener((result) => {
    let distance =
      result.distance > 1000
        ? (result.distance / 1000).toFixed(2) + "km"
        : result.distance + "m";
    let vHeight =
      result.verticalHeight > 1000
        ? (result.verticalHeight / 1000).toFixed(2) + "km"
        : result.verticalHeight + "m";
    let hDistance =
      result.horizontalDistance > 1000
        ? (result.horizontalDistance / 1000).toFixed(2) + "km"
        : result.horizontalDistance + "m";
    handlerHeight.disLabel.text = "空间距离:" + distance;
    handlerHeight.vLabel.text = "垂直高度:" + vHeight;
    handlerHeight.hLabel.text = "水平距离:" + hDistance;
    //实时等高线显示
    lineHeight = Number(result.endHeight);
    if (state.isShowLine) updateContourLine(lineHeight);
  });

  handlerHeight.activeEvt.addEventListener((isActive) => {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = "";
      document.body.classList.add("measureCur");
      viewer.scene.pickPointEnabled = state.pickPointEnabled;
    } else {
      viewer.enableCursorStyle = true;
      document.body.classList.remove("measureCur");
      viewer.scene.pickPointEnabled = false;
    }
  });
}

init();

// 开始测量
function StartMeasure() {
  deactiveAll();

  switch (state.currentItemIndex) {
    case 1:
      MeasureDistance();
      break;
    case 2:
      MeasureArea();
      break;
    case 3:
      // if(!setHypFlag.value)  setHypsometricSetting()
      MeasureHeight();
      break;
    default:
      console.log("请选择测量方式");
  }
}

// 初始化设置图层等高线
function setHypsometricSetting() {
  if (!layers) return;
  for (let i = 0; i < layers.length; i++) {
    layers[i].hypsometricSetting = {
      hypsometricSetting: isoline,
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
    };
  }
  setHypFlag = true;
}

// 分析
//椭球贴地距离
function calcClampDistance(positions) {
  let lonlat: any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
    let lon = Cesium.Math.toDegrees(cartographic.longitude);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    lonlat.push(lon, lat);
  }
  let gemetry = new Cesium.PolylineGeometry({
    positions: Cesium.Cartesian3.fromDegreesArray(lonlat),
  });
  return viewer.scene.globe.computeSurfaceDistance(gemetry, state.Ellipsoid);
}

//椭球贴地面积
function calcClampValue(positions) {
  let lonlat: any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
    let lon = Cesium.Math.toDegrees(cartographic.longitude);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    lonlat.push(lon, lat);
  }

  let gemetry = new Cesium.PolygonGeometry.fromPositions({
    positions: Cesium.Cartesian3.fromDegreesArray(lonlat),
  });
  return viewer.scene.globe.computeSurfaceArea(gemetry, state.Ellipsoid);
}

//投影面积
function calcAreaWithoutHeight(positions) {
  let totalLon = 0;
  for (let i = 0; i < positions.length; i++) {
    let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
    let lon = Cesium.Math.toDegrees(cartographic.longitude);
    totalLon += lon;
  }

  let dh = Math.round((totalLon / positions.length + 6) / 6); //带号
  let centralMeridian = dh * 6 - 3;
  //高斯投影
  let projection = new Cesium.CustomProjection({
    name: "tmerc",
    centralMeridian: centralMeridian,
    primeMeridian: 0,
    standardParallel_1: 0,
    standardParallel_2: 0,
    eastFalse: 500000.0,
    northFalse: 0.0,
    semimajorAxis: 6378137,
    inverseFlattening: 298.257222101,
  });
  let cartesians: any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

    let cartesian = projection.project(cartographic);
    cartesians.push(cartesian);
  }

  cartesians.push(cartesians[0]); //首尾相接
  let value = Cesium.getPreciseArea(
    cartesians,
    "China2000",
    centralMeridian,
    dh,
    1
  );
  return value;
}

//   设置等值线
function updateContourLine(height) {
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue =
    height;
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue =
    height;
  if (!setHypFlag) return;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].hypsometricSetting.hypsometricSetting) {
      layers[i].hypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
      layers[i].hypsometricSetting.hypsometricSetting.MinVisibleValue = height;
    } else {
      setHypsometricSetting();
    }
  }
}

function MeasureDistance() {
  deactiveAll();
  handlerDis && handlerDis.activate();
}

function MeasureHeight() {
  if (!setHypFlag) setHypsometricSetting();
  clearLine();
  //鼠标左键事件监听
  // viewer.eventManager.addEventListener("CLICK", measureHeightClk, true);
  deactiveAll();
  handlerHeight && handlerHeight.activate();
}

// function measureHeightClk(e) {
//   let position = viewer.scene.pickPosition(e.message.position);
//   let p = tool.CartesiantoDegrees(position); // 将获取的点的位置转化成经纬度
//   height_0 = p[2];
// }

function MeasureArea() {
  deactiveAll();
  handlerArea && handlerArea.activate();
}

function update_mode(val) {
  if (val == "Space") {
    state.clampMode = Cesium.ClampMode.Space;
    handlerArea.clampMode = Cesium.ClampMode.Space;
    handlerDis.clampMode = Cesium.ClampMode.Space;
  } else {
    state.clampMode = Cesium.ClampMode.Ground;
    handlerArea.clampMode = Cesium.ClampMode.Ground;
    handlerDis.clampMode = Cesium.ClampMode.Ground;
    if (val == "XIAN80") {
      state.Ellipsoid = Cesium.Ellipsoid.XIAN80;
    } else if (val == "CGCS2000") {
      state.Ellipsoid = Cesium.Ellipsoid.CGCS2000;
    } else if (val == "WGS84") {
      state.Ellipsoid = Cesium.Ellipsoid.WGS84;
    } else {
      state.Ellipsoid = null;
    }
  }
}

function update_showDVH(val) {
  if (!val) {
    updateContourLine(-10000);
  } else {
    updateContourLine(lineHeight);
  }
}

function openPickPoint(val) {
  state.pickPointEnabled = val;
  viewer.scene.pickPointEnabled = val;
}

function clear() {
  deactiveAll();
  handlerDis && handlerDis.clear();
  handlerArea && handlerArea.clear();
  handlerHeight && handlerHeight.clear();
  clearLine();
  viewer.scene.pickPointEnabled = false;
}

function deactiveAll() {
  handlerDis && handlerDis.deactivate();
  handlerArea && handlerArea.deactivate();
  handlerHeight && handlerHeight.deactivate();
  state.Ellipsoid = null;
  lineHeight = -10000;
}
//   清除等值线
function clearLine() {
  updateContourLine(-10000);
  // viewer.eventManager.removeEventListener("CLICK", measureHeightClk); //移除鼠标点击事件监听
}

// watch(
//   () => state.pickPointEnabled,
//   val => {
//     viewer.scene.pickPointEnabled = val;
//   }
// );
onBeforeUnmount(() => {
  clear();
  isoline.destroy();
  layers = undefined;
});
</script>

<style lang="scss" scoped>
.measureBtnBox {
  display: flex;
  justify-content: space-between;
}
@include iconContainer(0.98rem, 2.2rem);
.icon-list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .is-select {
    border: 0.01rem solid #3499e5;
  }
}
</style>






