<template>
  <!-- 地形操作 -->
  <n-space vertical>
    <n-radio-group
      v-model:value="state.operationType"
      name="terrain-operation"
      style="width: 100%"
    >
      <n-space justify="space-around">
        <n-radio value="dig">{{ locale.TerrainDig }}</n-radio>
        <n-radio value="modify">{{ locale.TerrainModify }}</n-radio>
      </n-space>
    </n-radio-group>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
      v-show="state.operationType === 'dig'"
    >
      <template #item-lable>{{ locale.ExcavationDepth }}</template>
      <template #item-content-slider>
        <n-slider v-model:value="state.digDepth" style="width: 70%" />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.digDepth }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.15rem" contentMarginLeft="-0.1rem">
      <template #item-lable>{{ locale.EditAnalysisArea }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.isEdit"></n-checkbox>
      </template>
    </sm-rowLayOut>
    <sm-rowLayOut
      marginbottom="0.15rem"
      v-show="state.operationType === 'modify' && state.isEdit"
    >
      <template #item-lable>{{ locale.EditZ }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.isEditZ"></n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button type="info" color="#3499E5" text-color="#fff" @click="Analyze"
          >分析</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">清除</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import tool from "@/tools/tool";
import initHandler from "@/tools/drawHandler";
import setEditHandler from "@/tools/editHandler";
import locale from "@/tools/locateTemp";

// 设置默认值数据
let state = reactive({
  digDepth: 500,
  isEdit: false,
  isEditZ: false,
  operationType: "dig",
});
let handlerPolygon, digPisitions, removeEdit;

function Analyze() {
  if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
  handlerPolygon.handlerDrawing().then(
    (res) => {
      handlerPolygon.polylineTransparent.show = false;
      let positions = tool.CartesiantoDegrees(res.object.positions);
      if (state.operationType === "dig") digUpdate(positions);
      else modifyUpdate(positions);
      if (state.isEdit) {
        setEdit();
      }
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}
//更新
function digUpdate(positions) {
  digPisitions = positions;
  viewer.scene.globe.removeAllExcavationRegion();
  viewer.scene.globe.addExcavationRegion({
    name: "dig_terrain",
    position: positions,
    height: state.digDepth,
    transparent: false,
  });
}

function modifyUpdate(positions) {
  viewer.scene.globe.removeAllModifyRegion();
  viewer.scene.globe.addModifyRegion({
    name: "ggg",
    position: positions,
  });
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  if (state.operationType === "dig") clearDig();
  else clearModify();
  removeEditHandler();
}

function clearDig() {
  viewer.scene.globe.removeAllExcavationRegion();
  digPisitions = null;
}
function clearModify() {
  viewer.scene.globe.removeAllModifyRegion();
}

// 编辑
function setEdit() {
  viewer.selectedEntity = undefined;
  if (handlerPolygon) handlerPolygon.polygon.show = true;
  removeEdit = viewer.selectedEntityChanged.addEventListener(() => {
    if (viewer.selectedEntity && viewer.selectedEntity.id) {
      setEditHandler(viewer.selectedEntity, state.isEditZ, updateEdit);
    }
  });
}

function updateEdit(p) {
  let positions = tool.CartesiantoDegrees(p);
  if (state.operationType === "dig") digUpdate(positions);
  else modifyUpdate(positions);
}

function removeEditHandler() {
  if (removeEdit) removeEdit();
  if (window.editHandler) window.editHandler.clear();
  viewer.selectedEntity = undefined;
  if (handlerPolygon && handlerPolygon.polygon)
    handlerPolygon.polygon.show = false;
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
  () => state.isEditZ,
  (val) => {
    if (window.editHandler) {
      window.editHandler.isEditZ = val;
    }
  }
);
watch(
  () => state.digDepth,
  (val) => {
    if (digPisitions) digUpdate(digPisitions);
  }
);

// 销毁
onBeforeUnmount(() => {});
</script>

