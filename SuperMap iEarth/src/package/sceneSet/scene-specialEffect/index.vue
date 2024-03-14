<template>
  <div>
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
  </div>

  <KeepAlive>
    <component :is="currentItem.com"></component>
  </KeepAlive>
</template>

<script lang="ts" setup>
import { reactive, markRaw } from "vue";
import floodLight from "./components/flood-light.vue";
import scanLine from "./components/scan-line.vue";
import rainSnow from "./components/rain-sonw.vue";

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: $t("floodLight"),
    com: markRaw(floodLight),
    isSelect: true,
  },
  {
    name: $t("scanLine"),
    com: markRaw(scanLine),
    isSelect: false,
  },
  {
    name: $t("rainSnow"),
    com: markRaw(rainSnow),
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
</script>

<style lang="scss" scoped>
.btn-list {
  width: 2.7rem;
  margin-left: 0.1rem;
  margin-bottom: 0.2rem;
  justify-content: space-evenly;

  .btn {
    width: fit-content;
    padding: 0 0.08rem;
  }
}
</style>
