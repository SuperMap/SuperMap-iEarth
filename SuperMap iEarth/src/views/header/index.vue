<template>
  <n-layout-header bordered>
    <div class="header-container" v-if="headShow">
      <div class="header-left">
        <!-- 切换语言 -->
        <!-- <lang-select></lang-select> -->
      </div>
      <!-- 头部切换 -->
      <div class="header-center">
        <div class="svg-box">
          <svg-icon
            name="ui-header-earth"
            class="head-log"
            style="font-size: 30px; margin-top: 5px"
          />
        </div>
        <span class="head-title">{{ $t("global.earth3D") }}</span>
        <svg-icon
          name="ui-header-up"
          class="head-pack-up headerSvgFontSize20"
          @click="headerChange(false)"
        />
      </div>

      <div class="header-right">
        <!-- 保存 -->
        <Save></Save>
        <!-- 分享 -->
        <!-- <Share></Share> -->
        <!-- 设置 -->
        <!-- <Set></Set> -->
        <!-- <div class="divider"></div> -->
        <!-- 用户 -->
        <!-- <User></User> -->
        <head-right></head-right>
      </div>
    </div>
    <div class="header-change" v-else>
      <svg-icon name="ui-header-up" @click="headerChange(true)" />
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { GlobalStoreCreate } from "@/store/global/global";
import { ref } from "vue";

import HeadRight from "./headRight/index";

let headShow = ref(true);
// 实例化仓库，获取数据
const geobalStore = GlobalStoreCreate();

function headerChange(isShow: boolean) {
  headShow.value = isShow;
}
</script>

<style lang="scss" scoped>
.header-container {
  position: absolute;
  z-index: 2;
  display: block;
  @include flexLayout(space-between);
  @include tool-background(
    100%,
    0.48rem,
    "@/assets/imageWeb/header/header-bg.png"
  );

  .header-left,
  .header-center,
  .header-right {
    width: 33%;
    height: 100%;
  }

  .header-center {
    @include flexLayout(center);

    .head-title {
      color: #fff;
      margin-left: 0.1rem;
      font-size: 0.17rem;
      font-weight: bold;
    }

    .head-pack-up {
      margin-left: 0.1rem;
    }
  }

  .header-right {
    @include flexLayout(flex-end);
  }

  .divider {
    width: 0.01rem;
    height: 0.2rem;
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
    margin-right: 0.2rem;
  }
}

.header-change {
  // @include setBackgroundByImg(
  //   "@/assets/imageWeb/header/header-fold-bg.png",
  //   1.03rem,
  //   0.12rem
  // );

  @include tool-background(
    1.03rem,
    0.12rem,
    "@/assets/imageWeb/header/header-fold-bg.png"
  );
  position: absolute;
  z-index: 2;
  left: 45%;
  text-align: center;
  // @include flexLayout(center);
}

.headerSvgFontSize {
  font-size: 48px;
}
.headerSvgFontSize20 {
  font-size: 11px;
}
</style>
