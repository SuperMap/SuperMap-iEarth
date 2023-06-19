<template>
  <div class="profile-container">
    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.startLongitude") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.startDegreesArray[0]"
          :show-button="false"
        >
          <template #suffix>°</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.startLatitude") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.startDegreesArray[1]"
          :show-button="false"
        >
          <template #suffix>°</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.startElevation") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.startDegreesArray[2]"
          :show-button="false"
        >
          <template #suffix>M</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <n-divider />

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.endLongitude") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.endDegreesArray[0]"
          :show-button="false"
        >
          <template #suffix>°</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.endLatitude") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.endDegreesArray[1]"
          :show-button="false"
        >
          <template #suffix>°</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ $t("global.endElevation") }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.endDegreesArray[2]"
          :show-button="false"
        >
          <template #suffix>M</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- 有问题 先注释 -->
    <!-- <sm-rowLayOut contentMarginLeft="0.2rem">
      <template #item-lable>{{ $t("global.disPlayInfo") }}</template>
      <template #item-content>
        <n-switch
          @update:value="state.profileInfoShow = !state.profileInfoShow"
        />
      </template>
    </sm-rowLayOut> -->

    <sm-rowLayOut v-show="state.profileInfoShow">
      <template #item-content>
        <n-radio-group
          v-model:value="state.getProfile2d"
          name="radiogroup"
          class="radio-group"
        >
          <n-space>
            <n-radio
              v-for="item in state.modeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
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

  <div id="echartsProfile"></div>
  <canvas
    v-show="state.gpuDomShow"
    style="
      position: fixed;
      width: 6.75rem;
      height: 2.23rem;
      left: 3.5rem;
      bottom: 0.3rem;
      background-color: rgba(0, 8, 23, 0.7);
    "
    id="pro"
    height="0"
    width="0"
  ></canvas>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch, onMounted } from "vue";
import echarts from "@/tools/echarts";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";
import profileAnalysis from "./profile";

const scene = viewer.scene;
const langGlobal = window.LangGlobal.global;

// 设置默认值数据
let state = reactive({
  startDegreesArray: [0, 0, 0],
  endDegreesArray: [0, 0, 0],
  profileInfoShow: false, // 剖面信息展示
  getProfile2d: false, //是否显示二维分析结果
  modeOptions: [
    {
      label: langGlobal.section,
      value: true,
    },
    {
      label: langGlobal.GPUProfile,
      value: false,
    },
  ],
  gpuDomShow: false,
  gpuProfileState: false,
});

// 初始化数据
let profile, handlerPolyline;
let profile_GPU = new Cesium.Profile(scene);

function init() {
  if (!viewer) return;
  profile = new profileAnalysis(viewer, {
    echarts: echarts,
    entityUrl: "./images/location.png",
  });
}

init();

// 为剖面分析设置数据
function setDataForGpuProFile(result: any) {
  let line = result.object;
  if (line.positions.length < 2) {
    return;
  }
  let startPoint = line.positions[0];
  let endPoint = line.positions[1];

  let scartographic = Cesium.Cartographic.fromCartesian(startPoint);
  let slongitude = Cesium.Math.toDegrees(scartographic.longitude);
  let slatitude = Cesium.Math.toDegrees(scartographic.latitude);
  let sheight = scartographic.height;

  let ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
  let elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
  let elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
  let eheight = ecartographic.height;

  //设置剖面分析的开始和结束位置
  profile_GPU.startPoint = [slongitude, slatitude, sheight];
  profile_GPU.endPoint = [elongitude, elatitude, eheight];

  profile_GPU.extendHeight = 40;
  state.gpuProfileState = true;
}

//分析
function analysis() {
  let interValID = setInterval(() => {
    if (!handlerPolyline.polyline) return;
    if (!handlerPolyline.polyline.positions) return;

    let positions = handlerPolyline.polyline.positions;
    if (positions.length === 1) {
      state.startDegreesArray = tool.CartesiantoDegrees(positions[0]);
    } else if (positions.length >= 2) {
      state.startDegreesArray = tool.CartesiantoDegrees(positions[0]);
      state.endDegreesArray = tool.CartesiantoDegrees(
        positions[positions.length - 1]
      );
    }
  }, 500);

  if (!handlerPolyline) handlerPolyline = initHandler("Polyline");
  handlerPolyline.handlerDrawing().then(
    (res) => {
      setDataForGpuProFile(res);

      clearInterval(interValID);

      profile.startProfile(res.object.positions);
      handlerPolyline.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

// 清除
function clear() {
  profile.clear();
  profile_GPU.destroy();
  if (handlerPolyline) handlerPolyline.clearHandler();
  state.getProfile2d = false;
  state.gpuDomShow = false;

  profile_GPU = new Cesium.Profile(scene);
  state.gpuProfileState = false;
}

onMounted(() => {
  profile.initEcharts();
});

// 监听

watch(
  () => state.getProfile2d,
  (newValue) => {
    profile.setEchartsShow(newValue);
    if (!newValue) {
      state.gpuDomShow = true;

      if (!state.gpuProfileState) return;

      //分析完毕的回调函数
      profile_GPU.getBuffer(function (buffer) {
        let canvas: any = document.getElementById("pro");
        canvas.height = profile_GPU._textureHeight;
        canvas.width = profile_GPU._textureWidth;
        let ctx = canvas.getContext("2d");
        let imgData = ctx.createImageData(
          profile_GPU._textureWidth,
          profile_GPU._textureHeight
        );
        imgData.data.set(buffer);

        //在canvas上绘制图片
        ctx.putImageData(imgData, 0, 0);
      });

      profile_GPU.build();
    } else {
      state.gpuDomShow = false;
    }
  }
);

// 销毁
onBeforeUnmount(() => {
  clear();
  profile.destroy();
  profile_GPU.destroy();
  handlerPolyline = null;
});
</script>

<style lang="scss" scoped>
.profile-container {
  @include panelContainer(100%, 3.5rem);
}
#echartsProfile {
  position: fixed !important;
  bottom: 0.3rem;
  left: 3.5rem;
  width: 6.75rem !important;
  height: 2.33rem !important;
  background-color: rgba(0, 8, 23, 0.7) !important;
  opacity: 0.7;
  padding: 0.05rem 0.1rem 0.1rem 0.05rem;
  z-index: 99;
  display: none;
}
</style>




