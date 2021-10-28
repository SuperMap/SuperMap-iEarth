<template>
  <div class="sm-function-module-content" v-show="localFileShow">
    <label class="label-container">{{Resource.KMLData}}</label>
    <input class="sm-input" type="file" accept=".kml" id="file" style="height:33px;padding-top:2px;"/>
  </div>
</template>

<script>
export default {
  name: "addLocalFile",
  data() {
    return {
      sharedState: store.state,
      files: null,
    };
  },
  computed: {
    localFileShow: function () {
      return this.sharedState.addLayer[3];
    },
  },
  methods: {
    // 添加本地文件
    addLocalFile() {
      let f = document.getElementById("file");
      f.addEventListener("change", function (evt) {
        let target = evt.target;
        let file = target.files[0];
        if (!file) return;
        viewer.dataSources
          .add(
            Cesium.KmlDataSource.importFile(file, {
              camera: viewer.scene.camera,
              canvas: viewer.scene.canvas,
            })
          )
          .then(function (dataSource) {
            viewer.flyTo(dataSource);
            viewer.scene.layer = dataSource;
            setTimeout(() => {
              //更新图层
              store.setS3MLayerManage(viewer.scene.layers.layerQueue.length);
              store.setImgLayerManage(viewer.imageryLayers._layers.length);
              store.setTerrainLayerManage(viewer.terrainProvider);
            }, 500);
          });
      });
    },
  },

  watch: {
    localFileShow: function (val) {
      let panl = document.querySelector(".addLayer-panel");
      if (val) {
        this.addLocalFile();
        panl.style.height = 180+'px';
      }else{
        panl.style.height = 472+'px';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./LocalFilePan.scss";
</style>
