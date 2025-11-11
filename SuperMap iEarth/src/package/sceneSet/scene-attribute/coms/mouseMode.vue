<!-- 鼠标操作习惯 -->
<template>
  <div class="sence-config-container">
    <!-- 右键缩放 -->
    <div class="row-wrap">
      <div class="content">
        <div class="switch-box">
          <div class="text">{{ $t("defaultMouseMode") }}</div>
          <n-switch v-model:value="state.isSuperMap3DMode" size="small" @update:value="handleSuperMapChange" />
        </div>
      </div>
    </div>

    <!-- 右键俯仰 -->
    <div class="row-wrap">
      <div class="content">
        <div class="switch-box">
          <div class="text">{{ $t("arcgisMouseMode") }}</div>
          <n-switch v-model:value="state.isArcGISMode" size="small" @update:value="handleArcGISChange" />
        </div>
      </div>
    </div>

    <!-- 缩放速度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("zoomScale") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.zoomFactor" :step="1" :min="1" :max="30" />
          <n-input-number v-model:value="state.zoomFactor"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="1" :max="30" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";

let state = reactive({
  zoomFactor: Number(viewer.scene.screenSpaceCameraController.zoomFactor),  // 鼠标缩放系数
  isSuperMap3DMode: true,
  isArcGISMode: false,
});

// 判断鼠标操作类型
onMounted(() => {
  let customMouseMode = viewer.scene.screenSpaceCameraController.customMouseMode;
  if (customMouseMode && customMouseMode == 'ArcGIS') {
    state.isArcGISMode = true;
    state.isSuperMap3DMode = false;
  } else {
    state.isArcGISMode = false;
    state.isSuperMap3DMode = true;
  }
})

// 设置ArcGIS鼠标操作模式
function setArcGISMouseMode() {
    viewer.scene.screenSpaceCameraController.customMouseMode = 'ArcGIS';
    viewer.scene.screenSpaceCameraController.inverseTilt = true;
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [SuperMap3D.CameraEventType.WHEEL, SuperMap3D.CameraEventType.MIDDLE_DRAG];
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [SuperMap3D.CameraEventType.RIGHT_DRAG];
}

// 设置默认原生的鼠标操作模式
function setSuperMap3DMouseMode() {
    viewer.scene.screenSpaceCameraController.customMouseMode = 'SuperMap3D';
    viewer.scene.screenSpaceCameraController.inverseTilt = false;
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [SuperMap3D.CameraEventType.RIGHT_DRAG, SuperMap3D.CameraEventType.WHEEL, SuperMap3D.CameraEventType.PINCH];
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [SuperMap3D.CameraEventType.MIDDLE_DRAG, SuperMap3D.CameraEventType.PINCH, {
        eventType: SuperMap3D.CameraEventType.LEFT_DRAG,
        modifier: SuperMap3D.KeyboardEventModifier.CTRL
    }, {
        eventType: SuperMap3D.CameraEventType.RIGHT_DRAG,
        modifier: SuperMap3D.KeyboardEventModifier.CTRL
    }];
}

function handleSuperMapChange(value){
    state.isArcGISMode = !value;
    if(value){
        setSuperMap3DMouseMode();
    }else{
        setArcGISMouseMode();
    }
}
function handleArcGISChange(value){
    state.isSuperMap3DMode = !value;
    if(value){
        setArcGISMouseMode();
    }else{
        setSuperMap3DMouseMode();
    }
}

watch(
  () => state.zoomFactor,
  (val) => {
    viewer.scene.screenSpaceCameraController.zoomFactor = Number(val);
  }
);
</script>
  