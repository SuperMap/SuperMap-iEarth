<template>
  <div class="row-item">
    <span>{{ $t('global.scanMode') }}</span>
    <div style="width: 1.96rem;">
      <n-radio-group v-model:value="state.scanMode" name="scanMode">
          <n-radio :value="0">{{ $t('global.lineShape') }}</n-radio>
          <n-radio :value="1">{{ $t('global.circleShape') }}</n-radio>
      </n-radio-group>
    </div>
  </div>
  <div class="row-item">
    <span>{{ $t('global.scanColor') }}</span>
    <div class="color-pick-box" style="width: 1.96rem;">
      <n-color-picker v-model:value="state.scanColor" :render-label="() => {
          return '';
        }
        " size="small"></n-color-picker>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t('global.scanTexture') }}</span>
    <n-select style="width: 1.96rem;" v-model:value="state.selectedTexture" :options="state.scanTextures" />
  </div>

  <div class="row-item">
    <span>{{ $t('global.scanWidth') }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.lineWidth" style="width: 70%" :step="1" :min="1" :max="1000" />
      <n-input-number 
          v-model:value="state.lineWidth" 
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false" 
          :show-button="false" 
          :min="1"
          :max="1000"
          placeholder=""
          size="small" 
        />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t('global.scanSpeed') }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.speed" style="width: 70%" :step="1" :min="1" :max="200" />
      <n-input-number 
          v-model:value="state.speed" 
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false" 
          :show-button="false" 
          :min="1"
          :max="200"
          placeholder=""
          size="small" 
        />
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t('global.scanPeriod') }}</span>
    <div class="slider-box">
      <n-slider v-model:value="state.period" style="width: 70%" :step="1" :min="1" :max="20" />
      <n-input-number 
          v-model:value="state.period" 
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false" 
          :show-button="false" 
          :min="1"
          :max="20"
          placeholder=""
          size="small" 
        />
    </div>
  </div>

  <div class="row-item" v-show="state.scanMode === 0">
    <span :style="state.currentLanguage == 'en' ? 'width:30%' : ''">{{ $t('global.customScanDirection') }}</span>
    <div class="check-box" style="width:1.96rem">
      <n-checkbox v-model:checked="state.customDirection"></n-checkbox>
    </div>
  </div>
  <div class="row-item" v-show="state.scanMode === 1">
    <span :style="state.currentLanguage == 'en' ? 'width:30%' : ''">{{ $t('global.customScanCenter') }}</span>
    <div class="check-box" style="width:1.96rem">
      <n-checkbox v-model:checked="state.customCenter"></n-checkbox>
    </div>
  </div>

  <div class="btn-row-item" style="margin-left: 0.96rem">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="addScans"
      style="margin-right: 0.1rem">{{ $t('global.add') }}</n-button>
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)"
      ghost>{{ $t('global.clear') }}</n-button>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";

const notification = useNotification();

type stateType = {
  scanMode: number, // 扫描模式
  scanColor: string, // 扫描颜色
  scanTextures: any, // 扫描纹理
  selectedTexture: number, // 当前选择的纹理索引
  lineWidth: number, //获取或设置线状扫描线的宽度，单位：米。
  period: number, //获取或设置扫描线的运行周期，单位：秒。
  speed: number, //获取或设置扫描线的运行速度，单位：米/秒。
  scanShow: boolean, //
  customDirection: boolean, // 自定义扫描方向
  customCenter: boolean,// 自定义扫描中心
  addTextures: any, // 纹理选项
  currentLanguage: string
}

// 初始化数据
let state = reactive<stateType>({
  scanMode: 0,
  scanColor: "rgba(162,224,252,1)",
  scanTextures: [{ label: () => '无纹理', value: 0, url: "" }],
  selectedTexture: 0,
  lineWidth: 100, //获取或设置线状扫描线的宽度，单位：米。
  period: 3.0, //获取或设置扫描线的运行周期，单位：秒。
  speed: 100, //获取或设置扫描线的运行速度，单位：米/秒。
  scanShow: false,
  customDirection: true,
  customCenter: true,
  addTextures: [
    {
      name: GlobalLang.lineTexture1,
      nameEN: "Linear texture 1",
      type: "line",
      url: "./images/particleSystem/line-1.jpg",
    },
    {
      name: GlobalLang.lineTexture2,
      nameEN: "Linear texture 2",
      type: "line",
      url: "./images/particleSystem/line-2.jpg",
    },
    {
      name: GlobalLang.ringTexture1,
      nameEN: "Ring texture 1",
      type: "ring",
      url: "./images/particleSystem/ring-1.jpg",
    },
    {
      name: GlobalLang.ringTexture2,
      nameEN: "Ring texture 2",
      type: "ring",
      url: "./images/particleSystem/ring-2.jpg",
    },
    {
      name: GlobalLang.loopedhexagonTexture,
      nameEN: "Looped hexagon texture",
      type: "ring",
      url: "./images/particleSystem/ring-3.jpg",
    },
  ],
  currentLanguage: window.navigator.language
});
let defaultLineTextrues = [
  { label: () => GlobalLang.noneScanTexture, value: 0, url: "" },
];
let defaultCircleTextrues = [
  { label: () => GlobalLang.noneScanTexture, value: 0, url: "" },
];
let handlerPolyline;

// 设置纹理
function setTexturesByProps(isZH: boolean) {
  defaultLineTextrues = defaultLineTextrues.slice(0, 1);
  defaultCircleTextrues = defaultCircleTextrues.slice(0, 1);
  state.addTextures.forEach((el: any) => {
    let obj: any = {
      label: isZH ? el.name : el.nameEN,
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
setTexturesByProps('zh' === "zh");

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
init();

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
  viewer.enableCursorStyle = true;
  document.body.classList.remove("measureCur");
  let centerPosition = viewer.scene.pickPosition(e.message.position);
  if (state.scanShow) {
    viewer.scene.scanEffect.add(centerPosition);
    return;
  }
  viewer.scene.scanEffect.centerPostion = centerPosition;
  state.scanShow = true;
  viewer.eventManager.removeEventListener("CLICK", addCircleScans);
}

// 扫描
function addScans() {
  if (state.scanMode < 1) {
    drawPolyline();
    notification.create({
      content: () => GlobalLang.addScanLineTip,
      duration: 3500,
    });
    return;
  }
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", addCircleScans, true);
}

// 画线
function drawPolyline() {
  if (!handlerPolyline) {
    handlerPolyline = initHandler("Polyline");
  }
  handlerPolyline.handlerDrawing().then(
    (res) => {
      addLineScans(res.object.positions);
      handlerPolyline.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

// 清除
function clear() {
  let index = viewer.scene.scanEffect.count - 1;
  if (viewer.scene.scanEffect.count == 1) {
    state.scanShow = false;
  }
  viewer.scene.scanEffect.remove(index);



  viewer.eventManager.removeEventListener("CLICK", addCircleScans);
  if (handlerPolyline) handlerPolyline.clearHandler();
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
  (val) => {
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
      setTexturesByProps('zh' === "zh");
    }
  }
);

onBeforeUnmount(() => {
  clear();
  let count = viewer.scene.scanEffect.count;
  for (let i = 0; i < count; i++) {
    viewer.scene.scanEffect.remove(i);
  }
});
</script>
  

  
  
  
  
  
  