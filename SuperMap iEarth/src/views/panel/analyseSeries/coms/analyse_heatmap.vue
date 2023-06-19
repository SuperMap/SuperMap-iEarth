<template>
  <!-- 热力图 -->
  <div
    class="heatmap"
    style="overflow: hidden; width: 0.1rem; height: 0.1rem; position: relative"
  >
    <div class="heatmap-canvas" width="50%" height="25%"></div>
  </div>
  <sm-btnGroup>
    <template #btn-left>
      <n-button
        type="info"
        color="#3499E5"
        text-color="#fff"
        @click="drawHeatMap"
        >绘制</n-button
      >
    </template>
    <template #btn-right>
      <n-button class="btn-secondary" @click="clearHeatMap">{{
        $t("global.cancle")
      }}</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { useMessage } from "naive-ui";
import { onMounted } from "vue";
const message = useMessage();
let scene = viewer.scene;
let polylineHandler;
let heatmapInstance;

let screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
polylineHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);

// onMounted(() => {
//   drawHeatMap();
// });

// 绘制热力图
function drawHeatMap() {
  // let layers = viewer.layer
  let layers = viewer.scene.layers.layerQueue;
  let pts = null;
  let clickCount = 0;
  let positions: any = [];
  // 创建热力图
  heatmapInstance = createHeatMap(40);

  // 屏幕事件左击
  screenSpaceEventHandler.setInputAction(function (evt) {
    let position = scene.pickPosition(evt.position);
    positions.push(position);
    clickCount++;
    if (clickCount === 2) {
      polylineHandler.drawEvt.raiseEvent(positions);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // polylineHandler.movingEvt.addEventListener(function (windowPosition) {
  //   message.success("<p>两点定一个矩形</p>");
  // });

  polylineHandler.drawEvt.addEventListener(function (result) {
    polylineHandler.deactivate();
    polylineHandler.polyline.show = false;
    // pts = result.object ? result.positions : result;
    pts = result;
    console.log("热力图坐标", pts);

    let mycanvas: any = document.getElementsByClassName("heatmap-canvas");
    let imgData = mycanvas[1].toDataURL("image/png");
    let img = new Image();
    img.src = imgData;
    img.onload = function () {
      for (let layer of layers) {
        layer.addOverlayImage({
          bounds: Cesium.Rectangle.fromCartesianArray(pts),
          name: "heat-map",
          image: img,
        });
      }
      clickCount = 0;
      positions = [];
      polylineHandler.activate();
    };
  });

  polylineHandler.activate();
}
// 创建热力图
function createHeatMap(value) {
  heatmapInstance = h337.create({
    container: document.querySelector(".heatmap"),
    radius: value,
  });
  let points: any = [];
  let max = 0;
  let width = 840;
  let height = 400;
  let len = 200;
  while (len--) {
    let val = Math.floor(Math.random() * 100);
    max = Math.max(max, val);
    let point = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      value: val,
    };
    points.push(point);
  }
  let data = {
    max: max,
    data: points,
  };
  heatmapInstance.setData(data);
  return heatmapInstance;
}
// 清除热力图
function clearHeatMap() {
  polylineHandler.polyline.show;
  heatmapInstance = undefined;
}
</script>


<style lang="scss" scoped>
</style>