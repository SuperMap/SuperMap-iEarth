<template>
  <div class="row-item">
    <span>底部高程</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.bottomHeight"
      :show-button="false"
    >
      <template #suffix>M</template>
    </n-input-number>
  </div>
  <div class="row-item">
    <span>拉伸高度</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.extrudeHeight"
      :show-button="false"
    >
      <template #suffix>M</template></n-input-number
    >
  </div>

  <div class="row-item">
    <span>间距</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.spacing"
      :show-button="false"
    >
      <template #suffix>M</template>
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
  initBubble: false,
});

let currentTime = ref<any>(Date.now()); // 直接获取时间戳

// 初始化数据
let timeArray = [...state.timeArray],
  timerTime,
  timerDate;
let shadow, handlerPolygon;
let bubble;


function init() {
  if (!viewer) return;
  state.initBubble = true;
  shadow = new ShadowQuery(viewer, {
    modelUrl: "./Resource/model/box.s3m",
  });
  shadow.updateOptionsParams(state);
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
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  shadow.clear();
  if (bubble) bubble.clear();
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
</style>

  
  
  
  
  