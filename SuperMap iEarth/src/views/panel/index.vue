<template>
  <div class="too-panel">
    <div class="left-panel" v-if="panelStore.leftTooPanel">
      <div class="panle-header">
        <span class="panle-title" v-if="panelStore.panelList.leftToolBarList[0].isSelected">{{$t('global.t_layerList')}}</span>
        <span class="panle-title" v-if="panelStore.panelList.leftToolBarList[1].isSelected">{{$t('global.t_addData')}}</span>
        <span class="zst1"></span>
        <span class="zst2"></span>
        <div class="panel-close" @click="panelCloseHandle(1)">
          <i class="iconfont iconguanbi"></i>
        </div>
      </div>
      <div class="panle-container" :style="{overflowY: panelStore.panelList.leftToolBarList[0].isSelected? 'scroll':'hidden'}">
        <LayerList
          v-if="panelStore.panelList.leftToolBarList[0].isSelected"
        ></LayerList>
        <AddLayerData
          v-if="panelStore.panelList.leftToolBarList[1].isSelected"
        ></AddLayerData>
      </div>
      <div class="panle-footer"></div>
    </div>
    <div class="right-panel" v-if="panelStore.rightTooPanel">
      <div class="panle-header">
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[0].isSelected"
          >{{ $t('global.t_analyse3d') }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[1].isSelected"
          >{{ $t('global.t_measure') }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[2].isSelected"
          >{{ $t('global.t_sceneProperties') }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[3].isSelected"
          >{{ $t('global.t_objectPainting') }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[4].isSelected"
          >{{ $t('global.layerOpration') }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[5].isSelected"
          >{{ $t('global.layerAttribute') }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[6].isSelected"
          >{{ $t('global.layerStyle') }}</span
        >
        <span class="zst1"></span>
        <span class="zst2"></span>
        <div class="panel-close" @click="panelCloseHandle(2)">
          <i class="iconfont iconguanbi"></i>
        </div>
      </div>
      <div class="panle-container">
        <!-- <component :is="comName"></component>s -->
        <Analyse3D
          v-if="panelStore.panelList.rightToolBarList[0].isSelected"
        ></Analyse3D>
        <Measure
          v-if="panelStore.panelList.rightToolBarList[1].isSelected"
        ></Measure>
        <SceneSet
          v-if="panelStore.panelList.rightToolBarList[2].isSelected"
        ></SceneSet>
        <ObjectPainting
          v-if="panelStore.panelList.rightToolBarList[3].isSelected"
        ></ObjectPainting>
        
        <LayerOpration
          v-if="panelStore.panelList.rightToolBarList[4].isSelected"
        ></LayerOpration>
        <LayerAttribute
          v-if="panelStore.panelList.rightToolBarList[5].isSelected"
        ></LayerAttribute>
        <LayerStyle
          v-if="panelStore.panelList.rightToolBarList[6].isSelected"
        ></LayerStyle>
      </div>
      <div class="panle-footer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 图层列表
import LayerList from "@/package/layerList/index";
// 添加服务
import AddLayerData from "@/package/addData/index";
// 三维分析
import Analyse3D from "@/package/analyse3d/index";
// 量算
import Measure from "@/package/measure/index";
// 场景属性
import SceneSet from "@/package/sceneSet/index";
// 对象绘制
import ObjectPainting from "@/package/objectPainting/index";


// 图层系列操作
import LayerOpration from "@/package/layerSeries/layerOpration/index";
import LayerAttribute from "@/package/layerSeries/layerAttribute/index";
import LayerStyle from "@/package/layerSeries/layerStyle/index";

import { usePanelStore } from "@/store/index";

const panelStore = usePanelStore();

// 关闭弹窗
function panelCloseHandle(leftOrRght: any) {
  panelStore.closeRightToolPanel(leftOrRght);
}
</script>

<style lang="scss" scoped>
.left-panel {
  width: 3.38rem;
  @include setPanelTitle();
  position: fixed;
  z-index: 2;
  top: 0.6rem;
  left: 0.6rem;
}
.right-panel {
  width: 3.38rem;
  @include setPanelTitle();
  position: fixed;
  z-index: 2;
  top: 0.6rem;
  right: 0.6rem;
}
.zst1 {
  position: absolute;
  top: 0rem;
  left: 1.4rem;
  @include setBackground(0.44rem, 0.11rem, "@/assets/panelbg/zst1.png");
}
.zst2 {
  position: absolute;
  top: 0.26rem;
  @include setBackground(1.32rem, 0.08rem, "@/assets/panelbg/zst2.png");
}
.panle-header {
  width: 3.38rem;
  height: 0.43rem;
  background: url("@/assets/panelbg/toubu.png") no-repeat;
  background-size: 100% 100%;
  padding: 0 0.12rem;
  box-sizing: border-box;
}
.panle-container {
  // padding: 2px 0px;
  width: 3.38rem;
  height: auto;
  background: url("@/assets/panelbg/zhongjian.png");
  background-size: 100% 100%;
  max-height: 6.6rem;
  // overflow-y: scroll;
  @include setsSrollbar();
}
.panle-footer {
  width: 3.38rem;
  height: 0.24rem;
  background: url("@/assets/panelbg/weibu.png") no-repeat;
  background-size: 100% 100%;
}
</style>