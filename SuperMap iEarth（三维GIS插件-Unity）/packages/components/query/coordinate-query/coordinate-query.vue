<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis>经度</n-ellipsis>
      <n-input-number v-model:value="state.lon" size="small" style="width:100%" :show-button="false"></n-input-number>
    </div>
      <div class="sm-box">
      <n-ellipsis>纬度</n-ellipsis>
      <n-input-number v-model:value="state.lat" size="small" style="width:100%" :show-button="false"></n-input-number>
    </div>
      <div class="sm-box">
      <n-ellipsis>高度</n-ellipsis>
      <n-input-number v-model:value="state.alt" size="small" style="width:100%" :show-button="false"></n-input-number>
    </div>
    <n-space justify="end">
      <n-button @click="active">{{locale.Analyze}}</n-button>
      <n-button @click="clear">{{locale.Clear}}</n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { inject, onBeforeUnmount, reactive, watch } from "vue";
import { NSpace, NButton, NEllipsis, NSelect ,NInputNumber} from "naive-ui";

let { locale } = inject("storeData");
let sceneControl = viewer;

let state = reactive({
  lon: 0, 
  lat: 0, 
  alt: 0, 
});

let dom = document.getElementById("unityContainer");

function active() {
  dom.addEventListener("click", getPosition, false);
}

function clear() {
    state.lon = 0;
    state.lat = 0;
    state.alt = 0;
    dom.removeEventListener("click", getPosition, false);
}

function getPosition(){
    console.log('click')
}

onBeforeUnmount(() => {
  clear();
});
</script>





