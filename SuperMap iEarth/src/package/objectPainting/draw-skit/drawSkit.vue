<template>
  <!-- 小品 -->
  <div class="row-item">
    <span>{{ $t("symbolType") }}</span>
    <n-select
      style="width: 1.98rem"
      v-model:value="state.selectedTypeId"
      :options="state.optionClass"
    />
  </div>

  <div class="row-item no-center">
    <span class="name">{{ $t("symbolLibrary") }}</span>
    <div class="icon-list-space" style="width: 1.98rem">
      <div
        v-for="(model, index) in state.symbolOptionsList.data"
        :class="model.isSelect ? 'selected-img' : 'normal-img'"
        style="width: 0.4rem; height: 0.4rem; margin: 0.08rem 0.1rem"
      >
        <img
          :key="index"
          :src="model.thumbnail"
          v-show="model.name"
          class="draw-img"
          @click="changleIconItem(model)"
          @dblclick="cancleIconItem(model)"
        />
      </div>
    </div>
  </div>

  <div class="row-item">
    <span>{{ $t("symbolColor") }}</span>
    <div class="color-pick-box" style="width: 1.98rem; margin-left: 0rem">
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
    <span>{{ $t("addMode") }}</span>
    <n-select
      v-model:value="state.addType"
      :options="state.optionAddWay"
      style="width: 1.96rem"
    />
  </div>

  <div class="btn-row-item" v-if="state.addType === 'face'">
    <n-checkbox
      v-model:checked="state.multiSelection"
      style="margin-bottom: 0.1rem"
    >
      {{ $t("multiSelection") }}
    </n-checkbox>
  </div>

  <div class="row-item">
    <span>{{ $t("delMode") }}</span>
    <n-radio-group
      v-model:value="state.delType"
      name="radiogroup"
      class="radio-group"
    >
      <n-radio
        v-for="item in state.delOption"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </n-radio>
    </n-radio-group>
  </div>

  <div class="row-item" v-if="state.addType === 'line'">
    <span>{{ $t("spacing") }}</span>
    <n-input-number
      v-model:value="state.space"
      style="width: 1.96rem"
      :min="0.1"
      :max="1000"
    ></n-input-number>
  </div>

  <div class="row-item" v-if="state.addType === 'face'">
    <span>{{ $t("count") }}</span>
    <n-input-number
      v-model:value="state.density"
      style="width: 1.96rem"
      :min="1"
      :max="3000"
    ></n-input-number>
  </div>

  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add"
      style="margin-right: 0.1rem"
      >{{ $t("Draw") }}</n-button
    >
    <n-button
      class="btn-secondary"
      @click="clear"
      color="rgba(255, 255, 255, 0.65)"
      ghost
      >{{ $t("clear") }}</n-button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, watch } from "vue";
import { useNotification, useMessage } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import AddSymbol from "./js/draw-skit";
import symbolOptions from "./js/skit-config";
import { RuleCheckTypeEnum, inputRuleCheck } from "@/tools/inputRuleCheck";

const notification = useNotification();
const message = useMessage();

type stateType = {
  selectedTypeId: number; //选中符号类型id
  selectedSymbolId: number; //选中符号id
  symbolColor: string; //符号颜色
  space: number; //直线种树间距
  density: number; //区域种树总数
  addType: string; // 种树方式
  currentModelUrl: string; // 当前种树模型的url
  optionClass: any; // 模型类型选项
  optionAddWay: any; // 添加方式
  symbolOptionsList: any; // 模型资源列表
  multiSelection: boolean; // 支持多选
  currentModelUrlArray: any;
  delType: number; // 删除方式
  delOption: any; // 删除模式options
  selectS3mInstenceID: string;
};

// 初始化变量
let state = reactive<stateType>({
  selectedTypeId: 0, //选中符号类型id
  selectedSymbolId: 0, //选中符号id
  symbolColor: "rgba(255,255,255,1)", //符号颜色
  space: 10, //直线种树间距
  density: 100, //区域种树总数
  addType: "single",
  currentModelUrl: "./Resource/skitStore/newTree/001_Platanus.s3mb",
  currentModelUrlArray: ["./Resource/skitStore/newTree/001_Platanus.s3mb"],
  // optionClass: symbolOptions.map((_, i) => ({
  //   label: () => (isZH.value ? _.name : _.nameEN),
  //   value: i,
  // })),
  optionClass: [
    {
      label: () => $t("tree"),
      value: 0,
    },
    {
      label: () => $t("facilities"),
      value: 1,
    },
    {
      label: () => $t("traffic"),
      value: 2,
    },
  ],
  optionAddWay: [],
  symbolOptionsList: symbolOptions[0],
  multiSelection: false,
  delType: 1,
  delOption: [
    {
      label: $t("singleDel"),
      value: 1,
    },
    {
      label: $t("wholeDel"),
      value: 2,
    },
  ],
  selectS3mInstenceID: "",
});

let addSymbol, handlerPolyline, isAddSingle, isAddLIneFace, handlerPolygon;

let treeOperation = [
  {
    label: () => $t("singleAdd"),
    value: "single",
  },
  {
    label: () => $t("lineAdd"),
    value: "line",
  },
  {
    label: () => $t("AreaAdd"),
    value: "face",
  },
];

let otherOperation = [
  {
    label: () => $t("singleAdd"),
    value: "single",
  },
  {
    label: () => $t("lineAdd"),
    value: "line",
  },
];

// let isCloseAreaAdd: boolean = false;
// isCloseAreaAdd = computed<boolean>(() => {
//   return state.selectedTypeId == 0 ? false : true;
// }).value;

function init() {
  if (!viewer) return;
  addSymbol = new AddSymbol(viewer, {});
}

onMounted(() => {
  init();
  state.optionAddWay = treeOperation;
  state.symbolOptionsList.data[0].isSelect = true;
});

onBeforeUnmount(() => {
  // clear();
  addSymbol.destroy();
  if (!addSymbol.selectedSymbol)
    viewer.eventManager.removeEventListener("CLICK", click_symbol); //移除鼠标点击事件监听

  for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
    state.symbolOptionsList.data[i].isSelect = false;
  }
});

// 添加
function add() {
  if (!state.multiSelection) {
    if (state.currentModelUrl == "") {
      message.warning($t("addSkitTip"));
      return;
    }
  } else {
    if (state.currentModelUrlArray.length == 0) {
      message.warning($t("addSkitTip"));
      return;
    }
  }
  notification.create({
    content: () => $t("editLineTip"),
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

//单个添加
function add_single() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  isAddSingle = true;
  viewer.eventManager.addEventListener("RIGHT_CLICK", right_click, true);
}

// 左键控制选中或者添加d
function click_symbol(e) {
  if (isAddLIneFace) return;
  if (isAddSingle) {
    let position = viewer.scene.pickPosition(e.message.position);
    let path = state.currentModelUrl;
    addSymbol.addByPoint(path, position);
    return;
  }
  let symbol = viewer.scene.pick(e.message.position) || viewer.selectedEntity;
  if (symbol.id.indexOf("addSymbol") != -1) {
    state.selectS3mInstenceID = symbol.id;
    addSymbol.setModelEditor(symbol);
    // symbol.primitive.updateColor(SuperMap3D.Color.fromCssColorString('rgba(255,1,1,1)'), symbol.id);
    // addSymbol.setItemsHighlight(symbol);
  } else {
    addSymbol.delModelEditor();
  }
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
      // let path = state.currentModelUrl;
      let path = state.currentModelUrlArray;
      addSymbol.addByFace(path, res.object.positions, state.density);
      handlerPolygon.polylineTransparent.show = false;
    },
    (err) => {
      console.log(err);
    }
  );
  handlerPolygon.activate();
}

// 符号
function changleIconItem(item: any) {
  if (!state.multiSelection) {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = true;
        // state.selectedSymbolId = item.id;
      } else {
        state.symbolOptionsList.data[i].isSelect = false;
      }
    }
    state.currentModelUrl = item.path;
    state.currentModelUrlArray = [item.path];
  } else {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = true;
      }
    }
    let itemIndex = state.currentModelUrlArray.indexOf(item.path);
    if (itemIndex == -1) {
      state.currentModelUrlArray.push(item.path);
    }
  }
}

// 取消所选符号
function cancleIconItem(item: any) {
  if (!state.multiSelection) {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = false;
        state.currentModelUrl = "";
        state.currentModelUrlArray = [];
      }
    }
  } else {
    for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
      if (state.symbolOptionsList.data[i].id == item.id) {
        state.symbolOptionsList.data[i].isSelect = false;
        let pathIndex = state.currentModelUrlArray.indexOf(item.path);
        state.currentModelUrlArray.splice(pathIndex, 1);
      }
    }
  }
}

// 清除
function clear() {
  if (state.selectS3mInstenceID.indexOf("addSymbol") != -1) {
    addSymbol.clear(state.selectS3mInstenceID, state.delType);
  } else {
    message.warning($t("delSkitTip"));
  }
  isAddLIneFace = false;
  state.selectS3mInstenceID = "";
  if (handlerPolyline) handlerPolyline.clearHandler();
  if (handlerPolygon) handlerPolygon.clearHandler();
  right_click();
}

// 监听
watch(
  () => state.symbolColor,
  (val) => {
    // let color = SuperMap3D.Color.fromCssColorString(val);
    addSymbol.setSymbolColor(val);
  }
);
watch(
  () => state.addType,
  () => {
    state.multiSelection = false;
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
        state.optionAddWay = treeOperation;
        break;
      case 1:
        state.symbolOptionsList = symbolOptions[1];
        state.optionAddWay = otherOperation;
        state.addType = "single";
        break;
      case 2:
        state.symbolOptionsList = symbolOptions[2];
        state.optionAddWay = otherOperation;
        state.addType = "single";
        break;
      default:
        break;
    }
  }
);
watch(
  () => state.multiSelection,
  (val) => {
    if (!val) {
      for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
        state.symbolOptionsList.data[i].isSelect = false;
      }
      state.currentModelUrlArray = [];
    }
  }
);

watch(
  () => state.space,
  (val) => {
    const checkeResult = inputRuleCheck(val, RuleCheckTypeEnum.Number);
    if (!checkeResult.isPass) { 
      window["$message"].warning(checkeResult.message); 
      state.space = val = 10;
    };
  }
);
watch(
  () => state.density,
  (val) => {
    const checkeResult = inputRuleCheck(val, RuleCheckTypeEnum.Number);
    if (!checkeResult.isPass) { 
      window["$message"].warning(checkeResult.message); 
      state.density = val = 100;
    };
  }
);
</script>

<style lang="scss" scoped>
.icon-list-space {
  display: flex;
  flex-wrap: wrap;
}

.selected-img {
  border: 3px solid #3499e5;
}

.normal-img {
  border: 3px solid rgba(#fff, 0);
}

.draw-img {
  height: 100%;
}
</style>
