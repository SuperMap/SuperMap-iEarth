<template>
  <!-- 等值线 -->
  <div class="row-item">
    <span>最大可见高程</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.fillMaxHeight"
      :show-button="false"
    >
      <template #suffix>M</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>最小可见高程</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.fillMinHeight"
      :show-button="false"
    >
      <template #suffix>M</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>等值距</span>
    <n-input-number
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.equivalentIsoline"
      :bordered="false"
      :min="1"
      :max="10000"
      :show-button="false"
    >
      <template #suffix>M</template>
    </n-input-number>
  </div>

  <div class="row-item">
    <span>线颜色设置</span>
    <div class="color-pick-box" style="width: 1.96rem;height: 0.32rem;; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.lineColor"
        :render-label="
          () => {
            return '';
          }
        "
        size="small"
      ></n-color-picker>
    </div>
  </div>

  <div class="row-item">
    <span>显示模式</span>
    <n-select
      size="small"
      style="width: 1.96rem;height: 0.32rem;"
      v-model:value="state.fillOptionsSelected"
      :options="state.options"
    />
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
      @click="isoLineAnalysis"
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
  fillMaxHeight: number, //最大可见高程
  fillMinHeight: number, //最小可见高程
  equivalentIsoline: number, //等值距
  fillOptionsSelected: number, //当前选择模式
  lineColor: string, //颜色
  isEdit: boolean, //是否编辑
  options:any
}

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
      label: () => "等高线填充",
      value: 2,
    },
    {
      label: () => "等高面填充",
      value: 1,
    },
    {
      label: () => "等高线和面填充",
      value: 3,
    },
    {
      label: () => "无颜色表",
      value: 0,
    },
  ],
});

// 初始化数据
let handlerPolygon, editHandler, isolinePosition, hyp, colorTable;

function init() {
  hyp = new SuperMap3D.HypsometricSetting();
  colorTable = new SuperMap3D.ColorTable(); //建立颜色表
  colorTableInit(colorTable);
  // hyp.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.LINE; //显示模式
  hyp.DisplayMode = state.fillOptionsSelected; //显示模式
  hyp._lineColor = SuperMap3D.Color.fromCssColorString(state.lineColor);
  hyp.LineInterval = Math.floor(state.equivalentIsoline);
  hyp.MaxVisibleValue = Math.floor(state.fillMaxHeight);
  hyp.MinVisibleValue = Math.floor(state.fillMinHeight);
  hyp.ColorTableMinKey = 2736.88110351563;
  hyp.ColorTableMaxKey = 5597.06640625;
  hyp.ColorTable = colorTable;
  // hyp.Opacity = 0.4;
}
init();

// 等值线分析
function isoLineAnalysis() {
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }

  // init();
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let positions = tool.CartesiantoDegrees(res.object.positions);
      isolineUpdate(positions);
      isolinePosition = positions;
      // console.log(handlerPolygon.polygon);
      if (state.isEdit) setEditHandler(handlerPolygon.polygon, isolineUpdate);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

// 更新
function isolineUpdate(p:any) {
  if (!p || p.length == 0) return;
  hyp.CoverageArea = p;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: hyp,
    analysisMode:
      SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
  };
}
// 设置编辑handle
function setEditHandler(entity:any, callback:any) {
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

// 创建颜色表
function colorTableInit(colorTable:any) {
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
  if (handlerPolygon) handlerPolygon.clearHandler();
  if (editHandler) editHandler.clear();
  viewer.scene.globe.HypsometricSetting = undefined;
  hyp && (hyp.MaxVisibleValue = -1000);
  hyp && (hyp.MinVisibleValue = -1000);
  isolinePosition = undefined;
  // clearEditHandler("Polygon");

  // hyp.destroy();
  hyp = new SuperMap3D.HypsometricSetting();
  // colorTable.destroy();
  // hyp = undefined;
  // colorTable = undefined;
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
    if (val) {
      if (handlerPolygon && handlerPolygon.polygon)
        setEditHandler(handlerPolygon.polygon, isolineUpdate);
    } else if (editHandler) editHandler.clear();
  }
);

// 销毁
onBeforeUnmount(() => {
  hyp.destroy();
  colorTable.destroy();
  hyp = undefined;
  colorTable = undefined;
});
</script>
