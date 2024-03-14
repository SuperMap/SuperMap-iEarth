<template>
  <!-- 视图模式 -->
  <div class="row-item">
    <span>{{ $t("viewMode") }}</span>
    <n-select
      style="width: 1.96rem"
      v-model:value="state.viewMode"
      :options="state.options_viewMode"
    />
  </div>

  <!-- 分屏模式 -->
  <div class="row-item" v-show="!state.rollerShutterShow">
    <span>{{ $t("splitscreenModel") }}</span>
    <n-select
      style="width: 1.96rem"
      v-model:value="state.selectedType"
      :options="state.options_split"
    />
  </div>

  <!-- 卷帘 -->
  <div class="row-item">
    <span>{{ $t("openRollershutter") }}</span>
    <div style="width: 1.96rem">
      <n-switch v-model:value="state.rollerShutterShow" size="small" />
    </div>
  </div>

  <div v-if="state.rollerShutterShow">
    <sceneRoller></sceneRoller>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, watch, reactive, ref } from "vue";
import sceneRoller from "./components/scene-roller.vue";

type stateType = {
  options_split: any; // 分屏选项
  options_viewMode: any; // 视图选项
  selectedType: string; // 当前视口的选择类型
  viewMode: number; // 视图模式
  rollerShutterShow: boolean; // 开启卷帘
};

// 初始化变量
let state = reactive<stateType>({
  options_split: [
    {
      label: () => $t("noneSplitscreen"),
      value: "NONE",
    },
    {
      label: () => $t("horizontalSplitscreen"),
      value: "HORIZONTAL",
    },
    {
      label: () => $t("verticalSplitscreen"),
      value: "VERTICAL",
    },
    {
      label: () => $t("threeViewport"),
      value: "TRIPLE",
    },
    {
      label: () => $t("fourViewport"),
      value: "QUAD",
    },
  ],
  options_viewMode: [
    {
      label: "3D",
      value: 0,
    },
    {
      label: "2.5D",
      value: 1,
    },
    // 有问题 先注释
    // {
    //   label: "2D",
    //   value: 2
    // }
  ],
  selectedType: "NONE",
  viewMode: 0, // 视图模式
  rollerShutterShow: false, // 开启卷帘
});

onBeforeUnmount(() => {
  state.rollerShutterShow = false;
  viewer.scene.multiViewportMode = SuperMap3D.MultiViewportMode["NONE"];
});

//监听
watch(
  () => state.selectedType,
  (val) => {
    viewer.scene.multiViewportMode = SuperMap3D.MultiViewportMode[val];
  }
);
watch(
  () => state.rollerShutterShow,
  (val) => {
    if (val) {
      viewer.scene.multiViewportMode = SuperMap3D.MultiViewportMode["NONE"];
    }
  }
);
watch(
  () => state.viewMode,
  (val) => {
    if (val === 2) {
      viewer.scene.mode = SuperMap3D.SceneMode.SCENE2D;
    } else if (val === 0) {
      viewer.scene.mode = SuperMap3D.SceneMode.SCENE3D;
    } else {
      viewer.scene.mode = SuperMap3D.SceneMode.COLUMBUS_VIEW;
    }
  }
);
</script>
