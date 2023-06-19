<template>
  <sm-rowLayOut>
    <template #item-lable>绕点旋转</template>
    <template #item-content>
      <n-switch v-model:value="state.rotateShow" />
    </template>
  </sm-rowLayOut>

  <div v-show="state.rotateShow">
    <sm-rowLayOut slotType="slider">
      <template #item-lable>旋转速度</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.speedRatio"
          :min="0"
          :max="20"
          :step="0.1"
          style="width: 80%"
        />
        <n-input-number
          v-model:value="state.speedRatio"
          :bordered="false"
          style="width: 30%"
          :show-button="false"
        >
          <!-- <template #suffix>o/s</template> -->
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>循环旋转</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.flyCircleLoop"></n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="startFlyCircle"
          >{{ locale.FlyCircle }}</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clearFlyCircle">{{
          locale.Stop
        }}</n-button>
      </template>
    </sm-btnGroup>
  </div>
</template>
  
<script lang='ts' setup>
import { onBeforeUnmount, watch, reactive } from "vue";
import locale from "@/tools/locateTemp";

// 初始化数据
let state = reactive({
  speedRatio: 1,
  flyCircleLoop: true,
  rotateShow: false, // 绕点旋转
});

function init() {
  if (!window.viewer) return;
  viewer.scene.camera.flyCircleLoop = state.flyCircleLoop;
  viewer.scene.camera.speedRatio = state.speedRatio;
}

init();

function startFlyCircle() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", left_click, true);
}

function left_click(e) {
  let center = viewer.scene.pickPosition(e.message.position);
  if (Cesium.defined(center)) viewer.scene.camera.flyCircle(center); // 相机绕中心点旋转
  document.body.classList.remove("measureCur");
  viewer.eventManager.removeEventListener("CLICK", left_click);
}

function clearFlyCircle() {
  viewer.scene.camera.stopFlyCircle();
  document.body.classList.remove("measureCur");
  viewer.eventManager.removeEventListener("CLICK", left_click);
}

watch(
  () => state.speedRatio,
  (val) => {
    viewer.scene.camera.speedRatio = Cesium.defaultValue(val, 0);
  }
);
watch(
  () => state.flyCircleLoop,
  (val) => {
    viewer.scene.camera.flyCircleLoop = val;
  }
);

onBeforeUnmount(() => {
  clearFlyCircle();
});
</script>
  
  
  
  
  
  
  
  
  
  
  