<!-- 视口卷帘 -->
<template>
  <n-scrollbar style="max-height: 5rem; padding-right: 0.1rem;" trigger="none">
    <!-- 视图模式 -->
    <div class="row-wrap">
      <div class="label">{{ $t("viewMode") }}</div>
      <div class="content">
        <n-select v-model:value="state.selectedType" :options="state.options" />
      </div>
    </div>

    <!-- 屏蔽方向 -->
    <div class="row-wrap" v-if="state.selectedType === 'lrRoller'">
      <div class="label">{{ $t("shieldDirection") }}</div>
      <div class="content">
        <n-radio-group v-model:value="state.lrRoller" name="radiogroup">
          <n-radio :value="1">{{ $t("left") }}</n-radio>
          <n-radio :value="2">{{ $t("right") }}</n-radio>
        </n-radio-group>
      </div>
    </div>

    <!-- 屏蔽方向 -->
    <div class="row-wrap" v-if="state.selectedType === 'tbRoller'">
      <div class="label">{{ $t("shieldDirection") }}</div>
      <div class="content">
        <n-radio-group v-model:value="state.tbRoller" name="radiogroup">
          <n-radio :value="4">{{ $t("up") }}</n-radio>
          <n-radio :value="8">{{ $t("down") }}</n-radio>
        </n-radio-group>
      </div>
    </div>

    <!-- 屏蔽方向 -->
    <div class="row-wrap radio-groups" v-if="state.selectedType === 'customRoller'">
      <div class="label">{{ $t("shieldDirection") }}</div>
      <div class="content">
        <n-radio-group v-model:value="state.customRoller" name="radiogroup">
          <n-radio :value="1" style="margin-right:0rem;">{{ $t("left") }}</n-radio>
          <n-radio :value="2">{{ $t("right") }}</n-radio>
          <br />
          <n-radio :value="4">{{ $t("up") }}</n-radio>
          <n-radio :value="8">{{ $t("down") }}</n-radio>
        </n-radio-group>
      </div>
    </div>

    <!-- 图层树 -->
    <div class="row-wrap" v-if="state.selectedType != 'noRoller'">
      <div class="label">{{ $t("layerList") }}</div>
      <div class="content">
        <n-scrollbar style="max-height:3rem" trigger="none">
          <n-tree block-line checkable cascade :data="treeDataRoller" :selectable="true"
            :default-checked-keys="['1','2']" @update:checked-keys="getCheckedKeys" />
        </n-scrollbar>
      </div>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, watch, reactive, onMounted } from "vue";
import { useLayerStore } from "@/store/layerStore/layer";
const layerStore = useLayerStore();

// 初始化变量
let state = reactive({
  options: [
    {
      label: () => $t("noneRollershutter"),
      value: "noRoller",
    },
    {
      label: () => $t("leftrightRollershutter"),
      value: "lrRoller",
    },
    {
      label: () => $t("updownRollershutter"),
      value: "tbRoller",
    },
    {
      label: () => $t("customRollershutter"),
      value: "customRoller",
    },
  ],
  selectedType: "noRoller",
  lrRoller: 1, //左右卷帘时默认屏蔽左边
  tbRoller: 4, //上下卷帘时默认屏蔽上面
  customRoller: 0, //自定义
});

let treeDataRoller = reactive<any>([
  {
    "key": "1",
    "label": $t("s3mLayer"),
    "children": [],
  },
  {
    "key": "2",
    "label": $t("imgLayer"),
    "children": []
  },
]);

let verticalSliderLeft: any = "verticalSliderLeft",
  verticalSliderRight: any = "verticalSliderRight",
  horizontalSliderTop: any = "horizontalSliderTop",
  horizontalSliderBottom: any = "horizontalSliderBottom";
let fdom;
let scratchSwipeRegion = new SuperMap3D.BoundingRectangle();
let layers = viewer.scene.layers.layerQueue;
let imgLayers = viewer.imageryLayers._layers;

let rollerShutterConfig = {
  bottom: 0.66,
  left: 0.33,
  right: 0.66,
  top: 0.33,
  index: 1, //当前控制卷帘条
  mode: 1, //卷帘模式
};

onMounted(() => {
  getLayerList();
  createSlider();
  state.selectedType = "lrRoller";
});

function getLayerList(){
  // S3M图层
  viewer.scene.layers._layerQueue.forEach((S3Mlayer: any, index: number) => {
    treeDataRoller[0].children.push({
      label: S3Mlayer.name,
      key: `1-${index}`,
      type: "s3m",
    });
  });

  // 影像图层
  viewer.imageryLayers._layers.forEach((imageryLayer: any, index: number) => {
    let imageryLayerName = layerStore.getImageryLayerName(imageryLayer);
    treeDataRoller[1].children.unshift({
      label: imageryLayerName,
      key: `2-${index}`,
      type: "imagery",
    });
  })
}

// 列表项选中
let selectedOptions:any = undefined;
function getCheckedKeys(keys, options) {
  // console.log("keys:",keys);
  // console.log("options:",options);
  selectedOptions = options;
  cancelLayersRoller(false);

  // 这两个setTimeout是用来，让不参与（取消勾选）的图层避免取消卷帘时影像直接停止渲染不恢复卡在中间
  setTimeout(()=>{
    treeDataRoller[1].children.forEach(child => {
      if(!keys.includes(child.key)){
        let index = child.key.split('-')[1];
        viewer.imageryLayers._layers[index].swipeEnabled = true;
      }
    })
  },10)
  setTimeout(()=>{
    treeDataRoller[1].children.forEach(child => {
      if(!keys.includes(child.key)){
        let index = child.key.split('-')[1];
        viewer.imageryLayers._layers[index].swipeEnabled = false;
      }
    })
  },20)

  options.forEach(option => {
      if(option.type == 's3m'){ 
        let s3mlayer = viewer.scene.layers.find(option.label);
        if(s3mlayer){
          s3mlayer.swipeEnabled = true;
          s3mlayer.swipeRegion = scratchSwipeRegion;
        }
      }else if(option.type == 'imagery'){
        let index = option.key.split('-')[1];
        let curImageLayer = viewer.imageryLayers._layers[index];
        if(curImageLayer){
          curImageLayer.swipeEnabled = true;
          curImageLayer.swipeRegion = scratchSwipeRegion;
        }
      }
  });
}

// 销毁
onBeforeUnmount(() => {
  enableSlider(0);
  cancelLayersRoller(false);
  removeSlider();
});

// 创建和移除卷帘条
function createSlider(dom?: any, id?: any) {
  fdom = document.getElementById("superMapContainer");
  verticalSliderLeft = document.createElement("div");
  appendDom(verticalSliderLeft, "verticalSliderLeft");
  verticalSliderRight = document.createElement("div");
  appendDom(verticalSliderRight, "verticalSliderRight");
  horizontalSliderTop = document.createElement("div");
  appendDom(horizontalSliderTop, "horizontalSliderTop");
  horizontalSliderBottom = document.createElement("div");
  appendDom(horizontalSliderBottom, "horizontalSliderBottom");
  function appendDom(dom: any, id: any) {
    dom.id = id;
    dom.className = "roller-slider";
    fdom.appendChild(dom);
  }
  bindSliderEvt(); //绑定事件
}

function removeSlider() {
  fdom.removeChild(verticalSliderLeft);
  fdom.removeChild(verticalSliderRight);
  fdom.removeChild(horizontalSliderTop);
  fdom.removeChild(horizontalSliderBottom);
}

//设置卷帘条显隐
function enableSlider(index) {
  verticalSliderLeft.style.display = "none";
  verticalSliderRight.style.display = "none";
  horizontalSliderTop.style.display = "none";
  horizontalSliderBottom.style.display = "none";
  if (index & 1) verticalSliderLeft.style.display = "block";
  if (index & 2) verticalSliderRight.style.display = "block";
  if (index & 4) horizontalSliderTop.style.display = "block";
  if (index & 8) horizontalSliderBottom.style.display = "block";
}


//设置各类图层的卷帘(暂时只支持s3m)
function setLayersRoller() {

  if (selectedOptions) {
    // cancelLayersRoller(false);
    selectedOptions.forEach(option => {
      if (option.type == 's3m') {
        let s3mlayer = viewer.scene.layers.find(option.label);
        if (s3mlayer) {
          s3mlayer.swipeEnabled = true;
          s3mlayer.swipeRegion = scratchSwipeRegion;
        }
      } else if (option.type == 'imagery') {
        let index = option.key.split('-')[1];
        let curImageLayer = viewer.imageryLayers._layers[index];
        if (curImageLayer) {
          curImageLayer.swipeEnabled = true;
          curImageLayer.swipeRegion = scratchSwipeRegion;
        }
      }
    });
  } else {
    cancelLayersRoller(true);
  }
}


// 取消所有图层的卷帘
function cancelLayersRoller(checked) {
  if (!SuperMap3D.defined(checked)) {
    checked = false;
  }
  for (let i = 0; i < layers.length; i++) {
    layers[i].swipeEnabled = checked;
    layers[i].swipeRegion = scratchSwipeRegion;
  }
  for (let i = 1; i < imgLayers.length; i++) {
    imgLayers[i].swipeEnabled = checked;
    imgLayers[i].swipeRegion = scratchSwipeRegion;
  }
  viewer.scene.globe.swipeEnabled = checked;
  viewer.scene.globe.swipeRegion = scratchSwipeRegion;
}


/**
 * 设置卷帘的分割方向及分割条的位置。
 *
 */
function setRollerShutterSplit() {
  let mode = rollerShutterConfig.mode;
  let x1 = rollerShutterConfig.left;
  let x2 = rollerShutterConfig.right;
  let y1 = rollerShutterConfig.top;
  let y2 = rollerShutterConfig.bottom;
  // 左右卷帘使用left slider滑动，上下卷帘使用top slider滑动
  switch (mode) {
    case 1:
      SuperMap3D.BoundingRectangle.unpack([x1, 0, 1, 1], 0, scratchSwipeRegion);
      break;
    case 2:
      SuperMap3D.BoundingRectangle.unpack([0, 0, x1, 1], 0, scratchSwipeRegion);
      break;
    case 4:
      SuperMap3D.BoundingRectangle.unpack([0, y1, 1, 1], 0, scratchSwipeRegion);
      break;
    case 8:
      SuperMap3D.BoundingRectangle.unpack([0, 0, 1, y1], 0, scratchSwipeRegion);
      break;
    case 15:
      SuperMap3D.BoundingRectangle.unpack(
        [x1, y1, x2 - x1, y2 - y1],
        0,
        scratchSwipeRegion
      );
      break;
    default:
      SuperMap3D.BoundingRectangle.unpack([x1, 0, 1, 1], 0, scratchSwipeRegion);
      break;
  }
  setLayersRoller();
}

/**
 * 注册卷帘分割条的拖拽事件。
 */
function bindSliderEvt() {
  let width = fdom.clientWidth; // 界面宽度
  let height = fdom.clientHeight; // 界面高度
  verticalSliderLeft.addEventListener(
    "mousedown",
    function (e) {
      mouseDown(e, 1);
    },
    false
  );
  verticalSliderRight.onmousedown = function (e) {
    mouseDown(e, 3);
  };
  horizontalSliderTop.onmousedown = function (e) {
    mouseDown(e, 2);
  };
  horizontalSliderBottom.onmousedown = function (e) {
    mouseDown(e, 4);
  };

  document.addEventListener("mouseup", mouseUp, false);
  function mouseUp(e) {
    document.removeEventListener("mousemove", sliderMove, false);
  }

  function mouseDown(e, index) {
    rollerShutterConfig.index = index;
    document.addEventListener("mousemove", sliderMove, false);
  }

  function sliderMove(e) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
    switch (rollerShutterConfig.index) {
      case 1:
        verticalSliderLeft.style.left = e.clientX + "px";
        rollerShutterConfig.left = e.clientX / width;
        break;
      case 2:
        horizontalSliderTop.style.top = e.clientY + "px";
        rollerShutterConfig.top = e.clientY / height;
        break;
      case 3:
        verticalSliderRight.style.left = e.clientX + "px";
        rollerShutterConfig.right = e.clientX / width;
        break;
      case 4:
        horizontalSliderBottom.style.top = e.clientY + "px";
        rollerShutterConfig.bottom = e.clientY / height;
        break;
    }
    setRollerShutterSplit();
  }
}

// 监听
watch(
  () => state.selectedType,
  (val) => {
    switch (val) {
      case "noRoller":
        state.customRoller = 0;
        enableSlider(0);
        cancelLayersRoller(false);
        break;
      case "lrRoller":
        enableSlider(1);
        rollerShutterConfig.mode = Number(state.lrRoller);
        break;
      case "tbRoller":
        enableSlider(4);
        rollerShutterConfig.mode = Number(state.tbRoller);
        break;
      case "customRoller":
        enableSlider(15);
        rollerShutterConfig.mode = 15;
        break;
      default:
        break;
    }
    if (val === "noRoller") return;
    setRollerShutterSplit();
  }
);
watch(
  () => state.lrRoller,
  (val) => {
    if (state.selectedType === "noRoller") return;
    rollerShutterConfig.mode = Number(val);
    setRollerShutterSplit();
  }
);
watch(
  () => state.tbRoller,
  (val) => {
    if (state.selectedType === "noRoller") return;
    rollerShutterConfig.mode = Number(val);
    setRollerShutterSplit();
  }
);
watch(
  () => state.customRoller,
  (val) => {
    if (state.selectedType === "noRoller") return;
    rollerShutterConfig.mode = Number(val);
    setRollerShutterSplit();
  }
);
</script>

<style lang="scss" scoped>
// 卷帘
#verticalSlider {
  position: absolute;
  left: 50%;
  top: 0;
  background-color: #d3d3d3;
  width: 0.03rem;
  height: 100%;
  z-index: 1;
  display: none;
  cursor: ew-resize;
}

#horizontalSlider {
  position: absolute;
  left: 0;
  top: 50%;
  background-color: #d3d3d3;
  width: 100%;
  height: 0.03rem;
  z-index: 1;
  display: none;
  cursor: ns-resize;
}

#verticalSliderLeft {
  @extend #verticalSlider;
  left: 33%;
}

#verticalSliderRight {
  @extend #verticalSlider;
  left: 66%;
}

#horizontalSliderTop {
  @extend #horizontalSlider;
  top: 33%;
}

#horizontalSliderBottom {
  @extend #horizontalSlider;
  top: 66%;
}
</style>
