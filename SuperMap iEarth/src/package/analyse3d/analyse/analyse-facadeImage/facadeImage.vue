<template>
  <!-- 立面图 -->
  <div class="row-item">
    <span>{{ $t("maxHeight") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.maxHeight"
        :step="10"
        :min="1"
        :max="1000"
      />
      <n-input-number
        v-model:value="state.maxHeight"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        placeholder=""
        size="small"
      />
      <span class="slider-unit">{{ $t("meter") }}</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("maxDistence") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.maxDistence"
        :step="10"
        :min="1"
        :max="1000"
      />
      <n-input-number
        v-model:value="state.maxDistence"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        placeholder=""
        size="small"
      />
      <span class="slider-unit">{{ $t("meter") }}</span>
    </div>
  </div>

  <div class="btn-row-item2">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="drawRegion"
      style="margin-right: 0.1rem"
      :title="$t('Draw')"
      >{{ $t("Draw") }}</n-button
    >
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="executeImage"
      style="margin-right: 0.1rem"
      :title="$t('Plot')"
      >{{ $t("Plot") }}</n-button
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
