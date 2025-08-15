<!-- 长方体 -->
<template>
  <!-- 长度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("length") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.boxLength" :step="1" :min="10" :max="100" />
        <n-input-number v-model:value="state.boxLength" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="10" :max="100" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 宽度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("width") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.boxWidth" :step="1" :min="10" :max="200" />
        <n-input-number v-model:value="state.boxWidth" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="10" :max="200" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 高度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("height") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.boxHeight" :step="1" :min="10" :max="100" />
        <n-input-number v-model:value="state.boxHeight" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="10" :max="100" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 填充颜色 -->
  <div class="row-wrap" v-show="state.displayMode != 'Outline'">
    <div class="label">{{ $t("fillColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.geometryColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 边框颜色 -->
  <div class="row-wrap" v-show="state.displayMode != 'Fill'">
    <div class="label">{{ $t("wireframeColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.wireframeColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 绘制模式 -->
  <div class="row-wrap">
    <div class="label">{{ $t("drawMode") }}</div>
    <div class="content">
      <n-select v-model:value="state.displayMode" :options="state.optionsMode" />
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

type stateType = {
  boxLength: number; // 长度
  boxWidth: number; // 宽度
  boxHeight: number; // 高度
  geometryColor: string; // 颜色
  displayMode: string; // 显示模式
  optionsMode: any; // 显示模式选项
  wireframeColor: string; // 线框颜色
};
// 初始化变量
let state = reactive<stateType>({
  // 长方体
  boxLength: 20,
  boxWidth: 20,
  boxHeight: 20,
  geometryColor: "rgba(255,255,255, 1)",
  displayMode: "Fill",
  optionsMode: [
    {
      label: () => $t("fillMode"),
      value: "Fill",
    },
    {
      label: () => $t("wireframe"),
      value: "Outline",
    },
    {
      label: () => $t("fillBothMode"),
      value: "Both",
    },
  ],
  wireframeColor: "rgba(0,0,0, 1)",
});

let targetEntity: any = null;
let handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});

function init() {
  // 场景中拾取获得选中entity
  handler.setInputAction(function (e) {
    let pickedObject = viewer.scene.pick(e.position);
    if (SuperMap3D.defined(pickedObject) && pickedObject.id instanceof SuperMap3D.Entity) {
      targetEntity = pickedObject.id;
    } else {
      targetEntity = null;
    }
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

// 添加entity
async function add() {
  drawHandler.clear();
  const position = await drawHandler.startPoint();
  if (!position || !(position instanceof SuperMap3D.Cartesian3)) return;
  let geometryColor = SuperMap3D.Color.fromCssColorString(state.geometryColor);
  let wireframeColor = SuperMap3D.Color.fromCssColorString(state.wireframeColor);
  let fillFlag = ["Fill", "Both"].indexOf(state.displayMode) != -1;
  let outlineFlag = ["Outline", "Both"].indexOf(state.displayMode) != -1;
  targetEntity = viewer.entities.add({
    position: position,
    box: {
      dimensions: new SuperMap3D.Cartesian3(20.0, 20.0, 20.0),
      material: geometryColor,
      fill: fillFlag,
      outline: outlineFlag,
      outlineColor: wireframeColor,
      outlineWidth: 1,
    },
  });
}

// 清除
function clear() {
  drawHandler.destroy();
  viewer.entities.removeAll();
  state.displayMode = "Fill";
}

watch(
  () => state.boxLength,
  (val) => {
    if (targetEntity) {
      let dim = targetEntity.box.dimensions.getValue();
      targetEntity.box.dimensions = new SuperMap3D.Cartesian3(
        val,
        dim.y,
        dim.z
      );
    }
  }
);
watch(
  () => state.boxWidth,
  (val) => {
    if (targetEntity) {
      let dim = targetEntity.box.dimensions.getValue();
      targetEntity.box.dimensions = new SuperMap3D.Cartesian3(
        dim.x,
        val,
        dim.z
      );
    }
  }
);
watch(
  () => state.boxHeight,
  (val) => {
    if (targetEntity) {
      let dim = targetEntity.box.dimensions.getValue();
      targetEntity.box.dimensions = new SuperMap3D.Cartesian3(
        dim.x,
        dim.y,
        val
      );
    }
  }
);
watch(
  () => state.geometryColor,
  (val) => {
    if (targetEntity) {
      targetEntity.box["material"] = SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.wireframeColor,
  (val) => {
    if (targetEntity) {
      targetEntity.box["outlineColor"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.displayMode,
  (val) => {
    if (targetEntity) {
      if (val === "Fill") {
        targetEntity.box.fill = true;
        targetEntity.box.outline = false;
      } else if (val === "Outline") {
        targetEntity.box.fill = false;
        targetEntity.box.outline = true;
      } else {
        targetEntity.box.fill = true;
        targetEntity.box.outline = true;
      }
    }
  }
);
</script>
