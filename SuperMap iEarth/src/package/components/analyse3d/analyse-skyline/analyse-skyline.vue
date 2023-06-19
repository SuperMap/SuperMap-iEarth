<template>
  <!-- 天际线 -->
  <div class="skyline-container">
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.DisplayMode") }}</template>
      <template #item-content>
        <n-select
          size="small"
          v-model:value="state.skylineMode"
          :options="state.options"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.AnalysisRadius") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.skylineRadius"
          size="small"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.LineWidth") }}</template>
      <template #item-content>
        <n-slider
          v-model:value="state.lineWidth"
          :step="1"
          :min="1"
          :max="10"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.SkylineColor") }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.skylineColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.SkylineBodyColor") }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.skyBodyColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.ObstacleColor") }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.barrierColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.HighlightObstacles") }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.highlightBarrier"></n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.GlobeNoAnalysis") }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.ignoreGlobe"></n-checkbox>
      </template>
    </sm-rowLayOut>
    <!-- 有问题 先注释 -->
    <!-- <sm-rowLayOut>
      <template #item-lable>{{ $t("global.Display2D") }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.getSkyline2d"></n-checkbox>
      </template>
    </sm-rowLayOut> -->
  </div>

  <n-space justify="end">
    <n-button @click="setLimitBody">{{
      $t("global.drawHeightLimitingBody")
    }}</n-button>
    <n-button type="info" @click="analysis">{{
      $t("global.analysis")
    }}</n-button>
    <n-button @click="clear">{{ $t("global.clear") }}</n-button>
  </n-space>

  <div id="echartsSkyLine"></div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import axios from "axios";
import echarts from "@/tools/echarts";
import tool from "@/tools/tool";
import initHandler from "@/tools/drawHandler";
import locale from "@/tools/locateTemp";
import SkylineAnalysis from "./skyline";

const langGlobal = window.LangGlobal.global;

// 设置默认值数据
let state = reactive({
  skylineRadius: 10000, //分析半径
  lineWidth: 3, //天际线宽度
  skylineColor: "rgb(200, 0, 0)", //天际线颜色
  skyBodyColor: "rgba(44,149,197,0.6)", //天际体颜色
  barrierColor: "rgba(255, 186, 1, 1)", //障碍物颜色
  skylineMode: "LINE", //分析模式
  highlightBarrier: false, //是否显示高亮障碍物
  getSkyline2d: false, //是否显示二维分析结果
  ignoreGlobe: true, // 地球表面不参与分析
  skylineSpatialUrl:
    "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json", //分析服务地址
  observerInformation: null, //观察者信息
  options: [
    {
      label: () => locale.LineDisplay,
      value: "LINE",
    },
    {
      label: () => locale.FaceDisplay,
      value: "FACE",
    },
    {
      label: () => locale.BodyDisplay,
      value: "BODY",
    },
  ],
});

// 初始化数据
let skylineAnalysis, handlerPolygon, myChart, echarts_dom;

function init() {
  if (!viewer) return;
  skylineAnalysis = new SkylineAnalysis(viewer, { axios: axios });
}

init();

//分析

function analysis() {
  skylineAnalysis.start();
  if (state.getSkyline2d) {
    setTimeout(() => {
      let object = skylineAnalysis.skyline.getSkyline2D();
      setOptions(object); // 设置二维天际线
    }, 500);
  }
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  skylineAnalysis.clear();
  if (myChart) myChart.clear();
  initMyChart();
  echarts_dom.style.display = "none";
  state.getSkyline2d = false;
}

// 设置限高体
let posArr: any[] = [];
function setLimitBody() {
  skylineAnalysis.skyline.removeLimitbody("limitBody");
  if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let positions: any[] = tool.CartesiantoDegreesObjs(res.object.positions);
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
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

// 创建天际线二维echarts容器
function getEchartsDom() {
  // echarts_dom = document.createElement("div");
  // echarts_dom.classList.add("echarts-skyline");

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
  myChart.setOption({
    title: {
      text: langGlobal.Skyline2D,
      textStyle: {
        fontSize: 15,
        color: "#fff",
      },
      top: "3%",
      left: "3%",
    },
    grid: {
      top: "20%",
      left: "3%",
      right: "3%",
      bottom: "6%",
      containLabel: true,
    },
    tooltip: {},
    xAxis: {
      show: true,
    },
    yAxis: {
      show: true,
    },
    series: [
      {
        type: "line",
        data: [],
      },
    ],
  });
}

// 设置二维天际线
function setOptions(object) {
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
          restore: {},
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

onMounted(() => {
  getEchartsDom();
  initMyChart();
});

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
    skylineAnalysis.skyline.lineWidth = Number(val);
  }
);
watch(
  () => state.skylineColor,
  (newValue) => {
    let color = Cesium.Color.fromCssColorString(newValue);
    skylineAnalysis.skyline.color = color;
    skylineAnalysis.skyline.lineWidth = state.lineWidth;
  }
);

watch(
  () => state.skyBodyColor,
  (newValue) => {
    let color = Cesium.Color.fromCssColorString(newValue);
    skylineAnalysis.setSkyLineBodyColor(color);
  }
);

watch(
  () => state.barrierColor,
  (newValue) => {
    let BarrierColor = Cesium.Color.fromCssColorString(newValue);
    skylineAnalysis.setBarrierColor(BarrierColor);
  }
);

watch(
  () => state.ignoreGlobe,
  (newValue) => {
    skylineAnalysis.skyline.ignoreGlobe = newValue;
  }
);

watch(
  () => state.highlightBarrier,
  (newValue) => {
    skylineAnalysis.highlightBarrier = newValue;
    if (newValue) {
      let BarrierColor = Cesium.Color.fromCssColorString(state.barrierColor);
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
      echarts_dom.style.display = "block";
      if (!myChart) initMyChart();
      myChart.resize(); //自适应屏幕
      return;
    }
    echarts_dom.style.display = "none";
  }
);
watch(
  () => state.skylineMode,
  (newValue) => {
    skylineAnalysis.setSkylineMode(newValue);
  }
);

// 销毁
onBeforeUnmount(() => {
  clear();
  if (myChart) myChart.dispose();
  skylineAnalysis.destroy();
  echarts_dom.style.display = "none";
});
</script>

<style lang="scss" scoped>
.skyline-container {
  @include panelContainer(100%, 3.5rem);
  font-size: 0.12rem;
}
.itemBox {
  @include rowItemBoxStyle(
    $--SM--margin-6,
    $--SM--LableWidth-160,
    $--SM--InputWidth-260
  );
}

#echartsSkyLine {
  position: fixed !important;
  bottom: 0.3rem;
  left: 3.5rem;
  width: 6.75rem !important;
  height: 2.33rem !important;
  background-color: rgba(0, 8, 23, 0.7) !important;
  opacity: 0.7;
  padding: 0.05rem 0.1rem 0.1rem 0.05rem;
  z-index: 99;
  display: none;
}


.single-color-pick-bg {
  height: 0.32rem;
  border-radius: 0.04rem;
  background: rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  padding: 0 0.12rem;
}
</style>





