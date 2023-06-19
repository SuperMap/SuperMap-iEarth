<template>
  <sm-rowLayOut contentMarginLeft="-0.8rem">
    <template #item-lable></template>
    <template #item-content>
      <n-space>
        <n-button
          class="btn"
          v-for="(item, index) in comList"
          :key="index"
          @click="changeItem(item)"
          >{{ item.name }}</n-button
        ></n-space
      >
    </template>
  </sm-rowLayOut>

  <KeepAlive>
    <component :is="currentItem.com"></component>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import createRoute from "./coms/create-route.vue";
import importRoute from "./coms/import-route.vue";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: "导入飞行路线",
    com: markRaw(importRoute),
  },
  {
    name: "新建飞行路线",
    com: markRaw(createRoute),
  },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

// 点击切换项目
function changeItem(item: any) {
  currentItem.com = item.com;
}
</script>

<style lang="scss" scoped>
.itemBox {
  @include rowItemBoxStyle(
    $--SM--margin-6,
    $--SM--LableWidth-120,
    $--SM--InputWidth-300
  );

  .content {
    margin-left: -0.15rem;
  }
}
</style>