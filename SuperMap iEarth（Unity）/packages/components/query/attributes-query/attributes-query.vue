<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px">{{locale.SelectLayer}}</n-ellipsis>
      <n-select size="small" v-model:value="state.selectIndex" :options="state.options" />
    </div>
    <n-space justify="end">
      <n-button @click="query">{{locale.Query}}</n-button>
      <n-button @click="clear">{{locale.Clear}}</n-button>
    </n-space>
  </n-space>
  <div v-show="state.showAtributes" style="margin-top:10px">
    <n-data-table
      :columns="state.cols"
      :data="state.data"
      max-height="200px"
      size="small"
      :single-line="false"
      :loading="state.loading"
    />
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, reactive, watch } from "vue";
import { NSpace, NButton, NInputNumber, NEllipsis, NDataTable } from "naive-ui";

let { locale } = inject("storeData");
let storeState = inject("storeState");
// let { getScene } = inject("storeActions");

let selectLayer;
let state = reactive({
  showAtributes: false,
  loading: false,
  selectIndex: 0,
  options: [
    {
      label: () => locale.value.NoLayer,
      value: 0
    }
  ],
  data: [],
  cols: [
    {
      title: "name",
      key: "name",
      ellipsis: true
    },
    {
      title: "value",
      key: "value",
      ellipsis: true
    }
  ]
});

let layers;
let dom = document.getElementById("unityContainer");

function getScene() {
  return viewer.get_scene();
}

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
  update(0);
}
initGetAlllayers();

function query() {
  state.showAtributes = true;
  dom.addEventListener("click", selectionAndGetAttribute, false);
}

function clear() {
  state.showAtributes = false;
  state.data.length = 0;
  dom.removeEventListener("click", selectionAndGetAttribute, false);
}

function selectionAndGetAttribute(e) {
  e.stopPropagation();
  state.loading = true;
  setTimeout(() => (state.loading = false), 1000);
  state.data.length = 0;
  setTimeout(() => {
    if (selectLayer)
      selectLayer.get_selection3D().then(ids => {
        selectLayer.getAttributesById(ids[0]).then(result => {
          console.log(result, e);
          state.loading = false;
          showAtrbutes(result);
        });
      });
  }, 500);
}

function showAtrbutes(result) {
  if (!result || !result.name) return;
  let names = result.name.split(";");
  let values = result.value.split(";");
  names.forEach((name, index) => {
    let obj = {
      name: name,
      value: values[index]
    };
    state.data.push(obj);
  });
}

function createdDom(){
  
}

//监听图层改变
watch(storeState.layerChanges, val => {
  initGetAlllayers();
});

function update(val) {
  if (layers) selectLayer = layers[val];
}

watch(
  () => state.selectIndex,
  val => {
    update(val);
  }
);

onBeforeUnmount(() => {
  clear();
  selectLayer = null;
});
</script>





