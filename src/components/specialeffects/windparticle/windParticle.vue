
<template>
  <div class="sm-panel" v-drag v-if="windParticleShow">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span class="title-txt">{{Resource.windParticle}}</span>
        <span class="closeBtn" @click="clear">&times;</span>
      </div>
      <div class="sm-function-module-content">
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.particleSize}}</label>
          <div class="sm-solider-input-box">
            <input
              class="min-solider"
              min="1"
              max="10"
              step="1"
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              type="range"
              v-model="particleSize"
            />
            <input
              class="min-solider"
              min="1"
              max="10"
              step="1"
              style="width:34%;border-radius: 3px"
              type="number"
              v-model="particleSize"
            />
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.imumParticleLife}}</label>
          <div class="sm-solider-input-box">
            <input
              class="min-solider"
              min="1"
              max="20"
              step="1"
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              type="range"
              v-model="ParticleLife"
            />
            <input
              class="min-solider"
              min="1"
              max="20"
              step="1"
              style="width:34%;border-radius: 3px"
              type="number"
              v-model="ParticleLife"
            />
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.ParticleDensity}}</label>
          <div class="sm-solider-input-box">
            <input
              class="min-solider"
              min="0.1"
              max="3"
              step="0.1"
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              type="range"
              v-model="particleDensity"
            />
            <input
              class="min-solider"
              min="0.1"
              max="3"
              step="0.1"
              style="width:34%;border-radius: 3px"
              type="number"
              v-model="particleDensity"
            />
          </div>
        </div>
        <div class="sm-function-module-sub-section">
          <label class="label-container">{{Resource.ParticleVelocity}}</label>
          <div class="sm-solider-input-box">
            <input
              class="min-solider"
              min="0.1"
              max="5"
              step="0.1"
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              type="range"
              v-model="particleVelocityScale"
            />
            <input
              class="min-solider"
              min="0.1"
              max="5"
              step="0.1"
              style="width:34%;border-radius: 3px"
              type="number"
              v-model="particleVelocityScale"
            />
          </div>
        </div>

        <div class="flexbox">
          <label class="sm-viewshed-label-right">{{Resource.openSceneFlood}}</label>
          <input type="checkbox" v-model="bloomShow" />
          <label class="sm-viewshed-label-right">{{Resource.visibility}}</label>
          <input type="checkbox" v-model="fieldLayerVisible" />
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
              step="0.1"
              v-model="threshold"
            />
            <input
              style="width:34%; height:25px;border-radius: 3px"
              class="min-solider"
              type="number"
              min="0"
              max="1"
              step="0.1"
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
              max="10"
              step="0.1"
              v-model="intensity"
            />
            <input
              style="width:34%; height:25px;border-radius: 3px"
              class="min-solider"
              type="number"
              min="0"
              max="10"
              step="0.1"
              v-model="intensity"
            />
          </div>
        </div>
        <div class="boxchild">
          <button class="tbtn tbn1" type="button" @click="startField">{{Resource.Start}}</button>
          <button class="tbtn" type="button" @click="changeFieldData">{{Resource.SwitchData}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let fieldLayer;
let particleWindField = [];
let particleWindInverseField = [];
export default {
  name: "windParticle",
  data() {
    return {
      sharedState: store.state,
      particleSize: 1.2,
      ParticleLife: 5,
      particleDensity: 1,
      particleVelocityScale: 0.4,
      bloomShow: true,
      fieldLayerVisible: true,
      threshold: 0.5,
      intensity: 1.5,
      dataChanged: false,
    };
  },
  computed: {
    isInitViewer: function () {
      return this.sharedState.isInitViewer;
    },
    windParticleShow: function () {
      return this.sharedState.specialEffects[2];
    },
  },
  methods: {
    init() {
      viewer.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: "static/images/ParticleSystem/BlackMarble_2020.jpg",
        })
      );
      let scene = viewer.scene;
      if(scene.skyBox){
         scene.skyBox.show = false;
         scene.sun.show = false;
      }
      scene.skyAtmosphere.show = false;
      viewer.scene.bloomEffect.show = true; //启用泛光效果
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
      let promise = scene.open(URL_CONFIG.SCP_WORLD_COUNTRY_VECTOR2);
      Cesium.when.all(promise, function (layers) {
        let layer1 = scene.layers.find("Country_Label@World");
        let layerEffect1 = layer1.effect;
        layerEffect1.setValue(
          "Color",
          new Cesium.Color(
            (255 * 1.5) / 255,
            (255 * 1.5) / 255,
            (255 * 1.5) / 255,
            1
          )
        );
        layerEffect1.setValue("Width", 1.3);

        let layer3 = scene.layers.find("Ocean_Label@World");

        let layerEffect3 = layer3.effect;
        layerEffect3.setValue(
          "Color",
          new Cesium.Color(
            (255 * 1.5) / 255,
            (255 * 1.5) / 255,
            (255 * 1.5) / 255,
            1
          )
        );
        layerEffect3.setValue("Width", 1.3);
      });
      let colorTable = new Cesium.ColorTable();
      colorTable.insert(
        2,
        new Cesium.Color(254 / 255, 224 / 255, 139 / 255, 1)
      );
      colorTable.insert(
        2,
        new Cesium.Color(171 / 255, 221 / 255, 164 / 255, 1)
      );
      colorTable.insert(
        2,
        new Cesium.Color(104 / 255, 196 / 255, 160 / 255, 1)
      );
      colorTable.insert(4, new Cesium.Color(44 / 255, 185 / 255, 156 / 255, 1));
      colorTable.insert(4, new Cesium.Color(25 / 255, 169 / 255, 178 / 255, 1));
      colorTable.insert(7, new Cesium.Color(50 / 255, 136 / 255, 189 / 255, 1));
      colorTable.insert(
        10,
        new Cesium.Color(31 / 255, 110 / 255, 183 / 255, 1)
      );
      colorTable.insert(15, new Cesium.Color(5 / 255, 98 / 255, 184 / 255, 1));
      fieldLayer = new Cesium.FieldLayer3D(scene.context); //场数据图层
      fieldLayer.particleVelocityFieldEffect.velocityScale = 0.5 * 100.0; //初始化效果
      fieldLayer.particleVelocityFieldEffect.particleSize = 1.8;
      fieldLayer.particleVelocityFieldEffect.paricleCountPerDegree = 0.8;
      fieldLayer.particleVelocityFieldEffect._fade0pacity = 0.996;
      scene.primitives.add(fieldLayer); //添加场图层

      fieldLayer.particleVelocityFieldEffect.colorTable = colorTable;

      //加载风场数据
      window.axios
        .get("@/../static/data/gfs-wind.json")
        .then(function (response) {
          let data = response.data;
          let p = 0;
          for (let j = 0, x = 181; j < x; j++) {
            particleWindField[180 - j] = [];
            particleWindInverseField[180 - j] = [];
            for (let i = 0, y = 360; i < y; i++, p++) {
              const k = j * 360 + ((i + 360 / 2) % 360);
              particleWindField[180 - j][i] = [
                data[0].data[k],
                data[1].data[k],
              ];
              particleWindInverseField[180 - j][i] = [
                 -data[0].data[k],
                 -data[1].data[k],
              ];
            }
          }
        });
    },
    startField() {
      fieldLayer.fieldData = particleWindField;
    },
    //场图层数据切换
    changeFieldData() {
      if (this.dataChanged) {
        fieldLayer.fieldData = particleWindField;
      } else {
        fieldLayer.fieldData = particleWindInverseField;
      }
      this.dataChanged = !this.dataChanged;
    },
    clear() {
      scene.skyAtmosphere.show = true;
      viewer.scene.bloomEffect.show = false;
      scene.primitives.remove(fieldLayer);
      !fieldLayer.isDestroyed && fieldLayer.destroy();
      particleWindField = [];
      particleWindInverseField = [];
      viewer.scene.layers.remove("Country_Label@World");
      viewer.scene.layers.remove("Ocean_Label@World");
      let ly = viewer.imageryLayers._layers[1];
      viewer.imageryLayers.remove(ly);
      store.setSpecialEffects(2, 0);
      this.reset();
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
    windParticleShow(val) {
      if (val) {
        this.init();
      }
    },

    particleSize(val) {
      fieldLayer.particleVelocityFieldEffect.particleSize = Number(val);
    },
    ParticleLife(val) {
      let lifeRange = [val * 1000.0, val * 1000.0 + 5000.0];
      fieldLayer.particleVelocityFieldEffect.particleLifeRange = lifeRange;
    },
    particleDensity(val) {
      fieldLayer.particleVelocityFieldEffect.paricleCountPerDegree = Number(
        val
      );
    },
    particleVelocityScale(val) {
      fieldLayer.particleVelocityFieldEffect.velocityScale = val * 100.0;
    },
    bloomShow: function (val) {
      viewer.scene.bloomEffect.show = val;
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
    },
    fieldLayerVisible(val) {
      fieldLayer.visible = val;
    },
    threshold(val) {
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
    },
    intensity(val) {
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);
    },
  },
};
</script>


