<template>
  <sm-rowLayOut slotType="slider">
    <template #item-lable>飞行速度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.routeSpeed"
        :min="1"
        :max="1000"
        :step="10"
        style="width: 70%"
      />
      <n-input-number
        v-model:value="state.routeSpeed"
        :bordered="false"
        style="width: 40%"
        :show-button="false"
      >
        <template #suffix>M/S</template>
      </n-input-number>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut>
    <template #item-lable></template>
    <template #item-content>
      <div class="svgIcons">
        <svg-icon name="flyRoute-create-add" @click="addStop" />
        <svg-icon
          name="flyRoute-create-delete"
          @click="clearStop"
        />
        <svg-icon
          name="flyRoute-create-reset"
          @click="restStops"
        />
        <svg-icon name="flyRoute-create-save" @click="saveStop" />
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut>
    <template #item-lable>已添站点</template>
    <template #item-content>
      <n-select
        v-model:value="state.selectedAddedStopIndex"
        size="small"
        :options="state.routeStops"
        label-field="stopName"
        value-field="index"
      />
    </template>
  </sm-rowLayOut>

  <div v-show="state.customRouteNames.length > 0">
    <sm-rowLayOut slotType="slider">
      <template #item-lable>飞行路线</template>
      <template #item-content-slider>
        <n-select
          v-model:value="state.customRouteSelectedIndex"
          size="small"
          :options="state.customRouteNames"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut slotType="slider">
      <template #item-lable>站点选择</template>
      <template #item-content-slider>
        <n-select
          v-model:value="state.selectedStopIndex"
          size="small"
          :options="state.currentStopNames"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable></template>
      <template #item-content>
        <n-checkbox v-model:checked="state.showRoute">显示路线</n-checkbox>
        <n-checkbox v-model:checked="state.showStop">显示站点</n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable></template>
      <template #item-content>
        <div class="svgIcons">
          <svg-icon name="flyRoute-start" @click="flyStart" />
          <svg-icon name="flyRoute-pause" @click="flyPause" />
          <svg-icon name="flyRoute-stop" @click="flyStop" />
        </div>
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="downLoad"
          >下载</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clearRoute">清除</n-button>
      </template>
    </sm-btnGroup>
  </div>

  <n-divider />

  <rotate></rotate>
</template>
  
  
  <script lang='ts' setup>
import { watch, reactive, onBeforeUnmount } from "vue";
import { useNotification } from "naive-ui";
import rotate from "./rotate.vue";
import tool from "@/tools/tool";
import createFlyLine_xml from "./fly-line-xml.js";

const notification = useNotification();

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
  selectedAddedStopIndex: null, //自定义已加站点选中索引
  //站点
  setStopName: "Stop-1", //设置当前站点名称
  setStopSpeed: 0, // 设置当前站点速度
  stopPlayMode: "StopPause", //设置站点模式:默认停留
  waitTime: 0, //停留时间
  surroundDuration: 1, //环绕模式时间
  //飞行路线设置
  isAlongline: false, //获取或者设置该飞行路线是否是沿线飞行。
  routeSpeed: 200, //飞行路线速度
  //   allRoutes:[]
});

// 初始化数据
let flyManager: any, routeCollection: any; //创建飞行路线集合对象类
let currentStops: any; //当前路线所有站点集合
let reader = new FileReader();
let createXml: any,
  flyLineXmls: any = []; //创建和保存xml飞行路线文件

initFlyManager();

/**
 * 指定路线分析
 */
//初始化飞行管理
function initFlyManager() {
  routeCollection = new Cesium.RouteCollection(viewer.entities);
  flyManager = new Cesium.FlyManager({
    scene: viewer.scene,
    routes: routeCollection,
  });
  createXml = new createFlyLine_xml();
  if (state.fpfUrl) {
    fpfUrlChange();
  }
}

// 改变默认fpf文件路径触发
function fpfUrlChange() {
  flyManager.stop();
  routeCollection.fromFile(state.fpfUrl);
  flyManager.readyPromise.then(function () {
    let route = flyManager.currentRoute;
    route.isLineVisible = state.showRoute;
    route.isStopVisible = state.showStop;
    updateCurrentStops();
  });
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
//   // 更新当前飞行管理的所有路线(暂不支持路线选择,所有未开放)
//   function updateAllRoutes() {
//       state.allRoutes.length = 0;
//       let allRoutes = routeCollection.routes;
//       for (let i = 0, j = allRoutes.length; i < j; i++) {
//           let route = '飞行路线' + (i + 1);
//           state.allRoutes.push(route)
//       }
//   }

function flyStart() {
  flyManager.readyPromise.then(() => {
    flyManager.play();
  });
}
function flyPause() {
  flyManager && flyManager.pause();
}
function flyStop() {
  flyManager && flyManager.stop();
}

/**
 * 自定义路线分析
 */
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
  state.addCurrentStopIndex++;
  if (state.routeStops.length > 0) {
    let len = state.routeStops.length;
    let lastStopName = state.routeStops[len - 1].stopName;
    let index = lastStopName.split("-")[1] || 1;
    let name = "Stop-" + (Number(index) + 1);
    state.setStopName = name;
  }
  state.selectedAddedStopIndex = state.routeStops.length - 1;
}

// 保存站点
function saveStop() {
  if (state.routeStops.length < 2) {
    notification.create({
      content: () => "节点小于2",
      duration: 3500,
    });
    return;
  }

  state.addCurrentStopIndex = 0;
  state.addCurrentStopIndex = 0;

  // 飞行路线配置
  let index = flyLineXmls.length + 1;
  let route = {
    routeName: "飞行路线_" + index,
    index: state.addCurrentRouteIndex,
    speed: state.routeSpeed,
    isAlongLine: "False",
    routeStops: state.routeStops,
  };
  let xml = createXml.createXMLflyLine(route);
  flyLineXmls.push(xml);
  state.customRouteNames.push({
    label: route.routeName,
    value: route.index,
  });
  state.addCurrentRouteIndex++;
  if (state.customRouteSelectedIndex === null)
    state.customRouteSelectedIndex = 0;
}

// 重置当前路线
function restStops() {
  state.routeStops.length = 0;
  state.setStopName = "Stop-1";
  state.setStopSpeed = 0;
  state.stopPlayMode = "StopPause";
  state.waitTime = 0;
  state.surroundDuration = 1;
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
}

// 清除选中站点
function clearStop() {
  state.routeStops.splice(state.selectedAddedStopIndex, 1);
  if (state.routeStops.length > 0) {
    state.selectedAddedStopIndex = state.routeStops.length - 1;
    return;
  }
  state.selectedAddedStopIndex = null;
  state.setStopName = "Stop-1";
}

// 监听
watch(
  () => state.selectedStopIndex,
  (val) => {
    flyManager && flyManager.stop();
    let index = Number(val);
    let stop = currentStops[index];
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
  () => state.showStop,
  (val) => {
    let route = flyManager.currentRoute;
    if (route) route.isStopVisible = val;
  }
);
watch(
  () => state.fpfUrl,
  (val) => {
    fpfUrlChange();
  }
);

watch(
  () => state.customRouteSelectedIndex,
  (val) => {
    if (val === null) return;
    flyManager && flyManager.stop();
    let route = flyManager.currentRoute;
    if (route) route.clear(); //清除之前的
    routeCollection = new Cesium.RouteCollection(viewer.entities); //飞行路线底层默认第一条路线，所以重新new
    routeCollection.fromXML(flyLineXmls[val]);
    readyPromise();
  }
);

watch(
  () => state.selectedAddedStopIndex,
  (val) => {
    let stop = state.routeStops[val];
    if (!stop) return;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
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

watch(
  () => state.routeType,
  () => {
    notification.create({
      content: () =>
        "调整当前相机位置和视角,以当前相机位置和视角设置站点,点击添加保存此站点",
      duration: 3500,
    });
  }
);

// 销毁
onBeforeUnmount(() => {
  clearRoute();
  flyManager = routeCollection = null;
  currentStops = null;
  createXml = null;
  flyLineXmls = null;
});
</script>
  
<style lang="scss" scoped>
// .svgIcons {
//   display: flex;
//   justify-content: space-between;
//   margin-right: 0.1rem;
// }
</style>
  