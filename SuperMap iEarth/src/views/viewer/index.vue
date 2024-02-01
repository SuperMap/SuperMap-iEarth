<template>
  <div id="superMapContainer"></div>

  <!-- 新版表格弹窗 - s3m图层列表:属性查询 -->
  <!-- <div id="bubbleNew" class="bubble" style="bottom:0;left:82%;" v-show="layerStore.isDisplayBubble">
      <div id="tools" style="text-align : right">
          <span  style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">对象属性</span>
          <span  class="fui-cross" title="关闭" id="close" style="color: darkgrey;padding:5px"></span>
      </div>
      <div style="overflow-y:scroll;height:150px" id="tableContainer"><table id="tab"></table></div>
  </div>  -->
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import EventManager from "@/tools/ScreenEventManage/EventManager.js";
import { GlobalStoreCreate } from '@/store/global/global';
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { useLayerStore } from "@/store/layerStore";
import openScene from "./openScene"
import layerManagement from "@/tools/layerManagement";
// 导入配置
import getConfig from '@/tools/getConfig'
import getIPortalSceneInfo from '@/tools/getIPortalSceneInfo'
import { number } from "echarts/core";

const IportalStore = IportalStoreCreate();
const GlobalStore = GlobalStoreCreate();
const layerStore = useLayerStore();
window.EarthGlobal = {};
let viewer: any;

onMounted(() => {
  initViewer();
  // getIPortalSceneInfo().then(res => {
  //   initViewer(res); // 有问题，layout初始化遇到viewer未定义相关问题
  // })
});

// 获取token和key相关配置
getConfig().then(res => {
  console.log("当前configToken配置:", res);
});

//初始化viewer
function initViewer() {
  viewer = new SuperMap3D.Viewer("superMapContainer", {
    timeline: true,
    baseLayerPicker: false,
    imageryProvider: false, //必须为false - 关闭默认球皮（影像图层）
    navigation: false,
    animation: false, // 动画小组件
    infoBox: false, // 信息框
    //开启Webgl2.0
    // contextOptions: {
    //   //硬件反走样，1-8，默认值为1
    //   msaaLevel: 8,
    //   requestWebgl2: true
    // },
    //不能开启
    shadows: false,
    // timeline: true,
    //  UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
    pcss: true,
    shadowQuality: 0,
    creditContainer: document.createElement('div'), //去掉底部logo
  });

  // 获取iportal中保存的场景模式：平面 or 三维
  getIPortalSceneInfo().then(res => {
    console.log("场景模式:",res);
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
  })

  // 隐藏时间线控件
  let timelineDom: any = document.getElementsByClassName(
    "supermap3d-viewer-timelineContainer"
  )[0];
  timelineDom.style.visibility = "hidden";


  // 其他设置
  window["viewer"] = viewer; //绑定到window
  GlobalStore.isViewer = true; // viewer初始化完成标志
  viewer.eventManager = new EventManager(viewer); //添加屏幕事件管理
  viewer.resolutionScale = window.devicePixelRatio;
  viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测
  viewer.scene.globe.baseColor = SuperMap3D.Color.BLACK; // 没有影像图层时地球的底色
  if (viewer.geocoder) {
    // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
    viewer.geocoder.viewModel.geoKey = "fvV2osxwuZWlY0wJb8FEb2i5";
  }

  // 设定项目当前时间
  viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(
    new Date(2023, 3, 20, 12)
  );

  // 设置环境光
  viewer.scene.lightSource.ambientLightColor = new SuperMap3D.Color(0.65,0.65,0.65,1);
  
  // 更换球皮
  let earthSkinImgLayer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SingleTileImageryProvider({
      url: "./images/earth-skin.jpg",
    })
  );


  // 开启太阳 - 开启太阳有时候会导致一些场景加载不出来，比如http://10.10.4.90:8090/iserver/services/3D-Mine_Minerales3DV2/rest/realspace
  // viewer.scene.globe.enableLighting = true;

  // layerManagement.setSkyBox(true);

  // 设置皮肤，影像图层的效果
  // earthSkinImgLayer.brightness = 0.5; // > 1.0 增加亮度  < 1.0减少亮度
  earthSkinImgLayer.contrast = 1.28; // 图层对比度 > 1 增加   < 1 减少
  // earthSkinImgLayer.hue = 0.5 // 图层色调。值为0.0表示使用原图。
  earthSkinImgLayer.saturation = 0.8; // 图层饱和度 > 1 增加   < 1 减少
  // earthSkinImgLayer.gamma = 0.5 // 图层伽马校正。值为1.0表示使用原图。


  // 获取当前环境：创建 || 编辑  or 非iportal环境（普通环境）
  function getCreateOrEditScene() {
    let url = window.location.href;

    // 判断当前环境：普通、iportal、online
    if (url.indexOf("/apps") === -1) {
      console.log("当前环境：普通环境");
      GlobalStore.isNormalMode = true;
      return;
    } else if (url.indexOf('/iportal') != -1) {
      console.log("当前环境：iPortal环境");
    } else if (window.location.host.includes('supermapol')) {
      console.log("当前环境：Online环境");
    }

    //判断当前模式：创建模式、编辑模式
    if (url.indexOf("id=") === -1) {
      IportalStore.isCreateScene = true;
      console.log("当前模式：创建模式");
      GlobalStore.isNormalMode = false;
    } else {
      IportalStore.isCreateScene = false;
      GlobalStore.isEditMode = true;
      console.log("当前模式：编辑模式");
      GlobalStore.isNormalMode = false;
      setTimeout(()=>{
        openScene.openExistScene();
      },500)
    }
  }
  getCreateOrEditScene();

  // 设置场景
  setTimeout(() => {
    // 云层
    let cloudBoxUrl = './images/sceneProperties/clouds/clouds1.png';
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

  }, 1000)
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
  // overflow: hidden;
}
</style>

