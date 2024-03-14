<template>
  <div class="row-item">
    <span>{{ $t("clipMode") }}</span>
    <n-radio-group
      v-model:value="state.operationType"
      name="operationType"
      class="radio-group"
    >
      <n-radio :value="1">{{ $t("flatten2") }}</n-radio>
      <n-radio :value="0">{{ $t("excavate") }}</n-radio>
    </n-radio-group>
  </div>

  <div class="btn-row-item" v-if="state.isQxModel">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="start"
      style="margin-right: 0.1rem"
    >
      {{ state.actionName }}
    </n-button>
    <n-button class="btn-secondary" @click="clear">{{ $t("clear") }}</n-button>
  </div>

  <div class="btn-row-item" v-else>
    <n-tooltip>
      <template #trigger>
        <n-button
          type="info"
          disabled
          color="#3499E5"
          text-color="#fff"
          @click="start"
          style="margin-right: 0.1rem"
        >
          {{ state.actionName }}
        </n-button>
      </template>
      {{ $t("qxModelTip") }}
    </n-tooltip>
    <n-button class="btn-secondary" disabled @click="clear">{{
      $t("clear")
    }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";

const layerStore = useLayerStore();

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectedIndex: number; //默认选择图层index
  operationType: number; //操作类型
  actionName: string; // 当前操作名称
  isQxModel: boolean; //是否为倾斜模型
};

// 初始化变量
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedIndex: 0, //默认选择图层index
  operationType: 0, //操作类型
  actionName: "",
  isQxModel: false,
});
let layers, handlerPolygon;

function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  state.actionName = $t("excavate");

  // 判断当前图层是否为倾斜摄影模型 - 目前以RealityMesh来做判断
  if (layers[state.selectedIndex]._dataType === "RealityMesh") {
    state.isQxModel = true;
  } else {
    state.isQxModel = false;
  }
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
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
}

// 倾斜摄影模型开挖压平
//开挖
function excavationUpdate(excavation_position) {
  layers[state.selectedIndex].addExcavationRegion({
    position: excavation_position,
    name: "excavation_" + Math.random(),
  });
}

//更新地形修改
function flattenUpdate(positions) {
  layers[state.selectedIndex].addFlattenRegion({
    position: positions,
    name: "flatten" + Math.random(),
  });
}

// 开始
function start() {
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let position = tool.CartesiantoDegrees(res.object.positions);
      if (state.operationType < 1) {
        excavationUpdate(position);
      } else {
        flattenUpdate(position);
      }
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  if (!layers[state.selectedIndex]) return;
  if (state.operationType < 1) {
    layers[state.selectedIndex].removeAllExcavationRegion();
  } else {
    layers[state.selectedIndex].removeAllFlattenRegion();
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
  () => state.operationType,
  (val) => {
    if (val === 0) {
      state.actionName = $t("excavate");
    } else {
      state.actionName = $t("flatten2");
    }
  }
);
watch(
  () => layerStore.s3mLayerSelectIndex,
  (val) => {
    // reset();
    state.selectedIndex = Number(val);
  }
);
</script>

<style lang="scss" scoped>
.row-item .radio-group {
  width: 1.5rem;
  margin-right: 0.35rem;
}
</style>
