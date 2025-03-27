<template>
  <n-scrollbar style="max-height: 5rem;">
    <n-grid :y-gap="8" :cols="3" style="padding-top: 0.1rem">
      <n-gi>
        <n-checkbox v-model:checked="state.earthShow" :label="$t('earth')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.depthInspection" :label="$t('depthInspection')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.atomsphereRender" :label="$t('atomsphereRender')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.cloudLayer" :label="$t('cloudLayer')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.fogEffect" :label="$t('fogEffect')" />
      </n-gi>
      <!-- <n-gi>
        <n-checkbox v-model:checked="state.displayFrame" :label="$t('displayFrame')" />
      </n-gi> -->
      <n-gi>
        <n-checkbox v-model:checked="state.timeAxis" :label="$t('timeAxis')" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.hdrEnabled" label="HDR" />
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="state.useDBQuery" :label="$t('layerQuery')" />
      </n-gi>
    </n-grid>

    <n-divider />

    <n-collapse :trigger-areas="triggerAreas" display-directive="show">
      <n-collapse-item :title="$t('skyBox')" name="skybox">
        <SkyBox v-if="state.skyBoxShow"></SkyBox>
        <template #header-extra>
          <n-switch v-model:value="state.skyBoxShow" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('envMap')" name="envMap">
        <EnvMap v-if="state.envMapEnabled"></EnvMap>
        <template #header-extra>
          <n-switch v-model:value="state.envMapEnabled" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('shadow')" name="shadow">
        <Shadow v-if="state.shadow"></Shadow>
        <template #header-extra>
          <n-switch v-model:value="state.shadow" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('sunLight')" name="sunLight">
        <LightSource v-if="state.sunShow"></LightSource>
        <template #header-extra>
          <n-switch v-model:value="state.sunShow" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('colorAdjust') " name="sceneColor">
        <SceneColor v-if="state.sceneColor"></SceneColor>
        <template #header-extra>
          <n-switch v-model:value="state.sceneColor" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('showUnderground') " name="underground">
        <UnderGound v-if="state.showUnderground"></UnderGound>
        <template #header-extra>
          <n-switch v-model:value="state.showUnderground" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('floodLight')" name="bloomEffect">
        <BloomEffect v-if="state.bloomEffect"></BloomEffect>
        <template #header-extra>
          <n-switch v-model:value="state.bloomEffect" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('msaaLevel')" name="msaaLevel">
        <MsaaLevel v-if="state.isMsaaLevel"></MsaaLevel>
        <template #header-extra>
          <n-switch v-model:value="state.isMsaaLevel" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('depthSet')" name="sceneDepth">
        <SceneDepth v-if="state.isDepthSet"></SceneDepth>
        <template #header-extra>
          <n-switch v-model:value="state.isDepthSet" size="small" />
        </template>
      </n-collapse-item>
      <n-collapse-item :title="$t('mouseMode')" name="mouseMode">
        <MouseMode v-if="state.isMouseMode"></MouseMode>
        <template #header-extra>
          <n-switch v-model:value="state.isMouseMode" size="small" />
        </template>
      </n-collapse-item>
    </n-collapse>

    <n-divider />

    <div class="row-item" style="margin-bottom: 0px; margin-right: 0.1rem">
      <span>{{ $t("coordinateQuery") }}</span>
      <n-input
        class="coordinateQueryBox"
        disabled
        :placeholder="$t('displayCoordinateTip')"
        v-model:value="coordinate"
        autosize
        style="width: 1.96rem"
      />
    </div>
  </n-scrollbar>

  <!-- DB属性查询 -->
  <DBQuery v-if="state.useDBQuery"></DBQuery>
</template>

<script lang="ts" setup>
import { watch, reactive, computed, ref, onMounted } from "vue";
import LightSource from "./coms/lightSource.vue";
import SceneColor from "./coms/sceneColor.vue";
import UnderGound from "./coms/underGound.vue";
import SkyBox from "./coms/skyBox.vue";
import Shadow from "./coms/shadow.vue";
import BloomEffect from "./coms/bloomEffect.vue";
import EnvMap from "./coms/envMap.vue";
import MsaaLevel from "./coms/msaaLevel.vue";
import SceneDepth from "./coms/sceneDepth.vue";
import MouseMode from "./coms/mouseMode.vue";
import DBQuery from "./coms/DBQuery.vue";

const viewer = window.viewer;
const scene = viewer.scene;
const triggerAreas = computed(()=>['arrow','main']);
let coordinate = ref("");
let handlerSearch = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

// 云层
const cloudBoxUrl = "./images/cloudLayer/clouds1.png";
const cloudBox = new SuperMap3D.CloudBox({ url: cloudBoxUrl });

// 时间条和天空盒
const timeline = document.getElementsByClassName("supermap3d-viewer-timelineContainer")[0] as HTMLElement;
const skyBox = viewer.scene.skyBox;

// 设置state
const state = reactive({
  earthShow: viewer.scene.globe.show, //地球显隐
  depthInspection: viewer.scene.globe.depthTestAgainstTerrain ? true : false,//深度检测
  atomsphereRender: viewer.scene.skyAtmosphere.show, //大气渲染
  fogEffect: viewer.scene.fog.enabled, //雾化效果
  timeAxis: (timeline && timeline.style.visibility === "visible") ? true : false,//时间轴
  displayFrame: viewer.scene.debugShowFramesPerSecond,//显示帧率
  cloudLayer: viewer.scene.cloudBox ? true : false, // 云层
  hdrEnabled: viewer.scene.hdrEnabled, // HDR
  useDBQuery: false,

  // 子组件
  bloomEffect: viewer.scene.bloomEffect.show, // 后处理
  showUnderground: viewer.scene.undergroundMode ? true : false,// 显示地下
  sceneColor: viewer.scene.colorCorrection.show, // 场景颜色
  sunShow: viewer.scene.sun.show, // 太阳光
  shadow: viewer.shadows ? true : false, //场景阴影
  envMapEnabled: viewer.scene.specularEnvironmentMaps == undefined ? false : true, // 环境光贴图
  skyBoxShow: (skyBox.imageUrl && skyBox.imageUrl.includes('jpg')) ? true : false,//天空盒
  isMsaaLevel: viewer.scene._msaaSamples <= 1.1 ? false : true, // 反走样
  isDepthSet: viewer.scene.depthOfFieldEffect.show, // 设置景深
  isMouseMode: viewer.scene.screenSpaceCameraController.customMouseMode ? true : false, // 该属性为自定义绑定，并无此API
});

onMounted(() => {
  queryCoordinate();
});

// 场景中拾取查询坐标
function queryCoordinate() {
  handlerSearch.setInputAction(function (click) {
    let position = viewer.scene.pickPosition(click.position);
    let result = window.iEarthTool.Cartesian3ToDegreeArray(position);
    coordinate.value = `${Number(result[0]).toFixed(4)},${Number(
      result[1]
    ).toFixed(4)},${Number(result[2]).toFixed(2)}`;
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

// 监听单个属性
watch(() => state.earthShow, (val) => { 
  viewer.scene.globe.show = val;
});
watch(() => state.depthInspection,(val) => {
  viewer.scene.globe.depthTestAgainstTerrain = val;
});
watch(() => state.atomsphereRender, (val) => {
  viewer.scene.skyAtmosphere.show = val;
});
watch(() => state.fogEffect,(val) => {
  viewer.scene.fog.enabled = val;
}); 
watch(() => state.timeAxis,(val) => {
    if(!timeline) return;
    timeline.style.visibility = val ? "visible" : "hidden";
});
watch(() => state.displayFrame,(val) => {
  viewer.scene.debugShowFramesPerSecond = val;
});
watch(() => state.cloudLayer, (val) => {
  viewer.scene.cloudBox = val ? cloudBox : null;
});
watch(() => state.hdrEnabled,(val) => {
  viewer.scene.hdrEnabled = val;
});



// 监听子组件：解决第一次switch没有效果，因为通过json导入的场景，子组件并没有挂载
watch(() => state.bloomEffect,(val) => { // 监听泛光
  viewer.scene.bloomEffect.show = val;
});
watch(() => state.showUnderground,(val) => { 
  viewer.scene.undergroundMode = val;
  if(!val) {
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
    viewer.scene.globe.showSkirts = true; // 开启裙边
    viewer.scene.globe.globeAlpha = 1;
  }
});
watch(() => state.sceneColor,(val) => {  // 颜色矫正
  viewer.scene.colorCorrection.show = val;
});
watch(() => state.sunShow,(val) => { 
  viewer.scene.sun.show = val;
});
watch(() => state.shadow,(val) => { 
  viewer.shadows = val;
});
watch(() => state.envMapEnabled,(val) => { // 环境光贴图
  if(!val) viewer.scene.specularEnvironmentMaps = undefined;
});
watch(() => state.skyBoxShow,(val) => { 
  if(!val) {
    scene.skyAtmosphere.show = true;
    scene.skyBox.show = false;
  }
});
watch(() => state.isMsaaLevel,(val) => { 
  if(!val) viewer.scene._msaaSamples = 1.1; // 恢复默认值: 直接设置1效果不对，具体看组件
});
watch(() => state.isDepthSet,(val) => { // 监听景深
  viewer.scene.depthOfFieldEffect.show = val;
});
</script>

<style lang="scss" scoped>
.n-input.n-input--autosize .n-input__input-el {
  color: rgba(255, 255, 255, 0.82) !important;
}

.n-collapse .n-collapse-item{
  width: 2.9rem;
}
</style>
