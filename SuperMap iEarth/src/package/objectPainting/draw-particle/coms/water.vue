<template>
  <!-- <div class="row-item">
    <span>类型</span>
    <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.selectedType" size="small"
      :options="state.optionMode" />
  </div> -->
  <n-checkbox v-model:checked="state.showEditCheck" style="margin-left: 1.2rem; margin-bottom: 0.1rem">
    {{$t('global.displayEdit')}}
  </n-checkbox>

  <div class="row-item" v-show="state.showEditCheck">
    <span>{{$t('global.parameterSet')}}</span>
    <div style="width: 1.96rem;">
      <n-switch v-model:value="state.setParam" size="small" />
    </div>
  </div>

  <!-- 参数设置 -->
  <div v-show="state.setParam">


    <div class="row-item">
      <span>{{$t('global.emitType')}}</span>
      <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.selectedType" 
        :options="state.optionMode" />
    </div>
    <div class="row-item">
      <span>{{$t('global.particleNumber')}}</span>
      <div class="slider-box">
        <n-slider v-model:value="state.emitRate" style="width: 70%" :min="1" :max="2500" :step="20" />
        <div class="row-slider-num">{{ state.emitRate }}</div>
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.particleSize')}}</span>
      <div class="slider-box">
        <n-slider v-model:value="state.particleSize" style="width: 70%" :min="1" :max="60" :step="1" />
        <div class="row-slider-num">{{ state.particleSize }}</div>
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.lifeCycle')}}</span>
      <div class="slider-box" >
        <n-slider style="width: 1.5rem" v-model:value="state.lifeRange" :step="1" range :min="0.1" :max="30" />
        <!-- <span>{{ state.lifeRange }}</span> -->
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.speedRange')}}</span>
      <div class="slider-box" >
        <n-slider style="width: 1.5rem" v-model:value="state.speedRange" :step="1" range :min="1" :max="30" />
        <!-- <span>{{ state.speedRange }}</span> -->
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.scaleRange')}}</span>
      <div class="slider-box" >
        <n-slider style="width: 1.5rem" v-model:value="state.scaleRange" :step="1" range :min="1" :max="10" />
        <!-- <span>{{ state.scaleRange }}</span> -->
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.gravity')}}</span>
      <div class="slider-box" >
        <n-slider style="width: 1.5rem" v-model:value="state.gravity" :step="1" :min="-20" :max="20" />
        <span>{{ state.gravity }}</span>
      </div>
    </div>
  </div>

  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="add" style="margin-right: 0.1rem">{{$t('global.add')}}</n-button>
    <n-button class="btn-secondary" @click="clear">{{$t('global.clear')}}</n-button>
  </div>
</template>
    
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";

const scene = viewer.scene;

// 初始化数据
let state = reactive({
  selectedType: "Cone",
  selectedId: 0,
  showEditCheck: true,
  setParam: false,
  emitRate: 1500,
  particleSize: 1,
  lifeRange: [1, 4],
  speedRange: [6, 7],
  scaleRange: [1, 4],
  gravity: -8.0,
  optionMode: [
    {
      label: () => GlobalLang.coneEmit,
      value: "Cone",
    },
    {
      label: () => GlobalLang.sphereEmit,
      value: "Sphere",
    },
    {
      label: () => GlobalLang.boxEmit,
      value: "Box",
    }
  ],
});

let waterUrl: string = './Resource/particle/fountain.json';
let modelMatrix = new SuperMap3D.Matrix4();
let particle_water, clickHandle;

// 加载粒子文件
function loadParticleFile(url) {
  SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
    particle_water = particleSystem;
    particle_water.modelMatrix = modelMatrix;
    // scene.primitives.add(particle_water); // 注释避免报错
    particle_water.start();
  });
}

// 添加粒子
function add() {
  clickHandle = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  clickHandle.setInputAction(function (click) {
    let centerPosition = viewer.scene.pickPosition(click.position);
    SuperMap3D.Transforms.eastNorthUpToFixedFrame(centerPosition, undefined, modelMatrix);
    loadParticleFile(waterUrl);
    clickHandle.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)//移除事件
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

function clear() {
  // particle_water.clearAll();
  if (!SuperMap3D.defaultValue(particle_water)) return;
  scene.primitives.remove(particle_water);
  // clickHandle.distory();
  // scene.primitives.removeAll();
};

watch(
  () => state.selectedType,
  val => {
    if (!particle_water) return;
    switch (val) {
      case "Cone":
        particle_water.createConeEmitter(1.0, 1.05);
        break;
      case "Sphere":
        particle_water.createSphereEmitter(1.0);
        break;
      case "Box":
        var direction1 = new SuperMap3D.Cartesian3(-1, 1, 1);
        var direction2 = new SuperMap3D.Cartesian3(1, 1, -1);
        var minBox = new SuperMap3D.Cartesian3(-10, 0, -10);
        var maxBox = new SuperMap3D.Cartesian3(10, 0, 10);
        particle_water.createBoxEmitter(direction1, direction2, minBox, maxBox);
        break;
    }
  }
);

watch(
  () => state.emitRate,
  val => {
    if (!particle_water) return;
    particle_water['emitRate'] = Number(val);
  }
);
watch(
  () => state.particleSize,
  val => {
    if (!particle_water) return;
    particle_water.minScaleX = Number(val);
    particle_water.minScaleY = Number(val);
    particle_water.maxScaleX = Number(val);
    particle_water.maxScaleY = Number(val);
  }
);

watch(
  () => state.lifeRange,
  val => {
    if (!particle_water) return;
    if (val.length > 1) {
      // console.log("生命周期:",val);
      particle_water["minLifeTime"] = Number(val[0]);
      particle_water["maxLifeTime"] = Number(val[1]);
    }
  }
);

watch(
  () => state.speedRange,
  val => {
    if (!particle_water) return;
    if (val.length > 1) {
      // console.log("速度范围:",val);
      particle_water["minEmitPower"] = Number(val[0]);
      particle_water["maxEmitPower"] = Number(val[1]);
    }
  }
);

watch(
  () => state.scaleRange,
  val => {
    if (!particle_water) return;
    if (val.length > 1) {
      // console.log("比例范围:",val);
      particle_water["minSize"] = Number(val[0]);
      particle_water["maxSize"] = Number(val[1]);
    }
  }
);

watch(
  () => state.gravity,
  val => {
    if (!particle_water) return;
    particle_water.gravity = new SuperMap3D.Cartesian3(0, 0, Number(val));
  }
);


onBeforeUnmount(() => {
  clear();
});

</script>
    
<style lang="scss" scoped>

</style>
    
    
    
    
    
    