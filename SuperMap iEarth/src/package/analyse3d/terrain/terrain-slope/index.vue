<template>
  <!-- 坡度坡向 -->
  <div class="row-item">
    <span>分析区域</span>
    <n-select
      size="small"
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.analysisArea"
      :options="state.options_region"
    />
  </div>

  <div class="row-item">
    <span>最小坡度</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.wideMinR"
        style="width: 70%"
        :min="0"
        :max="90"
        :step="1"
      />
      <div class="row-slider-num">{{ state.wideMinR }} <span> °</span></div>
    </div>
  </div>

  <div class="row-item">
    <span>最大坡度</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.wideMaxR"
        style="width: 70%"
        :min="0"
        :max="90"
        :step="1"
      />
      <div class="row-slider-num">{{ state.wideMaxR }} <span> °</span></div>
    </div>
  </div>

  <div class="row-item">
    <span>显示模式</span>
    <n-select
      size="small"
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.displayMode"
      :options="state.options_display"
    />
  </div>

  <div class="row-item">
    <span>透明度</span>
    <div class="slider-box">
      <n-slider
        v-model:value="state.trans"
        style="width: 70%"
        :min="0"
        :max="1"
        :step="0.1"
      />
      <div class="row-slider-num">{{ state.trans * 100 }} <span> %</span></div>
    </div>
  </div>

  <div class="row-item">
    <span>编辑分析区域</span>
    <n-checkbox
      style="width: 1.96rem;height: 0.32rem;"
      v-model:checked="state.isEdit"
    ></n-checkbox>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="startSlope"
      style="margin-right: 0.1rem"
      >分析</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";

type stateType = {
  analysisArea: string, //分析区域
  displayMode: string, //显示模式
  wideMaxR: number, //最大坡度
  wideMinR: number, //最小坡度
  trans: number, //透明度
  isEdit: boolean, //是否编辑
  colorTableValue: any,// 颜色表
  options_region:any, // 分析区域选项
  options_display:any, // 显示模式选项
  colorOptions:any, // 色带选项
}

// 设置默认值数据
let state = reactive<stateType>({
  analysisArea: "ARM_REGION", //分析区域
  displayMode: "FACE_AND_ARROW", //显示模式
  wideMaxR: 90, //最大坡度
  wideMinR: 0, //最小坡度
  trans: 0.8, //透明度
  isEdit: false, //是否编辑
  colorTableValue: null,
  options_region: [
    {
      label: () => "指定区域参与分析",
      value: "ARM_REGION",
    },
    {
      label: () => "所有区域参与分析",
      value: "ARM_ALL",
    },
    {
      label: () => "没有区域参与分析",
      value: "ARM_NONE",
    },
  ],
  options_display: [
    {
      label: () => "箭头和面显示",
      value: "FACE_AND_ARROW",
    },
    {
      label: () => "面显示",
      value: "FACE",
    },
    {
      label: () => "箭头显示",
      value: "ARROW",
    },
  ],
  colorOptions: [
    {
      label: "1-2",
      value: 1,
    },
    {
      label: "2-3",
      value: 2,
    },
    {
      label: "3-4",
      value: 3,
    },
  ],
});

// 初始化数据
let editHandler;
let slope = new SuperMap3D.SlopeSetting(); //分析对象
let wide =
  SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode[state.analysisArea]; //默认分析区域值
let colorTable = new SuperMap3D.ColorTable(); //颜色
let slopePosition, handlerPolygon; //保存当前分析区域
colorTable.insert(80, new SuperMap3D.Color(255 / 255, 0 / 255, 0 / 255));
colorTable.insert(50, new SuperMap3D.Color(221 / 255, 224 / 255, 7 / 255));
colorTable.insert(30, new SuperMap3D.Color(20 / 255, 187 / 255, 18 / 255));
colorTable.insert(20, new SuperMap3D.Color(0, 161 / 255, 1));
colorTable.insert(0, new SuperMap3D.Color(9 / 255, 9 / 255, 255 / 255));

slope.DisplayMode = SuperMap3D.SlopeSettingEnum.DisplayMode[state.displayMode]; //显示模式
slope.MaxVisibleValue = state.wideMaxR;
slope.MinVisibleValue = state.wideMinR;
slope.ColorTable = colorTable;
slope.Opacity = state.trans;

// 开始坡度分析
function startSlope() {
  if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let positions = tool.CartesiantoDegrees(res.object.positions);
      slopeUpdate(positions);
      slopePosition = positions;
      if (state.isEdit) setEditHandler(handlerPolygon.polygon,slopeUpdate);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}
// 更新
function slopeUpdate(p:any) {
  slope.CoverageArea = p;
  viewer.scene.globe.SlopeSetting = {
    slopeSetting: slope,
    analysisMode:
      SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
  };
}
// 启动编辑
function setEditHandler(entity: any, callback?: any) {
  handlerPolygon.polygon.show = true;
  if (!editHandler) {
    editHandler = new SuperMap3D.EditHandler(viewer, entity);
    editHandler.activate();
    editHandler.changedEvt.addEventListener(() => {
      let editPositions = tool.CartesiantoDegrees(editHandler._positions);
      callback(editPositions);
    })
  } else {
    // editHandler.deactivate();
    editHandler.setEditObject(entity);
  }
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  if (editHandler) editHandler.clear();
  viewer.scene.globe.SlopeSetting = {
    analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE,
  };
  slopePosition = undefined;
  // handlerPolygon.polygon.show = false;
  //           handlerPolygon.polyline.show = false;
  // clearEditHandler("Polygon");
}

//监听
watch(
  () => state.analysisArea,
  (val) => {
    switch (val) {
      case "ARM_REGION":
        wide = SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
        break;
      case "ARM_ALL":
        wide = SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
        break;
      case "ARM_NONE":
        wide = SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
        break;
      default:
        break;
    }

    viewer.scene.globe.SlopeSetting = {
      slopeSetting: slope,
      analysisMode: wide,
    };
  }
);

watch(
  () => state.wideMaxR,
  (val) => {
    if(state.wideMaxR<state.wideMinR) state.wideMaxR = state.wideMinR + 1;
    slope.MaxVisibleValue = Math.floor(val);
    if (slopePosition)
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: wide,
      };
  }
);
watch(
  () => state.wideMinR,
  (val) => {
    if(state.wideMinR>state.wideMaxR) state.wideMinR = state.wideMaxR - 1;
    slope.MinVisibleValue = Math.floor(val);
    if (slopePosition)
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: wide,
      };
  }
);

watch(
  () => state.displayMode,
  (val) => {
    switch (val) {
      case "FACE":
        slope.DisplayMode = SuperMap3D.SlopeSettingEnum.DisplayMode.FACE;
        break;
      case "ARROW":
        slope.DisplayMode = SuperMap3D.SlopeSettingEnum.DisplayMode.ARROW;
        break;
      case "FACE_AND_ARROW":
        slope.DisplayMode =
          SuperMap3D.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
        break;
      default:
        break;
    }
    if (slopePosition) slopeUpdate(slopePosition);
  }
);

watch(
  () => state.trans,
  () => {
    slope.Opacity = state.trans;
    if (slopePosition)
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: wide,
      };
  }
);
watch(
  () => state.isEdit,
  (val) => {
    if (val) {
      if (handlerPolygon && handlerPolygon.polygon)
        setEditHandler(handlerPolygon.polygon, slopeUpdate);
    } else if (editHandler) editHandler.clear();
  }
);

watch(
  () => state.colorTableValue,
  (val) => {
    if (!val) return;

    colorTable.remove(0);
    colorTable.remove(20);
    colorTable.remove(30);
    colorTable.remove(50);
    colorTable.remove(80);
    switch (val) {
      case 0:
        colorTable.insert(0, new SuperMap3D.Color(9 / 255, 9 / 255, 255 / 255));
        colorTable.insert(20, new SuperMap3D.Color(0, 161 / 255, 1));
        colorTable.insert(
          30,
          new SuperMap3D.Color(20 / 255, 187 / 255, 18 / 255)
        );
        colorTable.insert(
          50,
          new SuperMap3D.Color(221 / 255, 224 / 255, 7 / 255)
        );
        colorTable.insert(
          80,
          new SuperMap3D.Color(255 / 255, 0 / 255, 0 / 255)
        );
        break;
      case 1:
        colorTable.insert(
          0,
          new SuperMap3D.Color(162 / 255, 251 / 255, 194 / 255)
        );
        colorTable.insert(
          20,
          new SuperMap3D.Color(180 / 255, 200 / 255, 170 / 255)
        );
        colorTable.insert(
          30,
          new SuperMap3D.Color(200 / 255, 160 / 255, 130 / 255)
        );
        colorTable.insert(
          50,
          new SuperMap3D.Color(225 / 255, 130 / 255, 130 / 255)
        );
        colorTable.insert(80, new SuperMap3D.Color(1, 103 / 255, 103 / 255));
        break;
      case 2:
        colorTable.insert(0, new SuperMap3D.Color(230 / 255, 198 / 255, 1));
        colorTable.insert(20, new SuperMap3D.Color(210 / 255, 150 / 255, 1));
        colorTable.insert(30, new SuperMap3D.Color(190 / 255, 100 / 255, 1));
        colorTable.insert(50, new SuperMap3D.Color(165, 50 / 255, 1));
        colorTable.insert(80, new SuperMap3D.Color(157 / 255, 0, 1));
        break;
      case 3:
        colorTable.insert(0, new SuperMap3D.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(20, new SuperMap3D.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(
          30,
          new SuperMap3D.Color(70 / 255, 116 / 255, 200 / 255)
        );
        colorTable.insert(
          50,
          new SuperMap3D.Color(149 / 255, 232 / 255, 249 / 255)
        );
        colorTable.insert(
          80,
          new SuperMap3D.Color(149 / 255, 232 / 255, 249 / 255)
        );
        break;
      case 4:
        colorTable.insert(0, new SuperMap3D.Color(186 / 255, 1, 190 / 255));
        colorTable.insert(20, new SuperMap3D.Color(186 / 255, 1, 180 / 255));
        colorTable.insert(
          30,
          new SuperMap3D.Color(106 / 255, 255 / 255, 170 / 255)
        );
        colorTable.insert(
          50,
          new SuperMap3D.Color(26 / 255, 255 / 255, 160 / 255)
        );
        colorTable.insert(
          80,
          new SuperMap3D.Color(26 / 255, 255 / 255, 156 / 255)
        );
        break;
      default:
        break;
    }
    slope.ColorTable = colorTable;
    viewer.scene.globe.SlopeSetting = {
      slopeSetting: slope,
      analysisMode: wide,
    };
  }
);
// 销毁
onBeforeUnmount(() => {
  slope.destroy();
  colorTable.destroy();
  slope = undefined;
  colorTable = undefined;
});
</script>
