<template>
  <div v-show="limitHeightShow">
    <div class="sm-function-module-content">
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
        <button type="button" class="tbtn" @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
let arr, timer, entity;
export default {
  name: "Sm3dLimitHeightAnalysis",
  props: {},
  data() {
    return {
      sharedState: store.state,
      isDestroyFlag: true,
      dsMode: 1
    };
  },
  computed: {
    limitHeightShow: function () {
      return this.sharedState.cityPlan[2];
    },
    cityPlanShow: function () {
      return this.sharedState.toolBar[9];
    },
    initflag() {
      return this.sharedState.S3MLayerManage;
    },
  },
  mounted() {
    if (this.cityPlanShow && this.limitHeightShow) {
      this.init();
    }
  },
  methods: {
    init() {
      let i = 0;
      arr = [];
      while (i < 20000) {
        arr.push(i);
        i++;
      }
    },
    analysis() {
      if (entity) {
        this.clear();
      }
      let that = this;
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          115.00366140297365,
          39.01073839434967,
          331.116406992883
        ),
        orientation: {
          heading: 1.92451,
          pitch: -0.403816,
          roll: 0.0,
        },
      });
      let original = scene.layers.find("original");
      let origina2 = scene.layers.find("origina白膜控制");
      let building = scene.layers.find("九号楼@九号楼");
      let building1 = scene.layers.find("九号楼@九号楼1");
      original.setObjsVisible([47], false);
      origina2.setObjsVisible([47], false);
      let instance = new Cesium.S3MInstanceCollection(scene._context);
      scene.primitives.add(instance);
      setTimeout(function () {
        entity = viewer.entities.add({
          id: "polygonA",
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray([
              115.00769546779887,
              39.00948953601627,
              115.01061031637882,
              39.01040583624218,
              115.01127283211821,
              39.00875368295838,
              115.00837238000206,
              39.0079302039017,
            ]),
            height: 105,
            material: new Cesium.Color(1, 1, 0.2, 0.5),
            outline: true,
            outlineColor: Cesium.Color.RED,
          },
        });
        building.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        building1.setObjsColor(arr, Cesium.Color.DARKORANGE.withAlpha(0.5));
        original.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        origina2.clipLineColor = Cesium.Color.WHITE.withAlpha(0.0);
        origina2.setObjsColor(
          [21, 17, 160, 62, 50, 55, 203, 57, 69, 197, 481, 29, 198, 202, 47],
          Cesium.Color.DARKORANGE.withAlpha(0.5)
        );
        let height = 100;
        let flag = true;
        let flagA = true;
        timer = setInterval(function () {
          if (height <= 170 && flagA) {
            if (flag) {
              height += 1.0;
            }
            if (height == 170) {
              flagA = false;
              let cartesian = Cesium.Cartesian3.fromDegrees(
                115.00781714813387,
                39.00939422072619,
                172.618
              );
              let pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                viewer.scene,
                cartesian
              );
              window.tooltip.showAt(pick, "建筑限高97米");
              window.setTimeout(function () {
                window.tooltip.setVisible(false);
              }, 3000);
            }
            entity.polygon.height = height + 2;
            scene.layers.find("九号楼@九号楼").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane",
            });
            scene.layers.find("九号楼@九号楼1").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane",
            });
            scene.layers.find("original").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_any_plane",
            });
            scene.layers.find("origina白膜控制").setCustomClipBox({
              dimensions: new Cesium.Cartesian3(280, 250, height * 2),
              position: Cesium.Cartesian3.fromDegrees(
                115.00942125650806,
                39.00903543560274,
                height / 50 - 1
              ),
              clipMode: "clip_behind_all_plane",
            });
          }
        }, 220);
      }, 2000);
    },
    clear() {
      clearInterval(timer);
      entity = null;
      let layers = viewer.scene.layers;
      scene.layers.find("original").clearCustomClipBox();
      scene.layers.find("origina白膜控制").clearCustomClipBox();
      scene.layers.find("九号楼@九号楼1").clearCustomClipBox();
      scene.layers.find("九号楼@九号楼").clearCustomClipBox();
      viewer.entities.removeAll();
      let building = scene.layers.find("九号楼@九号楼");
      let building1 = scene.layers.find("九号楼@九号楼1");
      building.removeObjsColor(arr);
      building1.removeObjsColor(arr);
      arr = [];
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
  },
  watch: {
    initflag(val) {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "limitHeightAnalysis";
</style>
