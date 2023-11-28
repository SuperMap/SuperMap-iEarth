<template>
  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="add" style="margin-right: 0.1rem">{{ $t('global.add')
    }}</n-button>
    <n-button class="btn-secondary" @click="clear">{{ $t('global.clear') }}</n-button>
  </div>
</template>
    
<script lang="ts" setup>
import { onMounted,onBeforeUnmount } from "vue";
import { useLayerStore } from "@/store/index"

const layerStore = useLayerStore();
const scene = viewer.scene;

onMounted(() => {
  init();
})

function init() {
  if(window.EarthGlobal && window.EarthGlobal["fireWork"]){
    setIntervalList = window.EarthGlobal["fireWork"];
  }
}

let modelMatrix = new SuperMap3D.Matrix4();
let clickHandle, setIntervalList:any[] = [],particleSystemList:any[] = [];

let sparkOneUrl = './Resource/particle/babylon/sparkGravityOne.json';
let sparkTwoUrl = './Resource/particle/babylon/sparkGravityTwo.json';
let sparkThreeUrl = './Resource/particle/babylon/sparkGravityThree.json';
let sparkFourUrl = './Resource/particle/babylon/sparkGravityFour.json';

let numberOfSparks = 8;
let xMin = -2100.0;
let xMax = 300.0;
let yMin = 0.0;
let yMax = 2000.0;
let zMin = 150.0;
let zMax = 550.0;
// 创建烟花
let sparkInterval = (xMax - xMin) / numberOfSparks;

function createSpark() {
  for (let i = 0; i < numberOfSparks; ++i) {
    let x = SuperMap3D.Math.randomBetween(xMin + i * sparkInterval, xMin + (i + 1) * sparkInterval);
    let y = SuperMap3D.Math.randomBetween(yMin, yMax);
    let z = SuperMap3D.Math.randomBetween(zMin, zMax);
    let offset = new SuperMap3D.Cartesian3(x, y, z);
    let url = '';
    if (i % 4 === 0)
      url = sparkOneUrl;
    if (i % 4 === 1)
      url = sparkTwoUrl;
    if (i % 4 === 2)
      url = sparkThreeUrl;
    if (i % 4 === 3)
      url = sparkFourUrl;
    SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
      settingParticleSys(particleSystem, offset, i);
    });
  }
}

// 设置当前粒子系统
function settingParticleSys(particleSystem, offset, index) {

  // 添加多个
  particleSystem.modelMatrix = modelMatrix;
  particleSystem.worldOffset.x = offset.x;
  particleSystem.worldOffset.y = offset.y;
  particleSystem.worldOffset.z = offset.z;
  let setIntervalFlag = setInterval(() => {
    particleSystem.start();
  }, 2000 + index * 50);
  scene.primitives.add(particleSystem);
  // particleSystemList.push(particleSystem);
  setIntervalList.push(setIntervalFlag);

  // 添加一个
  // particleSystem.modelMatrix = modelMatrix;
  // scene.primitives.add(particleSystem);
  // particleSystem.start(); 
}

function addSpark(centerPosition){
  SuperMap3D.Transforms.eastNorthUpToFixedFrame(centerPosition, undefined, modelMatrix);
  createSpark();
}

// 添加粒子
function add() {
  window.viewer.enableCursorStyle = false;
  window.viewer._element.style.cursor = '';
  document.body.classList.add("measureCur");
  clickHandle = new SuperMap3D.ScreenSpaceEventHandler(viewer.scene.canvas);
  clickHandle.setInputAction(function (click) {
    let centerPosition = viewer.scene.pickPosition(click.position);
    layerStore.particleOptions['fireWork'] = {
      fireWorkPosition:centerPosition
    }
    addSpark(centerPosition);
    clickHandle.removeInputAction(SuperMap3D.ScreenSpaceEventType.LEFT_CLICK)//移除事件
    window.viewer.enableCursorStyle = true;
    document.body.classList.remove('measureCur');
  }, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
}

function clear(flag=true) {
  // 这种删除方式遇到通视分析会卡死
  // if(setIntervalList.length>0){
  //   scene.primitives.removeAll();
  // }

  // 这种方式删除会报错
  // particleSystemList.forEach((particleSystem)=>{
  //   scene.primitives.remove(particleSystem);
  // })
  particleSystemList = [];

  // 暂时还是使用这种方式，等生命周期结束,就是不能一哈子删除
  if(setIntervalList.length>0){
    setIntervalList.forEach(setIntervalFlag => {
      clearInterval(setIntervalFlag);
    });
    setIntervalList = []
  }

  if(flag) layerStore.particleOptions['fireWork'] = null;

};


onBeforeUnmount(() => {
  clear(false);
});

</script>
    
<style lang="scss" scoped>
:deep(.n-slider-handle) {
  background-color: #414141 !important;
  border: 1.5px solid #3499E5 !important;
}
</style>
    
    
    
    
    
    