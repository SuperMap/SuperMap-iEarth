<template>
  <div v-show="onLineShow">
    <div class="sm-function-module-content">
      <div class="boxchild">
        <button type="button" class="tbtn tbn1" v-on:click="analysis">分析</button>
        <button type="button" class="tbtn" @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sm3dOnLineAnalysis",
  props: {},
  data() {
    return {
      dsMode: 1,
      sharedState: store.state,
    };
  },
  computed: {
    onLineShow: function () {
      return this.sharedState.cityPlan[1];
    },
    cityPlanShow: function () {
      return this.sharedState.toolBar[9];
    },
    initflag() {
      return this.sharedState.S3MLayerManage;
    },
  },
  methods: {
    analysis() {
      viewer.entities.removeAll();
      let pastePolyLine = viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            115.008423196501,
            39.00802071320561,
            102.1,
            115.01018439584423,
            39.00853132862415,
            102.1,
            115.011168593648,
            39.00880578673498,
            102.1,
          ]),
          width: 4.0,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
        },
      });
      setTimeout(function () {
        scene.layers
          .find("original")
          .setObjsColor([202], new Cesium.Color(1, 0, 0));
        let cartesian = Cesium.Cartesian3.fromDegrees(
          115.00896686645638,
          39.00818670441549,
          111.5
        );
        let pick = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          cartesian
        );
        window.tooltip.showAt(pick, "贴线率：0.83");
        window.setTimeout(function () {
          window.tooltip.setVisible(false);
        }, 3000);
      }, 4000);
    },
    clear() {
      viewer.entities.removeAll();
      let layer = scene.layers.find("original");
      layer.removeObjsColor([202]);
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -2095120.8195698452,
          4492050.236234234,
          4014691.2770372364
        ),
        orientation: {
          heading: 1.0525528821913364,
          pitch: -0.5403802934874635,
          roll: 1.616484723854228e-12,
        },
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "OnLineAnalysis";
</style>
