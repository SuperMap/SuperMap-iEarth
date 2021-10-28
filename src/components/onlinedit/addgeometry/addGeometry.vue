<template>
  <div class="sm-function-module-content" v-show="addGeometry">
    <label class="sm-function-module-sub-section-setting">{{
      Resource.symbolicLibrary
    }}</label>
    <div class="symbolicLibrary">
      <div
        class="Thematicbox"
        :class="{ lightSelected: GeometryType === 0 }"
        @click="GeometrySelectType(0)"
      >
        <div class="minbox">
          <span class="iconfont icontianjiazhuti"></span>
        </div>
        {{Resource.Cylinder}}
      </div>
      <div
        class="Thematicbox"
        :class="{ lightSelected: GeometryType === 1 }"
        @click="GeometrySelectType(1)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont icontianjiachangfangti"></span>
        </div>
        {{Resource.Cuboid}}
      </div>
      <div
        class="Thematicbox"
        :class="{ lightSelected: GeometryType === 2 }"
        @click="GeometrySelectType(2)"
      >
        <div class="minbox" id="directionalLight">
          <span class="iconfont icontianjiaqiuti"></span>
        </div>
        {{Resource.Ball}}
      </div>
      <div
        class="Thematicbox"
        :class="{ lightSelected: GeometryType === 3 }"
        @click="GeometrySelectType(3)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont icontianjiazhuiti"></span>
        </div>
        {{Resource.Cone}}
      </div>
    </div>
    <!-- 圆柱 -->
    <div v-show="GeometryType === 0">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.ShortHalfShaft}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="semiMinorAxis"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="semiMinorAxis"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.LongHalfShaft}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="semiMajorAxis"
            min="10"
            max="200"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="semiMajorAxis"
            min="10"
            max="200"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.StretchingHeight}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="extrudedHeight"
            min="10"
            max="100"
            step="10"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="extrudedHeight"
            min="10"
            max="100"
            step="10"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.Granularity}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="granularity"
            min="0.5"
            max="2"
            step="0.1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="granularity"
            min="0.5"
            max="2"
            step="0.1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.Spin}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="rotation"
            min="0"
            max="90"
            step="0.1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="rotation"
            min="0"
            max="90"
            step="0.1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section" >
        <label class="label-container">{{Resource.ThematicmapColor}}</label>
        <ColorPicker
          v-stopdrag
          class="sm-colorpicker half_color"
          editable
          v-model="cylinderColor" />
      </div>
    </div>
    <!-- 长方体 -->
    <div v-show="GeometryType === 1">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.length}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="boxLength"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="boxLength"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.width}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="boxWidth"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="boxWidth"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.height}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="boxHeight"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="boxHeight"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.ThematicmapColor}}</label>
        <ColorPicker
          v-stopdrag
          class="sm-colorpicker half_color"
          editable v-model="boxColor" />
      </div>
    </div>
    <!-- 球体 -->
    <div v-show="GeometryType === 2">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.Xradius}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="xRadii"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="xRadii"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.Yradius}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="yRadii"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="yRadii"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.Zradius}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="zRadii"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="zRadii"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.ThematicmapColor}}</label>
        <ColorPicker
          v-stopdrag
          class="sm-colorpicker half_color"
          editable
          v-model="ballColor" />
      </div>
    </div>
    <!-- 锥体 -->
    <div v-show="GeometryType === 3">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.length}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="cylinderLength"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="cylinderLength"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.BottomRadius}}</label>
        <div class="sm-solider-input-box">
          <input
            style="width:63%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
            class="min-solider"
            type="range"
            v-model="bottomRadius"
            min="10"
            max="100"
            step="1"
          />
          <input
            style="width: 34%; height: 25px;border-radius:3px;"
            class="min-solider"
            type="number"
            v-model="bottomRadius"
            min="10"
            max="100"
            step="1"
          />
        </div>
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{Resource.ThematicmapColor}}</label>
        <ColorPicker
          v-stopdrag
          class="sm-colorpicker half_color"
          editable
          v-model="coneColor" />
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{Resource.pattern}}</label>
      <select class="sm-select half_color" v-model="drawModle">
        <option value="0">{{Resource.LayerFillMode}}</option>
        <option value="1">{{Resource.LayerWireframeMode}}</option>
        <option value="2">{{Resource.LayerFillAndWireframeMode}}</option>
      </select>
    </div>
    <span class="media-hidden" style="font-size: 12px; width: 100%">{{
      Resource.EditingTips
    }}</span>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="drawGeometry">
        {{ Resource.draw }}
      </button>
      <button class="tbtn" type="button" @click="clearGeometry">
        {{ Resource.eliminate }}
      </button>
    </div>
  </div>
</template>

<script>
let targetEntity = null,
  handler;
export default {
  name: "AddGeometry",
  data() {
    return {
      sharedState: store.state,
      GeometryType: 0,
      isDestroyFlag: true,
      //   圆柱
      semiMinorAxis: 10,
      semiMajorAxis: 10,
      extrudedHeight: 50,
      granularity: 1,
      rotation: 0,
      cylinderColor: "#c8910a",
      //  长方体
      boxLength: 20,
      boxWidth: 20,
      boxHeight: 20,
      boxColor: "#120AC8",
      //   球体
      xRadii: 20,
      yRadii: 20,
      zRadii: 20,
      ballColor: "#c80a46",
      //
      cylinderLength: 40,
      bottomRadius: 20,
      coneColor: "#0AC8AE",

      drawModle: "0",
      fill: true,
      outline: false,
      index: null, //当前插入界面位置
    };
  },
  directives:{
    stopdrag:{
      inserted:function(el,binding){
        let element = el;
        element.onmousedown = function(e){
          e.stopPropagation();
        }
      }
    }
  },
  computed: {
    addGeometry: function () {
      return this.sharedState.onlineEdit[3];
    },
    onlineEditShow: function () {
      return this.sharedState.toolBar[8];
    },
  },

  mounted() {
    if (this.onlineEditShow && this.addGeometry) {
      this.init();
    }
  },
  methods: {
    GeometrySelectType(i) {
      this.GeometryType = i;
    },
    init() {
      if (!window.handlerPoint) {
        common.initHandler("Point");
      }
    },
    drawGeometry() {
      this.isDestroyFlag = false;
      common.handlerDrawing("Point").then((res) => {
        this.DrawUpdate(res.result.object._position);
        window.handlerPoint.deactivate();
      });
      window.handlerPoint && window.handlerPoint.activate();
    },
    DrawUpdate(position) {
      switch (this.GeometryType) {
        case 0:
          let cylinderColor = Cesium.Color.fromCssColorString(
            this.cylinderColor
          );
          viewer.entities.add({
            id: "Geometry-symbol-Cylinder-" + new Date().getTime(),
            position: position,
            ellipse: {
              semiMinorAxis: this.semiMinorAxis,
              semiMajorAxis: this.semiMajorAxis,
              height: 0,
              extrudedHeight: this.extrudedHeight,
              material: cylinderColor,
              granularity: parseFloat(
                this.granularity * Cesium.Math.RADIANS_PER_DEGREE
              ),
              rotation: this.rotation,
              fill: this.fill,
              outline: this.outline,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 4,
            },
          });
          break;
        case 1:
          let boxColor = Cesium.Color.fromCssColorString(this.boxColor);
          let boxLength = parseFloat(this.boxLength);
          let boxWidth = parseFloat(this.boxWidth);
          let boxHeight = parseFloat(this.boxHeight);
          viewer.entities.add({
            id: "Geometry-symbol-Box-" + new Date().getTime(),
            position: position,
            box: {
              dimensions: new Cesium.Cartesian3(boxLength, boxWidth, boxHeight),
              material: boxColor,
              fill: this.fill,
              outline: this.outline,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 4,
            },
          });
          break;
        case 2:
          let ballColor = Cesium.Color.fromCssColorString(this.ballColor);
          let xRadii = Number(this.xRadii);
          let yRadii = Number(this.yRadii);
          let zRadii = Number(this.zRadii);
          let posDeg = Cesium.Cartographic.fromCartesian(position);
          posDeg.height += zRadii;
          let p = Cesium.Cartesian3.fromRadians(
            posDeg.longitude,
            posDeg.latitude,
            posDeg.height
          );
          viewer.entities.add({
            id: "Geometry-symbol-Ellipsoid-" + new Date().getTime(),
            position: p,
            ellipsoid: {
              radii: new Cesium.Cartesian3(xRadii, yRadii, zRadii),
              material: ballColor,
              fill: this.fill,
              outline: this.outline,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 4,
            },
          });
          break;
        case 3:
          let coneColor = Cesium.Color.fromCssColorString(this.coneColor);
          let cylinderLength = Number(this.cylinderLength);
          let bottomRadius = Number(this.bottomRadius);
          viewer.entities.add({
            id: "Geometry-symbol-Cone-" + new Date().getTime(),
            position: position,
            cylinder: {
              length: cylinderLength,
              topRadius: 0.0,
              bottomRadius: bottomRadius,
              material: coneColor,
              fill: this.fill,
              outline: this.outline,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 4,
            },
          });
          break;
        default:
          break;
      }
    },
    clearGeometry() {
      if (viewer.selectedEntity) {
        if (
          viewer.selectedEntity.id &&
          viewer.selectedEntity.id.indexOf("Geometry-symbol") === 0
        ) {
          viewer.entities.removeById(viewer.selectedEntity.id);
        }
      }
      common.clearHandlerDrawing("Point");
    },
    // 切换模式
    changeModle(fill, outline) {
      if (viewer.selectedEntity) {
        if (
          viewer.selectedEntity.id &&
          viewer.selectedEntity.id.indexOf("Geometry-symbol") === 0
        ) {
          let geometryType;
          switch (this.GeometryType) {
            case 0:
              geometryType = "ellipse";
              break;
            case 1:
              geometryType = "box";
              break;
            case 2:
              geometryType = "ellipsoid";
              break;
            case 3:
              geometryType = "cylinder";
              break;
            default:
              geometryType = "ellipse";
              break;
          }
          viewer.selectedEntity[geometryType].fill = fill;
          viewer.selectedEntity[geometryType].outline = outline;
        }
      }
    },
  },

  watch: {
    onlineEditShow(val) {
      if (val && this.addGeometry) {
        this.init();
      }
    },
    addGeometry(val) {
      if (val && this.onlineEditShow) {
        this.init();
      }
    },

    cylinderColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cylinder") === 0
      ) {
        viewer.selectedEntity.ellipse.material = color;
      }
    },
    boxColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Box") === 0
      ) {
        viewer.selectedEntity.box.material = color;
      }
    },
    ballColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Ellipsoid") === 0
      ) {
        viewer.selectedEntity.ellipsoid.material = color;
      }
    },
    coneColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cone") === 0
      ) {
        viewer.selectedEntity.cylinder.material = color;
      }
    },

    semiMinorAxis(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cylinder") === 0
      ) {
        if (Number(val) <= Number(this.semiMajorAxis)) {
          viewer.selectedEntity.ellipse["semiMinorAxis"] = parseFloat(val);
        }
        else if(this.semiMajorAxis < 100 && Number(val) > Number(this.semiMajorAxis)){
          this.semiMinorAxis = this.semiMajorAxis;
        }
      }
    },
    semiMajorAxis(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cylinder") === 0
      ) {
        if (Number(val) >= Number(this.semiMajorAxis)) {
          viewer.selectedEntity.ellipse.semiMajorAxis = parseFloat(val);
        }
        else {
          this.semiMajorAxis = this.semiMinorAxis;
        }
      }
    },
    extrudedHeight(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cylinder") === 0
      ) {
        viewer.selectedEntity.ellipse.extrudedHeight = parseFloat(val);
      }
    },
    granularity(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cylinder") === 0
      ) {
        viewer.selectedEntity.ellipse.granularity =
          parseFloat(val) * Cesium.Math.RADIANS_PER_DEGREE;
      }
    },
    rotation(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cylinder") === 0
      ) {
        viewer.selectedEntity.ellipse.rotation = parseFloat(val);
      }
    },

    boxLength(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Box") === 0
      ) {
        viewer.selectedEntity.box.dimensions = new Cesium.Cartesian3(
          parseFloat(val),
          parseFloat(this.boxWidth),
          parseFloat(this.boxHeight)
        );
      }
    },
    boxWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Box") === 0
      ) {
        viewer.selectedEntity.box.dimensions = new Cesium.Cartesian3(
          parseFloat(this.boxLength),
          parseFloat(val),
          parseFloat(this.boxHeight)
        );
      }
    },
    boxHeight(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Box") === 0
      ) {
        viewer.selectedEntity.box.dimensions = new Cesium.Cartesian3(
          parseFloat(this.boxLength),
          parseFloat(this.boxWidth),
          parseFloat(val)
        );
      }
    },

    xRadii(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Ellipsoid") === 0
      ) {
        viewer.selectedEntity.ellipsoid.radii = new Cesium.Cartesian3(
          parseFloat(val),
          parseFloat(this.yRadii),
          parseFloat(this.zRadii)
        );
      }
    },
    yRadii(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Ellipsoid") === 0
      ) {
        viewer.selectedEntity.ellipsoid.radii = new Cesium.Cartesian3(
          parseFloat(this.xRadii),
          parseFloat(val),
          parseFloat(this.zRadii)
        );
      }
    },
    zRadii(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Ellipsoid") === 0
      ) {
        viewer.selectedEntity.ellipsoid.radii = new Cesium.Cartesian3(
          parseFloat(this.xRadii),
          parseFloat(this.yRadii),
          parseFloat(val)
        );
      }
    },

    cylinderLength(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cone") === 0
      ) {
        viewer.selectedEntity.cylinder.length = parseFloat(val);
      }
    },
    bottomRadius(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("Geometry-symbol-Cone") === 0
      ) {
        viewer.selectedEntity.cylinder.bottomRadius = parseFloat(val);
      }
    },

    drawModle(val) {
      switch (val) {
        case "0":
          this.fill = true;
          this.outline = false;
          this.changeModle(true, false);
          break;
        case "1":
          this.fill = false;
          this.outline = true;
          this.changeModle(false, true);
          break;
        case "2":
          this.fill = true;
          this.outline = true;
          this.changeModle(true, true);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
.Thematicbox {
  margin-right: 1rem;
}

.sm-input-long,
.sm-select,
.sm-colorpicker {
  width: 72%;
}

.sm-solider-input-box {
  float: right;
  width: 72%;
}

</style>
