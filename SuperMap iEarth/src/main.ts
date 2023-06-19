import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios'
import naive from 'naive-ui'
import i18n from '@/locale/index'



// 导入iportal处理程序
import { initPortal } from "@/tools/iportal/portalTools"

// 根据屏幕大小，设置font-size
import 'lib-flexible';

// 导入svgIcon <svg-icon>
import svgIcon from "@/components/SvgIcon/index.vue";
import 'virtual:svg-icons-register'
import "@/assets/iconfont/iconfont.css"

// 支持组件拖拽
import Directives from "@/utils/directives"

// 检测页面变化，实时改变根字体大小
import { setFontImmediately } from '@/utils/resize'
document.addEventListener('DOMContentLoaded', setFontImmediately, false);
window.addEventListener('resize', setFontImmediately);
window.addEventListener('load', setFontImmediately, false);

window.axios = axios;


const app = createApp(App)
app.use(naive).use(i18n).use(Directives).component('svg-icon', svgIcon)
app.mount('#app')

// 挂载到 window
window['$vue'] = app


// 导入自定义组件并全局注册
import { InitSuperMap3DComponents } from "@/package/index"
InitSuperMap3DComponents(app);

// 在iportal环境中，启动iportal处理程序
// if (location.href.indexOf('/iportal/apps') != -1) {
initPortal();
// }

