<template>
  <n-layout has-sider position="absolute">
    <n-layout>
      <!-- header 页头 -->
      <layout-header></layout-header>
      <!-- 左侧工具栏 -->
      <tool-bar></tool-bar>
      <!-- 右侧控件列表 -->
      <widget></widget>
      <!-- 地球场景容器（组件） -->
      <sm-viewer></sm-viewer>
      <!-- iprotal保存面板 -->
      <sm-scene-save></sm-scene-save>
      <div class="footer"></div>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { loadAsyncComponent } from "@/utils";
import { GlobalStoreCreate } from "@/store/global/global";
import { storeToRefs } from "pinia";

const GlobalStore = GlobalStoreCreate();
const { headerFold } = storeToRefs(GlobalStore);

// 页头
const LayoutHeader = loadAsyncComponent(() => import("./header/index.vue"));

// 左侧工具栏，右侧Cesium控件 - 异步加载组件
const toolBar = loadAsyncComponent(() => import("./toolBar/toolBar.vue"));
const widget = loadAsyncComponent(() => import("./widget/widget.vue"));
</script>

<style lang="scss" scoped>
.content-container {
  height: 90%;
}
.footer {
  position: fixed;
  bottom: 1px;

  // @include setBackgroundByImg(
  //   "@/assets/imageWeb/footer/footer-bg.png",
  //   100%,
  //   0.17rem
  // );
  @include tool-background(
    100%,
    0.17rem,
    "@/assets/imageWeb/footer/footer-bg.png"
  );
}
</style>
