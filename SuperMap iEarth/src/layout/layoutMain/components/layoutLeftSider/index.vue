<template>
  <div class="left-tool-bar">
    <span
      class="icon-container"
      v-for="iconItem in panelStore.panelList.leftToolBarList"
      :key="iconItem.id"
      @click="changePanel(iconItem)"
      :class="iconItem.isSelected ? 'select-too-bar-bg' : ''"
    >
      <i
        class="iconfont"
        :class="iconItem.iconName"
        :title="iconItem.title"
      ></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePanelStore } from "@/store";
const panelStore = usePanelStore();

function changePanel(iconItem: any) {
  panelStore.setLeftToolBarList(iconItem);
}
</script>

<style lang="scss" scoped>
.left-tool-bar {
  position: fixed;
  top: 0.6rem;
  left: 0.16rem;
  z-index: 2;
  @include setBackground(0.32rem, 0.76rem, "@/assets/images/left-tool-bg.png");
  .icon-container {
    width: 100%;
    height: 0.36rem;
    color: rgba(255, 255, 255, 0.85);
    @include flexLayout(center);
    @include setIconstyle();
  }
  .select-too-bar-bg {
    @include setBackground(
      0.32rem,
      0.36rem,
      "@/assets/images/item-checked-bg.png"
    );
  }
}
</style>