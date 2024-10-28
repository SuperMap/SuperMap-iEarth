/**
 * * 获取当前浏览器真实的语言环境（两位字母简写）：中文 英文 日语 俄语
 */
export const getBrowserLanguageSub = () => {
    //浏览器语言: chrome+360用language; Edge用userLanguage; IE用browserLanguage。
    let navigator: any = window.navigator;
    let language = navigator.language || navigator.userLanguage || navigator.browserLanguage;
    let browserLang = language.toLowerCase();

    // 通过iportal设置语言，从cookie获取
    let cookieLang:any = undefined;
    const cookies = document.cookie.split(';');
    if (cookies.length > 0) {
        cookies.forEach(function (cookie) {
            const arr = cookie.split('=');
            if (arr[0].toLowerCase().trim() === 'language') {
                cookieLang = arr[1];
            }
        });
    }

    // 将浏览器语言字符串统一，返回两位：['zh', 'en', 'ja', 'ru'];
    function computedLang(langstr):string{
        let result:string = '';
        if (langstr.indexOf('-') != -1) {
            result = langstr.split('-')[0];
        } else if (langstr.length > 2) {
            result = langstr.substr(0, 2);
        }else if(langstr.length == 2){
            result = langstr;
        }
        return result;
    }

    let result: string = '';
    if(cookieLang){ 
        result = computedLang(cookieLang); // 优先使用cookie（iPortal）
    }else if(browserLang){
        result = computedLang(browserLang); // 没有cookie再自动识别浏览器语言
    }
    return result;
};