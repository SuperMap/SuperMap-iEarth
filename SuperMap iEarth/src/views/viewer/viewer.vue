<template>
  <div id="superMapContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { GlobalStoreCreate } from "@/store/global/global";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { useLayerStore } from "@/store/layerStore/layer";
import EventManager from "@/tools/ScreenEventManage/EventManager.js";
import layerManagement from "@/tools/layerManagement";
import openScene from "./openScene";

// 导入配置
import getConfig from "@/tools/getConfig";
import getIPortalSceneInfo from "@/tools/getIPortalSceneInfo";

const IportalStore = IportalStoreCreate();
const GlobalStore = GlobalStoreCreate();
const layerStore = useLayerStore();
window.EarthGlobal = {};

let viewer: any;

onMounted(() => {
  // getCreateOrEditScene();
  initViewer();
});

onBeforeUnmount(() => {
  viewer.destroy();
});

// 获取token和key相关配置
getConfig().then((res) => {
  if (window.iEarthConsole) console.log("当前configToken配置:", res);
  getCreateOrEditScene();
},(err) => {
  console.log(err);
  getCreateOrEditScene(); // 确保无论如何都能打开场景
});

// 获取当前环境：创建 || 编辑  or 非iportal环境（普通环境）
function getCreateOrEditScene() {
  let url = window.location.href;

  // 判断当前环境：普通、iportal、online
  if (url.indexOf("/apps") === -1) {
    if (window.iEarthConsole) console.log("当前环境：普通环境");
    GlobalStore.isNormalMode = true;
    return;
  } else if (url.indexOf("/iportal") != -1) {
    if (window.iEarthConsole) console.log("当前环境：iPortal环境");
  } else if (window.location.host.includes("supermapol")) {
    if (window.iEarthConsole) console.log("当前环境：Online环境");
  }

  //判断当前模式：创建模式、编辑模式
  if (url.indexOf("id=") === -1) {
    IportalStore.isCreateScene = true;
    if (window.iEarthConsole) console.log("当前模式：创建模式");
    GlobalStore.isNormalMode = false;
  } else {
    IportalStore.isCreateScene = false;
    GlobalStore.isEditMode = true;
    if (window.iEarthConsole) console.log("当前模式：编辑模式");
    GlobalStore.isNormalMode = false;
    setTimeout(() => {
      openScene.openExistScene();
    }, 500);
  }
}

//初始化viewer
function initViewer() {
  viewer = new SuperMap3D.Viewer("superMapContainer", {
    // contextOptions: { // 开启Webgl2.0
    //   //硬件反走样，1-8，默认值为1
    //   msaaLevel: 8,
    //   requestWebgl2: true
    // },
    timeline: true,
    baseLayerPicker: false,
    imageryProvider: false, //必须为false - 关闭默认球皮（影像图层）
    navigation: false, // 罗盘
    animation: false, // 动画小组件
    infoBox: false, // 信息框
    shadows: false, //不能开启
    pcss: true, // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
    shadowQuality: 0,
    creditContainer: document.createElement("div"), //去掉底部logo
  });

  // 获取iportal中保存的场景模式：平面 or 三维
  getIPortalSceneInfo().then((res) => {
    if (window.iEarthConsole) console.log("场景模式:", res);
    if (Number(res) == 1) {
      viewer.scene.mode = SuperMap3D.SceneMode.COLUMBUS_VIEW; // 平面场景
      viewer.camera.flyTo({
        destination: new SuperMap3D.Cartesian3.fromDegrees(
          1.6268196911251191,
          8.156654717721203,
          30763418.112337016
        ),
        duration: 0,
      });
    } else {
      viewer.scene.mode = SuperMap3D.SceneMode.SCENE3D; // 三维场景
      viewer.camera.flyTo({
        destination: new SuperMap3D.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        ),
        duration: 0,
      });
    }
  });

  // 隐藏时间线控件
  let timelineDom: any = document.getElementsByClassName(
    "supermap3d-viewer-timelineContainer"
  )[0];
  timelineDom.style.visibility = "hidden";

  // 其他设置
  window["viewer"] = viewer; //绑定到window
  GlobalStore.isViewer = true; // viewer初始化完成标志
  viewer.eventManager = new EventManager(viewer); //添加屏幕事件管理
  viewer.resolutionScale = window.devicePixelRatio; // 设置渲染分辨率的缩放因子
  viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测
  viewer.scene.globe.baseColor = SuperMap3D.Color.BLACK; // 没有影像图层时地球的底色
  if (viewer.geocoder) {
    viewer.geocoder.viewModel.geoKey = "fvV2osxwuZWlY0wJb8FEb2i5"; // 官网申请Key
  }

  // 设定项目当前时间 - 强制设置时间后，平面场景会发黑
  viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(
    new Date(2023, 3, 20, 12)
  );

  // 设置环境光
  viewer.scene.lightSource.ambientLightColor = new SuperMap3D.Color(
    0.65,
    0.65,
    0.65,
    1
  );

  // 更换球皮
  let earthSkinImgLayer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SingleTileImageryProvider({
      url: "./images/earth-skin2.jpg",
    })
  );

  // 设置皮肤，影像图层的效果
  earthSkinImgLayer.brightness = 0.8; // > 1.0 增加亮度  < 1.0减少亮度
  earthSkinImgLayer.contrast = 1.3; // 图层对比度 > 1 增加   < 1 减少

  // 设置场景
  setTimeout(() => {
    // 云层
    let cloudBoxUrl = "./images/sceneProperties/clouds/clouds1.png";
    let cloudBox = new SuperMap3D.CloudBox({ url: cloudBoxUrl });
    if (layerStore.sceneAttrState.cloudLayer) {
      viewer.scene.cloudBox = cloudBox;
    } else {
      viewer.scene.cloudBox = null;
    }

    // 天空盒
    if (layerStore.sceneAttrState.skyBoxShow) {
      layerManagement.setSkyBox(true);
    } else {
      layerManagement.setSkyBox(false);
    }

    layerStore.setSceneAttr(layerStore.sceneAttrState);

    viewer.scene.skyBox.show = true; // 星空背景
  }, 1000);
}
</script>

<style lang="scss" scoped>
#superMapContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
