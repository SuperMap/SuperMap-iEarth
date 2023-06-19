<template>
  <n-space vertical>
    <sm-rowLayOut>
      <template #item-lable>飞行路线</template>
      <template #item-content>
        <n-input-group>
          <n-input
            size="small"
            :placeholder="locale.FlightRouteAddress"
            v-model:value="state.fileSrc"
          />
          <n-button type="primary" size="small" @click="chooseFile">{{
            locale.Folder
          }}</n-button>
          <input
            type="file"
            accept=".fpf"
            id="flyFile"
            style="display: none"
            ref="flyFile_dom"
          />
        </n-input-group>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable></template>
      <template #item-content>
        <n-checkbox v-model:checked="state.showRoute">{{
          locale.ShowRoute
        }}</n-checkbox>
        <n-checkbox v-model:checked="state.showStop">{{
          locale.ShowStop
        }}</n-checkbox>
      </template>
    </sm-rowLayOut>


    <div class="icon-container">
      <div class="icon-list">
        <span
          v-for="(line, index) in state.itemOptions"
          :key="index"
          :title="line.name"
          class="icon-span"
        >
          <!-- :class="{ 'selected-icon': index === state.selectedId }" -->
          <svg-icon :name="line.iconName" class="icon-size" />
        </span>
      </div>
    </div>

    <sm-rowLayOut>
      <template #item-lable>站点选择</template>
      <template #item-content>
        <n-select
          size="small"
          v-model:value="state.selectedStopIndex"
          :options="state.currentStopNames"
        />
      </template>
    </sm-rowLayOut>

    <n-divider />

    <rotate></rotate>
  </n-space>
</template>
  
<script lang="ts" setup>
import { ref, onBeforeUnmount, watch, reactive, onMounted } from "vue";
import rotate from "./rotate.vue";
import locale from "@/tools/locateTemp";

type stateType = {
  fileSrc: string; //文件地址
  selectedStopIndex: number; //选中当前站点
  showRoute: boolean; //显示路线
  showStop: boolean; //显示站点
  currentStopNames: any[]; //当前路线的站点名称集合
  itemOptions: any[];
};

// 初始化数据
let state = reactive<stateType>({
  fileSrc: "", //文件地址
  selectedStopIndex: 0, //选中当前站点
  showRoute: false, //显示路线
  showStop: false, //显示站点
  currentStopNames: [], //当前路线的站点名称集合
  itemOptions: [
    {
      index: 1,
      lable: "",
      iconName: "flyRoute-start",
      selectedId: 0,
    },
    {
      index: 2,
      lable: "",
      iconName: "flyRoute-pause",
      selectedId: 0,
    },
    {
      index: 3,
      lable: "",
      iconName: "flyRoute-stop",
      selectedId: 0,
    },
  ],
});
let flyManager: any, routeCollection: any; //创建飞行路线集合对象类
let flyFile_dom = ref();
let currentStops; //当前路线所有站点集合
let reader = new FileReader();

function init() {
  if (!window.viewer) return;
  initFlyManager();
}

init();

/*
 * 飞行路线
 */
//初始化飞行管理
function initFlyManager() {
  routeCollection = new Cesium.RouteCollection(viewer.entities);
  flyManager = new Cesium.FlyManager({
    scene: viewer.scene,
    routes: routeCollection,
  });
}
// 点击选择文件函数
function chooseFile() {
  flyFile_dom.value.click();
}

//文件夹改变文件触发
function fileChange() {
  flyFile_dom.value.addEventListener("change", (evt) => {
    flyManager.stop();
    let route = flyManager.currentRoute;
    if (route) route.clear(); //清除之前的
    routeCollection = new Cesium.RouteCollection(viewer.entities); //飞行路线底层默认第一条路线，所以重新new
    let file = evt.target.files[0];
    if (!file) return;
    state.fileSrc = flyFile_dom.value.value;
    reader.onload = function (e: any) {
      // 读取操作完成时出发
      let XMLContent = e.target.result;
      routeCollection.fromXML(XMLContent);
    };
    reader.readAsBinaryString(file);
    readyPromise();
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
  for (let i = 0, j = currentStops.length; i < j; i++) {
    let stopName = currentStops[i].stopName || "Stop" + (i + 1);
    let stopObj = {
      label: stopName,
      value: i,
    };
    state.currentStopNames.push(stopObj);
  }
}
// 更新当前飞行管理的所有路线(暂不支持路线选择,所有未开放)
// function updateAllRoutes() {
//     state.allRoutes.length = 0;
//     let allRoutes = routeCollection.routes;
//     for (let i = 0, j = allRoutes.length; i < j; i++) {
//         let route = "飞行路线" + (i + 1);
//         state.allRoutes.push(route);
//     }
// }

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
onMounted(() => {
  fileChange();
});

// 销毁
onBeforeUnmount(() => {
  let route = flyManager.currentRoute;
  if (route) {
    route.isLineVisible = false;
    route.isStopVisible = false;
  }

  flyManager = null;
  routeCollection = null;
  currentStops = null;
});
</script>
  
  
<style lang="scss" scoped>
@include iconContainer(0.98rem);
</style>
  
  
  
  
  
  
  
  
  
  