<template>
  <div class="too-panel">

    <!-- 左侧面板 -->
    <div class="left-panel" v-if="panelStore.leftTooPanel">
      <!-- header -->
      <div class="panle-header">
        <span class="panle-title">{{ $t(leftPanleTitle) }}</span>
        <span class="zst1"></span>
        <span class="zst2"></span>
        <div class="panel-close" @click="panelCloseHandle(1)">
          <i class="iconfont iconguanbi" style="font-size: 0.14rem"></i>
        </div>
      </div>

      <!-- content -->
      <div
        class="panle-container"
        :style="{
          overflowY: panelStore.panelList.leftToolBarList[0].isSelected
            ? 'scroll'
            : 'hidden',
        }"
      >
        <component :is="currentLeftCom"></component>
      </div>

      <!-- footer -->
      <div class="panle-footer"></div>
    </div>

    <!-- 右侧面板 -->
    <div class="right-panel" v-if="panelStore.rightToolPanel">
      <!-- header -->
      <div class="panle-header panle-header-right" v-show="!isFold">
        <span class="panle-title">{{ $t(rightPanleTitle) }}</span>
        <span class="zst1"></span>
        <span class="zst2"></span>
        <div class="panel-close">
          <i class="iconfont iconsuoxiao" style="font-size: 0.14rem; margin-right: 0.2rem;" @click="isFold = true" :title="$t('foldPanel')"></i>
          <i class="iconfont iconguanbi" style="font-size: 0.14rem" @click="panelCloseHandle(2)" :title="$t('closePanel')"></i>
        </div>
      </div>

      <!-- header-折叠 -->
      <div class="panel-header-fold">
        <div class="one-tool-bar" v-show="isFold" @click="isFold = false" :title="$t('expandPanel')">
          <span class="icon-container">
            <i class="iconfont iconfanhui" style="font-size: 0.14rem" ></i>
          </span>
        </div>
      </div>

      <!-- content -->
      <div class="panle-container panle-container-right" v-show="!isFold">
        <component :is="currentRightCom"></component>
      </div>

      <!-- footer -->
      <div class="panle-footer panle-footer-right" v-show="!isFold"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 左侧面板
import LayerTree from "@/package/layerTree/index";
import AddData from "@/package/addData/index";

// 右侧面板
import Analyse3D from "@/package/analyse3d/index";
import Measure from "@/package/measure/index";
import SceneSet from "@/package/sceneSet/index";
import ObjectPainting from "@/package/objectPainting/index";
import QuerySeries from "@/package/querySeries/index";

// 图层系列操作
import LayerOpration from "@/package/layerSeries/layer-opration/index";
import LayerAttribute from "@/package/layerSeries/layer-attribute/index";
import LayerStyle from "@/package/layerSeries/layer-style/index";
import LayerQuery from "@/package/layerSeries/layer-query/index";
import MapQuery from "@/package/layerSeries/map-query/index";
import QxSingle from "@/package/layerSeries/qx-single/index";
import QxCover from "@/package/layerSeries/qx-cover/index";
import MvtStyle from "@/package/layerSeries/mvt-style/index";
import LayerTheme from "@/package/layerSeries/layer-theme/index";

import { storeToRefs } from 'pinia'
import { usePanelStore } from "@/store/index";
import { reactive, markRaw, computed } from "vue";
import { PanelNameEnum } from "@/enums/layerEnum";

const panelStore = usePanelStore();
const { isFold } = storeToRefs(panelStore);

// 关闭弹窗
function panelCloseHandle(leftOrRght: any) {
  panelStore.closeRightToolPanel(leftOrRght);
}

// 左侧面板标题
const leftPanleTitle = computed(() => {
  const target = panelStore.panelList.leftToolBarList.find(item => item.isSelected)
  return target ? target.title : "";
});

// 右侧面板标题
const rightPanleTitle = computed(() => {
  const target = panelStore.panelList.rightToolBarList.find(item => item.isSelected)
  return target ? target.title : "";
});


// 左侧面板组件列表
const comLeftList = reactive([
  {
    name: PanelNameEnum.LayerTree,
    com: markRaw(LayerTree)
  },
  {
    name: PanelNameEnum.AddData,
    com: markRaw(AddData)
  }
]);

// 右侧面板组件列表
const comRightList = reactive([
  {
    name: PanelNameEnum.Analyse3D,
    com: markRaw(Analyse3D)
  },
  {
    name: PanelNameEnum.Measure,
    com: markRaw(Measure)
  },
  {
    name: PanelNameEnum.SceneSet,
    com: markRaw(SceneSet)
  },
  {
    name: PanelNameEnum.ObjectPainting,
    com: markRaw(ObjectPainting)
  },
  {
    name: PanelNameEnum.QuerySeries,
    com: markRaw(QuerySeries)
  },
  {
    name: PanelNameEnum.LayerOpration,
    com: markRaw(LayerOpration)
  },
  {
    name: PanelNameEnum.LayerAttribute,
    com: markRaw(LayerAttribute)
  },
  {
    name: PanelNameEnum.LayerStyle,
    com: markRaw(LayerStyle)
  },
  {
    name: PanelNameEnum.LayerQuery,
    com: markRaw(LayerQuery)
  },
  {
    name: PanelNameEnum.ImageMapQuery,
    com: markRaw(MapQuery)
  },
  {
    name: PanelNameEnum.QXSingle,
    com: markRaw(QxSingle)
  },
  {
    name: PanelNameEnum.ImageMapCover,
    com: markRaw(QxCover)
  },
  {
    name: PanelNameEnum.MVTStyle,
    com: markRaw(MvtStyle)
  },
  {
    name: PanelNameEnum.LayerTheme,
    com: markRaw(LayerTheme)
  },
]);

// 计算左侧面板当前组件
const currentLeftCom = computed(() => {
  const targetItem = panelStore.panelList.leftToolBarList.find(item => item.isSelected)
  if(!targetItem) return;
  const targetCom = comLeftList.find(item => item.name === targetItem.id)
  if(targetCom) return targetCom.com;
});

// 计算右侧面板当前组件
const currentRightCom = computed(() => {
  const targetItem = panelStore.panelList.rightToolBarList.find(item => item.isSelected)
  if(!targetItem) return;
  const targetCom = comRightList.find(item => item.name === targetItem.id)
  if(targetCom) return targetCom.com;
});

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

.left-panel .zst1 {
  @include setBackground(0.45rem, 0.11rem, "@/assets/panelbg/zst1.png");
  position: absolute;
  top: 0rem;
  left: 1.6rem;
}
.right-panel .zst1 {
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
