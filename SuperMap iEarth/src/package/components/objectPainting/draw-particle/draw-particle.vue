<template>
  <!-- 粒子 -->
  <div class="draw-partice-container">
    <div class="symbol-container">
      <div class="name">符号库</div>
      <div class="icon-container">
        <div class="icon-list">
          <span
            v-for="(particle, index) in state.stateParticles"
            :key="index"
            class="icon-span"
            :class="particle.isSelect ? 'is-select' : ''"
            @click="changleIconItem(particle)"
          >
            <svg-icon :name="particle.iconName" class="icon-size" />
          </span>
        </div>
      </div>
    </div>

    <sm-rowLayOut v-show="state.selectedId != 2">
      <template #item-lable>{{ locale.ParticleType }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.selectedChildrenId"
          size="small"
          :options="selectType"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut v-show="state.selectedId != 2">
      <template #item-lable>参数设置</template>
      <template #item-content>
        <n-switch v-model:value="state.paramSetShow" />
      </template>
    </sm-rowLayOut>

    <div v-show="state.paramSetShow">
      <sm-rowLayOut>
        <template #item-lable>{{ locale.EmissionRate }}</template>
        <template #item-content>
          <n-input-number
            v-model:value="state.emissionRate"
            size="small"
          ></n-input-number>
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.ParticleSize }}</template>
        <template #item-content>
          <n-slider v-model:value="state.particleSize" :min="0" :max="20" />
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.ParticleLife }}</template>
        <template #item-content>
          <n-slider
            v-model:value="state.particleLife"
            :max="15"
            :min="0"
            range
            :step="0.1"
          />
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.SpeedRange }}</template>
        <template #item-content>
          <n-slider
            v-model:value="state.speed"
            :max="15"
            :min="0"
            range
            :step="0.1"
          />
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.StartScale }}</template>
        <template #item-content>
          <n-slider
            v-model:value="state.startScale"
            :min="0"
            :max="20"
            :step="0.1"
          />
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.EndScale }}</template>
        <template #item-content>
          <n-slider
            v-model:value="state.endScale"
            :min="0"
            :max="20"
            :step="0.1"
          />
        </template>
      </sm-rowLayOut>

      <sm-rowLayOut>
        <template #item-lable>{{ locale.Gravity }}</template>
        <template #item-content>
          <n-slider
            v-model:value="state.gravity"
            :min="-10"
            :max="10"
            :step="0.1"
          />
        </template>
      </sm-rowLayOut>
    </div>
  </div>

  <sm-btnGroup>
    <template #btn-left>
      <n-button type="info" color="#3499E5" text-color="#fff" @click="add">{{
        locale.Add
      }}</n-button>
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clear">{{
        locale.Clear
      }}</n-button>
    </template>
  </sm-btnGroup>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";
import locale from "@/tools/locateTemp";
import particles from "./particle-options";
import ParticleSystem from "./creat-particle-system";

const notification = useNotification();

function setState() {
  let obj = particles[state.selectedId].children[state.selectedChildrenId];
  Object.assign(state, obj);
  if (state.selectedId == 0 && state.selectedChildrenId == 1)
    state.bursts = [
      new Cesium.ParticleBurst({ time: 1.5, minimum: 80, maximum: 150 }),
      new Cesium.ParticleBurst({ time: 1.7, minimum: 150, maximum: 200 }),
    ] as any;
  // Type 'any' is not assignable to type 'never'
  else state.bursts = [];
}

// 初始化数据
let state = reactive({
  selectedId: 0,
  selectedChildrenId: 0,
  emissionRate: 50,
  particleSize: 2,
  particleLife: [1.5, 1.6],
  speed: [3.5, 4],
  startScale: 2.5,
  endScale: 1,
  gravity: 0,
  lifetime: 6,
  ringRadius: [25, 30],
  particleSystemType: "conical",
  image: "images/particleSystem/base_fire.png",
  startColor: "rgba(255, 255, 255, 0.3)",
  endColor: "rgba(0, 0, 0, 0)",
  emitter: ["ConeEmitter", [60]],
  bursts: [], //爆炸
  // selectType: [],
  paramSetShow: false, //参数设置
  stateParticles: particles,
});

let selectType = ref<any[]>();

//烟花默认参数设置
let fireWorkSystem;
let numberOfFireworks = 18;
let xMin = -600.0;
let xMax = 600.0;
let yMin = -600.0;
let yMax = 600.0;
let zMin = 0.0;
let zMax = 200.0;
let colorOptions = [
  {
    minimumRed: 0.95,
    green: 0.0,
    minimumBlue: 0.8,
    alpha: 1.0,
  },
  {
    red: 0.0,
    minimumGreen: 0.75,
    minimumBlue: 0.8,
    alpha: 1.0,
  },
  {
    red: 0.0,
    green: 0.0,
    minimumBlue: 0.8,
    alpha: 1.0,
  },
  {
    minimumRed: 0.9,
    minimumGreen: 0.9,
    blue: 0.0,
    alpha: 1.0,
  },
];

let handlerPolygon, handlerPolyline;
let particleSystem = new ParticleSystem();
let particleTypes = [
  [
    {
      label: () => locale.Flame,
      value: 0,
    },
    {
      label: () => locale.ExplosionFire,
      value: 1,
    },
    {
      label: () => locale.RingFire,
      value: 2,
    },
    {
      label: () => locale.FlowFire,
      value: 3,
    },
  ],
  [
    {
      label: () => locale.Fountain,
      value: 0,
    },
    {
      label: () => locale.FireWater,
      value: 1,
    },
  ],
];
selectType.value = particleTypes[0];

function click_addParticle(e) {
  let centerPosition = viewer.scene.pickPosition(e.message.position);
  addFireWork(centerPosition);
}
// 添加粒子
function add() {
  switch (state.selectedId) {
    case 0:
      // if (state.selectedChildrenId < 3) addFlame();
      // else addFlowingFire();
      addFlowingFire();
      break;
    case 1:
      // if (state.selectedChildrenId < 1) addFlame();
      // else addFireWater();
      addFireWater();
      break;
    case 2:
      notification.create({
        content: () => "点击设置烟花中心点",
        duration: 3500,
      });
      viewer.eventManager.addEventListener("CLICK", click_addParticle, true);
      break;
    default:
      break;
  }
}

// 立体火焰 环形火 爆炸火 喷泉
function addFlame() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", click_addFlame, true);
  viewer.eventManager.addEventListener("RIGHT_CLICK", right_click_removeEvent);
}
function click_addFlame(e) {
  let centerPosition = viewer.scene.pickPosition(e.message.position);
  particleSystem.create(state, centerPosition);
}
function right_click_removeEvent() {
  document.body.classList.remove("measureCur");
  viewer.eventManager.removeEventListener("CLICK", click_addFlame);
  viewer.eventManager.removeEventListener(
    "RIGHT_CLICK",
    right_click_removeEvent
  ); //移除鼠标点击事件监听
}

//流淌火
function addFlowingFire() {
  viewer.eventManager.removeEventListener(
    "RIGHT_CLICK",
    right_click_removeEvent
  );
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }
  handlerPolygon.handlerDrawing().then(
    (res) => {
      particleSystem.create(state, res.object.positions);
      handlerPolygon.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

//消防水
function addFireWater() {
  if (!handlerPolyline) {
    handlerPolyline = initHandler("Polyline");
  }
  handlerPolyline.handlerDrawing().then(
    (res) => {
      let positions = res.object.positions;
      particleSystem.create(state, positions[0]);
      handlerPolyline.polylineTransparent.show = false;
      let heading = tool.getAngleAndRadian(positions[0], positions[1]).angle;
      heading = heading - 90 >= 0 ? heading - 90 : heading + 270;
      let pitch = tool.getPitch(positions[0], positions[1]).angle - 90;
      let hpr = { heading: heading, pitch: pitch, roll: 0 };
      let translation = { x: 0, y: 0, z: 2 };
      particleSystem.particleSystem.emitterModelMatrix =
        particleSystem.computeEmitterModelMatrix(hpr, translation, true);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

//烟花
function addFireWork(position) {
  // 参数场景默认
  setSceneForFireWork(true);
  fireWorkSystem = new ParticleSystem();
  for (let i = 0; i < numberOfFireworks; ++i) {
    let x = Cesium.Math.randomBetween(xMin, xMax);
    let y = Cesium.Math.randomBetween(yMin, yMax);
    let z = Cesium.Math.randomBetween(zMin, zMax);
    let offset = new Cesium.Cartesian3(x, y, z);
    let bursts: any = [];
    for (let j = 0; j < 3; ++j) {
      bursts.push(
        new Cesium.ParticleBurst({
          time: Cesium.Math.nextRandomNumber() * 12,
          minimum: 400,
          maximum: 400,
        })
      );
    }
    let color = Cesium.Color.fromRandom(colorOptions[i % colorOptions.length]);
    fireWorkSystem.createFirework(offset, color, bursts, position);
  }
  // right_click_removeEvent()
}
// 设置播放烟花时的夜晚效果
function setSceneForFireWork(isFlage) {
  viewer.scene.globe.show = isFlage ? false : true;
  viewer.scene.sun.show = isFlage ? false : true;
  viewer.scene.globe.enableLighting = isFlage ? false : true;
  viewer.scene.particlePostRender.quality = isFlage ? 1.0 : 0.25;
  viewer.scene.bloomEffect.show = !isFlage ? false : true;
  viewer.scene.bloomEffect.threshold = isFlage ? 0.8 : 0;
  viewer.scene.bloomEffect.bloomIntensity = isFlage ? 3.6 : 1.34;
  viewer.scene.skyAtmosphere.show = isFlage ? false : true;
}

function changleIconItem(item: any) {
  for (let i = 0; i < state.stateParticles.length; i++) {
    if (state.stateParticles[i].id == item.id) {
      state.stateParticles[i].isSelect = true;
    } else {
      state.stateParticles[i].isSelect = false;
    }
  }
}

// 清除
function clear() {
  viewer.eventManager.removeEventListener("CLICK", click_addParticle);
  if (fireWorkSystem) {
    fireWorkSystem.clearFireWoke();
    setSceneForFireWork(false);
    fireWorkSystem = null;
  }

  if (handlerPolygon) handlerPolygon.clearHandler();
  if (handlerPolyline) handlerPolyline.clearHandler();
  particleSystem.clearAll();
  viewer.enableCursorStyle = true;
  right_click_removeEvent();
}

watch(
  () => state.selectedId,
  (val) => {
    selectType.value = particleTypes[val];
    state.selectedChildrenId = 0;
    if (state.selectedChildrenId === 0) setState();
    else state.selectedChildrenId = 0;
  }
);
watch(
  () => state.selectedChildrenId,
  (val) => {
    setState();
  }
);

watch(
  () => state.emissionRate,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.emissionRate = Number(val);
  }
);
watch(
  () => state.particleSize,
  (val) => {
    if (!particleSystem.particleSystem) return;
    let particleSize = Number(val);
    particleSystem.particleSystem.minimumImageSize.x = particleSize;
    particleSystem.particleSystem.minimumImageSize.y = particleSize;
    particleSystem.particleSystem.maximumImageSize.x = particleSize;
    particleSystem.particleSystem.maximumImageSize.y = particleSize;
  }
);
watch(
  () => state.particleLife,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.minimumParticleLife = Number(val[0]);
    particleSystem.particleSystem.maximumParticleLife = Number(val[1]);
  }
);
watch(
  () => state.speed,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.minimumSpeed = Number(val[0]);
    particleSystem.particleSystem.maximumSpeed = Number(val[1]);
  }
);
watch(
  () => state.startScale,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.startScale = Number(val);
  }
);
watch(
  () => state.endScale,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.endScale = Number(val);
  }
);

watch(
  () => state.startColor,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.startColor =
      Cesium.Color.fromCssColorString(val);
  }
);
watch(
  () => state.endColor,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.endColor =
      Cesium.Color.fromCssColorString(val);
  }
);
watch(
  () => state.ringRadius,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.emitter = new Cesium.CircleEmitter(
      val[0],
      val[1]
    );
    if (state.emitter[0] === "CircleEmitter") state.emitter[0] = val;
  }
);
watch(
  () => state.lifetime,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.particleSystem.lifetime = Number(val);
  }
);

watch(
  () => state.gravity,
  (val) => {
    if (!particleSystem.particleSystem) return;
    particleSystem.gravity = Number(val);
  }
);

onBeforeUnmount(() => {
  clear();
});
</script>
  
  
<style lang="scss" scoped>
.selected-border-color {
  border: $--SM--Border-DrawImg;
  box-sizing: border-box;
}
@include iconContainer(0.59rem);
.symbol-container {
  display: flex;
  font-size: 0.12rem;
  margin-bottom: 0.2rem;
}
.icon-list {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .is-select {
    border: 0.01rem solid #3499e5;
  }
}
.draw-partice-container {
  @include panelContainer(100%, 3.2rem);
}
</style>
  
  
  
  
  
  