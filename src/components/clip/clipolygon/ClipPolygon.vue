<template>
  <div class="com" v-show="clipPolygon">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="sm-function-module-sub-section-caption">{{
          Resource.polygonClipMode
        }}</label>
        <select
          class="sm-select"
          id
          style="width: 100%"
          v-model="ClipModelSelected"
        >
          <option
            :value="Options.id"
            v-for="Options in ClipModels"
            :key="Options.id"
          >
            {{ Options.name }}
          </option>
        </select>
      </div>
      <div class="boxchild">
        <button @click="clipPolygonStart" class="tbtn tbn1" type="button">
          {{ Resource.clip }}
        </button>
        <button @click="clearClipPolygon" class="tbtn" type="button" style="margin-right:0px;">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let layers;
export default {
  name: "Sm3dClipPolygon",
  data() {
    return {
      sharedState: store.state,
      ClipModels: [
        {
          id: "0",
          name: Resource.PolygonClipInside,
        },
        {
          id: "1",
          name: Resource.PolygonClipOutside,
        },
      ],
      ClipModelSelected: "0",
      clipModeOption: null,
      position: [],
      isDestroyFlag: true,
    };
  },
  computed: {
    clipPolygon: function () {
      return this.sharedState.clip[3];
    },
    clipShow: function () {
      return this.sharedState.toolBar[4];
    },
  },
  methods: {
    // 多边形裁剪
    clipPolygonStart() {
      this.isDestroyFlag = false; //保留效果
      this.position = [];
      for (let layer of layers) {
        layer.selectEnabled = false;
        // 设置被裁剪对象的颜色
        layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
      }
      common.handlerDrawing("Polygon").then(
        (res) => {
          this.position.push(res.positions);
          let handlerPolygon = window.handlerPolygon;
          for (let layer of layers) {
            layer.setModifyRegions(this.position, this.clipModeOption);
          }
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
      if (!scene.pickPositionSupported) {
        alert("不支持深度纹理,无法绘制多边形，裁剪功能无法使用！");
      }
    },

    clearClipPolygon() {
      common.clearHandlerDrawing("Polygon");
      if (!layers) {
        return;
      }
      this.position = [];
      for (let layer of layers) {
        layer.clearModifyRegions();
      }
      this.isDestroyFlag = true; //摧毁标志，释放内存
    },

    init() {
      if (layers) {
        return;
      }
      this.clipModeOption = Cesium.ModifyRegionMode.CLIP_INSIDE;
      layers = scene.layers.layerQueue;
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      layers = undefined;
    }
  },
  mounted() {
    if (this.clipShow && this.clipPolygon) {
      this.init();
    }
  },
  watch: {
    clipPolygon(val) {
      if (val) {
        this.init();
      }
    },
    clipShow(val) {
      if (val && this.clipPolygon) {
        this.init();
      }
    },
    ClipModelSelected(val) {
      if (!layers) return;
      switch (val) {
        case "0":
          this.clipModeOption = Cesium.ModifyRegionMode.CLIP_INSIDE;
          break;
        case "1":
          this.clipModeOption = Cesium.ModifyRegionMode.CLIP_OUTSIDE;
          break;
      }
      for (let layer of layers) {
        layer.setModifyRegions(this.position, this.clipModeOption);
      }
    },
  },
};
</script>



