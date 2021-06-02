<template>
  <div v-show="isoline">
    <div class="function-content IsolineConent">
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.MaximumVisibleElevation
        }}</label>
        <input
          class="sm-input-long"
          min="0"
          type="number"
          v-model="fillMaxHeight"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{
          Resource.MinimumVisibleElevation
        }}</label>
        <input
          class="sm-input-long"
          min="0"
          type="number"
          v-model="fillMinHeight"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.isolineInterval }}</label>
        <input
          class="sm-input-long"
          min="0"
          type="number"
          v-model="equivalentIsoline"
        />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.LineColorSetting }}</label>
        <ColorPicker class="sm-colorpicker" editable v-model="color" />
      </div>
      <div class="sm-function-module-sub-section">
        <label class="label-container">{{ Resource.displayMode }}</label>
        <select
          class="sm-select"
          id="fillOptions"
          v-model="fillOptionsSelected"
        >
          <option
            :value="Options.id"
            v-for="Options in fillOptions"
            :key="Options.id"
          >
            {{ Options.name }}
          </option>
        </select>
      </div>
      <label class="sm-viewshed-label-right">{{ Resource.edit }}</label>
      <input style="margin-left: 10px" type="checkbox" v-model="isEdit" />
      <div class="boxchild">
        <button @click="isoLine" class="tbtn tbn1" type="button">
          {{ Resource.analyze }}
        </button>
        <button @click="clearIsoLine" class="tbtn right" type="button">
          {{ Resource.eliminate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let hyp, colorTableIsoline;
export default {
  name: "Sm3dTerrainIsoline",
  data() {
    return {
      sharedState: store.state,
      // 等值线
      fillOptions: [
        {
          id: "Line",
          name: Resource.ContourFilling,
        },
        {
          id: "Region",
          name: Resource.panelFilling,
        },
        {
          id: "Line_Region",
          name: Resource.ContourPanelFilling,
        },
        {
          id: "None",
          name: Resource.noColorTable,
        },
      ],
      fillMaxHeight: 9000,
      fillMinHeight: 0.0,
      equivalentIsoline: 100.0,
      fillOptionsSelected: "",
      // hyp: {},
      color: "#ff8040",
      DisplayModeHyp: Number,
      //编辑功能
      isEditZ: false,
      isEdit: false,
      EditPositions: [],
      isDestroyFlag: true,
    };
  },
  computed: {
    isoline: function () {
      return this.sharedState.terrain[3];
    },
    terrainShow: function () {
      return this.sharedState.toolBar[5];
    },
  },
  methods: {
    // 等值线
    isoLine() {
      this.isDestroyFlag = false; //保留效果
      //默认参数配置
      hyp.DisplayMode = this.DisplayModeHyp;
      hyp._lineColor = Cesium.Color.fromCssColorString(this.color);
      hyp.LineInterval = parseFloat(this.equivalentIsoline);
      hyp.MaxVisibleValue = parseFloat(this.fillMaxHeight);
      hyp.MinVisibleValue = parseFloat(this.fillMinHeight);
      hyp.ColorTableMinKey = 2736.88110351563;
      hyp.ColorTableMaxKey = 5597.06640625;
      hyp.ColorTable = colorTableIsoline;
      hyp.Opacity = 0.4;
      this.positions = [];

      common.handlerDrawing("Polygon").then(
        (res) => {
          this.positions = res.positions;
          let handlerPolygon = window.handlerPolygon;
          //分析区域为指定区域
          hyp.CoverageArea = res.positions;
          viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting: hyp,
            analysisMode:
              Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
          };
          handlerPolygon.polygon.show = false;
          handlerPolygon.polyline.show = false;
          handlerPolygon.deactivate();
          if (this.isEdit) {
            common.Edit(this, this.judge, "Polygon");
          }
        },
        (err) => {
          console.log(err);
        }
      );
      window.handlerPolygon.activate();
      if (!scene.pickPositionSupported) {
        alert("不支持深度纹理,无法绘制多边形，等值线功能无法使用！");
      }
    },
    clearIsoLine() {
      this.positions = [];
      viewer.scene.globe.HypsometricSetting = undefined;
      hyp && (hyp.MaxVisibleValue = -1000);
      hyp && (hyp.MinVisibleValue = -1000);
      common.clearHandlerDrawing("Polygon");
      common.clearEditHandler("Polygon");
      this.isDestroyFlag = true; //摧毁标志，释放内存
    },
    //动态更新地形
    judge(p) {
      if (this.positions) {
        if (this.positions.length == 0) {
          return;
        }
        if (p) {
          hyp.CoverageArea = p;
        }
        viewer.scene.globe.HypsometricSetting = {
          hypsometricSetting: hyp,
          analysisMode:
            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
        };
      }
    },
    init() {
      // 等值线
      if (hyp) {
        return;
      }
      hyp = new Cesium.HypsometricSetting();
      colorTableIsoline = new Cesium.ColorTable();
      this.fillOptionsSelected = this.fillOptions[0].id;
      this.DisplayModeHyp = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
      //建立颜色表
      let colorTable = colorTableIsoline;
      colorTable.insert(5597.06640625, new Cesium.Color(0, 0, 255 / 255));
      colorTable.insert(
        5406.3873860677086,
        new Cesium.Color(0, 51 / 255, 255 / 255)
      );
      colorTable.insert(
        5215.7083658854172,
        new Cesium.Color(0, 102 / 255, 255 / 255)
      );
      colorTable.insert(
        5025.0293457031257,
        new Cesium.Color(0, 153 / 255, 255 / 255)
      );
      colorTable.insert(
        4834.3503255208343,
        new Cesium.Color(0, 204 / 255, 255 / 255)
      );
      colorTable.insert(
        4643.6713053385429,
        new Cesium.Color(0, 255 / 255, 255 / 255)
      );
      colorTable.insert(
        4452.9922851562524,
        new Cesium.Color(51 / 255, 255 / 255, 204 / 255)
      );
      colorTable.insert(
        4262.3132649739609,
        new Cesium.Color(102 / 255, 255 / 255, 153 / 255)
      );
      colorTable.insert(
        4071.6342447916695,
        new Cesium.Color(153 / 255, 255 / 255, 102 / 255)
      );
      colorTable.insert(
        3880.9552246093781,
        new Cesium.Color(204 / 255, 255 / 255, 51 / 255)
      );
      colorTable.insert(
        3690.2762044270867,
        new Cesium.Color(255 / 255, 255 / 255, 0)
      );
      colorTable.insert(
        3499.5971842447952,
        new Cesium.Color(255 / 255, 204 / 255, 0)
      );
      colorTable.insert(
        3308.9181640625038,
        new Cesium.Color(255 / 255, 153 / 255, 0)
      );
      colorTable.insert(
        3118.2391438802129,
        new Cesium.Color(255 / 255, 102 / 255, 0)
      );
      colorTable.insert(
        2927.5601236979214,
        new Cesium.Color(255 / 255, 51 / 255, 0)
      );
      colorTable.insert(2736.88110351563, new Cesium.Color(255 / 255, 0, 0));
    },
  },

  beforeDestroy() {
    if (this.isDestroyFlag && hyp) {
      hyp.destroy();
      colorTableIsoline.destroy();
      hyp = undefined;
      colorTableIsoline = undefined;
    }
  },

  mounted() {
    if (this.terrainShow && this.isoline) {
      this.init();
    }
  },
  watch: {
    // 编辑
    isoline(val) {
      if (val) {
        this.init();
      }
      if (val && this.isEdit) {
        common.Edit(this, this.judge, this.positions, "Polygon");
      } else {
        if (window.handlerPolygon) {
          if (window.handlerPolygon.polygon) {
            window.handlerPolygon.polygon.show = false;
          }
        }
        if (window.editHandler) {
          window.editHandler.deactivate();
        }
        if (window.selectHandler) {
          window.selectHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_UP
          );
          window.selectHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
          );
        }
      }
    },
    terrainShow(val) {
      if (val && this.isoline) {
        this.init();
      }
    },
    isEdit(val) {
      //编辑
      if (val) {
        common.Edit(this, this.judge, "Polygon");
      } else {
        common.clearEditHandler("Polygon");
        if (window.handlerPolygon.polygon) {
          window.handlerPolygon.polygon.show = false;
        }
      }
    },
    // 等值线
    fillMaxHeight(val) {
      hyp.MaxVisibleValue = parseFloat(val);
      this.judge();
    },
    fillMinHeight(val) {
      hyp.MinVisibleValue = parseFloat(val);
      this.judge();
    },
    equivalentIsoline(val) {
      hyp.LineInterval = parseFloat(val);
      this.judge();
    },
    color(val) {
      this.color = val;
      hyp._lineColor = Cesium.Color.fromCssColorString(this.color);
      this.judge();
    },
    fillOptionsSelected(val) {
      this.fillOptionsSelected = val;
      switch (this.fillOptionsSelected) {
        case "None":
          {
            viewer.scene.globe.HypsometricSetting = undefined;
            this.DisplayModeHyp = undefined;
          }
          break;
        case "Line":
          {
            this.DisplayModeHyp =
              Cesium.HypsometricSettingEnum.DisplayMode.LINE;
          }
          break;
        case "Region":
          {
            this.DisplayModeHyp =
              Cesium.HypsometricSettingEnum.DisplayMode.FACE;
          }
          break;
        case "Line_Region":
          {
            this.DisplayModeHyp =
              Cesium.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
          }
          break;
        default:
          break;
      }
      hyp.DisplayMode = this.DisplayModeHyp;
      this.judge();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "TerrainIsoLine";
</style>




