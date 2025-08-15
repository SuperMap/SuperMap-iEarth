<!-- 阴影 -->
<template>
  <div class="sence-config-container">
    <!-- 阴影浓度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("shadowDensity") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.darkness" :step="0.1" :min="0" :max="1" />
          <n-input-number v-model:value="state.darkness"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="1" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 可见距离 -->
    <div class="row-wrap">
      <div class="label">{{ $t("visibleDistance") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.maximumDistance" :step="10" :min="1" :max="5000" />
          <n-input-number v-model:value="state.maximumDistance" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="1" :max="5000" placeholder=""
            size="small" />
        </div>
      </div>
    </div>

    <!-- 边界清晰度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("boundaryClarity") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.penumbraRatio" :step="0.05" :min="0" :max="1" />
          <n-input-number v-model:value="state.penumbraRatio"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="1" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, reactive } from "vue";

const viewer = window.viewer;

// 光照
const state = reactive({
  darkness: 0.7,
  maximumDistance: 2000,
  penumbraRatio: 0.1
})

onMounted(() => {
  viewer.scene.sun.show = true; // 阴影需要默认开启太阳

  state.darkness = (1 - viewer.shadowMap.darkness); // state.darkness和viewer上的取反
  state.penumbraRatio = viewer.shadowMap.penumbraRatio;
  state.maximumDistance = viewer.scene.shadowMap.maximumDistance;

  openShadow();
})

function openShadow() {
  const layers = viewer.scene.layers.layerQueue;
  for (var i = 0; i < layers.length; i++) {
    // 设置图层的阴影模式
    layers[i].shadowType = 2;
  }

  viewer.shadows = true;
  // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
  viewer.pcss = true;
  viewer.shadowQuality = 0;
  //设置阴影的出现距离
  viewer.scene.shadowMap.maximumDistance = state.maximumDistance;
  //设置阴影的浓度，值越高，阴影越淡
  viewer.shadowMap.darkness = 1 - Number(state.darkness);
  //默认值是0.1，值越小越清晰
  viewer.shadowMap.penumbraRatio = state.penumbraRatio; // 边界清晰度（阴影的半影比例），只对PCSS阴影模式起作用
}


watch(
  () => state.darkness,
  (val) => {
    viewer.shadowMap.darkness = 1 - Number(val); // 相当于取反了
  }
);

watch(
  () => state.penumbraRatio,
  (val) => {
    viewer.shadowMap.penumbraRatio = Number(val);
  }
);

watch(
  () => state.maximumDistance,
  (val) => {
    viewer.scene.shadowMap.maximumDistance = Number(val);
  }
);

</script>
