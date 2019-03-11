/**
 * 门户http://ip:port/iportal这一级目录的占位符，解决门户首页定制后，地址写死的问题
 * */
var portalRootPlaceholder = "{portalRoot}";
function replaceUrlPlaceHolder(url){
    if(url.indexOf(portalRootPlaceholder) !== -1){
        url = url.replace(portalRootPlaceholder, getRootUrl().replace("manager/", ""));
    }
    return url;
}
function replaceUrlWithPlaceHolder(url){
    if(url.indexOf(getRootUrl().replace("manager/", "")) !== -1){
        url = url.replace(getRootUrl().replace("manager/", ""), portalRootPlaceholder);
    }
    return url;
}
function replaceHomeConfigPlaceHolder(config){
    config.common.logo = replaceUrlPlaceHolder(config.common.logo);
    config.common.desc = replaceUrlPlaceHolder(config.common.desc);
    for(var i=0;i<config.menus.length;i++){
        config.menus[i].url = replaceUrlPlaceHolder(config.menus[i].url);
        config.menus[i].isCustomColumn && (config.menus[i].isCustomColumn = replaceUrlPlaceHolder(config.menus[i].isCustomColumn));
        if (typeof(config.menus[i].children) !== "undefined") {
            for (var j = 0; j < config.menus[i].children.length; j++) {
                config.menus[i].children[j].url = replaceUrlPlaceHolder(config.menus[i].children[j].url);
                config.menus[i].children[j].isCustomColumn && (config.menus[i].children[j].isCustomColumn = replaceUrlPlaceHolder(config.menus[i].children[j].isCustomColumn));
            }
        }
    }
    if (typeof(config.wedgets) !== "undefined") {
        for (var i = 0; i < config.wedgets.datas.length; i++) {
            config.wedgets.datas[i].icon = replaceUrlPlaceHolder(config.wedgets.datas[i].icon);
            config.wedgets.datas[i].url = replaceUrlPlaceHolder(config.wedgets.datas[i].url);
        }
    }
    for(var i=0;i<config.carousels.datas.length;i++){
        config.carousels.datas[i].icon = replaceUrlPlaceHolder(config.carousels.datas[i].icon);
    }
    if (config.contents !== undefined){
        for(var i=0;i<config.contents.length;i++){
            config.contents[i].icon = replaceUrlPlaceHolder(config.contents[i].icon);
            config.contents[i].dficon = replaceUrlPlaceHolder(config.contents[i].dficon);
            config.contents[i].url = replaceUrlPlaceHolder(config.contents[i].url);
        }
    }
    return config;
}
function replaceHomeConfigWithPlaceHolder(config){
    config.common.logo = replaceUrlWithPlaceHolder(config.common.logo);
    config.common.desc = replaceUrlWithPlaceHolder(config.common.desc);
    for(var i=0;i<config.menus.length;i++){
        config.menus[i].url = replaceUrlWithPlaceHolder(config.menus[i].url);
        if (typeof(config.menus[i].children) !== "undefined") {
            for (var j = 0; j < config.menus[i].children.length; j++) {
                config.menus[i].children[j].url = replaceUrlWithPlaceHolder(config.menus[i].children[j].url);
            }
        }
    }
    if (typeof(config.wedgets) !== "undefined") {
        for (var i = 0; i < config.wedgets.datas.length; i++) {
            config.wedgets.datas[i].icon = replaceUrlWithPlaceHolder(config.wedgets.datas[i].icon);
            config.wedgets.datas[i].url = replaceUrlWithPlaceHolder(config.wedgets.datas[i].url);
        }
    }
    for(var i=0;i<config.carousels.datas.length;i++){
        config.carousels.datas[i].icon = replaceUrlWithPlaceHolder(config.carousels.datas[i].icon);
    }
    if (config.contents !== undefined){
        for(var i=0;i<config.contents.length;i++){
            config.contents[i].icon = replaceUrlWithPlaceHolder(config.contents[i].icon);
            config.contents[i].dficon = replaceUrlWithPlaceHolder(config.contents[i].dficon);
            config.contents[i].url = replaceUrlWithPlaceHolder(config.contents[i].url);
        }
    }
    return config;
}