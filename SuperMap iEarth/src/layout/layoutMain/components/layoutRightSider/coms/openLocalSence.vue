<template>
  <span class="icon-container" @click="openLocalScene">
    <i class="iconfont icondaoru" :title="$t('w_openLocalScene')"></i>
  </span>
</template>

<script setup lang="ts">
import tool from "@/tools/tool";
import openScene from "@/tools/openScene";

// 检查传入的对象是否为WebScene保存的内容
function checkInfoIsWebScene(info){
  if(info && info.extensions && info.scene && info.metadata){
    return true;
  }else{
    return false;
  }
}

// 打开本地场景JSON
async function openLocalScene() {
  const data: any = await tool.openLocalFile();
  console.log("本地场景JSONData:", data);

  // 计算出打开场景所需的信息
  const requireInfo = openScene.computedRequireInfoFromData(data);

  // 统一处理场景内容绑定数据等操作
  openScene.handleSceneContent(requireInfo);
}

</script>
