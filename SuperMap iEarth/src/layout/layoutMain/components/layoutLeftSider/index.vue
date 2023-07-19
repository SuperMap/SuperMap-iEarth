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
        :title="$t(iconItem.title)"
      ></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { usePanelStore } from "@/store";
import { useLayerStore } from "@/store/layerStore";
const panelStore = usePanelStore();
const layerStore = useLayerStore();

function changePanel(iconItem: any) {
  // console.log("iconItem：",iconItem);
  panelStore.setLeftToolBarList(iconItem);

  if(iconItem.id === 1){
    layerStore.refreshLayerTree();
  }
}
</script>

<style lang="scss" scoped>
.left-tool-bar {
  padding-top: 0.05rem;
  box-sizing: border-box;
  position: fixed;
  top: 0.6rem;
  left: 0.16rem;
  z-index: 2;
  @include setBackground(0.32rem, 0.76rem, "@/assets/images/left-tool-bg.png");
  background-size:100% 98%;
  .icon-container {
    width: 100%;
    height: 0.32rem;
    color: rgba(255, 255, 255, 0.85);
    @include flexLayout(center);
    @include setIconstyle();
  }
  .select-too-bar-bg {
    @include setBackground(
      100%,
      0.32rem,
      "@/assets/images/item-checked-bg.png"
    );
  }
}
</style>