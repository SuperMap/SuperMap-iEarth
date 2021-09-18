<template>
  <div>
    <div class="infoManage" v-show="infoManageShow">
      <div id="infoManageLogin" class="infoManageLogin" @click="show" :title="switchAccount">
        <span class="iconfont icondenglu infoManagetb"></span>
      </div>
      <div
        id="storageInfo"
        class="storageScene"
        @click="IstorageScene"
        :title="Resource.storageScene"
      >
        <span class="iconfont icona-baocun1 infoManagetb"></span>
      </div>

      <div id="storageFailed">{{Resource.storageFailed}}</div>
      <div id="noPermission">{{Resource.noPermission}}</div>
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
            <input
              id="scenePortalName"
              v-model="scenePortalName"
              class="sm-input-right"
              type="text"
              style="width:100%;float:left;"
            />
          </div>
          <div class="storageScene-half">
            <label class="sm-function-module-storageInfo">{{Resource.SceneLabel}}</label>
            <input
              id="scenePortalTages"
              v-model="scenePortalTages"
              type="text"
              class="sm-input-right"
              style="width:100%;float:left;"
            />
          </div>
          <div class="storageScene-half">
            <label class="sm-function-module-storageInfo">{{Resource.author}}</label>
            <input
              id="scenePortalUser"
              v-model="scenePortalUser"
              type="text"
              class="sm-input-right"
              style="width:100%;float:left;"
            />
          </div>
          <div class="storageScene-half">
            <label class="sm-function-module-storageInfo">{{Resource.description}}</label>
            <textarea
              id="scenePortalDescription"
              v-model="scenePortalDescription"
              type="text"
              class="sm-input-right"
              style="width:100%;float:left;height:75px;"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="boxchild">
        <button
          type="button"
          id="saveUser"
          class="tbtn tbn1"
          style="margin-right:25px;"
          @click="onSaveUserClk"
        >{{Resource.save}}</button>
      </div>
    </div>
  </div>
</template>

<script>
let version = "0";
import { showLoginBox } from "../../../common/js/request";
//引入portal处理公共类
import {
  getRootUrl,
  isIportalProxyServiceUrl,
  getHostName
} from "../../../common/js/portalTools";
export default {
  name: "infoManage",
  props: {
    isCreateScene: { type: Boolean }
  },
  data() {
    return {
      sharedState: store.state,
      version: "0",
      scenePortalName: "",
      scenePortalTages: "",
      scenePortalUser: "",
      scenePortalDescription: "",
      loginSuccess: null,
      key: "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
      token: "4a00a1dc5387b8ed8adba3374bd87e5e",
      terrainToken: "e90d56e5a09d1767899ad45846b0cefd",
      sceneID: 0,
      copyIsCreateScene: this.isCreateScene
    };
  },
  computed: {
    isInitViewer: function() {
      return this.sharedState.isInitViewer;
    },
    infoManageShow: function() {
      return this.sharedState.infoManage;
    },
    portalUserprofile() {
      return window.store.portalUserprofile;
    },
    switchAccount() {
      return !this.portalUserprofile ||
        this.portalUserprofile.userName === "GUEST"
        ? Resource.login
        : Resource.accountInfo;
    }
  },
  methods: {
    toggleVisibility() {
      this.showStorageScene("none");
    },
    init() {
      let isCreateScene = this.copyIsCreateScene;
      if (!isCreateScene) {
        this.openExistScene();
      }
    },
    show() {
      let userInfo = window.store.portalUserprofile;
      if (!userInfo || userInfo.userName === "GUEST") {
        showLoginBox({
          authSucceed: this.loginSucceedCallback.bind(this),
          onFailed: this.loginFailedCallback.bind(this),
          onCanceled: this.cancel.bind(this)
        });
      } else {
        let myAccountUrl = getRootUrl() + "web-ui/my-account/account";
        window.open(myAccountUrl);
      }
    },
    hide() {},
    loginSucceedCallback(result) {
      console.log("result:" + result);
      const { data } = result;
      this.loginSuccess = result;
      if (data && data.success && data.user) {
        window.store.userInfo = data.user;
        this.$Message.success(Resource.loginSuccess);
        this.$emit("login-success");
        //刷新页面
        location.reload();
      } else {
        this.loginFailedCallback(result);
      }
    },
    loginFailedCallback(result) {
      const { data } = result;
      window.store.userInfo = data.user;
      this.$Message.error(Resource.loginFailed);
      this.$emit("login-failed", result);
    },
    cancel(source) {
      if (source === "user") {
        this.$emit("login-cancel", { error: false });
      }
    },
    IstorageScene() {
      document.getElementById("saveDate").innerText = this.getNowFormatDate();
      this.outputSceneToFile();
      this.showStorageScene("block");
    },
    showStorageScene(show) {
      document.getElementById("storageScene").style.display = show;
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentDate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentDate;
    },
    outputSceneToFile() {
      let that = viewer.scene;
      //let me = this;
      let promise = that.outputSceneToFile();
      Cesium.when(promise, function(buffer) {
        let canvas = document.getElementById("sceneCanvas");
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.src = buffer;
        img.onload = function() {
          ctx.drawImage(img, 0, 0, 298, 150);
        };
      });
    },
    //创建并保存场景
    createAndSaveScene() {
      let that = this;
      let name = this.scenePortalName;
      let tags = this.scenePortalTages;
      let userName = this.scenePortalUser;
      let description = this.scenePortalDescription;

      if (name === "") {
        that.$Message.warning(Resource.saveErrorWhileSceneEmpty);
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
        position: {
          x: camera.positionWC.x,
          y: camera.positionWC.y,
          z: camera.positionWC.z
        },
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      };
      data.environmentState = {
        enableLighting: viewer.scene.globe.enableLighting,
        skyAtmosphereShow: viewer.scene.skyAtmosphere.show,
        enableFog: viewer.scene.fog.enabled
      };
      data.version = "2.0";
      let saveData = {
        name: name,
        tags: tags,
        userName: userName,
        description: description,
        content: JSON.stringify(data)
      };

      let iportaluserName = window.store.portalUserprofile.userName;
      if (iportaluserName === "GUEST") {
        this.labelStorageFailedAnimation();
        return;
      }

      let iportalUpdateScene = window.store.portalUserprofile.modulePermissions;
      if (
        !iportalUpdateScene.includes("portal:user:createUpdateDeleteScenes") &&
        !iportalUpdateScene.includes("*")
      ) {
        this.labelPermissionsAnimation();
        return;
      }

      // 保存场景
      let url = getRootUrl() + "web/scenes.json";
      window.axios
        .post(url, JSON.stringify(saveData), { withCredentials: true })
        .then(function(response) {
          that.sceneID = response.data.newResourceID;
          //保存缩略图
          let putSceneUrl =
            getRootUrl() +
            "web/scenes/" +
            parseInt(response.data.newResourceID) +
            "/thumbnail.json";
          window
            .axios({
              method: "put",
              url: putSceneUrl,
              data: base64,
              headers: { "Content-type": "application/x-www-form-urlencoded" },
              withCredentials: true
            })
            .then(function(result) {
              //保存场景成功
              that.$Message.success(Resource.saveSceneSuccess);
              setTimeout(() => {
                that.showStorageScene("none");
                let currentUrl =
                  getRootUrl() +
                  "apps/earth/v2/index.html?id=" +
                  response.data.newResourceID;
                window.open(currentUrl, "_self");
              }, 1000);
            })
            .catch(function(error) {
              that.$Message.error(error.message);
            });
        });
    },
    //打开已保存的场景
    openExistScene() {
      let me = this;
      let openExistSceneUrl = window.location.href;
      let parmeter = openExistSceneUrl.split("id=")[1];
      me.sceneID = parmeter.split("&")[0];

      // me.sceneID = 2067108494;//检索权限的id
      // me.sceneID = 1686273792;//查看权限的id
      // http://localhost:8190/iportal/apps/earth/v2/index.html?id=652042515
      // me.sceneID = 652042515;

      // document.getElementById("storageScene").style.display = "none";
      me.showStorageScene("none");
      let url = getRootUrl() + "web/scenes/" + me.sceneID + ".json";

      window.axios
        .get(url, { withCredentials: true })
        // .get(url)
        .then(function(response) {
          if (response.status === 200) {
            let highestpermissionurl =
              getRootUrl() +
              "web/permissions/highestpermission.json?resourceIds=" +
              encodeURIComponent("[" + me.sceneID + "]") +
              "&resourceType=SCENE";

            window.axios
              // .get(highestpermissionurl)
              .get(highestpermissionurl, { withCredentials: true })
              .then(function(responseHigh) {
                if (responseHigh.data[me.sceneID] === "DELETE") {
                  // 编辑/删除，可以编辑保存
                  me.openScene(response);
                } else if (responseHigh.data[me.sceneID] === "READ") {
                  // 查看，能看到内容，不能编辑保存
                  me.openScene(response);
                  //隐藏按钮
                  document.getElementById("storageInfo").style.display = "none";
                } else {
                  // 私有 或者 检索，看不到内容
                  me.labelPermissionsAnimation();
                }
              });
          } else if (response.status === 401) {
            //无权限，未登录或者访问的是私有场景
            me.labelPermissionsAnimation();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    openScene(response) {
      let me = this;
      let content = JSON.parse(response.data.content);
      me.scenePortalName = response.data.name;
      me.scenePortalTages = response.data.tags.join(",");
      me.scenePortalUser = response.data.userName;
      me.scenePortalDescription = response.data.description;
      if (content) {
        if (JSON.stringify(content.layers) !== "{}") {
          //需要改动
          me.openS3M(content);
          me.openImagery(content);
          me.openTerrain(content);
        }
        let cameraX = content.camera.position.x;
        let cameraY = content.camera.position.y;
        let cameraZ = content.camera.position.z;
        setTimeout(function() {
          viewer.scene.camera.setView({
            destination: new Cesium.Cartesian3(cameraX, cameraY, cameraZ),
            orientation: {
              heading: content.camera.heading,
              pitch: content.camera.pitch,
              roll: content.camera.roll
            }
          });
        }, 3000);
      } else if (response.data.url) {
        let realspaceUrl = response.data.url;
        let index = realspaceUrl.indexOf("/scenes");
        realspaceUrl = realspaceUrl.substring(0, index);
        //模拟可以访问的地址
        // realspaceUrl =
        //   "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace";

        this.setTrustedServers(realspaceUrl);
        let promise = viewer.scene.open(realspaceUrl);
        Cesium.when(promise, function(layers) {
          //console.log(layers);
        });
      }
    },
    onSaveUserClk() {
      let isCreateScene = this.copyIsCreateScene;
      if (isCreateScene) {
        //true 创建并保存场景
        this.createAndSaveScene();
      } else {
        //false 更新场景
        this.updateScene();
      }
    },
    updateScene() {
      let that = this;
      let name = this.scenePortalName;
      let tags = this.scenePortalTages;
      let userName = this.scenePortalUser;
      let description = this.scenePortalDescription;

      if (name === "") {
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
        position: {
          x: camera.positionWC.x,
          y: camera.positionWC.y,
          z: camera.positionWC.z
        },
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      };
      data.environmentState = {
        enableLighting: viewer.scene.globe.enableLighting,
        skyAtmosphereShow: viewer.scene.skyAtmosphere.show,
        enableFog: viewer.scene.fog.enabled
      };
      data.version = "2.0";
      let saveData = {
        name: name,
        tags: tags,
        userName: userName,
        description: description,
        content: JSON.stringify(data)
      };

      let iportaluserName = window.store.portalUserprofile.userName;
      if (iportaluserName === "GUEST") {
        this.labelStorageFailedAnimation();
        return;
      }

      let iportalUpdateScene = window.store.portalUserprofile.modulePermissions;
      if (
        !iportalUpdateScene.includes("portal:user:createUpdateDeleteScenes") &&
        !iportalUpdateScene.includes("*")
      ) {
        this.labelPermissionsAnimation();
        return;
      }

      // 更新场景
      let url = getRootUrl() + "web/scenes/" + that.sceneID + ".json";
      window.axios
        .put(url, JSON.stringify(saveData), { withCredentials: true })
        .then(function(response) {
          //保存缩略图
          let putSceneUrl =
            getRootUrl() + "web/scenes/" + that.sceneID + "/thumbnail.json";
          window
            .axios({
              method: "put",
              url: putSceneUrl,
              data: base64,
              headers: { "Content-type": "application/x-www-form-urlencoded" },
              withCredentials: true
            })
            .then(function(result) {
              // document.getElementById("storageScene").style.display = "none";
              that.showStorageScene("none");
              let currentUrl =
                getRootUrl() + "apps/earth/v2/index.html?id=" + that.sceneID;
              window.open(currentUrl, "_self");
            })
            .catch(function(error) {});
        });
    },
    checkLayers(layers) {
      let s3mLayerlength = viewer.scene.layers._layers.length; //S3M图层
      layers["s3mLayer"] = this.saveS3M(layers, s3mLayerlength);

      let imageryLayer = viewer.imageryLayers._layers; //影像图层
      layers["imageryLayer"] = this.saveImagery(imageryLayer);

      layers["terrainLayer"] = this.saveTerrain(); //地形图层
    },
    saveS3M(layers, s3mLayerlength) {
      let s3mlayerUrl = [];
      for (let i = 0, j = s3mLayerlength; i < j; i++) {
        let s3mTypeAndUrl = {};
        let layer = viewer.scene.layers._layerQueue[i];
        s3mTypeAndUrl["type"] = "S3MTilesLayer";
        let layerUrl =
          layer._baseUri.scheme +
          "://" +
          layer._baseUri.authority +
          layer._baseUri.path;
        if (layerUrl) {
          layerUrl = this.getScpUrl(layerUrl);
          s3mTypeAndUrl["url"] = layerUrl;
          s3mTypeAndUrl["name"] = layer.name;
          s3mlayerUrl.push(s3mTypeAndUrl);
        }
      }
      return s3mlayerUrl;
    },
    saveImagery(imageryLayer) {
      let imageryLayerUrl = [];
      for (let j = 1; j < imageryLayer.length; j++) {
        let imageryTypeAndUrl = {};
        let provider = imageryLayer[j]._imageryProvider;
        if (provider instanceof Cesium.BingMapsImageryProvider) {
          imageryTypeAndUrl["type"] = "BingMapsImageryProvider";
        } else if (provider instanceof Cesium.TiandituImageryProvider) {
          imageryTypeAndUrl["type"] = "TiandituImageryProvider";
        } else if (provider instanceof Cesium.SingleTileImageryProvider) {
          imageryTypeAndUrl["type"] = "SingleTileImageryProvider";
        } else if (provider instanceof Cesium.SuperMapImageryProvider) {
          imageryTypeAndUrl["type"] = "SuperMapImageryProvider";
        } else {
          imageryTypeAndUrl["Type"] = "GRIDIMAGERY";
        }
        imageryTypeAndUrl["url"] =
          viewer.imageryLayers._layers[j]._imageryProvider._baseUrl;
        imageryLayerUrl.push(imageryTypeAndUrl);
      }
      return imageryLayerUrl;
    },
    saveTerrain() {
      let terrainLayer = viewer.terrainProvider.tablename; //地形图层
      let terrainLayerUrl = [];
      if (terrainLayer) {
        let terrainTypeAndUrl = {};
        let terrainProvider = viewer.terrainProvider;
        if (terrainProvider instanceof Cesium.CesiumTerrainProvider) {
          terrainTypeAndUrl["type"] = "tinTerrain";
        } else if (terrainProvider instanceof Cesium.TiandituTerrainProvider) {
          terrainTypeAndUrl["type"] = "tianDiTuTerrain";
        } else if (terrainProvider instanceof Cesium.SCTTerrainProvider) {
          terrainTypeAndUrl["type"] = "supermapOnlineTerrain";
        }
        terrainTypeAndUrl["url"] = viewer.terrainProvider._baseUrl;
        terrainLayerUrl.push(terrainTypeAndUrl);
      }
      return terrainLayerUrl;
    },
    openS3M(content) {
      let s3mlayer = content.layers.s3mLayer;
      if (s3mlayer.length > 0) {
        for (let t = 0; t < s3mlayer.length; t++) {
          let url = content.layers.s3mLayer[t].url;
          let name = content.layers.s3mLayer[t].name;
          this.setTrustedServers(url);
          viewer.scene.addS3MTilesLayerByScp(url, { name: name });
        }
      }
    },
    openImagery(content) {
      let imageryLayer = content.layers.imageryLayer;
      let imageryProvider;
      if (imageryLayer.length > 0) {
        let imageryLayerCollection = viewer.imageryLayers;
        for (let t = 1; t < imageryLayerCollection.length; t++) {
          imageryLayerCollection.remove(viewer.imageryLayers._layers[t]);
        }
        for (let i = 0; i < imageryLayer.length; i++) {
          let url = content.layers.imageryLayer[i].url;
          this.setTrustedServers(url);

          let imageryType = content.layers.imageryLayer[i].type;
          switch (imageryType) {
            case "BingMapsImageryProvider":
              imageryProvider = new Cesium.BingMapsImageryProvider({
                url: content.layers.imageryLayer[i].url,
                key: this.key
              });
              break;
            case "TiandituImageryProvider":
              imageryProvider = new Cesium.TiandituImageryProvider({
                url: content.layers.imageryLayer[i].url,
                token: this.token
              });
              break;
            case "SingleTileImageryProvider":
              imageryProvider = new Cesium.SingleTileImageryProvider({
                url: content.layers.imageryLayer[i].url
              });
              break;
            case "SuperMapImageryProvider":
              imageryProvider = new Cesium.SuperMapImageryProvider({
                url: content.layers.imageryLayer[i].url
              });
              break;
            case "GRIDIMAGERY":
              imageryProvider = new Cesium.TileCoordinatesImageryProvider();
              break;
          }
          viewer.imageryLayers.addImageryProvider(imageryProvider, i + 1);
        }
      }
    },
    openTerrain(content) {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
      let terrainLayer = content.layers.terrainLayer;
      if (terrainLayer.length > 0) {
        let terrainType = content.layers.terrainLayer[0].type;

        let url = content.layers.terrainLayer[0].url;
        this.setTrustedServers(url);

        switch (terrainType) {
          case "tinTerrain":
            viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
              url: content.layers.terrainLayer[0].url,
              isSct: true,
              invisibility: true
            });
            break;
          case "tianDiTuTerrain":
            viewer.terrainProvider = new Cesium.TiandituTerrainProvider({
              token: this.terrainToken
            });
            break;
          case "supermapOnlineTerrain":
            viewer.terrainProvider = new Cesium.SCTTerrainProvider({
              urls: [content.layers.terrainLayer[0].url]
            });
            break;
        }
      }
    },
    labelStorageFailedAnimation() {
      // document.getElementById("storageFailed").style.visibility = "visible";
      // document.getElementById("storageFailed").style.transition =
      //   "visibility 0s 0.2s,opacity 0.2s ease-in,transform 0.2s ease-in";
      // setTimeout(function() {
      //   document.getElementById("storageFailed").style.opacity = 0;
      // }, 2000);
      this.$Message.error(Resource.storageFailed);
    },
    labelPermissionsAnimation() {
      this.$Message.error(Resource.noPermission);

      // document.getElementById("noPermission").style.visibility = "visible";
      // document.getElementById("noPermission").style.transition =
      //   "visibility 0s 0.2s,opacity 0.2s ease-in,transform 0.2s ease-in";
      // setTimeout(function() {
      //   document.getElementById("noPermission").style.opacity = 0;
      // }, 2000);
    },
    getScpUrl(url) {
      let isRealspace = url.indexOf("/realspace") > -1;
      if (!isRealspace) {
        return;
      }

      let scpUrl = url.replace("data/path/", "config");
      return scpUrl;
    },
    // getUrl(url) {
    //   let isRealspace = url.indexOf("/realspace") > -1;
    //   if (!isRealspace) {
    //     return;
    //   }

    //   let afterRealspace = url.replace(/(.*realspace)/, "");
    //   let lastUrl = url
    //     .replace(/\/rest\/realspace/g, "")
    //     .replace(afterRealspace, "");
    //   return lastUrl + "/rest/realspace";
    // },
    //检查请求是否带cookie
    setTrustedServers(url) {
      let serviceProxy = window.store.portalConfig.serviceProxy;
      let withCredentials = isIportalProxyServiceUrl(url, serviceProxy);
      if (withCredentials) {
        let ip = getHostName(url);
        if (
          !Cesium.TrustedServers.contains(
            "http://" + ip + "/" + serviceProxy.port
          )
        ) {
          Cesium.TrustedServers.add(ip, serviceProxy.port);
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    isCreateScene(val) {
      this.copyIsCreateScene = val;
      let isCreateScene = this.copyIsCreateScene;
      if (!isCreateScene) {
        this.openExistScene();
      }
    }
  }
};
</script>

<style lang="scss"  scoped>
@import "infoManage";
</style>

