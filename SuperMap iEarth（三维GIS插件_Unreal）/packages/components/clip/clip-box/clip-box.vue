<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">{{locale.SelectLayer}}</n-ellipsis>
      <n-select
        style="width: 60%;"
        v-model:value="state.selectIndex"
        :options="state.options"
        @update:value="update"
      />
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">Box{{locale.Longitude}}</n-ellipsis>
      <n-input clearable  v-model:value="state.lon" type="text"  style="width: 60%;"  placeholder=''/>
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">Box{{locale.Latitude}}</n-ellipsis>
      <n-input clearable  v-model:value="state.lat" type="text"  style="width: 60%;"  placeholder=''/>
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">Box{{locale.Altitude}}</n-ellipsis>
      <n-input clearable  v-model:value="state.height" type="text"  style="width: 60%;"  placeholder=''/>
    </div>
    <n-space justify="end">
      <n-button @click="startFlood">{{locale.Clip}}</n-button>
      <n-button @click="clear">{{locale.Clear}}</n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { inject, onBeforeUnmount, reactive, watch } from "vue";
import { NSpace, NButton, NInputNumber, NEllipsis } from "naive-ui";

let { locale } = inject("storeData");
let storeState = inject("storeState");
let { getScene } = inject("storeActions");

let selectLayer, hyp;
let state = reactive({
  lon: "",
  lat: "",
  height: '10',
  selectIndex: 0,
  options: [
    {
      label: () => locale.value.NoLayer,
      value: 0
    }
  ]
});

let layers;
function initGetAlllayers() {
  if (!viewer) return;
  state.options.length = 0;
  layers = getScene()
    .get_layer3Ds()
    .getAllLayers();
  if (layers && layers.length > 0) {
    layers.forEach((layer, index) => {
      if (layer.type === SuperMap.Web.Realspace.Layer3DType.OSGB) {
        state.options.push({ label: layer.name, value: index });
      }
    });
  } else layers = null;
  if (state.options.length === 0)
    state.options.push({ label: () => locale.value.NoLayer, value: 0 });
  state.selectIndex = 0;
}

initGetAlllayers();

function update(val) {
  if (layers) selectLayer = layers[val];
}

var box = new SuperMap.Web.Core.GeoBox(500, 500, 500);

function startFlood() {
  box.set_position(
    new SuperMap.Web.Core.Point3D(
      Number(state.lon),
      Number(state.lat),
      Number(state.height)
    )
  );
  if (selectLayer) selectLayer.clipByBox(box, 1);
}

function clear() {
  if (selectLayer) selectLayer.clearClipByBox();
}

//监听图层改变
watch(storeState.layerChanges, val => {
  initGetAlllayers();
});

onBeforeUnmount(() => {
  clear();
  selectLayer = null;
  box = null;
});
</script>

<style lang="scss" scoped>
.sm-box {
  display: flex;
  justify-content: space-between;
  .ellipsis {
    width: 40%;
    line-height: 34px;
  }
}
</style>



