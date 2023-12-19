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
import { darkTheme} from "naive-ui";
import { useLocaleHook } from "@/tools/localHook";
const layout = loadAsyncComponent(() => import("@/layout/index.vue"));

const locale = useLocaleHook();
// 重写主题样式
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const overridesTheme = {
  common: {
    // primaryColor: "#3499E5",
    primaryColor: "rgba(52, 153, 229, 1)",
    primaryColorHover: "rgba(52, 153, 229, 1)",
    primaryColorPressed: "rgba(255,255,255,0.85)",
    primaryColorSuppl: "rgba(255,255,255,0.45)",
  },
  Button: {
    textColor: "#fff",
    // textColor: scssVariable.midColorNormal,
  },
  Input: {
    // color: "none",
    // paddingRight: "12px", // 又不起作用
    // border: "1px solid yellow;",
  },
  // 完全不起作用
  Tabs: {
    tabGap: "14px",
    tabgap: "14px",
    "tab-gap": "14px",
    "--n-tab-gap": "14px", //这四个都不行，但是打包后效果还行
    tabColor: "yellow", //这个起作用了
  },
  Checkbox: {
    colorChecked: "#3499E5",
    checkMarkColor: "#fff",
  },
  Slider: {
    fillColor: "#3499E5",
    fillColorHover: "#3499E5",
    handleSize:"12px"
  },
  Switch: {
    railColorActive: "#3499E5",
  },
  // ColorPicker: {
  //   height: "",
  // },
};
</script>

<style lang="scss">
@font-face {
  font-family: OptimizationTitle;
  src: url('@/assets/fonts/OptimizationTitleBlack.TTF');
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
  // cursor: url(./images/cur/draw.cur), auto;
  cursor: url(../public/images/cur/draw.cur), auto;
}

.measureCur {
  cursor: url(../public/images/cur/measure.cur), auto;
}

// n-input等居中
.n-input .n-input__input-el {
  height: 100%;
}

.supermap3d-performanceDisplay-defaultContainer{
  top: 10px;
}
</style>