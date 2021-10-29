<template>
  <div class="sm-function-module-content" v-show="addpolygon">
    <label class="sm-function-module-sub-section-setting">{{
      Resource.symbolicLibrary
    }}</label>
    <div class="symbolicLibrary">
      <div
        class="Thematicbox"
        :class="{ lightSelected: polygonType === 0 }"
        @click="polygonSelectType(0)"
      >
        <div id="pointLight" class="minbox">
          <span class="iconfont iconchunse"></span>
        </div>
        {{ Resource.pureColor }}
      </div>
      <div
        class="Thematicbox"
        :class="{ lightSelected: polygonType === 1 }"
        @click="polygonSelectType(1)"
      >
        <div class="minbox" id="spotLight">
          <span class="iconfont iconwangge"></span>
        </div>
        {{ Resource.gridding }}
      </div>
      <div
        class="Thematicbox"
        :class="{ lightSelected: polygonType === 2 }"
        @click="polygonSelectType(2)"
      >
        <div class="minbox" id="directionalLight">
          <span class="iconfont icontiaowen"></span>
        </div>
        {{ Resource.stripe }}
      </div>
    </div>
    <!-- 纯色 -->
    <div v-show="polygonType === 0">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.polygonSymbolColor }}</label>
        <ColorPicker v-stopdrag class="sm-colorpicker" editable v-model="SolidColor" />
      </div>
    </div>
    <!-- 网格 -->
    <div v-show="polygonType === 1">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.polygonSymbolColor }}</label>
        <ColorPicker v-stopdrag class="sm-colorpicker" editable v-model="gridColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolGridLineThickness
        }}</label>
        <input
          class="sm-input-long"
          min="1"
          step="1.0"
          type="number"
          v-model="gridWidth"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolGridLineCount
        }}</label>
        <input
          class="sm-input-long"
          min="2"
          step="1.0"
          type="number"
          v-model="gridCount"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolGridCellAlpha
        }}</label>
        <input
          class="sm-input-long"
          min="0.1"
          max="1"
          step="0.1"
          type="number"
          v-model="gridCellAlpha"
        />
      </div>
    </div>
    <!-- 条纹 -->
    <div v-show="polygonType === 2">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolStripeEvenColor
        }}</label>
        <ColorPicker
          v-stopdrag
          class="sm-colorpicker"
          editable
          v-model="StripeEvenColor"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolStripeOddColor
        }}</label>
        <ColorPicker v-stopdrag class="sm-colorpicker" editable v-model="StripeOddColor" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolStripeRepeat
        }}</label>
        <input
          class="sm-input-long"
          min="1"
          step="1.0"
          type="number"
          v-model="StripeRepeat"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolStripeOffset
        }}</label>
        <input
          class="sm-input-long"
          min="0"
          step="1.0"
          type="number"
          v-model="StripeOffset"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.polygonSymbolStripeOrientation
        }}</label>
        <select class="sm-select" id="stopList" v-model="StripeOrientation">
          <option value="0">{{ Resource.horizontal }}</option>
          <option value="1">{{ Resource.vertical }}</option>
        </select>
      </div>
    </div>
    <div class="sm-function-module-sub-section">
      <label class="label-container">{{ Resource.pattern }}</label>
      <select class="sm-select sm-select-s" v-model="drawModle">
        <option value="0">{{ Resource.Space }}</option>
        <option value="1">{{ Resource.Stick }}</option>
        <option value="2">{{ Resource.PostObject }}</option>
      </select>
    </div>
    <!-- editeditZ -->
    <div class="flexbox">
      <label class="sm-viewshed-label-right">{{ Resource.edit }}</label>
      <input type="checkbox" v-model="isEdit" />
      <label class="sm-viewshed-label-right">{{ Resource.editZ }}</label>
      <input type="checkbox" v-model="isEditZ" />
    </div>
    <span class="media-hidden" style="font-size: 12px; width: 100%">{{
        Resource.EditingTips
      }}</span>
    <div class="boxchild">
      <button class="tbtn tbn1" type="button" @click="drawPolygon">
        {{ Resource.draw }}
      </button>
      <button class="tbtn" type="button" @click="clearPolygon">
        {{ Resource.eliminate }}
      </button>
    </div>
  </div>
</template>

<script>
let currentPolygonSymbol;
export default {
  name: "addPolygon",
  data() {
    return {
      sharedState: store.state,
      polygonType: 0,
      isDestroyFlag: true,
      SolidColor: "#C8910A",
      gridColor: "#C8910A",
      gridWidth: 1,
      gridCount: 8,
      gridCellAlpha: 0.1,
      StripeEvenColor: "#C8910A",
      StripeOddColor: "#0A15C8",
      StripeRepeat: 12,
      StripeOffset: 0,
      StripeOrientation: "0",
      isEdit: false,
      isEditZ: false,
      EditPositions: [],
      drawModle: "0",
      perPositionHeight: true,
      height:undefined,
      classificationType: Cesium.ClassificationType.S3M_TILE,
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
    addpolygon: function () {
      return this.sharedState.onlineEdit[2];
    },
    onlineEditShow: function () {
      return this.sharedState.toolBar[8];
    },
    getIsEdit: function () {
      return this.sharedState.isEdit;
    },
    getIsEditZ: function () {
      return this.sharedState.isEditZ;
    },
  },
  mounted() {
    //   if (this.onlineEditShow && this.addpolyline) {
    //     this.init();
    //   }
  },
  methods: {
    polygonSelectType(i) {
      this.polygonType = i;
    },
    drawPolygon() {
      this.isDestroyFlag = false;
      if (!window.handlerPolygon) {
        common.initHandler("Polygon");
      }
      common.handlerDrawing("Polygon", 2).then(
        (res) => {
          this.positions = res.positions;
          let handlerPolygon = window.handlerPolygon;
          this.DrawPolygonUpdate(res.positions);
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          window.polylineTransparent.show = false; //半透线隐藏
          handlerPolygon.deactivate();
          if (this.isEdit) {
            common.Edit(this);
          }
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
    },
    DrawPolygonUpdate(position) {
      switch (this.polygonType) {
        case 0:
          let polygonSymbolPureColor = Cesium.Color.fromCssColorString(
            this.SolidColor
          );
          currentPolygonSymbol = viewer.entities.add({
            id: "polygon-symbol-pure-" + new Date().getTime(),
            polygon: {
              hierarchy: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              },
              material: polygonSymbolPureColor,
              perPositionHeight: this.perPositionHeight, //面贴地
              height:this.height
            },
            classificationType: this.classificationType, //面贴对象
          });
          break;
        case 1:
          let polygonSymbolGridColor = Cesium.Color.fromCssColorString(
            this.gridColor
          );
          let polygonSymbolGridCellAlpha = Number(this.gridCellAlpha);
          let polygonSymbolGridLineCount = Number(this.gridCount);
          let polygonSymbolGridLineThickness = Number(this.gridWidth);
          let polygonSymbolGridLineOffset = Number(this.gridCellAlpha);
          currentPolygonSymbol = viewer.entities.add({
            id: "polygon-symbol-grid-" + new Date().getTime(),
            polygon: {
              hierarchy: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              },
              material: new Cesium.GridMaterialProperty({
                color: polygonSymbolGridColor,
                cellAlpha: polygonSymbolGridCellAlpha,
                lineCount: new Cesium.Cartesian2(
                  polygonSymbolGridLineCount,
                  polygonSymbolGridLineCount
                ),
                lineThickness: new Cesium.Cartesian2(
                  polygonSymbolGridLineThickness,
                  polygonSymbolGridLineThickness
                ),
                lineOffset: new Cesium.Cartesian2(
                  polygonSymbolGridLineOffset,
                  polygonSymbolGridLineOffset
                ),
              }),
              perPositionHeight: this.perPositionHeight, //面贴地
              height:this.height
            },
            classificationType: this.classificationType, //面贴对象
          });
          break;
        case 2:
          let polygonSymbolStripeEvenColor = Cesium.Color.fromCssColorString(
            this.StripeEvenColor
          );
          let polygonSymbolStripeOddColor = Cesium.Color.fromCssColorString(
            this.StripeOddColor
          );
          let polygonSymbolStripeRepeat = Number(this.StripeRepeat);
          let polygonSymbolStripeOffset = Number(this.StripeOffset);
          let polygonSymbolStripeOrientation = Number(this.StripeOrientation);
          currentPolygonSymbol = viewer.entities.add({
            id: "polygon-symbol-stripe-" + new Date().getTime(),
            polygon: {
              hierarchy: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
              },
              material: new Cesium.StripeMaterialProperty({
                evenColor: polygonSymbolStripeEvenColor,
                oddColor: polygonSymbolStripeOddColor,
                repeat: polygonSymbolStripeRepeat,
                offset: polygonSymbolStripeOffset,
                orientation: polygonSymbolStripeOrientation,
              }),
              perPositionHeight: this.perPositionHeight, //面贴地
              height:this.height
            },
            classificationType: this.classificationType, //线面贴对象
          });
          break;
        default:
          break;
      }
    },

    clearPolygon() {
      if (window.editHandler) {
        if (
          window.editHandler._editObject &&
          window.editHandler._editObject.id.indexOf("polygon-symbol") === 0
        ) {
          viewer.entities.removeById(window.editHandler._editObject.id);
        }
      } else if (viewer.selectedEntity) {
        if (
          viewer.selectedEntity.id &&
          viewer.selectedEntity.id.indexOf("polygon-symbol") === 0
        ) {
          viewer.entities.removeById(viewer.selectedEntity.id);
        }
      }
      common.clearHandlerDrawing();
    },
    // 切换模式
    changeModle(perPositionHeight, height,classificationType) {
      if (window.editHandler) {
        if (
          window.editHandler._editObject &&
          window.editHandler._editObject.id.indexOf("polygon-symbol") === 0
        ) {
          window.editHandler._editObject.polygon.perPositionHeight = perPositionHeight;
          window.editHandler._editObject.polygon.height = height;
          window.editHandler._editObject.classificationType = classificationType;
        }
      } else if (viewer.selectedEntity) {
        if (
          viewer.selectedEntity.id &&
          viewer.selectedEntity.id.indexOf("polygon-symbol") === 0
        ) {
          viewer.selectedEntity.polygon.perPositionHeight = perPositionHeight;
          viewer.selectedEntity.polygon.height = height;
          viewer.selectedEntity.classificationType = classificationType;
        }
      }
    },
  },

  watch: {
    getIsEdit(val) {
      this.isEdit = val;
    },
    getIsEditZ(val) {
      this.isEditZ = val;
    },
    isEdit(val) {
      if (!this.addpolygon) {
        return;
      }
      if (val) {
        common.Edit(this);
      } else {
        common.clearEditHandler();
      }
      store.setIsEdit(val);
    },
    isEditZ(val) {
      if (!this.addpolygon) {
        return;
      }
      if (window.editHandler) {
        window.editHandler.isEditZ = val;
      }
      store.setIsEditZ(val);
    },
    SolidColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-pure") === 0
      ) {
        viewer.selectedEntity.polygon.material = color;
      }
    },
    gridColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.color = color;
      }
    },
    StripeEvenColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.evenColor = color;
      }
    },
    StripeOddColor(val) {
      let color = Cesium.Color.fromCssColorString(val);
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.oddColor = color;
      }
    },
    gridWidth(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.lineThickness = new Cesium.Cartesian2(
          Number(val),
          Number(val)
        );
      }
    },
    gridCount(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.lineCount = new Cesium.Cartesian2(
          Number(val),
          Number(val)
        );
      }
    },
    gridCellAlpha(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-grid") === 0
      ) {
        viewer.selectedEntity.polygon.material.cellAlpha = Number(val);
      }
    },
    StripeRepeat(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.repeat = Number(val);
      }
    },
    StripeOffset(val) {
      if (val == "" && Number(val) <= 0) return;
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.offset = Number(val);
      }
    },
    StripeOrientation(val) {
      if (
        viewer.selectedEntity &&
        viewer.selectedEntity.id &&
        viewer.selectedEntity.id.indexOf("polygon-symbol-stripe") === 0
      ) {
        viewer.selectedEntity.polygon.material.orientation = Number(val);
      }
    },
    drawModle(val) {
      switch (val) {
        case "0":
          this.perPositionHeight = true;
          this.height = undefined;
          this.classificationType = undefined;
          this.changeModle(true, this.height,undefined);
          break;
        case "1":
          this.perPositionHeight = false;
          this.height = 2;
          this.classificationType = Cesium.ClassificationType.TERRAIN;
          this.changeModle(false, this.height,Cesium.ClassificationType.TERRAIN);
          break;
        case "2":
          this.perPositionHeight = false;
          this.height = undefined;
          this.classificationType = Cesium.ClassificationType.S3M_TILE;
          this.changeModle(undefined, this.height,Cesium.ClassificationType.S3M_TILE);
          break;
        default:
          this.perPositionHeight = true;
          this.height = undefined;
          this.classificationType = undefined;
          this.changeModle(true, this.height,undefined);
          break;
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
@import "addPolygon";
</style>
