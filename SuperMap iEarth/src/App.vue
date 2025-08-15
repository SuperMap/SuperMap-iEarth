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
            <license-watermark
              v-show="watermark.show"
              :content="watermark.content"
              :font-size="watermark.fontSize"
              fullscreen
            />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { reactive,computed } from "vue";
import { I18n } from "@/components/I18n";
import { MessageContent } from "@/components/Plugins/MessageContent";
import { DialogContent } from "@/components/Plugins/DialogContent";
import { LoadingContent } from "@/components/Plugins/LoadingContent";
import { loadAsyncComponent } from "@/utils/index";
import { darkTheme } from "naive-ui";
import { useLocaleHook } from "@/tools/localHook";
import { licenseEnum } from "@/enums/licenseEnum";
import { getRootUrl } from "@/tools/iportal/portalTools";
import { useLangStoreCreate } from '@/store/langStore/langStore'

const layout = loadAsyncComponent(() => import("@/layout/index.vue"));

const locale = useLocaleHook(); // 设置naiveUI组件国际化

// 基于App语言设置样式
const langStore = useLangStoreCreate();
const langApp = langStore.getLang;
const btnWidth = computed(() => {
    return langApp == 'zh' ? '0.6rem' : '0.9rem'
});

// 水印
const LicenseWatermark = loadAsyncComponent(
  () => import("@/components/LicenseWatermark/index.vue")
);
const watermark = reactive({
  show: false,
  content: "",
  fontSize: 14,
  isOEM: false
});

// 验证许可
const checkLicenseInfo = () => {
  let url = getRootUrl() + "manager/licenseInfo.json";

  return window.axios
    .get(url)
    .then(function (licenseInfo: any) {
      if (window.iEarthConsole) {
        console.log("licenseInfo:", licenseInfo);
      }
            
      let designerInfo = licenseInfo.data?.entryInfos.find((info: any) => {
        return info.licenseID === 21034 || info.licenseID === 65400; //65400 iportal 试用许可
      });

      let comName = licenseInfo.data?.shortCompanyName;
      let orTitle = document.title;
      let is_comName = comName && comName !== '';
      if(is_comName){
        document.title = orTitle + ` ${comName}`;
      }

      if (designerInfo) {
        // 判断许可过期
        let timeOut = new Date().getTime() - designerInfo.expireDate.time;
        if (timeOut > 0) {
          return licenseEnum.TIMEOUT;
        }
        // 判断许可类型 0 为试用许可  watermarkMode:  0：试用；1：正式；2：开发；3：教育；4：个人；5：员工
        if (designerInfo.watermarkMode === 0) {
          let content = watermark.isOEM ? "Cyclone Trial Use" : "SuperMap Trial Use"
          watermark.content = content;
          watermark.fontSize = 20;
          watermark.show = true;
          return licenseEnum.TRIAL;
        }
        if (designerInfo.watermarkMode === 1) {
          watermark.show = false;
          return licenseEnum.FORMAL;
        }
        if (designerInfo.watermarkMode === 3) {
          document.title = orTitle + ` 「${$t("education")}」` +  (is_comName ? ` ${comName}` : '' );
          watermark.show = false;
          return licenseEnum.EDUCATION;
        }
        if (designerInfo.userTrademark !== "") {
          watermark.content = designerInfo.userTrademark;
          watermark.show = true;
        }
        return designerInfo.watermarkMode;
      }
      return licenseEnum.NULL;
    })
    .catch((e) => {
      return licenseEnum.NULL;
    });
};
if (location.href.indexOf("/apps") != -1) {
  try {
    let OEMSiteConfigUrl = location.href.split('/apps/')[0] + '/resources/web-ui/config/SiteConfig.json';
    // console.log("OEMSiteConfigUrl:", OEMSiteConfigUrl);
    window.axios.get(OEMSiteConfigUrl).then(data => {
      const siteConfig = data.data;
      // console.log('webui-siteConfig-data：', siteConfig);
      watermark.isOEM = siteConfig.isOEM == true ? true : false;
      checkLicenseInfo().then((license: licenseEnum) => {
        console.log("license:", license);
      });
    })
  } catch (error) {
    // console.log("err:", error);
    checkLicenseInfo().then((license: licenseEnum) => {
      console.log("license:", license);
    });
  }
}

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
  // DataTable: {
  //   // 表格背景色
  //   tdColor: 'rgba(18, 26, 37, 1)',
  //   thColor: 'rgba(18, 26, 37, 1)',
  //   // 边框颜色
  //   borderColor: 'rgba(255, 255, 255, 0.12)',
  //   // 行悬停颜色
  //   tdColorHover: 'rgba(52, 153, 229, 0.15)',
  //   // 文字颜色
  //   thTextColor: 'rgba(255, 255, 255, 0.82)',
  //   tdTextColor: 'rgba(255, 255, 255, 0.82)',
  // }
};
</script>

<!-- 不能注释这里,否则样式会大变 -->
<style lang="scss">
.row-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0.1rem 0rem;
  font-size: 0.14rem;
}


/** 临时处理 */

// 天际线分析第二个按钮太长超限，这里做个hidden，skyline.vue中不起作用
.overflow-skyline-body .n-button__content{
  overflow: hidden;
}
</style>
