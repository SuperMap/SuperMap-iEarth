<template>
  <!-- 小品 -->
  <n-space vertical>
    <sm-rowLayOut marginbottom="0.1rem" contentMarginLeft="-0.1rem">
      <template #item-lable>{{ locale.SymbolType }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.selectedTypeId"
          size="small"
          :options="state.options1"
        />
      </template>
    </sm-rowLayOut>

    <div class="symbol-container">
      <span class="name">符号库</span>
      <div class="icon-container">
        <div class="icon-list">
          <img
            v-for="(model, index) in state.symbolOptionsList.data"
            :key="index"
            :src="model.thumbnail"
            :alt="isZH ? model.name : model.nameEN"
            :title="isZH ? model.name : model.nameEN"
            v-show="model.name"
            class="draw-img"
            :class="model.isSelect ? 'is-select' : ''"
            @click="changleIconItem(model)"
          />
        </div>
      </div>
    </div>

    <sm-rowLayOut marginbottom="0.1rem" contentMarginLeft="-0.1rem">
      <template #item-lable>{{ locale.SymbolColor }}</template>
      <template #item-content>
        <div class="single-color-pick-bg">
          <sm-color-pick v-model:value="state.symbolColor"></sm-color-pick>
        </div>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" contentMarginLeft="-0.1rem">
      <template #item-lable>{{ locale.AddType }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.addType"
          size="small"
          :options="state.options2"
        />
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.addType === 'line'">
      <template #item-lable>{{ locale.Space }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.space"
          size="small"
          style="width: 100%"
          :min="0.1"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <sm-rowLayOut marginbottom="0.1rem" v-if="state.addType === 'face'">
      <template #item-lable>{{ locale.Amount }}</template>
      <template #item-content>
        <n-input-number
          v-model:value="state.density"
          size="small"
          style="width: 100%"
          :min="1"
        ></n-input-number>
      </template>
    </sm-rowLayOut>

    <!-- <sm-rowLayOut marginbottom="0.1rem">
      <template #item-lable>添加模式</template>
      <template #item-content>
        <n-select
          v-model:value="state.selectedTypeId"
          size="small"
          :options="state.addTreeModeArr"
        />
      </template>
    </sm-rowLayOut> -->

    <sm-btnGroup marginleft="0.52rem">
      <template #btn-left>
        <n-button @click="add" type="info" color="#3499E5" text-color="#fff">{{
          locale.Add
        }}</n-button>
      </template>
      <template #btn-right>
        <n-button class="btn-secondary" @click="clear">{{
          locale.Clear
        }}</n-button>
      </template>
    </sm-btnGroup>
  </n-space>
</template>
  
  <script lang="ts" setup>
import { ref, Ref, reactive, onBeforeUnmount, watch } from "vue";
import { useNotification } from "naive-ui";
import initHandler from "@/tools/drawHandler";
import locale from "@/tools/locateTemp";
import AddSymbol from "./draw-skit";
import symbolOptions from "./skit-config";

const notification = useNotification();

let isZH: Ref<boolean> = ref(true);

// 初始化数据
let state = reactive({
  selectedTypeId: 0, //选中符号类型id
  selectedSymbolId: 0, //选中符号id
  symbolColor: "rgba(255,255,255,1)", //符号颜色
  space: 10, //直线种树间距
  density: 100, //区域种树总数
  addType: "single",
  options1: symbolOptions.map((_, i) => ({
    label: () => (isZH.value ? _.name : _.nameEN),
    value: i,
  })),
  options2: [
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
  addTreeModeArr: [
    {
      label: () => "单个添加",
      value: 0,
    },
    {
      label: () => "多个添加",
      value: 1,
    },
  ],
  symbolOptionsList: {
    id: 0,
    name: "树木",
    nameEN: "tree",
    type: "tree",
    data: [
      // {
      //   id: 0,
      //   name: "树1",
      //   nameEN: "tree1",
      //   thumbnail: "./Resource/skitStore/tree.png",
      //   path: "./Resource/skitStore/tree1.s3m",
      //   isSelect: true,
      // },
      {
        id: 1,
        name: "树2",
        nameEN: "tree2",
        thumbnail: "./Resource/skitStore/pine.png",
        path: "./Resource/skitStore/tree2.s3m",
        isSelect: true,
      },
      {
        id: 2,
        name: "树3",
        nameEN: "tree3",
        thumbnail: "./Resource/skitStore/tree3.png",
        path: "./Resource/skitStore/tree3.s3m",
        isSelect: false,
      },
      {
        id: 3,
        name: "树4",
        nameEN: "tree4",
        thumbnail: "./Resource/skitStore/tree2.png",
        path: "./Resource/skitStore/tree4.s3m",
        isSelect: false,
      },
      {
        id: 4,
        name: "springTree",
        nameEN: "tree5",
        thumbnail: "./Resource/skitStore/springTree.png",
        path: "./Resource/skitStore/springTree.s3m",
        isSelect: false,
      },
      {
        id: 5,
        name: "autumnTree",
        nameEN: "tree6",
        thumbnail: "./Resource/skitStore/autumnTree.png",
        path: "./Resource/skitStore/autumnTree.s3m",
        isSelect: false,
      },
      // {
      //     id: 6,
      //     name: "winterTree",
      //     nameEN: 'tree7',
      //     thumbnail: "./Resource/skitStore/winterTree.png",
      //     path: "./Resource/skitStore/winterTree.s3m"
      // }
    ],
  },
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

// 获取符号路径
function getPath() {
  // let currentData = symbolOptions[state.selectedTypeId].data;
  // return currentData[state.selectedSymbolId].path;
  return state.symbolOptionsList.data[state.selectedTypeId].path;
}

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
    let path = getPath();
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
      let path = getPath();
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
      let path = getPath();
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
  addSymbol.clear(getPath());
  right_click();
}

// 监听
watch(
  () => state.symbolColor,
  (val) => {
    let color = Cesium.Color.fromCssColorString(val);
    addSymbol.setSymbolColor(val);
  }
);
// 符号
function changleIconItem(item: any) {
  for (let i = 0; i < state.symbolOptionsList.data.length; i++) {
    if (state.symbolOptionsList.data[i].id == item.id) {
      state.symbolOptionsList.data[i].isSelect = true;
      state.selectedTypeId = item.id;
    } else {
      state.symbolOptionsList.data[i].isSelect = false;
    }
  }
}

onBeforeUnmount(() => {
  clear();
  addSymbol.destroy();
});
</script>
  
  
  <style lang="scss" scoped>
.draw-img {
  // @include setDrawImgStyle();
  margin-top: 0.1rem;
  margin-right: 0.25rem;
  margin-bottom: 0.07rem;
}
.draw-img:nth-child(4n) {
  margin-right: 0;
}
.selected-border-color {
  border: $--SM--Border-DrawImg;
}
.icon-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.is-select {
  border: 0.01rem solid #3499e5;
}
@include iconContainer(0, auto, 0.2rem, auto);
.symbol-container {
  display: flex;
  font-size: 0.12rem;
}
</style>
  
  
  
  
  
  