<template>
    <div class="row-item">
      <span>类型</span>
      <n-select
        style="width: 1.96rem;height: 32px;"
        v-model:value="state.selectedType"
        size="small"
        :options="state.optionMode"
      />
    </div>
    <n-checkbox
      v-model:checked="state.showEditCheck"
      style="margin-left: 1.2rem; margin-bottom: 0.1rem"
    >
      显示编辑框
    </n-checkbox>

    <div class="row-item" v-show="state.showEditCheck">
        <span>参数设置</span>
        <div style="width: 1.96rem;height: 0.32rem;">
        <n-switch v-model:value="state.setParam" size="small" />
        </div>
    </div>

    <!-- 参数设置 -->
    <div v-show="state.setParam">
        <div class="row-item">
        <span>发射类型</span>
        <n-select
            style="width: 1.96rem;height: 32px;"
            v-model:value="state.selectedType"
            size="small"
            :options="state.optionMode"
        />
        </div>

        <div class="row-item">
            <span>粒子数量</span>
            <n-input-number
                style="width: 1.96rem;height: 0.32rem;"
                v-model:value="state.dottedLength"
                :show-button="false"
                >
            </n-input-number
            >
        </div>

        <div class="row-item">
            <span>生命周期</span>
            <div class="slider-box" style="width: 1.96rem;height: 32px;">
                <n-slider style="width: 1.5rem" v-model:value="state.dottedLength" :step="1" :min="10" :max="200" />
                <span>{{ state.dottedLength }}</span>
            </div>
        </div>
        <div class="row-item">
            <span>速度范围</span>
            <div class="slider-box" style="width: 1.96rem;height: 32px;">
                <n-slider style="width: 1.5rem" v-model:value="state.dottedLength" :step="1" :min="10" :max="200" />
                <span>{{ state.dottedLength }}</span>
            </div>
        </div>
        <div class="row-item">
            <span>比例范围</span>
            <div class="slider-box" style="width: 1.96rem;height: 32px;">
                <n-slider style="width: 1.5rem" v-model:value="state.dottedLength" :step="1" :min="10" :max="200" />
                <span>{{ state.dottedLength }}</span>
            </div>
        </div>
        <div class="row-item">
            <span>重力</span>
            <div class="slider-box" style="width: 1.96rem;height: 32px;">
                <n-slider style="width: 1.5rem" v-model:value="state.dottedLength" :step="1" :min="10" :max="200" />
                <span>{{ state.dottedLength }}</span>
            </div>
        </div>
    </div>

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
:deep(.n-slider-handle){
  background-color: #414141 !important;
  border: 1.5px solid #3499E5 !important;
}
  </style>
    
    
    
    
    
    