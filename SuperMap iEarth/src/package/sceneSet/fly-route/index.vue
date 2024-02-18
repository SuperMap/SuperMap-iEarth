<template>
  <div class="btn-list">
    <div class="btn" :class="item.isSelect ? 'select-btn' : ''" v-for="(item, index) in comList" :key="index"
      @click="changeItem(item)">
      {{ item.name }}
    </div>
  </div>

  <KeepAlive>
    <component :is="currentItem.com"></component>
  </KeepAlive>

  <rotate></rotate>
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import createRoute from "./components/create-route.vue";
import importRoute from "./components/import-route.vue";
import rotate from "./components/rotate.vue";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: GlobalLang.importFlyRoute,
    com: markRaw(importRoute),
    isSelect: true,
  },
  {
    name: GlobalLang.createFlyRoute,
    com: markRaw(createRoute),
    isSelect: false,
  },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

// 点击切换项目
function changeItem(item: any) {
  currentItem.com = item.com;

  comList.map((itemObj) => {
    if (itemObj.name == item.name) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });
}
</script>

<style lang="scss" scoped>
.btn-list {
  margin-left: 0.1rem;
  width: 2.7rem;
  margin-bottom: 0.15rem;
  justify-content: space-evenly;

  .btn {
    width: fit-content;
    padding: 0 0.1rem;
  }
}
</style>