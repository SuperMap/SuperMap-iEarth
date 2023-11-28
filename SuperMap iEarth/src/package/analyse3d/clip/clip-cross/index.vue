<template>
  <div class="row-item">
    <span>{{$t('global.clipWidth')}}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.clipWidth"
        style="width: 1.6rem"
        :min="0"
        :max="90"
        :step="10"
      />
      <n-input-number 
        v-model:value="state.clipWidth" 
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false" 
        :show-button="false" 
        placeholder=""
        size="small" 
      />
      <span>{{$t('global.meter')}}</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{$t('global.clipHeight')}}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.clipHeight"
        style="width: 1.6rem"
        :min="0"
        :max="90"
        :step="10"
      />
      <n-input-number 
        v-model:value="state.clipHeight" 
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false" 
        :show-button="false" 
        placeholder=""
        size="small" 
      />
      <span>{{$t('global.meter')}}</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{$t('global.rotateX')}}</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.heading"
        style="width: 1.4rem"
        :min="0"
        :max="360"
        :step="1"
      />
    <n-input-number 
        v-model:value="state.heading" 
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false" 
        :show-button="false" 
        :min="0"
        :max="360"
        placeholder=""
        size="small" 
      />
      <span>°</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{$t('global.rotateY')}}</span>
    <div class="slider-box">
      <n-slider 
        v-model:value="state.pitch" 
        style="width: 1.4rem" 
        :min="0"
        :max="360"
        :step="1"
      />
      <n-input-number 
        v-model:value="state.pitch" 
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false" 
        :show-button="false" 
        :min="0"
        :max="360"
        placeholder=""
        size="small" 
      />
      <span> °</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{$t('global.rotateZ')}}</span>
    <div class="slider-box">
      <n-slider 
        v-model:value="state.roll" 
        style="width: 1.4rem" 
        :min="0"
        :max="360"
        :step="1"
      />
      <n-input-number 
        v-model:value="state.roll" 
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false" 
        :show-button="false" 
        :min="0"
        :max="360"
        placeholder=""
        size="small" 
      />
      <span> °</span>
    </div>
  </div>

  <div class="row-item">
    <span>{{$t('global.stretchingHeight')}}</span>
    <div class="slider-box">
      <n-slider 
        v-model:value="state.extrude" 
        style="width: 1.6rem" 
      />
      <n-input-number 
        v-model:value="state.extrude" 
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false" 
        :show-button="false" 
        placeholder=""
        size="small" 
      />
      <span> {{$t('global.meter')}}</span>
    </div>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="startCross"
      style="margin-right: 0.1rem"
      >{{$t('global.clip')}}</n-button
    >
    <n-button class="btn-secondary" @click="clearCross" color="rgba(255, 255, 255, 0.65)" ghost>{{$t('global.clear')}}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";

const scene = viewer.scene;

type stateType = {
  clipWidth: number; // 裁剪宽度
  clipHeight: number; // 裁剪高度
  heading: number; // 绕X轴旋转
  pitch: number; // 绕Y轴旋转
  roll: number; // 绕Z轴旋转
  extrude: number; // 拉伸高度
};

let state = reactive<stateType>({
  clipWidth: 5,
  clipHeight: 5,
  heading: 1,
  pitch: 2,
  roll: 1,
  extrude: 1,
});

// 初始化数据
let layers: any;
let screenSpaceEventHandler: any;
let startClip: any, //裁剪标志
  box: any,
  boxPosition: any,
  dim: any, //entity
  position: any; //裁剪区域

screenSpaceEventHandler = new SuperMap3D.ScreenSpaceEventHandler(
  viewer.scene.canvas
);
layers = viewer.scene.layers.layerQueue;


// 分析
function startCross(e: any) {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  e.preventDefault();
  if (!viewer) {
    return;
  }
  if (box) {
    clearCross();
  }
  start();
  startClip = true;
  box.show = true;
}

// cross裁剪
function start() {
  for (let layer of layers) {
    layer.selectEnabled = false;
  }
  // 添加盒子
  boxPosition = SuperMap3D.Cartesian3.fromDegrees(0, 0, 0);
  dim = new SuperMap3D.Cartesian3(state.clipWidth, state.clipHeight, 0.1);
  box = viewer.entities.add({
    // 标识盒
    id: "cross-clip-identify-box",
    position: boxPosition,
    show: false,
    box: {
      dimensions: dim,
      fill: false,
      outline: true,
      outlineColor: SuperMap3D.Color.AQUA,
      outlineWidth: 5.0,
    },
  });
  let hpr: any;
  screenSpaceEventHandler.setInputAction((movement: any) => {
    if (startClip) {
      boxPosition = scene.pickPosition(movement.endPosition);

      if (!boxPosition) {
        return;
      }
      box.position = boxPosition;
      if (!hpr) {
        hpr = new SuperMap3D.HeadingPitchRoll(
          SuperMap3D.Math.toRadians(state.heading),
          SuperMap3D.Math.toRadians(state.pitch),
          SuperMap3D.Math.toRadians(state.roll)
        );
      }
      let orientation = SuperMap3D.Transforms.headingPitchRollQuaternion(
        boxPosition,
        hpr
      );
      box.orientation = orientation;
    }
  }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);

  screenSpaceEventHandler.setInputAction((evt: any) => {
    if (startClip) {
      position = scene.pickPosition(evt.position);
      if (!position) {
        return;
      }
      updateClip();
      startClip = false;
      box.show = false;
    }
    screenSpaceEventHandler.removeInputAction(
      SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE
    );
    screenSpaceEventHandler.removeInputAction(
      SuperMap3D.ScreenSpaceEventType.LEFT_CLICK
    );
    hpr = null;
    document.body.classList.remove("measureCur");
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}
// 更新
function updateClip() {
  for (let layer of layers) {
    layer.setCustomClipCross({
      position: position,
      dimensions: dim,
      heading: state.heading,
      pitch: state.pitch,
      roll: state.roll,
      extrudeDistance: Number(state.extrude),
    });
  }
}

// 清除
function clearCross() {
  box && viewer.entities.removeById("cross-clip-identify-box");
  for (let layer of layers) {
    layer.clearCustomClipBox();
  }
  startClip = false;
  box = undefined;
  screenSpaceEventHandler.removeInputAction(
    SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE
  );
  screenSpaceEventHandler.removeInputAction(
    SuperMap3D.ScreenSpaceEventType.LEFT_CLICK
  );
}

// 监听
watch(
  () => state.clipWidth,
  (val) => {
    let temp_width = Number(val);
    if (temp_width <= 0 || !box) {
      return;
    }
    box.box.dimensions = new SuperMap3D.Cartesian3(
      state.clipWidth,
      state.clipHeight,
      0.1
    );
    dim = new SuperMap3D.Cartesian3(
      temp_width,
      state.clipHeight,
      state.extrude
    );
    updateClip();
  }
);
watch(
  () => state.clipHeight,
  (val) => {
    let temp_height = Number(val);
    if (temp_height <= 0 || !box) {
      return;
    }
    box.box.dimensions = new SuperMap3D.Cartesian3(
      state.clipWidth,
      state.clipHeight,
      0.1
    );
    dim = new SuperMap3D.Cartesian3(
      state.clipWidth,
      temp_height,
      state.extrude
    );
    updateClip();
  }
);
watch(
  () => state.pitch,
  (val: any) => {
    if (val === "" || !box) {
      return;
    }
    let pitch = Number(val);
    let hpr = new SuperMap3D.HeadingPitchRoll(
      SuperMap3D.Math.toRadians(state.heading),
      SuperMap3D.Math.toRadians(pitch),
      SuperMap3D.Math.toRadians(state.roll)
    );
    let orientation = SuperMap3D.Transforms.headingPitchRollQuaternion(
      boxPosition,
      hpr
    );
    box.orientation = orientation;
    updateClip();
  }
);
watch(
  () => state.roll,
  (val: any) => {
    if (val === "" || !box) {
      return;
    }
    let roll = Number(val);
    let hpr = new SuperMap3D.HeadingPitchRoll(
      SuperMap3D.Math.toRadians(state.heading),
      SuperMap3D.Math.toRadians(state.pitch),
      SuperMap3D.Math.toRadians(roll)
    );
    let orientation = SuperMap3D.Transforms.headingPitchRollQuaternion(
      boxPosition,
      hpr
    );
    box.orientation = orientation;
    updateClip();
  }
);
watch(
  () => state.heading,
  (val: any) => {
    if (val === "" || !box) {
      return;
    }
    let heading = Number(val);
    let hpr = new SuperMap3D.HeadingPitchRoll(
      SuperMap3D.Math.toRadians(heading),
      SuperMap3D.Math.toRadians(state.pitch),
      SuperMap3D.Math.toRadians(state.roll)
    );
    let orientation = SuperMap3D.Transforms.headingPitchRollQuaternion(
      boxPosition,
      hpr
    );
    box.orientation = orientation;
    updateClip();
  }
);
watch(
  () => state.extrude,
  (val) => {
    let temp_extrudeDistance = Number(val);
    if (temp_extrudeDistance <= 0 || !box) {
      return;
    }
    updateClip();
  }
);

onBeforeUnmount(() => {
  clearCross();
  // layers = undefined;
  box = undefined;
  dim = undefined;
});
</script>

<style lang="scss" scoped>

</style>

