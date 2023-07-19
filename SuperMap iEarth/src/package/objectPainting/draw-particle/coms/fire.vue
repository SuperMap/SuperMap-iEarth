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
    <!-- <div class="row-item">
      <span>发射类型</span>
      <n-select style="width: 1.96rem;height: 32px;" v-model:value="state.selectedType" size="small"
        :options="state.optionMode" />
    </div> -->

    <!-- <div class="row-item">
      <span>发射速度</span>
      <n-input-number style="width: 1.96rem;" v-model:value="state.emitRate" :show-button="false">
      </n-input-number>
    </div> -->
    <div class="row-item">
      <span>{{$t('global.emitSpeed')}}</span>
      <div class="slider-box">
        <n-slider v-model:value="state.emitRate" :min="1" :max="2500" :step="20" />
        <div class="row-slider-num">{{ state.emitRate }}</div>
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.lifeCycle')}}</span>
      <div class="slider-box" >
        <n-slider style="width: 1.5rem" v-model:value="state.lifeRange" :step="0.001" range :min="0.005" :max="0.25" />
        <!-- <span>{{ state.lifeRange }}</span> -->
      </div>
    </div>
    <div class="row-item">
      <span>{{$t('global.speedRange')}}</span>
      <div class="slider-box" >
        <n-slider style="width: 1.5rem" v-model:value="state.speedRange" :step="1" range :min="1" :max="100" />
        <!-- <span>{{ state.speedRange }}</span> -->
      </div>
    </div>
    <div class="row-item">
            <span>{{$t('global.scaleRange')}}</span>
            <div class="slider-box" >
                <n-slider style="width: 1.5rem" v-model:value="state.scaleRange" :step="1" range :min="1" :max="100" />
                <!-- <span>{{ state.scaleRange }}</span> -->
            </div>
        </div>
    <!-- <div class="row-item">
      <span>重力</span>
      <div class="slider-box" style="width: 1.96rem;height: 32px;">
        <n-slider style="width: 1.5rem" v-model:value="state.gravity" :step="1" :min="10" :max="200" />
        <span>{{ state.gravity }}</span>
      </div>
    </div> -->
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
  selectedType: "NONE",
  selectedId: 0,
  showEditCheck: true,
  setParam: false,
  emitRate: 50,
  lifeRange: [0.005, 0.25],
  speedRange: [1, 10],
  scaleRange:[1,10],
  gravity: 0,
});

let fireUrl: string = './Resource/particle/Fire.json';
let modelMatrix = new SuperMap3D.Matrix4();
let particle,clickHandle;

// onMounted(() => {
//   init();
// })

// function init() {
//   loadParticleFile(fireUrl);
// }


// 加载粒子文件
function loadParticleFile(url) {
  SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
    particle = particleSystem;
    particle.modelMatrix = modelMatrix;
    // scene.primitives.add(particle); // 注释避免删除报错
    // particle.start();
  });
}

// 立体火焰 环形火 爆炸火 喷泉
function add() {
  clickHandle = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  clickHandle.setInputAction(function (click) {
    let centerPosition = viewer.scene.pickPosition(click.position);
    SuperMap3D.Transforms.eastNorthUpToFixedFrame(centerPosition, undefined, modelMatrix);
    loadParticleFile(fireUrl);
    clickHandle.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)//移除事件
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

function clear() {
  // particle.clearAll();
  if (!SuperMap3D.defaultValue(particle)) return;
  scene.primitives.remove(particle);
  // clickHandle.distory();
  // scene.primitives.removeAll();
};

watch(
  () => state.emitRate,
  val => {
    if (!particle) return;
    particle['emitRate'] = Number(val);
  }
);

watch(
  () => state.lifeRange,
  val => {
    if(val.length>1){
      // console.log("生命周期:",val);
      particle["minLifeTime"] = Number(val[0]);
      particle["maxLifeTime"] = Number(val[1]);
    }
  }
);

watch(
  () => state.speedRange,
  val => {
    if(val.length>1){
      // console.log("速度范围:",val);
      particle["minEmitPower"] = Number(val[0]);
      particle["maxEmitPower"] = Number(val[1]);
    }
  }
);

watch(
  () => state.scaleRange,
  val => {
    if(val.length>1){
      // console.log("比例范围:",val);
      particle["minSize"] = Number(val[0]);
      particle["maxSize"] = Number(val[1]);
    }
  }
);


onBeforeUnmount(() => {
  clear();
});

</script>
    
<style lang="scss" scoped>

</style>
    
    
    
    
    
    