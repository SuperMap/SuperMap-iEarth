// <script src="compassViewModel.js"></script>
<template>
  <div class="compass" v-show="compassShow">
    <div class="btnCompass" @click="reduceCompass" :title= Resource.compass>
      <span
        id="compass"
        class="iconfont iconiEarth-zhibeizhen-01 compasstb"
        style="transform : rotate(0deg);display : inline-block;"
      ></span>
    </div>
    <div class="btnCompass" @click="reset" :title= Resource.reset>
      <span  class="iconfont iconzhongzhi compasstb"></span>
    </div>
    <div id="zoomIn" class="btnCompass" @mousedown="zoomIn">
      <span class="iconfont iconfangda compasstb"></span>
    </div>
    <div id="zoomOut" class="btnCompass" @mousedown="zoomOut">
      <span class="iconfont iconsuoxiao compasstb" ></span>
    </div>
    <div class="btnCompass" @click="fullscreenchange" :title = Resource.fullScreen> 
      <span class="iconfont compasstb" :class="!isfull?'iconquanping':'iconICON_tuichuquanping'" ></span>
    </div>
  </div>
</template>

<script>
  import CompassViewModel from "./compassViewModel.js";
  let viewModel = {};
export default {
  name: "compass",
  data() {
    return {
      sharedState: store.state,
      isfull: false,
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    compassShow: function () {
      return this.sharedState.compass;
    }
  },
  methods: {
    initCompass() {
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      viewModel = new CompassViewModel({
        viewer:viewer,
        scene:scene,
        viewerId:"compass"
      });
      handler.setInputAction(function(){
        viewModel.viewerChanged = true;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
      handler.setInputAction(function(){
        viewModel.viewerChanged = false;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.MIDDLE_UP);
      handler.setInputAction(function(){
        viewModel.viewerChanged = false;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.LEFT_UP);
      handler.setInputAction(function(){
        viewModel.viewerChanged = true;
        viewModel.handleViewerChange();
      },Cesium.ScreenSpaceEventType.LEFT_DOWN);
    },
    reduceCompass() {
      viewModel.compassPointingNorth();
    },
    reset() {
      let defaultPosition = new Cesium.Cartesian3.fromDegrees(110.60396458865515, 34.54408834959379, 30644793.325518917);
      viewModel.defaultCameraPosition = defaultPosition;
      viewModel.resetCameraPosition();
    },
    fullscreenchange() {
      if (!document.fullscreenElement) {
        this.isfull = true;
        this.launchFullscreen(document.documentElement);
      } else {
        this.isfull = false;
        this.exitFullscreen();
      }
    },
    zoomIn(){
      viewModel.handleZoomInMouseDown();
    },
    zoomOut(){
      viewModel.handleZoomOutMouseDown();
    },
    /**
     * 进入全屏模式。目前并不是所有的浏览器都实现了无前缀版本的API（2018-12-10）
     */
    launchFullscreen(element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },
    /**
     * 退出全屏模式。兼容模式。
     */
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    },
  },
  watch: {
    isInitViewer(val) {
      if (val) {
        this.initCompass();
      }
    }
  }
};
</script>

<style lang="scss"  scoped>
@import "compass";
</style>

