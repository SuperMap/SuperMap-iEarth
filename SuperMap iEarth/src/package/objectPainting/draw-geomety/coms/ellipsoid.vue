<template>
  <!-- 球体 -->
  <div class="row-item">
    <span>{{ $t("Xradius") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.5rem"
        v-model:value="state.xRadii"
        :step="1"
        :min="10"
        :max="100"
      />
      <n-input-number
        v-model:value="state.xRadii"
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
    <span>{{ $t("Yradius") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.5rem"
        v-model:value="state.yRadii"
        :step="1"
        :min="10"
        :max="200"
      />
      <n-input-number
        v-model:value="state.yRadii"
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

  <div class="row-item">
    <span>{{ $t("Zradius") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.5rem"
        v-model:value="state.zRadii"
        :step="1"
        :min="10"
        :max="100"
      />
      <n-input-number
        v-model:value="state.zRadii"
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

let ellipsoidEntity;
let entities = viewer.entities;
let targetEntity: any = null;
let handlerPoint_ellipsoid = new SuperMap3D.DrawHandler(
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
  handlerPoint_ellipsoid.activeEvt.addEventListener((isActive: any) => {
    if (isActive == true) {
      window.viewer.enableCursorStyle = false;
      window.viewer._element.style.cursor = "";
      document.body.classList.add("measureCur");
    } else {
      window.viewer.enableCursorStyle = true;
      document.body.classList.remove("measureCur");
    }
  });

  // 注册绘制球体事件
  handlerPoint_ellipsoid.drawEvt.addEventListener(function (res) {
    let point = res.object;
    let position = point.position;
    let posDeg = SuperMap3D.Cartographic.fromCartesian(position);
    posDeg.height = 20;
    position = SuperMap3D.Cartesian3.fromRadians(
      posDeg.longitude,
      posDeg.latitude,
      posDeg.height
    );
    let geometryColor = SuperMap3D.Color.fromCssColorString(
      state.geometryColor
    );
    let wireframeColor = SuperMap3D.Color.fromCssColorString(
      state.wireframeColor
    );
    let fillFlag = ["Fill", "Both"].indexOf(state.displayMode) != -1;
    let outlineFlag = ["Outline", "Both"].indexOf(state.displayMode) != -1;
    ellipsoidEntity = entities.add({
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
    targetEntity = ellipsoidEntity;
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
  handlerPoint_ellipsoid.activate();
}

function deactiveAll() {
  handlerPoint_ellipsoid.deactivate();
}
function clear() {
  deactiveAll();
  if (handlerPoint_ellipsoid) handlerPoint_ellipsoid.clear();
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
