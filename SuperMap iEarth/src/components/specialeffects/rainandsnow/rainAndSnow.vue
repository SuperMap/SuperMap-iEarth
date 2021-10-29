
<template>
  <div class="sm-panel" v-drag v-if="rainAndSnowShow">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span class="title-txt">{{Resource.rainAndSnowShow}}</span>
        <span class="closeBtn" @click="clear">&times;</span>
      </div>
      <div class="sm-function-module-content">
        <div class="sm-function-module-sub-section">
          <div class="flexbox">
            <label class="sm-viewshed-label-right">{{
              Resource.openRainSpecialEffects
              }}</label>
            <input type="checkbox" v-model="openRainSpecialEffects" />
            <div style="width: 45%"></div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">{{ Resource.angle }}</label>
            <div class="sm-solider-input-box" style="width:70%">
              <input
                class="min-solider"
                min="0"
                max="90"
                step="5"
                style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                type="range"
                v-model="rainAngle"
              />
              <input
                class="min-solider"
                min="0"
                max="90"
                step="5"
                style="width:25%;border-radius:3px;"
                type="number"
                v-model="rainAngle"
              />
            </div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">{{ Resource.rainSpeed }}</label>
            <div class="sm-solider-input-box" style="width:70%">
              <input
                class="min-solider"
                min="0"
                max="10"
                step="1"
                style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                type="range"
                v-model="rainSpeed"
              />
              <input
                class="min-solider"
                min="0"
                max="10"
                step="1"
                style="width:25%;border-radius:3px;"
                type="number"
                v-model="rainSpeed"
              />
            </div>
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <div class="flexbox">
            <label class="sm-viewshed-label-right">{{
              Resource.openSnowSpecialEffects
              }}</label>
            <input type="checkbox" v-model="openSnowSpecialEffects" />
            <div style="width: 45%"></div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">{{ Resource.snowDesity }}</label>
            <div class="sm-solider-input-box" style="width:70%">
              <input
                class="min-solider"
                min="0"
                max="30"
                step="2"
                style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                type="range"
                v-model="snowDesity"
              />
              <input
                class="min-solider"
                min="0"
                max="30"
                step="2"
                style="width:25%;border-radius:3px;"
                type="number"
                v-model="snowDesity"
              />
            </div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">{{ Resource.angle }}</label>
            <div class="sm-solider-input-box" style="width:70%">
              <input
                class="min-solider"
                min="0"
                max="90"
                step="5"
                style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                type="range"
                v-model="snowAngle"
              />
              <input
                class="min-solider"
                min="0"
                max="90"
                step="5"
                style="width:25%;border-radius:3px;"
                type="number"
                v-model="snowAngle"
              />
            </div>
          </div>
          <div class="sm-function-module-sub-section">
            <label class="label-container">{{ Resource.rainSpeed }}</label>
            <div class="sm-solider-input-box" style="width:70%">
              <input
                class="min-solider"
                min="0"
                max="10"
                step="1"
                style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                type="range"
                v-model="snowSpeed"
              />
              <input
                class="min-solider"
                min="0"
                max="10"
                step="1"
                style="width:25%;border-radius:3px;"
                type="number"
                v-model="snowSpeed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
   import BaseLayerModels from "../../../data/BaseLayerData.js";
   import CompassViewModel from "../../combinations/compass/compassViewModel";
   let viewModel = {};
   let imageryLayerCollection;
export default {
  name: "rainAndSnow",
  data() {
    return {
      sharedState: store.state,
      openRainSpecialEffects:true,
      rainAngle:45,
      rainSpeed:8,
      openSnowSpecialEffects:false,
      snowDesity:5,
      snowAngle:10,
      snowSpeed:12
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    rainAndSnowShow: function () {
      return this.sharedState.specialEffects[2];
    },
  },
  methods: {
    init() {
      viewer.scene.postProcessStages.rain.enabled = this.openRainSpecialEffects;

      let url = specialEffects.effects[2].proxiedUrl;
      let cameraParam = specialEffects.effects[2].cameraParama;
      viewModel = new CompassViewModel({
        viewer:viewer,
        scene:scene,
        viewerId:"compass"
      });

      this.addTerrain(url,cameraParam);
      this.addImage();

      viewModel.viewerChanged = true;
      viewModel.handleViewerChange();

    },
    clear(){
      this.removeTerrain();
      this.removeImage();
      this.openRainSpecialEffects=false;
      this.openSnowSpecialEffects=false;
      viewer.scene.postProcessStages.rain.enabled = false;
      viewer.scene.postProcessStages.snow.enabled = false;
      store.setSpecialEffects(2, 0);
      viewModel.viewerChanged = false;
      viewModel.handleViewerChange();
      this.reset();
    },
    reset() {
      viewModel.resetCameraPosition();
    },
    addTerrain(url,cameraParam){
      viewer.terrainProvider = new Cesium.SCTTerrainProvider({
        urls:[url]
      });

      viewer.scene.camera.setView({
          destination: new Cesium.Cartesian3(
            cameraParam.Cartesian3.x,
            cameraParam.Cartesian3.y,
            cameraParam.Cartesian3.z
          ),
          orientation: {
            heading:cameraParam.heading,
            pitch: cameraParam.pitch,
            roll: cameraParam.roll,
          }
        });
    },
    addImage(){
       imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
       let addLayer = imageryLayerCollection.get(0);
       let addImagery = new Cesium.BingMapsImageryProvider({
         url:BaseLayerModels[1].url,
         key:BaseLayerModels[1].key
       });
       imageryLayerCollection.remove(addLayer);
       imageryLayerCollection.addImageryProvider(addImagery,0);
    },
    removeImage(){
      let removeLayer = imageryLayerCollection.get(0);
      let removeImagery = new Cesium.SingleTileImageryProvider({
         url:BaseLayerModels[0].url
      });
      imageryLayerCollection.remove(removeLayer);
      imageryLayerCollection.addImageryProvider(removeImagery,0);
    },
    // todo
    // 栅格地形暂时无法移除
    removeTerrain(){
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({
             ellipsoid:viewer.scene.globe.ellipsoid
        });     
    }
  },
  watch: {
   rainAndSnowShow(val) {
      if (val) {
        this.init();
      }
    },
    openSnowSpecialEffects(val){
       if(val){
         this.openSnowSpecialEffects = true;
         viewer.scene.postProcessStages.snow.enabled = true;
       }else{
         this.openSnowSpecialEffects = false;
         viewer.scene.postProcessStages.snow.enabled = false;
      }
    },
    openRainSpecialEffects(val){
     if(val){
       this.openRainSpecialEffects = true;
       viewer.scene.postProcessStages.rain.enabled = true;
     }else{
       this.openRainSpecialEffects = false;
       viewer.scene.postProcessStages.rain.enabled = false;
     }
    },
    rainAngle(){
      viewer.scene.postProcessStages.rain.uniforms.angle = Number(this.rainAngle);
    },
    rainSpeed(){
      viewer.scene.postProcessStages.rain.uniforms.speed = Number(this.rainSpeed);
    },
    snowDesity(){
      viewer.scene.postProcessStages.snow.uniforms.density = Number(this.snowDesity);
    },
    snowAngle(){
      viewer.scene.postProcessStages.snow.uniforms.angle = Number(this.snowAngle);
    },
    snowSpeed(){
      viewer.scene.postProcessStages.snow.uniforms.speed = Number(this.snowSpeed);
    },
  },
};
</script>

