<template>
  <div class="row-item">
    <span>{{$t('global.viewMode')}}</span>
    <n-select
      style="width: 1.96rem;"
      v-model:value="state.selectedType"
      :options="state.options"
    />
  </div>

<div class="row-item" v-if="state.selectedType === 'lrRoller'">
  <span>{{ $t('global.shieldDirection') }}</span>
  <div style="width: 1.96rem;">
    <n-radio-group v-model:value="state.lrRoller" name="radiogroup">
      <n-space>
        <n-radio :value="1">{{ $t('global.left') }}</n-radio>
        <n-radio :value="2">{{ $t('global.right') }}</n-radio>
      </n-space>
    </n-radio-group>
  </div>
</div>

<div class="row-item" v-if="state.selectedType === 'tbRoller'">
  <span>{{ $t('global.shieldDirection') }}</span>
  <div style="width: 1.96rem;">
    <n-radio-group v-model:value="state.tbRoller" name="radiogroup">
      <n-space>
        <n-radio :value="4">{{ $t('global.up') }}</n-radio>
        <n-radio :value="8">{{ $t('global.down') }}</n-radio>
      </n-space>
    </n-radio-group>
  </div>
</div>

<div class="row-item" v-if="state.selectedType === 'customRoller'">
  <span>{{ $t('global.shieldDirection') }}</span>
  <div style="width: 1.96rem;">
    <n-radio-group v-model:value="state.customRoller" name="radiogroup">
      <n-space justify="space-between">
        <n-radio :value="1">{{ $t('global.left') }}</n-radio>
        <n-radio :value="2">{{ $t('global.right') }}</n-radio>
        <br/>
      </n-space>
      <n-space>
        <n-radio :value="4">{{ $t('global.up') }}</n-radio>
        <n-radio :value="8">{{ $t('global.down') }}</n-radio>
      </n-space>
    </n-radio-group>
  </div>
</div>

<div class="row-item" v-if="state.selectedType != 'noRoller'">
  <span>{{ $t('global.t_layerList') }}</span>
  <div class="comLayerTreeBox" style="width: 1.96rem;">
    <ComLayerTree v-show="state.selectedType !== 'noRoller'" :is-update="true" :draggable="false"
      style="max-height:2rem;max-width:2.6rem" :default-show-types="['S3M', 'IMG', 'MVT', 'GLOBE']"
      :delete-button-show="false" @getCheckedKeys="getCheckedKeys" />
  </div>
</div>

</template>

<script lang="ts" setup>
import { onBeforeUnmount, watch, reactive, onMounted } from "vue";
import ComLayerTree from "./com-layer-tree.vue";

// 初始化数据
let state = reactive({
options: [
  {
    label: () => GlobalLang.noneRollershutter,
    value: "noRoller",
  },
  {
    label: () => GlobalLang.leftrightRollershutter,
    value: "lrRoller",
  },
  {
    label: () => GlobalLang.updownRollershutter,
    value: "tbRoller",
  },
  {
    label: () => GlobalLang.customRollershutter,
    value: "customRoller",
  },
],
selectedType: "noRoller",
lrRoller: 1, //左右卷帘时默认屏蔽左边
tbRoller: 4, //上下卷帘时默认屏蔽上面
customRoller:0 //自定义
});

onMounted(() => {
createSlider();
});

let verticalSliderLeft: any = "verticalSliderLeft",
verticalSliderRight: any = "verticalSliderRight",
horizontalSliderTop: any = "horizontalSliderTop",
horizontalSliderBottom: any = "horizontalSliderBottom",
fdom;
let layers, imgLayers, mvtLayers, selectedKeys;
let scratchSwipeRegion = new SuperMap3D.BoundingRectangle();

let rollerShutterConfig = {
bottom: 0.66,
left: 0.33,
right: 0.66,
top: 0.33,
index: 1, //当前控制卷帘条
mode: 1 //卷帘模式
};

layers = viewer.scene.layers.layerQueue;
imgLayers = viewer.imageryLayers._layers;
mvtLayers = viewer.scene._vectorTileMaps._layerQueue;

// 创建和移除卷帘条
function createSlider(dom?: any, id?: any) {
fdom = document.getElementById("superMapContainer");
verticalSliderLeft = document.createElement("div");
appendDom(verticalSliderLeft, "verticalSliderLeft");
verticalSliderRight = document.createElement("div");
appendDom(verticalSliderRight, "verticalSliderRight");
horizontalSliderTop = document.createElement("div");
appendDom(horizontalSliderTop, "horizontalSliderTop");
horizontalSliderBottom = document.createElement("div");
appendDom(horizontalSliderBottom, "horizontalSliderBottom");
function appendDom(dom: any, id: any) {
  dom.id = id;
  dom.className = "roller-slider";
  fdom.appendChild(dom);
}
bindSliderEvt(); //绑定事件
}

function removeSlider() {
fdom.removeChild(verticalSliderLeft);
fdom.removeChild(verticalSliderRight);
fdom.removeChild(horizontalSliderTop);
fdom.removeChild(horizontalSliderBottom);
}

//设置卷帘条显隐
function enableSlider(index) {
verticalSliderLeft.style.display = "none";
verticalSliderRight.style.display = "none";
horizontalSliderTop.style.display = "none";
horizontalSliderBottom.style.display = "none";
if (index & 1) verticalSliderLeft.style.display = "block";
if (index & 2) verticalSliderRight.style.display = "block";
if (index & 4) horizontalSliderTop.style.display = "block";
if (index & 8) horizontalSliderBottom.style.display = "block";
}

// viewer.imageryLayers._layers.forEach((imageLayer:any,index:number)=>{
//     setLayerSwipeEnabled('IMG',index,true);
//   })
//设置各类图层的卷帘(暂时只支持s3m)
function setLayersRoller() {

//   // // 只让S3M支持卷帘
// viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: string) => {
//   setLayerSwipeEnabled("S3M", index, true);
// })

if (selectedKeys) {
  selectedKeys.forEach(key => {
    let arr = key.split("--");
    if (arr[1] === "Root" && arr[0] !== "GLOBE") {
      return;
    }
    let index = arr[2];
    index = Number(index);
    setLayerSwipeEnabled(arr[0], index, true);
  });
} else {
  cancelLayersRoller(true);
}

}

//设置图层视口显隐 - 只保证S3M图层，其余图层暂时不支持
function setLayerSwipeEnabled(layerType, index, checked) {
switch (layerType) {
  case "S3M":
    layers[index].swipeEnabled = checked;
    layers[index].swipeRegion = scratchSwipeRegion;
    break;
  // case "IMG":
  //   imgLayers[index].swipeEnabled = checked;
  //   imgLayers[index].swipeRegion = scratchSwipeRegion;
  //   break;
  // case "MVT":
  //   mvtLayers[index].swipeEnabled = checked;
  //   mvtLayers[index].swipeRegion = scratchSwipeRegion;
  //   break;
  case "GLOBE":
    viewer.scene.globe.swipeEnabled = checked;
    viewer.scene.globe.swipeRegion = scratchSwipeRegion;
    break;
  default:
    null;
}
}

// 取消所有图层的卷帘
function cancelLayersRoller(checked) {
if (!SuperMap3D.defined(checked)) {
  checked = false;
}
for (let i = 0; i < layers.length; i++) {
  layers[i].swipeEnabled = checked;
  layers[i].swipeRegion = scratchSwipeRegion;
}
// for (let i = 1; i < imgLayers.length; i++) {
//   imgLayers[i].swipeEnabled = checked;
//   imgLayers[i].swipeRegion = scratchSwipeRegion;
// }
// for (let i = 0; i < mvtLayers.length; i++) {
//   mvtLayers[i].swipeEnabled = checked;
//   mvtLayers[i].swipeRegion = scratchSwipeRegion;
// }
viewer.scene.globe.swipeEnabled = checked;
viewer.scene.globe.swipeRegion = scratchSwipeRegion;
}

// 勾选图层节点
function getCheckedKeys(params, data) {
selectedKeys = params;
data.forEach(obj => {
  if (!obj.children) {
    fn(obj);
    return;
  }
  let arr = obj.children;
  if (!(arr instanceof Array) || arr.length === 0) return;
  arr.forEach(layerObj => {
    fn(layerObj);
  });
});
function fn(layerObj) {
  let keys = layerObj.key.split("--");
  let index = keys[2];
  index = Number(index);
  if (index === -1) return;
  let checked = params.includes(layerObj.key);
  setLayerSwipeEnabled(keys[0], index, checked);
}
}

// function getAllLayers(s3m, imgs, mvts) {
//   layers = SuperMap3D.defaultValue(s3m, []);
//   // layers = viewer.scene.layers.layerQueue;
//   imgLayers = SuperMap3D.defaultValue(imgs, []);
//   mvtLayers = SuperMap3D.defaultValue(mvts, []);
// }

/**
* 设置卷帘的分割方向及分割条的位置。
*
*/
function setRollerShutterSplit() {
let mode = rollerShutterConfig.mode;
let x1 = rollerShutterConfig.left;
let x2 = rollerShutterConfig.right;
let y1 = rollerShutterConfig.top;
let y2 = rollerShutterConfig.bottom;
// 左右卷帘使用left slider滑动，上下卷帘使用top slider滑动
switch (mode) {
  case 1:
    SuperMap3D.BoundingRectangle.unpack([x1, 0, 1, 1], 0, scratchSwipeRegion);
    break;
  case 2:
    SuperMap3D.BoundingRectangle.unpack([0, 0, x1, 1], 0, scratchSwipeRegion);
    break;
  case 4:
    SuperMap3D.BoundingRectangle.unpack([0, y1, 1, 1], 0, scratchSwipeRegion);
    break;
  case 8:
    SuperMap3D.BoundingRectangle.unpack([0, 0, 1, y1], 0, scratchSwipeRegion);
    break;
  case 15:
    SuperMap3D.BoundingRectangle.unpack(
      [x1, y1, x2 - x1, y2 - y1],
      0,
      scratchSwipeRegion
    );
    break;
  default:
    SuperMap3D.BoundingRectangle.unpack([x1, 0, 1, 1], 0, scratchSwipeRegion);
    break;
}
setLayersRoller();
}

/**
* 注册卷帘分割条的拖拽事件。
*/
function bindSliderEvt() {
let width = fdom.clientWidth; // 界面宽度
let height = fdom.clientHeight; // 界面高度
verticalSliderLeft.addEventListener(
  "mousedown",
  function (e) {
    mouseDown(e, 1);
  },
  false
);
verticalSliderRight.onmousedown = function (e) {
  mouseDown(e, 3);
};
horizontalSliderTop.onmousedown = function (e) {
  mouseDown(e, 2);
};
horizontalSliderBottom.onmousedown = function (e) {
  mouseDown(e, 4);
};

document.addEventListener("mouseup", mouseUp, false);
function mouseUp(e) {
  document.removeEventListener("mousemove", sliderMove, false);
}

function mouseDown(e, index) {
  rollerShutterConfig.index = index;
  document.addEventListener("mousemove", sliderMove, false);
}

function sliderMove(e) {
  if (e.preventDefault) e.preventDefault();
  else e.returnValue = false;
  switch (rollerShutterConfig.index) {
    case 1:
      verticalSliderLeft.style.left = e.clientX + "px";
      rollerShutterConfig.left = e.clientX / width;
      break;
    case 2:
      horizontalSliderTop.style.top = e.clientY + "px";
      rollerShutterConfig.top = e.clientY / height;
      break;
    case 3:
      verticalSliderRight.style.left = e.clientX + "px";
      rollerShutterConfig.right = e.clientX / width;
      break;
    case 4:
      horizontalSliderBottom.style.top = e.clientY + "px";
      rollerShutterConfig.bottom = e.clientY / height;
      break;
  }
  setRollerShutterSplit();
}
}

watch(
() => state.selectedType,
val => {
  switch (val) {
    case "noRoller":
      state.customRoller = 0;
      enableSlider(0);
      cancelLayersRoller(false);
      break;
    case "lrRoller":
      enableSlider(1);
      rollerShutterConfig.mode = Number(state.lrRoller);
      break;
    case "tbRoller":
      enableSlider(4);
      rollerShutterConfig.mode = Number(state.tbRoller);
      break;
    case "customRoller":
      enableSlider(15);
      rollerShutterConfig.mode = 15;
      break;
    default:
      break;
  }
  if (val === "noRoller") return;
  setRollerShutterSplit();
}
);
watch(
() => state.lrRoller,
val => {
  if(state.selectedType === 'noRoller') return;
  rollerShutterConfig.mode = Number(val);
  setRollerShutterSplit();
}
);
watch(
() => state.tbRoller,
val => {
  if(state.selectedType === 'noRoller') return;
  rollerShutterConfig.mode = Number(val);
  setRollerShutterSplit();
}
);
watch(
() => state.customRoller,
val => {
  if(state.selectedType === 'noRoller') return;
  rollerShutterConfig.mode = Number(val);
  setRollerShutterSplit();
}
);

// 销毁
onBeforeUnmount(() => {
enableSlider(0);
cancelLayersRoller(false);
// layers = undefined;
removeSlider();
});
</script>

<style lang="scss" >
// 卷帘
#verticalSlider {
position: absolute;
left: 50%;
top: 0;
background-color: #d3d3d3;
width: 0.03rem;
height: 100%;
z-index: 1;
display: none;
cursor: ew-resize;
}

#horizontalSlider {
position: absolute;
left: 0;
top: 50%;
background-color: #d3d3d3;
width: 100%;
height: 0.03rem;
z-index: 1;
display: none;
cursor: ns-resize;
}

#verticalSliderLeft {
@extend #verticalSlider;
left: 33%;
}

#verticalSliderRight {
@extend #verticalSlider;
left: 66%;
}

#horizontalSliderTop {
@extend #horizontalSlider;
top: 33%;
}

#horizontalSliderBottom {
@extend #horizontalSlider;
top: 66%;
}

.comLayerTreeBox {
border: 0.01rem solid $--SM--BgColor-15;
}
</style>







