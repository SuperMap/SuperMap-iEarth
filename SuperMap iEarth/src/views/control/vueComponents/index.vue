<template>
    <n-card>
        <span>工具栏组件:</span>
        <n-checkbox-group v-model:value="tools">
            <n-space item-style="display: flex;">
                <n-checkbox value="Beijing" label="图层管理" />
                <n-checkbox value="Shanghai" label="添加图层" />
                <n-checkbox value="Guangzhou" label="底图选择" />
                <n-checkbox value="Shenzen" label="场景属性" />
            </n-space>
        </n-checkbox-group>

        <n-button @click="handleUpdateValue">控件显隐</n-button>
        <n-divider />
        <span>Cesium小控件:</span>
        <n-checkbox-group v-model:value="widgets">
            <n-space item-style="display: flex;">
                <n-checkbox value="Beijing1" label="指北" />
                <n-checkbox value="Shanghai2" label="重置" />
                <n-checkbox value="Guangzhou3" label="放大" />
                <n-checkbox value="Shenzen4" label="缩小" />
                <n-checkbox value="Shenzen5" label="场景模式" />
                <n-checkbox value="Shenzen6" label="搜索" />
                <n-checkbox value="Shenzen7" label="VR模式" />
                <n-checkbox value="Shenzen8" label="动画组件" />
            </n-space>
        </n-checkbox-group>
    </n-card>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia';
import { toolBarStoreCreate } from '@/store/toolBar/toolBar';
const toolBarStore = toolBarStoreCreate();
// 为避免解构时失去响应性
let { toolShow } = storeToRefs(toolBarStore);


let handleUpdateValue = function () {
    toolShow.value = !toolShow.value
}


let tools = ref(null)

let widgets = ref(null)



</script>
