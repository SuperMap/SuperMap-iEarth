<template>
  <!-- <div class="savePanleBox" v-if="panelStore.showSavePanel"> -->
  <n-modal v-model:show="panelStore.showSavePanel">
    <n-card style="width: 600px" title="场景保存" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <!-- <n-spin size="small" :show="state.loadingShow"> -->
        <div class="save-scene-container">
          <canvas id="sceneCanvas" style="width:100%;margin:35px 0 10px 0;" />

          <div class="row-item">
            <span>存储日期</span>
            <n-input style="width: 2.2rem" v-model:value="state.storageSceneCurrentTime" type="text" />
          </div>
          <div class="row-item">
            <span>场景名称</span>
            <n-input style="width: 2.2rem" v-model:value="state.scenePortalName" type="text" />
          </div>
          <div class="row-item">
            <span>场景标签</span>
            <n-input style="width: 2.2rem" v-model:value="state.scenePortalTages" type="text" />
          </div>
          <div class="row-item">
            <span>作者</span>
            <n-input style="width: 2.2rem" v-model:value="state.scenePortalUser" type="text" />
          </div>
          <div class="row-item">
            <span>描述</span>
            <n-input style="width: 2.2rem" v-model:value="state.scenePortalDescription" type="text" />
          </div>

          <div class="btn-row-item">
 
            <div class="btn-row-item">
              <n-button type="info" color="#3499E5" text-color="#fff" class="ans-btn" @click="onSaveUserClk">确认</n-button>
              <n-button class="btn-secondary" @click="close">关闭</n-button>
              <!-- <n-button class="btn-secondary" @click="checkSelelctOption">查看</n-button> -->
            </div>
          </div>
        </div>
      <!-- </n-spin> -->
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue"
import { useMessage } from "naive-ui"
import { IportalStoreCreate } from "@/store/index";
import { usePanelStore } from "@/store/panelStore/index";
import { getRootUrl} from "@/tools/iportal/portalTools";
import { useLayerStore } from "@/store/layerStore";

const IportalStore = IportalStoreCreate();
const panelStore = usePanelStore();
const message = useMessage();
const layerStore = useLayerStore();

// 初始化数据
let state = reactive({
  storageSceneShow: false,
  storageSceneCurrentTime: '',
  scenePortalName: '',
  scenePortalTages: '',
  scenePortalUser: "",
  scenePortalDescription: '',
  sceneID: '',

  key: "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
  token: "7933ae29d47bcf1440889ad983dbe0af",
  terrainToken: "e90d56e5a09d1767899ad45846b0cefd",

  loadingShow: false,// 模态框
})

// 关闭保存面板
function close() {
  panelStore.showSavePanel = false;
}

// 获取当前时间
function getNowFormatDate() {
  let date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month: any = date.getMonth() + 1;
  let strDate: any = date.getDate();
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
}

// 点击执行保存
function onSaveUserClk() {
  let isCreateScene = IportalStore.isCreateScene;
  console.log("save-open-click-isCreateScene:", isCreateScene)

  if (isCreateScene) {
    //true 创建并保存场景
    createAndSaveScene();
  } else {
    //false 更新场景
    updateScene();
  }
}

// 将所有图层汇总到layers
function checkLayers() {
  let layers = {}

  let s3mLayerlength = viewer.scene.layers._layers.length; //S3M图层
  layers["s3mLayer"] = saveS3M(s3mLayerlength);

  let imageryLayer = viewer.imageryLayers._layers; //影像图层
  layers["imageryLayer"] = saveImagery(imageryLayer);

  layers["MVTLayer"] = saveMVT(); // MVT图层

  layers["terrainLayer"] = saveTerrain(); //地形图层

  layers["SelectedOptions"] =  layerStore.SelectedOptions;

  return layers;
}

// 获取s3m图层的ScpUrl
function getScpUrl(url: string) {
  let isRealspace = url.indexOf("/realspace") > -1;
  if (!isRealspace) {
    return;
  }

  let scpUrl = url.replace("data/path/", "config");
  return scpUrl;
}

// 保存S3M
function saveS3M(s3mLayerlength:number) {
  let s3mlayerUrlList: any = [];

  // // 在图层管理中，有些图层不勾选即不显示，就不保存到场景中
  // let s3mLayerCheckedList: any[] = [];
  // GlobalStore.layerTreeCheckedKeys.s3mLayerCheckedList.forEach(item => s3mLayerCheckedList.push(item));

  for (let i = 0, j = s3mLayerlength; i < j; i++) {
    let s3mTypeAndUrl: any = {};
    let layer = viewer.scene.layers._layerQueue[i];

    // if (s3mLayerCheckedList.indexOf(i.toString()) === -1) continue;

    s3mTypeAndUrl["type"] = "S3MTilesLayer";
    let layerUrl: any =
      layer._baseUri.scheme +
      "://" +
      layer._baseUri.authority +
      layer._baseUri.path;
    if (layerUrl) {
      layerUrl = getScpUrl(layerUrl);
      s3mTypeAndUrl["url"] = layerUrl;
      s3mTypeAndUrl["name"] = layer.name;
      s3mlayerUrlList.push(s3mTypeAndUrl);
    }
  }
  return s3mlayerUrlList;
}

// 保存影像
function saveImagery(imageryLayer:any) {
  let imageryLayerUrlList: string[] = [];

  // // 在图层管理中，有些图层不勾选即不显示，就不保存到场景中
  // let imageryLayerCheckedList: string[] = [];
  // GlobalStore.layerTreeCheckedKeys.imageryLayerCheckedList.forEach(item => imageryLayerCheckedList.push(item));

  for (let j = 0; j < imageryLayer.length; j++) {
    // if (imageryLayerCheckedList.indexOf(j.toString()) === -1) continue;

    let imageryTypeAndUrl: any = {};
    let provider = imageryLayer[j]._imageryProvider;

    if (provider._url) {
      imageryTypeAndUrl["url"] = provider._url
    } else if (provider._resource) {
      imageryTypeAndUrl["url"] = provider._resource._url
    } else {
      imageryTypeAndUrl["url"] = "";
    }

    if (provider instanceof SuperMap3D.BingMapsImageryProvider) {
      imageryTypeAndUrl["type"] = "BingMapsImageryProvider";
      imageryTypeAndUrl["token"] = provider._token
    } else if (provider instanceof SuperMap3D.TiandituImageryProvider) {
      imageryTypeAndUrl["type"] = "TiandituImageryProvider";
    } else if (provider instanceof SuperMap3D.SingleTileImageryProvider) {
      imageryTypeAndUrl["type"] = "SingleTileImageryProvider";
    } else if (provider instanceof SuperMap3D.SuperMapImageryProvider) {
      imageryTypeAndUrl["type"] = "SuperMapImageryProvider";
    } else if (provider instanceof SuperMap3D.UrlTemplateImageryProvider) {
      imageryTypeAndUrl["type"] = "UrlTemplateImageryProvider";
    } else if (provider instanceof SuperMap3D.TileCoordinatesImageryProvider) {
      imageryTypeAndUrl["type"] = "GRIDIMAGERY";
    }

    imageryLayerUrlList.push(imageryTypeAndUrl);
  }
  return imageryLayerUrlList;
}

// 保存MVT
function saveMVT() {
  let mvtLayerUrlList: any[] = [];

  // // 在图层管理中，有些图层不勾选即不显示，就不保存到场景中
  // let mvtLayerCheckedList: string[] = [];
  // GlobalStore.layerTreeCheckedKeys.mvtLayerCheckedList.forEach(item => mvtLayerCheckedList.push(item));

  for (let k = 0; k < viewer.scene._vectorTileMaps._layerQueue.length; k++) {
    // if (mvtLayerCheckedList.indexOf(k.toString()) === -1) continue;

    let mvtLayer = viewer.scene._vectorTileMaps._layerQueue[k];
    if (mvtLayer._provider) {
      let obj = {
        url: mvtLayer._provider.tablename,
        name: mvtLayer._name
      }
      mvtLayerUrlList.push(obj);
    }
  }

  return mvtLayerUrlList;
}

// 保存地形
function saveTerrain() {
  let terrainProvider = viewer.terrainProvider;
  let terrainLayer; //地形图层
  if (terrainProvider._urls) {
    terrainLayer = terrainProvider._urls[0];
  } else if (terrainProvider._baseUrl) {
    terrainLayer = terrainProvider._baseUrl
  } else {
    terrainLayer = false
  }
  let terrainLayerUrl: any = [];
  if (terrainLayer) {
    let terrainTypeAndUrl = {};
    if (terrainProvider instanceof SuperMap3D.SuperMapTerrainProvider) {
      terrainTypeAndUrl["type"] = "StkTerrain";
    } else if (terrainProvider instanceof SuperMap3D.TiandituTerrainProvider) {
      terrainTypeAndUrl["type"] = "tianDiTuTerrain";
    } else if (terrainProvider instanceof SuperMap3D.SCTTerrainProvider) {
      terrainTypeAndUrl["type"] = "supermapOnlineTerrain";
    }
    terrainTypeAndUrl["url"] = terrainLayer;
    terrainLayerUrl.push(terrainTypeAndUrl);
  }
  return terrainLayerUrl;
}
//创建并保存场景
function createAndSaveScene() {
  // let that = this;
  let name = state.scenePortalName;
  let tagsArray = state.scenePortalTages.replace("，", ",").split(",");
  let userName = state.scenePortalUser;
  let description = state.scenePortalDescription;

  if (name === "") {
    message.warning("保存场景名称不能为空！");
    return;
  }

  let data: any = {};
  // data.layers = {};
  //检查该图层对应于S3M、Terrain、Imagery
  data.layers = checkLayers();

  let canvas: any = document.getElementById("sceneCanvas");
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
  // data.SelectedOptions = layerStore.SelectedOptions; // 打开场景后无法返回该SelectedOptions属性
  let saveData = {
    name: name,
    tags: tagsArray,
    userName: userName,
    description: description,
    content: JSON.stringify(data)
  };

  let iportaluserName = IportalStore.portalUserprofile.userName;
  if (iportaluserName === "GUEST") {
    message.error("存储失败,请先登录iPortal或Online账户......");
    return;
  }

  // modulePermissions : [true]
  let iportalUpdateScene = IportalStore.portalUserprofile.modulePermissions[0];
  if (iportalUpdateScene != true) {
    message.error("存储失败,请先登录iPortal或Online账户......");
    return;
  }

  // 之前的，这里始终接口好像有变化，暂时不用，不然部署保存打开会有问题
  // let iportalUpdateScene = IportalStore.portalUserprofile.modulePermissions;
  // console.log("save-iportalUpdateScene:",iportalUpdateScene);
  // if (
  //   !iportalUpdateScene.includes("portal:user:createUpdateDeleteScenes") &&
  //   !iportalUpdateScene.includes("*")
  // ) {
  //   message.error("存储失败,请先登录iPortal或Online账户......");
  //   return;
  // }

  // 保存场景
  let url = getRootUrl() + "web/scenes.json";

  window.axios
    .post(url, JSON.stringify(saveData), { withCredentials: true })
    .then(function (response) {

      state.sceneID = response.data.newResourceID;
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
        .then(function () {

          message.success("场景保存成功！");
          panelStore.showSavePanel = false;
          setTimeout(() => {
            let currentUrl =
              getRootUrl() +
              "apps/earth/v2/index.html?id=" +
              response.data.newResourceID;
              // console.log("currentUrl:",currentUrl)
            window.open(currentUrl, "_self");
          }, 1000);
        })
        .catch(function (error) {
          message.error(error.message.toString());
        });
    });
}

// 更新保存场景的信息
function updateScene() {
  let name = state.scenePortalName;
  let tagsArray = state.scenePortalTages.replace("，", ",").split(",");
  let userName = state.scenePortalUser;
  let description = state.scenePortalDescription;
  let openExistSceneUrl = window.location.href;
  let parmeter = openExistSceneUrl.split("id=")[1];
  state.sceneID = parmeter.split("&")[0];

  if (name === "") {
    return;
  }

  let data: any = {};
  data.layers = checkLayers();

  let canvas: any = document.getElementById("sceneCanvas");
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
    tags: tagsArray,
    userName: userName,
    description: description,
    content: JSON.stringify(data)
  };


  let iportaluserName = IportalStore.portalUserprofile.userName;
  if (iportaluserName === "GUEST") {
    message.error("存储失败,请先登录iPortal或Online账户......");
    return;
  }

  // modulePermissions : [true]
  let iportalUpdateScene = IportalStore.portalUserprofile.modulePermissions[0];
  if (iportalUpdateScene != true) {
    message.error("存储失败,请先登录iPortal或Online账户......");
    return;
  }

  // 更新场景
  let url = getRootUrl() + "web/scenes/" + state.sceneID + ".json";
  window.axios
    .put(url, JSON.stringify(saveData), { withCredentials: true })
    .then(function () {
      //保存缩略图
      let putSceneUrl =
        getRootUrl() + "web/scenes/" + state.sceneID + "/thumbnail.json";
      window
        .axios({
          method: "put",
          url: putSceneUrl,
          data: base64,
          headers: { "Content-type": "application/x-www-form-urlencoded" },
          withCredentials: true
        })
        .then(function () {
          panelStore.showSavePanel = false;
          message.success("场景更新成功！");
          let currentUrl =
            getRootUrl() + "apps/earth/v2/index.html?id=" + state.sceneID;
            // console.log("currentUrl:",currentUrl)
          window.open(currentUrl, "_self");
        })
        .catch(function (error) {
          console.log(error)
        });
    });
}
watch(() => panelStore.showSavePanel, () => {
  state.storageSceneCurrentTime = getNowFormatDate();
  console.log("IportalStore.saveInfo-watch:",IportalStore.saveInfo);
  state.scenePortalUser = IportalStore.userInfo.userName;
  if(IportalStore.saveInfo){
      state.scenePortalName = IportalStore.saveInfo.scenePortalName;
      state.scenePortalTages = IportalStore.saveInfo.scenePortalTages;
      state.scenePortalUser = IportalStore.saveInfo.scenePortalUser;
      state.scenePortalDescription = IportalStore.saveInfo.scenePortalDescription;
    }
})

</script>

<style lang="scss"  scoped>
.save-scene-container {
  padding: 0 0.5rem;
  box-sizing: border-box;
}

.btn-row-item{
  margin-left: 0.83rem;
}
</style>