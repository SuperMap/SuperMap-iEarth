<template>
  <n-layout-header bordered>
    <div class="header-container" v-if="headShow">
      <div class="head-content header-left"></div>

      <!-- 头部 Open -->
      <div class="head-content header-center">
        <img :src="imgurl" />
        <span class="head-title" :title="appName">{{ appName }}</span>
        <i class="iconfont iconxiala" @click="headerFold"></i>
      </div>

      <!-- 保存+用户 -->
      <div class="head-content header-right">
        <!-- <i
          class="iconfont iconbaocun"
          @click="save"
          v-show="IportalStore.isLogin"
        ></i>
        <n-divider vertical /> -->
        <User></User>
      </div>
    </div>

    <!-- 头部 Down -->
    <div class="headerFoldBox" v-else>
      <i
        class="iconfont iconxiala downSvg"
        @click="headerOpen"
        style="font-size: 0.12rem"
      ></i>
    </div>

    <!-- 保存场景弹窗 -->
    <SaveScene></SaveScene>
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import { usePanelStore } from "@/store/index";
import { User } from "./components/user/index";
import SaveScene from "./components/saveScene";

const panelStore = usePanelStore();
const IportalStore = IportalStoreCreate();
const imgurl = ref('./logo.png');

const appName:any = computed(() => {
  if(IportalStore.SceneName && IportalStore.SceneName.length > 0){
    return IportalStore.SceneName;
  }else{
    return $t("earth3D");
  }
});

// 保存弹窗
function save() {
  panelStore.showSavePanel = true;
  panelStore.isEditMode = true;

  outputSceneToFile();
}

// 缩略图
function outputSceneToFile() {
  let promise = viewer.scene.outputSceneToFile();
  SuperMap3D.when(promise, function (buffer) {
    let canvas: any = document.getElementById("sceneCanvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = buffer;
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 298, 150);
    };
  });
}

let headShow = ref(false);
// 页头折叠
function headerFold() {
  headShow.value = false;
}
// 页头展开
function headerOpen() {
  headShow.value = true;
}
</script>

<style lang="scss">
.head-title {
  font-family: "OptimizationTitle";
}

.header-container {
  @include setBackground(100%, 0.48rem, "@/assets/images/header-bg.png");
  @include flexLayout(center);
  z-index: 100;
  position: absolute;
  background-size: 100% 0.48rem;

  .head-title {
    font-size: 0.28rem;
    color: rgba(255, 255, 255, 0.85);
    max-width: 4rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .head-content {
    @include flexLayout(center);
    width: 33%;
  }

  .header-center {
    img {
      width: 0.36rem;
      height: 0.36rem;
    }
  }

  .header-right {
    justify-content: end;
  }

  .iconxiala {
    transform: rotate(180deg);
    margin-left: 0.1rem;
    font-size: 0.12rem;
  }
}

.headerFoldBox {
  @include setBackground(100%, 0.48rem, "@/assets/images/header-fold-bg.png");
  z-index: 100;
  position: absolute;
  left: 50%;
  top: 0%;
  text-align: center;
  transform: translate(-50%, 0%);
  width: 1.1rem;
  height: 0.15rem;
}
</style>
