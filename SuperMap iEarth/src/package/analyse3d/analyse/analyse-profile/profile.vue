<template>
  <!-- 剖面分析 -->
  <n-scrollbar style="max-height: 3.8rem">
    <div class="row-item">
      <span>{{ $t("startLongitude") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.startDegreesArray[0]"
        :show-button="false"
        disabled
      >
        <template #suffix>°</template>
      </n-input-number>
    </div>

    <div class="row-item">
      <span>{{ $t("startLatitude") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.startDegreesArray[1]"
        :show-button="false"
        disabled
      >
        <template #suffix>°</template>
      </n-input-number>
    </div>

    <div class="row-item">
      <span>{{ $t("startElevation") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.startDegreesArray[2]"
        :show-button="false"
        disabled
      >
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>

    <n-divider />

    <div class="row-item">
      <span>{{ $t("endLongitude") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.endDegreesArray[0]"
        :show-button="false"
        disabled
      >
        <template #suffix>°</template>
      </n-input-number>
    </div>

    <div class="row-item">
      <span>{{ $t("endLatitude") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.endDegreesArray[1]"
        :show-button="false"
        disabled
      >
        <template #suffix>°</template>
      </n-input-number>
    </div>

    <div class="row-item">
      <span>{{ $t("endElevation") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.endDegreesArray[2]"
        :show-button="false"
        disabled
      >
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>

    <div class="row-item">
      <span>{{ $t("disPlayInfo") }}</span>
      <div class="check-box">
        <n-checkbox v-model:checked="state.profileInfoShow"></n-checkbox>
      </div>
    </div>

    <div class="row-item" v-show="state.profileInfoShow">
      <span></span>
      <div class="check-box">
        <n-radio-group
          v-model:value="state.infoShowMode"
          name="radiogroup"
          class="radio-group"
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

  <div class="btn-row-item" style="margin-right: 0.1rem; margin-top: 0.12rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      class="ans-btn"
      @click="analysis"
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

  <!-- 图表 -->
  <div v-show="state.profileInfoShow">
    <div
      v-show="!state.gpuDomShow"
      id="echartsProfile"
      class="chartContainer"
    ></div>
    <div class="chartContainer" v-show="state.gpuDomShow">
      <div style="font-size: 0.16rem; margin-top: -5px">
        {{ $t("GPUSection") }}
      </div>
      <canvas id="pro" style="z-index: 999" height="0" width="0"></canvas>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import echarts from "@/tools/echarts";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";
import profileAnalysis from "./js/profile"; // 剖面分析封装类

const scene = viewer.scene;

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
let handlerPolyline, ctx, canvas;
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
  handlerPolyline = null;
  state.profileInfoShow = false;
});

// 为剖面分析设置数据
function setDataForGpuProFile(result: any) {
  let line = result.object;
  if (line.positions.length < 2) {
    return;
  }
  let startPoint = line.positions[0];
  let endPoint = line.positions[1];

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
function analysis() {
  // 解决缺陷【8035】GPU剖面分析下报错崩溃问题
  profile.clear();
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  profile_GPU.destroy();
  profile_GPU = new SuperMap3D.Profile(scene);

  let interValID = setInterval(() => {
    if (!handlerPolyline.positions) return;

    let positions = handlerPolyline.positions;
    if (positions.length === 1) {
      let result = tool.CartesiantoDegrees(positions[0]);
      state.startDegreesArray = result.map((num: any) =>
        Number(num.toFixed(2))
      );
    } else if (positions.length >= 2) {
      let resultS = tool.CartesiantoDegrees(positions[0]);
      let resultE = tool.CartesiantoDegrees(positions[positions.length - 1]);
      state.startDegreesArray = resultS.map((num: any) =>
        Number(num.toFixed(2))
      );
      state.endDegreesArray = resultE.map((num: any) => Number(num.toFixed(2)));
    }
  }, 100);

  if (!handlerPolyline) handlerPolyline = initHandler("Polyline");
  handlerPolyline.handlerDrawing().then(
    (res) => {
      setDataForGpuProFile(res);

      clearInterval(interValID);
      state.show = true;
      profile.startProfile(res.object.positions).then((res) => {
        if (res) {
          state.show = false;
        }
      });
      if (state.infoShowMode === "canvas")  {
        // getCanvasImage();
        setTimeout(()=>{ // 通过定时器延迟执行获取，还是不对，接口问题？
          getCanvasImage();
        },1000)
      }
      handlerPolyline.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

// GPU剖面分析
function getCanvasImage() {
  state.gpuDomShow = true;
  if (!state.gpuProfileState) return;

  //分析完毕的回调函数
  profile_GPU.getBuffer(function (buffer: any) {
    canvas = document.getElementById("pro");
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
  profile.clear();
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  profile_GPU.destroy();
  if (handlerPolyline) handlerPolyline.clearHandler();

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
.chartContainer {
  position: fixed !important;
  bottom: 0.2rem;
  left: 32vw;
  width: 36vw;
  height: 30vh;
  background-color: rgba(0, 8, 23, 0.7);
  opacity: 0.7;
  padding: 0.05rem 0.1rem 0.1rem 0.05rem;
  z-index: 99;
}

#pro {
  width: 36vw;
  height: 28vh;
  left: 4.7rem;
  background-color: rgba(0, 8, 23, 0.7);
  opacity: 0.7;
}
</style>
