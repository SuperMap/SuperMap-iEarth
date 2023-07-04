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
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import createRoute from "./components/create-route.vue";
import importRoute from "./components/import-route.vue";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: "导入飞行路线",
    com: markRaw(importRoute),
    isSelect: true,
  },
  {
    name: "新建飞行路线",
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
  // font-size: 0.14rem;
  display: flex;
  margin-left: 0.1rem;
  margin-bottom: 0.15rem;
  cursor: pointer;

  .btn {
    width: 1.2rem;
    height: 0.22rem;
    line-height: 0.22rem;
    text-align: center;
    margin-left: 0.48rem;
  }

  .select-btn {
    border-radius: 0.02rem;
    color: #3499e5;
    background: rgba(255, 255, 255, 0.15);
  }
}
</style>