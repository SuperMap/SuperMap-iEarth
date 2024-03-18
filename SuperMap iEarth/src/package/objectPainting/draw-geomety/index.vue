<template>
  <!-- 绘制线 -->
  <div class="row-item">
    <span class="name">{{ $t("symbolLibrary") }}</span>
    <div class="icon-list-space" style="width: 1.96rem">
      <span
        v-for="(line, index) in state.lines"
        :key="index"
        class="icon-span-four"
        :title="line.name"
        :class="line.isSelect ? 'selected-icon' : ''"
        @click="changleIconItem(line)"
      >
        <i class="iconfont iconSize" :class="line.iconName"></i>
      </span>
    </div>
  </div>

  <!-- 圆柱体 -->
  <div v-if="state.selectedId === 0">
    <ellipseGeo></ellipseGeo>
  </div>

  <!-- 长方体 -->
  <div v-if="state.selectedId === 1">
    <box></box>
  </div>

  <!-- 球体 -->
  <div v-if="state.selectedId === 2">
    <ellipsoid></ellipsoid>
  </div>

  <!-- 圆锥 -->
  <div v-if="state.selectedId === 3">
    <frustum></frustum>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount } from "vue";

import ellipseGeo from "./coms/ellipse.vue";
import box from "./coms/box.vue";
import ellipsoid from "./coms/ellipsoid.vue";
import frustum from "./coms/frustum.vue";

// 初始化变量
let state = reactive({
  lines: [
    {
      id: 0,
      iconName: "iconyuanzhu",
      name: $t("cylinder"),
      nameEN: "elipse",
      isSelect: true,
    },
    {
      id: 1,
      iconName: "iconlifangti",
      name: $t("cube"),
      nameEN: "box",
      isSelect: false,
    },
    {
      id: 2,
      iconName: "iconqiuti",
      name: $t("sphere"),
      nameEN: "ellipsoid",
      isSelect: false,
    },
    {
      id: 3,
      iconName: "iconyuanzhui",
      name: $t("cone"),
      nameEN: "frustum",
      isSelect: false,
    },
  ],
  selectedId: 0,
});

// 切换项目
function changleIconItem(item: any) {
  state.selectedId = item.id;
  for (let i = 0; i < state.lines.length; i++) {
    if (state.lines[i].id == item.id) {
      state.lines[i].isSelect = true;
    } else {
      state.lines[i].isSelect = false;
    }
  }
}

onBeforeUnmount(() => {
  viewer.entities.removeAll();
});
</script>
