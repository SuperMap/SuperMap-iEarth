<template>
  <div id="cesiumContainer" ref="viewer">
    <!-- 工具选择组件 -->
    <tool-bar></tool-bar>
    <compass></compass>
    <china-epidemic-map></china-epidemic-map>
    <world-epidemic-map></world-epidemic-map>
    <init-echarts></init-echarts>
    <info-manage></info-manage>
  </div>
</template>

<script>
import BaseSpecialEffectModels from '../../data/BaseSpecialEffectsData.js';
import InitEcharts from "../combinations/initecharts/initEcharts";
import InfoManage from "../combinations/infomanage/infoManage";
export default {
  name: "sm-viewer",
  components: {InfoManage, InitEcharts},
  props: {
    combination: {
      //组合接口
      type: Boolean,
    },
    sceneUrl: {
      //场景接口
      type: String,
    },
    s3mScps: {
      //s3m图层接口
      type: Array,
    },
    collapsed: {
      //是否折叠
      type: Boolean,
    },
  },
  data() {
    return {
      sharedState: store.state,
      BaseSpecialEffectModels:BaseSpecialEffectModels
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
  },
  methods: {
    init() {
      //初始化viewer
      if (window.viewer) {
        return;
      }
      let viewer;
      let isPCBroswer =window.isPCBroswer = Cesium.FeatureDetection.isPCBroswer();
      let skyBoxRight = this.BaseSpecialEffectModels[1].skyBoxRight;
      let skyBoxLeft = this.BaseSpecialEffectModels[1].skyBoxLeft;
      let skyBoxFront = this.BaseSpecialEffectModels[1].skyBoxFront;
      let skyBoxBack = this.BaseSpecialEffectModels[1].skyBoxBack;
      let skyBoxUp = this.BaseSpecialEffectModels[1].skyBoxUp;
      let skyBoxDown = this.BaseSpecialEffectModels[1].skyBoxDown;
      if (isPCBroswer) {
        viewer = new Cesium.Viewer("cesiumContainer", {
          selectionIndicator: false,
          timeline: true,
          baseLayerPicker: false,
          infoBox: false,
          geocoder: true,
          navigation: false
        });
        viewer.scene.moon.show = false;
        document.getElementsByClassName(
          "cesium-viewer-timelineContainer"
        )[0].style.visibility = "hidden"; //隐藏时间线控件
         viewer.scene.globe.enableLighting = false;
         let wxSkyBox = new Cesium.SkyBox({
           sources:{
             positiveX:skyBoxRight,
             negativeX:skyBoxLeft,
             positiveY: skyBoxFront,
             negativeY:skyBoxBack ,
             positiveZ:skyBoxUp,
             negativeZ:skyBoxDown
           }
         });
         let initialSkyBox = function(){
             if(viewer.scene.frameState.passes.render){
               wxSkyBox.update(viewer.scene.frameState,true);
               viewer.scene.postRender.removeEventListener(initialSkyBox);
             }
         };
         viewer.scene.postRender.addEventListener(initialSkyBox);
         this.BaseSpecialEffectModels[1].currentSky = wxSkyBox;
         this.BaseSpecialEffectModels[1].defaultSky = viewer.scene.skyBox;
      } else {
        viewer = new Cesium.Viewer("cesiumContainer", {
          selectionIndicator: false,
          infoBox: false,
          skyBox: false,
          navigation: false
        });
        let scene = viewer.scene;
        if (Cesium.defined(scene.sun)) {
          scene.globe.enableLighting = false;
        }
        if (Cesium.defined(scene.moon)) {
          scene.moon.show = false;
        }
        document.documentElement.style.height = window.innerHeight + "px";
        document.addEventListener(
          "touchmove",
          function (e) {
            e.preventDefault();
          },
          false
        );
        store.setCompass(false); //关闭罗盘等
      }
      window.viewer = viewer;
      window.scene = viewer.scene;
      let widget = viewer.cesiumWidget;
      // iEarth进行初始化设置
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.globe.baseColor = Cesium.Color.BLACK; // 没有影像图层时地球的底色
      if (viewer.geocoder) {
        // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
        viewer.geocoder.viewModel.geoKey = "fvV2osxwuZWlY0wJb8FEb2i5";
        document.querySelector(".cesium-geocoder-input").placeholder = Resource.searchPlaceHolder
      }
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(
          6788287.844465209,
          -41980756.10214644,
          29619220.04004376
        ),
        duration: 0,
        complete: function () {
          viewer.camera.flyTo({
            destination: new Cesium.Cartesian3.fromDegrees(
              110.60396458865515,
              34.54408834959379,
              30644793.325518917
            ),
            duration: 5,
            complete: function () {
              common.initHandler("Polygon"); //初始化全局常用的画面的drawhandler
              store.setToolBarShow(true); //显示工具栏
            },
          });
          setTimeout(() => {
            document.getElementById("loadingbar").remove(); //移除加载动画
          }, 1000);
        }
      });
      store.setisInitViewer(true); //初始化viewer标志

      //对接iport代码
      let that = this;
      let systemJSONUrl = this.getRootUrl()+ "web/config/system.json";
      Cesium.loadJson(systemJSONUrl).then(function(jsonData){
        if (jsonData && !jsonData.isSuperMapOL){ // iportal
            that.getSceneState("block");
            that.getIportalConfig();
        } else if (jsonData && jsonData.isSuperMapOL){ // online
          that.getSceneState("block");
        } else { // earth
          that.getSceneState("none");
        }
      }).otherwise(function(e){ // earth
        that.getSceneState("none");
      })
    },
    getRootUrl () {
        const path = '/apps';
        let url = '';
        if (window.location.href.indexOf(path) !== -1) {
            url = window.location.href.substring(0, window.location.href.indexOf(path) + 1);
        }
        if (!url) {
         if (location.href.indexOf('/iportal/') !== -1) {
           url = `${location.protocol}//${location.host}/iportal/`;
         } else {
            url = `${location.protocol}//${location.host}/`;
        }
      }
        return url;
    },
    getSceneState(state){
      document.getElementById("infoManageLogin").style.display = state;
      document.getElementById("storageInfo").style.display = state;
    },
    getIportalConfig(){
      let portalConfigUrl = this.getRootUrl()+ "web/config/portal.json";
      Cesium.loadJson(portalConfigUrl).then(function(data){
        window.store.portalConfig = data;
      }).otherwise(function(e){
          console.log(e);
      })
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss"  scoped>
@import "smViewer";
</style>
