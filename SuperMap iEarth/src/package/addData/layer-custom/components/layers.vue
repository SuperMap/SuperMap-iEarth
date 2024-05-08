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
    v-show="state.layerType != 'WMTS'"
  >
    <span>{{ $t("name") }}</span>
    <n-input
      class="add-input-border"
      style="width: 2.4rem"
      v-model:value="state.layerName"
      type="text"
      :placeholder="$t('layerName')"
      :title="state.layerName"
      :disabled="state.layerType != 'S3M'"
    />
  </div>

  <div
    style="margin-left: 0.95rem; margin-bottom: 0.1rem"
    v-show="state.layerType != 'WMTS'"
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
    v-show="state.layerType === 'WMTS' && state.wmtsLayerOptions.length > 0"
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
import { reactive, watch, onMounted, onBeforeUnmount } from "vue";
import { useMessage } from "naive-ui";
import { useLayerStore } from "@/store/layerStore/layer";
import layerManagement from "@/tools/layerManagement";
import proj4 from "proj4";

const layerStore = useLayerStore();
const message = useMessage();
const widget = viewer.cesiumWidget;

onMounted(() => {
  viewer.scene.globe.depthTestAgainstTerrain = false; //关闭深度检测
  window.viewer.shadows = false; // 关闭阴影
});

onBeforeUnmount(() => {});

// 南京EPSG::4549自定义投影坐标系
proj4.defs([
  [
    "EPSG:4549",
    "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
  ],
]);

let state = reactive({
  layerType: "S3M",
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
      value: "S3M",
    },
    {
      label: $t("imgLayer"),
      value: "Imagery",
    },
    {
      label: $t("terrainLayer"),
      value: "Terrain",
    },
    // {
    // label: $t("wmtsLayer"),
    // value: "WMTS",
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
    message.warning($t("urlIsNull"));
    return;
  }
  if (state.token) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
      state.layerToken
    );
  }

  switch (state.layerType) {
    case "S3M":
      let isExist = checkS3MLayeExist(state.layerName);
      if (isExist) {
        message.warning($t("s3mNameRepeatTip"));
      }else{
        addS3M(state.layerUrl);
      }
      break;
    case "Imagery":
      addImage(state.layerUrl);
      break;
    case "Terrain":
      addTerrain(state.layerUrl);
      break;
    case "WMTS":
      addWMTS(state.layerUrl);
      break;
    default:
      break;
  }
}

// 针对S3M、影像、地形，通过输入的url，自动获取图层名
function handleChange() {
  //检测地址正确性 - 之后会换成正则表达式做严格校验
  switch (state.layerType) {
    case "S3M":
      if (state.layerUrl.indexOf("/rest/realspace/datas/") != -1) {
        state.layerName = layerManagement.getLayerNameFromUrl(
          state.layerUrl,
          "S3M"
        );
        let isExist = checkS3MLayeExist(state.layerName);
        if(isExist){
          message.warning($t("s3mNameRepeatTip"));
        }
      }
      break;
    case "Imagery":
      state.layerName = layerManagement.getLayerNameFromUrl(
        state.layerUrl,
        "Imagery"
      );
      break;
    case "Terrain":
      if (state.layerUrl.indexOf("/rest/realspace/datas/") != -1) {
        state.layerName = layerManagement.getLayerNameFromUrl(
          state.layerUrl,
          "Terrain"
        );
      }
      break;
    case "WMTS":
      getXmlInfo(state.layerUrl);
      break;
  }

  // 对layerurl做特殊处理
  if (state.layerUrl.charAt(0) == '"' || state.layerUrl.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    state.layerUrl = state.layerUrl.replace(reg, "$1");
  }

  if (state.layerUrl === "") {
    state.layerName = "";
  }
}

function checkS3MLayeExist(s3mLayerName:string){
  let layerQueue = viewer.scene.layers.layerQueue;
  let findIndex = layerQueue.findIndex((layer:any) => {
    return layer.name == s3mLayerName;
  })

  return findIndex >= 0 ? true : false;
}

// 添加s3m
let promiseArray: any[] = [];
function addS3M(s3mLayerUrl: string) {
  let options: { name: string };
  if (state.layerName) {
    options = {
      name: state.layerName,
    };
  } else {
    return;
  }
  promiseArray.push(viewer.scene.addS3MTilesLayerByScp(s3mLayerUrl, options));
  promiseWhen(promiseArray, true);
}

// 添加影像图层 - 目前只支持超图我们自己的影像
function addImage(imageryUrl: string) {
  let layer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SuperMapImageryProvider({
      url: imageryUrl,
    })
  );
  layerStore.updateLayer({ type: "imagery" });
  viewer.flyTo(layer);
}

// 添加地形
function addTerrain(terrainURL: string) {
  let isSctFlag = false;
  if (terrainURL.indexOf("8090") != -1) isSctFlag = true;
  viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
    url: terrainURL,
    isSct: isSctFlag, // 地形服务源自SuperMap iServer，本地发布时需设置isSct为true
  });
  layerStore.updateLayer({ type: "terrain" });

  //飞行定位到地形范围
  let terrainProvider = viewer.terrainProvider;
  terrainProvider.readyPromise.then(() => {
    const bounds = terrainProvider._bounds;
    const destination = new SuperMap3D.Rectangle.fromDegrees(
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north
    );

    viewer.scene.camera.flyTo({
      destination: destination,
    });
  });
}

// addS3MTilesLayerByScp之后，进行后处理
function promiseWhen(promiseArray: any[], isSCP?: boolean) {
  SuperMap3D.when.all(
    promiseArray,
    function (layers: any) {
      // for (let i = 0; i < layers.length; i++) {
      //   layers[i]._visibleDistanceMax = 16000; // 设置图层最大可见距离
      // }
      if (isSCP) {
        viewer.flyTo(layers[0]);
        layerStore.updateLayer({ type: "s3m" });
      }
    },
    function (e: any) {
      if (widget._showRenderLoopErrors) {
        let title = $t("addScpFailed");
        widget.showErrorPanel(title, undefined, e);
      }
    }
  );
}

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
    message.warning($t("repeatAddWMTSTip"));
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

  layerStore.updateLayer({ type: "imagery" });
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

watch(
  () => state.layerType,
  (val: string) => {
    switch (val) {
      case "S3M":
        state.urlTip = `http://<server>:<port>/iserver/services/<component>/rest/realspace/datas/<layerName>/config`;
        break;
      case "Imagery":
        state.urlTip = `http://<server>:<port>/realspace/services/<component>/rest/realspace/datas/<layerName>`;
        break;
      case "Terrain":
        state.urlTip = `http://<server>:<port>/realspace/services/<component>/rest/realspace/datas/<layerName>`;
        break;
      case "WMTS":
        state.urlTip = `http://<server>:<port>/iserver/services/{serviceName}`;
        break;
      default:
        break;
    }
  }
);
</script>
