<template>
  <div class="layerSeries-box">
    <!-- 打开面板 -->
    <div class="row-item" style="margin-bottom: 0.1rem">
      <span>{{ $t("mapDataUrl") }}</span>
      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-input
            class="add-input-border"
            style="width: 2.2rem"
            v-model:value="state.dataUrl"
            type="text"
            @input="handleDataUrlChange"
            :placeholder="$t('inputServerUrl')"
          />
        </template>
        {{ state.dataUrlTip }}
      </n-tooltip>
    </div>

    <div class="row-item" style="margin-bottom: 0.1rem">
      <span>{{ $t("datasetName") }}</span>
      <n-input
        class="add-input-border"
        style="width: 2.2rem"
        v-model:value="state.datasetName"
        type="text"
        @input="handleDataSetChange"
        :placeholder="$t('inputSourceName')"
      />
    </div>

    <div class="oprationBtn" style="margin-left: 0.83rem">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        :loading="state.isloading_table"
        :focusable="false"
        @click="startQuery"
        style="margin-right: 0.1rem"
        :disabled="!state.isCheckPass"
        >{{ $t("attributeList") }}</n-button
      >
      <n-button :focusable="false" @click="clear">{{ $t("clear") }}</n-button>
    </div>

    <!-- 表格 - 操作面板 -->
    <div id="queryTable" v-if="state.showQueryTable">
      <!-- 表头 -->
      <div class="tableHeader">
        <div class="item tableInfo">
          {{ state.datasetName }}{{ $t("listTotal_s") }}&nbsp;{{
            tableCount
          }}&nbsp;{{ $t("listTotal_e") }}
        </div>

        <!-- 过滤框 -->
        <div class="item search">
          <n-input-group>
            <n-input
              class="add-input-border"
              style="margin-bottom: 0.1rem; width: 1.8rem"
              :placeholder="state.queryPlaceHolder"
              v-model:value="state.sqlString"
              :disabled="state.selectFiled === 'chooseFeild'"
            >
            </n-input>
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
                        ? state.chooseField
                        : state.selectFiled
                    }}</n-button>
                  </template>
                  {{ $t("chooseFieldTip") }}
                </n-tooltip>
              </template>
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
            <n-button
              :loading="state.isloading"
              :focusable="false"
              @click="search"
              :disabled="state.selectFiled === 'chooseFeild'"
              >{{ $t("filter") }}</n-button
            >
          </n-input-group>
        </div>

        <!-- 操作按钮 -->
        <div class="items">
          <div class="icon-list-box" style="width: 2.2rem">
            <!-- 字段筛选 -->
            <span class="icon-span-three">
              <column-setting v-model:columns="columns" />
            </span>
            <!-- 打开iportal我的数据（shp） -->
            <span class="icon-span-three">
              <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                  <i
                    class="iconfont iconSize iconzhidingshujuchaxun"
                    @click="openMydata"
                  ></i>
                </template>
                <!-- iconshpchaxun -->
                {{ $t("shpQueryTip") }}
              </n-tooltip>
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
            <!-- 打开媒体字段 -->
            <span class="icon-span-three">
              <n-tooltip placement="top-end" trigger="hover">
                <template #trigger>
                  <i
                    class="iconfont iconSize icontianjiameitiziduan"
                    @click="openMediaField"
                  ></i>
                </template>
                {{ $t("bindMediaField") }}
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

      <!--表格数据 -->
      <n-data-table
        size="small"
        :columns="columns"
        :data="state.tableData"
        flex-height
        class="flex-1-hidden"
        v-model:checked-row-keys="state.checkedRowKeys"
        :scroll-x="columns.length * 110"
      />

      <!-- 页码控制器 -->
      <div class="pagination">
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

    <!-- 我的数据面板 -->
    <div v-if="state.myDataPanleShow">
      <n-modal v-model:show="state.myDataPanleShow">
        <n-card
          style="width: 6rem"
          title="My Data"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <div id="myDataTable">
            <n-data-table
              size="small"
              :columns="state.columns_mydata"
              :data="state.portalServiceList_mydata"
              :pagination="pagination_mydata"
              flex-height
              class="flex-1-hidden"
              v-model:checked-row-keys="state.checkedRowKeys_mydata"
            />
          </div>
          <div
            :class="{
              oprationBtn_noloading: !state.isloading_mydata,
              oprationBtn_loading: state.isloading_mydata,
            }"
          >
            <n-button
              type="info"
              color="#3499E5"
              text-color="#fff"
              :loading="state.isloading_mydata"
              :focusable="false"
              @click="addShp_mydata"
              style="margin-right: 0.1rem"
              >{{ $t("sure") }}</n-button
            >
            <n-button :focusable="false" @click="cancle_mydata">{{
              $t("cancle")
            }}</n-button>
          </div>
        </n-card>
      </n-modal>
    </div>

    <!-- 添加媒体字段面板 -->
    <div v-if="state.mediaFieldPanleShow">
      <n-modal
        v-model:show="state.mediaFieldPanleShow"
        preset="dialog"
        :title="$t('bindMediaField')"
        :mask-closable="false"
      >
        <n-card
          style="width: 4rem"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("type") }}</span>
            <n-select
              class="add-input-border"
              v-model:value="state.mediaType"
              :options="state.mediaTypeOptions"
              style="width: 2.4rem; margin-bottom: 0.1rem"
            />
          </div>
          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("field") }}</span>
            <n-tooltip placement="top-end" trigger="hover">
              <template #trigger>
                <n-select
                  class="add-input-border"
                  v-model:value="state.selectMediaFeild"
                  :options="state.mediaFeilds"
                  style="width: 2.4rem"
                />
              </template>
              {{ $t("selectMediaFieldTip") }}
            </n-tooltip>
          </div>
          <div class="row-item" style="margin-bottom: 0.1rem">
            <span>{{ $t("title") }}</span>
            <n-input
              class="add-input-border"
              :placeholder="$t('inputTitle')"
              style="width: 2.4rem"
              v-model:value="state.mediaTitle"
              type="text"
            />
          </div>
          <div style="margin-left: 0.8rem; margin-bottom: 0.1rem">
            <n-checkbox v-model:checked="state.isCustomMediaUrl">
              {{ $t("customMediaLink") }}
            </n-checkbox>
          </div>
          <div
            class="row-item"
            v-if="state.isCustomMediaUrl"
            style="margin-bottom: 0.1rem"
          >
            <span>{{ $t("featureID") }}</span>
            <n-input
              class="add-input-border"
              disabled
              style="width: 2.4rem"
              v-model:value="state.currentFeatureID"
              type="text"
            />
          </div>
          <div
            class="row-item"
            v-if="state.isCustomMediaUrl"
            style="margin-bottom: 0.1rem"
          >
            <span>{{ $t("link") }}</span>
            <n-input
              class="add-input-border"
              v-model:value="state.mediaUrl"
              :placeholder="
                state.mediaType == 'img'
                  ? $t('inputOnlineImgLink')
                  : $t('inputOnlineVideoLink_iportal')
              "
              style="width: 2.4rem"
              type="text"
            >
            </n-input>
          </div>
          <div class="btn-row-item" style="margin-left: 0.8rem">
            <n-button
              type="info"
              class="ans-btn"
              color="#3499E5"
              text-color="#fff"
              :focusable="false"
              @click="saveMediaField"
              >{{ $t("sure") }}</n-button
            >
            <n-button :focusable="false" @click="clearMediaField">{{
              $t("clear")
            }}</n-button>
          </div>
        </n-card>
      </n-modal>
    </div>

    <!-- 弹窗 -->
    <div class="bableShadow" ref="bableQuery" v-show="state.shadowRadioShow">
      <div class="row-item" style="margin-top: 0.12rem">
        <span class="shadow-anaylse-pop-titie">{{ $t("clickQuery") }}</span>
        <span @click="closebable" style="margin-right: 0.14rem">X</span>
      </div>
      <div class="bable-container">
        <n-scrollbar style="max-height: 3.8rem">
          <div
            class="row-item"
            style="margin-left: 0.12rem; margin-right: 0.12rem"
            v-for="item in state.modelInfo"
          >
            <span>{{ item.lable }}</span>
            <n-input
              placeholder="null"
              style="width: 1.8rem"
              v-model:value="item.value"
              :show-button="false"
              disabled
            >
            </n-input>
          </div>
          <div style="margin-bottom: 0.1rem">
            <span style="margin-left: 0.12rem">{{ state.mediaTitle }}</span>
            <div class="mediaContainer">
              <img
                class="bableMedia"
                :src="state.mediaUrl"
                alt=""
                v-if="state.mediaType === 'img'"
              />
              <video
                class="bableMedia"
                id="videoDom"
                controls
                src=""
                v-else
              ></video>
            </div>
          </div>
        </n-scrollbar>
      </div>
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
import { useLayerStore } from "@/store/layerStore/layer";
import { useMessage } from "naive-ui";
import { getRootUrl } from "@/tools/iportal/portalTools";
import { IportalStoreCreate } from "@/store/index";
import ColumnSetting from "./coms/column-setting.vue";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

const message = useMessage();

const IportalStore = IportalStoreCreate();
const layerStore = useLayerStore();

type StateType = {
  selectedIndex: number; //默认选择图层index
  dataUrl: string;
  datasetName: string;
  columns: any;
  tableData: any;
  checkedRowKeys: any;
  showQueryTable: boolean;
  page: number;
  pageSize: number;
  sqlString: string;
  selectFiled: string;
  queryPlaceHolder: string;
  itemCount: number;
  isFilter: boolean;
  myDataPanleShow: boolean;
  isClickQuery: boolean;
  isChangeDataSet: boolean;
  dataUrlTip: string;
  isloading: boolean;
  isloading_table: boolean;
  isProjection: boolean;
  portalServiceList_mydata: any;
  columns_mydata: any;
  tableData_mydata: any;
  checkedRowKeys_mydata: any;
  isMydate: boolean;
  isloading_mydata: boolean;
  chooseField: string;
  shadowRadioShow: boolean;
  scenePosition: any;
  mediaFieldPanleShow: boolean;
  mediaType: string;
  mediaTypeOptions: any;
  mediaTitle: string;
  mediaUrl: string;
  modelInfo: any;
  selectMediaFeild: string;
  mediaFeilds: any;
  currentFeature: any;
  isCustomMediaUrl: boolean;
  currentFeatureID: string;
  isCheckPass:boolean;
  isDataUrlPass:boolean;
  isDataSetPass:boolean;
};

// 初始化变量
let state = reactive<StateType>({
  selectedIndex: 0, //默认选择图层index
  // dataUrl: 'https://iserver.supermap.io/iserver/services/data-world/rest/data',
  // datasetName: "World:Countries"（1889条要素）/ "World:Capitals"(192条要素)
  // dataUrl: 'http://172.16.15.203:8090/iserver/services/data-China400/rest/data',
  // datasetName: "China:China",
  // dataUrl: "http://172.16.15.203:8090/iserver/services/data-80wtuban/rest/data",
  // datasetName: "DLTB80w:DLTB_1", // 80多万
  // dataUrl: "http://127.0.0.1:8090/iserver/services/data-mapqueryProjection/rest/data",
  // datasetName: "0830:NewDataset",
  // dataUrl: "http://localhost:8090/iserver/services/data-mediaField/rest/data",
  // datasetName: "1009:NewDataset",
  dataUrl: "",
  datasetName: "",
  // dataUrl: "https://iserver.supermap.io/iserver/services/data-world/rest/data",
  // datasetName: "World:Countries", // 这个数据集点选啥的都能用

  // 表格 点选
  columns: [],
  tableData: [],
  checkedRowKeys: ["1"],
  showQueryTable: false,
  page: 1,
  pageSize: 10,
  sqlString: "",
  selectFiled: "chooseFeild",
  queryPlaceHolder: $t("queryPlaceHolder"),
  itemCount: 0,
  isFilter: false,
  myDataPanleShow: false,
  isClickQuery: false,
  isChangeDataSet: false,
  modelInfo: {},

  // 输入提示
  dataUrlTip: `http://<server>:<port>/iserver/services/{dataProvider}/rest/data`,
  isloading: false,
  isloading_table: false,
  isProjection: false,

  // 我的数据
  isMydate: false,
  portalServiceList_mydata: [],
  columns_mydata: [
    {
      type: "selection",
      multiple: false,
      align: "center",
      disabled: (rowdata) => {
        return rowdata.disabled ? true : false;
      },
    },
    {
      key: "fileName",
      title: $t("resouceName"),
      align: "center",
    },
    {
      key: "id",
      title: "ID",
      align: "center",
    },
    {
      key: "type",
      title: $t("resouceType"),
      align: "center",
    },
    {
      key: "createTime",
      title: $t("createTime"),
      align: "center",
    },
  ],
  tableData_mydata: [],
  checkedRowKeys_mydata: ["1"],
  isloading_mydata: false,
  chooseField: $t("chooseField"),

  // 新增
  shadowRadioShow: false,
  scenePosition: null,

  // 媒体字段
  mediaFieldPanleShow: false,
  mediaType: "img",
  mediaTypeOptions: [
    {
      label: $t("picture"),
      value: "img",
    },
    {
      label: $t("video"),
      value: "video",
    },
  ],
  mediaTitle: "",
  mediaUrl: "",
  selectMediaFeild: "SMID",
  mediaFeilds: [],
  currentFeature: null,
  isCustomMediaUrl: false,
  currentFeatureID: "",
  isCheckPass:false,
  isDataUrlPass:false,
  isDataSetPass:false,
});

let handler;
let targerMapLayer;
let bableQuery = ref();


//检查输入是否合规：URL、Name、Token
function handleDataUrlChange() {
  state.dataUrl = state.dataUrl.trim();
  const checkeResult = inputRuleCheck(state.dataUrl, RuleCheckTypeEnum.URL);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isDataUrlPass = checkeResult.isPass;
  computedCheckPass();
}
function handleDataSetChange() {
  state.datasetName = state.datasetName.trim();
  const checkeResult = inputRuleCheck(state.datasetName, RuleCheckTypeEnum.Text);
  if (!checkeResult.isPass) message.warning(checkeResult.message);
  state.isDataSetPass = checkeResult.isPass;
  computedCheckPass();

}
function computedCheckPass(){
  state.isCheckPass = state.isDataUrlPass && state.isDataSetPass;
}

function init() {
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  targerMapLayer = layerStore.layerTreeData[1].children[state.selectedIndex];
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
});

// 设置气泡位置
function setBablePosition() {
  if (state.scenePosition) {
    let WindowCoordinates = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      state.scenePosition
    );
    bableQuery.value.style.top =
      WindowCoordinates.y - bableQuery.value.offsetHeight + 450 + "px";
    bableQuery.value.style.left =
      WindowCoordinates.x - bableQuery.value.offsetWidth / 2 + 150 + "px";
  }
}

// 获取数据-第一页
function startQuery() {
  if (state.dataUrl == "" || state.datasetName == "") {
    message.error($t("mapQueryTip"));
    return;
  }

  if (state.tableData.length > 0 && !state.isChangeDataSet) {
    state.showQueryTable = true;
    return;
  }

  clear(false);
  state.selectFiled = "chooseFeild";
  state.isloading_table = true;
  state.isFilter = false;
  state.isChangeDataSet = false;

  // 查询数据
  queryAll();

  let item = layerStore.mapQueryOptions.filter(
    (item) => item.label == targerMapLayer.label
  );
  if (item.length === 0) {
    // 保存数据源信息
    let obj = {
      label: targerMapLayer.label,
      dataUrl: state.dataUrl,
      datasetName: state.datasetName,
    };
    layerStore.mapQueryOptions.push(obj);
  }
}

// 刷新表格
function queryAll() {
  if (state.itemCount === 0) {
    message.success($t("queryWait"));
  } else {
    message.success($t("refreshData"));
  }

  // 指定SQL查询服务参数
  let sqlParam = new L.supermap.GetFeaturesBySQLParameters({
    queryParameter: {
      // name: "Countries@World", // 非必选项
      attributeFilter: "SMID > 0",
    },
    fromIndex: 0,
    toIndex: 10, // 设置为10，加快查询速度
    datasetNames: [state.datasetName],
  });
  // 创建SQL查询实例
  new L.supermap.FeatureService(state.dataUrl).getFeaturesBySQL(
    sqlParam,
    function (serviceResult) {
      let result = serviceResult.result;
      if (window.iEarthConsole) {
        console.log("result-all:", result);
      }
      if (!result) return;
      let features: any = result.features.features;
      state.itemCount = result.totalCount;
      let features_pageSize = features.slice(0, 10);
      state.isloading_table = false;
      updateTable(features_pageSize);

      let coordinate = features[0].geometry.coordinates[0][0];
      if (coordinate) {
        if (coordinate instanceof Array) {
          let coordinate_ = coordinate[0];
          if (Math.abs(coordinate_[0]) > 180) {
            state.isProjection = true;
          } else {
            state.isProjection = false;
          }
        } else {
          if (Math.abs(coordinate[0]) > 180) {
            state.isProjection = true;
          } else {
            state.isProjection = false;
          }
        }
      }
    }
  );
}

// 点选查询
function clickQuery() {
  if (state.isClickQuery) {
    if (handler) {
      handler.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); //移除事件
      handler.destroy();
      handler = null;
    }
    message.success($t("clickQueryClose"));
    state.isClickQuery = false;

    // 恢复鼠标样式
    window.viewer.enableCursorStyle = true;
    document.body.classList.remove("drawCur");
    state.shadowRadioShow = false;
    viewer.scene.postRender.removeEventListener(setBablePosition);
    return;
  }
  message.success($t("clickQueryCloseTip"));
  state.isClickQuery = true;

  // 修改鼠标样式
  window.viewer.enableCursorStyle = false;
  window.viewer._element.style.cursor = "";
  document.body.classList.add("drawCur");

  // 每一帧都去计算气泡的正确位置
  viewer.scene.postRender.addEventListener(setBablePosition);

  handler = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (event) {
    viewer.entities.removeAll();

    let position = viewer.scene.pickPosition(event.position);
    let position2 = CartesiantoDegrees(position);
    state.scenePosition = position; // 气泡位置

    let point = L.marker([position2[1], position2[0]]); // SuperMap3D和leaflet这里对调了

    // 如果是投影坐标系对geometry进行坐标转换
    let geometry: any = undefined;
    if (state.isProjection) {
      geometry = L.supermap.Util.transform(
        point,
        L.CRS.EPSG4326,
        L.CRS.EPSG3857
      );
    } else {
      geometry = point;
    }
    let geometryParam = new L.supermap.GetFeaturesByGeometryParameters({
      datasetNames: [state.datasetName],
      geometry: geometry,
      spatialQueryMode: "INTERSECT",
    });

    new L.supermap.FeatureService(state.dataUrl).getFeaturesByGeometry(
      geometryParam,
      function (serviceResult) {
        if (window.iEarthConsole) {
          console.log("点选查询:", serviceResult);
        }
        if (!serviceResult.result.features) return;
        let features = serviceResult.result?.features?.features;
        if (features.length == 0) {
          message.success($t("noData"));
          state.shadowRadioShow = false;
          return;
        }
        state.shadowRadioShow = true;
        state.currentFeature = features[0];
        addFeature(features[0]);
        getModelInfo(features[0]);
        let mediaURL: any;
        if (state.currentFeature.properties) {
          state.currentFeatureID = state.currentFeature.id;
          mediaURL = state.currentFeature.properties[state.selectMediaFeild];
        }
        let customUrl = getCustomMediaUrl(state.currentFeature);
        if (customUrl) {
          state.mediaUrl = customUrl;
        } else {
          state.mediaUrl = mediaURL;
        }
        if (window.iEarthConsole) {
          console.log("媒体链接-mediaUrl:", state.mediaUrl);
        }
        // 自定义媒体连接地址
        if (state.mediaType == "video") {
          let videoDom: any = document.getElementById("videoDom");
          videoDom.src = state.mediaUrl;
          videoDom.load();
          // videoDom.play();
        }
      }
    );
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(() => {
    clickQuery();
    // queryAll();
    state.showQueryTable = true;
    if (state.mediaType == "video") {
      let videoDom: any = document.getElementById("videoDom");
      if (videoDom) videoDom.pause();
    }
  }, SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
}

function getCustomMediaUrl(feature: any) {
  let featureID = String(feature.id);
  let customMediaUrl: any;
  if (layerStore.mediaFeildOptions[state.mediaType][featureID]) {
    customMediaUrl =
      layerStore.mediaFeildOptions[state.mediaType][featureID][
        state.selectMediaFeild
      ];
  } else {
    customMediaUrl = undefined;
  }
  return customMediaUrl;
}

//笛卡尔转经纬度
function CartesiantoDegrees(Cartesians) {
  let array = [].concat(Cartesians);
  let positions: any = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
    let longitude = Number(SuperMap3D.Math.toDegrees(cartographic.longitude));
    let latitude = Number(SuperMap3D.Math.toDegrees(cartographic.latitude));
    let h = Number(cartographic.height);
    if (
      positions.indexOf(longitude) == -1 &&
      positions.indexOf(latitude) == -1
    ) {
      positions.push(longitude);
      positions.push(latitude);
      positions.push(h);
    }
  }
  return positions;
}

// 点击拾取实体，获取属性信息
function getModelInfo(feature: any) {
  if (window.iEarthConsole) {
    console.log("click-feature:", feature);
  }
  if (feature) {
    let properties = feature.properties;
    state.shadowRadioShow = true;
    let list: any = [];
    for (let key in properties) {
      let value = String(properties[key]);
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
  if (layerStore.mapQueryOptions.length > 0) {
    let targetLayerLable = targerMapLayer.label;
    let targetItem = layerStore.mapQueryOptions.filter(
      (item) => item.label == targetLayerLable
    );
    if (targetItem.length > 0) {
      state.dataUrl = targetItem[0].dataUrl;
      state.datasetName = targetItem[0].datasetName;
    }
  }
}

// 媒体字段相关
function openMediaField() {
  state.mediaFieldPanleShow = true;
  state.isCustomMediaUrl = false;
}

// 清除
function clear(isClearInfo = true) {
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
    state.datasetName = "";
    state.isCheckPass = false;
    state.isDataUrlPass = false;
    state.isDataSetPass = false;
  }
  state.columns = [];
  state.tableData = [];
  state.itemCount = 0;
  state.isloading = false;
  state.isloading_table = false;
  state.isloading_mydata = false;
  state.isProjection = false;
  state.sqlString = "";
  state.isMydate = false;

  columns.value.length = 0;
  columns.value.push({
    type: "selection",
    multiple: false,
    align: "center",
  });

  viewer.entities.removeAll();

  // 恢复鼠标样式
  window.viewer.enableCursorStyle = true;
  document.body.classList.remove("drawCur");
}

// 关闭弹窗
function closebable() {
  state.shadowRadioShow = false;
  if (state.mediaType == "video") {
    let videoDom: any = document.getElementById("videoDom");
    if (videoDom) videoDom.pause();
  }
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
function updateTable(features: any[]) {
  // 初始化
  state.tableData = [];

  if (columns.value.length === 1) {
    if (features.length < 1) return;

    // 设置字段
    let keys = Object.keys(features[0].properties);
    keys.forEach((key: string) => {
      columns.value.push({
        // resizable: true, // 列宽可拖拽
        key: key,
        title: key,
        align: "center",
        width: 100,
        ellipsis: {
          tooltip: true,
        },
      });

      // 媒体字段
      state.mediaFeilds.push({
        label: key,
        value: key,
      });
    });
  }

  // 设置数据
  let tableData: any = [];
  features.forEach((feature: any) => {
    feature.properties.key = feature.properties.SMID;
    tableData.push(feature.properties);
  });
  state.tableData = tableData;
  state.showQueryTable = true;
}

// 选中行查询
function handleCheck(rowKeys: any) {
  viewer.entities.removeAll();
  // 数据集ID查询服务参数
  let idsParam = new L.supermap.GetFeaturesByIDsParameters({
    IDs: rowKeys,
    datasetNames: [state.datasetName],
  });
  // 创建指定ID查询实例
  new L.supermap.FeatureService(state.dataUrl).getFeaturesByIDs(
    idsParam,
    function (serviceResult) {
      // 获取服务器返回的结果
      if (window.iEarthConsole) {
        console.log("选中行查询结果:", serviceResult.result);
      }
      let feature = serviceResult.result.features.features[0];
      addFeature(feature);
      state.currentFeature = feature;
      state.currentFeatureID = state.currentFeature.id;
    }
  );
}

// 通过GeoJsonDataSource.load直接添加feature
let geoJsonDataSourceList: any = [];
function addFeature(feature: any) {
  if (geoJsonDataSourceList.length > 0 && !state.isMydate) {
    let lastGeoJsonDataSource = geoJsonDataSourceList.pop();
    viewer.dataSources.remove(lastGeoJsonDataSource);
  }
  if (!feature) return;
  if (state.isProjection) {
    // feature = GeoJsonProjectToLatLng(feature);  // 我自己实现的方法
    feature = L.supermap.Util.transform(
      feature,
      L.CRS.EPSG3857,
      L.CRS.EPSG4326
    ); // supermap写的
    if (!feature) return;
  }
  let entityPromise = SuperMap3D.GeoJsonDataSource.load(feature);
  entityPromise
    .then(function (dataSource: any) {
      geoJsonDataSourceList.push(dataSource);
      viewer.dataSources.add(dataSource);
      let entities = dataSource.entities.values;
      viewer.zoomTo(entities[0]);
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
    .otherwise(function (error) {
      window.alert(error);
    });
}

// 将feature投影坐标系转为经纬度形式
/** 
function GeoJsonProjectToLatLng(feature: any) {
  let leafletLayer = L.geoJSON(feature, {
    coordsToLatLng: function (coords: any) {
      return L.CRS.EPSG3857.unproject(L.point(coords[0], coords[1]));
    },
  });
  if (leafletLayer._layers) {
    let keys = Object.keys(leafletLayer._layers);
    let key = keys[0];
    let layerLatlngs: any;
    if ((layerLatlngs = leafletLayer._layers[key]._latlngs)) {
      layerLatlngs = leafletLayer._layers[key]._latlngs[0];
    } else {
      return undefined;
    }

    let allArray: any = [];
    for (let i = 0; i < layerLatlngs.length; i++) {
      let layerLatlng = layerLatlngs[i];
      let array: any = [];
      layerLatlng.forEach((element: any) => {
        array.push([element.lng, element.lat]);
      });
      allArray.push(array);
    }
    feature.geometry.coordinates = [allArray];
  } else {
    return undefined;
  }

  return feature;
}
 */

// 保存媒体字段
function saveMediaField() {
  state.mediaFieldPanleShow = false;
  if (
    state.currentFeatureID != "" &&
    state.selectMediaFeild != "" &&
    state.isCustomMediaUrl
  ) {
    let obj = {};
    let key: string = String(state.currentFeatureID);
    obj[state.selectMediaFeild] = state.mediaUrl;

    if (!layerStore.mediaFeildOptions[state.mediaType][key]) {
      layerStore.mediaFeildOptions[state.mediaType][key] = obj;
    } else {
      let objConnect = Object.assign(
        {},
        layerStore.mediaFeildOptions[state.mediaType][key],
        obj
      );
      layerStore.mediaFeildOptions[state.mediaType][key] = objConnect;
    }
  }
  state.isCustomMediaUrl = false;
  message.success($t("bingMediaFieldSuccessTip"));
}

// 清除媒体字段
function clearMediaField() {
  state.mediaTitle = "";
  state.mediaUrl = "";
  state.selectMediaFeild = "SMID";
  state.isCheckPass = false;
  state.isDataUrlPass = false;
  state.isDataSetPass = false;
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
  message.success($t("dataFiltering"));
  state.isloading = true;
  state.page = 1;
  let sqlString = `${state.selectFiled} like '%${state.sqlString}%'`;
  if (window.iEarthConsole) {
    console.log("sqlString:", sqlString);
  }
  let sqlParam = new L.supermap.GetFeaturesBySQLParameters({
    queryParameter: {
      attributeFilter: sqlString,
    },
    fromIndex: 0,
    toIndex: 10,
    datasetNames: [state.datasetName],
  });
  // 创建SQL查询实例
  new L.supermap.FeatureService(state.dataUrl).getFeaturesBySQL(
    sqlParam,
    function (serviceResult) {
      // 获取服务器返回的结果
      let result = serviceResult.result;
      if (window.iEarthConsole) {
        console.log("sqlQuery:", result);
      }
      let features: any = result.features.features;
      let features_pageSize = features.slice(0, 10);
      state.itemCount = result.totalCount;
      state.isFilter = true;
      state.isloading = false;
      updateTable(features_pageSize);
    }
  );
}

// 分页查找
function getDataByPage(pageNum) {
  // 指定SQL查询服务参数
  // let start = (pageNum - 1) * 10;
  // let end = (pageNum - 1) * 10 + 10;
  let sqlString: string;
  if (state.isFilter) {
    sqlString = `${state.selectFiled} like '%${state.sqlString}%' limit ${
      (state.page - 1) * 10
    },10`;
  } else {
    sqlString = `SMID > 0 limit ${(pageNum - 1) * 10},10`; // 'SMID > ${start} and SMID <= ${end}'
  }

  if (window.iEarthConsole) {
    console.log("分页-sqlString:", sqlString);
  }

  let sqlParam = new L.supermap.GetFeaturesBySQLParameters({
    queryParameter: {
      attributeFilter: sqlString,
    },
    fromIndex: 0,
    toIndex: 10,
    datasetNames: [state.datasetName],
  });
  // 创建SQL查询实例
  new L.supermap.FeatureService(state.dataUrl).getFeaturesBySQL(
    sqlParam,
    function (serviceResult) {
      // 获取服务器返回的结果
      let result = serviceResult.result;
      let features: any = result.features.features;
      if (window.iEarthConsole) {
        console.log("分页-features:", features);
      }
      updateTable(features);
    }
  );
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

// 我的数据
function openMydata() {
  init_mydata();
  state.myDataPanleShow = true;
  message.success($t("getData"));
  state.isMydate = true;
}

// 初始化并获取数据
function init_mydata() {
  //查询出portal中的服务列表（只查询出服务项）
  let myDataUrl =
    getRootUrl() +
    "web/datas.json?types=%5B%22JSON%22%2C%22EXCEL%22%2C%22CSV%22%2C%22GEOJSON%22%2C%22SHP%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&currentPage=1&pageSize=8";
  // http://localhost:8190/iportal/web/datas.json?types=%5B%22JSON%22%2C%22EXCEL%22%2C%22CSV%22%2C%22GEOJSON%22%2C%22SHP%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&currentPage=1&pageSize=8
  // http://localhost:8190/iportal/web/datas/632566313/content.json?&currentPage=1&pageSize=99999999

  if (window.iEarthConsole) {
    console.log("myDataUrl-mine:", myDataUrl);
  }

  window.axios
    .get(myDataUrl, { withCredentials: IportalStore.isPortal })
    .then(function (response) {
      if (window.iEarthConsole) {
        console.log("response-myData:", response);
      }
      let data = response.data.content;
      data.forEach((item) => {
        let disabled = item.type != "SHP"; //是否禁用选择
        let name = item.fileName.split(".")[0];
        state.portalServiceList_mydata.push({
          key: item.id,
          fileName: name,
          id: item.id,
          type: item.type,
          createTime: dateDiff(item.createTime),
          disabled: disabled,
        });
      });
      if (window.iEarthConsole) {
        console.log("state.portalServiceList:", state.portalServiceList_mydata);
      }
    });
}

// 打开保存的服务
function addShp_mydata() {
  let selecteditems = state.portalServiceList_mydata.filter((item: any) => {
    return item.key === state.checkedRowKeys_mydata[0];
  });
  if (viewer) {
    selecteditems.forEach((item) => {
      if (window.iEarthConsole) {
        console.log("item-mydataSelect:", item);
      }

      let resouceID = item.id;
      let resouceUrl =
        getRootUrl() +
        `web/datas/${resouceID}/content.json?&currentPage=1&pageSize=99999999`;
      if (window.iEarthConsole) {
        console.log("resouceUrl:", resouceUrl);
      }
      state.isloading_mydata = true;

      window.axios
        .get(resouceUrl, { withCredentials: IportalStore.isPortal })
        .then(function (responseData) {
          state.isloading_mydata = false;
          let contentShp = JSON.parse(responseData.data.content);
          if (window.iEarthConsole) {
            console.log("contentShp:", contentShp);
          }

          let firstFeature = contentShp.layers[0].features[0];
          let polygonPositions: any = [];
          let positions = firstFeature.geometry.coordinates[0][0];
          positions.forEach((position: any) => {
            polygonPositions.push(position[0]);
            polygonPositions.push(position[1]);
          });

          let entity = viewer.entities.add({
            polygon: {
              hierarchy:
                SuperMap3D.Cartesian3.fromDegreesArray(polygonPositions),
              material: SuperMap3D.Color.BLUE,
            },
          });

          viewer.zoomTo(entity);
          state.myDataPanleShow = false;
          let positions_reverse = positions.map((arr) => arr.reverse()); // 数组倒置，因为leaflet经纬度和xy相反
          let polygon = L.polygon(positions_reverse, { color: "red" });
          let geometry_mydata: any = undefined;
          if (state.isProjection) {
            geometry_mydata = L.supermap.Util.transform(
              polygon,
              L.CRS.EPSG4326,
              L.CRS.EPSG3857
            );
          } else {
            geometry_mydata = polygon;
          }
          let geometryParam = new L.supermap.GetFeaturesByGeometryParameters({
            datasetNames: [state.datasetName],
            geometry: geometry_mydata,
            spatialQueryMode: "INTERSECT",
          });

          new L.supermap.FeatureService(state.dataUrl).getFeaturesByGeometry(
            geometryParam,
            function (serviceResult) {
              if (window.iEarthConsole) {
                console.log("指定数据几何查询:", serviceResult);
              }
              let features = serviceResult.result.features.features;
              updateTable(features);
              state.itemCount = features.length;
              features.forEach((feature: any) => {
                addFeature(feature);
              });
            }
          );
        });
    });
  }
}

// 取消
function cancle_mydata() {
  state.checkedRowKeys_mydata = ["1"];
  state.myDataPanleShow = false;
  state.isloading_mydata = false;
}

// 表格相关
const pagination_mydata = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination_mydata.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination_mydata.pageSize = pageSize;
    pagination_mydata.page = 1;
  },
});

/** 时间倒序，多少小时之前
 * @param timestamp 时间毫秒数
 */
function dateDiff(timestamp) {
  // 补全为13位
  let arrTimestamp: any = (timestamp + "").split("");
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = "0";
    }
  }
  timestamp = arrTimestamp.join("") * 1;
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  // let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return $t("recently");
  }
  // 计算差异时间的量级
  let monthC: any = diffValue / month;
  let weekC: any = diffValue / (7 * day);
  let dayC: any = diffValue / day;
  let hourC: any = diffValue / hour;
  let minC: any = diffValue / minute;

  // 数值补0方法
  let zero = function (value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (monthC > 4) {
    // 超过1年，直接显示年月日
    return (function () {
      let date = new Date(timestamp);
      return (
        date.getFullYear() +
        $t("yeear") +
        zero(date.getMonth() + 1) +
        $t("month") +
        zero(date.getDate()) +
        $t("day")
      );
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + $t("monthsAgo");
  } else if (weekC >= 1) {
    return parseInt(weekC) + $t("weeksAgo");
  } else if (dayC >= 1) {
    return parseInt(dayC) + $t("daysAgo");
  } else if (hourC >= 1) {
    return parseInt(hourC) + $t("hoursAgo");
  } else if (minC >= 1) {
    return parseInt(minC) + $t("minutesAgo");
  }
  return $t("secondsAgo");
}

watch(
  () => state.checkedRowKeys,
  (val) => {
    handleCheck(val);
  }
);

watch(
  () => state.datasetName,
  () => {
    state.isChangeDataSet = true;
  }
);

watch(
  () => state.mediaType,
  () => {
    state.mediaTitle = "";
    state.mediaUrl = "";
  }
);

watch(
  columns,
  (newValue) => {
    state.mediaFeilds = [];
    for (let i = 0; i < newValue.length; i++) {
      let item = newValue[i];
      let obj = {
        label: item.key,
        value: item.key,
      };
      state.mediaFeilds.push(obj);
    }
  },
  { immediate: true }
);

watch(
  () => state.isCustomMediaUrl,
  (val) => {
    if (!state.currentFeature) {
      state.mediaUrl = "";
      return;
    }
    let currentSaveMediaUrl = getCustomMediaUrl(state.currentFeature);
    if (window.iEarthConsole) {
      console.log("当前保存的媒体链接:", currentSaveMediaUrl);
    }
    if (currentSaveMediaUrl && val) {
      state.mediaUrl = currentSaveMediaUrl;
    } else {
      state.mediaUrl = "";
    }
  }
);

watch(
  () => state.selectMediaFeild,
  () => {
    if (!state.currentFeature) {
      state.mediaUrl = "";
      return;
    }
    let currentSaveMediaUrl = getCustomMediaUrl(state.currentFeature);
    if (window.iEarthConsole) {
      console.log("当前保存的媒体链接:", currentSaveMediaUrl);
    }
    if (currentSaveMediaUrl && state.isCustomMediaUrl) {
      state.mediaUrl = currentSaveMediaUrl;
    } else {
      state.mediaUrl = "";
    }
  }
);
</script>

<style lang="scss" scoped>
.oprationBtn {
  margin-left: 30%;
  display: flex;
  flex-wrap: wrap;
}

.oprationBtn_loading {
  margin-top: 0.1rem;
  margin-left: 68%;
  display: flex;
  flex-wrap: wrap;
}

.oprationBtn_noloading {
  margin-top: 0.1rem;
  margin-left: 69%;
  display: flex;
  flex-wrap: wrap;
}

.tableInfo {
  text-align: center;
  margin-left: 0.2rem;
}

.tableHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 0.4rem;
  width: 100%;

  .items {
    line-height: 0.35rem;
  }

  .search {
    margin-top: 0.1rem;
    margin-right: -4rem;
  }
}

.opration {
  margin-top: 0.1rem;
  margin-left: 73%;
}

.tip {
  color: "#3499E5";
  background-color: null;
}

.pagination {
  display: flex;
  justify-content: space-between;
}

.flex-1-hidden {
  flex: 1 1 0% !important;
  overflow: hidden;
}

:deep(.too-old td) {
  color: rgba(255, 0, 0, 0.75) !important;
}

:deep(.age) {
  color: rgba(0, 128, 0, 0.75) !important;
}

:deep(.too-old .age) {
  color: rgba(0, 0, 128, 0.75) !important;
}

.icon-list-box {
  display: flex;
  width: 2.2rem;
  height: auto;
  margin-left: 0.4rem;

  .icon-span {
    width: 20%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .icon-span-three {
    width: 25%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }

  .selected-icon {
    color: #3499e5;
  }
}

// 弹窗
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
    font-size: 0.12rem;
    line-height: 0.2rem;
  }

  .mediaContainer {
    display: flex;
    justify-content: center;
  }

  span {
    font-size: 0.12rem;
  }

  .bableMedia {
    width: 80%;
    height: auto;
  }
}

// 媒体字段图标 删不了
// .n-dialog.n-dialog--icon-left .n-dialog__icon {
//   display: none !important;
// }

#queryTable {
  position: fixed;
  bottom: 0rem;
  left: 5%;
  width: 90%;
  height: 3rem;
  z-index: 999999;
  background-color: rgb(29, 29, 17);
  opacity: 0.8;
  padding: 0.1rem;

  display: flex;
  flex-direction: column;
}

#myDataTable {
  margin-right: 0.1rem;
  height: 2.3rem;
  z-index: 999999;
  background-color: rgb(29, 29, 17);
  opacity: 0.5;

  display: flex;
  flex-direction: column;

  .flex-1-hidden {
    flex: 1 1 0% !important;
    overflow: hidden;
  }
}
</style>
