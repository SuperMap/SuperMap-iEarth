<template>
    <div class="sence-config-container">
      <div class="row-item">
        <span>{{ $t("intensityValue") }}</span>
        <div class="slider-box">
          <n-slider style="width: 1.2rem" v-model:value="state.mssaIntensity" :step="1" :min="1" :max="8" />
          <n-input-number v-model:value="state.mssaIntensity" class="slider-input-number" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="8" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

// TODO 注意:这里的_msaaSamples有点奇怪，如果初始化设置为4，再这里设置为1效果不对
let state = reactive({
  mssaIntensity: 1,  // 反走样强度
});

// 挂载的时候就是打开
onMounted(() => {
  state.mssaIntensity = viewer.scene._msaaSamples <= 1.1 ? 1 : viewer.scene._msaaSamples;
})

watch(
  () => state.mssaIntensity,
  (val) => {
    viewer.scene._msaaSamples = Number(val) == 1 ? 1.1 : Number(val);
  }
);
</script>
  