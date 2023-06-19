<template>
  <sm-rowLayOut>
    <template #item-lable>开启泛光</template>
    <template #item-content>
      <n-switch
        size="small"
        v-model:value="state.bloomShow"
        @update:value="setBloom"
      />
    </template>
  </sm-rowLayOut>

  <!-- <div>
    <span>亮度阈值</span>
    <div>
      <n-slider
        v-model:value="state.threshold"
        style="width: 50%"
        :min="0"
        :max="1"
        :step="0.01"
      />
      <span>
        {{ state.threshold }}
      </span>
    </div>
  </div> -->
  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.bloomShow"
  >
    <template #item-lable>亮度阈值</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.threshold"
        style="width: 70%"
        :min="0"
        :max="1"
        :step="0.01"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.threshold }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.bloomShow"
  >
    <template #item-lable>泛光强度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.bloomIntensity"
        style="width: 70%"
        :min="0"
        :max="1"
        :step="0.01"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.bloomIntensity }}
      </div>
    </template>
  </sm-rowLayOut>

  <!-- <sm-rowLayOut
    marginbottom="0.15rem"
    contentWidth="1.5rem"
    slotType="slider"
    v-show="state.bloomShow"
  >
    <template #item-lable>泛光强度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.bloomIntensity"
        style="width: 50%"
        :min="0"
        :max="10"
        :step="0.1"
      />
      <div>
        {{ state.bloomIntensity }}
      </div>
    </template>
  </sm-rowLayOut> -->
</template>

<script lang="ts" setup>
import { onUnmounted, reactive, watch } from "vue";

let state = reactive({
  bloomShow: false,
  threshold: 0.65,
  bloomIntensity: 1,
});

function setBloom() {
  viewer.scene.bloomEffect.show = state.bloomShow;
  viewer.scene.bloomEffect.threshold = state.threshold;
  viewer.scene.bloomEffect.bloomIntensity = state.bloomIntensity;
}

watch(
  () => state.threshold,
  (newVal: number) => {
    viewer.scene.bloomEffect.threshold = newVal;
  }
);
watch(
  () => state.bloomIntensity,
  (newVal: number) => {
    viewer.scene.bloomEffect.bloomIntensity = newVal;
  }
);

onUnmounted(() => {
  viewer.scene.bloomEffect.show = false;
  viewer.scene.bloomEffect.threshold = 0.65;
  viewer.scene.bloomEffect.bloomIntensity = 1;
});
</script>