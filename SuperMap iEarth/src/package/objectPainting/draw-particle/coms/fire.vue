<!-- 火焰 -->
<template>
  <!-- 参数设置 -->
  <div class="row-wrap">
    <div class="content">
      <div class="switch-box">
        <div class="text">{{ $t("parameterSet") }}</div>
        <n-switch v-model:value="state.setParam" size="small" />
      </div>
    </div>
  </div>

  <div v-show="state.setParam">
    <!-- 发射速度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("emitSpeed") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.emitRate" :min="10" :max="2500" :step="10" />
          <n-input-number v-model:value="state.emitRate"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :min="10" :max="2500" placeholder="" size="small" />
        </div>
      </div>
    </div>

    <!-- 生命周期 -->
    <div class="row-wrap">
      <div class="label">{{ $t("lifeCycle") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-input-number style="width: 0.3rem" v-model:value="state.lifeRange[0]" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="0.1" :max="1.0" placeholder=""
            size="small" />
          <n-slider class="range" style="width: 2.0rem" v-model:value="state.lifeRange" :step="0.1" range :min="0.1" :max="1.0" />
          <n-input-number style="width: 0.3rem" v-model:value="state.lifeRange[1]" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="0.1" :max="1.0" placeholder=""
            size="small" />
        </div>
      </div>
    </div>

    <!-- 速度范围 -->
    <div class="row-wrap">
      <div class="label">{{ $t("speedRange") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-input-number style="width: 0.3rem" v-model:value="state.speedRange[0]" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="1" :max="100" placeholder=""
            size="small" />
          <n-slider class="range" style="width: 2.0rem" v-model:value="state.speedRange" :step="1" range :min="1" :max="100" />
          <n-input-number style="width: 0.3rem" v-model:value="state.speedRange[1]" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="1" :max="100" placeholder=""
            size="small" />
        </div>
      </div>
    </div>

    <!-- 比例范围 -->
    <div class="row-wrap">
      <div class="label">{{ $t("scaleRange") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-input-number style="width: 0.3rem" v-model:value="state.scaleRange[0]" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="1" :max="100" placeholder=""
            size="small" />
          <n-slider class="range" style="width: 2.0rem" v-model:value="state.scaleRange" :step="1" range :min="1" :max="100" />
          <n-input-number style="width: 0.3rem" v-model:value="state.scaleRange[1]" 
            :update-value-on-input="false" :bordered="false" :show-button="false" :min="1" :max="100" placeholder=""
            size="small" />
        </div>
      </div>
    </div>

    <!-- 重力 -->
    <div class="row-wrap">
      <div class="label">{{ $t("gravity") }}</div>
      <div class="content">
        <div class="slider-box-new">
          <n-slider v-model:value="state.gravity" :min="-20" :max="20" :step="1" />
          <n-input-number v-model:value="state.gravity"  :update-value-on-input="false"
            :bordered="false" :show-button="false" :step="1" :min="-20" :max="20" placeholder="" size="small" />
        </div>
      </div>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="add" class="operate" type="info" :focusable="false">{{
    $t("add") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>

</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";

const scene = viewer.scene;

// 初始化变量
let state = reactive({
  selectedType: "NONE",
  selectedId: 0,
  showEditCheck: true,
  setParam: false,
  emitRate: 50,
  lifeRange: [0.2, 0.8],
  speedRange: [20, 80],
  scaleRange: [20, 80],
  gravity: -8.0,
});

let particle;
let fireUrl: string = "./Resource/particle/Fire.json";
let modelMatrix = new SuperMap3D.Matrix4();
const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear(false);
});

function init() {
  if (window.iEarthBindData['Particle'] && window.iEarthBindData['Particle']["fire"]) {
    particle = window.iEarthBindData['Particle']["fire"];
  }

  if (window.iEarthBindData['ParticleOptions']['fire']) {
    let option = window.iEarthBindData['ParticleOptions']['fire']["particleAttr"];
    if (option) switchCase(option);
  }
}

// 加载粒子文件
function loadParticleFile(url: string, option?: any) {
  SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (
    particleSystem
  ) {
    particle = particleSystem;
    particle.modelMatrix = modelMatrix;

    // 设置参数
    if (option) {
      for (let key in option) {
        switch (key) {
          case "emitRate":
            particle["emitRate"] = Number(option[key]);
            break;
          case "minLifeTime":
            particle["minLifeTime"] = Number(option[key]);
            break;
          case "maxLifeTime":
            particle["maxLifeTime"] = Number(option[key]);
            break;
          case "minEmitPower":
            particle["minEmitPower"] = Number(option[key]);
            break;
          case "maxEmitPower":
            particle["maxEmitPower"] = Number(option[key]);
            break;
          case "minSize":
            particle["minSize"] = Number(option[key]);
            break;
          case "maxSize":
            particle["maxSize"] = Number(option[key]);
            break;
        }
      }
    }
    // scene.primitives.add(particle); // 注释避免删除报错
    // particle.start();
  });
}

// 立体火焰 环形火 爆炸火 喷泉
async function add() {
  clear();
  drawHandler.clear();
  const position = await drawHandler.startPoint();
  if (!position || !(position instanceof SuperMap3D.Cartesian3)) return;
  const centerPosition = position;
  SuperMap3D.Transforms.eastNorthUpToFixedFrame(
    centerPosition,
    undefined,
    modelMatrix
  );
  loadParticleFile(fireUrl);
  window.iEarthBindData['ParticleOptions']["fire"] = {
    particleUrl: fireUrl,
    particlePosition: centerPosition,
    particleAttr: {},
  };
}

function clear(flag = true) {
  if (!SuperMap3D.defaultValue(particle)) return;
  scene.primitives.remove(particle);
  if (flag) window.iEarthBindData['ParticleOptions']["fire"] = null;
}

// 设置参数
function switchCase(option: any) {
  for (let key in option) {
    switch (key) {
      case "emitRate":
        state.emitRate = Number(option[key]);
        break;
      case "gravity":
        state.gravity = Number(option[key]);
        break;
      case "minLifeTime":
        state.lifeRange[0] = Number(option[key]);
        break;
      case "maxLifeTime":
        state.lifeRange[1] = Number(option[key]);
        break;
      case "minEmitPower":
        state.speedRange[0] = Number(option[key]);
        break;
      case "maxEmitPower":
        state.speedRange[1] = Number(option[key]);
        break;
      case "minSize":
        state.scaleRange[0] = Number(option[key]);
        break;
      case "maxSize":
        state.scaleRange[1] = Number(option[key]);
        break;
      default:
        break;
    }
  }
}

watch(
  () => state.emitRate,
  (val) => {
    if (!particle) return;
    particle["emitRate"] = Number(val);
    window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["emitRate"] =
      Number(val);
  }
);
watch(
  () => state.lifeRange,
  (val) => {
    if (!particle) return;
    if (val.length > 1) {
      particle["minLifeTime"] = Number(val[0]);
      particle["maxLifeTime"] = Number(val[1]);
      window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["minLifeTime"] =
        Number(val[0]);
      window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["maxLifeTime"] =
        Number(val[1]);
    }
  }
);
watch(
  () => state.speedRange,
  (val) => {
    if (!particle) return;
    if (val.length > 1) {
      particle["minEmitPower"] = Number(val[0]);
      particle["maxEmitPower"] = Number(val[1]);
      window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["minEmitPower"] =
        Number(val[0]);
      window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["maxEmitPower"] =
        Number(val[1]);
    }
  }
);
watch(
  () => state.scaleRange,
  (val) => {
    if (!particle) return;
    if (val.length > 1) {
      particle["minSize"] = Number(val[0]);
      particle["maxSize"] = Number(val[1]);
      window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["minSize"] = Number(
        val[0]
      );
      window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["maxSize"] = Number(
        val[1]
      );
    }
  }
);
watch(
  () => state.gravity,
  (val) => {
    if (!particle) return;
    particle.gravity = new SuperMap3D.Cartesian3(0, 0, Number(val));
    window.iEarthBindData['ParticleOptions']["fire"]["particleAttr"]["gravity"] = Number(val);
  }
);
</script>