<template>
  <!-- 立面图 -->
  <div class="row-container">
    <div class="row-item">
      <span>最大高度</span>
      <div class="slider-box">
        <n-slider style="width: 1.2rem;" v-model:value="state.maxHeight" :step="10" :min="1" :max="1000" />
        <div class="slider-suffix">
          <span>{{ state.maxHeight }}</span>
          <span class="slider-unit">M</span>
        </div>
      </div>
    </div>

    <div class="row-item">
      <span>最远距离</span>
      <div class="slider-box">
        <n-slider style="width: 1.2rem;" v-model:value="state.maxDistence" :step="10" :min="1" :max="1000" />
        <div class="slider-suffix">
          <span>{{ state.maxDistence }}</span>
          <span class="slider-unit">M</span>
        </div>
      </div>
    </div>
  </div>

  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="drawRegion"
      style="margin-right: 0.1rem;">绘制</n-button>
    <n-button type="info" color="#3499E5" text-color="#fff" @click="executeImage"
      style="margin-right: 0.1rem">出图</n-button>
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>
    
<script setup lang="ts">
import { reactive, watch, onMounted, onBeforeMount,onBeforeUnmount} from "vue";

type stateType = {
  maxHeight: number,// 最大高度
  maxDistence: number,// 最远距离
}

let state = reactive<stateType>({
  maxHeight: 100,
  maxDistence: 500
})

const scene = viewer.scene;
// viewer.resolutionScale = window.devicePixelRatio;
// scene.lightSource.ambientLightColor = new SuperMap3D.Color(0.65, 0.65, 0.65, 1);

// 初始化数据
let facade, handlerLine;

// 组件初始化
function init() {
  if (!viewer) return;
  facade = new SuperMap3D.Facade(scene);
  facade.build();
  handlerLine = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Line);
}

// onMounted 都不行，setUp执行顺序会更前一点，导致一些变量失效
// onBeforeMount(()=>{
//   init();
// })
if (viewer) init();


handlerLine.drawEvt.addEventListener(function (result:any) {
  result.object.show = false;
  let startPoint = result.object.positions[0];
  let endPoint = result.object.positions[1];
  facade.startPoint = startPoint;
  facade.endPoint = endPoint;
});

// 绘制立方图范围
function drawRegion() {
  handlerLine.activate();
}

// 执行出图，并下载
function executeImage() {
  facade.readyPromise.then(function (base64data:any) {
    download(base64data);
  });
}

// 清除
function clear() {
  facade.clear();
  handlerLine.clear();
}

// 将Image转换成Canvas
function convertImageToCanvas(image:any) {
  let canvas:any = document.createElement("canvas");
  if(canvas){
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
  }
}

// 将结果转成Image图表，并下载
function download(base64data:any) {
  let image = new Image();
  image.src = base64data;
  image.onload = function () {
    let canvas = convertImageToCanvas(image);
    let url = canvas.toDataURL("image/jpeg");
    let a = document.createElement('a');
    let event = new MouseEvent('click');
    a.download = (new Date()).getTime() + ".jpg"; // 指定下载图片的名称
    a.href = url;
    a.dispatchEvent(event); // 触发超链接的点击事件
  }
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

onBeforeUnmount(()=>{
  clear();
})
</script>
    
<style lang="scss" scoped></style>