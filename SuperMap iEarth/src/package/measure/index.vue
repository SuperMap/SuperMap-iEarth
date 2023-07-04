<template>
  <div class="measure-box">
    <div class="row-item">
      <span>量算模式</span>
      <n-select
        style="width: 2.2rem"
        v-model:value="state.measureMode"
        :options="state.options"
        @update:value="update_mode"
      />
    </div>

    <div class="row-item">
      <div class="icon-list" style="margin-left: 0.94rem">
        <span
          v-for="(line, index) in state.itemOptions"
          :key="index"
          class="icon-span"
          :title="line.lable"
          :class="line.isSelect ? 'selected-icon' : ''"
          @click="changleIconItem(line)"
        >
          <!-- <svg-icon :name="line.iconName" class="icon-size" /> -->
          <i class="iconfont iconSize" :class="line.iconName"></i>
        </span>
      </div>
    </div>

    <n-checkbox
      @update:checked="openPickPoint"
      v-model:checked="state.pickPointEnabled"
      style="margin-left: 0.96rem; margin-bottom: 0.1rem"
    >
      顶点捕捉
    </n-checkbox>

    <div v-show="state.currentItemIndex === 2">
      <n-checkbox
        @update:checked="update_showDVH"
        v-model:checked="state.isShowLine"
        style="margin-left: 0.96rem; margin-bottom: 0.1rem"
      >
        等高线
      </n-checkbox>
    </div>

    <div class="btn-row-item">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="StartMeasure"
        style="margin-right: 0.1rem"
        >测量</n-button
      >
      <n-button class="btn-secondary" @click="clear">清除</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount ,watch} from "vue";
// import tool from '@/tools/tool';
// import { GlobalStoreCreate } from '@/store/global/global';
// import { storeToRefs } from 'pinia';
// const GlobalStore = GlobalStoreCreate();
// const { isViewer,SceneLayerChangeCount } = storeToRefs(GlobalStore);

type stateType = {
  measureMode: string, //测量模式
  clampMode: any, //贴地模式
  Ellipsoid: any, //椭球选择
  contourColor: string, //等高线颜色
  isShowLine: boolean, //显示等高线
  pickPointEnabled: boolean, //开启顶点捕捉
  currentItemIndex: number, // 当前索引
  options:any, // 量算模式选项
  itemOptions:any, // 测量方式选项
}

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
      label: () => "空间量算",
      value: "Space",
    },
    {
      label: () => "贴地量算",
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
      label: () => "平面投影",
      value: "null",
    },
  ],
  itemOptions: [
    {
      id: 1,
      lable: "测量距离",
      iconName: "iconceju",
      isSelect: true,
    },
    {
      id: 2,
      lable: "测量高度",
      iconName: "iconcegao",
      isSelect: false,
    },
    {
      id: 3,
      lable: "测量面积",
      iconName: "iconcemian",
      isSelect: false,
    },

  ],
});

// 初始化数据
let layers,
  handlerDis,
  handlerArea,
  handlerHeight,
  isoline,
  lineHeight,
  setHypFlag;
  // height_0 = 0;

// 等高线初始化
isoline = new SuperMap3D.HypsometricSetting();
isoline.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.LINE;
let colorTable = new SuperMap3D.ColorTable();
isoline._lineColor = SuperMap3D.Color.fromCssColorString(state.contourColor);
isoline.ColorTable = colorTable;
isoline.Opacity = 0.6;
isoline.MaxVisibleValue = -100;
isoline.MinVisibleValue = -100;

//监听图层改变,以便实现等高线
// watch(SceneLayerChangeCount, val => {
//   setHypsometricSetting();
// });

// 初始化
init();
function init() {
  if (!viewer) return;
  layers = viewer.scene.layers.layerQueue;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: isoline,
    analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
  };
  // if (SceneLayerChangeCount) {
  //   setHypsometricSetting();
  // }

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
  handlerHeight = new SuperMap3D.MeasureHandler(viewer, SuperMap3D.MeasureMode.DVH);

  //初始化测量距离
  handlerDis.activeEvt.addEventListener(isActive => {
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
  handlerDis.measureEvt.addEventListener(result => {
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
  handlerArea.activeEvt.addEventListener(isActive => {
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
  handlerArea.measureEvt.addEventListener(result => {
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
  handlerHeight.measureEvt.addEventListener(result => {
    let distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
    let vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
    let hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
              handlerHeight.disLabel.text = '空间距离:' + distance;
              handlerHeight.vLabel.text = '垂直高度:' + vHeight;
              handlerHeight.hLabel.text = '水平距离:' + hDistance;
              //实时等高线显示
              lineHeight = Number(result.endHeight);
              if (state.isShowLine) updateContourLine(lineHeight)

  });

  // 测量高度监听事件
  handlerHeight.activeEvt.addEventListener(isActive => {
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
  for (let i = 0; i < state.itemOptions.length; i++) {
    if (state.itemOptions[i].id == item.id) {
      state.itemOptions[i].isSelect = true;
    } else {
      state.itemOptions[i].isSelect = false;
    }
  }
}

// 开始测量
function StartMeasure() {
  deactiveAll()

  switch (state.currentItemIndex) {
      case 1:
          MeasureDistance();
          break;
      case 2:
          // if(!setHypFlag.value)  setHypsometricSetting()
          MeasureHeight();
          break;
      case 3:
          MeasureArea();
          break;
      default:
          console.log('请选择测量方式')
  }
}

// 初始化设置图层等高线
function setHypsometricSetting() {
  if (!layers) return;
  for (let i = 0; i < layers.length; i++) {
    layers[i].hypsometricSetting = {
      hypsometricSetting: isoline,
      analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
    };
  }
  setHypFlag = true;
}

// 分析
//椭球贴地距离
function calcClampDistance(positions:any) {
  let lonlat:any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
    let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
    let lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
    lonlat.push(lon, lat);
  }
  let gemetry = new SuperMap3D.PolylineGeometry({
    positions: SuperMap3D.Cartesian3.fromDegreesArray(lonlat)
  });
  return viewer.scene.globe.computeSurfaceDistance(gemetry, state.Ellipsoid);
}

//椭球贴地面积
function calcClampValue(positions:any) {
  let lonlat:any[] = [];
  for (let i = 0; i < positions.length; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
    let lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
    let lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
    lonlat.push(lon, lat);
  }

  let gemetry = new SuperMap3D.PolygonGeometry.fromPositions({
    positions: SuperMap3D.Cartesian3.fromDegreesArray(lonlat)
  });
  return viewer.scene.globe.computeSurfaceArea(gemetry, state.Ellipsoid);
}

//投影面积
function calcAreaWithoutHeight(positions:any) {
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
    inverseFlattening: 298.257222101
  });
  let cartesians:any[] = [];
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
function updateContourLine(height:number) {
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue = height;
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

// 测量面积
function MeasureArea() {
  deactiveAll();
  handlerArea && handlerArea.activate();
}

// 更新量算模式
function update_mode(val:string) {
  if (val == "Space") {
    state.clampMode = SuperMap3D.ClampMode.Space;
    handlerArea.clampMode = SuperMap3D.ClampMode.Space;
    handlerDis.clampMode = SuperMap3D.ClampMode.Space;
  } else {
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
function update_showDVH(val:boolean) {
  if (!val) {
    updateContourLine(-10000);
  } else {
    updateContourLine(lineHeight);
  }
}

// 开启顶点捕捉
function openPickPoint(val:boolean){
  state.pickPointEnabled = val;
  viewer.scene.pickPointEnabled = val;
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
.measure-box {
  width: 100%;
  height: 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
</style>






