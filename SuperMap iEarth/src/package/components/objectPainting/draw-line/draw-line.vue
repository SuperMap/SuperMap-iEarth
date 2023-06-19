<template>
  <!-- 绘制线 -->
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
      <div class="name">符号库</div>
      <div class="icon-container">
        <div class="icon-list">
          <span
            v-for="(line, index) in state.lines"
            :key="index"
            class="draw-img"
            :title="line.name"
            :class="line.isSelect ? 'is-select' : ''"
            @click="changleIconItem(line)"
          >
            <svg-icon :name="line.iconName" class="icon-size" />
          </span>
        </div>
      </div>
    </div>
    <!-- <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>符号库</template>
      <template #item-content>
        <div class="icon-container">
        <div class="icon-list">
          <span
            v-for="(line, index) in state.lines"
            :key="index"
            class="draw-img"
            :title="line.name"
            :class="line.isSelect ? 'is-select' : ''"
            @click="changleIconItem(line)"
          >
            <svg-icon :name="line.iconName" class="icon-size" />
          </span>
        </div>
      </div>
      </template>
    </sm-rowLayOut> -->

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.LineColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.lineColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <!-- 线宽 -->
    <sm-rowLayOut marginbottom="0.1rem" lableWidth="1.2rem">
      <template #item-lable>{{ locale.LineWidth }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.lineWidth"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 虚线 -->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 1">
      <template #item-lable>{{ locale.DottedColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.dottedColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 1">
      <template #item-lable>{{ locale.DottedLength }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.dottedLength"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 轮廓线-->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 2">
      <template #item-lable>{{ locale.OutLineColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.outLineColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <!-- 线宽 -->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 2">
      <template #item-lable>{{ locale.OutLineWidth }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.outLineWidth"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 光晕线-->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 4">
      <template #item-lable>{{ locale.GlowStrength }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.glowStrength"
          size="small"
          style="width: 98%"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 尾迹线-->
    <sm-rowLayOut marginbottom="0.1rem" v-if="state.selectedId === 5">
      <template #item-lable>{{ locale.TrailPercentage }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.trailPercentage"
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
import { reactive, onBeforeUnmount, watch } from "vue";
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
  lines: [
    {
      id: 0,
      iconName: "drawLine-solid",
      name: "实线",
      nameEN: "solidline",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "drawLine-dotted",
      name: "虚线",
      nameEN: "dottedline",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "drawLine-outline",
      name: "轮廓线",
      nameEN: "outline",
      isSelect: false,
    },
    {
      id: 3,
      iconName: "drawLine-arrowhead",
      name: "箭头线",
      nameEN: "arrowline",
      isSelect: false,
    },
    {
      id: 4,
      iconName: "drawLine-halo",
      name: "光晕线",
      nameEN: "haloline",
      isSelect: false,
    },
    {
      id: 5,
      iconName: "drawLine-wake",
      name: "尾迹线",
      nameEN: "trailline",
      isSelect: false,
    },
  ],
  selectedType: "NONE",
  selectedId: 0,
  lineColor: "rgba(250, 196, 65, 1)", //设置线颜色
  lineWidth: 5, //设置选中线宽
  dottedColor: "rgba(250, 196, 65, 0)", //间隔颜色
  dottedLength: 30,
  outLineColor: "rgba(29, 206, 200, 1)",
  outLineWidth: 2,
  glowStrength: 0.5,
  trailPercentage: 0.3,
  isEdit: false,
  isEditZ: false,
});

let handlerPolyline,
  removeEdit,
  line_ids: any[] = [];
let clampToGround = undefined,
  classificationType = undefined,
  selected_line: any = undefined;

// 分析
function add() {
  notification.create({
    content: () => locale.DrawSymbolTip,
    duration: 3500,
  });
  add_line();
}

//
function add_line() {
  if (!handlerPolyline) {
    handlerPolyline = initHandler("Polyline");
  }
  handlerPolyline.handlerDrawing().then(
    (res) => {
      creat_entity_line(res.object.positions);
      handlerPolyline.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

// 清除
function clear() {
  if (handlerPolyline) handlerPolyline.clearHandler();
  if (selected_line) {
    viewer.entities.removeById(selected_line.id);
    selected_line = undefined;
  } else {
    line_ids.forEach((id) => viewer.entities.removeById(id));
    line_ids.length = 0;
  }
  removeEditHandler();

  state.isEdit = false;
}

function creat_entity_line(position: any) {
  let lineColor = Cesium.Color.fromCssColorString(state.lineColor);
  let lineWidth = Number(state.lineWidth);
  let material: any;
  let id = "add-line-" + new Date().getTime();
  switch (state.selectedId) {
    case 0:
      material = lineColor;
      break;
    case 1:
      let dottedColor = Cesium.Color.fromCssColorString(state.dottedColor); //间隔颜色
      let dottedLength = Number(state.dottedLength);
      material = new Cesium.PolylineDashMaterialProperty({
        color: lineColor,
        gapColor: dottedColor,
        dashLength: dottedLength,
      });
      break;
    case 2:
      let outLineColor = Cesium.Color.fromCssColorString(state.outLineColor); //轮廓颜色
      let outLineWidth = Number(state.outLineWidth);
      material = new Cesium.PolylineOutlineMaterialProperty({
        color: lineColor,
        outlineWidth: outLineWidth,
        outlineColor: outLineColor,
      });
      break;
    case 3:
      material = new Cesium.PolylineArrowMaterialProperty(lineColor);
      break;
    case 4:
      let glowStrength = Number(state.glowStrength);
      material = new Cesium.PolylineGlowMaterialProperty({
        glowPower: glowStrength,
        color: lineColor,
      });
      break;
    case 5:
      let trailPercentage = Number(state.trailPercentage);
      material = new Cesium.PolylineTrailMaterialProperty({
        color: lineColor,
        trailLength: trailPercentage,
        // period: state.trailPeroid
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

function setLineMode(val1, val2) {
  clampToGround = val1;
  classificationType = val2;
  if (selected_line) {
    selected_line.polyline.clampToGround = clampToGround;
    selected_line.polyline.classificationType = classificationType;
  }
}

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

function removeEditHandler() {
  if (removeEdit) removeEdit();
  if (window.editHandler) window.editHandler.clear();
  viewer.selectedEntity = undefined;
}

watch(
  () => state.selectedType,
  (val) => {
    switch (val) {
      case "NONE":
        setLineMode(undefined, undefined);
        break;
      case "TERRAIN":
        setLineMode(true, Cesium.ClassificationType.TERRAIN);
        break;
      case "S3M_TILE":
        setLineMode(true, Cesium.ClassificationType.S3M_TILE);
        break;
      case "BOTH":
        setLineMode(true, Cesium.ClassificationType.BOTH);
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
    let color = Cesium.Color.fromCssColorString(val);
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
    let color = Cesium.Color.fromCssColorString(val);
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
    let color = Cesium.Color.fromCssColorString(val);
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

onBeforeUnmount(() => {
  clear();
});

// 符号
function changleIconItem(item: any) {
  state.selectedId = item.id;
  for (let i = 0; i < state.lines.length; i++) {
    if (state.lines[i].id == item.id) {
      state.lines[i].isSelect = true;
    } else {
      state.lines[i].isSelect = false;
    }
  }
}
</script>
  
  
  <style lang="scss" scoped>
.draw-img {
  @include setDrawImgStyle();
  text-align: center;
}
@include iconContainer(0, 2.2rem);
.symbol-container {
  display: flex;
  font-size: 0.12rem;
  // margin-left: 0.05rem;
}
.icon-list {
  display: flex;
  // justify-content: space-between;
  align-items: center;

  .is-select {
    border: 0.01rem solid #3499e5;
  }
}
</style>
  
  
  
  
  
  