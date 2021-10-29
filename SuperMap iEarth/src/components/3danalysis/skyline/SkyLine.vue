<template>
  <div v-show="skylineComb">
    <div class="sm-function-module-content">
      <div class="sm-point media-hidden"></div>
      <label class="sm-function-module-SkyLine media-hidden">{{
        Resource.ObserverInformation
      }}</label>
      <div class="sm-function-module-sub-section">
        <div>
          <div class="SkyLine-half">
            <label class="sm-function-module-SkyLine">{{
              Resource.longitude
            }}</label>
            <input class="sm-input-right"
                   type="text"
                   v-model="viewlongitude"
                   style="width:130px;float:left;"
            />
          </div>
          <div class="SkyLine-half">
            <label
              class="sm-function-module-SkyLine"
              >{{ Resource.latitude }}</label
            >
            <input class="sm-input-right"
                   type="text"
                   v-model="viewlatitude"
                   style="width:130px;float:left;"
            />
          </div>
        </div>
        <div>
          <div class="SkyLine-half">
            <label class="sm-function-module-SkyLine">{{
              Resource.altitude
            }}</label>
            <input class="sm-input-right"
                   type="text"
                   v-model="viewheight"
                   style="width:130px;float:left;"
            />
          </div>
        </div>
      </div>

      <div class="sm-function-module-sub-section">
        <div class="SkyLine-half">
          <label class="sm-function-module-SkyLine">{{
            Resource.directionAngle
          }}</label>
          <input
            class="sm-input sm-input-long"
            max="360"
            min="0"
            step="1.0"
            style="width:130px;float:left;"
            type="number"
            v-model="direction"
          />
        </div>
        <div class="SkyLine-half">
          <label
            class="sm-function-module-SkyLine"
            >{{ Resource.ElevationAngle }}</label
          >
          <input
            class="sm-input sm-input-long"
            max="90"
            min="-90"
            step="1.0"
            style="width:130px;float:left;"
            type="number"
            v-model="pitch"
          />
        </div>
        <div class="SkyLine-half">
          <label class="sm-function-module-SkyLine">{{
            Resource.skylineRadius
          }}</label>
          <input
            class="sm-input sm-input-long"
            step="100"
            style="width:130px;float:left;"
            type="number"
            v-model="skylineRadius"
          />
        </div>

        <div class="SkyLine-half">
          <label
            class="sm-function-module-SkyLine"
            >{{ Resource.skylineWidth }}</label
          >
          <input
            class="sm-input sm-input-long"
            max="20"
            min="1.0"
            step="1.0"
            style="width:130px;float:left;"
            type="number"
            v-model="lineWidth"
          />
        </div>
      </div>
      <div class="sm-point media-hidden"></div>
      <label class="sm-function-module-sub-section-caption media-hidden">{{
        Resource.parameterSetting
      }}</label>
      <div class="sm-function-module-sub-section">
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.displayMode
          }}</label>
          <select class="sm-select" v-model="skylineMode">
            <option selected value="0">{{ Resource.polyline }}</option>
            <option value="1">{{ Resource.polygon }}</option>
            <!-- <option value="2">+ Resource.skylinesectorbody +</option> // 需要iServer910支持 -->
          </select>
        </div>

        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.skylineColor
          }}</label>
          <ColorPicker alpha class="sm-colorpicker" v-model="skylineColor" />
        </div>
        <div>
          <label class="sm-function-module-sub-section-caption">{{
            Resource.highlightBarrierColor
          }}</label>
          <ColorPicker
            alpha
            class="sm-colorpicker"
            v-model="highlightBarrierColor"
          />
        </div>

        <div>
          <input checked type="checkbox" v-model="highlightBarrier" />
          <label class="sm-function-module-sub-section-caption">{{
            Resource.highlightBarrier
          }}</label>
        </div>
        <div>
          <input checked type="checkbox" v-model="getSkyline2D" />
          <label class="sm-function-module-sub-section-caption">{{
            Resource.graphDisplay
          }}</label>
        </div>

        <div v-show="getSkyline2D">
          <label class="sm-function-module-sub-section-caption">{{
            Resource.TwoDimensionalSkyline
          }}</label>
          <div id="map"></div>
        </div>
      </div>

      <div class="boxchild">
        <button class="tbtn tbn1" type="button" v-on:click="analysis">
          {{ Resource.analyze }}
        </button>
        <button @click="clear" class="tbtn" type="button">
          {{ Resource.clear }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
var skyline;
let myChart, s3mInstance;

export default {
  name: "Sm3dSkyline",
  props: {
    spatialAnalysisUrl: {
      type: String,
    },
  },
  data() {
    return {
      sharedState: store.state,
      clickFlag: 0,
      hasSkyLineAnalysisResult: false,
      viewPosition: [],
      flag: false,

      viewlongitude: 0,
      viewlatitude: 0,
      viewheight: 0,
      direction: 0.0,
      pitch: 0.0,
      skylineRadius: 10000,
      lineWidth: 1,
      skylineColor: "rgb(200, 0, 0)",
      highlightBarrierColor: "rgba(255, 186, 1, 1)",
      skylineMode: 0,
      highlightBarrier: false,
      getSkyline2D: false,
      isDestroyFlag: true,
    };
  },
  computed: {
    skylineComb: function () {
      return this.sharedState.analysis[4];
    },
    analysisShow: function () {
      return this.sharedState.toolBar[6];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && myChart) {
      if (skyline) {
        skyline.destroy();
      }
      if (s3mInstance) {
        s3mInstance.destroy();
      }
      skyline = undefined;
      myChart = undefined;
      s3mInstance = undefined;
    }
  },
  mounted() {
    if (this.analysisShow && this.skylineComb) {
      this.init();
    }
  },
  methods: {
    init() {
      if (myChart) {
        return;
      }
      let d = document.getElementById("map");
      if (d) {
        myChart = window.echarts.init(d);
      }
    },
    analysis() {
      this.clear(); // 清除上一次分析结果
      this.flag = true;
      this.isDestroyFlag = false; //保留效果
      if (!skyline) {
        skyline = new Cesium.Skyline(scene);
      }

      let cartographic = scene.camera.positionCartographic;
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height;
      // 天际线分析的视口位置设置成当前相机位置
      skyline.viewPosition = [longitude, latitude, height];

      this.viewlongitude = longitude.toFixed(6);
      this.viewlatitude = latitude.toFixed(6);
      this.viewheight = height.toFixed(6);

      //设置俯仰和方向
      skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
      skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);

      this.pitch = skyline.pitch;
      this.viewlatitude = skyline.direction;
      this.direction = skyline.direction;
      skyline.radius = this.skylineRadius;
      skyline.lineWidth = Number(this.lineWidth);
      let color = Cesium.Color.fromCssColorString(this.skylineColor);
      skyline.color = color;
      skyline.displayStyle = this.skylineMode;
      skyline.build();
      // console.log(skyline.lineWidth,this.lineWidth)

      this.hasSkyLineAnalysisResult = true; // 表示有了分析结果，可以提取二维天际线和高亮障碍物
    },
    clear() {
      this.flag = false;
      viewer.entities.removeAll();
      scene.primitives._primitives = [];
      if (skyline) {
        skyline.clear();
      }

      for (var i = 0; i < scene.layers._layerQueue.length; i++) {
        var layer = scene.layers.findByIndex(i);
        layer.removeAllObjsColor();
      }


      this.hasSkyLineAnalysisResult = false;

      this.viewlongitude = 0;
      this.viewlatitude = 0;
      this.viewheight = 0;
      this.direction = 0.0;
      this.pitch = 0.0;

      this.skylineColor = "rgb(200, 0, 0)";
      this.highlightBarrierColor = "rgba(255, 186, 1, 1)";
      this.highlightBarrier = false;
      this.getSkyline2D = false;
      this.isDestroyFlag = true; //摧毁标志，释放内存
      //初始化参数
    }
  },
  watch: {
    //初始化echarts，切换时需要能获取节点
    skylineComb: function (val) {
      if (val) {
        setTimeout(() => {
          this.init();
        }, 100);
      }
    },
    analysisShow(val) {
      if (val && this.skylineComb) {
        this.init();
      }
    },
    direction: function (newValue) {
      if (this.flag) {
        skyline.direction = parseFloat(newValue);
      }
    },
    pitch: function (newValue) {
      if (this.flag) {
        skyline.pitch = parseFloat(newValue);
      }
    },
    skylineRadius: function (newValue) {
      if (this.flag) {
        skyline.radius = parseFloat(newValue);
      }
    },
    lineWidth: function (newValue) {
      if (this.flag) {
        skyline.lineWidth = parseFloat(newValue);
      }
    },
    skylineColor: function (newValue) {
      if (this.flag) {
        let color = Cesium.Color.fromCssColorString(newValue);
        if (skyline) {
          skyline.color = color;
        }
      }
    },
    highlightBarrierColor: function (newValue) {
      this.highlightBarrierColor = newValue;
    },
    highlightBarrier: function (newValue) {
      // let skyline = this.skyline;
      if (newValue && skyline && this.hasSkyLineAnalysisResult) {
        let BarrierColor = Cesium.Color.fromCssColorString(
          this.highlightBarrierColor
        );
        let ObjectIds = skyline.getObjectIds();
        for (let index in ObjectIds) {
          let layer = scene.layers.findByIndex(Number(index) - 3); // 底层索引从3开始
          let ids = skyline.getObjectIds()[index];
          layer.setObjsColor(ids, BarrierColor);
        }
      }
    },
    skylineMode: function (newValue) {
      this.skylineMode = Number(newValue);
      if (!skyline) {
        return;
      }
      let value = newValue;
      let that = this;
      if (value == "0") {
        skyline.displayStyle = 0;
        scene.primitives._primitives = [];
      } else if (value == "1") {
        skyline.displayStyle = 1;
        scene.primitives._primitives = [];
      } else if (value == "2") {
        // 需要iServer910支持，暂时界面上注释
        skyline.displayStyle = 0;
        if (!s3mInstance) {
          s3mInstance = new Cesium.S3MInstanceCollection(scene._context);
          scene.primitives.add(s3mInstance);
        }
        let param = skyline.getSkylineSectorParameter();
        let geometrySkylineSectorBodyPostParameter = {};
        geometrySkylineSectorBodyPostParameter.viewerPoint = param.viewPos;
        geometrySkylineSectorBodyPostParameter.line3D = param.geoLine3D;
        geometrySkylineSectorBodyPostParameter.height = 0;
        geometrySkylineSectorBodyPostParameter.lonlat = true;
        let url = this.$props.spatialAnalysisUrl;

        let queryData = JSON.stringify(geometrySkylineSectorBodyPostParameter);

        window.axios
          .post(url, queryData)
          .then(function (response) {
            //再发送一次GET请求  获取到运算结果
            window.axios
              .get(response.data.newResourceLocation + ".json")
              .then(function (response) {
                let data = response.data;

                if (data.geometry === null) {
                  return;
                }
                let uint8Array = new Uint8Array(data.geometry.model);
                let buffer = uint8Array.buffer;
                s3mInstance.add(
                  "result",
                  {
                    position: Cesium.Cartesian3.fromDegrees(
                      data.geometry.position.x,
                      data.geometry.position.y,
                      data.geometry.position.z
                    ),
                    hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
                    color: new Cesium.Color(0, 160 / 255, 233 / 255, 0.5),
                  },
                  buffer
                );
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    getSkyline2D: function (newValue) {
      if (!newValue || !this.hasSkyLineAnalysisResult) {
        return; // 没有分析结果，无法提取天际线轮廓
      }
      let object = skyline.getSkyline2D();
      if (true) {
        let option = {
          backgroundColor: "rgba(73,139,156,0.0)",
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: object.x,
              show: false,
            },
          ],
          yAxis: [
            {
              type: "value",
              min: 0,
              max: 1,
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
              },
            },
          ],
          series: [
            {
              name: "",
              type: "line",
              data: object.y,
            },
          ],
        };
        myChart.setOption(option);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "SkyLine";

#map {
  width: 380px;
  height: 170px;
  margin-top: -45px;
  margin-bottom: -25px;
}
#map2 {
  width: 380px;
  height: 170px;
  margin-top: -45px;
  margin-bottom: -25px;
}
</style>
