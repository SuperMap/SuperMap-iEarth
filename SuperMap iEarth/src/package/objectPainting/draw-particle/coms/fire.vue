<template>
  <!-- <n-checkbox
    v-model:checked="state.showEditCheck"
    style="margin-left: 1.2rem; margin-bottom: 0.1rem"
  >
    {{ $t("displayEdit") }}
  </n-checkbox> -->

  <!-- <div class="row-item" v-show="state.showEditCheck"> -->
  <div class="row-item">
    <span>{{ $t("parameterSet") }}</span>
    <div style="width: 1.96rem">
      <n-switch v-model:value="state.setParam" size="small" />
    </div>
  </div>

  <!-- 参数设置 -->
  <div v-show="state.setParam">
    <div class="row-item">
      <span>{{ $t("emitSpeed") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.emitRate"
          style="width: 70%"
          :min="10"
          :max="2500"
          :step="10"
        />
        <n-input-number
          v-model:value="state.emitRate"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="10"
          :max="2500"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("lifeCycle") }}</span>
      <div class="slider-box">
        <n-input-number
          v-model:value="state.lifeRange[0]"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="0.1"
          :max="1.0"
          placeholder=""
          size="small"
        />
        <n-slider
          style="width: 1.5rem"
          v-model:value="state.lifeRange"
          :step="0.1"
          range
          :min="0.1"
          :max="1.0"
        />
        <n-input-number
          v-model:value="state.lifeRange[1]"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="0.1"
          :max="1.0"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("speedRange") }}</span>
      <div class="slider-box">
        <n-input-number
          v-model:value="state.speedRange[0]"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="1"
          :max="100"
          placeholder=""
          size="small"
        />
        <n-slider
          style="width: 1.5rem"
          v-model:value="state.speedRange"
          :step="1"
          range
          :min="1"
          :max="100"
        />
        <n-input-number
          v-model:value="state.speedRange[1]"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="1"
          :max="100"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("scaleRange") }}</span>
      <div class="slider-box">
        <n-input-number
          v-model:value="state.scaleRange[0]"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="1"
          :max="100"
          placeholder=""
          size="small"
        />
        <n-slider
          style="width: 1.5rem"
          v-model:value="state.scaleRange"
          :step="1"
          range
          :min="1"
          :max="100"
        />
        <n-input-number
          v-model:value="state.scaleRange[1]"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :min="1"
          :max="100"
          placeholder=""
          size="small"
        />
      </div>
    </div>

    <div class="row-item">
      <span>{{ $t("gravity") }}</span>
      <div class="slider-box">
        <n-slider
          v-model:value="state.gravity"
          style="width: 70%"
          :min="-20"
          :max="20"
          :step="1"
        />
        <n-input-number
          v-model:value="state.gravity"
          class="slider-input-number"
          :update-value-on-input="false"
          :bordered="false"
          :show-button="false"
          :step="1"
          :min="-20"
          :max="20"
          placeholder=""
          size="small"
        />
      </div>
    </div>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add"
      style="margin-right: 0.1rem"
      >{{ $t("add") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
    <!-- <n-button class="btn-secondary" @click="clear">{{ $t("clear") }}</n-button> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/index";

const layerStore = useLayerStore();
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

let particle, clickHandle;
let fireUrl: string = "./Resource/particle/Fire.json";
let modelMatrix = new SuperMap3D.Matrix4();

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear(false);
});

function init() {
  if (window.EarthGlobal && window.EarthGlobal["fire"]) {
    particle = window.EarthGlobal["fire"];
  }

  if (layerStore.particleOptions.fire) {
    let option = layerStore.particleOptions.fire["particleAttr"];
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
function add() {
  clear();
  window.viewer.enableCursorStyle = false;
  window.viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  clickHandle = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  clickHandle.setInputAction(function (click) {
    let centerPosition = viewer.scene.pickPosition(click.position);
    SuperMap3D.Transforms.eastNorthUpToFixedFrame(
      centerPosition,
      undefined,
      modelMatrix
    );
    loadParticleFile(fireUrl);
    layerStore.particleOptions["fire"] = {
      particleUrl: fireUrl,
      particlePosition: centerPosition,
      particleAttr: {},
    };
    clickHandle.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK); //移除事件
    window.viewer.enableCursorStyle = true;
    document.body.classList.remove("measureCur");
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

function clear(flag = true) {
  if (!SuperMap3D.defaultValue(particle)) return;
  scene.primitives.remove(particle);
  if (flag) layerStore.particleOptions["fire"] = null;
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
    layerStore.particleOptions["fire"]["particleAttr"]["emitRate"] =
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
      layerStore.particleOptions["fire"]["particleAttr"]["minLifeTime"] =
        Number(val[0]);
      layerStore.particleOptions["fire"]["particleAttr"]["maxLifeTime"] =
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
      layerStore.particleOptions["fire"]["particleAttr"]["minEmitPower"] =
        Number(val[0]);
      layerStore.particleOptions["fire"]["particleAttr"]["maxEmitPower"] =
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
      layerStore.particleOptions["fire"]["particleAttr"]["minSize"] = Number(
        val[0]
      );
      layerStore.particleOptions["fire"]["particleAttr"]["maxSize"] = Number(
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
    layerStore.particleOptions["fire"]["particleAttr"]["gravity"] = Number(val);
  }
);
</script>

<style lang="scss" scoped>
.slider-input-number {
  margin: 0px -0.1rem 0px 0px;
}
</style>
