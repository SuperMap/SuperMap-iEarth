<template>
  <!-- 选择本地飞行路线文件 -->
  <div class="row-wrap">
    <div class="label"> {{ $t("flyRoute") }} </div>
    <div class="content">
      <n-input-group>
        <n-input v-model:value="state.fileSrc" :placeholder="$t('localFilePathFly')" />
        <n-button @click="chooseFile" type="tertiary">{{
        $t("import")
        }}</n-button>
      </n-input-group>
    </div>
  </div>

  <!-- 显示路线 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.showRoute" :label="$t('displayRoute')" />
    </div>
  </div>

  <!-- 显示站点 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.showStop" :label="$t('displayStation')" />
    </div>
  </div>

  <!-- 操作按钮 -->
  <div class="row-wrap">
    <div class="content">
      <div class="icon-list-box">
          <span v-for="(item, index) in state.actionOptions" :key="index" class="icon-span" :title="item.lable"
            :class="item.isSelect ? 'selected-icon' : ''" @click="changleIconItem(item)">
            <i class="iconfont iconSize" :class="item.iconName" style="margin-top: 0px"></i>
          </span>
        </div>
    </div>
  </div>

  <!-- 空间模式 -->
  <div class="row-wrap" v-show="state.isExistRoute">
    <div class="label">{{ $t("selectStation") }}</div>
    <div class="content">
      <n-select v-model:value="state.selectedStopIndex" :options="state.currentStopNames" />
      <!-- @update:value="handleStopUpdate" -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount, watch, reactive, onMounted } from "vue";
import tool from "@/tools/tool";

type stateType = {
  fileSrc: string; //文件地址
  isExistRoute: boolean; // 是否存在路径
  selectedStopIndex: number; //选中当前站点
  showRoute: boolean; //显示路线
  showStop: boolean; //显示站点
  currentStopNames: any[]; //当前路线的站点名称集合
  actionOptions: any[]; // 操作选项
};

// 初始化变量
let state = reactive<stateType>({
  fileSrc: "", //文件地址
  isExistRoute: false,
  selectedStopIndex: 0, //选中当前站点
  showRoute: false, //显示路线
  showStop: false, //显示站点
  currentStopNames: [], //当前路线的站点名称集合
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

let flyManager: any, routeCollection: any; //创建飞行路线集合对象类
let currentStops; //当前路线所有站点集合
let reader = new FileReader();

function init() {
  if (!window.viewer) return;
  initFlyManager();
}

onMounted(() => {
  init();
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

// 操作切换
function changleIconItem(item: any) {
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
}

// 点击选择文件函数
async function chooseFile() {
  const file: any = await tool.openLocalFile('.fpf', true);
  if (!file || !(file instanceof File)) return;

  state.fileSrc = file.name;

  flyManager.stop();
  let route = flyManager.currentRoute;
  if (route) route.clear(); //清除之前的
  routeCollection = new SuperMap3D.RouteCollection(viewer.entities); //飞行路线底层默认第一条路线，所以重新new

  reader.onload = function (e: any) {
    // 读取操作完成时出发
    let XMLContent = e.target.result;
    routeCollection.fromXML(XMLContent);
  };
  reader.readAsBinaryString(file);
  readyPromise();
}

// 异步飞行管理准备就绪函数
function readyPromise() {
  routeCollection.readyPromise.then(() => {
    if (routeCollection._routes.length > 0) {
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

// 站点切换
function handleStopUpdate() {
  let val = state.selectedStopIndex
  flyManager && flyManager.stop();
  let index = Number(val);
  let stop = currentStops[index];
  flyManager.viewToStop(stop);
}

// 监听
watch(
  () => state.selectedStopIndex,
  (val) => {
    // flyManager && flyManager.stop();
    // let index = Number(val);
    // let stop = currentStops[index];
    // flyManager.viewToStop(stop);
    handleStopUpdate();

    // 支持从选中的站点开始飞行
    if(flyManager) flyManager.currentStopIndex = Number(val); 
    flyStop(); // 停止当前飞行，从头开始
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
</script>