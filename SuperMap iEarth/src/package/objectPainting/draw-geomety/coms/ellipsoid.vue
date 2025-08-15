<!-- 球体 -->
<template>
  <!-- X半径 -->
  <div class="row-wrap">
    <div class="label">{{ $t("Xradius") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.xRadii" :step="1" :min="10" :max="100" />
        <n-input-number v-model:value="state.xRadii" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="10" :max="100" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- Y半径 -->
  <div class="row-wrap">
    <div class="label">{{ $t("Yradius") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.yRadii" :step="1" :min="10" :max="200" />
        <n-input-number v-model:value="state.yRadii" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="10" :max="200" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- Z半径 -->
  <div class="row-wrap">
    <div class="label">{{ $t("Zradius") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.zRadii" :step="1" :min="10" :max="100" />
        <n-input-number v-model:value="state.zRadii" :update-value-on-input="false"
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
  xRadii: number; // X半径
  yRadii: number; // Y半径
  zRadii: number; // Z半径
  geometryColor: string; // 颜色
  displayMode: string; // 显示模式
  optionsMode: any; // 显示模式选项
  wireframeColor: string; // 线框颜色
};
// 初始化变量
let state = reactive<stateType>({
  // 球体
  xRadii: 20,
  yRadii: 20,
  zRadii: 20,
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
const drawHandler = new DrawHandler(viewer, { openMouseTip: false });

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

async function add() {
  drawHandler.clear();
  let position = await drawHandler.startPoint();
  if (!position || !(position instanceof SuperMap3D.Cartesian3)) return;
  let posDeg = SuperMap3D.Cartographic.fromCartesian(position);
  posDeg.height = 20;
  position = SuperMap3D.Cartesian3.fromRadians(
    posDeg.longitude,
    posDeg.latitude,
    posDeg.height
  );
  let geometryColor = SuperMap3D.Color.fromCssColorString(state.geometryColor);
  let wireframeColor = SuperMap3D.Color.fromCssColorString(state.wireframeColor);
  let fillFlag = ["Fill", "Both"].indexOf(state.displayMode) != -1;
  let outlineFlag = ["Outline", "Both"].indexOf(state.displayMode) != -1;
  targetEntity = viewer.entities.add({
    position: position,
    ellipsoid: {
      radii: new SuperMap3D.Cartesian3(20.0, 20.0, 20.0),
      material: geometryColor,
      fill: fillFlag,
      outline: outlineFlag,
      outlineColor: wireframeColor,
      outlineWidth: 1,
    },
  });
}

function clear() {
  drawHandler.destroy();
  viewer.entities.removeAll();
  state.displayMode = "Fill";
}

watch(
  () => state.xRadii,
  (val) => {
    if (targetEntity) {
      let radii = targetEntity.ellipsoid.radii.getValue();
      targetEntity.ellipsoid.radii = new SuperMap3D.Cartesian3(
        val,
        radii.y,
        radii.z
      );
    }
  }
);
watch(
  () => state.yRadii,
  (val) => {
    if (targetEntity) {
      let radii = targetEntity.ellipsoid.radii.getValue();
      targetEntity.ellipsoid.radii = new SuperMap3D.Cartesian3(
        radii.x,
        val,
        radii.z
      );
    }
  }
);
watch(
  () => state.zRadii,
  (val) => {
    if (targetEntity) {
      let radii = targetEntity.ellipsoid.radii.getValue();
      targetEntity.ellipsoid.radii = new SuperMap3D.Cartesian3(
        radii.x,
        radii.y,
        val
      );
    }
  }
);
watch(
  () => state.geometryColor,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipsoid["material"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.wireframeColor,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipsoid["outlineColor"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.displayMode,
  (val) => {
    if (targetEntity) {
      if (val === "Fill") {
        targetEntity.ellipsoid.fill = true;
        targetEntity.ellipsoid.outline = false;
      } else if (val === "Outline") {
        targetEntity.ellipsoid.fill = false;
        targetEntity.ellipsoid.outline = true;
      } else {
        targetEntity.ellipsoid.fill = true;
        targetEntity.ellipsoid.outline = true;
      }
    }
  }
);
</script>
