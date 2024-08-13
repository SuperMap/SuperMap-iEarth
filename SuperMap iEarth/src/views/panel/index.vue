<template>
  <div class="too-panel">
    <div class="left-panel" v-if="panelStore.leftTooPanel">
      <!-- 左侧面板header -->
      <div class="panle-header">
        <span
          class="panle-title"
          v-if="panelStore.panelList.leftToolBarList[0].isSelected"
          >{{ $t("t_layerList") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.leftToolBarList[1].isSelected"
          >{{ $t("t_addData") }}</span
        >
        <span class="zst1"></span>
        <span class="zst2"></span>
        <div class="panel-close" @click="panelCloseHandle(1)">
          <i class="iconfont iconguanbi" style="font-size: 0.14rem"></i>
        </div>
      </div>

      <!-- 左侧面板content -->
      <div
        class="panle-container"
        :style="{
          overflowY: panelStore.panelList.leftToolBarList[0].isSelected
            ? 'scroll'
            : 'hidden',
        }"
      >
        <LayerTree
          v-if="panelStore.panelList.leftToolBarList[0].isSelected"
        ></LayerTree>
        <AddLayerData
          v-if="panelStore.panelList.leftToolBarList[1].isSelected"
        ></AddLayerData>
      </div>

      <!-- 左侧面板footer -->
      <div class="panle-footer"></div>
    </div>

    <div class="right-panel" v-if="panelStore.rightTooPanel">
      <!-- 右侧面板header -->
      <div class="panle-header panle-header-right" v-show="!isFold">
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[0].isSelected"
          >{{ $t("t_analyse3d") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[1].isSelected"
          >{{ $t("t_measure") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[2].isSelected"
          >{{ $t("t_sceneProperties") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[3].isSelected"
          >{{ $t("t_objectPainting") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[4].isSelected"
          >{{ $t("layerOpration") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[5].isSelected"
          >{{ $t("layerAttribute") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[6].isSelected"
          >{{ $t("layerStyle") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[7].isSelected"
          >{{ $t("layerQuery") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[8].isSelected"
          >{{ $t("mapQuery") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[9].isSelected"
          >{{ $t("qxSingle") }}</span
        >
        <span
          class="panle-title"
          v-if="panelStore.panelList.rightToolBarList[10].isSelected"
          >{{ $t("qxCover") }}</span
        >
        <span class="zst1"></span>
        <span class="zst2"></span>
        <div class="panel-close">
          <i class="iconfont iconsuoxiao" style="font-size: 0.14rem; margin-right: 0.2rem;" @click="isFold = true" :title="$t('foldPanel')"></i>
          <i class="iconfont iconguanbi" style="font-size: 0.14rem" @click="panelCloseHandle(2)" :title="$t('closePanel')"></i>
        </div>
      </div>

      <!-- 右侧面板header-折叠 -->
      <div class="panel-header-fold">
        <div class="one-tool-bar" v-show="isFold" @click="isFold = false" :title="$t('expandPanel')">
          <span class="icon-container">
            <i class="iconfont iconfanhui" style="font-size: 0.14rem" ></i>
          </span>
        </div>
      </div>

      <!-- 右侧面板content -->
      <div class="panle-container panle-container-right" v-show="!isFold">
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
        <LayerQuery
          v-if="panelStore.panelList.rightToolBarList[7].isSelected"
        ></LayerQuery>
        <MapQuery
          v-if="panelStore.panelList.rightToolBarList[8].isSelected"
        ></MapQuery>
        <QxSingle
          v-if="panelStore.panelList.rightToolBarList[9].isSelected"
        ></QxSingle>
        <QxCover
          v-if="panelStore.panelList.rightToolBarList[10].isSelected"
        ></QxCover>
      </div>

      <!-- 右侧面板footer -->
      <div class="panle-footer panle-footer-right" v-show="!isFold"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 图层列表
import LayerTree from "@/package/layerTree/index";
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
import LayerOpration from "@/package/layerSeries/layer-opration/index";
import LayerAttribute from "@/package/layerSeries/layer-attribute/index";
import LayerStyle from "@/package/layerSeries/layer-style/index";
import LayerQuery from "@/package/layerSeries/layer-query/index";
import MapQuery from "@/package/layerSeries/map-query/index";
import QxSingle from "@/package/layerSeries/qx-single/index";
import QxCover from "@/package/layerSeries/qx-cover/index";

import { storeToRefs } from 'pinia'
import { usePanelStore } from "@/store/index";

const panelStore = usePanelStore();
const { isFold } = storeToRefs(panelStore);

// 关闭弹窗
function panelCloseHandle(leftOrRght: any) {
  panelStore.closeRightToolPanel(leftOrRght);
}
</script>

<style lang="scss" scoped>
.too-panel {
  z-index: 100;
}

.left-panel {
  @include setPanelTitle();
  position: fixed;
  top: 0.75rem;
  left: 0.55rem;
  width: 3.37rem;
}

.right-panel {
  @include setPanelTitle();
  position: fixed;
  top: 0.7rem;
  right: 0.45rem;
  width: 3.38rem;
}

.zst1 {
  @include setBackground(0.45rem, 0.11rem, "@/assets/panelbg/zst1.png");
  position: absolute;
  top: 0rem;
  left: 1.4rem;
}

.zst2 {
  @include setBackground(1.32rem, 0.08rem, "@/assets/panelbg/zst2.png");
  position: absolute;
  top: 0.26rem;
}

.panle-header {
  width: 3.84rem;
  height: 0.43rem;
  padding: 0 0.12rem;
  background: url("@/assets/panelbg/toubu.png") no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.panle-container {
  @include setsSrollbar();
  width: 3.84rem;
  height: auto;
  max-height: 6.6rem;
  background: url("@/assets/panelbg/zhongjian.png");
  background-size: 100% 100%;
  box-sizing: border-box;
}

.panle-footer {
  width: 3.84rem;
  height: 0.24rem;
  background: url("@/assets/panelbg/weibu.png") no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.panle-header-right {
  width: 3.36rem;
}

.panle-container-right {
  width: 3.36rem;
}

.panle-footer-right {
  width: 3.36rem;
}

// 展开面板图标定位和背景
.panel-header-fold {
  position: relative;
  left: 3rem;
  top: 0.1rem;

  .one-tool-bar {
    @include setBackground(0.32rem,
      0.32rem,
      "@/assets/images/right-tool-one-bar.png"
    );

    .icon-container {
      display: block;
      width: 100%;
      height: 0.32rem;
      @include flexLayout(center);
      @include setIconstyle();
    }
  }
}
</style>
