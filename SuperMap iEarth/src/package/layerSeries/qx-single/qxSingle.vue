<!-- 倾斜单体化 -->
<template>
  <div class="right-panel-container-not-tabs">
    <!-- 数据服务 -->
    <div class="row-wrap">
      <div class="label">{{ $t("dataServerUrl") }}</div>
      <div class="content">
        <n-tooltip placement="top-end" trigger="hover">
          <template #trigger>
            <n-input v-model:value="state.dataServiceUrl" type="text"
              :placeholder="$t('qxLayerDataUrl')" @input="handleUrlChange" :status='state.inputUrlStatus' />
          </template>
          {{ state.urlFormatTip }}
        </n-tooltip>
      </div>
    </div>

    <!-- 数据源 -->
    <div class="row-wrap" v-if="state.dataSourceOptions.length > 0">
      <div class="label">{{ $t("dataSourceName") }}</div>
      <div class="content">
        <n-select v-model:value="state.dataSourceName" :options="state.dataSourceOptions" />
      </div>
    </div>

    <!-- 数据集 -->
    <div class="row-wrap" v-if="state.dataSetOptions.length > 0">
      <div class="label">{{ $t("datasetName") }}</div>
      <div class="content">
        <n-select v-model:value="state.dataSetName" :options="state.dataSetOptions" />
      </div>
    </div>

    <!-- 选中颜色 -->
    <div class="row-wrap">
      <div class="label">{{ $t("selectedColor") }}</div>
      <div class="content">
        <n-color-picker :show-alpha="false" v-model:value="state.entityColor" :render-label="() => {
        return '';
                }
        " size="small"></n-color-picker>
      </div>
    </div>

    <!-- 透明度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("transparency") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.transparency" :step="0.1" :min="0.1" :max="1" />
          <n-input-number v-model:value="state.transparency" :update-value-on-input="false" :bordered="false"
            :show-button="false" :min="0.1" :max="1" :step="0.1" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 查询模式 -->
    <div class="row-wrap">
      <div class="label">{{ $t("queryMode") }}</div>
      <div class="content">
        <n-select v-model:value="state.queryMode" :options="queryModeOption" />
      </div>
    </div>

    <div class="row-btns">
      <n-button @click="singleQuery" class="operate" type="info" :focusable="false">{{
      $t("query") }}</n-button>
      <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
    </div>


    <!-- 添加媒体字段 -->
    <div class="row-btns" v-if="mediaState.isDisplayBtn">
      <n-button @click="openMediaPanle" class="operate" type="info" :focusable="false"
        style="width:0.8rem;margin-top:0.2rem;">{{
        $t("addField") }}</n-button>
    </div>

    <!-- 媒体字段面板 -->
    <div v-if="mediaState.mediaFieldPanleShow">
      <n-modal v-model:show="mediaState.mediaFieldPanleShow" preset="dialog" :title="mediaPanleTitle"
        :mask-closable="false">
        <n-card style="width: auto" :bordered="false" size="huge" role="dialog" aria-modal="true">

          <n-collapse :trigger-areas="triggerAreas" display-directive="show">
            <n-collapse-item v-for="(item, index) in mediaState.mediaFieldOptions" :key="index" :title="$t(item.type)"
              :name=item.type>
              <!-- 资源名称 -->
              <div class="row-wrap">
                <div class="label">{{ $t("resouceName") }}</div>
                <div class="content">
                  <n-input v-model:value="item.name" type="text" />
                </div>
              </div>
              <!-- 资源链接 -->
              <div class="row-wrap">
                <div class="label">{{ $t("resouceLink") }}</div>
                <div class="content">
                  <n-input v-model:value="item.link" :placeholder="$t('inputOnlineResourceLink_iportal')" type="text">
                  </n-input>
                </div>
              </div>
              <!-- 清除按钮 -->
              <template #header-extra>
                <i class="iconfont iconguanbi" style="font-size: 0.14rem" @click="removeItem(item)"
                  :title="$t('deleteMediaField')"></i>
              </template>
            </n-collapse-item>
          </n-collapse>

          <div class="row-btns">
            <n-button @click="saveMediaField" class="operate" type="info" :focusable="false">{{
            $t("sure") }}</n-button>
            <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
          </div>
        </n-card>
      </n-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import CustomBubble from "@/lib/CustomBubble";
import tool from "@/tools/tool";
import { UrlFormatEnum, UrlRegexEnum } from "@/enums/regexEnum";

const scene = viewer.scene;
const customBubble = new CustomBubble(viewer);
customBubble.start();

type StateType = {
  dataServiceUrl: string; // 数据服务URL
  dataSourceName: string; // 数据源名称
  dataSourceOptions: any,
  dataSetName: string; // 数据集名称
  dataSetOptions: any;
  entityColor: string; //设置实体颜色
  transparency: number; //实体透明度
  queryMode: string; // 查询模式
  inputUrlStatus:any;
  urlFormatTip:string;
};

// 倾斜图层URL:http://www.supermapol.com/realspace/services/3D-dynamicDTH-2/rest/realspace/datas/Config%20-%201/config
const state = reactive<StateType>({
  // dataServiceUrl: 'http://172.16.120.103:8090/iserver/services/data-dynamicDTH/rest/data',
  // dataSourceName: '铁岭矢量面',
  // dataSetName: 'New_Region3D_1',
  // dataServiceUrl: 'http://www.supermapol.com/realspace/services/data-FCFH_Shangdong/rest/data',
  // dataSourceName: 'mian',
  // dataSetName: 'mian',
  dataServiceUrl: "",
  dataSourceName: "",
  dataSetName: "",
  dataSourceOptions: [],
  dataSetOptions: [],
  entityColor: "rgb(166,252,252)",
  transparency: 0.6,
  queryMode: 'point',
  inputUrlStatus:undefined,
  urlFormatTip: UrlFormatEnum.DataService,
});

const mediaState = reactive({
  isDisplayBtn: false,
  mediaFieldPanleShow: false,
  currentFeatureID: '',
  mediaFieldOptions: [
    {
      type: "image",
      name: '',
      link: ''
    },
    {
      type: "video",
      name: '',
      link: ''
    },
    {
      type: "link",
      name: '',
      link: ''
    },
    {
      type: "pdf",
      name: '',
      link: ''
    },
  ]
})

// 单体化查询模式选项
const queryModeOption = ref([
  {
    label: () => $t('queryPoint'),
    value: "point",
  },
  {
    label: () => $t('queryFloor'),
    value: "floor",
  },
  {
    label: () => $t('queryDoor'),
    value: "door",
  }
])

// 添加媒体字段相关
const triggerAreas = computed(() => ['arrow', 'main']);
const mediaPanleTitle = computed(() => {
  const featureID = mediaState.currentFeatureID;
  return `模型ID：${featureID}/添加字段`;
});

const currentS3MLayerName = window.iEarthBindData.CurrentS3MLayerName;

let handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);

onMounted(() => { });

onBeforeUnmount(() => {
  clear();
  customBubble.destroy();
  if (handler) handler.destroy();
});

async function handleUrlChange() {
  state.dataServiceUrl = state.dataServiceUrl.trim().replaceAll("'", "").replaceAll('"', "");
  if(state.dataServiceUrl == '') {
    state.inputUrlStatus = undefined;
    state.dataSourceName = "";
    state.dataSourceOptions = [];
    state.dataSetName = "";
    state.dataSetOptions = [];
    return;
  }

  // 使用正则校验URL
  const dataServiceUrl = state.dataServiceUrl;
  const regexResult = tool.checkUrlByRegex(dataServiceUrl, UrlRegexEnum.DataService);
  if(regexResult && regexResult.isPass && regexResult.matchInfo){
    state.inputUrlStatus = undefined;
    const result = await tool.computedDataSourceOptions(dataServiceUrl);
    if (result && result.length > 0) {
      state.dataSourceOptions = result;
    }
  }else{
    state.inputUrlStatus = "error";
    state.dataSourceName = "";
    state.dataSourceOptions = [];
    state.dataSetName = "";
    state.dataSetOptions = [];
  }
}

// 单体化查询
function singleQuery() {
  if (state.dataServiceUrl == "" || state.dataSourceName == "" || state.dataSetName == "") {
    window["$message"].warning($t("singleTip_waring"));
    return;
  }
  window["$message"].success($t("singleTip_success"));

  handler.setInputAction(function (e: any) {
    viewer.entities.removeById("identify-area"); // 首先移除之前添加标识实体

    const position = viewer.scene.pickPosition(e.position); // pickPositionAsync.then 异步接口
    if (position && position instanceof SuperMap3D.Cartesian3) {
      const degree = window.iEarthTool.Cartesian3ToDegreeObjs(position)[0];

      const dataSourceName = state.dataSourceName;
      const dataSetName = state.dataSetName;
      const datasetNames_query = [`${dataSourceName}:${dataSetName}`];

      if (state.queryMode == 'point') {
        const point = {
          x: degree.longitude,
          y: degree.latitude,
        };
        const searchUrl = state.dataServiceUrl + '/featureResults.rjson?returnContent=true';
        queryByPoint(searchUrl, datasetNames_query, point);
      } else {
        const searchUrl = state.dataServiceUrl;
        const height = degree.height;
        const longitude = degree.longitude;
        const latitude = degree.latitude;
        const sqlString = `bottom < ${height} and ${height} < (bottom + LSG) and ${longitude} > SmSdriW and ${longitude} < SmSdriE and ${latitude} > SmSdriS and ${latitude} < SmSdriN`;
        queryByDivision(searchUrl, datasetNames_query, sqlString);
      }
    }
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

// 通过点击查询用于表示单体化的面要素，添加到场景中高亮显示。
function queryByPoint(searchUrl, datasetNames, queryPoint) {
  const queryObj = {
    getFeatureMode: "SPATIAL",
    spatialQueryMode: "INTERSECT",
    datasetNames: datasetNames,
    geometry: {
      id: 0,
      parts: [1],
      points: [queryPoint],
      type: "POINT",
    },
  };

  const queryObjJSON = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数

  window.axios({
    url: searchUrl,
    data: queryObjJSON,
    method: "post",
  }).then(function (response) {
    const resultObj = response.data;
    if (resultObj.featureCount > 0) {
      let feature = resultObj.features[0];
      addClapFeature(feature);
      addBubble(feature);
      mediaState.isDisplayBtn = true;
      mediaState.currentFeatureID = feature.ID ?? '';
    } else {
      customBubble.hidden();
      mediaState.isDisplayBtn = false;
    }
  });

  // 将数据服务查询到的要素添加到场景中高亮显示，表示选中效果。
  function addClapFeature(feature) {
    console.log("feature-倾斜单体化:", feature);
    let lonLatArr = getLonLatArray(feature.geometry.points);
    let colorString = state.entityColor.replace("rgb", "rgba");
    let materialColor = colorString.replace(")", `,${state.transparency})`);
    viewer.entities.add({
      id: "identify-area",
      name: "tie_qx_entity",
      polygon: {
        hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(lonLatArr),
        material: SuperMap3D.Color.fromCssColorString(materialColor),
        classificationType: SuperMap3D.ClassificationType.S3M_TILE, // 贴在S3M模型表面
      },
    });

    // 得到[经度,纬度,经度,纬度...]形式的数组，用于构造面。
    function getLonLatArray(points: any) {
      let point3D: any = [];
      points.forEach(function (point) {
        point3D.push(point.x);
        point3D.push(point.y);
      });
      return point3D;
    }
  }
}

// 分层分户查询
function queryByDivision(searchUrl, datasetNames, sqlString) {
  if (!SuperMap) return;
  const getFeatureParam = new SuperMap.REST.FilterParameter({
    attributeFilter: sqlString
  });
  const getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    toIndex: -1,
    datasetNames: datasetNames
  });
  const getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(searchUrl, {
    eventListeners: {
      "processCompleted": onQueryComplete, // 查询成功时的回调函数
      "processFailed": processFailed // 查询失败时的回调函数
    }
  });
  getFeatureBySQLService.processAsync(getFeatureBySQLParams);

  function onQueryComplete(queryEventArgs) {
    console.log("倾斜分层分户查询:", queryEventArgs);
    // 处理entity
    viewer.entities.removeById("identify-area"); // 首先移除之前添加标识实体

    const selectedFeature = queryEventArgs.originResult.features[0]; // 选中楼层的楼层面信息对象
    if (!selectedFeature) {
      customBubble.hidden();
      mediaState.isDisplayBtn = false;
      return;
    } else {
      mediaState.isDisplayBtn = true;
      mediaState.currentFeatureID = selectedFeature.ID ?? '';
    }
    if (!selectedFeature.fieldNames || !selectedFeature.fieldValues) return;
    if (!selectedFeature.geometry.points) return;

    const BOTTOM_index = selectedFeature.fieldNames.indexOf('BOTTOM');
    const LSG_index = selectedFeature.fieldNames.indexOf('LSG');
    if (BOTTOM_index == -1 || LSG_index == -1) return;

    const bottomHeight = Number(selectedFeature.fieldValues[BOTTOM_index]); // 底部高程
    const extrudeHeight = Number(selectedFeature.fieldValues[LSG_index]); // 层高（拉伸高度）
    const points3D: any = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
    selectedFeature.geometry.points.forEach((pt: any) => {
      points3D.push(pt.x, pt.y);
    });

    let colorString = state.entityColor.replace("rgb", "rgba");
    let materialColor = colorString.replace(")", `,${state.transparency})`);
    viewer.entities.add({
      id: "identify-area",
      polygon: {
        hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(points3D),
        material: SuperMap3D.Color.fromCssColorString(materialColor),
        classificationType: SuperMap3D.ClassificationType.S3M_TILE,  // 贴在S3M模型表面
        groundBottomAltitude: bottomHeight,
        groundExtrudedHeight: extrudeHeight
      },
    });

    // 处理弹窗
    addBubble(selectedFeature);
  }

  function processFailed(queryEventArgs) {
    console.log("查询失败：", queryEventArgs);
  }
}

// 基于feature计算弹窗
function addBubble(feature) {
  if (!feature.fieldNames || feature.fieldNames.length == 0) return;

  let rowsContent: any = [];
  for (let i = 0; i < feature.fieldNames.length; i++) {
    let array = [feature.fieldNames[i], feature.fieldValues[i]]
    rowsContent.push(array);
  }

  const bubbleContent: any = [];
  const featureID = feature.ID ?? feature.id;
  const mediaContent = computedBubbleMediaContent(featureID);
  bubbleContent.push({
    type: 'table',
    data: {
      headers: ['字段', '值'],
      rows: rowsContent
    }
  })
  if (mediaContent && mediaContent.length > 0) {
    bubbleContent.push(...mediaContent)
  }

  customBubble.open({
    title: `${$t("bubble_entityID")}:${Number(featureID)}`,
    content: bubbleContent
  });

  function computedBubbleMediaContent(featureID) {
    if (!featureID) return;
    if (!currentS3MLayerName) return;
    const s3mLayerMediaOptions = window.iEarthBindData.mediaResourceOptions[currentS3MLayerName];
    if (!s3mLayerMediaOptions || s3mLayerMediaOptions.length == 0) return;
    const targetItem = s3mLayerMediaOptions.find((item) => item.featureID == featureID);
    if (targetItem) {
      const mediaContent: any = [];
      targetItem.content.forEach(item => {
        if (!item || !item.type || !item.link) return;
        const obj: any = {};
        obj.type = item.type;
        if (obj.type == 'link') {
          obj.data = {
            text: item.name,
            url: item.link,
          }
        } else {
          obj.data = item.link;
          obj.name = item.name;
        }

        mediaContent.push(obj);
      });
      return mediaContent;
    } else {
      return;
    }
  }
}

// 清除
function clear() {
  state.dataServiceUrl = "";
  state.dataSourceName = "";
  state.dataSetName = "";
  state.dataSetOptions = [];
  state.dataSourceOptions = [];
  viewer.entities.removeById("identify-area");
  handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); //移除事件
  customBubble.hidden();
  mediaState.isDisplayBtn = false;
}

// 打开媒体字段面板，打开前计算当前ID是否绑定了媒体字段
function openMediaPanle() {
  const featureID = mediaState.currentFeatureID;
  mediaState.mediaFieldOptions = [
    { type: "image", name: '', link: '' },
    { type: "video", name: '', link: '' },
    { type: "link", name: '', link: '' },
    { type: "pdf", name: '', link: '' },
  ];

  if (window.iEarthBindData.mediaResourceOptions[currentS3MLayerName]) {
    const s3mLayerMediaOptions = window.iEarthBindData.mediaResourceOptions[currentS3MLayerName];

    const targetOption = s3mLayerMediaOptions.find((option) => option.featureID == featureID);
    if (targetOption && targetOption.content) {
      targetOption.content.forEach(item => {
        if (item.link == '') return;
        let mediaIndex: any = undefined;
        if (item.type == 'image') {
          mediaIndex = 0;
        } else if (item.type == 'video') {
          mediaIndex = 1;
        } else if (item.type == 'link') {
          mediaIndex = 2;
        } else if (item.type == 'pdf') {
          mediaIndex = 3;
        } else {
          console.log('该类型不支持');
          return;
        }

        mediaState.mediaFieldOptions[mediaIndex].name = item.name;
        mediaState.mediaFieldOptions[mediaIndex].link = item.link;
      });
    }
  }

  mediaState.mediaFieldPanleShow = true;
}

async function saveMediaField() {
  const currentMeidaOptions = mediaState.mediaFieldOptions;
  const featureID = mediaState.currentFeatureID;

  // 计算媒体字段内容，过滤未填写的
  const mediaContent: any = [];
  currentMeidaOptions.forEach(item => {
    if (item.link != '') {
      mediaContent.push(item);
    }
  })

  // 将媒体字段绑定在window上以便后面可以保存
  if (!window.iEarthBindData.mediaResourceOptions[currentS3MLayerName]) {
    window.iEarthBindData.mediaResourceOptions[currentS3MLayerName] = [];
  }
  const s3mLayerMediaOptions = window.iEarthBindData.mediaResourceOptions[currentS3MLayerName];
  const targetOption = s3mLayerMediaOptions.find((option) => option.featureID == featureID);
  if (targetOption) {
    targetOption.content = mediaContent;
    window["$message"].success(`模型ID：${featureID}-更新媒体资源成功`);
  } else {
    s3mLayerMediaOptions.push({
      featureID: featureID,
      content: mediaContent
    });
    window["$message"].success(`模型ID：${featureID}-绑定媒体资源成功`);
  }

  mediaState.mediaFieldPanleShow = false;
}

function removeItem(item) {
  if (item) {
    item.name = '';
    item.link = '';
  }
}

function closeMediaField() {
  mediaState.mediaFieldPanleShow = false;
}

watch(
  () => state.dataSourceName,
  (val) => {
    if (!val || val == '') return;
    tool.computedDataSetOptions(state.dataServiceUrl, val).then(result => {
      if (result && result.length > 0) {
        state.dataSetOptions = result;
      }
    });
  }
);
watch(
  () => state.entityColor,
  (val) => {
    val = val.replace("rgb", "rgba");
    let color_str = val.replace(")", `,${state.transparency})`);
    let color = SuperMap3D.Color.fromCssColorString(color_str);
    let entity_qx = viewer.entities.getById("identify-area");
    if (entity_qx) entity_qx.polygon.material = color;
  }
);
watch(
  () => state.transparency,
  (val) => {
    let colorString = state.entityColor.replace("rgb", "rgba");
    let color_str = colorString.replace(")", `,${val})`);
    let color = SuperMap3D.Color.fromCssColorString(color_str);
    let entity_qx = viewer.entities.getById("identify-area");
    if (entity_qx) entity_qx.polygon.material = color;
  }
);
</script>
