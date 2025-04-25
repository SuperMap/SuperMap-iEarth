<template>
  <div class="row-item">
    <span>{{ $t("openCoordinateQuery") }}</span>
    <div style="width: 1.8rem">
      <n-switch v-model:value="state.useQuery" size="small" />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("longitude") }}</span>
    <n-input
      style="width: 2.2rem"
      v-model:value="state.longitude"
      :placeholder="$t('coordinateQueryTip')"
      disabled
    >
      <template #suffix>°</template>
    </n-input>
  </div>

  <div class="row-item">
    <span>{{ $t("latitude") }}</span>
    <n-input
      style="width: 2.2rem"
      v-model:value="state.latitude"
      :placeholder="$t('coordinateQueryTip')"
      disabled
    >
      <template #suffix>°</template>
    </n-input>
  </div>

  <div class="row-item">
    <span>{{ $t("elevation") }}</span>
    <n-input
      style="width: 2.2rem; margin-bottom: 0.1rem"
      v-model:value="state.altitude"
      :placeholder="$t('coordinateQueryTip')"
      disabled
    >
      <template #suffix>{{ $t("meter") }}</template>
    </n-input>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onBeforeUnmount, watch } from "vue";

const state = reactive({
  useQuery: false,
  longitude:'',
  latitude:'',
  altitude:'',
})

const handlerSearch = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);

onBeforeUnmount(()=>{
  clearQuery()
  handlerSearch.destroy();
})


function startQuery() {
  handlerSearch.setInputAction(function (click) {
    let position = viewer.scene.pickPosition(click.position);
    let result = window.iEarthTool.Cartesian3ToDegreeArray(position);
    console.log("查询结果:",result);
    if(result && result.length>=3){
      state.longitude = Number(result[0]).toFixed(4);
      state.latitude = Number(result[1]).toFixed(4);
      state.altitude = Number(result[2]).toFixed(2);
    }
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

function clearQuery(){
  state.longitude = "";
  state.latitude = "";
  state.altitude = "";
  handlerSearch.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

watch(
  () => state.useQuery,
  (val) => {
    if (val) {
      startQuery(); // 隐藏面板，开启DB属性查询
    } else {
      clearQuery();
    }
  }
);
</script>
