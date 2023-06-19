<template>
  <div class="clip-cross-container">
    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>裁剪宽度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.clipWidth"
          style="width: 70%"
          :min="0"
          :max="90"
          :step="10"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.clipWidth }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>裁剪高度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.clipHeight"
          style="width: 70%"
          :min="0"
          :max="90"
          :step="10"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.clipHeight }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>绕X轴旋转</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.heading"
          style="width: 70%"
          :min="0"
          :max="90"
          :step="10"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.heading }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>绕Y轴旋转</template>
      <template #item-content-slider>
        <n-slider v-model:value="state.pitch" style="width: 70%" />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.pitch }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>绕Z轴旋转</template>
      <template #item-content-slider>
        <n-slider v-model:value="state.roll" style="width: 70%" />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.roll }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>拉伸高度</template>
      <template #item-content-slider>
        <n-slider v-model:value="state.extrude" style="width: 70%" />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.extrude }}
        </div>
      </template>
    </sm-rowLayOut>
  </div>

  <sm-btnGroup>
    <template #btn-left>
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="startCross"
        >裁剪</n-button
      >
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clearCross">清除</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";

const scene = viewer.scene;

type stateType = {
  clipWidth: number;
  clipHeight: number;
  heading: number;
  pitch: number;
  roll: number;
  extrude: number;
};

let state = reactive<stateType>({
  clipWidth: 5,
  clipHeight: 5,
  heading: 0,
  pitch: 0,
  roll: 0,
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

screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
  viewer.scene.canvas
);
layers = viewer.scene.layers.layerQueue;



/*
 ***cross分析模块***
 */

// 分析
function startCross(e: any) {
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
function start() {
  for (let layer of layers) {
    layer.selectEnabled = false;
  }
  // 添加盒子
  boxPosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
  dim = new Cesium.Cartesian3(state.clipWidth, state.clipHeight, 0.1);
  box = viewer.entities.add({
    // 标识盒
    id: "cross-clip-identify-box",
    position: boxPosition,
    show: false,
    box: {
      dimensions: dim,
      fill: false,
      outline: true,
      outlineColor: Cesium.Color.AQUA,
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
        hpr = new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(state.heading),
          Cesium.Math.toRadians(state.pitch),
          Cesium.Math.toRadians(state.roll)
        );
      }
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        boxPosition,
        hpr
      );
      box.orientation = orientation;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

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
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
    screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    hpr = null;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
    Cesium.ScreenSpaceEventType.MOUSE_MOVE
  );
  screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
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
    box.box.dimensions = new Cesium.Cartesian3(
      state.clipWidth,
      state.clipHeight,
      0.1
    );
    dim = new Cesium.Cartesian3(temp_width, state.clipHeight, state.extrude);
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
    box.box.dimensions = new Cesium.Cartesian3(
      state.clipWidth,
      state.clipHeight,
      0.1
    );
    dim = new Cesium.Cartesian3(state.clipWidth, temp_height, state.extrude);
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
    let hpr = new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(state.heading),
      Cesium.Math.toRadians(pitch),
      Cesium.Math.toRadians(state.roll)
    );
    let orientation = Cesium.Transforms.headingPitchRollQuaternion(
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
    let hpr = new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(state.heading),
      Cesium.Math.toRadians(state.pitch),
      Cesium.Math.toRadians(roll)
    );
    let orientation = Cesium.Transforms.headingPitchRollQuaternion(
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
    let hpr = new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(heading),
      Cesium.Math.toRadians(state.pitch),
      Cesium.Math.toRadians(state.roll)
    );
    let orientation = Cesium.Transforms.headingPitchRollQuaternion(
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
.clip-cross-container {
  @include panelContainer(100%, 2.6rem);
}
</style>

