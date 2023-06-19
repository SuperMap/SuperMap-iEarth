<template>
  <div class="attribute-container">
    <n-grid :y-gap="8" :cols="3">
      <n-gi>
        <n-checkbox v-model:checked="state.earthShow" label="地球" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.shadow" label="阴影" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.sunShow" label="太阳" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.depthInspection" label="深度检测" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.atomsphereRender" label="大气渲染" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.fogEffect" label="雾化效果" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.cloudLayer" label="云层" />
      </n-gi>
      <!-- <n-gi>
        <n-checkbox v-model:checked="state.rain" label="雨景" />
      </n-gi> -->
      <!-- <n-gi>
        <n-checkbox v-model:checked="state.snow" label="雪景" />
      </n-gi> -->
      <n-gi>
        <n-checkbox v-model:checked="state.skyBoxShow" label="天空盒" />
      </n-gi>
      <!-- <n-gi>
        <n-checkbox v-model:checked="state.timeAxis" label="时间轴" />
      </n-gi> -->
      <n-gi>
        <n-checkbox v-model:checked="state.displayFrame" label="显示帧率" />
      </n-gi>
    </n-grid>

    <n-divider />

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>亮度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.brightness"
          style="width: 80%"
          :step="0.1"
          :min="0"
          :max="5"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.brightness }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>对比度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.contrast"
          style="width: 80%"
          :step="0.1"
          :min="0"
          :max="5"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.contrast }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>色调</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.hue"
          style="width: 80%"
          :step="0.1"
          :min="-1"
          :max="1"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.hue }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
    >
      <template #item-lable>饱和度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.saturation"
          style="width: 80%"
          :step="0.1"
          :min="0"
          :max="5"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.saturation }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.15rem" contentMarginLeft="-0.1rem">
      <template #item-lable>开启地下</template>
      <template #item-content>
        <n-switch size="small" v-model:value="state.showUnderground" />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="1.7rem"
      slotType="slider"
      v-show="state.showUnderground"
    >
      <template #item-lable>地表透明度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.surfaceTransparency"
          style="width: 80%"
          :step="0.01"
          :min="0"
          :max="1"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.surfaceTransparency }}
        </div>
      </template>
    </sm-rowLayOut>

    <n-divider />

    <sm-rowLayOut marginbottom="0.15rem">
      <template #item-lable>坐标查询</template>
      <template #item-content>
        <n-input
          placeholder="显示坐标"
          v-model:value="coordinate"
          autosize
          style="min-width: 80%"
        />
      </template>
    </sm-rowLayOut>
  </div>

  <n-space class="buttonGroup">
    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="queryCoordinate"
          >查询</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">清除</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onBeforeUnmount } from "vue";
import tool from "@/tools/tool";

type stateType = {
  // 场景属性
  earthShow: boolean; //地球显隐
  shadow: boolean; //场景阴影
  sunShow: boolean; //太阳
  depthInspection: boolean; //深度检测
  atomsphereRender: boolean; //大气渲染
  fogEffect: boolean; //雾化效果
  cloudLayer: boolean; //云层
  rain: boolean; //雨景
  snow: boolean; //雪景
  skyBoxShow: boolean; //天空盒
  timeAxis: boolean; //时间轴
  displayFrame: boolean; //显示帧率

  // 显示地下
  showUnderground: boolean;
  surfaceTransparency: number; //地表透明度

  // 图层属性
  brightness: number; // 亮度
  contrast: number; // 对比度
  hue: number; // 色调
  saturation: number; // 饱和度
};

// 初始化数据
let state = reactive<stateType>({
  earthShow: true,
  shadow: false,
  sunShow: false,
  depthInspection: true,
  atomsphereRender: true,
  fogEffect: true,
  cloudLayer: false,
  skyBoxShow: false,
  timeAxis: false,
  displayFrame: true,
  rain: false,
  snow: false,

  showUnderground: false,
  surfaceTransparency: 1,

  brightness: 1,
  contrast: 1,
  hue: 0,
  saturation: 1,
});

let coordinate = ref("");

viewer.scene.colorCorrection.show = true; // 场景颜色开关打开
let handlerSearch: any;

let cloudBoxUrl = "./images/project/sceneProperties/clouds/clouds1.png";
let bluesky = {
  positiveX: "./images/project/sceneProperties/bluesky/Right.jpg",
  negativeX: "./images/project/sceneProperties/bluesky/Left.jpg",
  positiveY: "./images/project/sceneProperties/bluesky/Front.jpg",
  negativeY: "./images/project/sceneProperties/bluesky/Back.jpg",
  positiveZ: "./images/project/sceneProperties/bluesky/Up.jpg",
  negativeZ: "./images/project/sceneProperties/bluesky/Down.jpg",
};

let cloudBox = new Cesium.CloudBox({ url: cloudBoxUrl });
let skybox = new Cesium.SkyBox({ sources: bluesky });
skybox.USpeed = 0; //获取或者设置天空盒子绕x轴运动的动画速度。设置为1时表示0.01弧度每秒
skybox.VSpeed = 0; //获取或者设置天空盒子绕y轴运动的动画速度。
skybox.WSpeed = 0; //获取或者设置天空盒子绕z轴运动的动画速度。
let defaultSkybox = viewer.scene.skyBox;

function init() {
  if (!window.viewer) return;
  state.earthShow = Cesium.defaultValue(viewer.scene.globe.show, true);
  state.shadow = Cesium.defaultValue(viewer.scene.shadows, false);
  state.sunShow = Cesium.defaultValue(viewer.scene.globe.enableLighting, false);
  state.depthInspection = Cesium.defaultValue(
    viewer.scene.globe.depthTestAgainstTerrain,
    true
  );
  state.atomsphereRender = Cesium.defaultValue(
    viewer.scene.skyAtmosphere.show,
    true
  );
  state.fogEffect = Cesium.defaultValue(viewer.scene.fog.enabled, true);
  state.showUnderground = Cesium.defaultValue(
    viewer.scene.undergroundMode,
    true
  );
  state.surfaceTransparency = Cesium.defaultValue(
    viewer.scene.globe.globeAlpha,
    1
  );
  state.displayFrame = Cesium.defaultValue(
    viewer.scene.debugShowFramesPerSecond,
    false
  );
  state.rain = Cesium.defaultValue(
    viewer.scene.postProcessStages.rain.enabled,
    false
  );
  state.snow = Cesium.defaultValue(
    viewer.scene.postProcessStages.snow.enabled,
    false
  );

  viewer.scene.postProcessStages.snow.uniforms.density = 10;
  viewer.scene.postProcessStages.snow.uniforms.speed = 4;
  viewer.scene.postProcessStages.rain.uniforms.speed = 8;
  if (viewer.scene.frameState.passes.render) {
    skybox.update(viewer.scene.frameState, true);
  }
  viewer.scene.skyBox = skybox;
  viewer.scene.skyBox.show = false;
}
init();

watch(
  () => state.earthShow,
  (val) => {
    viewer.scene.globe.show = val;
  }
);
watch(
  () => state.shadow,
  (val) => {
    viewer.scene.shadows = val;
  }
);
watch(
  () => state.sunShow,
  (val) => {
    viewer.scene.globe.enableLighting = val;
  }
);
watch(
  () => state.depthInspection,
  (val) => {
    viewer.scene.globe.depthTestAgainstTerrain = val;
  }
);
watch(
  () => state.atomsphereRender,
  (val) => {
    viewer.scene.skyAtmosphere.show = val;
  }
);
watch(
  () => state.showUnderground,
  (val) => {
    viewer.scene.undergroundMode = val;
  }
);
watch(
  () => state.surfaceTransparency,
  (val) => {
    viewer.scene.globe.globeAlpha = val;
  }
);
watch(
  () => state.cloudLayer,
  (val) => {
    if (val) {
      viewer.scene.cloudBox = cloudBox;
    } else {
      viewer.scene.cloudBox = null;
    }
  }
);
watch(
  () => state.rain,
  (val) => {
    viewer.scene.postProcessStages.rain.enabled = val;
  }
);
watch(
  () => state.snow,
  (val) => {
    viewer.scene.postProcessStages.snow.enabled = val;
  }
);
watch(
  () => state.skyBoxShow,
  (val) => {
    if (val) {
      let cameraHeight = viewer.scene.camera.positionCartographic.height;
      viewer.scene.postRender.addEventListener(watchCameraHeight);
      viewer.scene.skyBox = skybox;
      if (cameraHeight < 22e4) {
        viewer.scene.skyBox.show = true;
        state.atomsphereRender = false;
      } else {
        state.atomsphereRender = true;
      }
    } else {
      state.atomsphereRender = true;
      viewer.scene.skyBox.show = false;
      viewer.scene.skyBox = defaultSkybox;
      viewer.scene.postRender.removeEventListener(watchCameraHeight);
    }
  }
);
watch(
  () => state.timeAxis,
  (val) => {
    let timeline = document.getElementsByClassName(
      "cesium-viewer-timelineContainer"
    )[0] as HTMLElement;
    if (val) {
      timeline.style.visibility = "visible";
      timeline.style["z-index"] = 99999999999;
    } else {
      timeline.style.visibility = "hidden";
    }
  }
);
watch(
  () => state.displayFrame,
  (val) => {
    viewer.scene.debugShowFramesPerSecond = val;
  }
);

watch(
  () => state.brightness,
  (val) => {
    viewer.scene.colorCorrection.brightness = val;
  }
);
watch(
  () => state.contrast,
  (val) => {
    viewer.scene.colorCorrection.contrast = val;
  }
);
watch(
  () => state.hue,
  (val) => {
    viewer.scene.colorCorrection.hue = val;
  }
);
watch(
  () => state.saturation,
  (val) => {
    viewer.scene.colorCorrection.saturation = val;
  }
);

// 监听相机高度，一旦高于设定阈值，关闭天空盒显示大气层
function watchCameraHeight() {
  if (state.skyBoxShow) {
    let cameraHeight = viewer.scene.camera.positionCartographic.height;
    if (cameraHeight > 22e4) {
      viewer.scene.skyBox.show = false;
      state.atomsphereRender = true;
    } else {
      viewer.scene.skyBox.show = true;
      state.atomsphereRender = false;
    }
  }
}

function queryCoordinate() {
  handlerSearch = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handlerSearch.setInputAction(function (movement: any) {
    let cartesian = viewer.camera.pickEllipsoid(
      movement.position,
      viewer.scene.globe.ellipsoid
    );

    let result = tool.CartesiantoDegrees(cartesian);

    coordinate.value = `${Number(result[0]).toFixed(5)},${Number(
      result[1]
    ).toFixed(5)}`;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function clear() {
  if (handlerSearch) {
    if (!handlerSearch.isDestroyed()) handlerSearch.destroy();
  }

  coordinate.value = "";
}

onBeforeUnmount(() => {
  clear();
});
</script>
<style lang="scss" scoped>
.attribute-container {
  @include panelContainer(100%, 4rem);
}
</style>
