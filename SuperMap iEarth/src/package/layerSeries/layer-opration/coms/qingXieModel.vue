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

  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="start" style="margin-right: 0.1rem">
      {{ state.actionName }}
    </n-button>
    <n-button class="btn-secondary" @click="clear">{{
      $t("clear")
    }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type StateType = {
  selectedIndex: number; //默认选择图层index
  operationType: number; //操作类型
  actionName: string; // 当前操作名称
  isQxModel: boolean; //是否为倾斜模型
};

// 初始化变量
let state = reactive<StateType>({
  selectedIndex: 0, //默认选择图层index
  operationType: 0, //操作类型
  actionName: "",
  isQxModel: false,
});
let currentS3MLayer:any = undefined;

function init() {
  if (!window.viewer) return;
  const selectS3MName = window.iEarthBindData.CurrentS3MLayerName;
  currentS3MLayer = viewer.scene.layers.find(selectS3MName);
  state.actionName = $t("excavate");

  // 所有S3M图层均支持开挖和压平，不局限于倾斜图层
  // // 判断当前图层是否为倾斜摄影模型 - 目前以RealityMesh来做判断；不太可靠：http://www.supermapol.com/realspace/services/3D-srsb/rest/realspace
  // if (currentS3MLayer._dataType === "RealityMesh") {
  //   state.isQxModel = true;
  // } else {
  //   state.isQxModel = false;
  // }
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {});

// 倾斜摄影模型开挖压平
//开挖
function excavationUpdate(excavation_position) {
  currentS3MLayer.addExcavationRegion({
    position: excavation_position,
    name: "excavation_" + Math.random(),
  });
}

//更新地形修改
function flattenUpdate(positions) {
  currentS3MLayer.addFlattenRegion({
    position: positions,
    name: "flatten" + Math.random(),
  });
}

// 开始
async function start() {
  const positions_c3 = await drawHandler.startPolygon();
  let position = window.iEarthTool.Cartesian3ToDegreeArray(positions_c3);
  if (state.operationType < 1) {
    excavationUpdate(position);
  } else {
    flattenUpdate(position);
  }
}

// 清除
function clear() {
  drawHandler.destroy();
  if (!currentS3MLayer) return;
  if (state.operationType < 1) {
    currentS3MLayer.removeAllExcavationRegion();
  } else {
    currentS3MLayer.removeAllFlattenRegion();
  }
}

// 监听
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
</script>

<style lang="scss" scoped>
.row-item .radio-group {
  width: 1.5rem;
  margin-right: 0.35rem;
}
</style>
