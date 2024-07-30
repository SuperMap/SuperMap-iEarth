<template>
  <div class="row-item">
    <span></span>
    <div class="icon-container">
      <div class="icon-list" style="width: 1.96rem">
        <span
          v-for="(item, index) in state.itemOptions"
          :key="index"
          class="icon-span"
          :title="item.lable"
          :class="item.isSelect ? 'selected-icon' : ''"
          @click="changleIconItem(item)"
        >
          <i
            class="iconfont iconSize"
            :class="item.iconName"
            style="margin-top: 0px"
          ></i>
        </span>
      </div>
    </div>
  </div>

  <div v-show="state.customRouteNames.length > 0">
    <div class="row-item">
      <span>{{ $t("addedStops") }}</span>
      <div class="row-content">
        <n-select
          v-model:value="state.selectedAddedStopIndex"
          :options="state.routeStops"
          label-field="stopName"
          value-field="index"
        />
      </div>
    </div>

    <!-- <div class="row-item">
      <span>{{$t('flyRoute')}}</span>
        <div class="row-content">
          <n-select
            v-model:value="state.customRouteSelectedIndex"
            :options="state.customRouteNames"
          />
        </div>
    </div> -->

    <div class="row-item" style="margin-bottom: 0px">
      <span></span>
      <div class="row-content" style="display: flex">
        <n-checkbox v-model:checked="state.showRoute" /><span
          class="checkbox-lable" :title="$t('displayRoute')"
          >{{ $t("displayRoute") }}</span
        >
        <n-checkbox v-model:checked="state.showStop" /><span
          class="checkbox-lable" :title="$t('displayStation')"
          >{{ $t("displayStation") }}</span
        >
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("flySpeed") }}</span>
      <div class="slider-box">
        <n-slider
          style="width: 1.5rem"
          v-model:value="state.routeSpeed"
          :step="1"
          :min="0"
          :max="500"
        />
        <n-input-number
          v-model:value="state.routeSpeed"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="0"
          :max="500"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span></span>
      <div class="icon-container">
        <div class="icon-list" style="width: 1.96rem">
          <span
            v-for="(item, index) in state.actionOptions"
            :key="index"
            class="icon-span"
            :title="item.lable"
            :class="item.isSelect ? 'selected-icon' : ''"
            @click="changleIconItemAction(item)"
          >
            <i
              class="iconfont iconSize"
              :class="item.iconName"
              style="margin-top: 0px"
            ></i>
          </span>
        </div>
      </div>
    </div>

    <div class="btn-row-item" style="margin-left: 0.94rem">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="downLoad"
        :title="$t('downLoad')"
        style="margin-right: 0.1rem; margin-left: 0.03rem"
        >{{ $t("downLoad") }}</n-button
      >
      <n-button
        class="btn-secondary"
        @click="clearRoute"
        color="rgba(255, 255, 255, 0.65)"
        ghost
        >{{ $t("clear") }}</n-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive, onMounted, onBeforeUnmount } from "vue";
import { useNotification, useMessage } from "naive-ui";
import tool from "@/tools/tool";
import createFlyLine_xml from "./fly-line-xml.js";

const notification = useNotification();
const message = useMessage();

type stateType = {
  routeType: string; //自定义还得指定路线类型
  fileSrc: string; //文件地址,不能同时使用fpfUrl
  fpfUrl: any; //指定fpf路径
  selectedStopIndex: number; //选中当前站点
  addCurrentStopIndex: number; // 记录当前添加站点的索引并赋值给站点index，以便n-select
  showRoute: boolean; //显示路线
  showStop: boolean; //显示站点
  currentStopNames: any[]; //当前路线的站点名称集合
  currentStopNamesIndex: number; // 记录当前路线的索引并赋值，以便n-select
  //自定义
  customRouteNames: any[]; //保存自定义路线名称
  addCurrentRouteIndex: number; // 当前路线索引，以便n-select
  customRouteSelectedIndex: any; //自定义选中路线索引
  routeStops: any[]; //自定义当前路线的站点集合
  selectedAddedStopIndex: any; //自定义已加站点选中索引
  //站点
  setStopName: string; //设置当前站点名称
  setStopSpeed: number; // 设置当前站点速度
  stopPlayMode: string; //设置站点模式:默认停留
  waitTime: number; //停留时间
  surroundDuration: number; //环绕模式时间
  //飞行路线设置
  isAlongline: boolean; //获取或者设置该飞行路线是否是沿线飞行。
  routeSpeed: number; //飞行路线速度
  //   allRoutes:any[]
  itemOptions: any; // 功能选项
  actionOptions: any; // 操作选项
  isSaveAutoFlag: boolean; // 是否开启自动保存
};

// 设置默认值数据
let state = reactive<stateType>({
  routeType: "customRoute", //自定义还得指定路线类型
  fileSrc: "", //文件地址,不能同时使用fpfUrl
  fpfUrl: null, //指定fpf路径
  selectedStopIndex: 0, //选中当前站点
  addCurrentStopIndex: 0, // 记录当前添加站点的索引并赋值给站点index，以便n-select
  showRoute: false, //显示路线
  showStop: false, //显示站点
  currentStopNames: [], //当前路线的站点名称集合
  currentStopNamesIndex: 0, // 记录当前路线的索引并赋值，以便n-select
  //自定义
  customRouteNames: [], //保存自定义路线名称
  addCurrentRouteIndex: 0, // 当前路线索引，以便n-select
  customRouteSelectedIndex: null, //自定义选中路线索引
  routeStops: [], //自定义当前路线的站点集合
  selectedAddedStopIndex: undefined, //自定义已加站点选中索引
  //站点
  setStopName: "Stop-1", //设置当前站点名称
  setStopSpeed: 0, // 设置当前站点速度
  stopPlayMode: "StopPause", //设置站点模式:默认停留
  waitTime: 0, //停留时间
  surroundDuration: 1, //环绕模式时间
  //飞行路线设置
  isAlongline: false, //获取或者设置该飞行路线是否是沿线飞行。
  routeSpeed: 200, //飞行路线速度
  isSaveAutoFlag: false,
  //   allRoutes:[]
  itemOptions: [
    {
      index: 1,
      lable: $t("addStation"),
      iconName: "icontianjia",
      isSelect: false,
    },
    {
      index: 2,
      lable: $t("deleteStation"),
      iconName: "iconshanchu",
      isSelect: false,
    },
    {
      index: 3,
      lable: $t("restore"),
      iconName: "iconfuwei",
      isSelect: false,
    },
    {
      index: 4,
      lable: $t("save"),
      iconName: "iconbaocun",
      isSelect: false,
    },
  ],
  actionOptions: [
    {
      index: 1,
      lable: $t("play"),
      iconName: "iconbofang",
      isSelect: false,
    },
    {
      index: 2,
      lable: $t("pause"),
      iconName: "iconzanting",
      isSelect: false,
    },
    {
      index: 3,
      lable: $t("stop"),
      iconName: "icontingzhi",
      isSelect: false,
    },
  ],
});

// 初始化变量
let flyManager: any, routeCollection: any; //创建飞行路线集合对象类
let currentStops: any; //当前路线所有站点集合
let createXml: any,
  flyLineXmls: any = []; //创建和保存xml飞行路线文件

onMounted(() => {
  initFlyManager();
});

// 销毁
onBeforeUnmount(() => {
  clearRoute();

  let route = flyManager.currentRoute;
  if (route) {
    route.isLineVisible = false;
    route.isStopVisible = false;
  }
  flyManager = routeCollection = null;
  currentStops = null;
  createXml = null;
  flyLineXmls = null;
});

// 功能切换
function changleIconItem(item: any) {
  state.itemOptions.map((itemObj) => {
    if (itemObj.index == item.index) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });

  switch (item.index) {
    case 1: {
      addStop();
      break;
    }
    case 2: {
      deleteStop();
      break;
    }
    case 3: {
      restStops();
      break;
    }
    case 4: {
      saveStop();
      break;
    }
    default:
      break;
  }
}
// 操作切换
function changleIconItemAction(item: any) {
  state.actionOptions.map((itemObj) => {
    if (itemObj.index == item.index) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });

  switch (item.index) {
    case 1: {
      flyStart();
      break;
    }
    case 2: {
      flyPause();
      break;
    }
    case 3: {
      flyStop();
      break;
    }
    default:
      break;
  }
}

//初始化飞行管理
function initFlyManager() {
  routeCollection = new SuperMap3D.RouteCollection(viewer.entities);
  flyManager = new SuperMap3D.FlyManager({
    scene: viewer.scene,
    routes: routeCollection,
  });
  createXml = new createFlyLine_xml();
}

// 异步飞行管理准备就绪函数
function readyPromise() {
  routeCollection.readyPromise.then(() => {
    flyManager.routes = routeCollection;
    let route = flyManager.currentRoute;
    route.isLineVisible = state.showRoute;
    route.isStopVisible = state.showStop;
    updateCurrentStops();
  });
}

// 更新当前路线站点
function updateCurrentStops() {
  state.currentStopNames.length = 0;
  currentStops = flyManager.getAllRouteStops();
  state.currentStopNamesIndex = 0;
  for (let i = 0, j = currentStops.length; i < j; i++) {
    let stopName = currentStops[i].stopName || "Stop" + (i + 1);
    state.currentStopNames.push({
      label: stopName,
      value: state.currentStopNamesIndex,
    });
    state.currentStopNamesIndex++;
  }
}

// 开始
function flyStart() {
  flyManager.play();
}
// 暂停
function flyPause() {
  flyManager && flyManager.pause();
}
// 停止
function flyStop() {
  flyManager && flyManager.stop();
}

// 添加站点
function addStop() {
  flyManager.stop();
  let point = viewer.camera.position;
  let position = tool.CartesiantoDegrees(point);
  let stop = {
    stopName: state.setStopName,
    index: state.addCurrentStopIndex,
    point: position,
    heading: viewer.camera.heading,
    tilt: viewer.camera.pitch,
    speed: state.setStopSpeed,
    stopPlayMode: state.stopPlayMode,
    surroundDuration: state.surroundDuration,
    waitTime: state.waitTime,
  };
  state.routeStops.push(stop);
  if (state.isSaveAutoFlag) saveStop(); // 一旦添加站点，立即保存
  let routeLen = state.routeStops.length;
  if (routeLen > 0)
    state.addCurrentStopIndex = state.routeStops[routeLen - 1].index + 1; // 保证新增的站点index始终比前一位大1
  message.success(`${$t("addStopSuccess")}: ${state.setStopName}`);

  if (state.routeStops.length > 0) {
    let len = state.routeStops.length;
    let lastStopName = state.routeStops[len - 1].stopName;
    let index = lastStopName.split("-")[1] || 1;
    let name = "Stop-" + (Number(index) + 1);
    state.setStopName = name;
  }
  state.selectedAddedStopIndex =
    state.routeStops[state.routeStops.length - 1].index;
}

// 清除选中站点
function deleteStop() {
  let delIndex = state.routeStops.findIndex(
    (e) => e.index == state.selectedAddedStopIndex
  );
  state.routeStops.splice(delIndex, 1);
  if (state.routeStops.length > 1 && state.isSaveAutoFlag) {
    saveStop(); // 一旦删除站点，实时保存
  }
  if (state.routeStops.length > 0) {
    state.selectedAddedStopIndex =
      state.routeStops[state.routeStops.length - 1].index;
    return;
  }
  state.selectedAddedStopIndex = undefined;
  state.setStopName = "Stop-1";
}

// 重置当前路线
function restStops() {
  let route = flyManager.currentRoute;
  if (route) {
    route.isLineVisible = false;
    route.isStopVisible = false;
  }
  state.setStopName = "Stop-1";
  state.routeStops = [];
  state.addCurrentStopIndex = 0;
  state.selectedAddedStopIndex = 0;
  // state.routeStops.length = 0;
  // state.setStopSpeed = 0;
  // state.stopPlayMode = "StopPause";
  // state.waitTime = 0;
  // state.surroundDuration = 1;
}

// 保存站点
function saveStop() {
  if (state.routeStops.length < 2) {
    if (state.customRouteNames.length == 0) {
      notification.create({
        content: () => $t("atLeastTwoStop"),
        duration: 3500,
      });
    }
    return;
  }

  // 飞行路线配置
  let route = {
    routeName: $t("flyRoute_1"),
    index: state.addCurrentRouteIndex,
    speed: state.routeSpeed,
    isAlongLine: "False",
    routeStops: state.routeStops,
  };
  let xml = createXml.createXMLflyLine(route);
  flyLineXmls[0] = xml;
  state.isSaveAutoFlag = true; //一旦点击保存，开启实时自动保存
  // 保证只有一条飞行路线
  if (state.customRouteNames.length === 0) {
    state.customRouteNames.push({
      label: route.routeName,
      value: route.index,
    });
  }
  updateRouteCollection();

  state.addCurrentRouteIndex++;
  if (state.customRouteSelectedIndex === null)
    state.customRouteSelectedIndex = 0;
}

// 更新飞行路径
function updateRouteCollection() {
  flyManager && flyManager.stop();
  let route = flyManager.currentRoute;
  if (route) route.clear(); //清除之前的
  routeCollection = new SuperMap3D.RouteCollection(viewer.entities); //飞行路线底层默认第一条路线，所以重新new
  routeCollection.fromXML(flyLineXmls[0]); // 默认飞行路径只有一条
  readyPromise();
}

// 下载选择的飞行路线fpf文件
function downLoad() {
  let data = flyLineXmls[state.customRouteSelectedIndex];
  if (!data) return;
  let blob = new Blob([data]); //将返回的数据包装成blob（方法的具体使用参考mdn）
  let alink = document.createElement("a");
  alink.download = "fly-route.fpf"; //文件名,大部分浏览器兼容,IE10及以下不兼容
  alink.href = URL.createObjectURL(blob); //根据blob 创建 url
  alink.click(); //自动点击
}

// 清除选中飞行路线
function clearRoute() {
  flyManager.stop();
  if (flyLineXmls.length < 1) return;
  flyLineXmls.splice(state.customRouteSelectedIndex, 1);
  state.customRouteNames.splice(state.customRouteSelectedIndex, 1);
  if (flyLineXmls.length > 0) {
    state.customRouteSelectedIndex = 0;
    return;
  }
  state.customRouteSelectedIndex = null;
  state.currentStopNames.length = 0;
  let route = flyManager.currentRoute;
  if (route) route.clear(); //清除之前的
  state.routeStops = [];
  state.setStopName = "Stop-1";
  state.isSaveAutoFlag = false;
  state.selectedAddedStopIndex = undefined;
  state.addCurrentStopIndex = 0;
}

// 监听
watch(
  () => state.selectedStopIndex,
  (val) => {
    flyManager && flyManager.stop();
    //  updateCurrentStops();
    let index = Number(val);
    let currentStopList = flyManager.getAllRouteStops();
    let stop = currentStopList[index];
    flyManager.viewToStop(stop);
  }
);
watch(
  () => state.showRoute,
  (val) => {
    let route = flyManager.currentRoute;
    if (route) route.isLineVisible = val;
  }
);
watch(
  () => state.routeSpeed,
  () => {
    saveStop();
  }
);
watch(
  () => state.showStop,
  (val) => {
    let route = flyManager.currentRoute;
    if (route) route.isStopVisible = val;
  }
);
watch(
  () => state.customRouteSelectedIndex,
  (val) => {
    if (val === null) return;
    updateRouteCollection();
  }
);
watch(
  () => state.selectedAddedStopIndex,
  (val) => {
    let stop = state.routeStops.find((stop) => stop.index === val);
    if (!stop) return;
    viewer.camera.setView({
      destination: SuperMap3D.Cartesian3.fromDegrees(
        stop.point[0],
        stop.point[1],
        stop.point[2]
      ),
      orientation: {
        heading: stop.heading,
        pitch: stop.tilt,
        roll: 0,
      },
    });
  }
);
</script>

<style lang="scss" scoped>
.row-content .checkbox-lable {
  width: auto;
  height: 24px;
  line-height: 24px;
  margin-right: 0.1rem;
  margin-left: 0.16rem;
}

.checkbox-lable {
  width: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.n-button .n-button__content{
  overflow: hidden;
}
</style>
