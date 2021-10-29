<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px">{{locale.SelectLayer}}</n-ellipsis>
      <n-select size="small" v-model:value="state.selectIndex" :options="state.options" />
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px">{{locale.MinVisible}}</n-ellipsis>
      <n-input-number size="small" v-model:value="state.minVisible" style="width:100%"/>
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px">{{locale.MaxVisible}}</n-ellipsis>
      <n-input-number size="small" v-model:value="state.maxVisible" style="width:100%" />
    </div>
      <div class="sm-box">
      <n-ellipsis style="line-height: 28px">{{locale.Speed}}</n-ellipsis>
      <n-input-number size="small" v-model:value="state.floodSpeed" style="width:100%" />
    </div>
    <n-space justify="end">
      <n-button @click="startFlood">{{locale.Analyze}}</n-button>
      <n-button @click="clear">{{locale.Clear}}</n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { inject, onBeforeUnmount, reactive, watch } from "vue";
import { NSpace, NButton, NInputNumber, NEllipsis } from "naive-ui";

let { locale } = inject("storeData");
let storeState = inject("storeState");
// let { getScene } = inject("storeActions");

let selectLayer, hyp;
let state = reactive({
  minVisible: 0,
  maxVisible: 1000,
  floodSpeed:1,
  selectIndex: 0,
  options: [
    {
      label: () => locale.value.NoLayer,
      value: 0
    }
  ]
});

let layers, terrain_layers;

function getScene(){
  return viewer.get_scene();
}

function initGetAlllayers() {
  if (!viewer) return;
  state.options.length = 0;
  layers = getScene()
    .get_layer3Ds()
    .getAllLayers();
  terrain_layers = getScene().get_terrainLayers();
  if (layers && layers.length > 0) {
    layers.forEach((layer, index) => {
      if (layer.type === SuperMap.Web.Realspace.Layer3DType.OSGB) {
        state.options.push({ label: layer.name, value: index });
      }
    });
  } else layers = null;
  if (terrain_layers.get_count() > 0) {
    terrain_layers = terrain_layers.get_item(0);
    state.options.push({
      label: terrain_layers.name,
      value: state.options.length
    });
  } else terrain_layers = null;
  if (state.options.length === 0)
    state.options.push({ label: () => locale.value.NoLayer, value: 0 });
  update(0);
}
initGetAlllayers();

function initHyp() {
  hyp = new SuperMap.Web.Realspace.HypsometricSetting();
  hyp.minVisibleValue = state.minVisible;
  hyp.maxVisibleValue = state.maxVisible;
  hyp.set_interval(state.floodSpeed);
}

function startFlood() {
  if (!hyp) initHyp();
  if (selectLayer) selectLayer.set_hypsometricSetting(hyp);
}

function clear() {
  if (selectLayer) selectLayer.clearHypsometricSetting();
}

//监听图层改变
watch(storeState.layerChanges, val => {
  initGetAlllayers();
});

function update(val) {
  if (terrain_layers && val === state.options.length - 1) {
    selectLayer = terrain_layers;
  } else if (layers) selectLayer = layers[val];
}

watch(
  () => state.selectIndex,
  val => {
    update(val);
  }
);
watch(
  () => state.minVisible,
  val => {
    if(val===null) return;
    if (hyp) hyp.minVisibleValue = val;
  }
);
watch(
  () => state.maxVisible,
  val => {
    if(val===null) return;
    if (hyp) hyp.maxVisibleValue = val;
  }
);
watch(
  () => state.floodSpeed,
  val => {
    if(val===null) return;
    if (hyp) hyp.set_interval(val);
  }
);

onBeforeUnmount(() => {
  clear();
  selectLayer = null;
  hyp = null;
});
</script>

<style lang="scss">
@import "../../../assets/style/common.scss";
</style>




