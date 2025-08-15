<!-- 圆柱体 -->
<template>
  <!-- 短半轴 -->
  <div class="row-wrap">
    <div class="label">{{ $t("semiMinorAxis") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.semiMinorAxis" :step="1" :min="5" :max="100" />
        <n-input-number v-model:value="state.semiMinorAxis" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="5" :max="100" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 长半轴 -->
  <div class="row-wrap">
    <div class="label">{{ $t("semiMajorAxis") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.semiMajorAxis" :step="1" :min="5" :max="200" />
        <n-input-number v-model:value="state.semiMajorAxis" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="5" :max="200" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 拉伸高度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("stretchingHeight") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.extrudedHeight" :step="1" :min="10" :max="100" />
        <n-input-number v-model:value="state.extrudedHeight" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="10" :max="100" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 粒度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("granularity") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.granularity" :step="0.1" :min="0.5" :max="2" />
        <n-input-number v-model:value="state.granularity" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0.5" :max="2" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 旋转: 没起作用 -->
  <div class="row-wrap">
    <div class="label">{{ $t("rotate") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.rotation" :step="0" :min="0" :max="90" />
        <n-input-number v-model:value="state.rotation" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0" :max="90" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 填充颜色 -->
  <div class="row-wrap" v-show="state.displayMode != 'Outline'">
    <div class="label">{{ $t("fillColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.geometryColor" :render-label="() => {
        return '';
      }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 边框颜色 -->
  <div class="row-wrap" v-show="state.displayMode != 'Fill'">
    <div class="label">{{ $t("wireframeColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.wireframeColor" :render-label="() => {
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
  semiMinorAxis: number; // 短半轴
  semiMajorAxis: number; // 长半轴
  extrudedHeight: number; // 拉伸高度
  granularity: number; // 粒度
  rotation: number; // 旋转
  geometryColor: string; // 颜色
  displayMode: string; // 显示模式
  optionsMode: any; // 显示模式选项
  wireframeColor: string; // 线框颜色
};

// 初始化变量
let state = reactive<stateType>({
  // 圆柱体
  semiMinorAxis: 12,
  semiMajorAxis: 20,
  extrudedHeight: 30,
  granularity: 1,
  rotation: 0,
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
  const position = await drawHandler.startPoint();
  if (!position || !(position instanceof SuperMap3D.Cartesian3)) return;
  let geometryColor = SuperMap3D.Color.fromCssColorString(state.geometryColor);
  let wireframeColor = SuperMap3D.Color.fromCssColorString(state.wireframeColor);
  let fillFlag = ["Fill", "Both"].indexOf(state.displayMode) != -1;
  let outlineFlag = ["Outline", "Both"].indexOf(state.displayMode) != -1;
  targetEntity = viewer.entities.add({
    position: position,
    ellipse: {
      semiMinorAxis: state.semiMinorAxis,
      semiMajorAxis: state.semiMajorAxis,
      height: 0,
      extrudedHeight: state.extrudedHeight,
      material: geometryColor,
      granularity: SuperMap3D.Math.RADIANS_PER_DEGREE,
      rotation: 0,
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

// 监听
watch(
  () => state.semiMinorAxis,
  (val) => {
    if (val > state.semiMajorAxis)
      state.semiMinorAxis = state.semiMajorAxis - 1;
    if (targetEntity) {
      // 短半轴不能超过长半轴
      if (val <= state.semiMajorAxis) {
        targetEntity.ellipse["semiMinorAxis"] = val;
      }
    }
  }
);
watch(
  () => state.semiMajorAxis,
  (val) => {
    if (val < state.semiMinorAxis)
      state.semiMajorAxis = state.semiMinorAxis + 1;
    if (targetEntity) {
      if (val >= state.semiMinorAxis) {
        targetEntity.ellipse["semiMajorAxis"] = val;
      }
    }
  }
);
watch(
  () => state.extrudedHeight,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipse["extrudedHeight"] = val;
    }
  }
);
watch(
  () => state.rotation,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipse["rotation"] = val;
    }
  }
);
watch(
  () => state.granularity,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipse["granularity"] =
        val * SuperMap3D.Math.RADIANS_PER_DEGREE;
    }
  }
);
watch(
  () => state.geometryColor,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipse["material"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.wireframeColor,
  (val) => {
    if (targetEntity) {
      targetEntity.ellipse["outlineColor"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.displayMode,
  (val) => {
    if (targetEntity) {
      if (val === "Fill") {
        targetEntity.ellipse.fill = true;
        targetEntity.ellipse.outline = false;
      } else if (val === "Outline") {
        targetEntity.ellipse.fill = false;
        targetEntity.ellipse.outline = true;
      } else {
        targetEntity.ellipse.fill = true;
        targetEntity.ellipse.outline = true;
      }
    }
  }
);
</script>
