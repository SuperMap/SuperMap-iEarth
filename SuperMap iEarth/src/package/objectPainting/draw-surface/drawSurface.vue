<template>
  <!-- 绘制面 -->
  <div class="row-item">
    <span>{{ $t("drawMode") }}</span>
    <n-select
      style="width: 1.96rem; height: 32px"
      v-model:value="state.selectedType"
      size="small"
      :options="state.optionMode"
    />
  </div>

  <div class="row-item" style="margin-top: 0.15rem">
    <span class="name">{{ $t("symbolLibrary") }}</span>
    <div class="icon-list">
      <span
        v-for="(surfaces, index) in state.surfaces"
        :key="index"
        class="icon-span"
        :title="surfaces.name"
        :class="surfaces.isSelect ? 'selected-icon' : ''"
        @click="changleIconItem(surfaces)"
      >
        <i
          class="iconfont iconSize"
          :class="surfaces.iconName"
          :title="surfaces.name"
          style="margin-top: 0px"
        ></i>
      </span>
    </div>
  </div>

  <!-- 纯色面颜色 -->
  <div class="row-item" v-if="state.selectedId === 0">
    <span>{{ $t("polygonColor") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.solidColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <!-- 网格 -->
  <div class="row-item" v-if="state.selectedId === 1">
    <span>{{ $t("polygonColor") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.gridColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-if="state.selectedId === 1">
    <span>{{ $t("gridLineWidth") }}</span>
    <n-input-number
      v-model:value="state.gridWidth"
      style="width: 1.96rem"
      :show-button="false"
    ></n-input-number>
  </div>

  <div class="row-item" v-if="state.selectedId === 1">
    <span>{{ $t("gridLineNumber") }}</span>
    <n-input-number
      v-model:value="state.gridCount"
      style="width: 1.96rem"
      :show-button="false"
    ></n-input-number>
  </div>

  <div class="row-item" v-if="state.selectedId === 1">
    <span>{{ $t("unitTransparency") }}</span>
    <n-input-number
      v-model:value="state.gridCellAlpha"
      style="width: 1.96rem"
      :step="0.1"
      :show-button="false"
    ></n-input-number>
  </div>

  <!-- 条纹-->
  <div class="row-item" v-if="state.selectedId === 2">
    <span>{{ $t("evenStripColor") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.stripeEvenColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-if="state.selectedId === 2">
    <span>{{ $t("oddStripColor") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.stripeOddColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-if="state.selectedId === 2">
    <span>{{ $t("stripRepetition") }}</span>
    <n-input-number
      v-model:value="state.stripeRepeat"
      style="width: 1.96rem"
      :show-button="false"
    ></n-input-number>
  </div>

  <div class="row-item" v-if="state.selectedId === 2">
    <span>{{ $t("stripOffset") }}</span>
    <n-input-number
      v-model:value="state.stripeOffset"
      style="width: 1.96rem"
      :show-button="false"
    ></n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t("edit") }}</span>
    <n-checkbox
      style="width: 1.96rem"
      v-model:checked="state.isEdit"
    ></n-checkbox>
  </div>

  <div class="row-item" v-show="state.isEdit">
    <span>{{ $t("editZaxis") }}</span>
    <n-checkbox
      style="width: 1.96rem"
      v-model:checked="state.isEditZ"
    ></n-checkbox>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add"
      style="margin-right: 0.1rem"
      >{{ $t("Draw") }}</n-button
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
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";
import setEditHandler from "@/tools/editHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  selectedType: string; // 绘制模式
  selectedId: number; // 绘制面类型
  solidColor: string; // 纯色面颜色
  gridColor: string; // 网格面颜色
  gridWidth: number; // 网格线宽
  gridCount: number; // 网格线数
  gridCellAlpha: number; // 单元透明度
  stripeEvenColor: string; // 偶数带颜色
  stripeOddColor: string; // 奇数带颜色
  stripeRepeat: number; // 带条重复数
  stripeOffset: number; // 带条偏移量
  stripeOrientation: string;
  isEdit: boolean; // 是否编辑
  isEditZ: boolean; // 是否只编辑Z轴
  optionMode: any; //绘制模式选项
  surfaces: any; //绘制面类型选项
};

// 初始化变量
let state = reactive<stateType>({
  selectedType: "NONE",
  selectedId: 0,
  solidColor: "rgba(250, 196, 65, 1)",
  gridColor: "rgba(250, 196, 65, 1)",
  gridWidth: 1,
  gridCount: 8,
  gridCellAlpha: 0.1,
  stripeEvenColor: "rgba(255,255,255, 1)",
  stripeOddColor: "rgba(0,0,0, 1)",
  stripeRepeat: 12,
  stripeOffset: 0,
  stripeOrientation: "horizontal",
  isEdit: false,
  isEditZ: false,
  optionMode: [
    {
      label: () => $t("spaceMode"),
      value: "NONE",
    },
    {
      label: () => $t("closeGroundMode"),
      value: "TERRAIN",
    },
    {
      label: () => $t("closeS3MMode"),
      value: "S3M_TILE",
    },
    {
      label: () => $t("closeBoth"),
      value: "BOTH",
    },
  ],
  surfaces: [
    {
      id: 0,
      iconName: "iconchunse",
      name: $t("pureColor"),
      nameEN: "Solid",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "iconwangge",
      name: $t("grid"),
      nameEN: "grid",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "iconhuizhitiaowen",
      name: $t("stripe"),
      nameEN: "stripe",
      isSelect: false,
    },
  ],
});

let removeEdit;
let perPositionHeight = true;
let classificationType = undefined;
let surface_ids: any = [];
let selected_gon: any = undefined;

onMounted(() => {});

onBeforeUnmount(() => {
  clear();
  viewer.entities.removeAll(); // 移除所有绘制面（entity）
});

// 切换项目
function changleIconItem(item: any) {
  state.selectedId = item.id;
  for (let i = 0; i < state.surfaces.length; i++) {
    if (state.surfaces[i].id == item.id) {
      state.surfaces[i].isSelect = true;
    } else {
      state.surfaces[i].isSelect = false;
    }
  }
}

// 绘制面
function add() {
  window["$notification"].create({
    content: () => $t("editLineTip"),
    duration: 3500,
  });
  add_face();
}

// 添加面
async function add_face() {
  const positions = await drawHandler.startPolygon();
  creat_entity_gon(positions);
}

// 创建面实体
function creat_entity_gon(position) {
  let id = "add-surface-" + new Date().getTime();
  let material;
  switch (state.selectedId) {
    case 0:
      let polygonColor = SuperMap3D.Color.fromCssColorString(state.solidColor);
      material = polygonColor;
      break;
    case 1:
      let gridColor = SuperMap3D.Color.fromCssColorString(state.gridColor); //间隔颜色
      let gridWidth = Number(state.gridWidth);
      let gridCount = Number(state.gridCount);
      let gridCellAlpha = Number(state.gridCellAlpha);
      material = new SuperMap3D.GridMaterialProperty({
        color: gridColor,
        cellAlpha: gridCellAlpha,
        lineCount: new SuperMap3D.Cartesian2(gridCount, gridCount),
        lineThickness: new SuperMap3D.Cartesian2(gridWidth, gridWidth),
      });
      break;
    case 2:
      let stripeEvenColor = SuperMap3D.Color.fromCssColorString(
        state.stripeEvenColor // 改变颜色后，直接undifined
      ); //间隔颜色
      let stripeOddColor = SuperMap3D.Color.fromCssColorString(
        state.stripeOddColor
      ); //间隔颜色
      let stripeRepeat = Number(state.stripeRepeat);
      let stripeOffset = Number(state.stripeOffset);
      material = new SuperMap3D.StripeMaterialProperty({
        evenColor: stripeEvenColor,
        oddColor: stripeOddColor,
        repeat: stripeRepeat,
        offset: stripeOffset,
        orientation: state.stripeOrientation === "horizontal" ? 0 : 1,
      });
      break;
    default:
      break;
  }
  surface_ids.push(id);
  selected_gon = viewer.entities.add({
    id: id,
    polygon: {
      hierarchy: {
        positions: position,
      },
      material: material,
      perPositionHeight: perPositionHeight,
      classificationType: classificationType, //面贴对象
    },
  });
}

// 设置面绘制模式
function setGonMode(val1: boolean, val2: any) {
  perPositionHeight = val1;
  classificationType = val2;
  if (selected_gon) {
    selected_gon.polygon.perPositionHeight = perPositionHeight;
    selected_gon.polygon.classificationType = classificationType;
  }
}

// 设置编辑
function setEdit() {
  viewer.selectedEntity = undefined;
  removeEdit = viewer.selectedEntityChanged.addEventListener(() => {
    if (
      viewer.selectedEntity &&
      viewer.selectedEntity.id &&
      viewer.selectedEntity.id.includes("add-surface")
    ) {
      setEditHandler(viewer.selectedEntity, state.isEditZ);
      selected_gon = viewer.selectedEntity;
    } else selected_gon = undefined;
  });
}

// 移除编辑
function removeEditHandler() {
  if (removeEdit) removeEdit();
  if (window.editHandler) window.editHandler.clear();
  viewer.selectedEntity = undefined;
}

// 清除
function clear() {
  drawHandler.destroy();
  if (selected_gon) {
    viewer.entities.removeById(selected_gon.id);
    selected_gon = undefined;
  } else {
    surface_ids.forEach((id) => viewer.entities.removeById(id));
    surface_ids.length = 0;
  }
  if (window.editHandler) window.editHandler.clear();
  state.isEdit = false;
  state.isEditZ = false;
}

// 监听
watch(
  () => state.selectedType,
  (val) => {
    switch (val) {
      case "NONE":
        setGonMode(true, undefined);
        break;
      case "TERRAIN":
        setGonMode(false, SuperMap3D.ClassificationType.TERRAIN);
        break;
      case "S3M_TILE":
        setGonMode(false, SuperMap3D.ClassificationType.S3M_TILE);
        break;
      case "BOTH":
        setGonMode(false, SuperMap3D.ClassificationType.BOTH);
        break;
      default:
        setGonMode(true, undefined);
        break;
    }
  }
);
watch(
  () => state.isEdit,
  (val) => {
    if (val) {
      window["$notification"].create({
        content: () => $t("editLineTip2"),
        duration: 3500,
      });
      setEdit();
    } else removeEditHandler();
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
  () => state.solidColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material = color;
  }
);
watch(
  () => state.gridColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material.color = color;
  }
);
watch(
  () => state.gridWidth,
  (val) => {
    if (selected_gon)
      selected_gon.polygon.material.lineThickness = new SuperMap3D.Cartesian2(
        Number(val),
        Number(val)
      );
  }
);
watch(
  () => state.gridCount,
  (val) => {
    if (selected_gon)
      selected_gon.polygon.material.lineCount = new SuperMap3D.Cartesian2(
        Number(val),
        Number(val)
      );
  }
);
watch(
  () => state.gridCellAlpha,
  (val) => {
    if (selected_gon) selected_gon.polygon.material.cellAlpha = Number(val);
  }
);
watch(
  () => state.stripeEvenColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material.evenColor = color;
  }
);
watch(
  () => state.stripeOddColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material.oddColor = color;
  }
);
watch(
  () => state.stripeRepeat,
  (val) => {
    if (selected_gon) selected_gon.polygon.material.repeat = Number(val);
  }
);
watch(
  () => state.stripeOffset,
  (val) => {
    if (selected_gon) selected_gon.polygon.material.offset = Number(val);
  }
);
watch(
  () => state.stripeOrientation,
  (val) => {
    if (!selected_gon) return;
    let or = val === "horizontal" ? 0 : 1;
    selected_gon.polygon.material.orientation = or;
  }
);
</script>
