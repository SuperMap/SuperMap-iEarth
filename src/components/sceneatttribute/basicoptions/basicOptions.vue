<template>
  <div class="sm-function-module-content" v-show="basicOptions">
    <div class="basicflexbox">
      <input type="checkbox" v-model="earthShow" />
      <label class="labelbox">{{Resource.earth}}</label>
      <input type="checkbox" v-model="shadowMap" />
      <label class="labelbox">{{Resource.shadowMap}}</label>
      <input type="checkbox" v-model="sunShow" />
      <label class="labelbox">{{Resource.sun}}</label>
    </div>
    <div class="basicflexbox">
      <input type="checkbox" v-model="depthAgainst" />
      <label class="labelbox">{{Resource.depthAgainst}}</label>
      <input type="checkbox" v-model="atomsphereRender" />
      <label class="labelbox">{{Resource.skyAtmosphereEffect}}</label>
      <input type="checkbox" v-model="fogEffect" />
      <label class="labelbox">{{Resource.fogEffect}}</label>
    </div>
    <div class="basicflexbox">
      <input type="checkbox" v-model="cloud" >
      <label class="labelbox">{{Resource.cloud}}</label>
      <input type="checkbox" v-model="skyBox" >
      <label class="labelbox">{{Resource.skyBox}}</label>
      <input type="checkbox" v-model="timeline" />
      <label class="labelbox">{{Resource.timeline}}</label>
    </div>
    <div class="basicflexbox">
      <input type="checkbox" v-model="showFrameState">
      <label class="labelbox">{{Resource.showFrame}}</label>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.brightness}}</label>
      <div class="sm-solider-input-box" style="width:80%">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
          type="range"
          v-model="brightness"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:25%;border-radius:3px;"
          type="number"
          v-model="brightness"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.contrast}}</label>
      <div class="sm-solider-input-box" style="width:80%">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
          type="range"
          v-model="contrast"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:25%;border-radius:3px;"
          type="number"
          v-model="contrast"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.hue}}</label>
      <div class="sm-solider-input-box" style="width:80%">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
          type="range"
          v-model="hue"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:25%;border-radius:3px;"
          type="number"
          v-model="hue"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.saturation}}</label>
      <div class="sm-solider-input-box" style="width:80%">
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
          type="range"
          v-model="saturation"
        />
        <input
          class="min-solider"
          min="0"
          max="3"
          step="0.02"
          style="width:25%;border-radius:3px;"
          type="number"
          v-model="saturation"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.queryCoordinates}}</label>
      <input
        class="middle-input"
        disabled
        type="text"
        placeholder="  显示经度、纬度、高程"
        style="width: 96.5%;background: #333333;color:white"
        v-model="queryCoordinates"
      />
    </div>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="onQueryCoordinatesClk">{{Resource.StartQuery}}</button>
      <button class="tbtn" type="button" @click="clear">{{Resource.eliminate}}</button>
    </div>
  </div>
</template>

<script>
import BaseSpecialEffectModels from '../../../data/BaseSpecialEffectsData.js';
let layers, imageryLayers, handler,skyListener;
export default {
  name: "sceneBasicOptions",
  data() {
    return {
      sharedState: store.state,
      //base
      earthShow: true,
      shadowMap: false,
      cloud: false,
      showFrameState:false,
      skyBox: false,
      sunShow: false,
      timeline: false,
      depthAgainst: true,
      atomsphereRender: true,
      fogEffect: true,
      brightness: 1,
      contrast: 1,
      hue: 0,
      saturation: 1,
      queryCoordinates: null,
      isDestroyFlag: true,
     
    };
  },
  computed: {
    basicOptions: function () {
      return this.sharedState.sceneAtttribute[0];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      imageryLayers = undefined;
      layers = undefined;
      if (handler) {
        handler.destroy();
        handler = undefined;
      }
    }
  },
  mounted() {
    if (this.SceneAtttributeShow && this.basicOptions) {
      this.init();
    }
  },
  methods: {
    //子组件部分
    init() {
      if (layers) {
        return;
      }
      if(!isPCBroswer){this.sunShow = false};
      layers = viewer.scene.layers.layerQueue;
      imageryLayers = viewer.imageryLayers;
      handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      let correction = viewer.scene.colorCorrection;//创建颜色矫正对象;
      correction.show = true;//开启颜色矫正
    },
    onQueryCoordinatesClk() {
      this.isDestroyFlag = false;
      handler.setInputAction(function (movement) {
        window.tooltip.showAt(movement.endPosition, "点击查询坐标值");
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((e) => {
        let position = scene.pickPosition(e.position);
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let searchLongitude = Cesium.Math.toDegrees(
          cartographic.longitude
        ).toFixed(4);
        let searchLatitude = Cesium.Math.toDegrees(
          cartographic.latitude
        ).toFixed(4);
        let searchHeight = cartographic.height.toFixed(2);
        this.queryCoordinates =
          searchLongitude + ", " + searchLatitude + ", " + searchHeight;
        window.tooltip.setVisible(false);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    clear() {
      this.isDestroyFlag = true;
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      window.tooltip.setVisible(false);
      this.queryCoordinates = null;
    },
    gradualChange(wxSkyBox,defaultSkyBox){
      skyListener = scene.postRender.addEventListener(function(){
        let cameraHeight = scene.camera.positionCartographic.height;
        let skyAtmosphereH1 = 22e4; //大气开始渐变的最大高度
        let skyBoxH1 = 15e4; //天空开始渐变的最大高度
        let skyBoxH2 = 12e4; //天空开始渐变的最小高度
        if(cameraHeight < skyAtmosphereH1 && Cesium.defined(wxSkyBox)){
          let skyAtmosphereT = (cameraHeight - skyBoxH2) / (skyAtmosphereH1 - skyBoxH2);
          if(skyAtmosphereT > 1.0){
            skyAtmosphereT = 1.0;
          }else if(skyAtmosphereT < 0.0){
            skyAtmosphereT = 0.0;
          }
          let skyBoxT = (cameraHeight - skyBoxH2) / (skyBoxH1 - skyBoxH2);
          if(skyBoxT > 1.0){
            skyBoxT = 1.0;
          }else if(skyBoxT < 0.0){
            skyBoxT = 0.0;
          }
          wxSkyBox.alpha = 1.0 - skyBoxT;
          if(cameraHeight > skyBoxH2){
            scene.skyAtmosphere.show = true;
            scene.skyAtmosphere.alpha = skyAtmosphereT;
            scene.skyBox = wxSkyBox;
          }else{
            scene.skyAtmosphere.show = false;
            scene.skyBox = wxSkyBox;
          }
        }else{
          scene.skyAtmosphere.alpha = 1.0;
          scene.skyBox = defaultSkyBox;
        }
      })
    },
  },
  watch: {
    basicOptions: function (val) {
      if (val) {
        this.init();
      }
    },
    SceneAtttributeShow(val){
      this.BaseSpecialEffectModels = BaseSpecialEffectModels;
       if (val && this.basicOptions) {
        this.init();
      }
    },
    earthShow(val) {
      viewer.scene.globe.show = val;
    },
    shadowMap(val) {
      if (val) {
        for (let layer of layers) {
          layer.shadowType = 2;
          layer.refresh(); // 加这句是因为 不刷新阴影不会立即显示  属于底层问题，待修改
        }
      } else {
        for (let layer of layers) {
          layer.shadowType = 0;
          layer.refresh();
        }
      }
    },
    cloud(val){
      let cloudUrl =  this.BaseSpecialEffectModels[0].proxiedUrl;
      if(val){
          let cloud = new Cesium.CloudBox({
            url:cloudUrl
          });
          scene.cloudBox = cloud;
          viewer.scene.globe.enableLighting = false;
      }else{
          scene.cloudBox = null;
      }
    },
    skyBox(val){
      let wxSkyBox = this.BaseSpecialEffectModels[1].currentSky;
      wxSkyBox.show = true;
      let defaultSkyBox = this.BaseSpecialEffectModels[1].defaultSky;
      if(val){
          wxSkyBox.WSpeed =1.0;
          this.gradualChange(wxSkyBox,defaultSkyBox);
        }else{
          wxSkyBox.show = false;
          scene.skyAtmosphere.show = true;
          scene.skyBox = defaultSkyBox;
          skyListener();
        }
    },
    showFrameState(val){
      viewer.scene.debugShowFramesPerSecond = val;
    },
    sunShow(val) {
      scene.globe.enableLighting = val;
    },
    timeline(val) {
      let timeline = document.getElementsByClassName(
        "cesium-viewer-timelineContainer"
      )[0];
      if (val) {
        timeline.style.visibility = "visible";
      } else {
        timeline.style.visibility = "hidden";
      }
    },
    depthAgainst(val) {
      scene.globe.depthTestAgainstTerrain = val;
    },
    atomsphereRender(val) {
      scene.skyAtmosphere.show = val;
    },
    fogEffect(val) {
      scene.fog.enabled = val;
    },
    brightness(val) {
      viewer.scene.colorCorrection.brightness = Number(val);
    },
    contrast(val) {
      viewer.scene.colorCorrection.contrast = Number(val);
    },
    hue(val) {
      viewer.scene.colorCorrection.hue = Number(val);
    },
    saturation(val) {
      viewer.scene.colorCorrection.saturation = Number(val);
    }
  },
};
</script>

<style lang="scss">
@import "basicOptions";
</style>
