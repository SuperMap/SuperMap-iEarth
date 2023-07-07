<template>
  <div class="shadow-time">
    <div class="itemBox-shadow">
      <n-slider v-model:value="state.timeArray" :max="96" :step="0.5" range :marks="state.marks"
          :format-tooltip="formatTime" />
          <i class="iconfont iconSize iconbofang btnImg" title="播放一天时间段内阳光和阴影动画" v-show="state.showStartTimeBtn" @click="sunLightForTime(true)"></i>
          <i class="iconfont iconSize iconzanting btnImg" title="播放一年的阳光和阴影动画" v-show="!state.showStartTimeBtn" @click="sunLightForTime(false)"></i>
  </div>
  <div class="itemBox-shadow">
      <!-- <n-date-picker class="shadow-date-picker" v-model:value="currentTime" type="date" size="small"
          :actions="['now']" /> -->
          <n-date-picker class="shadow-date-picker" v-model:value="currentTime" type="date" />
          <i class="iconfont iconSize iconbofang btnImg" title="播放一年的阳光和阴影动画" v-show="state.showStartDateBtn" @click="sunLightForDate(true)"></i>
          <i class="iconfont iconSize iconzanting btnImg" title="播放一年的阳光和阴影动画" v-show="!state.showStartDateBtn" @click="sunLightForDate(false)"></i>
  </div>
  </div>

  <!-- <div class="row-item">
    <span>时间间隔</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.timeInterval"
      :show-button="false"
    >
      <template #suffix>米</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>间距</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.spacing"
      :show-button="false"
    >
      <template #suffix>米</template>
    </n-input-number>
  </div> -->
  <!-- <sm-rowLayOut>
      <template #item-lable>{{ $t('global.timeInterval') }}</template>
      <template #item-content>
          <n-input-number v-model:value="state.timeInterval"></n-input-number>
      </template>
  </sm-rowLayOut> -->

  <!-- <sm-rowLayOut>
      <template #item-lable>{{ $t('global.space') }}</template>
      <template #item-content>
          <n-input-number v-model:value="state.spacing"></n-input-number>
      </template>
  </sm-rowLayOut> -->

<div class="row-item">
<span>底部高程</span>
<n-input-number
style="width: 1.96rem;height: 0.32rem;"
v-model:value="state.bottomHeight"
:show-button="false"
>
<template #suffix>米</template>
</n-input-number>
</div>
<div class="row-item">
<span>拉伸高度</span>
<n-input-number
style="width: 1.96rem;height: 0.32rem;"
v-model:value="state.extrudeHeight"
:show-button="false"
>
<template #suffix>米</template></n-input-number
>
</div>

<div class="row-item">
<span>间距</span>
<n-input-number
style="width: 1.96rem;height: 0.32rem;"
v-model:value="state.spacing"
:show-button="false"
>
<template #suffix>米</template>
</n-input-number>
</div>

<div class="row-item">
<span>体显示</span>
<div class="check-box">
  <n-checkbox v-model:checked="state.shadowBodyShow"></n-checkbox>
</div>
</div>

<!-- 开启阴影 -->
<div class="row-item">
<span>显示阴影</span>
<div class="check-box">
  <n-checkbox v-model:checked="state.shadowShow"></n-checkbox>
</div>
</div>

<div class="bableShadow" ref="bableShadowDom" v-show="state.shadowRadioShow">
<div class="row-item" style="margin-top:0.12rem">
<span class="shadow-anaylse-pop-titie">分析结果</span>
<span @click="state.shadowRadioShow = false;" style="margin-right:14px">X</span>
</div>
<div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
<span>采光率</span>
<n-input-number
  style="width: 1.5rem;"
  v-model:value="state.shadowRadio.radio"
  :show-button="false"
  disabled
>
</n-input-number>
</div>
<div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
<span>经度</span>
<n-input-number
  style="width: 1.5rem"
  v-model:value="state.shadowRadio.longitude"
  :show-button="false"
  disabled
>
</n-input-number>
</div>
<div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
<span>纬度</span>
<n-input-number
  style="width: 1.5rem"
  v-model:value="state.shadowRadio.latitude"
  :show-button="false"
  disabled
>
</n-input-number>
</div>
<div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
<span>高程</span>
<n-input-number
  style="width: 1.5rem"
  v-model:value="state.shadowRadio.height"
  :show-button="false"
  disabled
>
</n-input-number>
</div>
</div>


<div class="btn-row-item">
<n-button
type="info"
color="#3499E5"
text-color="#fff"
@click="analysis"
style="margin-right: 0.1rem"
>分析</n-button
>
<n-button class="btn-secondary" @click="clear">清除</n-button>
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, watch } from "vue";
import initHandler from "@/tools/drawHandler";
import ShadowQuery from "./js/shadow-query";
import tool from "@/tools/tool";

type stateType = {
timeArray:number[], //开始结束时间
currentDate:any,  //当前日期
marks:any,//时间刻度标记
timeInterval: number, //时间间隔
spacing: number, //间距（米）
bottomHeight: number, //底部高程（米）
extrudeHeight: number, //拉伸高度（米）
shadowShow: boolean, //阴影显示
shadowBodyShow: boolean, //阴影率体显示
showStartTimeBtn: boolean,
showStartDateBtn: boolean,
filterInterval: number[],
shadowRadio: any,
shadowRadioShow:boolean,
initBubble: boolean,
}

// 设置默认值数据
let state = reactive<stateType>({
timeArray: [20, 64],
currentDate: new Date(),
marks: {
0: "0:00",
8: "",
16: "",
24: "6:00",
32: "",
40: "",
48: "12:00",
56: "",
64: "",
72: "18:00",
80: "",
88: "",
96: "24:00",
},
timeInterval: 60, 
spacing: 10, 
bottomHeight: 1, 
extrudeHeight: 30, 
shadowShow: false, 
shadowBodyShow: false,
showStartTimeBtn: true,
showStartDateBtn: true,
filterInterval: [0, 100],
shadowRadio: {},
shadowRadioShow:false,
initBubble: false,
});

let currentTime = ref<any>(Date.now()); // 直接获取时间戳
const scene = viewer.scene;
// 初始化数据
let timeArray = [...state.timeArray],
timerTime,
timerDate;
let shadow, handlerPolygon;
let bableShadowDom = ref();
// let bubble;


function init() {
if (!viewer) return;
state.initBubble = true;
shadow = new ShadowQuery(viewer, {
modelUrl: "./Resource/model/box.s3m",
});
shadow.updateOptionsParams(state);
// bableShadowDom = document.getElementsByClassName("bableShadow")[0]
}

init();

// 时间轴改变
function timeChanging(arr:number[]) {
let tm;
if (timeArray[0] === arr[0]) {
tm = getCurrentTime(arr[1]);
} else {
tm = getCurrentTime(arr[0]);
}
viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(tm);
timeArray = arr;
}

// 根据一个数字（0-96）转化为当前时间
function getCurrentTime(num: number) {
// let h = parseInt(num / 4);
let h = Math.floor(num / 4);
// let m = parseInt((num % 4) * 15);
let m = Math.floor((num % 4) * 15);
state.currentDate.setHours(h);
state.currentDate.setMinutes(m);
return state.currentDate;
}

// 时间轴格式化
function formatTime(val) {
// if (val === state.timeArray[0]) {
//   return (
//     `${langGlobal.startTime}:` +
//     timeSlice(getCurrentTime(val).toLocaleTimeString())
//   );
// } else
//   return (
//     `${langGlobal.endTime}:` +
//     timeSlice(getCurrentTime(val).toLocaleTimeString())
//   );
// function timeSlice(str) {
//   let str2 = str.split(":");
//   return str2[0] + ":" + str2[1];
// }
}

// 播放或暂停时间段内阳光和阴影动画
function sunLightForTime(isStart:boolean) {
clearTimer();
if (!isStart) return;
if (!state.shadowShow) state.shadowShow = true;
state.showStartTimeBtn = false;
let time = [...timeArray];
let stm = time[0];
let etm = time[1];
let ntm = stm;
timerTime = setInterval(() => {
if (ntm < etm) {
ntm += 0.5;
state.timeArray = [stm, ntm];
} else {
state.showStartTimeBtn = true;
clearInterval(timerTime);
}
}, 50);
}

// 播放一年的阳光和阴影动画
function sunLightForDate(isStart:boolean) {
clearTimer();
if (!isStart) return;
if (!state.shadowShow) state.shadowShow = true;
state.showStartDateBtn = false;
let d = getCurrentTime(timeArray[1]);
let mon = d.getMonth();
timerDate = setInterval(() => {
if (mon < 11) mon += 1;
else mon = 0;
d.setMonth(mon);
state.currentDate = new Date(d);
}, 1000);
}

// 清除动画
function clearTimer() {
clearInterval(timerTime);
clearInterval(timerDate);
state.showStartTimeBtn = true;
state.showStartDateBtn = true;
}

// 分析
function analysis() {
if (!state.shadowShow) state.shadowShow = true;
if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
handlerPolygon.handlerDrawing().then(
(res) => {
let startTime = SuperMap3D.JulianDate.fromDate(
  getCurrentTime(timeArray[0])
);
let endTime = SuperMap3D.JulianDate.fromDate(
  getCurrentTime(timeArray[1])
);
shadow.setshadowQuery(res.object.positions, startTime, endTime);

viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
},
(err) => {
console.log(err);
}
);
handlerPolygon.activate();
}

// 鼠标左键事件 点击获取阴影率
function LEFT_CLICK(e) {
// bubble.addEvent(); //设置气泡监听事件
if (state.shadowBodyShow) {
let box = viewer.scene.pick(e.message.position);
if (box && box.id) {
let index = box.id.split("-")[1];
let point = shadow.shadowPoints[index];
if (!point) {
  state.shadowRadioShow = false;
  return;
}
let radio = point.shadowRatio * 100;
if (radio < state.filterInterval[0] || radio > state.filterInterval[1]){
  state.shadowRadioShow = false;
}
state.shadowRadioShow = true;
let position = tool.CartesiantoDegrees(point.position);
state.shadowRadio = {
  radio: (point.shadowRatio * 100).toFixed(0) + "%",
  longitude: position[0].toFixed(8),
  latitude: position[1].toFixed(8),
  height: position[2].toFixed(8)
};
// bubble.setPosition(point.position); //设置气泡位置
bableShadowDom.value.style.top = (e.message.position.y - 220) + 'px';
bableShadowDom.value.style.left = (e.message.position.x) + 'px';
return;
}
} else {
let position1 = viewer.scene.pickPosition(e.message.position);
let cartographic = SuperMap3D.Cartographic.fromCartesian(position1);
let shadowRadio = shadow.shadowQuery.getShadowRadio(cartographic);
if (shadowRadio !== -1) {
let longitude = SuperMap3D.Math.toDegrees(cartographic.longitude);
let latitude = SuperMap3D.Math.toDegrees(cartographic.latitude);
state.shadowRadio = {
  radio: (shadowRadio * 100).toFixed(0) + "%",
  longitude: longitude.toFixed(8),
  latitude: latitude.toFixed(8),
  height: cartographic.height.toFixed(8)
};
// bubble.setPosition(position1);
return;
}
}
// bubble.close();
}

// 清除
function clear() {
state.shadowRadio = {radio: 0,longitude: 0,latitude: 0,height: 0};
viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
if (handlerPolygon) handlerPolygon.clearHandler();
shadow.clear();
// if (bubble) bubble.clear();
}

// 监听
watch(
() => state.timeArray,
(val) => {
timeChanging(val);
}
);
watch(
() => state.currentDate,
(val) => {
timeChanging(timeArray);
}
);
watch(
() => state.timeInterval,
(val) => {
shadow.timeInterval = val;
}
);
watch(
() => state.spacing,
(val) => {
shadow.spacing = val;
}
);
watch(
() => state.bottomHeight,
(val) => {
shadow.bottomHeight = val;
}
);
watch(
() => state.extrudeHeight,
(val) => {
shadow.extrudeHeight = val;
}
);
watch(
() => state.shadowShow,
(val) => {
shadow.setShadow(val);
}
);
watch(
() => state.shadowBodyShow,
(val) => {
shadow.setBodyShow(val);
}
);
watch(
() => state.filterInterval,
(val) => {
shadow.setFilterBodyShow(val);
}
);

// 销毁
onBeforeUnmount(() => {
clear();
shadow.destroy();
});
</script>

<style lang="scss" scoped>
.shadow-time {
margin-bottom: 0.14rem;
border: 1px solid rgba(255, 255, 255, 0.15);
}
.itemBox-shadow {
display: flex;
justify-content: space-between;
// align-items: center;
margin: 0.06rem;
padding: 0px 10px;
.lable {
  width: 2rem;
  font-size: 0.14rem;
}

.content {
  width: 1.4rem;
}
.shadow-date-picker {
  width: 2.8rem;
}

.btnImg {
  width: 0.22rem;
  height: 0.22rem;
  margin-left: 0.1rem;
  margin-top: 0.04rem;
  color: #FFFFFF;

}

}
.n-slider .n-slider-dots .n-slider-dot {
top: 0.06rem;
width: 0.02rem;
height: 0.05rem;
border-radius: 0;
}

.bableShadow{
position: fixed;
top: 2rem;
left: 5rem;
background-color: #3B5168;
opacity: 0.8;
z-index: 200000;
height: 2.2rem;
width: 2.28rem;
.shadow-anaylse-pop-titie{
margin-left: 0.12rem;
font-size: 12px;
line-height: 20px;

}
span {
font-size: 12px;
}
}
</style>





