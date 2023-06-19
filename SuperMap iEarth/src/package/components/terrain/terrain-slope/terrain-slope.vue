<template>
  <!-- 坡度坡向 -->
  <n-space vertical>
    <!-- 分析区域 -->
    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.AnalysisArea }}</template>
      <template #item-content>
        <n-select
          size="small"
          v-model:value="state.analysisArea"
          :options="state.options1"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>{{ locale.DisplayMode }}</template>
      <template #item-content>
        <n-select
          size="small"
          v-model:value="state.displayMode"
          :options="state.options2"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>颜色条带</template>
      <template #item-content>
        <n-select
          size="small"
          v-model:value="state.colorTableValue"
          :options="state.colorOptions"
        />
      </template>
    </sm-rowLayOut>

    <!-- 最大坡度 -->
    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="2.05rem"
      slotType="slider"
    >
      <template #item-lable>{{ locale.MaxSlope }}</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.wideMaxR"
          style="width: 70%"
          :min="0"
          :max="90"
          :step="1"
          :format-tooltip="(value) => `${value}°`"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.wideMaxR }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="2.05rem"
      slotType="slider"
    >
      <template #item-lable>{{ locale.MinSlope }}</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.wideMinR"
          style="width: 70%"
          :min="0"
          :max="90"
          :step="1"
          :format-tooltip="(value) => `${value}°`"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.wideMinR }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut
      lableWidth="0.6rem"
      marginbottom="0.15rem"
      contentWidth="2.05rem"
      slotType="slider"
    >
      <template #item-lable>{{ locale.Transparency }}</template>
      <template #item-content-slider>
        <n-slider
          v-model:value="state.trans"
          style="width: 70%"
          :min="0"
          :max="100"
        />
        <div style="font-size: 0.12rem; margin-left: 0.12rem">
          {{ state.trans }}
        </div>
      </template>
    </sm-rowLayOut>

    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="startSlope"
          >分析</n-button
        >
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">清除</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>
<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import initHandler from "@/tools/drawHandler";
import tool from "@/tools/tool";
import locale from "@/tools/locateTemp";

// 设置默认值数据
let state = reactive({
  analysisArea: "ARM_REGION", //分析区域
  displayMode: "FACE_AND_ARROW", //显示模式
  wideMaxR: 90, //最大坡度
  wideMinR: 0, //最小坡度
  trans: 0.8, //透明度
  isEdit: false, //是否编辑
  colorTableValue: null,
  options1: [
    {
      label: () => locale.SpecifyPolygon,
      value: "ARM_REGION",
    },
    {
      label: () => locale.AllRegions,
      value: "ARM_ALL",
    },
    {
      label: () => locale.NoRegions,
      value: "ARM_NONE",
    },
  ],
  options2: [
    {
      label: () => locale.ArrowAndFaceDisplay,
      value: "FACE_AND_ARROW",
    },
    {
      label: () => locale.FaceDisplay,
      value: "FACE",
    },
    {
      label: () => locale.ArrowDisplay,
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
let slope = new Cesium.SlopeSetting(); //分析对象
let wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode[state.analysisArea]; //默认分析区域值
let colorTable = new Cesium.ColorTable(); //颜色
let slopePosition, handlerPolygon; //保存当前分析区域
colorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
colorTable.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
colorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
colorTable.insert(20, new Cesium.Color(0, 161 / 255, 1));
colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));

slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode[state.displayMode]; //显示模式
slope.MaxVisibleValue = state.wideMaxR;
slope.MinVisibleValue = state.wideMinR;
slope.ColorTable = colorTable;
slope.Opacity = state.trans;

function startSlope() {
  if (!handlerPolygon) handlerPolygon = initHandler("Polygon");
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let positions = tool.CartesiantoDegrees(res.object.positions);
      slopeUpdate(positions);
      slopePosition = positions;
      if (state.isEdit) setEditHandler(handlerPolygon.polygon);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}
// 更新
function slopeUpdate(p) {
  slope.CoverageArea = p;
  viewer.scene.globe.SlopeSetting = {
    slopeSetting: slope,
    analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
  };
}

function setEditHandler(entity: any, callback?: any) {
  handlerPolygon.polygon.show = true;
  if (!window.editHandler) {
    window.editHandler = new Cesium.EditHandler(viewer, entity);
    window.editHandler.activate();
    // editHandler.changedEvt.addEventListener(() => {
    //     callback(editHandler._positions);
    // })
  } else {
    // editHandler.deactivate();
    window.editHandler.setEditObject(entity);
  }
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  viewer.scene.globe.SlopeSetting = {
    analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE,
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
        wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
        break;
      case "ARM_ALL":
        wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL;
        break;
      case "ARM_NONE":
        wide = Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE;
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
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
        break;
      case "ARROW":
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW;
        break;
      case "FACE_AND_ARROW":
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW;
        break;
      default:
        break;
    }
    if (slopePosition) slopeUpdate(slopePosition);
  }
);

watch(
  () => state.trans,
  (val) => {
    slope.Opacity = Math.floor(val);
    if (slopePosition)
      viewer.scene.globe.SlopeSetting = {
        slopeSetting: slope,
        analysisMode: wide,
      };
  }
);
watch(
  () => state.isEdit,
  (val) => {}
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
        colorTable.insert(0, new Cesium.Color(9 / 255, 9 / 255, 255 / 255));
        colorTable.insert(20, new Cesium.Color(0, 161 / 255, 1));
        colorTable.insert(30, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
        colorTable.insert(50, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
        colorTable.insert(80, new Cesium.Color(255 / 255, 0 / 255, 0 / 255));
        break;
      case 1:
        colorTable.insert(0, new Cesium.Color(162 / 255, 251 / 255, 194 / 255));
        colorTable.insert(
          20,
          new Cesium.Color(180 / 255, 200 / 255, 170 / 255)
        );
        colorTable.insert(
          30,
          new Cesium.Color(200 / 255, 160 / 255, 130 / 255)
        );
        colorTable.insert(
          50,
          new Cesium.Color(225 / 255, 130 / 255, 130 / 255)
        );
        colorTable.insert(80, new Cesium.Color(1, 103 / 255, 103 / 255));
        break;
      case 2:
        colorTable.insert(0, new Cesium.Color(230 / 255, 198 / 255, 1));
        colorTable.insert(20, new Cesium.Color(210 / 255, 150 / 255, 1));
        colorTable.insert(30, new Cesium.Color(190 / 255, 100 / 255, 1));
        colorTable.insert(50, new Cesium.Color(165, 50 / 255, 1));
        colorTable.insert(80, new Cesium.Color(157 / 255, 0, 1));
        break;
      case 3:
        colorTable.insert(0, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(20, new Cesium.Color(0, 39 / 255, 148 / 255));
        colorTable.insert(30, new Cesium.Color(70 / 255, 116 / 255, 200 / 255));
        colorTable.insert(
          50,
          new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
        );
        colorTable.insert(
          80,
          new Cesium.Color(149 / 255, 232 / 255, 249 / 255)
        );
        break;
      case 4:
        colorTable.insert(0, new Cesium.Color(186 / 255, 1, 190 / 255));
        colorTable.insert(20, new Cesium.Color(186 / 255, 1, 180 / 255));
        colorTable.insert(
          30,
          new Cesium.Color(106 / 255, 255 / 255, 170 / 255)
        );
        colorTable.insert(50, new Cesium.Color(26 / 255, 255 / 255, 160 / 255));
        colorTable.insert(80, new Cesium.Color(26 / 255, 255 / 255, 156 / 255));
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
