<template>
  <div id="superMapContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, watch,reactive } from "vue";
import EventManager from "@/tools/ScreenEventManage/EventManager.js";
import { GlobalStoreCreate } from '@/store/global/global';
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { storeToRefs } from 'pinia';
import openScene from "./openScene"

const IportalStore = IportalStoreCreate();
const GlobalStore = GlobalStoreCreate();
const { isViewer } = storeToRefs(GlobalStore);

onMounted(() => initViewer());
// 这里如果弹窗是直接打开的会有问题
// setTimeout(() => {
//   initViewer();
// }, 500);

//初始化地球
let viewer;
function initViewer() {
  viewer = new SuperMap3D.Viewer("superMapContainer", {
    // selectionIndicator: false,
    timeline:true,
    baseLayerPicker: false,
    // infoBox: false,
    imageryProvider: false, //必须为false - 关闭默认球皮（影像图层）
    navigation: false,
    animation: false, // 动画小组件
    // fullscreenButton: true, // 全屏组件
    // vrButton: true, // VR模式
    // geocoder: true, // 地理编码（搜索）组件
    // homeButton: true, // 首页，点击之后将视图跳转到默认视角
    infoBox: false, // 信息框
    // baseLayerPicker: true, // 底图组件，选择三维数字地球的底图（imagery and terrain）。
    // selectionIndicator: true, //是否显示选取指示器组件
    // navigationHelpButton: true, // 帮助提示，如何操作数字地球。
    // // 如果最初应该看到导航说明，则为true；如果直到用户明确单击该按钮，则该提示不显示，否则为false。
    // navigationInstructionsInitiallyVisible: true,
    // sceneModePicker: true, // 场景模式，切换2D、3D 和 Columbus View (CV) 模式。
  });
  // 太阳光默认打开
  // viewer.scene.globe.enableLighting = true;
  // 隐藏时间线控件
  let timelineDom: any = document.getElementsByClassName(
    "supermap3d-viewer-timelineContainer"
  )[0];
  timelineDom.style.visibility = "hidden";

  // 隐藏底部标签
  // viewer.cesiumWidget.creditContainer.style.display = 'none'
  // 设置渲染分辨率的缩放因子
  viewer.resolutionScale = window.devicePixelRatio;
  // 其他设置
  window["viewer"] = viewer; //绑定到window
  GlobalStore.isViewer = true; // viewer初始化完成标志
  viewer.eventManager = new EventManager(viewer); //添加屏幕事件管理
  viewer.scene.globe.baseColor = SuperMap3D.Color.BLACK; // 没有影像图层时地球的底色
  if (viewer.geocoder) {
    // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
    viewer.geocoder.viewModel.geoKey = "fvV2osxwuZWlY0wJb8FEb2i5";
  }

  // 设定项目当前时间
  viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(
    new Date(2023, 3, 20, 12)
  );

  // 更换球皮
  let earthSkinImgLayer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SingleTileImageryProvider({
      // url: '/images/view/earth-skin.jpg'
      // url: "./images/view/earth-skin.jpg",
      url: "./images/earth-skin.jpg",
    })
  );

  // 设置皮肤，影像图层的效果
  // console.log("EventManager:",EventManager)
  // earthSkinImgLayer.brightness = 0.5; // > 1.0 增加亮度  < 1.0减少亮度
  earthSkinImgLayer.contrast = 1.28; // 图层对比度 > 1 增加   < 1 减少
  // earthSkinImgLayer.hue = 0.5 // 图层色调。值为0.0表示使用原图。
  earthSkinImgLayer.saturation = 0.8; // 图层饱和度 > 1 增加   < 1 减少
  // earthSkinImgLayer.gamma = 0.5 // 图层伽马校正。值为1.0表示使用原图。

  // 先加载场景进行测试
  // viewer.scene.open(
  //   "http://www.supermapol.com/realspace/services/3D-CBDCache20200416/rest/realspace"
  // );

  // 获取当前环境：创建 || 编辑  or 非iportal环境（普通环境）
  function getCreateOrEditScene() {
    let url = window.location.href;

    // 判断是否为iportal环境
    if(url.indexOf("/iportal/apps") === -1) {
      console.log("当前环境：普通模式");
      return;
    }

    //判断编辑模式还是创建模式
    if (url.indexOf("id=") === -1) {
      IportalStore.isCreateScene = true;
      console.log("当前环境：IPortal-创建模式");
    } else {
      IportalStore.isCreateScene = false;
      GlobalStore.isEditMode = true;
      console.log("当前环境：IPortal-编辑模式");

      openScene.openExistScene();
    }
  }
  getCreateOrEditScene();
  //viewer 初始化完成的监听 - 不起作用不知道为啥
  watch(isViewer, val => {
    if (val) getCreateOrEditScene();
  });

}

// 销毁
onBeforeUnmount(() => {
  viewer.destroy();
});
</script>

<style lang="scss" scoped>
#superMapContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

