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
      <span class="iconfont icondenglu infoManagetb"></span>
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
  </div>
</template>

<script>
let version = 0;
let SceneID = "";
import {showLoginBox} from "../../../common/js/request";
export default {
  name: "infoManage",
  data() {
    return {
      sharedState: store.state,
      version : 0,
      scenePortalName : "",
      scenePortalTages : "",
      scenePortalUser : "",
      scenePortalDescription : ""
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
      let me = this;
      let name = me.scenePortalName;
      let tags = me.scenePortalTages;
      let userName = me.scenePortalUser;
      let description = me.scenePortalDescription;
      if(name === ""){
        return;
      }
      let canvas = document.getElementById("sceneCanvas");
      let base64 = canvas.toDataURL("image/jpeg");
      base64 = base64.split(",")[1];
      let data = {};
      data.layers = {};
      let length = viewer.scene.layers._layers.length;
      for(let i=0,j=length;i<j;i++){
        let layer = viewer.scene.layers._layerQueue[i];
        let layerUrl = layer._layerScheduler._indexedDBScheduler.dbname;
        layerUrl = this.getUrl(layerUrl);
        data.layers[i] = layerUrl;
      }

      let camera = viewer.scene.camera;
      data.camera = {
        position : {
            x : camera.position.x,
            y : camera.position.y,
            z : camera.position.z
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
      data.version = 2.0;
      let saveData = {
        "name" : name,
        "tags" : tags,
        "userName" : userName,
        "description" : description,
        "content" : data
      };
      //保存场景
      let url = "../../web/scenes.json";
      window.axios
        .post(url,saveData)
        .then(function(response){
          SceneID = response.data.newResourceID;
          //保存缩略图
          // let putSceneUrl = "../../web/scenes/"+ parseInt(response.data.newResourceID) + "/thumbnail.json";
          //   window.axios
          //      .put(putSceneUrl,{
          //           data:base64
          //      })
          //      .then(function(result){
          //         console.log(result);
          //      })
          //      .catch(function(error){
          //        console.log(error);
          //      })
        })
        .catch(function(error){
          console.log(error);
        })
    },
    openSaveUserClk(){
      if(SceneID !== ""){
        document.getElementById("storageScene").style.display = "none";
        let url = "../../web/scenes/"+ SceneID + ".json"
        window.axios
            .get(url)
            .then(function(response){
              let content = JSON.parse(response.data.content);
              if(JSON.stringify(content.layers) !== "{}"){
                  viewer.scene.open(content.layers[0]);
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

