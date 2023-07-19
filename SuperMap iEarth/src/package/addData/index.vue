<template>
  <div class="add-data-box" style="overflow-y:hidden">
    <n-tabs type="line" animated justify-content="left" >
      <!-- 公共服务 -->
      <n-tab-pane name="publicService" :tab="$t('global.publicService')">
        <SmLayerService></SmLayerService>
      </n-tab-pane>
      <!-- 我的服务 -->
      <!-- <n-tab-pane name="我的服务" :tab="我的服务">
        <sm-layer-service></sm-layer-service>
      </n-tab-pane> -->
      <!-- 自定义服务 -->
      <n-tab-pane name="customService" :tab="$t('global.customService')">
        <SmLayerCustom></SmLayerCustom>
      </n-tab-pane>
      <!-- 在线底图 -->
      <n-tab-pane name="onlineBaseMap" :tab="$t('global.onlineBaseMap')">
        <SmLayerBase></SmLayerBase>
      </n-tab-pane>
      <!-- 在线地形 -->
      <n-tab-pane name="onlineTerrain" :tab="$t('global.onlineTerrain')">
        <SmLayerTerrain></SmLayerTerrain>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import SmLayerService from "./layer-service/index";
import SmLayerCustom from "./layer-custom/index";
import SmLayerBase from "./layer-base/index";
import SmLayerTerrain from "./layer-terrain/index";

</script>

<style lang="scss" scoped>
.add-data-box {
  width: 100%;
  height: 100%;
  padding: 0 0.01rem 0 0.12rem;
  box-sizing: border-box;
  overflow-y: scroll;
  @include setsSrollbar();
  // :deep(.n-tabs-tab__label) {
  //   color: rgba(255, 255, 255, 0.65);
  // };
}
:deep(.n-tabs-tab-wrapper){
  margin-right:0.16rem;
}
</style>
