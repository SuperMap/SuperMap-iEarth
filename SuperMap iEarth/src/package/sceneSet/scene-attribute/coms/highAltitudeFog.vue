<template>

  <div class="row-item">
    <span>{{ $t("fogEffect") }}</span>
    <div style="width: 1.96rem">
      <n-checkbox v-model:checked="state.useFog"></n-checkbox>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("density") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.2rem" v-model:value="state.density" :min="0.01" :max="1.0" :step="0.01" />
      <n-input-number v-model:value="state.density" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0.01" :max="1.0" :step="0.01" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("fogdecay") }}</span>
    <div class="slider-box">
      <n-slider style="width: 1.2rem" v-model:value="state.decay" :min="0.1" :max="2.0" :step="0.01" />
      <n-input-number v-model:value="state.decay" class="slider-input-number" :update-value-on-input="false"
        :bordered="false" :show-button="false" :min="0.1" :max="2.0" :step="0.01" placeholder="" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("color") }}</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker v-model:value="state.color" :render-label="() => {return '';}" size="small">
      </n-color-picker>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";
import tool from "@/tools/tool";

const state = reactive({
  useFog: true,
  density: 0.15,
  decay: 0.2,
  color: "rgba(255,255,255,1)"
});

const scene = viewer.scene;

// 挂载的时候就是打开
onMounted(() => {
  // 开启雾气 => 开启高度雾
  scene.fog.enabled = true;
  scene.fog.advanced = true;

  state.density = Number(scene.fog.density);
  state.decay = Number(scene.fog.heightFalloff);
  state.color = tool.rgbaToCssString(scene.fog.color) || "rgba(255,255,255,1)";
})


watch(() => state.useFog,
  (val) => {
    scene.fog.enabled = Boolean(val);
  }
);

watch(() => state.density,
  (val) => {
    scene.fog.density = Number(val);
  }
);

watch(() => state.decay,
  (val) => {
    scene.fog.heightFalloff = Number(val);
  }
);

watch(() => state.color,
  (val) => {
    scene.fog.color = SuperMap3D.Color.fromCssColorString(val);
  }
);
</script>
  