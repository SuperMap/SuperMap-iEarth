<template>
  <div  class="sm-panel" v-drag v-if="trailLineShow">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span class="title-txt">{{Resource.FloodlightTrail}}</span>
        <span class="closeBtn" @click="clear">&times;</span>
      </div>

      <!-- 调用子组件 -->
      <div class="sm-function-module-content">
        <div class="flexbox">
          <label class="sm-viewshed-label-right">{{Resource.openSceneFlood}}</label>
          <input type="checkbox" v-model="bloomShow" />
          <label class="sm-viewshed-label-right">{{Resource.hdr}}</label>
          <input type="checkbox" v-model="openHDR" />
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.threshold}}</label>
          <div class="sm-solider-input-box">
            <input
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              class="min-solider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model="threshold"
            />
            <input
              style="width:34%; height:25px;border-radius:3px;"
              class="min-solider"
              type="number"
              min="0"
              max="1"
              step="0.01"
              v-model="threshold"
            />
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.bloomIntensity}}</label>
          <div class="sm-solider-input-box">
            <input
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              class="min-solider"
              type="range"
              min="0"
              max="5"
              step="0.02"
              v-model="intensity"
            />
            <input
              style="width:34%; height:25px;border-radius:3px;"
              class="min-solider"
              type="number"
              min="0"
              max="5"
              step="0.02"
              v-model="intensity"
            />
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.WakelineColor}}</label>
          <ColorPicker class="sm-colorpicker" editable v-model="trailLineColor" />
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.airline}}</label>
          <select class="sm-select" v-model="airlineOptions">
            <option selected value="Air China">中国国际航空（Air China）</option>
            <option value="China Eastern Airlines">中国东方航空（China Eastern Airlines）</option>
            <option value="China Southern Airlines">中国南方航空（China Southern Airlines）</option>
            <option value="American Airlines" selected>美国航空公司（American Airlines）</option>
            <option value="Southwest Airlines">美国西南航空（Southwest Airlines）</option>
            <option value="Delta Air Lines">美国达美航空（Delta Air Lines）</option>
            <option value="US Airways">美国全美航空（US Airways）</option>
            <option value="United Airlines">美国联合航空（United Airlines）</option>
            <option value="easyJet">英国易捷航空（easyJet）</option>
            <option value="Ryanair">爱尔兰瑞安航空（Ryanair）</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let routesGroupByAirline;
export default {
  name: "airLinesTrailLines",
  data() {
    return {
      sharedState: store.state,
      bloomShow: true,
      openHDR: true,
      threshold: 0.01,
      intensity: 0.5,
      trailLineColor: "#0F7AF4",
      airlineOptions: "American Airlines",
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    trailLineShow: function () {
      return this.sharedState.specialEffects[0];
    },
  },
  methods: {
    init() {
      viewer.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: "static/images/ParticleSystem/BlackMarble_2016.jpg",
        })
      );
      let scene = viewer.scene;
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -1027827.1490632605,
          -16765160.375307877,
          10382141.027765635
        ),
        orientation: {
          heading: 6.076454193121397,
          pitch: -1.5670024568705059,
          roll: 0,
        },
      });
      scene.bloomEffect.show = true; //开启泛光
      scene.bloomEffect.threshold = Number(this.threshold);
      scene.bloomEffect.bloomIntensity = Number(this.intensity);
      scene.hdrEnabled = true; // 开启hdr

      Cesium.loadJson("static/data/effectJson/flights.json").then((jsonData) => {
        let airlineName = "American Airlines";
        function getAirportCoord(idx) {
          // 获得具体机场的坐标
          return Cesium.Cartesian3.fromDegrees(
            jsonData.airports[idx][3],
            jsonData.airports[idx][4]
          );
        }
        routesGroupByAirline = {}; // 包含每一个航空公司的所有航线
        jsonData.routes.forEach((route) => {
          let airline = jsonData.airlines[route[0]];
          let airlineName = airline[0]; // 航空公司的名称
          if (!routesGroupByAirline[airlineName]) {
            routesGroupByAirline[airlineName] = [];
          }
          let start = getAirportCoord(route[1]);
          let end = getAirportCoord(route[2]);
          routesGroupByAirline[airlineName].push([start, end]);
        });
        this.drawLines(airlineName, this.trailLineColor);
      });
    },
    drawLines(airlineName, lineColor) {
      let color = Cesium.Color.fromCssColorString(lineColor);
      viewer.entities.removeAll();
      for (let line of routesGroupByAirline[airlineName]) {
        viewer.entities.add({
          // 用于打底的线
          polyline: {
            positions: [line[0], line[1]],
            width: 0.5, // 线的宽度，像素为单位
            material: Cesium.Color.fromCssColorString(
              "rgba(118, 233, 241, 0.1)"
            ),
          },
        });

        viewer.entities.add({
          // 尾迹线
          polyline: {
            positions: [line[0], line[1]],
            width: 4, // 线的宽度，像素为单位
            material: new Cesium.PolylineTrailMaterialProperty({
              // 尾迹线材质
              color: color,
              trailLength: 0.2,
              period: 5.0,
            }),
          },
        });
      }
    },
    clear() {
      viewer.entities.removeAll();
      let ly = viewer.imageryLayers._layers[1];
      viewer.imageryLayers.remove(ly);
      store.setImgLayerManage(viewer.imageryLayers._layers.length);
      scene.bloomEffect.show = false;
      scene.hdrEnabled = false;
      store.setSpecialEffects(0, 0);
      this.reset();
      routesGroupByAirline = null;
    },
    reset() {
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        ),
      });
    },
  },

  watch: {
    trailLineShow(val) {
      if (val) {
        this.init();
      }
    },
    bloomShow: function (val) {
      viewer.scene.bloomEffect.show = val;
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
    },
    threshold(val) {
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
    },
    intensity(val) {
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
    },
    openHDR(val) {
      scene.hdrEnabled = val;
    },
    airlineOptions(val) {
      switch (val) {
        case "Air China":
        case "China Eastern Airlines":
        case "China Southern Airlines":
          scene.camera.flyTo({
            destination: new Cesium.Cartesian3(
              -4511826.162646529,
              16838364.473915376,
              10064576.385825634
            ),
            orientation: {
              heading: 6.283185307179586,
              pitch: -1.5707963267948966,
              roll: 0,
            },
          });
          break;
        case "American Airlines":
        case "Southwest Airlines":
        case "Delta Air Lines":
        case "US Airways":
        case "United Airlines":
          scene.camera.flyTo({
            destination: new Cesium.Cartesian3(
              -1027827.1490632605,
              -16765160.375307877,
              10382141.027765635
            ),
            orientation: {
              heading: 6.076454193121397,
              pitch: -1.5670024568705059,
              roll: 0,
            },
          });
          break;
        case "easyJet":
        case "Ryanair":
          scene.camera.flyTo({
            destination: new Cesium.Cartesian3(
              14446265.13308438,
              1417618.1947955855,
              13386996.143159749
            ),
            orientation: {
              heading: 5.944835562437463,
              pitch: -1.5670024568705059,
              roll: 0,
            },
          });
          break;
        default:
          break;
      }
      this.drawLines(val, this.trailLineColor);
    },
    trailLineColor(val) {
      this.drawLines(this.airlineOptions, val);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "airlinesTrailLines";
</style>
