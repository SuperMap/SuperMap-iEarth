
<template>
  <div class="sm-panel" v-drag v-if="windParticleShow">
    <div class="sm-content">
      <div class="sm-panel-header">
        <span class="title-txt">{{Resource.windParticle}}</span>
        <span class="closeBtn" @click="setVisible">&times;</span>
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
              max="50"
              step="1"
              style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
              type="range"
              v-model="particleVelocityScale"
            />
            <input
              class="min-solider"
              min="0.1"
              max="50"
              step="1"
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
          <button class="tbtn" type="button" @click="clear">{{Resource.clear}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//todo
// 该功能需要开启requestWebgl2，暂时先不开启此功能

let fieldLayer;
let particleWindField = [];
let particleWindInverseField = [];
export default {
  name: "windParticle",
  data() {
    return {
      sharedState: store.state,
      particleSize: 2,
      ParticleLife: 5,
      particleDensity: 1,
      particleVelocityScale: 40,
      bloomShow: false,
      fieldLayerVisible: true,
      threshold: 0.5,
      intensity: 1.5,
      dataChanged: false,
      dataCompleted: false
    };
  },
  computed: {
    isInitViewer: function() {
      return this.sharedState.isInitViewer;
    },
    windParticleShow: function() {
      return this.sharedState.specialEffects[4];
    }
  },
  methods: {
    init() {
      if (window.device == "iOS") {
        this.$Message.warning({
          background: true,
          content: Resource.notSupport
        });
        return;
      }

      let that = this;
      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.SingleTileImageryProvider({
      //     url: "static/images/ParticleSystem/BlackMarble_2020.jpg"
      //   })
      // );

      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.UrlTemplateImageryProvider({
      //     url:
      //       "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
      //   })
      // );

      // var layer = viewer.imageryLayers.addImageryProvider(
      //   new Cesium.CGCS2000MapServerImageryProvider({
      //     url:
      //       "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
      //     // suggest: true,//4490坐标系，按照suggest切片方案切的瓦片,需要设置该参数
      //   })
      // );

      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.BingMapsImageryProvider({
      //     key: URL_CONFIG.BING_MAP_KEY, //可至官网（https://www.bingmapsportal.com/）申请key
      //     url: URL_CONFIG.BINGMAP
      //   })
      // );

      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.BingMapsImageryProvider({
      //     url: "https://dev.virtualearth.net",
      //     mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS,
      //     key: URL_CONFIG.BING_MAP_KEY
      //   })
      // );

      // var imageryLayers = viewer.imageryLayers;
      // //初始化天地图全球中文注记服务，并添加至影像图层
      // var labelImagery = new Cesium.TiandituImageryProvider({
      //   mapStyle: Cesium.TiandituMapsStyle.CIA_C, //天地图全球中文注记服务（经纬度投影）
      //   token: "7c84d70cb5b767c43dc86794d0d402e6"
      // });
      // imageryLayers.addImageryProvider(labelImagery);

      viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url:
            "https://maptiles.supermapol.com/iserver/services/map_China/rest/maps/China_Dark"
        })
      );

      let scene = viewer.scene;
      if (scene.skyBox) {
        scene.skyBox.show = false;
        scene.sun.show = false;
      }
      scene.skyAtmosphere.show = false;
      viewer.scene.bloomEffect.show = this.bloomShow; //启用泛光效果
      viewer.scene.bloomEffect.threshold = Number(this.threshold);
      viewer.scene.bloomEffect.bloomIntensity = Number(this.intensity);

      fieldLayer = new Cesium.FieldLayer3D(scene.context); //场数据图层
      fieldLayer.particleVelocityFieldEffect.velocityScale = 0.4 * 100.0; //初始化效果
      fieldLayer.particleVelocityFieldEffect.particleSize = this.particleSize;
      fieldLayer.particleVelocityFieldEffect.paricleCountPerDegree = 1.0;
      // fieldLayer.particleVelocityFieldEffect._fade0pacity=0.996;
      scene.primitives.add(fieldLayer); //添加场图层

      //加载风场数据
      window.axios.get("static/data/winds.json").then(function(response) {
        let data = response.data;
        let p = 0;
        for (var j = 0; j < 181; j++) {
          particleWindField[j] = [];
          particleWindInverseField[j] = [];
          for (var i = 0; i < 360; i++, p++) {
            var idx = i < 180 ? i + 180 : i - 180;
            var offset = (180 - j) * 360 + idx;
            var wind_value = [data[1].data[offset], data[2].data[offset]];
            particleWindField[j][i] = wind_value;
            particleWindInverseField[j][i] = [-wind_value[0], -wind_value[1]];
          }
        }

        let colorTable = new Cesium.ColorTable();
        colorTable.insert(0, new Cesium.Color.fromCssColorString("#6EB1EE")); // 0级  0-0.2m/s
        colorTable.insert(0.2, new Cesium.Color.fromCssColorString("#68ACED")); //1级  0.2-1.5m/s
        colorTable.insert(1.5, new Cesium.Color.fromCssColorString("#61A7EB")); //2级  1.5-3.3m/s
        colorTable.insert(3.3, new Cesium.Color.fromCssColorString("#5BA2EA")); //3级  3.3-5.4m/s
        colorTable.insert(5.4, new Cesium.Color.fromCssColorString("#549DE9")); //4级  5.4-7.9m/s
        colorTable.insert(7.9, new Cesium.Color.fromCssColorString("#4E98E8")); //5级  7.9-10.7m/s
        colorTable.insert(10.7, new Cesium.Color.fromCssColorString("#4794E6")); //6级  10.7-13.8m/s
        colorTable.insert(13.8, new Cesium.Color.fromCssColorString("#418FE5")); //7级  13.8-17.1m/s
        colorTable.insert(17.1, new Cesium.Color.fromCssColorString("#3A8AE4")); //8级  17.1-20.7m/s
        colorTable.insert(20.7, new Cesium.Color.fromCssColorString("#3485E3")); //9级  20.7-24.4m/s
        colorTable.insert(24.4, new Cesium.Color.fromCssColorString("#2D80E2")); //10级  24.4-28.4m/s
        colorTable.insert(28.4, new Cesium.Color.fromCssColorString("#277BE0")); //11级  28.4-32.6m/s
        colorTable.insert(32.6, new Cesium.Color.fromCssColorString("#2076DF")); //12级  32.6-36.9m/s
        colorTable.insert(36.9, new Cesium.Color.fromCssColorString("#1A71DE")); //13级  36.9-41.4m/s
        colorTable.insert(41.4, new Cesium.Color.fromCssColorString("#136DDD")); //14级  41.4-46.1m/s
        colorTable.insert(46.1, new Cesium.Color.fromCssColorString("#0D68DB")); //15级  46.1-50.9m/s
        colorTable.insert(50.9, new Cesium.Color.fromCssColorString("#0663DA")); //16级  50.9-56.0m/s
        colorTable.insert(56, new Cesium.Color.fromCssColorString("#005ED9")); //17级  >56.0m/s

        // //白色
        // colorTable.insert(
        //   0,
        //   new Cesium.Color(255 / 255, 255 / 255, 255 / 255, 0.95)
        // );
        // colorTable.insert(
        //   50,
        //   new Cesium.Color(255 / 255, 255 / 255, 255 / 255, 0.95)
        // );
        fieldLayer.particleVelocityFieldEffect.colorTable = colorTable;

        that.dataCompleted = true;
      });
    },
    startField() {
      if (window.device == "iOS") {
        return;
      }

      if (this.dataCompleted) {
        fieldLayer.fieldData = particleWindField;
      } else {
        this.$Message.warning({
          background: true,
          content: Resource.waitData
        });
      }
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
      store.setSpecialEffects(4, 0);
      this.reset();
      this.dataCompleted = false;
    },
    reset() {
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(
          110.60396458865515,
          34.54408834959379,
          30644793.325518917
        )
      });
    },
    setVisible() {
      store.setSpecialEffects(4, 0);
    }
  },

  watch: {
    windParticleShow: {
      handler(val) {
        if (val && particleWindField.length == 0) this.init();
      },
      immediate: true
    },

    // windParticleShow(val) {
    //   if (val && particleWindField.length == 0) {
    //     this.init();
    //   }
    // },

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
      fieldLayer.particleVelocityFieldEffect.velocityScale = val;
    },
    bloomShow: function(val) {
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
    }
  }
};
</script>


