<template>
  <div class="layerSeries-box">
    <div class="row-item">
      <span>{{ $t("selectQxLayer") }}</span>
      <n-select
        style="width: 2.1rem"
        v-model:value="state.selectedIndex"
        :options="state.s3mlayers"
      />
    </div>

    <div class="row-item">
      <span>{{ $t("transparency") }}</span>
      <div class="slider-box" style="width: 1.9rem">
        <n-slider
          style="width: 2.2rem"
          v-model:value="state.transparency"
          :step="0.1"
          :min="0.1"
          :max="1"
        />
        <n-input-number
          v-model:value="state.transparency"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="0.1"
          :max="1"
          :step="0.1"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="btn-row-item" style="margin-left: 0.93rem">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
            type="info"
            class="ans-btn"
            color="#3499E5"
            text-color="#fff"
            :focusable="false"
            @click="startCover"
            >{{ $t("cover") }}</n-button
          >
        </template>
        {{ $t("qxCoverTip") }}
      </n-tooltip>
      <n-button :focusable="false" @click="clear">{{ $t("clear") }}</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";

const layerStore = useLayerStore();

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectedIndex: number; //默认选择图层index
  transparency: number; //实体透明度
};

let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedIndex: 0, //默认选择图层index
  transparency: 0.7,
});

let layers;
let imagerySelectIndex = 0;
function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  imagerySelectIndex = Number(layerStore.imgLayerSelectIndex);
  if (layers[state.selectedIndex]) {
    layers[state.selectedIndex].selectEnabled = true;
  }
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});

// 获取当前s3m图层列表
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
  if (layers[state.selectedIndex]) {
    layers[state.selectedIndex].selectEnabled = true;
  }
}

function startCover() {
  let imgLayer = viewer.imageryLayers._layers[imagerySelectIndex];
  if (!imgLayer) return;
  imgLayer.alpha = Number(state.transparency);
  let qxLayer = viewer.scene.layers._layerQueue[state.selectedIndex];
  if (qxLayer) qxLayer.coverImageryLayer = imgLayer;
}

// 清除
function clear() {
  let imgLayer = viewer.imageryLayers._layers[imagerySelectIndex];
  let qxLayer = viewer.scene.layers._layerQueue[state.selectedIndex];
  if (imgLayer) imgLayer.alpha = 1;
  if (qxLayer) qxLayer.coverImageryLayer = undefined;
}

watch(
  () => state.transparency,
  (val) => {
    let imgLayer = viewer.imageryLayers._layers[imagerySelectIndex];
    if (imgLayer) imgLayer.alpha = val;
  }
);
</script>
