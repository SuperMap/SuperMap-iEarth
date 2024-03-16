<template>
  <div class="row-item">
    <span>{{ $t("length") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.5rem"
        v-model:value="state.cylinderLength"
        :step="1"
        :min="10"
        :max="100"
      />
      <n-input-number
        v-model:value="state.cylinderLength"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="10"
        :max="100"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("bottomHeight") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.5rem"
        v-model:value="state.bottomRadius"
        :step="1"
        :min="10"
        :max="200"
      />
      <n-input-number
        v-model:value="state.bottomRadius"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="10"
        :max="200"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-show="state.displayMode != 'Outline'">
    <span>{{ $t("fillColor") }}</span>
    <div class="color-pick-box">
      <n-color-picker
        v-model:value="state.geometryColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item" v-show="state.displayMode != 'Fill'">
    <span>{{ $t("wireframeColor") }}</span>
    <div class="color-pick-box">
      <n-color-picker
        v-model:value="state.wireframeColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("drawMode") }}</span>
    <n-select
      style="width: 1.96rem"
      v-model:value="state.displayMode"
      :options="state.optionsMode"
    />
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

let frustumEntity;
let entities = viewer.entities;
let targetEntity: any = null;
let handlerPoint_frustum = new SuperMap3D.DrawHandler(
  viewer,
  SuperMap3D.DrawMode.Point
);
let handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
});

function init() {
  handlerPoint_frustum.activeEvt.addEventListener((isActive: any) => {
    if (isActive == true) {
      window.viewer.enableCursorStyle = false;
      window.viewer._element.style.cursor = "";
      document.body.classList.add("measureCur");
    } else {
      window.viewer.enableCursorStyle = true;
      document.body.classList.remove("measureCur");
    }
  });

  //注册绘制椎体事件
  handlerPoint_frustum.drawEvt.addEventListener(function (res) {
    let point = res.object;
    let position = point.position;
    let fillFlag = ["Fill", "Both"].indexOf(state.displayMode) != -1;
    let outlineFlag = ["Outline", "Both"].indexOf(state.displayMode) != -1;
    let geometryColor = SuperMap3D.Color.fromCssColorString(
      state.geometryColor
    );
    let wireframeColor = SuperMap3D.Color.fromCssColorString(
      state.wireframeColor
    );
    frustumEntity = entities.add({
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
    targetEntity = frustumEntity;
  });

  // 场景中拾取获得选中entity
  handler.setInputAction(function (e) {
    let pickedObject = viewer.scene.pick(e.position);
    if (
      SuperMap3D.defined(pickedObject) &&
      pickedObject.id instanceof SuperMap3D.Entity
    ) {
      targetEntity = pickedObject.id;
    }
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

function add() {
  deactiveAll();
  handlerPoint_frustum.activate();
}

function deactiveAll() {
  handlerPoint_frustum.deactivate();
}
function clear() {
  deactiveAll();
  if (handlerPoint_frustum) handlerPoint_frustum.clear();
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
