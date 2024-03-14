import store from '@/store';
import { useLangStoreCreate } from '@/store/langStore/langStore'
const langStore = useLangStoreCreate(store);
const lang_support_list = window.lang_support_list;
const lang_default = window.lang_default;

function setBrowserLang() {
    let navigator: any = window.navigator;
    let language = navigator.languages && navigator.languages[0] || navigator.language;
    // navigator.userLanguage || navigator.browserLanguage;

    // 处理一些特殊情况，如 Chrome 在某些语言设置下返回的语言标识不规范
    if (language.length > 2) {
        language = language.substr(0, 2);
    }

    let supportLanguage = ['zh', 'en', 'ja', 'ru'];
    if (lang_support_list && lang_support_list.length > 1) {
        supportLanguage = lang_support_list;
    }

    if (supportLanguage.indexOf(language) === -1) {
        if (lang_default && lang_default.length >= 1) {
            language = lang_default;
        } else {
            language = 'en';
        }

    }
    if (window.iEarthConsole) console.log("Browser-language:", language);

    langStore.changeLang(language);
}

export default setBrowserLang;