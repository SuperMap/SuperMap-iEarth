<template>
  <div v-show="backLineShow">
    <div class="sm-function-module-content">
      <div class="boxchild">
        <button class="tbtn tbn1" type="button" v-on:click="analysis">分析</button>
        <button @click="clear" class="tbtn" type="button">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
  let ids;
export default {
  name: "Sm3dBackLineAnalysis",
  props: {
    spatialAnalysisUrl: {
      type: String,
    },
    queryUrl: {
      type: String,
    },
  },
  data() {
    return {
      sharedState: store.state,
      isDestroyFlag: true,
      dsMode: 1,
      backlineComb: false,
      ids: null,
    };
  },
  computed: {
    backLineShow: function () {
      return this.sharedState.cityPlan[0];
    },
    cityPlanShow: function () {
      return this.sharedState.toolBar[9];
    },
    initflag() {
      return this.sharedState.S3MLayerManage;
    },
  },
  beforeDestroy() {},
  methods: {
    init() {
        let original = viewer.scene.layers.find("original");
    },
    analysis() {
      let that = this;
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00569784240564,
          39.010694131402644,
          234.8315778961851
        ),
        orientation: {
          heading: 2.205646,
          pitch: -0.399956,
          roll: 0.0,
        },
      });
      scene.layers.find("original").setObjsVisible([47], false);
      setTimeout(function () {
        window.polyLine = viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              115.00787890205515,
              39.00950957365,
              100.1,
              115.00780513629414,
              39.00939287572396,
              100.1,
              115.00845873860158,
              39.007961490024464,
              100.1,
            ]),
            width: 6.0,
            material: Cesium.Color.RED,
          },
        });
        let pTime = 0;
        let pTimeId = setInterval(function () {
          if (pTime == 5) {
            clearInterval(pTimeId);
            that.backLine();
          }
          polyLine.show = !polyLine.show;
          pTime++;
        }, 500);
      }, 5000);
    },
    backLine() {
      let that = this;
      setInterval(function () {
        polyLine.show = true;
      }, 500);
      let geometryBuffer3DPostParameter = {};
      geometryBuffer3DPostParameter.geometry = {
        type: "LINE3D",
        parts: [3],
        points: [
          {
            x: 115.00787890205515,
            y: 39.00950957365,
            z: 100.1,
          },
          {
            x: 115.00780513629414,
            y: 39.00939287572396,
            z: 100.1,
          },
          {
            x: 115.00845873860158,
            y: 39.007961490024464,
            z: 100.1,
          },
        ],
      };
      geometryBuffer3DPostParameter.distance = 3;
      geometryBuffer3DPostParameter.lonlat = true;
      geometryBuffer3DPostParameter.resultType = "REGION";
      geometryBuffer3DPostParameter.joinType = "ROUND";

      let url = this.$props.spatialAnalysisUrl;

      window.axios
        .post(url, geometryBuffer3DPostParameter)
        .then(function (response) {
          //再发送一次GET请求  获取到运算结果
          window.axios
            .get(response.data.newResourceLocation + ".json")
            .then(function (response) {
              let data = response.data;

              let point3Ds = new Cesium.Point3Ds();
              let points = new Array();
              for (let i = 0, j = data.geometry.points.length;i<j; i++) {
                points.push(data.geometry.points[i].x);
                points.push(data.geometry.points[i].y);
                points.push(data.geometry.points[i].z);
              }
              let orangePolygon1 = viewer.entities.add({
                name: "Orange polygon with per-position heights and outline",
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(points),
                  extrudedHeight: 157.4,
                  perPositionHeight: true,
                  material: Cesium.Color.ORANGE.withAlpha(0.3),
                  outline: true,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 10.0,
                },
              });
              let datasetSpatialQuery3DPostParameter = {};
              datasetSpatialQuery3DPostParameter.operateRegion = {
                type: "REGION",
                points: data.geometry.points,
              };
              datasetSpatialQuery3DPostParameter.positionMode =
                "INTERSECTSORCONTAINS";
              datasetSpatialQuery3DPostParameter.extendedHeight = 165;
              datasetSpatialQuery3DPostParameter.sourceDatasetFilter = {
                attributeFilter: "",
              };

              let queryUrl = that.$props.queryUrl;

              window.axios
                .post(queryUrl, datasetSpatialQuery3DPostParameter)
                .then(function (response) {
                  //再发送一次GET请求  获取到运算结果
                  window.axios
                    .get(response.data.newResourceLocation + ".json")
                    .then(function (response) {
                      let data = response.data;
                       ids = data.ids;
                      let layer = scene.layers.find("日照墙");
                      let color = new Cesium.Color(160 / 255, 0, 0, 1);
                      layer.setObjsColor(ids, color);
                      let cartesian = Cesium.Cartesian3.fromDegrees(
                        115.00781874492442,
                        39.009393932590584,
                        132.314
                      );
                      let pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                        viewer.scene,
                        cartesian
                      );
                      window.tooltip.showAt(pick, "退线不足3米");
                      window.setTimeout(function () {
                        window.tooltip.setVisible(false);
                      }, 4000);
                      let orangePolygon1 = viewer.entities.add({
                        name:
                          "Orange polygon with per-position heights and outline",
                        polygon: {
                          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
                            115.00781835183739,
                            39.009393557694274,
                            157.7,
                            115.00786836423599,
                            39.009299692575006,
                            157.7,
                            115.00790442533352,
                            39.00931098890217,
                            157.7,
                            115.00785030819625,
                            39.00940394849713,
                            157.7,
                          ]),
                          extrudedHeight: 0,
                          perPositionHeight: true,
                          material: Cesium.Color.ORANGE.withAlpha(0.0),
                          outline: true,
                          outlineColor: Cesium.Color.BLACK,
                          outlineWidth: 5.0,
                        },
                      });
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                })
                .catch(function (error) {
                  console.log(error);
                });
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clear() {
      let layer = scene.layers.find("日照墙");
      viewer.entities.removeAll();
      if (ids) {
        layer.removeObjsColor(ids);
        ids = null;
      }
      scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(
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
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
@import "backLineAnalysis";
</style>
