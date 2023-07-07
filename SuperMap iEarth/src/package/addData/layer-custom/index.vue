<template>
  <!-- 自定义服务 -->
  <div class="row-item">
    <span class="">类型</span>
    <div class="btn-list">
      <div
        class="btn"
        :class="item.isSelect ? 'select-btn' : ''"
        v-for="(item, index) in comList"
        :key="index"
        @click="changeItem(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
  <KeepAlive>
    <component :is="currentItem.com"></component>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import layers from "./components/layers.vue";
import scene from "./components/scene.vue";
import localData from "./components/localData.vue";
// import myService from "./components/myService.vue";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: "图层",
    com: markRaw(layers),
    isSelect: true,
  },
  {
    name: "场景",
    com: markRaw(scene),
    isSelect: false,
  },
  {
    name: "本地数据",
    com: markRaw(localData),
    isSelect: false,
  },
  // {
  //   name: "我的服务",
  //   com: markRaw(myService),
  //   isSelect: false,
  // },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

// 点击切换项目
function changeItem(item: any) {
  comList.map((itemObj) => {
    if (itemObj.name == item.name) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });
  currentItem.com = item.com;
}

// 切换菜单
</script>

<style lang="scss" scoped>
.btn-list {
  width: 2.4rem;
  display: flex;
  cursor: pointer;
  .btn {
    width: 25%;
    height: 0.26rem;
    line-height: 0.26rem;
    text-align: center;
  }
  .select-btn {
    border-radius: 0.02rem;
    color: #3499e5;
    background: rgba(255, 255, 255, 0.15);
  }
}
.btn-row-item {
  margin-left: 0.75rem;
}
</style>