<template>
  <div id="player">
    <slot></slot>
  </div>
  <div class="log">
    <a href="https://www.supermap.com/">
      <img src="/imgs/common/logo.png" alt="SuperMap" />
    </a>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount,inject } from "vue";
let  storeActions  = inject("storeActions");

const props = defineProps({
  addScps: Array, //[{url,name}···]
  addImage: Object, //{url,name}
  addTerrain: Object, //{url,name}
  initCallback: Function, //初始化viewer后回调函数
  addLayerCallback: Function //从组件上加载图层的回调函数
});

onMounted(() => initViewer());

//初始化地球
function initViewer() {
  const sceneControl = new SuperMap.Web.UI.Controls.SceneControl(
    document.getElementById("player"),
    initSuccess, //初始化成功回调
    () => {} //初始化失败回调
  );
  window.viewer = sceneControl; //挂载到window
  initSuccess();  //ue进不了回调，暂时直接调用
  function initSuccess() {
    //初始化地球完成
    storeActions.setViewer(sceneControl);

    // 解除Unity锁死键盘和相机问题
    // const unity_canvas = document.getElementById("#canvas");
    // if (unity_canvas) {
    //   unity_canvas.onmouseover = () => sceneControl.setSceneOperate(true);
    //   unity_canvas.onmouseout = () => sceneControl.setSceneOperate(false);
    // }

    if (props.initCallback) props.initCallback();

    //默认加载图层
    try {
      if (props.addScps) {
        props.addScps.forEach(obj => {
          storeActions
            .addS3mLayer(obj.url, obj.name)
            .then(layer => addLayerCallback(layer));
        });
      }
      if (props.addImage) {
        storeActions
          .addImageLayer(props.addImage.url, props.addImage.name)
          .then(layer => addLayerCallback(layer));
      }
      if (props.addTerrain) {
        storeActions
          .addTerrainLayer(props.addTerrain.url, props.addTerrain.name)
          .then(layer => addLayerCallback(layer));
      }
    } catch (e) {
      console.log(e);
    }
  }
}

// 销毁
onBeforeUnmount(() => {
  // viewer.destroy();
 viewer = null;
 storeActions.setViewer(null);
});
</script>

<style lang="scss" scoped>
#player {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.log {
  position: fixed;
  left: 0;
  bottom: 0;
  display: inline-block;
  z-index: 999;
}
</style>



