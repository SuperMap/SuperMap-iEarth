<template>
  <div v-show="shadowqueryComb">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <div class="sm-point"></div>
        <label class="sm-function-module-sub-section-setting">{{Resource.parameterSetting}}</label>
      </div>

      <div class="sm-function-module-sub-section">
        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption" style>{{Resource.startTime}}</label>
          <select class="sm-select sm-shadowquery-select" style="width:46%" v-model="startTime">
            <option value="0">0:00</option>
            <option value="2">2:00</option>
            <option value="4">4:00</option>
            <option value="6">6:00</option>
            <option value="8">8:00</option>
            <option value="10">10:00</option>
            <option value="12">12:00</option>
            <option value="14">14:00</option>
            <option value="16">16:00</option>
            <option value="18">18:00</option>
            <option value="20">20:00</option>
            <option value="22">22:00</option>
          </select>
        </div>

        <div class="sm-half">
          <label class="sm-function-module-sub-section-caption label-right">{{Resource.endTime}}</label>
          <select class="sm-select sm-shadowquery-select" style="width:46%" v-model="endTime">
            <option value="0">0:00</option>
            <option value="2">2:00</option>
            <option value="4">4:00</option>
            <option value="6">6:00</option>
            <option value="8">8:00</option>
            <option value="10">10:00</option>
            <option value="12">12:00</option>
            <option value="14">14:00</option>
            <option value="16">16:00</option>
            <option value="18">18:00</option>
            <option value="20">20:00</option>
            <option value="22">22:00</option>
          </select>
        </div>
      </div>

      <div class="sm-function-module-sub-section">
        <div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">{{Resource.timeInterval}}</label>
            <input v-model="timeInterval" type="number" class="sm-input sm-input-long" />
          </div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption label-right">{{Resource.spacing}}</label>
            <input v-model="spacing" type="number" class="sm-input sm-input-long" />
          </div>
        </div>
      </div>

      <div class="sm-function-module-sub-section">
        <div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption">{{Resource.bottomAltitude}}</label>
            <input v-model="bottomHeight" type="number" class="sm-input sm-input-long" />
          </div>
          <div class="sm-half">
            <label class="sm-function-module-sub-section-caption label-right">{{Resource.extrudeHeight}}</label>
            <input v-model="extrudeHeight" type="number" class="sm-input sm-input-long" />
          </div>
        </div>
      </div>

      <div>
        <input type="checkbox" checked v-model="sunlight" />
        <label class="sm-function-module-sub-section-caption">{{Resource.sunlight}}</label>
      </div>

      <div class="boxchild">
        <button type="button" class="tbtn tbn1" @click="analysis">{{ Resource.analyze}}</button>
        <button type="button" class="tbtn" @click="clear">{{Resource.clear}}</button>
      </div>
    </div>
  </div>
</template>

<script>
let shadowQuery, layers;

export default {
  name: "Sm3dShadowquery",
  data() {
    return {
      sharedState: store.state,
      positions: [],
      points: [],
      timeInterval: 60,
      spacing: 10,
      selDate: new Date(),
      startTime: "10",
      endTime: "14",
      bottomHeight: 20,
      extrudeHeight: 20,
      sunlight: false,
      isDestroyFlag: true,
    };
  },
  computed: {
    shadowqueryComb: function () {
      return this.sharedState.analysis[2];
    },
    analysisShow: function () {
      return this.sharedState.toolBar[6];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && shadowQuery) {
      shadowQuery.destroy();
      shadowQuery = undefined;
      layers = undefined;
      this.handlerPolygon.deactivate();
      this.handlerPolygon = undefined;
    }
  },
  mounted() {
    if (this.analysisShow && this.shadowqueryComb) {
      this.init();
    }
  },
  methods: {
    init() {
      if (layers) {
        return;
      }

      if (viewer.shadows == false) {
        viewer.shadows = true; //开启场景阴影
      }
      let scene = viewer.scene;
      layers = scene.layers.layerQueue;

      //创建阴影查询对象
      if (!shadowQuery) {
        shadowQuery = new Cesium.ShadowQueryPoints(scene);
        shadowQuery.build();
      }
      let that = this;
      this.setCurrentTime();
      this.handlerPolygon = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Polygon,
        0
      );
      let handlerPolygon = this.handlerPolygon;
      handlerPolygon.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      handlerPolygon.movingEvt.addEventListener((windowPosition) => {
        window.tooltip.showAt(
          windowPosition,
          "<p>点击鼠标左键开始绘制分析区域</p>"
        );
      });
      handlerPolygon.drawEvt.addEventListener((result) => {
        window.tooltip.setVisible(false);
        let positions = that.positions;
        let points = that.points;

        points.length = 0;
        var polygon = result.object;
        if (!polygon) {
          return;
        }
        polygon.show = false;
        handlerPolygon.polyline.show = false;
        positions = [].concat(polygon.positions);
        positions = Cesium.arrayRemoveDuplicates(
          positions,
          Cesium.Cartesian3.equalsEpsilon
        );
        //遍历多边形，取出所有点
        for (var i = 0, len = positions.length; i < len; i++) {
          //转化为经纬度，并加入至临时数组
          var cartographic = Cesium.Cartographic.fromCartesian(
            polygon.positions[i]
          );
          var longitude = Cesium.Math.toDegrees(cartographic.longitude);
          var latitude = Cesium.Math.toDegrees(cartographic.latitude);
          points.push(longitude);
          points.push(latitude);
        }
        //设置分析对象的开始结束时间
        var dateValue = that.selDate;
        var st = new Date(dateValue);
        st.setHours(Number(that.startTime));
        shadowQuery.startTime = Cesium.JulianDate.fromDate(st);

        var et = new Date(dateValue);
        et.setHours(Number(that.endTime));
        shadowQuery.endTime = Cesium.JulianDate.fromDate(et);

        //设置当前时间
        that.setCurrentTime();

        shadowQuery.spacing = that.spacing;
        shadowQuery.timeInterval = that.timeInterval;

        //设置分析区域、底部高程和拉伸高度
        var bh = Number(that.bottomHeight);
        var eh = Number(that.extrudeHeight);
        shadowQuery.qureyRegion({
          position: points,
          bottom: bh,
          extend: eh,
        });
        shadowQuery.build();
      });
    },
    setCurrentTime() {
      var et = this.selDate;
      et.setHours(Number(this.endTime));
      viewer.clock.currentTime = Cesium.JulianDate.fromDate(et);
      viewer.clock.multiplier = 1;
      viewer.clock.shouldAnimate = true;
    },
    analysis() {
      
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].shadowType !== 2) {
          layers[i].shadowType = 2;
          layers[i].refresh();
        }
      };
      this.isDestroyFlag = false; //保留效果
      this.handlerPolygon.deactivate();
      this.handlerPolygon.activate();
    },
    clear() {
      if (this.handlerPolygon) {
        this.handlerPolygon.deactivate();
      }
       window.tooltip.setVisible(false);

      this.isDestroyFlag = true; //摧毁标志，释放内存
      viewer.entities.removeAll();


      if (shadowQuery) {
        shadowQuery.qureyRegion({
          position: [0, 0],
          bottom: 0,
          extend: 0,
        });
      }

      this.positions = [];
      this.points = [];
      this.selDate = new Date();
      this.startTime = "10";
      this.endTime = "14";

      this.timeInterval = 60;
      this.spacing = 10;
      this.bottomHeight = 20;
      this.extrudeHeight = 20;
      this.sunlight = false;
    }
  },
  watch: {
    shadowqueryComb(val) {
      if (val) {
        this.init();
      }
    },
    analysisShow(val) {
      if (val && this.shadowqueryComb) {
        this.init();
      }
    },
    selDate: function (newValue) {},
    startTime: function (newValue) {
      var st = this.selDate;
      st.setHours(Number(newValue));
      shadowQuery.startTime = Cesium.JulianDate.fromDate(st);
    },
    endTime: function (newValue) {
      var et = this.selDate;
      et.setHours(Number(newValue));
      shadowQuery.endTime = Cesium.JulianDate.fromDate(et);
    },
    timeInterval: function (newValue) {
      shadowQuery.timeInterval = Number(newValue);
      shadowQuery.build();
    },
    spacing: function (newValue) {
      shadowQuery.spacing = Number(newValue);
      shadowQuery.build();
    },
    bottomHeight: function (newValue) {
      var bh = Number(newValue);
      var eh = Number(this.extrudeHeight);
      shadowQuery.qureyRegion({
        position: this.points,
        bottom: bh,
        extend: eh,
      });
      shadowQuery.build();
    },
    extrudeHeight: function (newValue) {
      var bh = Number(this.bottomHeight);
      var eh = Number(newValue);
      shadowQuery.qureyRegion({
        position: this.points,
        bottom: bh,
        extend: eh,
      });
      shadowQuery.build();
    },
    sunlight: function (newValue) {
      if (newValue) {
        var dateVal = this.selDate;
        var startTime = new Date(dateVal);
        var endTime = new Date(dateVal);
        var shour = Number(this.startTime);
        var ehour = Number(this.endTime);

        for (var i = 0; i < layers.length; i++) {
          layers[i].shadowType = 0;
        }

        if (shour > ehour) {
          return;
        }

        var nTimer = 0.0;
        var nIntervId = setInterval(function () {
          if (shour < ehour) {
            startTime.setHours(shour);
            startTime.setMinutes(nTimer);
            viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
            nTimer += 10.0;
            if (nTimer > 60.0) {
              shour += 1.0;
              nTimer = 0.0;
            }
          } else {
            clearInterval(nIntervId);
          }
        }, 20);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "shadowquery";
</style>
