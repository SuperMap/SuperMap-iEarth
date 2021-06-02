<template>
  <div v-show="ServiceAreaShow">
    <div class="sm-function-module-content">
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
        <button type="button" class="tbtn" @click="clear">清除</button>
      </div>

      <div v-show="GTCShow">
        <label class="label-container">分析结果:</label>
        <div style="margin: 10px">
          <div>
            <div class="ui piled segment">
              <div id="graph" style="height: 200px;width: 250px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let
  ids1,
  ids2,
  ids3,
  initF = false;
export default {
  name: "Sm3dServiceAreaAnalysis",
  props: {},
  data() {
    return {
      dsMode: 1,
      sharedState: store.state,
      GTCShow: false,
    };
  },
  computed: {
    ServiceAreaShow: function () {
      return this.sharedState.cityPlan[3];
    },
    cityPlanShow: function () {
      return this.sharedState.toolBar[9];
    },
    initflag() {
      return this.sharedState.S3MLayerManage;
    },
  },
  methods: {
    init() {
        console.log("init",this.initF)
      if (this.initF) {
        return;
      }
      let geoCylinder = new Cesium.GeoCylinder(300, 300, 300);
      geoCylinder.geoPosition = new Cesium.Point3D(
        115.009302,
        39.006673,
        102.0
      );
      let datasetSpatialQuery3DPostParameter = {};
      datasetSpatialQuery3DPostParameter.operateRegion = geoCylinder;
      datasetSpatialQuery3DPostParameter.positionMode = "INTERSECTSORCONTAINS";
      datasetSpatialQuery3DPostParameter.sourceDatasetFilter = {
        attributeFilter: "",
      };
      let queryUrl =
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/datasets/building_udb%40building/spatialquery3d.json";

      window.axios
        .post(queryUrl, JSON.stringify(datasetSpatialQuery3DPostParameter))
        .then(function (response) {
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function (response) {
              ids1 = response.data.ids;
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });

      let geoCylinder2 = new Cesium.GeoCylinder(250, 250, 300);
      geoCylinder2.geoPosition = new Cesium.Point3D(
        115.01135582381039,
        39.00765877493075,
        102
      );
      let datasetSpatialQuery3DPostParameter2 = {};
      datasetSpatialQuery3DPostParameter2.operateRegion = geoCylinder2;
      datasetSpatialQuery3DPostParameter2.positionMode = "INTERSECTSORCONTAINS";
      datasetSpatialQuery3DPostParameter2.sourceDatasetFilter = {
        attributeFilter: "",
      };
      let queryUrl2 =
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/datasets/building_udb%40building/spatialquery3d.json";

      window.axios
        .post(queryUrl2, JSON.stringify(datasetSpatialQuery3DPostParameter2))
        .then(function (response) {
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function (response) {
              ids2 = response.data.ids;
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });

      let geoCylinder3 = new Cesium.GeoCylinder(200, 300, 300);
      geoCylinder3.geoPosition = new Cesium.Point3D(
        115.01249121214373,
        39.00298817909093,
        102
      );
      let datasetSpatialQuery3DPostParameter3 = {};
      datasetSpatialQuery3DPostParameter3.operateRegion = geoCylinder3;
      datasetSpatialQuery3DPostParameter3.positionMode = "INTERSECTSORCONTAINS";
      datasetSpatialQuery3DPostParameter3.sourceDatasetFilter = {
        attributeFilter: "",
      };
      let queryUrl3 =
        "http://www.supermapol.com/realspace/services/spatialAnalysis-data_all/restjsr/spatialanalyst/datasets/building_udb%40building/spatialquery3d.json";

      window.axios
        .post(queryUrl3, JSON.stringify(datasetSpatialQuery3DPostParameter3))
        .then(function (response) {
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function (response) {
              ids3 = response.data.ids;
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
      this.initF = true;
    },
    analysis() {
      window.setTimeout(() => {
        this.overlayBuildingBuffer(viewer, scene);
      }, 8000);
    },
    clear() {
        this.initF = false;
      this.GTCShow = false;
      viewer.entities.removeAll();
      let layerOriginal = scene.layers.find("original");
        layerOriginal.removeObjsColor(ids1);
        layerOriginal.removeObjsColor(ids2);
        layerOriginal.removeObjsColor(ids3);
      scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          115.00022575830863,
          39.009956534844858,
          500
        ),
        orientation: {
          heading: 1.705646,
          pitch: -0.499956,
          roll: 0.0,
        },
      });
    },
    //缓冲分析
    overlayBuildingBuffer(viewer, scene) {
        console.log(ids1,ids2,ids3)
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          114.99950507907676,
          38.999736445753065,
          769.1235709561395
        ),
        orientation: {
          heading: 0.828695,
          pitch: -0.461956,
          roll: 6.283185,
        },
      });
      window.setTimeout(function () {
        viewer.scene.scanEffect.mode = Cesium.ScanEffectMode.CIRCLE; //利用圆环扫描效果
        viewer.scene.scanEffect.centerPostion = Cesium.Cartesian3.fromDegrees(
          115.00885354350574,
          39.01094791248316,
          200.0
        );
        viewer.scene.scanEffect.speed = 250;
        let layerOriginal = scene.layers.find("original");
        //第二个缓冲区
        window.setTimeout(function () {
          let greenCircle = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              115.009302,
              39.006673,
              102.0
            ),
            name: "Green circle at height with outline",
            ellipse: {
              semiMinorAxis: 300.0,
              semiMajorAxis: 300.0,
              height: 102.0,
              material: Cesium.Color.DARKORANGE.withAlpha(0.8),
              outline: true,
            },
          });
        }, 2000);
         console.log(ids1,ids2,ids3)
        window.setTimeout(function () {
          layerOriginal.setObjsColor(ids1, Cesium.Color.PINK.withAlpha(1));
        }, 4000);
        //第三个缓冲区
        window.setTimeout(function () {
          let greenCircle = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              115.01135582381039,
              39.00765877493075,
              102
            ),
            name: "Green circle at height with outline",
            ellipse: {
              semiMinorAxis: 250.0,
              semiMajorAxis: 250.0,
              height: 102.0,
              material: Cesium.Color.DARKORANGE.withAlpha(0.8),
              outline: true,
            },
          });
        }, 6000);
        window.setTimeout(function () {
          layerOriginal.setObjsColor(ids2, Cesium.Color.PINK.withAlpha(1));
        }, 8000);
        //第四个缓冲区
        window.setTimeout(function () {
          let greenCircle = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              115.01249121214373,
              39.00298817909093,
              102
            ),
            name: "Green circle at height with outline",
            ellipse: {
              semiMinorAxis: 300.0,
              semiMajorAxis: 300.0,
              height: 102.0,
              material: Cesium.Color.DARKORANGE.withAlpha(0.8),
              outline: true,
            },
          });
        }, 10000);
        window.setTimeout(function () {
          layerOriginal.setObjsColor(ids3, Cesium.Color.PINK.withAlpha(1));
        }, 12000);
      }, 2000);

      window.setTimeout(() => {
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              115.009302,
              39.006673,
              160.0,
              115.009302,
              39.006673,
              250.0,
            ]),
            width: 1,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.YELLOW,
            }),
          },
        });
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              115.01135582381039,
              39.00765877493075,
              148,
              115.01135582381039,
              39.00765877493075,
              230,
            ]),
            width: 1,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.YELLOW,
            }),
          },
        });
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              115.01249121214373,
              39.00298817909093,
              145.102,
              115.01249121214373,
              39.00298817909093,
              145.172,
            ]),
            width: 1,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.YELLOW,
            }),
          },
        });
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(115.009302, 39.006673, 230.0),
          billboard: {
            image: "./images/诊所管理.png",
            show: true,
            pixelOffset: new Cesium.Cartesian2(0, -50),
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 2.0,
            color: Cesium.Color.YELLOW,
            alignedAxis: Cesium.Cartesian3.ZERO,
            width: 20,
            height: 20,
          },
        });
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            115.01135582381039,
            39.00765877493075,
            200
          ),
          billboard: {
            image: "./images/诊所管理.png",
            show: true,
            pixelOffset: new Cesium.Cartesian2(0, -50),
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 2.0,
            color: Cesium.Color.YELLOW,
            alignedAxis: Cesium.Cartesian3.ZERO,
            width: 20,
            height: 20,
          },
        });
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(
            115.01249121214373,
            39.00298817909093,
            145.162
          ),
          billboard: {
            image: "./images/诊所管理.png",
            show: true,
            pixelOffset: new Cesium.Cartesian2(0, -50),
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 2.0,
            color: Cesium.Color.YELLOW,
            alignedAxis: Cesium.Cartesian3.ZERO,
            width: 20,
            height: 20,
          },
        });
        window.setTimeout(() => {
          this.chart();
        }, 2000);
      }, 15000);
    },

    chart() {
      this.GTCShow = true;
      let dom1 = document.getElementById("graph");
      let myChart1 = window.echarts.init(dom1);
      let option = {
        backgroundColor: "rgba(38, 38, 38, 0.5)",
        title: {
          text: "小区诊所服务范围",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "辐射范围",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              {
                value: 335,
                name: "A诊所",
              },
              {
                value: 310,
                name: "B诊所",
              },
              {
                value: 274,
                name: "C诊所",
              },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              normal: {
                textStyle: {
                  color: "#C83732",
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: "#C83732",
                },
                smooth: 0.2,
                length: 10,
                length2: 20,
              },
            },
            itemStyle: {
              normal: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(1, 1, 0, 0)",
              },
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      myChart1.setOption(option);
    },
  },
  watch: {
    initflag(val) {
        console.log(val)
      this.init();
    },
  },

};
</script>

<style lang="scss" scoped>
@import "serviceAreaAnalysis";
</style>
