<template>
  <!-- 粒子 -->
  <div class="row-item">
    <span class="name">符号库</span>
    <div class="icon-list">
      <span
        v-for="(item, index) in state.stateParticles"
        :key="index"
        class="icon-span"
        :title="item.name"
        :class="item.isSelect ? 'selected-icon' : ''"
        @click="changleIconItem(item)"
      >
        <i class="iconfont iconSize" :class="item.iconName"></i>
      </span>
    </div>
  </div>

  <!-- 火焰 -->
  <div v-if="state.selectedId === 0">
    <fire></fire>
  </div>

  <!-- 喷泉 -->
  <div v-if="state.selectedId === 1">
    <water></water>
  </div>

  <!-- 烟花 -->
  <div v-if="state.selectedId === 2">
    <fireworks></fireworks>
  </div>

  <!-- <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add"
      style="margin-right: 0.1rem"
      >添加</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div> -->
</template>
  

<script lang="ts" setup>
import { ref,reactive, onBeforeUnmount, watch } from "vue";

import fire from "./coms/fire.vue"
import water from "./coms/water.vue"
import fireworks from "./coms/fireworks.vue"

// 初始化数据
let state = reactive({
  selectedId: 0,
  selectedChildrenId: 0,
  emissionRate: 50,
  particleSize: 2,
  particleLife: [1.5, 1.6],
  speed: [3.5, 4],
  startScale: 2.5,
  endScale: 1,
  gravity: 0,
  lifetime: 6,
  ringRadius: [25, 30],
  particleSystemType: "conical",
  image: "./images/particleSystem/base_fire.png",
  startColor: "rgba(255, 255, 255, 0.3)",
  endColor: "rgba(0, 0, 0, 0)",
  emitter: ["ConeEmitter", [60]],
  bursts: [], //爆炸
  // selectType: [],
  paramSetShow: false, //参数设置
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
  state.selectedId = item.id;
  for (let i = 0; i < state.stateParticles.length; i++) {
    if (state.stateParticles[i].id == item.id) {
      state.stateParticles[i].isSelect = true;
    } else {
      state.stateParticles[i].isSelect = false;
    }
  }
}

onBeforeUnmount(() => {
  // clear();
 });
</script>
  
  
<style lang="scss" scoped>

</style>
  
  
  
  
  
  