<template>
  <div class="sm-function-module-content" v-show="cameraShow">
    <label class="label-container">{{Resource.flyRoute}}</label>
    <input class="sm-input" type="file" accept=".fpf" id="flyFile" style=" width: 100%;height:33px;padding-top:2px;" />
    <div class="flybox">
      <img
        src="static/images/flypng/start.png"
        :title = Resource.startFly
        class="imgbox"
        @click="flyStart"
      />
      <img
        src="static/images/flypng/pause.png"
        :title= Resource.pauseFly
        class="imgbox"
        @click="flyPause"
      />
      <img
        src="static/images/flypng/stop.png"
        :title= Resource.stopFly
        class="imgbox"
        @click="flyStop"
      />
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.stopChoose}}</label>
      <select class="select" id="stopList" v-model="stopSelected">
      </select>
    </div>
      <div class="flexbox" style="width:41%">
        <label class="sm-viewshed-label-right">{{Resource.showFlyRoute}}</label>
        <input type="checkbox" v-model="showFlyRoute" />
      </div>
      <div class="flexbox flystop">
        <label class="sm-viewshed-label-right">{{Resource.showFlyStop}}</label>
        <input type="checkbox" v-model="showFlyStop" />
      </div>
      <button @click="clear" type="button" class="tbtn tbn1 cameraclear">{{Resource.clear}}</button>
    <div class="observeState">
      <label class="label-container">{{Resource.observe}}</label>
      <div class="flexbox" style="width:41%;">
        <label class="cameraziti">{{Resource.rotateCirculation}}</label>
        <input type="checkbox" v-model="circulation" />
      </div>
      <div>
        <button @click="onStopFlyCircle" class="button black pausefly">{{Resource.pauseFly}}</button>
        <button @click="restore" class="button black" style="width:45%;">{{Resource.restore}}</button>
      </div>
      <div>
        <button @click="onSpinClk" class="button black cameraspin">{{Resource.rotatePoint}}</button>
        <button @click="onCancelSpinClk" class="button black" style="width:45%;">{{Resource.cancelRotatePoint}}</button>
      </div>
      <label class="label-container">{{Resource.rotateSpeed}}</label>
      <div class="sm-solider-input-box">
        <input
          class="min-solider"
          min="0"
          max="50"
          step="0.1"
          style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
          type="range"
          v-model="speed"
        />
        <input
          class="min-solider"
          min="0"
          max="50"
          step="0.1"
          style="width:34%;border-radius:3px;"
          type="number"
          v-model="speed"
        />
      </div>
    </div>
    <div class="sm-function-module-sub-section underground">
      <label class="label-container">{{Resource.underground}}</label>
      <br />
      <label class="sm-viewshed-label-right" style="width:98.5px;">{{Resource.openUnderground}}</label>
      <input type="checkbox" v-model="underground" />
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.cameraMinimumZoomDistance}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="cameraMinimumZoomDistance" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.SurfaceTransparency}}</label>
        <input
          class="sm-input-long"
          min="0"
          max="1.0"
          step="0.01"
          type="number"
          v-model="SurfaceTransparency"
        />
      </div>
    </div>
  </div>
</template>

<script>
let flyManager, camera, flyCircleDrawHandler;
export default {
  name: "sceneCamera",
  data() {
    return {
      sharedState: store.state,
      stopSelected: null,
      stopFlyCircle: true,
      circulation: true,
      flyCirclePoint: null,
      speed: 1,
      underground: false,
      SurfaceTransparency: 1,
      cameraMinimumZoomDistance: -1000,
      isDestroyFlag: true,
      showFlyStop:true,
      showFlyRoute: true,
      stopList:{}
    };
  },

  computed: {
    cameraShow: function () {
      return this.sharedState.sceneAtttribute[1];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && camera) {
      camera = undefined;
      if (flyCircleDrawHandler) {
        flyCircleDrawHandler = undefined;
      }
      if (flyManager) {
        flyManager.destroy();
        flyManager = undefined;
      }
    }
  },
  mounted() {
    if (this.SceneAtttributeShow && this.basicOptions) {
      this.init();
    }
  },
  methods: {
    //子组件部分
    init() {
      if (camera) {
        return;
      }
      camera = scene.camera;
      camera.flyCircleLoop = true;
    },
    flyStart() {
      if (flyManager) {
        flyManager.play();
      } else {
        let that = this;
        let routes = new Cesium.RouteCollection(viewer.entities);
        let fileInput = document.getElementById("flyFile");
        let file = fileInput.files[0];
        if (!file) {
          return; // 没有选择fpf文件无法开始执行
        }
        let reader = new FileReader();
        reader.onload = function (e) {
          // 读取操作完成时出发
          let XMLContent = e.target.result;
          routes.fromXML(XMLContent);
        };
        reader.readAsBinaryString(file);
        //创建飞行管理对象
        flyManager = new Cesium.FlyManager({
          scene: scene,
          routes: routes,
        });
        flyManager.stopArrived.addEventListener(function (routeStop) {
          routeStop.waitTime = 1;
        });
        if (flyManager.readyPromise) {
          Cesium.when(flyManager.readyPromise, function () {
            let currentRoute = flyManager.currentRoute;
            let allStops = flyManager.getAllRouteStops();
            let menu = document.getElementById("stopList");
            for (let i = 0, j = allStops.length; i < j; i++) {
              let option = document.createElement("option");
              option.innerHTML = Resource.stop + (i + 1);
              option.value = allStops[i].index;
              menu.appendChild(option);
            }
            currentRoute.isLineVisible = true;
            currentRoute.isStopVisible = true;
            that.showFlyRoute = true;
            that.showFlyStop = true;
            flyManager.play();
          });
        }
      }
    },
    flyPause() {
      flyManager && flyManager.pause();
    },
    flyStop() {
      flyManager && flyManager.stop();
    },
    onSpinClk(evt) {
      this.isDestroyFlag = false;
      if (!flyCircleDrawHandler) {
        flyCircleDrawHandler = new Cesium.DrawHandler(
          viewer,
          Cesium.DrawMode.Point
        );
        flyCircleDrawHandler.activeEvt.addEventListener(function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        });
        flyCircleDrawHandler.drawEvt.addEventListener((result) => {
          this.flyCirclePoint = result.object.position;
          viewer.entities.removeById("fly-circle-point");
          viewer.entities.add({
            id: "fly-circle-point",
            position: this.flyCirclePoint,
            billboard: {
              image: "@/../static/images/flypng/flyCircle.png",
              scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
              disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
            },
          });
          camera.stopFlyCircle(); // 先停止之前的旋转，再开始新的旋转
          camera.flyCircle(this.flyCirclePoint);
          flyCircleDrawHandler.clear();
        });
      }
      flyCircleDrawHandler.activate();
    },
    onCancelSpinClk() {
      this.isDestroyFlag = true;
      camera.stopFlyCircle();
      viewer.entities.removeById("fly-circle-point");
      this.flyCirclePoint = null;
    },
    onStopFlyCircle() {
      if (this.stopFlyCircle) {
        camera.stopFlyCircle();
      };
      this.stopFlyCircle = false;
    },
    restore(){
      this.stopFlyCircle = true;
      if(this.stopFlyCircle){
        if (this.flyCirclePoint) {
          camera.flyCircle(this.flyCirclePoint);
        }
      }
    },
    clear(){
      let route = flyManager.currentRoute;
      let allStops = flyManager.getAllRouteStops();
      let length = allStops.length;

      let menu = document.getElementById("stopList");
      menu.innerHTML = "";

      while(length){
        route.removeStop(allStops[length-1]);
        length = allStops.length;
      }

      let fileInput = document.getElementById("flyFile");
      fileInput.value = null;

      if (flyManager) {
        flyManager = undefined;
      }

    }
  },

  watch: {
    cameraShow: function (val) {
      if (val) {
        this.init();
      }
    },
    stopSelected(val) {
      //各个站点事件
      flyManager && flyManager.pause();
      let index = Number(val);
      let route = flyManager.currentRoute;
      let stop = route.get(index);
      flyManager.currentStopIndex = index;
      flyManager.viewToStop(stop);
    },
    circulation(val) {
      camera.flyCircleLoop = val;
    },
    speed(val) {
      camera.speedRatio = Number(val);
    },
    underground(val) {
      viewer.scene.undergroundMode = val;
      if (val) {
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = Number(
          this.cameraMinimumZoomDistance
        );
      } else {
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
      }
    },
    cameraMinimumZoomDistance(val) {
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = Number(
        val
      );
    },
    SurfaceTransparency(val) {
      viewer.scene.globe.globeAlpha = parseFloat(val);
    },
    showFlyRoute(val){
      if(flyManager){
        let Route = flyManager.currentRoute;
        Route.isLineVisible = val;
      }
    },
    showFlyStop(val){
      if(flyManager){
        let Route = flyManager.currentRoute;
        Route.isStopVisible = val;
      }
    }
  },
};
</script>

<style lang="scss"  scoped>
@import "camera";
</style>
