
<template>
  <!-- 量算 -->
  <!-- <div class="panle-box" v-dialogDrag="true"> -->
  <div class="panle-box">
    <div class="panle-header">
      <span class="panle-title">量算</span>
      <span class="zst1"></span>
      <span class="zst2"></span>
      <div class="panel-close" @click="panelCloseHandle">
        <svg-icon name="ui-close" class="close-btn" />
      </div>
    </div>
    <div class="panle-container">
      <sm-measure-calculate></sm-measure-calculate>
    </div>
    <div class="panle-footer"></div>
  </div>
</template>

<script lang="ts" setup>
import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
const toolBarStore = toolBarStoreCreate();
// 关闭面板
function panelCloseHandle() {
  toolBarStore.setToolBarShow(4, false);
}
</script>

<style lang="scss" scoped>
.panle-box {
  @include rightTooHead();
}
</style>