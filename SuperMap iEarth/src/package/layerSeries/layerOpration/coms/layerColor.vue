<template>
    <div class="row-item">
      <span>{{$t('global.brightness')}}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.brightness"
          style="width: 70%"
          :step="0.05" :min="0" :max="3"
        />
        <div class="row-slider-num">{{ state.brightness }}</div>
      </div>
    </div>
    
    <div class="row-item">
      <span>{{$t('global.contrastRatio')}}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.contrast"
          style="width: 70%"
          :step="0.05" :min="0" :max="3"
        />
        <div class="row-slider-num">{{ state.contrast }}</div>
      </div>
    </div>

    <div class="row-item">
      <span>{{$t('global.colorTone')}}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.hue"
          style="width: 70%"
          :step="0.05" :min="0" :max="3"
        />
        <div class="row-slider-num">{{ state.hue }}</div>
      </div>
    </div>

    <div class="row-item">
      <span>{{$t('global.saturation')}}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.saturation"
          style="width: 70%"
          :step="0.05" :min="0" :max="3"
        />
        <div class="row-slider-num">{{ state.saturation }}</div>
      </div>
    </div>

    <div class="row-item">
      <span>{{$t('global.gamma')}}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.gamma"
          style="width: 70%"
          :step="0.05" :min="0" :max="3"
        />
        <div class="row-slider-num">{{ state.gamma }}</div>
      </div>
    </div>

    <!-- <div class="btn-row-item">
        <n-button @click="reset">{{$t('global.reset')}}</n-button>
      </div> -->
</template>

  
  <script setup lang="ts">
  import { reactive, onBeforeUnmount, watch } from "vue";
  import { useLayerStore } from "@/store/layerStore";
  const layerStore = useLayerStore();
  
  type StateType = {
    s3mlayers:any,
    selectedIndex: number, //默认选择图层index
    brightness: number,
    contrast: number,
    hue: number,
    saturation: number,
    gamma: number,
  }
  
  // 初始化数据
  let state = reactive<StateType>({
    s3mlayers: [], //当前存在的可选择s3m图层
    selectedIndex: 0, //默认选择图层index
    brightness: 1,
    contrast: 1,
    hue: 0,
    saturation: 1,
    gamma: 1,
  });
  let layers;
  
  
  function updateLayers() {
    layers = viewer.scene.layers.layerQueue;
    if (!layers || layers.length < 1) {
      state.s3mlayers = [{ label: () => '暂无图层', value: 0 }];
      return;
    }
    state.s3mlayers.length = 0;
    layers.forEach((layer, index) => {
      let name = layer._name;
      state.s3mlayers.push({
        label: name,
        value: index
      });
    });
    if (state.selectedIndex > layers.length - 1) state.selectedIndex = 0;
  }
  
  function init() {
    if (!window.viewer) return;
    updateLayers();
    state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);
  }
  init();

  
  function getAttributes() {
    if (!SuperMap3D.defined(layers) || !SuperMap3D.defined(layers[state.selectedIndex]))
      return;
    let selectLayer = layers[state.selectedIndex];
    state.brightness = SuperMap3D.defaultValue(selectLayer.brightness, 1);
    state.contrast = SuperMap3D.defaultValue(selectLayer.contrast, 1);
    state.hue = SuperMap3D.defaultValue(selectLayer.hue, 0);
    state.saturation = SuperMap3D.defaultValue(selectLayer.saturation, 1);
    state.gamma = SuperMap3D.defaultValue(selectLayer.gamma, 1);
  }

  function reset(){
    // let selectLayer = layers[state.selectedIndex];
    viewer.scene.colorCorrection.brightness = 1;
    viewer.scene.colorCorrection.contrast = 1;
    viewer.scene.colorCorrection.hue = 0;
    viewer.scene.colorCorrection.saturation = 1;
    viewer.scene.colorCorrection.gamma = 1;

    state.brightness = 1;
    state.contrast = 1;
    state.hue = 0;
    state.saturation = 1;
    state.gamma = 1;

    // viewer.scene.colorCorrection.show = false;
  };


  // 监听
  watch(
    () => layerStore.layerChangeCount,
    () => {
      updateLayers();
    });
  
  watch(
    () => state.selectedIndex,
    val => {
      getAttributes();
    }
  );
  
  watch(
    () => state.brightness,
    val => {
      if (layers[state.selectedIndex])
        layers[state.selectedIndex].brightness = Number(val);
    }
  );
  watch(
    () => state.contrast,
    val => {
      if (layers[state.selectedIndex])
        layers[state.selectedIndex].contrast = Number(val);
    }
  );
  watch(
    () => state.hue,
    val => {
      if (layers[state.selectedIndex])
        layers[state.selectedIndex].hue = Number(val);
    }
  );
  watch(
    () => state.saturation,
    val => {
      if (layers[state.selectedIndex])
        layers[state.selectedIndex].saturation = Number(val);
    }
  );
  watch(
    () => state.gamma,
    val => {
      if (layers[state.selectedIndex])
        layers[state.selectedIndex].gamma = Number(val);
    }
  );
 
  watch(
    () => layerStore.s3mLayerSelectIndex,
    val => {
      // reset();
      state.selectedIndex = Number(val);
    }
  );
  
  onBeforeUnmount(() => {});
  </script>
  
  <style lang="scss" scoped>
  </style>
  
  
  
  
  
  
  