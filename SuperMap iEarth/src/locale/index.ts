//语言
import { createI18n } from 'vue-i18n';
import { getLanguage } from '@/tools/getLanguage';

// 获取index.html通过<script>标签引入的语言资源文件
const lang_data = window.lang_data;

const lang = getLanguage();

const i18n = createI18n({
  locale: lang,
  messages: lang_data
})

export default i18n;