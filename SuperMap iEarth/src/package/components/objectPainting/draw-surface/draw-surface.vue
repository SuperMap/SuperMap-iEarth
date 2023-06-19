<template>
  <!-- 绘制面 -->
  <n-space vertical>
    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.DrawMode }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.selectedType"
          size="small"
          :options="state.options1"
        />
      </template>
    </sm-rowLayOut>

    <div class="symbol-container">
      <span class="name">符号库</span>
      <div class="icon-container">
        <div class="icon-list">
          <span
            v-for="(surface, index) in state.surfaces"
            :key="index"
            class="icon-span"
            :bordered="false"
            :title="surface.name"
            :class="surface.isSelect ? 'is-select' : ''"
            @click="changleIconItem(surface)"
          >
            <svg-icon :name="surface.iconName" class="icon-size" />
          </span>
        </div>
      </div>
    </div>

    <!-- 纯色与网格面颜色 -->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId !== 2">
      <template #item-lable>{{ locale.FaceColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.solidColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <!-- 网格 -->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 1">
      <template #item-lable>{{ locale.GridWidth }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.gridWidth"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 1">
      <template #item-lable>{{ locale.GridCount }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.gridCount"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 1">
      <template #item-lable>{{ locale.GridCellAlpha }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.gridCellAlpha"
          size="small"
          style="width: 98%"
          :step="0.1"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 条纹-->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 2">
      <template #item-lable>{{ locale.StripeEvenColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.stripeEvenColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 2">
      <template #item-lable>{{ locale.StripeOddColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.stripeOddColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 2">
      <template #item-lable>{{ locale.StripeRepeat }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.stripeRepeat"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 2">
      <template #item-lable>{{ locale.StripeOffset }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.stripeOffset"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.Edit }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.isEdit"></n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-show="state.isEdit">
      <template #item-lable>{{ locale.EditZ }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.isEditZ"></n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button type="info" color="#3499E5" text-color="#fff" @click="add">{{
          locale.Add
        }}</n-button>
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">{{
          locale.Clear
        }}</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>
  
  <script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, computed } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import setEditHandler from "@/tools/editHandler";
import locale from "@/tools/locateTemp";

const notification = useNotification();

// 初始化数据
let state = reactive({
  options1: [
    {
      label: () => locale.SpaceMode,
      value: "NONE",
    },
    {
      label: () => locale.TERRAINMode,
      value: "TERRAIN",
    },
    {
      label: () => locale.S3M_TILEMode,
      value: "S3M_TILE",
    },
    {
      label: () => locale.BOTHMode,
      value: "BOTH",
    },
  ],
  surfaces: [
    {
      id: 0,
      iconName: "drawSurface-purity",
      name: "纯色",
      nameEN: "Solid",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "drawSurface-grid",
      name: "网格",
      nameEN: "grid",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "drawSurface-stripe",
      name: "条纹",
      nameEN: "stripe",
      isSelect: false,
    },
  ],
  selectedType: "NONE",
  selectedId: 0,
  solidColor: "rgba(250, 196, 65, 1)",
  gridColor: "rgba(250, 196, 65, 1)",
  gridWidth: 1,
  gridCount: 8,
  gridCellAlpha: 0.1,
  stripeEvenColor: "#FFFFFF",
  stripeOddColor: "#000000",
  stripeRepeat: 12,
  stripeOffset: 0,
  stripeOrientation: "horizontal",
  isEdit: false,
  isEditZ: false,
});

let handlerPolygon,
  removeEdit,
  surface_ids: any = [];
let perPositionHeight = true,
  classificationType = undefined,
  selected_gon: any = undefined;

// 分析

function add() {
  notification.create({
    content: () => locale.DrawSymbolTip,
    duration: 3500,
  });
  add_face();
}

function add_face() {
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }
  handlerPolygon.handlerDrawing().then(
    (res) => {
      creat_entity_gon(res.object.positions);
      handlerPolygon.polylineTransparent.show = false;
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
  if (selected_gon) {
    viewer.entities.removeById(selected_gon.id);
    selected_gon = undefined;
  } else {
    surface_ids.forEach((id) => viewer.entities.removeById(id));
    surface_ids.length = 0;
  }
  if (window.editHandler) window.editHandler.clear();
}

function creat_entity_gon(position) {
  let id = "add-surface-" + new Date().getTime();
  let material;
  switch (state.selectedId) {
    case 0:
      let polygonColor = Cesium.Color.fromCssColorString(state.solidColor);
      material = polygonColor;
      break;
    case 1:
      let gridColor = Cesium.Color.fromCssColorString(state.gridColor); //间隔颜色
      let gridWidth = Number(state.gridWidth);
      let gridCount = Number(state.gridCount);
      let gridCellAlpha = Number(state.gridCellAlpha);
      material = new Cesium.GridMaterialProperty({
        color: gridColor,
        cellAlpha: gridCellAlpha,
        lineCount: new Cesium.Cartesian2(gridCount, gridCount),
        lineThickness: new Cesium.Cartesian2(gridWidth, gridWidth),
      });
      break;
    case 2:
      let stripeEvenColor = Cesium.Color.fromCssColorString(
        state.stripeEvenColor
      ); //间隔颜色
      let stripeOddColor = Cesium.Color.fromCssColorString(
        state.stripeOddColor
      ); //间隔颜色
      let stripeRepeat = Number(state.stripeRepeat);
      let stripeOffset = Number(state.stripeOffset);
      material = new Cesium.StripeMaterialProperty({
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

function setGonMode(val1: boolean, val2: any) {
  perPositionHeight = val1;
  classificationType = val2;
  if (selected_gon) {
    selected_gon.polygon.perPositionHeight = perPositionHeight;
    selected_gon.polygon.classificationType = classificationType;
  }
}

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

function removeEditHandler() {
  if (removeEdit) removeEdit();
  if (window.editHandler) window.editHandler.clear();
  viewer.selectedEntity = undefined;
}

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

watch(
  () => state.selectedType,
  (val) => {
    switch (val) {
      case "NONE":
        setGonMode(true, undefined);
        break;
      case "TERRAIN":
        setGonMode(false, Cesium.ClassificationType.TERRAIN);
        break;
      case "S3M_TILE":
        setGonMode(false, Cesium.ClassificationType.S3M_TILE);
        break;
      case "BOTH":
        setGonMode(false, Cesium.ClassificationType.BOTH);
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
      notification.create({
        content: () => locale.DrawlineTip,
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
    let color = Cesium.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material = color;
  }
);
watch(
  () => state.gridColor,
  (val) => {
    let color = Cesium.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material.color = color;
  }
);
watch(
  () => state.gridWidth,
  (val) => {
    if (selected_gon)
      selected_gon.polygon.material.lineThickness = new Cesium.Cartesian2(
        Number(val),
        Number(val)
      );
  }
);
watch(
  () => state.gridCount,
  (val) => {
    if (selected_gon)
      selected_gon.polygon.material.lineCount = new Cesium.Cartesian2(
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
    let color = Cesium.Color.fromCssColorString(val);
    if (selected_gon) selected_gon.polygon.material.evenColor = color;
  }
);
watch(
  () => state.stripeOddColor,
  (val) => {
    let color = Cesium.Color.fromCssColorString(val);
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

onBeforeUnmount(() => {
  clear();
});
</script>

  
<style lang="scss" scoped>
// .draw-img {
//   @include setDrawImgStyle();
// }
.selected-border-color {
  border: $--SM--Border-DrawImg;
}
@include iconContainer(0,  2.2rem);
.symbol-container {
  display: flex;
  font-size: 0.12rem;
  margin-left: 0.05rem;
}
.icon-list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .is-select {
    border: 0.01rem solid #3499e5;
  }
}
</style>
  
  
  
  
  
  