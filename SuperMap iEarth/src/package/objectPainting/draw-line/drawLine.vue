<!-- 绘制线 -->
<template>
  <!-- 绘制模式 -->
  <div class="row-wrap">
    <div class="label">{{ $t("drawMode") }}</div>
    <div class="content">
      <n-select v-model:value="state.selectedType" :options="state.optionMode" />
    </div>
  </div>

  <!-- 绘制模式 -->
  <div class="row-wrap">
    <div class="label">{{ $t("symbolLibrary") }}</div>
    <div class="content">
      <div class="icon-list-box">
        <span v-for="(line, index) in state.lineOptions" :key="index" class="icon-span" :title="line.name"
          :class="line.isSelect ? 'selected-icon' : ''" @click="changleIconItem(line)">
          <i class="iconfont iconSize" :class="line.iconName"></i>
        </span>
      </div>
    </div>
  </div>

  <!-- 线颜色 -->
  <div class="row-wrap">
    <div class="label">{{ $t("lineColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.lineColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 线宽度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("lineWidth") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.lineWidth" :step="0.1" :min="1" :max="50" />
        <n-input-number v-model:value="state.lineWidth" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="50" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 轮廓线颜色 -->
  <div class="row-wrap" v-show="state.selectedId === 2">
    <div class="label">{{ $t("outLineColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.outLineColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 轮廓线宽度 -->
  <div class="row-wrap" v-show="state.selectedId === 2">
    <div class="label">{{ $t("outLineWidth") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.outLineWidth" :step="0.1" :min="1" :max="50" />
        <n-input-number v-model:value="state.outLineWidth" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="50" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 编辑线 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.isEdit" :label="$t('editLine')" />
    </div>
  </div>

  <!-- 编辑Z轴 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.isEditZ" :label="$t('editLineZ')" />
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="add" class="operate" type="info" :focusable="false">{{
    $t("Draw") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";
import setEditHandler from "@/tools/editHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  selectedType: string; // 当前选择的绘制模式
  selectedId: number; // 当前选择的线类型索引
  lineColor: string; //设置线颜色
  lineWidth: number; //设置选中线宽
  dottedColor: string; //间隔颜色
  dottedLength: number;
  outLineColor: string; // 轮廓线颜色
  outLineWidth: number; // 轮廓线宽度
  glowStrength: number;
  trailPercentage: number;
  isEdit: boolean; // 是否编辑
  isEditZ: boolean; // 是否只编辑Z轴
  optionMode: any; // 绘制模式选项
  lineOptions: any; // 线类型选项
};
// 初始化变量
let state = reactive<stateType>({
  selectedType: "NONE",
  selectedId: 0,
  lineColor: "rgba(250, 196, 65, 1)", //设置线颜色
  lineWidth: 5, //设置选中线宽
  dottedColor: "rgba(250, 196, 65, 0)", //间隔颜色
  dottedLength: 30,
  outLineColor: "rgba(29, 206, 200, 1)",
  outLineWidth: 2,
  glowStrength: 0.5,
  trailPercentage: 0.2,
  isEdit: true,
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
  lineOptions: [
    {
      id: 0,
      iconName: "iconshixian",
      name: $t("solidLine"),
      nameEN: "solidline",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "iconxuxian",
      name: $t("dashedLine"),
      nameEN: "dottedline",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "iconlunkuoxian",
      name: $t("outline"),
      nameEN: "outline",
      isSelect: false,
    },
    {
      id: 3,
      iconName: "iconjiantou",
      name: $t("arrowLine"),
      nameEN: "arrowline",
      isSelect: false,
    },
    {
      id: 4,
      iconName: "iconguangyunxian",
      name: $t("haloLine"),
      nameEN: "haloline",
      isSelect: false,
    },
    {
      id: 5,
      iconName: "iconweijixian",
      name: $t("wakeLine"),
      nameEN: "trailline",
      isSelect: false,
    },
  ],
});

let line_ids: any[] = [];
let selected_line: any = undefined;
let removeEdit, clampToGround, classificationType;

onMounted(() => {});

onBeforeUnmount(() => {
  clear();
});

// 分析
function add() {
  window["$notification"].create({
    content: () => $t("editLineTip"),
    duration: 3500,
  });
  add_line();
}

// 添加线
async function add_line() {
  const positions = await drawHandler.startPolyline();
  creat_entity_line(positions);
  if (state.isEdit) setEdit();
}

// 根据索引创建不同类型的线实体 - entity
function creat_entity_line(position: any) {
  let lineColor = SuperMap3D.Color.fromCssColorString(state.lineColor);
  let lineWidth = Number(state.lineWidth);
  let material: any;
  let id = "add-line-" + new Date().getTime();
  switch (state.selectedId) {
    case 0:
      material = lineColor;
      break;
    case 1:
      let dottedColor = SuperMap3D.Color.fromCssColorString(state.dottedColor); //间隔颜色
      let dottedLength = Number(state.dottedLength);
      material = new SuperMap3D.PolylineDashMaterialProperty({
        color: lineColor,
        gapColor: dottedColor,
        dashLength: dottedLength,
      });
      break;
    case 2:
      let outLineColor = SuperMap3D.Color.fromCssColorString(
        state.outLineColor
      ); //轮廓颜色
      let outLineWidth = Number(state.outLineWidth);
      material = new SuperMap3D.PolylineOutlineMaterialProperty({
        color: lineColor,
        outlineWidth: outLineWidth,
        outlineColor: outLineColor,
      });
      break;
    case 3:
      material = new SuperMap3D.PolylineArrowMaterialProperty(lineColor);
      break;
    case 4:
      let glowStrength = Number(state.glowStrength);
      material = new SuperMap3D.PolylineGlowMaterialProperty({
        glowPower: glowStrength,
        color: lineColor,
      });
      break;
    case 5:
      let trailPercentage = Number(state.trailPercentage);
      material = new SuperMap3D.PolylineTrailMaterialProperty({
        // 尾迹线材质
        color: lineColor,
        trailLength: trailPercentage,
        period: 5.0, // 该属性为PolylineTrailMaterialProperty必设置值属性
      });
      break;
    default:
      material = lineColor;
      break;
  }
  line_ids.push(id);
  selected_line = viewer.entities.add({
    id: id,
    polyline: {
      positions: position,
      width: lineWidth,
      material: material,
      classificationType: classificationType, //贴地贴对象模式设置
      clampToGround: clampToGround, //贴地贴对象需要设置true
    },
  });
}

// 设置线的绘制模式：贴地、空间、贴S3M
function setLineMode(val1, val2) {
  clampToGround = val1;
  classificationType = val2;
  if (selected_line) {
    selected_line.polyline.clampToGround = clampToGround;
    selected_line.polyline.classificationType = classificationType;
  }
}

// 设置线实体可编辑
function setEdit() {
  viewer.selectedEntity = undefined;
  removeEdit = viewer.selectedEntityChanged.addEventListener(() => {
    if (
      viewer.selectedEntity &&
      viewer.selectedEntity.id &&
      viewer.selectedEntity.id.includes("add-line")
    ) {
      setEditHandler(viewer.selectedEntity, state.isEditZ);
      selected_line = viewer.selectedEntity;
    } else selected_line = undefined;
  });
}

// 移除编辑
function removeEditHandler() {
  if (removeEdit) removeEdit();
  if (window.editHandler) window.editHandler.clear();
  viewer.selectedEntity = undefined;
}

// 切换项目
function changleIconItem(item: any) {
  state.selectedId = item.id;
  for (let i = 0; i < state.lineOptions.length; i++) {
    if (state.lineOptions[i].id == item.id) {
      state.lineOptions[i].isSelect = true;
    } else {
      state.lineOptions[i].isSelect = false;
    }
  }
}

// 清除
function clear() {
  drawHandler.destroy();
  if (selected_line) {
    viewer.entities.removeById(selected_line.id);
    selected_line = undefined;
  } else {
    line_ids.forEach((id) => viewer.entities.removeById(id));
    line_ids.length = 0;
  }
  removeEditHandler();
}

// 监听
watch(
  () => state.selectedType,
  (val) => {
    switch (val) {
      case "NONE":
        setLineMode(undefined, undefined);
        break;
      case "TERRAIN":
        setLineMode(true, SuperMap3D.ClassificationType.TERRAIN);
        break;
      case "S3M_TILE":
        setLineMode(true, SuperMap3D.ClassificationType.S3M_TILE);
        break;
      case "BOTH":
        setLineMode(true, SuperMap3D.ClassificationType.BOTH);
        break;
      default:
        setLineMode(undefined, undefined);
        break;
    }
  }
);
watch(
  () => state.lineColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_line) selected_line.polyline.material.color = color;
  }
);
watch(
  () => state.lineWidth,
  (val) => {
    if (selected_line) selected_line.polyline.width = Number(val);
  }
);

watch(
  () => state.dottedColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_line) selected_line.polyline.material.gapColor = color;
  }
);
watch(
  () => state.dottedLength,
  (val) => {
    if (selected_line) selected_line.polyline.material.dashLength = Number(val);
  }
);
watch(
  () => state.outLineColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (selected_line) selected_line.polyline.material.outlineColor = color;
  }
);
watch(
  () => state.outLineWidth,
  (val) => {
    if (selected_line)
      selected_line.polyline.material.outlineWidth = Number(val);
  }
);
watch(
  () => state.glowStrength,
  (val) => {
    if (selected_line) selected_line.polyline.material.glowPower = Number(val);
  }
);
watch(
  () => state.trailPercentage,
  (val) => {
    if (selected_line)
      selected_line.polyline.material.trailLength = Number(val);
  }
);
watch(
  () => state.isEdit,
  (val) => {
    if (val) {
      window["$notification"].create({
        content: () => $t("editLineTip"),
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
</script>
