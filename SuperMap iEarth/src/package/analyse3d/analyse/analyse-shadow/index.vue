<template>
  <div class="shadow-time">
    <div class="itemBox-shadow">
      <n-slider v-model:value="state.timeArray" @update:value="timeChanged" :max="96" :step="0.5" range
        :marks="state.marks" :format-tooltip="formatTime" />
      <i class="iconfont iconSize iconbofang btnImg" :title="$t('global.ShadowStartTip')" v-show="state.showStartTimeBtn"
        @click="sunLightForTime(true)"></i>
      <i class="iconfont iconSize iconzanting btnImg" :title="$t('global.ShadowStartTip')"
        v-show="!state.showStartTimeBtn" @click="sunLightForTime(false)"></i>
    </div>
    <div class="itemBox-shadow" style="margin-bottom: 0.12rem">
      <n-date-picker class="shadow-date-picker" v-model:value="currentTime" type="date" >
        <template #date-icon>
          <i class="iconfont icondown iconfanhui" style="margin-top:0px"></i>
        </template>
      </n-date-picker>
      <i class="iconfont iconSize iconbofang btnImg" :title="$t('global.ShadowStartTip2')" v-show="state.showStartDateBtn"
        @click="sunLightForDate(true)"></i>
      <i class="iconfont iconSize iconzanting btnImg" :title="$t('global.ShadowStartTip2')"
        v-show="!state.showStartDateBtn" @click="sunLightForDate(false)"></i>
    </div>
  </div>
  <n-divider />
  <div class="row-item">
    <span>{{ $t('global.bottomHeight') }}</span>
    <n-input-number style="width: 1.96rem;" v-model:value="state.bottomHeight" :update-value-on-input="false" :show-button="false">
      <template #suffix>{{ $t('global.meter') }}</template>
    </n-input-number>
  </div>
  <div class="row-item">
    <span>{{ $t('global.stretchingHeight') }}</span>
    <n-input-number style="width: 1.96rem;" v-model:value="state.extrudeHeight" :update-value-on-input="false" :show-button="false">
      <template #suffix>{{ $t('global.meter') }}</template></n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t('global.space') }}</span>
    <n-input-number style="width: 1.96rem;" v-model:value="state.spacing" :update-value-on-input="false" :show-button="false">
      <template #suffix>{{ $t('global.meter') }}</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>{{ $t('global.bodyDisplay') }}</span>
    <div class="check-box">
      <n-checkbox v-model:checked="state.shadowBodyShow"></n-checkbox>
    </div>
  </div>

  <!-- 开启阴影 -->
  <div class="row-item">
    <span>{{ $t('global.showShadow') }}</span>
    <div class="check-box">
      <n-checkbox v-model:checked="state.shadowShow"></n-checkbox>
    </div>
  </div>

  <div class="bableShadow" ref="bableShadowDom" v-show="state.shadowRadioShow">
    <div class="row-item" style="margin-top:0.12rem">
      <span class="shadow-anaylse-pop-titie">{{ $t('global.analyseResult') }}</span>
      <span @click="state.shadowRadioShow = false;" style="margin-right:14px">X</span>
    </div>
    <div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
      <span>{{ $t('global.DaylightingRate') }}</span>
      <n-input style="width: 1.5rem;" v-model:value="state.shadowRadio.radio" :show-button="false" disabled>
      </n-input>
    </div>
    <div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
      <span>{{ $t('global.longitude') }}</span>
      <n-input-number style="width: 1.5rem" v-model:value="state.shadowRadio.longitude" :show-button="false" disabled>
      </n-input-number>
    </div>
    <div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
      <span>{{ $t('global.latitude') }}</span>
      <n-input-number style="width: 1.5rem" v-model:value="state.shadowRadio.latitude" :show-button="false" disabled>
      </n-input-number>
    </div>
    <div class="row-item" style="margin-left: 0.12rem;margin-right: 0.12rem">
      <span>{{ $t('global.elevation') }}</span>
      <n-input-number style="width: 1.5rem" v-model:value="state.shadowRadio.height" :show-button="false" disabled>
      </n-input-number>
    </div>
  </div>


  <div class="btn-row-item">
    <n-button type="info" color="#3499E5" text-color="#fff" @click="analysis"
      class="ans-btn">{{ $t('global.analysis') }}</n-button>
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)"
      ghost>{{ $t('global.clear') }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeUnmount, watch, computed} from "vue";
import initHandler from "@/tools/drawHandler";
import ShadowQuery from "./js/shadow-query";
import tool from "@/tools/tool";

type stateType = {
  timeArray: number[], //开始结束时间
  currentDate: any,  //当前日期
  marks: any,//时间刻度标记
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
  shadowRadioShow: boolean,
  initBubble: boolean,
  shadowQueryRegion: any
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
  shadowRadioShow: false,
  initBubble: false,
  shadowQueryRegion: []
});

// let currentTime = ref<any>(Date.now()); // 直接获取时间戳
let currentTime = computed(() => state.currentDate.getTime());

// 初始化数据
let timeArray = [...state.timeArray],
  timerTime,
  currentSelectedEntity,
  timerDate;
let shadow, handlerPolygon;
let bableShadowDom = ref();


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
  // let h = parseInt(num / 4);
  let h = Math.floor(num / 4);
  // let m = parseInt((num % 4) * 15);
  let m = Math.floor((num % 4) * 15);
  state.currentDate.setHours(h);
  state.currentDate.setMinutes(m);
  return state.currentDate;
}

// 时间轴格式化
function formatTime(val: any) {
  if (val === state.timeArray[0]) {
    return (
      `${GlobalLang.startTime}:` +
      timeSlice(getCurrentTime(val).toLocaleTimeString())
    );
  } else
    return (
      `${GlobalLang.endTime}:` +
      timeSlice(getCurrentTime(val).toLocaleTimeString())
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
      state.shadowQueryRegion = res.object.positions;
      shadowQueryStart(state.shadowQueryRegion, timeArray[0], timeArray[1]);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

function shadowQueryStart(regionPositionList, startTime, endTime) {
  let sTime = SuperMap3D.JulianDate.fromDate(
    getCurrentTime(startTime)
  );
  let eTime = SuperMap3D.JulianDate.fromDate(
    getCurrentTime(endTime)
  );
  shadow.setshadowQuery(regionPositionList, sTime, eTime);
  handlerPolygon.polylineTransparent.show = false;
  viewer.eventManager.addEventListener("CLICK", LEFT_CLICK, true);

}

// 更新弹窗位置
function updatePopup(){
  if(currentSelectedEntity) {
    let position = currentSelectedEntity.primitive._position;
    updatePopupPosition(position);
  }
}

function updatePopupPosition(position){
  var WindowCoordinates = SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position)
  bableShadowDom.value.style.top = (WindowCoordinates.y - bableShadowDom.value.offsetHeight - 10) + 'px';
  bableShadowDom.value.style.left = (WindowCoordinates.x - bableShadowDom.value.offsetWidth / 2) + 140 + 'px';
}

// 鼠标左键事件 点击获取阴影率
function LEFT_CLICK(e) {
  // bubble.addEvent(); //设置气泡监听事件
  if (state.shadowBodyShow) {
    let box = viewer.scene.pick(e.message.position);
    if (box && box.id) {
      currentSelectedEntity = box;
      let index = box.id.split("-")[1];
      let point = shadow.shadowPoints[index];
      if (!point) {
        state.shadowRadioShow = false;
        return;
      }
      let radio = point.shadowRatio * 100;
      if (radio < state.filterInterval[0] || radio > state.filterInterval[1]) {
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
      bableShadowDom.value.style.top = (e.message.position.y - 220) + 'px';
      bableShadowDom.value.style.left = (e.message.position.x) + 'px';
      viewer.clock.onTick.addEventListener(updatePopup)
      // viewer.scene.preRender.addEventListener(updatePopup);
      return;
    }else{
      viewer.clock.onTick.removeEventListener(updatePopup);
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
      return;
    }
  }
}

//时间轴改变后设置shadowQuery（不是实时监听）
function timeChanged(val) {
  if (state.shadowShow && state.shadowQueryRegion.length > 0) {
    shadow.clear();
    shadowQueryStart(state.shadowQueryRegion, val[0], val[1]);
  }
};


// 清除
function clear() {
  viewer.clock.onTick.removeEventListener(updatePopup);
  state.shadowRadio = { radio: 0, longitude: 0, latitude: 0, height: 0 };
  viewer.eventManager.removeEventListener("CLICK", LEFT_CLICK); //移除鼠标点击事件监听
  if (handlerPolygon) handlerPolygon.clearHandler();
  shadow.clear();
  state.shadowQueryRegion.length = 0;
  state.shadowRadioShow = false;
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
    shadow.updateOptionsParams({spacing:val});
    if(state.shadowQueryRegion.length >= 3){
      shadowQueryStart(state.shadowQueryRegion, timeArray[0], timeArray[1]);
    }
  }
);
watch(
  () => state.bottomHeight,
  (val) => {
    console.log("bottomHeight-val:",val);
    shadow.bottomHeight = val;
    shadow.updateOptionsParams({bottomHeight:val});
    if(state.shadowQueryRegion.length >= 3){
      shadowQueryStart(state.shadowQueryRegion, timeArray[0], timeArray[1]);
    }
  }
);
watch(
  () => state.extrudeHeight,
  (val) => {
    shadow.extrudeHeight = val;
    shadow.updateOptionsParams({extrudeHeight:val});
    if(state.shadowQueryRegion.length >= 3){
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

// 销毁
onBeforeUnmount(() => {
  viewer.clock.onTick.removeEventListener(updatePopup);
  clear();
  shadow.destroy();
});
</script>

<style lang="scss" scoped>
.shadow-time {
  margin-bottom: 0.14rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
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
    text-align: center;
    :hover {
      cursor: pointer;
    }
  }

  .btnImg {
    width: 0.22rem;
    height: 0.22rem;
    margin: 0rem 0rem 0rem 0.20rem;
    color: #FFFFFF;

  }

}

.n-slider .n-slider-dots .n-slider-dot {
  top: 0.06rem;
  width: 0.02rem;
  height: 0.05rem;
  border-radius: 0;
}

.bableShadow {
  cursor: default;
  position: fixed;
  top: 2rem;
  left: 5rem;
  background-color: #383838;
  opacity: 0.8;
  z-index: 200000;
  height: 2.2rem;
  width: 2.28rem;

  .shadow-anaylse-pop-titie {
    margin-left: 0.12rem;
    font-size: 12px;
    line-height: 20px;

  }

  span {
    font-size: 12px;
  }
}

.icondown{
    display: block;
    margin: 2px;
    font-size: .12rem;
    transform: rotate(-90deg);
}
</style>





