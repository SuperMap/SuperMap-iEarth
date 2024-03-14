<template>
  <n-config-provider
    :theme-overrides="overridesTheme"
    :theme="darkTheme"
    :locale="locale.locale"
    :date-locale="locale.dateLocale"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <dialog-content></dialog-content>
        <loading-content></loading-content>
        <n-notification-provider>
          <n-message-provider>
            <message-content></message-content>
            <I18n></I18n>
            <layout></layout>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { I18n } from "@/components/I18n";
import { MessageContent } from "@/components/Plugins/MessageContent";
import { DialogContent } from "@/components/Plugins/DialogContent";
import { LoadingContent } from "@/components/Plugins/LoadingContent";
import { loadAsyncComponent } from "@/utils/index";
import { darkTheme } from "naive-ui";
import { useLocaleHook } from "@/tools/localHook";
const layout = loadAsyncComponent(() => import("@/layout/index.vue"));

const locale = useLocaleHook(); // 设置naiveUI组件国际化

// 重写主题样式
const overridesTheme = {
  common: {
    primaryColor: "rgba(52, 153, 229, 1)",
    primaryColorHover: "rgba(52, 153, 229, 1)",
    primaryColorPressed: "rgba(255,255,255,0.85)",
    primaryColorSuppl: "rgba(255,255,255,0.45)",
  },
  Button: {
    textColor: "#fff",
  },
  Tabs: {
    tabColor: "yellow", //这个起作用了
  },
  Checkbox: {
    colorChecked: "#3499E5",
    checkMarkColor: "#fff",
  },
  Slider: {
    fillColor: "#3499E5",
    fillColorHover: "#3499E5",
    handleSize: "0.12rem",
  },
  Switch: {
    railColorActive: "#3499E5",
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: OptimizationTitle;
  src: url("@/assets/fonts/OptimizationTitleBlack.TTF");
  font-display: fallback;
}

// 头部标题字体
.head-title {
  font-family: "OptimizationTitle";
}

// 以下样式 先放到这里 后续再看怎么处理
.n-tabs .n-tabs-bar {
  background-color: #3499e5 !important;
}

.n-tabs-tab {
  color: #fff !important;
}

.n-color-picker-trigger {
  border: none;
}

.n-layout .n-layout-scroll-container {
  overflow: visible;
}

.drawCur {
  cursor: url(../public/images/cur/draw.cur), auto;
}

.measureCur {
  cursor: url(../public/images/cur/measure.cur), auto;
}

// n-input等居中
.n-input .n-input__input-el {
  height: 100%;
}

// 输入框相关样式
.n-input {
  height: 0.32rem;

  .n-input__input-el {
    line-height: 0.32rem;
  }
}

// cesium帧率面板位置
.supermap3d-performanceDisplay-defaultContainer {
  top: 10px;
}

.supermap3d-viewer-timelineContainer {
  bottom: 10px;
}

.n-divider {
  color: rgba(255, 255, 255, 0.15);
}

// 兼容移动端样式
.n-tabs-tab__label {
  font-size: 0.14rem;
}

// 底部操作按钮
.btn-row-item {
  display: flex;
}

// operate按钮文字大小
.btn-row-item .n-button {
  height: 0.32rem;
  width: 0.6rem;
  padding: 0.06rem 0.1rem;
}

.btn-row-item2 .n-button {
  height: 0.32rem;
  width: 0.6rem;
  padding: 0.06rem 0.15rem;
}

.row-content .n-button {
  height: auto;
  width: auto;
  padding: 5px 8px;
}

.row-item .n-button {
  height: auto;
  width: auto;
  padding: 5px 8px;
}

.n-button__content {
  font-size: 0.14rem;
}

// input输入框的内容大小和后缀
.n-input__suffix {
  font-size: 0.12rem;
}

.n-input__input {
  font-size: 0.12rem;
}

.slider-box .n-input .n-input-wrapper {
  padding-left: 0px;
}

.n-slider-marks {
  font-size: 0.12rem;
}

// 单选Radio的标签大小
.n-radio__label {
  font-size: 0.12rem;
}

// n-select相关
.n-base-selection {
  min-height: 0.32rem;
}

.n-base-selection .n-base-selection-label {
  height: 0.32rem;
}

.n-base-selection-input__content {
  font-size: 0.14rem;
}

// 图层列表
.n-tree {
  font-size: 0.12rem;
}

.n-tree-node-content__suffix > div {
  width: 30px;
}

.n-tree .n-tree-node-content .n-tree-node-content__suffix {
  margin-right: 0.1rem;
}

// 分割线
.n-divider:not(.n-divider--vertical) {
  margin-top: 0.24rem;
  margin-bottom: 0.24rem;
}

// 滑动条的那个球
.n-slider .n-slider-handles .n-slider-handle-wrapper .n-slider-handle {
  width: 0.12rem;
  height: 0.12rem;
}

.n-slider .n-slider-dots .n-slider-dot {
  width: 0.1rem;
  height: 0.1rem;
}

// checkBox大小和lable对齐居中
.n-checkbox .n-checkbox-box {
  width: 0.16rem;
  height: 0.16rem;
}

.n-checkbox .n-checkbox__label {
  margin-left: 0.1rem;
  font-size: 0.14rem;
  height: 0.2rem;
  line-height: 0.2rem;
}

// checkBox-飞行路径哪里的两个组合形式
.n-checkbox .n-checkbox-box-wrapper {
  width: 0.1rem;
}

// 单选框大小
.n-radio .n-radio__dot {
  width: 0.14rem;
  height: 0.14rem;
}

// 单选框-两个组合的-Box裁剪
.n-radio .n-radio__dot-wrapper {
  width: 0.2rem;
}

// 图层列表下拉菜单样式
.n-dropdown-menu {
  background: url("@/assets/panelbg/drop-menu-bg.png") no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.n-dropdown-option-body__label {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.12rem;
}

.n-dropdown-option:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

[v-placement="right-start"] > .n-popover-shared {
  margin-left: 0px;
}

.n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled):hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.n-tree .n-tree-node-wrapper {
  padding: 0.03rem 0rem;
}

.n-dropdown-menu .n-dropdown-option .n-dropdown-option-body {
  height: 0.34rem;
  line-height: 0.34rem;
}

// echarts图表样式
#echartsProfile > div {
  left: 0.1rem;
  top: 0.1rem;
}

#echartsSkyLine > div {
  left: 0.1rem;
  top: 0.1rem;
}

// 图层列表后缀hover颜色
// .n-button:not(.n-button--disabled):hover{
//   // color: yellow;
//   // color:rgba(255, 255, 255, 0.85);
// }
</style>
