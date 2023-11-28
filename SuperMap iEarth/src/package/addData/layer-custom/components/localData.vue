<template>
  <div class="row-item">
    <div>KML</div>
    <div>
    <n-input-group>
    <n-input
      class="add-input-border"
      style="width: 1.8rem"
      :placeholder="$t('global.localFilePath')"
      v-model:value="state.fileSrc"
    />
    <n-button type="tertiary"  @click="chooseFile" style="width:0.6rem">{{$t('global.chooseFile')}}</n-button>
    </n-input-group>
    </div>
    <input type="file" accept=".kml" id="localFile" style="display:none" ref="localKML_dom" />
  </div>
  <div class="btn-row-item1" style="margin-left: 0.37rem;">
    <n-button class="btn-secondary" @click="clear" color="rgba(255, 255, 255, 0.65)" ghost>{{$t('global.clear')}}</n-button>
  </div>
</template>

<script lang="ts" setup>
import { ref,onMounted,reactive } from 'vue';

let state = reactive({
    fileSrc: "", //文件地址
});
let localKML_dom = ref();
// let blobKML;

// 点击选择文件函数
function chooseFile() {
    localKML_dom.value.click();
    // if(!blobKML) return;
    // viewer.dataSources
    //   .add(
    //     SuperMap3D.KmlDataSource.load(blobKML, {
    //       camera: viewer.scene.camera,
    //       canvas: viewer.scene.canvas,
    //     })
    //   )
    //   .then(function (dataSource: any) {
    //     viewer.flyTo(dataSource);
    //     viewer.scene.layer = dataSource;

    // });
}
function clear(){
  viewer.entities.removeAll();
  let dataSources = viewer.dataSources;
  dataSources.removeAll();
  // blobKML = null;
};
//文件夹改变文件触发
function fileChange() {
    localKML_dom.value.addEventListener("change", function (evt) {

    let target = evt.target as any;
    if (!target) return
    let file = target.files[0];
    if (!file) return;
    state.fileSrc = localKML_dom.value.value;

    // blobKML = new Blob([file], { type: "" });

    // // file转blob
    const blob = new Blob([file], { type: "" })
    viewer.dataSources
      .add(
        SuperMap3D.KmlDataSource.load(blob, {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
        //   clampToGround:true,
        // sourceUri:"./Resource/ylw-pushpin.png",
        // sourceUri:"http://www.opengis.net/kml/2.2",
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
<style lang="scss" scoped>
</style>


