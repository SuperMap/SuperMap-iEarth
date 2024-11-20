<template>
  <div class="measure-box">
    <div class="row-item">
      <span>{{ $t("measureMode") }}</span>
      <n-select
        style="width: 1.96rem"
        v-model:value="state.measureMode"
        :options="state.options"
        @update:value="update_mode"
      >
      </n-select>
    </div>

    <div class="row-item">
      <span></span>
      <div class="icon-list">
        <span
          v-for="(line, index) in state.currentItemOption"
          :key="index"
          class="icon-span"
          :title="line.lable"
          :class="line.isSelect ? 'selected-icon' : ''"
          @click="changleIconItem(line)"
        >
          <i
            class="iconfont iconSize"
            :class="line.iconName"
            style="margin-top: 0px"
          ></i>
        </span>
      </div>
    </div>

    <div>
      <div class="btn-row-item" v-show="state.measureMode == 'Space'">
        <n-checkbox
          @update:checked="openPickPoint"
          v-model:checked="state.pickPointEnabled"
          style="margin-bottom: 0.1rem"
        >
          {{ $t("pickPoint") }}
        </n-checkbox>
      </div>
    </div>

    <!-- TODO：解决量算-测高开启等高线场景崩溃问题 -->
    <!-- <div v-show="state.currentItemIndex === 2">
      <div class="btn-row-item">
        <n-checkbox
          @update:checked="update_showDVH"
          v-model:checked="state.isShowLine"
          style="margin-bottom: 0.1rem"
        >
          {{ $t("contour") }}
        </n-checkbox>
      </div>
    </div> -->

    <div class="btn-row-item">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        class="ans-btn"
        @click="StartMeasure"
        :title="$t('measureAction')"
        >{{ $t("measureAction") }}</n-button
      >
      <n-button
        class="btn-secondary"
        @click="clear"
        color="rgba(255, 255, 255, 0.65)"
        ghost
        >{{ $t("clear") }}</n-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";

type stateType = {
  measureMode: string; //测量模式
  clampMode: any; //贴地模式
  Ellipsoid: any; //椭球选择
  contourColor: string; //等高线颜色
  isShowLine: boolean; //显示等高线
  pickPointEnabled: boolean; //开启顶点捕捉
  currentItemIndex: number; // 当前索引
  options: any; // 量算模式选项
  itemOptions: any; // 测量方式选项
  currentItemOption: any; // 当前测量方式选项
};

let state = reactive<stateType>({
  measureMode: "Space", //测量模式
  clampMode: SuperMap3D.ClampMode.Space, //贴地模式
  Ellipsoid: null, //椭球选择
  contourColor: "#ff7d00", //等高线颜色
  isShowLine: true, //显示等高线
  pickPointEnabled: false, //开启顶点捕捉
  currentItemIndex: 1,
  options: [
    {
      label: () => $t("mode_space"),
      value: "Space",
    },
    {
      label: () => $t("mode_ground"),
      value: "Ground",
    },
    {
      label: () => "CGCS2000",
      value: "CGCS2000",
    },
    {
      label: () => "XIAN80",
      value: "XIAN80",
    },
    {
      label: () => "WGS84",
      value: "WGS84",
    },
    {
      label: () => $t("mode_projection"),
      value: "null",
    },
  ],
  itemOptions: {
    Space: [
      {
        id: 1,
        lable: $t("measureDistence"),
        iconName: "iconceju",
        isSelect: true,
      },
      {
        id: 2,
        lable: $t("measureHeight"),
        iconName: "iconcegao",
        isSelect: false,
      },
      {
        id: 3,
        lable: $t("measureArea"),
        iconName: "iconcemian",
        isSelect: false,
      },
    ],
    Ground: [
      {
        id: 1,
        lable: $t("measureDistence"),
        iconName: "iconyidijuli1",
        isSelect: true,
      },
      {
        id: 2,
        lable: $t("measureHeight"),
        iconName: "iconcegao",
        isSelect: false,
      },
      {
        id: 3,
        lable: $t("measureArea"),
        iconName: "iconyidimianji",
        isSelect: false,
      },
    ],
    null: [
      {
        id: 1,
        lable: $t("measureDistence"),
        iconName: "iconyidijuli1",
        isSelect: true,
      },
      {
        id: 2,
        lable: $t("measureHeight"),
        iconName: "iconcegao",
        isSelect: false,
      },
      {
        id: 3,
        lable: $t("measureArea"),
        iconName: "icontouying",
        isSelect: false,
      },
    ],
  },
  currentItemOption: [
    {
      id: 1,
      lable: $t("measureDistence"),
      iconName: "iconceju",
      isSelect: true,
    },
    {
      id: 2,
      lable: $t("measureHeight"),
      iconName: "iconcegao",
      isSelect: false,
    },
    {
      id: 3,
      lable: $t("measureArea"),
      iconName: "iconcemian",
      isSelect: false,
    },
  ],
});

// 初始化变量
let layers, handlerDis, handlerArea, handlerHeight, lineHeight, setHypFlag;

// 等高线初始化
let isoline = new SuperMap3D.HypsometricSetting();
let colorTable = new SuperMap3D.ColorTable();

onMounted(() => {
  isoline.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.LINE;
  isoline._lineColor = SuperMap3D.Color.fromCssColorString(state.contourColor);
  isoline.ColorTable = colorTable;
  isoline.Opacity = 0.6;
  isoline.MaxVisibleValue = -100;
  isoline.MinVisibleValue = -100;

  init();
});

onBeforeUnmount(() => {
  clear();
  isoline.destroy();
  layers = undefined;
});

// 初始化
function init() {
  if (!viewer) return;
  viewer.scene.pickPointInterval = 20;
  layers = viewer.scene.layers.layerQueue;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: isoline,
    analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
  };

  handlerDis = new SuperMap3D.MeasureHandler(
    viewer,
    SuperMap3D.MeasureMode.Distance,
    state.clampMode
  );
  handlerArea = new SuperMap3D.MeasureHandler(
    viewer,
    SuperMap3D.MeasureMode.Area,
    state.clampMode
  );
  handlerHeight = new SuperMap3D.MeasureHandler(
    viewer,
    SuperMap3D.MeasureMode.DVH
  );

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
    handlerDis.disLabel.text = $t("distence_cl") + distance;
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

  // 测量面积监听事件
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
    handlerArea.areaLabel.text = $t("area") + area;
  });

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
    handlerHeight.disLabel.text = $t("spaceDistance") + distance;
    handlerHeight.vLabel.text = $t("verticalHeight") + vHeight;
    handlerHeight.hLabel.text = $t("horizontalDistance") + hDistance;
    //实时等高线显示
    lineHeight = Number(result.endHeight);
    if (state.isShowLine) updateContourLine(lineHeight);
  });

  // 测量高度监听事件
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

// 改变当前item索引
function changleIconItem(item: any) {
  state.currentItemIndex = item.id;
  for (let i = 0; i < state.currentItemOption.length; i++) {
    if (state.currentItemOption[i].id == item.id) {
      state.currentItemOption[i].isSelect = true;
    } else {
      state.currentItemOption[i].isSelect = false;
    }
  }
}

// 切换图标
function updateIconItem() {
  for (let i = 0; i < state.currentItemOption.length; i++) {
    if (state.currentItemOption[i].id == state.currentItemIndex) {
      state.currentItemOption[i].isSelect = true;
    } else {
      state.currentItemOption[i].isSelect = false;
    }
  }
}

// 开始测量
function StartMeasure() {
  deactiveAll();

  switch (state.currentItemIndex) {
    case 1:
      MeasureDistance();
      break;
    case 2:
      MeasureHeight();
      break;
    case 3:
      MeasureArea();
      break;
    default:
      break;
  }
}

// 初始化设置图层等高线
function setHypsometricSetting() {
  if (!layers) return;
  // TODO: 换11.2.1的包之后，量算等高线一旦执行这里就会崩溃，切换成之前主版本40707就没问题，但11.2.1的范例也执行了这里但没问题
  // 初步定位应该是之前设置的值或状态导致，但目前无法定位,后续排除
  // for (let i = 0; i < layers.length; i++) {
  //   layers[i].hypsometricSetting = {
  //     hypsometricSetting: isoline,
  //     analysisMode:
  //       SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
  //   };
  // }
  setHypFlag = true;
}

// 分析
//椭球贴地距离
function calcClampDistance(positions: any) {
  let lonlat: any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
    let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
    let lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
    lonlat.push(lon, lat);
  }
  let gemetry = new SuperMap3D.PolylineGeometry({
    positions: SuperMap3D.Cartesian3.fromDegreesArray(lonlat),
  });
  return viewer.scene.globe.computeSurfaceDistance(gemetry, state.Ellipsoid);
}

//椭球贴地面积
function calcClampValue(positions: any) {
  let lonlat: any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
    let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
    let lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
    lonlat.push(lon, lat);
  }

  let gemetry = new SuperMap3D.PolygonGeometry.fromPositions({
    positions: SuperMap3D.Cartesian3.fromDegreesArray(lonlat),
  });
  return viewer.scene.globe.computeSurfaceArea(gemetry, state.Ellipsoid);
}

//投影面积
function calcAreaWithoutHeight(positions: any) {
  let totalLon = 0;
  for (let i = 0; i < positions.length; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
    let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
    totalLon += lon;
  }

  let dh = Math.round((totalLon / positions.length + 6) / 6); //带号
  let centralMeridian = dh * 6 - 3;
  //高斯投影
  let projection = new SuperMap3D.CustomProjection({
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
    let cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);

    let cartesian = projection.project(cartographic);
    cartesians.push(cartesian);
  }

  cartesians.push(cartesians[0]); //首尾相接
  let value = SuperMap3D.getPreciseArea(
    cartesians,
    "China2000",
    centralMeridian,
    dh,
    1
  );
  return value;
}

// 设置等值线
function updateContourLine(height: number) {
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

// 测量距离
function MeasureDistance() {
  deactiveAll();
  handlerDis && handlerDis.activate();
}

// 测量高度
function MeasureHeight() {
  if (!setHypFlag) setHypsometricSetting();
  clearLine();
  deactiveAll();
  handlerHeight && handlerHeight.activate();
}

// 测量面积
function MeasureArea() {
  deactiveAll();
  handlerArea && handlerArea.activate();
}

// 更新量算模式
function update_mode(val: string) {
  if (val == "Space") {
    state.clampMode = SuperMap3D.ClampMode.Space;
    handlerArea.clampMode = SuperMap3D.ClampMode.Space;
    handlerDis.clampMode = SuperMap3D.ClampMode.Space;
  } else {
    state.pickPointEnabled = false; // 目前只要是贴地，就关闭顶点捕捉，等包修好后再说
    state.clampMode = SuperMap3D.ClampMode.Ground;
    handlerArea.clampMode = SuperMap3D.ClampMode.Ground;
    handlerDis.clampMode = SuperMap3D.ClampMode.Ground;
    if (val == "XIAN80") {
      state.Ellipsoid = SuperMap3D.Ellipsoid.XIAN80;
    } else if (val == "CGCS2000") {
      state.Ellipsoid = SuperMap3D.Ellipsoid.CGCS2000;
    } else if (val == "WGS84") {
      state.Ellipsoid = SuperMap3D.Ellipsoid.WGS84;
    } else {
      state.Ellipsoid = null;
    }
  }
}

// 开启等高线
function update_showDVH(val: boolean) {
  if (!val) {
    updateContourLine(-10000);
  } else {
    updateContourLine(lineHeight);
  }
}

// 开启顶点捕捉
function openPickPoint(val: boolean) {
  state.pickPointEnabled = val;
  viewer.scene.pickPointEnabled = val;
  viewer.scene.pickPointInterval = 20;
}

// 清除
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
// 清除等值线
function clearLine() {
  updateContourLine(-10000);
}

watch(
  () => state.measureMode,
  (val) => {
    switch (val) {
      case "Space":
        state.currentItemOption = state.itemOptions["Space"];
        break;
      case "Ground":
        state.currentItemOption = state.itemOptions["Ground"];
        break;
      case "null":
        state.currentItemOption = state.itemOptions["null"];
        break;
      default:
        state.currentItemOption = state.itemOptions["Space"];
        break;
    }

    updateIconItem();
  }
);
</script>

<style lang="scss" scoped>
.measure-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 0.12rem;
}
</style>
