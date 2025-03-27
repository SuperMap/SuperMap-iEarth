<template>
  <div class="row-item">
    <span>{{ $t("clipMode") }}</span>
    <n-radio-group
      v-model:value="state.clipMode"
      class="radio-group"
      name="radiogroup"
      style="margin-right: 0.3rem; width: 1.65rem"
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

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="clipPolygon"
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
import DrawHandler from "@/lib/DrawHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  clipMode: any; // 内部还是外部
  modeOptions: any; //模式选项
};

// 初始化默认数据
let state = reactive<stateType>({
  clipMode: SuperMap3D.ModifyRegionMode.CLIP_INSIDE,
  modeOptions: [
    {
      label: $t("inner"),
      value: SuperMap3D.ModifyRegionMode.CLIP_INSIDE,
    },
    {
      label: $t("outer"),
      value: SuperMap3D.ModifyRegionMode.CLIP_OUTSIDE,
    },
  ],
});

let polygonPosition: any;
let layers = viewer.scene.layers.layerQueue;

function init() {
  if (!viewer) return;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});

// 分析
async function clipPolygon() {
  for (let layer of layers) {
    layer.selectEnabled = false;
    // 设置被裁剪对象的颜色
    layer.clipLineColor = new SuperMap3D.Color(1, 1, 1, 0);
  }

  const positions_c3 = await drawHandler.startPolygon();
  let positions = window.iEarthTool.Cartesian3ToDegreeArray(positions_c3);
  clipPolygonUpdate(positions);
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
  drawHandler.destroy();
  if (!layers) return;
  for (let layer of layers) {
    layer.clearModifyRegions();
  }
  polygonPosition = null;
}

// 监听
watch(
  () => state.clipMode,
  () => {
    if (polygonPosition) clipPolygonUpdate(polygonPosition);
  }
);
</script>
