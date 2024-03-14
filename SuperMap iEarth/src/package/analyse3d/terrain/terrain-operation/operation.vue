<template>
  <!-- 地形操作 -->
  <div class="btn-list">
    <div
      class="btn"
      :class="item.isSelect ? 'select-btn' : ''"
      v-for="(item, index) in comList"
      :key="index"
      @click="changeItem(item)"
    >
      {{ item.name }}
    </div>
  </div>

  <div v-if="state.operationType === 'dig'">
    <div class="row-item">
      <span>{{ $t("excavationDepth") }}</span>
      <n-input-number
        style="width: 1.96rem"
        :update-value-on-input="false"
        v-model:value="state.digDepth"
        :show-button="false"
      >
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>

    <div class="row-item">
      <span>{{ $t("excavateAreaOffsetUp") }}</span>
      <div style="width: 1.96rem">
        <n-switch v-model:value="state.isPullOut" size="small" />
      </div>
    </div>

    <div class="row-item" v-if="state.isPullOut">
      <span>{{ $t("upHeight") }}</span>
      <n-input-number
        style="width: 1.96rem"
        v-model:value="state.upHeight"
        :update-value-on-input="false"
        :show-button="false"
      >
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>

    <div class="row-item" v-show="!state.isPullOut">
      <span>{{ $t("editArea") }}</span>
      <n-checkbox
        style="width: 1.96rem"
        v-model:checked="state.isEdit"
      ></n-checkbox>
    </div>

    <div class="row-item" v-show="!state.isPullOut && state.isEdit">
      <span>{{ $t("editAreaZ") }}</span>
      <n-checkbox
        style="width: 1.96rem"
        v-model:checked="state.isEditZ"
      ></n-checkbox>
    </div>
  </div>

  <div v-if="state.operationType === 'modify'">
    <div class="row-item">
      <span>{{ $t("editArea") }}</span>
      <n-checkbox
        style="width: 1.96rem"
        v-model:checked="state.isEdit"
      ></n-checkbox>
    </div>

    <div class="row-item" v-show="state.isEdit">
      <span>{{ $t("editAreaZ") }}</span>
      <n-checkbox
        style="width: 1.96rem"
        v-model:checked="state.isEditZ"
      ></n-checkbox>
    </div>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="Analyze"
      style="margin-right: 0.1rem"
      >{{
        state.operationType == "dig" ? $t("excavate") : $t("flatten")
      }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
  <div class="stktip">
    <span>{{ $t("stkUnsupported") }}</span>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import tool from "@/tools/tool";
import initHandler from "@/tools/drawHandler";
import setEditHandler from "@/tools/editHandler";

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

let handlerPolygon, digPisitions, removeEdit;
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
  if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
  handlerPolygon.handlerDrawing().then(
    (res: any) => {
      handlerPolygon.polylineTransparent.show = false;
      let positions = tool.CartesiantoDegrees(res.object.positions);
      if (state.operationType === "dig") digUpdate(positions);
      else modifyUpdate(positions);
      if (state.isEdit) {
        setEdit();
      }
    },
    (err: any) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
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
  viewer.selectedEntity = undefined;
  if (!handlerPolygon) return;
  if (!handlerPolygon.polygon) return;
  handlerPolygon.polygon.show = true;
  removeEdit = viewer.selectedEntityChanged.addEventListener(() => {
    if (viewer.selectedEntity && viewer.selectedEntity.id) {
      setEditHandler(viewer.selectedEntity, state.isEditZ, updateEdit);
    }
  });
}

// 更新编辑点
function updateEdit(p: any) {
  let positions = tool.CartesiantoDegrees(p);
  if (state.operationType === "dig") digUpdate(positions);
  else modifyUpdate(positions);
}

// 清除编辑handle
function removeEditHandler() {
  if (removeEdit) removeEdit();
  if (window.editHandler) window.editHandler.clear();
  viewer.selectedEntity = undefined;
  if (handlerPolygon && handlerPolygon.polygon)
    handlerPolygon.polygon.show = false;
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
  if (handlerPolygon) handlerPolygon.clearHandler();
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

<style lang="scss" scoped>
.btn-list {
  width: 3.4rem;
  justify-content: space-evenly;
  margin-bottom: 0.15rem;

  .btn {
    width: fit-content;
    padding: 0 0.08rem;
  }
}

.stktip {
  color: rgba(255, 255, 255, 0.45);
  margin-top: -20px;

  span {
    font-family: "Microsoft JhengHe", sans-serif; // Microsoft Yahei
    font-size: 0.14rem;
  }
}
</style>
