<template>
  <!-- 通视分析 -->
  <div class="row-item">
    <span>经度</span>
    <n-input-number
      style="width: 1.96rem"
      v-model:value="state.degreesArray[0]"
      :show-button="false"
      disabled
    >
      <template #suffix>°</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>纬度</span>
    <n-input-number
      style="width: 1.96rem"
      v-model:value="state.degreesArray[1]"
      :show-button="false"
      disabled
    >
      <template #suffix>°</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>高程</span>
    <n-input-number
      style="width: 1.96rem"
      v-model:value="state.degreesArray[2]"
      :show-button="false"
      disabled
    >
      <template #suffix>米</template>
    </n-input-number>
  </div>

  <n-divider />

  <div class="row-item">
    <span>高亮障碍物</span>
    <div class="check-color-pick">
      <n-checkbox v-model:checked="state.highlightBarrier"></n-checkbox>
      <div class="color-pick-box">
        <!-- <div class="color-pick-box-container"> -->
          <n-color-picker
            v-model:value="state.barrierColor"
            :render-label="
              () => {
                return '';
              }
            "
            :disabled="!state.highlightBarrier"
            size="small"
          ></n-color-picker>
        <!-- </div> -->
      </div>
    </div>
  </div>
  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      class="ans-btn"
      @click="analysis"
      >分析</n-button
    >
    <n-button class="btn-secondary" @click="clear" >清除</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
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

// 初始化数据
let sight: any, clickFlag: any, timer: any;

function init() {
  if (!viewer) return;
  sight = new sightline(viewer, {});
}
init();


// 分析
function analysis() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
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
    let result = tool.CartesiantoDegrees(position);

    state.degreesArray = result.map((num: any) => Number(num.toFixed(2)));
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
  document.body.classList.remove("measureCur");
  sight.removeMoveTargetPoint();
  removeEvent();
  if (state.highlightBarrier) sight.setBarrierHighLight();
  sight.setBarrierPointsVisible(true);
}

// 清除
function clear() {
  state.viewPointlnglatFlag = true;
  state.degreesArray = [0, 0, 0];
  sight.clear();
  document.body.classList.remove("measureCur");
  removeEvent();
}

function removeEvent() {
  state.viewPointlnglatFlag = true;
  viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
  viewer.eventManager.removeEventListener("MOUSE_MOVE", MOUSE_MOVE); //移除鼠标点击事件监听
  viewer.eventManager.removeEventListener("RIGHT_CLICK", RIGHT_CLICK); //移除鼠标点击事件监听
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
  (newValue) => {
    if (newValue) sight.setBarrierHighLight();
    else sight.clearBarrierHighLight();
  }
);

// 销毁
onBeforeUnmount(() => {
  clear();
  sight.destroy();
});
</script>


<style lang="scss" scoped>
// .btn-row-item {
//   @include setBtnRowItem();
// }

.btn-info {
  color: #fff;
  background: rgba(52, 153, 229, 1);
}
.check-color-pick {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.color-pick-bg {
  width: 1.68rem;
  height: 0.32rem;
  border-radius: 0.04rem;
  background: rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  padding: 0 0.12rem;
}
</style>