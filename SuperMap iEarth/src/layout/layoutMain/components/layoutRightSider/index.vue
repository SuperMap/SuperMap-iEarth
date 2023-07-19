<template>
  <div class="right-tool-bar">
    <!-- 搜索 -->
    <!-- <div class="too-bar one-tool-bar">
      <span class="icon-container">
        <i class="iconfont icon-zhinan"></i>
      </span>
    </div> -->
    <!-- 指南 -->
    <div class="too-bar two-tool-bar">
      <span class="icon-container" @click="reduceCompass">
        <i class="iconfont iconzhibeizhen_1" id="compass_dom" :title="$t('global.w_north')"></i>
      </span>
      <span class="icon-container" @click="reset">
        <i class="iconfont iconfuwei" :title="$t('global.w_reset')"></i>
      </span>
    </div>
    <!-- 缩放 -->
    <div class="too-bar two-tool-bar">
      <span class="icon-container">
        <i class="iconfont iconfangda" @click="zoomIn" @mousedown="continueZoomIn" @mouseup="clearTimer" :title="$t('global.w_zoomIn')"></i>
      </span>
      <span class="icon-container">
        <i class="iconfont iconsuoxiao" @click="zoomOut" @mousedown="continueZoomOut" @mouseup="clearTimer" :title="$t('global.w_zoomOut')"></i>
      </span>
    </div>
    <!-- 分析等弹窗 -->
    <div class="too-bar four-tool-bar">
      <span class="icon-container" v-for="iconItem in state.rightToolBarList" :key="iconItem.id"
        @click="changePanel(iconItem)" :class="iconItem.isSelected ? 'select-too-bar-bg' : ''">
        <i class="iconfont" :class="iconItem.iconName" :title="$t(iconItem.title)"></i>
      </span>
    </div>
    <!--全屏-->
    <div class="too-bar one-tool-bar" style="margin-bottom: 0.1rem" @click="fullScreen">
      <span class="icon-container">
        <i class="iconfont iconzuidahua" :title="$t('global.w_fullScreen')"></i>
      </span>
    </div>
    <!--首页-->
    <div class="too-bar one-tool-bar" v-show="IportalStore.isLogin">
      <span class="icon-container">
        <i class="iconfont iconzhuye" :title="$t('global.w_home')" @click="goHome"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { usePanelStore } from "@/store";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { getRootUrl } from "@/tools/iportal/portalTools";

const panelStore = usePanelStore();
const IportalStore = IportalStoreCreate();

let scratchWindowPosition: any, timer: any;

onMounted(() => {
  init();
});

let state = reactive({
  rightToolBarList:panelStore.panelList.rightToolBarList.slice(0,4)
})

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
// 清除定时器
function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
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

// 全屏
function fullScreen() {
  if (SuperMap3D.Fullscreen.fullscreen) {
    SuperMap3D.Fullscreen.exitFullscreen();
  } else {
    SuperMap3D.Fullscreen.requestFullscreen(document.body);
  }
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
  var scene = viewer.scene;
  var camera = scene.camera;

  var sscc = scene.screenSpaceCameraController;

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

  var center = scene.pickPosition(scratchWindowPosition);

  if (!SuperMap3D.defined(center)) {
    // Globe is barely visible, so reset to home view.
    reset();
    return;
  }

  var cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(
    camera.positionCartographic,
    new SuperMap3D.Cartesian3()
  );

  var surfaceNormal = scene.globe.ellipsoid.geodeticSurfaceNormal(center);

  var focusBoundingSphere = new SuperMap3D.BoundingSphere(center, 0);

  camera.flyToBoundingSphere(focusBoundingSphere, {
    offset: new SuperMap3D.HeadingPitchRange(
      0,
      // do not use camera.pitch since the pitch at the center/target is required
      SuperMap3D.Math.PI_OVER_TWO -
      SuperMap3D.Cartesian3.angleBetween(surfaceNormal, camera.directionWC),
      // distanceToBoundingSphere returns wrong values when in 2D or Columbus view so do not use
      // camera.distanceToBoundingSphere(focusBoundingSphere)
      // instead calculate distance manually
      SuperMap3D.Cartesian3.distance(cameraPosition, center)
    ),
    duration: 1.5,
  });
}

function goHome() {
  let homeUrl = getRootUrl();
  window.open(homeUrl); 
}

</script>

<style lang="scss" scoped>
// 工具栏位置
.right-tool-bar {
  position: fixed;
  top: 0.6rem;
  right: 0.1rem;
  z-index: 2;

  .one-tool-bar {
    @include setBackground(0.32rem,
      0.34rem,
      "@/assets/images/right-tool-one-bar.png"
    );
    background-size: 100% 100%;
  }

  .two-tool-bar {
    box-sizing: border-box;
    padding-top:0.04rem;
    margin-bottom: 0.1rem;
    @include setBackground(0.32rem,
      0.72rem,
      "@/assets/images/right-tool-two-bar.png"
    );
    background-size: 100% 100%;
  }

  .four-tool-bar {
    box-sizing: border-box;
    padding-top:0.08rem;
    margin-top: 0.4rem;
    margin-bottom: 0.1rem;
    @include setBackground(0.32rem,
      1.48rem,
      "@/assets/images/right-tool-four-bar.png"
    );
    background-size: 100% 98%;
  }

  .icon-container {
    display: block;
    width: 100%;
    height: 0.32rem;
    @include flexLayout(center);
    @include setIconstyle();
  }

  .select-too-bar-bg {
    @include setBackground(0.32rem,
      0.32rem,
      "@/assets/images/item-checked-bg.png"
    );
  }
}
</style>