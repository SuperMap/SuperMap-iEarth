<template>
  <div v-show="sightlineComb">
    <div class="sm-function-module-content">
      <div class="sm-point"></div>
      <label class="sm-function-module-SightLine">{{
        Resource.ObserverInformation
      }}</label>
      <div class="sm-function-module-sub-section">
        <div>
          <div class="sightLine-half">
            <label class="sm-function-module-SightLine">{{
              Resource.longitude
            }}</label>
            <input v-model="viewlongitude" type="text" class="sm-input-right" style="width:130px;float:left;"/>
          </div>
          <div class="sightLine-half">
            <label
              class="sm-function-module-SightLine"
              >{{ Resource.latitude }}</label
            >
            <input v-model="viewlatitude" type="text" class="sm-input-right" style="width:130px;float:left;"/>
          </div>
        </div>
        <div>
          <div class="sightLine-half">
            <label class="sm-function-module-SightLine">{{
              Resource.altitude
            }}</label>
            <input v-model="viewheight" type="text" class="sm-input-right" style="width:130px;float:left;"/>
          </div>
        </div>
      </div>

      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">{{
        Resource.parameterSetting
      }}</label>
      <div class="sm-function-module-sub-section">
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.visibleColor
          }}</label>
          <ColorPicker class="sm-colorpicker" v-model="visibleColor" alpha />
        </div>
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.hideenColor
          }}</label>
          <ColorPicker class="sm-colorpicker" v-model="hiddenColor" alpha />
        </div>
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.highlightBarrierColor
          }}</label>
          <ColorPicker
            class="sm-colorpicker"
            v-model="highlightBarrierColor"
            alpha
          />
        </div>

        <div>
          <input type="checkbox" checked v-model="highlightBarrier" />
          <label class="sm-function-module-sub-section-caption">{{
            Resource.highlightBarrier
          }}</label>
        </div>
      </div>

      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">
          {{ Resource.analyze }}
        </button>
        <button type="button" class="tbtn" @click="clear">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let sightline, screenSpaceEventHandler, sightLineHandler, pointHandler;
let interval,allHighlightBarrier=[];
export default {
  name: "Sm3dSightline",
  data() {
    return {
      sharedState: store.state,
      viewPosition: [],
      HandlerFlag: true,
      flag: false,
      viewlongitude: 0,
      viewlatitude: 0,
      viewheight: 0,
      visibleColor: "rgb(0, 200, 0)",
      hiddenColor: "rgb(200, 0, 0)",
      highlightBarrierColor: "rgba(255, 186, 1, 1)",
      highlightBarrier: false,
      isDestroyFlag: true,
      highlight:false
    };
  },
  computed: {
    sightlineComb: function () {
      return this.sharedState.analysis[0];
    },
    analysisShow: function () {
      return this.sharedState.toolBar[6];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && sightline) {
      screenSpaceEventHandler.destroy();
      sightLineHandler.deactivate();
      pointHandler.deactivate();
      pointHandler = undefined;
      sightLineHandler = undefined;
      sightline = undefined;
      screenSpaceEventHandler = undefined;
    }
  },
  mounted() {
    if (this.analysisShow && this.sightlineComb) {
      this.init();
    }
  },
  methods: {
    init() {
      if (sightline) {
        return;
      }

      var scene = viewer.scene;

      sightline = new Cesium.Sightline(scene);

      screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );

      sightLineHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);

      pointHandler = new Cesium.PointHandler(viewer);
    },

    analysis() {
      if (this.flag) {
        this.clear();
      }

      this.isDestroyFlag = false; //保留效果
      let that = this;
      interval = setInterval(function(){
        that.highlightBarries();
      },50);
      sightline.visibleColor = Cesium.Color.fromCssColorString(
        this.visibleColor
      );
      sightline.hiddenColor = Cesium.Color.fromCssColorString(this.hiddenColor);
      viewer.entities.removeAll();
      sightLineHandler.activeEvt.addEventListener((isActive) => {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      sightLineHandler.movingEvt.addEventListener((windowPosition) => {
        sightLineHandler.polyline && (sightLineHandler.polyline.show = false);
        window.tooltip.showAt(windowPosition, "<p>点击鼠标左键添加观察点</p>");
        if (sightLineHandler.isDrawing) {
          window.tooltip.showAt(
            windowPosition,
            "<p>点击鼠标左键可添加多个目标点</p><p>点击鼠标右键结束</p>"
          );
        }
      });
      //画线绘制完成事件
      sightLineHandler.drawEvt.addEventListener(function (result) {
        that.HandlerFlag = false; //移除监听
        sightLineHandler.polyline.show = false;
        window.tooltip.setVisible(false);
      });

      sightline.build();
      //鼠标点击第一下，调用drawEvt；再点击，调用screenSpaceEventHandler.setInputAction
      pointHandler.drawEvt.addEventListener(function (result) {
        var point = result.object;
        point.show = true;
        that.viewPosition = point;
        var position = point.position;
        var cartographic = Cesium.Cartographic.fromCartesian(position);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height;
        that.viewlongitude = longitude.toFixed(6);
        that.viewlatitude = latitude.toFixed(6);
        that.viewheight = height.toFixed(6);
        sightline.viewPosition = [longitude, latitude, height];

        //可以添加多个目标点
        screenSpaceEventHandler.setInputAction(function (evt) {
          if (that.HandlerFlag) {
            sightLineHandler.polyline &&
              (sightLineHandler.polyline.show = false);
            var pick = viewer.scene.pickPosition(evt.position);
            var ecartographic = Cesium.Cartographic.fromCartesian(pick);
            var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            var eheight = ecartographic.height;
            sightline.addTargetPoint({
              position: [elongitude, elatitude, eheight],
              name: "point" + new Date(),
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      });

      pointHandler.activate();
      sightLineHandler.activate();
      this.flag = true;
    },
    clear() {
      //初始化参数
      clearInterval(interval);
      interval = undefined;
      allHighlightBarrier = [];
      this.highlight = false;
      this.viewlongitude = 0;
      this.viewlatitude = 0;
      this.viewheight = 0;

      this.visibleColor = "rgb(0, 200, 0)";
      this.hiddenColor = "rgb(200, 0, 0)";
      this.highlightBarrierColor = "rgba(255, 186, 1, 1)";
      this.highlightBarrier = false;
      screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
      this.HandlerFlag = true;

      if (sightLineHandler) {
        sightLineHandler.deactivate();
      }
      if (pointHandler) {
        pointHandler.deactivate();
      }
      viewer.entities.removeAll();
      sightline && sightline.removeAllTargetPoint();
      for (var layer of scene.layers.layerQueue) {
        layer.removeAllObjsColor();
      }
      this.flag = false;
      this.isDestroyFlag = true; //摧毁标志，释放内存
      window.tooltip.setVisible(false);
    },
    highlightBarries(){
      let color = Cesium.Color.fromCssColorString(this.highlightBarrierColor);
      try {
        let ObjectIds = sightline.getObjectIds();
        for (let index in ObjectIds) {
          let layer = viewer.scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
          let ids = sightline.getObjectIds()[index];
          if(this.highlight){
            layer.setObjsColor(allHighlightBarrier, color);
            allHighlightBarrier = [];
          }
          allHighlightBarrier.push(ids[0]);
        }
      } catch (error) {}
    },
    destory() {
      this.clear();
      if (sightline) {
        sightline.destroy();
        sightline = undefined;
      }
    },
  },
  watch: {
    analysisShow(val) {
      if (val && this.sightlineComb) {
        this.init();
      }
    },
    sightlineComb(val) {
      if (val) {
        this.init();
      }
    },
    visibleColor: function (newValue) {
      if (this.flag) {
        let color = Cesium.Color.fromCssColorString(newValue);
        if (sightline) {
          sightline.visibleColor = color;
        }
      }
    },
    hiddenColor: function (newValue) {
      if (this.flag) {
        let color = Cesium.Color.fromCssColorString(newValue);
        if (sightline) {
          sightline.hiddenColor = color;
        }
      }
    },
    highlightBarrierColor: function (newValue) {
      this.highlightBarrierColor = newValue;

      for (var layer of scene.layers.layerQueue) {
        layer.removeAllObjsColor();
      }
      if (sightline && this.highlightBarrier) {
        let color = Cesium.Color.fromCssColorString(this.highlightBarrierColor);
        try {
          let ObjectIds = sightline.getObjectIds();
          for (let index in ObjectIds) {
            let layer = viewer.scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
            let ids = sightline.getObjectIds()[index];
            layer.setObjsColor(ids, color);
          }
        } catch (error) {}
      }
    },
    highlightBarrier: function (newValue) {
      if (sightline && newValue) {
        this.highlight = true;
      }else{
        this.highlight = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  @import "./SightLine.scss";
</style>


