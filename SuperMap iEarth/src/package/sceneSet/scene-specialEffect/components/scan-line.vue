<!-- 扫描线 -->
<template>
  <!-- 扫描模式 -->
  <div class="row-wrap">
    <div class="label">{{ $t("scanMode") }}</div>
    <div class="content">
      <n-radio-group v-model:value="state.scanMode" name="scanMode">
        <n-radio :value="0">{{ $t("lineShape") }}</n-radio>
        <n-radio :value="1">{{ $t("circleShape") }}</n-radio>
      </n-radio-group>
    </div>
  </div>

  <!-- 扫描颜色 -->
  <div class="row-wrap">
    <div class="label">{{ $t("scanColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.scanColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 扫描纹理 -->
  <div class="row-wrap">
    <div class="label">{{ $t("scanTexture") }}</div>
    <div class="content">
      <n-select v-model:value="state.selectedTexture" :options="state.scanTextures" />
    </div>
  </div>

  <!-- 扫描线宽度 -->
  <div class="row-wrap" v-if="state.scanMode == 0">
    <div class="label">{{ $t("scanWidth") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.lineWidth" :step="1" :min="1" :max="1000" />
        <n-input-number v-model:value="state.lineWidth"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="1000" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 扫描速度 -->
  <div class="row-wrap" v-if="state.scanMode == 0">
    <div class="label">{{ $t("scanSpeed") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.speed" style="width: 70%" :step="1" :min="1" :max="200" />
        <n-input-number v-model:value="state.speed"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="200" placeholder="" size="small" />
      </div>
    </div>
  </div>

  <!-- 扫描周期 or 持续时间 -->
  <!-- 
  <div class="row-wrap" v-if="state.scanMode == 0">
    <div class="label">{{ $t("scanPeriod") }}</div>
    <div class="content">
      <div class="slider-box-new">
        <n-slider v-model:value="state.period" style="width: 70%" :step="1" :min="1" :max="20" />
        <n-input-number v-model:value="state.period"  :update-value-on-input="false"
          :bordered="false" :show-button="false" :min="1" :max="20" placeholder="" size="small" />
      </div>
    </div>
  </div> -->

  <!-- 自定义扫描方向 -->
  <div class="row-wrap" v-show="state.scanMode === 0">
    <div class="content">
      <n-checkbox v-model:checked="state.customDirection" :label="$t('customScanDirection')" />
    </div>
  </div>

  <!-- 自定义扫描中心 -->
  <div class="row-wrap" v-show="state.scanMode === 1">
    <div class="content">
      <n-checkbox v-model:checked="state.customCenter" :label="$t('customScanCenter')" />
    </div>
  </div>

  <!-- 操作按钮 -->
  <div class="row-btns">
    <n-button @click="addScans" class="operate" type="info" :focusable="false" :disabled="isPlane">{{
    $t("add") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";
import tool from "@/tools/tool";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  scanMode: number; // 扫描模式
  scanColor: string; // 扫描颜色
  scanTextures: any; // 扫描纹理
  selectedTexture: number; // 当前选择的纹理索引
  lineWidth: number; //获取或设置线状扫描线的宽度，单位：米。
  period: number; //获取或设置扫描线的运行周期，单位：秒。
  speed: number; //获取或设置扫描线的运行速度，单位：米/秒。
  scanShow: boolean; //
  customDirection: boolean; // 自定义扫描方向
  customCenter: boolean; // 自定义扫描中心
  addTextures: any; // 纹理选项
};

// 初始化变量
let state = reactive<stateType>({
  scanMode: 0,
  scanColor: "rgba(162,224,252,1)",
  scanTextures: [{ label: () => "无纹理", value: 0, url: "" }],
  selectedTexture: 0,
  lineWidth: 100, //获取或设置线状扫描线的宽度，单位：米。
  period: 3.0, //获取或设置扫描线的运行周期，单位：秒。
  speed: 100, //获取或设置扫描线的运行速度，单位：米/秒。
  scanShow: false,
  customDirection: true,
  customCenter: true,
  addTextures: [
    {
      name: $t("lineTexture1"),
      type: "line",
      url: "./images/scanTexture/line-1.jpg",
    },
    {
      name: $t("lineTexture2"),
      type: "line",
      url: "./images/scanTexture/line-2.jpg",
    },
    {
      name: $t("ringTexture1"),
      type: "ring",
      url: "./images/scanTexture/ring-1.jpg",
    },
    {
      name: $t("ringTexture2"),
      type: "ring",
      url: "./images/scanTexture/ring-2.jpg",
    },
    {
      name: $t("loopedhexagonTexture"),
      type: "ring",
      url: "./images/scanTexture/ring-3.jpg",
    },
  ],
});

let defaultLineTextrues = [
  { label: () => $t("noneScanTexture"), value: 0, url: "" },
];
let defaultCircleTextrues = [
  { label: () => $t("noneScanTexture"), value: 0, url: "" },
];

// 初始化
function init() {
  if (!window.viewer) return;
  viewer.scene.scanEffect.color = SuperMap3D.Color.fromCssColorString(
    state.scanColor
  );
  viewer.scene.scanEffect.textureUrl = "";
  viewer.scene.scanEffect.lineWidth = Number(state.lineWidth);
  viewer.scene.scanEffect.period = Number(state.period);
  viewer.scene.scanEffect.speed = Number(state.speed);
  viewer.scene.scanEffect.centerPostion = new SuperMap3D.Cartesian3.fromDegrees(
    0,
    0,
    0
  );
}

onMounted(() => {
  if(viewer.scene.mode == 1){
    window["$message"].warning($t('scanNotSupportPlane'));
  }
  init();
  setTexturesByProps();
});

onBeforeUnmount(() => {
  clear();
  let count = viewer.scene.scanEffect.count;
  for (let i = 0; i < count; i++) {
    viewer.scene.scanEffect.remove(i);
  }
});

let isPlane = viewer.scene.mode == 1 ? true : false;

// 设置纹理
function setTexturesByProps() {
  defaultLineTextrues = defaultLineTextrues.slice(0, 1);
  defaultCircleTextrues = defaultCircleTextrues.slice(0, 1);
  state.addTextures.forEach((el: any) => {
    let obj: any = {
      label: el.name,
      url: el.url,
    };
    if (el.type === "line") {
      obj.value = defaultLineTextrues.length;
      defaultLineTextrues.push(obj);
    } else {
      obj.value = defaultCircleTextrues.length;
      defaultCircleTextrues.push(obj);
    }
  });
  if (state.scanMode < 1) state.scanTextures = defaultLineTextrues;
  else state.scanTextures = defaultCircleTextrues;
}

// 添加线扫描
function addLineScans(positions) {
  let dir = new SuperMap3D.Cartesian3();
  SuperMap3D.Cartesian3.subtract(positions[1], positions[0], dir); // 获取扫描方向向量
  if (state.scanShow) {
    viewer.scene.scanEffect.add(positions[0]);
    viewer.scene.scanEffect.lineMoveDirection = dir;
    return;
  }
  viewer.scene.scanEffect.centerPostion = positions[0];
  viewer.scene.scanEffect.lineMoveDirection = dir;
  state.scanShow = true;
}

// 添加环状扫描
function addCircleScans(e) {
  tool.setMouseCursor("normal");
  let centerPosition = viewer.scene.pickPosition(e.message.position);
  if (centerPosition) {
    if (state.scanShow) {
      viewer.scene.scanEffect.add(centerPosition);
      return;
    }
    viewer.scene.scanEffect.centerPostion = centerPosition;
    state.scanShow = true;
    viewer.eventManager.removeEventListener("CLICK", addCircleScans);
  }
}

// 扫描
function addScans() {
  if (state.scanMode < 1) {
    drawPolyline();
    window["$notification"].create({
      content: () => $t("addScanLineTip"),
      duration: 3500,
    });
    return;
  }
  tool.setMouseCursor("measureCur");
  viewer.eventManager.addEventListener("CLICK", addCircleScans, true);
}

// 画线
async function drawPolyline() {
  const positions = await drawHandler.startPolyline();
  addLineScans(positions);
}

// 清除
function clear() {
  let index = viewer.scene.scanEffect.count - 1;
  if (viewer.scene.scanEffect.count == 1) {
    state.scanShow = false;
  }
  viewer.scene.scanEffect.remove(index);

  viewer.eventManager.removeEventListener("CLICK", addCircleScans);
  drawHandler.destroy();
}

// 监听
watch(
  () => state.scanShow,
  (val) => {
    viewer.scene.scanEffect.show = val;
  }
);
watch(
  () => state.scanMode,
  (val) => {
    if (val < 1) {
      viewer.scene.scanEffect.mode = SuperMap3D.ScanEffectMode.LINE;
      state.scanTextures = defaultLineTextrues;
      return;
    }
    viewer.scene.scanEffect.mode = SuperMap3D.ScanEffectMode.CIRCLE;
    state.scanTextures = defaultCircleTextrues;
  }
);
watch(
  () => state.scanColor,
  (val) => {
    viewer.scene.scanEffect.color = SuperMap3D.Color.fromCssColorString(val);
  }
);
watch(
  () => state.selectedTexture,
  (val) => {
    viewer.scene.scanEffect.textureUrl = state.scanTextures[val].url;
  }
);
watch(
  () => state.scanTextures,
  () => {
    state.selectedTexture = 0;
  }
);
watch(
  () => state.lineWidth,
  (val) => {
    viewer.scene.scanEffect.lineWidth = Number(val);
  }
);
watch(
  () => state.period,
  (val) => {
    viewer.scene.scanEffect.period = Number(val);
  }
);
watch(
  () => state.speed,
  (val) => {
    viewer.scene.scanEffect.speed = Number(val);
  }
);
watch(
  () => state.addTextures,
  (val) => {
    if (typeof val === "object") {
      setTexturesByProps();
    }
  }
);
</script>
