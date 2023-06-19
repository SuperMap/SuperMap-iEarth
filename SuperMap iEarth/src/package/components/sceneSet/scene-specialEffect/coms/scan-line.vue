<template>
  <n-space vertical>
    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>扫描模式</template>
      <template #item-content>
        <n-radio-group
          v-model:value="state.scanMode"
          name="scanMode"
          style="width: 100%"
        >
          <n-space>
            <n-radio :value="0">{{ locale.LineScan }}</n-radio>
            <n-radio :value="1">{{ locale.CircularScan }}</n-radio>
          </n-space>
        </n-radio-group>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.ScanTexture }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.selectedTexture"
          size="small"
          :options="state.scanTextures"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.ScanColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.scanColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-show="state.scanMode === 0">
      <template #item-lable>{{ locale.ScanWidth }}</template>
      <template #item-content>
        <n-slider v-model:value="state.lineWidth" :min="0" :max="1000" />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.ScanSpeed }}</template>
      <template #item-content>
        <n-slider v-model:value="state.speed" :min="0" :max="200" />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.ScanPeriod }}</template>
      <template #item-content>
        <n-slider v-model:value="state.period" :min="0" :max="20" />
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="addScans"
          >{{ locale.Add }}</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">{{
          locale.Clear
        }}</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>
  
  <script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import locale from "@/tools/locateTemp";

const notification = useNotification();

// 初始化数据
let state = reactive({
  scanMode: 0,
  scanColor: "rgba(0,174,255,1)",
  scanTextures: [{ label: () => locale.NoTexture, value: 0, url: "" }],
  selectedTexture: 0,
  lineWidth: 100, //获取或设置线状扫描线的宽度，单位：米。
  period: 3.0, //获取或设置扫描线的运行周期，单位：秒。
  speed: 100, //获取或设置扫描线的运行速度，单位：米/秒。
  addTextures: [
    {
      name: "线状纹理1",
      nameEN: "Linear texture 1",
      type: "line",
      url: "./images/particleSystem/line-1.jpg",
    },
    {
      name: "线状纹理2",
      nameEN: "Linear texture 2",
      type: "line",
      url: "./images/particleSystem/line-2.jpg",
    },
    {
      name: "环状纹理1",
      nameEN: "Ring texture 1",
      type: "ring",
      url: "./images/particleSystem/ring-1.jpg",
    },
    {
      name: "环状纹理2",
      nameEN: "Ring texture 2",
      type: "ring",
      url: "./images/particleSystem/ring-2.jpg",
    },
    {
      name: "环状六边形纹理",
      nameEN: "Looped hexagon texture",
      type: "ring",
      url: "./images/particleSystem/ring-3.jpg",
    },
  ],
  scanShow: false,
});
let defaultLineTextrues = [
  { label: () => locale.NoTexture, value: 0, url: "" },
];
let defaultCircleTextrues = [
  { label: () => locale.NoTexture, value: 0, url: "" },
];
let handlerPolyline;

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
setTexturesByProps(locale.Type === "zh");

function init() {
  if (!window.viewer) return;
  viewer.scene.scanEffect.color = Cesium.Color.fromCssColorString(
    state.scanColor
  );
  viewer.scene.scanEffect.textureUrl = "";
  viewer.scene.scanEffect.lineWidth = Number(state.lineWidth);
  viewer.scene.scanEffect.period = Number(state.period);
  viewer.scene.scanEffect.speed = Number(state.speed);
  viewer.scene.scanEffect.centerPostion = new Cesium.Cartesian3.fromDegrees(
    0,
    0,
    0
  );
}

init();

function addLineScans(positions) {
  let dir = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(positions[1], positions[0], dir); // 获取扫描方向向量
  if (state.scanShow) {
    viewer.scene.scanEffect.add(positions[0]);
    viewer.scene.scanEffect.lineMoveDirection = dir;
    return;
  }
  viewer.scene.scanEffect.centerPostion = positions[0];
  viewer.scene.scanEffect.lineMoveDirection = dir;
  state.scanShow = true;
}

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

function addScans() {
  if (state.scanMode < 1) {
    drawPolyline();
    notification.create({
      content: () => locale.ScanEffectTip,
      duration: 3500,
    });
    return;
  }
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", addCircleScans, true);
}

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
  state.scanShow = false;
  let index = viewer.scene.scanEffect.count;
  for (let i = 0; i < index; i++) {
    viewer.scene.scanEffect.remove(i);
  }
  viewer.eventManager.removeEventListener("CLICK", addCircleScans);
  if (handlerPolyline) handlerPolyline.clearHandler();
}

// 监听
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
      viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.LINE;
      state.scanTextures = defaultLineTextrues;
      return;
    }
    viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE;
    state.scanTextures = defaultCircleTextrues;
  }
);
watch(
  () => state.scanColor,
  (val) => {
    viewer.scene.scanEffect.color = Cesium.Color.fromCssColorString(val);
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
      setTexturesByProps(locale.Type === "zh");
    }
  }
);

onBeforeUnmount(() => {});
</script>

  

  
  
  
  
  
  