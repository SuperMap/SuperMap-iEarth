<script src="../../../../../iportal-iEarth/.postcssrc.js"></script>
<template>
  <div class="sm-function-module-content" v-show="customServiceShow">
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.OpenLayer }}</label>
      <select class="sm-select" v-model="LayerType">
        <option value="S3M">{{ Resource.s3mLayer }}</option>
        <option value="IMAGERY">{{ Resource.imageryLayer }}</option>
        <option value="TERRAIN">{{ Resource.terrainLayer }}</option>
        <option value="ArcGISMapServer">{{ Resource.ArcGISMapServer }}</option>
        <option value="ArcGISCSCS2000">{{ Resource.ArcGISCSCS2000 }}</option>
      </select>
      <div class="token">
        <label>{{ Resource.addToken }}</label>
        <input style="margin-left: 10px" type="checkbox" v-model="addToken" />
      </div>
      <input class="sm-input" type="text" :placeholder="holderURL" v-model="LayerURL" />
      <input class="sm-input" type="text" :placeholder="holderName" v-model="LayerName" />
      <input class="sm-input" type="text" :placeholder="Resource.addToken" v-show="addToken" v-model="LayerToken" />
      <div class="boxchild">
        <button class="tbtn tbn1" type="button" @click="openLayer">{{ Resource.confirm }}</button>
      </div>

      <label class="label-container">{{ Resource.OpenScene }}</label>
      <label>{{ Resource.addToken }}</label>
      <input style="margin-left: 10px" type="checkbox" v-model="addSceneToken" />
      <input class="sm-input" type="text" :placeholder="Resource.sceneUrl" v-model="SceneURL" />
      <input class="sm-input" type="text" :placeholder="Resource.addToken" v-show="addSceneToken" v-model="SceneToken" />

      <select class="sm-select sm-sceneList" v-model="SceneName">
        <option v-for="(option, index) in SceneList" :value="option.name" :key="index">{{ option.name }}</option>
      </select>
      <div class="boxchild">
        <button class="tbtn tbn1" type="button" @click="openScene">{{ Resource.confirm }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// let layerLen;
//引入portal处理公共类
import {
  getRootUrl,
  isIportalProxyServiceUrl,
  getHostName
} from "../../../common/js/portalTools";

export default {
  name: "addCustomService",
  data() {
    return {
      sharedState: store.state,
      LayerType: "S3M",
      addToken: false,
      LayerURL: null,
      LayerName: null,
      holderURL: Resource.layerUrl,
      holderName: Resource.layerName,
      LayerToken: null,
      addSceneToken: false,
      SceneURL: null,
      SceneToken: null,
      SceneList: null,
      SceneName: undefined
    };
  },
  mounted() {
    // this.LayerURL = Resource.layerUrl;
  },
  computed: {
    customServiceShow: function() {
      return this.sharedState.addLayer[2];
    }
  },
  methods: {
    // 添加自定义场景
    openScene() {
      if (this.SceneURL == null || this.SceneURL == "") {
        this.$Message.error(Resource.urlNotNullMsg);
        return;
      }
      // 检查地址是否正确
      if (this.SceneURL.indexOf("rest/realspace") < 0) {
        this.$Message.error(Resource.urlErrorMsg);
        return;
      }
      //去引号
      if (this.SceneURL.charAt(0) == '"' || this.SceneURL.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        this.SceneURL = this.SceneURL.replace(reg, "$1");
      }
      if (this.SceneToken) {
        Cesium.Credential.CREDENTIAL = new Cesium.Credential(this.SceneToken);
      }

      this.$emit("childEvent");

      if (viewer) {
        let s;
        let promiseArray = [];
        this.setTrustedServers(this.SceneURL);

        s = viewer.scene.open(this.SceneURL, this.SceneName);
        promiseArray.push(s);
        this.promiseWhen(promiseArray);
      }
    },
    // 打开自定义图层
    openLayer() {
      if (this.LayerURL == null || this.LayerURL == "") {
        this.$Message.error(Resource.urlNotNullMsg);
        return;
      }
      //检测地址正确性
      switch (this.LayerType) {
        case "S3M":
          if (this.LayerURL.indexOf("/rest/realspace/datas/") < 0) {
            this.$Message.error(Resource.urlErrorMsg);
            return;
          }
          break;
        case "IMAGERY":
          if (
            this.LayerURL.indexOf("/rest/realspace/datas/") < 0 &&
            this.LayerURL.indexOf("/rest/maps/") < 0
          ) {
            this.$Message.error(Resource.urlErrorMsg);
            return;
          }
          break;
        case "TERRAIN":
          if (this.LayerURL.indexOf("/rest/realspace/datas/") < 0) {
            this.$Message.error(Resource.urlErrorMsg);
            return;
          }
          break;
        case "ArcGISMapServer":
          if (this.LayerURL.indexOf(".arcgisonline") < 0) {
            this.$Message.error(Resource.urlErrorMsg);
            return;
          }
          break;
        case "ArcGISCSCS2000":
          if (this.LayerURL.indexOf(".arcgisonline") < 0) {
            this.$Message.error(Resource.urlErrorMsg);
            return;
          }
          break;
      }
      if (this.LayerURL.charAt(0) == '"' || this.LayerURL.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        this.LayerURL = this.LayerURL.replace(reg, "$1");
      }
      if (this.LayerToken) {
        Cesium.Credential.CREDENTIAL = new Cesium.Credential(this.LayerToken);
      }

      this.setTrustedServers(this.LayerURL);

      switch (this.LayerType) {
        case "S3M":
          this.addS3M(this.LayerURL);
          break;
        case "IMAGERY":
          this.addImage(this.LayerURL);
          break;
        case "TERRAIN":
          this.addTerrain(this.LayerURL);
          break;
        case "ArcGISMapServer":
          this.addArcGISMapServe(this.LayerURL);
          break;
        case "ArcGISCSCS2000":
          this.addArcGISCGCS2000(this.LayerURL);
          break;
        default:
          store.setAnalysisAction([0, 0, 0, 0, 1]);
      }
    },
    addS3M(LayerURL) {
      let promiseArray = [];
      let options = {};
      if (this.LayerName) {
        options.name = this.LayerName;
      } else {
        this.$Message.warning(Resource.layerNameNotNullMsg);
        return;
      }
      // layerLen = viewer.scene.layers.layerQueue.length;
      this.setTrustedServers(LayerURL);
      promiseArray.push(viewer.scene.addS3MTilesLayerByScp(LayerURL, options));
      this.promiseWhen(promiseArray, true);
    },

    addTerrain(LayerURL) {
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: LayerURL,
        isSct: true //地形服务源自SuperMap iServer发布时需设置isSct为true
      });

      //飞行定位到地形范围
      let terrainProvider = viewer.terrainProvider;
      terrainProvider.readyPromise.then(() => {
        const bounds = terrainProvider._bounds;
        const destination = new window.Cesium.Rectangle.fromDegrees(
          bounds.west,
          bounds.south,
          bounds.east,
          bounds.north
        );
        viewer.scene.camera.flyTo({
          destination
        });
      });

      setTimeout(() => {
        //更新图层
        store.setTerrainLayerManage(viewer.terrainProvider);
      }, 1500);
    },

    addArcGISMapServe(LayerURL){
      // console.log("arcgis-LayerURL:",LayerURL);
      //方式一：通过ArcGisMapServerImageryProvideri接口，但不支持CGCS2000坐标系
      var layer = viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
          url: LayerURL
      }));
      viewer.flyTo(layer);


    },
    addArcGISCGCS2000(LayerURL){
      // console.log("arcgis-LayerURL:",LayerURL);
      //方式二：通过CGCS2000MapServerImageryProvideri接口，支持CGCS2000、WGS84、全球墨卡托等坐标系
      var layer = viewer.imageryLayers.addImageryProvider(new Cesium.CGCS2000MapServerImageryProvider({
          url: LayerURL,
      }));
      viewer.flyTo(layer);
    },

    addImage(LayerURL) {
      var layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: LayerURL
        })
      );
      viewer.flyTo(layer);
      setTimeout(() => {
        //更新图层
        store.setImgLayerManage(viewer.imageryLayers._layers.length);
      }, 1500);
    },

    promiseWhen(promiseArray, isSCP) {
      Cesium.when.all(
        promiseArray,
        function(layers) {
          let s3mLayerName;
          for (let i = 0; i < layers.length; i++) {
            layers[i]._visibleDistanceMax = 16000;
            s3mLayerName = layers[i].name;
          }
          setTimeout(() => {
            //更新图层
            store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
            store.setImgLayerManage(viewer.imageryLayers._layers.length);
            store.setTerrainLayerManage(viewer.terrainProvider);
          }, 500);
          if (isSCP && s3mLayerName) {
            viewer.flyTo(scene.layers.find(s3mLayerName));
          }
        },
        function(e) {
          if (widget._showRenderLoopErrors) {
            let title = Resource.scpUrlErrorMsg;
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    },
    //检查请求是否带cookie
    setTrustedServers(url) {
      if (window.store.isPortal) {
        if (window.store.portalConfig) {
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
      }
    },
    childEvent() {}
  },
  watch: {
    LayerName(val){
      if(val){
        window.store.customLayerName = val;
      }
    },
    LayerType(val) {
      if (val) {
        switch (this.LayerType) {
          case "S3M":
            this.holderURL = Resource.layerUrl;
            this.holderName = Resource.layerName;
            // this.LayerURL = Resource.layerUrl;
            break;
          case "IMAGERY":
            this.holderURL = Resource.imageUrl;
            // this.LayerURL = Resource.imageUrl;
            break;
          case "TERRAIN":
            this.holderURL = Resource.terrainUrl;
            // this.LayerURL = Resource.terrainUrl;
            break;
          default:
            break;
        }
      }
    },
    LayerURL(val) {
      if (val) {
        if(val.indexOf("/datas/") != -1){
          let array = val.split("/datas/");
          if (array.length > 1) {
            this.LayerName = array[1].split("/")[0];
          } else {
            //rest地图服务
            let array = val.split("/rest/maps/");
            if (array.length > 1) {
              this.LayerName = array[1].split("/")[0];
            }
          }
        }

        if(this.LayerType === 'ArcGISMapServer' || this.LayerType === 'ArcGISCSCS2000'){
          this.LayerName = val.split("/services/")[1].split("/")[0];
        }
      }
    },
    SceneURL(val) {
      if (val) {
        //处理realspace带有/
        if (val.slice(-14) === "rest/realspace") {
          let url = val.split("rest/realspace")[0] + "rest/realspace";
          let scenesUrl = url + "/scenes.json";

          let sceneListPromise = window.axios.get(scenesUrl, {
            //需要cookie验证
            withCredentials: window.store.isPortal
          });

          sceneListPromise.then(results => {
            this.SceneList = results.data;
            this.SceneName = this.SceneList[0].name;
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./CustomServicePan.scss";
</style>
