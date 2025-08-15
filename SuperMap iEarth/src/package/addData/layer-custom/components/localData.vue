<template>
  <div class="row-wrap">
    <div class="label"> KML </div>
    <div class="content">
      <n-input-group>
        <n-input v-model:value="state.fileSrc" :placeholder="$t('localFilePath')" />
        <n-button @click="chooseFile" type="tertiary">{{
        $t("chooseFile")
        }}</n-button>
      </n-input-group>
    </div>
  </div>

  <div class="row-btns">
    <n-button @click="clear" ghost>{{ $t("clear") }}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import tool from "@/tools/tool";

const state = reactive({
  fileSrc: "", //文件地址
});

// 点击选择文件函数
async function chooseFile() {
  const file: any = await tool.openLocalFile('.kml', true);
  if (!file || !(file instanceof File)) return;

  state.fileSrc = file.name;

  // file转blob
  const blob = new Blob([file], { type: "" });
  viewer.dataSources
    .add(
      SuperMap3D.KmlDataSource.load(blob, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
      })
    )
    .then(function (dataSource: any) {
      viewer.flyTo(dataSource);
      viewer.scene.layer = dataSource;
    });
}

// 清除
function clear() {
  state.fileSrc = '';
  viewer.entities.removeAll();
  viewer.dataSources.removeAll();
}
</script>