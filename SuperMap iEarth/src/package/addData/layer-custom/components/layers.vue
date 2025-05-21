<template>
  <n-space justify="end">
    <n-select v-model:value="state.layerType" :options="typeOptions" style="width: 2.4rem; margin-bottom: 0.1rem" />
  </n-space>

  <div class="row-item" style="margin-bottom: 0.1rem">
    <span>{{ $t("address") }}</span>
    <n-tooltip placement="top-end" trigger="hover">
      <template #trigger>
        <n-input class="add-input-border" style="width: 2.4rem" v-model:value="state.layerUrl" type="text"
          :placeholder="$t('layerUrl')" @input="handleChange" />
      </template>
      {{ state.urlTip }}
    </n-tooltip>
  </div>

  <div class="row-item" style="margin-bottom: 0.1rem"
    v-show="![LayerTypeEnum.WMTS, LayerTypeEnum.MVT].includes(state.layerType)">
    <span>{{ $t("name") }}</span>
    <n-input class="add-input-border" style="width: 2.4rem" v-model:value="state.layerName" type="text"
      :placeholder="$t('layerName')" :title="state.layerName" />
  </div>

  <div style="margin-left: 0.95rem; margin-bottom: 0.1rem" v-show="state.layerType != LayerTypeEnum.WMTS">
    <n-checkbox v-model:checked="state.token" :label="$t('addToken')" />
    <n-input style="margin-top: 0.1rem; width: 2.4rem" v-if="state.token" v-model:value="state.layerToken" type="text"
      placeholder="token..." />
  </div>

  <!-- WMTS图层过滤 -->
  <div class="filter-box" v-show="state.layerType === LayerTypeEnum.WMTS && wmtsOriginLayerOptions.length > 0">
    <n-input style="width: 80%" :placeholder="$t('wmtsFilterTip')" v-model:value="state.wmtsFilterKey">
      <template #suffix>
        <i class="iconfont iconSize iconsousuo" @click="handleWmtsFilter" :title="$t('filter')"></i>
      </template>
    </n-input>
    <n-button class="btn-single-normal" @click="handleWmtsReset" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t("reset") }}</n-button>
  </div>

  <!-- WMTS可选图层 -->
  <div v-show="state.layerType === LayerTypeEnum.WMTS && wmtsOriginLayerOptions.length > 0">
  <div class="wmtsLayerTable">
      <n-data-table
          size="small"
          :columns="columns"
          :data="state.wmtsLayerOptions"
          :row-class-name="(row)=> row.disabled ? 'myService-disabled-item' : ''"
          flex-height
          class="flex-1-hidden"
          v-model:checked-row-keys="state.checkedRowKeys"
      />
  </div>
  </div>

  <!-- TileMatrixSetID -->
  <div class="row-item" style="margin: 0.1rem 0rem"
    v-show="state.layerType === LayerTypeEnum.WMTS">
    <span>{{ $t("tileMatrixSet") }}</span>
    <n-select class="add-input-border" v-model:value="state.tileSetID" :options="state.tileSetOptions"
      style="width: 2.4rem" />
  </div>

  <div class="btn-row-item" style="margin-left: 0.95rem">
    <n-button type="info" color="#3499E5" text-color="#fff" class="ans-btn" @click="openLayer">{{ $t("sure") }}
    </n-button>
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import layerManagement from "@/tools/layerManagement";
import WMTSParse from "@/lib/WMTSParse";
import axios from 'axios';
import xml2js from 'xml2js';

// 自定义图层类型枚举
enum LayerTypeEnum {
  S3M = 'S3M',
  Image = 'Image',
  MVT = 'MVT',
  Terrain = 'Terrain',
  WMTS = 'WMTS',
  Arcgis = 'ArcGIS',
}

// 图层类型选项
const typeOptions = ref([
  {
    label: $t("s3mLayer"),
    value: LayerTypeEnum.S3M,
  },
  {
    label: $t("imgLayer"),
    value: LayerTypeEnum.Image,
  },
  {
    label: $t("mvtLayer"),
    value: LayerTypeEnum.MVT,
  },
  {
    label: $t("terrainLayer"),
    value: LayerTypeEnum.Terrain,
  },
  {
    label: $t("arcgisService"),
    value: LayerTypeEnum.Arcgis,
  },
  {
    label: $t("wmtsLayer"),
    value: LayerTypeEnum.WMTS,
  },
]);

// 表格列
const columns = ref([
  {
    type: "selection",
    multiple: false,
    align: "center",
    disabled: (rowdata) => {
      return rowdata.disabled ? true : false;
    },
  },
  {
    key: "name",
    title: $t("wmtsLayerName"),
    align: "left",
  }
])

const state = reactive<any>({
  layerType: LayerTypeEnum.S3M,
  token: false,
  layerToken: "",
  layerUrl: "",
  layerName: "",
  wmtsLayer: "",
  wmtsLayerOptions: [],
  tileSetID: "",
  tileSetOptions: [],
  wmtsFilterKey:'',
  checkedRowKeys:[],
  urlTip: `http://<server>:<port>/iserver/services/<component>/rest/realspace/datas/<layerName>/config`,
});

const scene = viewer.scene;

// Wmts常用服务
// const url = 'http://172.16.120.191:8090/iserver/services/map-ugcv5-worldMap/wmts100'; // base
// const url = 'http://172.16.120.191:8090/iserver/services/map-henanmap/wmts100'; //  两种协议 ok
// const url = 'http://172.16.120.103:8090/iserver/services/map-NSDL2-2/wmts100'; //  多个图层
// const url = 'http://172.16.120.103:8090/iserver/services/map-agscache-conf2/wmts100'; //  arcgis缓存转发的
let wmtsParse: any = undefined; // WMTS解析类
let wmtsInfo: any = undefined
let wmtsOriginLayerOptions:any = ref([]);

function clear() {
  state.layerUrl = "";
  state.layerName = "";
  state.token = false;
  state.layerToken = "";

  state.wmtsLayer = "";
  state.wmtsLayerOptions = [];
  state.tileSetID = "";
  state.tileSetOptions = [];
  wmtsOriginLayerOptions.value = [];
  state.checkedRowKeys = [];
}

// 打开自定义图层
function openLayer() {
  if (state.layerUrl === null || state.layerUrl === "") {
    window["$message"].warning($t("urlIsNull"));
    return;
  }
  if (state.token) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      state.layerToken
    );
  }

  const layerUrl = state.layerUrl;

  switch (state.layerType) {
    case LayerTypeEnum.S3M:
      addS3M(layerUrl);
      break;
    case LayerTypeEnum.Image:
      addImage(layerUrl);
      break;
    case LayerTypeEnum.MVT:
      addMVT(layerUrl);
      break;
    case LayerTypeEnum.Terrain:
      addTerrain(layerUrl);
      break;
    case LayerTypeEnum.WMTS:
      addWMTS(layerUrl);
      break;
    case LayerTypeEnum.Arcgis:
      addArcgis(layerUrl);
      break;
    default:
      break;
  }
}

// 针对S3M、影像、地形，通过输入的url，自动获取图层名
function handleChange() {
  state.layerUrl = state.layerUrl.trim().replaceAll("'", "").replaceAll('"', "").replace(/\/+$/, "");

  //检测地址正确性 - 之后会换成正则表达式做严格校验
  const layerType = state.layerType
  const layerName = getNameFromUrl(layerType, state.layerUrl);
  state.layerName = layerName ? layerName : "";

  if (layerType == LayerTypeEnum.WMTS) {
    getWmtsLayerOption(state.layerUrl)
  }
}

// 从URL中获取图层的名称
function getNameFromUrl(type, url) {
  switch (type) {
    case LayerTypeEnum.S3M:
      if (url.endsWith("/config")) {
        const suffix = url.split("/config")[0];
        return suffix.split("/").pop();
      }
      break;
    case LayerTypeEnum.Image:
      if (url.includes("/realspace/datas/")) {
        return url.split("/realspace/datas/")[1];
      }
      break;
    case LayerTypeEnum.Terrain:
      if (url.includes("/realspace/datas/")) {
        return url.split("/realspace/datas/")[1];
      }
      break;
    case LayerTypeEnum.Arcgis:
      if (url.endsWith("/MapServer")) {
        const suffix = url.split("/MapServer")[0];
        return suffix.split("/").pop();
      }
      break;
  }
}

// 获取WMTS服务图层信息：URL => xml => json => info
async function getWmtsLayerOption(wmtsUrl: string) {
  if (!wmtsUrl.endsWith("/wmts100")) return;

  // 实例化WMTS服务解析类
  if (!wmtsParse) {
    wmtsParse = new WMTSParse(axios, xml2js);
  }

  // 获取WMTS内容前，清空一些内容
  state.tileSetID = "";
  state.tileSetOptions = [];
  state.checkedRowKeys = []; // 取消表格中的选择项
  state.wmtsFilterKey = "";

  // 获取WMTS服务信息
  const result = await wmtsParse.getWMTSInfo(wmtsUrl);
  console.log("WMTS服务信息:", result);

  // 如果不是iServer发布的WMTS服务
  if(result == 'not iServer release') {
    window["$message"].warning($t("wmtsiServerTip"));
    return;
  }

  // 生成表格数据
  if (result && result.layerList) {
    wmtsInfo = result;

    state.wmtsLayerOptions = [];
    wmtsInfo.layerList.forEach((layerInfo, index) => {
      const option = {
        key: `wmts-layer-${index}`,
        name: layerInfo.layer,
      }
      state.wmtsLayerOptions.push(option);
    });

    wmtsOriginLayerOptions.value = state.wmtsLayerOptions;
  }
}

// 添加s3m
function addS3M(s3mLayerUrl: string) {

  // 计算当前S3M图层的名称, 使用addS3MTilesLayerByScp接口必须传入name
  let s3mName = state.layerName;
  if(!s3mName || s3mName == ''){
    const suffix = s3mLayerUrl.split("/config")[0];
    s3mName = suffix.split("/").pop();
  }
  const s3mPromise = scene.addS3MTilesLayerByScp(s3mLayerUrl, {name: s3mName});
  SuperMap3D.when(s3mPromise, function (s3mLayer) {
    if (s3mLayer && (s3mLayer instanceof SuperMap3D.S3MTilesLayer)) {
      s3mLayer.customName = s3mName;
      viewer.flyTo(s3mLayer);
      s3mLayer.residentRootTile = (window.customConfig && window.customConfig.s3mLayer_residentRootTile) ? true : false;
      // s3mLayer.selectColorType = SuperMap3D.SelectColorType.SILHOUETTE_EDGE; // 通过自定义服务打开的S3M图层设置选中效果
      s3mLayer.selectedColor = new SuperMap3D.Color(
        128 / 255 * 1.5,
        198 / 255 * 1.5,
        226 / 255 * 1.5,
        1
      );
      s3mLayer.ignoreNormal = window.customConfig.ignoreNormal;
      s3mLayer.ignoreVertexColor = window.customConfig.ignoreVertexColor;
      s3mLayer.minTransparentAlpha = window.customConfig.minTransparentAlpha || 0.1; // 默认值为0.1

      if (window.iEarthCustomFunc && window.iEarthCustomFunc.afterSceneOpen) {
        window.iEarthCustomFunc.afterSceneOpen(s3mLayer);
      }
    }
  })
}

// 添加影像图层 - 目前只支持超图我们自己的影像
function addImage(imageryUrl: string) {
  const window_maximumLevel = window.customConfig && window.customConfig.superMapImageryProvider_maximumLevel;
  let imageLayer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SuperMapImageryProvider({
      url: imageryUrl,
      maximumLevel: window_maximumLevel ? window_maximumLevel : undefined
    })
  );
  if (imageLayer) {
    if (state.layerName != "") imageLayer.customName = state.layerName;
    viewer.flyTo(imageLayer);
    if (window.iEarthCustomFunc && window.iEarthCustomFunc.afterImageLayerAdd) {
      window.iEarthCustomFunc.afterImageLayerAdd(imageLayer);
    }
  }
}

// 添加MVT
function addMVT(mvtUrl) {
  const mvtName = state.layerName != '' ? state.layerName : `MVT-${new Date().getTime()}`;
  layerManagement.addMvtLayer(mvtUrl, mvtName);
}

// 添加地形
function addTerrain(terrainURL: string) {
  let isSctFlag = true;
  if (terrainURL.includes('info/data/path')) isSctFlag = false; // STK地形，需要设置isSct为false
  viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
    url: terrainURL,
    isSct: isSctFlag, // 是否为iServer发布的TIN地形服务,如果是STK地形设置为false
  });
  if (state.layerName != "") viewer.terrainProvider.customName = state.layerName;

  //飞行定位到地形范围
  let terrainProvider = viewer.terrainProvider;
  terrainProvider.readyPromise.then(() => {
    const bounds = terrainProvider._bounds;
    if (bounds) {
      const destination = new SuperMap3D.Rectangle.fromDegrees(
        bounds.west,
        bounds.south,
        bounds.east,
        bounds.north
      );

      scene.camera.flyTo({
        destination: destination,
      });
    }
  });
}

// 添加Arcgis Rest Map服务
function addArcgis(argisUrl: string) {
  if (!argisUrl || argisUrl == '') return;

  const imageryProvider = new SuperMap3D.CGCS2000MapServerImageryProvider({
    url: argisUrl
  });
  const imageLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
  if (imageLayer) {
    if (state.layerName != "") imageLayer.customName = state.layerName;
    viewer.flyTo(imageLayer);
    if (window.iEarthCustomFunc && window.iEarthCustomFunc.afterImageLayerAdd) {
      window.iEarthCustomFunc.afterImageLayerAdd(imageLayer);
    }
  }
}

// 添加WMTS服务
function addWMTS(url: string) {
  if (!wmtsInfo) return;
  if(state.wmtsLayer=='' || state.tileSetID==''){
    window["$message"].warning($t("wmtsNoLayerOrTilesetIDTip"));
    return;
  }

  const wmtsUrl = url;
  const layerName = state.wmtsLayer;
  const tileSetID = state.tileSetID;
  const targetLayerInfo = wmtsInfo.layerList.find(layerInfo => layerInfo.layer == layerName);
  const targetTileSetInfo = wmtsInfo.tileSetList.find(tileSetInfo => tileSetInfo.tileMatrixSetID == tileSetID);
  if(!targetLayerInfo || !targetTileSetInfo) return;

  const crs_epsg = targetTileSetInfo.crs;
  if (!crs_epsg) return;

  //* 计算添加wmts服务时需要传入的Option == start == */
  const wmtsOptions: any = {
    url: wmtsUrl,
    style: targetLayerInfo.style || "default",
    format: targetLayerInfo.format || 'image/png',
    layer: layerName,
    tileMatrixSetID: tileSetID
  }
  console.log("当前选择的WMTS信息:", wmtsOptions, targetLayerInfo, targetTileSetInfo);

  // 计算瓦片协议
  const { lowerCorner, upperCorner } = targetLayerInfo.boundingBox;
  const scaleDenominators = targetTileSetInfo.scaleDenominators;
  let tilingScheme: any = undefined;
  let isUseOrigin = targetTileSetInfo.topLeftCorner == '90.0 -180.0' ? true : false; 
  if (crs_epsg.includes("4326") || crs_epsg.includes("4490")) {
    tilingScheme = new SuperMap3D.GeographicTilingScheme({
      rectangle: SuperMap3D.Rectangle.fromDegrees(lowerCorner[0], lowerCorner[1], upperCorner[0], upperCorner[1]),
      scaleDenominators: scaleDenominators,
      customDPI: new SuperMap3D.Cartesian2(90.7142857142857, 90.7142857142857),
      // 不是动态原点切的瓦片, 需要添加origin
      origin: isUseOrigin ? new SuperMap3D.Cartographic.fromDegrees(-180, 90, 0.0) : undefined, 
    })
  } else if (crs_epsg.includes("3857")) {
    tilingScheme = new SuperMap3D.WebMercatorTilingScheme({
      rectangle: SuperMap3D.Rectangle.fromDegrees(lowerCorner[0], lowerCorner[1], upperCorner[0], upperCorner[1]),
      scaleDenominators: scaleDenominators,
      customDPI: new SuperMap3D.Cartesian2(90.7142857142857, 90.7142857142857),
    })
  } else {
    window["$message"].warning($t("wmtsNotSupportTip"));
    return;
  }

  wmtsOptions.tilingScheme = tilingScheme;
  //* 计算添加wmts服务时需要传入的Option == end == */

  const imageLayer = scene.imageryLayers.addImageryProvider(new SuperMap3D.WebMapTileServiceImageryProvider(wmtsOptions));
  viewer.flyTo(imageLayer);
}

// 过滤wmts图层
function handleWmtsFilter(){
  const keyword = state.wmtsFilterKey
  if(!keyword || keyword == ''){
    state.wmtsLayerOptions = wmtsOriginLayerOptions.value;
  }

  state.wmtsLayerOptions = wmtsOriginLayerOptions.value.filter((layerOption) => {
    return layerOption.name.includes(keyword)
  })
}

// 重置wmts图层
function handleWmtsReset(){
  state.wmtsFilterKey = '';
  state.wmtsLayerOptions = wmtsOriginLayerOptions.value;
}

watch(
  () => state.checkedRowKeys,
  (val) => {
    let selecteditems = state.wmtsLayerOptions.filter((item: any) => {
      return item.key === val[0];
    });
    if(selecteditems.length === 0) return;

    const layerName = selecteditems[0].name;
    state.wmtsLayer = layerName;
    const targetLayerInfo = wmtsInfo.layerList.find(layerInfo => layerInfo.layer == layerName);
    if (targetLayerInfo && targetLayerInfo.tileMatrixSetIDs) {
      state.tileSetOptions = []
      targetLayerInfo.tileMatrixSetIDs.forEach(tileSetID => {
        const option = {
          label: tileSetID,
          value: tileSetID,
        }
        state.tileSetOptions.push(option);
      });
      state.tileSetID = targetLayerInfo.tileMatrixSetIDs[0]; // tileSetID默认使用第一个
    }

  }
);

watch(
  () => state.layerType,
  (val: string) => {
    clear();
    switch (val) {
      case LayerTypeEnum.S3M:
        state.urlTip = `http://<server>:<port>/iserver/services/<component>/rest/realspace/datas/<layerName>/config`;
        break;
      case LayerTypeEnum.Image:
        state.urlTip = `http://<server>:<port>/realspace/services/<component>/rest/realspace/datas/<layerName>`;
        break;
      case LayerTypeEnum.MVT:
        state.urlTip = `http://<server>:<port>/iserver/services/<component>/restjsr/v1/vectortile/maps/<layerName>`;
        break;
      case LayerTypeEnum.Terrain:
        state.urlTip = `http://<server>:<port>/realspace/services/<component>/rest/realspace/datas/<layerName>`;
        break;
      case LayerTypeEnum.WMTS:
        state.urlTip = `http://<server>:<port>/iserver/services/{serviceName}/wmts100`;
        break;
      case LayerTypeEnum.Arcgis:
        state.urlTip = `http://<server>:<port>/arcgis/rest/services/<layerName>/MapServer`;
        break;
      default:
        break;
    }
  }
);
</script>


<style lang="scss" scoped>
.wmtsLayerTable {
  display: flex;
  flex-direction: column;
  height: 1.5rem;
  width: 100%;
  background-color: rgb(29, 29, 17);
  opacity: 0.8;
  z-index: 999999;
}

.flex-1-hidden {
  flex: 1 1 0% !important;
  overflow: hidden;
}

.filter-box{
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.1rem;
}

.btn-single-normal{
  width: 0.6rem;
  height: 0.32rem;
}
</style>