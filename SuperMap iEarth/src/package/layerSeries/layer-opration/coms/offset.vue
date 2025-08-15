<!-- S3M图层偏移 -->
<template>
  <!-- 选择图层 -->
  <div class="row-wrap">
    <div class="label">{{ $t("chooseLayer") }}</div>
    <div class="content">
      <n-select v-model:value="state.selectS3MName" :options="state.s3mlayers" />
    </div>
  </div>

  <!-- 偏移模式 -->
  <!-- <div class="row-wrap">
    <div class="label">{{ $t("offsetMode") }}</div>
    <div class="content">
      <n-radio-group v-model:value="state.offsetMode" name="shadowMode">
            <n-radio :value="0"><n-ellipsis >{{$t('selected')}}</n-ellipsis></n-radio>
            <n-radio :value="1"><n-ellipsis >{{$t('polygon')}} </n-ellipsis></n-radio>
        </n-radio-group>
    </div>
  </div> -->

  <div v-show="state.offsetMode === 0">
    <!-- 沿X轴偏移 -->
    <div class="row-wrap">
      <div class="label">{{ $t("offsetX") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.offsetX" :min="-50" :max="50" />
          <n-input-number v-model:value="state.offsetX" :update-value-on-input="false" :bordered="false"
            :show-button="false" :min="-50" :max="50" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 沿Y轴偏移 -->
    <div class="row-wrap">
      <div class="label">{{ $t("offsetY") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.offsetY" :min="-50" :max="50" />
          <n-input-number v-model:value="state.offsetY" :update-value-on-input="false" :bordered="false"
            :show-button="false" :min="-50" :max="50" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 沿Z轴偏移 -->
    <div class="row-wrap">
      <div class="label">{{ $t("offsetZ") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.offsetZ" :min="-50" :max="50" />
          <n-input-number v-model:value="state.offsetZ" :update-value-on-input="false" :bordered="false"
            :show-button="false" :min="-50" :max="50" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="reset" class="operate" type="info" :focusable="false">{{
    $t("reset") }}</n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import layerManagement from "@/tools/layerManagement";


type StateType = {
  s3mlayers: any; //当前存在的可选择s3m图层
  selectS3MName: string; //默认选择图层index
  offsetX: number; //沿X轴偏移
  offsetY: number; //沿Y轴偏移
  offsetZ: number; //沿Z轴偏移
  polygonOffsetFactor: number; //偏移因子
  polygonOffsetUnit: number; //偏移单位
  offsetMode: number; //操作类型
};

// 初始化变量
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectS3MName: window.iEarthBindData.CurrentS3MLayerName, //默认选择图层index
  offsetX: 0, //沿X轴偏移
  offsetY: 0, //沿Y轴偏移
  offsetZ: 0, //沿Z轴偏移
  polygonOffsetFactor: 0, //偏移因子
  polygonOffsetUnit: 0, //偏移单位
  offsetMode: 0,
});

let currentS3MLayer:any = undefined;

function init() {
  state.s3mlayers = layerManagement.getS3MLayerList();
  currentS3MLayer = viewer.scene.layers.find(state.selectS3MName);
  if(currentS3MLayer) currentS3MLayer.selectEnabled = true;
  selectedoffsetChange(true);
}

onMounted(() => {
  init();
  window["$message"].success($t("chooseThenOffset"));
});

onBeforeUnmount(() => {
  reset();
});


// 设置偏移
function setObjsOffset() {
  let ids = currentS3MLayer.getSelection();
  currentS3MLayer.removeAllObjsOffset(); // 移除所有图元的偏移
  if (ids.length > 0) {
    currentS3MLayer.setObjsOffset(ids);
  }
}

// 重置偏移
function reset() {
  state.offsetX = 0;
  state.offsetY = 0;
  state.offsetZ = 0;
  currentS3MLayer.selectedTranslate = new SuperMap3D.Cartesian3(
    0,
    0,
    0
  );
  currentS3MLayer.selectEnabled = true;
}

// 设置选中模型偏移
function selectedoffsetChange(isSelected: boolean) {
  if (!currentS3MLayer) return;
  if (isSelected) {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    currentS3MLayer.selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
    viewer.eventManager.addEventListener("CLICK", setObjsOffset, true);
  } else {
    viewer.eventManager.removeEventListener("CLICK", setObjsOffset);
    currentS3MLayer.selectedTranslate = new SuperMap3D.Cartesian3(
      0,
      0,
      0
    );
    currentS3MLayer.removeAllObjsOffset();
    currentS3MLayer.releaseSelection(); // 释放选择集
  }
}

// 监听
watch(
  () => state.offsetX,
  () => {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    currentS3MLayer.selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
  }
);
watch(
  () => state.offsetY,
  () => {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    currentS3MLayer.selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
  }
);
watch(
  () => state.offsetZ,
  () => {
    let xOffset = Number(state.offsetX);
    let yOffset = Number(state.offsetY);
    let zOffset = Number(state.offsetZ);
    currentS3MLayer.selectedTranslate = new SuperMap3D.Cartesian3(
      xOffset,
      yOffset,
      zOffset
    );
  }
);
watch(
  () => state.polygonOffsetFactor,
  (val) => {
    if (currentS3MLayer){      
      currentS3MLayer.setPolygonoffset(
        Number(val),
        Number(state.polygonOffsetUnit)
      );
    }
  }
);
watch(
  () => state.polygonOffsetUnit,
  (val) => {
    if (currentS3MLayer){
      currentS3MLayer.setPolygonoffset(
        Number(state.polygonOffsetFactor),
        Number(val)
      );
    }
  }
);
watch(
  () => state.selectS3MName,
  (val) => {
    currentS3MLayer = scene.layers.find(val);
    if(currentS3MLayer) currentS3MLayer.selectEnabled = true;
  }
);
</script>
