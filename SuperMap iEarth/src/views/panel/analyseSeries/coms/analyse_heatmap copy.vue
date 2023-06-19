<template>
  <!-- 热力图 -->
  <div class="heatmap-canvas" width="50%" height="25%"></div>
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
      <n-button class="btn-secondary">{{ $t("global.cancle") }}</n-button>
    </template>
  </sm-btnGroup>
</template>

<script lang="ts" setup>
import { useMessage } from "naive-ui";
const message = useMessage();
let scene = viewer.scene;
// let layers = viewer.layer
let layers = viewer.scene.layers.layerQueue;
let heatmapInstance = createHeatMap(40);
// 画线
let polylineHandler = new SuperMap3D.DrawHandler(
  viewer,
  SuperMap3D.DrawMode.Line
);
polylineHandler.activeEvt.addEventListener(function (isActive) {
  if (isActive == true) {
    viewer.enableCursorStyle = false;
    viewer._element.style.cursor = "";
    // $("body").removeClass("drawCur").addClass("drawCur");
  } else {
    viewer.enableCursorStyle = true;
    // $("body").removeClass("drawCur");
  }
});
polylineHandler.movingEvt.addEventListener(function (windowPosition) {
  // tooltip.showAt(windowPosition, "<p>两点定一个矩形</p>");
  message.warning("<p>两点定一个矩形</p>");
});
let pts = null;
polylineHandler.drawEvt.addEventListener(function (result) {
  polylineHandler.deactivate();
  polylineHandler.polyline.show = false;
  pts = result.object ? result.object.positions : result;
  let mycanvas: any = document.getElementsByClassName("heatmap-canvas");
  let imgData = mycanvas[1].toDataURL("image/png");
  let img = new Image();
  img.src = imgData;
  img.onload = function () {
    for (let layer of layers) {
      layer.addOverlayImage({
        bounds: SuperMap3D.Rectangle.fromCartesianArray(pts),
        name: "heat-map",
        image: img,
      });
    }
    clickCount = 0;
    positions = [];
    polylineHandler.activate();
  };
});

scene.camera.moveEnd.addEventListener(function () {
  let height = scene.camera.positionCartographic.height;
  let _heatmapInstance = createHeatMap(height / 10);

  if (layers != null && pts != null) {
    let img = new Image();
    img.src = _heatmapInstance.getDataURL();
    img.onload = function () {
      for (let layer of layers) {
        layer.removeOverlayImage("heat-map");
        layer.addOverlayImage({
          bounds: SuperMap3D.Rectangle.fromCartesianArray(pts),
          name: "heat-map",
          image: img,
        });
      }
    };
  }
});

// 屏幕事件
let screenSpaceEventHandler = new SuperMap3D.ScreenSpaceEventHandler(
  scene.canvas
);
let positions: any = [];
let clickCount = 0;
screenSpaceEventHandler.setInputAction(function (evt) {
  let position = scene.pickPosition(evt.position);
  positions.push(position);
  clickCount++;
  if (clickCount === 2) {
    polylineHandler.drawEvt.raiseEvent(positions);
  }
}, SuperMap3D.ScreenSpaceEventType.LEFT_CLICK);
// 绘制热力图
function drawHeatMap() {
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
</script>


<style lang="scss" scoped>
</style>