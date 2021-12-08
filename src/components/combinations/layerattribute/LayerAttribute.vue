<template>
  <div>
    <div id="LayerAttribute" class="sm-panel" v-if="LayerAttributeShow" v-drag>
      <div class="sm-content">
        <div class="sm-panel-header">
          <span
            :class="{titleColor:basicOptions}"
            class="layerTitle-txt"
            @click="choose(0)"
          >{{Resource.basicOptions}}</span>
          <span
            :class="{titleColor:styleSetting}"
            class="layerTitle-txt"
            @click="choose(1)"
          >{{Resource.styleSetting}}</span>
          <span
            :class="{titleColor:LayerOperation}"
            class="layerTitle-txt"
            @click="choose(2)"
          >{{Resource.LayerOperation}}</span>
          <!--<span :class="{titleColor:Thematicmap}" class="title-txt" @click="choose(3)">{{Resource.Thematicmap}}</span>-->
          <span class="closeBtn" @click="toggleVisibility">&times;</span>
        </div>

        <!-- 调用子组件 -->
        <div v-show="basicOptions">
          <div class="sm-function-module-content">
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.layerName}}</label>
              <input class="sm-input-long layerwidth" disabled type="text" v-model="layerName" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.shadowMode}}</label>
              <select class="sm-select" v-model="shadowType">
                <option value="noShadow">{{Resource.noShadow}}</option>
                <!--<option value="chooseShadow">{{Resource.setSelectionShadow}}</option>-->
                <option value="allShadow">{{Resource.setShadow}}</option>
              </select>
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.shadowDarkness}}</label>
              <div class="sm-solider-input-box lodbox">
                <input
                  class="min-solider"
                  type="range"
                  v-model="shadowDarkness"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  style="width:77%;
                       background-color:rgb(51,51,51);
                       border:1px solid #686363;
                       padding:0px 3px;
                       height:25px;
                       border-radius:0px;float:right;"
                />
              </div>
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.visibility}}</label>
              <select class="sm-select" v-model="visibility">
                <option value="onlyShowSlection">{{Resource.onlyShowSlection}}</option>
                <option value="onlyHideSlection">{{Resource.onlyHideSlection}}</option>
                <option value="showAll">{{Resource.showAll}}</option>
              </select>
            </div>

            <div class="flexbox">
              <label class="sm-viewshed-label-right">{{Resource.display}}</label>
              <input style="margin-left: 10px" type="checkbox" v-model="display" />
              <label style="width:21%"></label>
              <label class="sm-viewshed-label-right">{{Resource.cullEnabled}}</label>
              <input style="margin-left: 10px" type="checkbox" v-model="cullEnabled" />
            </div>
            <div class="flexbox">
              <label class="sm-viewshed-label-right">{{Resource.multiSelection}}</label>
              <input style="margin-left: 10px" type="checkbox" v-model="multiChoose" />
              <label style="width:21%"></label>
              <label class="sm-viewshed-label-right">{{Resource.downloadAtt}}</label>
              <input style="margin-left: 10px" type="checkbox" v-model="downloadAtt" />
            </div>
            <div class="flexbox">
              <label class="sm-viewshed-label-right">{{Resource.bReleaseColor}}</label>
              <input style="margin-left: 10px" type="checkbox" v-model="breleaseColor" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.visibleDistanceMin}}</label>
              <input class="sm-input-long" min="0" type="number" v-model="minVisibleH" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.visibleDistanceMax}}</label>
              <input class="sm-input-long" min="0" type="number" v-model="maxVisibleH" />
            </div>
          </div>
        </div>

        <div v-show="styleSetting">
          <div class="sm-function-module-content">
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.foreColor}}</label>
              <ColorPicker class="sm-colorpicker" editable v-model="foreColor" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.lineColor}}</label>
              <ColorPicker class="sm-colorpicker" editable v-model="lineColor" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.selectColor}}</label>
              <ColorPicker class="sm-colorpicker" editable v-model="selectColor" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.selectColorType}}</label>
              <select class="sm-select" v-model="selectColorType">
                <option value="0">{{Resource.mix}}</option>
                <option value="1">{{Resource.replace}}</option>
              </select>
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.bottomAltitude}}</label>
              <input class="sm-input-long" min="0" type="number" v-model="bottomAltitude" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">LOD ：</label>
              <div class="sm-solider-input-box lodbox">
                <input
                  class="min-solider"
                  type="range"
                  v-model="LODScale"
                  min="0.1"
                  max="10"
                  step="0.5"
                  style="width:77%;
                       background-color: rgb(51,51,51);
                       border:1px solid rgb(87,93,96);
                       padding:0px 3px;
                       height:25px;
                       border-radius:0px;float:right;"
                />
              </div>
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.fillStyle}}</label>
              <select class="sm-select" v-model="fillStyle">
                <option value="fill">{{Resource.fillMode}}</option>
                <option value="wireframe">{{Resource.lineMode}}</option>
                <option value="fill-and-wireframe">{{Resource.fillAndLine}}</option>
              </select>
            </div>

            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.modelTransparency}}</label>
              <input
                class="sm-input-long"
                min="0"
                max="1.0"
                step="0.01"
                type="number"
                v-model="modelTransparency"
              />
            </div>
            <div class="boxchild">
              <button class="tbtn right" type="button" @click="clearModification">{{Resource.home}}</button>
            </div>
          </div>
        </div>

        <div v-show="LayerOperation" class="LayerOperation">
          <div class="layerscroll">
            <div class="sm-point"></div>
            <label
              class="sm-function-module-sub-section-setting"
            >{{Resource.ObliquePhotographyExcavation}}</label>
            <div class="boxchild">
              <button
                class="tbtn tbn1"
                type="button"
                @click="excavationRegion"
              >{{Resource.ExecuteExcavation}}</button>
              <button
                class="tbtn"
                type="button"
                @click="delExcavationRegion"
              >{{Resource.ClearExcavation}}</button>
            </div>
            <div class="sm-point"></div>
            <label
              class="sm-function-module-sub-section-setting"
            >{{Resource.ObliquePhotographyFlatten}}</label>
            <div class="boxchild">
              <button
                class="tbtn tbn1"
                type="button"
                @click="flattenRegion"
              >{{Resource.ModelFlatten}}</button>
              <button class="tbtn" type="button" @click="delFlattenRegion">{{Resource.ClearFlatten}}</button>
            </div>
            <div class="sm-point"></div>
            <label class="sm-function-module-sub-section-setting">{{Resource.FloodAnalysis}}</label>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.MaxHeight}}</label>
              <input class="sm-input-long" min="0" type="number" v-model="MaxHeight" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.MinHeight}}</label>
              <input class="sm-input-long" min="0" type="number" v-model="MinHeight" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.FloodSpeed}}</label>
              <input class="sm-input-long" min="0" type="number" v-model="FloodSpeed" />
            </div>
            <div class="boxchild">
              <button class="tbtn tbn1" type="button" @click="modelFlood">{{Resource.ExecuteFlood}}</button>
              <button class="tbtn" type="button" @click="ModelFloodClear">{{Resource.ClearFlood}}</button>
            </div>
            <div class="sm-point"></div>
            <label class="sm-function-module-sub-section-setting">{{Resource.SelectOffset}}</label>
            <br />
            <label class="label-container">{{Resource.OpenSelectOffset}}</label>
            <input style="margin-left: 10px" type="checkbox" v-model="offset" />
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.OffsetX}}</label>
              <input
                class="sm-input-long"
                min="-50"
                max="50"
                step="1"
                type="number"
                v-model="offsetX"
              />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.OffsetY}}</label>
              <input
                class="sm-input-long"
                min="-50"
                max="50"
                step="1"
                type="number"
                v-model="offsetY"
              />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.offsetZ}}</label>
              <input
                class="sm-input-long"
                min="-50"
                max="50"
                step="1"
                type="number"
                v-model="offsetZ"
              />
            </div>
            <div class="boxchild">
              <button class="tbtn right" type="button" @click="clearOffset">{{Resource.ClearFlood}}</button>
            </div>

            <label class="sm-function-module-sub-section-setting">{{Resource.LayerColor}}</label>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.brightness}}</label>
              <input
                class="sm-input-long"
                min="0"
                max="3"
                step="0.1"
                type="number"
                v-model="brightness"
              />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.contrast}}</label>
              <input
                class="sm-input-long"
                min="0"
                max="5"
                step="0.1"
                type="number"
                v-model="contrast"
              />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.hue}}</label>
              <input class="sm-input-long" min="0" max="5" step="0.1" type="number" v-model="hue" />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.saturation}}</label>
              <input
                class="sm-input-long"
                min="0"
                max="50"
                step="1"
                type="number"
                v-model="saturation"
              />
            </div>

            <label class="sm-function-module-sub-section-setting">{{Resource.PolygonOffset}}</label>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.PolygonOffsetFactor}}</label>
              <input
                class="sm-input-long"
                min="-100"
                max="100"
                step="1"
                type="number"
                v-model="PolygonOffsetFactor"
              />
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.PolygonOffsetUnit}}</label>
              <input
                class="sm-input-long"
                min="-100"
                max="100"
                step="1"
                type="number"
                v-model="PolygonOffsetUnit"
              />
            </div>

            <div class="sm-point"></div>
            <label class="sm-function-module-sub-section-setting">{{Resource.StereographicDrawing}}</label>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.maxHeight}}</label>
              <div class="sm-solider-input-box" style="width:73%;">
                <input
                  class="min-solider"
                  min="0"
                  max="500"
                  step="10"
                  style="width:70%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                  type="range"
                  v-model="StereographicmaxHeight"
                />
                <input
                  class="min-solider"
                  min="0"
                  max="500"
                  step="10"
                  style="width:25%;border-radius:3px;float:right;"
                  type="number"
                  v-model="StereographicmaxHeight"
                />
              </div>
            </div>
            <div class="sm-function-module-sub-section">
              <label class="label-container">{{Resource.maxDistance}}</label>
              <div class="sm-solider-input-box" style="width:73%;">
                <input
                  class="min-solider"
                  min="0"
                  max="100"
                  step="10"
                  style="width:70%;background-color:rgba(51,51,51,1);border:1px solid rgb(87,93,96);padding:0 3px;height:25px;border-radius:3px;"
                  type="range"
                  v-model="StereographicmaxDistance"
                />
                <input
                  class="min-solider"
                  min="0"
                  max="100"
                  step="10"
                  style="width:25%;border-radius:3px;float:right;"
                  type="number"
                  v-model="StereographicmaxDistance"
                />
              </div>
            </div>
            <div class="boxchild">
              <button
                class="tbtn right"
                type="button"
                style="color:#009c95;border:1px solid #009c95;"
                @click="assignRange"
              >{{Resource.assignRange}}</button>
              <button
                class="tbtn right"
                type="button"
                style="color:#009c95;border:1px solid #009c95;"
                @click="stereographicDrawing"
              >{{Resource.StereographicDrawing}}</button>
              <button
                class="tbtn right"
                type="button"
                @click="clearStereographic"
              >{{Resource.clear}}</button>
            </div>
          </div>
        </div>

        <!--<div v-show="Thematicmap" id="Thematicmap">-->
        <!--<div class="sm-function-module-content">-->
        <!--<label class="sm-function-module-sub-section-setting">{{Resource.symbolicLibrary}}</label>-->
        <!--<div class="symbolicLibrary">-->
        <!--<div class="Thematicbox">-->
        <!--<div id="color" class="minbox polygon-symbol-font-selected"-->
        <!--:class="{ lightSelected: thematicMapType === 'color' }"-->
        <!--@click="thematicType(0)">-->
        <!--<span class="iconfont iconchunse"></span>-->
        <!--<div style="margin-top:-8px;">{{Resource.ThematicmapColor}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="Thematicbox">-->
        <!--<div class="minbox" id="img"-->
        <!--:class="{ lightSelected: thematicMapType === 'img' }"-->
        <!--@click="thematicType(1)">-->
        <!--<span class="iconfont icontiaowen"></span>-->
        <!--<div style="margin-top:-8px;"> {{Resource.ThematicmapImage}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="sm-function-module-sub-section" v-show="thematicMapType=='color'">-->
        <!--<label class="label-container">{{Resource.ThematicmapColor}}</label>-->
        <!--<ColorPicker class="sm-colorpicker" editable v-model="ThematicColor" />-->
        <!--</div>-->
        <!--<div class="sm-function-module-sub-section" v-show="thematicMapType=='img'">-->
        <!--<label class="label-container">{{Resource.ImageData}}</label>-->
        <!--<input class="sm-input" type="file" accept=".jpg, .png" id="file" />-->
        <!--</div>-->
        <!--<div class="boxchild">-->
        <!--<button class="tbtn tbn1" type="button" @click="setThematicmap">{{Resource.Setting}}</button>-->
        <!--<button class="tbtn" type="button" @click="delAllThematicmap">{{Resource.clear}}</button>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
let offsetScreenSpaceEventHandler, hyp, timer, colorTable, facade, handlerLine;
// let handlerClick;
export default {
  name: "LayerAttribute",
  data() {
    return {
      sharedState: store.state,
      //base
      shadowType: "noShadow",
      shadowDarkness: 0.3,
      visibility: "showAll",
      display: true, //可显示
      multiChoose: false, //多选择
      cullEnabled: false,
      breleaseColor: true,
      downloadAtt: false, //属性下载
      minVisibleH: 0.0,
      maxVisibleH: this.maxVisibleHeight,
      //2
      foreColor: "#ffffff",
      lineColor: "rgb(67,67,67)",
      bottomAltitude: 0,
      LODScale: 5,
      fillStyle: "fill-and-wireframe",
      lineMode: "triangle",
      modelTransparency: 1.0,
      selectColorType: 0,
      selectColor: "#A40FF4",

      //3
      MaxHeight: 71,
      MinHeight: 1,
      FloodSpeed: 1,
      offset: false,
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
      brightness: 1,
      contrast: 1,
      hue: 0,
      saturation: 1,
      PolygonOffsetFactor: 0,
      PolygonOffsetUnit: 0,
      StereographicmaxDistance: 100,
      StereographicmaxHeight: 500

      // ThematicColor: "#D38E14",
      // thematicMapType: "color",
    };
  },

  computed: {
    isInitViewer: function() {
      return this.sharedState.isInitViewer;
    },
    basicOptions: function() {
      return this.sharedState.LayerAttribute[0];
    },
    styleSetting: function() {
      return this.sharedState.LayerAttribute[1];
    },
    LayerOperation: function() {
      return this.sharedState.LayerAttribute[2];
    },
    // Thematicmap: function () {
    //   return this.sharedState.LayerAttribute[3];
    // },
    LayerAttributeShow: function() {
      return this.sharedState.LayerAttributeToolbar;
    },
    //base
    selectedLayer: function() {
      let name = this.sharedState.selectedLayerName;
      let layer = viewer.scene.layers.find(name);
      // this.downloadAtt = layer.indexedDBSetting.isAttributesSave;
      return layer;
    },
    layerName: function() {
      this.downloadAtt = this.selectedLayer.indexedDBSetting.isAttributesSave;
      return this.sharedState.selectedLayerName;
    },
    maxVisibleHeight: function() {
      return Number.MAX_VALUE;
    }
  },

  mounted() {
    // this.init();
  },

  methods: {
    init() {
      // if (handlerClick) {
      //   return;
      // }
      // let that = this;
    },
    toggleVisibility() {
      //控制组件界面隐
      store.setLayerAttributeToolbal(false);
    },    
    clearModification() {
      this.selectedLayer.style3D.fillForeColor = Cesium.Color.fromCssColorString(
        "#ffffff"
      );
      this.selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
        "rgb(67,67,67)"
      );
      this.selectedLayer.lodRangeScale = parseFloat(5);
      if (
        this.selectedLayer.style3D.fillStyle ===
        Cesium.FillStyle.Fill_And_WireFrame
      ) {
        this.selectedLayer.style3D.fillStyle =
          Cesium.FillStyle.Fill_And_WireFrame;
        this.selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
          "rgb(67,67,67)"
        );
        this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Sketch; //草图模式,即线框
      } else {
        this.selectedLayer.style3D.fillStyle = Cesium.FillStyle.Fill;
      }

      this.selectedLayer.style3D.fillForeColor.alpha = parseFloat(1.0);
      this.selectedLayer.style3D.bottomAltitude = parseInt(0);
      this.selectedLayer.selectColorType = Number(0);
      this.selectedLayer.selectedColor = Cesium.Color.fromCssColorString(
        "#A40FF4"
      );

      this.foreColor = "#ffffff";
      this.lineColor = "rgb(67,67,67)";
      this.bottomAltitude = 0;
      this.LODScale = 5;
      this.fillStyle = "fill-and-wireframe";
      this.modelTransparency = 1.0;
      this.selectColorType = 0;
      this.selectColor = "#A40FF4";
    },
    choose(i) {
      // 验证是否为点击事件，是则继续执行click事件，否则不执行
      let isClick = document
        .getElementById("LayerAttribute")
        .getAttribute("data-flag");
      if (isClick !== "true") {
        return false;
      }
      switch (i) {
        case 0:
          store.setLayerAttribute([1, 0, 0, 0]);
          break;
        case 1:
          store.setLayerAttribute([0, 1, 0, 0]);
          break;
        case 2:
          store.setLayerAttribute([0, 0, 1, 0]);
          break;
        case 3:
          store.setLayerAttribute([0, 0, 0, 1]);
          break;
        default:
          store.setLayerAttribute([1, 0, 0, 0]);
      }
    },
    //子组件部分
    //倾斜挖掘
    excavationRegion() {
      if (!window.handlerPolygon) {
        common.initHandler("Polygon");
      }
      common.handlerDrawing("Polygon").then(
        res => {
          let handlerPolygon = window.handlerPolygon;
          this.selectedLayer.addExcavationRegion({
            position: res.positions,
            name: "excavation_" + Math.random()
          });
          window.handlerPolygon.polygon.show = false;
          window.handlerPolygon.deactivate();
        },
        err => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
    },
    delExcavationRegion() {
      this.selectedLayer.removeAllExcavationRegion();
      common.clearHandlerDrawing("Polygon");
    },
    flattenRegion() {
      if (!window.handlerPolygon) {
        common.initHandler("Polygon");
      }
      common.handlerDrawing("Polygon").then(
        res => {
          let handlerPolygon = this.handlerPolygon;
          this.selectedLayer.addFlattenRegion({
            position: res.positions,
            name: "flatten" + Math.random()
          });
          window.handlerPolygon.polygon.show = false;
          window.handlerPolygon.deactivate();
        },
        err => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
    },
    delFlattenRegion() {
      this.selectedLayer.removeAllFlattenRegion();
      common.clearHandlerDrawing("Polygon");
    },
    //淹没模型
    modelFlood() {
      if (hyp) return;
      this.initFlood().then(res => {
        this.startAnalysis(res);
      });
    },
    initFlood() {
      return new Promise(resolve => {
        hyp = new Cesium.HypsometricSetting();
        colorTable = new Cesium.ColorTable();
        colorTable.insert(71, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(0, new Cesium.Color(149 / 255, 232 / 255, 249 / 255));
        hyp.ColorTable = colorTable;
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        hyp.Opacity = 0.7;
        hyp.LineInterval = 10.0;
        let hasInitialized = true;
        resolve(hasInitialized);
      });
    },

    startAnalysis(res) {
      if (!res) {
        this.initFlood();
      }
      let currentHeight = 0;
      currentHeight = parseInt(this.MinHeight);
      timer = window.requestAnimationFrame(() => {
        this.floodTimer(currentHeight);
      });
    },
    floodTimer(currentHeight) {
      // let timer = this.timer;
      let maxHeight = parseInt(this.MaxHeight);
      if (currentHeight >= maxHeight) {
        window.cancelAnimationFrame(timer);
        timer = null;
        return;
      }
      // let hyp = this.hyp;
      if (!hyp) {
        return;
      }
      let minHeight = parseInt(this.MinHeight);
      let speed = parseInt(this.FloodSpeed);
      hyp.MaxVisibleValue = currentHeight;
      hyp.MinVisibleValue = minHeight;
      this.selectedLayer.hypsometricSetting = {
        hypsometricSetting: hyp,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
      };
      currentHeight += speed / 20;
      timer = window.requestAnimationFrame(() => {
        this.floodTimer(currentHeight);
      });
    },
    ModelFloodClear() {
      window.cancelAnimationFrame(timer);
      if (!hyp) {
        return;
      }
      hyp.MaxVisibleValue = -100;
      this.selectedLayer.hypsometricSetting = {
        hypsometricSetting: hyp,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
      };
      colorTable.clear();
      colorTable.destroy();
      colorTable = undefined;
      hyp.destroy();
      hyp = null;
    },
    assignRange() {
      facade = new Cesium.Facade(scene);
      facade.build();

      handlerLine = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Line,
        Cesium.ClampMode.S3mModel
      );
      handlerLine.drawEvt.addEventListener(function(result) {
        let startPoint = result.object.positions[0];
        let endPoint = result.object.positions[1];
        facade.startPoint = startPoint;
        facade.endPoint = endPoint;
      });

      handlerLine.activate();
    },
    stereographicDrawing() {
      let that = this;
      facade.readyPromise.then(function(base64data) {
        that.download(base64data);
      });
    },
    download(base64data) {
      let that = this;
      let image = new Image();
      image.src = base64data;
      image.onload = function() {
        let canvas = that.convertImageToCanvas(image);
        let url = canvas.toDataURL("image/jpeg");
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = new Date().getTime() + ".jpg"; // 指定下载图片的名称
        a.href = url;
        a.dispatchEvent(event); // 触发超链接的点击事件
      };
    },
    convertImageToCanvas(image) {
      let canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);
      return canvas;
    },
    clearStereographic() {
      facade.clear();
      handlerLine.clear();
    },
    //4
    // thematicType(i) {
    //   if (i == 0) {
    //     document
    //       .getElementById("img")
    //       .classList.remove("polygon-symbol-font-selected");
    //     document
    //       .getElementById("color")
    //       .classList.add("polygon-symbol-font-selected");
    //     this.thematicMapType = "color";
    //   } else {
    //     document
    //       .getElementById("img")
    //       .classList.add("polygon-symbol-font-selected");
    //     document
    //       .getElementById("color")
    //       .classList.remove("polygon-symbol-font-selected");
    //     this.thematicMapType = "img";
    //   }
    // },
    // setThematicmap() {
    //   switch (this.thematicMapType) {
    //     case "color":
    //       let size = viewer.scene.layers._layerQueue.length;
    //       for (let i = 0; i < size; i++) {
    //         let curlayer = viewer.scene.layers.findByIndex(i);
    //         curlayer.themeStyle = this.colorByID();
    //         curlayer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
    //         curlayer.style3D.lineColor = Cesium.Color.fromCssColorString("rgb(67,67,67)");
    //         curlayer.wireFrameMode = Cesium.WireFrameType.Sketch;
    //       }
    //       break;
    //     case "img":
    //       let size2 = viewer.scene.layers._layerQueue.length;
    //       for (let i = 0; i < size2; i++) {
    //         let curlayer = viewer.scene.layers.findByIndex(i);
    //         curlayer.themeStyle = this.imageByID();
    //       }
    //       break;
    //   }
    // },
    // colorByID() {
    //   let cesiumStyle = new Cesium.Cesium3DTileStyle({
    //     color: {
    //       conditions: this.GetcolorConditions(),
    //     },
    //   });
    //   return cesiumStyle;
    // },
    // imageByID() {
    //   let cesiumStyle = new Cesium.Cesium3DTileStyle({
    //     image: {
    //       conditions: this.GetimageConditions(),
    //     },
    //   });
    //   return cesiumStyle;
    // },
    // GetcolorConditions() {
    //   let colorConditions = [];
    //   let colorValue1 = "rgb(45, 0, 75, 0.5)";
    //   let colorValue2 = "rgb(102, 71, 151)";
    //   let colorValue3 = "rgb(170, 162, 204)";
    //   let colorValue4 = "rgb(224, 226, 238)";
    //   let colorValue5 = "rgb(252, 230, 200)";
    //   let colorValue6 = "rgb(127, 59, 8)";
    //   let colorValues = [
    //     colorValue1,
    //     colorValue2,
    //     colorValue3,
    //     colorValue4,
    //     colorValue5,
    //   ];
    //   for (let i = 1; i < 6; i++) {
    //     let condition = [];
    //     let idKey = "${id} === '" + i + "'";
    //     let colorKey = colorValues[i % 5];
    //     condition.push(idKey);
    //     condition.push(colorKey);
    //     colorConditions.push(condition);
    //   }
    //   colorConditions.push(["true", colorValue6]);
    //   return colorConditions;
    // },
    //
    // GetimageConditions() {
    //   let imageConditions = [];
    //   let imageUrl1 = '"static/images/cesiumStyleImages/1.jpg"';
    //   let imageUrl2 = '"static/images/cesiumStyleImages/2.jpg"';
    //   let imageUrl3 = '"static/images/cesiumStyleImages/3.jpg"';
    //   let imageUrl4 = '"static/images/cesiumStyleImages/4.jpg"';
    //   let imageUrl5 = '"static/images/cesiumStyleImages/5.jpg"';
    //   let imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
    //   for (let i = 1; i < 6; i++) {
    //     let condition = [];
    //     let idKey = "${id} === '" + i + "'";
    //     let imageKey = imageUrls[i % 5];
    //     condition.push(idKey);
    //     condition.push(imageKey);
    //     imageConditions.push(condition);
    //   }
    //   return imageConditions;
    // },
    // delAllThematicmap() {
    //   let size = scene.layers._layerQueue.length;
    //   for (let i = 0; i < size; i++) {
    //     let curlayer = scene.layers.findByIndex(i);
    //     if (curlayer.themeStyle) {
    //       curlayer.themeStyle =new Cesium.Cesium3DTileStyle({
    //         color:{
    //           conditions:[['true','rgb(255,255,255)']]
    //         }
    //       });
    //
    //      curlayer.style3D.lineColor =Cesium.Color.fromCssColorString("rgb(67,67,67)");
    //      curlayer.wireFrameMode = Cesium.WireFrameType.Sketch; //草图模式,即线框
    //      curlayer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
    //     }
    //   }
    // },
    isOpenShadow(val) {
      viewer.scene.globe.enableLighting = val;
      viewer.shadows = val;
    },
    clearOffset() {
      this.offset = false;
      this.offsetX = 0;
      this.offsetY = 0;
      this.offsetZ = 0;
      this.selectedLayer.removeAllObjsTranslate();
    }
  },

  watch: {
    shadowType: function(val) {
      let selectedLayer = this.selectedLayer;
      switch (val) {
        case "noShadow":
          this.isOpenShadow(false);
          selectedLayer.shadowType = 0;
          break;
        case "allShadow":
          this.isOpenShadow(true);
          selectedLayer.shadowType = 2;
          selectedLayer.refresh();
          break;
        default:
          null;
          break;
      }
    },
    shadowDarkness: function(val) {
      viewer.shadowMap.darkness = Number(val);
    },
    visibility: function(val) {
      let selectedLayer = this.selectedLayer;
      switch (val) {
        case "showAll":
          selectedLayer.setObjsVisible([], false);
          break;
        case "onlyHideSlection":
          let chooseIDs = selectedLayer.getSelection();
          selectedLayer.setObjsVisible(chooseIDs, false);
          break;
        case "onlyShowSlection":
          let chooseIDs2 = selectedLayer.getSelection();
          selectedLayer.setObjsVisible(chooseIDs2, true);
          break;
        default:
          null;
          break;
      }
    },
    display: function(val) {
      this.selectedLayer.visible = val;
    },
    multiChoose: function(val) {
      this.selectedLayer.multiChoose = val;
    },
    cullEnabled: function(val) {
      this.selectedLayer.cullEnabled = val;
    },
    downloadAtt: function(val) {
      this.selectedLayer.indexedDBSetting.isAttributesSave = val; //保存属性 = val;
    },
    minVisibleH: function(val) {
      if (val == "") {
        val = 0.0;
      }
      this.selectedLayer.visibleDistanceMin = Number(val);
    },
    maxVisibleH: function(val) {
      if (val == "") {
        val = this.maxNumber;
      }
      this.selectedLayer.visibleDistanceMax = Number(val);
    },

    //2
    foreColor: function(val) {
      this.selectedLayer.style3D.fillForeColor = Cesium.Color.fromCssColorString(
        val
      );
    },
    lineColor: function(val) {
      this.selectedLayer.style3D.lineColor = Cesium.Color.fromCssColorString(
        val
      );
    },
    bottomAltitude: function(val) {
      if (val === "" || val < 0) {
        return;
      }
      this.selectedLayer.style3D.bottomAltitude = parseInt(val);
      this.selectedLayer.refresh();
    },
    LODScale: function(val) {
      this.selectedLayer.lodRangeScale = parseFloat(val);
    },
    fillStyle: function(val) {
      switch (val) {
        case "fill":
          this.selectedLayer.style3D.fillStyle = Cesium.FillStyle.Fill;
          this.selectedLayer.refresh();
          break;
        case "wireframe":
          this.selectedLayer.style3D.fillStyle = Cesium.FillStyle.WireFrame;
          break;
        case "fill-and-wireframe":
          this.selectedLayer.style3D.fillStyle =
            Cesium.FillStyle.Fill_And_WireFrame;
          break;
        default:
          break;
      }
    },
    lineMode: function(val) {
      switch (val) {
        case "triangle":
          this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Triangle;
          break;
        case "quad":
          this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Quad;
          break;
        case "sketch":
          this.selectedLayer.wireFrameMode = Cesium.WireFrameType.Sketch;
          break;
        default:
          break;
      }
    },
    modelTransparency: function(val) {
      this.selectedLayer.style3D.fillForeColor.alpha = parseFloat(val);
    },
    selectColorType: function(val) {
      this.selectedLayer.selectColorType = Number(val);
    },
    selectColor: function(val) {
      this.selectedLayer.selectedColor = Cesium.Color.fromCssColorString(val);
    },

    //3
    offset: function(val) {
      if (val) {
        let xOffset = Number(this.offsetX);
        let yOffset = Number(this.offsetY);
        let zOffset = Number(this.offsetZ);
        let selectedLayer = this.selectedLayer;
        selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
        selectedLayer.selectColorType = 1.0; // 替换模式
        offsetScreenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
        );
        offsetScreenSpaceEventHandler.setInputAction(() => {
          selectedLayer.removeAllObjsOffset(); // 移除所有图元的偏移
          if (selectedLayer.getSelection().length > 0) {
            let selectedId = Number(selectedLayer.getSelection()[0]);
            selectedLayer.setObjsOffset([selectedId]);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      } else {
        let selectedLayer = this.selectedLayer;
        offsetScreenSpaceEventHandler.destroy();
        offsetScreenSpaceEventHandler = undefined;
        selectedLayer.selectedTranslate = new Cesium.Cartesian3(0, 0, 0);
        selectedLayer.removeAllObjsOffset();
        selectedLayer.selectColorType = 0.0; // 混合模式
        selectedLayer.releaseSelection(); // 释放选择集
      }
    },
    offsetX: function(val) {
      if (this.offset) {
        let xOffset = Number(val);
        let yOffset = Number(this.offsetY);
        let zOffset = Number(this.offsetZ);
        this.selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
      }
    },
    offsetZ: function(val) {
      if (this.offset) {
        let xOffset = Number(this.offsetX);
        let yOffset = Number(this.offsetY);
        let zOffset = Number(val);
        this.selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
      }
    },
    offsetY: function(val) {
      if (this.offset) {
        let xOffset = Number(this.offsetX);
        let yOffset = Number(val);
        let zOffset = Number(this.offsetZ);
        this.selectedLayer.selectedTranslate = new Cesium.Cartesian3(
          xOffset,
          yOffset,
          zOffset
        );
      }
    },
    brightness: function(val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.brightness = Number(val);
    },
    contrast: function(val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.contrast = Number(val);
    },
    hue: function(val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.hue = Number(val);
    },
    saturation: function(val) {
      if (val === "") {
        return;
      }
      this.selectedLayer.saturation = Number(val);
    },
    LayerOperation: function(val) {
      if (val) {
        this.brightness = this.selectedLayer.brightness;
        this.contrast = this.selectedLayer.contrast;
        this.hue = this.selectedLayer.hue;
        this.saturation = this.selectedLayer.saturation;
      }
    },
    PolygonOffsetFactor: function(val) {
      if (val === "") {
        return;
      }
      let polygonOffsetFactor = Number(val);
      let polygonOffsetUnit = Number(this.PolygonOffsetUnit);
      this.selectedLayer.setPolygonoffset(
        polygonOffsetFactor,
        polygonOffsetUnit
      );
    },
    PolygonOffsetUnit: function(val) {
      if (val === "") {
        return;
      }
      let polygonOffsetFactor = Number(this.polygonOffsetFactor);
      let polygonOffsetUnit = Number(val);
      this.selectedLayer.setPolygonoffset(
        polygonOffsetFactor,
        polygonOffsetUnit
      );
    },
    StereographicmaxDistance: function(val) {
      facade.maxDistance = Number(val);
    },
    StereographicmaxHeight: function(val) {
      facade.maxHeight = Number(val);
    },
    LayerAttributeShow: function(val) {
      if (val) {
        this.init();
      }
    }
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
      // if (handlerClick) handlerClick = undefined;
    }
  }
};
</script>
<style lang="scss"  scoped>
@import "LayerAttribute";
</style>
