<template>
  <!-- 选择类型 -->
  <div class="row-wrap">
    <div class="content">
      <n-select v-model:value="state.layerType" :options="typeOptions" />
    </div>
  </div>

  <!-- 图层地址 -->
  <div class="row-wrap">
    <div class="label">{{ $t("address") }}</div>
    <div class="content">
      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-input v-model:value="state.layerUrl" type="text" :placeholder="$t('layerUrl')" @input="handleUrlChange"
            :status='state.inputUrlStatus' />
        </template>
        {{ state.urlFormatTip }}
      </n-tooltip>
    </div>
  </div>

  <!-- 图层名称 -->
  <div class="row-wrap" v-show="![LayerTypeEnum.WMTS, LayerTypeEnum.MVT].includes(state.layerType)">
    <div class="label">{{ $t("name") }}</div>
    <div class="content">
      <n-input v-model:value="state.layerName" type="text" :placeholder="$t('layerName')" :title="state.layerName" />
    </div>
  </div>

  <!-- 添加Token -->
  <div class="row-wrap" v-show="state.layerType != LayerTypeEnum.WMTS">
    <div class="content">
      <n-checkbox v-model:checked="state.useToken" :label="$t('addToken')" />
    </div>
    <div class="content">
      <n-input v-if="state.useToken" v-model:value="state.sceneToken" type="text" placeholder="token..." />
    </div>
  </div>


  <!-- WMTS图层过滤 -->
  <div class="filter-box" v-show="state.layerType === LayerTypeEnum.WMTS && wmtsOriginLayerOptions.length > 0">
    <n-input style="width: 80%" :placeholder="$t('wmtsFilterTip')" v-model:value="state.wmtsFilterKey">
      <template #suffix>
        <i class="iconfont iconSize iconsousuo" @click="handleWmtsFilter" :title="$t('filter')"></i>
      </template>
    </n-input>
    <n-button class="btn-single-normal" @click="handleWmtsReset" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t("reset")
    }}</n-button>
  </div>

  <!-- WMTS可选图层 -->
  <div v-show="state.layerType === LayerTypeEnum.WMTS && wmtsOriginLayerOptions.length > 0">
    <div class="wmtsLayerTable">
      <n-data-table size="small" :columns="columns" :data="state.wmtsLayerOptions"
        :row-class-name="(row)=> row.disabled ? 'disabled-item' : ''" flex-height
        v-model:checked-row-keys="state.checkedRowKeys" />
    </div>
  </div>

  <!-- WMTS瓦片矩阵集:TileMatrixSetID -->
  <div class="row-wrap" v-show="state.layerType === LayerTypeEnum.WMTS">
    <div class="label">{{ $t("tileMatrixSet") }}</div>
    <div class="content">
      <n-select v-model:value="state.tileSetID" :options="state.tileSetOptions" />
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="openLayer" class="operate" type="info" :focusable="false">{{
    $t("sure") }}</n-button>
    <n-button @click="clear" :focusable="false" ghost>{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onBeforeUnmount } from "vue";
import layerManagement from "@/tools/layerManagement";
import WMTSParse from "@/lib/WMTSParse";
import axios from 'axios';
import xml2js from 'xml2js';
import tool from "@/tools/tool";
import { UrlFormatEnum, UrlRegexEnum } from "@/enums/regexEnum";

onBeforeUnmount(()=>{
  // 移除token
  SuperMap3D.Credential.CREDENTIAL = null;
})

// 自定义图层类型枚举
enum LayerTypeEnum {
  S3M = 'S3M',
  Image = 'Image',
  MVT = 'MVT',
  Terrain = 'Terrain',
  ArcGIS = 'ArcGIS',
  WMTS = 'WMTS',
}

// http://172.16.120.191:8090/iserver/services/3D-CBDCache20200416/rest/realspace/datas/Building@CBD/config
// https://www.supermapol.com/realspace/services/3D-CBD/rest/realspace/datas/Building@CBD/config

// http://172.16.120.191:8090/iserver/services/map-WorkSpace/rest/maps/Country_R%40model
// http://172.16.120.191:8090/iserver/services/3D-ZhuFengDiXingYingXiang/rest/realspace/datas/image
// http://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace/datas/MosaicResult

// http://172.16.120.191:8090/iserver/services/map-mvt-std_mvt_jingjin/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE
// https://www.supermapol.com/realspace/services/map-mvt-JingJinDiQuDiTu/restjsr/v1/vectortile/maps/%E4%BA%AC%E6%B4%A5%E5%9C%B0%E5%8C%BA%E5%9C%B0%E5%9B%BE,

// http://172.16.120.191:8090/iserver/services/3D-ZhuFengDiXingYingXiang/rest/realspace/datas/srtm_54_07@zhufeng

// http://172.16.120.103:6080/arcgis/rest/services/beijing2000/MapServer

// http://172.16.120.191:8090/iserver/services/map-ugcv5-worldMap/wmts100



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
    value: LayerTypeEnum.ArcGIS,
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
  useToken: false,
  sceneToken: "",
  layerUrl: "",
  layerName: "",
  inputUrlStatus: undefined,
  wmtsLayerOptions: [],
  checkedRowKeys:[],
  wmtsLayerName: "",
  tileSetID: "",
  tileSetOptions: [],
  wmtsFilterKey:'',
  urlFormatTip: UrlFormatEnum.S3M,
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
  state.useToken = false;
  state.sceneToken = "";

  state.wmtsLayerName = "";
  state.wmtsLayerOptions = [];
  state.tileSetID = "";
  state.tileSetOptions = [];
  wmtsOriginLayerOptions.value = [];
  state.checkedRowKeys = [];
}

// 打开自定义图层
function openLayer() {
  const layerUrl = state.layerUrl;
  const layerType = state.layerType;

  if (layerUrl == "") {
    window["$message"].warning($t("urlIsNull"));
    return;
  }
  if (state.useToken) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      state.sceneToken
    );
  }


  switch (layerType) {
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
    case LayerTypeEnum.ArcGIS:
      addArcgis(layerUrl);
      break;
    default:
      break;
  }
}

// 针对S3M、影像、地形，通过输入的url，自动获取图层名
function handleUrlChange() {
  state.layerUrl = state.layerUrl.trim().replaceAll("'", "").replaceAll('"', "").replace(/\/+$/, "");
  if(state.layerUrl == '') {
    state.inputUrlStatus = undefined;
    state.layerName = '';
    return;
  }

  // 使用正则校验URL
  const layerUrl = state.layerUrl;
  const layerType = state.layerType;
  const regexResult = tool.checkUrlByRegex(layerUrl, UrlRegexEnum[layerType]);
  if(regexResult && regexResult.isPass && regexResult.matchInfo){
    state.inputUrlStatus = undefined;
    state.layerName = regexResult.matchInfo[regexResult.matchInfo.length-1]; 

    // 如果是WMTS服务，需要提前解析XML
    if (layerType == LayerTypeEnum.WMTS) {
      getWmtsLayerOption(layerUrl)
    }
  }else{
    state.inputUrlStatus = "error";
    state.layerName = '';
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
  const regexResult = tool.checkUrlByRegex(s3mLayerUrl, UrlRegexEnum.S3M);
  if(!regexResult || !regexResult.isPass){
    window["$message"].warning($t("addressNotformat"));
    return;
  }

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
  const regexResult = tool.checkUrlByRegex(imageryUrl, UrlRegexEnum.Image);
  if(!regexResult || !regexResult.isPass){
    window["$message"].warning($t("addressNotformat"));
    return;
  }

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
  const regexResult = tool.checkUrlByRegex(mvtUrl, UrlRegexEnum.MVT);
  if(!regexResult || !regexResult.isPass){
    window["$message"].warning($t("addressNotformat"));
    return;
  }

  const mvtName = state.layerName != '' ? state.layerName : `MVT-${new Date().getTime()}`;
  layerManagement.addMvtLayer(mvtUrl, mvtName);
}

// 添加地形
function addTerrain(terrainURL: string) {
  const regexResult = tool.checkUrlByRegex(terrainURL, UrlRegexEnum.Terrain);
  if(!regexResult || !regexResult.isPass){
    window["$message"].warning($t("addressNotformat"));
    return;
  }

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
  const regexResult = tool.checkUrlByRegex(argisUrl, UrlRegexEnum.ArcGIS);
  if(!regexResult || !regexResult.isPass){
    window["$message"].warning($t("addressNotformat"));
    return;
  }

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
function addWMTS(wmtsUrl: string) {
  const regexResult = tool.checkUrlByRegex(wmtsUrl, UrlRegexEnum.WMTS);
  if(!regexResult || !regexResult.isPass){
    window["$message"].warning($t("addressNotformat"));
    return;
  }

  if (!wmtsInfo) return;


  if(state.wmtsLayerName=='' || state.tileSetID==''){
    window["$message"].warning($t("wmtsNoLayerOrTilesetIDTip"));
    return;
  }

  const layerName = state.wmtsLayerName;
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
    state.wmtsLayerName = layerName;
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
    state.urlFormatTip = UrlFormatEnum[val];
    state.inputUrlStatus = undefined;
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

.n-data-table {
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