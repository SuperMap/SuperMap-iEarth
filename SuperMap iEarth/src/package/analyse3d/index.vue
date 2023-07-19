<template>
  <!-- 三维分析 -->
  <div class="analyse-tab">
    <div
      class="analyse-tab-items"
      :class="item.isSelected ? 'select-bg' : ''"
      v-for="item in analyseList"
      @click="changeItem(item)"
      :key="item.id"
      :title="item.title"
    >
      <i class="iconfont" :class="item.iconName" style="font-size: 18px"></i>
    </div>
  </div>

  <!-- 三维分析组件 -->
  <keep-alive>
    <component :is="currentComponent"></component>
  </keep-alive>
</template>

<script lang="ts" setup>
import { ref, reactive, markRaw, watch, computed } from "vue";
import { usePanelStore } from "@/store/index";
import Analyse from "./analyse/index";
import Clip from "./clip/index";
import Terrain from "./terrain/index";

const panelStore = usePanelStore();

let analyseList = ref([
  {
    id: 1,
    iconName: "iconkongjianfenxi",
    title: GlobalLang.spatialAnalysis,
    isSelected: true,
    componentName: markRaw(Analyse),
  },
  {
    id: 2,
    iconName: "iconjianqie",
    title: GlobalLang.clip,
    isSelected: false,
    componentName: markRaw(Clip),
  },
  {
    id: 3,
    iconName: "icondixing",
    title: GlobalLang.terrainOperation,
    isSelected: false,
    componentName: markRaw(Terrain),
  },
]);

let currentComponent = ref(markRaw(Analyse));
// 关闭面板
function panelCloseHandle() {}
//
function changeItem(iconItem: any) {
  analyseList.value.map((item) => {
    if (item.id == iconItem.id) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
  });
  currentComponent.value = iconItem.componentName;
}
</script>

<style scoped lang="scss">
.analyse-tab {
  box-sizing: border-box;
  padding-left: 0.16rem;
  display: flex;
  height: 0.4rem;
  background: rgba(255, 255, 255, 0.15);
  width: 96%;
  margin: 0px 2%;
  .analyse-tab-items {
    width: 0.48rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @include setIconstyle(0.16rem);
    cursor: pointer;
  }
}
.select-bg {
  background: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}
</style>