<template>
  <div class="layerSeries-box">
     <!-- <div class="row-item">
        <span>选择图层</span>
        <n-select
            style="width: 2.2rem"
            v-model:value="state.selectedIndex"
            :options="state.s3mlayers"
        />
     </div> -->
     <div class="row-item" v-show="state.isBaiMo">
        <span>{{$t('global.fillStyle')}}</span>
        <n-select
            class="add-input-border"
            style="width: 62%"
            v-model:value="state.fillStyle"
            :options="state.fillStyleMode"
        />
     </div>
     <div class="row-item">
        <span>{{$t('global.foreColor')}}</span>
        <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
        <n-color-picker
            v-model:value="state.foreColor"
            :render-label="
            () => {
                return '';
            }
            "
            size="small"
        ></n-color-picker>
        </div>
    </div>

    <div class="row-item" v-show="state.isBaiMo">
        <span>{{$t('global.lineColor')}}</span>
        <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
        <n-color-picker
            v-model:value="state.lineColor"
            :render-label="
            () => {
                return '';
            }
            "
            size="small"
        ></n-color-picker>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.selectedColor')}}</span>
        <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
        <n-color-picker
            v-model:value="state.selectedColor"
            :render-label="
            () => {
                return '';
            }
            "
            size="small"
        ></n-color-picker>
        </div>
    </div>

    <div class="row-item">
        <span>{{$t('global.selectColorMode')}}</span>
        <n-radio-group v-model:value="state.selectColorMode" name="shadowMode" style="width:1.96rem">
          <!-- <n-space justify="space-between"> -->
            <n-radio :value="0"><n-ellipsis >{{$t('global.colorMix')}}</n-ellipsis></n-radio>
            <n-radio :value="1"><n-ellipsis >{{$t('global.colorReplace')}} </n-ellipsis></n-radio>
          <!-- </n-space> -->
        </n-radio-group>
    </div>

      <div class="row-item">
        <span>{{$t('global.bottomHeight')}}</span>
        <div class="slider-box">
            <n-slider
            v-model:value="state.bottomAltitude"
            style="width: 70%"
            :step="1" :min="-100" :max="100"
            />
            <div class="row-slider-num">{{ state.bottomAltitude }}</div>
        </div>
      </div>

      <div class="row-item" v-show="state.isCloudPoint">
        <span>LOD</span>
        <div class="slider-box">
            <n-slider
            v-model:value="state.LODScale"
            style="width: 70%"
            :step="0.5" :min="0" :max="10"
            />
            <div class="row-slider-num">{{ state.LODScale }}</div>
        </div>
      </div>

      <div class="row-item">
        <span>{{$t('global.layerTransparency')}}</span>
        <div class="slider-box">
            <n-slider
            v-model:value="state.layerTrans"
            style="width: 70%"
            :step="0.05" :min="0" :max="1"
            />
            <div class="row-slider-num">{{ state.layerTrans }}</div>
        </div>
      </div>
      <!-- <div class="btn-row-item">
        <n-button type="info" color="#3499E5" text-color="#fff" attr-type="button" @click="onSaveUserClk">
                  {{$t('global.save')}}
                </n-button>
        <n-button @click="reset">{{$t('global.reset')}}</n-button>
      </div> -->
      <div class="btn-row-item">
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        class="ans-btn"
        @click="saveStyle"
        >{{$t('global.save')}}</n-button
      >
      <n-button class="btn-secondary" @click="reset" color="rgba(255, 255, 255, 0.65)" ghost>{{$t('global.reset')}}</n-button>
    </div>
    </div>


   
      <!-- <div class="sm-box">
        <n-ellipsis style="line-height: 28px;">最小可见距离</n-ellipsis>
        <n-input-number v-model:value="state.visibleDistanceMin" size="small" style="width:100%"></n-input-number>
      </div>
      <div class="sm-box">
        <n-ellipsis style="line-height: 28px;">最大可见距离</n-ellipsis>
        <n-input-number v-model:value="state.visibleDistanceMax" size="small" style="width:100%"></n-input-number>
      </div> -->
  </template>

<script setup lang="ts">
import { reactive,onMounted, onBeforeUnmount, watch } from "vue";
import { useLayerStore } from "@/store/layerStore";
import { useMessage } from "naive-ui";

const message = useMessage();
const layerStore = useLayerStore();

type StateType = {
  s3mlayers: any, //当前存在的可选择s3m图层
  selectedIndex: number, //默认选择图层index
  foreColor: string, //前景色
  lineColor: string, //线颜色
  selectedColor: string, //选中色
  selectColorMode: number, //选中色模式
  bottomAltitude: number, //底部高程
  LODScale: number, //LOD
  layerTrans: number, //图层透明度
  fillStyle: number, //填充风格
  visibleDistanceMin: number, //最小可见距离
  visibleDistanceMax: number, //最大可见距离
  fillStyleMode:any,
  isCloudPoint:boolean,// 当前图层是否为点云
  isBaiMo:boolean,// 当前图层是否为白膜
}

// 初始化数据
let state = reactive<StateType>({
  s3mlayers: [], //当前存在的可选择s3m图层
  selectedIndex: 0, //默认选择图层index
  foreColor: "rgba(255, 255, 255, 1)", //前景色
  lineColor: "rgba(255, 255, 255, 1)", //线颜色
  selectedColor: "rgba(179,179,255, 1)", //选中色
  selectColorMode: 0, //选中色模式
  bottomAltitude: 0, //底部高程
  LODScale: 1, //LOD
  layerTrans: 1, //图层透明度
  fillStyle: 0, //填充风格
  visibleDistanceMin: 0, //最小可见距离
  visibleDistanceMax: 12000, //最大可见距离
  fillStyleMode: [
    { label: () => GlobalLang.fillMode, value: 0 },
    { label: () => GlobalLang.wireframe, value: 1 },
    { label: () => GlobalLang.fillBothMode, value: 2 }
  ],
  isCloudPoint:false,
  isBaiMo:false,
});
let layers;

function updateLayers() {
  layers = viewer.scene.layers.layerQueue;
  if (!layers || layers.length < 1) {
    state.s3mlayers = [{ label: () => GlobalLang.noLayer, value: 0 }];
    return;
  }
  state.s3mlayers.length = 0;
  layers.forEach((layer, index) => {
    let name = layer._name;
    state.s3mlayers.push({
      label: name,
      value: index
    });
  });
  if (state.selectedIndex > layers.length - 1) state.selectedIndex = 0;
}

function init() {
  if (!window.viewer) return;
  updateLayers();
  state.selectedIndex = Number(layerStore.s3mLayerSelectIndex);

  // _fileType:8 => 点云
  if(layers[state.selectedIndex]._fileType === 8){
      state.isCloudPoint = true;
  }

  // 白膜图层
  if(layers[state.selectedIndex]._name == '重庆白模' || layers[state.selectedIndex]._name == '横滨白模'){
      state.isBaiMo = true;
  }

  let keys = Object.keys(layerStore.layerStyleOptions);
  if(keys.length>0){
    let s3mLayerName = layers[state.selectedIndex]._name;
    let option = layerStore.particleOptions[s3mLayerName];
    if(option) switchCase(option);
  }
}
// init();
onMounted(() => {
  init();
})

function getAttributes() {
  if (!SuperMap3D.defined(layers) || !SuperMap3D.defined(layers[state.selectedIndex]))
    return;
  let selectLayer = layers[state.selectedIndex];
  state.foreColor = SuperMap3D.defaultValue(
    selectLayer.style3D.fillForeColor.toCssColorString (),
    "rgba(255, 255, 255, 1)"
  );
  state.lineColor = SuperMap3D.defaultValue(
    selectLayer.style3D.lineColor.toCssColorString (),
    "rgba(255,255,255, 1)"
  );
  state.selectedColor = SuperMap3D.defaultValue(
    selectLayer.selectedColor.toCssColorString (),
    "rgba(179,179,255, 1)"
  );
  state.selectColorMode = SuperMap3D.defaultValue(selectLayer.selectColorType, 0);
  state.bottomAltitude = SuperMap3D.defaultValue(
    selectLayer.style3D.bottomAltitude,
    0
  );
  state.LODScale = SuperMap3D.defaultValue(selectLayer.lodRangeScale, 1);
  state.layerTrans = SuperMap3D.defaultValue(
    selectLayer.style3D.fillForeColor.alpha,
    1
  );
  state.fillStyle = SuperMap3D.defaultValue(
    selectLayer.style3D.fillStyle,
    SuperMap3D.FillStyle.Fill
  );
  state.visibleDistanceMin = SuperMap3D.defaultValue(
    selectLayer.visibleDistanceMin,
    0
  );
  state.visibleDistanceMax = SuperMap3D.defaultValue(
    selectLayer.visibleDistanceMax,
    12000
  );
}

// 重置
function reset(){
  state.foreColor = "rgba(255, 255, 255, 1)"; //前景色
  state.lineColor = "rgba(255, 255, 255, 1)"; //线颜色
  state.selectedColor = "rgba(179,179,255, 1)";//选中色
  state.selectColorMode = 0; //选中色模式
  state.bottomAltitude = 0; //底部高程
  state.layerTrans = 1; //图层透明度
  state.fillStyle = 0; //填充模式

  if(state.isCloudPoint){
    state.LODScale = 1; //LOD
  }
}

function saveStyle(){
  let layer = layers[state.selectedIndex];
  let key = layer._name;
  let layerStyleItem:any = {};

  layerStyleItem['foreColor'] = state.foreColor;
  layerStyleItem['lineColor'] = state.lineColor;
  layerStyleItem['selectedColor'] = state.selectedColor;
  layerStyleItem['selectColorMode'] = state.selectColorMode;
  layerStyleItem['bottomAltitude'] = state.bottomAltitude;
  layerStyleItem['layerTrans'] = state.layerTrans;
  layerStyleItem['LODScale'] = state.LODScale;
  layerStyleItem['fillStyle'] = state.fillStyle;

  layerStore.layerStyleOptions[key] = layerStyleItem;

  message.success(`${key}${GlobalLang.attrSaveOk}`);
}

// 设置参数
function switchCase(option:any) {
  for (let key in option) {
    switch (key) {
      case "foreColor":
        state.foreColor = option[key];
        break;
      case "lineColor":
        state.lineColor = option[key];
        break;
      case "selectedColor":
        state.selectedColor = option[key];
        break;
      case "selectColorMode":
        state.selectColorMode = Number(option[key]);
        break;
      case "bottomAltitude":
        state.bottomAltitude = Number(option[key]);
        break;
      case "fillStyle":
        state.fillStyle = Number(option[key]);
        break;
      case "LODScale":
        state.LODScale = Number(option[key]);
        break;
      case "layerTrans":
        state.layerTrans = Number(option[key]);
        break;
      default:
        break;
    }
  }
}
// 监听
watch(
  () => layerStore.layerChangeCount,
  () => {
    updateLayers();
});

watch(
  () => state.selectedIndex,
  val => {
    getAttributes();

    if(layers[state.selectedIndex].name === "POINTCLOUD23"){
      state.isCloudPoint = true;
    }
  }
);

watch(
  () => state.foreColor,
  val => {
    if (layers[state.selectedIndex])
      layers[
        state.selectedIndex
      ].style3D.fillForeColor = SuperMap3D.Color.fromCssColorString(val);
  }
);
watch(
  () => state.lineColor,
  val => {
    if (layers[state.selectedIndex]){
      // layers[
      //   state.selectedIndex
      // ].style3D.lineColor = SuperMap3D.Color.fromCssColorString(val);
      let layer =   layers[state.selectedIndex];
      layer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(val);
    }
  }
);
watch(
  () => state.selectedColor,
  val => {
    if (layers[state.selectedIndex])
      layers[
        state.selectedIndex
      ].selectedColor = SuperMap3D.Color.fromCssColorString(val);
  }
);
watch(
  () => state.selectColorMode,
  val => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].selectColorType = val;
  }
);
watch(
  () => state.bottomAltitude,
  val => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].style3D.bottomAltitude = Number(val);
    layers[state.selectedIndex].refresh();
  }
);
watch(
  () => state.fillStyle,
  val => {
    if (layers[state.selectedIndex])
      switch (val) {
        case 0:
          layers[state.selectedIndex].style3D.fillStyle = SuperMap3D.FillStyle.Fill;
          break;
        case 1:
          layers[state.selectedIndex].style3D.fillStyle =
            SuperMap3D.FillStyle.WireFrame;
          layers[
            state.selectedIndex
          ].style3D.lineColor = SuperMap3D.Color.fromCssColorString(
            state.lineColor
          );
          break;
        case 2:
          layers[state.selectedIndex].style3D.fillStyle =
            SuperMap3D.FillStyle.Fill_And_WireFrame;
          layers[
            state.selectedIndex
          ].style3D.lineColor = SuperMap3D.Color.fromCssColorString(
            state.lineColor
          );
          break;
        default:
          break;
      }
    layers[state.selectedIndex].refresh();
  }
);
watch(
  () => state.LODScale,
  val => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].lodRangeScale = Number(val);
  }
);
watch(
  () => state.layerTrans,
  val => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].style3D.fillForeColor.alpha = Number(val);
  }
);
watch(
  () => state.visibleDistanceMin,
  val => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].visibleDistanceMin = Number(val);
  }
);

watch(
  () => state.visibleDistanceMax,
  val => {
    if (layers[state.selectedIndex])
      layers[state.selectedIndex].visibleDistanceMax = Number(val);
  }
);
watch(
  () => layerStore.s3mLayerSelectIndex,
  val => {
    reset();
    state.selectedIndex = Number(val);
  }
);
onBeforeUnmount(() => {});
</script>
  
  <style lang="scss" scoped>
  .layerSeries-box {
    width: 100%;
    height: 100%;
    padding: 0 0.12rem;
    box-sizing: border-box;
  }
  </style>
  
  
  
  
  
  
  
  