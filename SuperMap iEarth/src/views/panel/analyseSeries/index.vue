<template>
  <!-- 三维分析 -->
  <div class="panle-box">
    <div class="panle-header">
      <span class="panle-title">三维分析</span>
      <span class="zst1"></span>
      <span class="zst2"></span>
      <div class="panel-close" @click="panelCloseHandle">
        <svg-icon name="ui-close" class="close-btn" />
      </div>
    </div>
    <div class="panle-container">
      <div class="analyse-tab">
        <div
          class="analyse-tab-items"
          :class="index === currentItemIndex ? 'select-bg' : ''"
          v-for="(item, index) in analyseSeries"
          @click="leftSiderHander(currentItem, index)"
          :key="item.id"
          :title="$t(item.title)"
        >
          <!-- <svg-icon :name="item.iconName" class="icon-size" /> -->
          <i class="iconfont icon-size" :class="item.iconName"></i>
        </div>
      </div>

      <!-- 三维分析组件 -->
      <div class="analyse-tab-content">
        <keep-alive>
          <component :is="currentItem.com"></component>
        </keep-alive>
      </div>
    </div>
    <div class="panle-footer"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, markRaw, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
import { PanelStoreCreate } from "@/store/panel/panel";
import { useChangePanelStore } from "@/store/changePanelbg/index";

import terrainOperation from "./coms/terrainOperation.vue";
import analysis3d from "./coms/analysis3d.vue";
import clip from "./coms/clip.vue";

const panelStore = PanelStoreCreate();
const toolBarStore = toolBarStoreCreate();
const changePanelStore = useChangePanelStore();
const { panelBgName } = storeToRefs(panelStore);
const { analyseSeries } = storeToRefs(toolBarStore);

// 使用vue3 setUp实现动态组件
let comList = reactive([
  {
    name: "analysis3d",
    com: markRaw(analysis3d),
  },
  {
    name: "clip",
    com: markRaw(clip),
  },
  {
    name: "terrainOperation",
    com: markRaw(terrainOperation),
  },
]);

// 默认项目
let currentItem = reactive({
  com: comList[0].com,
});

// 当前项目索引
let currentItemIndex = ref<number>(0);

function leftSiderHander(item: any, index: number) {
  if (item.name == "analysis3d") {
    // changePanelStore.setAnalyserPanel("analysis3d");
  }
  currentItem.com = comList[index].com;
  currentItemIndex.value = index;

  panelBgName.value = comList[index].name;
}

// -------------
// 关闭面板
function panelCloseHandle() {
  toolBarStore.setToolBarShow(3, false);
}

// 切换面板背景图
function cahngePanelBg() {}
// let panleBoxBg = computed(() => {
//   if()
// })
// watch(
//   () => changePanelStore.analyserPanel,
//   (val) => {
//     // console.log("changePanelStore.analyserPanel", changePanelStore.analyserPanel);
//     if()
//   }
// );
</script>

<style scoped lang="scss">
.panle-box {
  @include rightTooHead();
  .panle-container {
    // margin-top: 0.2rem;
    .select-bg {
      background: #69798d;
    }

    .analyse-tab {
      display: flex;
      height: 0.4rem;
      background: rgba(255, 255, 255, 0.15);

      .analyse-tab-items {
        width: 0.48rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .icon-size {
      font-size: 0.2rem;
    }
  }
}
.analyse-tab {
  // padding: 0 0.12rem;
  // box-sizing: border-box;
}
.analyse-tab-content {
  // padding: 0 0.12rem;
  // box-sizing: border-box;
}
</style>