<!-- 开启地下 -->
<template>
  <div class="sence-config-container">
    <!-- 地表透明度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("surfaceTransparency") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.surfaceTransparency" :step="0.1" :min="0" :max="1" />
          <n-input-number v-model:value="state.surfaceTransparency" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="0" :max="1" placeholder=""
            size="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive } from "vue";

const state = reactive({
  surfaceTransparency: 1,//地表透明度
})

// 开启地下
onMounted(() => {
  viewer.scene.undergroundMode = true;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000; //设置相机最小缩放距离,距离地表-1000米
  viewer.scene.globe.showSkirts = false; // 关闭裙边

  state.surfaceTransparency = viewer.scene.globe.globeAlpha;
})

watch(
  () => state.surfaceTransparency,
  (val) => {
    viewer.scene.globe.globeAlpha = val;
  }
);
</script>
