<template>
  <n-modal v-model:show="panelStore.showSavePanel">
    <n-card
      style="width: 4rem; text-align: center"
      :title="$t('sceneSave')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="save-scene-container">
        <canvas id="sceneCanvas" />
        <n-form
          ref="formRef"
          :model="fromData"
          label-placement="left"
          require-mark-placement="right-hanging"
          :style="{ maxWidth: '4.5rem' }"
        >
          <n-form-item
            label-width="0.8rem"
            :label="$t('saveDate')"
            path="storageSceneCurrentTime"
            :rule="{
              required: false,
              trigger: ['input', 'blur'],
            }"
          >
            <n-input
              v-model:value="fromData.storageSceneCurrentTime"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('sceneName')"
            path="scenePortalName"
            :rule="{
              required: true,
              trigger: ['input', 'blur'],
              // message: 'Must Option',
              renderMessage: () => {
                if (language == 'zh') {
                  return '必选项';
                } else if (language == 'ja') {
                  return '必須オプション';
                } else {
                  return 'Must Option';
                }
              },
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalName"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('sceneLable')"
            path="scenePortalTages"
            :rule="{
              required: true,
              trigger: ['input', 'blur'],
              renderMessage: () => {
                if (language == 'zh') {
                  return '必选项';
                } else if (language == 'ja') {
                  return '必須オプション';
                } else {
                  return 'Must Option';
                }
              },
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalTages"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('authorName')"
            path="scenePortalUser"
            :rule="{
              required: false,
              trigger: ['input', 'blur'],
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalUser"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item
            label-width="0.8rem"
            :label="$t('sceneDescribe')"
            path="scenePortalDescription"
            :rule="{
              required: false,
              trigger: ['input', 'blur'],
            }"
          >
            <n-input
              v-model:value="fromData.scenePortalDescription"
              :placeholder="$t('placeHolder')"
              clearable
            />
          </n-form-item>

          <n-form-item>
            <n-space justify="space-between">
              <n-button
                type="info"
                color="#3499E5"
                :loading="state.isloading"
                text-color="#fff"
                attr-type="button"
                @click="onSaveUserClk"
              >
                {{ $t("save") }}
              </n-button>
              <n-button attr-type="button" @click="close">
                {{ $t("cancle") }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from "vue";
import { useMessage } from "naive-ui";
import { IportalStoreCreate } from "@/store/index";
import { usePanelStore } from "@/store/panelStore/index";
import { getRootUrl } from "@/tools/iportal/portalTools";
import { useLayerStore } from "@/store/layerStore/layer";
import i18n from "@/locale/index";

const IportalStore = IportalStoreCreate();
const panelStore = usePanelStore();
const layerStore = useLayerStore();
const message = useMessage();

let language = computed(() => {
  return i18n.global.locale;
});

// 初始化变量
let state = reactive({
  storageSceneShow: false,
  sceneID: "",
  loadingShow: false, // 模态框
  isloading: false,
});

// 表格数据
let fromData = reactive({
  storageSceneCurrentTime: "",
  scenePortalName: "",
  scenePortalTages: "",
  scenePortalUser: "",
  scenePortalDescription: "",
});

// 关闭保存面板
function close() {
  panelStore.showSavePanel = false;
  state.isloading = false;
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
  let layers = {};

  let s3mLayerlength = viewer.scene.layers._layers.length; //S3M图层
  layers["s3mLayer"] = saveS3M(s3mLayerlength);

  let imageryLayer = viewer.imageryLayers._layers; //影像图层
  layers["imageryLayer"] = saveImagery(imageryLayer);

  layers["MVTLayer"] = saveMVT(); // MVT图层

  layers["terrainLayer"] = saveTerrain(); //地形图层

  layers["SelectedOptions"] = layerStore.SelectedOptions; // 选择的项目

  layers["layerQueryOptions"] = layerStore.layerQueryOptions; // s3m图层绑定的查询数据源信息

  layers["mapQueryOptions"] = layerStore.mapQueryOptions; // 地图查询绑定的数据源信息

  layers["mediaFeildOptions"] = layerStore.mediaFeildOptions; // 地图查询中媒体字段的绑定信息

  layers["sceneAttrState"] = layerStore.sceneAttrState; // 场景属性状态

  layers["particleOptions"] = layerStore.particleOptions; // 三维特效 - 粒子

  layers["layerStyleOptions"] = layerStore.layerStyleOptions; // s3m图层风格

  layers["wmtsLayerOption"] = layerStore.wmtsLayerOption; // wmts服务

  layers["layerTreeAlias"] = layerStore.layerTreeAlias; // 图层列表别名

  layers["baseMapOption"] = layerStore.baseMapOption; // 默认底图选项

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
function saveS3M(s3mLayerlength: number) {
  let s3mlayerUrlList: any = [];
  for (let i = 0, j = s3mLayerlength; i < j; i++) {
    let s3mTypeAndUrl: any = {};
    let layer = viewer.scene.layers._layerQueue[i];
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
      if (layer.bindName) {
        s3mTypeAndUrl["bindName"] = layer.bindName;
      }
      if(layer._urlArguments && layer._urlArguments.token){ // 保持S3M图层token
        s3mTypeAndUrl["token"] = layer._urlArguments.token;
      }
      s3mlayerUrlList.push(s3mTypeAndUrl);
    }
  }
  return s3mlayerUrlList;
}

// 保存影像
function saveImagery(imageryLayer: any) {
  let imageryLayerUrlList: string[] = [];
  for (let j = 0; j < imageryLayer.length; j++) {
    let imageryTypeAndUrl: any = {};
    let provider = imageryLayer[j]._imageryProvider;

    if (provider._url) {
      imageryTypeAndUrl["url"] = provider._url;
    } else if (provider._resource) {
      imageryTypeAndUrl["url"] = provider._resource._url;
    } else {
      imageryTypeAndUrl["url"] = "";
    }

    if (provider instanceof SuperMap3D.BingMapsImageryProvider) {
      imageryTypeAndUrl["type"] = "BingMapsImageryProvider";
      imageryTypeAndUrl["token"] = provider._token;
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

    if (imageryLayer[j].bindName) {
      imageryTypeAndUrl["bindName"] = imageryLayer[j].bindName;
    }
    imageryLayerUrlList.push(imageryTypeAndUrl);
  }
  return imageryLayerUrlList;
}

// 保存MVT
function saveMVT() {
  let mvtLayerUrlList: any[] = [];
  for (let k = 0; k < viewer.scene._vectorTileMaps._layerQueue.length; k++) {
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

// 保存地形
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
    if (terrainProvider instanceof SuperMap3D.SuperMapTerrainProvider) {
      terrainTypeAndUrl["type"] = "StkTerrain";
    } else if (terrainProvider instanceof SuperMap3D.TiandituTerrainProvider) {
      terrainTypeAndUrl["type"] = "tianDiTuTerrain";
    } else if (terrainProvider instanceof SuperMap3D.SCTTerrainProvider) {
      terrainTypeAndUrl["type"] = "supermapOnlineTerrain";
    }
    terrainTypeAndUrl["url"] = terrainLayer;
    if (viewer.terrainProvider.bindName) {
      terrainTypeAndUrl["bindName"] = viewer.terrainProvider.bindName;
    }
    terrainLayerUrl.push(terrainTypeAndUrl);
  }
  return terrainLayerUrl;
}

//创建并保存场景
function createAndSaveScene() {
  if (!fromData.scenePortalName || fromData.scenePortalName == "") {
    message.warning($t("sceneSaveNameCannotBeNull"));
    return;
  }

  if (!fromData.scenePortalTages || fromData.scenePortalTages == "") {
    message.warning($t("sceneSaveLableCannotBeNull"));
    return;
  }

  state.isloading = true;

  let name = fromData.scenePortalName;
  let tagsArray = fromData.scenePortalTages.replace("，", ",").split(",");
  let userName = fromData.scenePortalUser;
  let description = fromData.scenePortalDescription;

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
    positionCartographic: camera.positionCartographic, //供平面场景（哥伦布视图）下使用
  };
  data.environmentState = {
    enableLighting: viewer.scene.globe.enableLighting,
    skyAtmosphereShow: viewer.scene.skyAtmosphere.show,
    enableFog: viewer.scene.fog.enabled,
    sceneMode: viewer.scene.mode,
  };
  data.version = "2.0";
  let saveData = {
    name: name,
    tags: tagsArray,
    userName: userName,
    description: description,
    content: JSON.stringify(data),
  };

  if (window.iEarthConsole) console.log("对接online-saveData:", saveData);
  if (window.iEarthConsole) console.log("对接online-IportalStore.userInfo:", IportalStore.userInfo);

  if (!window.simulateIPortalMode) {
    let iportaluserName = IportalStore.userInfo.userName;
    if (iportaluserName === "GUEST") {
      message.error($t("saveErrorNeedOnline"));
      return;
    }
  }


  // 保存场景
  let url = getRootUrl() + "web/scenes.json";
  window.axios
    .post(url, JSON.stringify(saveData), { withCredentials: true })
    .then(
      function (response) {
        if (window.iEarthConsole)
          console.log("对接online-保存后-response:", response);
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
            withCredentials: true,
          })
          .then(function () {
            state.isloading = false;
            message.success($t("saveSuccess"));
            panelStore.showSavePanel = false;
            setTimeout(() => {
              let currentUrl =
                getRootUrl() +
                "apps/earth/v2/index.html?id=" +
                response.data.newResourceID;
              if (window.iEarthConsole)
                console.log("对接online-currentUrl:", currentUrl);
              window.open(currentUrl, "_self");
            }, 1000);
          })
          .catch(function (error) {
            message.error(error.message.toString());
          });
      },
      function (err) {
        console.log(err);
        state.isloading = false;
        message.warning("配额不足");
      }
    );
}

// 更新保存场景的信息
function updateScene() {
  if (!fromData.scenePortalName || fromData.scenePortalName == "") {
    message.warning($t("sceneSaveNameCannotBeNull"));
    return;
  }

  if (!fromData.scenePortalTages || fromData.scenePortalTages == "") {
    message.warning($t("sceneSaveLableCannotBeNull"));
    return;
  }

  state.isloading = true;

  let name = fromData.scenePortalName;
  let tagsArray = fromData.scenePortalTages.replace("，", ",").split(",");
  let userName = fromData.scenePortalUser;
  let description = fromData.scenePortalDescription;

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
      z: camera.positionWC.z,
    },
    heading: camera.heading,
    pitch: camera.pitch,
    roll: camera.roll,
    positionCartographic: camera.positionCartographic, //供平面场景（哥伦布视图）下使用
  };
  data.environmentState = {
    enableLighting: viewer.scene.globe.enableLighting,
    skyAtmosphereShow: viewer.scene.skyAtmosphere.show,
    enableFog: viewer.scene.fog.enabled,
    sceneMode: viewer.scene.mode,
  };
  data.version = "2.0";
  let saveData = {
    name: name,
    tags: tagsArray,
    userName: userName,
    description: description,
    content: JSON.stringify(data),
  };

  if (window.iEarthConsole) console.log("对接online-saveData-更新:", saveData);
  if (window.iEarthConsole)
    console.log(
      "对接online-IportalStore.userInfo-更新:",
      IportalStore.userInfo
    );

  let iportaluserName = IportalStore.userInfo.userName;
  if (iportaluserName === "GUEST") {
    message.error($t("saveErrorNeedOnline"));
    return;
  }

  // 更新场景
  let url = getRootUrl() + "web/scenes/" + state.sceneID + ".json";
  window.axios
    .put(url, JSON.stringify(saveData), { withCredentials: true })
    .then(
      function () {
        if (window.iEarthConsole) console.log("对接online-更新成功:");

        //保存缩略图
        let putSceneUrl =
          getRootUrl() + "web/scenes/" + state.sceneID + "/thumbnail.json";
        window
          .axios({
            method: "put",
            url: putSceneUrl,
            data: base64,
            headers: { "Content-type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          })
          .then(function () {
            panelStore.showSavePanel = false;
            state.isloading = false;
            message.success($t("saveUpdate"));
            let currentUrl =
              getRootUrl() + "apps/earth/v2/index.html?id=" + state.sceneID;
            if (window.iEarthConsole) console.log("currentUrl:", currentUrl);
            window.open(currentUrl, "_self");
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      function (err) {
        console.log(err);
        state.isloading = false;
        message.warning("配额不足");
      }
    );
}

watch(
  () => panelStore.showSavePanel,
  () => {
    fromData.storageSceneCurrentTime = getNowFormatDate();
    fromData.scenePortalUser = IportalStore.userInfo.userName;
    if (IportalStore.saveInfo) {
      fromData.scenePortalName = IportalStore.saveInfo.scenePortalName;
      fromData.scenePortalTages = IportalStore.saveInfo.scenePortalTages;
      fromData.scenePortalUser = IportalStore.saveInfo.scenePortalUser;
      fromData.scenePortalDescription =
        IportalStore.saveInfo.scenePortalDescription;
    }
  }
);
</script>

<style lang="scss" scoped>
#sceneCanvas {
  width: 100%;
  margin-bottom: 0.1rem;
}

.save-scene-container {
  padding: 0 0.1rem;
  box-sizing: border-box;
}
</style>
