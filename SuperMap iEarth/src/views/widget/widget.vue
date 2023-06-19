<template>
  <div class="rightwidget">
    <n-space vertical align="center">
      <!-- <div class="oneItem">
        <div class="btn-bar" >
          <template #icon>
            <svg-icon class="bor-icon" name="ui-widget-search" />
          </template>
        </div>
      </div> -->
      <!-- 方向和重置 -->
      <div class="twoItem">
        <div
          class="btn-bar"
          @click="reduceCompass"
          :title="$t('global.w_north')"
        >
          <svg-icon class="bor-icon" name="ui-widget-north" id="compass_dom" />
        </div>
        <div class="btn-bar" @click="reset" :title="$t('global.w_reset')">
          <svg-icon class="bor-icon" name="ui-widget-reset" />
        </div>
      </div>
      <!-- 放大放小 -->
      <div class="twoItem">
        <div class="btn-bar" @click="zoomIn" :title="$t('global.w_zoomIn')">
          <svg-icon class="bor-icon" name="ui-widget-zoomIn" />
        </div>
        <div class="btn-bar" @click="zoomOut" :title="$t('global.w_zoomOut')">
          <svg-icon class="bor-icon" name="ui-widget-zoomOut" />
        </div>
      </div>
      <!-- 分析功能 -->
      <div class="fourItem">
        <div
          class="btn-bar"
          v-for="item in toolBarStore.rightToolBarData"
          :key="item.id"
          @click="rightSiderHander(item.id)"
          :class="
            item.id === state.currentItemIndex && item.isShow
              ? 'tool-item-bg'
              : ''
          "
          :title="$t(item.title)"
        >
          <!-- <svg-icon class="bor-icon" :name="item.iconName" /> -->
          <i class="iconfont" :class="item.iconName"></i>
        </div>
      </div>

      <!-- 全屏 -->
      <div class="oneItem">
        <div
          class="btn-bar"
          @click="fullScreen"
          :title="$t('global.w_fullScreen')"
        >
          <svg-icon class="bor-icon" name="ui-widget-fullScreen" />
        </div>
      </div>

      <!-- 首页 -->
      <!-- <div class="oneItem" v-if="IportalStore.isLogin">
        <div class="btn-bar" @click="goHome" :title="$t('global.w_home')">
          <svg-icon class="bor-icon" name="ui-widget-home" />
        </div>
      </div> -->
      <div class="oneItem">
        <i class="iconfont iconzhuye"></i>
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { getRootUrl } from "@/tools/iportal/portalTools";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
import { storeToRefs } from "pinia";
import { OptionType } from "./type";
import { reactive, watch } from "vue";
import { GlobalStoreCreate } from "@/store/global/global";
import { PanelStoreCreate } from "@/store/panel/panel";

const IportalStore = IportalStoreCreate();

// 侧边栏 功能分析
const toolBarStore = toolBarStoreCreate();
// const { toolShow, rightToolBarData } = storeToRefs(toolBarStore);

//
const GlobalStore = GlobalStoreCreate();
// const { currentLanguage } = storeToRefs(GlobalStore);

const panelStore = PanelStoreCreate();
// const { panelBgName } = storeToRefs(panelStore);

// 放大
function zoomIn() {
  let position = viewer.camera.position;
  let cameraHeight =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  let moveRate = cameraHeight / 20.0; // 参数可改
  viewer.camera.moveForward(moveRate);
}

//缩小
function zoomOut() {
  let position = viewer.camera.position;
  let cameraHeight =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  let moveRate = cameraHeight / 20.0; // 参数可改
  viewer.camera.moveBackward(moveRate);
}

// 复位：复位到指定位置
function reset() {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(104, 30, 25682725),
  });
}

// 全屏
function fullScreen() {
  if (Cesium.Fullscreen.fullscreen) {
    Cesium.Fullscreen.exitFullscreen();
  } else {
    Cesium.Fullscreen.requestFullscreen(document.body);
  }
}

//监听指北针转动
function listener() {
  let x = -Cesium.Math.toDegrees(viewer.scene.camera.heading);
  let degrees = "rotate(" + x + "deg)";
  let compass_dom: HTMLElement = document.getElementById(
    "compass_dom"
  ) as HTMLElement;
  compass_dom.style.transform = degrees;
}

let scratchWindowPosition: any;
function init() {
  if (!viewer) return;
  viewer.camera.changed.addEventListener(listener); //监听指北针转动
  scratchWindowPosition = new Cesium.Cartesian2(); //获取屏幕中心点
  scratchWindowPosition.x = viewer.scene.canvas.clientWidth / 2;
  scratchWindowPosition.y = viewer.scene.canvas.clientHeight / 2;
  viewer.scene.postRender.addEventListener(listener); //监听指北针转动
  window.addEventListener("resize", function () {
    scratchWindowPosition.x = viewer.scene.canvas.clientWidth / 2;
    scratchWindowPosition.y = viewer.scene.canvas.clientHeight / 2;
  });
}

init();

//指北针
function reduceCompass() {
  var scene = viewer.scene;
  var camera = scene.camera;

  var sscc = scene.screenSpaceCameraController;

  if (scene.mode == Cesium.SceneMode.MORPHING || !sscc.enableInputs) {
    return true;
  }
  if (viewer.navigationLocked) {
    return true;
  }
  if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW && !sscc.enableTranslate) {
    return;
  }
  if (
    scene.mode == Cesium.SceneMode.SCENE3D ||
    scene.mode == Cesium.SceneMode.COLUMBUS_VIEW
  ) {
    if (!sscc.enableLook) {
      return;
    }

    if (scene.mode == Cesium.SceneMode.SCENE3D) {
      if (!sscc.enableRotate) {
        return;
      }
    }
  }

  var center = scene.pickPosition(scratchWindowPosition);

  if (!Cesium.defined(center)) {
    // Globe is barely visible, so reset to home view.
    reset();
    return;
  }

  var cameraPosition = scene.globe.ellipsoid.cartographicToCartesian(
    camera.positionCartographic,
    new Cesium.Cartesian3()
  );

  var surfaceNormal = scene.globe.ellipsoid.geodeticSurfaceNormal(center);

  var focusBoundingSphere = new Cesium.BoundingSphere(center, 0);

  camera.flyToBoundingSphere(focusBoundingSphere, {
    offset: new Cesium.HeadingPitchRange(
      0,
      // do not use camera.pitch since the pitch at the center/target is required
      Cesium.Math.PI_OVER_TWO -
        Cesium.Cartesian3.angleBetween(surfaceNormal, camera.directionWC),
      // distanceToBoundingSphere returns wrong values when in 2D or Columbus view so do not use
      // camera.distanceToBoundingSphere(focusBoundingSphere)
      // instead calculate distance manually
      Cesium.Cartesian3.distance(cameraPosition, center)
    ),
    duration: 1.5,
  });
}

function goHome() {
  let homeUrl = getRootUrl();
  window.open(homeUrl);
}
// state类型定义
type toolbarType = {
  itemID: number | string;
  currentItemIndex: number;
  layerTreeShow: boolean;
};
// 初始化默认数据
let state = reactive<toolbarType>({
  itemID: 0,
  currentItemIndex: -1,
  layerTreeShow: false,
});

// 每个item的点击事件:切换动态组件；当为图层列表时还需改变SceneLayerChangeCount，以便刷新layerTree
// function rightSiderHander(item: OptionType, index: number) {
//   state.currentItemIndex = index;

//   if (item.name === "layerList") {
//     GlobalStore.SceneLayerChangeCount++;
//     state.layerTreeShow = !state.layerTreeShow;
//     return;
//   }
//   (panelBgName.value = item.name),
//     (panelStore.currentComponenentName = item.name);
//   panelStore.panelShow = true;

//   state.itemID = item.id;
// }

// -------------
function rightSiderHander(id: any) {
  state.currentItemIndex = id;
  toolBarStore.setToolBarShow(id, true);
}
</script>

<style lang="scss" scoped>
.rightwidget {
  position: fixed;
  top: 0.6rem;
  right: 0.1rem;
  z-index: $--Z-Index-Normal;
  cursor: pointer;

  .oneItem {
    // width: 0.34rem;
    // height: 0.34rem;
    // background: url("@/assets/imageWeb/widget/oneItem-bg.png");
    @include tool-background(
      0.34rem,
      0.34rem,
      "@/assets/imageWeb/widget/oneItem-bg.png"
    );
    margin-bottom: 0.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .twoItem {
    // width: 0.34rem;
    // height: 0.74rem;
    // background: url("@/assets/imageWeb/widget/twoItem-bg.png");
    @include tool-background(
      0.34rem,
      0.74rem,
      "@/assets/imageWeb/widget/twoItem-bg.png"
    );
    margin-bottom: 0.1rem;
  }

  .fourItem {
    // width: 0.32rem;
    // height: 1.48rem;
    // background: url("@/assets/imageWeb/widget/fourItem.png");
    @include tool-background(
      0.32rem,
      1.48rem,
      "@/assets/imageWeb/widget/fourItem.png"
    );
    margin-bottom: 0.1rem;
    padding-top: 0.05rem;
    box-sizing: border-box;
  }

  .btn-bar {
    width: 100%;
    height: 0.36rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .bor-icon {
      font-size: 0.14rem;
    }
  }
  .tool-item-bg {
    @include tool-background(
      100%,
      0.32rem,
      "@/assets/imageWeb/toolbar/item-checked-bg.png"
    );
  }
}
</style>