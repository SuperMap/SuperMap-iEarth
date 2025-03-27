<template>
  <div class="layerSeries-box">
    <div class="row-item">
      <span>{{ $t("dataServerUrl") }}</span>
      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-input class="add-input-border" style="width: 2.1rem" v-model:value="state.dataServiceUrl" type="text"
            :placeholder="$t('qxLayerDataUrl')" @change="handleChange" />
        </template>
        {{ urlTip }}
      </n-tooltip>
    </div>

    <div class="row-item" v-if="state.dataSourceOptions.length > 0">
      <span>{{ $t("dataSourceName") }}</span>
      <n-select style="width: 2.1rem" v-model:value="state.dataSourceName" :options="state.dataSourceOptions" />
    </div>

    <div class="row-item" v-if="state.dataSetOptions.length > 0">
      <span>{{ $t("datasetName") }}</span>
      <n-select style="width: 2.1rem" v-model:value="state.dataSetName" :options="state.dataSetOptions" />
    </div>

    <div class="row-item">
      <span> {{ $t("selectedColor") }} </span>
      <div class="color-pick-box" style="width: 2.1rem">
        <n-color-picker :show-alpha="false" v-model:value="state.entityColor" :render-label="() => {
          return '';
        }
          " size="small"></n-color-picker>
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("transparency") }}</span>
      <div class="slider-box" style="width: 1.9rem">
        <n-slider style="width: 2.2rem" v-model:value="state.transparency" :step="0.1" :min="0.1" :max="1" />
        <n-input-number v-model:value="state.transparency" class="slider-input-number" :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="0.1" :max="1" :step="0.1" placeholder="" size="small" />
      </div>
    </div>

    <!-- <div class="row-item" style="margin-right: 0.1rem">
      <span>{{ $t("qxDivisionQuery") }}</span>
      <div class="check-box">
        <n-checkbox v-model:checked="state.isUseQXDivisionQuery"></n-checkbox>
      </div>
    </div> -->

    <div class="btn-row-item" style="margin-left: 0.93rem">
      <n-button type="info" color="#3499E5" text-color="#fff" class="ans-btn" @click="singleQuery">{{ $t("query") }}
      </n-button>
      <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{ $t("clear") }}
      </n-button>
    </div>

    <!-- 添加媒体字段 -->
    <div class="btn-row-item" style="margin-left: 0.93rem" v-if="mediaState.isDisplayBtn">
      <n-button style="width:1.3rem;margin-top: 0.1rem;" type="info" color="#3499E5" text-color="#fff" class="ans-btn"
        @click="mediaState.mediaFieldPanleShow = true">{{ $t("bindMediaField") }}
      </n-button>
    </div>
    <div v-if="mediaState.mediaFieldPanleShow">
      <n-modal v-model:show="mediaState.mediaFieldPanleShow" preset="dialog" :title="$t('bindMediaField')"
        :mask-closable="false">
        <n-card style="width: auto" :bordered="false" size="huge" role="dialog" aria-modal="true">

          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("type") }}</span>
            <n-select class="add-input-border" v-model:value="mediaState.mediaType"
              :options="mediaState.mediaTypeOptions" style="width: 2.4rem; margin-bottom: 0.1rem" />
          </div>

          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("featureID") }}</span>
            <n-input class="add-input-border" style="width: 2.4rem" v-model:value="mediaState.currentFeatureID"
              type="text" />
          </div>

          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("resouceName") }}</span>
            <n-input class="add-input-border" style="width: 2.4rem" v-model:value="mediaState.resouceName"
              type="text" />
          </div>
          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("resouceLink") }}</span>
            <n-input class="add-input-border" v-model:value="mediaState.resouceLink"
              :placeholder="$t('inputOnlineResourceLink_iportal')" style="width: 2.4rem" type="text">
            </n-input>
          </div>

          <div class="btn-row-item" style="margin-left: 0.8rem">
            <n-button type="info" class="ans-btn" color="#3499E5" text-color="#fff" :focusable="false"
              @click="saveMediaField">{{ $t("sure") }}</n-button>
            <n-button :focusable="false" @click="clearMediaField">{{
              $t("cancle")
            }}</n-button>
          </div>
        </n-card>
      </n-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import CustomBubble from "@/lib/CustomBubble";
import tool from "@/tools/tool";

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
  isUseQXDivisionQuery: boolean; //是否使用倾斜分层分户查询
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
  isUseQXDivisionQuery: false
});

const mediaState = reactive({
  isDisplayBtn: false,
  mediaFieldPanleShow: false,
  currentFeatureID: '',
  resouceName: '',
  resouceLink: '',
  mediaType: "image",
  mediaTypeOptions: [
    {
      label: $t("picture"),
      value: "image",
    },
    {
      label: $t("video"),
      value: "video",
    },
    {
      label: $t("aLink"),
      value: "link",
    },
    {
      label: "PDF",
      value: "pdf",
    }
  ],
})

const urlTip = ref("http://<server>:<port>/iserver/services/<component>/rest/data");
const currentS3MLayerName = window.iEarthBindData.CurrentS3MLayerName;

let handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);

onMounted(() => { });

onBeforeUnmount(() => {
  clear();
  customBubble.destroy();
  if (handler) handler.destroy();
});

async function handleChange() {
  state.dataServiceUrl = state.dataServiceUrl.trim();
  const result = await tool.computedDataSourceOptions(state.dataServiceUrl);
  if (result && result.length > 0) {
    state.dataSourceOptions = result;
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
    scene.pickPositionAsync(e.position).then((position) => {
      if (position && position instanceof SuperMap3D.Cartesian3) {
        const degree = window.iEarthTool.Cartesian3ToDegreeObjs(position)[0];

        const dataSourceName = state.dataSourceName;
        const dataSetName = state.dataSetName;
        const datasetNames_query = [`${dataSourceName}:${dataSetName}`];

        if (state.isUseQXDivisionQuery) {
          const searchUrl = state.dataServiceUrl;
          const height = degree.height;
          const longitude = degree.longitude;
          const latitude = degree.latitude;
          const sqlString = `bottom < ${height} and ${height} < (bottom + LSG) and ${longitude} > SmSdriW and ${longitude} < SmSdriE and ${latitude} > SmSdriS and ${latitude} < SmSdriN`;
          queryByDivision(searchUrl, datasetNames_query, sqlString);
        } else {
          const point = {
            x: degree.longitude,
            y: degree.latitude,
          };
          const searchUrl = state.dataServiceUrl + '/featureResults.rjson?returnContent=true';
          queryByPoint(searchUrl, datasetNames_query, point);
        }
      }
    });
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
    console.log("倾斜分层分户查询:",queryEventArgs);
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
    title: `模型ID:${Number(featureID)}`,
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

async function saveMediaField() {
  const featureID = mediaState.currentFeatureID;
  const mediaType = mediaState.mediaType;
  const resouceName = mediaState.resouceName;
  const resouceLink = mediaState.resouceLink.trim().replace(/\/+$/, "");
  if (featureID == '' || resouceLink == '') {
    window["$message"].warning($t("mediaResouceInputTip"));
    return;
  }

  // const isAccess = await tool.checkURLAccess(resouceLink);
  // if(!isAccess) {
  //   window["$message"].warning($t("mediaResouceUrlAccessTip"));
  //   return;
  // }

  let mediaOption = {
    featureID: featureID,
    type: mediaType,
    name: resouceName,
    link: resouceLink,
  };

  // 保存媒体字段
  if (!currentS3MLayerName) return;
  if (!window.iEarthBindData.mediaResourceOptions[currentS3MLayerName]) {
    window.iEarthBindData.mediaResourceOptions[currentS3MLayerName] = [];
  }
  const s3mLayerMediaOptions = window.iEarthBindData.mediaResourceOptions[currentS3MLayerName];

  // 寻找绑定的媒体字段：如果有就更新，没有就添加绑定
  const targetOption = s3mLayerMediaOptions.find((option) => option.featureID == mediaOption.featureID);
  if (targetOption) {
    const targetItem = targetOption.content.find((item) => {
      return item.type == mediaOption.type && item.name == mediaOption.name;
    });
    if (targetItem) { // 已保存项目，更新链接
      targetItem.link = mediaOption.link;
      window["$message"].success(`要素ID：${targetOption.featureID}-更新${mediaOption.type}类型链接成功`);
    } else { // 新增项目
      targetOption.content.push({
        type: mediaOption.type,
        name: mediaOption.name,
        link: mediaOption.link,
      })
      window["$message"].success(`要素ID：${targetOption.featureID}-添加${mediaOption.type}类型资源成功`);
    }
  } else { // 绑定媒体字段内容
    s3mLayerMediaOptions.push({
      featureID: mediaOption.featureID,
      content: [
        {
          type: mediaOption.type,
          name: mediaOption.name,
          link: mediaOption.link,
        }
      ]
    });
    window["$message"].success(`要素ID：${mediaOption.featureID}-绑定媒体资源成功`);
  }
}

function clearMediaField() {
  mediaState.resouceName = "";
  mediaState.resouceLink = "";
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
