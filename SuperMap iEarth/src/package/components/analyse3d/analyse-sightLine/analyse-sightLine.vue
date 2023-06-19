<template>
  <!-- 通视分析 -->
  <sm-rowLayOut lableWidth="1rem">
    <template #item-lable>{{ $t("global.longitude") }}</template>
    <template #item-content>
      <n-input-number
        style="80%"
        v-model:value="state.degreesArray[0]"
        :show-button="false"
      >
        <template #suffix>°</template>
      </n-input-number>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut lableWidth="1rem">
    <template #item-lable>{{ $t("global.latitude") }}</template>
    <template #item-content>
      <n-input-number
        v-model:value="state.degreesArray[1]"
        :show-button="false"
      >
        <template #suffix>°</template>
      </n-input-number>
    </template>
  </sm-rowLayOut>

  <sm-rowLayOut lableWidth="1rem">
    <template #item-lable>{{ $t("global.elevation") }}</template>
    <template #item-content>
      <n-input-number
        v-model:value="state.degreesArray[2]"
        :show-button="false"
      >
        <template #suffix>M</template>
      </n-input-number>
    </template>
  </sm-rowLayOut>

  <n-divider />

  <!-- <sm-rowLayOut>
    <template #item-lable>{{ $t("global.visibleAreaColor") }}</template>
    <template #item-content>
      <sm-color-pick
        className="visibleColor"
        v-model:value="state.visibleColor"
      ></sm-color-pick>
    </template>
  </sm-rowLayOut> -->

  <!-- <sm-rowLayOut>
    <template #item-lable>{{ $t("global.invisibleAreaColor") }}</template>
    <template #item-content>
      <sm-color-pick
        className="hiddenColor"
        v-model:value="state.hiddenColor"
      ></sm-color-pick>
    </template>
  </sm-rowLayOut> -->

  <!-- <sm-rowLayOut>
    <template #item-lable>{{ $t("global.barrierHighlightColor") }}</template>
    <template #item-content>
      <sm-color-pick
        className="barrierColor"
        v-model:value="state.barrierColor"
      ></sm-color-pick>
    </template>
  </sm-rowLayOut> -->

  <!-- <sm-rowLayOut>
    <template #item-lable>{{ $t("global.displayBarrier") }}</template>
    <template #item-content>
      <n-checkbox v-model:checked="state.showBarrierPoints"></n-checkbox>
    </template>
  </sm-rowLayOut> -->

  <sm-rowLayOut contentMarginLeft="-0.2rem">
    <template #item-lable>{{ $t("global.highlightBarrier") }}</template>
    <template #item-content>
      <div class="check-color-pick">
        <n-checkbox v-model:checked="state.highlightBarrier"></n-checkbox>
        <div class="color-pick-bg">
          <sm-color-pick
            className="solidColor"
            v-model:value="state.solidColor"
          ></sm-color-pick>
        </div>
      </div>
    </template>
  </sm-rowLayOut>

  <sm-btnGroup>
    <template #btn-left>
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="analysis"
        >{{ $t("global.analysis") }}</n-button
      >
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clear">{{
        $t("global.clear")
      }}</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import tool from "@/tools/tool";
import sightline from "./sightline.js";

type stateType = {
  degreesArray: number[]; // 存放显示经纬度的数组
  visibleColor: string; // 可视区域颜色
  hiddenColor: string; // 不可视区域颜色
  barrierColor: string; // 障碍物高亮颜色
  highlightBarrier: boolean; // 是否高亮障碍物
  lineWidth: number; // 通视分析线宽度
  showBarrierPoints: boolean; // 是否显示障碍点
  viewPointlnglatFlag: boolean; // 将第一个点击点，当做观察点，并获取其经纬度坐标
  solidColor: string;
};

let state = reactive<stateType>({
  degreesArray: [0, 0, 0],
  visibleColor: "rgba(255, 186, 1, 1)",
  hiddenColor: "rgb(200, 0, 0)",
  barrierColor: "rgba(255, 186, 1, 1)",
  highlightBarrier: false,
  lineWidth: 3,
  showBarrierPoints: false,
  viewPointlnglatFlag: true,
  solidColor: "rgba(250, 196, 65, 1)",
});

// 初始化数据
let sight: any, clickFlag: any, timer: any;
init();

function init() {
  if (!viewer) return;
  sight = new sightline(viewer, {});
}

//分析
function analysis() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  //鼠标左键事件监听
  viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
  viewer.eventManager.addEventListener("MOUSE_MOVE", MOUSE_MOVE, true);
  viewer.eventManager.addEventListener("RIGHT_CLICK", RIGHT_CLICK, true);
}

//   点击左键确认观察者点和目标点
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

// //鼠标右键确认分析距离和方向，不再执行鼠标移动事件中对可视域的操作
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
  () => state.lineWidth,
  (val) => {
    sight.sightline.lineWidth = val;
  }
);
watch(
  () => state.visibleColor,
  (val) => {
    sight.sightline.visibleColor = Cesium.Color.fromCssColorString(val);
  }
);
watch(
  () => state.hiddenColor,
  (val) => {
    sight.sightline.hiddenColor = Cesium.Color.fromCssColorString(val);
  }
);
watch(
  () => state.barrierColor,
  (val) => {
    let color = Cesium.Color.fromCssColorString(val);
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
watch(
  () => state.showBarrierPoints,
  (val) => {
    sight.setBarrierPointsVisible(val);
  }
);

// 销毁
onBeforeUnmount(() => {
  clear();
  sight.destroy();
});
</script>


<style lang="scss" scoped>
.btn-info {
  color: #fff;
  background: rgba(52, 153, 229, 1);
}
.check-color-pick {
  display: flex;
  // justify-content: space-between;
  align-items: center;
}
.color-pick-bg {
  width: 100%;
  height: 0.32rem;
  border-radius: 0.04rem;
  background: rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  padding: 0 0.12rem;

  margin-left: 0.1rem;
}
</style>