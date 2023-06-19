<template>
  <!-- 场景属性 -->
  <!-- <div class="panle-box" v-dialogDrag="true"> -->
  <div class="panle-box" :class="changePanelStore.analyserPanel">
    <div class="panle-header">
      <span class="panle-title">场景属性</span>
      <span class="zst1"></span>
      <span class="zst2"></span>
      <div class="panel-close" @click="panelCloseHandle">
        <svg-icon name="ui-close" class="close-btn" />
      </div>
    </div>
    <div class="panle-container">
      <div class="Container-sceneProperties">
        <n-tabs type="line" animated :on-update:value="tabsChange">
          <!-- 基本属性 -->
          <n-tab-pane name="baseAttribute" :tab="$t('global.baseAttribute')">
            <sm-scene-attribute></sm-scene-attribute>
          </n-tab-pane>
          <!-- 特效 -->
          <n-tab-pane
            name="speciallyEffect"
            :tab="$t('global.speciallyEffect')"
          >
            <sm-scene-specialEffect></sm-scene-specialEffect>
          </n-tab-pane>
          <!-- <n-tab-pane name="flying" :tab="$t('global.flying')">
            <sm-fly-route></sm-fly-route>
          </n-tab-pane> -->
          <!-- 灯光 -->
          <n-tab-pane name="ligth" :tab="$t('global.ligth')">
            <sm-scene-light></sm-scene-light>
          </n-tab-pane>
          <!-- 视口 -->
          <n-tab-pane name="viewPorts" :tab="$t('global.viewPorts')">
            <sm-scene-viewPort></sm-scene-viewPort>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
    <div class="panle-footer"></div>
  </div>
</template>

<script lang="ts" setup>
import { toolBarStoreCreate } from "@/store/toolBar/toolBar";
import { useChangePanelStore } from "@/store/changePanelbg/index";

const toolBarStore = toolBarStoreCreate();

// 关闭面板
function panelCloseHandle() {
  toolBarStore.setToolBarShow(5, false);
}

const changePanelStore = useChangePanelStore();
function tabsChange(value) {
  changePanelStore.setAnalyserPanel(value);
}
</script>

<style lang="scss" scoped>
.panle-box {
  @include rightTooHead();
}

</style>