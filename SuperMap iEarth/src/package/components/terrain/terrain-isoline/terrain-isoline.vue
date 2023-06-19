<template>
  <n-space vertical>
    <sm-rowLayOut>
      <template #item-lable>{{ locale.MaxVisibleHeight }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.fillMaxHeight"
          :bordered="false"
          :min="1"
          :max="10000"
          :show-button="false"
        >
          <template #suffix>M</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ locale.MinVisibleHeight }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.fillMinHeight"
          :bordered="false"
          :min="1"
          :max="10000"
          :show-button="false"
        >
          <template #suffix>M</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ locale.Equidistance }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.equivalentIsoline"
          :bordered="false"
          :min="1"
          :max="10000"
          :show-button="false"
        >
          <template #suffix>M</template>
        </n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ locale.LineColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.lineColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut>
      <template #item-lable>{{ locale.DisplayMode }}</template>
      <template #item-content>
        <n-select
          size="small"
          v-model:value="state.fillOptionsSelected"
          :options="state.options"
        />
      </template>
    </sm-rowLayOut>

    <!-- <n-checkbox v-model:checked="state.isEdit">{{locale.EditAnalysisArea}}</n-checkbox> -->
    <sm-btnGroup>
      <template #btn-left>
        <n-button
          type="info"
          color="#3499E5"
          text-color="#fff"
          @click="isoLineAnalysis"
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
  fillMaxHeight: 9000, //最大可见高程
  fillMinHeight: 0, //最小可见高程
  equivalentIsoline: 100, //等值距
  fillOptionsSelected: 2, //当前选择模式
  lineColor: "rgba(255,128,64,1)", //颜色
  isEdit: false, //是否编辑
  options: [
    {
      label: () => locale.IsolineFill,
      value: 2,
    },
    {
      label: () => locale.IsosurfaceFill,
      value: 1,
    },
    {
      label: () => locale.IsolineSurfaceFill,
      value: 3,
    },
    {
      label: () => locale.NoColorTable,
      value: 0,
    },
  ],
});

// 初始化数据
let handlerPolygon, editHandler, isolinePosition, hyp, colorTable;

init();
function init() {
  hyp = new Cesium.HypsometricSetting();
  colorTable = new Cesium.ColorTable(); //建立颜色表
  colorTableInit(colorTable);
  // hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE; //显示模式
  hyp.DisplayMode = state.fillOptionsSelected; //显示模式
  hyp._lineColor = Cesium.Color.fromCssColorString(state.lineColor);
  hyp.LineInterval = Math.floor(state.equivalentIsoline);
  hyp.MaxVisibleValue = Math.floor(state.fillMaxHeight);
  hyp.MinVisibleValue = Math.floor(state.fillMinHeight);
  hyp.ColorTableMinKey = 2736.88110351563;
  hyp.ColorTableMaxKey = 5597.06640625;
  hyp.ColorTable = colorTable;
  // hyp.Opacity = 0.4;
}

function isoLineAnalysis() {
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }

  init();
  handlerPolygon.handlerDrawing().then(
    (res) => {
      let positions = tool.CartesiantoDegrees(res.object.positions);
      isolineUpdate(positions);
      isolinePosition = positions;
      console.log(handlerPolygon.polygon);
      if (state.isEdit) setEditHandler(handlerPolygon.polygon, isolineUpdate);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}
// 更新
function isolineUpdate(p) {
  if (!p || p.length == 0) return;
  hyp.CoverageArea = p;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: hyp,
    analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION,
  };
}

function setEditHandler(entity, callback) {
  handlerPolygon.polygon.show = true;
  if (!editHandler) {
    editHandler = new Cesium.EditHandler(viewer, entity);
    editHandler.activate();
    // editHandler.changedEvt.addEventListener(() => {
    //     callback(editHandler._positions);
    // })
  } else {
    // editHandler.deactivate();
    editHandler.setEditObject(entity);
  }
}

// 清除
function clear() {
  if (handlerPolygon) handlerPolygon.clearHandler();
  viewer.scene.globe.HypsometricSetting = undefined;
  hyp && (hyp.MaxVisibleValue = -1000);
  hyp && (hyp.MinVisibleValue = -1000);
  isolinePosition = undefined;
  // clearEditHandler("Polygon");

  // hyp.destroy();
  hyp = new Cesium.HypsometricSetting();
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
    let color = Cesium.Color.fromCssColorString(val);
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
          hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
          hyp.Opacity = 1;
        }
        break;
      case 1:
        {
          hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
          hyp.Opacity = 0.5;
        }
        break;
      case 3:
        {
          hyp.DisplayMode =
            Cesium.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
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

function colorTableInit(colorTable) {
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
}

// 获取rgba里的数值(rgba:传入的rgba格式颜色值，index:想要获取第几位，有0、1、2、3)
function rgbaNum(rgba, index) {
  let val = rgba.match(/(\d(\.\d+)?)+/g);
  return val[index];
}
</script>


<style lang="scss">
.single-color-pick-bg {
  height: 0.32rem;
  border-radius: 0.04rem;
  background: rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  padding: 0 0.12rem;
}
</style>