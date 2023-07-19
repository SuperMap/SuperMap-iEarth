<template>
  <!-- 试图模式 -->
  <div class="row-item">
    <span>{{$t('global.viewMode')}}</span>
    <n-select
      style="width: 1.96rem;"
      v-model:value="state.viewMode"
      :options="state.options_viewMode"
    />
  </div>

  <!-- 分屏模式 -->
  <div class="row-item" v-show="!state.rollerShutterShow">
    <span>{{$t('global.splitscreenModel')}}</span>
    <n-select
      style="width: 1.96rem;"
      v-model:value="state.selectedType"
      :options="state.options_split"
    />
  </div>

  <!-- 卷帘 -->
  <div class="row-item">
    <span>{{$t('global.openRollershutter')}}</span>
    <div style="width: 1.96rem;">
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
  options_split:any,// 分屏选项
  options_viewMode:any,// 视图选项
  selectedType: string, // 当前视口的选择类型
  // selectedViewport: number, // 
  // newData: any,
  viewMode: number, // 视图模式
  rollerShutterShow: boolean, // 开启卷帘
}

// 初始化数据
let state = reactive<stateType>({
  options_split: [
    {
      label: () => GlobalLang.noneSplitscreen,
      value: "NONE",
    },
    {
      label: () => GlobalLang.horizontalSplitscreen,
      value: "HORIZONTAL",
    },
    {
      label: () => GlobalLang.verticalSplitscreen,
      value: "VERTICAL",
    },
    {
      label: () => GlobalLang.threeViewport,
      value: "TRIPLE",
    },
    {
      label: () => GlobalLang.fourViewport,
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
  // selectedViewport: 0,
  // newData: null,
  viewMode: 0, // 视图模式
  rollerShutterShow: false, // 开启卷帘
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
    if(val){
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
  viewer.scene.multiViewportMode = SuperMap3D.MultiViewportMode["NONE"];
});
</script>
  
  
  
  
  
  
  
  