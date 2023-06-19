<script setup lang="ts">
import { reactive, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { storeToRefs } from 'pinia';
import { UrlDataSetCreate } from '@/store/layerUrlSet/dataSet';


// 实例化仓库，获取数据
const urlDataSetStore = UrlDataSetCreate();
const { onlineBaseLayerList } = storeToRefs(urlDataSetStore);


const defaultData = {
  data: onlineBaseLayerList.value
};

const state = reactive({
  val: JSON.stringify(defaultData),
  data: defaultData,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 3
});

// watch(
//   () => state.val,
//   newVal => {
//     try {
//       state.data = JSON.parse(newVal);
//       console.log("state.data:",state.data)
//     } catch (err) {
//       // console.log('JSON ERROR');
//     }
//   },{
//     deep: true
//   }
// );

watch(
  () => state.data,
  newVal => {
    try {
      state.val = JSON.stringify(newVal);
      urlDataSetStore.onlineBaseLayerList = JSON.parse(state.val).data;

    } catch (err) {
      // console.log('JSON ERROR');
    }
  },{
    deep: true
  }
);
</script>

<template>
  <n-card>
    <vue-json-pretty
      v-model:data="state.data"
      :deep="state.deep"
      :show-double-quotes="state.showDoubleQuotes"
      :show-line="state.showLine"
      :show-length="state.showLength"
      :show-icon="state.showIcon"
      :show-line-number="state.showLineNumber"
      :editable="state.editable"
    />
    <!-- :editable-trigger="(state.editableTrigger)" -->
  </n-card>
</template>
