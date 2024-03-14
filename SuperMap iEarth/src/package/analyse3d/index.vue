<template>
  <!-- 三维分析 -->
  <div class="analyse-tab">
    <div
      class="analyse-tab-items"
      :class="item.isSelected ? 'select-bg' : ''"
      v-for="item in analyseList"
      :key="item.id"
      :title="item.title"
      @click="changeItem(item)"
    >
      <i class="iconfont" :class="item.iconName" style="font-size: 0.18rem"></i>
    </div>
  </div>

  <!-- 三维分析组件 -->
  <keep-alive>
    <component :is="currentComponent"></component>
  </keep-alive>
</template>

<script lang="ts" setup>
import { ref, markRaw } from "vue";
import Analyse from "./analyse/index";
import Clip from "./clip/index";
import Terrain from "./terrain/index";

let analyseList = ref([
  {
    id: 1,
    iconName: "iconkongjianfenxi",
    title: $t("spatialAnalysis"),
    isSelected: true,
    componentName: markRaw(Analyse),
  },
  {
    id: 2,
    iconName: "iconjianqie",
    title: $t("clip"),
    isSelected: false,
    componentName: markRaw(Clip),
  },
  {
    id: 3,
    iconName: "icondixing",
    title: $t("terrainOperation"),
    isSelected: false,
    componentName: markRaw(Terrain),
  },
]);

let currentComponent = ref(markRaw(Analyse));

// 切换项目
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
  margin: 0rem 2%;

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
