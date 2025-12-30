<!-- S3M图层属性查询 -->
<template>
  <div class="right-panel-container-not-tabs">
    <!-- 选择图层 -->
    <div class="row-wrap">
      <div class="label">{{ $t("chooseLayer") }}</div>
      <div class="content">
        <n-select v-model:value="state.selectS3MName" :options="state.s3mlayers" />
      </div>
    </div>

    <!-- 数据服务URL -->
    <div class="row-wrap">
      <div class="label">{{ $t("dataServerUrl") }}</div>
      <div class="content">
        <n-tooltip placement="top-end" trigger="hover">
          <template #trigger>
            <n-input v-model:value="state.dataUrl" type="text"
              @input="handleUrlChange" :placeholder="$t('inputServerUrl')" :status='state.inputUrlStatus' />
          </template>
          {{ state.urlFormatTip }}
        </n-tooltip>
      </div>
    </div>

    <!-- 数据源 -->
    <div class="row-wrap" v-if="state.dataSourceOptions.length>0">
      <div class="label">{{ $t("dataSourceName") }}</div>
      <div class="content">
        <n-select v-model:value="state.dataSourceName" :options="state.dataSourceOptions" />
      </div>
    </div>

    <!-- 合并数据集 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.isMerge" :label="$t('isMergeLayer')" />
      </div>
    </div>

    <!-- 数据集 -->
    <div class="row-wrap" v-if="state.dataSetOptions.length>0 && !state.isMerge">
      <div class="label">{{ $t("datasetName") }}</div>
      <div class="content">
        <n-select v-model:value="state.dataSetName" :options="state.dataSetOptions" />
      </div>
    </div>

    <div class="row-btns">
      <n-button @click="startQuery" class="operate" type="info" :focusable="false">{{
      $t("query") }}</n-button>
      <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
    </div>

    <!-- 辅助提示 -->
    <div class="panel-footer-tip-box"> {{ $t("qxUnsupportedQuery") }} </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import layerManagement from "@/tools/layerManagement";
import CustomBubble from "@/lib/CustomBubble";
import tool from "@/tools/tool";
import { UrlFormatEnum, UrlRegexEnum } from "@/enums/regexEnum";

const customBubble = new CustomBubble(viewer);
customBubble.start();

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectS3MName: string; //默认选择图层index
  dataUrl: string;
  dataSourceName: string;
  dataSourceOptions: any;
  dataSetName: string;
  dataSetOptions: any;
  urlFormatTip: string;
  isMerge: boolean;
  inputUrlStatus:any;
};

// http://www.supermapol.com/realspace/services/data-cbd/rest/data  -  二维数据
// http://www.supermapol.com/realspace/services/data-BIMbuilding/rest/data - BIMBuilding

// 初始化变量
const state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectS3MName: window.iEarthBindData.CurrentS3MLayerName, //默认选择图层index
  dataUrl: "",
  dataSourceName: "",
  dataSourceOptions:[],
  dataSetName: "",
  dataSetOptions:[],
  urlFormatTip:UrlFormatEnum.DataService,
  inputUrlStatus: undefined,
  isMerge:false
});
let currentS3MLayer:any = undefined;

function init() {
  state.s3mlayers = layerManagement.getS3MLayerList();
  currentS3MLayer = viewer.scene.layers.find(state.selectS3MName);

  // 获取图层绑定的数据源信息
  setQueryInfo();
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
  customBubble.destroy();
});

async function handleUrlChange(){
  state.dataUrl = state.dataUrl.trim().replaceAll("'", "").replaceAll('"', "");
  if(state.dataUrl == '') {
    state.inputUrlStatus = undefined;
    state.dataSourceName = "";
    state.dataSourceOptions = [];
    state.dataSetName = "";
    state.dataSetOptions = [];
    return;
  }

  // 使用正则校验URL
  const dataUrl = state.dataUrl;
  const regexResult = tool.checkUrlByRegex(dataUrl, UrlRegexEnum.DataService);
  if(regexResult && regexResult.isPass && regexResult.matchInfo){
    state.inputUrlStatus = undefined;
    const options = await tool.computedDataSourceOptions(dataUrl);
    if(options && options.length>0){
      state.dataSourceOptions = options;
    }
  }else{
    state.inputUrlStatus = "error";
    state.dataSourceName = "";
    state.dataSourceOptions = [];
    state.dataSetName = "";
    state.dataSetOptions = [];
  }
}

function startQuery() {
  if (state.dataUrl === "" || state.dataSourceName === "") {
    window["$message"].warning($t("inputUrlName"));
    return;
  }
  window["$message"].success($t("bindInfoOK"));

  const queryParameter = state.isMerge ? {
    url: state.dataUrl, // 数据服务：http://www.supermapol.com/realspace/services/data-BIMbuilding/rest/data
    dataSourceName: state.dataSourceName, // BIMBuilding
    isMerge: true,
  } : {
    url: state.dataUrl, // 数据服务：http://172.16.120.103:8090/iserver/services/data-CBDpure/rest/data
    dataSourceName: state.dataSourceName, // 二维数据
    dataSetName: state.dataSetName,
    isMerge: false,
  }

  currentS3MLayer.setQueryParameter(queryParameter);

  // 点击模型获取相关信息
  viewer.pickEvent.addEventListener(getModelInfo);

  // 保存数据源相关信息
  const targetItem = window.iEarthBindData.layerQueryOptions.find((item)=> item.name == currentS3MLayer.name);
  if(targetItem){
    targetItem.dataUrl = state.dataUrl;
    targetItem.dataSourceName = state.dataSourceName;
    targetItem.isMerge = state.isMerge;
    targetItem.dataSetName = state.isMerge ? undefined : state.dataSetName;
  }else{
    window.iEarthBindData.layerQueryOptions.push({
      name: currentS3MLayer.name,
      dataUrl: state.dataUrl,
      dataSourceName: state.dataSourceName,
      dataSetName: state.isMerge ? undefined : state.dataSetName,
      isMerge: state.isMerge
    });
  }
}

// 点击拾取实体，获取属性信息
function getModelInfo(feature: any) {
  if (window.iEarthConsole) console.log("属性查询点击拾取的feature:", feature);

  if (feature) {
    let rowsContent: any = [];
    for (let key in feature) {
      let value = String(feature[key]);
      if (value.includes(".")) {
        let value_num = Number(value);
        if (!isNaN(value_num)) {
          value = value_num.toFixed(2);
        }
      }

      let array = [key,value];
      rowsContent.push(array);
    }

    customBubble.open({
      title: `${$t("bubble_entityID")}:${feature.SMID}`,
      content: [
        {
          type: 'table', data: {
            headers: [$t("bubble_field"), $t("bubble_value")],
            rows: rowsContent
          }
        }
      ]
    });
  } else {
    customBubble.hidden();
    window["$message"].success($t("noData"));
  }
}

// 获取已绑定的图层查询信息
async function setQueryInfo() {
  const targetItem = window.iEarthBindData.layerQueryOptions.find((item)=> item.name == currentS3MLayer.name);
  if(targetItem){
    state.dataUrl = targetItem.dataUrl;
    state.dataSourceName = targetItem.dataSourceName;
    state.dataSourceOptions = await tool.computedDataSourceOptions(targetItem.dataUrl);
    state.dataSetName = targetItem.dataSetName;
    state.isMerge = targetItem.isMerge;
  }
}

// 清除
function clear() {
  state.dataUrl = "";
  state.dataSourceName = "";
  state.dataSourceOptions = [];
  state.dataSetName = "";
  state.dataSetOptions = [];
  state.isMerge = false;
  customBubble.hidden();
  viewer.pickEvent.removeEventListener(getModelInfo);
}

// 监听
watch(
  () => state.selectS3MName,
  (val) => {
    currentS3MLayer = viewer.scene.layers.find(val);
    clear();
    setQueryInfo();
  }
);

watch(
  () => state.dataSourceName,
  (val) => {
    if (!val || val == '') return;
    let dataUrl = state.dataUrl;
    if(!dataUrl.endsWith("/data")) dataUrl += "/data";
    tool.computedDataSetOptions(dataUrl, val).then(result => {
      if (result && result.length > 0) {
        // state.dataSetName = result[0].value;
        state.dataSetOptions = result;
      }
    });
  }
);
</script>