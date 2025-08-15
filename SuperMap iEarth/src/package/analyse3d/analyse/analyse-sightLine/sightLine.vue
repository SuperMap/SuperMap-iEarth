<!-- 通视分析 -->
<template>
  <div class="row-wrap">
    <div class="label">{{ $t("longitude") }}</div>
    <div class="content">
      <n-input-number v-model:value="longitude" :show-button="false" disabled>
        <template #suffix>°</template>
      </n-input-number>
    </div>
  </div>

  <div class="row-wrap">
    <div class="label">{{ $t("latitude") }}</div>
    <div class="content">
      <n-input-number v-model:value="latitude" :show-button="false" disabled>
        <template #suffix>°</template>
      </n-input-number>
    </div>
  </div>

  <div class="row-wrap">
    <div class="label">{{ $t("elevation") }}</div>
    <div class="content">
      <n-input-number v-model:value="altitude" :show-button="false" disabled>
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="analysis" class="operate" type="info" :focusable="false">{{
    $t("analysis") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch, computed } from "vue";
import tool from "@/tools/tool";
import sightline from "./js/sightline.js";

type stateType = {
  degreesArray: number[]; // 存放显示经纬度的数组
  viewPointlnglatFlag: boolean; // 将第一个点击点，当做观察点，并获取其经纬度坐标
  highlightBarrier: boolean; // 是否高亮障碍物
  barrierColor: string; // 障碍物高亮颜色
};

let state = reactive<stateType>({
  degreesArray: [0, 0, 0],
  viewPointlnglatFlag: true,
  highlightBarrier: false,
  barrierColor: "rgba(250, 196, 65, 1)",
});

// 初始化变量
let clickFlag: any, timer: any;
let sight = new sightline(viewer, {});

function init() {
  if (!viewer) return;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
  sight.destroy();
});

let longitude = computed(() => {
  return Number(state.degreesArray[0]).toFixed(4);
});
let latitude = computed(() => {
  return Number(state.degreesArray[1]).toFixed(4);
});
let altitude = computed(() => {
  return Number(state.degreesArray[2]).toFixed(2);
});

// 分析
function analysis() {
  tool.setMouseCursor("measureCur");

  //鼠标左键事件监听
  viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
  viewer.eventManager.addEventListener("MOUSE_MOVE", MOUSE_MOVE, true);
  viewer.eventManager.addEventListener("RIGHT_CLICK", RIGHT_CLICK, true);
}

// 点击左键确认观察者点和目标点
function LEFT_CLICK(e: any) {
  clickFlag = true;
  clearTimeout(timer);
  timer = setTimeout(() => {
    clickFlag = false;
  }, 200); //添加点时延迟移动添加目标点
  let position = viewer.scene.pickPosition(e.message.position);
  //   获取第一个点坐标
  if (state.viewPointlnglatFlag) {
    let result = window.iEarthTool.Cartesian3ToDegreeArray(position);
    // state.degreesArray = result.map((num: any) => Number(num.toFixed(3)));
    state.degreesArray = result;
    state.viewPointlnglatFlag = false;
  }
  sight.addPoints(position);
}

// 鼠标移动实时分析
function MOUSE_MOVE(e: any) {
  if (clickFlag) return;
  let endPosition = viewer.scene.pickPosition(e.message.endPosition);
  sight.addMoveTargetPoint(endPosition);
}

// 鼠标右键确认分析距离和方向，不再执行鼠标移动事件中对可视域的操作
function RIGHT_CLICK() {
  tool.setMouseCursor("normal");
  sight.removeMoveTargetPoint();
  removeEvent();
  if (state.highlightBarrier) sight.setBarrierHighLight();
  sight.setBarrierPointsVisible(true);
}

// 移除绑定的监听事件
function removeEvent() {
  state.viewPointlnglatFlag = true;
  viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
  viewer.eventManager.removeEventListener("MOUSE_MOVE", MOUSE_MOVE); //移除鼠标点击事件监听
  viewer.eventManager.removeEventListener("RIGHT_CLICK", RIGHT_CLICK); //移除鼠标点击事件监听
}

// 清除
function clear() {
  state.viewPointlnglatFlag = true;
  state.degreesArray = [0, 0, 0];
  sight.clear();
  tool.setMouseCursor("normal");
  removeEvent();
}

// 监听
watch(
  () => state.barrierColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    sight.barrierColor = color;
    if (state.highlightBarrier) sight.setBarrierHighLight();
  }
);

watch(
  () => state.highlightBarrier,
  (val) => {
    if (val) sight.setBarrierHighLight();
    else sight.clearBarrierHighLight();
  }
);
</script>
