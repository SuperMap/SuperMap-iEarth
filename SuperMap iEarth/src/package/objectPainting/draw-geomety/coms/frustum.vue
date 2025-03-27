<template>
  <div class="row-item">
    <span>{{ $t("length") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.5rem" v-model:value="state.cylinderLength" :step="1" :min="10" :max="100" />
      <n-input-number v-model:value="state.cylinderLength" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="10" :max="100" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("bottomHeight") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.5rem" v-model:value="state.bottomRadius" :step="1" :min="10" :max="200" />
      <n-input-number v-model:value="state.bottomRadius" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="10" :max="200" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item" v-show="state.displayMode != 'Outline'">
    <span>{{ $t("fillColor") }}</span>
    <div class="color-pick-box">
      <n-color-picker v-model:value="state.geometryColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-show="state.displayMode != 'Fill'">
    <span>{{ $t("wireframeColor") }}</span>
    <div class="color-pick-box">
      <n-color-picker v-model:value="state.wireframeColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("drawMode") }}</span>
    <n-select style="width: 1.96rem" v-model:value="state.displayMode" :options="state.optionsMode" />
  </div>

  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="add" style="margin-right: 0.1rem">{{ $t("Draw") }}
    </n-button>
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";

type stateType = {
  cylinderLength: number; // 长度
  bottomRadius: number; // 底部高程
  geometryColor: string; // 颜色
  displayMode: string; // 显示模式
  optionsMode: any; // 显示模式选项
  wireframeColor: string; // 线框颜色
};
// 初始化变量
let state = reactive<stateType>({
  // 圆锥
  cylinderLength: 40,
  bottomRadius: 20,
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
  let fillFlag = ["Fill", "Both"].indexOf(state.displayMode) != -1;
  let outlineFlag = ["Outline", "Both"].indexOf(state.displayMode) != -1;
  let geometryColor = SuperMap3D.Color.fromCssColorString(
    state.geometryColor
  );
  let wireframeColor = SuperMap3D.Color.fromCssColorString(
    state.wireframeColor
  );
  targetEntity = viewer.entities.add({
    position: position,
    cylinder: {
      length: 40.0,
      topRadius: 0.0,
      bottomRadius: 20.0,
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
  () => state.bottomRadius,
  (val) => {
    if (targetEntity) {
      targetEntity.cylinder.bottomRadius = val;
    }
  }
);
watch(
  () => state.cylinderLength,
  (val) => {
    if (targetEntity) {
      targetEntity.cylinder.length = val;
    }
  }
);

watch(
  () => state.geometryColor,
  (val) => {
    if (targetEntity) {
      targetEntity.cylinder["material"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.wireframeColor,
  (val) => {
    if (targetEntity) {
      targetEntity.cylinder["outlineColor"] =
        SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.displayMode,
  (val) => {
    if (targetEntity) {
      if (val === "Fill") {
        targetEntity.cylinder.fill = true;
        targetEntity.cylinder.outline = false;
      } else if (val === "Outline") {
        targetEntity.cylinder.fill = false;
        targetEntity.cylinder.outline = true;
      } else {
        targetEntity.cylinder.fill = true;
        targetEntity.cylinder.outline = true;
      }
    }
  }
);
</script>
