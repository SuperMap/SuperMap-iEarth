<template>
  <!-- <div class="panle-container" v-dialogDrag="true"> -->
  <div class="panle-container-add">
    <div class="panle-header-add">
      <span class="panle-title">添加数据</span>
      <div class="panel-close" @click="panelCloseHandle">
        <svg-icon name="ui-close" class="close-btn" />
      </div>
    </div>
    <n-tabs
      type="line"
      animated
      :on-update:value="tabsChange"
      pane-class="panel"
    >
      <!-- 公共服务 -->
      <n-tab-pane name="publicService" :tab="$t('global.publicService')">
        <sm-layer-service></sm-layer-service>
      </n-tab-pane>
      <!-- 我的服务 -->
      <!-- <n-tab-pane name="我的服务" :tab="我的服务">
        <sm-layer-service></sm-layer-service>
      </n-tab-pane> -->
      <!-- 自定义服务 -->
      <n-tab-pane name="customService" :tab="$t('global.customService')">
        <sm-layer-custom></sm-layer-custom>
      </n-tab-pane>
      <!-- 在线底图 -->
      <n-tab-pane name="onlineBaseMap" :tab="$t('global.onlineBaseMap')">
        <sm-layer-base></sm-layer-base>
      </n-tab-pane>
      <!-- 在线地形 -->
      <n-tab-pane name="onlineTerrain" :tab="$t('global.onlineTerrain')">
        <sm-layer-terrain></sm-layer-terrain>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { PanelStoreCreate } from "@/store/panel/panel";
import { ref } from "vue";

import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
const toolBarStore = toolBarStoreCreate();

// 关闭面板
function panelCloseHandle() {
  toolBarStore.setToolBarShow(1, false);
}

function tabsChange() {}
</script>

<style lang="scss" scoped>
.panle-container-add {
  position: fixed;
  top: 0.6rem;
  left: 0.6rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  box-sizing: border-box;
  @include tool-background(
    3.86rem,
    4.94rem,
    "@/assets/imageWeb/panel/addData/addData-normal-bg.png"
  );

  .panle-header-add {
    height: 0.3rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.16rem;

    .panle-title {
      font-size: $--FontSize-Title;
      color: #cae6ff;
      font-weight: bold;
      margin-left: 0.1rem;
    }

    // 关闭按钮位置
    .panel-close {
      margin-left: 0.2rem;
    }

    .close-btn {
      font-size: 0.12rem;
    }
  }
}
</style>