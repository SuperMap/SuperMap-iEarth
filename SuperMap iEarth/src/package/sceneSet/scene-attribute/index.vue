<template>
  <n-scrollbar style="max-height: 3.6rem">
    <n-grid :y-gap="8" :cols="3">
      <n-gi>
        <n-checkbox v-model:checked="state.earthShow" :label="$t('global.earth')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.shadow" :label="$t('global.ligShadowAnalysisth')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.sunShow" :label="$t('global.sun')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.depthInspection" :label="$t('global.depthInspection')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.atomsphereRender" :label="$t('global.atomsphereRender')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.fogEffect" :label="$t('global.fogEffect')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.cloudLayer" :label="$t('global.cloudLayer')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.skyBoxShow" :label="$t('global.skyBox')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.timeAxis" :label="$t('global.timeAxis')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.displayFrame" :label="$t('global.displayFrame')" />
      </n-gi>
    </n-grid>

    <n-divider />
    <div class="row-item" style="margin-right: 0.1rem">
      <span>{{ $t('global.brightness') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem;" v-model:value="state.brightness" :step="0.1" :min="0" :max="5" />
        <div class="slider-suffix">
          <span>{{ state.brightness }}</span>
        </div>
      </div>
    </div>

    <div class="row-item" style="margin-right: 0.1rem">
      <span>{{ $t('global.contrastRatio') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem;" v-model:value="state.contrast" :step="0.1" :min="0" :max="5" />
        <div class="slider-suffix">
          <span>{{ state.contrast }}</span>
        </div>
      </div>
    </div>

    <div class="row-item" style="margin-right: 0.1rem">
      <span>{{ $t('global.colorTone') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem;" v-model:value="state.hue" :step="0.1" :min="-1" :max="1" />
        <div class="slider-suffix">
          <span>{{ state.hue }}</span>
        </div>
      </div>
    </div>

    <div class="row-item" style="margin-right: 0.1rem">
      <span>{{ $t('global.saturation') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem;" v-model:value="state.saturation" :step="0.1" :min="0" :max="5" />
        <div class="slider-suffix">
          <span>{{ state.saturation }}</span>
        </div>
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t('global.showUnderground') }}</span>
      <div style="width: 1.96rem;;margin-right: 0.1rem">
        <n-switch v-model:value="state.showUnderground" size="small" />
      </div>
    </div>
    <div class="row-item" v-show="state.showUnderground">
      <span>{{ $t('global.surfaceTransparency') }}</span>
      <div class="slider-box">
        <n-slider style="width: 1.5rem;" v-model:value="state.surfaceTransparency" :step="0.1" :min="0" :max="1" />
        <div class="slider-suffix">
          <span>{{ state.surfaceTransparency }}</span>
        </div>
      </div>
    </div>
    <n-divider />

    <div class="row-item" style="margin-bottom:0px;margin-right: 0.1rem">
      <span>{{ $t('global.coordinateQuery') }}</span>
      <n-input :placeholder="$t('global.displayCoordinate')" v-model:value="coordinate" autosize
        style="width: 1.96rem;" />
    </div>
    <div class="row-item queryTips">
      <span></span>
      <span class="row-content">{{ $t('global.coordinateTip') }}</span>
    </div>
  </n-scrollbar>
  <!-- <div class="btn-row-item" style="margin-bottom: 0.1rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="queryCoordinate"
      style="margin-right: 0.1rem"
      >{{$t('global.query')}}</n-button
    >
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{$t('global.clear')}}</n-button>
  </div> -->
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onBeforeUnmount } from 'vue'
import tool from "@/tools/tool";
import { useLayerStore } from "@/store/layerStore";
import layerManagement from "@/tools/layerManagement";

const layerStore = useLayerStore();

// 设置state
let state = layerStore.sceneAttrState;

// 初始化变量
let coordinate = ref('');
let handlerSearch: any;
viewer.scene.colorCorrection.show = true; // 场景颜色开关打开

// 云层
let cloudBoxUrl = './images/sceneProperties/clouds/clouds1.png';
let cloudBox = new SuperMap3D.CloudBox({ url: cloudBoxUrl });

// 初始化
init();
function init() {
  if (!window.viewer) return;

  //开启坐标查询
  queryCoordinate();

  // 设置图层阴影效果
  viewer.scene.shadows = false;
  let layers = viewer.scene.layers.layerQueue;
  for (var i = 0; i < layers.length; i++) {
    // 设置图层的阴影模式
    layers[i].shadowType = 2;
  }
}

// 场景中拾取查询坐标
function queryCoordinate() {
  handlerSearch = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  handlerSearch.setInputAction(function (click) {
    let position = viewer.scene.pickPosition(click.position);
    let result = tool.CartesiantoDegrees(position)
    coordinate.value = `${Number(result[0]).toFixed(2)},${Number(result[1]).toFixed(2)},${Number(result[2]).toFixed(2)}`
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

// 清除
function clear() {
  handlerSearch.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)//移除事件

  if (handlerSearch) {
    if (!handlerSearch.isDestroyed()) handlerSearch.destroy();
  }
  coordinate.value = ''
}

// 监听
watch(() => state.earthShow, val => {
  viewer.scene.globe.show = val;
})
watch(() => state.shadow, val => {
  if (val) {
    let layers = viewer.scene.layers.layerQueue;
    for (var i = 0; i < layers.length; i++) {
      // 设置图层的阴影模式
      layers[i].shadowType = 2;
    }

    viewer.shadows = true;
    // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
    viewer.pcss = true;
    viewer.shadowQuality = 0;
    //设置阴影的出现距离
    viewer.scene.shadowMap.maximumDistance = 2000;
    //设置阴影的浓度，值越高，阴影越淡
    viewer.shadowMap.darkness = 0.4;
    //默认值是0.1，值越小越清晰
    viewer.shadowMap.penumbraRatio = 0.1;
  } else {
    viewer.shadows = false;
  }
  
})
watch(() => state.sunShow, val => {
  viewer.scene.globe.enableLighting = val;
  
})
watch(() => state.depthInspection, val => {
  viewer.scene.globe.depthTestAgainstTerrain = val;
  
})
watch(() => state.atomsphereRender, val => {
  viewer.scene.skyAtmosphere.show = val;
  
})
watch(() => state.fogEffect, val => {
  viewer.scene.fog.enabled = val; // 不起作用
  
});
watch(
  () => state.showUnderground,
  val => {
    viewer.scene.undergroundMode = val;
    if (val) {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000; //设置相机最小缩放距离,距离地表-1000米
      viewer.scene.terrainProvider.isCreateSkirt = false; // 关闭裙边
    } else {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
      viewer.scene.terrainProvider.isCreateSkirt = true; // 开启裙边
    }
  }
);
watch(
  () => state.surfaceTransparency,
  val => {
    viewer.scene.globe.globeAlpha = val;
    
  }
);
watch(() => state.cloudLayer, val => {
  if (val) {
    viewer.scene.cloudBox = cloudBox;
  } else {
    viewer.scene.cloudBox = null;
  }
})

watch(() => state.skyBoxShow, val => {
  layerManagement.setSkyBox(val);
  
})
watch(() => state.timeAxis, val => {
  let timeline = document.getElementsByClassName(
    "supermap3d-viewer-timelineContainer"
  )[0] as HTMLElement;
  if (val) {
    timeline.style.visibility = "visible";
    timeline.style['z-index'] = 99999999999;
  } else {
    timeline.style.visibility = "hidden";
  }
  
})
watch(() => state.displayFrame, val => {
  viewer.scene.debugShowFramesPerSecond = val;
  
})

watch(() => state.brightness, val => {
  viewer.scene.colorCorrection.brightness = val;
})
watch(() => state.contrast, val => {
  viewer.scene.colorCorrection.contrast = val;
})
watch(() => state.hue, val => {
  viewer.scene.colorCorrection.hue = val;
})
watch(() => state.saturation, val => {
  viewer.scene.colorCorrection.saturation = val;
})

onBeforeUnmount(() => {
  clear();
  
})
</script>
<style lang="scss" scoped>
.queryTips {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);

}
</style>
