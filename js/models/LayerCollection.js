define(['backbone', 'jquery', 'Config', 'Cesium', './LayerModel'], function (Backbone, $, Config, Cesium, LayerModel) {
    var TexSupportType = {
        NOT: 0,
        DXT: 1,
        PVR: 2,
        ETC: 3
    };
    var _ = require('underscore');

    function merge(from, to) {
        var res = {};
        for (var key in from) {
            res[key] = from[key];
        }
        for (var key in to) {
            res[key] = to[key];
        }
        return res;
    }

    var LayerCollection = Backbone.Collection.extend({
            model: LayerModel,
            publicModels: [],
            privateModels: [],
            initialize: function () {
            },
            filterByTexture: function (texCompressType) {
                var mergeRes = {};
                if (texCompressType == TexSupportType.DXT || texCompressType == TexSupportType.NOT) {
                    mergeRes = merge(Config.ignore3DServices, Config.NOT);
                }
                else if (texCompressType == TexSupportType.PVR) {
                    mergeRes = merge(Config.ignore3DServices, Config.ETC);
                }
                else if (texCompressType == TexSupportType.ETC) {
                    mergeRes = merge(Config.ignore3DServices, Config.PVR);
                }
                var isPC = Cesium.FeatureDetection.isPCBroswer();
                if (!isPC) {
                    mergeRes = merge(mergeRes, Config.mobileIgnoreServices);
                }
                else {
                    mergeRes = merge(mergeRes, Config.pcIgnoreServices);
                }
                this.mergeRes = mergeRes;
            },
            filterByType: function (result, mergeRes) {
                var len = result.content.length;
                var arr = [];
                var i;
                for (i = 0; i < len; i++) {
                    var item = result.content[i];
                    arr.push(item);
                }
                var promises = [];
                for (i = 0, j = arr.length; i < j; i++) {
                    var item = arr[i];
                    if (mergeRes[item.resTitle + '/rest'] || /^.*?android$/.test(item.resTitle) || /^.*?ios$/.test(item.resTitle)) {
                        continue;
                    }
                    var url, promise;
                    if (item.type == 'MAP') {
                        url = item.proxiedUrl + '/maps.json';
                    }
                    else if (item.type == "REALSPACE") {
                        if (location.protocol === "http:" && item.proxiedUrl.indexOf("https") > -1) {
                            item.proxiedUrl = item.proxiedUrl.replace("https", "http");
                        }
                        url = item.proxiedUrl + '/realspace/datas.json';
                    }
                    promise = Cesium.loadJson(url);
                    promises.push(promise);
                }
                return promises;
            },
            setModel: function (parameter, isPublic) {
                var models = [];
                var model;
                for (var i = 0; i < parameter.colcParam.length; i++) {
                    var obj = parameter.colcParam[i];
                    if (location.protocol === "http:" && obj.path.indexOf("https:") > -1) {
                        obj.path = obj.path.replace("https", "http");
                    } else if (location.protocol === "https:" && obj.path.indexOf("http:") > -1) {
                        obj.path = obj.path.replace("http", "https");
                    }
                    var name = parameter.sceneName;
                    var subName = obj.name;
                    var typeUrl = obj.path + '.xml';
                    var type;
                    $.ajax({
                        url: typeUrl,
                        dataType: 'xml',
                        type: 'GET',
                        async: false,
                        timeout: 3000,
                        error: function (xml) {
                            type = 'OSGB';
                        },
                        success: function (xml) {
                            $(xml).find("dataType").each(function (j) {
                                var id = $(this).children("id");
                                type = id.context.innerHTML;
                                if (type == 'OSGB') {
                                    type = 'S3M';
                                    obj.path += '/config';
                                }
                                else if (type == 'IMG') {
                                    type = 'IMAGERY';
                                }
                                else if (type == 'DEM') {
                                    type = 'TERRAIN';
                                }
                                if (i === 0) {
                                    model = new LayerModel({
                                        type: 'MULTIS3M',
                                        url: obj.path,
                                        name: name,
                                        thumbnail: parameter.thumbnail,
                                        title: name,
                                        path: obj.path
                                    });
                                    model.strategy.children = [];
                                }
                                model.strategy.children.push(new LayerModel({
                                    type: type,
                                    url: obj.path,
                                    name: name + '_' + subName,
                                    thumbnail: parameter.thumbnail,
                                    originName: name,
                                    title: name,
                                    path: obj.path
                                }))
                            });
                        }
                    });
                }
                model && models.push(model);
                if (isPublic == true) {
                    this.publicModels = [].concat(this.publicModels).concat(models);
                }
                else {
                    this.privateModels = [].concat(this.privateModels).concat(models);
                }
            },
            fetch: function (url, parent, isPublic) {
                var me = this;
                var defered = Cesium.when.defer();
                parent.addLoading();
                Cesium.when(Cesium.loadJson(url)).then(function (result) {
                    /*if(isPublic == true){
                     parent.totalPublicPage = result.totalPage;
                     }
                     else{
                     parent.totalPrivatePage = result.totalPage;
                     }*/
                    // var totalPromise = me.filterByType(result,me.mergeRes);
                    /*Cesium.when.map(totalPromise,function(colc){
                     me.setModel(colc,isPublic);
                     defered.resolve(true);
                     if(isPublic == true){
                     me.reset(me.publicModels);
                     }
                     else{
                     me.reset(me.privateModels);
                     me.privateModels = [];
                     }
                     });*/
                    /*me.setModel(result.content, isPublic);
                     defered.resolve(true);
                     if (isPublic == true) {
                     me.reset(me.publicModels);
                     }
                     else {
                     me.reset(me.privateModels);
                     me.privateModels = [];
                     }*/
                    var index = 0;
                    var totalPromise = me.filterByType(result, me.mergeRes);
                    Cesium.when.all(totalPromise, function (colc) {
                        for (var index = 0; index < colc.length; index++) {
                            me.setModel(Object.assign({}, result.content[index], {colcParam: colc[index]}), isPublic);
                            // me.setModel(colc, isPublic);
                            defered.resolve(true);
                            if (isPublic == true) {
                                me.reset(me.publicModels);
                            }
                            else {
                                me.reset(me.privateModels);
                                me.privateModels = [];
                            }
                        }
                    });
                }).otherwise(function (err) {
                    me.publicModels = [];
                    me.reset([]);
                    me.reject(err);
                });
            },
            parse: function (layersJson) {
                var layers = [], layerModel, layerCollection = this, parsed;
                _.each(layersJson, function (json, index) {
                    layerModel = new LayerModel(json);
                    layers.push(layerModel);
                });
                if (layers.length) {
                    this.set(layers);
                }
                return this;
            }
        })
    ;
    return LayerCollection;
})
;