/**
 * * 获取当前浏览器语言环境：中文 英文 日语
 * @return { Boolean }
 */
export const getLang = () => {
    //浏览器语言  IE用browserLanguage，非IE使用language进行判断
    // let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
    let lang = (navigator.language).toLowerCase();
    window["lang"] = lang;
    //判断portal设置语言 通过cookie获取
    const cookies = document.cookie.split(';');
    if (cookies.length > 0) {
        cookies.forEach(function (cookie) {
            const arr = cookie.split('=');
            if (arr[0].toLowerCase().trim() === 'language') {
                lang = arr[1];
                return;
            }
        });
    }
    lang = lang.toLowerCase().split('-')[0]
    return lang;
};
