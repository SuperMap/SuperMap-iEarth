<template>
  <n-space justify="end">
    <n-select
      v-model:value="state.layerType"
      :options="state.typeOptions"
      style="width: 2.4rem; margin-bottom: 0.1rem"
    />
  </n-space>

  <div class="row-item" style="margin-bottom: 0.1rem">
    <span>{{ $t("address") }}</span>
    <n-tooltip placement="top-end" trigger="hover">
      <template #trigger>
        <n-input
          class="add-input-border"
          style="width: 2.4rem"
          v-model:value="state.layerUrl"
          type="text"
          :placeholder="$t('layerUrl')"
          @input="handleChange"
        />
      </template>
      {{ state.urlTip }}
    </n-tooltip>
  </div>

  <div
    class="row-item"
    style="margin-bottom: 0.1rem"
    v-show="![LayerTypeEnum.WMTS, LayerTypeEnum.MVT].includes(state.layerType)"
  >
    <span>{{ $t("name") }}</span>
    <n-input
      class="add-input-border"
      style="width: 2.4rem"
      v-model:value="state.layerName"
      type="text"
      :placeholder="$t('layerName')"
      :title="state.layerName"
    />
  </div>

  <div
    style="margin-left: 0.95rem; margin-bottom: 0.1rem"
    v-show="state.layerType != LayerTypeEnum.WMTS"
  >
    <n-checkbox v-model:checked="state.token" :label="$t('addToken')" />
    <n-input
      style="margin-top: 0.1rem; width: 2.4rem"
      v-if="state.token"
      v-model:value="state.layerToken"
      type="text"
      placeholder="token..."
    />
  </div>

  <div
    class="row-item"
    style="margin-bottom: 0.1rem"
    v-show="state.layerType === LayerTypeEnum.WMTS && state.wmtsLayerOptions.length > 0"
  >
    <span>{{ $t("selectableLayers") }}</span>
    <n-select
      class="add-input-border"
      v-model:value="state.wmtsLayer"
      :options="state.wmtsLayerOptions"
      style="width: 2.4rem"
    />
  </div>

  <div class="btn-row-item" style="margin-left: 0.95rem">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      class="ans-btn"
      @click="openLayer"
      >{{ $t("sure") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch} from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import layerManagement from "@/tools/layerManagement";
import proj4 from "proj4";

const layerStore = useLayerStore();

// 南京EPSG::4549自定义投影坐标系
proj4.defs([
  [
    "EPSG:4549",
    "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
  ],
]);

// 自定义图层类型枚举
enum LayerTypeEnum {
  S3M = 'S3M',
  Image = 'Image',
  MVT = 'MVT',
  Terrain = 'Terrain',
  WMTS = 'WMTS',
  Arcgis = 'ArcGIS',
}

let state = reactive({
  layerType: LayerTypeEnum.S3M,
  token: false,
  layerToken: "",
  layerUrl: "",
  layerName: "",
  wmtsLayer: "",
  wmtsLayerOptions: [],
  tileMatrixSetID: "",
  tileMatrixSetIDOptions: [],
  typeOptions: [
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
      label: 'ArcGIS服务',
      value: LayerTypeEnum.Arcgis,
    },
    // {
    //   label: $t("wmtsLayer"),
    //   value: LayerTypeEnum.WMTS,
    // },
  ],
  rectangleObj: [],
  scaleDenominatorsObj: [],
  epsg: -1,
  addWmtsFlag: true,
  urlTip: `http://<server>:<port>/iserver/services/<component>/rest/realspace/datas/<layerName>/config`,
});

function clear() {
  state.layerUrl = "";
  state.layerName = "";
  state.token = false;
  state.layerToken = "";

  // 获取必要参数
  state.wmtsLayerOptions = [];
  state.tileMatrixSetIDOptions = [];
  state.rectangleObj = [];
  state.scaleDenominatorsObj = [];
  state.epsg = -1;

  state.tileMatrixSetID = "";
  state.wmtsLayer = "";
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

  switch (state.layerType) {
    case LayerTypeEnum.S3M:
      addS3M(state.layerUrl);
      break;
    case LayerTypeEnum.Image:
      addImage(state.layerUrl);
      break;
    case LayerTypeEnum.MVT:
      addMVT(state.layerUrl);
      break;
    case LayerTypeEnum.Terrain:
      addTerrain(state.layerUrl);
      break;
    case LayerTypeEnum.WMTS:
      addWMTS(state.layerUrl);
      break;
    case LayerTypeEnum.Arcgis:
      addArcgis(state.layerUrl);
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

  if(layerType == LayerTypeEnum.WMTS){
    getXmlInfo(state.layerUrl);
  }
}

// 从URL中获取图层的名称
function getNameFromUrl(type, url){
  switch (type) {
    case LayerTypeEnum.S3M:
      if(url.endsWith("/config")){
        const suffix = url.split("/config")[0];
        return suffix.split("/").pop();
      }
      break;
    case LayerTypeEnum.Image:
      if(url.includes("/realspace/datas/")){
        return url.split("/realspace/datas/")[1];
      }
      break;
    case LayerTypeEnum.Terrain:
      if(url.includes("/realspace/datas/")){
        return url.split("/realspace/datas/")[1];
      }
      break;
    case LayerTypeEnum.Arcgis:
      if(url.endsWith("/MapServer")){
        const suffix = url.split("/MapServer")[0];
        return suffix.split("/").pop();
      }
      break;
  }
}

// 添加s3m
function addS3M(s3mLayerUrl: string) {
  const s3mPromise = viewer.scene.addS3MTilesLayerByScp(s3mLayerUrl);
  SuperMap3D.when(s3mPromise, function (s3mLayer) {
    if (s3mLayer && (s3mLayer instanceof SuperMap3D.S3MTilesLayer)) {
      if(state.layerName != "") s3mLayer.customName = state.layerName;
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
    if(state.layerName != "") imageLayer.customName = state.layerName;
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
  if(state.layerName != "") viewer.terrainProvider.customName = state.layerName;

  //飞行定位到地形范围
  let terrainProvider = viewer.terrainProvider;
  terrainProvider.readyPromise.then(() => {
    const bounds = terrainProvider._bounds;
    if(bounds){
      const destination = new SuperMap3D.Rectangle.fromDegrees(
        bounds.west,
        bounds.south,
        bounds.east,
        bounds.north
      );

      viewer.scene.camera.flyTo({
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
  if(imageLayer){
    if(state.layerName != "") imageLayer.customName = state.layerName;
    viewer.flyTo(imageLayer);
    if(window.iEarthCustomFunc && window.iEarthCustomFunc.afterImageLayerAdd){
      window.iEarthCustomFunc.afterImageLayerAdd(imageLayer);
    }
  }
}

// <=================wmts start================>

// 添加wmts服务
function addWMTS(wmtsLayerUrl: string) {
  if (!state.addWmtsFlag) return;

  viewer.shadows = false; // 关闭阴影，防止报错
  viewer.scene.colorCorrection.show = false; // 颜色开关也关闭，保险起见

  let rectangle: any, scaleDenominatorsList: any;
  if (state.rectangleObj && state.wmtsLayer) {
    rectangle = state.rectangleObj[state.wmtsLayer];
    scaleDenominatorsList = state.scaleDenominatorsObj[state.wmtsLayer];
  } else {
    return;
  }
  let item: any = state.wmtsLayerOptions.find(
    (item: any) => item.value === state.wmtsLayer
  );
  let layerName = item.label;
  let items = layerStore.wmtsLayerOption.filter((item: any) => {
    return item.wmtsLayerUrl == wmtsLayerUrl && item.layerName == layerName;
  });
  if (items.length > 0) {
    // 该wmts服务已存在，不在重复添加
    window["$message"].warning($t("repeatAddWMTSTip"));
    return;
  }

  let wmtsRectangle = computedRectangle(rectangle);
  viewer.shadows = false; // 关闭阴影，防止报错
  let wmtsLayer: any = undefined;
  if (state.epsg == 3857) {
    wmtsLayer = viewer.imageryLayers.addImageryProvider(
      new SuperMap3D.WebMapTileServiceImageryProvider({
        url: wmtsLayerUrl,
        style: "default",
        format: "image/png",
        layer: layerName,
        tileMatrixSetID: state.tileMatrixSetID,
        tilingScheme: new SuperMap3D.WebMercatorTilingScheme({
          rectangleSouthwestInMeters: new SuperMap3D.Cartesian2(
            rectangle[0],
            rectangle[1]
          ),
          rectangleNortheastInMeters: new SuperMap3D.Cartesian2(
            rectangle[2],
            rectangle[3]
          ),
          scaleDenominators: scaleDenominatorsList,
          // customDPI: new SuperMap3D.Cartesian2(90.7142857142857, 90.7142857142857),
          // orgin: new SuperMap3D.Cartesian3(10836627.447863173, 4071175.9917132845, 0.0),
        }),
      })
    );
  } else {
    wmtsLayer = viewer.imageryLayers.addImageryProvider(
      new SuperMap3D.WebMapTileServiceImageryProvider({
        url: wmtsLayerUrl,
        style: "default",
        format: "image/png",
        layer: layerName,
        tileMatrixSetID: state.tileMatrixSetID,
        // tilingScheme: computedTilingScheme(wmtsRectangle,scaleDenominatorsList),
        tilingScheme: new SuperMap3D.GeographicTilingScheme({
          // ellipsoid: SuperMap3D.Ellipsoid.WGS84,
          // numberOfLevelZeroTilesX: 2,
          // numberOfLevelZeroTilesY: 1,
          rectangle: wmtsRectangle,
          scaleDenominators: scaleDenominatorsList,
          customDPI: new SuperMap3D.Cartesian2(
            90.7142857142857,
            90.7142857142857
          ),
        }),
        // tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"]  // 设置加载的层级，一般是从0级开始加载，但是有的特殊数据是从1级开始加的
      })
    );
  }

  if (state.rectangleObj && state.wmtsLayer != "") {
    let rectangle: any = state.rectangleObj[state.wmtsLayer];
    if (rectangle.length < 4) return;
    let isGlobalBound = false;
    rectangle.forEach((num) => {
      if (Math.abs(num) > 178) {
        // 也即是bounds为180附近，这种一般为全球地图，就不在求Bounds了
        viewer.flyTo(wmtsLayer);
        isGlobalBound = true;
        return;
      }
    });
    if (!isGlobalBound) {
      let lng = (rectangle[0] + rectangle[2]) / 2;
      let lat = (rectangle[1] + rectangle[3]) / 2;
      viewer.scene.camera.flyTo({
        destination: new SuperMap3D.Cartesian3.fromDegrees(lng, lat, 5000),
        duration: 1,
        orientation: {
          heading: 0,
          roll: 0,
        },
      });
      let wmtsImageLayerPosition = {
        lng: lng,
        lat: lat,
        height: 5000,
      };
      wmtsLayer.wmtsImageLayerPosition = wmtsImageLayerPosition;
    }
  } else {
    viewer.flyTo(wmtsLayer);
  }

  let wmtsLayerObj = {
    wmtsLayerUrl: wmtsLayerUrl,
    layerName: layerName,
    tileMatrixSetID: state.tileMatrixSetID,
    wmtsImageLayerPosition: wmtsLayer.wmtsImageLayerPosition,
    wmtsESPG: state.epsg,
    rectangle: wmtsRectangle,
    scaleDenominatorsList: scaleDenominatorsList,
  };
  let list = layerStore.wmtsLayerOption.filter((item: any) => {
    return (
      item.wmtsLayerUrl == wmtsLayerObj.wmtsLayerUrl &&
      item.layerName == wmtsLayerObj.layerName
    );
  });
  if (list.length == 0) {
    layerStore.wmtsLayerOption.push(wmtsLayerObj);
  }
}

// 计算bound范围
function computedRectangle(rectangle: any) {
  if (state.epsg == 4549) {
    let LowerCorner = proj4("EPSG:4549", "EPSG:4326", [
      rectangle[0],
      rectangle[1],
    ]);
    let UpperCorner = proj4("EPSG:4549", "EPSG:4326", [
      rectangle[2],
      rectangle[3],
    ]);
    return SuperMap3D.Rectangle.fromDegrees(
      LowerCorner[0],
      LowerCorner[1],
      UpperCorner[0],
      UpperCorner[1]
    );
  } else if (rectangle[0] == 0) {
    return undefined;
  } else if (Math.abs(rectangle[0]) > 0 && Math.abs(rectangle[0]) <= 180) {
    return SuperMap3D.Rectangle.fromDegrees(
      rectangle[0],
      rectangle[1],
      rectangle[2],
      rectangle[3]
    );
  } else {
    return undefined;
  }
}

let xmlDoc: any;
// 获取xml信息
function getXmlInfo(xmlUrl?: string) {
  window.axios.get(xmlUrl).then((res: any) => {
    let str = res.data;
    //创建文档对象
    xmlDoc = new DOMParser().parseFromString(str, "text/xml");
    // 获取必要参数
    state.wmtsLayerOptions = getXMLNode(xmlDoc, "Layer");
    state.tileMatrixSetIDOptions = getXMLNode(xmlDoc, "TileMatrixSet");
    state.rectangleObj = getRectangleObj(xmlDoc);
    state.scaleDenominatorsObj = getScaleDenominatorsObj(xmlDoc);
    state.epsg = getEPSG(xmlDoc);
  });
}

// 指定标签返回xml数据
function getXMLNode(xmlDoc: any, Lable: string) {
  let finds = xmlDoc.querySelectorAll(Lable); //获取find节点
  let list: any = [];
  switch (Lable) {
    case "Layer":
      for (let i = 0; i < finds.length; i++) {
        //循环节点
        let finder = finds[i];
        let nods = finder.childNodes;
        let label_title = nods[1];
        let labelContent = label_title.textContent;
        let TileMatrixSetIDList: any = [];
        for (let j = 0; j < nods.length; j++) {
          let nodChild = nods[j];
          if (nodChild.tagName === "TileMatrixSetLink") {
            let TileMatrixSetID = nodChild.childNodes[1].textContent;
            TileMatrixSetIDList.push(TileMatrixSetID);
          }
        }
        list.push({
          label: labelContent,
          value: TileMatrixSetIDList[0],
        });
      }
      break;
    case "TileMatrixSet":
      for (let i = 0; i < finds.length; i++) {
        //循环节点
        let finder = finds[i];
        if (finder.childNodes.length === 1) {
          let textContent = finder.textContent;
          let layerIndex = state.wmtsLayerOptions.findIndex(
            (item: any) => item.value === textContent
          );
          if (layerIndex != -1) {
            list.push({
              label: textContent,
              value: textContent,
            });
          }
        }
      }
      break;
  }
  return list;
}

// 从xml中获取bound范围信息
function getRectangleObj(xmlDoc: any): any {
  let finds = xmlDoc.querySelectorAll("Layer"); //获取find节点
  let RectangleObj: any = {};
  for (let i = 0; i < finds.length; i++) {
    //循环节点
    let list: any = [];

    let finder = finds[i];
    let nods = finder.childNodes;
    let LowerCornerlnglat, UpperCornerlnglat, tag_BoundingBox;

    tag_BoundingBox = nods[5];
    let LowerCorner = tag_BoundingBox.childNodes[1].textContent;
    let UpperCorner = tag_BoundingBox.childNodes[3].textContent;
    LowerCornerlnglat = LowerCorner.split(" ");
    UpperCornerlnglat = UpperCorner.split(" ");
    list.push(Number(LowerCornerlnglat[0]), Number(LowerCornerlnglat[1]));
    list.push(Number(UpperCornerlnglat[0]), Number(UpperCornerlnglat[1]));

    let key: any = state.wmtsLayerOptions[i];
    if (key.value) {
      RectangleObj[key.value] = list;
    }
  }
  return RectangleObj;
}

// 从xml中获取比例尺信息
function getScaleDenominatorsObj(xmlDoc: any): any {
  let finds = xmlDoc.querySelectorAll("TileMatrixSet"); //获取find节点
  let scaleDenominatorsObj: any = [];
  let k = 0;
  for (let i = 0; i < finds.length; i++) {
    //循环节点
    let finder = finds[i];
    if (finder.childNodes.length > 1) {
      let NodeList = finder.childNodes;
      let key = NodeList[1].textContent;
      let list: any = [];
      let TileMatrixList: any[] = [];
      for (let j = 0; j < NodeList.length; j++) {
        let node = NodeList[j];
        if (node.nodeName === "TileMatrix") {
          TileMatrixList.push(node);
        }
      }
      TileMatrixList.forEach((TileMatrixNode: any) => {
        let ScaleDenominator = TileMatrixNode.childNodes[3].textContent;
        list.push(Number(ScaleDenominator));
      });
      let layerIndex = state.wmtsLayerOptions.findIndex(
        (item: any) => item.value === key
      );
      if (layerIndex != -1) {
        scaleDenominatorsObj[key] = list;
      }
    }
  }
  return scaleDenominatorsObj;
}

// 获取当前wmts的坐标系EPSG
function getEPSG(xmlDoc: any): any {
  let finds = xmlDoc.querySelectorAll("Layer"); //获取find节点
  if (finds.length == 0) return;
  let firstElement = finds[0];
  let epsgValue = -1;
  if (
    firstElement.childNodes[5] &&
    firstElement.childNodes[5].localName.indexOf("Bounding") != -1
  ) {
    let BoundingBox = firstElement.childNodes[5];
    let crs = BoundingBox.attributes.crs;
    let crsValue = crs.nodeValue;
    if (crsValue.indexOf("::") == -1) {
      epsgValue = -1;
    } else {
      epsgValue = crsValue.split("::")[1];
      if (Number(epsgValue) > 10) return Number(epsgValue);
    }
  }

  if (
    firstElement.childNodes[7] &&
    firstElement.childNodes[7].localName.indexOf("Bounding") != -1
  ) {
    let BoundingBox = firstElement.childNodes[7];
    let crs = BoundingBox.attributes.crs;
    let crsValue = crs.nodeValue;
    if (crsValue.indexOf("::") == -1) {
      epsgValue = -1;
    } else {
      epsgValue = crsValue.split("::")[1];
    }
  }
  return Number(epsgValue);
}

watch(
  () => state.wmtsLayer,
  (val) => {
    // 当图层切换时，自动适配相关参数
    let layerIndex = state.wmtsLayerOptions.findIndex(
      (item: any) => item.value === val
    );
    let tileMatrixSetID: any = state.tileMatrixSetIDOptions[layerIndex];
    state.tileMatrixSetID = tileMatrixSetID.value;
  }
);
// <=================wmts end================>

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
        state.urlTip = `http://<server>:<port>/iserver/services/{serviceName}`;
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
