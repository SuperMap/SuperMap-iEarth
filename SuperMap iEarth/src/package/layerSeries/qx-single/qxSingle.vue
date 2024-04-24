<template>
  <div class="layerSeries-box">
    <div class="row-item">
      <span>{{ $t("dataServerUrl") }}</span>
      <n-input
        class="add-input-border"
        @input="handleChange"
        v-model:value="state.dataServiceUrl"
        :placeholder="$t('qxLayerDataUrl')"
        type="text"
        style="width: 2.1rem"
      />
    </div>

    <div class="row-item">
      <span>{{ $t("dataSourceName") }}</span>
      <n-input
        class="add-input-border"
        @input="handleChange"
        v-model:value="state.dataSourceName"
        :placeholder="$t('qxLayerDataSource')"
        type="text"
        style="width: 2.1rem"
      />
    </div>

    <div class="row-item">
      <span>{{ $t("datasetName") }}</span>
      <n-input
        class="add-input-border"
        @input="handleChange"
        v-model:value="state.dataSetName"
        :placeholder="$t('qxLayerDataset')"
        type="text"
        style="width: 2.1rem"
      />
    </div>

    <div class="row-item">
      <span> {{ $t("selectedColor") }} </span>
      <div class="color-pick-box" style="width: 2.1rem">
        <n-color-picker
          :show-alpha="false"
          v-model:value="state.entityColor"
          :render-label="
            () => {
              return '';
            }
          "
          size="small"
        ></n-color-picker>
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("transparency") }}</span>
      <div class="slider-box" style="width: 1.9rem">
        <n-slider
          style="width: 2.2rem"
          v-model:value="state.transparency"
          :step="0.1"
          :min="0.1"
          :max="1"
        />
        <n-input-number
          v-model:value="state.transparency"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="0.1"
          :max="1"
          :step="0.1"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="btn-row-item" style="margin-left: 0.93rem">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        class="ans-btn"
        @click="singleQuery"
        >{{ $t("query") }}</n-button
      >
      <n-button
        class="btn-secondary"
        @click="clear"
        color="rgba(255, 255, 255, 0.65)"
        ghost
        >{{ $t("clear") }}</n-button
      >
    </div>

    <div class="bableShadow" ref="bableQuery" v-show="state.qxModelQuery">
      <div class="row-item" style="margin-top: 0.12rem">
        <span class="shadow-anaylse-pop-titie"
          >{{ $t("featrueID") }}:{{ state.featureID }} -
          {{ $t("queryResult") }}</span
        >
        <span @click="state.qxModelQuery = false" style="margin-right: 14px"
          >X</span
        >
      </div>
      <div class="bable-container">
        <n-scrollbar style="max-height: 3.8rem">
          <div
            class="row-item"
            style="margin-left: 0.12rem; margin-right: 0.12rem"
            v-for="item in state.featureInfo"
          >
            <span>{{ item.lable }}</span>
            <span>{{ item.value }}</span>
          </div>
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useMessage } from "naive-ui";

let scene = viewer.scene;
const message = useMessage();

type StateType = {
  dataServiceUrl: string; // 数据服务URL
  dataSourceName: string; // 数据源名称
  dataSetName: string; // 数据集名称
  entityColor: string; //设置实体颜色
  transparency: number; //实体透明度
  qxModelQuery: boolean;
  featureInfo: any;
  featureID: number;
  scenePosition: any;
};

// viewer.camera.setView({ // 先定位，开始渲染定位区域的倾斜
//   destination: new SuperMap3D.Cartesian3(-2627223.829626321, 3932851.0803870987, 4265288.945477366),
//   orientation: {
//     heading: 4.396130342435847,
//     pitch: -0.43133441484661317,
//     roll: 0.000007429907218359233
//   }
// });

// 倾斜图层URL:http://www.supermapol.com/realspace/services/3D-dynamicDTH-2/rest/realspace/datas/Config%20-%201/config
let state = reactive<StateType>({
  // dataServiceUrl: 'http://www.supermapol.com/realspace/services/data-dynamicDTH-2/rest/data/featureResults.rjson?returnContent=true',
  // dataSourceName: '铁岭矢量面',
  // dataSetName: 'New_Region3D_1',
  dataServiceUrl: "",
  dataSourceName: "",
  dataSetName: "",
  entityColor: "rgb(166,252,252)",
  transparency: 0.6,
  qxModelQuery: false,
  featureInfo: {},
  featureID: -1,
  scenePosition: undefined,
});

let bableQuery = ref();
let handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);

onMounted(() => {});

onBeforeUnmount(() => {
  clear();

  if (handler) {
    if (!handler.isDestroyed()) handler.destroy();
  }
});

// 设置弹窗位置
function setBablePosition() {
  if (state.scenePosition) {
    let WindowCoordinates = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      state.scenePosition
    );
    bableQuery.value.style.top =
      WindowCoordinates.y - bableQuery.value.offsetHeight - 10 + "px";
    bableQuery.value.style.left =
      WindowCoordinates.x - bableQuery.value.offsetWidth / 2 + 140 + "px";
  }
}

// 通过点击查询用于表示单体化的面要素，添加到场景中高亮显示。
function queryByPoint(queryPoint) {
  var queryObj = {
    getFeatureMode: "SPATIAL",
    spatialQueryMode: "INTERSECT",
    datasetNames: [state.dataSourceName + ":" + state.dataSetName],
    geometry: {
      id: 0,
      parts: [1],
      points: [queryPoint],
      type: "POINT",
    },
  };

  let queryObjJSON = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数

  window
    .axios({
      url: state.dataServiceUrl,
      data: queryObjJSON,
      method: "post",
    })
    .then(function (response) {
      var resultObj = response.data;
      if (resultObj.featureCount > 0) {
        addClapFeature(resultObj.features[0]);
        state.qxModelQuery = true;
      } else {
        state.qxModelQuery = false;
      }
    });

  // 将数据服务查询到的要素添加到场景中高亮显示，表示选中效果。
  function addClapFeature(feature) {
    console.log("feature-倾斜单体化:", feature);
    var lonLatArr = getLonLatArray(feature.geometry.points);
    let str = state.entityColor.replace("rgb", "rgba");
    let materialColor = str.replace(")", `,${state.transparency})`);
    viewer.entities.add({
      id: "identify-area",
      name: "tie_qx_entity",
      polygon: {
        hierarchy: SuperMap3D.Cartesian3.fromDegreesArray(lonLatArr),
        material: SuperMap3D.Color.fromCssColorString(materialColor),
        classificationType: SuperMap3D.ClassificationType.S3M_TILE, // 贴在S3M模型表面
      },
    });

    let list: any = [];
    if (feature.ID) state.featureID = Number(feature.ID);
    if (feature.fieldNames && feature.fieldNames.length > 0) {
      for (let i = 0; i < feature.fieldNames.length; i++) {
        list.push({
          lable: feature.fieldNames[i],
          value: feature.fieldValues[i],
        });
      }
    }
    state.featureInfo = list;
  }

  // 得到[经度,纬度,经度,纬度...]形式的数组，用于构造面。
  function getLonLatArray(points: any) {
    var point3D: any = [];
    points.forEach(function (point) {
      point3D.push(point.x);
      point3D.push(point.y);
    });
    return point3D;
  }
}

// 单体化查询
function singleQuery() {
  if (
    state.dataServiceUrl == "" ||
    state.dataSourceName == "" ||
    state.dataSetName == ""
  ) {
    message.warning($t("singleTip_waring"));
    return;
  }
  message.success($t("singleTip_success"));
  handler.setInputAction(function (e: any) {
    viewer.entities.removeById("identify-area"); // 首先移除之前添加标识实体
    scene.pickPositionAsync(e.position).then((last) => {
      var position = last;
      state.scenePosition = position; // 气泡位置
      // 从笛卡尔坐标获取经纬度
      var cartographic = SuperMap3D.Cartographic.fromCartesian(position);
      var longitude = SuperMap3D.Math.toDegrees(cartographic.longitude);
      var latitude = SuperMap3D.Math.toDegrees(cartographic.latitude);

      var queryPoint = {
        // 查询点对象
        x: longitude,
        y: latitude,
      };

      queryByPoint(queryPoint);
    });
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

  // 每一帧都去计算气泡的正确位置
  scene.postRender.addEventListener(setBablePosition);
}

// 校验URL
function handleChange() {
  state.dataServiceUrl = state.dataServiceUrl.trim();
  state.dataSourceName = state.dataSourceName.trim();
  state.dataSetName = state.dataSetName.trim();
}

// 清除
function clear() {
  state.dataServiceUrl = "";
  state.dataSourceName = "";
  state.dataSetName = "";
  scene.postRender.removeEventListener(setBablePosition);
  viewer.entities.removeById("identify-area");
  state.qxModelQuery = false;
  handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); //移除事件
}

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
    let str = state.entityColor.replace("rgb", "rgba");
    let color_str = str.replace(")", `,${val})`);
    let color = SuperMap3D.Color.fromCssColorString(color_str);
    let entity_qx = viewer.entities.getById("identify-area");
    if (entity_qx) entity_qx.polygon.material = color;
  }
);
</script>

<style lang="scss" scoped>
.bableShadow {
  position: fixed;
  background-color: #383838;
  opacity: 0.9;
  z-index: 200000;
  height: 2.5rem;
  width: 2.5rem;
  font-size: 0.12rem;

  .bable-container {
    height: 2rem;
    overflow-y: scroll;
    @include setsSrollbar();
  }

  .shadow-anaylse-pop-titie {
    margin-left: 0.12rem;
    font-size: 12px;
    line-height: 20px;
  }

  span {
    font-size: 12px;
  }
}
</style>
