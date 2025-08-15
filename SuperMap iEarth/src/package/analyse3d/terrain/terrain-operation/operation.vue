<!-- 地形操作 -->
<template>
  <div class="btn-list-box">
    <div class="btn" :class="item.isSelect ? 'select-btn' : ''" v-for="(item, index) in comList" :key="index"
      @click="changeItem(item)">
      {{ item.name }}
    </div>
  </div>

  <!-- 地形开挖 -->
  <div v-if="state.operationType === 'dig'">
    <!-- 开挖深度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("excavationDepth") }}</div>
      <div class="content">
        <n-input-number :update-value-on-input="false" v-model:value="state.digDepth" :show-button="false">
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>

    <!-- 开挖区域上移 -->
    <div class="row-wrap">
      <div class="content">
        <div class="switch-box">
          <div class="text">{{ $t("excavateAreaOffsetUp") }}</div>
          <n-switch v-model:value="state.isPullOut" size="small" />
        </div>
      </div>
    </div>

    <!-- 上移高度 -->
    <div class="row-wrap" v-if="state.isPullOut">
      <div class="label">{{ $t("upHeight") }}</div>
      <div class="content">
        <n-input-number v-model:value="state.upHeight" :update-value-on-input="false" :show-button="false">
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="row-wrap" v-show="!state.isPullOut">
      <div class="content">
        <n-checkbox v-model:checked="state.isEdit" :label="$t('editArea')" />
      </div>
    </div>

    <!-- 编辑区域Z轴 -->
    <div class="row-wrap" v-show="!state.isPullOut && state.isEdit">
      <div class="content">
        <n-checkbox v-model:checked="state.isEditZ" :label="$t('editAreaZ')" />
      </div>
    </div>
  </div>

  <!-- 地形修改 -->
  <div v-if="state.operationType === 'modify'">
    <!-- 编辑区域 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.isEdit" :label="$t('editArea')" />
      </div>
    </div>
    <!-- 编辑区域 -->
    <div class="row-wrap" v-show="state.isEdit">
      <div class="content">
        <n-checkbox v-model:checked="state.isEditZ" :label="$t('editAreaZ')" />
      </div>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="Analyze" class="operate" type="info" :focusable="false">{{
    state.operationType == "dig" ? $t("excavate") : $t("flatten")
    }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>

  <!-- 辅助提示 -->
  <div class="panel-footer-tip-box"> {{ $t("stkUnsupported") }} </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";
import setEditHandler from "@/tools/editHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  digDepth: number; // 开挖深度
  isEdit: boolean; // 是否编辑
  isEditZ: boolean; // 编辑时是否只编辑Z轴
  operationType: string; // 操作方式，默认为dig-开挖
  isPullOut: boolean; // 是否将开挖地形抽出显示
  upHeight: number; // 抽出高度
};

// 设置默认值数据
let state = reactive<stateType>({
  digDepth: 500,
  isEdit: false,
  isEditZ: false,
  operationType: "dig",
  isPullOut: false,
  upHeight: 500,
});

let digPisitions, removeEdit;
let comList = reactive([
  {
    name: $t("terrainExcavate"),
    isSelect: true,
  },
  {
    name: $t("terrainChange"),
    isSelect: false,
  },
]);

onMounted(() => {});

onBeforeUnmount(() => {
  clear();
});

// 分析
function Analyze() {
  clear();

  drawHandler.startPolygon().then(positions => {
      let positions_ = window.iEarthTool.Cartesian3ToDegreeArray(positions);
      if (state.operationType === "dig") digUpdate(positions_);
      else modifyUpdate(positions_);
      if (state.isEdit) {
        setEdit();
      }
  });
}

//更新
function digUpdate(positions: any) {
  digPisitions = positions;
  viewer.scene.globe.removeAllExcavationRegion();

  if (state.isPullOut) {
    viewer.scene.globe.removeAllExtractRegion();
    // 地形开挖并抽出
    viewer.scene.globe.addExtractRegion({
      name: "extract", //名称
      position: positions, //区域
      height: state.digDepth, //开挖深度
      transparent: false, //封边是否透明
      extractHeight: state.upHeight, //抽出高度
      granularity: 1, //精度
    });
  } else {
    // 只进行地形开挖操作
    viewer.scene.globe.addExcavationRegion({
      name: "dig_terrain",
      position: positions,
      height: state.digDepth,
      transparent: false,
    });
  }
}

// 修改地形更新
function modifyUpdate(positions: any) {
  viewer.scene.globe.removeAllModifyRegion();
  viewer.scene.globe.addModifyRegion({
    name: "ggg",
    position: positions,
  });
}

// 编辑
function setEdit() {
  if (!drawHandler.handlePolygon) return;
  if (!drawHandler.handlePolygon.polygon) return;
  const polygon = drawHandler.handlePolygon.polygon;
  polygon.show = true;
  setEditHandler(polygon, state.isEditZ, updateEdit);
}

// 更新编辑点
function updateEdit(p: any) {
  let positions = window.iEarthTool.Cartesian3ToDegreeArray(p);
  if (state.operationType === "dig") digUpdate(positions);
  else modifyUpdate(positions);
}

// 清除编辑handle
function removeEditHandler() {
  if (window.editHandler) window.editHandler.clear();
  if (drawHandler.handlePolygon && drawHandler.handlePolygon.polygon){
    drawHandler.handlePolygon.polygon.show = false;
  }
}

// 点击切换项目
function changeItem(item: any) {
  comList.map((itemObj) => {
    if (itemObj.name == item.name) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });

  if (item.name === "地形开挖") {
    state.operationType = "dig";
  } else {
    state.operationType = "modify";
  }

  state.isEdit = false;
  state.isEditZ = false;

  clear();
}

// 清除
function clear() {
  if (drawHandler) drawHandler.destroy();
  clearDig();
  clearModify();
  removeEditHandler();
}
// 清除开挖地形
function clearDig() {
  viewer.scene.globe.removeAllExcavationRegion(); // 地形开挖
  viewer.scene.globe.removeAllExtractRegion(); // 地形开挖抽出
  digPisitions = null;
}
// 清除修改地形
function clearModify() {
  viewer.scene.globe.removeAllModifyRegion();
}

//监听
watch(
  () => state.isEdit,
  (val) => {
    if (val) setEdit();
    else removeEditHandler();
  }
);
watch(
  () => state.isPullOut,
  () => {
    clear();
  }
);
watch(
  () => state.isEditZ,
  (val) => {
    if (window.editHandler) {
      window.editHandler.isEditZ = val;
    }
  }
);
// 关闭实时改变开挖深度，抽出高度暂时改不了
watch(
  () => state.digDepth,
  () => {
    if (digPisitions) digUpdate(digPisitions);
  }
);
watch(
  () => state.upHeight,
  () => {
    if (digPisitions) digUpdate(digPisitions);
  }
);
</script>