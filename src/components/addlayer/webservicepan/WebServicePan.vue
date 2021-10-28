<template>
  <div class="sm-function-module-content" v-show="webServiceShow">
    <div class="sm-function-module-sub-section">
      <select class="sm-select" v-model="selType">
        <option id="publicService" value="0">{{Resource.publicService}}</option>
        <option id="specialEffects" value="1">{{Resource.specialEffects}}</option>
        <option id="specialEffects" value="2">{{Resource.HotSpots}}</option>
      </select>
      <div class="imageContainer">
        <!-- 公共服务 -->
        <div
          class="imageBox"
          v-for=" item in data"
          :key="item.id"
          @click="addwebSever(item)"
          v-show="selType=='0'"
        >
          <img v-lazy="item.thumbnail" alt />
          <label for>{{item.sceneName}}</label>
        </div>
        <!-- 特效 -->
        <div
          class="imageBox"
          v-for=" item in Effects"
          :key="item.name"
          @click="addEffects(item.id)"
          v-show="selType=='1'"
        >
          <img :src="item.thumbnail" alt />
          <label for>{{item.description}}</label>
        </div>
        <!-- 热点 -->
        <div
          class="imageBox"
          v-for=" item in hotSpots"
          :key="item.id"
          @click="addHotSpots(item)"
          v-show="selType=='2'"
        >
          <img v-lazy="item.thumbnail" alt />
          <label for>{{item.sceneName}}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTerrainModels from "@/data/BaseTerrainData.js";
import otherTerrainAndImageModels from "@/data/otherTerrainAndImageData.js";
import Config from "@/common/js/webServeConfig.js";
export default {
  name: "addWebService",
  data() {
    return {
      sharedState: store.state,
      selType: "0",
      // showType: true, //默认显示公共服务，取反显示特效
      data: null,
      Effects: null,
      hotSpots: null,
      otherTerrainAndImageModels: otherTerrainAndImageModels,
      BaseTerrainModels: BaseTerrainModels
    };
  },
  computed: {
    webServiceShow: function() {
      return this.sharedState.addLayer[0];
    }
  },
  methods: {
    addS3M(LayerURL) {
      let promiseArray = [];
      promiseArray.push(viewer.scene.addS3MTilesLayerByScp(LayerURL));
      this.promiseWhen(promiseArray, true);
    },

    addTerrain(LayerURL) {
      viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: LayerURL,
        isSct: true //地形服务源自SuperMap iServer发布时需设置isSct为true
      });
    },

    addImage(LayerURL) {
      let layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: LayerURL
        })
      );
      viewer.flyTo(layer);
    },

    TiandituAnnotationProvider(url) {
      let wtfs = new Cesium.TiandituAnnotationProvider({
        viewer: viewer,
        url: url,
        metadata: {
          boundBox: {
            minX: -180,
            minY: -90,
            maxX: 180,
            maxY: 90
          },
          minLevel: 1,
          maxLevel: 20
        },

        aotuCollide: true, //是否开启避让
        collisionPadding: [0, 5, 3, 0], //开启避让时，标注碰撞增加内边距，上、右、下、左
        serverFirstStyle: true, //服务端样式优先
        labelGraphics: {
          //解决字体模糊的问题：1、先放大后缩小
          font: "28px sans-serif",
          bold: false,
          scale: 1,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          showBackground: false,
          backgroundColor: Cesium.Color.RED,
          backgroundPadding: new Cesium.Cartesian2(10, 10),
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          eyeOffset: Cesium.Cartesian3.ZERO,
          pixelOffset: new Cesium.Cartesian2(5, 5),
          disableDepthTestDistance: undefined
        },
        billboardGraphics: {
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          eyeOffset: Cesium.Cartesian3.ZERO,
          pixelOffset: Cesium.Cartesian2.ZERO,
          alignedAxis: Cesium.Cartesian3.ZERO,
          color: Cesium.Color.WHITE,
          rotation: 0,
          scale: 1,
          width: 18,
          height: 18,
          disableDepthTestDistance: undefined
        }
      });
    },

    thematicMapByField(url, sceneName) {
      let infos = [
        {
          url: url,
          cullEnabled: true
        }
      ];
      let promises = [];
      for (let i = 0; i < infos.length; i++) {
        let promise = scene.addS3MTilesLayerByScp(infos[i].url, {
          name: sceneName
        });
        promises.push(promise);
      }
      Cesium.when.all(promises, function(layers) {
        let layer = scene.layers.find(sceneName);
        viewer.flyTo(layer);
        layer.lodRangeScale = 5;
        layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
        let initialColor = "rgb(67,67,67)";
        layer.style3D.lineColor = Cesium.Color.fromCssColorString(initialColor);
        layer.wireFrameMode = Cesium.WireFrameType.Sketch; //草图模式,即线框
        layer._visibleDistanceMax = 60000;
      });
    },

    promiseWhen(promiseArray, sceneName) {
      Cesium.when.all(
        promiseArray,
        layer => {
          for (let i = 0; i < layer.length; i++) {
            layer[i]._visibleDistanceMax = 16000;
          }
          if (sceneName) {
            this.flyTo(sceneName);
          }
        },
        function(e) {
          if (widget._showRenderLoopErrors) {
            let title = Resource.scpUrlErrorMsg;
            widget.showErrorPanel(title, undefined, e);
          }
        }
      );
    },

    // 加载公共服务
    addwebSever(obj) {
      if (obj) {
        switch (obj.type) {
          case "REALSPACE": //场景
            if (obj.state == 1) {
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              let s = viewer.scene.open(obj.proxiedUrl);
              this.promiseWhen([s], obj.sceneName);
              if (obj.S3MLayer == false) {
                for (let key in this.otherTerrainAndImageModels) {
                  if (Number(key) == obj.id) {
                    this.otherTerrainAndImageModels[
                      key
                    ].terrain.chooseType = true;
                    this.otherTerrainAndImageModels[
                      key
                    ].imagery.chooseType = true;
                  }
                }
                for (let tt in this.BaseTerrainModels) {
                  this.BaseTerrainModels[tt].chooseType = false;
                }
              }
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
                store.setImgLayerManage(viewer.imageryLayers._layers.length);
                store.setTerrainLayerManage(viewer.terrainProvider);
              }, 1500);
            }
            break;
          case "SCP": //scp
            if (obj.state == 1) {
              this.flyTo(obj.sceneName);
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              let promiseArray = [];
              promiseArray.push(
                viewer.scene.addS3MTilesLayerByScp(obj.proxiedUrl, {
                  name: obj.sceneName
                })
              );
              this.promiseWhen(promiseArray, obj.sceneName);
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
              }, 1500);
            }
            break;
          case "IMG": //影像
            if (obj.state == 1) {
              this.flyTo(obj.sceneName);
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              this.addImage(obj.proxiedUrl);
              setTimeout(() => {
                //更新图层
                store.setImgLayerManage(viewer.imageryLayers._layers.length);
              }, 1000);
            }
            obj.state = 1;
            break;
          case "TERRAIN": //地形
            if (obj.state == 1) {
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              this.addTerrain(obj.proxiedUrl);
              obj.state = 1;
              setTimeout(() => {
                store.setTerrainLayerManage(viewer.terrainProvider);
              }, 1000);
            }
            break;
          case "TESTMARK": //文字注记
            if (obj.state == 1) {
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              this.TiandituAnnotationProvider(obj.proxiedUrl);
              viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(
                  117.29453125,
                  34.2315625,
                  60000
                ),
                orientation: {
                  heading: Cesium.Math.toRadians(0.0), //默认值
                  pitch: Cesium.Math.toRadians(-90.0), //默认值
                  roll: 0.0 //默认值
                }
              });
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
              }, 1500);
            }
            break;
          case "ThematicMap": //字段专题图
            if (obj.state == 1) {
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              this.thematicMapByField(obj.proxiedUrl, obj.sceneName);
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
              }, 1500);
            }
            break;
          case "HOT": //疫情热点
            if (obj.state == 1) {
              this.flyTo(obj.sceneName);
              this.$Message.warning({
                background: true,
                content: Resource.layerExistMsg
              });
            } else {
              let promiseArray = [];
              let proxiedUrl = obj.proxiedUrl;
              let proxiedUrlName = obj.name;
              for (let i = 0; i < proxiedUrl.length; i++) {
                let promise = viewer.scene.addS3MTilesLayerByScp(
                  proxiedUrl[i],
                  {
                    name: proxiedUrlName[i]
                  }
                );
                promiseArray.push(promise);
              }
              this.promiseWhen(promiseArray, obj.sceneName);
              obj.state = 1;
              setTimeout(() => {
                //更新图层
                store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
              }, 1500);
            }
            break;
          default:
            null;
            break;
        }
      }
      store.setToolBarAction(1);
    },

    //添加特效
    addEffects(id) {
      store.setSpecialEffects(id, 1); //打开特效
      store.setToolBarAction(1); //关闭面板
    },

    // 添加热点
    addHotSpots(obj) {
      this.addwebSever(obj);
      setTimeout(() => {
        store.setHotSpots(obj.id, 1);
      }, 1500);
    },

    flyTo(scpName) {
      let Name;
      let webName = Config.TitleKeyMap[scpName];
      if (webName) {
        Name = webName;
      } else {
        Name = scpName;
      }
      let cameraParam = Config.CAMERA_PARAM[webName];
      if (cameraParam) {
        viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3(
            cameraParam.Cartesian3.x,
            cameraParam.Cartesian3.y,
            cameraParam.Cartesian3.z
          ),
          orientation: {
            heading: cameraParam.heading,
            pitch: cameraParam.pitch,
            roll: cameraParam.roll
          },
          duration: 5
        });
        return;
      } else {
        let layer = scene.layers.find(scpName);
        if (layer) {
          viewer.flyTo(layer);
          // var ceterCartesianPosition = layer._position;
          // var boundingSphere = new Cesium.BoundingSphere(
          //   ceterCartesianPosition,
          //   200
          // );
          // var camera = viewer.scene.camera;
          // camera.flyToBoundingSphere(boundingSphere);
        }
      }
    }
  },

  mounted() {
    this.data = iEarth_resource_services.content; //获取公共服务json数据
  },

  watch: {
    selType: function(val) {
      switch (val) {
        case "0":
          break;
        case "1":
          this.Effects = specialEffects.effects;
          break;
        case "2":
          this.hotSpots = hotSpots.hotSpots;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./WebServicePan.scss";
</style>
