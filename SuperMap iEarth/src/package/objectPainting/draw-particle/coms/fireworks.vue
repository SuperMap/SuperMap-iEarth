<template>
   
    <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="add"
      style="margin-right: 0.1rem"
      >添加</n-button
    >
    <n-button class="btn-secondary" @click="clear">清除</n-button>
  </div>

  </template>
    
    <script lang="ts" setup>
  import { reactive, onBeforeUnmount, watch } from "vue";


  
  // 初始化数据
  let state = reactive({
    selectedType: "NONE",
    selectedId: 0,
    showEditCheck:true,
    setParam:false,

    
    lineColor: "rgba(250, 196, 65, 1)", //设置线颜色
    lineWidth: 5, //设置选中线宽
    dottedColor: "rgba(250, 196, 65, 0)", //间隔颜色
    dottedLength: 30,
    outLineColor: "rgba(29, 206, 200, 1)",
    outLineWidth: 2,
    glowStrength: 0.5,
    trailPercentage: 0.3,
    isEdit: false,
    isEditZ: false,
    optionMode: [
      {
        label: () => '标准立体火焰',
        value: "NONE",
      },
      {
        label: () => '流淌火',
        value: "TERRAIN",
      }
    ],
  });
  
  
function add(){};
function clear(){};
  onBeforeUnmount(() => {
    // clear();
  });
  
  </script>
    
    
  <style lang="scss" scoped>
  
  </style>
    
    
    
    
    
    