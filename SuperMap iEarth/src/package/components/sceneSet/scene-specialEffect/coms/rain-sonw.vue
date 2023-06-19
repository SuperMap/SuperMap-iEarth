<template>
  <sm-rowLayOut marginbottom="0.2rem">
    <template #item-lable>开启雨景</template>
    <template #item-content>
      <n-switch
        size="small"
        v-model:value="state.rainShow"
        @update:value="setRain"
      />
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.rainShow"
  >
    <template #item-lable>雨角度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.rainAngle"
        style="width: 70%"
        :min="0"
        :max="90"
        :step="10"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.rainAngle }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.rainShow"
  >
    <template #item-lable>雨速度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.rainSpeed"
        style="width: 70%"
        :min="0"
        :max="30"
        :step="2"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.rainSpeed }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut>
    <template #item-lable>开启雪景</template>
    <template #item-content>
      <n-switch
        size="small"
        v-model:value="state.snowShow"
        @update:value="setSnow"
      />
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.snowShow"
  >
    <template #item-lable>雪角度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.snowAngle"
        style="width: 70%"
        :min="0"
        :max="90"
        :step="10"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.snowAngle }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.snowShow"
  >
    <template #item-lable>雪速度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.snowSpeed"
        style="width: 70%"
        :min="0"
        :max="30"
        :step="2"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.snowSpeed }}
      </div>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut
    lableWidth="0.6rem"
    marginbottom="0.15rem"
    contentWidth="1.7rem"
    slotType="slider"
    v-show="state.snowShow"
  >
    <template #item-lable>雪密度</template>
    <template #item-content-slider>
      <n-slider
        v-model:value="state.snowDesity"
        style="width: 70%"
        :min="0"
        :max="30"
        :step="2"
      />
      <div style="font-size: 0.12rem; margin-left: 0.12rem">
        {{ state.snowDesity }}
      </div>
    </template>
  </sm-rowLayOut>
</template>

<script lang="ts" setup>
import { reactive, watch, onUnmounted } from "vue";

let state = reactive({
  // 雨景
  rainShow: false,
  rainAngle: 0,
  rainSpeed: 14,

  // 雪景
  snowShow: false,
  snowAngle: 0,
  snowSpeed: 2,
  snowDesity: 16,
});

function setRain() {
  viewer.scene.postProcessStages.rain.enabled = state.rainShow;
  viewer.scene.postProcessStages.rain.uniforms.angle = state.rainAngle;
  viewer.scene.postProcessStages.rain.uniforms.speed = state.rainSpeed;
}

function setSnow() {
  viewer.scene.postProcessStages.snow.enabled = state.snowShow;
  viewer.scene.postProcessStages.snow.uniforms.angle = state.snowAngle;
  viewer.scene.postProcessStages.snow.uniforms.speed = state.snowSpeed;
  viewer.scene.postProcessStages.snow.uniforms.density = state.snowDesity;
}

watch(
  () => state.rainAngle,
  (newVal: number) => {
    viewer.scene.postProcessStages.rain.uniforms.angle = newVal;
  }
);
watch(
  () => state.rainSpeed,
  (newVal: number) => {
    viewer.scene.postProcessStages.rain.uniforms.speed = newVal;
  }
);
watch(
  () => state.snowAngle,
  (newVal: number) => {
    viewer.scene.postProcessStages.snow.uniforms.angle = newVal;
  }
);
watch(
  () => state.snowSpeed,
  (newVal: number) => {
    viewer.scene.postProcessStages.snow.uniforms.speed = newVal;
  }
);
watch(
  () => state.snowDesity,
  (newVal: number) => {
    viewer.scene.postProcessStages.snow.uniforms.density = newVal;
  }
);

onUnmounted(() => {
  // state.rainShow = false;
  // state.snowShow = false;
  viewer.scene.postProcessStages.rain.enabled = false;
  viewer.scene.postProcessStages.snow.enabled = false;
});
</script>