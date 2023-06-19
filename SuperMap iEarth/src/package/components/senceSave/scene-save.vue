<template>
  <!-- <div class="savePanleBox" v-show="layerTreeStore.showSaveDialog"> -->
  <n-modal v-model:show="layerTreeStore.showSaveDialog">
    <div class="savePanleBox">
      <n-card title="场景保存" closable @close="cancle">
        <n-spin size="small" :show="state.loadingShow">
          <canvas id="sceneCanvas" style="width: 100%; margin: 35px 0 10px 0" />
          <!-- 存储日期 -->
          <sm-rowLayOut contentMarginLeft="0.2rem">
            <template #item-lable>存储日期</template>
            <template #item-content>
              <n-input
                v-model:value="layerTreeStore.sceneCurrentTime"
                type="text"
              />
              <!-- <n-input v-model:value="GlobalStore.storageSceneCurrentTime" type="text" /> -->
            </template>
          </sm-rowLayOut>

          <!-- 场景名称 -->
          <sm-rowLayOut contentMarginLeft="0.2rem">
            <template #item-lable>场景名称</template>
            <template #item-content>
              <n-input
                v-model:value="state.scenePortalName"
                type="text"
                placeholder="请输入场景名称"
              />
            </template>
          </sm-rowLayOut>
          <!-- 场景标签 -->
          <sm-rowLayOut contentMarginLeft="0.2rem">
            <template #item-lable>场景标签</template>
            <template #item-content>
              <n-input
                v-model:value="state.scenePortalTages"
                type="text"
                placeholder="请输入场景标签"
              />
            </template>
          </sm-rowLayOut>
          <!-- 作者 -->
          <sm-rowLayOut contentMarginLeft="0.2rem">
            <template #item-lable>作者</template>
            <template #item-content>
              <n-input
                v-model:value="state.scenePortalUser"
                type="text"
                placeholder="请输入作者名"
              />
            </template>
          </sm-rowLayOut>

          <!-- 描述 -->
          <sm-rowLayOut contentMarginLeft="0.2rem">
            <template #item-lable>描述</template>
            <template #item-content>
              <n-input
                v-model:value="state.scenePortalDescription"
                type="text"
                placeholder="请输入描述"
              />
            </template>
          </sm-rowLayOut>

          <sm-btnGroup>
            <template #btn-left>
              <n-button
                type="info"
                color="#3499E5"
                text-color="#fff"
                @click="onSaveScene"
                >确认</n-button
              >
            </template>
            <template #btn-right>
              <n-button class="btn-secondary" @click="cancle">取消</n-button>
            </template>
          </sm-btnGroup>
        </n-spin>
      </n-card>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { GlobalStoreCreate } from "@/store/global/global";
import {
  getRootUrl,
  isIportalProxyServiceUrl,
  getHostName,
} from "@/tools/iportal/portalTools";
import layerManagement from "@/tools/layerManagement";

import { useLayerTreeStore } from "@/store/layerTreeStore/index";

const IportalStore = IportalStoreCreate();
const GlobalStore = GlobalStoreCreate();
const message = useMessage();
const layerTreeStore = useLayerTreeStore();

let state = reactive({
  storageSceneShow: false,
  storageSceneCurrentTime: "",
  scenePortalName: "",
  scenePortalTages: "",
  scenePortalUser: "",
  scenePortalDescription: "",
  sceneID: "",
  key: "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
  token: "7933ae29d47bcf1440889ad983dbe0af",
  terrainToken: "e90d56e5a09d1767899ad45846b0cefd",
  iportalToken:
    "?token=BTKYtyi2bsoLNUA2xn7nRg3V9IfETNnmskQhpsmCz8Q5ClFYCWGAMJSX1ESedBqCF1jFmHLY_20jhpHssvwNQg..",
  loadingShow: false,
});

// 保持场景
function onSaveScene() {
  let name = state.scenePortalName;
  let tagsArray = state.scenePortalTages.replace("，", ",").split(",");
  let userName = state.scenePortalUser;
  let description = state.scenePortalDescription;

  if (name === "") {
    message.warning("保存场景名称不能为空！");
    return;
  }

  let data: any = {};
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
      z: camera.positionWC.z,
    },
    heading: camera.heading,
    pitch: camera.pitch,
    roll: camera.roll,
  };
  data.environmentState = {
    enableLighting: viewer.scene.globe.enableLighting,
    skyAtmosphereShow: viewer.scene.skyAtmosphere.show,
    enableFog: viewer.scene.fog.enabled,
  };
  data.version = "2.0";
  let saveData = {
    name: name,
    tags: tagsArray,
    userName: userName,
    description: description,
    content: JSON.stringify(data),
  };

  // 保存场景
  let rootUrl = getRootUrl();
  console.log("rootUrl", rootUrl);
  let requestUrl = "/web/scenes.json";
  let contentUrl = rootUrl.includes("iportal")
    ? rootUrl + requestUrl
    : "/iportal" + requestUrl + state.iportalToken;

  state.loadingShow = true;

  window.axios
    .post(contentUrl, JSON.stringify(saveData), { withCredentials: true })
    .then(function (response) {
      state.sceneID = response.data.newResourceID;
      saveThumbnai(state.sceneID, base64);
    });
}
function saveThumbnai(id: any, base64: any) {
  //保存缩略图
  let requestUrl = "/web/scenes/" + parseInt(id) + "/thumbnail.json";
  let rootUrl = getRootUrl();
  let thumbnailUrl = rootUrl.includes("iportal")
    ? rootUrl + requestUrl
    : "/iportal" + requestUrl + state.iportalToken;

  window
    .axios({
      method: "put",
      url: thumbnailUrl,
      data: base64,
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    })
    .then(function () {
      message.success("场景保存成功！");
      state.loadingShow = false;
      clearInputContent();
      cancle();
    })
    .catch(function (error) {
      message.error(error.message.toString());
    });
}

function checkLayers() {
  let layers = {};

  let s3mLayerlength = viewer.scene.layers._layers.length; //S3M图层
  layers["s3mLayer"] = saveS3M(s3mLayerlength);

  let imageryLayer = viewer.imageryLayers._layers; //影像图层
  layers["imageryLayer"] = saveImagery(imageryLayer);

  layers["MVTLayer"] = saveMVT(); // MVT图层

  layers["terrainLayer"] = saveTerrain(); //地形图层

  return layers;
}

function saveS3M(s3mLayerlength) {
  let s3mlayerUrlList: any = [];

  // 在图层管理中，有些图层不勾选即不显示，就不保存到场景中
  let s3mLayerCheckedList: any[] = [];
  // GlobalStore.layerTreeCheckedKeys.s3mLayerCheckedList.forEach((item) =>
  //   s3mLayerCheckedList.push(item)
  // );

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

function saveImagery(imageryLayer) {
  let imageryLayerUrlList: string[] = [];

  // 在图层管理中，有些图层不勾选即不显示，就不保存到场景中
  let imageryLayerCheckedList: string[] = [];
  // GlobalStore.layerTreeCheckedKeys.imageryLayerCheckedList.forEach((item) =>
  //   imageryLayerCheckedList.push(item)
  // );

  for (let j = 1; j < imageryLayer.length; j++) {
    // if (imageryLayerCheckedList.indexOf(j.toString()) === -1) continue;

    let imageryTypeAndUrl: any = {};
    let provider = imageryLayer[j]._imageryProvider;

    if (provider._url) {
      imageryTypeAndUrl["url"] = provider._url;
    } else if (provider._resource) {
      imageryTypeAndUrl["url"] = provider._resource._url;
    } else {
      imageryTypeAndUrl["url"] = "";
    }

    if (provider instanceof Cesium.BingMapsImageryProvider) {
      imageryTypeAndUrl["type"] = "BingMapsImageryProvider";
      imageryTypeAndUrl["token"] = provider._token;
    } else if (provider instanceof Cesium.TiandituImageryProvider) {
      imageryTypeAndUrl["type"] = "TiandituImageryProvider";
    } else if (provider instanceof Cesium.SingleTileImageryProvider) {
      imageryTypeAndUrl["type"] = "SingleTileImageryProvider";
    } else if (provider instanceof Cesium.SuperMapImageryProvider) {
      imageryTypeAndUrl["type"] = "SuperMapImageryProvider";
    } else if (provider instanceof Cesium.UrlTemplateImageryProvider) {
      imageryTypeAndUrl["type"] = "UrlTemplateImageryProvider";
    } else if (provider instanceof Cesium.TileCoordinatesImageryProvider) {
      imageryTypeAndUrl["type"] = "GRIDIMAGERY";
    }

    imageryLayerUrlList.push(imageryTypeAndUrl);
  }
  return imageryLayerUrlList;
}

function saveMVT() {
  let mvtLayerUrlList: any[] = [];

  // 在图层管理中，有些图层不勾选即不显示，就不保存到场景中
  let mvtLayerCheckedList: string[] = [];
  // GlobalStore.layerTreeCheckedKeys.mvtLayerCheckedList.forEach((item) =>
  //   mvtLayerCheckedList.push(item)
  // );

  for (let k = 0; k < viewer.scene._vectorTileMaps._layerQueue.length; k++) {
    // if (mvtLayerCheckedList.indexOf(k.toString()) === -1) continue;

    let mvtLayer = viewer.scene._vectorTileMaps._layerQueue[k];
    if (mvtLayer._provider) {
      let obj = {
        url: mvtLayer._provider.tablename,
        name: mvtLayer._name,
      };
      mvtLayerUrlList.push(obj);
    }
  }

  return mvtLayerUrlList;
}

function saveTerrain() {
  let terrainProvider = viewer.terrainProvider;
  let terrainLayer; //地形图层
  if (terrainProvider._urls) {
    terrainLayer = terrainProvider._urls[0];
  } else if (terrainProvider._baseUrl) {
    terrainLayer = terrainProvider._baseUrl;
  } else {
    terrainLayer = false;
  }
  let terrainLayerUrl: any = [];
  if (terrainLayer) {
    let terrainTypeAndUrl = {};
    // if (terrainProvider instanceof Cesium.CesiumTerrainProvider) {
    if (terrainProvider instanceof Cesium.SuperMapTerrainProvider) {
      terrainTypeAndUrl["type"] = "StkTerrain";
    } else if (terrainProvider instanceof Cesium.TiandituTerrainProvider) {
      terrainTypeAndUrl["type"] = "tianDiTuTerrain";
    } else if (terrainProvider instanceof Cesium.SCTTerrainProvider) {
      terrainTypeAndUrl["type"] = "supermapOnlineTerrain";
    }
    terrainTypeAndUrl["url"] = terrainLayer;
    // terrainTypeAndUrl['name'] = window['$t'](terrainProvider.name);
    terrainTypeAndUrl['name'] = terrainProvider.name;
    terrainLayerUrl.push(terrainTypeAndUrl);
  }
  return terrainLayerUrl;
}

function getScpUrl(url: string) {
  let isRealspace = url.indexOf("/realspace") > -1;
  if (!isRealspace) {
    return;
  }

  let scpUrl = url.replace("data/path/", "config");
  return scpUrl;
}

// 关闭弹窗
function cancle() {
  layerTreeStore.setShowSaveDialog(false);
  clearInputContent();
}

// 清空保存弹窗内容
function clearInputContent() {
  state.scenePortalName = "";
  state.scenePortalTages = "";
  state.scenePortalUser = "";
  state.scenePortalDescription = "";
  state.sceneID = "";
}
</script>

<style lang="scss"  scoped>
.savePanleBox {
  text-align: center;
  background-color: #fff;
  border-radius: 20px;
  width: 400px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -50%);
}
</style>