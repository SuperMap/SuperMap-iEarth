<template>
  <div class="sm-function-module-content" v-show="light">
    <label class="sm-function-module-sub-section-setting">{{Resource.symbolicLibrary}}</label>
    <div class="symbolicLibrary">
      <div class="Thematicbox" :class="{lightSelected:lightSelect===0}" @click="lightType(0)">
        <div id="pointLight" class="minbox">
          <span class="iconfont iconICON_dianguangyuan"></span>
        </div>{{Resource.pointLight}}
      </div>
      <div class="Thematicbox" :class="{lightSelected:lightSelect===1}" @click="lightType(1)">
        <div class="minbox" id="spotLight">
          <span class="iconfont iconICON_juguangdeng"></span>
        </div>{{Resource.spotLight}}
      </div>
      <div class="Thematicbox" :class="{lightSelected:lightSelect===2}" @click="lightType(2)">
        <div class="minbox" id="directionalLight">
          <span class="iconfont iconICON_pinghangguang"></span>
        </div>{{Resource.directionalLight}}
      </div>
    </div>
    <!-- 点光源 -->
    <div v-show="pointShow">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.lightSourceColor}}</label>
        <ColorPicker class="sm-colorpicker" editable v-model="pointLightColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.cutoffDistance}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="pointLightDistance" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.decay}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="pointLightDecay" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.intensity}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="pointLightIntensity" />
      </div>
    </div>
    <!-- 聚光灯 -->
    <div v-show="spotShow">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.lightSourceColor}}</label>
        <ColorPicker class="sm-colorpicker" editable v-model="spotLightColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.cutoffDistance}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="spotLightDistance" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.decay}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="spotLightDecay" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.intensity}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="spotLightIntensity" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.spotLightAngle}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="spotLightAngle" />
      </div>
    </div>
    <!-- 平行光 -->
    <div v-show="directionalShow">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.lightSourceColor}}</label>
        <ColorPicker class="sm-colorpicker" editable v-model="directionalColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.intensity}}</label>
        <input class="sm-input-long" min="0" type="number" v-model="directionalIntensity" />
      </div>
    </div>
    <label class="label-container">{{Resource.obliqueLightWarning}}</label>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="addLinght">{{Resource.Add}}</button>
      <button class="tbtn right" type="button" @click="clearLightSource">{{Resource.clear}}</button>
    </div>
  </div>
</template>

<script>

let pointLightSourceDrawHandler,
  spotOrDirectionalLightSourceDrawHandler,
  spotOrDirectionalLightSourceCountHandler,
  spotOrDirectionalLightSourceAdding = false,
  spotOrDirectionalLightPositions = [],
  entityPointLightPairs, // Entity和点光源对象的键值对
  entitySpotLightPairs, // Entity和聚光灯对象的键值对
  entityDirectionalLightPairs; // Entity和平行光对象的键值对
export default {
  name: "sceneLight",
  data() {
    return {
      sharedState: store.state,
      lightSelect: 0,
      pointShow: true,
      spotShow: false,
      directionalShow: false,
      pointLightColor: "#C8910A",
      pointLightDistance: 100,
      pointLightDecay: 5,
      pointLightIntensity: 5,
      spotLightColor: "#C8910A",
      spotLightDistance: 300,
      spotLightDecay: 3,
      spotLightIntensity: 3,
      spotLightAngle: 30,
      directionalColor: "#C8910A",
      directionalIntensity: 3,
      isDestroyFlag: true,
    };
  },

  computed: {
    light: function () {
      return this.sharedState.sceneAtttribute[2];
    },
    SceneAtttributeShow: function () {
      return this.sharedState.toolBar[3];
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag) {
      if (pointLightSourceDrawHandler) {
        pointLightSourceDrawHandler.deactivate();
        pointLightSourceDrawHandler = undefined;
      }
      if (spotOrDirectionalLightSourceDrawHandler) {
        spotOrDirectionalLightSourceDrawHandler.deactivate();
        spotOrDirectionalLightSourceDrawHandler = undefined;
      }
      if (spotOrDirectionalLightSourceCountHandler) {
        spotOrDirectionalLightSourceCountHandler.destroy();
        spotOrDirectionalLightSourceDrawHandler = undefined;
      }
      if (entityPointLightPairs) {
        entityPointLightPairs = undefined;
      }
      if (entitySpotLightPairs) {
        entitySpotLightPairs = undefined;
      }
      if (entityDirectionalLightPairs) {
        entityDirectionalLightPairs = undefined;
      }
    }
  },
  mounted() {
    if (this.SceneAtttributeShow && this.light) {
      this.init();
    }
  },
  methods: {
    init() {
      if (entityPointLightPairs) {
        return;
      }
      entityPointLightPairs = new Map(); // Entity和点光源对象的键值对
      entitySpotLightPairs = new Map(); // Entity和聚光灯对象的键值对
      entityDirectionalLightPairs = new Map(); // Entity和平行光对象的键值对
    },
    lightType(i) {
      this.lightSelect = i;
      switch (i) {
        case 0:
          this.pointShow = true;
          this.spotShow = false;
          this.directionalShow = false;
          break;
        case 1:
          this.pointShow = false;
          this.spotShow = true;
          this.directionalShow = false;
          break;
        case 2:
          this.pointShow = false;
          this.spotShow = false;
          this.directionalShow = true;
          break;
        default:
          null;
      }
    },
    addLinght() {
      this.isDestroyFlag = false;
      switch (this.lightSelect) {
        case 0:
          if (!pointLightSourceDrawHandler) {
            this.initPointLightSourceDrawHandler();
          }
          pointLightSourceDrawHandler.activate();
          break;
        case 1:
        case 2:
          if (!spotOrDirectionalLightSourceDrawHandler) {
            this.initSpotOrDirectionalLightSourceDrawHandler();
          }
          spotOrDirectionalLightSourceAdding = true;
          spotOrDirectionalLightSourceDrawHandler.activate();
          break;
        default:
          break;
      }
    },
    initPointLightSourceDrawHandler() {
      pointLightSourceDrawHandler = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Point
      );
      pointLightSourceDrawHandler.activeEvt.addEventListener(function (
        isActive
      ) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          document.body.classList.add("drawCur");
        } else {
          viewer.enableCursorStyle = true;
          document.body.classList.remove("drawCur");
        }
      });
      pointLightSourceDrawHandler.movingEvt.addEventListener(
        (windowPosition) => {
          window.tooltip.showAt(
            windowPosition,
            `<p>${Resource.clickToConfirmThePositionOfTheLightSource}</p><p>${Resource.clickLightChangeAttributes}</p>`
          );
        }
      );
      pointLightSourceDrawHandler.drawEvt.addEventListener((result) => {
        let cartesian = result.object.position;
        let option = {
          color: Cesium.Color.fromCssColorString(this.pointLightColor),
          cutoffDistance: Number(this.pointLightDistance),
          decay: Number(this.pointLightDecay),
          intensity: Number(this.pointLightIntensity),
        };
        let pointLight = new Cesium.PointLight(cartesian, option);
        scene.addLightSource(pointLight);
        let entityAsKey = viewer.entities.add({
          id: "point-light-" + new Date().getTime(),
          position: cartesian,
          billboard: {
            image: "@/../static/images/lightSource/pointLight.png",
            scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
            disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
          },
        });
        console.log(entityPointLightPairs);
        entityPointLightPairs.set(entityAsKey, pointLight);
        pointLightSourceDrawHandler.clear();
        window.tooltip.setVisible(false);
      });
    },
    initSpotOrDirectionalLightSourceDrawHandler() {
      spotOrDirectionalLightSourceDrawHandler = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Line
      );
      spotOrDirectionalLightSourceCountHandler = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );
      spotOrDirectionalLightSourceDrawHandler.activeEvt.addEventListener(
        function (isActive) {
          if (isActive == true) {
            viewer.enableCursorStyle = false;
            viewer._element.style.cursor = "";
            document.body.classList.add("drawCur");
          } else {
            viewer.enableCursorStyle = true;
            document.body.classList.remove("drawCur");
          }
        }
      );
      spotOrDirectionalLightSourceDrawHandler.movingEvt.addEventListener(
        (windowPosition) => {
          window.tooltip.showAt(
            windowPosition,
            `<p>${Resource.ClickLineDirectionLightSource}</p><p>${Resource.clickLightChangeAttributes}</p>`
          );
        }
      );
      spotOrDirectionalLightSourceDrawHandler.drawEvt.addEventListener(
        (result) => {
          let positions = (result.object && result.object.positions) || result;
          if (positions.length !== 2) {
            return;
          }
          if (this.lightSelect === 1) {
            let spotLightOptions = {
              color: Cesium.Color.fromCssColorString(this.spotLightColor),
              distance: Number(this.spotLightDistance),
              decay: Number(this.spotLightDecay),
              intensity: Number(this.spotLightIntensity),
              angle: Cesium.Math.toRadians(Number(this.spotLightAngle)),
            };
            let spotLight = new Cesium.SpotLight(
              positions[0],
              positions[1],
              spotLightOptions
            );
            scene.addLightSource(spotLight);
            let entityAsKey = viewer.entities.add({
              id: "spot-light-" + new Date().getTime(),
              position: positions[0],
              billboard: {
                image: "@/../static/images/lightSource/spotLight.png",
                scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1), // 按照距离调整图片的大小
                disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
              },
            });
            entitySpotLightPairs.set(entityAsKey, spotLight);
          } else if (this.lightSelect === 2) {
            let directionalLightOptions = {
              targetPosition: positions[1],
              color: Cesium.Color.fromCssColorString(this.directionalColor),
              intensity: Number(this.directionalIntensity),
            };
            let directionalLight = new Cesium.DirectionalLight(
              positions[0],
              directionalLightOptions
            );
            scene.addLightSource(directionalLight);
            let entityAsKey = viewer.entities.add({
              id: "directional-light-" + new Date().getTime(),
              position: positions[0],
              billboard: {
                image:
                  "@/../static/images/lightSource/directionalLight.png",
                scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
                disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
              },
            });
            entityDirectionalLightPairs.set(entityAsKey, directionalLight);
          }
          spotOrDirectionalLightPositions = [];
          spotOrDirectionalLightSourceDrawHandler.clear();
          window.tooltip.setVisible(false);
        }
      );

      spotOrDirectionalLightSourceCountHandler.setInputAction(function (e) {
        if (spotOrDirectionalLightSourceAdding) {
          spotOrDirectionalLightPositions.push(scene.pickPosition(e.position));
          if (spotOrDirectionalLightPositions.length === 2) {
            spotOrDirectionalLightSourceDrawHandler.deactivate();
            spotOrDirectionalLightSourceAdding = false;
            spotOrDirectionalLightSourceDrawHandler.drawEvt.raiseEvent(
              spotOrDirectionalLightPositions
            );
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    clearLightSource() {
      this.isDestroyFlag = true;
      while (scene.lightSource.pointLight.values.length > 0) {
        scene.removeLightSource(scene.lightSource.pointLight.values[0]);
      }
      while (scene.lightSource.spotLight.values.length > 0) {
        scene.removeLightSource(scene.lightSource.spotLight.values[0]);
      }
      while (scene.lightSource.directionalLight.values.length > 0) {
        scene.removeLightSource(scene.lightSource.directionalLight.values[0]);
      }
      for (let key of entityPointLightPairs.keys()) {
        viewer.entities.remove(key);
      }
      entityPointLightPairs.clear();
      for (let key of entitySpotLightPairs.keys()) {
        viewer.entities.remove(key);
      }
      entitySpotLightPairs.clear();
      for (let key of entityDirectionalLightPairs.keys()) {
        viewer.entities.remove(key);
      }
      entityDirectionalLightPairs.clear();
    },
  },

  watch: {
    light: function (val) {
      if (val) {
        this.init();
      }
    },
    pointLightColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("point-light") === 0
      ) {
        entityPointLightPairs.get(viewer.selectedEntity).color = color;
      }
    },
    pointLightDistance(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("point-light") === 0
      ) {
        entityPointLightPairs.get(
          viewer.selectedEntity
        ).cutoffDistance = Number(val);
      }
    },
    pointLightDecay(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("point-light") === 0
      ) {
        entityPointLightPairs.get(viewer.selectedEntity).decay = Number(val);
      }
    },
    pointLightIntensity(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("point-light") === 0
      ) {
        entityPointLightPairs.get(viewer.selectedEntity).intensity = Number(
          val
        );
      }
    },
    spotLightColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("spot-light") === 0
      ) {
        entitySpotLightPairs.get(viewer.selectedEntity).color = color;
      }
    },
    spotLightDistance(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("spot-light") === 0
      ) {
        entitySpotLightPairs.get(viewer.selectedEntity).distance = Number(val);
      }
    },
    spotLightDecay(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("spot-light") === 0
      ) {
        entitySpotLightPairs.get(viewer.selectedEntity).decay = Number(val);
      }
    },
    spotLightIntensity(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("spot-light") === 0
      ) {
        entitySpotLightPairs.get(viewer.selectedEntity).intensity = Number(val);
      }
    },
    spotLightAngle(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("spot-light") === 0
      ) {
        entitySpotLightPairs.get(
          viewer.selectedEntity
        ).angle = Cesium.Math.toRadians(Number(val));
      }
    },
    directionalColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("directional-light") === 0
      ) {
        entityDirectionalLightPairs.get(viewer.selectedEntity).color = color;
      }
    },
    directionalIntensity(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("directional-light") === 0
      ) {
        entityDirectionalLightPairs.get(
          viewer.selectedEntity
        ).intensity = Number(val);
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "light";
</style>
