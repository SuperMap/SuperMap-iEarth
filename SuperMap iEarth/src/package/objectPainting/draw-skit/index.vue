<template>
  <!-- 小品 -->
  <div class="row-item">
    <span>符号类型</span>
    <n-select
      style="width: 1.96rem"
      v-model:value="state.selectedTypeId"
      size="small"
      :options="state.optionClass"
    />
  </div>

  <div class="row-item">
    <span class="name">符号库</span>
    <div class="icon-list-space" style="width: 1.96rem;">
      <div v-for="(model, index) in state.symbolOptionsList.data"
          :class="model.isSelect ? 'selected-img' : ''"
          class="icon-span-six"
      >
        <!-- <img
          :key="index"
          :src="model.thumbnail"
          :alt="isZH ? model.name : model.nameEN"
          :title="isZH ? model.name : model.nameEN"
          v-show="model.name"
          class="draw-img"
          @click="changleIconItem(model)"
        /> -->
        <img
          :key="index"
          :src="model.thumbnail"
          v-show="model.name"
          class="draw-img"
          @click="changleIconItem(model)"
        />
      </div>

    </div>
  </div>

  <div class="row-item">
    <span>符号颜色</span>
    <div class="color-pick-box" style="width: 1.96rem; margin-left: 0rem">
      <n-color-picker
        v-model:value="state.symbolColor"
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
    <span>添加模式</span>
    <n-select
      v-model:value="state.addType"
      size="small"
      :options="state.optionAddWay"
      style="width: 1.96rem"
    />
  </div>

  <div class="row-item" v-if="state.addType === 'line'">
    <span>间距</span>
    <n-input-number
      v-model:value="state.space"
      size="small"
      style="width: 1.96rem"
      :min="0.1"
    ></n-input-number>
  </div>

  <div class="row-item" v-if="state.addType === 'face'">
    <span>{{ locale.Amount }}</span>
    <n-input-number
      v-model:value="state.density"
      size="small"
      style="width: 1.96rem"
      :min="1"
    ></n-input-number>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add"
      style="margin-right: 0.1rem"
      >绘制</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, Ref, reactive, onBeforeUnmount, watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import locale from "@/tools/locateTemp";
import AddSymbol from "./js/draw-skit";
import symbolOptions from "./js/skit-config";

const notification = useNotification();

// let isZH: Ref<boolean> = ref(true);

  
type stateType = {
  selectedTypeId: number, //选中符号类型id
  selectedSymbolId: number, //选中符号id
  symbolColor: string, //符号颜色
  space: number, //直线种树间距
  density: number, //区域种树总数
  addType: string, // 种树方式
  currentModelUrl: string, // 当前种树模型的url
  optionClass:any, // 模型类型选项
  optionAddWay:any, // 添加方式
  symbolOptionsList:any, // 模型资源列表

}

// 初始化数据
let state = reactive<stateType>({
  selectedTypeId: 0, //选中符号类型id
  selectedSymbolId: 0, //选中符号id
  symbolColor: "rgba(255,255,255,1)", //符号颜色
  space: 10, //直线种树间距
  density: 100, //区域种树总数
  addType: "single",
  // optionClass: symbolOptions.map((_, i) => ({
  //   label: () => (isZH.value ? _.name : _.nameEN),
  //   value: i,
  // })),
  currentModelUrl:'./Resource/skitStore/tree1.s3m',
  optionClass:[
    {
      label:()=>'树木',
      value:0
    },
    {
      label:()=>'公共设施',
      value:1
    },
    {
      label:()=>'交通',
      value:2
    },
  ],
  optionAddWay: [
    {
      label: () => locale.AddBypoint,
      value: "single",
    },
    {
      label: () => locale.AddByline,
      value: "line",
    },
    {
      label: () => locale.AddByFace,
      value: "face",
    },
  ],
  // addTreeModeArr: [
  //   {
  //     label: () => "单个添加",
  //     value: 0,
  //   },
  //   {
  //     label: () => "多个添加",
  //     value: 1,
  //   },
  // ],
  symbolOptionsList:symbolOptions[0],
});

let addSymbol, handlerPolyline, isAddSingle, isAddLIneFace, handlerPolygon;

function init() {
  if (!viewer) return;
  addSymbol = new AddSymbol(viewer, {});
}

init();

// 分析
function add() {
  notification.create({
    content: () => locale.DrawSymbolTip,
    duration: 3500,
  });
  viewer.eventManager.addEventListener("CLICK", click_symbol, true);
  switch (state.addType) {
    case "single":
      add_single();
      break;
    case "line":
      add_line();
      break;
    case "face":
      add_face();
      break;
    default:
      add_single();
      break;
  }
}

// // 获取符号路径
// function getPath() {
//   // let currentData = symbolOptions[state.selectedTypeId].data;
//   // return currentData[state.selectedSymbolId].path;
//   // return state.symbolOptionsList.data[state.selectedSymbolId].path;
//   return state.currentModelUrl;
// }

//单个添加
function add_single() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  isAddSingle = true;
  viewer.eventManager.addEventListener("RIGHT_CLICK", right_click, true);
}

// 左键控制选中或者添加
function click_symbol(e) {
  if (isAddLIneFace) return;
  if (isAddSingle) {
    let position = viewer.scene.pickPosition(e.message.position);
    let path = state.currentModelUrl;
    addSymbol.addByPoint(path, position);
    return;
  }
  let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
  addSymbol.setModelEditor(symbol);
}

// 右键结束添加
function right_click() {
  isAddSingle = false;
  viewer.enableCursorStyle = true;
  document.body.classList.remove("measureCur");
  viewer.eventManager.removeEventListener("RIGHT_CLICK", right_click); //移除鼠标点击事件监听
}

// 沿线添加
function add_line() {
  isAddLIneFace = true;
  if (!handlerPolyline) {
    handlerPolyline = initHandler("Polyline");
  }

  handlerPolyline.handlerDrawing().then(
    (res) => {
      isAddLIneFace = false;
      let path = state.currentModelUrl;
      addSymbol.addByline(path, res.object.positions, state.space);
      handlerPolyline.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolyline.activate();
}

// 区域添加
function add_face() {
  isAddLIneFace = true;
  if (!handlerPolygon) {
    handlerPolygon = initHandler("Polygon");
  }
  handlerPolygon.handlerDrawing().then(
    (res) => {
      isAddLIneFace = false;
      let path = state.currentModelUrl;
      addSymbol.addByFace(path, res.object.positions, state.density);
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

// 清除
function clear() {
  if (!addSymbol.selectedSymbol)
    viewer.eventManager.removeEventListener("CLICK", click_symbol); //移除鼠标点击事件监听
  if (handlerPolyline) handlerPolyline.clearHandler();
  if (handlerPolygon) handlerPolygon.clearHandler();
  addSymbol.clear(state.currentModelUrl);
  right_click();
}

// 监听
watch(
  () => state.symbolColor,
  (val) => {
    let color = SuperMap3D.Color.fromCssColorString(val);
    addSymbol.setSymbolColor(val);
  }
);
watch(
  () => state.selectedTypeId,
  (val) => {
    // let color = SuperMap3D.Color.fromCssColorString(val);
    // addSymbol.setSymbolColor(val);
    switch (val) {
    case 0:
      state.symbolOptionsList = symbolOptions[0];
      break;
    case 1:
      state.symbolOptionsList = symbolOptions[1];
      break;
    case 2:
      state.symbolOptionsList = symbolOptions[2];
      break;
    default:
      break;
  }
});
// 符号
function changleIconItem(item: any) {
  for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
    if (state.symbolOptionsList.data[i].id == item.id) {
      state.symbolOptionsList.data[i].isSelect = true;
      // state.selectedSymbolId = item.id;
    } else {
      state.symbolOptionsList.data[i].isSelect = false;
    }
  }
  state.currentModelUrl = item.path;
}

onBeforeUnmount(() => {
  clear();
  addSymbol.destroy();
});
</script>
  
  
  <style lang="scss" scoped>
  .selected-img{
    border: 1px solid #3499E5;
  }
  .draw-img{
    // width: 0.59rem;
    // width: 22%;
    height: 0.26rem;
  }
</style>
  
  
  
  
  
  