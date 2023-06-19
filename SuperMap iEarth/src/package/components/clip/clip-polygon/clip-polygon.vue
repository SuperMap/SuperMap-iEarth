<template>
  <sm-rowLayOut marginbottom="0.2rem">
    <template #item-lable>裁剪模式</template>
    <template #item-content>
      <n-radio-group v-model:value="state.clipMode" name="radiogroup">
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

  <sm-btnGroup>
    <template #btn-left>
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="clipPolygon"
        >裁剪</n-button
      >
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clear">清除</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { reactive, watch, onBeforeUnmount } from "vue";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";

// 初始化默认数据
let state = reactive({
  clipMode: Cesium.ModifyRegionMode.CLIP_INSIDE,
  modeOptions: [
    {
      label: "内部",
      value: Cesium.ModifyRegionMode.CLIP_INSIDE,
    },
    {
      label: "外部",
      value: Cesium.ModifyRegionMode.CLIP_OUTSIDE,
    },
  ],
});

let layers: any, handlerPolygon: any, polygonPosition: any;

//

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
    layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
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

