<template>
  <!-- 自定义服务 -->
  <sm-rowLayOut marginbottom="0.2rem" lableWidth="0.79rem">
    <template #item-lable>{{ $t("global.type") }}</template>
    <template #item-content>
      <div class="btn-list">
        <div
          class="btn"
          :class="item.isSelect ? 'select-btn' : ''"
          v-for="(item, index) in comList"
          :key="index"
          @click="changeItem(item)"
        >
          {{ $t(item.name) }}
        </div>
      </div>
    </template>
  </sm-rowLayOut>
  <KeepAlive>
    <component :is="currentItem.com"></component>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import layers from "./coms/layers.vue";
import scene from "./coms/scene.vue";
import localData from "./coms/localData.vue";
import myService from "./coms/myService.vue";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: "global.layer",
    com: markRaw(layers),
    isSelect: true,
  },
  {
    name: "global.scene",
    com: markRaw(scene),
    isSelect: false,
  },
  {
    name: "global.localData",
    com: markRaw(localData),
    isSelect: false,
  },
  {
    name: "我的服务",
    com: markRaw(myService),
    isSelect: false,
  },
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
.itemBox {
  cursor: pointer;
  @include rowItemBoxStyle(0, $--SM--LableWidth-120, $--SM--InputWidth-300);
  margin-top: 0.06rem;
  .content {
    margin-left: -0.15rem;
  }
  .btn-list {
    font-size: 0.12rem;
    display: flex;
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
}
</style>