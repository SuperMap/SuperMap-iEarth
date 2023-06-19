<template>
  <div class="shadow-container">
    <div class="shadow-time-container">
      <div class="itemBox-shadow">
        <n-slider
          v-model:value="state.timeArray"
          :max="96"
          :step="0.5"
          range
          :marks="state.marks"
          :format-tooltip="formatTime"
        />
        <!-- <img
          class="start-time-img"
          src="@/assets/imgs/start.png"
          :title="$t('global.ShadowStartTip')"
          v-show="state.showStartTimeBtn"
          @click="sunLightForTime(true)"
        />
        <img
          class="start-time-img"
          src="@/assets/imgs/start.png"
          :title="$t('global.ShadowStopTip')"
          v-show="!state.showStartTimeBtn"
          @click="sunLightForTime(false)"
        /> -->
      </div>
      <!-- <div class="itemBox-shadow">
        <n-date-picker
          class="shadow-date-picker"
          v-model:value="currentTime"
          type="date"
        />
        <img
          class="btnImg"
          src="@/assets/imgs/start.png"
          :title="$t('global.ShadowStartTip2')"
          v-show="state.showStartDateBtn"
          @click="sunLightForDate(true)"
        />
        <img
          class="btnImg"
          src="@/assets/imgs/stop.png"
          :title="$t('global.ShadowStopTip')"
          v-show="!state.showStartDateBtn"
          @click="sunLightForDate(false)"
        />
      </div> -->
    </div>

    <!-- 时间间隔 -->
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.timeInterval") }}</template>
      <template #item-content>
        <n-input-number v-model:value="state.timeInterval"></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 间距 -->
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.space") }}</template>
      <template #item-content>
        <n-input-number v-model:value="state.spacing"></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 底部高程 -->
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.bottomHeight") }}</template>
      <template #item-content>
        <n-input-number v-model:value="state.bottomHeight"></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 拉伸高度 -->
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.stretchingHeight") }}</template>
      <template #item-content>
        <n-input-number v-model:value="state.extrudeHeight"></n-input-number>
      </template>
    </sm-rowLayOut>
    <!-- 体显示 -->
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.bodyDisplay") }}</template>
      <template #item-content>
        <n-checkbox
          v-model:checked="state.shadowBodyShow"
        ></n-checkbox>
      </template>
    </sm-rowLayOut>
    <!-- 开启阴影 -->
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.showShadow") }}</template>
      <template #item-content>
        <n-checkbox v-model:checked="state.shadowShow"></n-checkbox>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.filterInterval") }}</template>
      <template #item-content>
        <n-slider
          v-model:value="state.filterInterval"
          :step="1"
          :min="0"
          :max="100"
          range
          :format-tooltip="(value) => `${langGlobal.DaylightingRate}:${value}%`"
        />
      </template>
    </sm-rowLayOut>
  </div>

  <sm-btnGroup>
    <template #btn-left>
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="analysis"
        >{{ $t("global.analysis") }}</n-button
      >
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clear">{{
        $t("global.clear")
      }}</n-button>
    </template>
  </sm-btnGroup>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, watch } from "vue";
import initHandler from "@/tools/drawHandler";
import ShadowQuery from "./shadow-query";

const langGlobal = window.LangGlobal.global;

// 设置默认值数据
let state = reactive({
  timeArray: [20, 64], //开始结束时间
  currentDate: new Date(), //当前日期
  marks: {
    //时间刻度标记
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
  timeInterval: 60, //时间间隔
  spacing: 10, //间距（米）
  bottomHeight: 1, //底部高程（米）
  extrudeHeight: 30, //拉伸高度（米）
  shadowShow: false, //阴影显示
  shadowBodyShow: false, //阴影率体显示
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

init();

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
function timeChanging(arr) {
  let tm;
  if (timeArray[0] === arr[0]) {
    tm = getCurrentTime(arr[1]);
  } else {
    tm = getCurrentTime(arr[0]);
  }
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(tm);
  timeArray = arr;
}

//根据一个数字（0-96）转化为当前时间
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
  if (val === state.timeArray[0]) {
    return (
      `${langGlobal.startTime}:` +
      timeSlice(getCurrentTime(val).toLocaleTimeString())
    );
  } else
    return (
      `${langGlobal.endTime}:` +
      timeSlice(getCurrentTime(val).toLocaleTimeString())
    );
  function timeSlice(str) {
    let str2 = str.split(":");
    return str2[0] + ":" + str2[1];
  }
}

// 播放或暂停时间段内阳光和阴影动画
function sunLightForTime(isStart) {
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

//播放一年的阳光和阴影动画
function sunLightForDate(isStart) {
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

//分析
function analysis() {
  if (!state.shadowShow) state.shadowShow = true;
  if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let startTime = Cesium.JulianDate.fromDate(getCurrentTime(timeArray[0]));
      let endTime = Cesium.JulianDate.fromDate(getCurrentTime(timeArray[1]));
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

//   监听
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
.itemBox-shadow {
  @include rowItemBoxStyle($--SM--margin-6, 2rem, 1.4rem);

  .shadow-date-picker {
    width: 2.8rem;
  }

  .btnImg {
    widows: 0.4rem;
    height: 0.4rem;
    margin-right: 0.1rem;
  }
}
.n-slider .n-slider-dots .n-slider-dot {
  top: 0.06rem;
  width: 0.02rem;
  height: 0.05rem;
  border-radius: 0;
}

.shadow-container {
  @include panelContainer(100%, 3.5rem);
}
.shadow-time-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0.04rem;
}
.start-time-img {
  width: 0.25rem;
  height: 0.25rem;
}

</style>

  
  
  
  
  