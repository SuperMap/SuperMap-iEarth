<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">{{locale.SelectLayer}}</n-ellipsis>
      <n-select
        style="width: 100%;"
        multiple
        v-model:value="state.selectIndexs"
        :options="state.options"
        @update:value="update"
      />
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">Box长度</n-ellipsis>
      <n-input-number v-model:value="state.length" size="small" style="width:100%"></n-input-number>
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">Box宽度</n-ellipsis>
      <n-input-number v-model:value="state.width" size="small" style="width:100%"></n-input-number>
    </div>
    <div class="sm-box">
      <n-ellipsis style="line-height: 34px;width: 40%">Box高度</n-ellipsis>
      <n-input-number v-model:value="state.height" size="small" style="width:100%"></n-input-number>
    </div>
    <n-space justify="end">
      <n-button @click="clip">{{locale.Clip}}</n-button>
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

let state = reactive({
  length: 500,
  width: 500,
  height: 500,
  selectIndexs: [],
  options: [
    {
      label: () => locale.value.NoLayer,
      value: 0
    }
  ]
});

let layers;
let dom = document.getElementById("unityContainer");

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
  state.selectIndexs = [0];
}

initGetAlllayers();

function update(val) {}

let box;
function clip() {
  box = new SuperMap.Web.Core.GeoBox(state.length, state.width, state.height);
  dom.addEventListener("click", getPosition, false);
}

function getPosition() {
  let position = [116.3803842902019, 39.9972884638679, 10];
  box.set_position(
    new SuperMap.Web.Core.Point3D(
      Number(position[0]),
      Number(position[1]),
      Number(position[2])
    )
  );
  state.selectIndexs.forEach(index => {
    if (layers[index]) layers[index].clipByBox(box, 2);
  });
}

function clear() {
  state.selectIndexs.forEach(index => {
    if (layers[index]) layers[index].clearClipByBox();
  });
  dom.removeEventListener("click", getPosition, false);
}

//监听图层改变
watch(storeState.layerChanges, val => {
  initGetAlllayers();
});

onBeforeUnmount(() => {
  clear();
  selectLayer = null;
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



