<template>
  <div class="infoManage" v-show="infoManageShow">
    <div id="infoManageLogin"
           class="infoManageLogin"
           @click="show"
           :title="Resource.login">
        <span class="iconfont icondenglu infoManagetb"></span>
      </div>
    <div id="storageInfo"
         class="storageScene"
         @click="IstorageScene"
         :title="Resource.storageScene">
      <span class="iconfont icona-baocun1 infoManagetb"></span>
    </div>
    <div id="storageScene" class="storageScene-panel">
      <div class="sm-panel-header">
          <span class="title-txt titleColor">{{Resource.sceneStorage}}</span>
          <span class="closeBtn" @click="toggleVisibility">&times;</span>
      </div>
      <div class="sm-function-module-storageScene">
          <div id="sceneImage" class="half">
            <canvas id="sceneCanvas" style="width:100%;margin:35px 0 10px 0;" />
            <label id="saveDateLabel" class="italic">{{Resource.SaveDate}}</label>
            <label id="saveDate" class="italic" style="margin-left:20px"></label>
          </div>
          <div id="sceneMessage" class="half" style="padding-left:15px;">
            <div class="storageScene-half">
              <label class="sm-function-module-storageInfo">场景名称</label>
              <input id="scenePortalName"
                     v-model="scenePortalName"
                     class="sm-input-right"
                     type="text"
                     style="width:100%;float:left;"
              />
            </div>
            <div class="storageScene-half">
              <label class="sm-function-module-storageInfo">{{Resource.SceneLabel}}</label>
              <input id="scenePortalTages"
                     v-model="scenePortalTages"
                     type="text"
                     class="sm-input-right"
                     style="width:100%;float:left;"
              />
            </div>
            <div class="storageScene-half">
              <label class="sm-function-module-storageInfo">{{Resource.author}}</label>
              <input id="scenePortalUser"
                     v-model="scenePortalUser"
                     type="text"
                     class="sm-input-right"
                     style="width:100%;float:left;"
              />
            </div>
            <div class="storageScene-half">
              <label class="sm-function-module-storageInfo">{{Resource.description}}</label>
              <textarea id="scenePortalDescription"
                        v-model="scenePortalDescription"
                        type="text"
                        class="sm-input-right"
                        style="width:100%;float:left;height:75px;">
              </textarea>
            </div>
          </div>
      </div>
      <div class="boxchild">
        <button type="button" id="saveUser" class="tbtn tbn1" @click="onSaveUserClk">{{Resource.save}}</button>
        <button type="button" id="openScene" class="StorageTb openSave" @click="openSaveUserClk">{{Resource.openSave}}</button>
      </div>
    </div>
    <div id="storageFailed">
      {{Resource.storageFailed}}
    </div>
  </div>
</template>

<script>
let version = "0";
let SceneID = "";
import {showLoginBox} from "../../../common/js/request";
export default {
  name: "infoManage",
  data() {
    return {
      sharedState: store.state,
      version : "0",
      scenePortalName : "",
      scenePortalTages : "",
      scenePortalUser : "",
      scenePortalDescription : "",
      loginSuccess: null,
      key : "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
      token :'4a00a1dc5387b8ed8adba3374bd87e5e',
      terrainToken : "e90d56e5a09d1767899ad45846b0cefd"
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    infoManageShow: function () {
      return this.sharedState.infoManage;
    }
  },
  methods: {
    toggleVisibility(){
      this.showStorageScene("none");
    },
    show(){
      showLoginBox({
        authSucceed:this.loginSucceedCallback.bind(this),
        onFailed:this.loginFailedCallback.bind(this),
        onCanceled:this.cancel.bind(this)
      })
    },
    hide(){

    },
    loginSucceedCallback(result){
      const {data} = result;
      this.loginSuccess = result;
      if(data && data.success && data.user){
        window.store.userInfo = data.user;
        this.$Message.success(Resource.loginSuccess);
        this.$emit('login-success');
      }else{
        this.loginFailedCallback(result);
      }
    },
    loginFailedCallback(result){
      const {data} = result;
      window.store.userInfo = data.user;
      this.$Message.error(Resource.loginFailed);
      this.$emit('login-failed',result);
    },
    cancel(source){
      if(source === 'user'){
        this.$emit('login-cancel',{error:false});
      }
    },
    IstorageScene(){
     document.getElementById("saveDate").innerText = this.getNowFormatDate();
     this.outputSceneToFile();
     this.showStorageScene("block");
    },
    showStorageScene(show){
      document.getElementById("storageScene").style.display = show;
    },
    getNowFormatDate(){
      let date = new Date();
      let seperator1 = '-';
      let seperator2 = ':';
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if(month >= 1 && month <=9){
         month = "0" + month;
      }
      if(strDate >= 0 && strDate <= 9 ){
        strDate = "0" +strDate;
      }
      let currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
           + " " + date.getHours() + seperator2 + date.getMinutes()
           + seperator2 + date.getSeconds();
      return currentDate;
    },
    outputSceneToFile(){
      let that = viewer.scene;
      //let me = this;
      let promise = that.outputSceneToFile();
      Cesium.when(promise,function(buffer){
        let canvas = document.getElementById("sceneCanvas");
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = buffer;
        img.onload = function(){
          ctx.drawImage(img,0,0,298,150);
        }
      });
    },
    onSaveUserClk(){

      let name = this.scenePortalName;
      let tags = this.scenePortalTages;
      let userName = this.scenePortalUser;
      let description = this.scenePortalDescription;

      let hasAccount = this.checkAccount();
      if(name === "" || !hasAccount){
        return;
      }

      let data = {};
      data.layers = {};
      //检查该图层对应于S3M、Terrain、Imagery
      this.checkLayers(data.layers);

      let canvas = document.getElementById("sceneCanvas");
      let base64 = canvas.toDataURL("image/jpeg");
      base64 = base64.split(",")[1];

      let camera = viewer.scene.camera;
      data.camera = {
        position : {
            x : camera.positionWC.x,
            y : camera.positionWC.y,
            z : camera.positionWC.z
          },
        heading : camera.heading,
        pitch : camera.pitch,
        roll : camera.roll
      };
      data.environmentState = {
        enableLighting : viewer.scene.globe.enableLighting,
        skyAtmosphereShow : viewer.scene.skyAtmosphere.show,
        enableFog : viewer.scene.fog.enabled
      };
      data.version = "2.0";
      let saveData = {
        "name" : name,
        "tags" : tags,
        "userName" : userName,
        "description" : description,
        "content" : JSON.stringify(data)
      };
      console.log(saveData);
      // 保存场景
      let url = "../../../web/scenes.json";
      window.axios
        .post(url,JSON.stringify(saveData))
        .then(function(response){
          SceneID = response.data.newResourceID;
          //保存缩略图
          let putSceneUrl = "../../../web/scenes/"+ parseInt(response.data.newResourceID) + "/thumbnail.json";
          window.axios({
            method:"put",
            url:putSceneUrl,
            data:base64,
            headers:{"Content-type":"application/x-www-form-urlencoded"},
          }).then(function(result){
          })
          .catch(function(error){
                console.log(error);
          })
        })
        .catch(function(error){
          console.log(error);
        })
    },
    openSaveUserClk(){
      if(SceneID !== ""){
        document.getElementById("storageScene").style.display = "none";
        let url = "../../../web/scenes/"+ SceneID + ".json"
        let me = this;
        window.axios
            .get(url)
            .then(function(response){
              let content = JSON.parse(response.data.content);
              if(JSON.stringify(content.layers) !== "{}"){
                me.openS3M(content);
                me.openImagery(content);
                me.openTerrain(content);
              }
              let cameraX = content.camera.position.x;
              let cameraY = content.camera.position.y;
              let cameraZ = content.camera.position.z;
              scene.camera.setView({
                destination: new Cesium.Cartesian3(cameraX, cameraY,cameraZ),
                orientation :{
                  heading : content.camera.heading,
                  pitch : content.camera.pitch,
                  roll : content.camera.roll
                }
              })
            })
            .catch(function(error){
              console.log(error);
            })
      }
    },
    checkLayers(layers){

      let s3mLayerlength = viewer.scene.layers._layers.length;    //S3M图层
      layers["s3mLayer"] = this.saveS3M(layers,s3mLayerlength);

      let imageryLayer = viewer.imageryLayers._layers;     //影像图层
      layers["imageryLayer"] = this.saveImagery(imageryLayer);

      layers["terrainLayer"] = this.saveTerrain();        //地形图层

    },
    saveS3M(layers,s3mLayerlength){
      let s3mlayerUrl = [];
      for(let i=0,j=s3mLayerlength;i<j;i++){
        let s3mTypeAndUrl = {};
        let layer = viewer.scene.layers._layerQueue[i];
        s3mTypeAndUrl["type"] = "S3MTilesLayer";
        let layerUrl = layer._layerScheduler._indexedDBScheduler.dbname;
        layerUrl = this.getUrl(layerUrl);
        s3mTypeAndUrl["url"] = layerUrl;
        s3mlayerUrl.push(s3mTypeAndUrl);
      }
      return s3mlayerUrl;
    },
    saveImagery(imageryLayer){
      let imageryLayerUrl = [];
      for(let j=1;j<imageryLayer.length;j++){
        let imageryTypeAndUrl = {};
        let provider = imageryLayer[j]._imageryProvider;
        if(provider instanceof Cesium.BingMapsImageryProvider){
          imageryTypeAndUrl["type"] = "BingMapsImageryProvider";
        }else if(provider instanceof Cesium.TiandituImageryProvider){
          imageryTypeAndUrl["type"] = "TiandituImageryProvider";
        }else if(provider instanceof Cesium.SingleTileImageryProvider){
          imageryTypeAndUrl["type"] = "SingleTileImageryProvider";
        }else if(provider instanceof Cesium.SuperMapImageryProvider){
          imageryTypeAndUrl["type"] = "SuperMapImageryProvider";
        }else{
          imageryTypeAndUrl["Type"] = "GRIDIMAGERY";
        }
        imageryTypeAndUrl["url"] = viewer.imageryLayers._layers[j]._imageryProvider._baseUrl;
        imageryLayerUrl.push(imageryTypeAndUrl);
      }
      return imageryLayerUrl;
    },
    saveTerrain(){
      let terrainLayer = viewer.terrainProvider.tablename;        //地形图层
      let terrainLayerUrl = [];
      if(terrainLayer){
        let terrainTypeAndUrl = {};
        let terrainProvider = viewer.terrainProvider;
        if(terrainProvider instanceof Cesium.CesiumTerrainProvider){
          terrainTypeAndUrl["type"] = "tinTerrain";
        }else if(terrainProvider instanceof Cesium.TiandituTerrainProvider){
          terrainTypeAndUrl["type"] = "tianDiTuTerrain";
        }else if(terrainProvider instanceof Cesium.SCTTerrainProvider){
          terrainTypeAndUrl["type"] = "supermapOnlineTerrain";
        }
        terrainTypeAndUrl["url"] = viewer.terrainProvider._baseUrl;
        terrainLayerUrl.push(terrainTypeAndUrl);
      }
      return terrainLayerUrl;
    },
    openS3M(content){
      let s3mlayer = content.layers.s3mLayer;
      if(s3mlayer.length >0){
        for(let t=0;t<s3mlayer.length;t++){
          viewer.scene.open(content.layers.s3mLayer[t].url);
        }
      }
    },
    openImagery(content){
      let imageryLayer = content.layers.imageryLayer;
      let imageryProvider;
      if(imageryLayer.length > 0){
        let imageryLayerCollection = viewer.imageryLayers;
        for(let t=1;t<imageryLayerCollection.length;t++){
          imageryLayerCollection.remove(viewer.imageryLayers._layers[t]);
        }
        for(let i=0;i<imageryLayer.length;i++){
          let imageryType = content.layers.imageryLayer[i].type;
          switch(imageryType){
            case "BingMapsImageryProvider":
              imageryProvider = new Cesium.BingMapsImageryProvider({
                url : content.layers.imageryLayer[i].url,
                key : this.key
              });
              break;
            case "TiandituImageryProvider":
              imageryProvider = new Cesium.TiandituImageryProvider({
                url : content.layers.imageryLayer[i].url,
                token : this.token
              });
              break;
            case "SingleTileImageryProvider" :
              imageryProvider = new Cesium.SingleTileImageryProvider({
                url : content.layers.imageryLayer[i].url
              });
              break;
            case "SuperMapImageryProvider" :
              imageryProvider = new Cesium.SuperMapImageryProvider({
                url : content.layers.imageryLayer[i].url
              });
              break;
            case "GRIDIMAGERY" :
              imageryProvider = new Cesium.TileCoordinatesImageryProvider();
              break;
          }
          viewer.imageryLayers.addImageryProvider(imageryProvider,(i+1));
        }
      }
    },
    openTerrain(content){
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
      let terrainLayer = content.layers.terrainLayer;
      if(terrainLayer.length > 0){
        let terrainType = content.layers.terrainLayer[0].type;
        switch(terrainType){
          case "tinTerrain":
            viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
              url : content.layers.terrainLayer[0].url,
              isSct : true,
              invisibility:true
            });
            break;
          case "tianDiTuTerrain":
            viewer.terrainProvider = new Cesium.TiandituTerrainProvider({
              token : this.terrainToken
            });
            break;
          case "supermapOnlineTerrain":
            viewer.terrainProvider = new Cesium.SCTTerrainProvider({
              urls : [content.layers.terrainLayer[0].url]
            });
            break;
        }
      }
    },
    checkAccount(){
      if(this.loginSuccess == null){
         this.labelAnimation();
         return false;
      }
        return true;
    },
    labelAnimation(){
      document.getElementById("storageFailed").style.visibility = "visible";
      document.getElementById("storageFailed").style.transition = "visibility 0s 0.2s,opacity 0.2s ease-in,transform 0.2s ease-in";
      setTimeout(function(){
        document.getElementById("storageFailed").style.opacity = 0;
      },2000);
    },
    getUrl(url){
       let isRealspace = url.indexOf("realspace") > -1;
       if (!isRealspace) {
          return ;
       }

       let afterRealspace  = url.replace(/(.*realspace)/, "");
       let lastUrl = url.replace(/\/rest\/realspace/g,"").replace(afterRealspace,"");
       return lastUrl +'/rest/realspace';
    }
  }
};
</script>

<style lang="scss"  scoped>
@import "infoManage";
</style>

