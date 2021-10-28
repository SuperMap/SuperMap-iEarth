<template>
    <div class="baseLayer" v-show="baseLayerShow">
      <div class="base-panel-header"></div>
      <div class="imageBaseLayer" style="background:rgba(35,35,35,0.8)">
        <div class="image-panel-header">{{ Resource.OnlineBaseMap }}</div>
        <div class="imageContainer">
          <div
            class="imageBox"
            v-for="(item,index) in BaseLayers"
            :key="item.name"
            @click="addBaseLayer(item.type,index)"
          >
            <div class="overlayImage">
              <img :src="item.thumbnail" alt />
              <img :src="item.imgsrc"  v-if="imageryIndex==index" style="width:30px;height:26px;" class="imgcross" alt/>
            </div>
            <label>{{item.name}}</label>
          </div>
        </div>
      </div>
      <div class="imageBaseLayer" style="background:rgba(35,35,35,0.8)">
        <div class="image-panel-header"> {{ Resource.onlineTerrain }}</div>
        <div class="imageContainer">
          <div
            class="imageBox"
            v-for="(item,index) in BaseTerrainLayers"
            :key="item.name"
            @click="addBaseTerrainLayer(item.type,index)"
          >
            <div class="overlayImage">
              <img :src="item.thumbnail" alt/>
              <img :src="item.imgsrc"  v-if="terrainShow==index" style="width:30px;height:26px;" class="imgcross" alt/>
            </div>
            <label>{{item.name}}</label>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
let imageryProvider,ImageryManager;
import BaseLayerModels from "../../../data/BaseLayerData.js";
import BaseTerrainModels from"../../../data/BaseTerrainData.js";
import otherTerrainAndImageModels from "../../../data/otherTerrainAndImageData.js";
export default {
  name: "addBaseLayer",
  data() {
    return {
      imageryShow:0,
      terrainShow:Number,
      imageryIndex:0,
      sharedState: store.state,
      BaseLayers: null,
      BaseTerrainLayers:null,
      terrainType :""
    };
  },
  computed: {
    baseLayerShow: function () {
      return this.sharedState.toolBar[2];
    },
  },
  methods: {
    toggleVisibility() {
      //控制组件界面显隐
      store.setToolBarAction(2);
    },
    addBaseLayer(type, index) {
      for(let baseImagery in this.otherTerrainLayers){
        if(!this.otherTerrainLayers[baseImagery].imagery.chooseType){
           this.baseLayer(type,index);
        }else{
          this.otherBaseImageryLayer(type,index);
        }
      }
      // this.baseLayerShow = false;
      store.setToolBarAction(2);//显隐状态 取反
    },
    addBaseTerrainLayer(type,index){
          this.terrainType = type;
          this.removeTerrainLayer();
          switch(type){
            case "StkTerrain":
              viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
                url:this.BaseTerrainLayers[index].url,
                requestWaterMask : true,
				        requestVertexNormals : true,
                isSct : false
              });
              this.BaseTerrainLayers[index].chooseType = true;
              window.terrainProvider = viewer.terrainProvider;
              break;
            case "tianDiTuTerrain":
              let t_Provider = new Cesium.TiandituTerrainProvider({
                token:this.BaseTerrainLayers[index].token
              });
              viewer.terrainProvider = t_Provider;
              this.BaseTerrainLayers[index].chooseType = true;
              window.terrainProvider = viewer.terrainProvider;
              break;
            case "supermapOnlineTerrain":
              viewer.terrainProvider = new Cesium.SCTTerrainProvider({
                urls: [this.BaseTerrainLayers[index].url]
              });
              this.BaseTerrainLayers[index].chooseType = true;
              window.terrainProvider = viewer.terrainProvider;
              break;
            default:
              break;
          };

          //点击图层面板的地形，让公共数据里面的地形值设为false,
          if(this.terrainShow == index){
            this.terrainShow = Number;
            this.removeTerrainLayer();
          }else{
            this.terrainShow=index;
          }

          for(let key in  this.otherTerrainLayers){
             this.otherTerrainLayers[key].terrain.chooseType = false;
          }
          // this.baseLayerShow = false;
          store.setToolBarAction(2);//显隐状态 取反
    },
    baseLayer(type,index){
      //底图设置与图层管理面板联动时，需要加影像的标识来进行判断。尤其是网格影像和其他单一影像的切换。
      for(let j=0;j<this.BaseLayers.length;j++){
          this.BaseLayers[j].chooseType = false;
      }
      let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
      let layer = imageryLayerCollection.get(0);
      if (imageryLayerCollection.get(1)) {
        imageryLayerCollection.remove(imageryLayerCollection.get(1));
      }
      switch (type) {
        case "BINGMAP":
          imageryProvider = new Cesium.BingMapsImageryProvider({
            url: this.BaseLayers[index].url,
            key:this.BaseLayers[index].key
          });
          this.BaseLayers[index].chooseType = true;
          break;
        case "TIANDITU":
          imageryProvider = new Cesium.TiandituImageryProvider({
            url: this.BaseLayers[index].url,
            token: this.BaseLayers[index].token,
          });
          this.BaseLayers[index].chooseType = true;
          break;
        case "IMAGE":
          imageryProvider = new Cesium.SingleTileImageryProvider({
            url: this.BaseLayers[index].url,
          });
          this.BaseLayers[index].chooseType = true;
          break;
        case "OSM":
          imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
            url: this.BaseLayers[index].url,
          });
          this.BaseLayers[index].chooseType = true;
          break;
        case "GRIDIMAGERY":
          imageryProvider = imageryProvider;
          this.BaseLayers[index].chooseType = true;
          break;
        default:
          break;
      }
      if (type !== "GRIDIMAGERY") {
        imageryLayerCollection.remove(layer);
        this.BaseLayers[this.imageryShow].chooseType = false;
        imageryLayerCollection.addImageryProvider(imageryProvider, 0);
      }
      if (type == "GRIDIMAGERY") {
        if(layer == undefined){
          imageryProvider = new Cesium.SingleTileImageryProvider({
            url: this.BaseLayers[0].url,
          });
          imageryLayerCollection.addImageryProvider(imageryProvider, 0);
          this.BaseLayers[0].chooseType = true;
        }
        imageryLayerCollection.addImageryProvider(
          new Cesium.TileCoordinatesImageryProvider(),
          1
        );
      }
      if(this.imageryIndex == index){
        this.imageryIndex = Number;
        this.imageryShow = index;
        this.removeImagery(type,index);
        this.addTerrainLayer(this.terrainShow);
      }else{
        if(type === "GRIDIMAGERY"){
          this.BaseLayers[this.imageryShow].chooseType = true;
          this.imageryIndex=index;
          this.imageryShow = index;
        }else{
          this.imageryIndex=index;
          this.imageryShow = index;
          this.BaseLayers[this.imageryShow].chooseType = true;
        }
      }
    },
    otherBaseImageryLayer(type,index){
      let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
      if(imageryLayerCollection._layers.length == 1){                       //点击移除之后再去加载
        for(let h=0;h<this.BaseLayers.length;h++){
          if(this.BaseLayers[h].chooseType){
            let ly2 = viewer.imageryLayers._layers[0];
            viewer.imageryLayers.remove(ly2);
          }
        }
        switch (type) {
          case "BINGMAP":
            imageryProvider = new Cesium.BingMapsImageryProvider({
              url: this.BaseLayers[index].url,
              key:this.BaseLayers[index].key
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "TIANDITU":
            imageryProvider = new Cesium.TiandituImageryProvider({
              url: this.BaseLayers[index].url,
              token: this.BaseLayers[index].token,
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "IMAGE":
            imageryProvider = new Cesium.SingleTileImageryProvider({
              url: this.BaseLayers[index].url,
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "OSM":
            imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
              url: this.BaseLayers[index].url,
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "GRIDIMAGERY":
            imageryProvider = imageryProvider;
            this.BaseLayers[index].chooseType = true;
            break;
          default:
            break;
        }
        if (type !== "GRIDIMAGERY") {
          for(let g=0;g<this.BaseLayers.length;g++){
            if(this.imageryIndex == 4){
              this.BaseLayers[g].chooseType = false;
            }
          }

          this.BaseLayers[this.imageryShow].chooseType = false;
          imageryLayerCollection.addImageryProvider(imageryProvider, 0);
        }

        if (type == "GRIDIMAGERY") {
          imageryProvider = new Cesium.SingleTileImageryProvider({
              url: this.BaseLayers[0].url,
          });
          imageryLayerCollection.addImageryProvider(imageryProvider, 0);
          this.BaseLayers[0].chooseType = true;
          imageryLayerCollection.addImageryProvider(
            new Cesium.TileCoordinatesImageryProvider(),
            2
          );
        }
      }else{// 点击直接加载
        if(imageryLayerCollection._layers.length >= 3){         //对图层做排序;
          var imagery;
          for(let k=0;k<imageryLayerCollection._layers.length;k++){
              if(imageryLayerCollection._layers[k]._imageryProvider.tablename == "image"){
                imagery = imageryLayerCollection._layers[k];
                imageryLayerCollection.remove(imagery);
              }
          }
          imageryLayerCollection.addImageryProvider(imagery._imageryProvider, 1);
        }
        let layer;
        if(imageryLayerCollection._layers[0]._imageryProvider.tablename == "image"){
          layer = imageryLayerCollection.get(1);
        }else{
          layer = imageryLayerCollection.get(0);
        }
        if (imageryLayerCollection.get(2)) {
          imageryLayerCollection.remove(imageryLayerCollection.get(2));
        }
        switch (type) {
          case "BINGMAP":
            imageryProvider = new Cesium.BingMapsImageryProvider({
              url: this.BaseLayers[index].url,
              key:this.BaseLayers[index].key
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "TIANDITU":
            imageryProvider = new Cesium.TiandituImageryProvider({
              url: this.BaseLayers[index].url,
              token: this.BaseLayers[index].token,
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "IMAGE":
            imageryProvider = new Cesium.SingleTileImageryProvider({
              url: this.BaseLayers[index].url,
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "OSM":
            imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
              url: this.BaseLayers[index].url,
            });
            this.BaseLayers[index].chooseType = true;
            break;
          case "GRIDIMAGERY":
            imageryProvider = imageryProvider;
            this.BaseLayers[index].chooseType = true;
            break;
          default:
            break;
        }
        if (type !== "GRIDIMAGERY") {
          imageryLayerCollection.remove(layer);
          for(let t=0;t<this.BaseLayers.length;t++){
            if(this.imageryIndex == (this.BaseLayers.length-1)){
              this.BaseLayers[t].chooseType = false;
            }
          }
          this.BaseLayers[this.imageryShow].chooseType = false;
          this.BaseLayers[this.imageryShow].isMultipleChoose = false;
          imageryLayerCollection.addImageryProvider(imageryProvider, 0);
        }
        if (type == "GRIDIMAGERY") {
          if(layer == undefined){
            imageryProvider = new Cesium.SingleTileImageryProvider({
              url: this.BaseLayers[0].url,
            });
            imageryLayerCollection.addImageryProvider(imageryProvider, 0);
            this.BaseLayers[0].chooseType = true;
          }
          imageryLayerCollection.addImageryProvider(
            new Cesium.TileCoordinatesImageryProvider(),
            2
          );
        }
      }
      if(this.imageryIndex == index){
        this.imageryIndex = Number;
        this.imageryShow = index;
        this.removeOtherImagery(type,index);
      }else{
        this.imageryIndex=index;
        this.imageryShow = index;
        this.BaseLayers[this.imageryShow].chooseType = true;
      }
    },
    removeTerrainLayer(){
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({
             ellipsoid:viewer.scene.globe.ellipsoid
        });
      for(let t = 0;t<this.BaseTerrainLayers.length;t++){
        this.BaseTerrainLayers[t].chooseType = false;
      }
    },
    removeImagery(type,index){
      this.BaseLayers[index].chooseType = false;
      let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
      let layer = imageryLayerCollection.get(0);
      if(type !== "GRIDIMAGERY"){
         imageryLayerCollection.remove(layer);
      }else{
        if (imageryLayerCollection.get(1)) {
          imageryLayerCollection.remove(imageryLayerCollection.get(1));
        }
        imageryLayerCollection.remove(layer);
      }
    },
    addTerrainLayer(index){
      for(let key in this.otherTerrainLayers){
        if(!this.otherTerrainLayers[key].terrain.chooseType){
          switch(this.terrainType){
            case "StkTerrain":
              viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
                url:this.BaseTerrainLayers[index].url,
                isSct : false
              });
              this.BaseTerrainLayers[index].chooseType = true;
              window.terrainProvider = viewer.terrainProvider;
              break;
            case "tianDiTuTerrain":
              var t_Provider = new Cesium.TiandituTerrainProvider({
                token:this.BaseTerrainLayers[index].token
              });
              viewer.terrainProvider = t_Provider;
              this.BaseTerrainLayers[index].chooseType = true;
              window.terrainProvider = viewer.terrainProvider;
              break;
            case "supermapOnlineTerrain":
              viewer.terrainProvider = new Cesium.SCTTerrainProvider({
                urls: [this.BaseTerrainLayers[index].url]
              });
              this.BaseTerrainLayers[index].chooseType = true;
              window.terrainProvider = viewer.terrainProvider;
              break;
            default:
              break;
          };
        }
      }
    },
    removeOtherImagery(type,index){
      this.BaseLayers[index].chooseType = false;
      let imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
      let ycImagery = imageryLayerCollection.get(0);
      if(type !== "GRIDIMAGERY"){
        imageryLayerCollection.remove(ycImagery);
      }else{
        for(let t =0;t<this.BaseLayers.length;t++){
          this.BaseLayers[t].chooseType = false;
        }
        imageryLayerCollection.remove(ycImagery);
        let twiceYcImagery = imageryLayerCollection.get(1);
        imageryLayerCollection.remove(twiceYcImagery);
      }
    },
    initialState(){
        this.updateImageryState();
        this.updateTerrainState();
    },
    updateImageryState(){
      let length = this.BaseLayers.length;
      if(this.imageryIndex == (length-1)){
        if(this.BaseLayers[(length-1)].chooseType){
          this.imageryIndex = (length-1);
          return;
        }
      }
      for(let i =0; i<this.BaseLayers.length;i++){
       if(this.BaseLayers[i].chooseType){
          this.imageryIndex = this.BaseLayers[i].index;
          this.imageryShow = this.BaseLayers[i].index;
          return;
       }else{
          this.imageryIndex = Number;
       }
      }
    },
    updateTerrainState(){
      for(let i=0;i<this.BaseTerrainLayers.length;i++){
         if(this.BaseTerrainLayers[i].chooseType){
           this.terrainShow = this.BaseTerrainLayers[i].index;
           return;
        }else{
           this.terrainShow = Number;
         }
      }

      for(let key in this.otherTerrainLayers){
        if( this.otherTerrainLayers[key].terrain.chooseType){
            this.terrainShow = Number;
        }
      }
    }
  },
  watch: {
    baseLayerShow: function (val) {
      this.BaseLayers = BaseLayerModels;
      this.BaseTerrainLayers = BaseTerrainModels;
      this.otherTerrainLayers = otherTerrainAndImageModels;
      if (val) {
        document.getElementsByTagName("canvas")[0].onclick = () => {
          this.toggleVisibility();
        };
        ImageryManager = setInterval(()=>{
            this.initialState();
          },100);
      } else {
        document.getElementsByTagName("canvas")[0].onclick = null;
        clearInterval(ImageryManager);
        ImageryManager = undefined;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./addBaseLayer.scss";
</style>



