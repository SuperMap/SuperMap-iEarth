<template>
  <div class="row-item">
    <span>{{ $t("chooseLayer") }}</span>
    <n-select
      style="width: 1.96rem"
      v-model:value="state.selectedIndex"
      :options="state.s3mlayers"
    />
  </div>

  <!-- <div class="row-item">
        <span>{{$t('offsetMode')}}</span>
        <n-radio-group v-model:value="state.offsetMode" name="shadowMode" style="width:1.96rem">
            <n-radio :value="0"><n-ellipsis >{{$t('selected')}}</n-ellipsis></n-radio>
            <n-radio :value="1"><n-ellipsis >多边形 </n-ellipsis></n-radio>
        </n-radio-group>
    </div> -->

  <div v-show="state.offsetMode === 0">
    <div class="row-item">
      <span>{{ $t("offsetX") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.offsetX"
          style="width: 70%"
          :min="-50"
          :max="50"
        />
        <n-input-number
          v-model:value="state.offsetX"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="-50"
          :max="50"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("offsetY") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.offsetY"
          style="width: 70%"
          :min="-50"
          :max="50"
        />
        <n-input-number
          v-model:value="state.offsetY"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="-50"
          :max="50"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("offsetZ") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.offsetZ"
          style="width: 70%"
          :min="-50"
          :max="50"
        />
        <n-input-number
          v-model:value="state.offsetZ"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="-50"
          :max="50"
          placeholder=""
          size="small"
        />
      </div>
    </div>
  </div>

  <div class="btn-row-item" style="margin-left: 0.83rem">
    <n-button @click="reset">{{ $t("reset") }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import { useMessage } from "naive-ui";

const layerStore = useLayerStore();
const message = useMessage();

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectedIndex: number; //默认选择图层index
  offsetX: number; //沿X轴偏移
  offsetY: number; //沿Y轴偏移
  offsetZ: number; //沿Z轴偏移
  polygonOffsetFactor: number; //偏移因子
  polygonOffsetUnit: number; //偏移单位
  offsetMode: number; //操作类型
};

// 初始化变量
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedIndex: 0, //默认选择图层index
  offsetX: 0, //沿X轴偏移
  offsetY: 0, //沿Y轴偏移
  offsetZ: 0, //沿Z轴偏移
  polygonOffsetFactor: 0, //偏移因子
  polygonOffsetUnit: 0, //偏移单位
  offsetMode: 0,
});
let layers;

function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  selectedoffsetChange(true);
  layers[state.selectedIndex].selectEnabled = true;
}

onMounted(() => {
  init();
  message.success($t("chooseThenOffset"));
});

onBeforeUnmount(() => {
  reset();
  layers = null;
});

function updateLayers() {
  layers = viewer.scene.layers.layerQueue;
  if (!layers || layers.length < 1) {
    state.s3mlayers = [{ label: () => $t("noLayer"), value: 0 }];
    return;
  }
  state.s3mlayers.length = 0;
  layers.forEach((layer, index) => {
    let name = layer._name;
    state.s3mlayers.push({
      label: name,
      value: index,
    });
  });
  if (state.selectedIndex > layers.length - 1) state.selectedIndex = 0;
  layers[state.selectedIndex].selectEnabled = true;
}

// 设置偏移
function setObjsOffset() {
  let ids = layers[state.selectedIndex].getSelection();
  layers[state.selectedIndex].removeAllObjsOffset(); // 移除所有图元的偏移
  if (ids.length > 0) {
    layers[state.selectedIndex].setObjsOffset(ids);
  }
}

// 重置偏移
function reset() {
  state.offsetX = 0;
  state.offsetY = 0;
  state.offsetZ = 0;
  layers[state.selectedIndex].selectedTranslate = new SuperMap3D.Cartesian3(
    0,
    0,
    0
  );
  layers[state.selectedIndex].selectEnabled = true;
}

// 设置选中模型偏移
function selectedoffsetChange(isSelected: boolean) {
  if (!layers[state.selectedIndex]) return;
  if (isSelected) {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    layers[state.selectedIndex].selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
    viewer.eventManager.addEventListener("CLICK", setObjsOffset, true);
  } else {
    viewer.eventManager.removeEventListener("CLICK", setObjsOffset);
    layers[state.selectedIndex].selectedTranslate = new SuperMap3D.Cartesian3(
      0,
      0,
      0
    );
    layers[state.selectedIndex].removeAllObjsOffset();
    layers[state.selectedIndex].releaseSelection(); // 释放选择集
  }
}

// 监听
watch(
  () => layerStore.layerChangeCount,
  () => {
    updateLayers();
  }
);
watch(
  () => state.offsetX,
  () => {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    layers[state.selectedIndex].selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
  }
);
watch(
  () => state.offsetY,
  () => {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    layers[state.selectedIndex].selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
  }
);
watch(
  () => state.offsetZ,
  () => {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    layers[state.selectedIndex].selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
  }
);
watch(
  () => state.polygonOffsetFactor,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].setPolygonoffset(
        Number(val),
        Number(state.polygonOffsetUnit)
      );
  }
);
watch(
  () => state.polygonOffsetUnit,
  (val) => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].setPolygonoffset(
        Number(state.polygonOffsetFactor),
        Number(val)
      );
  }
);
</script>
