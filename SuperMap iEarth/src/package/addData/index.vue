<template>
  <div class="right-panel-container" style="overflow-y: hidden">
    <n-tabs type="line" animated justify-content="left">
      <!-- 公共服务 -->
      <n-tab-pane name="publicService" :tab="$t('publicService')">
        <SmLayerService></SmLayerService>
      </n-tab-pane>
      <!-- 自定义服务 -->
      <n-tab-pane name="customService" :tab="$t('customService')">
        <SmLayerCustom></SmLayerCustom>
      </n-tab-pane>
      <!-- 在线底图 -->
      <n-tab-pane name="onlineBaseMap" :tab="$t('onlineBaseMap')">
        <SmLayerBase></SmLayerBase>
      </n-tab-pane>
      <!-- 在线地形 -->
      <n-tab-pane name="onlineTerrain" :tab="$t('onlineTerrain')">
        <SmLayerTerrain></SmLayerTerrain>
      </n-tab-pane>
      <!-- 我的服务 -->
      <n-tab-pane
        name="portalService"
        :tab="$t('portalService')"
        v-if="IportalStore.isLogin"
      >
        <SmPortalService></SmPortalService>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { IportalStoreCreate } from "@/store/iportalManage/index";
import SmLayerService from "./layer-service/index";
import SmLayerCustom from "./layer-custom/index";
import SmLayerBase from "./layer-base/index";
import SmLayerTerrain from "./layer-terrain/index";
import SmPortalService from "./layer-mine/index";

const IportalStore = IportalStoreCreate();
</script>