<!-- 阴影分析 -->
<template>
  <n-scrollbar style="max-height: 3.8rem; padding-right: 0.1rem;" trigger="none">
    <div class="shadow-time">
      <!-- 24小时光照 -->
      <div class="itemBox-shadow">
        <n-slider
          v-model:value="state.timeArray"
          @update:value="timeChanged"
          :max="96"
          :step="0.5"
          range
          :marks="state.marks"
          :format-tooltip="formatTime"
        />
        <i
          class="iconfont iconSize iconbofang btnImg"
          :title="$t('ShadowStartTip')"
          v-show="state.showStartTimeBtn"
          @click="sunLightForTime(true)"
        ></i>
        <i
          class="iconfont iconSize iconzanting btnImg"
          :title="$t('ShadowStartTip')"
          v-show="!state.showStartTimeBtn"
          @click="sunLightForTime(false)"
        ></i>
      </div>
      <!-- 日历控件 -->
      <div class="itemBox-shadow" style="margin-bottom: 0.12rem">
        <n-date-picker
          class="shadow-date-picker"
          v-model:value="state.currentTime"
          type="date"
        >
          <template #date-icon>
            <i class="iconfont icondown iconfanhui" style="margin-top: 0px"></i>
          </template>
        </n-date-picker>
        <i
          class="iconfont iconSize iconbofang btnImg"
          :title="$t('ShadowStartTip2')"
          v-show="state.showStartDateBtn"
          @click="sunLightForDate(true)"
        ></i>
        <i
          class="iconfont iconSize iconzanting btnImg"
          :title="$t('ShadowStartTip2')"
          v-show="!state.showStartDateBtn"
          @click="sunLightForDate(false)"
        ></i>
      </div>
    </div>

    <n-divider />

    <!-- 底部高程 -->
    <div class="row-wrap">
      <div class="label">{{ $t("bottomHeight") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.bottomHeight"
          :update-value-on-input="false"
          :show-button="false"
        >
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>

    <!-- 拉伸高度 -->
    <div class="row-wrap">
      <div class="label">{{ $t("stretchingHeight") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.extrudeHeight"
          :update-value-on-input="false"
          :show-button="false"
        >
          <template #suffix>{{ $t("meter") }}</template></n-input-number
        >
      </div>
    </div>

    <!-- 间距 -->
    <div class="row-wrap">
      <div class="label">{{ $t("space") }}</div>
      <div class="content">
        <n-input-number
          v-model:value="state.spacing"
          :update-value-on-input="false"
          :show-button="false"
        >
          <template #suffix>{{ $t("meter") }}</template>
        </n-input-number>
      </div>
    </div>


    <!-- TODO:解决阴影分析-体显示场景崩溃，invalid array length -->
    <!-- <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.shadowBodyShow" :label="$t('bodyDisplay')" />
      </div>
    </div> -->

    <!-- 开启阴影 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox v-model:checked="state.shadowShow" :label="$t('showShadow')" />
      </div>
    </div>
  </n-scrollbar>

  <div class="row-btns">
    <n-button @click="analysis" class="operate" type="info" :focusable="false">{{
    $t("analysis") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import ShadowQuery from "./js/shadow-query";
import DrawHandler from "@/lib/DrawHandler";
import CustomBubble from "@/lib/CustomBubble";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });
const customBubble = new CustomBubble(viewer);
customBubble.start();

type stateType = {
  timeArray: number[]; //开始结束时间
  currentDate: any; //当前日期
  marks: any; //时间刻度标记
  timeInterval: number; //时间间隔
  spacing: number; //间距（米）
  bottomHeight: number; //底部高程（米）
  extrudeHeight: number; //拉伸高度（米）
  shadowShow: boolean; //阴影显示
  shadowBodyShow: boolean; //阴影率体显示
  showStartTimeBtn: boolean;
  showStartDateBtn: boolean;
  filterInterval: number[];
  shadowRadio: any;
  initBubble: boolean;
  shadowQueryRegion: any;
  currentTime: any;
};

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
  shadowQueryRegion: [],
  currentTime: undefined,
});

state.currentTime = state.currentDate.getTime();

// 初始化变量
let timeArray = [...state.timeArray];
let timerTime, timerDate;
let shadow = new ShadowQuery(viewer, {
  modelUrl: "./Resource/model/box.s3m",
});

function init() {
  if (!viewer) return;
  state.initBubble = true;
  shadow.updateOptionsParams(state);
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
  shadow.destroy();
  customBubble.destroy();
});



// 时间轴改变
function timeChanging(arr: number[]) {
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
  let h = Math.floor(num / 4);
  let m = Math.floor((num % 4) * 15);
  state.currentDate.setHours(h);
  state.currentDate.setMinutes(m);
  return state.currentDate;
}

// 时间轴格式化
function formatTime(val: any) {
  if (val === state.timeArray[0]) {
    return (
      `${$t("startTime")}:` +
      timeSlice(getCurrentTime(val).toLocaleTimeString())
    );
  } else
    return (
      `${$t("endTime")}:` + timeSlice(getCurrentTime(val).toLocaleTimeString())
    );
  function timeSlice(str: string) {
    let str2 = str.split(":");
    return str2[0] + ":" + str2[1];
  }
}

// 播放或暂停时间段内阳光和阴影动画
function sunLightForTime(isStart: boolean) {
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
function sunLightForDate(isStart: boolean) {
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
    state.currentTime = state.currentDate.getTime();
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
async function analysis() {
  if (!state.shadowShow) state.shadowShow = true;
  const positions = await drawHandler.startPolygon();
  state.shadowQueryRegion = positions;
  shadowQueryStart(positions, timeArray[0], timeArray[1]);
}

// 开始阴影分析
function shadowQueryStart(regionPositionList, startTime, endTime) {
  let sTime = SuperMap3D.JulianDate.fromDate(getCurrentTime(startTime));
  let eTime = SuperMap3D.JulianDate.fromDate(getCurrentTime(endTime));
  shadow.setshadowQuery(regionPositionList, sTime, eTime);
  viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);
}


// 鼠标左键事件 点击获取阴影率
function LEFT_CLICK(e) {
  if (state.shadowBodyShow) {
    let box = viewer.scene.pick(e.message.position);
    if (box && box.id) {
      let index = box.id.split("-")[1];
      let point = shadow.shadowPoints[index];
      if (!point) {
        customBubble.hidden();
        return;
      }
      let radio = point.shadowRatio * 100;
      if (radio < state.filterInterval[0] || radio > state.filterInterval[1]) {
        customBubble.hidden();
      }

      let position = window.iEarthTool.Cartesian3ToDegreeArray(point.position);
      const rowsContent = [
        ["阴影率"],
        ["经度"],
        ["纬度"],
        ["高程"],
      ];
      rowsContent[0].push((point.shadowRatio * 100).toFixed(0) + "%");
      rowsContent[1].push(position[0].toFixed(4))
      rowsContent[2].push(position[1].toFixed(4))
      rowsContent[3].push(position[2].toFixed(4))
      customBubble.open({
        title: `分析结果`,
        content: [
          {
            type: 'table', data: {
              headers: ['字段', '值'],
              rows: rowsContent
            }
          }
        ]
      });

      return;
    } else {
      customBubble.hidden();
    }
  } else {
    customBubble.hidden();
  }
}

//时间轴改变后设置shadowQuery（不是实时监听）
function timeChanged(val) {
  if (state.shadowShow && state.shadowQueryRegion.length > 0) {
    shadow.clear();
    shadowQueryStart(state.shadowQueryRegion, val[0], val[1]);
  }
}

// 清除
function clear() {
  viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
  drawHandler.destroy();
  shadow.clear();
  customBubble.hidden();
  state.shadowQueryRegion.length = 0;
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
  () => {
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
    shadow.updateOptionsParams({ spacing: val });
    if (state.shadowQueryRegion.length >= 3) {
      shadowQueryStart(state.shadowQueryRegion, timeArray[0], timeArray[1]);
    }
  }
);
watch(
  () => state.bottomHeight,
  (val) => {
    shadow.bottomHeight = val;
    shadow.updateOptionsParams({ bottomHeight: val });
    if (state.shadowQueryRegion.length >= 3) {
      shadowQueryStart(state.shadowQueryRegion, timeArray[0], timeArray[1]);
    }
  }
);
watch(
  () => state.extrudeHeight,
  (val) => {
    shadow.extrudeHeight = val;
    shadow.updateOptionsParams({ extrudeHeight: val });
    if (state.shadowQueryRegion.length >= 3) {
      shadowQueryStart(state.shadowQueryRegion, timeArray[0], timeArray[1]);
    }
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
</script>

<style lang="scss" scoped>
.shadow-time {
  margin-bottom: 0.14rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);

  .itemBox-shadow {
    display: flex;
    justify-content: space-between;
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
      text-align: center;

      :hover {
        cursor: pointer;
      }
    }

    .btnImg {
      width: 0.22rem;
      height: 0.22rem;
      margin: 0rem 0rem 0rem 0.2rem;
      color: #ffffff;
    }
  }

  .icondown {
    display: block;
    margin: 2px;
    font-size: 0.12rem;
    transform: rotate(-90deg);
  }
}
</style>
