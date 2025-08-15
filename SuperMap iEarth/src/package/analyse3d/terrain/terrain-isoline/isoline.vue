<!-- 等值线 -->
<template>
  <!-- 最大可见高程 -->
  <div class="row-wrap">
    <div class="label">{{ $t("maximumVisibleElevation") }}</div>
    <div class="content">
      <n-input-number v-model:value="state.fillMaxHeight" :show-button="false">
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>
  </div>

  <!-- 最小可见高程 -->
  <div class="row-wrap">
    <div class="label">{{ $t("minimumVisibleElevation") }}</div>
    <div class="content">
      <n-input-number v-model:value="state.fillMinHeight" :show-button="false">
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>
  </div>

  <!-- 等值距 -->
  <div class="row-wrap">
    <div class="label">{{ $t("equivalentIsoline") }}</div>
    <div class="content">
      <n-input-number v-model:value="state.equivalentIsoline" :bordered="false" :min="1" :max="10000"
        :show-button="false">
        <template #suffix>{{ $t("meter") }}</template>
      </n-input-number>
    </div>
  </div>

  <!-- 等高线颜色 -->
  <div class="row-wrap" v-show="state.fillOptionsSelected == 2 || state.fillOptionsSelected == 3">
    <div class="label">{{ $t("contourColor") }}</div>
    <div class="content">
      <n-color-picker v-model:value="state.lineColor" :render-label="
        () => {
          return '';
        }
      " size="small"></n-color-picker>
    </div>
  </div>

  <!-- 显示模式 -->
  <div class="row-wrap">
    <div class="label">{{ $t("displayMode") }}</div>
    <div class="content">
      <n-select v-model:value="state.fillOptionsSelected" :options="state.options" />
    </div>
  </div>

  <!-- 编辑区域 -->
  <div class="row-wrap">
    <div class="content">
      <n-checkbox v-model:checked="state.isEdit" :label="$t('editArea')" />
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="isoLineAnalysis" class="operate" type="info" :focusable="false">{{
    $t("analysis") }}</n-button>
    <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import DrawHandler from "@/lib/DrawHandler";

const drawHandler = new DrawHandler(viewer,{ openMouseTip:false });

type stateType = {
  fillMaxHeight: number; //最大可见高程
  fillMinHeight: number; //最小可见高程
  equivalentIsoline: number; //等值距
  fillOptionsSelected: number; //当前选择模式
  lineColor: string; //颜色
  isEdit: boolean; //是否编辑
  options: any;
};

// 设置默认值数据
let state = reactive<stateType>({
  fillMaxHeight: 9000, //最大可见高程
  fillMinHeight: 0, //最小可见高程
  equivalentIsoline: 100, //等值距
  fillOptionsSelected: 2, //当前选择模式
  lineColor: "rgba(255,128,64,1)", //颜色
  isEdit: false, //是否编辑
  options: [
    {
      label: () => $t("contourLineFill"),
      value: 2,
    },
    {
      label: () => $t("contourFaceFill"),
      value: 1,
    },
    {
      label: () => $t("contourAllFill"),
      value: 3,
    },
    {
      label: () => $t("contourNoFill"),
      value: 0,
    },
  ],
});

// 初始化变量
let editHandler, isolinePosition;
let hyp = new SuperMap3D.HypsometricSetting();
let colorTable = new SuperMap3D.ColorTable(); //建立颜色表

function init() {
  colorTableInit(colorTable);
  hyp.DisplayMode = state.fillOptionsSelected; //显示模式
  hyp._lineColor = SuperMap3D.Color.fromCssColorString(state.lineColor);
  hyp.LineInterval = Math.floor(state.equivalentIsoline);
  hyp.MaxVisibleValue = Math.floor(state.fillMaxHeight);
  hyp.MinVisibleValue = Math.floor(state.fillMinHeight);
  hyp.ColorTableMinKey = 2736.88110351563;
  hyp.ColorTableMaxKey = 5597.06640625;
  hyp.ColorTable = colorTable;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  clear();
  hyp.destroy();
  colorTable.destroy();
  hyp = undefined;
  colorTable = undefined;
});

function isoLineAnalysis() {
  init();

  drawHandler.startPolygon().then(positions => {
    let positions_ = window.iEarthTool.Cartesian3ToDegreeArray(positions);
    isolineUpdate(positions_);
    isolinePosition = positions_;
    if (state.isEdit) setEditHandler(drawHandler.handlePolygon.polygon, isolineUpdate);
  });
}

// 更新
function isolineUpdate(p: any) {
  if (!p || p.length == 0) return;
  isolinePosition = p; // 编辑区域后，更新当前区域坐标数组
  hyp.CoverageArea = p;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: hyp,
    analysisMode:
      SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
  };
}

// 设置编辑handle
function setEditHandler(entity: any, callback: any) {
  drawHandler.handlePolygon.polygon.show = true;
  if (!editHandler) {
    editHandler = new SuperMap3D.EditHandler(viewer, entity);
    editHandler.activate();
    editHandler.changedEvt.addEventListener(() => {
      let editPositions = window.iEarthTool.Cartesian3ToDegreeArray(editHandler._positions);
      callback(editPositions);
    });
  } else {
    // editHandler.deactivate();
    editHandler.setEditObject(entity);
  }
}

// 创建颜色表
function colorTableInit(colorTable: any) {
  colorTable.insert(5597.06640625, new SuperMap3D.Color(0, 0, 255 / 255));
  colorTable.insert(
    5406.3873860677086,
    new SuperMap3D.Color(0, 51 / 255, 255 / 255)
  );
  colorTable.insert(
    5215.7083658854172,
    new SuperMap3D.Color(0, 102 / 255, 255 / 255)
  );
  colorTable.insert(
    5025.0293457031257,
    new SuperMap3D.Color(0, 153 / 255, 255 / 255)
  );
  colorTable.insert(
    4834.3503255208343,
    new SuperMap3D.Color(0, 204 / 255, 255 / 255)
  );
  colorTable.insert(
    4643.6713053385429,
    new SuperMap3D.Color(0, 255 / 255, 255 / 255)
  );
  colorTable.insert(
    4452.9922851562524,
    new SuperMap3D.Color(51 / 255, 255 / 255, 204 / 255)
  );
  colorTable.insert(
    4262.3132649739609,
    new SuperMap3D.Color(102 / 255, 255 / 255, 153 / 255)
  );
  colorTable.insert(
    4071.6342447916695,
    new SuperMap3D.Color(153 / 255, 255 / 255, 102 / 255)
  );
  colorTable.insert(
    3880.9552246093781,
    new SuperMap3D.Color(204 / 255, 255 / 255, 51 / 255)
  );
  colorTable.insert(
    3690.2762044270867,
    new SuperMap3D.Color(255 / 255, 255 / 255, 0)
  );
  colorTable.insert(
    3499.5971842447952,
    new SuperMap3D.Color(255 / 255, 204 / 255, 0)
  );
  colorTable.insert(
    3308.9181640625038,
    new SuperMap3D.Color(255 / 255, 153 / 255, 0)
  );
  colorTable.insert(
    3118.2391438802129,
    new SuperMap3D.Color(255 / 255, 102 / 255, 0)
  );
  colorTable.insert(
    2927.5601236979214,
    new SuperMap3D.Color(255 / 255, 51 / 255, 0)
  );
  colorTable.insert(2736.88110351563, new SuperMap3D.Color(255 / 255, 0, 0));
}

// 获取rgba里的数值(rgba:传入的rgba格式颜色值，index:想要获取第几位，有0、1、2、3)
function rgbaNum(rgba, index) {
  let val = rgba.match(/(\d(\.\d+)?)+/g);
  return val[index];
}

// 清除
function clear() {
  if (drawHandler) drawHandler.destroy();
  if (editHandler) editHandler.clear();
  state.isEdit = false;
  viewer.scene.globe.HypsometricSetting = undefined;
  hyp && (hyp.MaxVisibleValue = -1000);
  hyp && (hyp.MinVisibleValue = -1000);
  isolinePosition = undefined;
  hyp = new SuperMap3D.HypsometricSetting();
}

//监听
watch(
  () => state.fillMaxHeight,
  (val: any) => {
    hyp.MaxVisibleValue = parseFloat(val);
    if (isolinePosition) isolineUpdate(isolinePosition);
  }
);
watch(
  () => state.fillMinHeight,
  (val: any) => {
    hyp.MinVisibleValue = parseFloat(val);
    if (isolinePosition) isolineUpdate(isolinePosition);
  }
);
watch(
  () => state.equivalentIsoline,
  (val: any) => {
    hyp.LineInterval = parseFloat(val);
    if (isolinePosition) isolineUpdate(isolinePosition);
  }
);
watch(
  () => state.lineColor,
  (val: any) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    if (color) hyp._lineColor = color;
    if (isolinePosition) isolineUpdate(isolinePosition);
  }
);
watch(
  () => state.fillOptionsSelected,
  (val: any) => {
    switch (val) {
      case 0:
        {
          hyp.DisplayMode = undefined;
        }
        break;
      case 2:
        {
          hyp.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.LINE;
          hyp.Opacity = 1;
        }
        break;
      case 1:
        {
          hyp.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.FACE;
          hyp.Opacity = 0.5;
        }
        break;
      case 3:
        {
          hyp.DisplayMode =
            SuperMap3D.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
          hyp.Opacity = 0.5;
        }
        break;
      default:
        break;
    }
    if (isolinePosition) isolineUpdate(isolinePosition);
  }
);
watch(
  () => state.isEdit,
  (val) => {
    if (!drawHandler.handlePolygon) return;
    if (!drawHandler.handlePolygon.polygon) return;
    const polygon = drawHandler.handlePolygon.polygon;
    if (val) {
      setEditHandler(polygon, isolineUpdate);
    } else{
      polygon.show = false;
      if(editHandler) editHandler.clear();
    }
  }
);
</script>
