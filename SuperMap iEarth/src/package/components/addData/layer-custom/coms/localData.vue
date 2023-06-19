<template>
  <sm-rowLayOut lableWidth="0.77rem">
    <template #item-lable>KML</template>
    <template #item-content>
      <n-input-group class="n-input-border">
        <n-input
          size="small"
          :placeholder="$t('global.localFilePath')"
          v-model:value="state.fileSrc"
        />
        <n-button type="primary" size="small" @click="chooseFile">{{
          $t("global.fileFold")
        }}</n-button>
        <input
          type="file"
          accept=".kml"
          id="localFile"
          style="display: none"
          ref="localKML_dom"
        />
      </n-input-group>
    </template>
  </sm-rowLayOut>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";

let state = reactive({
  fileSrc: "", //文件地址
});
let localKML_dom = ref();

// 点击选择文件函数
function chooseFile() {
  localKML_dom.value.click();
}

//文件夹改变文件触发
function fileChange() {
  localKML_dom.value.addEventListener("change", function (evt) {
    let target = evt.target as any;
    if (!target) return;
    let file = target.files[0];
    if (!file) return;
    state.fileSrc = localKML_dom.value.value;
    // file转blob
    const blob = new Blob([file], { type: "" });
    // console.log("blob:", blob)
    viewer.dataSources
      .add(
        Cesium.KmlDataSource.load(blob, {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
        })
      )
      .then(function (dataSource: any) {
        viewer.flyTo(dataSource);
        viewer.scene.layer = dataSource;
      });
  });
}
onMounted(() => {
  fileChange();
});
</script>


