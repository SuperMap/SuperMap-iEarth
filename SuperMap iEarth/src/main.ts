import { createApp } from 'vue';
import App from './App.vue';

import axios from 'axios';
import naive from 'naive-ui';
import i18n, { initPortalLocale } from '@/locale'; // 自动获取语言并创建i18n
import store from './store';
import { useLangStoreCreate } from '@/store/langStore/langStore';

// 根据屏幕大小，设置font-size
import 'lib-flexible';
import "@/assets/icons/iconfont.css";

// 导入iportal处理程序
import { initPortal } from "@/tools/iportal/portalTools";

// 检测页面变化，实时改变根字体大小
import { setFontImmediately } from '@/utils';
document.addEventListener('DOMContentLoaded', setFontImmediately, false);
window.addEventListener('resize', setFontImmediately);
window.addEventListener('load', setFontImmediately, false);

// 将axois绑定到window对象中，以便保存场景时调用
window.axios = axios;

const app = createApp(App);
app.use(naive).use(i18n).use(store);
app.config.warnHandler = () => { }; // 将警告处理函数设为空函数
app.mount('#app');

// 在iportal环境中，启动iportal处理程序
if (location.href.indexOf('/apps') != -1) {
    initPortal();

    // iPortal环境下优先使用@supermapgis/portal-locale获取服务端语言配置（含RTL镜像方向），
    // 校正初始语言并同步到langStore，供naive-ui locale等响应式逻辑使用
    initPortalLocale().then((portalLang) => {
        if (portalLang) {
            const langStore = useLangStoreCreate();
            if (langStore.getLang !== portalLang) {
                langStore.changeLang(portalLang);
            }
        }
    });
}

// 通过cookie设置iEarth语言模式
// document.cookie = "language=en;"

// 检查iEarthConsole状态,以便打印输出信息
// localStorage.setItem("iEarthConsole", 'yes')
// localStorage.getItem("iEarthConsole");
// localStorage.removeItem('iEarthConsole');
window.iEarthConsole = false;
if (localStorage.getItem("iEarthConsole") === 'yes') {
    window.iEarthConsole = true;
}