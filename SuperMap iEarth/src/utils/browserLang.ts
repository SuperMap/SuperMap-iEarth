/**
 * * 获取当前浏览器真实的语言环境（两位字母简写）：中文 英文 日语 俄语
 */
export const getBrowserLanguageSub = () => {
    //浏览器语言: chrome+360用language; Edge用userLanguage; IE用browserLanguage。
    let navigator: any = window.navigator;
    let language = navigator.language || navigator.userLanguage || navigator.browserLanguage;
    let lang = language.toLowerCase();

    let result: string = '';

    if (lang.indexOf('-') != -1) {
        result = lang.split('-')[0];
    } else if (lang.length > 2) {
        result = lang.substr(0, 2);
    }else if(lang.length == 2){
        result = lang;
    }
    return result;

    // 暂时不考虑iportal cookies
    // //判断portal设置语言 通过cookie获取
    // const cookies = document.cookie.split(';');
    // if (cookies.length > 0) {
    //     cookies.forEach(function (cookie) {
    //         const arr = cookie.split('=');
    //         if (arr[0].toLowerCase().trim() === 'language') {
    //             result = arr[1];
    //             return;
    //         }
    //     });
    // }

    // // 如果从cookies中获取语言了，就直接返回
    // if(result != '' && result.length == 2){
    //     return result;
    // }
};