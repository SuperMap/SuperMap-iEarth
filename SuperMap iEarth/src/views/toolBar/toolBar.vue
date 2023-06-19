<template>
  <div class="left-tool-bar">
    <div
      class="btn-bar"
      v-for="item in toolBarStore.leftToolBarData"
      :key="item.id"
      @click="leftSiderHander(item.id)"
      :class="
        item.id === state.currentItemIndex && item.isShow ? 'tool-item-bg' : ''
      "
      :title="$t(item.title)"
    >
      <svg-icon :name="item.iconName" class="btn-icon" />
    </div>

    <!-- 图层列表 -->
    <div v-if="toolBarStore.leftToolBarData[0].isShow">
      <layer-list></layer-list>
    </div>
    <!-- 添加数据 -->
    <div v-if="toolBarStore.leftToolBarData[1].isShow">
      <add-data></add-data>
    </div>
    <!-- 三维分析 -->
    <div v-if="toolBarStore.rightToolBarData[0].isShow">
      <analyse-series></analyse-series>
    </div>
    <!-- 量算 -->
    <div v-if="toolBarStore.rightToolBarData[1].isShow">
      <measure-calculate></measure-calculate>
    </div>
    <!-- 场景属性 -->
    <div v-if="toolBarStore.rightToolBarData[2].isShow">
      <scene-properties></scene-properties>
    </div>
    <!-- 对象绘制 -->
    <div v-if="toolBarStore.rightToolBarData[3].isShow">
      <object-painting></object-painting>
    </div>

    <!-- toolbar右侧每个项目的操作面板 -->
    <!-- <panel-content></panel-content> -->
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { OptionType } from "./type";
import { loadAsyncComponent } from "@/utils";
import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
import { PanelStoreCreate } from "@/store/panel/panel";
import { GlobalStoreCreate } from "@/store/global/global";

// 图层列表
const layerList = loadAsyncComponent(
  () => import("../panel/layerList/index.vue")
);
// 添加数据
const addData = loadAsyncComponent(() => import("../panel/addData/index.vue"));
// 三维分析
const analyseSeries = loadAsyncComponent(
  () => import("../panel/analyseSeries/index.vue")
);
// 量算
const measureCalculate = loadAsyncComponent(
  () => import("../panel/measureCalculate/index.vue")
);
// 场景属性
const sceneProperties = loadAsyncComponent(
  () => import("../panel/sceneProperties/index.vue")
);
// 对象绘制
const objectPainting = loadAsyncComponent(
  () => import("../panel/objectPainting/index.vue")
);

// 获取来自store仓库里面的数据
const toolBarStore = toolBarStoreCreate();
const panelStore = PanelStoreCreate();
const GlobalStore = GlobalStoreCreate();
// const { currentLanguage } = storeToRefs(GlobalStore);
// const { toolShow, leftToolBarData, showToolBarData } =
//   storeToRefs(toolBarStore);
// const { panelBgName } = storeToRefs(panelStore);

// state类型定义
type toolbarType = {
  itemID: number | string;
  currentItemIndex: number;
  layerTreeShow: boolean;
  addDATAShow: boolean;
};

// 初始化默认数据
let state = reactive<toolbarType>({
  itemID: 0,
  currentItemIndex: -1,
  layerTreeShow: false,
  addDATAShow: false,
});

// 每个item的点击事件:切换动态组件；当为图层列表时还需改变SceneLayerChangeCount，以便刷新layerTree
// function leftSiderHander(item: OptionType, index: number) {
//   // state.currentItemIndex = index;
//   // if (item.name === "layerList") {
//   //   GlobalStore.SceneLayerChangeCount++;
//   //   // state.layerTreeShow = !state.layerTreeShow;
//   //   state.layerTreeShow = true;
//   //   state.addDATAShow = false;
//   //   return;
//   // }
//   // if (item.name === "addData") {
//   //   state.layerTreeShow = false;
//   //   state.addDATAShow = true;
//   // }
//   // panelBgName.value = item.name;
//   // panelStore.currentComponenentName = item.name;
//   // panelStore.panelShow = true;
//   // state.itemID = item.id;
// }

// 当切换语言时，通过v-if实现强制刷新图层树组件
// watch(currentLanguage, (val) => {
//   state.layerTreeShow = !state.layerTreeShow;
//   if (val) {
//     setTimeout(() => {
//       state.layerTreeShow = !state.layerTreeShow;
//     }, 100);
//   }
// });

// ------------------ 以下为新的逻辑
function leftSiderHander(id: any) {
  state.currentItemIndex = id;
  toolBarStore.setToolBarShow(id, true);
}
</script>

<style lang="scss" scoped>
// 工具栏位置
.left-tool-bar {
  position: fixed;
  top: 0.6rem;
  left: 0.16rem;
  z-index: $--Z-Index-Normal;
  @include tool-background(
    0.32rem,
    0.76rem,
    "@/assets/imageWeb/toolbar/tool-bg.png"
  );

  .btn-bar {
    width: 100%;
    height: 0.36rem;
    @include flexLayout(center);

    .btn-icon {
      font-size: 0.14rem;
    }
  }

  .tool-item-bg {
    @include tool-background(
      0.32rem,
      0.36rem,
      "@/assets/imageWeb/toolbar/item-checked-bg.png"
    );
  }
}
</style>