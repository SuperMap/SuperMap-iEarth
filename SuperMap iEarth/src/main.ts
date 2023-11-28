import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios'
import naive from 'naive-ui'
import i18n from '@/locale'
import store from './store'
// import "@/styles/index.scss"
// 根据屏幕大小，设置font-size
import 'lib-flexible';
import "@/assets/icons/iconfont.css"

// 导入iportal处理程序
import { initPortal } from "@/tools/iportal/portalTools"

// 导入语言设置
import setBrowserLang from '@/tools/browserLang'


// 检测页面变化，实时改变根字体大小
import { setFontImmediately } from '@/utils'
document.addEventListener('DOMContentLoaded', setFontImmediately, false);
window.addEventListener('resize', setFontImmediately);
window.addEventListener('load', setFontImmediately, false);

// 将axois绑定到window对象中，以便保存场景时调用
window.axios = axios;

const app = createApp(App)
app.use(naive).use(i18n).use(store);

app.mount('#app')

// 在iportal环境中，启动iportal处理程序
if(location.href.indexOf('/apps') != -1){
    initPortal();
}

setBrowserLang();