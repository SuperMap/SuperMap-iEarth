(function(window) {
    "use strict";

    var utility = {
        version: 7.2
    };
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function($) {
            return utility;
        });
    } else {
        window.utility = utility;
    }

    // 以下以var声明的变量为私有函数，供内部调用
    /**
     * 排序，升序
     */
    var sortHandler = function (a, b) {
        return a.weight - b.weight;
    };
    /*
     * 将一位时间格式处理成2位展示
     */
    var changeTo2Bit = function (timeValue) {
        return ("00" + timeValue).substr(("" + timeValue).length);
    };

    /**
     * 获取iportal/iserver/iexpress根服务地址(iportal门户模块和mapviewer模块不同)
     */
    utility.getRootUrl = function() {
        var
        rootUrl = "",
            regExp = /\/apps|\/web|\/manager|\/developer|\/services|\/resources/i,//该正则用于取出contextPath
            href = window.location.href,
            index = href.search(regExp);

        rootUrl += href.indexOf("https") === 0 ? "https://" : "http://";
        rootUrl += window.location.host;
        if (rootUrl === href || (rootUrl + "/") === href) { //没有配置上下文,以"/"结尾或者没有"/"
            rootUrl += "/";
        } else if (index > 0) { //配置了上下文，iportal/iserver/iexpress/自定义，根据目前产品中可能的情况下截取上下文,正则匹配的情况可能不全
            rootUrl += href.substring(rootUrl.length, index + 1);
        } else { //iportal首页
            //isupermap首页
            if(href.indexOf("?ticket=") > 0){
                return rootUrl;
            }
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
    //默认构造异步ajax请求
    utility.sendRequest = function(url, type, dataType, data, onSuccessed, onFailed) {
        this.sendRequestSync(url, type, true, dataType, data, onSuccessed, onFailed);
    },
    /**
     * 服务端功能交互
     *
     * 参数
     * url
     * type: "GET"、"POST"
     * async: "true","false" 对应同步异步请求。
     * dataType: "xml"、"html"、"script"、"json"、"jsonp"
     * data: "POST" 传值参数
     * onSuccessed: 成功回调函数
     * onFailed: 失败回掉函数
     */
    utility.sendRequestSync = function (url, type, async, dataType, data, onSuccessed, onFailed) {
        $.ajax({
            url: url,
            type: type,
            async : async,
            dataType: dataType,
            data: data,
            success: function (data, textStatus, xhr) {
                onSuccessed(data, textStatus, xhr);
            },
            error: function (xhr, textStatus, errorThrown) {
                try {
                    var msg = JSON.parse(xhr.responseText);
                    onFailed(msg);
                } catch (e) {
                    onFailed(xhr, textStatus, errorThrown);
                }
            }
        });
    }
    /**
     * 判断当前浏览器是否支持css3属性
     */
    utility.support = function(prop) {
        var div = document.createElement("div");
        var vendors = "Khtml O Moz Webkit".split(" ");
        var len = vendors.length;
        if (prop in div.style) return true;
        if ("-ms-" + prop in div.style) return true;
        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });
        while(len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            }
        }
        return false;
    }
    /**
     * html标记编码以及特殊字符。防止xss漏洞攻击
     */
    utility.htmlencode = function(str) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    },
    /**
     * html标记以及特殊字符编码后的结果进行解码处理。
     */
    utility.htmldecode = function(str) {
        var div = document.createElement("div");
        div.innerHTML = str;
        return div.innerText || div.textContent;
    }
    /**
     * 将原始返回的目录数据解析成目录节点中包含子目录结构
     * @params
     * dirsInfo      <Array>         目录结构原始数据
     * dirType      <String>        目录类型(MAP、SERVICE等)
     * @return
     * <Array> [{id: 1, dirName: "",subDirs:[{id: 1, dirName: ""}]}]
     */
    utility.analysisDirs = function(dirsInfo, dirType) {
        var context = {dirId: null};
        var processedDirs;
        processedDirs = dirsInfo.filter(function (item, index, arr) {
            if (item.parentDirId === context.dirId && item.dirType === dirType) {
                return item;
            }
        }, context);
        processedDirs.sort(sortHandler);
        function recursionDirs(dirs) {
            for (var i = 0, iLen = dirs.length; i < iLen; i++) {
                context.dirId = dirs[i].id;
                dirs[i].subDirs = dirsInfo.filter(function (item, index, arr) {
                    if (item.parentDirId === context.dirId && item.dirType === dirType) {
                        return item;
                    }
                }, context);
                dirs[i].subDirs.sort(sortHandler);
                if (dirs[i].subDirs.length) {
                    recursionDirs(dirs[i].subDirs);
                }
            }
        }
        recursionDirs(processedDirs);
        return processedDirs;
    }
    /**
     * 根据解析后的目录数据生成对应的html结构
     * @params
     * dirsInfo      <Array>         目录结构解析后的数据
     */
    utility.generateDirsHtml = function(dirsInfo, isMyContent, utility, isResourceList) {
        function recursionDirs(dirsInfo, notFirst) {
            //online类产品支持双语输入/显示, 如以后支持三种语言，请修改此逻辑
            var defaultLanguage,secondLanguage;
            if (iPortal.Variable.Directory && iPortal.Variable.Directory.supportMultiLanguages){
                var langArr = iPortal.Variable.Directory.supportMultiLanguages.split(",");
                if(langArr.length <2) {
                    return;
                }
                defaultLanguage = langArr[0];
                secondLanguage = langArr[1];
            }
            var dir;
            var strHtml = '<ul class="list-unstyled">';
            for (var i = 0, iLen = dirsInfo.length; i < iLen; i++) {
                var invisible = "";
                var pl = isResourceList? 10: 5;
                dir = dirsInfo[i];
                if(iPortal.Variable.Directory.isSupportMultiLanguages && dir.dirName.indexOf(defaultLanguage) !== -1){
                    dir.dirName = JSON.parse(dir.dirName);
                    if(document.cookie.indexOf(defaultLanguage) !== -1){
                        dir.dirName = utility.htmlencode(dir.dirName[defaultLanguage]);
                    }else{
                        dir.dirName = utility.htmlencode(dir.dirName[secondLanguage]);
                    }
                }else {
                    dir.dirName = utility.XSSFilter(dir.dirName);
                }
                pl += (dir.dirLevel - 1) * 10
                if (dir.subDirs.length === 0) {
                    invisible = "invisible";
                }
                strHtml += '<li><div class="dir-item-li" style="padding-left:' + pl + 'px" title="' + utility.XSSFilter(dir.dirName)+
                '" data-id="' + dir.id +'" data-parent-dir-id="' + dir.parentDirId + '">';
                var dirNameText = "";
                if(isResourceList){
                    dirNameText += '<span class="dir-name">'+ utility.XSSFilter(dir.dirName) +'</span><span class="mf3 dirResourceCount"> ('+ (dir.resourceCount || 0) + ')</span>';
                }else{
                    dirNameText += '<span class="dir-name">'+ utility.XSSFilter(dir.dirName) +'</span>';
                }
                if(isResourceList){
                    var icon;
                    if(!notFirst){
                        icon = dir.subDirs.length > 0? "iportal-icon-folders": "iportal-icon-folder";
                    }else{
                        icon = dir.subDirs.length > 0? "iportal-icon-folders": "iportal-icon-dots";
                    }
                    strHtml += '<i class="'+ icon +'"></i>' +
                                dirNameText +
                                (dir.subDirs.length > 0?'<i class="fr iportal-icon-chevron-right"></i>':"");
                }else{
                    strHtml += '<span class="arrow-icon"><span class="arrow arrow-right ' + invisible + '"></span></span>' +
                                '<span class="folder-sm"></span>' + dirNameText;
                }
                strHtml += "</div>";

                 if (dir.subDirs.length > 0) {
                     strHtml += recursionDirs(dir.subDirs, true);
                 }
                 strHtml += "</li>";
            }
            strHtml += '</ul>';
            return strHtml;
        }
        //我的内容中的目录结构
        var rs = 0;//rs 用于记录目录层级数（递归次数）
        function recursionMycontentDirs(dirsInfo) {
            var dir;
            var strHtml = '';
            for (var i = 0, iLen = dirsInfo.length; i < iLen; i++) {
                var invisible = "";
                dir = dirsInfo[i];
                if(dir.parentDirId === null){
                    dir.parentDirId = 'root';
                }
                if (dir.subDirs.length === 0) {
                    invisible = "invisible";
                }
                strHtml += '<div class="mycontent-dir-'+ rs +' dir-item-li" title="' + utility.XSSFilter(dir.dirName) +'" data-id="' + dir.id
                    + '" data-parent-dir-id="' + dir.parentDirId + '" data-level="'+dir.dirLevel+'">'
                    +'<span class="arrow-icon" title="'+iPortal.Lang.Common.DIRECTORY.PACKUP_DIR+'"><span class="arrow arrow-right ' + invisible + '"></span></span>'
                    +'<span class="folder-sm"></span>'
                    +'<span class="mycontent-dir-name">' + utility.XSSFilter(dir.dirName) +'</span>'
                    +'<span class="creat-span"> <i class="caret fr" ></i></span>'
                    +'<ul class="dropdown-menu creat-dir-menu dir-handle-menu" style="display:none;">'
                        +'<li class="dropdown-menu-li creat-dir-li">'+ iPortal.Lang.Common.DIRECTORY.CREATE +'</li><hr class="hr"/>'
                        +'<li class="dropdown-menu-li rename-dir-li">'+ iPortal.Lang.Common.DIRECTORY.RENAME +'</li><hr class="hr"/>'
                        +'<li class="dropdown-menu-li delete-dir-li">'+ iPortal.Lang.Common.DIRECTORY.DELETE +'</li>'
                    +'</ul>'
                if (dir.subDirs.length > 0) {
                    rs++;
                    strHtml += recursionMycontentDirs(dir.subDirs);
                }
                if(i === iLen-1){
                    rs--;
                }
                strHtml += '</div>'
            }
            return strHtml;
        }
        if (isMyContent){
            return recursionMycontentDirs(dirsInfo);
        }else{
            return recursionDirs(dirsInfo);
        }
    }
    /**
     * 检查标签是否符合规则。返回值规则如下：
     * 0:字符串为空；1:无效标签；2:超出6个；{key: 3, tags: tags}:符合规则
     */
    utility.checkTagsRule = function(strTag) {
        if(strTag.trim()==="") {
            return 0;
        }
        var arrTag = strTag.split(/,|，/ig);
        var strTags = "";
        var arrTags;
        for(var i=0,len=arrTag.length; i<len; i++){
            if(arrTag[i].trim() !== "" && strTags.indexOf(arrTag[i]) === -1) {
                strTags += arrTag[i] + ",";
            }
        }
        if(strTags.length === 0) {
            return 1;
        } else {
            strTags = strTags.substring(0, strTags.length - 1);
            arrTags = strTags.split(",");
            if(arrTags.length > 6) {
                return 2
            } else {
                return {tags: arrTags, key: 3};
            }
        }
    }
    /**
     * 根据entities判断权限的范围，不符合规则时返回空
     */
    utility.checkPermitRule = function(entities) {
        if(!this.isArray(entities)) {
            return;
        }
        if(entities.length === 0) {
            return;
        } else if(entities.length === 1) {
            return "PRIVATE";
        } else {
            var ruleHash = {};
            for(var index = 0;index < entities.length;index++){
                var entity = entities[index];
                if(entity.aliasName !== iPortal.Variable.Common.userName) {
                    if(entity.entityType === "USER" && entity.entityName === "GUEST" && (entity.permissionType === "READ"||entity.dataPermissionType === "DOWNLOAD" || entity.permissionType === "READWRITE")){
                        ruleHash.PUBLIC = true;
                    }  else if(entity.entityType === "IPORTALGROUP") {
                        ruleHash.GROUP = true;
                    } else if(entity.entityType === "DEPARTMENT"){
                        ruleHash.DEPARTMENT = true;
                    } else {
                        ruleHash.USER = "USER";
                    }
                }
            }
            switch(true){
            case ruleHash.PUBLIC :
                return "PUBLIC";
            case ruleHash.DEPARTMENT :
                return "DEPARTMENT";
            case ruleHash.GROUP :
                return "GROUP";
            default : return "USER";
            }
        }
    }
    /**
     * Function: SuperMap.Util.isInTheSameDomain
     * 判断一个 URL 请求是否在当前域中。
     *
     * Parameters:
     * url - {String}  URL 请求字符串。
     *
     * Returns:
     * {Boolean} 请求是否在当前域中。
     */
    utility.isInTheSameDomain = function(url) {
        if (!url) {
            return true;
        }
        var index = url.indexOf("//");
        var documentUrl = document.location.toString();
        var documentIndex = documentUrl.indexOf("//");
        if (index == -1) {
            return true;
        } else {
            var substring = url.substring(0, index);
            var documentSubString = documentUrl.substring(documentIndex + 2);
            documentIndex = documentSubString.indexOf("/");
            var documentDomainWithPort = documentSubString.substring(0, documentIndex);
            var documentprotocol = document.location.protocol;
            if (documentprotocol.toLowerCase() != substring.toLowerCase()) {
                return false;
            }
            substring = url.substring(index + 2);
            var portIndex = substring.indexOf(":");
            index = substring.indexOf("/");
            var domain = substring.substring(0, portIndex);
            var domainWithPort = substring.substring(0, index);
            var documentDomain = document.domain;
            if (domain == documentDomain && domainWithPort == documentDomainWithPort) {
                return true;
            }
        }
        return false;
    }
    /**
     * 是否为有效的url格式，但不保证地址可访问
     */
    utility.isURL = function (url) {
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)" + "(([\wZ_!~*'().&=+$%-]+: )?[\w!~*'().&=+$%-]+@)?" //ftp的user@
        +
            "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        +
            "|" // 允许IP和DOMAIN（域名）
        +
            "([0-9a-zA-Z_!~*'()-]+.)*" // 域名- www.
        +
            "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]." // 二级域名
        +
            "[a-zA-Z]{2,6})" // first level domain- .com or .museum
        +
            "(:[0-9]{1,4})?" // 端口- :80
        +
            "((/?)|" // a slash isn't required if there is no file name
        +
            "(/?[0-9a-zA-Z_\u4e00-\u9fa5_\uac00-\ud7ff!~*'().;?:@&=+$,%#-]+)+/?)$";
        var regExp = new RegExp(strRegex);
        return regExp.test(url);
    }
    /**
     * wms130服务中xy坐标轴需要反转的范围，参考wiki：http://wiki.com/pages/viewpage.action?pageId=42926105
     */
    utility.isInverseCoordinateAxis = function (epsgCode) {
        epsgCode = parseInt(epsgCode, 10);
        if (isNaN(epsgCode)) {
            throw new Error("isNaN");
        }
        if (!this.isNumber(epsgCode)) {
            throw new Error("typeError");
        }
        var lonlatCRSRanges = [
            [4001, 4999],
            [2738, 2758],
            [2044, 2045],
            [2081, 2083],
            [2085, 2086],
            [2093, 2093],
            [2096, 2098],
            [2105, 2132],
            [2169, 2170],
            [2176, 2180],
            [2193, 2193],
            [2200, 2200],
            [2206, 2212],
            [2319, 2319],
            [2320, 2358],
            [2360, 2462],
            [2523, 2549],
            [2551, 2735],
            [2935, 2941],
            [2953, 2953],
            [3006, 3030],
            [3034, 3035],
            [3058, 3059],
            [3068, 3068],
            [3114, 3118],
            [3126, 3138],
            [3300, 3301],
            [3328, 3335],
            [3346, 3346],
            [3350, 3352],
            [3366, 3366],
            [3416, 3416],
            [20004, 20032],
            [20064, 20092],
            [21413, 21423],
            [21473, 21483],
            [21896, 21899],
            [22171, 22177],
            [22181, 22187],
            [22191, 22197],
            [25884, 25884],
            [27205, 27232],
            [27391, 27398],
            [27492, 27492],
            [28402, 28432],
            [28462, 28492],
            [30161, 30179],
            [30800, 30800],
            [31251, 31259],
            [31275, 31279],
            [31281, 31290],
            [31466, 31700]
        ];

        var
        i,
        len = lonlatCRSRanges.length,
            isInversed = false;

        for (i = 0; i < len; i++) {
            if (epsgCode >= lonlatCRSRanges[i][0] && epsgCode <= lonlatCRSRanges[i][1]) {
                isInversed = true;
                break;
            }
        }

        return isInversed;
    }
    /**
     * 是否Number类型
     */
    utility.isNumber = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === "Number";
    }
    /**
     * 是否布尔类型
     */
    utility.isBoolean = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === "Boolean";
    }
    /**
     * 是否数组类型
     */
    utility.isArray = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === "Array";
    }
    /**
     * 是否函数类型
     */
    utility.isFunction = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === "Function";
    }
    /**
     * 是否对象类型
     */
    utility.isOject = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === "Object";
    }
    /**
     * 获取url的get传值参数
     */
    utility.getParamsFromUrl = function () {
        var
        str = window.location.search.substr(1),
            arr = str.split(/&|=/ig),
            keyValueObj = {};

        if (str === "") return keyValueObj;

        for (var i = 0,k=1, len = arr.length; i < len; i++) {
            keyValueObj[arr[i]] = decodeURI(arr[k++]);
        }

        return keyValueObj;
    }
    /**
     * 激活菜单项
     * tabLi: jq对象
     * isCustom: 是否是自定义（布尔值）
     */
    utility.activeBannerTab = function (jqObj, isCustom) {
        if(isCustom){
            if (jqObj.selector.indexOf("childMod") !== -1){
                jqObj.parent().parent().addClass("active").siblings().removeClass("active");
            }else{
                jqObj.addClass("active").siblings().removeClass("active");
            }
        }else{
            var url = location.href;
            jqObj.find("a").each(function(){
                if(url === this.href){
                    $(this).parent().attr("id").indexOf("childMod") !== -1?
                            $(this).parent().parent().parent().addClass("active").siblings().removeClass("active"):
                            $(this).parent().addClass("active").siblings().removeClass("active");
                    return false;
                }else{ //个人中心，名称对不上的情况
                    jqObj.addClass("active").siblings().removeClass("active");
                }
            })
        }
    }
    /*
     * 目录结构存在时，改变banner右侧图标 && 事件绑定
     */
    utility.bannerDirActive = function (jqObj){
        jqObj.find(".iportal-icon-menu-right").hide();
        jqObj.siblings("span").show();
    }
    /**
     * 设置标题
     */
    utility.setUITitle = function (title, isActive, url, isClearHtml) {
        var
        titleNode = $("#resourceCatalog"),
            isLinked = true;

        if (typeof url === "undefined" || url === null) {
            isLinked = false;
        }
        if (this.isBoolean(isClearHtml) && isClearHtml) {
            titleNode.html("");
        }
        if (isActive) {
            if (isLinked) {
                titleNode.append('<li><div class="ip-vr"><a href="' + url + '" style="text-decoration:none"><div class="search-title-underline">' + title + '</div></div></a></li>');
            } else {
                titleNode.append('<li><div class="ip-vr"><div class="search-title-underline">' + title + '</div></div></li>');
            }
        } else {
            if (isLinked) {
                titleNode.append('<li><a href="' + url + '" style="text-decoration:none">' + title + '</a></li>');
            } else {
                titleNode.append('<li>' + title + '</li>');
            }
        }
    }
    /**
     * alert 弹出框类型
     *
     * 参数
     * tip: 标题
     * message：描述信息
     * status： 状态（success、info、warning、danger）,该参数为空时默认为info
     * isSetTimeout: 在默认的时间内(5秒钟)弹出框自动消失.
     */
    utility.messageBox = {
        main: function(type, message, isSetTimeout){
            var typeList = {
                success: iPortal.Lang.Common.ALERT.SUCCESS,
                info: iPortal.Lang.Common.ALERT.INFO,
                warning: iPortal.Lang.Common.ALERT.WARNING,
                danger: iPortal.Lang.Common.ALERT.DANGER
            }
            $(".alert.alert-dismissable").remove();
            if (isSetTimeout !== false) {
                var timeoutId = window.setTimeout(function () {
                    window.clearTimeout(timeoutId);
                    $(".alert.alert-dismissable").remove();
                }, 5000);
            }
            var tip;
            try {
                tip = iPortal.Lang.Common.ALERT.type.toUpperCase() + ":";
            } catch(error) {
                tip = typeList[type];
            }
            $("body").append('<div class="alert alert-'+ type +' alert-dismissable alert-popup">' +
                '<button type="button" class="close" data-dismiss="alert" data-hidden="true">&times;</button>' +
                '<strong>' + tip + '</strong>' + message +
                '</div>');
        },
        success: function(message, isSetTimeout) {
            var type = "success";
            this.main(type, message, isSetTimeout)
        },
        info: function(message, isSetTimeout) {
            var type = "info";
            this.main(type, message, isSetTimeout)
        },
        warning: function(message, isSetTimeout) {
            var type = "warning";
            this.main(type, message, isSetTimeout)
        },
        danger: function(message, isSetTimeout) {
            var type = "danger";
            this.main(type, message, isSetTimeout)
        }
    },
    /**
     * 移动select组件的选中项    该方法已经弃用，暂时注释，适时删除
     *
     * sourceElemId：待删除项的select组件的Id
     * targetElemId：待添加项的select组件的Id
     * isAll: 布尔类型。是否全部添加或删除。true代表全部。该参数可选。不传或者是false时按选中项处理
     */
    /*utility.moveSelectedItems = function(sourceElemId, targetElemId, isAll) {
        var
        source = document.getElementById(sourceElemId),
            target = document.getElementById(targetElemId),
            selectedOption, newOption;

        if (!this.isBoolean(isAll)) {
            while (source.selectedIndex !== -1) {
                selectedOption = source.options[source.selectedIndex];
                newOption = new Option(selectedOption.text, selectedOption.value);
                target.options.add(newOption, 0);
                source.remove(source.selectedIndex);
            }
        } else if (this.isBoolean(isAll) && isAll) {
            for (var i = source.options.length - 1; i >= 0; i--) {
                selectedOption = source.options[i];
                newOption = new Option(selectedOption.text, selectedOption.value);
                target.options.add(newOption, 0);
                source.remove(i);
            }
        }
    },*/
    /*
     * 创建客户端过滤的正则表达式
     */
    utility.createFilterRegExpSearch = function (sSearch) {
        var
        acEscape = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'],
            reReplace = new RegExp('(\\' + acEscape.join('|\\') + ')', 'g'),
            asSearch = sSearch.replace(reReplace, '\\$1').split(' '),
            sRegExpString = '^(?=.*?' + asSearch.join(')(?=.*?') + ').*$';

        return new RegExp(sRegExpString, "i");
    },
    /*
     * 从数组中删除指定的元素并返回数组,如果数组的元素为object对象，需要传入比较的关键字
     */
    utility.removeElementFromArray = function (elem, arr, key) {
        if (typeof elem === "undefined" || typeof arr === "undefined") {
            return arr;
        }
        if (!this.isArray(arr)) {
            return arr;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === elem || arr[i][key] === elem) {
                arr.splice(i, 1);
                break;
            }
        }
    },
    /*
     * 从数组中查找指定的元素并返回索引的位置，如果数组的元素为object对象，需要传入比较的关键字。找不到则返回-1
     */
    utility.findElementFromArray = function (elem, arr, key) {
        if (typeof elem === "undefined" || typeof arr === "undefined") {
            return -1;
        }
        if (!this.isArray(arr)) {
            return arr;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === elem || arr[i][key] === elem) {
                return i;
            }
        }
        return -1;
    },
    /*
     * 显示时间格式化简版
     */
    utility.transferDateSim = function (timeStr) {
       var year = timeStr.getFullYear(),
           month = timeStr.getMonth(),
           date = timeStr.getDate(),
           sepraor = "-",
           time;
       month = month+1;  //月份以数组形式保存 从0开始，所以所取值比真实值少1
       if (month >=1 && month<=9) {
           month = "0" + month;
       }
       if (date >=1 && date<=9) {
           date = "0" + date;
       }
       time = year + sepraor + month +sepraor + date;
       return time;
    },
    /*
     * 显示时间格式化
     */
    utility.transferDate = function (oldTime, currentTime) {
        var
        year = oldTime.getFullYear(),
            month = oldTime.getMonth() + 1,
            day = oldTime.getDate(),
            hour = oldTime.getHours(),
            minute = oldTime.getMinutes(),
            second = oldTime.getSeconds(),
            curYear = currentTime.getFullYear(),
            curMonth = currentTime.getMonth() + 1,
            curDay = currentTime.getDate(),
            curHour = currentTime.getHours(),
            curMin = currentTime.getMinutes(),
            curSec = currentTime.getSeconds(),
            monthStr = changeTo2Bit(month),
            dayStr = changeTo2Bit(day),
            hourStr = changeTo2Bit(hour),
            minuteStr = changeTo2Bit(minute),
            timeStr;
        if (year < curYear) {
            timeStr = year + iPortal.Lang.Common.TIME_MEASURE.YEAR + monthStr + iPortal.Lang.Common.TIME_MEASURE.MONTH + dayStr + iPortal.Lang.Common.TIME_MEASURE.DAY + hourStr + ":" + minuteStr;
        } else {
            if (month < curMonth) {
                timeStr = monthStr + iPortal.Lang.Common.TIME_MEASURE.MONTH + dayStr + iPortal.Lang.Common.TIME_MEASURE.DAY + hourStr + ":" + minuteStr;
            } else if (month === curMonth) {
                if (curDay - day >= 1) {
                    timeStr = monthStr + iPortal.Lang.Common.TIME_MEASURE.MONTH + dayStr + iPortal.Lang.Common.TIME_MEASURE.DAY + hourStr + ":" + minuteStr;
                } else if (curHour - hour >= 1) {
                    timeStr = iPortal.Lang.Common.TIME_MEASURE.TODAY + hourStr + ":" + minuteStr;
                } else if (curMin - minute >= 2) {
                    timeStr = curMin - minute + iPortal.Lang.Common.TIME_MEASURE.MINUTE_AGO;
                } else if (curMin === minute || currentTime - oldTime < 0) {
                    timeStr = iPortal.Lang.Common.TIME_MEASURE.MOMENT;
                } else {
                    timeStr = curSec - second < 0 ? iPortal.Lang.Common.TIME_MEASURE.MOMENT: curMin - minute + iPortal.Lang.Common.TIME_MEASURE.MINUTE_AGO;
                }
            }
        }
        return timeStr;
    },
    //资源列表时间格式化
    utility.resourceTimeFormat = function(selector){
        $(selector).each(function(){
            var createTime = parseInt($(this).html(), 10),
                formatTime = utility.transferDate(new Date(createTime), new Date(iPortal.Variable.Common.currentTime));
            $(this).html(formatTime).attr("title", formatTime);
        });
    }
    /**
     * iportal查询字符串转数组
     */
    utility.toArray = function (strKeyWords) {
        if (typeof strKeyWords === "undefined") {
            return [];
        }
        var
            startQuoteEN = /^\"/ig, //以英文双引号开头
            endQuoteEN = /.*\"$/ig, //以英文双引号结尾
            startQuoteZH = /^“/ig, //以中文双引号开头
            endQuoteZH = /.*”$/ig, //以中文双引号结尾
            regBlank = /\s/ig,
            arr = strKeyWords.trim().split(regBlank),
            len = arr.length,
            arr_res = [],
            query;

        //查询是否有相应的结束标识
        query = function (startIndex, regEndQuotes) {
            var
            isQuoteEnd = false,
                endIndex = 0;

            for (var i = startIndex; i < len; i++) {
                var item = arr[i],
                    isRegEndQuotes = regEndQuotes.test(item);
                if (isRegEndQuotes) {
                    isQuoteEnd = true;
                    endIndex = i;
                    break;
                }
            }
            return {
                isEnd: isQuoteEnd,
                endIndex: endIndex + 1
            };
        }
        for (var i = 0; i < len;) {
            var
            item = arr[i],
                result;
            var isStartQuoteEN = startQuoteEN.test(item),
                isStartQuoteZH = startQuoteZH.test(item);
            if (item === "" || regBlank.test(item)) {
                i++;
            } else if (isStartQuoteEN) {
                result = query(i + 1, endQuoteEN);
                if (!result.isEnd) {
                    arr_res.push(item);
                    i++;
                } else {
                    var tempArr = [];
                    for (var m = i; m < result.endIndex; m++) {
                        item = arr[m];
                        tempArr.push(item.replace(/\"/ig, ""));
                    }
                    arr_res.push(tempArr.join(" "));
                    i = result.endIndex;
                }
            } else if (isStartQuoteZH) {
                result = query(i + 1, endQuoteZH);
                if (!result.isEnd) {
                    arr_res.push(item);
                    i++;
                } else {
                    var tempArr = [];
                    for (var n = i; n < result.endIndex; n++) {
                        item = arr[n];
                        tempArr.push(item.replace(/“/ig, "").replace(/”/ig, ""));
                    }
                    arr_res.push(tempArr.join(" "));
                    i = result.endIndex;
                }
            } else {
                arr_res.push(item);
                i++;
            }
        }

        return arr_res;
    },
    /*
     * 判断OGC服务地址获取GetCapabilities文档时是否包含service和request参数
     */
    utility.resolveOGCService = function (url, type) {
        if (url == undefined || url.trim() === "" || type == undefined || type.trim() === "") {
            return undefined;
        }
        var
        serviceReg = /service=w[m|mt|f|c|p]s/ig,
            requestReg = /REQUEST=GetCapabilities/ig,
            index = url.indexOf("?"),
            lastCharCode = url.substr(-1, 1),
            tempUrl,
            tempType;
        tempType = type.trim().toUpperCase();
        var tempTypeGroup={
                WMS:1,
                WMTS:1,
                WFS:1,
                WCS:1,
                WPS:1
            }
        if(tempTypeGroup[tempType] !== 1){
            return undefined;
        }

        if (index < 0) {
            tempUrl = url + "?SERVICE=" + tempType + "&REQUEST=GetCapabilities";
        } else {
            var isServiceReg = serviceReg.test(url),
                isRequestReg = requestReg.test(url);
            if (!isServiceReg) {
                if (lastCharCode === "&") {
                    url += "SERVICE=" + tempType;
                } else {
                    url += "&SERVICE=" + tempType;
                }
                lastCharCode = url.substr(-1, 1);
            }
            if (!isRequestReg) {
                if (lastCharCode === "&") {
                    url += "REQUEST=GetCapabilities"
                } else {
                    url += "&REQUEST=GetCapabilities"
                }
            }
            tempUrl = url;
        }

        return tempUrl;
    },
    /**
     * 全选/反选/全消(status: all, reverse, none)
     */
    utility.selectCheckBox = function (clickSelector, chkedSelector, selectAllId, status) {
        status = status.toLowerCase();
        $("#" + clickSelector).click(function () {
            if (clickSelector === selectAllId) {
                $(chkedSelector).prop("checked", $(this).prop('checked'));
            } else if (status === "all") {
                $(chkedSelector).prop("checked", true);
                $("#" + selectAllId).prop("checked", true);
            } else if (status === "reverse") {
                $(chkedSelector).each(function () {
                    $(this).prop("checked", !($(this).prop("checked")));
                });
                var bl = isSelectedAll(chkedSelector);
                if (utility.isBoolean(bl) && bl) {
                    $("#" + selectAllId).prop("checked", false);
                } else {
                    $("#" + selectAllId).prop("checked", true);
                }
            } else {
                $(chkedSelector).prop("checked", false);
                $("#" + selectAllId).prop("checked", false);
            }
        });

        function isSelectedAll(chkedSelector) {
            var unSelected = false;

            $(chkedSelector).each(function () {
                if (!$(this).prop("checked")) {
                    unSelected = true;
                }
            });

            return unSelected;
        }
    },

    /**
     * 全选状态检查
     */
    utility.listCheckChanged = function (clickSelector, chkedSelector, selectAllId) {
        $(chkedSelector).click(function () {
            var bl = isSelectedAll(chkedSelector);
            if (utility.isBoolean(bl) && bl) {
                $("#" + selectAllId).prop("checked", false);
            } else {
                $("#" + selectAllId).prop("checked", true);
            }
        });


        function isSelectedAll(chkedSelector) {
            var unSelected = false;
            $(chkedSelector).each(function () {
                if (!$(this).prop("checked")) {
                    unSelected = true;
                }
            });
            return unSelected;
        }
    },

    //判断两个对象是否相等
    utility.authorizeEntitiesEqual = function (objA, objB) {
        if (typeof objA !== typeof objB) {
            return false;
        }
        if (this.isArray(objA) !== this.isArray(objB)) {
            return false;
        }
        var result = true;
        if (this.isArray(objA)) {
            if (objA.length !== objB.length) {
                return false;
            }
            for (var index = 0; index < objA.length; index++) {
                result = utility.authorizeEntitiesEqual(objA[index], objB[index]);
                if (!result) {
                    return false;
                }
            }
        } else {
            for (var o in objA) {
                if (typeof objA[o] == 'number' || typeof objA[o] == 'string') {
                    result = objA[o] === objB[o];
                } else {
                    result = utility.authorizeEntitiesEqual(objA[o], objB[o]);
                }
                if (!result) {
                    return false;
                }
            }
        }
        return result;
    },

    //复制权限信息
    utility.authorizeEntitiesCopy = function (entities) {
        var tmpEntities = [];
        if (entities && entities.length > 0) {
            for (var index = 0; index < entities.length; index++) {
                var item = entities[index];
                var entity={};
                entity.entityId=item.entityId;
                entity.entityType=item.entityType;
                entity.entityName=item.entityName;
                entity.aliasName=item.aliasName;
                entity.entityRoles = item.entityRoles;
                if(item.dataPermissionType){
                    entity.permissionType=item.dataPermissionType;
                }else{
                    entity.permissionType=item.permissionType;
                }
                tmpEntities.push(entity);
            }
        }
        return tmpEntities;
    },
    //字节转换为带单位的GB、KB等体积字符串
    utility.convertSize = function (size) {
        if (!size) {
            return '0 Bytes';
        }
        var sizeNames = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
        var i = Math.floor(Math.log(size) / Math.log(1024));
        var p = (i > 1) ? 2 : 0;
        return (size / Math.pow(1024, Math.floor(i))).toFixed(p) + sizeNames[i];
    }

    //防止XSS攻击
    utility.XSSFilter = function (val){
        if (val != null) {
            val = val.toString();
            val = val.replace(/</g,"&lt;");
            val = val.replace(/>/g,"&gt;");
            val = val.replace(/"/g,"&quot;");
            val = val.replace(/'/g,"&#39;");
        }
        return val;
    };
    //转码
    utility.utf16to8 = function (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
              out += str.charAt(i);
          } else if (c > 0x07FF) {
              out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
              out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
              out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
              out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
              out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      }
      //判断是否为IE8及以下浏览器
      utility.isIE8Minus = function () {
          var browser = navigator.appName;
          if (browser === "Microsoft Internet Explorer") {
              var bVersion = navigator.appVersion;
              var version = bVersion.split(";");
              bVersion = version[1].replace(/[ ]/g, "").replace(/msie/ig, "");
              bVersion = parseInt(bVersion, 10);
              if (bVersion < 9) {
                  return true;
              }
              return false;
          } else {
              return false;
          }
      }

    //检测url有效性
      utility.checkUrl = function (url, checkSuccessed, checkFailed){
          if ($.trim(url).length === 0) {
              utility.messageBox.warning(iPortal.Lang.Common.PROMPT.URL_MANDATORY);
          } else if (!utility.isURL(url)) {
              utility.messageBox.warning(iPortal.Lang.Common.PROMPT.ERROR_URL_FORMAT);
          } else if (/^http[s]?:\/\/localhost/.test(url) || /^http[s]?:\/\/127.0.0.1/.test(url)){
              utility.messageBox.warning(iPortal.Lang.Common.PROMPT.URL_OR_IP);
          } else {
              checkSuccessed();
              return;
          }
          checkFailed && checkFailed();
      }
    /**
     * 让弹出框可拖动并设置到浏览器窗口的中心
     * @param $modal
     */
    utility.setModalCenter = function($modal){
        $modal = $modal || $('.modal');
        $modal.dragLibrary().each(function(){
           $(this).on('show.bs.modal',function(){
               setCenter($(this));
           });
        });
        $(window).resize(function(){
            $modal.each(function(){
                setCenter($(this));
            });
        });
        function setCenter($modal){
            var modal= $modal,
                modalContent = modal.find('.modal-content'),
                modalDialog = modal.find('.modal-dialog');
            var vWidth = $(window).width();
            modalContent.css('position','static');
            //先把窗口移动到屏幕外的地方，防止闪烁
            modalDialog.css({'margin': 0,top:-2000,left:vWidth/2});
            // 设置在170毫秒（ie下为250毫秒）以后再执行窗口的移动，这样可以等modal被加到document中并且计算好宽高再来获取宽高并计算居中的位置
            var DELAY = /trident/i.test(navigator.userAgent) ? 250 : 170;
            window.setTimeout(function() {
                var mHeight = modalContent.height(), mWidth = modalContent.width();
                var vHeight = $(window).height(), vWidth = $(window).width();
                var top= vHeight>mHeight?(vHeight - mHeight) / 2:0;
                var left= vWidth>mWidth?(vWidth - mWidth) / 2:0;
                modalDialog.css({
                    top : top,
                    left : left
                });
            }, DELAY);


        }
    }
    utility.getUsefulTags = function(srcTags){
        var usefulTags = [];
        if(srcTags === null || srcTags === undefined || srcTags.length === 0){
            return usefulTags;
        }
        for(var i=0; i<srcTags.length; i++){
            if(srcTags[i].trim() !== ""){
                usefulTags.push(srcTags[i]);
            }
        }
        for(var j=0; j<usefulTags.length; j++){
            for(var k=j+1; k<usefulTags.length; k++){
                if(usefulTags[j] !== usefulTags[k]){
                    continue;
                }
                for(var m=k+1;m<usefulTags.length;m++){
                    usefulTags[m-1] = usefulTags[m];
                }
                usefulTags.pop();
            }
        }
        return usefulTags;
    }
    utility.getParamValueFromUrl = function(url, paramName){
        if (url != undefined && paramName != undefined && url.indexOf("?") !== -1 && url.indexOf(paramName + "=") !== -1) {
            var paramStr = url.split("?")[1];
            var params = paramStr.split("&");
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf(paramName) !== -1) {
                    return params[i].split("=").length == 2 ? params[i].split("=")[1] : "";
                }
            }
        }
        return null;
    }

    //首页定制配置信息的兼容
    utility.conpatibleOldortal = {
            conpatibleWedgets : function (config){
                // 兼容旧版没有快捷链接
                var wedgets = {
                    isVisible: true,
                    number: 5,
                    datas: [{
                        id: "chkwed-map",
                        icon: getRootUrl().replace("manager/", "") + "web/static/portal/img/home/ip_maps.png",
                        title: iPortal.Lang.Common.RESOURCE_TYPE.MAP,
                        url: getRootUrl().replace("manager/", "") + "web/maps",
                        isVisible: true,
                        isDefault: true
                    },{
                       id: "chkwed-services",
                       icon: getRootUrl().replace("manager/", "") + "web/static/portal/img/home/ip_services.png",
                       title: iPortal.Lang.Common.RESOURCE_TYPE.SERVICE,
                       url: getRootUrl().replace("manager/", "") + "web/services",
                       isVisible: true,
                       isDefault: true
                    },{
                       id: "chkwed-scenes",
                       icon: getRootUrl().replace("manager/", "") + "web/static/portal/img/home/ip_scene.png",
                       title: iPortal.Lang.Common.RESOURCE_TYPE.SCENE,
                       url: getRootUrl().replace("manager/", "") + "web/scenes",
                       isVisible: true,
                       isDefault: true
                    },{
                       id: "chkwed-groups",
                       icon: getRootUrl().replace("manager/", "") + "web/static/portal/img/home/ip_group.png",
                       title: iPortal.Lang.Common.RESOURCE_TYPE.GROUP,
                       url: getRootUrl().replace("manager/", "") + "web/groups",
                       isVisible: true,
                       isDefault: true
                    },{
                       id: "chkwed-custom",
                       icon: getRootUrl().replace("manager/", "") + "web/static/portal/img/home/ip_custom.png",
                       title: iPortal.Lang.Common.RESOURCE_TYPE.USER_UNDEFINED_MODULE,
                       url: "javascript:void(0)",
                       isVisible: true,
                       isDefault: false
                    }]
                };
                config.wedgets = wedgets;
                return config;
            },
            conpatibleMenus : function (config){
             // 兼容旧版没有数据列表的问题
                var menusArr = [],resourceNum;
                //先取出所有的元素，并预留出headerResources 元素的下标
                for(var i=0,Len=config.menus.length; i< Len; i++){
                    var tempMenu = config.menus[i];
                    menusArr.push(tempMenu);
                    if(tempMenu.children){
                        menusArr = menusArr.concat(tempMenu.children);
                    }
                    if(tempMenu.id==="headerResources"){
                        resourceNum = i;
                    }
                }
                // 用以判断元素中包含数据列表项
                var isOldData = true;
                for(var t=0,len=menusArr.length; t< len; t++){
                    if(menusArr[t].url.indexOf("/web/datas") !== -1){
                        isOldData = false;
                    }
                }
                // 不包含的话给添加上
                if(isOldData){
                    var dataObj = {
                            id: "childMod_Datas",
                            title: iPortal.Lang.Common.RESOURCE_TYPE.DATA,
                            url: getRootUrl().replace("manager/", "") + "web/datas",
                            isVisible: true,
                            isDefined: false,
                            isCustomColumn: false
                    };
                    if(config.menus[resourceNum]) {
                        config.menus[resourceNum].children.push(dataObj);
                    }else{
                        //兼容800版本 还没有二级菜单的情况
                        config.menus.push(dataObj);
                    }
                }
                return config;
            }
    }

    /*
     * 删除资源时获取pageIndex
     * cp: currentPage
     * tp: totalPage
     * cd: currentDataNum
     * da: deleteDataArr
     */
    utility.getDeletePageIndex = function(cp, tp, cdn, da){
        if(cp > tp){
            throw new Error("currentPage cant't be greater than totalPage!");
        }
        var deleteNum = Array.isArray(da)? da.length: 1;
        if(cdn === deleteNum && cp === tp){
            return cp-1 < 1? 1: cp-1;
        }
        return cp;
    }

    /*
     * 资源管理编辑元信息功能  √为必填
     * tbSelectorArr: table选择器组成的数组  √
     * updateUrl: 更新元信息的API √
     * type: 资源类型   √
     * dataObj: 需要发送的额外数据
     */
    utility.editResMeta = {
        init: function(btnSelector, updateUrl, type, dataObj){
            this.btnElem = $(btnSelector);
            this.updateUrl = updateUrl;
            this.resType = type;
            this.additData = dataObj || {};
            this.checkStatus();
            this.bindEvent();
        },
        checkStatus: function(){
            this.url = window.location.href;
            var params = this.getUrlParam(this.url);
            if(params.isEdit){
                this.changeToEdit();
            }
        },
        bindEvent: function(){
            var me = this;
            this.btnElem.click(function(){
                window.location.href += "?isEdit=true";
            });
            $("#editSave").click(function(){
                me.verifyMeta() && me.updateMeta();
            });
            $("#editCancel").click(function(){
                window.location.href = window.location.href.split("?")[0];
            });
        },
        getUrlParam: function(url){
            var obj = {},
                arr = url.match(/[?|&][^&=]+=[^&=]+/g);
            if(Array.isArray(arr)){
                for(var i=0; i<arr.length; i++){
                    var param = arr[i].slice(1);
                    obj[param.split("=")[0]] = param.split("=")[1];
                }
            }
            return obj;
        },
        changeToEdit: function(){
            $("[data-meta-status]").toggleClass("hidden");
            $("[data-btn-status]").toggleClass("hidden");
        },
        verifyMeta: function(){
            if(imageUploadEvent.SMIP.customFileBtn.btnStatus !== 'succ'){
                return;
            }
            var resName;
            switch(this.resType){
                case "service":
                    resName = $("[data-meta-type='resTitle']").val().trim();
                    break;
                case "map":
                    resName = $("[data-meta-type='title']").val().trim();
                    break;
                case "data":
                    resName = $("[data-meta-type='fileName']").val().trim();
                    break;
                case "app":
                    resName = $("[data-meta-type='appName']").val().trim();
                    break;
                case "group":
                    resName = $("[data-meta-type='groupName']").val().trim();
                    break;
                default:
                    resName = $("[data-meta-type='name']").val().trim();
            }
            if(resName === "") {
                utility.messageBox.warning(iPortal.Lang.Common.PROMPT.REQUIRED_FIELDS.replace("{FIELD}",  iPortal.Lang.Common.RESOURCE_TITLE));
                return false;
            }
            var tagResult = utility.checkTagsRule($("[data-special-meta='tags']").val().trim());
            switch(tagResult){
               case 0 : utility.messageBox.info(iPortal.Lang.ResourceList.TAG.SET_TAG);
                       return false;
               case 1 : utility.messageBox.info(iPortal.Lang.ResourceList.TAG.UNAVAILABLE_TAG);
                       return false;
               case 2 : utility.messageBox.warning(iPortal.Lang.ResourceList.TAG.MAX_TAG);
                       return false;
               default : this.tagsArr = tagResult.tags;
                           break;
            }
            return true;
        },
        updateMeta: function(){
            var sendData = this.getSendData();
            utility.sendRequest(this.updateUrl, "PUT", "json", JSON.stringify(sendData), function(data){
                if(data.succeed) {
                    utility.messageBox.success(iPortal.Lang.Common.PROMPT.OPERATE_SUCCESS);
                    setTimeout(function() {
                        window.location.href = window.location.href.split("?")[0];
                    }, 1000);
                } else {
                    utility.messageBox.danger(iPortal.Lang.Common.PROMPT.OPERATE_FAIL);
                }
            }, function(error){
                utility.messageBox.danger(iPortal.Lang.Common.PROMPT.OPERATE_FAIL + error.error.errorMsg);
            })
        },
        getSendData: function(){
            var sendData;
            switch(this.resType){
                case "service":
                    var isHostedService = this.additData.isDataItemService;
                    sendData = this.getServiceMeta(isHostedService);
                    break;
                case "data":
                    sendData = this.getDataMeta();
                    break;
                case "group":
                    sendData = this.getGroupMeta();
                    break;
                default:
                    sendData = this.getMetaInfo();
            }
            sendData.tags = this.tagsArr;
            this.resType === "group" && (sendData.icon = this.getImgthumbnail()) || (sendData.thumbnail = this.getImgthumbnail());
            return sendData;
        },
        getMetaInfo: function(){
            var ipts = $("[data-meta-status='edit'] table").find("[data-meta-type]"),
                meta = {};
            for(var i=0; i<ipts.length; i++){
                meta[$(ipts[i]).attr("data-meta-type")] = $(ipts[i]).val().trim() || null;
            }
            return meta;
        },
        getServiceMeta: function(isHostedSer){
            var meta = {
                    authorizeSetting: this.additData.authorizeSetting,
                    metadata: this.additData.metadata
            },
                rangeMeta = $("[data-service-geoBndBox]"),
                infoMeta = $("[data-service-mdContact]"),
                addressMeta = $("[data-service-cntAddress]"),
                cntInfoMeta = $("[data-service-rpCntInfo]");
            isHostedSer && this.createHostedSerObj(meta);
            for(var i=0; i<rangeMeta.length; i++){
                meta.metadata.dataIdInfo.dataIdent.dataExt.geoEle.geoBndBox[$(rangeMeta[i]).attr("data-service-geoBndBox")] = $(rangeMeta[i]).val().trim();
            }
            for(i=0; i<infoMeta.length; i++){
                meta.metadata.mdContact[$(infoMeta[i]).attr("data-service-mdContact")] = $(infoMeta[i]).val().trim();
            }
            for(i=0; i<addressMeta.length; i++){
                meta.metadata.mdContact.rpCntInfo.cntAddress[$(addressMeta[i]).attr("data-service-cntAddress")] = $(addressMeta[i]).val().trim();
            }
            for(i=0; i<cntInfoMeta.length; i++){
                meta.metadata.mdContact.rpCntInfo[$(cntInfoMeta[i]).attr("data-service-rpCntInfo")] = $(cntInfoMeta[i]).val().trim();
            }
            meta.metadata.refSysInfo.refSysID = $("[data-service-refSysInfo='refSysID']").val().trim();
            meta.metadata.refSysInfo.mdCoRefSys.projection = $("[data-service-mdCoRefSys='projection']").val().trim();
            meta.metadata.dataIdInfo.dataIdent.dataExt.exDesc = $("[data-service-dataExt='exDesc']").val().trim();
            meta.metadata.dataIdInfo.dataIdent.idCitation.resTitle = $("[data-meta-type='resTitle']").val().trim();
            meta.metadata.dataIdInfo.dataIdent.idAbs = $("[data-meta-type='description']").val().trim();
            return meta;
        },
        createHostedSerObj: function(meta){
            meta.metadata.dataIdInfo = {
                dataIdent: {
                    dataExt: {
                        geoEle: {
                            geoBndBox: {}
                        }
                    },
                    idCitation: {}
                }
            };
            meta.metadata.mdContact = {
                rpCntInfo: {
                    cntAddress: {}
                }
            };
            meta.metadata.refSysInfo = {
                mdCoRefSys: {}
            };
        },
        getDataMeta: function(){
            var meta = {
                dataMetaInfo: this.additData.dataMetaInfo
            },
                strArr = this.additData.fileName.split(".");
            meta.fileName = $("[data-meta-type='fileName']").val().trim() + "." + strArr[strArr.length-1];
            meta.description = $("[data-meta-type='description']").val().trim();
            return meta;
        },
        getGroupMeta: function(){
            var meta = {
                isNeedCheck: this.additData
            }
            meta.isPublic = $("[data-isPublic]").attr("data-isPublic") === "true"? true: false;
            meta.resourceSharer = $("[data-resourceSharer]").attr("data-resourceSharer");
            meta.groupName = $("[data-meta-type='groupName']").val().trim();
            meta.description = $("[data-meta-type='description']").val().trim();
            return meta;
        },
        getImgthumbnail: function(){
            var uploadFilePath = $("#resThumbnailImg").data("uploadFilePath"),
                thumbnail = uploadFilePath?
                    "${iportalDirectoryServicesRootUrl}/../" + uploadFilePath:
                    $("#resThumbnailImg").attr("data-thumbnail");
            return thumbnail;
        }
    };

    /*
     *添加资源时获取标签
     */
    utility.getResTags = function(){
        var ipt = $("#tagsIpt"),
            tagResult = utility.checkTagsRule(ipt.val().trim()),
            tags;
        switch(tagResult){
           case 0 : tags = ipt.attr("placeholder");
                   break;
           case 1 : utility.messageBox.info(iPortal.Lang.ResourceList.TAG.UNAVAILABLE_TAG);
                   return false;
           case 2 : utility.messageBox.warning(iPortal.Lang.ResourceList.TAG.MAX_TAG);
                   return false;
           default : tags = tagResult.tags;
        }
        return tags;
    }

    /*
     * 获取当前语言环境
     * 返回值：ZH / EN
     */
    utility.getCurrentLang = function(){
        var languageArr = document.cookie.match(/language=\w+;?/),
            currentLanguage = languageArr? languageArr[0].split("=")[1]:
                            (navigator.browserLanguage || navigator.languages[0]).split("-")[0];//没有cookie时获取浏览器语言环境
        return currentLanguage.toUpperCase();
    }
})(window);

/**
 * Array.prototype.filter 函数扩展
 */
if (typeof Array.prototype.filter !== "function") {
    Array.prototype.filter = function(fn, context) {
        var me = this, arr = [];
        if (typeof fn !== "function") {
            throw new TypeError("不是一个有效的函数！");
        }
        for(var i=0,len=me.length; i<len; i++) {
            !!fn.call(context, me[i], me) && arr.push(me[i]);
        }
        return arr;
    }
}
/**
 * Array.prototype.map 函数扩展
 */
if (typeof Array.prototype.map !== "function") {
    Array.prototype.map = function(fn, context) {
        var me = this, arr = [];
        if (typeof fn !== "function") {
            throw new TypeError("不是一个有效的函数！");
        }
        for(var i=0,len=me.length; i<len; i++) {
            arr.push(fn.call(context, me[i], i, me));
        }
        return arr;
    }
}
/**
 * Array.prototype.forEach 函数扩展
 */
if (typeof Array.prototype.forEach !== "function") {
    Array.prototype.forEach = function(fn, context) {
        var me = this;
        if (typeof fn !== "function") {
            throw new TypeError("不是一个有效的函数！");
        }
        for (var i = 0, iLen = me.length; i < iLen; i++) {
            fn.call(context, me[i], i, me);
        }
    }
}
/**
 * Array.prototype.some 函数扩展
 */
if (typeof Array.prototype.some !== "function") {
    Array.prototype.some = function(fn, context) {
        var me = this, passed = false;
        if (typeof fn !== "function") {
            throw new TypeError("不是一个有效的函数！");
        }
        for (var i = 0, iLen = me.length; i < iLen; i++) {
            if (passed) {
                break;
            }
            passed = fn.call(context, me[i], me);
        }
        return passed;
    }
}
/**
 * Array.prototype.indexOf 函数扩展
 */
if (typeof Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf = function(searchElem, fromIndex) {
        var me = this, index = -1;

        fromIndex = fromIndex * 1 || 0;
        for (var i = 0, iLen = me.length; i < iLen; i++) {
            if (i >= fromIndex && me[i] === searchElem) {
                index = i;
                break;
            }
        }
        return index;
    }
}
/*
 * 格式化Date
 */
Date.prototype.format = function (style) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "w+": "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(this.getDay()), //week
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(style)) {
        style = style.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(style)) {
            style = style.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return style;
}
//bootstrap的modal确认提示对话框
var BootstrapDialog = BootstrapDialog || {};
BootstrapDialog.confirm = function (title, msg, addOnsMsg, onOKClick, onCancelClick, okBtnName, onBeforeShow, isChecked) {
    var titleName = title ? title : iPortal.Lang.Common.OPERATE.TIPS;
    var html;
    msg = msg ? msg : "";
    addOnsMsg = addOnsMsg ? addOnsMsg : "";
    isChecked = (isChecked === true) ? isChecked : "";  //该参数用以设置是否默认选中选框
    okBtnName = okBtnName || iPortal.Lang.Common.OPERATE.CONFIRM;
    if (!BootstrapDialog.confirmInited) {
        BootstrapDialog.confirmInited = true;
        html = '<div class="modal fade" tabindex="-1" id="SuperMap_BootstrapDialog_confirm" role="dialog" aria-hidden="false">' +
            '<div class="modal-dialog" style="max-width: 500px;">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<span id="SuperMap_BootstrapDialog_Title">' + titleName + '</span>' +
            '</div>' +
            '<div class="modal-body" style="line-height: 37px;padding-left: 32px; min-height: 75px;"><span id="SuperMap_BootstrapDialog_Msg">' + msg + '</span></div>' +
            '<div class="modal-footer">';
        if (addOnsMsg !== "") {
            if (isChecked) {
                html += '<label><input id="addOnsChked" type="checkbox" checked=true>' + addOnsMsg + '</label>';
            }else {
                html += '<label><input id="addOnsChked" type="checkbox">' + addOnsMsg + '</label>';
            }
        }
        html += '<button type="button" id="SuperMap_BootstrapDialog_OK" class="btn btn-primary" data-dismiss="modal">' + okBtnName + '</button>' +
                '<span class="modal-slider"></span>' +
            '<button type="button" id="SuperMap_BootstrapDialog_Cancel" class="btn btn-default" data-dismiss="modal">' + iPortal.Lang.Common.OPERATE.CANCEL + '</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $("body").append(html);
        var isIE = /trident/i.test(navigator.userAgent); //IE下弹出对话框时隐藏select选择框，否则显示出来。是否为IE内核的浏览器
        if (isIE) {
            $("#SuperMap_BootstrapDialog_confirm").on("hide.bs.modal", function () {
                $("select").css("display", "");
            });
            $("#SuperMap_BootstrapDialog_confirm").on("show.bs.modal", function () {
                $("select").css("display", "none");
            });
        }
        onBeforeShow && onBeforeShow($("#SuperMap_BootstrapDialog_confirm"));
    }
    if (BootstrapDialog.confirmInited) {
        $("#SuperMap_BootstrapDialog_Title").html(titleName);
        $("#SuperMap_BootstrapDialog_Msg").html(msg);
        $(".modal-footer label").remove();
        if (addOnsMsg !== "") {
           var html = '<label><input id="addOnsChked" type="checkbox" checked=true>' + addOnsMsg + '</label>';
        }else {
           var html = '';
        }
        $("#SuperMap_BootstrapDialog_confirm .modal-footer").append(html);
    }
    $("#SuperMap_BootstrapDialog_OK").off("click").on("click", function () {
        onOKClick && onOKClick();
    });
    $("#SuperMap_BootstrapDialog_Cancel").off("click").on("click", function () {
        $("#SuperMap_BootstrapDialog_confirm").modal("hide");
        onCancelClick && onCancelClick();
    });
    $("#SuperMap_BootstrapDialog_confirm").modal("show");
}