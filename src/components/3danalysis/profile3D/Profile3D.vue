<template>
  <div v-show="profile3dComb">
    <div class="sm-function-module-content">
      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">
        {{
        Resource.startingInformation
        }}
      </label>
      <div class="sm-function-module-sub-section">
        <div>
          <div class="Profile3D-half">
            <label class="sm-function-module-Profile3D">
              {{
              Resource.longitude
              }}
            </label>
            <input
              v-model="startlongitude"
              type="text"
              class="sm-input-right"
              style="width:130px;float:left;"
            />
          </div>
          <div class="Profile3D-half">
            <label class="sm-function-module-Profile3D label-right">
              {{
              Resource.latitude
              }}
            </label>
            <input
              v-model="startlatitude"
              type="text"
              class="sm-input-right"
              style="width:130px;float:left;"
            />
          </div>
        </div>
        <div>
          <div class="Profile3D-half">
            <label class="sm-function-module-Profile3D">
              {{
              Resource.altitude
              }}
            </label>
            <input
              v-model="startheight"
              type="text"
              class="sm-input-right"
              style="width:130px;float:left;"
            />
          </div>
        </div>
      </div>

      <div class="sm-point"></div>
      <label class="sm-function-module-sub-section-setting">
        {{
        Resource.endInformation
        }}
      </label>
      <div class="sm-function-module-sub-section">
        <div>
          <div class="Profile3D-half">
            <label class="sm-function-module-Profile3D">
              {{
              Resource.longitude
              }}
            </label>
            <input
              v-model="endlongitude"
              type="text"
              class="sm-input-right"
              style="width:130px;float:left;"
            />
          </div>
          <div class="Profile3D-half">
            <label class="sm-function-module-Profile3D label-right">
              {{
              Resource.latitude
              }}
            </label>
            <input
              v-model="endlatitude"
              type="text"
              class="sm-input-right"
              style="width:130px;float:left;"
            />
          </div>
        </div>
        <div>
          <div class="Profile3D-half">
            <label class="sm-function-module-Profile3D">
              {{
              Resource.altitude
              }}
            </label>
            <input
              v-model="endheight"
              type="text"
              class="sm-input-right"
              style="width:130px;float:left;"
            />
          </div>
        </div>
      </div>

      <div>
        <input type="checkbox" checked v-model="profileLine" />
        <label class="function-module-sub-section-caption">
          {{
          Resource.profileInformation
          }}
        </label>
      </div>
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">{{ Resource.analyze }}</button>
        <button type="button" class="tbtn" @click="clear">{{ Resource.eliminate }}</button>
      </div>
    </div>
  </div>
</template>

<script>
let myChart, count, Entypositions; //插值点个数及当前图标位置
let LatAndLons = [],
  // EditPositions = null, //所有点的经纬度，笛卡尔坐标及编辑时保存之前的位置
  Cartesians = [];

export default {
  name: "Sm3dProfile",
  props: {},
  data() {
    return {
      sharedState: store.state,
      startlongitude: 0,
      startlatitude: 0,
      startheight: 0,
      endlongitude: 0,
      endlatitude: 0,
      endheight: 0,
      profileLine: false,
      EditPositions: [],
      // profile2d:false,  //显示剖面分析结果
      polylineColor: "rgb(250,213,6)", //贴线颜色
      polylineWidth: 5, //贴线宽度
      initEchartsOption: null, //初始化自定义echarts配置对象
      updateEchartsOption: null //自定义更新echarts配置对象
    };
  },

  computed: {
    profile3dComb: function() {
      return this.sharedState.analysis[3];
    },
    analysisShow: function() {
      return this.sharedState.toolBar[6];
    }
  },

  beforeDestroy() {
    this.clear();
    myChart.clear();
    LatAndLons.length = 0; //清空之前的点数据;
    Cartesians.length = 0; //清空之前的点数据;
  },
  mounted() {
    if (this.analysisShow && this.profile3dComb) {
      this.init();
    }
  },

  methods: {
    init() {
      this.profileLine = false;
      this.initMyChart();
    },
    initMyChart() {
      if (window.echarts) {
        if (!myChart) {
          myChart = window.echarts.init(
            document.getElementById("profile3D_echarts")
          ); //初始化echarts
          window.onresize = function() {
            myChart.resize(); //自适应屏幕
          };
        }
      }
      if (this.initEchartsOption) {
        myChart.setOption(this.initEchartsOption);
        return;
      }
      myChart.setOption({
        title: {
          text: "剖面分析",
          textStyle: {
            fontSize: 14
          }
        },
        grid: {
          left: 30,
          right: 0,
          top: 30,
          bottom: 8
        },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {
          data: []
        },
        series: [
          {
            type: "bar",
            data: []
          }
        ]
      });
    },
    analysis() {
      let that = this;
      if (!window.handlerPolyline) {
        common.initHandler("Polyline");
      }
      common.handlerDrawing("Polyline").then(
        res => {
          myChart.showLoading();
          that.EditPositions = res.result.object.positions;
          //起止点相关信息
          var scartographic = Cesium.Cartographic.fromCartesian(
            res.result.object._positions[0]
          );
          var slongitude = Cesium.Math.toDegrees(scartographic.longitude);
          var slatitude = Cesium.Math.toDegrees(scartographic.latitude);
          var sheight = scartographic.height;

          var ecartographic = Cesium.Cartographic.fromCartesian(
            res.result.object._positions[1]
          );
          var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
          var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
          var eheight = ecartographic.height;

          that.startlongitude = slongitude.toFixed(6);
          that.startlatitude = slatitude.toFixed(6);
          that.startheight = sheight.toFixed(6);

          that.endlongitude = elongitude.toFixed(6);
          that.endlatitude = elatitude.toFixed(6);
          that.endheight = eheight.toFixed(6);

          that.DrawPolylineUpdate(res.positions);
          let handlerPolyline = window.handlerPolyline;
          handlerPolyline.polyline.show = false;
          window.polylineTransparent.show = false;
          handlerPolyline.deactivate();
          that.updataProfile3D(res.positions); //更新剖面
          common.Edit(that, that.updataProfile3D, "Polyline"); //编辑功能

          that.profileLine = true; //打开echarts
        },
        err => {
          console.log(err);
        }
      );
      window.handlerPolyline.activate();
    },
    DrawPolylineUpdate(position) {
      viewer.entities.removeById("polyline-profile");
      viewer.entities.removeById("location4");

      let fullLineColor = Cesium.Color.fromCssColorString(this.polylineColor);
      viewer.entities.add({
        id: "polyline-profile",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
          width: this.polylineWidth,
          material: fullLineColor,
          clampToGround: true
        }
      });
      this.entityUpdate();
    },
    //此处传入的值，做了归一化处理
    updataProfile3D(linePositions) {
      //更新剖面分析二维图
      let that = this;
      this.profileLine = true; //打开echarts
      // this.profile2d = true; //打开echarts
      myChart.clear();
      myChart.showLoading();
      //position参数不起作用,是为了edit函数不冲突
      LatAndLons.length = 0; //清空之前的点数据
      Cartesians.length = 0; //清空之前的点数据
      let positions = [];

      //插值线段点，取出高程值
      for (let i = 1, j = linePositions.length / 3; i < j; i++) {
        let startPoint = Cesium.Cartesian3.fromDegrees(
          linePositions[(i - 1) * 3],
          linePositions[(i - 1) * 3 + 1],
          linePositions[(i - 1) * 3 + 2]
        );

        let endPoint = Cesium.Cartesian3.fromDegrees(
          linePositions[i * 3],
          linePositions[i * 3 + 1],
          linePositions[i * 3 + 2]
        );
        let d = Cesium.Cartesian3.distance(startPoint, endPoint);
        this.getCount(parseInt(d));
        for (let i = 1, j = count; i < j; i++) {
          let cart = Cesium.Cartesian3.lerp(
            startPoint,
            endPoint,
            i / count,
            new Cesium.Cartesian3()
          );
          positions.push(cart);
        }
      }

      viewer.scene
        .clampToHeightMostDetailed(positions)
        .then(function(clampedCartesians) {
          Cartesians = clampedCartesians; //记录所有点的笛卡尔坐标;
          LatAndLons = that.cartesianToDegreesObjs(Cartesians); //记录所有点的经纬度
          that.echartsOption(); //更新echarts
        });
    },
    echartsOption() {
      myChart.hideLoading();
      myChart.clear();
      if (this.updateEchartsOption) {
        myChart.setOption(this.updateEchartsOption);
        return;
      }
      let option = {
        title: {
          text: "剖面信息",
          textStyle: {
            fontSize: 14,
            color: "#ffffff"
          }
        },
        grid: {
          left: 50,
          right: 8,
          top: 40,
          bottom: 20
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "#ffffff",
          textStyle: {
            color: "#000"
          },
          formatter: param => {
            let dataIndex = param[0].dataIndex;
            Entypositions = Cartesians[dataIndex];
            return [
              "当前位置:" + '<hr size=1 style="margin:3px 0">',
              "经度:" + LatAndLons[dataIndex].longitude.toFixed(6) + "<br />",
              "纬度" + LatAndLons[dataIndex].latitude.toFixed(6) + "<br />",
              "海拔" + LatAndLons[dataIndex].height.toFixed(2) + "米" + "<br />"
            ].join("");
          }
        },
        xAxis: {
          data: LatAndLons.map(function(item, index) {
            return index;
          }),
          show: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ffffff"
            }
          }
        },
        yAxis: {
          min: function(value) {
            return value.min < 20 ? 0 : Math.floor(value.min);
          },
          axisLabel: {
            interval: "auto",
            formatter: function(value, index) {
              return value > 999
                ? (value / 1000).toFixed(2) + "km"
                : value + "m";
            }
          },
          splitLine: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ffffff"
            }
          }
        },
        toolbox: {
          show: true,
          left: "right",
          feature: {
            restore: {
              icon: "image://static/images/flypng/restore.png"
            },
            saveAsImage: {
              icon: "image://static/images/flypng/download.png"
            }
          }
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "filter",
            start: 0,
            end: 100
          }
        ],
        series: {
          name: "height",
          type: "line",
          data: LatAndLons.map(function(item) {
            return item.height;
          }),
          areaStyle: {}
        }
      };
      myChart.setOption(option);
    },
    //更新交互图标
    entityUpdate() {
      if (viewer.entities.getById("location4")) {
        return;
      }
      viewer.entities.add({
        id: "location4",
        position: new Cesium.CallbackProperty(() => {
          return Entypositions;
        }, false),
        billboard: {
          image: "static/images/flypng/coordinate.png",
          width: 32,
          height: 32,
          scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 2000, 0.6),
          eyeOffset: new Cesium.Cartesian3(0, 1, -5)
        }
      });
    },
    cartesianToDegreesObjs(cartesians) {
      let array = [].concat(cartesians);
      let positions = [];
      for (let i = 0, len = array.length; i < len; i++) {
        if (array[i] !== undefined) {
          let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
          let obj = {
            longitude: Cesium.Math.toDegrees(cartographic.longitude),
            latitude: Cesium.Math.toDegrees(cartographic.latitude),
            height: cartographic.height
          };
          positions.push(obj);
        }
      }
      return positions;
    },
    //精度计算count插值
    getCount(distance) {
      if (distance / 10000 > 1) {
        count = parseInt(distance / 100); //(>10000) 100m
      } else if (distance / 1000 > 5) {
        count = parseInt(distance / 10); //(5000-10000)  10m
      } else if (distance / 1000 > 2) {
        count = parseInt(distance / 5); //(2000-5000)  5m
      } else if (distance / 1000 > 1) {
        count = parseInt(distance / 2); //(1000-2000)  2m
      } else if (distance / 100 > 5) {
        count = parseInt(distance / 1.5); //(500-1000) 1.5m
      } else if (distance / 100 > 2) {
        count = distance; //(200-500) 1m
      } else {
        count = distance * 2; //(<200) 0.5m
      }
    },
    clear() {
      this.startlongitude = 0;
      this.startlatitude = 0;
      this.startheight = 0;
      this.endlongitude = 0;
      this.endlatitude = 0;
      this.endheight = 0;

      // this.profile2d = false;
      this.profileLine = false;
      viewer.entities.removeById("location4");
      viewer.entities.removeById("polyline-profile");
      myChart.clear();

      LatAndLons.length = 0; //清空之前的点数据
      Cartesians.length = 0; //清空之前的点数据

      common.clearEditHandler();
      common.clearHandlerDrawing();

      this.initMyChart();
    }
  },
  watch: {
    profileLine: function(newValue) {
      this.sharedState.isInitEcharts = newValue;
    },
    analysisShow(val) {
      if (val && this.profile3dComb) {
        this.init();
      }
    },
    profile3dComb(val) {
      if (val) {
        setTimeout(() => {
          this.init();
        }, 100);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "Profile3D";
</style>
