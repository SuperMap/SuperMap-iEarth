<template>
  <div class="row-item">
    <span>KML</span>
    <n-input
      style="width: 2.4rem"
      placeholder="请选择本地KML数据"
      v-model:value="state.fileSrc"
    />
    <n-button type="primary" size="small" @click="chooseFile">文件夹</n-button>
    <input type="file" accept=".kml" id="localFile" style="display:none" ref="localKML_dom" />
  </div>
  <div class="btn-row-item">
    <n-button
      type="info"
      color="#3499E5"
      text-color="#fff"
      @click="chooseFile"
      style="margin-right: 0.1rem"
      >确定</n-button
    >
    <n-button class="btn-secondary" @click="clear">取消</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted,reactive } from 'vue';

let state = reactive({
    fileSrc: "", //文件地址
});
let localKML_dom = ref();

// 点击选择文件函数
function chooseFile() {
    localKML_dom.value.click();
}
function clear(){};
//文件夹改变文件触发
function fileChange() {
    localKML_dom.value.addEventListener("change", function (evt) {

    let target = evt.target as any;
    if (!target) return
    let file = target.files[0];
    if (!file) return;
    state.fileSrc = localKML_dom.value.value;
    // file转blob
    const blob = new Blob([file], { type: "" })
    // console.log("blob:", blob)
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
    });
}
onMounted(() => {
  fileChange();
})


</script>


