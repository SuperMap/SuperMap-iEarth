<!-- 立面图 -->
<template>
  <!-- 最大高度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("maxHeight") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider class="shorter" v-model:value="state.maxHeight" :step="10" :min="1" :max="1000" />
        <n-input-number v-model:value="state.maxHeight" :update-value-on-input="false"
          :bordered="false" :show-button="false" placeholder="" size="small" />
        <span class="unit">{{ $t("meter") }}</span>
      </div>
    </div>
  </div>

  <!-- 最远距离 -->
  <div class="row-wrap">
    <div class="label">{{ $t("maxDistence") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider class="shorter" v-model:value="state.maxDistence" :step="10" :min="1" :max="1000" />
        <n-input-number v-model:value="state.maxDistence" :update-value-on-input="false"
          :bordered="false" :show-button="false" placeholder="" size="small" />
        <span class="unit">{{ $t("meter") }}</span>
      </div>
    </div>
  </div>


  <div class="row-btns">
    <n-button @click="drawRegion" class="operate" type="info" :focusable="false">{{
    $t("Draw") }}</n-button>
    <n-button @click="executeImage" class="operate" type="info" :focusable="false">{{
    $t("Plot") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onBeforeUnmount } from "vue";
import DrawHandler from "@/lib/DrawHandler";

type stateType = {
  maxHeight: number; // 最大高度
  maxDistence: number; // 最远距离
};

const state = reactive<stateType>({
  maxHeight: 100,
  maxDistence: 500,
});

// 初始化变量
const scene = viewer.scene;
const facade = new SuperMap3D.Facade(scene);
// 绘制类
const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

// 组件初始化
function init() {
  facade.build();
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});

// 绘制立方图范围
async function drawRegion() {
  const positions = await drawHandler.startPolyline();
  if(!positions || !(positions instanceof Array)) return;
  facade.startPoint = positions[0];
  facade.endPoint = positions[1];
}

// 执行出图，并下载
function executeImage() {
  facade.readyPromise.then(function (base64data: any) {
    download(base64data);
  });
}

// 将Image转换成Canvas
function convertImageToCanvas(image: any) {
  let canvas: any = document.createElement("canvas");
  if (canvas) {
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
  }
}

// 将结果转成Image图表，并下载
function download(base64data: any) {
  let image = new Image();
  image.src = base64data;
  image.onload = function () {
    let canvas = convertImageToCanvas(image);
    let url = canvas.toDataURL("image/jpeg");
    let a = document.createElement("a");
    let event = new MouseEvent("click");
    a.download = new Date().getTime() + ".jpg"; // 指定下载图片的名称
    a.href = url;
    a.dispatchEvent(event); // 触发超链接的点击事件
  };
}

// 清除
function clear() {
  facade.clear();
  drawHandler.destroy();
}

watch(
  () => state.maxHeight,
  (val: any) => {
    if (val === "" || val < 0) {
      // 避免删除导致崩溃
      val = 0;
    }
    facade.maxHeight = state.maxHeight;
  }
);
watch(
  () => state.maxDistence,
  (val: any) => {
    if (val === "" || val < 0) {
      // 避免删除导致崩溃
      val = 0;
    }
    facade.farDistance = state.maxDistence;
  }
);
</script>

<style lang="scss" scoped>
:deep(.shorter) .n-slider-rail {
  width: 2.2rem !important;
}
</style>