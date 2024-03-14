//语言
import { createI18n } from 'vue-i18n' //引入vue-i18n组件
import { getLang } from '@/utils'

// 获取当前浏览器语言环境
let currentLanguage: string = 'zh';
let cookieLanguage: string = getLang();
if (cookieLanguage !== undefined) {
  currentLanguage = cookieLanguage;
}

const lang_data = window.lang_data;

const i18n = createI18n({
  locale: currentLanguage,
  messages: lang_data
})

export default i18n;