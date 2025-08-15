<!-- 量算 -->
<template>
  <div class="right-panel-container-not-tabs">
    <!-- 空间模式 -->
    <div class="row-wrap">
      <div class="label">{{ $t("measureMode") }}</div>
      <div class="content">
        <n-select v-model:value="state.measureMode" :options="state.options" @update:value="updateEllipsoidMode">
        </n-select>
      </div>
    </div>
    
    <!-- 量算模式 -->
    <div class="row-wrap">
      <div class="content">
        <div class="icon-list-box">
          <span v-for="(line, index) in state.currentItemOption" :key="index" class="icon-span" :title="line.lable"
            :class="line.isSelect ? 'selected-icon' : ''" @click="changleIconItem(line)">
            <i class="iconfont iconSize" :class="line.iconName" style="margin-top: 0px"></i>
          </span>
        </div>
      </div>
    </div>
    
    <!-- 连续绘制 -->
    <div class="row-wrap">
      <div class="content">
        <n-checkbox @update:checked="openContinueDraw" v-model:checked="state.isContinueDraw" :label="$t('continueDraw')" />
      </div>
    </div>
    
    <!-- 顶点捕捉 -->
    <div class="row-wrap" v-show="state.measureMode == 'Space'">
      <div class="content">
        <n-checkbox @update:checked="openPickPoint" v-model:checked="state.pickPointEnabled" :label="$t('pickPoint')" />
      </div>
    </div>
    
    <!-- 等高线 -->
    <div class="row-wrap" v-show="state.currentItemIndex === 2">
      <div class="content">
        <n-checkbox @update:checked="showContourLine" v-model:checked="state.isShowLine" :label="$t('contour')" />
      </div>
    </div>

    <div class="row-btns">
      <n-button @click="StartMeasure" class="operate" type="info" :focusable="false">{{
      $t("measureAction") }}</n-button>
      <n-button @click="clear" :focusable="false">{{ $t("clear") }}</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount, watch } from "vue";
import SceneMeasure from "@/lib/SceneMeasure";

type stateType = {
  measureMode: string; //测量模式
  clampMode: any; //贴地模式
  isContinueDraw: boolean; //连续绘制
  isShowLine: boolean; //显示等高线
  pickPointEnabled: boolean; //开启顶点捕捉
  currentItemIndex: number; // 当前索引
  options: any; // 量算模式选项
  itemOptions: any; // 测量方式选项
  currentItemOption: any; // 当前测量方式选项
};

let state = reactive<stateType>({
  measureMode: "Space", //测量模式
  clampMode: SuperMap3D.ClampMode.Space, //贴地模式
  isContinueDraw: true, //连续绘制
  isShowLine: true, //显示等高线
  pickPointEnabled: false, //开启顶点捕捉
  currentItemIndex: 1,
  options: [
    {
      label: () => $t("mode_space"),
      value: "Space",
    },
    {
      label: () => $t("mode_ground"),
      value: "Ground",
    },
    {
      label: () => "CGCS2000",
      value: "CGCS2000",
    },
    {
      label: () => "XIAN80",
      value: "XIAN80",
    },
    {
      label: () => "WGS84",
      value: "WGS84",
    },
    {
      label: () => $t("mode_projection"),
      value: "Projection",
    },
  ],
  itemOptions: {
    Space: [
      {
        id: 1,
        lable: $t("measureDistence"),
        iconName: "iconceju",
        isSelect: true,
      },
      {
        id: 2,
        lable: $t("measureHeight"),
        iconName: "iconcegao",
        isSelect: false,
      },
      {
        id: 3,
        lable: $t("measureArea"),
        iconName: "iconcemian",
        isSelect: false,
      },
    ],
    Ground: [
      {
        id: 1,
        lable: $t("measureDistence"),
        iconName: "iconyidijuli1",
        isSelect: true,
      },
      {
        id: 2,
        lable: $t("measureHeight"),
        iconName: "iconcegao",
        isSelect: false,
      },
      {
        id: 3,
        lable: $t("measureArea"),
        iconName: "iconyidimianji",
        isSelect: false,
      },
    ],
    Projection: [
      {
        id: 1,
        lable: $t("measureDistence"),
        iconName: "iconyidijuli1",
        isSelect: true,
      },
      {
        id: 2,
        lable: $t("measureHeight"),
        iconName: "iconcegao",
        isSelect: false,
      },
      {
        id: 3,
        lable: $t("measureArea"),
        iconName: "icontouying",
        isSelect: false,
      },
    ],
  },
  currentItemOption: [
    {
      id: 1,
      lable: $t("measureDistence"),
      iconName: "iconceju",
      isSelect: true,
    },
    {
      id: 2,
      lable: $t("measureHeight"),
      iconName: "iconcegao",
      isSelect: false,
    },
    {
      id: 3,
      lable: $t("measureArea"),
      iconName: "iconcemian",
      isSelect: false,
    },
  ],
});

const measure = new SceneMeasure(viewer, {
  isContinuousDrawing: true, // 是否连续绘制 【默认为true】
  isShowContourLine: true, // 是否显示等高线 【默认为true】【仅适用于测高模式】
  isPickPoint: false // 是否开启顶点捕捉 【默认为false】
})

onBeforeUnmount(() => {
  measure.destroy();
});

// 改变当前item索引
function changleIconItem(item: any) {
  state.currentItemIndex = item.id;
  for (let i = 0; i < state.currentItemOption.length; i++) {
    if (state.currentItemOption[i].id == item.id) {
      state.currentItemOption[i].isSelect = true;
    } else {
      state.currentItemOption[i].isSelect = false;
    }
  }
}

// 切换图标
function updateIconItem() {
  for (let i = 0; i < state.currentItemOption.length; i++) {
    if (state.currentItemOption[i].id == state.currentItemIndex) {
      state.currentItemOption[i].isSelect = true;
    } else {
      state.currentItemOption[i].isSelect = false;
    }
  }
}

// 开始测量
function StartMeasure() {
  switch (state.currentItemIndex) {
    case 1:
      MeasureDistance();
      break;
    case 2:
      MeasureHeight();
      break;
    case 3:
      MeasureArea();
      break;
    default:
      break;
  }
}



// 测量距离
function MeasureDistance() {
  measure.startDistence().then(result => {
    console.log(result);
  });
}

// 测量高度
function MeasureHeight() {
  measure.startHeight().then(result => {
    console.log(result);
  });
}

// 测量面积
function MeasureArea() {
  measure.startArea().then(result => {
    console.log(result);
  });
}

// 更新量算模式
function updateEllipsoidMode(val: string) {
  // 切换坐标系时,传入椭球枚举,量算类内部会根据该枚举值,选择对应椭球计算量算结果
  measure.setCalculateMode(val);

  // 量算过程中绘制线的风格：0空间模式 1贴地模式
  if (val == "Space") {
    measure.setClampMode(SuperMap3D.ClampMode.Space)
  } else {
    measure.setClampMode(SuperMap3D.ClampMode.Ground)
  }
}

// 开启等高线
function showContourLine(val: boolean) {
  measure.setContourLineEnable(Boolean(val)); // 设置是否显示等高线【仅适用于测高模式】
}

// 开启顶点捕捉
function openPickPoint(val: boolean) {
  measure.setPickPointEnable(Boolean(val)); // 设置是否开启顶点捕捉
}

// 开启连续绘制
function openContinueDraw(val: boolean) {
  measure.setContinueDrawEnable(Boolean(val)); // 设置是否开启连续绘制
}

// 清除
function clear() {
  measure.clear();
}

watch(
  () => state.measureMode,
  (val) => {
    switch (val) {
      case "Space":
        state.currentItemOption = state.itemOptions["Space"];
        break;
      case "Ground":
        state.currentItemOption = state.itemOptions["Ground"];
        break;
      case "Projection":
        state.currentItemOption = state.itemOptions["Projection"];
        break;
      default:
        state.currentItemOption = state.itemOptions["Space"];
        break;
    }

    updateIconItem();
  }
);
</script>