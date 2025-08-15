<!-- 图层属性 -->
<template>
  <n-scrollbar style="max-height: 6rem">
    <div class="right-panel-container-not-tabs">
      <!-- 选择图层 -->
      <div class="row-wrap">
        <div class="label">{{ $t("chooseLayer") }}</div>
        <div class="content">
          <n-select v-model:value="state.selectedName" :options="state.s3mlayers" disabled="true" />
        </div>
      </div>

      <!-- 渲染模式 -->
      <div class="row-wrap">
        <div class="label">{{ $t("renderMode") }}</div>
        <div class="content">
          <n-radio-group v-model:value="state.cullEnabled" name="operationType">
            <n-radio :value="true">{{ $t("singleRender") }}</n-radio>
            <n-radio :value="false">{{ $t("doubleRender") }}</n-radio>
          </n-radio-group>
        </div>
      </div>

      <!-- 开启阴影 -->
      <div class="row-wrap">
        <div class="content">
          <div class="switch-box">
            <div class="text">{{ $t("showShadow") }}</div>
            <n-switch v-model:value="state.shadowMode" size="small" />
          </div>
        </div>
      </div>

      <!-- 根节点驻留 -->
      <div class="row-wrap">
        <div class="content">
          <div class="switch-box">
            <div class="text">{{ $t("residentRootTile") }}</div>
            <n-switch v-model:value="state.isKeepRootTile" size="small" />
          </div>
        </div>
      </div>

      <!-- 阴影明暗度 -->
      <div class="row-wrap">
        <div class="label">{{ $t("shadowBrightness") }}</div>
        <div class="content">
          <div class="slider-box-new">
            <n-slider v-model:value="state.shadowDarkness" :step="0.05" :min="0" :max="1" />
            <n-input-number v-model:value="state.shadowDarkness" :update-value-on-input="false" :bordered="false"
              :show-button="false" :min="0" :max="1" placeholder="" size="small" />
          </div>
        </div>
      </div>

      <!-- 对象显隐 -->
      <div class="row-wrap">
        <div class="label">{{ $t("objectHiding") }}</div>
        <div class="content">
          <n-select v-model:value="state.visibility" :options="state.visibilityMode" />
        </div>
      </div>

      <!-- 多选 -->
      <div class="row-wrap">
        <div class="content">
          <n-checkbox v-model:checked="state.multiChoose" :label="$t('multiple')" />
        </div>
      </div>

      <!-- 对象ID列表 -->
      <div class="row-wrap">
        <div class="label">{{ $t("objectIDs") }}</div>
        <div class="content">
          <n-input v-model:value="state.passIDs" :update-value-on-input="false" type="text" placeholder="1,2,3..."
            :title="state.passIDs" @input="handlePassIDs">
          </n-input>
        </div>
      </div>

      <!-- 指定ID列表隐藏 -->
      <div class="row-wrap">
        <div class="content">
          <n-checkbox v-model:checked="state.isOpenPassIds" @update:checked="computedObjsVisible"
            :label="$t('passIDsToHiding')" />
        </div>
      </div>

      <!-- 最小可见距离 -->
      <div class="row-wrap">
        <div class="label">{{ $t("MinVisibleDistance") }}</div>
        <div class="content">
          <div class="slider-box-new">
            <n-slider class="shorter" v-model:value="state.visibleDistanceMin" :step="10" :min="-100"
              :max="state.visibleDistanceMax-1" />
            <n-input-number v-model:value="state.visibleDistanceMin" :update-value-on-input="false" :bordered="false"
              :show-button="false" :min="-100" :max="state.visibleDistanceMax-1" placeholder="" size="small" />
            <span class="unit">{{ $t("meter") }}</span>
          </div>
        </div>
      </div>

      <!-- 最大可见距离 -->
      <div class="row-wrap">
        <div class="label">{{ $t("MaxVisibleDistance") }}</div>
        <div class="content">
          <div class="slider-box-new">
            <n-slider class="shorter" v-model:value="state.visibleDistanceMax" :step="10" :min="-100"
              :max="s3mLayer_visibleDistanceMax" />
            <n-input-number v-model:value="state.visibleDistanceMax" :update-value-on-input="false" :bordered="false"
              :show-button="false" :min="-100" :max="s3mLayer_visibleDistanceMax" placeholder="" size="small" />
            <span class="unit">{{ $t("meter") }}</span>
          </div>
        </div>
      </div>

    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import layerManagement from "@/tools/layerManagement";

type StateType = {
  s3mlayers: any;
  selectedName: string; // 当前选择的图层
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  gamma: number;
  shadowMode: number;
  shadowDarkness: number;
  selectEnabled: boolean;
  multiChoose: boolean;
  cullEnabled: boolean;
  visibility: number;
  visibilityMode: any;
  visibleDistanceMin: number; //最小可见距离
  visibleDistanceMax: number; //最大可见距离
  isKeepRootTile:boolean; // 是否开启根节点驻留
  isOpenPassIds:boolean;
  passIDs:any;
  passIDs_handled:any;
};

// 初始化变量
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedName:'',
  brightness: 1,
  contrast: 1,
  hue: 0,
  saturation: 1,
  gamma: 1,
  shadowMode: 0,
  shadowDarkness: 0.2,
  selectEnabled: true,
  multiChoose: false,
  cullEnabled: false,
  visibility: 2,
  visibleDistanceMin: 0, //最小可见距离
  visibleDistanceMax: 12000, //最大可见距离
  visibilityMode: [
    { label: () => $t("disPlayAll"), value: 2 },
    { label: () => $t("disPlaySelected"), value: 0 },
    { label: () => $t("hideSelected"), value: 1 },
  ],
  isKeepRootTile:false,
  isOpenPassIds:false,
  passIDs:'',
  passIDs_handled:[],
});

let currentLayer:any = undefined;
const canvas = document.getElementsByTagName('canvas')[0];
let s3mLayer_visibleDistanceMax =  window.customConfig.s3mLayer_visibleDistanceMax || 90000

function init() {
  state.s3mlayers =  layerManagement.getS3MLayerList();

  state.selectedName = window.iEarthBindData.CurrentS3MLayerName;
  currentLayer = viewer.scene.layers.find(state.selectedName);
  if(!currentLayer) return;
  currentLayer.selectEnabled = true;

  getAttributes(currentLayer);
}

onMounted(() => {
  init();
  // 避免使用SuperMap3D上的监听方法，因为这个会导致select延迟，会点好几次才能选中模型
  // viewer.eventManager.addEventListener("CLICK", pickModel, true); 
  if(canvas) canvas.addEventListener('click',pickModel);
});

onBeforeUnmount(() => {
  if(canvas) canvas.removeEventListener('click',pickModel);
});

// 获取当前图层的属性值
function getAttributes(currentLayer) {
  if(!currentLayer || !(currentLayer instanceof SuperMap3D.S3MTilesLayer)) return;
  console.log('图层属性当前图层:',currentLayer);

  state.brightness = SuperMap3D.defaultValue(currentLayer.brightness, 1);
  state.contrast = SuperMap3D.defaultValue(currentLayer.contrast, 1);
  state.hue = SuperMap3D.defaultValue(currentLayer.hue, 0);
  state.saturation = SuperMap3D.defaultValue(currentLayer.saturation, 1);
  state.gamma = SuperMap3D.defaultValue(currentLayer.gamma, 1);
  state.shadowMode = SuperMap3D.defaultValue(currentLayer.shadowMode, SuperMap3D.ShadowType.NONE);
  state.shadowDarkness = SuperMap3D.defaultValue(currentLayer.shadowDarkness,0.3);
  state.selectEnabled = SuperMap3D.defaultValue(currentLayer.selectEnabled,true);
  state.multiChoose = SuperMap3D.defaultValue(currentLayer.multiChoose, false);
  state.cullEnabled = SuperMap3D.defaultValue(currentLayer._cullEnabled, false);
  state.visibility = SuperMap3D.defaultValue(currentLayer.visibility, 2);
  state.visibleDistanceMin = SuperMap3D.defaultValue(currentLayer.visibleDistanceMin,0);
  state.visibleDistanceMax = SuperMap3D.defaultValue(currentLayer.visibleDistanceMax,12000);

  state.isKeepRootTile = currentLayer.residentRootTile;
  state.cullEnabled = SuperMap3D.defaultValue(currentLayer._cullEnabled, false);
  state.visibleDistanceMin = currentLayer.visibleDistanceMin;
  state.visibleDistanceMax = currentLayer.visibleDistanceMax;

  if(currentLayer.customPassIdOptions){
    state.passIDs = currentLayer.customPassIdOptions.passIDs;
    let mode = currentLayer.customPassIdOptions.mode; // 会触发watch
    if(mode == 'all'){
      state.visibility = 2;
    }else if(mode == 'hidden'){
      state.isOpenPassIds = true;
      state.visibility = 1;
    }else if(mode == 'show'){
      state.isOpenPassIds = false;
      state.visibility = 0;
    }
  }
  handlePassIDs();
}

// 拾取S3M模型实现点选隐藏
function pickModel(e) {
  computedObjsVisible();
}

// 处理传入的对象IDS
function handlePassIDs(){
  // console.log("val:",val)
  let value = state.passIDs;
  if(!value || value=='') return;
  value = String(value);
  if(!value.includes(',')) return;
  let ids = String(value).split(',');
  // passIDs = passIDs.map(id=>String(id).trim()); // 没起效果不影响原数组
  let passIDs:any = [];
  ids.forEach(id=>{
    let id_trim = id.trim();
    passIDs.push(id_trim);;
  })
  state.passIDs_handled = passIDs;
  // let flag = val == true ? 'follow' : 'no';
  // computedObjsVisible(flag,passIDs);
  // computedObjsVisible(); // 暂时先不开启输入就直接设置ID显隐
}

// 计算图层模型显隐
// function computedObjsVisible(flag:any=undefined,passIDs:any=undefined){
function computedObjsVisible(){
  setTimeout(() => { // 延时200毫秒，避免出现当前selection还是上次的
    let chooseIDs = currentLayer.getSelection();
    let endIDs = [];
    let passIDs = state.passIDs_handled;
    let isOpenPassIds = state.isOpenPassIds;
    if(isOpenPassIds){
      endIDs = chooseIDs.concat(passIDs);
    }else{
      endIDs = chooseIDs;
    }
    // let flag = isHidden == undefined ? state.visibility : isHidden;
    console.log('传入ID列表:',passIDs);
    console.log("endIDs:",endIDs)
    switch (state.visibility) {
      case 2:
        currentLayer.setObjsVisible([], false);
        if(isOpenPassIds){
          currentLayer.customPassIdOptions = {
            mode:'all',
            passIDs:passIDs
          };
        }
        break;
      case 1:
        currentLayer.setObjsVisible(endIDs, false);
        if(isOpenPassIds){
          currentLayer.customPassIdOptions = {
            mode:'hidden',
            passIDs:passIDs
          };
        }
        break;
      case 0:
        currentLayer.setObjsVisible(endIDs, true);
        if(isOpenPassIds){
          currentLayer.customPassIdOptions = {
            mode:'show',
            passIDs:passIDs
          };
        }
        break;
      default:
        null;
        break;
    }
  }, 100);
}

// 监听
watch(
  () => state.selectedName,
  (val) => {
    currentLayer = viewer.scene.layers.find(val);
    getAttributes(currentLayer);
  }
);
watch(
  () => state.brightness,
  (val) => {
    if (currentLayer)
      currentLayer.brightness = Number(val);
  }
);
watch(
  () => state.contrast,
  (val) => {
    if (currentLayer)
      currentLayer.contrast = Number(val);
  }
);
watch(
  () => state.hue,
  (val) => {
    if (currentLayer)
      currentLayer.hue = Number(val);
  }
);
watch(
  () => state.saturation,
  (val) => {
    if (currentLayer)
      currentLayer.saturation = Number(val);
  }
);
watch(
  () => state.gamma,
  (val) => {
    if (currentLayer)
      currentLayer.gamma = Number(val);
  }
);
watch(
  () => state.shadowMode,
  (val) => {
    if (currentLayer)
      if (val) {
        viewer.shadows = true;
        currentLayer.shadowType = SuperMap3D.ShadowType.ALL; // SELECTION
      } else {
        viewer.shadows = false;
        currentLayer.shadowType = SuperMap3D.ShadowType.NONE;
      }
  }
);
watch(
  () => state.shadowDarkness,
  (val) => {
    viewer.shadowMap.darkness = 1 - Number(val); // 相当于取反了
    // viewer.shadowMap.darkness = Number(val);
  }
);
watch(
  () => state.multiChoose,
  (val) => {
    if (currentLayer)
      currentLayer.multiChoose = val;
  }
);
watch(
  () => state.selectEnabled,
  (val) => {
    if (currentLayer)
      currentLayer.selectEnabled = val;
  }
);
watch(
  () => state.cullEnabled,
  (val) => {
    if (currentLayer){
      currentLayer._cullEnabled = val;
      currentLayer.cullEnabled = val;
    }
  }
);
watch(
  () => state.visibleDistanceMin,
  (val) => {
    if (currentLayer)
      currentLayer.visibleDistanceMin = Number(val);
  }
);
watch(
  () => state.visibleDistanceMax,
  (val) => {
    if (currentLayer)
      currentLayer.visibleDistanceMax = Number(val);
  }
);
watch(
  () => state.visibility,
  (val) => {
    if (currentLayer){
      computedObjsVisible();
    }
  }
);

watch(
  () => state.isKeepRootTile,
  (val) => {
    if (currentLayer){
      currentLayer.residentRootTile = val;
    }
  }
);
watch(
  () => state.isOpenPassIds,
  (val) => {
    // if (currentLayer){
    //   if(!val) currentLayer.customPassIdOptions = false;
    // }
  }
);
</script>

<style lang="scss" scoped>
  // radio单选框组合样式
:deep(.n-radio) .n-radio__label {
  width: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.n-radio):first-child {
  margin-right: 0rem !important;
}

// 最大最小可见距离滑动条长度
:deep(.shorter) .n-slider-rail {
  width: 2.0rem !important;
}
</style>