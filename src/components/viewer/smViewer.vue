<template>
  <div id="cesiumContainer" ref="viewer">
    <!-- 弹出属性框 -->

    <div id="bubble" class="bubble" v-show="buddleShow" v-drag>
      <div id="tools" style="text-align : right">
        <span class="closeBubble" @click="closeBubble">&times;</span>
      </div>
      <div style="overflow-y:auto;" id="tableContainer">
        <table id="tab" style="height: 100px;"></table>
      </div>
    </div>

    <!-- 工具选择组件 -->
    <tool-bar></tool-bar>
    <compass></compass>
    <china-epidemic-map></china-epidemic-map>
    <world-epidemic-map></world-epidemic-map>
    <init-echarts></init-echarts>
    <info-manage :isCreateScene="isCreateScene"></info-manage>
  </div>
</template>

<script>
//引入portal处理公共类
import { getRootUrl } from "../../common/js/portalTools";

import BaseSpecialEffectModels from "../../data/BaseSpecialEffectsData.js";
import InitEcharts from "../combinations/initecharts/initEcharts";
import InfoManage from "../combinations/infomanage/infoManage";
export default {
  name: "sm-viewer",
  components: { InfoManage, InitEcharts },
  props: {
    combination: {
      //组合接口
      type: Boolean
    },
    sceneUrl: {
      //场景接口
      type: String
    },
    s3mScps: {
      //s3m图层接口
      type: Array
    },
    collapsed: {
      //是否折叠
      type: Boolean
    }
  },
  data() {
    return {
      buddleShow: false,
      sharedState: store.state,
      isCreateScene: true
    };
  },
  computed: {
    isInitViewer: function() {
      return this.sharedState.isInitViewer;
    }
  },
  methods: {
    init() {
      //初始化viewer
      if (window.viewer) {
        return;
      }
      let that = this;

      let viewer;
      //天空盒，不能放在data里面
      this.BaseSpecialEffectModels = BaseSpecialEffectModels;
      this.getCreateOrEditScene();
      let isPCBroswer = (window.isPCBroswer = Cesium.FeatureDetection.isPCBroswer());
      let skyBoxRight = this.BaseSpecialEffectModels[1].skyBoxRight;
      let skyBoxLeft = this.BaseSpecialEffectModels[1].skyBoxLeft;
      let skyBoxFront = this.BaseSpecialEffectModels[1].skyBoxFront;
      let skyBoxBack = this.BaseSpecialEffectModels[1].skyBoxBack;
      let skyBoxUp = this.BaseSpecialEffectModels[1].skyBoxUp;
      let skyBoxDown = this.BaseSpecialEffectModels[1].skyBoxDown;
      if (isPCBroswer) {
        viewer = new Cesium.Viewer("cesiumContainer", {
          // contextOptions: {
          //   requestWebgl2: window.device == "iOS" ? false : true
          // },

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
          sources: {
            positiveX: skyBoxRight,
            negativeX: skyBoxLeft,
            positiveY: skyBoxFront,
            negativeY: skyBoxBack,
            positiveZ: skyBoxUp,
            negativeZ: skyBoxDown
          }
        });
        let initialSkyBox = function() {
          if (viewer.scene.frameState.passes.render) {
            wxSkyBox.update(viewer.scene.frameState, true);
            viewer.scene.postRender.removeEventListener(initialSkyBox);
          }
        };
        viewer.scene.postRender.addEventListener(initialSkyBox);
        this.BaseSpecialEffectModels[1].currentSky = wxSkyBox;
        this.BaseSpecialEffectModels[1].defaultSky = viewer.scene.skyBox;
      } else {
        viewer = new Cesium.Viewer("cesiumContainer", {
          // contextOptions: {
          //   requestWebgl2: window.device == "iOS" ? false : true
          // },

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
          function(e) {
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
        document.querySelector(".cesium-geocoder-input").placeholder =
          Resource.searchPlaceHolder;
      }
      viewer.camera.flyTo({
        // destination: new Cesium.Cartesian3(
        //   6788287.844465209,
        //   -41980756.10214644,
        //   29619220.04004376
        // ),
        destination: new Cesium.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        ),
        duration: 0,
        complete: function() {
          common.initHandler("Polygon"); //初始化全局常用的画面的drawhandler
          store.setToolBarShow(true); //显示工具栏

          // viewer.camera.flyTo({
          //   destination: new Cesium.Cartesian3.fromDegrees(
          //     110.60396458865515,
          //     34.54408834959379,
          //     30644793.325518917
          //   ),
          //   duration: 2,
          //   complete: function() {
          //     common.initHandler("Polygon"); //初始化全局常用的画面的drawhandler
          //     store.setToolBarShow(true); //显示工具栏
          //   }
          // });
          setTimeout(() => {
            document.getElementById("loadingbar").remove(); //移除加载动画
          }, 1000);
        }
      });

      store.setisInitViewer(true); //初始化viewer标志

      var infoboxContainer = document.getElementById("bubble");
      var table = document.getElementById("tab"); // 气泡内的表格

      let handlerClick = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handlerClick.setInputAction(function(e) {
        var selectedLyr = scene.layers.getSelectedLayer();
        if (selectedLyr && selectedLyr.indexedDBSetting) {
          selectedLyr.indexedDBSetting.isAttributesSave = true;
          var selectedFeature = viewer.selectedEntity;

          if (!selectedFeature) {
            /* 气泡相关 3/4 start */
            that.buddleShow = false;
            /* 气泡相关 3/4 end */
            return;
          }

          that.buddleShow = true;
          for (var i = table.rows.length - 1; i > -1; i--) {
            table.deleteRow(i);
          }

          selectedLyr
            .getAttributesById(selectedFeature.id)
            .then(function(data) {
              if (data) {
                var newRow = table.insertRow();
                var cell1 = newRow.insertCell();
                var cell2 = newRow.insertCell();
                cell1.innerHTML = "layerName";
                cell2.innerHTML = selectedLyr.name;
                for (let key in data) {
                  var newRow = table.insertRow();
                  var cell1 = newRow.insertCell();
                  var cell2 = newRow.insertCell();
                  cell1.innerHTML = key;
                  cell2.innerHTML = data[key];
                }
              } else {
                that.buddleShow = false;
              }
            });
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      //对接iport代码,登录功能
      if (window.store.systemConfig) {
        that.getSceneState("block");
      } else {
        // earth
        that.getSceneState("none");
      }
    },
    //关闭属性弹出框
    closeBubble() {
      this.buddleShow = false;
    },
    getSceneState(state) {
      document.getElementById("infoManageLogin").style.display = state;
      document.getElementById("storageInfo").style.display = state;

      //未登录
      let userInfo = window.store.portalUserprofile;
      if (!userInfo || userInfo.userName === "GUEST") {
        document.getElementById("storageInfo").style.display = "none";
      }
      //无权限
      if (window.store.portalUserprofile) {
        let iportalUpdateScene =
          window.store.portalUserprofile.modulePermissions;
        if (
          !iportalUpdateScene.includes(
            "portal:user:createUpdateDeleteScenes"
          ) &&
          !iportalUpdateScene.includes("*")
        ) {
          document.getElementById("storageInfo").style.display = "none";
        }
      }
    },
    getCreateOrEditScene() {
      //判断编辑场景还是创建场景
      let url = window.location.href;
      this.isCreateScene = url.indexOf("id=") === -1;
      // 模拟编辑场景模式，非创建
      // this.isCreateScene = false;
    }
  },
  mounted() {
    this.init();
    if (window.location.search === "?theme=wind") {
      store.setSpecialEffects(4, 1);
    }
  }
};
</script>
<style lang="scss"  scoped>
@import "smViewer";
</style>
