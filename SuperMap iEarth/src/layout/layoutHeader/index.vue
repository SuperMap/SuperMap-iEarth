<template>
  <n-layout-header bordered>
    <div class="header-container" v-if="headShow">
      <div class="head-content header-left">
        <!-- 切换语言 -->
        <!-- <lang-select></lang-select> -->
      </div>
      <!-- 头部切换 -->
      <div class="head-content header-center">
        <img src="@/assets/images/earth.png" style="width: 0.36rem;height: 0.36rem;margin-top: 3px;margin-right: 3px;" alt="" />
        <span style="font-size: 0.28rem; color: rgba(255,255,255,0.85);" class="head-title">{{$t('global.earth3D')}}</span>
        <i class="iconfont iconxiala" @click="headerFold" style="font-size: 0.12rem;"></i>
      </div>

      <div class="head-content header-right">
        <!-- <i class="iconfont iconbaocun" @click="save"></i> -->
        <i class="iconfont iconbaocun" @click="save" v-show="IportalStore.isLogin"></i>
        <!-- <i class="iconfont iconbaocun" @click="save" v-if="IportalStore.isLogin"></i> -->
        <n-divider vertical />
        <User></User>
      </div>
    </div>

    <div class="headerFoldBox" v-else>
    <i class="iconfont iconxiala downSvg" @click="headerOpen" style="font-size: 0.12rem;"></i>
    </div>
    <!-- 保存场景弹窗 -->
    <SaveScene></SaveScene>
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SaveScene from "./components/saveScene";
import { IportalStoreCreate } from "@/store/iportalManage/index";
import {User} from './components/user/index'
import { usePanelStore } from "@/store/index";

const panelStore = usePanelStore();
const IportalStore = IportalStoreCreate();

let headShow = ref(false);

// 保存弹窗
function save() {
  // panelStore.setSceneModal(true);
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
// 页头折叠
function headerFold(){
  headShow.value = false;
}
// 页头展开
function headerOpen(){
  headShow.value = true;
}
</script>

<style lang="scss">
// @font-face {
//   font-family: OptimizationTitle;
//   src: url('@/assets/fonts/OptimizationTitleBlack.TTF');
// }
 
.head-title {
  font-family: 'OptimizationTitle';
}

.header-container {
  position: absolute;
  z-index: 2;
  color: #fff;
  // @include flexLayout(space-between);
  @include setBackground(100%, 0.48rem, "@/assets/images/header-bg.png");
  @include flexLayout(center);
  .head-title {
    font-size: 26px;
  }
  .iconxiala {
    transform: rotate(180deg);
    margin-left: 0.1rem;
  }
  // .iconfont {
  //   @include setIconstyle();
  // }
  .head-content {
    width: 33%;
    @include flexLayout(center);
  }

  .header-right {
    justify-content: end;
    .user-name {
      margin-left: 0.05rem;
      margin-right: 0.13rem;
    }
  }
}

.headerFoldBox {
  position: absolute;
  left: 50%;
  top: 0%;

  text-align: center;
  background-color: #fff;
  // border-radius: 20px;
  width: 100px !important;
  height: 12px !important;

  z-index: 99;

  transform: translate(-50%, 0%);

  @include setBackground(100%, 0.48rem,'@/assets/images/header-fold-bg.png');

  /*flex 布局*/
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  justify-content: center;

  // .downSvg {
  //   transform: rotateZ(180deg);
  //   // margin-left: 0.45rem;
  // }
}
</style>
