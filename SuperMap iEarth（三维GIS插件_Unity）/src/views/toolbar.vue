<template>
      <div id="toolbar" class="toolbar">
        <n-card content-style="padding:6px;" :class="{'disable':disableToolbar}">
          <n-space>
            <n-button text @click="showLayerTree=!showLayerTree" class="iconfont icontuceng" :title="resource.LayerManage"></n-button>
            <n-space v-show="isExtendToolbar">
              <n-button text @click="setSeletcedComponent('addLayer')" class="iconfont iconiEarth-tianjia" :title="resource.AddLayer"></n-button>
              <n-button text @click="setSeletcedComponent('terrain')" class="iconfont icondixing" :title="resource.Terrain"></n-button>
              <!-- <n-button text @click="setSeletcedComponent('clip')" class="iconfont iconcaijian1" :title="resource.Clip"></n-button> -->
              <n-button text @click="setSeletcedComponent('analysis')" class="iconfont icontoolbar-analysis" :title="resource.Analysis"></n-button>
              <n-button text @click="setSeletcedComponent('measure')" class="iconfont iconliangsuan" :title="resource.Measure"></n-button>
              <n-button text @click="setSeletcedComponent('query')" class="iconfont iconkongjianfenxi" :title="resource.Query"></n-button>
            </n-space>
            <n-button text @click="isExtendToolbar=!isExtendToolbar" :class="isExtendToolbar? 'iconfont iconiEarth-R8-xiugai_shouqi' : 'iconfont iconiEarth-R8-xiugai_zhankai'" ></n-button>
          </n-space>
        </n-card>
      </div>

    <!-- 后面要开的其他功能
    <n-button text @click="setSeletcedComponent('clip')" class="iconfont iconcaijian1" :title="resource.Clip"></n-button>
    <n-button text class="iconfont iconditushezhi"></n-button>
    <n-button text class="iconfont iconchangjingshezhi"></n-button>
    <n-button text class="iconfont iconzaixianbianji" ></n-button> -->

</template>

<script setup>
import { reactive, ref, watch,shallowRef,inject } from "vue";

let {isViewer} = inject("storeState");
let { resource,seletcedComponent,showLayerTree } = inject("state");

let isExtendToolbar = ref(true);

//初始化地球完成前不能点击toolbar
let disableToolbar = ref(true);
watch(isViewer, val =>  disableToolbar.value = false);

  
function setSeletcedComponent(name){
  if(seletcedComponent.value === name)
    seletcedComponent.value = null;
  else  seletcedComponent.value = name;
}

</script>

<style lang="scss" scoped>
.toolbar {
  width: auto;
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 999;
  .n-space{
    button {
    padding: 6px;
    font-size: 24px;
   }
  }
}
</style>