<template>
  <div class="layerSeries-box">
    <div class="row-item">
      <span>{{ $t("chooseLayer") }}</span>
      <n-select
        style="width: 1.96rem"
        v-model:value="state.selectedIndex"
        :options="state.s3mlayers"
      />
    </div>

    <div class="row-item" >
      <span>{{ $t("dataServerUrl") }}</span>
      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-input class="add-input-border" style="width: 1.96rem" v-model:value="state.dataUrl" type="text"
            :placeholder="$t('inputServerUrl')" @input="handleUrlChange"/>
        </template>
        {{ state.urlTip }}
      </n-tooltip>
    </div>

    <div class="row-item" style="margin-bottom: 0.1rem">
      <span>{{ $t("dataSourceName") }}</span>
      <n-input
        class="add-input-border"
        style="width: 1.96rem"
        v-model:value="state.dataSourceName"
        type="text"
        :placeholder="$t('inputSourceName')"
        @input="handleNameChange"
      />
    </div>
    <div class="btn-row-item" style="margin-left: 1.05rem; margin-top: 0.12rem">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        class="ans-btn"
        @click="startQuery"
        :disabled="!state.isCheckPass"
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

    <div class="bableShadow" ref="bableQuery" v-show="state.shadowRadioShow">
      <div class="row-item" style="margin-top: 0.12rem">
        <span class="shadow-anaylse-pop-titie"
          >{{ state.queryLayerName }} - {{ $t("queryResult") }}</span
        >
        <span @click="state.shadowRadioShow = false" style="margin-right: 14px"
          >X</span
        >
      </div>
      <div class="bable-container">
        <n-scrollbar style="max-height: 3.8rem">
          <div
            class="row-item"
            style="margin-left: 0.12rem; margin-right: 0.12rem"
            v-for="item in state.modelInfo"
          >
            <span>{{ item.lable }}</span>
            <span>{{ item.value }}</span>
          </div>
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
import { useMessage } from "naive-ui";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

const message = useMessage();
const layerStore = useLayerStore();

type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectedIndex: number; //默认选择图层index
  dataUrl: string;
  dataSourceName: string;
  shadowRadioShow: boolean;
  modelInfo: any;
  queryLayerName: string;
  scenePosition: any;
  isSetForLayer: boolean;
  urlTip:string;
  isCheckPass:boolean;
  isURLPass:boolean;
  isNamePass:boolean;
};

// http://www.supermapol.com/realspace/services/data-cbd/rest/data  -  二维数据
// http://www.supermapol.com/realspace/services/data-BIMbuilding/rest/data - BIMBuilding

// 初始化变量
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedIndex: 0, //默认选择图层index
  dataUrl: "",
  dataSourceName: "",
  shadowRadioShow: false,
  modelInfo: {},
  queryLayerName: "",
  scenePosition: null,
  isSetForLayer: false,
  urlTip:`http://<server>:<port>/iserver/services/<component>/rest/data`,
  isCheckPass:false,
  isURLPass:false,
  isNamePass:false,
});
const scene = viewer.scene;
let bableQuery = ref();
let layers, handler;

//检查输入是否合规：URL、Name、Token
function handleUrlChange() {
  state.dataUrl = state.dataUrl.trim();
  const checkeResult = inputRuleCheck(state.dataUrl, RuleCheckTypeEnum.URL);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isURLPass = checkeResult.isPass;
  computedCheckPass();
}
function handleNameChange() {
  state.dataSourceName = state.dataSourceName.trim();
  const checkeResult = inputRuleCheck(state.dataSourceName, RuleCheckTypeEnum.Text);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isNamePass = checkeResult.isPass;
  computedCheckPass();

}
function computedCheckPass(){
  state.isCheckPass = state.isURLPass && state.isNamePass;
}


function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  layers[state.selectedIndex].selectEnabled = true;

  // 获取图层绑定的数据源信息
  setQueryInfo();
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  layers = null;
  clear();
});

function updateLayers() {
  layers = viewer.scene.layers.layerQueue;
  if (!layers || layers.length < 1) {
    state.s3mlayers = [{ label: () => $t("noLayer"), value: 0 }];
    return;
  }
  state.s3mlayers.length = 0;
  layers.forEach((layer, index) => {
    let name = layer._name;
    state.s3mlayers.push({
      label: name,
      value: index,
    });
  });
  if (state.selectedIndex > layers.length - 1) state.selectedIndex = 0;
  layers[state.selectedIndex].selectEnabled = true;
}

function startQuery() {
  if (
    !state.dataUrl ||
    state.dataUrl === "" ||
    !state.dataSourceName ||
    state.dataSourceName === ""
  ) {
    message.warning($t("inputUrlName"));
    return;
  }

  state.shadowRadioShow = false;

  let targetLayer = layers[state.selectedIndex]; // viewer.scene.layers.find('BIMbuilding');
  state.queryLayerName = targetLayer.name;

  targetLayer.setQueryParameter({
    url: state.dataUrl, // 数据服务：http://www.supermapol.com/realspace/services/data-BIMbuilding/rest/data
    dataSourceName: state.dataSourceName, // BIMBuilding
    isMerge: true,
  });

  // 设置选中颜色
  var color = new SuperMap3D.Color.fromCssColorString("rgba(23,92,239,1)");
  targetLayer.selectedColor = color;
  if (!state.isSetForLayer) {
    message.success($t("bindInfoOK"));
    state.isSetForLayer = true;
  } else {
    message.success($t("bindUpdate"));
  }

  // 点击模型获取相关信息
  viewer.pickEvent.addEventListener(getModelInfo);

  // 每一帧都去计算气泡的正确位置
  scene.postRender.addEventListener(setBablePosition);

  // 获取点击位置笛卡尔坐标
  handler = new SuperMap3D.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function (e: any) {
    var position = scene.pickPosition(e.position);
    if (!position) {
      position = SuperMap3D.Cartesian3.fromDegrees(0, 0, 0);
    }
    state.scenePosition = position; // 气泡位置
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);

  let itemIndex = layerStore.layerQueryOptions.findIndex(
    (item) => item.name == state.queryLayerName
  );
  if (itemIndex == -1) {
    // 保存数据源信息
    let obj = {
      name: targetLayer.name,
      dataUrl: state.dataUrl,
      dataSourceName: state.dataSourceName,
    };
    layerStore.layerQueryOptions.push(obj);
  } else {
    let item = layerStore.layerQueryOptions[itemIndex];
    item.name = state.queryLayerName;
    item.dataUrl = state.dataUrl;
    item.dataSourceName = state.dataSourceName;
  }
}

// 设置气泡位置
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

// 点击拾取实体，获取属性信息
function getModelInfo(feature: any) {
  if (window.iEarthConsole) {
    console.log("feature:", feature);
  }
  if (feature) {
    state.shadowRadioShow = true;
    let list: any = [];
    for (let key in feature) {
      let value = String(feature[key]);
      if (value.indexOf(".") != -1) value = Number(value).toFixed(2);
      list.push({
        lable: key,
        value: value,
      });
    }
    state.modelInfo = list;
  } else {
    state.shadowRadioShow = false;
    message.success($t("noData"));
  }
}

// 获取已绑定的图层查询信息
function setQueryInfo() {
  if (layerStore.layerQueryOptions.length > 0) {
    let selectLayerName = layers[state.selectedIndex].name;
    let targetItem = layerStore.layerQueryOptions.filter(
      (item) => item.name == selectLayerName
    );
    if (targetItem.length > 0) {
      state.dataUrl = targetItem[0].dataUrl;
      state.dataSourceName = targetItem[0].dataSourceName;
    }
  }
}

// 清除
function clear(flag = true) {
  state.isCheckPass = false;
  state.isURLPass = false;
  state.isNamePass = false;
  state.shadowRadioShow = false;
  if (handler) {
    handler.destroy();
    handler = null;
  }
  if (flag) {
    state.dataUrl = "";
    state.dataSourceName = "";
  }
  state.isSetForLayer = false;
  scene.postRender.removeEventListener(setBablePosition);
  viewer.pickEvent.removeEventListener(getModelInfo);
}

// 监听
watch(
  () => layerStore.layerChangeCount,
  () => {
    updateLayers();
  }
);
watch(
  () => state.selectedIndex,
  () => {
    clear(false);
    setQueryInfo();
  }
);
</script>

<style lang="scss" scoped>
.bableShadow {
  position: fixed;
  top: 2rem;
  left: 5rem;
  background-color: #383838;
  opacity: 0.9;
  z-index: 200000;
  height: 4.5rem;
  width: 3rem;

  .bable-container {
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
