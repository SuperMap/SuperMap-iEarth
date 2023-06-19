<template>
  <sm-rowLayOut marginbottom="0.2rem" contentMarginLeft="-0.5rem">
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
import floodLight from "./coms/flood-light.vue";
import scanLine from "./coms/scan-line.vue";
import rainSnow from "./coms/rain-sonw.vue";
import { useChangePanelStore } from "@/store/changePanelbg/index";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: "场景泛光",
    com: markRaw(floodLight),
    isSelect: true,
  },
  {
    name: "扫描线",
    com: markRaw(scanLine),
    isSelect: false,
  },
  {
    name: "雨雪",
    com: markRaw(rainSnow),
    isSelect: false,
  },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

const changePanelStore = useChangePanelStore();
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

  changePanelStore.setAnalyserPanel(item.name);
}
</script>

<style lang="scss" scoped>
.btn-list {
  margin-top: 0.1rem;
  font-size: 0.12rem;
  display: flex;

  cursor: pointer;
  .btn {
    width: 30%;
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
</style>