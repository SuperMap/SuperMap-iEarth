<template>
  <div class="right-panel-container-not-tabs">
    <!-- 数据服务URL -->
    <div class="row-wrap">
      <div class="label">{{ $t("mapDataUrl") }}</div>
      <div class="content">
        <n-tooltip placement="top-end" trigger="hover">
          <template #trigger>
            <n-input
              type="text"
              v-model:value="state.dataUrl"
              @input="handleUrlChange" :status='state.inputUrlStatus'
              :placeholder="$t('inputServerUrl')"
            />
          </template>
          {{ state.urlFormatTip }}
        </n-tooltip>
      </div>
    </div>

    <!-- 数据源 -->
    <div class="row-wrap" v-show="state.dataSourceOptions.length > 0">
      <div class="label">{{ $t("dataSourceName") }}</div>
      <div class="content">
        <n-select v-model:value="state.dataSourceName" :options="state.dataSourceOptions" />
      </div>
    </div>

    <!-- 数据集 -->
    <div class="row-wrap" v-show="state.dataSetOptions.length > 0">
      <div class="label">{{ $t("datasetName") }}</div>
      <div class="content">
        <n-select v-model:value="state.dataSetName" :options="state.dataSetOptions" />
      </div>
    </div>

    <!-- 查询字段 -->
    <div class="row-wrap" v-show="state.fieldOptions.length > 0">
      <div class="label">{{ $t("queryField") }}</div>
      <div class="content">
        <n-select v-model:value="state.queryField" :options="state.fieldOptions" />
      </div>
    </div>

    <!-- 查询打开属性表+清除 -->
    <div class="row-btns">
      <n-button @click="startQuery" class="operate" type="info" :focusable="false" :loading="state.isloading_table">{{
        $t("attributeList") }}</n-button>
      <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
    </div>


    <!-- 属性表-->
    <div class="table-container" v-if="state.showQueryTable">
      <!-- 表头：过滤+操作按钮 -->
      <div class="table-header">
        <div class="item info">
          {{ datasetNamesQuery }}{{ $t("listTotal_s") }}&nbsp;{{
            tableCount
          }}&nbsp;{{ $t("listTotal_e") }}
        </div>

        <!-- 过滤框 -->
        <div class="item search">
          <n-input-group>
            <!-- 输入关键字 -->
            <n-input
              style="margin-bottom: 0.1rem; width: 1.8rem"
              :placeholder="$t('queryPlaceHolder')"
              v-model:value="state.sqlString"
              :disabled="state.selectFiled === 'chooseFeild'"
            >
            </n-input>

            <!-- 选择字段 -->
            <n-popover
              placement="bottom"
              trigger="click"
              style="max-height: 2.4rem"
              scrollable
            >
              <template #trigger>
                <n-tooltip placement="top-end" trigger="hover">
                  <template #trigger>
                    <n-button type="tertiary">{{
                      state.selectFiled == "chooseFeild"
                        ? $t("chooseField")
                        : state.selectFiled
                    }}</n-button>
                  </template>
                  {{ $t("chooseFieldTip") }}
                </n-tooltip>
              </template>
              <!-- 字段选项 -->
              <n-radio-group
                v-model:value="state.selectFiled"
                name="radiogroup"
              >
                <n-space vertical>
                  <n-radio
                    v-for="song in columns"
                    :key="song.title"
                    :value="song.title"
                  >
                    {{ song.title }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-popover>
            <!-- 过滤按钮 -->
            <n-button
              :loading="state.isloading_filter"
              :focusable="false"
              @click="search"
              :disabled="state.selectFiled === 'chooseFeild'"
              >{{ $t("filter") }}</n-button
            >
          </n-input-group>
        </div>

        <!-- 操作按钮 -->
        <div class="items">
          <div class="operate-list">
            <!-- 字段筛选 -->
            <span class="icon-span-three">
              <column-setting v-model:columns="columns" />
            </span>
            <!-- 点选查询 -->
            <span class="icon-span-three">
              <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                  <i
                    class="iconfont iconSize icondianxuan"
                    @click="clickQuery"
                  ></i>
                </template>
                {{ $t("clickQuery") }}
              </n-tooltip>
            </span>
            <!-- 清除实体 -->
            <span class="icon-span-three">
              <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                  <i
                    class="iconfont iconSize iconshanchu"
                    @click="clearEntity"
                  ></i>
                </template>
                {{ $t("clearEntityTip") }}
              </n-tooltip>
            </span>
            <!-- 查询所有（刷新） -->
            <span class="icon-span-three">
              <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                  <i
                    class="iconfont iconSize iconshuaxin"
                    @click="queryAll"
                  ></i>
                </template>
                {{ $t("refreshData") }}
              </n-tooltip>
            </span>
            <!-- 关闭按钮 -->
            <span class="icon-span-three">
              <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                  <i
                    class="iconfont iconSize iconguanbi"
                    @click="state.showQueryTable = false"
                  ></i>
                </template>
                {{ $t("close") }}
              </n-tooltip>
            </span>
          </div>
        </div>
      </div>

      <!-- 表格内容 -->
      <n-data-table
        size="small"
        :columns="columns"
        :data="state.tableData"
        flex-height
        class="table-content"
        v-model:checked-row-keys="state.checkedRowKeys"
        :scroll-x="columns.length * 110"
      />

      <!-- 页码控制器 -->
      <div class="table-pagination">
        <div></div>
        <n-pagination
          :item-count="state.itemCount"
          :page-sizes="[10, 20, 30, 40]"
          :page="state.page"
          :page-size="state.pageSize"
          @update:page="onPageChange"
          @update:page-size="onUpdatePageSize"
        />
      </div>
      <!-- show-size-picker -->
      <!-- :pagination="pagination"  -->
      <!-- :row-class-name="rowClassName" -->
      <!-- @update:checked-row-keys="handleCheck" -->
      <!-- v-model:checked-row-keys="state.checkedRowKeys"  -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import ColumnSetting from "./coms/column-setting.vue";
import CustomBubble from "@/lib/CustomBubble";
import tool from "@/tools/tool";
import { UrlFormatEnum, UrlRegexEnum } from "@/enums/regexEnum";

const customBubble = new CustomBubble(viewer);
customBubble.start();

type StateType = {
  dataUrl: string;
  dataSetName: string;
  columns: any;
  tableData: any;
  checkedRowKeys: any;
  showQueryTable: boolean;
  page: number;
  pageSize: number;
  sqlString: string;
  selectFiled: string;
  itemCount: number;
  isFilter: boolean;
  isClickQuery: boolean;
  urlFormatTip: string;
  isloading_filter: boolean;
  isloading_table: boolean;
  dataSourceName:string;
  dataSourceOptions:any;
  dataSetOptions:any;
  queryField:string;
  fieldOptions:any;
  dataSetEPSG:any;
  inputUrlStatus:any;
};

// 初始化变量
const state = reactive<StateType>({
  // 获取数据源和数据集
  dataUrl: "",
  dataSourceName:'',
  dataSourceOptions:[],
  dataSetName: "",
  dataSetOptions:[],
  queryField:'',
  fieldOptions:[],
  dataSetEPSG:undefined,

  // 表格相关：列、内容、页码
  columns: [],
  tableData: [],
  checkedRowKeys: ["1"],
  showQueryTable: false, // 属性表显隐
  page: 1,
  pageSize: 10,
  itemCount: 0,

  // 过滤查询
  sqlString: "",
  selectFiled: "chooseFeild",
  isFilter: false,

  // 点选查询
  isClickQuery: false, 

  isloading_filter: false, // 等待关键字过滤查询
  isloading_table: false, // 等待属性表查询

  // 输入提示
  urlFormatTip: UrlFormatEnum.DataService,
  inputUrlStatus:undefined
});

const datasetNamesQuery = computed(() => { // 请求参数需要数据源和数据集以固定形式共同构造
  return `${state.dataSourceName}:${state.dataSetName}`;
});

// SQL查询参数
const sqlQueryParam:any = {
  "datasetNames": [],
  "getFeatureMode": "SQL",
  "queryParameter": {
    "attributeFilter": "SMID > 0" // 有些是SMID 有些是SmID
  },
  "hasGeometry": true
}

// ID查询参数
const idQueryParam: any = {
  "datasetNames": [],
  "getFeatureMode": "ID",
  "ids": [],
  "hasGeometry": true
}

// 坐标查询-点选查询
const pointQueryParam: any = {
  "getFeatureMode": "SPATIAL",
  "spatialQueryMode": "INTERSECT",
  "datasetNames": [],
  "geometry": {
    "id": 0,
    "parts": [
      1
    ],
    "points": [
      {
        "x": null, // 经度
        "y": null // 纬度
      }
    ],
    "type": "POINT"
  }
}

let handler;
let currentIMGLayer:any = undefined;

function init() {
  viewer.imageryLayers._layers.forEach(imageLayer => {
    if(imageLayer.customName == window.iEarthBindData.CurrentIMGLayerName){
      currentIMGLayer = imageLayer;
    }
  });

  // 获取图层绑定的数据源信息
  setQueryInfo();

  // 关闭云层，以防遮挡Entity实体
  viewer.scene.cloudBox = null;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear(true);
  customBubble.destroy();
});

// 计算查询URL
enum SearchEnum {
  JSON = 'json',
  GeoJSON = 'geojson'
}
function computedSearchUrl(dataUrl, type){
  switch (type) {
      case SearchEnum.JSON:
        return dataUrl + '/featureResults.json?returnContent=true&fromIndex=0&toIndex=10';
      case SearchEnum.GeoJSON:
        return dataUrl + '/featureResults.geojson?returnContent=true&fromIndex=0&toIndex=10';
      default:
        break;
    }
}

// 获取数据-第一页
async function startQuery() {
  if (state.dataUrl == "" || state.dataSourceName == "" || state.dataSetName == "") {
    window["$message"].error($t("mapQueryTip"));
    return;
  }

  if (state.tableData.length > 0) {
    state.showQueryTable = true;
    return;
  }

  // 计算当前数据集坐标系
  const dataSetInfo:any = await tool.computedDataSetInfo(state.dataUrl, state.dataSourceName, state.dataSetName);
  console.log("数据集信息:", dataSetInfo)
  if(dataSetInfo){
    state.dataSetEPSG = dataSetInfo.epsgCode;
  }

  clear(false);
  state.selectFiled = "chooseFeild";
  state.isloading_table = true;
  state.isFilter = false;

  // 查询数据
  queryAll();

  // 保存地图查询数据源相关信息
  const targetItem = window.iEarthBindData.mapQueryOptions.find((item)=> {
    return item.name == currentIMGLayer.customName;
  });
  if(targetItem){
    targetItem.dataUrl = state.dataUrl;
    targetItem.dataSourceName = state.dataSourceName;
    targetItem.dataSetName = state.dataSetName;
  }else{
    window.iEarthBindData.mapQueryOptions.push({
      name: currentIMGLayer.customName,
      dataUrl: state.dataUrl,
      dataSourceName: state.dataSourceName,
      dataSetName: state.dataSetName
    });
  }
}

// 刷新表格
function queryAll() {
  if (state.itemCount === 0) {
    window["$message"].success($t("queryWait"));
  } else {
    window["$message"].success($t("refreshData"));
  }

  // 刷新数据时，关闭过滤
  state.selectFiled = "chooseFeild";
  state.isFilter = false;
  sqlQueryParam.queryParameter.attributeFilter = `${state.queryField} > 0`;

  const searchUrl = computedSearchUrl(state.dataUrl, SearchEnum.JSON);
  window.axios
    .post(searchUrl, JSON.stringify(sqlQueryParam))
    .then(result => {
      console.log("result-属性表:", result);
      state.isloading_table = false;

      const data = result.data;
      if (!data || !data.features) return;

      let features: any = data.features;
      state.itemCount = data.totalCount;
      let features_pageSize = features.slice(0, 10);
      updateTable(features_pageSize);
    })

}

// 点选查询
function clickQuery() {
  if (state.isClickQuery) {
    if (handler) {
      handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); //移除事件
      handler.destroy();
      handler = null;
    }
    window["$message"].success($t("clickQueryClose"));
    state.isClickQuery = false;

    // 恢复鼠标样式
    tool.setMouseCursor("normal");

    return;
  }
  window["$message"].success($t("clickQueryCloseTip"));
  state.isClickQuery = true;

  // 修改鼠标样式
  tool.setMouseCursor("drawCur");

  handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (event) {
    viewer.entities.removeAll();

    const position = viewer.scene.pickPosition(event.position);
    const degreeList = window.iEarthTool.Cartesian3ToDegreeObjs(position);
    if(degreeList.length === 0) return;
    const degree = degreeList[0];

    pointQueryParam.geometry.points = [
      {
        x: degree.longitude,
        y: degree.latitude,
      }
    ]

    const searchUrl = computedSearchUrl(state.dataUrl, SearchEnum.GeoJSON);
    window.axios
      .post(searchUrl, JSON.stringify(pointQueryParam))
      .then(result => {
        console.log("点选查询:", result);
        const data = result.data;

        if (data && data.features && data.features.length > 0) {
          const feature = data.features[0];
          addFeature(feature, false);

          // 弹窗
          const rowsContent = getModelInfo(feature);
          const content: any = [
            {
              type: 'table', data: {
                headers: [$t("bubble_field"), $t("bubble_value")],
                rows: rowsContent ?? [[1, 2]]
              }
            }
          ];
          customBubble.open({
            title: 'Mix Content',
            content: content
          });
        }else{
          window["$message"].success($t("noData"));
          customBubble.hidden();
          return;
        }
      })
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction(() => {
    clickQuery();
    state.showQueryTable = true;
    customBubble.hidden();
  }, SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
}

// 点击拾取实体，获取属性信息
function getModelInfo(feature: any) {
  if (feature) {
    let properties = feature.properties;
    let rowsContent: any = [];
    for (let key in properties) {
      let value = String(properties[key]);
      let array = [key, value];
      rowsContent.push(array);
    }

    return rowsContent;
  } else {
    customBubble.hidden();
    window["$message"].success($t("noData"));
  }
}

// 获取已绑定的图层查询信息
function setQueryInfo() {
  const targetItem = window.iEarthBindData.mapQueryOptions.find((item)=> {
    return item.name == currentIMGLayer.customName;
  });
  if (targetItem) {
    state.dataUrl = targetItem.dataUrl;
    handleUrlChange(); // 获取数据服务中数据源选项
    state.dataSourceName = targetItem.dataSourceName;
    state.dataSetName = targetItem.dataSetName;
  }
}

// 清除
function clear(isClearInfo = true) {
  customBubble.hidden();
  // 删除添加的geojson数据源
  for (let i = 0; i < geoJsonDataSourceList.length; i++) {
    let geoJsonDataSource = geoJsonDataSourceList[i];
    viewer.dataSources.remove(geoJsonDataSource);
  }
  geoJsonDataSourceList = [];
  state.showQueryTable = false;
  if (handler) {
    handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); //移除事件
    handler.destroy();
    handler = null;
  }
  if (isClearInfo) {
    state.dataUrl = "";
    state.dataSourceName = "";
    state.dataSetName = "";
    state.queryField = "";
    state.dataSourceOptions = [];
    state.dataSetOptions = [];
    state.fieldOptions = [];
  }
  state.columns = [];
  state.tableData = [];
  state.itemCount = 0;
  state.isloading_filter = false;
  state.isloading_table = false;
  state.sqlString = "";

  state.dataSetEPSG = undefined;

  columns.value.length = 0;
  columns.value.push({
    type: "selection",
    multiple: false,
    align: "center",
  });

  viewer.entities.removeAll();

  // 恢复鼠标样式
  tool.setMouseCursor("normal");
}


// 清除实体
function clearEntity() {
  // 删除添加的geojson数据源
  for (let i = 0; i < geoJsonDataSourceList.length; i++) {
    let geoJsonDataSource = geoJsonDataSourceList[i];
    viewer.dataSources.remove(geoJsonDataSource);
  }
  geoJsonDataSourceList = [];
  viewer.entities.removeAll();
}

// 表格相关
// 更新表格
function updateTable(featureList: any[]) {
  // 初始化
  state.tableData = [];

  if (columns.value.length === 1) {
    if (featureList.length === 0) return;

    // 设置字段
    const fieldNames = featureList[0].fieldNames;
    fieldNames.forEach((field: string) => {
      columns.value.push({
        // resizable: true, // 列宽可拖拽
        key: field,
        title: field,
        align: "center",
        width: 100,
        ellipsis: {
          tooltip: true,
        },
      });
    });
  }

  // 设置数据
  let tableData: any = [];
  featureList.forEach((feature: any) => {
    const obj:any = {};
    feature.fieldNames.forEach((field,index) => {
      obj[field] = feature.fieldValues[index];
    });
    obj.key = obj.SMID || obj.SmID;
    tableData.push(obj);
  });
  state.tableData = tableData;
  state.showQueryTable = true;
}

// 选中行查询
function handleCheck(rowKeys: any) {
  viewer.entities.removeAll();
  idQueryParam.ids = rowKeys;

  const searchUrl = computedSearchUrl(state.dataUrl, SearchEnum.GeoJSON);
  window.axios
    .post(searchUrl, JSON.stringify(idQueryParam))
    .then(result => {
      console.log(`选中ID:${rowKeys[0]}, 信息为:`, result);
      const data = result.data;
      if (!data) return;
      if (data.features && data.features.length > 0) {
        addFeature(data.features[0])
      }
    })
}

// 通过GeoJsonDataSource.load直接添加feature
let geoJsonDataSourceList: any = [];
function addFeature(feature: any, isZoomTo:boolean=true) {
  if (geoJsonDataSourceList.length > 0) {
    let lastGeoJsonDataSource = geoJsonDataSourceList.pop();
    viewer.dataSources.remove(lastGeoJsonDataSource);
  }
  if (!feature) return;

  let entityPromise = SuperMap3D.GeoJsonDataSource.load(feature);
  entityPromise
    .then(function (dataSource: any) {
      geoJsonDataSourceList.push(dataSource);
      viewer.dataSources.add(dataSource);
      let entities = dataSource.entities.values;
      if(isZoomTo) viewer.zoomTo(entities[0]);
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (!entity.polygon) {
          return;
        }
        entity.polygon.material = SuperMap3D.Color.BLUE.withAlpha(0); // 闪面
        entity.polygon.heightReference =
          SuperMap3D.HeightReference.CLAMP_TO_GROUND; // 贴地
        // entity.polygon.outlineColor = SuperMap3D.Color.BLUE; // 轮廓颜色
        // entity.polygon.outlineWidth = 10; // 轮廓宽度
      }
      // viewer.zoomTo(entities[0]);
    })
    // .otherwise(function (error) {
    //   window.alert(error);
    // });
}

// 表格列
const columns: any = ref([
  {
    type: "selection",
    multiple: false,
    align: "center",
  },
]);

// sql模糊查找
function search() {
  const selectFiled = state.selectFiled;
  const keyword = state.sqlString;

  if(selectFiled!='on' && keyword!=''){
    sqlQueryParam.queryParameter.attributeFilter = `${selectFiled} LIKE '%${keyword}%'`
  }else{
    queryAll();
    return;
  }

  state.page = 1;
  state.isloading_filter = true;

  const searchUrl = computedSearchUrl(state.dataUrl, SearchEnum.JSON);
  window.axios
    .post(searchUrl, JSON.stringify(sqlQueryParam))
    .then(result => {
      state.isloading_filter = false;
      console.log("result-模糊查询:", result);
      const data = result.data;
      if (!data) return;

      let features: any = data.features;
      state.itemCount = data.totalCount;
      let features_pageSize = features.slice(0, 10);
      state.isloading_table = false;
      updateTable(features_pageSize);
    })
}

// 分页查找
function getDataByPage(pageNum) {
  const selectFiled = state.selectFiled;
  const keyword = state.sqlString;

  const pageNumber = pageNum - 1; // 起始为1
  const pageSize = state.pageSize;

  const fromIndexNumber = pageNumber * pageSize;
  const toIndexNumber = fromIndexNumber + (pageSize - 1);

  if(selectFiled=='on' || keyword==''){
    sqlQueryParam.queryParameter.attributeFilter = `${state.queryField} > 0`;
  }

  const searchUrl = state.dataUrl + "/featureResults.json" + `?returnContent=true&fromIndex=${fromIndexNumber}&toIndex=${toIndexNumber} `;
  window.axios
    .post(searchUrl, JSON.stringify(sqlQueryParam))
    .then(result => {
      console.log(`分页查询第${pageNumber}页：从${fromIndexNumber+1}到${toIndexNumber+1}`, result);
      const data = result.data;
      if (!data) return;
      
      state.itemCount = data.totalCount;
      let features: any = data.features;
      updateTable(features);
    })
}

// 页码变化事件
function onPageChange(page: number) {
  state.page = page;
  getDataByPage(page);
}
// 页码尺寸变化
function onUpdatePageSize(pageSize: number) {
  state.pageSize = pageSize;
  state.page = 1;
}

let tableCount = computed(() => {
  return state.itemCount;
});



// 处理数据服务输入，获取数据源选项
function handleUrlChange() {
  state.dataUrl = state.dataUrl.trim().replaceAll("'", "").replaceAll('"', "");
  if(state.dataUrl == '') {
    state.inputUrlStatus = undefined;
    state.dataSourceName = "";
    state.dataSetName = "";
    state.queryField = "";
    state.dataSourceOptions = [];
    state.dataSetOptions = [];
    state.fieldOptions = [];
    return;
  }

  // 使用正则校验URL
  const dataUrl = state.dataUrl;
  const regexResult = tool.checkUrlByRegex(dataUrl, UrlRegexEnum.DataService);
  if(regexResult && regexResult.isPass && regexResult.matchInfo){
    state.inputUrlStatus = undefined;
    state.showQueryTable = false; // 当数据服务出现更改时，关闭表格显示
    state.dataSourceName = "";
    state.dataSetName = "";
    state.queryField = "";
    state.dataSourceOptions = [];
    state.dataSetOptions = [];
    state.fieldOptions = [];
    computedDataSourceOptions(dataUrl);
  }else{
    state.inputUrlStatus = "error";
    state.dataSourceName = "";
    state.dataSetName = "";
    state.queryField = "";
    state.dataSourceOptions = [];
    state.dataSetOptions = [];
    state.fieldOptions = [];
  }
}

// 基于数据服务URL计算数据源选项
async function computedDataSourceOptions(dataUrl){
  //  http://localhost:8090/iserver/services/data-WorkSpace/rest/data/datasources.json
  const dataSourceUrl = dataUrl + '/datasources.json';
  const result = await window.axios.get(dataSourceUrl);
  if(!result || result.status != 200) return;
  const data = result.data;
  if(!data.datasourceNames || data.datasourceNames.length==0) return;

  state.dataSourceOptions.length = 0;
  data.datasourceNames.forEach(name => {
    const option = {
      label: name,
      value: name,
    }
    state.dataSourceOptions.push(option);
  });
}

// 基于数据源服务URL计算数据集选项
async function computedDataSetOptions(dataSourceName) {
  // http://localhost:8090/iserver/services/data-WorkSpace/rest/data/datasources/NewDatasource/datasets.json
  const dataSetUrl = state.dataUrl + '/datasources/' + dataSourceName + '/datasets.json';
  const result = await window.axios.get(dataSetUrl);
  if(!result || result.status != 200) return;
  const data = result.data;
  if(!data.datasetNames || data.datasetNames.length==0) return;

  state.dataSetOptions.length = 0;
  data.datasetNames.forEach(name => {
    const option = {
      label: name,
      value: name,
    }
    state.dataSetOptions.push(option);
  });
}

// 基于数据集服务URL计算字段选项
async function computedDataSetFieldOptions(dataSetName) {
  // http://localhost:8090/iserver/services/data-WorkSpace/rest/data/datasources/NewDatasource/datasets/Country_R_1/fields.json
  const dataSetFieldUrl = state.dataUrl + '/datasources/' + state.dataSourceName + '/datasets/' + dataSetName + '/fields.json';
  const result = await window.axios.get(dataSetFieldUrl);
  if(!result || result.status != 200) return;
  const data = result.data;
  if(!data.fieldNames || data.fieldNames.length==0) return;

  state.fieldOptions.length = 0;
  data.fieldNames.forEach(name => {
    const option = {
      label: name,
      value: name,
    }
    state.fieldOptions.push(option);
  });
  state.queryField = data.fieldNames[0];
}

watch(
  () => state.dataSourceName,
  (val) => {
    if(!val || val == '') return;
    computedDataSetOptions(val);
  }
);

watch(
  () => state.dataSetName,
  (val) => {
    if(!val || val == '') return;
    computedDataSetFieldOptions(val);
    sqlQueryParam.datasetNames = [datasetNamesQuery.value];
    idQueryParam.datasetNames = [datasetNamesQuery.value];
    pointQueryParam.datasetNames = [datasetNamesQuery.value];
  }
);

watch(
  () => state.checkedRowKeys,
  (val) => {
    handleCheck(val);
  }
);
</script>

<style lang="scss" scoped>
.table-container {
  position: fixed;
  bottom: 0.3rem;
  left: 5%;
  width: 90%;
  height: 3rem;
  z-index: 999999;
  background-color: rgb(29, 29, 17);
  opacity: 0.8;
  padding: 0.1rem;

  display: flex;
  flex-direction: column;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 0.4rem;
    width: 100%;

    .items {
      line-height: 0.35rem;
    }

    .info {
      text-align: center;
      margin-left: 0.2rem;
    }

    .search {
      margin-top: 0.1rem;
      margin-right: -4rem;
    }
    
    .operate-list {
      display: flex;
      width: 2.2rem;
      height: auto;
      margin-left: 0.4rem;

      .icon-span-three {
        width: 25%;
        display: inline-block;
        text-align: center;
        cursor: pointer;
      }
    }
  }

  .table-content {
    flex: 1 1 0% !important;
    overflow: hidden;
  }

  .table-pagination {
    display: flex;
    justify-content: space-between;
  }
}
</style>
