<template>
  <div id="superMapContainer"></div>
  <!-- 底部信息条 -->
  <FootInfoBar></FootInfoBar>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { loadAsyncComponent } from "@/utils/index";
import { useLayerStore } from "@/store/layerStore/layer";
import EventManager from "@/tools/ScreenEventManage/EventManager.js";
import openScene from "@/tools/openScene";
import iEarthTool from "@/lib/iEarthTool";

// 导入配置
import getConfig from "@/tools/getConfig";

// 导入组件:需要异步导入,否则初始化会报错
const FootInfoBar = loadAsyncComponent(() => import("./foot-info.vue"));
const layerStore = useLayerStore();

window.iEarthTool = iEarthTool; // 常用工具，绑定到window方便调试
window.iEarthBindData = {
  tokenConfig: window.tokenConfig, // 必应底图和天地图token
  Particle:{}, // 粒子系统
  ParticleOptions:{}, // 粒子选项
  BaseMapOption:undefined, // 设置默认底图
  CurrentS3MLayerName:undefined, // 图层列表当前选择的S3M图层名字
  CurrentIMGLayerName:undefined, // 图层列表当前选择的影像图层名字
  CurrentMVTStyleLayerSourceName:"", // 图层列表当前选择的MVT样式子图层的source
  layerQueryOptions:[], // 对S3M图层进行属性查询走数据服务的相关配置包括URL数据源名称等
  mapQueryOptions:[],// 地图查询相关资源相关保存
  EnvironmentMode:'Normal', // iEarth当前所处的环境模式：Normal普通环境，iPortal环境
  mediaResourceOptions:{},
  bubbleFields:undefined, // DB属性查询过滤字段 
  originParam:{},
  iPortalToken:'', // 在iPortal中申请的Token令牌
  // iPortalTokenLocal: "qywM11WA_H5Tr8f0WPl0ZmOXsTeri-nxJmRql84AzxvR7-q7zGgM3pvIC0m-HexA5oGXEo_PjFUkQ5tl59co0hXx", // 模拟本机iPortal开发: 支持中心的iPortal，令牌一年
  // iPortalTokenLocal: "JT6D6c6Tz7YtzaloPJANS5ywaHC798uPuElCw4ZbsoTDu9mltSwhU0c19iIYtboGo0Wh5n4lTqmvrFkU-hIRQfYgymiNTQd-fYxzHT2T", // 模拟本机iPortal开发: 我的iPortal，令牌一年
};

let viewer: any;

onMounted(() => {
  initViewer();
});

onBeforeUnmount(() => {
  viewer.destroy();
});

// 获取token和key相关配置
getConfig().then((res) => {
  computedEnvironmentMode();
},(err) => {
  console.log(err);
  computedEnvironmentMode(); // 确保无论如何都能打开场景
});

// 获取当前环境：普通环境、Online、iPortal(创建 || 编辑)
function computedEnvironmentMode() {
  const href = window.location.href;

  if(href.includes("/apps")){
    if(href.includes("/iportal")){
      window.iEarthBindData.EnvironmentMode = "iPortal";
    }else if(href.includes("supermapol")){
      window.iEarthBindData.EnvironmentMode = "Online";
    }else if(href.includes("cyclone")){
      window.iEarthBindData.EnvironmentMode = "Cyclone";
    }else{
      console.log('未知环境');
      window.iEarthBindData.EnvironmentMode = "Normal";
    }

    if(window.iEarthBindData.EnvironmentMode != "Normal"){
      if(href.includes("id=")){
        window.iEarthBindData.EnvironmentMode += "-EditScene";
        setTimeout(() => {
          openScene.openExistScene();
        }, 500);
      }else{
        window.iEarthBindData.EnvironmentMode += "-CreateScene";
      }
    }

  }else{ // 普通环境，比如官网和本地使用
    window.iEarthBindData.EnvironmentMode = "Normal";
  }
}

//初始化viewer
function initViewer() {
  viewer = new SuperMap3D.Viewer("superMapContainer", {
    contextOptions: { // 开启Webgl2.0
      //硬件反走样，1-8，默认值为1
      msaaLevel: window.initViewerConfig.msaaLevel,
      requestWebgl2: window.initViewerConfig.requestWebgl2,
      maxDrawingBufferWidth: window.initViewerConfig.maxDrawingBufferWidth,
      maxDrawingBufferHeight: window.initViewerConfig.maxDrawingBufferHeight,
    },
    useSuperMapOIT: window.customConfig.useSuperMapOIT, // 新版OIT
    orderIndependentTranslucency: window.customConfig.orderIndependentTranslucency, // 老版OIT
    targetFrameRate: window.customConfig.targetFrameRate, // 锁帧
    timeline: true,
    baseLayerPicker: false,
    // imageryProvider: false, // 关闭默认球皮
    navigation: false, // 罗盘
    animation: false, // 动画小组件
    infoBox: false, // 信息框
    shadows: false, //不能开启
    pcss: true, // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
    shadowQuality: 0,
    creditContainer: document.createElement("div"), //去掉底部logo
  });

  // iEarth打通AI,监听iFrame元素的postMessage事件
  if (window.AIFunction) {
    const aiFunction = new window.AIFunction(viewer);
    aiFunction.startListenIFramePostMessage();
  }

  // 其他设置
  window["viewer"] = viewer; //绑定到window
  window["scene"] = viewer.scene; //绑定到window
  viewer.eventManager = new EventManager(viewer); //添加屏幕事件管理
  viewer.resolutionScale = window.devicePixelRatio; // 设置渲染分辨率的缩放因子
  viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测
  // viewer.scene.globe.baseColor = SuperMap3D.Color.BLACK; // 没有影像图层时地球的底色

  if(window.iEarthCustomFunc && window.iEarthCustomFunc.afterViewerInit){
    window.iEarthCustomFunc.afterViewerInit(viewer);
  }

  // 隐藏时间线控件
  let timelineDom: any = document.getElementsByClassName(
  "supermap3d-viewer-timelineContainer"
  )[0];
  timelineDom.style.visibility = "hidden";

  // // 设置影像球皮
  // const earthSkinImgLayer = viewer.imageryLayers.addImageryProvider(
  //   new SuperMap3D.SingleTileImageryProvider({
  //     url: "./images/earth-skin2.jpg",
  //   })
  // );
  // earthSkinImgLayer.brightness = 0.8; // > 1.0 增加亮度  < 1.0减少亮度
  // earthSkinImgLayer.contrast = 1.3; // 图层对比度 > 1 增加   < 1 减少

  // 设置雾气初始化颜色: 默认为黑色(0,0,0,1),iEarth初始化时改完白色
  viewer.scene.fog.color = SuperMap3D.Color.fromCssColorString("rgba(255,255,255,1)");

  // 帧率控件
  viewer.scene.debugShowFramesPerSecond = window.customConfig.isDisplayFrameRate ? true : false;

  // 获取场景参数默认值
  getOriginParam(viewer, window.iEarthBindData.originParam)
  function getOriginParam(viewer, originParam){
    if(!(viewer instanceof SuperMap3D.Viewer)) return;
    const scene = viewer.scene;
    // 获取体积云初始化默认值
    if(scene.volumetricClouds){
      const volumetricClouds = scene.volumetricClouds;
      originParam.volumetricCloud = {
        cirrusEnabled: volumetricClouds.cirrusEnabled, // 是否显示高层云
        quality: volumetricClouds.quality, // 渲染质量
        thickness: volumetricClouds.thickness, // 云层厚度
        densityMultiplier: volumetricClouds.densityMultiplier, // 云层密度
        lowestCloudAltitude: volumetricClouds.lowestCloudAltitude, // 云层底部高度
        shapeCoverage: volumetricClouds.shapeCoverage, // 云层覆盖度
        windSpeed: volumetricClouds.windSpeed, // 风速
        windHeading: volumetricClouds.windHeading, // 风向
      }
    }
  }
  // 监听键盘按键
  document.addEventListener("keyup", function (event) {
    let char = String.fromCharCode(event.which);
    if (char == 'q') { // F2按键字符：相机定位
      console.log('点击F2按键，定位至配置文件中指定位置');
      let position = window.customConfig.f2_cameaPosition;
      window.iEarthTool.openCamera(position);
    }else if(char == ''){ // Esc按键字符：释放所有图层选择集
      viewer.scene.layers.layerQueue.forEach(s3mLayer => {
        if(s3mLayer) s3mLayer.releaseSelection();
      });
    }
  });

  // 支持初始化时打开预设场景配置文件
  window.layerTreeData = layerStore.layerTreeData; // 避免保存场景时报错
  if (window.customConfig && window.customConfig.useAutoOpenPresetScene  && !window.location.href.includes("id=")) {
    setTimeout(() => {
      let href = window.location.href;
      let jsonUrl = '';
      if (href.includes('index.html')) {
        jsonUrl = href.replace('index.html', 'config/presetSceneConfig.json');
      } else {
        jsonUrl = href + 'config/presetSceneConfig.json';
      }
      window.axios.get(jsonUrl)
        .then(response => {
          if(!response) return;
          let data = response.data;
          if(!data) return;
          console.log("预设场景JSONData:", data);

          // 计算sceneInfo
          let sceneInfo: any = undefined;
          if (data.content) {
            const content = (typeof data.content === 'string') ? JSON.parse(data.content) : data.content; // iportal中保存的content格式为string
            sceneInfo = content.sceneInfo;
          } else {
            sceneInfo = data;
          }
          if (!sceneInfo) return;

          // 计算layerTreeData
          let layerTreeData: any = undefined;
          if (data.content && data.content.layerTreeData) {
            layerTreeData = data.content.layerTreeData
          }

          // 计算bindiEarthData
          let bindiEarthData: any = undefined;
          if (data.content && data.content.bindiEarthData) {
            bindiEarthData = data.content.bindiEarthData
          }

          // 统一处理场景内容绑定数据等操作
          openScene.handleSceneContent({
            sceneInfo: sceneInfo,
            layerTreeData: layerTreeData,
            bindiEarthData: bindiEarthData
          });
        })
        .catch(error => {
          console.log(error);
        });
    }, 500)
  }
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
