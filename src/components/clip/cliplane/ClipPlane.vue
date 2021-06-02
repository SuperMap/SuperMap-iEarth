<template>
  <div v-show="clipPlane">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container"
          >{{ Resource.firstPoint }}:
          <label> {{ Resource.Spacelongitude }}</label>
          <label> {{ Resource.Spacelatitude }}</label>
          <label> {{ Resource.Spacealtitude }}</label>
        </label>
        <input
          class="middle-input"
          disabled
          type="text"
          min="0"
          v-model="planeClipPoint1"
          style="width: 100%;color:white;"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container"
          >{{ Resource.secondPoint }}:
          <label> {{ Resource.Spacelongitude }}</label>
          <label> {{ Resource.Spacelatitude }}</label>
          <label> {{ Resource.Spacealtitude }}</label>
        </label>
        <input
          class="middle-input"
          disabled
          type="text"
          min="0"
          v-model="planeClipPoint2"
          style="width: 100%;color:white;"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container"
          >{{ Resource.thirdPoint }}:
          <label> {{ Resource.Spacelongitude }}</label>
          <label> {{ Resource.Spacelatitude }}</label>
          <label> {{ Resource.Spacealtitude }}</label>
        </label>
        <input
          class="middle-input"
          disabled
          type="text"
          min="0"
          v-model="planeClipPoint3"
          style="width: 100%;color:white;"
        />
      </div>
      <div class="boxchild">
        <button @click="clipPlaneStart" class="tbtn tbn1" type="button">
          {{ Resource.clip }}
        </button>
        <button @click="clearClipPlane" class="tbtn" type="button" style="margin-right: 1px;">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let layers;
export default {
  name: "Sm3dClipPlane",
  data() {
    return {
      sharedState: store.state,
      position: [],
      planeClipPoint1: null,
      planeClipPoint2: null,
      planeClipPoint3: null,
      isDestroyFlag: true,
    };
  },
  computed: {
    clipPlane: function () {
      return this.sharedState.clip[1];
    },
    clipShow: function () {
      return this.sharedState.toolBar[4];
    },
  },
  methods: {
    toggleVisibility() {
      this.show = !this.show;
    },
    // 多边形裁剪
    clipPlaneStart() {
      this.isDestroyFlag = false; //保留效果
      (this.planeClipPoint1 = null),
        (this.planeClipPoint2 = null),
        (this.planeClipPoint3 = null);
      this.position = [];
      for (let layer of layers) {
        layer.selectEnabled = false;
        // 设置被裁剪对象的颜色
        layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
      }
      common.handlerDrawing("Polygon", 1).then(
        (res) => {
          this.position = res.result.object.positions;
          for (let layer of layers) {
            layer.setCustomClipPlane(
              this.position[0],
              this.position[1],
              this.position[2]
            );
          }
          let cartographic1 = Cesium.Cartographic.fromCartesian(
            this.position[0]
          );
          let longitude1 = Cesium.Math.toDegrees(
            cartographic1.longitude
          ).toFixed(6);
          let latitude1 = Cesium.Math.toDegrees(cartographic1.latitude).toFixed(
            6
          );
          let height1 = cartographic1.height.toFixed(2);

          let cartographic2 = Cesium.Cartographic.fromCartesian(
            this.position[1]
          );
          let longitude2 = Cesium.Math.toDegrees(
            cartographic2.longitude
          ).toFixed(6);
          let latitude2 = Cesium.Math.toDegrees(cartographic2.latitude).toFixed(
            6
          );
          let height2 = cartographic2.height.toFixed(2);

          let cartographic3 = Cesium.Cartographic.fromCartesian(
            this.position[2]
          );
          let longitude3 = Cesium.Math.toDegrees(
            cartographic3.longitude
          ).toFixed(6);
          let latitude3 = Cesium.Math.toDegrees(cartographic3.latitude).toFixed(
            6
          );
          let height3 = cartographic3.height.toFixed(2);

          this.planeClipPoint1 =
            "" + longitude1 + ", " + latitude1 + ", " + height1;
          this.planeClipPoint2 =
            "" + longitude2 + ", " + latitude2 + ", " + height2;
          this.planeClipPoint3 =
            "" + longitude3 + ", " + latitude3 + ", " + height3;
          window.handlerPolygon.deactivate();
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

    clearClipPlane() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      (this.planeClipPoint1 = null),
        (this.planeClipPoint2 = null),
        (this.planeClipPoint3 = null);
      if (!layers) {
        return;
      }
      this.position = [];
      for (let layer of layers) {
        layer.clearCustomClipBox();
      }
      common.clearHandlerDrawing("Polygon");
    },

    init() {
      if (layers) return;
      layers = viewer.scene.layers.layerQueue;
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      layers = undefined;
    }
  },
  mounted() {
    if (this.clipShow && this.clipPlane) {
      this.init();
    }
  },

  watch: {
    clipPlane(val) {
      if (val) {
        this.init();
      }
    },
    clipShow(val) {
      if (val && this.clipPlane) {
        this.init();
      }
    },
  },
};
</script>




