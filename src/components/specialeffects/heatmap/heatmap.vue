
<template>
  <div class="heatmap" style="overflow: hidden; width: 840px;height: 400px;position: relative;">
    <div class="heatmap-canvas" width="50%" height="25%"></div>
  </div>
</template>


<script>
import createTooltip from "../../../common/js/tooltip";

export default {
  name: "heatMap",
  data() {
    return {
      sharedState: store.state
    };
  },
  computed: {
    isInitViewer: function() {
      return this.sharedState.isInitViewer;
    },
    heatMapShow: function() {
      return this.sharedState.specialEffects[3];
    }
  },
  methods: {
    init() {
      let that = this;
      let scene = viewer.scene;
      // scene.debugShowFramesPerSecond = true;
      let polylineHandler;
      let pts = null;
      // 创建热力图
      let heatmapInstance;

      var buildPromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_BUILD, {
        name: "build"
      });
      var ground1Promise = scene.addS3MTilesLayerByScp(
        URL_CONFIG.SCP_CBD_GROUND1,
        { name: "ground1" }
      );
      var lakePromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_LAKE, {
        name: "lake"
      });
      var treePromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_TREE, {
        name: "tree"
      });
      var roadPromise = scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_CBD_ROAD, {
        name: "road"
      });
      var bridgePromise = scene.addS3MTilesLayerByScp(
        URL_CONFIG.SCP_CBD_BRIDGE,
        { name: "bridge" }
      );
      var ground2Promise = scene.addS3MTilesLayerByScp(
        URL_CONFIG.SCP_CBD_GROUND2,
        { name: "ground2" }
      );
      var promiseSet = [
        ground1Promise,
        buildPromise,
        lakePromise,
        treePromise,
        roadPromise,
        bridgePromise
      ];
      Cesium.when.all(promiseSet, function(layers) {
        scene.camera.setView({
          // 图层加载完成,设置相机位置
          destination: Cesium.Cartesian3.fromDegrees(
            116.44829499568006,
            39.9038584836946,
            200.729171148720404
          ),
          orientation: {
            heading: 5.462824916628415,
            pitch: -1.5695598976662626,
            roll: 6.2831853071570976
          }
        });

        var tooltip = createTooltip(document.body);
        var clickCount = 0;
        var positions = [];
        heatmapInstance = that.createHeatMap(40);

        var screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
          scene.canvas
        );
        screenSpaceEventHandler.setInputAction(function(evt) {
          var position = scene.pickPosition(evt.position);
          positions.push(position);
          clickCount++;
          if (clickCount === 2) {
            polylineHandler.drawEvt.raiseEvent(positions);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // if (!window.handlerPolyline) {
        //   common.initHandler("Polyline");
        //   polylineHandler = window.handlerPolyline;
        // }

        polylineHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
        polylineHandler.activeEvt.addEventListener(function(isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.remove("drawCur");
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        });
        polylineHandler.movingEvt.addEventListener(function(windowPosition) {
          tooltip.showAt(windowPosition, "<p>两点定一个矩形</p>");
        });

        polylineHandler.drawEvt.addEventListener(function(result) {
          polylineHandler.deactivate();
          polylineHandler.polyline.show = false;
          pts = result.object ? result.positions : result;
          // pts = [
          //   new Cesium.Cartesian3(
          //     -2179185.637835854,
          //     4380743.083049599,
          //     4091585.2588161393
          //   ),
          //   new Cesium.Cartesian3(
          //     -2179236.162640562,
          //     4380701.293144409,
          //     4091587.020568499
          //   )
          // ];

          var mycanvas = document.getElementsByClassName("heatmap-canvas");
          var imgData = mycanvas[1].toDataURL("image/png");
          var img = new Image();
          img.src = imgData;
          img.onload = function() {
            for (var layer of layers) {
              layer.addOverlayImage({
                bounds: Cesium.Rectangle.fromCartesianArray(pts),
                name: "heat-map",
                image: img
              });
            }
            clickCount = 0;
            positions = [];
            polylineHandler.activate();
          };
        });

        polylineHandler.activate();

        scene.camera.moveEnd.addEventListener(function() {
          var height = scene.camera.positionCartographic.height;
          var _heatmapInstance = that.createHeatMap(height / 10);

          if (layers != null && pts != null) {
            var img = new Image();
            img.src = _heatmapInstance.getDataURL();
            img.onload = function() {
              for (var layer of layers) {
                layer.removeOverlayImage("heat-map");
                layer.addOverlayImage({
                  bounds: Cesium.Rectangle.fromCartesianArray(pts),
                  name: "heat-map",
                  image: img
                });
              }
            };
          }
        });
      });
    },
    createHeatMap(value) {
      var heatmapInstance = h337.create({
        container: document.querySelector(".heatmap"),
        radius: value
      });
      var points = [];
      var max = 0;
      var width = 840;
      var height = 400;
      var len = 200;
      while (len--) {
        var val = Math.floor(Math.random() * 100);
        max = Math.max(max, val);
        var point = {
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: val
        };
        points.push(point);
      }
      var data = {
        max: max,
        data: points
      };
      heatmapInstance.setData(data);
      return heatmapInstance;
    },

    clear() {
      store.setSpecialEffects(4, 0);
    }
  },
  watch: {
    heatMapShow(val) {
      if (val) {
        this.init();
      }
    }
  }
};
</script>


