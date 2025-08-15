<template>
  <!-- 绕点旋转 -->
  <div class="row-wrap">
    <div class="content">
      <div class="switch-box">
        <div class="text">{{ $t("rotateByPoint") }}</div>
        <n-switch v-model:value="state.rotateShow" size="small" />
      </div>
    </div>
  </div>

  <!-- 操作按钮 -->
  <div v-show="state.rotateShow">
    <div class="row-wrap">
      <div class="content">
        <div class="icon-list-box">
            <span v-for="(item, index) in state.itemOptions" :key="index" class="icon-span" :title="item.lable"
              :class="item.isSelect ? 'selected-icon' : ''" @click="changleIconItem(item)">
              <i class="iconfont iconSize" :class="item.iconName" style="margin-top: 0px"></i>
            </span>
          </div>
      </div>
    </div>

    <!-- 旋转速度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("rotateSpeed") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.speedRatio" :step="0.1" :min="0" :max="20" />
          <n-input-number v-model:value="state.speedRatio"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="0" :max="20" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 循环旋转 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.flyCircleLoop" :label="$t('rotateRepeat')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import tool from "@/tools/tool";

type stateType = {
  speedRatio: 1; // 旋转速度
  flyCircleLoop: true; // 是否循环
  rotateShow: false; // 是否绕点旋转
  itemOptions: any; // 功能选项
  position: any; // 绕点选择中心点
};

// 初始化变量
let state = reactive<stateType>({
  speedRatio: 1,
  flyCircleLoop: true,
  rotateShow: false,
  position: null,
  itemOptions: [
    {
      index: 1,
      lable: $t("add"),
      iconName: "icontianjia",
      isSelect: false,
    },
    {
      index: 2,
      lable: $t("play"),
      iconName: "iconbofang",
      isSelect: false,
    },
    {
      index: 3,
      lable: $t("pause"),
      iconName: "iconzanting",
      isSelect: false,
    },
    {
      index: 4,
      lable: $t("restore"),
      iconName: "iconfuwei",
      isSelect: false,
    },
  ],
});

const scene = viewer.scene;
let windowPosition = new SuperMap3D.Cartesian2();
let scratchTiltFrame = new SuperMap3D.Matrix4();
let scratchOldTransform = new SuperMap3D.Matrix4();
let listener;

function init() {
  if (!window.viewer) return;
  viewer.scene.camera.flyCircleLoop = state.flyCircleLoop;
  viewer.scene.camera.speedRatio = state.speedRatio;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clearFlyCircle();
});

// 功能切换
function changleIconItem(item: any) {
  state.itemOptions.map((itemObj) => {
    if (itemObj.index == item.index) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });

  switch (item.index) {
    case 1: {
      addCenter();
      break;
    }
    case 2: {
      startFlyCircle();
      break;
    }
    case 3: {
      clearFlyCircle();
      break;
    }
    case 4: {
      clearFlyCircle();
      reset();
      break;
    }
    default:
      break;
  }
}

// 绑定监听事件
function addCenter() {
  tool.setMouseCursor("measureCur");
  viewer.eventManager.addEventListener("CLICK", left_click, true);
}

// 添加点
function left_click(e: any) {
  state.position = e.message.position;
  tool.setMouseCursor("normal");
}

// 开始旋转
function startFlyCircle() {
  let center = viewer.scene.pickPosition(state.position);
  if (SuperMap3D.defined(center)) viewer.scene.camera.flyCircle(center); // 相机绕中心点旋转
  viewer.eventManager.removeEventListener("CLICK", left_click);
}

// 清除绕点旋转
function clearFlyCircle() {
  viewer.scene.camera.stopFlyCircle();
  tool.setMouseCursor("normal");
  viewer.eventManager.removeEventListener("CLICK", left_click);
}

// 复位-指北旋转
function reset() {
  windowPosition.x = scene.canvas.clientWidth / 2;
  windowPosition.y = scene.canvas.clientHeight / 2;
  let viewCenter = viewer.scene.pickPosition(windowPosition);
  if (!viewCenter || listener !== undefined) {
    return;
  }
  let tiltFrame = SuperMap3D.Transforms.eastNorthUpToFixedFrame(
    viewCenter,
    scene.globe.ellipsoid,
    scratchTiltFrame
  );
  // scene.camera.lookAtTransform(tiltFrame);
  let rotateAngle;
  listener = setInterval(function () {
    let currentHeading = SuperMap3D.Math.toDegrees(scene.camera.heading);
    let oldTransform = SuperMap3D.Matrix4.clone(
      scene.camera.transform,
      scratchOldTransform
    );
    scene.camera.lookAtTransform(tiltFrame);
    if (currentHeading > 180 && currentHeading < 360) {
      rotateAngle = SuperMap3D.Math.toRadians(360 - currentHeading) / 2;
      scene.camera.rotateLeft(rotateAngle); //顺时针旋转
      scene.camera.lookAtTransform(oldTransform);
      if (360 - currentHeading < 1) {
        //罗盘指北移除监听
        clearInterval(listener);
        listener = undefined;
      }
    } else {
      rotateAngle = SuperMap3D.Math.toRadians(currentHeading) / 2;
      scene.camera.rotateRight(rotateAngle); //逆时针旋转
      scene.camera.lookAtTransform(oldTransform);
      if (1 - currentHeading > 0) {
        //罗盘指北移除监听
        clearInterval(listener);
        listener = undefined;
      }
    }
  }, 100);
}

watch(
  () => state.speedRatio,
  (val) => {
    viewer.scene.camera.speedRatio = SuperMap3D.defaultValue(val, 0);
  }
);
watch(
  () => state.flyCircleLoop,
  (val) => {
    viewer.scene.camera.flyCircleLoop = val;
  }
);
</script>
