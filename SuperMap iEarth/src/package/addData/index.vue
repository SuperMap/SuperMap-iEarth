<template>
  <div class="add-data-box">
    <n-tabs type="line" animated>
      <!-- 公共服务 -->
      <n-tab-pane name="publicService" tab="公共服务">
        <SmLayerService></SmLayerService>
      </n-tab-pane>
      <!-- 我的服务 -->
      <!-- <n-tab-pane name="我的服务" :tab="我的服务">
        <sm-layer-service></sm-layer-service>
      </n-tab-pane> -->
      <!-- 自定义服务 -->
      <n-tab-pane name="customService" tab="自定义服务">
        <SmLayerCustom></SmLayerCustom>
      </n-tab-pane>
      <!-- 在线底图 -->
      <n-tab-pane name="onlineBaseMap" tab="在线底图">
        <SmLayerBase></SmLayerBase>
      </n-tab-pane>
      <!-- 在线地形 -->
      <n-tab-pane name="onlineTerrain" tab="在线地形">
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
  padding: 0 0.12rem;
  box-sizing: border-box;
  overflow-y: scroll;
  @include setsSrollbar();
}
</style>
