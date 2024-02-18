import store from '@/store';
import { useLangStoreCreate } from '@/store/langStore/langStore'
const langStore = useLangStoreCreate(store);

function setBrowserLang() {
    let navigator:any = window.navigator;
    let language = navigator.languages && navigator.languages[0] ||
        navigator.language;
        // ||
        // navigator.userLanguage ||
        // navigator.browserLanguage;

    // 处理一些特殊情况，如 Chrome 在某些语言设置下返回的语言标识不规范
    if (language.length > 2) {
        language = language.substr(0, 2);
    }

    let supportLanguage = ['zh','en','ja','ru'];
    if(supportLanguage.indexOf(language) === -1){
        language = 'en';
    }
    console.log("Browser-language:",language);

    langStore.changeLang(language);
}

export default setBrowserLang;