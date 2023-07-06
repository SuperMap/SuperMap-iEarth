<template>

  <div class="row-item">
    <span>绕点旋转</span>
    <div class="row-content">
      <n-switch v-model:value="state.rotateShow" size="small" />
    </div>
  </div>


  <div v-show="state.rotateShow">

    <div class="row-item">
      <span></span>
      <div class="icon-container">
        <div class="icon-list" style="width: 1.9rem;">
          <span
            v-for="(item, index) in state.itemOptions"
            :key="index"
            class="icon-span"
            :title="item.lable"
            :class="item.isSelect ? 'selected-icon' : ''"
            @click="changleIconItem(item)"
          >
            <!-- <svg-icon :name="line.iconName" class="icon-size" /> -->
            <i class="iconfont iconSize" :class="item.iconName"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="row-item">
      <span>旋转速度</span>
      <div class="slider-box row-content">
        <n-slider
          style="width: 1.5rem;"
          v-model:value="state.speedRatio"
          :step="0.1" :min="0" :max="20"
        />
        <div class="slider-suffix">
          <span>{{ state.speedRatio }}</span>
        </div>
      </div>
    </div>

    <div class="row-item">
      <span></span>
        <div class="row-content">
          <n-checkbox v-model:checked="state.flyCircleLoop"></n-checkbox><span> 循环旋转</span>
        </div>
    </div>

  </div>
</template>
  
<script lang='ts' setup>
import { onBeforeUnmount, watch, reactive } from "vue";

type stateType = {
  speedRatio: 1, // 旋转速度
  flyCircleLoop: true, // 是否循环
  rotateShow: false, // 是否绕点旋转
  itemOptions: any,// 功能选项
}

// 初始化数据
let state = reactive<stateType>({
  speedRatio: 1,
  flyCircleLoop: true,
  rotateShow: false, 
  itemOptions: [
    {
      index: 1,
      lable: "",
      iconName: "icontianjia",
      isSelect: false,
    },
    {
      index: 2,
      lable: "",
      iconName: "iconzanting",
      isSelect: false,
    },
    {
      index: 3,
      lable: "",
      iconName: "icontingzhi",
      isSelect: false,
    },    {
      index: 4,
      lable: "",
      iconName: "iconfuwei",
      isSelect: false,
    }
  ],
});

init();
function init() {
  if (!window.viewer) return;
  viewer.scene.camera.flyCircleLoop = state.flyCircleLoop;
  viewer.scene.camera.speedRatio = state.speedRatio;
}

// 功能切换 
function changleIconItem(item:any){
  state.itemOptions.map((itemObj) => {
    if (itemObj.index == item.index) {
      itemObj.isSelect = true;
    } else {
      itemObj.isSelect = false;
    }
  });

  switch(item.index){
    case 1:{
      startFlyCircle();
      break;
    }
    case 3:{
      clearFlyCircle();
      break;
    }
    default:
        break;
  }
}

// 绑定监听事件
function startFlyCircle() {
  viewer.enableCursorStyle = false;
  viewer._element.style.cursor = "";
  document.body.classList.add("measureCur");
  viewer.eventManager.addEventListener("CLICK", left_click, true);
}

// 绕点旋转
function left_click(e:any) {
  let center = viewer.scene.pickPosition(e.message.position);
  if (SuperMap3D.defined(center)) viewer.scene.camera.flyCircle(center); // 相机绕中心点旋转
  document.body.classList.remove("measureCur");
  viewer.eventManager.removeEventListener("CLICK", left_click);
}

// 清除绕点旋转
function clearFlyCircle() {
  viewer.scene.camera.stopFlyCircle();
  document.body.classList.remove("measureCur");
  viewer.eventManager.removeEventListener("CLICK", left_click);
}

watch(
  () => state.speedRatio,
  (val) => {
    viewer.scene.camera.speedRatio = SuperMap3D.defaultValue(val, 0);
  }
);
watch(
  () => state.flyCircleLoop,
  (val) => {
    viewer.scene.camera.flyCircleLoop = val;
  }
);

onBeforeUnmount(() => {
  clearFlyCircle();
});
</script>
<style lang="scss" scoped>
:deep(.n-slider-handle){
  background-color: #414141 !important;
  border: 1.5px solid #3499E5 !important;
}
</style>
  
  
  
  
  
  
  
  
  
  
  