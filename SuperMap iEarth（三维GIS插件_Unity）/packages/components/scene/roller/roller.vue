<template>
  <n-space vertical>
    <div class="sm-box">
      <n-ellipsis style="line-height: 28px;">{{locale.RollerMode}}</n-ellipsis>
      <n-select size="small" v-model:value="state.rollerMode" :options="state.options" />
    </div>
    <n-checkbox v-model:checked="state.useRoller">{{locale.UseRoller}}</n-checkbox>
    <n-radio-group
      v-model:value="state.lrRoller"
      name="lrRoller"
      style="width:100%"
      v-if="show_lrRoller"
    >
      <n-space justify="space-between">
        <n-radio :value="1">{{locale.ShieldLeft}}</n-radio>
        <n-radio :value="2">{{locale.ShieldRight}}</n-radio>
      </n-space>
    </n-radio-group>
    <n-radio-group
      v-model:value="state.tbRoller"
      name="TbRoller"
      style="width:100%"
      v-if="show_tbRoller"
    >
      <n-space justify="space-between">
        <n-radio :value="4">{{locale.ShieldTop}}</n-radio>
        <n-radio :value="8">{{locale.ShieldBottom}}</n-radio>
      </n-space>
    </n-radio-group>
    <div v-show="state.useRoller">
      <com-layer-tree
        :is-update="state.useRoller"
        :default-show-types="['S3M']"
        :delet-button-show="false"
        :default-checked-keys="['root--s3m']"
        @getCheckedKeys="getCheckedKeys"
        @getS3mLayers="getS3mLayers"
      />
    </div>
  </n-space>
</template>

<script setup>
import {
  inject,
  onBeforeUnmount,
  reactive,
  watch,
  onMounted,
  computed
} from "vue";
import {
  NSpace,
  NButton,
  NEllipsis,
  NSelect,
  NCheckbox,
  NRadioGroup,
  NRadio
} from "naive-ui";

let { locale } = inject("storeData");

onMounted(() => {
  createSlider();
});
const show_lrRoller = computed(
  () => state.rollerMode === "lrRoller" && state.useRoller
);
const show_tbRoller = computed(
  () => state.rollerMode === "tbRoller" && state.useRoller
);

// 初始化数据
let state = reactive({
  rollerMode: "lrRoller", //显示模式
  useRoller: false,
  lrRoller: 1, //左右卷帘时默认屏蔽左边
  tbRoller: 4, //上下卷帘时默认屏蔽上面
  options: [
    {
      label: () => locale.value.LrRoller,
      value: "lrRoller"
    },
    {
      label: () => locale.value.TbRoller,
      value: "tbRoller"
    },
    {
      label: () => locale.value.CustomRoller,
      value: "customRoller"
    }
  ]
});

let verticalSliderLeft = "verticalSliderLeft",
  verticalSliderRight = "verticalSliderRight",
  horizontalSliderTop = "horizontalSliderTop",
  horizontalSliderBottom = "horizontalSliderBottom",
  fdom;
let layers, selectedKeys;

let rollerShutterConfig = {
  bottom: 0.66,
  left: 0.33,
  right: 0.66,
  top: 0.33,
  index: 1, //当前控制卷帘条
  mode: 1 //卷帘模式
};

// 创建和移除卷帘条
function createSlider(dom, id) {
  fdom = document.getElementById("unityContainer");
  verticalSliderLeft = document.createElement("div");
  appendDom(verticalSliderLeft, "verticalSliderLeft");
  verticalSliderRight = document.createElement("div");
  appendDom(verticalSliderRight, "verticalSliderRight");
  horizontalSliderTop = document.createElement("div");
  appendDom(horizontalSliderTop, "horizontalSliderTop");
  horizontalSliderBottom = document.createElement("div");
  appendDom(horizontalSliderBottom, "horizontalSliderBottom");
  function appendDom(dom, id) {
    dom.id = id;
    dom.className = "roller-slider";
    fdom.appendChild(dom);
  }
  bindSliderEvt(); //绑定事件
}

function removeSlider() {
  sliders.forEach(dom => fdom.removeChild(dom));
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
function setLayersRoller(bounds) {
  if (!layers) return;
  if (selectedKeys) {
    cancelLayersRoller();
    keys.forEach(key => {
      let index = key.split("--")[2];
      index = Number(index);
      if (index === NaN) return;
      layer.set_swipeEnabled(true);
      layers[index].set_swipeRegion(bounds);
    });
  } else {
    layers.forEach(layer => {
      if (layer.type === SuperMap.Web.Realspace.Layer3DType.OSGB) {
        layer.set_swipeEnabled(true);
        layer.set_swipeRegion(bounds);
      }
    });
  }
}

// 取消所有图层的卷帘
function cancelLayersRoller() {
  if (!layers) return;
  layers.forEach(layer => {
    if (layer.type === SuperMap.Web.Realspace.Layer3DType.OSGB) {
      layer.set_swipeEnabled(false);
    }
  });
}

// 勾选图层节点
function getCheckedKeys(params) {
  selectedKeys = params;
  setRollerShutterSplit();
}

// 获取当前所有s3m图层
function getS3mLayers(s3mlayers) {
  layers = s3mlayers;
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
  let bounds;
  // 左右卷帘使用left slider滑动，上下卷帘使用top slider滑动
  switch (mode) {
    case 1:
      bounds = { left: x1, top: 0, right: 1, bottom: 1 };
      break;
    case 2:
      bounds = { left: 0, top: 0, right: x1, bottom: 1 };
      break;
    case 4:
      bounds = { left: 0, top: y1, right: 1, bottom: 1 };
      break;
    case 8:
      bounds = { left: 0, top: 0, right: 1, bottom: y1 };
      break;
    case 15:
      bounds = { left: x1, top: y1, right: x2, bottom: y2 };
      break;
    default:
      bounds = { left: 0, top: 0, right: 1, bottom: 1 };
      break;
  }
  setLayersRoller(bounds);
}

/**
 * 注册卷帘分割条的拖拽事件。
 */
function bindSliderEvt() {
  let width = fdom.clientWidth; // 界面宽度
  let height = fdom.clientHeight; // 界面高度
  verticalSliderLeft.addEventListener(
    "mousedown",
    function(e) {
      mouseDown(e, 1);
    },
    false
  );
  verticalSliderRight.onmousedown = function(e) {
    mouseDown(e, 3);
  };
  horizontalSliderTop.onmousedown = function(e) {
    mouseDown(e, 2);
  };
  horizontalSliderBottom.onmousedown = function(e) {
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

watch(
  () => state.useRoller,
  val => {
    if (val) {
      if (rollerShutterConfig.mode == 1 || rollerShutterConfig.mode == 2)
        enableSlider(1);
      if (rollerShutterConfig.mode == 4 || rollerShutterConfig.mode == 8)
        enableSlider(4);
      if (rollerShutterConfig.mode == 15) enableSlider(15);
      setRollerShutterSplit();
    } else {
      enableSlider(0);
      cancelLayersRoller();
    }
  }
);

watch(
  () => state.rollerMode,
  val => {
    switch (val) {
      case "lrRoller":
        if (state.useRoller) enableSlider(1);
        rollerShutterConfig.mode = Number(state.lrRoller);
        break;
      case "tbRoller":
        if (state.useRoller) enableSlider(4);
        rollerShutterConfig.mode = Number(state.tbRoller);
        break;
      case "customRoller":
        if (state.useRoller) enableSlider(15);
        rollerShutterConfig.mode = 15;
        break;
      default:
        break;
    }
    if (!state.useRoller) return;
    setRollerShutterSplit();
  }
);
watch(
  () => state.lrRoller,
  val => {
    if (!state.useRoller) return;
    rollerShutterConfig.mode = Number(val);
    setRollerShutterSplit();
  }
);
watch(
  () => state.tbRoller,
  val => {
    if (!state.useRoller) return;
    rollerShutterConfig.mode = Number(val);
    setRollerShutterSplit();
  }
);

// 销毁
onBeforeUnmount(() => {
  layers = undefined;
  removeSlider();
});
</script>

<style lang="scss" >
// 卷帘
#verticalSlider {
  position: absolute;
  left: 50%;
  top: 0;
  background-color: #d3d3d3;
  width: 3px;
  height: 100%;
  z-index: 100;
  display: none;
  cursor: ew-resize;
}

#horizontalSlider {
  position: absolute;
  left: 0;
  top: 50%;
  background-color: #d3d3d3;
  width: 100%;
  height: 3px;
  z-index: 100;
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



