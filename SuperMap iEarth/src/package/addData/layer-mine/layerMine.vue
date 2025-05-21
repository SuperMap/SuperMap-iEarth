<template>
  <div class="layer-terrain-container">

    <n-checkbox v-model:checked="state.useFileter">{{ $t("isOpenFileter") }}</n-checkbox>

    <div v-if="state.useFileter">
      <div class="row-item">
        <span>{{ $t("resourceSubType") }}</span>
        <n-select
          style="width: 1.96rem"
          v-model:value="state.filter_type"
          :options="serviceTypeOption"
          @update:value="handleTypeChange" 
        >
        </n-select>
      </div>
      <div class="row-item-mine" >
        <n-select style="width: 2.2rem" v-model:value="state.filter_field" :options="fieldOption" />
        <n-input class="add-input-border" v-model:value="state.filter_keywords" type="text" :placeholder="$t('layerMineFileterTip')"/>
        <div class="btn-row-item" style="margin-left:0px">
            <n-button
              type="info"
              class="ans-btn"
              color="#3499E5"
              text-color="#fff"
              :focusable="false"
              @click="handleFileter"
              >{{ $t("filter") }}</n-button
            >
        </div>
      </div>
    </div>


    <div class="portalServiceTable">
      <n-data-table
        size="small"
        :columns="columns"
        :data="state.portalServiceList"
        :row-class-name="(row)=> row.disabled ? 'myService-disabled-item' : ''"
        flex-height
        class="flex-1-hidden"
        v-model:checked-row-keys="state.checkedRowKeys"
      />
    </div>
    
    <n-scrollbar x-scrollable>
      <n-pagination 
        v-model:page="state.currentPage" 
        :page-count="state.pageCount" 
        style="margin-top: 0.1rem;"
      />
    </n-scrollbar>

    <!-- 场景服务 存在的场景名称 -->
    <div v-if="state.selectItem.resourceSubType == ServiceTypeEnum.Scene">
      <div class="row-item-mine" v-if="state.sceneNameOptions.length>0">
        <span>{{ $t("sceneName") }}</span>
        <n-select style="width: 2.4rem" v-model:value="state.sceneName" :options="state.sceneNameOptions" />
      </div>
    </div>
    
    <!-- 地图服务 可选的地图名称 -->
    <div v-if="state.selectItem.resourceSubType == ServiceTypeEnum.Map">
      <div class="row-item-mine" v-if="state.mapNameOptions.length>0">
        <span>{{ $t("mapName") }}</span>
        <n-select style="width: 2.4rem" v-model:value="state.mapName" :options="state.mapNameOptions" />
      </div>
    </div>

    <!-- 数据服务 数据源:数据集 -->
    <div v-if="state.selectItem.resourceSubType == ServiceTypeEnum.Data">
      <div class="row-item-mine" v-if="state.dataSourceOptions.length>0">
        <span>{{ $t("dataSourceName") }}</span>
        <n-select style="width: 2.4rem" v-model:value="state.dataSourceName" :options="state.dataSourceOptions" />
      </div>

      <div class="row-item-mine" v-if="state.dataSetOptions.length>0">
        <span>{{ $t("datasetName") }}</span>
        <n-select style="width: 2.4rem" v-model:value="state.dataSetName" :options="state.dataSetOptions" />
      </div>
    </div>

    <div class="btn-row-item opration">
      <n-button
        type="info"
        class="ans-btn"
        color="#3499E5"
        text-color="#fff"
        :focusable="false"
        @click="addService"
        >{{ $t("sure") }}</n-button
      >
      <n-button :focusable="false" @click="resetData">{{ $t("reset") }}</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, reactive } from "vue";
import { getRootUrl } from "@/tools/iportal/portalTools";
import tool from "@/tools/tool";
import CustomBubble from "@/lib/CustomBubble";

const customBubble = new CustomBubble(viewer,{
  isDesplayPickedEntityInfo:true
});
customBubble.start();

let entityCollection = new SuperMap3D.EntityCollection();

// let testHeader = 'http://172.16.168.74:8190/iportal/'; 
// http://172.16.168.74:8190/iportal/web/services.json?pageSize=10&orderBy=UPDATETIME&orderType=DESC&permissionType=READ&currentPage=1
// 用户名/密码：admin supermap.12 by 易桂全

onMounted(() => {
  let searchUrl = computedSearchUrl();
  getIportalServiceData(searchUrl);
  window["$message"].success($t("getData"));
});

onBeforeUnmount(()=>{
  entityCollection && entityCollection.values.forEach(entity => {
    viewer.entities.remove(entity);
  });
  entityCollection = null;
  customBubble.destroy();
})

// 服务类型枚举
enum ServiceTypeEnum {
  All = 'ALL',
  Scene = 'REALSPACE',
  Map = 'MAP',
  Data = 'DATA',
}

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
    title: $t("serviceName"),
    align: "center",
  },
  {
    key: "resourceSubType",
    title: $t("resourceSubType"),
    align: "center",
  },
  {
    key: "updateTime",
    title: $t("updateTime"),
    align: "center",
  },
  {
    key: "url",
    title: $t("serviceUrl"),
    align: "center",
    ellipsis: {
      tooltip: true,
    },
  },
])

// 过滤类型选项
const serviceTypeOption = ref([
  {
    label: $t("allTypes"),
    value: ServiceTypeEnum.All,
  },
  {
    label: $t("sceneService"),
    value: ServiceTypeEnum.Scene,
  },
  {
    label: $t("mapService"),
    value: ServiceTypeEnum.Map,
  },
  {
    label: $t("dataService"),
    value: ServiceTypeEnum.Data,
  }
])

// 过滤字段选项
const fieldOption = ref([
  {
    label: $t("serviceName"),
    value: "RESTITLE",
  },
  {
    label: $t("userName"),
    value: "USERNAME",
  },
  {
    label: $t("serviceAddress"),
    value: "LINKPAGE",
  },
  // {
  //   label: $t("proxyAddress"),
  //   value: "PROXIEDURL",
  // },
])

const state = reactive<any>({
  portalServiceList: [],
  checkedRowKeys: [""],
  currentPage:1,
  pageCount:1,
  selectItem:{},
  useFileter:false,
  filter_type:ServiceTypeEnum.All,
  filter_field:'RESTITLE',
  filter_keywords:'',
  dataSourceName:'',
  dataSourceOptions:[],
  dataSetName:'',
  dataSetOptions:[],
  mapName:'',
  mapNameOptions:[],
  sceneName:'',
  sceneNameOptions:[],
});

const supportTypes = [ServiceTypeEnum.Scene, ServiceTypeEnum.Map, ServiceTypeEnum.Data];
async function getIportalServiceData(searchUrl){
  if(!searchUrl) return;

  // 获取数据
  const data = await window.axios.get(searchUrl).then((response)=>{
    return response.data;
  })
  if (window.iEarthConsole) console.log("我的服务返回数据:",data);

  // 页码
  state.pageCount = Number(data.totalPage);

  // 计算服务列表
  let serviceList: any = [];
  if (data.content && data.content.length > 0) {
    data.content.forEach((item: any, index: number) => {
      const serviceUrl = item.linkPage || item.proxiedUrl; // 使用proxiedUrl会导致401权限问题 
      const isSupport = supportTypes.includes(item.type); // 限定支持的服务类型
      const updateTime = tool.dateDiff(item.updateTime);
      serviceList.push({
        key: `my-service-${index}`,
        name: item.resTitle || '',
        resourceSubType: item.type,
        updateTime: updateTime,
        url: serviceUrl,
        disabled: isSupport ? false : true,
      });
    })
  }

  state.portalServiceList.length = 0; // 清空当前列表
  state.portalServiceList = serviceList;
}

// 模拟本机iPortal开发
let baseUrl = getRootUrl() + 'web/services.json?pageSize=10&orderBy=UPDATETIME&orderType=DESC&permissionType=READ';
// let baseUrl = getRootUrl() + 'web/services.json' + `?token=${window.iEarthBindData.iPortalToken}` + '&pageSize=10&orderBy=UPDATETIME&orderType=DESC&permissionType=READ';
function computedSearchUrl(pageNumber?:number){
  const filter_type = state.filter_type == ServiceTypeEnum.All ? false : state.filter_type;
  const filter_field = state.filter_field;
  const keywords = state.filter_keywords == '' ? false : state.filter_keywords;

  let currentSearchUrl = "";
  if(filter_type && !keywords){ // 只过滤服务类型
    const sourceTypeQuery = encodeURIComponent(JSON.stringify([filter_type]));
    currentSearchUrl = `${baseUrl}&types=${sourceTypeQuery}`;
  }else if(!filter_type && keywords){ // 只过滤关键字
    const filterFieldsQuery = encodeURIComponent(JSON.stringify([filter_field]));
    const keywordsQuery = encodeURIComponent(JSON.stringify([keywords]));
    currentSearchUrl = `${baseUrl}&filterFields=${filterFieldsQuery}&keywords=${keywordsQuery}`;
  }else if(filter_type && keywords){ // 同时过滤类型和关键字
    const sourceTypeQuery = encodeURIComponent(JSON.stringify([filter_type]));
    const filterFieldsQuery = encodeURIComponent(JSON.stringify([filter_field]));
    const keywordsQuery = encodeURIComponent(JSON.stringify([keywords]));
    currentSearchUrl = `${baseUrl}&types=${sourceTypeQuery}&filterFields=${filterFieldsQuery}&keywords=${keywordsQuery}`;
  }else { // 未开启过滤 || 类型和关键字都不过滤
    currentSearchUrl = baseUrl;
  }

  let suffix_currentPage = pageNumber===undefined ? `&currentPage=1` :`&currentPage=${pageNumber}`;
  return currentSearchUrl+suffix_currentPage;
}

// 处理过滤服务
const handleFileter = function(){
  let searchUrl = computedSearchUrl();
  getIportalServiceData(searchUrl);
}

// 服务类型切换时执行过滤并重置选择项
const handleTypeChange = function(){
  handleFileter();
  state.selectItem = {}; // 重置选择项目
  state.checkedRowKeys = [""]; // 取消表格中的选择项
}

// 还原数据
 const resetData = function() {
  state.useFileter = false;
  state.filter_type = ServiceTypeEnum.All;
  state.filter_keywords = '';
  state.selectItem = {};
  state.checkedRowKeys = [""];
  let searchUrl = computedSearchUrl(1);
  getIportalServiceData(searchUrl);
}


// 打开保存的服务
const addService = function() {
  const selecteditems = state.portalServiceList.filter((item: any) => {
    return item.key === state.checkedRowKeys[0];
  });

  if(window.iEarthConsole) console.log("我的服务选择项目:",selecteditems);

  selecteditems.forEach((item) => {
    if (item.resourceSubType == ServiceTypeEnum.Scene) {
      handleRealSpace(item);
    } else if (item.resourceSubType == ServiceTypeEnum.Map) {
      handleMapService(item);
    }else if(item.resourceSubType == ServiceTypeEnum.Data){
      handleDataServiceByMVT(item); // GeoJson+MVT方式
      // handleDataServiceByEntity(item); // Entity方式
    }
  });
}

// 处理场景服务类型
function handleRealSpace(item) {
  let url = item.url + "/realspace";

  let sceneName = state.sceneName == '' ? undefined : state.sceneName;
  const promise = viewer.scene.open(url, sceneName, { autoSetView: true });
  SuperMap3D.when(promise, function (layers) {
    if (layers && layers.length > 0) {
      viewer.flyTo(layers[0]);
    }
  })
}

// 处理地图服务类型
function handleMapService(item) {
  if (!item.url || state.mapName == "") return;

  const mapName = state.mapName;
  let mapUrl = mapName.includes("rest/maps") ? mapName : `${item.url}/maps/${mapName}`;
  const imageLayer = viewer.imageryLayers.addImageryProvider(
    new SuperMap3D.SuperMapImageryProvider({
      url: mapUrl,
    })
  );

  // 给影像图层设置别名
  const layerName = mapUrl.split("rest/maps/")[1];
  if(layerName && layerName!='') imageLayer.customName = layerName;
  viewer.flyTo(imageLayer);
}

// 处理数据服务类型:通过Entity方式添加
function handleDataServiceByEntity(item) {
  if (state.dataSourceName == "" || state.dataSetName == "") {
    window["$message"].warning($t("sourceAndSetNameIsNeed"));
    return;
  }

  const sourceAndSetName = `${state.dataSourceName}:${state.dataSetName}`;
  // item.url = "http://172.16.112.34:8090/iserver/services/data-China_4326_Core/rest"; // 这个本地可以访问
  const featureUrl = item.url + "/data/featureResults.rjson?returnContent=true";
  const sqlParameter = {
    toIndex: -1,
    datasetNames: [sourceAndSetName],
    getFeatureMode: "SQL",
    queryParameter: {
      attributeFilter: "smid>=0"
    },
    maxFeatures: 12000
  };
  const queryData = JSON.stringify(sqlParameter);

  window.axios.post(featureUrl, queryData).then((result) => {
    console.log("数据服务-result:", result);
    if (result && result.data && result.data.features) {
      const features = result.data.features;

      if(features.length > 10000) { // 数据量太大时做限制，不再加载
        window["$message"].warning($t("dataTooLargrTip"));
        return;
      } 
       
      features.forEach(feature => {
        if (!feature.geometry) return;
        const description = computedFeatureDescription(feature);
        const geometry = feature.geometry;
        let entity = undefined;
        if (geometry.type == 'POINT') {
          entity = addPoint(geometry, description);
        } else if (geometry.type == 'LINE') {
          entity = addPolyline(geometry, description);
        } else if (geometry.type == 'REGION') {
          entity = addPolygon(geometry, description);
        }

        if (entity) entityCollection.add(entity);
      });
    }
  })

  // 添加三维点
  function addPoint(geometry, description) {
    const center = geometry.center;
    return viewer.entities.add({
      description: description,
      position: SuperMap3D.Cartesian3.fromDegrees(center.x, center.y, 0),
      billboard: {
        image: "./images/location.png",
        width: 30,
        height: 40,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
  }

  // 添加三维线
  function addPolyline(geometry, description) {
    let positionList: any = [];
    geometry.points.forEach(point => {
      if (point.x && point.y) {
        const position = SuperMap3D.Cartesian3.fromDegrees(point.x, point.y, 0);
        positionList.push(position);
      }
    })
    return viewer.entities.add({
      description: description,
      polyline: {
        positions: positionList,
        width: 5,
        material: SuperMap3D.Color.fromCssColorString("rgba(250, 196, 65, 1)"),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
    });
  }

  // 添加三维面
  function addPolygon(geometry, description) {
    let positionList: any = [];
    geometry.points.forEach(point => {
      if (point.x && point.y) {
        const position = SuperMap3D.Cartesian3.fromDegrees(point.x, point.y, 0);
        positionList.push(position);
      }
    })
    return viewer.entities.add({
      description: description,
      polygon: {
        hierarchy: {
          positions: positionList,
        },
        width: 5,
        material: SuperMap3D.Color.fromCssColorString("rgba(250, 196, 65, 1)").withAlpha(0.5),
      }
    });
  }

  // 将Feature携带的fieldNames和fieldValues转为description存储到Entity,方便CustomBubble拾取时能够直接读取显示
  function computedFeatureDescription(feature) {
    if (!feature.fieldNames || !feature.fieldValues) return;

    let description: any = [];
    for (let i = 0; i < feature.fieldNames.length; i++) {
      let array = [feature.fieldNames[i], feature.fieldValues[i]];
      description.push(array);
    }
    return JSON.stringify(description);
  }
}

// 处理数据服务类型:通过GeoJson生成MVT方式添加 
async function handleDataServiceByMVT(item) {
  if (state.dataSourceName == "" || state.dataSetName == "") {
    window["$message"].warning($t("sourceAndSetNameIsNeed"));
    return;
  }

  // 限制坐标系
  const epsgCode:any = await tool.computedDataSetEpsgCode(item.url, state.dataSourceName, state.dataSetName);
  if(!["4490", "4326"].includes(epsgCode)) {
    console.log("mvt-geojson-epsgCode:",epsgCode);
    window["$message"].warning($t("mvtGeojsonEpsgCodeTip"));
    return;
  }

  const sourceAndSetName = `${state.dataSourceName}:${state.dataSetName}`;
  // item.url = "http://172.16.112.34:8090/iserver/services/data-China_4326_Core/rest"; // 这个本地可以访问
  const featureUrl = item.url + "/data/featureResults.geojson?returnContent=true"; // geojson表述，返回geojson格式
  const sqlParameter = {
    toIndex: -1,
    datasetNames: [sourceAndSetName],
    getFeatureMode: "SQL",
    queryParameter: {
      attributeFilter: "smid>=0"
    },
    maxFeatures: 12000
  };
  const queryData = JSON.stringify(sqlParameter);

  window.axios.post(featureUrl, queryData).then((result) => {
    console.log("数据服务-result:", result);

    if (result && result.data && result.data.features) {
      const data = result.data;
      const geojson = {
        "type": "",
        "features": []
      }
      
      geojson["type"] = data.type;
      geojson["features"] = data.features;
      console.log("geojson:", geojson);
      if (geojson.features.length == 0) return;

      if(geojson.features.length > 10000) { // 数据量太大时做限制，不再加载
        window["$message"].warning($t("dataTooLargrTip"));
        return;
      } 

      const mvtName = sourceAndSetName;
      addMvtByGeoJSON(geojson, mvtName);
    }
  })

  function addMvtByGeoJSON(geojson, mvtName) {
    const mvtMap = viewer.scene.addVectorTilesMap({
      canvasWidth: 1024,
      name: mvtName,
      lineAntialiasing: false
    });

    // 针对点线面生成对应的样式
    const type = geojson.features[0].geometry.type; // 默认所有的feature类型一致
    let sourceID: any = undefined;
    let styleLayer: any = undefined;
    let customPosition: any = undefined;
    if (type == 'Point') {
      sourceID = `Point-${new Date().getTime()}`;
      // 显示文字标签
      // styleLayer = {
      //   id: sourceID,
      //   type: 'symbol',
      //   source: sourceID,
      //   layout: {
      //     'text-field': '{NAME}',
      //   },
      //   paint: {
      //     'text-color': 'white'
      //   }
      // }

      // 圆圈显示
      styleLayer = {
        id: sourceID,
        type: 'circle',
        source: sourceID,
        paint: {
          'circle-radius': 8,       // 圆圈半径
          'circle-color': '#FF0000', // 填充颜色
          'circle-stroke-width': 2, // 边框宽度
          'circle-stroke-color': '#000' // 边框颜色
        }
      }
      customPosition = geojson?.features[0]?.geometry?.coordinates;
    } else if (type == 'LineString') {
      sourceID = `Polyline-${new Date().getTime()}`;
      styleLayer = {
        id: sourceID, //style id
        type: 'line', //style type
        source: sourceID, //source name
        paint: {
          'line-color': 'red',
          'line-width': 5,
        }
      }
      customPosition = geojson?.features[0]?.geometry?.coordinates[0];
    } else if (type == 'Polygon') {
      sourceID = `Polygone-${new Date().getTime()}`;
      styleLayer = {
        id: sourceID,
        type: 'fill',
        source: sourceID,
        paint: {
          'fill-color': [
            'match',
            ['get', 'City'], // 属性字段
            '北京市', '#e1cee1',
            '天津市', '#ebeabc',
            // 默认颜色
            '#d0eacd'
          ],
          'fill-opacity': .9
        }
      }
      customPosition = geojson?.features[0]?.geometry?.coordinates[0][0];
    }else if(type == 'MultiPolygon'){
      sourceID = `MultiPolygon-${new Date().getTime()}`;
      styleLayer = {
        id: sourceID,
        type: 'fill',
        source: sourceID,
        paint: {
          'fill-color': [
            'match',
            // 默认颜色
            '#d0eacd'
          ],
          'fill-opacity': .9
        },
      }
      customPosition = geojson?.features[0]?.geometry?.coordinates[0][0][0];
    }

    // 从第一个feature的geometry获取的坐标信息用来图层列表定位
    mvtMap.customPosition = customPosition; 
    mvtMap.customFirstGeometry = geojson?.features[0]?.geometry;
    SuperMap3D.when(mvtMap.readyPromise, function () {
      if (sourceID && styleLayer) {
        mvtMap.addSource(sourceID, {
          type: "geojson",
          data: geojson
        })

        mvtMap.addLayer(styleLayer);
      }

      // 添加后定位过去
      const mvtPosition = customPosition;
      if (mvtPosition && mvtPosition.length >= 2 && Math.abs(mvtPosition[0]) <= 180) {
        viewer.scene.camera.setView({
          destination: new SuperMap3D.Cartesian3.fromDegrees(mvtPosition[0], mvtPosition[1], 500)
        });
      }
      window["$message"].success($t("addSuccess"));
    });
  }
}

// 选中项切换时变更底部内容
function handleSelectedItemChange(selecteditem) {
  // iPortal代理服务暂时不支持加载
  if(selecteditem && selecteditem.url){
    if(selecteditem.url.includes("/portalproxy/")){
      window["$message"].warning($t("portalproxyServiceTip"));
      state.selectItem = {};
      return;
    }
  }

  state.selectItem = selecteditem;

  const serviceType = state.selectItem.resourceSubType
  if (serviceType == ServiceTypeEnum.Data) {
    state.dataSourceName = "";
    state.dataSetName = "";
    state.dataSourceOptions = [];
    state.dataSetOptions = [];

    let dataUrl = selecteditem.url;
    if (!dataUrl.endsWith("/data")) dataUrl += "/data";
    tool.computedDataSourceOptions(dataUrl).then(result => {
      if(result == 401) {
        window["$message"].warning($t("iportalService401"));
        return;
      }
      if (result && result.length > 0) {
        state.dataSourceOptions = result;
      }
    });
  } else if (serviceType == ServiceTypeEnum.Map) {
    state.mapName = "";
    state.mapNameOptions = [];

    let mapUrl = selecteditem.url;
    tool.computedMapNameOptions(mapUrl).then(result => {
      if(result == 401) {
        window["$message"].warning($t("iportalService401"));
        return;
      }
      if (result && result.length > 0) {
        state.mapName = result[0].value;
        state.mapNameOptions = result;
      }
    });
  } else if (serviceType == ServiceTypeEnum.Scene) {
    state.sceneName = "";
    state.sceneNameOptions = [];

    let sceneUrl = selecteditem.url;
    tool.computedSceneNameOptions(sceneUrl).then(result => {
      if(result == 401) {
        window["$message"].warning($t("iportalService401"));
        return;
      }
      if (result && result.length > 0) {
        state.sceneName = result[0].value;
        state.sceneNameOptions = result;
      }
    });
  }
}

watch(
  () => state.currentPage,
  (val) => {
    let searchUrl = computedSearchUrl(Number(val));
    getIportalServiceData(searchUrl);
  }
);


watch(
  () => state.checkedRowKeys,
  (val) => {
    let selecteditems = state.portalServiceList.filter((item: any) => {
      return item.key === val[0];
    });
    if(selecteditems && selecteditems.length>0){
      const selecteditem = selecteditems[0];
      handleSelectedItemChange(selecteditem)
    }
  }
);

watch(
  () => state.dataSourceName,
  (val) => {
    if (!val || val == '') return;
    let dataUrl = state.selectItem.url;
    if(!dataUrl.endsWith("/data")) dataUrl += "/data";
    tool.computedDataSetOptions(dataUrl, val).then(result => {
      if (result && result.length > 0) {
        state.dataSetOptions = result;
      }
    });
  }
);

watch(
  () => state.useFileter,
  (val) => {
    if(!val) resetData()
  }
);
</script>

<style lang="scss" scoped>
.layer-terrain-container {
  display: flex;
  flex-wrap: wrap;

}

.portalServiceTable {
  display: flex;
  flex-direction: column;
  margin-right: 0.1rem;
  height: 2.3rem;
  background-color: rgb(29, 29, 17);
  opacity: 0.8;
  z-index: 999999;
}

.flex-1-hidden {
  flex: 1 1 0% !important;
  overflow: hidden;
}

.opration {
  margin-top: 0.1rem;
  margin-left: 60%;
}

.row-item-mine{
  span {
    font-size: 0.14rem;
  }
  display: flex;
  justify-content: space-between;
  width: 3.4rem;
  margin-top: 0.1rem;
  margin-right: 0.1rem;
}
</style>
