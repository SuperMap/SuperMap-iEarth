<template>
  <n-space vertical>
    <!-- 试图模式 -->
    <sm-rowLayOut marginbottom="0.2rem">
      <template #item-lable>{{ locale.ViewMode }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.viewMode"
          size="small"
          :options="state.options_viewMode"
        />
      </template>
    </sm-rowLayOut>

    <!-- 分屏模式 -->
    <sm-rowLayOut marginbottom="0.2rem">
      <template #item-lable>{{ locale.SplitScreenMode }}</template>
      <template #item-content>
        <n-select
          v-model:value="state.selectedType"
          size="small"
          :options="state.options_split"
        />
      </template>
    </sm-rowLayOut>

       <sceneRoller></sceneRoller>

    </n-space>
</template>
  
<script lang="ts" setup>
import { onBeforeUnmount, watch, reactive, ref } from "vue";
import sceneRoller from "./coms/scene-roller.vue";
import locale from "@/tools/locateTemp";

// 初始化数据
let state = reactive({
  options_split: [
    {
      label: () => locale.NoneSplit,
      value: "NONE",
    },
    {
      label: () => locale.HorizontalSplit,
      value: "HORIZONTAL",
    },
    {
      label: () => locale.VerticallySplit,
      value: "VERTICAL",
    },
    {
      label: () => locale.TripleSplit,
      value: "TRIPLE",
    },
    {
      label: () => locale.QuadSplit,
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
  selectedViewport: 0,
  newData: null,
  viewMode: 0, // 视图模式
  rollerShutterShow: false, // 开启卷帘
});

//监听 视口
watch(
  () => state.selectedType,
  (val) => {
    viewer.scene.multiViewportMode = Cesium.MultiViewportMode[val];
  }
);
// 监听 分屏模式
watch(
  () => state.viewMode,
  (val) => {
    if (val === 2) {
      viewer.scene.mode = Cesium.SceneMode.SCENE2D;
    } else if (val === 0) {
      viewer.scene.mode = Cesium.SceneMode.SCENE3D;
    } else {
      viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
    }
  }
);

//定义子组件实例，名称要和上面的ref相同
const sceneRollerRef: any = ref(null);
// 关闭卷帘
function handleChange(value: boolean) {
  if (!value) {
    sceneRollerRef.value.enableSlider(0);
    sceneRollerRef.value.cancelLayersRoller(false);
  }
}

onBeforeUnmount(() => {
  state.rollerShutterShow = false;
});
</script>
  
  
  
  
  
  
  
  