<template>
  <n-space vertical>
    <n-select v-model:value="layerType" size="small" :options="options" />
    <n-input v-model:value="layerUrl" size="small" type="text" :placeholder="locale.LayerUrl" />
    <n-input v-model:value="layerName" size="small" type="text" :placeholder="locale.LayerName" />
    <n-space justify="end">
      <n-button @click="addLayer">{{locale.Confirm}}</n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { reactive, toRefs, inject, onBeforeUnmount } from "vue";
import { NSelect, NInput, NSpace, NButton, useMessage } from "naive-ui";

const message = useMessage();
let storeActions = inject("storeActions");
let { locale } = inject("storeData");
const emit = defineEmits(["addCallback"]); // 添加后自定义事件
let state = reactive({
  options: [
    {
      label: () => locale.value.S3mLayer,
      value: "S3M"
    },
    {
      label: () => locale.value.ImageLayer,
      value: "IMG"
    },
    {
      label: () => locale.value.TerrainLayer,
      value: "TERRAIN"
    }
  ],
  layerType: "S3M",
  layerUrl: "",
  layerName: ""
});

const { options, layerType, layerUrl, layerName } = { ...toRefs(state) };

// 添加图层
function addLayer() {
  let url = Trim(state.layerUrl);
  let name = Trim(state.layerName);
  if (!url || url === "") return message.warning(locale.value.LayerAddressTip);
  if (!name || name === "") return message.warning(locale.value.LayerNameTip);
  storeActions
    .addLayerByType(state.layerType, url, name)
    .then(layer => successAndclose(layer))
    .catch(err => {
      message.error(locale.value.AddLayerFail + ":" + err);
    });
}

//去除字符串前后所有空
function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function successAndclose(layer) {
  // 触发图层更新标志
  storeActions.setLayerChanges();
  message.success(locale.value.AddLayerSuccess);
  state.layerUrl = "";
  state.layerName = "";
  emit("addCallback", layer);
  if (state.layerType !== "TERRAIN")
    setTimeout(() => {
      storeActions
        .getScene()
        .get_flyingOperator()
        .flyToLayer(layer);
    }, 3000); //飞行暂时需要延迟
}
</script>


