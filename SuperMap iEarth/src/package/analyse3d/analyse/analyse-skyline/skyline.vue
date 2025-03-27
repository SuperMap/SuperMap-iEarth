<template>
  <!-- 天际线 -->
  <div class="row-item">
    <span>{{ $t("DisplayMode") }}</span>
    <n-select
      style="width: 1.96rem"
      v-model:value="state.skylineMode"
      :options="state.options"
    />
  </div>

  <div class="row-item">
    <span>{{ $t("AnalysisRadius") }}</span>
    <n-input-number
      style="width: 1.96rem"
      v-model:value="state.skylineRadius"
      :show-button="false"
    >
      <template #suffix>{{ $t("meter") }}</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t("LineWidth") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.5rem"
        v-model:value="state.lineWidth"
        :step="1"
        :min="1"
        :max="10"
      />
      <span>{{ state.lineWidth }}</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("SkylineColor") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.skylineColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-show="state.skylineMode === 'BODY'">
    <span>{{ $t("SkylineBodyColor") }}</span>
    <div class="check-color-pick">
      <n-checkbox v-model:checked="state.displaySkyBody"></n-checkbox>
      <div class="color-pick-box">
        <n-color-picker
          v-model:value="state.skyBodyColor"
          :render-label="
            () => {
              return '';
            }
          "
          :disabled="!state.displaySkyBody"
          size="small"
        ></n-color-picker>
      </div>
    </div>
  </div>

  <div class="row-item">
    <span style="overflow: hidden;" :title="$t('HighlightObstacles')">{{ $t("HighlightObstacles") }}</span>
    <div class="check-color-pick">
      <n-checkbox v-model:checked="state.highlightBarrier"></n-checkbox>
      <div class="color-pick-box" style="margin-left: 0.1rem">
        <n-color-picker
          v-model:value="state.barrierColor"
          :render-label="
            () => {
              return '';
            }
          "
          :disabled="!state.highlightBarrier"
          size="small"
        ></n-color-picker>
      </div>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("Display2D") }}</span>
    <div class="check-box">
      <n-checkbox v-model:checked="state.getSkyline2d"></n-checkbox>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("GlobeNoAnalysis") }}</span>
    <div class="check-box">
      <n-checkbox v-model:checked="state.ignoreGlobe"></n-checkbox>
    </div>
  </div>

  <div class="btn-row-item2">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="analysis"
      style="margin-right: 0.1rem"
      :title="$t('analysis')"
      >{{ $t("analysis") }}</n-button
    >
    <!-- 这里由于限高体字数太多显示不全，专门给他设置了padding-right: 0.05rem; -->
    <n-button
      type="info"
      class="limitingBody"
      color="#3499E5"
      text-color="#fff"
      @click="setLimitBody"
      style="margin-right: 0.1rem;padding-right: 0.05rem;"
      :title="$t('limitingBody')"
      >{{ $t("limitingBody") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      :title="$t('clear')"
      >{{ $t("clear") }}</n-button
    >
  </div>

  <div id="echartsSkyLine" v-show="state.getSkyline2d"></div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import axios from "axios";
import echarts from "@/tools/echarts";
import SkylineAnalysis from "./js/skyline";
import DrawHandler from "@/lib/DrawHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  skylineRadius: number; //分析半径
  lineWidth: number; //天际线宽度
  skylineColor: string; //天际线颜色
  displaySkyBody: boolean; // 是否显示天际体
  skyBodyColor: string; //天际体颜色
  highlightBarrier: boolean; //是否显示高亮障碍物
  barrierColor: string; //障碍物颜色
  skylineMode: string; //分析模式
  getSkyline2d: boolean; //是否显示二维分析结果
  ignoreGlobe: boolean; // 地球表面不参与分析
  skylineSpatialUrl: string; //分析服务地址
  observerInformation: any; //观察者信息
  options: any;
  clearFlag: boolean; // 天际线是否清除标志
};

// 设置默认值数据
let state = reactive<stateType>({
  skylineRadius: 10000, //分析半径
  lineWidth: 2, //天际线宽度
  skylineColor: "rgb(200, 0, 0)", //天际线颜色
  displaySkyBody: false, // 是否显示天际体
  skyBodyColor: "rgba(44,149,197,0.6)", //天际体颜色
  highlightBarrier: false, //是否显示高亮障碍物
  barrierColor: "rgba(255, 186, 1, 1)", //障碍物颜色
  skylineMode: "LINE", //分析模式
  getSkyline2d: false, //是否显示二维分析结果
  ignoreGlobe: true, // 地球表面不参与分析
  skylineSpatialUrl:
    "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json", //分析服务地址
  observerInformation: null, //观察者信息
  options: [
    {
      label: () => $t("LineDisplay"),
      value: "LINE",
    },
    {
      label: () => $t("FaceDisplay"),
      value: "FACE",
    },
    {
      label: () => $t("BodyDisplay"),
      value: "BODY",
    },
  ],
  clearFlag: true,
});

// 初始化变量
let myChart, echarts_dom;
let skylineAnalysis = new SkylineAnalysis(viewer, { axios: axios });

function init() {
  if (!viewer) return;
}

onMounted(() => {
  init();
  getEchartsDom();
  initMyChart();
});

onBeforeUnmount(() => {
  clear();
  if (myChart) myChart.dispose();
  skylineAnalysis.destroy();
  state.getSkyline2d = false;
});

//分析
function analysis() {
  state.clearFlag = false;
  skylineAnalysis.start();
  if (state.getSkyline2d) {
    setTimeout(() => {
      let object = skylineAnalysis.skyline.getSkyline2D();
      setOptions(object); // 设置二维天际线
    }, 500);
  }
  if (state.skylineMode === "FACE") updatePosition(); // 如果是面模式，更新一下位置，改变一下视角好显示面
}

// 设置限高体
let posArr: any[] = [];
async function setLimitBody() {
  skylineAnalysis.skyline.removeLimitbody("limitBody");

  const positions_c3 = await drawHandler.startPolygon();
  let positions: any[] = window.iEarthTool.Cartesian3ToDegreeObjs(positions_c3);
  //再次遍历转化为接口所需的数组格式
  for (let i = 0, len = positions.length; i < len; i++) {
    posArr.push(positions[i].longitude);
    posArr.push(positions[i].latitude);
  }
  //添加限高体对象
  skylineAnalysis.skyline.addLimitbody({
    position: posArr,
    name: "limitBody",
  });
}

// 创建天际线二维echarts容器
function getEchartsDom() {
  echarts_dom = document.getElementById("echartsSkyLine");
}

//初始化echarts
function initMyChart() {
  if (!state.getSkyline2d) return;
  if (!myChart) {
    myChart = echarts.init(echarts_dom); //初始化echarts
    window.onresize = () => {
      myChart.resize(); //自适应屏幕
    };
  }
}

// 设置二维天际线
function setOptions(object: any) {
  if (myChart) {
    let option = {
      tooltip: {
        trigger: "axis",
        // formatter: 'X: {b}<br/>Y : {c}'
        formatter: (param) => {
          let datax = Number(param[0].axisValue);
          let datay = param[0].data;
          return [
            "X: " + datax.toFixed(6) + "<br/>",
            "Y: " + datay.toFixed(6),
          ].join("");
        },
      },
      grid: {
        top: "20%",
        left: "3%",
        right: "3%",
        bottom: "6%",
        containLabel: true,
      },
      axisLabel: {
        // 设置坐标轴字的颜色
        color: "#fff",
      },
      backgroundColor: "#000817",
      toolbox: {
        show: true,
        feature: {
          // restore: {},
          saveAsImage: {},
        },
        right: "3%",
        iconStyle: {
          borderColor: "#fff", // 图标默认颜色
        },
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: object.x,
          show: false,
        },
      ],
      yAxis: {
        min: function (value) {
          return (value.min - 0.05).toFixed(2);
        },
        show: true,
        axisLine: {
          show: true,
        },
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "filter",
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          symbolSize: 8,
          symbol: "circle",
          smooth: true,
          // name: "天际线分析",
          // symbol: "none",
          type: "line",
          data: object.y,
          lineStyle: {
            width: 2,
            shadowColor: "rgba(145, 146, 148,0.7)",
            shadowBlur: 10,
            shadowOffsetY: 8,
          },
        },
      ],
    };
    myChart.setOption(option);
  }
}

// 更新位置 - 本质就是缩放，改变相机位置
function updatePosition() {
  let position = viewer.camera.position;
  let cameraHeight =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  let moveRate = cameraHeight / 200.0; // 参数可改
  viewer.camera.moveBackward(moveRate);
}

// 清除
function clear() {
  drawHandler.destroy();
  skylineAnalysis.clear();
  if (myChart) myChart.clear();
  initMyChart();
  state.getSkyline2d = false;
  state.clearFlag = true;
}

// 监听
watch(
  () => state.skylineRadius,
  (val) => {
    skylineAnalysis.skyline.radius = val;
  }
);
watch(
  () => state.lineWidth,
  (val) => {
    if (!state.clearFlag) {
      // 修改天际线宽度有问题，放大在缩小越来越远，因此这里使用类似与地表不参与分析的方法暂时解决
      clear();
      analysis();
      skylineAnalysis.skyline.lineWidth = Number(val);
    }
  }
);
watch(
  () => state.skylineColor,
  (newValue) => {
    let color = SuperMap3D.Color.fromCssColorString(newValue);
    if (Number(color.alpha) < 0.1) return;
    skylineAnalysis.skyline.color = color;
  }
);
watch(
  () => state.skyBodyColor,
  (newValue) => {
    let color = SuperMap3D.Color.fromCssColorString(newValue);
    if (Number(color.alpha) < 0.1) return;
    skylineAnalysis.setSkyLineBodyColor(color);
  }
);
watch(
  () => state.barrierColor,
  (newValue) => {
    let BarrierColor = SuperMap3D.Color.fromCssColorString(newValue);
    if (Number(BarrierColor.alpha) < 0.1) return;
    skylineAnalysis.setBarrierColor(BarrierColor);
  }
);
watch(
  () => state.ignoreGlobe,
  (newValue) => {
    skylineAnalysis.skyline.ignoreGlobe = newValue;
    // 上层解决天际线地表不参与分析缺陷
    clear();
    analysis();
  }
);
watch(
  () => state.highlightBarrier,
  (newValue) => {
    skylineAnalysis.highlightBarrier = newValue;
    if (newValue) {
      let BarrierColor = SuperMap3D.Color.fromCssColorString(
        state.barrierColor
      );
      skylineAnalysis.setBarrierColor(BarrierColor);
      return;
    }
    skylineAnalysis.clearBarrierColor();
  }
);
watch(
  () => state.getSkyline2d,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        let object = skylineAnalysis.skyline.getSkyline2D();
        if (!state.clearFlag) setOptions(object); // 设置二维天际线
      }, 500);

      if (!myChart) initMyChart();
      myChart.resize(); //自适应屏幕
    }
  }
);
watch(
  () => state.skylineMode,
  (newValue) => {
    skylineAnalysis.setSkylineMode(newValue);
    if (newValue === "FACE") updatePosition();
  }
);
</script>

<style lang="scss" scoped>
#echartsSkyLine {
  position: fixed !important;
  bottom: 0.3rem;
  left: 32vw;
  width: 36vw;
  height: 30vh;
  background-color: rgba(0, 8, 23, 0.7);
  opacity: 0.7;
  padding: 0.05rem 0.1rem 0.1rem 0.05rem;
  z-index: 99;
}

.limitingBody {
  padding-left: 0.1rem;
}
</style>
