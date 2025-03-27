<template>
  <span class="icon-container" @click="openLocalScene">
    <i class="iconfont icondaoru" :title="$t('w_openLocalScene')"></i>
  </span>
</template>

<script setup lang="ts">
import tool from "@/tools/tool";
import openScene from "@/tools/openScene";

// 打开本地场景JSON
async function openLocalScene() {
  const data: any = await tool.openLocalFile();
  console.log("本地场景JSONData:", data);

  // 计算sceneInfo
  let sceneInfo: any = undefined;
  if (data.content) {
    const content = (typeof data.content === 'string') ? JSON.parse(data.content) : data.content; // iportal中保存的content格式为string
    sceneInfo = content.sceneInfo;
  } else {
    sceneInfo = data;
  }
  if (!sceneInfo) return;

  // 计算layerTreeData
  let layerTreeData: any = undefined;
  if (data.content && data.content.layerTreeData) {
    layerTreeData = data.content.layerTreeData
  }

  // 计算bindiEarthData
  let bindiEarthData: any = undefined;
  if (data.content && data.content.bindiEarthData) {
    bindiEarthData = data.content.bindiEarthData
  }

  // 统一处理场景内容绑定数据等操作
  openScene.handleSceneContent({
    sceneInfo:sceneInfo,
    layerTreeData: layerTreeData,
    bindiEarthData:bindiEarthData
  });
}

</script>
