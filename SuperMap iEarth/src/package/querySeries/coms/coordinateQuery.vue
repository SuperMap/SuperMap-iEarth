<!-- 坐标查询 -->
<template>
  <!-- 开启 -->
  <div class="row-wrap">
    <div class="content">
      <div class="switch-box">
        <div class="text">{{ $t("openCoordinateQuery") }}</div>
        <n-switch v-model:value="state.useQuery" size="small" />
      </div>
    </div>
  </div>

  <!-- 经度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("longitude") }}</div>
    <div class="content">
      <n-input v-model:value="state.longitude" :placeholder="$t('coordinateQueryTip')" disabled>
        <template #suffix>°</template>
      </n-input>
    </div>
  </div>

  <!-- 纬度 -->
  <div class="row-wrap">
    <div class="label">{{ $t("latitude") }}</div>
    <div class="content">
      <n-input v-model:value="state.latitude" :placeholder="$t('coordinateQueryTip')" disabled>
        <template #suffix>°</template>
      </n-input>
    </div>
  </div>

  <!-- 海拔 -->
  <div class="row-wrap">
    <div class="label">{{ $t("elevation") }}</div>
    <div class="content">
      <n-input v-model:value="state.altitude" :placeholder="$t('coordinateQueryTip')" disabled>
        <template #suffix>{{ $t("meter") }}</template>
      </n-input>
    </div>
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
