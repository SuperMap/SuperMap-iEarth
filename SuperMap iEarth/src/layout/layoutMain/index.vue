<template>
  <n-layout-content>
    <!-- <n-spin> -->
      <layout-left-sider></layout-left-sider>
      <viewer></viewer>
      <layout-right-sider></layout-right-sider>
      <panel></panel>
    <!-- </n-spin> -->
  </n-layout-content>
</template>

<script setup lang="ts">
import Viewer from "@/views/viewer/index";
import LayoutLeftSider from "@/layout/layoutMain/components/layoutLeftSider/index";
import LayoutRightSider from "@/layout/layoutMain/components/layoutRightSider/index";
import Panel from "@/views/panel/index";

</script>

<style lang="scss" scoped></style>