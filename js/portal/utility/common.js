/*
 * 获取iportal/iserver/iexpress根服务地址(iportal门户模块和mapviewer模块不同)
 */
function getRootUrl() {
    var
    rootUrl = "",
        regExp = /\/apps|\/developer|\/web|\/manager|\/services|\/resources/i, //该正则用于取出contextPath
        href = window.location.href,
        index = href.search(regExp);

    rootUrl += href.indexOf("https") === 0 ? "https://" : "http://";
    rootUrl += window.location.host;
    if (rootUrl === href || (rootUrl + "/") === href) { //没有配置上下文,以"/"结尾或者没有"/"
        rootUrl += "/";
    } else if (index > 0) { //配置了上下文，iportal/iserver/iexpress/自定义，根据目前产品中可能的情况下截取上下文,正则匹配的情况可能不全
        rootUrl += href.substring(rootUrl.length, index + 1);
    } else { //iportal首页
        if (!(/\/$/.test(href))) {
            href += "/";
        }
        if(href.search(/\?/i) !== -1){
            href = href.split(/\?/i)[0];
        }
        rootUrl = href;
    }

    return rootUrl;
}