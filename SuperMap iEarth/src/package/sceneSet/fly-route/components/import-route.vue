<template>
      <div class="row-item">
      <span>{{$t('global.flyRoute')}}</span>
        <div class="row-content">
          <n-input-group>
            <n-input
              class="add-input-border"
              size="medium"
              style="width: 2.0 rem;"
              :placeholder="$t('global.localFilePathFly')"
              v-model:value="state.fileSrc"
            />
            <n-button type="tertiary"  @click="chooseFile">{{$t('global.import')}}</n-button>
            <input
              type="file"
              accept=".fpf"
              id="flyFile"
              style="display: none"
              ref="flyFile_dom"
            />
          </n-input-group>
        </div>
    </div>

    <div class="row-item">
      <span></span>
        <div class="row-content">
          <n-checkbox v-model:checked="state.showRoute">{{$t('global.displayRoute')}}</n-checkbox>
          <n-checkbox v-model:checked="state.showStop">{{$t('global.displayStation')}}</n-checkbox>
        </div>
    </div>
    <div class="row-item">
      <span></span>
      <div class="icon-container">
        <div class="icon-list" >
          <span
            v-for="(item, index) in state.actionOptions"
            :key="index"
            class="icon-span"
            :title="item.lable"
            :class="item.isSelect ? 'selected-icon' : ''"
            @click="changleIconItem(item)"
          >
            <i class="iconfont iconSize" :class="item.iconName"  style="margin-top:0px"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="row-item" v-show="state.isExistRoute">
      <span>{{$t('global.selectStation')}}</span>
        <div class="row-content">
          <n-select
            v-model:value="state.selectedStopIndex"
            :options="state.currentStopNames"
          />
        </div>
    </div>
    <n-divider />

    <rotate></rotate>
</template>
  
  
<script lang="ts" setup>
import { ref, onBeforeUnmount, watch, reactive, onMounted } from "vue";
import rotate from "./rotate.vue";

type stateType = {
  fileSrc: string; //文件地址
  isExistRoute:boolean,// 是否存在路径
  selectedStopIndex: number; //选中当前站点
  showRoute: boolean; //显示路线
  showStop: boolean; //显示站点
  currentStopNames: any[]; //当前路线的站点名称集合
  actionOptions: any[]; // 操作选项
};

// 初始化数据
let state = reactive<stateType>({
  fileSrc: "", //文件地址
  isExistRoute:false,
  selectedStopIndex: 0, //选中当前站点
  showRoute: false, //显示路线
  showStop: false, //显示站点
  currentStopNames: [], //当前路线的站点名称集合
  actionOptions: [
    {
      index: 1,
      lable: GlobalLang.play,
      iconName: "iconbofang",
      isSelect: false,
    },
    {
      index: 2,
      lable: GlobalLang.pause,
      iconName: "iconzanting",
      isSelect: false,
    },
    {
      index: 3,
      lable: GlobalLang.stop,
      iconName: "icontingzhi",
      isSelect: false,
    }
  ],
});
let flyManager: any, routeCollection: any; //创建飞行路线集合对象类
let flyFile_dom = ref();
let currentStops; //当前路线所有站点集合
let reader = new FileReader();

init();
function init() {
  if (!window.viewer) return;
  initFlyManager();
}

// 操作切换
function changleIconItem(item:any){
  state.actionOptions.map((itemObj) => {
    if (itemObj.index == item.index) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });

  switch(item.index){
    case 1:{
      flyStart();
      break;
    }
    case 2:{
      flyPause();
      break;
    }
    case 3:{
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
    routeCollection = new SuperMap3D.RouteCollection(viewer.entities); //飞行路线底层默认第一条路线，所以重新new
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
    if(routeCollection._routes.length>0){
      state.isExistRoute = true;
    }
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

// 开始飞行
function flyStart() {
  flyManager.readyPromise.then(() => {
    flyManager.play();
  });
}
// 暂停
function flyPause() {
  flyManager && flyManager.pause();
}
// 停止
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

</style>
  
  
  
  
  
  
  
  
  
  