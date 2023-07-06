<template>
  <div class="row-item">
    <span>裁剪模式</span>
    <n-radio-group v-model:value="state.directionByNormal" name="radiogroup" class="radio-group">
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
  <div class="row-item">
    <span>显示裁剪面</span>
    <n-checkbox
      style="width: 1.96rem;height: 0.32rem;"
      v-model:checked="state.clipFaceShow"
    ></n-checkbox>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="clipPlaneStart"
      style="margin-right: 0.1rem"
      >裁剪</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onBeforeUnmount } from "vue";
import ClipPlane from "./js/clip-plane.js";

type stateType = {
  zoom: number; // 缩放
  clipFaceShow: boolean; // 是否显示裁剪面
  directionByNormal: boolean; // 是否沿法线
  modeOptions: any[]; // 模式选项
  currentPointInfo:any, // 当前裁剪位置相关信息
};

let state = reactive<stateType>({
  zoom: 1,
  clipFaceShow: true,
  directionByNormal: false,
  currentPointInfo:{},
  modeOptions: [
    {
      label: "截面前",
      value: false,
    },
    {
      label: "截面后",
      value: true,
    },
  ],
});

let layers: any, clipPlane: any;
let modelUrl = "./Resource/model/box.s3m";

function init() {
  if (!viewer) return;
  layers = viewer.scene.layers.layerQueue;
  clipPlane = new ClipPlane(viewer, {
    modelUrl: modelUrl,
    setDirectionByNormal: state.directionByNormal,
  });
  for (let layer of layers) {
    layer.selectEnabled = false;
    // 设置被裁剪对象的颜色
    layer.clipLineColor = new SuperMap3D.Color(1, 1, 1, 0);
  }
}

init();

// 分析
function clipPlaneStart() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", left_click, true);
  viewer.eventManager.addEventListener("MOUSE_MOVE", mouse_move);
}

// 左键点击，确定cross裁剪位置
function left_click(e: any) {
  state.currentPointInfo = e.message.endPosition;
  let pickPosition = viewer.scene.pickPosition(e.message.position);
  let normal = viewer.scene.pickNormal(e.message.position);
  if (pickPosition) clipPlane.startClip(pickPosition, normal);
  viewer.eventManager.removeEventListener("CLICK", left_click);
  viewer.eventManager.removeEventListener("MOUSE_MOVE", mouse_move);
  document.body.classList.remove("measureCur");
}

//沿法线方向裁剪时实时显示参考平面
function mouse_move(e: any) {
  if (state.directionByNormal) {
    let cartesian = viewer.scene.pickPosition(e.message.endPosition);
    let normal = viewer.scene.pickNormal(e.message.endPosition);
    clipPlane.setReferencePlane(cartesian, normal);
  }
}

// 更新平面裁剪模式
function updatePlane(){
  clear();

  if(state.directionByNormal){
    let cartesian = viewer.scene.pickPosition(state.currentPointInfo);
    let normal = viewer.scene.pickNormal(state.currentPointInfo);
    clipPlane.setReferencePlane(cartesian, normal);
  }else{
    let pickPosition = viewer.scene.pickPosition(state.currentPointInfo);
    let normal = viewer.scene.pickNormal(state.currentPointInfo);
    if (pickPosition) clipPlane.startClip(pickPosition, normal);
  }
}

// 清除
function clear() {
  clipPlane.clear();
  viewer.eventManager.removeEventListener("CLICK", left_click);
  viewer.eventManager.removeEventListener("MOUSE_MOVE", mouse_move);
  document.body.classList.remove("measureCur");
}

// 监听
watch(
  () => state.zoom,
  (val) => {
    clipPlane.setClipPlaneScale(val);
  }
);
watch(
  () => state.clipFaceShow,
  (val) => {
    clipPlane.setPlaneShow(val);
    clipPlane.setModelEditorShow(val);
  }
);
watch(
  () => state.directionByNormal,
  (val) => {
    clipPlane.setDirectionByNormal = val;
    updatePlane();
  }
);

onBeforeUnmount(() => {
  clear();
});
</script>

<style lang="scss" scoped>
</style>

