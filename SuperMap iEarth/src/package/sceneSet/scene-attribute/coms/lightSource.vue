<!-- 太阳光 -->
<template>
  <div class="sence-config-container">
    <!-- 太阳光颜色 -->
    <div class="row-wrap">
      <div class="label">{{ $t("sunColor") }}</div>
      <div class="content">
        <n-color-picker v-model:value="state.color" :render-label="() => {return '';}" @update:value="watchSunColor"
          size="small">
        </n-color-picker>
      </div>
    </div>

    <!-- 太阳光强度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("sunIntensity") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.intensity" :step="0.1" :min="0.1" :max="32"
            @update:value="watchSunIntensity" />
          <n-input-number  v-model:value="state.intensity" :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0.1" :max="32" placeholder="" size="small"
            @update:value="watchSunIntensity" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

const viewer = window.viewer;
const scene = viewer.scene;

// 光照
let state = reactive({
  color: "rgba(255, 255, 255, 1)", // 太阳光颜色
  intensity: 1, // 太阳光强度
})

// 开启光照
onMounted(() => {
  // 让enableLighting使用默认值false，当设为true时作用于整个地球，会影响球皮【影像图层】导致很亮
  // 我们一般让太阳光只作用于模型，因此使用默认值false
  // scene.globe.enableLighting = true; 

  // 太阳光
  const sunLightColor = SuperMap3D.clone(scene.lightSource.sunLightColor);
  const colorResult = divideColorByIntensity(sunLightColor);
  state.color = colorResult.colorString;
  state.intensity = Number(colorResult.scalar);
})

// 将被multiplyByScalar的color剖分获取原来的colorString和scalar
function divideColorByIntensity(lightColor: any) {
  const scalar = Number(lightColor.alpha);
  const lightColor_divide = SuperMap3D.Color.divideByScalar(lightColor, scalar, new SuperMap3D.Color())
  const red = SuperMap3D.Color.floatToByte(lightColor_divide.red);
  const green = SuperMap3D.Color.floatToByte(lightColor_divide.green);
  const blue = SuperMap3D.Color.floatToByte(lightColor_divide.blue);
  return {
    colorString: `rgba(${red}, ${green}, ${blue}, 1)`,
    scalar: scalar
  }
}

// 将color乘以强度得到最终的颜色值
function multiplyColorByIntensity(lightColor: string, intensity: number) {
  if (!lightColor || !intensity) return;
  const color = SuperMap3D.Color.fromCssColorString(lightColor);
  const colorIntensity = SuperMap3D.Color.multiplyByScalar(color, intensity, new SuperMap3D.Color());
  return colorIntensity;
}

const watchSunColor = function(val){
  if(!scene.sun.show) return;
  const intensity = state.intensity;
  scene.lightSource.sunLightColor = multiplyColorByIntensity(val, intensity);
}

const watchSunIntensity = function(val){
  if(!scene.sun.show) return;
  const color = state.color;
  scene.lightSource.sunLightColor = multiplyColorByIntensity(state.color, val);
}
</script>
