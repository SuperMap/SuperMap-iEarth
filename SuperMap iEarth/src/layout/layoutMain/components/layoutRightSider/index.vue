<template>
  <div class="right-tool-bar">
    <!-- 指南 -->
    <div class="too-bar two-tool-bar">
      <span class="icon-container" @click="reduceCompass">
        <i
          class="iconfont iconzhibeizhen_1"
          id="compass_dom"
          :title="$t('w_north')"
        ></i>
      </span>
      <span class="icon-container" @click="reset">
        <i class="iconfont iconfuwei" :title="$t('w_reset')"></i>
      </span>
    </div>

    <!-- 缩放 -->
    <div class="too-bar two-tool-bar">
      <span class="icon-container">
        <i
          class="iconfont iconfangda"
          @click="zoomIn"
          @mousedown="continueZoomIn"
          @mouseup="clearTimer"
          :title="$t('w_zoomIn')"
        ></i>
      </span>
      <span class="icon-container">
        <i
          class="iconfont iconsuoxiao"
          @click="zoomOut"
          @mousedown="continueZoomOut"
          @mouseup="clearTimer"
          :title="$t('w_zoomOut')"
        ></i>
      </span>
    </div>

    <!-- 分析功能面板 -->
    <div class="too-bar five-tool-bar">
      <span
        class="icon-container"
        v-for="iconItem in state.rightToolBarList"
        :key="iconItem.id"
        @click="changePanel(iconItem)"
        :class="iconItem.isSelected ? 'select-too-bar-bg' : ''"
      >
        <i
          class="iconfont"
          :class="iconItem.iconName"
          :title="$t(iconItem.title)"
        ></i>
      </span>
    </div>

    <!-- iportal：保存和首页 -->
    <div class="too-bar two-tool-bar" v-if="showIPortalToolBar">
      <span class="icon-container">
        <i
          class="iconfont iconzhuye"
          @click="goHome"
          :title="$t('w_home')"
        ></i>
      </span>
      <span class="icon-container" @click="saveScene">
        <i class="iconfont iconbaocun" title="将场景保存至iPortal中"></i>
      </span>
    </div>

    <!-- locate：保存和打开 -->
    <div class="too-bar two-tool-bar" v-else>
      <openLocalSence></openLocalSence>
      <span class="icon-container" @click="saveScene">
        <i class="iconfont iconbaocun" title="将场景保存为本地JSON文件"></i>
      </span>
    </div>

    <!-- 场景保存弹窗 -->
    <saveLocalScene></saveLocalScene>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from "vue";
import { usePanelStore } from "@/store";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { getRootUrl } from "@/tools/iportal/portalTools";
import openLocalSence from './coms/openLocalSence.vue';
import saveLocalScene from './coms/saveLocalScene.vue';

const panelStore = usePanelStore();
const IportalStore = IportalStoreCreate();

let scratchWindowPosition: any, timer: any;

onMounted(() => {
  init();
});

const showIPortalToolBar = computed(() => {
  // return window.simulateIPortalMode ? true : IportalStore.isLogin;
  return IportalStore.isLogin;
});

let state = reactive({
  rightToolBarList: panelStore.panelList.rightToolBarList.slice(0, 5), // 前五个
});

// 初始化
function init() {
  if (!viewer) return;
  viewer.camera.changed.addEventListener(listener); //监听指北针转动
  scratchWindowPosition = new SuperMap3D.Cartesian2(); //获取屏幕中心点
  scratchWindowPosition.x = viewer.scene.canvas.clientWidth / 2;
  scratchWindowPosition.y = viewer.scene.canvas.clientHeight / 2;
  viewer.scene.postRender.addEventListener(listener); //监听指北针转动
  window.addEventListener("resize", function () {
    scratchWindowPosition.x = viewer.scene.canvas.clientWidth / 2;
    scratchWindowPosition.y = viewer.scene.canvas.clientHeight / 2;
  });
}

// 改变当前面板
function changePanel(iconItem: any) {
  panelStore.setRightToolBarList(iconItem);
}

// 清除定时器
function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// 放大
function zoomIn() {
  let position = viewer.camera.position;
  let cameraHeight =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  let moveRate = cameraHeight / 20.0; // 参数可改
  viewer.camera.moveForward(moveRate);
}
// 长按持续放大
function continueZoomIn() {
  timer = setInterval(() => zoomIn(), 50);
}

//缩小
function zoomOut() {
  let position = viewer.camera.position;
  let cameraHeight =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  let moveRate = cameraHeight / 20.0; // 参数可改
  viewer.camera.moveBackward(moveRate);
}
// 长按持续缩小
function continueZoomOut() {
  timer = setInterval(() => zoomOut(), 50);
}

// 复位：复位到指定位置
function reset() {
  viewer.camera.flyTo({
    destination: SuperMap3D.Cartesian3.fromDegrees(104, 30, 25682725),
  });
}

//监听指北针转动
function listener() {
  let x = -SuperMap3D.Math.toDegrees(viewer.scene.camera.heading);
  let degrees = "rotate(" + x + "deg)";
  let compass_dom: HTMLElement = document.getElementById(
    "compass_dom"
  ) as HTMLElement;
  compass_dom.style.transform = degrees;
}

//指北针
function reduceCompass() {
  let scene = viewer.scene;
  let camera = scene.camera;
  let sscc = scene.screenSpaceCameraController;

  if (scene.mode == SuperMap3D.SceneMode.MORPHING || !sscc.enableInputs) {
    return true;
  }
  if (viewer.navigationLocked) {
    return true;
  }
  if (
    scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW &&
    !sscc.enableTranslate
  ) {
    return;
  }
  if (
    scene.mode == SuperMap3D.SceneMode.SCENE3D ||
    scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW
  ) {
    if (!sscc.enableLook) {
      return;
    }

    if (scene.mode == SuperMap3D.SceneMode.SCENE3D) {
      if (!sscc.enableRotate) {
        return;
      }
    }
  }

  let center = scene.pickPosition(scratchWindowPosition);
  if (!SuperMap3D.defined(center)) {
    reset();
    return;
  }

  let cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(
    camera.positionCartographic,
    new SuperMap3D.Cartesian3()
  );

  let surfaceNormal = scene.globe.ellipsoid.geodeticSurfaceNormal(center);
  let focusBoundingSphere = new SuperMap3D.BoundingSphere(center, 0);

  camera.flyToBoundingSphere(focusBoundingSphere, {
    offset: new SuperMap3D.HeadingPitchRange(
      0,
      SuperMap3D.Math.PI_OVER_TWO -
        SuperMap3D.Cartesian3.angleBetween(surfaceNormal, camera.directionWC),
      SuperMap3D.Cartesian3.distance(cameraPosition, center)
    ),
    duration: 1.5,
  });
}

// 回到主页
function goHome() {
  let homeUrl = getRootUrl();
  window.open(homeUrl);
}

// 场景保存弹窗
function saveScene(){
  panelStore.showSavePanel = true;
  outputSceneToFile();
}

// 缩略图
function outputSceneToFile() {
  let promise = viewer.scene.outputSceneToFile();
  SuperMap3D.when(promise, function (buffer) {
    let canvas: any = document.getElementById("sceneCanvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = buffer;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 298, 150);
    };
  });
}
</script>

<style lang="scss" scoped>
// 工具栏位置
.right-tool-bar {
  position: fixed;
  top: 0.8rem;
  right: 0.1rem;

  .one-tool-bar {
    margin-bottom: 0.1rem;
    @include setBackground(
      0.32rem,
      0.32rem,
      "@/assets/images/right-tool-one-bar.png"
    );
  }

  .two-tool-bar {
    box-sizing: border-box;
    padding-top: 0.04rem;
    margin-bottom: 0.1rem;
    @include setBackground(
      0.32rem,
      0.72rem,
      "@/assets/images/right-tool-two-bar.png"
    );
  }

  .five-tool-bar {
    box-sizing: border-box;
    padding-top: 0.08rem;
    margin-top: 0.4rem;
    margin-bottom: 0.1rem;
    @include setBackground(
      0.32rem,
      1.75rem,
      "@/assets/images/right-tool-five-bar.png"
    );
  }

  .icon-container {
    display: block;
    width: 100%;
    height: 0.32rem;
    @include flexLayout(center);
    @include setIconstyle();
  }

  .select-too-bar-bg {
    @include setBackground(
      0.32rem,
      0.32rem,
      "@/assets/images/item-checked-bg.png"
    );
  }
}
</style>
