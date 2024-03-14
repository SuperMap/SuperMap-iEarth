<template>
  <div class="row-item">
    <span>{{ $t("openFloodlight") }}</span>
    <div style="width: 1.96rem">
      <n-switch
        v-model:value="state.bloomShow"
        @update:value="setBloom"
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-show="state.bloomShow">
    <span>{{ $t("brightnessThreshold") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.threshold"
        :step="0.01"
        :min="0"
        :max="1"
      />
      <n-input-number
        v-model:value="state.threshold"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="1"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <div class="row-item" v-show="state.bloomShow">
    <span>{{ $t("floodlightThreshold") }}</span>
    <div class="slider-box">
      <n-slider
        style="width: 1.2rem"
        v-model:value="state.bloomIntensity"
        :step="0.01"
        :min="0"
        :max="1"
      />
      <n-input-number
        v-model:value="state.bloomIntensity"
        class="slider-input-number"
        :update-value-on-input="false"
        :bordered="false"
        :show-button="false"
        :min="0"
        :max="1"
        placeholder=""
        size="small"
      />
    </div>
  </div>

  <!-- 热力图 -->
  <!--
  <div class="row-item">
    <span>{{ $t("heatMap") }}</span>
    <div style="width: 1.96rem">
      <n-switch v-model:value="state.showHeatMap" size="small" />
    </div>
  </div>

   <div
    class="btn-row-item"
    v-show="state.showHeatMap"
    style="margin-left: 1rem"
  >
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add_heatMap"
      style="margin-right: 0.1rem"
      >{{ $t("Draw") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>

  <div
    class="heatmap"
    v-show="false"
    style="overflow: hidden; width: 8.4rem; height: 4rem"
  >
    <div class="heatmap-canvas" width="50%" height="25%"></div>
  </div> -->
</template>

<script lang="ts" setup>
import { onUnmounted, reactive, watch } from "vue";
// import { useNotification } from "naive-ui";
// import initHandler from "@/tools/drawHandler";

// const notification = useNotification();

type stateType = {
  bloomShow: boolean; // 是否开启泛光
  threshold: number; // 亮度阈值
  bloomIntensity: number; // 泛光强度
  showHeatMap: boolean;
};

let state = reactive<stateType>({
  bloomShow: false,
  threshold: 0.65,
  bloomIntensity: 1,
  showHeatMap: false,
});

const scene = viewer.scene;
let handlerPolyline: any;
let pts: any, nameHeatMap: any;
let layers: any = viewer.scene.layers._layerQueue;

onUnmounted(() => {
  viewer.scene.bloomEffect.show = false;
  viewer.scene.bloomEffect.threshold = 0.65;
  viewer.scene.bloomEffect.bloomIntensity = 1;

  clear();
});

// 启动泛光
function setBloom() {
  viewer.scene.bloomEffect.show = state.bloomShow;
  viewer.scene.bloomEffect.threshold = state.threshold;
  viewer.scene.bloomEffect.bloomIntensity = state.bloomIntensity;
}

// 清除
function clear() {
  if (handlerPolyline) handlerPolyline.clearHandler();
  // clearHeatMap();

  // let layers:any = viewer.scene.layers._layerQueue;
  // for (let layer of layers) {
  //   if(layer.name === 'Building@CBD'){
  //     layer.removeOverlayImage('heat-map'); // 这个方法有问题

  //   }
  // }

  // let height = viewer.scene.camera.positionCartographic.height;
  // let _heatmapInstance = createHeatMap(height / 10);

  // // if (layers != null && pts != null) {
  //   let pts_c = null
  //   let img = new Image();
  //   img.src = _heatmapInstance.getDataURL();
  //   img.onload = function () {
  //     for (let layer of layers) {
  //       // layer.removeOverlayImage('heat-map');
  //       layer.addOverlayImage({
  //         bounds: SuperMap3D.Rectangle.fromCartesianArray([]),
  //         name: 'heat-map',
  //         image: img
  //       });
  //     }
  //   }
  // // }
}

// // 创建并添加热力图
// function add_heatMap() {
//   clearHeatMap();
//   // let heatmapInstance = createHeatMap(40);
//   notification.create({
//     content: () => $t("scanLineTip"),
//     duration: 3500,
//   });
//   if (!handlerPolyline) {
//     handlerPolyline = initHandler("Polyline");
//   }
//   handlerPolyline.handlerDrawing().then(
//     (res) => {
//       handlerPolyline.polylineTransparent.show = false;
//       pts = res.object ? res.object.positions : res;
//       let layers: any = viewer.scene.layers._layerQueue;
//       let mycanvas: any = document.getElementsByClassName("heatmap-canvas");
//       let imgData = mycanvas[1].toDataURL("image/png");
//       let img = new Image();
//       img.src = imgData;
//       nameHeatMap = "heatMap-" + Date.parse(String(new Date()));
//       img.onload = function () {
//         for (let layer of layers) {
//           layer.addOverlayImage({
//             bounds: SuperMap3D.Rectangle.fromCartesianArray(pts),
//             name: nameHeatMap,
//             image: img,
//           });
//         }
//       };
//     },
//     (err) => {
//       console.log(err);
//     }
//   );
//   handlerPolyline.activate();
// }

// // 创建热力图
// function createHeatMap(value) {
//   let heatmapInstance = h337.create({
//     container: document.querySelector(".heatmap"),
//     radius: value,
//   });
//   let points: any = [];
//   let max = 0;
//   let width = 840;
//   let height = 400;
//   let len = 200;
//   while (len--) {
//     let val = Math.floor(Math.random() * 100);
//     max = Math.max(max, val);
//     let point = {
//       x: Math.floor(Math.random() * width),
//       y: Math.floor(Math.random() * height),
//       value: val,
//     };
//     points.push(point);
//   }
//   let data = {
//     max: max,
//     data: points,
//   };
//   heatmapInstance.setData(data);
//   return heatmapInstance;
// }

// // 清除热力图
// function clearHeatMap() {
//   // 使用一种极其特殊的方式来删除热力图 - （这种并不好，主要是removeOverlayImage不起作用，暂时这样，后面来改)
//   let ptss = [
//     { x: -2182183.7755420757, y: 4386763.349348834, z: 4069821.86199696 },
//     { x: -2182185.7755420757, y: 4386764.349348834, z: 4069822.86199696 },
//   ];
//   let height = scene.camera.positionCartographic.height;
//   let _heatmapInstance = createHeatMap(height / 10);

//   let img = new Image();
//   img.src = _heatmapInstance.getDataURL();
//   img.onload = function () {
//     for (let layer of layers) {
//       layer.removeOverlayImage(nameHeatMap);
//       layer.addOverlayImage({
//         bounds: SuperMap3D.Rectangle.fromCartesianArray(ptss),
//         name: "del-temp-heatMap",
//         image: img,
//       });
//     }
//   };
// }

watch(
  () => state.threshold,
  (newVal: number) => {
    viewer.scene.bloomEffect.threshold = newVal;
  }
);
watch(
  () => state.bloomIntensity,
  (newVal: number) => {
    viewer.scene.bloomEffect.bloomIntensity = newVal;
  }
);
watch(
  () => state.showHeatMap,
  (val) => {
    if (val) {
      // add_heatMap();
    } else {
      clear();
    }
  }
);
</script>

<style lang="scss" scoped>
.heatmap {
  position: absolute;
  top: 20rem;
  left: 20rem;
}
</style>
