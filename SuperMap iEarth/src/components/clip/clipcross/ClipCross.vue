<template>
  <div v-show="clipCross">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.ClipWidth }}</label>
        <div class="sm-solider-input-box" style="width:65%;">
          <input
            class="min-solider"
            min="0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="clipWidth"
          />
          <input
            class="min-solider"
            min="0"
            step="1"
            style="width: 34%; height: 25px;border-radius:3px;"
            type="number"
            v-model="clipWidth"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.ClipHeight }}</label>
        <div class="sm-solider-input-box" style="width:65%;">
          <input
            class="min-solider"
            min="0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="clipHeight"
          />
          <input
            class="min-solider"
            min="0"
            step="1"
            style="width: 34%; height: 25px;border-radius:3px;"
            type="number"
            v-model="clipHeight"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.Xrotation }}</label>
        <div class="sm-solider-input-box" style="width:65%;">
          <input
            class="min-solider"
            min="0"
            max="360"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="pitch"
          />
          <input
            class="min-solider"
            min="0"
            max="360"
            step="1"
            style="width: 34%; height: 25px;border-radius:3px;"
            type="number"
            v-model="pitch"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.Yrotation }}</label>
        <div class="sm-solider-input-box" style="width:65%;">
          <input
            class="min-solider"
            max="360"
            min="0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="roll"
          />
          <input
            class="min-solider"
            max="360"
            min="0"
            step="1"
            style="width: 34%; height: 25px;border-radius:3px;"
            type="number"
            v-model="roll"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.Zrotation }}</label>
        <div class="sm-solider-input-box" style="width:65%;">
          <input
            class="min-solider"
            max="360"
            min="0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="heading"
          />
          <input
            class="min-solider"
            max="360"
            min="0"
            step="1"
            style="width: 34%; height: 25px;border-radius:3px;"
            type="number"
            v-model="heading"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.extrude }}</label>
        <div class="sm-solider-input-box" style="width:65%;">
          <input
            class="min-solider"
            min="0"
            step="1"
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            type="range"
            v-model="extrude"
          />
          <input
            class="min-solider"
            min="0"
            step="1"
            style="width: 34%; height: 25px;border-radius:3px;"
            type="number"
            v-model="extrude"
          />
        </div>
      </div>
      <div class="boxchild">
        <button @click="startCross" class="tbtn tbn1" type="button">
          {{ Resource.clip }}
        </button>
        <button @click="clearCross" class="tbtn" type="button" style="margin-right: 2px;">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let screenSpaceEventHandler, dim, box, layers;
export default {
  name: "Sm3dClipCross",
  data() {
    return {
      sharedState: store.state,
      clipWidth: 5,
      clipHeight: 5,
      heading: 0,
      pitch: 0,
      roll: 0,
      extrude: 1,
      // screenSpaceEventHandler: null,
      startClip: false,
      hasClipped: false,
      boxPosition: null,
      // dim: null,
      // box: null,
      // layers: null,
      position: null,
      isDestroyFlag: true,
    };
  },
  computed: {
    clipCross: function () {
      return this.sharedState.clip[2];
    },
    clipShow: function () {
      return this.sharedState.toolBar[4];
    },
  },
  methods: {
    toggleVisibility() {
      this.show = !this.show;
    },
    start() {
      this.isDestroyFlag = false; //保留效果
      for (let layer of layers) {
        layer.selectEnabled = false;
      }
      this.boxPosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
      dim = new Cesium.Cartesian3(
        this.clipWidth,
        this.clipHeight,
        this.extrude
      );
      box = viewer.entities.add({
        // 标识盒
        id: "cross-clip-identify-box",
        position: this.boxPosition,
        show: false,
        box: {
          dimensions: new Cesium.Cartesian3(
            this.clipWidth,
            this.clipHeight,
            0.1
          ),
          fill: false,
          outline: true,
          outlineColor: Cesium.Color.AQUA,
          outlineWidth: 5.0,
        },
      });

      screenSpaceEventHandler.setInputAction((movement) => {
        if (this.startClip) {
          this.boxPosition = scene.pickPosition(movement.endPosition);
          let boxPosition = this.boxPosition;
          if (!boxPosition) {
            return;
          }
          box.position = boxPosition;
          let hpr = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(this.heading),
            Cesium.Math.toRadians(this.pitch),
            Cesium.Math.toRadians(this.roll)
          );
          let orientation = Cesium.Transforms.headingPitchRollQuaternion(
            boxPosition,
            hpr
          );
          box.orientation = orientation;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      screenSpaceEventHandler.setInputAction((evt) => {
        if (this.startClip) {
          this.position = scene.pickPosition(evt.position);
          if (!this.position) {
            return;
          }
          this.updateClip();
          this.startClip = false;
          this.hasClipped = true;
          box.show = false;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    startCross() {
      this.start();
      if (!viewer) {
        return;
      }
      for (let layer of layers) {
        layer.selectEnabled = false;
      }
      this.startClip = true;
      box.show = true;
    },
    clearCross() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      this.hasClipped = false;
      box && viewer.entities.removeById("cross-clip-identify-box");
      for (let layer of layers) {
        layer.clearCustomClipBox();
      }
    },

    updateClip() {
      for (let layer of layers) {
        layer.setCustomClipCross({
          position: this.position,
          dimensions: dim,
          heading: this.heading,
          pitch: this.pitch,
          roll: this.roll,
          extrudeDistance: Number(this.extrude),
        });
      }
    },
    init() {
      if (screenSpaceEventHandler) return;
      screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
        scene.canvas
      );
      layers = viewer.scene.layers.layerQueue;
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && layers) {
      screenSpaceEventHandler.destroy();
      layers = undefined;
      box = undefined;
      screenSpaceEventHandler = undefined;
      dim = undefined;
    }
  },
  mounted() {
    if (this.clipShow && this.clipCross) {
      this.init();
    }
  },

  watch: {
    clipCross(val) {
      if (val) {
        this.init();
      }
    },
    clipShow(val) {
      if (val && this.clipCross) {
        this.init();
      }
    },
    clipWidth(val) {
      this.clipWidth = Number(val);
      let temp_width = Number(val);
      if (temp_width <= 0 || !box) {
        return;
      }
      box.box.dimensions = new Cesium.Cartesian3(
        this.clipWidth,
        this.clipHeight,
        0.1
      );
      dim = new Cesium.Cartesian3(temp_width, this.clipHeight, this.extrude);
      if (this.hasClipped) {
        this.updateClip();
      }
    },
    clipHeight(val) {
      this.clipHeight = Number(val);
      let temp_height = Number(val);
      if (temp_height <= 0 || !box) {
        return;
      }
      box.box.dimensions = new Cesium.Cartesian3(
        this.clipWidth,
        temp_height,
        0.1
      );
      dim = new Cesium.Cartesian3(this.clipWidth, temp_height, this.extrude);
      if (this.hasClipped) {
        this.updateClip();
      }
    },
    pitch(val) {
      this.pitch = Number(val);
      if (val === "" || !box) {
        return;
      }
      let pitch = Number(val);
      let hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(this.heading),
        Cesium.Math.toRadians(pitch),
        Cesium.Math.toRadians(this.roll)
      );
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        this.boxPosition,
        hpr
      );
      box.orientation = orientation;
      if (this.hasClipped) {
        this.updateClip();
      }
    },
    roll(val) {
      this.roll = Number(val);
      if (val === "" || !box) {
        return;
      }
      let roll = Number(val);
      let hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(this.heading),
        Cesium.Math.toRadians(this.pitch),
        Cesium.Math.toRadians(roll)
      );
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        this.boxPosition,
        hpr
      );
      box.orientation = orientation;
      if (this.hasClipped) {
        this.updateClip();
      }
    },
    heading(val) {
      this.heading = Number(val);
      if (val === "" || !box) {
        return;
      }
      let heading = Number(val);
      let hpr = new Cesium.HeadingPitchRoll(
        Cesium.Math.toRadians(heading),
        Cesium.Math.toRadians(this.pitch),
        Cesium.Math.toRadians(this.roll)
      );
      let orientation = Cesium.Transforms.headingPitchRollQuaternion(
        this.boxPosition,
        hpr
      );
      box.orientation = orientation;
      if (this.hasClipped) {
        this.updateClip();
      }
    },
    extrude(val) {
      this.extrude = Number(val);
      let temp_extrudeDistance = Number(val);
      if (temp_extrudeDistance <= 0) {
        return;
      }
      if (this.hasClipped) {
        this.updateClip();
      }
    },
  },
};
</script>

