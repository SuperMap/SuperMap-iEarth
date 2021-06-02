<template>
  <div v-show="clipBoxByedit">
    <div class="sm-function-module-content">
      <div class="sm-function-module-sub-section">
        <label class="sm-function-module-sub-section-caption">{{
          Resource.polygonClipMode
        }}</label>
        <select
          class="sm-select"
          id="fillOptions"
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
        <button @click="BoxClipByEitor" class="tbtn tbn1" type="button">
          {{ Resource.clip }}
        </button>
        <button @click="clearBoxClipByEitor" class="tbtn" type="button" style="margin-right: 0px;">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let editorBox, layers, handlerBox, tooltip, boxEntity;
export default {
  name: "Sm3dClipBoxByeditor",
  data() {
    return {
      ClipModels: [
        {
          id: "clip_behind_all_plane",
          name: Resource.PolygonClipInside,
        },
        {
          id: "clip_behind_any_plane",
          name: Resource.PolygonClipOutside,
        },
      ],
      ClipModelSelected: "clip_behind_all_plane",
      isDestroyFlag: true,
      sharedState: store.state,
    };
  },
  computed: {
    clipBoxByedit: function () {
      return this.sharedState.clip[0];
    },
    clipShow: function () {
      return this.sharedState.toolBar[4];
    },
  },
  methods: {
    // Box裁剪
    BoxClipByEitor() {
      this.clearBoxClipByEitor();
      this.isDestroyFlag = false; //保留效果
      viewer.scene.pickTranslucentDepth = false;
      if (editorBox) {
        handlerBox.activate();
        return;
      }
      // 设置裁剪线颜色
      this.setAllLayersClipColor();
      let clipMode = this.ClipModelSelected;
      //交互绘制box
      handlerBox.movingEvt.addEventListener((windowPosition) => {
        if (handlerBox.isDrawing) {
          tooltip.showAt(
            windowPosition,
            "<p>点击鼠标左键结束矩形绘制，移动鼠标绘制box高度。</p><p>右键结束绘制.</p>"
          );
        } else {
          tooltip.showAt(
            windowPosition,
            "<p>点击鼠标左键，开始绘制矩形作为box底面</p>"
          );
        }
      });
      handlerBox.drawEvt.addEventListener((e) => {
        boxEntity = e.object;
        let newDim = boxEntity.box.dimensions.getValue();
        let position = boxEntity.position.getValue(0);
        let boxOption = {
          dimensions: newDim,
          position: position,
          clipMode: clipMode,
          heading: 0,
        };

        //box编辑
        editorBox = new Cesium.BoxEditor(viewer, boxEntity);
        editorBox.editEvt.addEventListener((e) => {
          boxEntity.box.dimensions = e.dimensions;
          boxEntity.position = e.position;
          boxEntity.orientation = e.orientation;
          this.setClipBox();
        });
        editorBox.activate();
        this.setAllLayersClipOptions(boxOption);
        tooltip.setVisible(false);
        handlerBox.clear();
        handlerBox.deactivate();
      });
      handlerBox.activate();
    },
    setClipBox() {
      var clipMode = this.ClipModelSelected;
      if (typeof boxEntity == "undefined") {
        return;
      }
      let newDim = boxEntity.box.dimensions.getValue();
      let position = boxEntity.position.getValue(0);

      let heading = 0;
      if (typeof boxEntity.orientation != "undefined") {
        let rotationM3 = Cesium.Matrix3.fromQuaternion(
          boxEntity.orientation._value,
          new Cesium.Matrix3()
        );
        let localFrame = Cesium.Matrix4.fromRotationTranslation(
          rotationM3,
          Cesium.Cartesian3.ZERO,
          new Cesium.Matrix4()
        );
        let inverse = Cesium.Matrix4.inverse(
          Cesium.Transforms.eastNorthUpToFixedFrame(position),
          new Cesium.Matrix4()
        );
        let hprm = Cesium.Matrix4.multiply(
          inverse,
          localFrame,
          new Cesium.Matrix4()
        );
        let rotation = Cesium.Matrix4.getMatrix3(hprm, new Cesium.Matrix3());
        let hpr = Cesium.HeadingPitchRoll.fromQuaternion(
          Cesium.Quaternion.fromRotationMatrix(rotation)
        );
        heading = hpr.heading;
      }
      let boxOptions = {
        dimensions: newDim,
        position: position,
        clipMode: clipMode,
        heading: heading,
      };
      this.setAllLayersClipOptions(boxOptions);
    },

    clearBoxClipByEitor() {
      this.isDestroyFlag = true; //摧毁标志，释放内存
      if (handlerBox) {
        handlerBox.deactivate();
        tooltip.setVisible(false);
      }
      if (!boxEntity) {
        return;
      }
      for (let layer of layers) {
        layer.clearCustomClipBox();
      }
      boxEntity = undefined;
      editorBox.deactivate();
      viewer.entities.removeAll();
      handlerBox.clear();
      viewer.scene.pickTranslucentDepth = true;
    },

    setAllLayersClipOptions(boxOptions) {
      for (var i = 0, j = layers.length; i < j; i++) {
        layers[i].setCustomClipBox(boxOptions);
      }
    },

    setAllLayersClipColor() {
      for (let i = 0, j = layers.length; i < j; i++) {
        layers[i].selectEnabled = false;
        layers[i].clipLineColor = new Cesium.Color(1, 1, 1, 0);
      }
    },

    init() {
      if (handlerBox) return;
      layers = viewer.scene.layers.layerQueue;
      tooltip = createTooltip(document.body);
      handlerBox = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Box);
    },
  },
  beforeDestroy() {
    if (this.isDestroyFlag && handlerBox) {
      if (editorBox) {
        editorBox.destroy();
      }
      editorBox = undefined;
      layers = undefined;
      handlerBox = undefined;
      tooltip = undefined;
      boxEntity = undefined;
    }
  },
  mounted() {
    if (this.clipShow && this.clipBoxByedit) {
      this.init();
    }
  },
  watch: {
    clipBoxByedit(val) {
      if (val) {
        this.init();
      }
    },
    clipShow(val) {
      if (val && this.clipBoxByedit) {
        this.init();
      }
    },
    ClipModelSelected(val) {
      if (boxEntity) {
        this.setClipBox();
      }
    },
  },
};
</script>

