const lang_support_list = ["zh", "en", "ja", "ru", "es", "fr"]; // 支持浏览器自动识别的语言列表

const lang_data = {  // vue-i18n：createI18n中的messages
    zh:local_zh,
    en:local_en,
    ja:local_ja,
    ru:local_ru,
    es:local_es,
    fr:local_fr,
}

const lang_default = 'en'; // 当前浏览器语言不在支持列表时的默认语言

window.lang_data = lang_data;
window.lang_support_list = lang_support_list;
window.lang_default = lang_default;