define(
        [ 'views/uicomponents/controls/message-box', 'config/internet-map', 'proj4','html2canvas', "config/mapviewerConfig" ],
        function(MessageBox, internetMaps, proj4, html2canvas, MapviewerConfig) {
            var COSTOM_WIDTH = "770px",
                COSTOM_HEIGHT = "300px",
                ORIGIN_WIDTH = "850px",
                ORIGIN_HEIGHT = "400px";
            var SERVER_TYPE_MAP={
                "EPSG:4326": "WGS84",
                "EPSG:3857": "MERCATOR",
                "EPSG:900913": "MERCATOR",
                "EPSG:102113": "MERCATOR",
                "EPSG:910101": "GCJ02",
                "EPSG:910111": "GCJ02MERCATOR",
                "EPSG:910102": "BD",
                "EPSG:910112": "BDMERCATOR"
            };
            // 支持的大地坐标系
            var GEODETIC_COORDINATES = [ 4326, 910101, 910102 ];
            // 相等的投影坐标系（严格）
            var STRICT_SAME_PROJECTION_COORDINATES = [ 3857, 900913 ];
            // 相等的投影坐标系（不严格）
            var SAME_PROJECTION_COORDINATES = [ 910112, 910111 ].concat(STRICT_SAME_PROJECTION_COORDINATES);
            // 底图对应可以动态投影的坐标系，目前只列出了mapViewer支持的底图的坐标系
            var WELLKNOW_COORDINATES = GEODETIC_COORDINATES.concat(SAME_PROJECTION_COORDINATES);
            //动态投影支持列表（严格）
            var STRICT_DYNAMIC_PROJECTION_MAP = {
                910112 : WELLKNOW_COORDINATES,
                910111 : WELLKNOW_COORDINATES,
                3857 : [ 4326 ].concat(STRICT_SAME_PROJECTION_COORDINATES),
                900913 : [ 4326 ].concat(STRICT_SAME_PROJECTION_COORDINATES)
            };
            var UNPROJECTION_MAP = {
                910112 : SAME_PROJECTION_COORDINATES,
                910111 : SAME_PROJECTION_COORDINATES,
                3857 : SAME_PROJECTION_COORDINATES,
                900913 : SAME_PROJECTION_COORDINATES
            };
            var COLOE_PALETTE = [ "#f00", "#f90", "#ff0", "#fff" , "#0f0", "#0ff", "#00f", "#90f", "#f0f" , "#000",
                "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc" ,"#444",
                "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd" ,"#666",
                "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0" ,"#999",
                "#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79","#ccc",
                "#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47","#eee",
                "#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d","#f3f3f3", "#4c1130" ];
            var viewlang = MapViewer.Lang.Others.util;
            //WMTSLayer分辨率精度
            var RESOLUTION_PRECISION = 0.001;
            var NUM_PRECISION = 3;
            var _ = require('underscore'),
                urlRegExp = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'),
                _acEscape = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ],
                _reReplace = new RegExp('(\\' + _acEscape.join('|\\') + ')', 'g'),
                _authorizeSettingMap = {
                'READ' : 1,
                'READWRITE' : 2,
                'DELETE' : 3
            };
            var onlineUrl = 'https://www.supermapol.com/', itestUrl = 'https://itest.supermapol.com/';
            function xSSFilter(val) {
                if(val === null || val === undefined) {
                    return;
                }
                val = val.toString();
                val = val.replace(/</g, "&lt;");
                val = val.replace(/>/g, "&gt;");
                val = val.replace(/"/g, "&quot;");
                val = val.replace(/'/g, "&#39;");
                return val;
            }
            function _newGuid(attr) {
                var Len = attr || 32;
                var guid = "";
                for (var i = 1; i < Len; i++) {
                    var n = Math.floor(Math.random() * 16.0).toString(16);
                    guid += n;
                }
                return guid;
            }
            function _getSubLayers(url, credential, onSuccessed, onError,that) {
                function onCompleted(getLayersInfoEventArgs) {
                    var subLayers = [];

                    // 子图层信息列表
                    if (getLayersInfoEventArgs.result) {
                        if (getLayersInfoEventArgs.result.subLayers) {
                            subLayers = getLayersInfoEventArgs.result.subLayers.layers;
                        }
                    }
                    onSuccessed(subLayers);
                }

                function onFailed(event) {
                    onError && onError(event);
                }
                var options;
                if(!SuperMap.Util.isInTheSameDomain(url)){
                    options = { proxy : that.getRootUrl() + "apps/viewer/getUrlResource.json?url="};
                }
                var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(url,options);
                getLayersInfoService.events.on({
                    "processCompleted" : onCompleted,
                    "processFailed" : onFailed
                });
                getLayersInfoService.processAsync({ credential: credential});
            }
            var geoJsonFormat = new SuperMap.Format.GeoJSON();
            //缓存变量，用来提高访问速度
            var tempAnchor = {}, tempRootUrl = {};
            return {
                getParamsFromUrl : function(url) {
                    var idx = url.indexOf('?'), str = url.substr(idx + 1), arr = str.split(/&|=|#/ig), keyValueObj = {};
                    if (str === "")
                        return keyValueObj;

                    for (var i = 0, len = arr.length; i < len; i+=2) {
                        keyValueObj[arr[i]] = decodeURI(arr[i+1]);
                    }

                    return keyValueObj;
                },
                isHttps : function(url){
                    if (!url) {
                        url = window.location.href;
                    }
                    return url.indexOf("https://") !== -1;
                },
                getRootUrl : function(url) {
                    if (!url) {
                        url = window.location.href;
                    }
                    if(tempRootUrl[url]){
                        return tempRootUrl[url];
                    }
                    var rootUrl = "";
                    if(url.indexOf(onlineUrl) === 0){
                        rootUrl = onlineUrl;
                    }else if(url.indexOf(itestUrl) === 0){
                        rootUrl = itestUrl;
                    }else{
                        var regExp = /\/apps|\/web|\/manager|\/developer|\/services/i, // 该正则用于取出contextPath
                            index = url.search(regExp);
                        var anchor = this.getAnchor(url);
                        rootUrl += anchor.protocol + '//'+ this.getHost(url) + '/';
                        if (index > 0) { // 配置了上下文，iportal/iserver/iexpress/自定义，根据目前产品中可能的情况下截取上下文,正则匹配的情况可能不全
                            rootUrl += url.substring(rootUrl.length, index + 1);
                        }
                    }
                    tempRootUrl[url] = rootUrl;
                    return rootUrl;
                },
                getAnchor: function(url){
                    if(tempAnchor[url]){
                        return tempAnchor[url];
                    }
                    var anchor = document.createElement('a');
                    anchor.href = url;
                    tempAnchor[url] = anchor;
                    return anchor;
                },
                getHost : function(url) {
                    var anchor = this.getAnchor(url);
                    return anchor && anchor.host;
                },
                /**
                 * 让后台对请求的数据进行一次代理，防止跨域问题
                 * @param url
                 * @returns {string}
                 */
                getProxyUrl:function(url){
                    return this.getRootUrl() + "apps/viewer/getUrlResource.json?url=" + encodeURIComponent(url);
                },
                newGuid : function(attr) {
                    return _newGuid(attr);
                },
                getSubLayers : function(url, credential, onSuccessed, onError) {
                    _getSubLayers(url, credential, onSuccessed, onError,this);
                },
                getFeaturesBySQL : function(url, datasetNames, filter, processCompleted, processFailed) {
                    var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;

                    getFeatureParam = new SuperMap.REST.FilterParameter({
                        name : datasetNames.join().replace(":", "@"),
                        attributeFilter : filter || "SMID > 0"
                    });
                    getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                        queryParameter : getFeatureParam,
                        datasetNames : datasetNames,
                        fromIndex : 0,
                        toIndex : 100000,
                        returnContent : true
                    });
                    var options = {
                        eventListeners : {
                            processCompleted : function(getFeaturesEventArgs) {
                                processCompleted && processCompleted(getFeaturesEventArgs);
                            },
                            processFailed : function(e) {
                                processFailed && processFailed(e);
                            }
                        }
                    };
                    //iportal的代理只支持get请求，但是GetFeaturesBySQLService是post请求，搞不懂为什么
                    if(!SuperMap.Util.isInTheSameDomain (url)){
                        options.proxy = this.getRootUrl() + "apps/viewer/getUrlResource.json?url=";
                    }
                    getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, options);

                    getFeatureBySQLService.processAsync(getFeatureBySQLParams);
                },
                queryFeaturesBySQL: function(url, credential, layerName, attributeFilter,fields,epsgCode, processCompleted, processFailed, startRecord, recordLength, onlyAttribute){
                    var queryParam, queryBySQLParams, queryBySQLService;
                    queryParam = new SuperMap.REST.FilterParameter({
                        name:layerName,
                        attributeFilter:attributeFilter
                    });
                    if(fields){
                        //需要保留字段
                        queryParam.fields =  fields;
                    }
                    var params = {
                        queryParams:[queryParam]
                    };
                    if(onlyAttribute) {
                        params.queryOption = SuperMap.REST.QueryOption.ATTRIBUTE;
                    }
                    startRecord && (params.startRecord = startRecord);
                    recordLength && (params.expectCount = recordLength);
                    if(epsgCode){
                        params.prjCoordSys={
                            epsgCode:epsgCode
                        }
                    }
                    queryBySQLParams = new SuperMap.REST.QueryBySQLParameters(params);
                    var options = {
                        eventListeners:{'processCompleted':processCompleted,'processFailed':processFailed}
                    };
                    //iportal的代理只支持get请求，但是GetFeaturesBySQLService是post请求，搞不懂为什么
                    if(!SuperMap.Util.isInTheSameDomain(url)){
                        options.proxy = this.getRootUrl() + "apps/viewer/getUrlResource.json?url=";
                    }
                    queryBySQLService = new SuperMap.REST.QueryBySQLService(url,options);
                    queryBySQLService.processAsync(queryBySQLParams, credential);
                },
                /**
                 * 检查url地址是否符合规范
                 * @param url
                 * @returns {boolean}
                 */
                checkUrl:function(url){
                    if (!this.isURL(url)) {
                        this.showWarningMessage(MapViewer.Lang.View.Mapview.urlFormatError, 3000);
                        return false;
                    } else if (/^http[s]?:\/\/localhost/.test(url) || /^http[s]?:\/\/127.0.0.1/.test(url)) {
                        this.showWarningMessage(MapViewer.Lang.View.Mapview.dnsOrIPAddress, 3000);
                        return false;
                    }
                    return true;
                },
                isURL : function(val) {
                    val = encodeURI(val);
                    return urlRegExp.test(val);
                },
                /**
                 * 是否布尔类型
                 */
                isBoolean : function(obj) {
                    return Object.prototype.toString.call(obj).slice(8, -1) === "Boolean";
                },
                /*
                 * 是否Number类型
                 */
                isNumber : function(obj) {
                    return Object.prototype.toString.call(obj).slice(8, -1) === "Number";
                },
                /**
                 * 是否数组类型
                 */
                isArray : function(obj) {
                    return Object.prototype.toString.call(obj).slice(8, -1) === "Array";
                },
                toDouble : function(number) {
                    return number < 10 ? "0" + number : number;
                },
                /**
                 * 时间戳转换成时间字符串
                 *
                 * @param updateTime
                 *            时间戳
                 * @returns {string} 时间字符串，例：2016-9-20 11:0:0
                 */
                getDateTime : function(updateTime) {
                    var date = new Date(updateTime);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    return year + "-" + this.toDouble(month) + "-" + this.toDouble(day) + " " + this.toDouble(hours) + ":" + this.toDouble(minutes) + ":"
                        + this.toDouble(seconds);
                },
                /**
                 * 显示提示信息
                 *
                 * @param {Object}
                 *            消息框的参数，包含title（标题）、content（内容）、type（类型，分为：success,info,error 四种）
                 * @param {Number}
                 *            消息框显示的时间，时间到了自动关闭，默认为10分钟
                 *
                 */
                showMessage : function(options, showTime) {
                    var params = {};
                    params.title = options && options.title || '';
                    params.content = options && options.content || '';
                    params.type = options && options.type || 'success';
                    params.link = options && options.link || '';
                    //bootstrap接口变了，error变成了danger，在此统一一下
                    if(params.type === 'error'){
                        params.type = 'danger';
                    } else if(params.type === 'warning') {
                        //warning和info合并一种情况
                        params.type = 'info';
                    }
                    var messageBox = MessageBox.getInstance(params);
                    messageBox.show(showTime);
                },
                /**
                 * 更新弹窗内的内容
                 * @param options
                 */
                updateMessage:function (options) {
                    var params = {};
                    params.content = options && options.content || '';
                    var messageBox = MessageBox.getInstance(params);
                    messageBox.keepShow();
                },
                /**
                 * 显示成功信息
                 * @param content
                 * @param showTime
                 */
                showSuccessMessage:function(content,showTime){
                    var options = {
                            content:content || '',
                            type:'success'
                        };
                    this.showMessage(options,showTime);
                },
                /**
                 * 显示提示信息
                 * @param content
                 * @param showTime
                 */
                showInfoMessage:function(content,showTime){
                    var options = {
                        title:'',
                        content:content || '',
                        type:'info'
                    };
                    this.showMessage(options,showTime);
                },
                /**
                 * 显示警告信息
                 * @param content
                 * @param showTime
                 */
                showWarningMessage:function(content,showTime){
                    var options = {
                        content:content || '',
                        type:'warning'
                    };
                    this.showMessage(options,showTime);
                },
                /**
                 * 显示错误信息
                 * @param content
                 * @param showTime
                 */
                showErrorMessage:function(content,showTime){
                    var options = {
                        content:content || '',
                        type:'danger'
                    };
                    this.showMessage(options,showTime);
                },
                /**
                 * 关闭提示信息
                 *
                 */
                closeMessage : function() {
                    var messageBox = MessageBox.getInstance();
                    messageBox.close();
                },
                /**
                 * 检查标签是否符合规则。返回值规则如下： 0:字符串为空；1:无效标签；2:超出6个；{key: 3, tags: tags}:符合规则
                 */
                checkTagsRule : function(tags) {
                    if (tags.trim() === "") {
                        return 0;
                    }
                    var arrTag = tags.split(/,|，/ig);
                    var strTags = "";
                    var arrTags;
                    for (var i = 0, len = arrTag.length; i < len; i++) {
                        if (arrTag[i].trim() !== "" && strTags.indexOf(arrTag[i]) === -1) {
                            strTags += arrTag[i] + ",";
                        }
                    }
                    if (strTags.length === 0) {
                        return 1;
                    } else {
                        strTags = strTags.substring(0, strTags.length - 1);
                        arrTags = strTags.split(",");
                        if (arrTags.length > 6) {
                            return 2;
                        } else {
                            return {
                                tags : arrTags,
                                key : 3
                            };
                        }
                    }
                },
                /*
                 * 从数组中删除指定的元素并返回数组,如果数组的元素为object对象，需要传入比较的关键字
                 */
                removeElementFromArray : function(elem, arr, key) {
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
                findElementFromArray : function(elem, arr, key) {
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
                isLegalInputCover : function(sSearch) {
                    var filterRegExp  = /['\!@#\$%\^\&\*\(\)\.\=<>\?\{\}\[\]]/g;
                    return !filterRegExp.test(sSearch);
                },
                // 检测输入值是否合法，有效
                isLegalInput : function(sSearch) {
                    //替换HTML标记
                    sSearch = xSSFilter(sSearch);
                    //替换正则需要转义的部分 \n => \\n
                    var asSearch = sSearch.replace(_reReplace, '\\$1').split(' '),
                    sRegExpString = '^(?=.*?' + asSearch.join(')(?=.*?') + ').*$',
                    filterRegExp = new RegExp(sRegExpString);
                    return filterRegExp.test(sSearch);
                },
                checkAuthorizeSetting : function(authorizeSetting) {
                    var result = -1;
                    if (_.isArray(authorizeSetting)) {
                        _.each(authorizeSetting, function(item) {
                            var permitNum = _authorizeSettingMap[item.permissionType];
                            if (permitNum > result) {
                                result = permitNum;
                            }
                        });
                    }
                    if (result > 1) {
                        return true;
                    }
                    return false;
                },
                /**
                 * 防止XSS攻击
                 *
                 * @param {String}
                 *            val 输入值
                 * @returns {String}
                 */
                XSSFilter : function(val) {
                    return xSSFilter(val);
                },

                /**
                 * 获取坐标类型，主要有经纬度类型及投影类型
                 *
                 * @param epsgCode
                 * @returns {*}
                 */
                getCoordinateType : function(epsgCode) {
                    if (GEODETIC_COORDINATES.indexOf(epsgCode) !== -1) {
                        return MapViewer.Lang.View.Modal.latitude;
                    } else if (SAME_PROJECTION_COORDINATES.indexOf(epsgCode) !== -1) {
                        return MapViewer.Lang.View.Modal.projection;
                    } else {
                        return MapViewer.Lang.View.Modal.unKnow;
                    }
                },
                /**
                 * 检查坐标系
                 * @param mapEpsgCode 底图坐标系
                 * @param epsgCode 叠加图层坐标系
                 * @param strict 是否为严格模式，严格模式只支持4326及3857坐标系的互相转换
                 * @returns {number} 返回检查标识，0表示完全匹配，1表示可动态投影，2表示不可动态投影但可叠加并有偏移，3表示不支持此坐标系，4表示无坐标
                 */
                checkCoordinate : function(mapEpsgCode, epsgCode, strict) {
                    // 检查是否可以进行动态投影
                    if (epsgCode) {
                        var isEpsgCodeMatch = this.isCoordinateMatch(mapEpsgCode, epsgCode, true);
                        if (isEpsgCodeMatch) {
                            // 坐标匹配，直接叠加
                            return 0;
                        } else if(strict) {
                            if((epsgCode === 4326 && mapEpsgCode === 3857) || (mapEpsgCode === 4326 && epsgCode === 3857)){
                                // 可以进行动态投影,询问用户是否进行动态投影叠加
                                return 1;
                            } else {
                                // 不支持此坐标系
                                return 3;
                            }
                        }else{
                            // 不匹配则检查是否可以进行动态投影
                            if (this.isDynamicProjection(mapEpsgCode, epsgCode, true)) {
                                // 可以进行动态投影,询问用户是否进行动态投影叠加
                                return 1;
                            } else if (this.isDynamicProjection(mapEpsgCode, epsgCode, false)) {
                                // 不能进行动态投影,叠加有偏移
                                return 2;
                            } else {
                                // 不支持此坐标系
                                return 3;
                            }
                        }
                    } else {
                        // 给出无坐标系信息的提示
                        return 4;
                    }
                    return -1;
                },
                /**
                 * 根据图层的动态投影信息来检查坐标系
                 * @param dynamicPrjCoordSyses 图层的动态投影信息，一般从iServer发布的地图服务中获取
                 * @param mapEpsgCode 底图坐标系
                 * @param epsgCode 叠加图层坐标系
                 * @returns {number} 返回检查标识，0表示完全匹配，1表示可动态投影，2表示不可动态投影但可叠加并有偏移，3表示不支持此坐标系，4表示无坐标
                 */
                checkCoordinateByDynamicInfo: function(dynamicPrjCoordSyses, mapEpsgCode, epsgCode){
                    if(mapEpsgCode === epsgCode){
                        return 0;
                    }
                    if(dynamicPrjCoordSyses && dynamicPrjCoordSyses.length > 0) {
                        var dynamicPrjCoordSys = dynamicPrjCoordSyses[0];
                        if(dynamicPrjCoordSys && dynamicPrjCoordSys.type === "PCS_ALL") {
                            var result = this.checkCoordinate(mapEpsgCode, epsgCode, true);
                            if(result > 2){
                                result = this.checkCoordinate(mapEpsgCode, epsgCode, false);
                            }
                            return result;
                        } else if (dynamicPrjCoordSys && +dynamicPrjCoordSys.epsgCode === mapEpsgCode) {
                            return 1;
                        } else {
                            for(var i= 1,len = dynamicPrjCoordSyses.length;i<len;i++){
                                dynamicPrjCoordSys = dynamicPrjCoordSyses[i];
                                if(dynamicPrjCoordSys && +dynamicPrjCoordSys.epsgCode === mapEpsgCode){
                                    return 1;
                                }
                            }
                            return this.checkCoordinate(mapEpsgCode, epsgCode, false);
                        }
                    } else if (epsgCode !== null || epsgCode !== undefined) {
                        return 3;
                    }else{
                        return 4;
                    }
                },

                isDynamicProjection : function(sourceEpsgCode, destinationEpsgCode, strict) {
                    var dynamicProjMap = strict ? STRICT_DYNAMIC_PROJECTION_MAP[sourceEpsgCode] : UNPROJECTION_MAP[sourceEpsgCode];
                    if (dynamicProjMap && this.isArray(dynamicProjMap)) {
                        if (dynamicProjMap.indexOf(destinationEpsgCode) !== -1) {
                            return true;
                        }
                    }
                    return false;
                },

                isCoordinateMatch : function(sourceEpsgCode, destinationEpsgCode, strict) {
                    // 相同的大地坐标系
                    var geoCoordinates = strict ? [ 4326 ] : GEODETIC_COORDINATES;
                    // 相同的投影坐标系
                    var projCoordnates = strict ? STRICT_SAME_PROJECTION_COORDINATES : SAME_PROJECTION_COORDINATES;
                    // 如果坐标系号相等，则直接返回true
                    if (sourceEpsgCode === destinationEpsgCode) {
                        return true;
                    }
                    // 否则判读是否属于相同的坐标系，不同的坐标系号
                    var isInGeoCoor = geoCoordinates.indexOf(sourceEpsgCode) !== -1;
                    isInGeoCoor = isInGeoCoor && geoCoordinates.indexOf(destinationEpsgCode) !== -1;
                    var isInProjCoor = projCoordnates.indexOf(sourceEpsgCode) !== -1;
                    isInProjCoor = isInProjCoor && projCoordnates.indexOf(destinationEpsgCode) !== -1;
                    return isInGeoCoor || isInProjCoor;
                },

                /**
                 * 叠加图层投影信息判断
                 */

                judgeProjection : function(originEpsgCode, currEpsgCodes, isBaseLayer, strict) {
                    if (this.isBoolean(isBaseLayer) && isBaseLayer) {
                        if (this.isArray(currEpsgCodes) && this.isProjectionMatched(originEpsgCode, currEpsgCodes, strict) === false) {
                            return viewlang.CURRENTEPSGCODE + originEpsgCode + viewlang.CHANGEDEPSGCODE + currEpsgCodes.join("，") + viewlang.NOOVERLAY;
                        } else if (!this.isArray(currEpsgCodes) && this.isProjectionMatched(originEpsgCode, currEpsgCodes, strict) === false) {
                            return viewlang.CURRENTEPSGCODE + originEpsgCode + viewlang.CHANGEDEPSGCODESINGLE + currEpsgCodes + viewlang.NOOVERLAY;
                        } else {
                            return null;
                        }
                    } else {
                        if (this.isArray(currEpsgCodes) && this.isProjectionMatched(originEpsgCode, currEpsgCodes, strict) === false) {
                            return viewlang.CURRENTEPSGCODE + originEpsgCode + viewlang.OVERLAYEPSGCODE + currEpsgCodes.join("，") + viewlang.NOOVERLAY;
                        } else if (!this.isArray(currEpsgCodes) && this.isProjectionMatched(originEpsgCode, currEpsgCodes, strict) === false) {
                            return viewlang.CURRENTEPSGCODE + originEpsgCode + viewlang.OVERLAYEPSGCODESINGLE + currEpsgCodes + viewlang.NOOVERLAY;
                        } else {
                            return null;
                        }
                    }
                },
                /**
                 * 判断投影是否兼容。
                 */
                isProjectionMatched : function(originEpsgCode, checkedEpsgCodes, strict) {
                    var originEpsgCodes = this.getMatchedEpsgCodes(originEpsgCode, strict);
                    var toBeChecked = [];
                    if (this.isArray(checkedEpsgCodes)) {
                        toBeChecked = checkedEpsgCodes;
                    } else {
                        toBeChecked.push(checkedEpsgCodes);
                    }
                    for (var i = 0; i < originEpsgCodes.length; i++) {
                        if ($.inArray(originEpsgCodes[i], toBeChecked) !== -1) {
                            return true;
                        }
                    }
                    return false;
                },
                /**
                 * 查询匹配的epsgcode，即图层可以相互叠加的epsgcode。
                 *
                 * @param originCode
                 * @param strict
                 * @returns {Array}
                 */
                getMatchedEpsgCodes : function(originCode, strict) {
                    var mappedCodes = [];
                    /**
                     * 之后如果还有兼容的epsgcode，可以将它们作为一个数组，放到mappedCodes里。
                     */
                    mappedCodes.push(strict ? STRICT_SAME_PROJECTION_COORDINATES : SAME_PROJECTION_COORDINATES);
                    var matched = [];
                    for (var i = 0; i < mappedCodes.length; i++) {
                        if (mappedCodes[i].indexOf(originCode) !== -1) {
                            matched = mappedCodes[i];
                            break;
                        }
                    }
                    if (matched.length === 0) {
                        matched.push(originCode);
                    }
                    return matched;
                },
                /*
                 * wms130服务中xy坐标轴需要反转的范围，参考wiki：http://wiki.com/pages/viewpage.action?pageId=42926105
                 */
                isInverseCoordinateAxis : function(epsgCode) {
                    epsgCode = parseInt(epsgCode, 10);
                    if (isNaN(epsgCode)) {
                        throw new Error("isNaN");
                    }
                    if (!this.isNumber(epsgCode)) {
                        throw new Error("typeError");
                    }
                    var lonlatCRSRanges = [ [ 4001, 4999 ], [ 2738, 2758 ], [ 2044, 2045 ], [ 2081, 2083 ], [ 2085, 2086 ], [ 2093, 2093 ], [ 2096, 2098 ],
                            [ 2105, 2132 ], [ 2169, 2170 ], [ 2176, 2180 ], [ 2193, 2193 ], [ 2200, 2200 ], [ 2206, 2212 ], [ 2319, 2319 ], [ 2320, 2358 ],
                            [ 2360, 2462 ], [ 2523, 2549 ], [ 2551, 2735 ], [ 2935, 2941 ], [ 2953, 2953 ], [ 3006, 3030 ], [ 3034, 3035 ], [ 3058, 3059 ],
                            [ 3068, 3068 ], [ 3114, 3118 ], [ 3126, 3138 ], [ 3300, 3301 ], [ 3328, 3335 ], [ 3346, 3346 ], [ 3350, 3352 ], [ 3366, 3366 ],
                            [ 3416, 3416 ], [ 20004, 20032 ], [ 20064, 20092 ], [ 21413, 21423 ], [ 21473, 21483 ], [ 21896, 21899 ], [ 22171, 22177 ],
                            [ 22181, 22187 ], [ 22191, 22197 ], [ 25884, 25884 ], [ 27205, 27232 ], [ 27391, 27398 ], [ 27492, 27492 ], [ 28402, 28432 ],
                            [ 28462, 28492 ], [ 30161, 30179 ], [ 30800, 30800 ], [ 31251, 31259 ], [ 31275, 31279 ], [ 31281, 31290 ], [ 31466, 31700 ] ];

                    var i, len = lonlatCRSRanges.length, isInversed = false;

                    for (i = 0; i < len; i++) {
                        if (epsgCode >= lonlatCRSRanges[i][0] && epsgCode <= lonlatCRSRanges[i][1]) {
                            isInversed = true;
                            break;
                        }
                    }

                    return isInversed;
                },
                /**
                 * 检查要相互叠加的wmts图层的分辨率是否相同
                 *
                 * @param baseLayer 基础图层
                 * @param overlayLayer 叠加图层
                 * @returns {Boolean} 返回是否可以叠加
                 */

                isSameResolutionsWMTSLayer : function(baseLayer, overlayLayer) {
                    var isSame = true;

                    if (overlayLayer.CLASS_NAME === "SuperMap.Layer.WMTS") {
                        var baseResolutions = baseLayer.resolutions,overlayResolutions = overlayLayer.resolutions;
                        var baseLen = baseResolutions.length,overlayLen = overlayResolutions.length;
                        var minLen = Math.min(baseLen,overlayLen);
                        for(var i = 0;i<minLen;i++) {
                            var baseResolution = baseResolutions[i], overlayResolution = overlayResolutions[i];
                            if(!this.isSameResolution(overlayResolution,baseResolution,i)){
                                return false;
                            }
                        }
                    }
                    return isSame;
                },

                /**
                 * 检查叠加图层投影某一级别的分辨率是否在基础图层投影的误差范围
                 *
                 * @param resolution 叠加图层分辨率
                 * @param baseResolution 基础图层分辨率
                 */
                isSameResolution: function(resolution, baseResolution,i) {
                    var numPrecision = NUM_PRECISION + i;
                    var baseDeno = Math.pow(2, i);
                    numPrecision = numPrecision > 20 ? 20 : numPrecision;
                    if((Number(resolution.toFixed(numPrecision)) - RESOLUTION_PRECISION / baseDeno) <= baseResolution &&
                        (Number(resolution.toFixed(numPrecision)) + RESOLUTION_PRECISION / baseDeno) >= baseResolution) {
                        return true;
                    }
                    return false;
                },
                // ajax请求
                sendRequest : function(url, type, dataType, data, onSuccessed, onFailed) {
                    return this.sendRequestSync(url, type, true, dataType, data, onSuccessed, onFailed);
                },
                sendRequestSync : function(url, type, async, dataType, data, onSuccessed, onFailed) {
                    if(!SuperMap.Util.isInTheSameDomain(url)){
                        //先保证所有的url都没有编码过，防止编码两次
                        url = decodeURIComponent(url);
                        url = this.getRootUrl() + "apps/viewer/getUrlResource.json?url=" + encodeURIComponent(url);
                    }
                    return $.ajax({
                        url : url,
                        type : type,
                        async : async,
                        dataType : dataType,
                        data : data,
                        success : function(data, textStatus, xhr) {
                            onSuccessed && onSuccessed(data, textStatus, xhr);
                        },
                        error : function(xhr, textStatus, errorThrown) {
                            try {
                                var msg = JSON.parse(xhr.responseText);
                                onFailed && onFailed(msg);
                            } catch (e) {
                                onFailed && onFailed(xhr, textStatus, errorThrown);
                            }
                        }
                    });
                },
                getInternetMap: function (internetMapName) {
                    var internetMap = internetMaps[internetMapName];
                    // 补丁。 缩略图使用绝对地址，防止共享时地址不正确
                    internetMap.thumbnail = this.getRootUrl() + internetMap.thumbnail;
                    return internetMap;
                },
                getColorPalette : function(){
                    return COLOE_PALETTE;
                },

                /**
                 * 改变目标面板size大小
                 *
                 * @param $obj
                 * @param isCostomSize
                 */
                changePaneSize: function($obj, isCostomSize) {
                    var animateObj;
                    if(isCostomSize) {
                        animateObj = {
                            width: COSTOM_WIDTH,
                            height: COSTOM_HEIGHT
                        };
                    } else {
                        animateObj = {
                            width: ORIGIN_WIDTH,
                            height: ORIGIN_HEIGHT
                        };
                    }
                    $obj.css(animateObj);
                },
                /**
                 * 获取模拟的事件
                 * @param evt
                 */
                getSimulateEvent:function(evt,offsetX,offsetY,changeType){
                    var type = evt.type;
                    var event;
                    var clientX,clientY,x,y;
                    if(type === 'touchend'){
                        var touches = evt.changedTouches;
                        if(touches && touches.length > 0){
                            clientX = touches[0].pageX + offsetX;
                            clientY = touches[0].pageY + offsetY;
                            x = evt.xy.x + offsetX;
                            y = evt.xy.y + offsetY;
                            touches[0].pageX = clientX;
                            touches[0].pageY = clientY;
                            touches[0].clientX = clientX;
                            touches[0].clientY = clientY;
                        }
                        if(window.TouchEvent){
                            return new TouchEvent(changeType || type,evt);
                        }
                    }else{
                        clientX = evt.pageX + offsetX;
                        clientY = evt.pageY + offsetY;
                        x=evt.x + offsetX;
                        y = evt.y + offsetY;
                        if(window.MouseEvent){
                            try{
                                event = new window.MouseEvent(changeType || type,{
                                    bubbles:false,
                                    cancelable:true,
                                    view:window,
                                    screenX: evt.screenX,
                                    screenY: evt.screenY,
                                    clientX: clientX,
                                    clientY: clientY,
                                    x: x,
                                    y: y
                                });
                                return event
                            }catch(error){
                                event = document.createEvent('MouseEvents');
                                event.initMouseEvent(changeType || type,false,true,window,0,evt.screenX,evt.screenY,clientX,clientY,evt.ctrlKey,evt.altKey,evt.shiftKey,evt.metaKey,evt.button,evt.relatedTarget);
                                event.x = x;
                                event.y = y;
                                return event;
                            }
                        }else{
                            event = document.createEvent('MouseEvents');
                            event.initMouseEvent(changeType || type,false,true,window,0,evt.screenX,evt.screenY,clientX,clientY,evt.ctrlKey,evt.altKey,evt.shiftKey,evt.metaKey,evt.button,evt.relatedTarget);
                            event.x = x;
                            event.y = y;
                            return event;
                        }
                    }
                },
                /**
                 * 增加toolti提示
                 * @param $el
                 * @param placement
                 * @param title
                 * @param bsInsertCallback
                 * @param bsShowCallback
                 * @param bsHideCallBack
                 */
                tooltip : function($el, placement, title, bsInsertCallback, bsShowCallback, bsHideCallBack) {
                    $el.bTooltip({
                        delay : {
                            "show" : 100,
                            "hide" : 250
                        },
                        placement : placement,
                        title : title
                    }).on('shown.bs.tooltip', function() {
                        bsInsertCallback && bsInsertCallback.call(this, $el);
                    }).on('show.bs.tooltip', function() {
                        bsShowCallback && bsShowCallback.call(this, $el);
                    }).on('hide.bs.tooltip', function() {
                        bsHideCallBack && bsHideCallBack.call(this, $el);
                    });
                },
                /**
                 * 添加web图层的
                 * @param mapModel
                 * @param layerModels
                 * @param ThemeLayerStrategy
                 * @param TiledDynamicRESTLayerStrategy
                 */
                addWebLayerToMapModel:function(mapModel,layerModels,ThemeLayerStrategy,TiledDynamicRESTLayerStrategy){
                    var count = layerModels.length;
                    var newLayerModels = [];
                    var mapEpsgCode = mapModel.get('epsgCode');
                    for (var j = 0,len =count; j < len; j++) {
                        var selectModel = layerModels[j];
                        if (selectModel.get("type") === "UNKNOW") {
                            // 为了让addLayer添加的model都添加上
                            selectModel.on('getsublayersucceed', function(selectModel) {
                                // 叠加图层需要先获取子图层
                                return function() {
                                    var credential = selectModel.get('credential');
                                    var layerJson = selectModel.toJSON();
                                    var needTransform = selectModel.needTransform;
                                    var strategy;
                                    var isRestMap = false;
                                    //单子图层就创建专题图层，否则就创建动态瓦片图层
                                    if(layerJson.subLayers && layerJson.subLayers.length === 1){
                                        strategy = new ThemeLayerStrategy();
                                        //如果用户确认添加带偏移的数据，则专题图层默认做坐标的转换，因为矢量数据可以调用iportal的接口进行坐标的转换
                                        if(selectModel.isFromConfirm){
                                            needTransform = true;
                                            delete selectModel.isFromConfirm;
                                        }
                                    }else{
                                        isRestMap = true;
                                        strategy = new TiledDynamicRESTLayerStrategy();
                                    }
                                    layerJson.credential = credential;
                                    selectModel = strategy.getLayerModel(layerJson);
                                    selectModel.needTransform = needTransform;
                                    if(needTransform){
                                        var prjCoordSys = selectModel.get('prjCoordSys');
                                        if(prjCoordSys){
                                            selectModel.originEpsgCode = prjCoordSys.epsgCode;
                                            if(isRestMap){
                                                prjCoordSys.epsgCode = mapEpsgCode;
                                            }
                                        }else{
                                            selectModel.originEpsgCode = mapEpsgCode;
                                            if(isRestMap) {
                                                selectModel.set('prjCoordSys',{
                                                    epsgCode:mapEpsgCode
                                                });
                                            }
                                        }
                                    }
                                    selectModel.on('layeraddedtomap',function(){
                                        newLayerModels.push(selectModel);
                                        if(count === newLayerModels.length){
                                            mapModel.trigger("layerstoextent", newLayerModels);
                                        }
                                    });
                                    mapModel.addLayerModel(selectModel);
                                };
                            }(selectModel));
                            selectModel.getSubLayers();
                        } else{
                            if(selectModel.needTransform){
                                var prjCoordSys = selectModel.get('prjCoordSys');
                                if(prjCoordSys){
                                    selectModel.originEpsgCode = prjCoordSys.epsgCode;
                                }else{
                                    selectModel.originEpsgCode = mapEpsgCode;
                                }
                            }
                            selectModel.on('layeraddedtomap',function(){
                                newLayerModels.push(selectModel);
                                if(count === newLayerModels.length){
                                    mapModel.trigger("layerstoextent", newLayerModels);
                                }
                            });
                            mapModel.addLayerModel(selectModel);
                        }
                    }
                },
                /**
                 * 从url中解析出token
                 * @param url
                 * @returns {{url: *, credential: *}}
                 */
                parseCredential:function(url){
                    if(!url){
                        return;
                    }
                    var urls = url.split('?'),credential;
                    url = urls[0];
                    if(urls[1]){
                        var params = urls[1].split('&');
                        for(var i = 0, len = params.length; i < len; i++){
                            var param = params[i].split('=');
                            if(param[0] === 'key' || param[0] === 'token'){
                                credential = new SuperMap.Credential(param[1],param[0]);
                                credential = credential;
                                break;
                            }
                        }
                    }
                    return {
                        url: url,
                        credential:credential
                    };
                },
                /**
                 * 将token保存到url中去
                 * @param credential
                 * @param url
                 * @returns {*}
                 */
                credentialToUrl:function(credential,url){
                    if(credential && url){
                        return url + '?' + credential.getUrlParameters();
                    }
                    return url;
                },
                /**
                 * 转换坐标，用监听事件获得转换后的坐标
                 * @param fromEpsg
                 * @param toEpsg
                 * @param point 点对象或者是点数组
                 * @constructor
                 */
                EPSGTransform: function (fromEpsg, toEpsg, point, success) {
                    var newCoord;
                    var from = SERVER_TYPE_MAP[fromEpsg], to = SERVER_TYPE_MAP[toEpsg];
                    if(fromEpsg === toEpsg || !from || !to){
                        if(_.isArray(point)){
                            newCoord = [];
                            for(var i= 0,len=point.length;i<len;i++){
                                var coor = {x:point[i].x,y:point[i].y};
                                newCoord.push(coor);
                            }
                        }else{
                            newCoord = {x:point.x,y:point.y};
                        }
                        if (_.isFunction(success)) {
                            success.call(success, newCoord);
                        }
                    }else{
                        var mercator = SERVER_TYPE_MAP['EPSG:3857'], wgs84 = SERVER_TYPE_MAP['EPSG:4326'];
                        if((from === mercator || from === wgs84) && (to === mercator || to === wgs84)){
                            this.projTransform(fromEpsg, toEpsg, point,success);
                        }else{
                            var convertType = from + '_' + to;
                            this.postTransform(convertType,point,success);
                        }
                    }
                },
                /**
                 * 通过前端proj4进行投影转换
                 */
                projTransform: function (fromEpsg, toEpsg, point,success) {
                    var newCoor;
                    if(_.isArray(point)){
                        newCoor = [];
                        for(var i= 0,len=point.length;i<len;i++){
                            var coor = proj4(fromEpsg, toEpsg, [point[i].x,point[i].y]);
                            newCoor.push({x:coor[0],y:coor[1]});
                        }
                    }else{
                        newCoor = proj4(fromEpsg, toEpsg, [point.x,point.y]);
                        newCoor = {x:newCoor[0],y:newCoor[1]};
                    }
                    if (_.isFunction(success)) {
                        success.call(success, newCoor);
                    }
                },
                postTransform: function (convertType, point,success) {
                    var me = this,epsgArray = [];
                    if(!convertType){
                        return success.call(me,null);
                    }
                    if(_.isArray(point)){
                        for(var i = 0,len=point.length;i<len;i++){
                            epsgArray.push({x:point[i].x,y:point[i].y});
                        }
                    }else{
                        epsgArray = [{x:point.x,y:point.y}];
                    }
                    if(epsgArray.length === 0) {
                        return success.call(me,null);
                    }
                    var postData = {
                        "convertType": convertType,
                        "points":epsgArray
                    };
                    var url = this.getRootUrl()+"apps/viewer/coordconvert.json";
                    postData = JSON.stringify(postData);
                    this.sendRequest(encodeURI(url), "POST","json", postData,  function (success) {
                        return function (newCoor) {
                            if (_.isFunction(success)) {
                                if(!_.isArray(point)){
                                    newCoor = newCoor[0];
                                }
                                success.call(me, newCoor);
                            }
                        }
                    }(success));
                },
                /**
                 * 获取pop弹窗地理位置
                 * （根据feature类型：点 线（最后一个点） 面（中线点））
                 * @param featureModel
                 */
                getPopShowLocation: function(featureModel,mousePosition,map){
                    var geometry, offset = {},lonLat= {}, me = this,strokeWidth;
                    offset.x = 0;
                    offset.y = 0;
                    if(featureModel && featureModel.getThemeType){
                        var type = featureModel.getThemeType();
                        if(type === "point"){
                            var pointRadius;
                            geometry = map.getLonLatFromPixel(new SuperMap.Pixel(mousePosition.x,mousePosition.y));
                            if(this.isLonLat) {
                                //说明传入进来的mousePosition已经是一个坐标
                                geometry = mousePosition;
                            } else {
                                geometry = featureModel.get('geometry');
                                geometry.lon = geometry.x;
                                geometry.lat = geometry.y;
                            }
                            //点符号 增加y方向上的偏移
                            pointRadius = featureModel.layerModel.layer.style.pointRadius || 0;
                            strokeWidth = featureModel.layerModel.layer.style.strokeWidth || 10;
                            offset.y =  pointRadius/2 + strokeWidth;
                        }
                        else if(type === "line"){
                            strokeWidth = featureModel.layerModel.layer.style.strokeWidth;
                            offset.y =  strokeWidth/2 -3;
                            geometry = map.getLonLatFromPixel(new SuperMap.Pixel(mousePosition.x,mousePosition.y));
                            if(this.isLonLat) {
                                //说明传入进来的mousePosition已经是一个坐标
                                geometry = mousePosition;
                            }
                        }
                        else if(type === "region"){
                            geometry = map.getLonLatFromPixel(new SuperMap.Pixel(mousePosition.x,mousePosition.y));
                            if(this.isLonLat) {
                                //说明传入进来的mousePosition已经是一个坐标
                                geometry = mousePosition;
                            }
                        }
                        lonLat.lon = geometry ? geometry.lon : mousePosition.x;
                        lonLat.lat = geometry ? geometry.lat : mousePosition.y;
                    }
                    else {
                        var marker = featureModel.get('geometry');
                        lonLat = marker.lonlat;
                        offset.y = marker.icon && marker.icon.size && marker.icon.size.h;
                    }
                    return {
                        lonLat: lonLat,
                        offset: offset
                    };
                },
                /**
                 * 对要素图层的所有要素进行坐标转换
                 * @param oldEpsgCode
                 * @param newEpsgCode
                 * @param layerModel
                 * @param FeatureCollection
                 * @param success
                 * @param isUnNeedAddToModel 是否需要将坐标转换后的要素添加到layerModel，true不需要添加并且不会改变原来feature上的坐标，false或者默认，会改变feature上的经纬度变成转换后
                 * @returns {boolean}
                 */
                changeFeatureLayerEpsgCode: function(oldEpsgCode,newEpsgCode,layerModel,FeatureCollection,success,isUnNeedAddToModel){
                    var features = layerModel.get('features'),bounds = layerModel.get('bounds');
                    var points = [];
                    var hasBounds =false;
                    if(bounds && !isUnNeedAddToModel){
                        var leftBottom = bounds.leftBottom || {x:bounds.left,y:bounds.bottom},
                            rightTop = bounds.rightTop || {x:bounds.right,y:bounds.top};
                        if(bounds){
                            points.push(leftBottom);
                            points.push(rightTop);
                            hasBounds = true;
                        }
                    }
                    if(features instanceof FeatureCollection){
                        if(isUnNeedAddToModel) {
                            var featureCollection = new FeatureCollection();
                            features.each(function(feature){
                                //防止转换坐标，将原来feature上的坐标变成转换后的
                                var featureClone = feature.clone();
                                var geometry = feature.get('geometry').clone();
                                featureClone.set('geometry',geometry);
                                featureCollection.add(featureClone);
                                var vertices = geometry.getVertices();
                                points = points.concat(vertices);
                            });

                        } else {
                            features.each(function(feature){
                                var geometry = feature.get('geometry');
                                var vertices = geometry.getVertices();
                                points = points.concat(vertices);
                            });
                        }
                        this.EPSGTransform('EPSG:' + oldEpsgCode, 'EPSG:'+newEpsgCode, points, function(newEpsgCode, hasBounds){
                            return function(newCoors){
                                var start = 0,len = newCoors.length;
                                if(hasBounds){
                                    start = 2;
                                    leftBottom = newCoors[0],rightTop = newCoors[1];
                                    bounds = new SuperMap.Bounds(leftBottom.x, leftBottom.y, rightTop.x, rightTop.y);
                                    layerModel.set('transform_bounds',bounds);
                                }
                                for(var i= start;i<len;i++){
                                    var point = points[i],coor = newCoors[i];
                                    point.x = coor.x;
                                    point.y = coor.y;
                                    point.calculateBounds();
                                }
                                features = features.clone();
                                if(isUnNeedAddToModel) {
                                    success && success.call(layerModel,featureCollection);
                                } else {
                                    layerModel.removeAllFeatures();
                                    if(layerModel.mapModel.changeMapCenterSuccess){
                                        addFeaturesToModel(features,layerModel,newEpsgCode);
                                    }else{
                                        layerModel.mapModel.on('mapcenterchangebybaselayer',function(){
                                            addFeaturesToModel(features,layerModel,newEpsgCode);
                                        });
                                    }
                                }
                            }
                        }(newEpsgCode, hasBounds));
                    }
                    function addFeaturesToModel(features,layerModel,newEpsgCode){
                        var prjCoordSys = layerModel.get('prjCoordSys');
                        if(prjCoordSys){
                            prjCoordSys.epsgCode = newEpsgCode;
                        }else{
                            layerModel.set('prjCoordSys',{
                                epsgCode:newEpsgCode
                            });
                        }
                        features.each(function(feature,index){
                            var geometry = feature.get('geometry');
                            if(geometry.components){
                                calculateComponents(geometry.components);
                            }
                            geometry.calculateBounds();
                            layerModel.addFeature(feature,(index !== (features.length -1)));
                        });
                        success && success.call(layerModel);
                    }
                    function calculateComponents(components){
                        if(components){
                            if(components.components){
                                calculateComponents(components.components);
                            }else{
                                for(var i= 0,len=components.length;i<len;i++){
                                    var component = components[i];
                                    if(component.components){
                                        calculateComponents(component.components);
                                    }
                                    component.calculateBounds();
                                }
                            }
                        }
                    }
                    return true;
                },
                /**
                 * 浏览器是否缓存请求
                 */
                cacheRequest:function (isCache) {
                    $.ajaxSetup({cache:isCache});
                },
                /**
                 * 隐藏图层属性
                 * @param fields  feature上的所有属性字段
                 * @param datas   feature上的所有属性字段对应的属性值
                 * @param hideProps    需要隐藏的字段
                 */
                hideProperty: function (fields,datas, hideProps) {
                    for(var i = 0,len = hideProps.length;i<len;i++){
                        var hideProp = hideProps[i];
                        var idx = _.findIndex(fields,function (val){
                            var field = val.title || val;
                            return field === hideProp;
                        });
                       if(idx !== -1){
                           var field = fields[idx];
                           fields.splice(idx,1);
                           if(datas instanceof Array) {
                               try{
                                   //属性表传过来的是feature数组的属性值
                                   _.each(datas,function (data) {
                                       data.splice(idx,1);
                                   })
                               }catch(e){
                               }
                           } else {
                               try{
                                   delete datas[field];
                               }catch(e){
                               }
                           }
                       }
                    }
                },
                /**
                 * 将marker以及要素图层创建的元素的属性转为标准格式，可利用key来判断属性字段的顺序
                 */
                fromatFeaAttr: function (feature){
                    if (feature.attributes){
                        var attr = feature.attributes;
                        attr.lastStyle && delete attr.lastStyle;
                        attr.updated && delete attr.updated;
                        var markerHashOld = {
                            title: true,
                            description: true
                        };
                        if (attr.properties && attr.properties._smiportal_title !== undefined) {
                            return feature;
                        }
                        //兼容8C SP1版本以前的标注点
                        var len = 0;
                        for(var key in attr){
                            len ++;
                            if (markerHashOld[key]) {
                                var newKey = "_smiportal_" + key;
                                var str = (attr[key] !== null && attr[key] !== undefined) ? attr[key] : attr.properties[key];
                                if(feature.attributes.properties === undefined){
                                    feature.attributes.properties = {};
                                    feature.attributes.key = [];
                                }
                                feature.attributes.properties[newKey] = str;
                                feature.attributes.key.push(newKey);
                                delete feature.attributes[key];
                                if(len === 2){
                                    return feature;
                                }
                            }
                        }
                    }
                    return feature;
                },
                /**
                 * 根据图层模型获取底图类型
                 * @param layerModel
                 * @returns {*}
                 */
                getBaseLayerType:function(layerModel){
                    var type;
                    if(layerModel.get('type') === 'SUPERMAP_REST'){
                        type = layerModel.get('title').toUpperCase();
                    }else{
                        type = layerModel.get('type');
                        if(type === 'CLOUD'){
                            if(layerModel.get('identifier') === 'blue-black'){
                                type = type + '_BLACK';
                            }
                        }else if(type === 'GOOGLE'){
                            if(layerModel.get('identifier') === 'china'){
                                type = type + '_CN';
                            }
                        }
                    }
                    return type;
                },
                assembleProperty: function (titleArray,value) {
                    var dataArray = [],title; //存储属性
                    for(var i=0; i<value.length; i++) {
                        var rowData = value[i];
                        var obj = {};
                        if(rowData.length === 0 || (rowData.length === 1 && rowData[0] === "")) continue;
                        for(var j=0; j<rowData.length; j++) {
                            title = titleArray[j];
                            title = title && title.replace(/\ufeff/gi,'');
                            obj[title] = rowData[j];
                        }
                        dataArray.push(obj);
                    }
                    return dataArray;
                },
                assembleFeature: function (dataPrpertyArray,lonLatField,success,context) {
                    var features=[];
                    var lonFiled = lonLatField.lon,
                        latFiled = lonLatField.lat;
                    for (var k=0; k<dataPrpertyArray.length; k++){
                        var dataProperty = dataPrpertyArray[k];
                        var points=[], lonlatObject={},
                            feature = {
                                type: "Feature"
                            },geometry = {
                                type: "point"
                            };
                        lonlatObject.x = dataProperty[lonFiled];
                        lonlatObject.y = dataProperty[latFiled];
                        if(!lonlatObject.x || !lonlatObject.y || lonlatObject.x === "" || lonlatObject.y === "") continue;
                        points.push(lonlatObject);
                        geometry.points = points;
                        feature.geometry = geometry;
                        feature.attributes = dataProperty;
                        features.push(feature);
                    }
                    this.removeLonLatFiled(features,dataProperty,lonFiled,latFiled);
                    if (_.isFunction(success)) {
                           success.call(context, features);
                    }
                },
                /**
                 * 专题图图层，文件上传的，将经纬度字段过滤
                 * @param features
                 * @param newTitleArray
                 * @param lonFiled
                 * @param latFiled
                 */
                removeLonLatFiled: function (features,newTitleArray,lonFiled,latFiled) {
                    if(!lonFiled || !latFiled) {
                        return newTitleArray;
                    }
                    for(var j =0; j<features.length; j++) {
                        var attributes = features[j].attributes;
                        for(var title in attributes) {
                            if(title === lonFiled || title === latFiled) {
                                delete attributes[title];
                            }
                        }
                    }
                    var temporaryArray = [];
                    for(var i=0; i<newTitleArray.length; i++) {
                        if(newTitleArray[i] === lonFiled || newTitleArray[i] === latFiled) {
                        } else {
                            temporaryArray.push(newTitleArray[i]);
                        }
                    }
                    return temporaryArray;
                },
                /**
                 * 获取用户的默认的key
                 * @param success
                 */
                getPrivateKey:function(success) {
                    var me = this;
                    var keyUrl = this.getRootUrl() + "web/mycontent/keys/default.json";
                    if (this.privateKey) {
                        success && success(this.privateKey);
                    } else {
                        this.sendRequest(keyUrl, "GET", "json", null, function (data) {
                            var key = data.customResult ? data.customResult : '';
                            me.privateKey = key;
                            success && success(key);
                        }, function (errorRes) {
                            me.showWarningMessage(errorRes.error.errorMsg);
                        });
                    }
                },
                /**
                 * 同步设置我的数据的权限
                 * @param dataInfo
                 * @param authorizeSettings
                 * @param success
                 * @param failed
                 * @param scope
                 */
                synMyDatasAuthorizeSetting:function(dataInfo, authorizeSettings, success, failed, scope){
                    var dataIds;
                    if(_.isArray(dataInfo)){
                        dataIds = dataInfo;
                    }else{
                        var layerModels = dataInfo.get('layers');
                        dataIds = this.getUploadDataIdsFromLayers(layerModels);
                    }
                    var settings = {"ids":dataIds,"entities":[]};
                    if(authorizeSettings && authorizeSettings.length > 0){
                        for(var i = 0,len = authorizeSettings.length;i<len;i++){
                            var entity = {},authorizeSetting = authorizeSettings[i];
                            for(var attr in authorizeSetting){
                                if(attr === 'permissionType'){
                                    entity.dataPermissionType = 'DOWNLOAD';
                                }else{
                                    entity[attr] = authorizeSetting[attr];
                                }
                            }
                            settings.entities.push(entity);
                        }
                    }
                    //{"entityType":"USER","entityName":"GUEST","dataPermissionType":"DOWNLOAD"}
                    var url = this.getRootUrl() + "web/mycontent/datas/sharesetting.json";
                    this.sendRequest(url, "PUT", "json", JSON.stringify(settings), function(data) {
                        success && success.call(scope || window,data);
                    },function(err){
                        failed && failed.call(scope || window,err);
                    });
                },
                /**
                 * 通过图层来获取url及对应的数据的id
                 * @param layerModels
                 * @returns {{urls: Array, dataIds: Array}}
                 */
                getUploadDataIdsFromLayers:function(layerModels){
                    var urls = [], dataIds = [];
                    var dataIdRegrex = /datas\/(\d+)\/content\.json/;
                    layerModels.each(function(layerModel){
                        if(layerModel.isThemeLayer() || layerModel.isGraphicLayer() || layerModel.isFeatureLayer()){
                            var isAddFile = layerModel.get('isAddFile'), url = layerModel.get('url');
                            if(isAddFile && url){
                                var result = url.match(dataIdRegrex);
                                urls.push(urls);
                                dataIds.push(parseInt(result[1]));
                            }
                        }
                    });
                    return dataIds;
                },
                /**
                 * 还原logo的URL地址
                 * @param url
                 * @returns {*}
                 */
                replaceUrlPlaceHolder: function (url){
                    if(url.indexOf("{portalRoot}") != -1){
                        url = url.replace("{portalRoot}", this.getRootUrl().replace("manager/", ""));
                    }
                    url = url.replace(/(^http:)|(^https:)/,'');
                    return url;
                },
                //清空文件域，参数为Dom 对象
                cleanFileSelect: function (obj, fuc) {
                    obj.val('');  //仅对ie11 及以上较新浏览器有作用
                    var isIE = document.all ? true : false;
                    if(isIE) {
                        var objectClone = obj.clone();
                        obj.after(objectClone);
                        obj.remove();
                        objectClone.on("change", function() {
                            if (_.isFunction(fuc)) {
                                fuc.call();
                            }
                        });
                    }
                },
                /**
                 * 数组排序
                 * @param arr 数组
                 * @param isInvert  是否倒序排序,true为倒序  false和默认为正序
                 * @returns {*}  排序后数组
                 */
                sortArray: function (arr,isInvert) {
                    if(isInvert) {
                        return arr.sort(this.invertedSort);
                    } else {
                        return arr.sort(this.positiveSort);
                    }
                },
                //正序
                positiveSort: function (a,b) {
                    return a-b;
                },
                //倒序
                invertedSort: function (a,b) {
                    return b-a;
                },
                /**
                 * 将指定的div截取成一张图片
                 * @param ele    $(dom)
                 * @param callback 回调函数
                 * @param context 调用回调函数的作用域(this),默认是window;
                 */
                screenCut: function (ele,cavansSize,callback, context) {
                    if (ele instanceof $) {
                        html2canvas(ele, {
                            allowTaint:true,
                            taintTest:false,
                            width: cavansSize.width || ele.outerWidth(),
                            height: cavansSize.height || ele.outerHeight(),
                            onrendered: function (canvas) {
                              /*  var src = canvas.toDataURL();
                                var img = new Image();
                                img.src = src;
                                img.onload = function() {

                                }*/
                                _.isFunction(callback) && callback.call(context || window, canvas);

                            }
                        })
                    }
                    else {
                        _.isFunction(callback) && callback.call(context || window, null);
                    }
                },
                uploadFileToMyData:function (metaData, fileElementId, success, failed, context) {
                    var host = this.getRootUrl();
                    metaData = JSON.stringify(metaData);
                    var uploadIdUrl  = host + "web/mycontent/datas.json";
                    var me = this;
                    return this.sendRequest(uploadIdUrl, "POST", "json", metaData, function(data) {
                        var dataId = data.childID;
                        if(dataId) {
                            var url = host + "web/mycontent/datas/" + dataId + "/upload.json";
                            return $.ajaxFileUpload({
                                url: url,
                                dataType: "json",
                                method: "POST",
                                secureuri: false,
                                fileElementId: fileElementId,
                                success: function () {
                                    success && success.call(context, host + "web/datas/"+ dataId + "/content.json?&currentPage=1&pageSize=9999999");
                                    me.uploadFileToDirName(dataId);
                                },
                                error: function (e) {
                                    failed && failed.call(context ,e);
                                }
                            });
                        }else{
                            failed && failed.call(context);
                        }
                    }, function(e) {
                        failed && failed.call(context ,e);
                    });
                },
                /**
                 * 上传文件到指定文件夹
                 * @param id
                 * @param success
                 * @param faild
                 */
                uploadFileToDirName: function (id,success,faild) {
                    var dirName = window.mapViewerConfig.directoryName ? window.mapViewerConfig.directoryName : MapviewerConfig.directoryName;
                    var dirUrl = this.getRootUrl() + 'web/directories/resources.json';
                    var datas = {
                        basicDirInfo:{
                            id:null,
                            dirName:dirName,
                            dirType:'DATA',
                            dirLevel:1,
                            parentDirId:null,
                            isPersonal:true
                        },
                        dirResource:{
                            resourceId:id
                        }
                    };
                    datas = JSON.stringify(datas);
                    this.sendRequest(dirUrl, "POST", "json", datas, success, faild);
                },
                uploadJsonToMyData: function(metaData, json, success, failed, context){
                    var me = this;
                    var host = this.getRootUrl();
                    metaData = JSON.stringify(metaData);
                    var uploadIdUrl  = host + "web/mycontent/datas.json";
                    return this.sendRequest(uploadIdUrl, "POST", "json", metaData, function(data) {
                        var dataId = data.childID;
                        if(dataId) {
                            json = JSON.stringify(json);
                            var url = host + "web/mycontent/datas/" + dataId + "/upload.json";
                            return me.sendRequest(url, "POST", "json", json, function() {
                                success && success.call(context, host + "web/datas/"+ dataId + "/content.json?&currentPage=1&pageSize=9999999");
                                me.uploadFileToDirName(dataId);
                            }, function(e){
                                failed && failed.call(context,e);
                            });
                        }else{
                            failed && failed.call(context);
                        }
                    }, function(e) {
                        failed && failed.call(context ,e);
                    });
                },
                updateToMyData: function(url, fileName, updateData, success, failed, context){
                    var host = this.getRootUrl();
                    url = url.split('web/datas/')[1];
                    var result = url.match(/-?[1-9]\d*/gi);
                    var dataId = parseInt(result[0]);
                    var updataUrl = host + 'web/mycontent/datas/' + dataId + '/update.json?fileName=' + fileName + '&dataType=JSON';
                    updateData = JSON.stringify(updateData);
                    return this.sendRequest(updataUrl, "POST", "json", updateData, function() {
                        success && success.call(context, host + "web/datas/"+ dataId + "/content.json?&currentPage=1&pageSize=9999999");
                    }, function(e) {
                        failed && failed.call(context, e);
                    })
                },
                toGeoJSON: function(features){
                    return geoJsonFormat.write(features);
                },
                toFeatures: function(geojson){
                    return geoJsonFormat.read(geojson);
                }
            };
        });
