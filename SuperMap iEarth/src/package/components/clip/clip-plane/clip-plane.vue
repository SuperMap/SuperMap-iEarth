<template>
  <div class="plane-container">
    <sm-rowLayOut marginbottom="0.2rem">
      <template #item-lable>裁剪模式</template>
      <template #item-content>
        <n-radio-group
          v-model:value="state.directionByNormal"
          name="radiogroup"
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
      </template>
    </sm-rowLayOut>
    <sm-rowLayOut>
      <template #item-lable>显示裁剪面</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.clipFaceShow"></n-checkbox>
      </template>
    </sm-rowLayOut>
  </div>

  <!-- <sm-rowLayOut >
    <template #item-lable>
      <div class="lable"> 缩放 </div>
    </template>
    <template #item-content>
      <n-slider v-model:value="state.zoom" :step="0.1" :min="0.1" :max="10" />
    </template>
  </sm-rowLayOut> -->

  <sm-btnGroup>
    <template #btn-left>
      <n-button type="info" @click="clipPlaneStart">裁剪</n-button>
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clear">清除</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { reactive, watch, onBeforeUnmount } from "vue";
import ClipPlane from "./clip-plane.js";

type stateType = {
  zoom: number;
  clipFaceShow: boolean;
  directionByNormal: boolean;
  modeOptions: any[];
};

let state = reactive<stateType>({
  zoom: 1,
  clipFaceShow: true,
  directionByNormal: false,
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

init();

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
    layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
  }
}

// 分析
function clipPlaneStart() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", left_click, true);
  viewer.eventManager.addEventListener("MOUSE_MOVE", mouse_move);
}

function left_click(e: any) {
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
  }
);

onBeforeUnmount(() => {
  clear();
});
</script>

<style lang="scss" scoped>
.plane-container {
  @include panelContainer(100%, 0.4rem);
}
</style>
  
