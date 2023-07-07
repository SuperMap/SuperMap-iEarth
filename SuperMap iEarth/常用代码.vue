<template>
  <div class="row-item">
    <span>天际线颜色</span>
    <n-input-number
      style="width: 2.2rem"
      v-model:value="state.skylineRadius"
      :show-button="false"
    >
      <template #suffix>°</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span style="color: #fff">高亮障碍物</span>
    <n-checkbox v-model:checked="state.highlightBarrier"></n-checkbox>
    <div class="color-pick-box">
      <n-color-picker
        v-model:value="state.solidColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item">
    <span style="color: #fff">提示线颜色</span>
    <div class="color-pick-box">
      <n-color-picker
        v-model:value="state.hintLineColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item">
    <span>天际线宽度</span>
    <n-slider v-model:value="state.lineWidth" :step="1" :min="1" :max="10" />
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="analysis"
      style="margin-right: 0.1rem"
      >分析</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
  
</template>

<script setup lang="ts">
import { usePanelStore } from "@/store";
const panelStore = usePanelStore();
function changePanels() {}
</script>

<style lang="scss" scoped>
</style>