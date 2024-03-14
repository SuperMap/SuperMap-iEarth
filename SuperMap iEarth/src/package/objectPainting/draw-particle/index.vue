<template>
  <!-- 粒子 -->
  <div class="row-item">
    <span class="name">{{ $t("symbolLibrary") }}</span>
    <div class="icon-list">
      <span
        v-for="(item, index) in comList"
        :key="index"
        class="icon-span"
        :title="item.name"
        :class="item.isSelect ? 'selected-icon' : ''"
        @click="changleIconItem(item)"
      >
        <i
          class="iconfont iconSize"
          :class="item.iconName"
          style="margin-top: 0px"
        ></i>
      </span>
    </div>
  </div>

  <KeepAlive>
    <component :is="currentItem.com"></component>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, markRaw } from "vue";

import fire from "./coms/fire.vue";
import water from "./coms/water.vue";
import fireworks from "./coms/fireworks.vue";
// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    id: 0,
    iconName: "iconhuoyan",
    name: $t("fire"),
    nameEN: "Solid",
    isSelect: true,
    com: markRaw(fire),
  },
  {
    id: 1,
    iconName: "iconshui",
    name: $t("water"),
    nameEN: "grid",
    isSelect: false,
    com: markRaw(water),
  },
  {
    id: 2,
    iconName: "iconyanhua",
    name: $t("fireworks"),
    nameEN: "stripe",
    isSelect: false,
    com: markRaw(fireworks),
  },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

// 初始化变量
let state = reactive({
  selectedId: 0,
  stateParticles: [
    {
      id: 0,
      iconName: "iconhuoyan",
      name: "火焰",
      nameEN: "Solid",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "iconshui",
      name: "水滴",
      nameEN: "grid",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "iconyanhua",
      name: "烟花",
      nameEN: "stripe",
      isSelect: false,
    },
  ],
});

// 切换项目
function changleIconItem(item: any) {
  currentItem.com = item.com;
  state.selectedId = item.id;
  for (let i = 0; i < comList.length; i++) {
    if (comList[i].id == item.id) {
      comList[i].isSelect = true;
    } else {
      comList[i].isSelect = false;
    }
  }
}

onBeforeUnmount(() => {});
</script>
