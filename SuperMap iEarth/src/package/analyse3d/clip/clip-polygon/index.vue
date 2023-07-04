<template>
  <div class="row-item">
    <span>裁剪模式</span>
    <n-radio-group
      v-model:value="state.clipMode"
      class="radio-group"
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
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="clipPolygon"
      style="margin-right: 0.1rem"
      >分析</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onBeforeUnmount } from "vue";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";

type stateType = {
  clipMode:any,// 内部还是外部
  modeOptions:any,//模式选项
}

// 初始化默认数据
let state = reactive({
  clipMode: SuperMap3D.ModifyRegionMode.CLIP_INSIDE,
  modeOptions: [
    {
      label: "内部",
      value: SuperMap3D.ModifyRegionMode.CLIP_INSIDE,
    },
    {
      label: "外部",
      value: SuperMap3D.ModifyRegionMode.CLIP_OUTSIDE,
    },
  ],
});

let layers: any, handlerPolygon: any, polygonPosition: any;

function init() {
  if (!viewer) return;
  layers = viewer.scene.layers.layerQueue;
}
init();

// 分析
function clipPolygon() {
  for (let layer of layers) {
    layer.selectEnabled = false;
    // 设置被裁剪对象的颜色
    layer.clipLineColor = new SuperMap3D.Color(1, 1, 1, 0);
  }
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }

  handlerPolygon.handlerDrawing().then(
    (res: any) => {
      let positions = tool.CartesiantoDegrees(res.object.positions);
      clipPolygonUpdate(positions);
    },
    (err: any) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}
// 更新
function clipPolygonUpdate(p: any) {
  polygonPosition = p;
  for (let layer of layers) {
    layer.setModifyRegions([p], state.clipMode);
  }
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  if (!layers) return;
  for (let layer of layers) {
    layer.clearModifyRegions();
  }
  polygonPosition = null;
}

// 监听
watch(
  () => state.clipMode,
  (val: any) => {
    if (polygonPosition) clipPolygonUpdate(polygonPosition);
  }
);

onBeforeUnmount(() => {
  clear();
  if (handlerPolygon) handlerPolygon.destroy();
  // layers = undefined;
});
</script>

