<template>
  <!-- 立面图 -->
  <div class="row-container">
    <div class="row-item">
      <span>{{ $t('global.maxHeight') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.2rem;" v-model:value="state.maxHeight" :step="10" :min="1" :max="1000" />
        <n-input-number 
          v-model:value="state.maxHeight" 
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false" 
          :show-button="false" 
          placeholder=""
          size="small" 
          />  
        <span class="slider-unit">{{ $t('global.meter') }}</span>
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t('global.maxDistence') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.2rem;" v-model:value="state.maxDistence" :step="10" :min="1" :max="1000" />
        <n-input-number 
          v-model:value="state.maxDistence" 
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false" 
          :show-button="false" 
          placeholder=""
          size="small" 
          />  
        <span class="slider-unit">{{ $t('global.meter') }}</span>
      </div>
    </div>
  </div>

  <div class="btn-row-item2">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="drawRegion"
      style="margin-right: 0.1rem;">{{ $t('global.Draw') }}</n-button>
    <n-button type="info" color="#3499E5" text-color="#fff" @click="executeImage"
      style="margin-right: 0.1rem">{{ $t('global.Plot') }}</n-button>
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t('global.clear') }}</n-button>
  </div>
</template>
    
<script setup lang="ts">
import { reactive, watch,onBeforeUnmount} from "vue";

type stateType = {
  maxHeight: number,// 最大高度
  maxDistence: number,// 最远距离
}

let state = reactive<stateType>({
  maxHeight: 100,
  maxDistence: 500
})

const scene = viewer.scene;

// 初始化数据
let facade, handlerLine;

// 组件初始化
function init() {
  if (!viewer) return;
  facade = new SuperMap3D.Facade(scene);
  facade.build();
  handlerLine = new SuperMap3D.DrawHandler(viewer, SuperMap3D.DrawMode.Line);
}
init();

handlerLine.activeEvt.addEventListener((isActive: any) => {
  if (isActive == true) {
    window.viewer.enableCursorStyle = false;
    window.viewer._element.style.cursor = '';
    document.body.classList.add("drawCur");
  } else {
    window.viewer.enableCursorStyle = true;
    document.body.classList.remove('drawCur');
  }
});

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
    
<style lang="scss" scoped>
</style>