<template>
  <div class="row-item">
    <span>{{ $t("clipMode") }}</span>
    <n-radio-group
      v-model:value="state.directionByNormal"
      name="radiogroup"
      class="radio-group"
    >
      <n-radio
        v-for="item in state.modeOptions"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </n-radio>
    </n-radio-group>
  </div>

  <div class="row-item">
    <span>{{ $t("displayCilpPlane") }}</span>
    <n-checkbox
      style="width: 1.96rem"
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
      >{{ $t("clip") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted, onBeforeUnmount } from "vue";
import ClipPlane from "./js/clip-plane.js";
import tool from "@/tools/tool";

type stateType = {
  zoom: number; // 缩放
  clipFaceShow: boolean; // 是否显示裁剪面
  directionByNormal: boolean; // 是否沿法线
  modeOptions: any[]; // 模式选项
  pickPosition: any; // 存储当前裁剪平面拾取位置
  normal: any; // 存储当前裁剪平面法线
};

let state = reactive<stateType>({
  zoom: 1,
  clipFaceShow: true,
  directionByNormal: false,
  pickPosition: null,
  normal: null,
  modeOptions: [
    {
      label: $t("verticalNormal"),
      value: false,
    },
    {
      label: $t("parallelNormal"),
      value: true,
    },
  ],
});

let modelUrl = "./Resource/model/box.s3m";
let layers = viewer.scene.layers.layerQueue;
let clipPlane = new ClipPlane(viewer, {
  modelUrl: modelUrl,
  setDirectionByNormal: state.directionByNormal,
});

function init() {
  if (!viewer) return;
  for (let layer of layers) {
    layer.selectEnabled = false;
    // 设置被裁剪对象的颜色
    layer.clipLineColor = new SuperMap3D.Color(1, 1, 1, 0);
  }
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});

// 分析
function clipPlaneStart() {
  tool.setMouseCursor("measureCur");

  viewer.eventManager.addEventListener("CLICK", left_click, true);
  viewer.eventManager.addEventListener("MOUSE_MOVE", mouse_move);
}

// 左键点击，确定cross裁剪位置
function left_click(e: any) {
  let pickPosition = viewer.scene.pickPosition(e.message.position);
  let normal = viewer.scene.pickNormal(e.message.position);
  state.pickPosition = pickPosition;
  state.normal = normal;
  if (pickPosition) clipPlane.startClip(pickPosition, normal);
  clipPlane.setClipPlaneScale(5);

  viewer.eventManager.removeEventListener("CLICK", left_click);
  viewer.eventManager.removeEventListener("MOUSE_MOVE", mouse_move);
  tool.setMouseCursor("normal");
}

//沿法线方向裁剪时实时显示参考平面
function mouse_move(e: any) {
  if (state.directionByNormal) {
    let cartesian = viewer.scene.pickPosition(e.message.position);
    let normal = viewer.scene.pickNormal(e.message.position);
    clipPlane.setReferencePlane(cartesian, normal);
  }
}

// 更新平面裁剪模式
function updatePlane() {
  clipPlane.clear();

  if (state.directionByNormal) {
    clipPlane.setReferencePlane(state.pickPosition, state.normal);
  }
  if (state.pickPosition) clipPlane.startClip(state.pickPosition, state.normal);
}

// 清除
function clear() {
  clipPlane.clear();
  state.pickPosition = null;
  state.normal = null;
  viewer.eventManager.removeEventListener("CLICK", left_click);
  viewer.eventManager.removeEventListener("MOUSE_MOVE", mouse_move);
  tool.setMouseCursor("normal");
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
    if (state.pickPosition) {
      updatePlane();
    }
  }
);
</script>
