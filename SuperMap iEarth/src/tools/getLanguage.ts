import { getBrowserLanguageSub } from '@/utils';
const lang_support_list = window.lang_support_list;
const lang_default = window.lang_default;

export const getLanguage = () =>{
  // 获取当前浏览器真实语言环境（两位字母简写）
  let lang: string = getBrowserLanguageSub();
  if (window.iEarthConsole) console.log("浏览器语言环境:", lang);

  // 检查当前浏览器语言是否在支持的列表中，如果不在则使用默认的语言设置
  let language = lang;
  let supportLanguage = ['zh', 'en', 'ja', 'ru'];
  if (lang_support_list && lang_support_list.length > 1) {
    supportLanguage = lang_support_list;
  }
  if (supportLanguage.indexOf(language) === -1) {
    if (lang_default && lang_default.length == 2) {
      language = lang_default;
    } else {
      language = 'zh';
    }
  }
  if (window.iEarthConsole) console.log("项目使用的语言环境:", language);

  return language;
}