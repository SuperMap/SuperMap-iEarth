<template>
  <sm-config-provider >
      <toolbar/>
      <right-toolbar/>
       <viewer/> 
       <layer-tree :show='state.showLayerTree' />
      <keep-alive :max="5" :exclude="['addLayer']">
        <component :is="state.seletcedComponent"></component>
      </keep-alive>
  </sm-config-provider>
</template>

<script setup>
import { reactive ,provide,toRefs,inject} from "vue";
import toolbar from "./toolbar.vue";
import rightToolbar from "./right-toolbar.vue";
// 设置语言主题
import zh from "@/js/locales/zh.js";
import { darkTheme } from "vue-gis-ge";
let { setTheme, setLocale } = inject("storeActions");
setTheme(darkTheme);  //默认设置深色


//iearth全局注入
let state = reactive({
  resource: zh, //iearth 语言设置
  showLayerTree: false, // 控制图层树的组件显隐
  // showComponent: true, // 控制当前选中的组件显隐
  seletcedComponent: null // 当前展示的组件名字，默认无
});

provide("state", {...toRefs(state)});

</script>

