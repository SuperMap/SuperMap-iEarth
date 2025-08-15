<!-- 剖面分析 -->
<template>
  <n-scrollbar style="max-height: 3.8rem; padding-right: 0.1rem;" trigger="none">

    <!-- 起点经度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("startLongitude") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.startDegreesArray[0]"
          :show-button="false"
          disabled
        >
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <!-- 起点纬度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("startLatitude") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.startDegreesArray[1]"
          :show-button="false"
          disabled
        >
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <!-- 起点高程 -->
    <div class="row-wrap">
      <div class="label">{{ $t("startElevation") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.startDegreesArray[2]"
          :show-button="false"
          disabled
        >
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>

    <n-divider />

    <!-- 终点经度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("endLongitude") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.endDegreesArray[0]"
          :show-button="false"
          disabled
        >
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <!-- 终点纬度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("endLatitude") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.endDegreesArray[1]"
          :show-button="false"
          disabled
        >
          <template #suffix>°</template>
        </n-input-number>
      </div>
    </div>

    <!-- 终点高程 -->
    <div class="row-wrap">
      <div class="label">{{ $t("endElevation") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.endDegreesArray[2]"
          :show-button="false"
          disabled
        >
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>

    <!-- 剖面信息展示 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.profileInfoShow" :label="$t('disPlayInfo')" />
      </div>
      <div class="content" v-show="state.profileInfoShow">
        <n-radio-group
          v-model:value="state.infoShowMode"
          name="radiogroup"
          style="justify-content: flex-end;"
        >
          <n-space>
            <n-radio
              v-for="item in state.modeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>
    </div>
  </n-scrollbar>

  <div class="row-btns">
    <n-button @click="analysis" class="operate" type="info" :focusable="false">{{
    $t("analysis") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>

  <!-- 图表 -->
  <div v-show="state.profileInfoShow">
    <!-- 截面图表 -->
    <div v-show="!state.gpuDomShow" id="echartsProfile" class="analyse-echarts-box"></div>
    <!-- GPU剖面 -->
    <div v-show="state.gpuDomShow" class="analyse-echarts-box">
      <div style="font-size: 0.16rem; margin-top: -5px">
        {{ $t("GPUSection") }}
      </div>
      <canvas id="gpuProfile" style="z-index: 999" height="0" width="0"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import echarts from "@/tools/echarts";
import DrawHandler from "@/lib/DrawHandler";
import profileAnalysis from "./js/profile"; // 剖面分析封装类

const scene = viewer.scene;
const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  startDegreesArray: number[]; // 起点坐标数组
  endDegreesArray: number[]; // 终点坐标数组
  profileInfoShow: boolean; // 是否显示图表
  infoShowMode: string; // 是否显示GPU剖面图表
  modeOptions: any;
  gpuDomShow: boolean; // 控制GPU剖面DOM元素
  gpuProfileState: boolean;
  show: boolean; //加载等待条
};
// 设置默认值数据
let state = reactive<stateType>({
  startDegreesArray: [0, 0, 0],
  endDegreesArray: [0, 0, 0],
  profileInfoShow: false, // 剖面信息展示
  infoShowMode: "echarts", //是否显示二维分析结果
  modeOptions: [
    {
      label: $t("Section"),
      value: "echarts",
    },
    {
      label: $t("GPUSection"),
      value: "canvas",
    },
  ],
  gpuDomShow: false,
  gpuProfileState: false,
  show: false,
});

// 初始化变量
let ctx, canvas;
let profile_GPU = new SuperMap3D.Profile(scene);
let profile = new profileAnalysis(viewer, {
  echarts: echarts,
  entityUrl: "./images/location.png",
});

function init() {
  if (!viewer) return;
}

onMounted(() => {
  init();
  profile.initEcharts();
});

// 销毁
onBeforeUnmount(() => {
  clear();
  profile.destroy();
  profile_GPU.destroy();
  state.profileInfoShow = false;
});

// 为剖面分析设置数据
function setDataForGpuProFile(positions: any) {
  if (positions.length < 2) {
    return;
  }
  let startPoint = positions[0];
  let endPoint = positions[1];

  let scartographic = SuperMap3D.Cartographic.fromCartesian(startPoint);
  let slongitude = SuperMap3D.Math.toDegrees(scartographic.longitude);
  let slatitude = SuperMap3D.Math.toDegrees(scartographic.latitude);
  let sheight = scartographic.height;

  let ecartographic = SuperMap3D.Cartographic.fromCartesian(endPoint);
  let elongitude = SuperMap3D.Math.toDegrees(ecartographic.longitude);
  let elatitude = SuperMap3D.Math.toDegrees(ecartographic.latitude);
  let eheight = ecartographic.height;

  //设置剖面分析的开始和结束位置
  profile_GPU.startPoint = [slongitude, slatitude, sheight];
  profile_GPU.endPoint = [elongitude, elatitude, eheight];

  profile_GPU.extendHeight = 40;
  state.gpuProfileState = true;
}

//分析
async function analysis() {
  // 解决缺陷【8035】GPU剖面分析下报错崩溃问题
  profile.clear();
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  profile_GPU.destroy();
  profile_GPU = new SuperMap3D.Profile(scene);

  drawHandler.startPolyline().then(positions=>{
    setDataForGpuProFile(positions);

    profile.startProfile(positions).then((res) => {});

    if (positions.length >= 2) {
      let resultS = window.iEarthTool.Cartesian3ToDegreeArray(positions[0]);
      let resultE = window.iEarthTool.Cartesian3ToDegreeArray(positions[positions.length - 1]);
      state.startDegreesArray = resultS.map((num: any) => Number(num.toFixed(2)));
      state.endDegreesArray = resultE.map((num: any) => Number(num.toFixed(2)));
    }
    
    if (state.infoShowMode === "canvas") {
      setTimeout(()=>{ 
        getCanvasImage();
      },1000)
    }
  });
}

// GPU剖面分析
function getCanvasImage() {
  state.gpuDomShow = true;
  if (!state.gpuProfileState) return;

  //分析完毕的回调函数
  profile_GPU.getBuffer(function (buffer: any) {
    canvas = document.getElementById("gpuProfile");
    canvas.height = profile_GPU._textureHeight;
    canvas.width = profile_GPU._textureWidth;
    ctx = canvas.getContext("2d");
    let imgData = ctx.createImageData(
      profile_GPU._textureWidth,
      profile_GPU._textureHeight
    );
    imgData.data.set(buffer);

    //在canvas上绘制图片
    ctx.putImageData(imgData, 0, 0);
  });

  profile_GPU.build();
}

// 清除
function clear() {
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

  profile.clear();
  profile_GPU.destroy();
  drawHandler.destroy();

  profile_GPU = new SuperMap3D.Profile(scene);
  state.gpuProfileState = false;

  state.startDegreesArray = [0, 0, 0];
  state.endDegreesArray = [0, 0, 0];
  state.profileInfoShow = false;
}

// 监听
watch(
  () => state.infoShowMode,
  (newValue) => {
    if (newValue === "canvas") {
      getCanvasImage();
    } else {
      state.gpuDomShow = false;
    }
  }
);

watch(
  () => state.profileInfoShow,
  (val) => {
    state.infoShowMode = "echarts";
    if (val && state.infoShowMode === "canvas") {
      getCanvasImage();
    }
  }
);
</script>

<style lang="scss" scoped>
#gpuProfile {
  width: 36vw;
  height: 28vh;
  left: 4.7rem;
  background-color: rgba(0, 8, 23, 0.7);
  opacity: 0.7;
}
</style>
