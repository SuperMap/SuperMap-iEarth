define(['backbone','jquery','Config','Cesium','./LayerModel'],function(Backbone,$,Config,Cesium,LayerModel){
	var TexSupportType = {
		NOT : 0,
		DXT : 1,
		PVR : 2,
		ETC : 3
	};
	var _ = require('underscore');
	function merge(from,to){
		var res = {};
		for(var key in from){
			res[key] = from[key];
		}
		for(var key in to){
			res[key] = to[key];
		}
		return res;
	}
    var LayerCollection = Backbone.Collection.extend({
        model : LayerModel,
        publicModels : [],
        privateModels : [],
        initialize : function(){
        },
        parseResponse : function(resp){
        	
        },
        filterByTexture : function(texCompressType){
        	var mergeRes = {};
        	if(texCompressType == TexSupportType.DXT || texCompressType == TexSupportType.NOT){
        		mergeRes = merge(Config.ignore3DServices,Config.NOT);
        	}
        	else if(texCompressType == TexSupportType.PVR){
        		mergeRes = merge(Config.ignore3DServices,Config.ETC);
        	}
        	else if(texCompressType == TexSupportType.ETC){
        		mergeRes = merge(Config.ignore3DServices,Config.PVR);
        	}
        	var isPC = Cesium.FeatureDetection.isPCBroswer();
        	if(!isPC){
        		mergeRes = merge(mergeRes,Config.mobileIgnoreServices);
        	}
        	else{
        		mergeRes = merge(mergeRes,Config.pcIgnoreServices);
        	}
        	this.mergeRes = mergeRes;
        },
        filterByType : function(result,mergeRes){
        	var len = result.content.length;
    		var arr = [];
    		var i;
    		for(i = 0;i < len;i++){
    			var item = result.content[i];
    			arr.push(item);
    		}
    		var promises = [];
    		for(i = 0,j = arr.length;i < j;i++){
    			var item = arr[i];
    			if(mergeRes[item.resTitle + '/rest'] || /[_android,_ios]$/.test(item.resTitle)){
    				continue;
    			}
    			var url,promise;
    			if(item.type == 'MAP'){
    				url = item.proxiedUrl + '/maps.json';
    			}
    			else if(item.type == "REALSPACE"){
    				url = item.proxiedUrl + '/realspace/datas.json';
    			}
    			promise = Cesium.loadJson(url);
    			promises.push(promise);
    		}
    		return promises;
        },
        setModel : function(colc,isPublic){
            var models = [];
            var model;
            for(var i = 0;i < colc.length;i++){
                var obj = colc[i];
                var resourceType = obj.resourceConfigID;
                var name = Config.NameKeyMap[obj.name] ? Config.NameKeyMap[obj.name] : obj.name;
                var title = Config.TitleKeyMap[obj.name] ? Config.TitleKeyMap[obj.name] : obj.name;
                if(resourceType == 'map3DData'){
                    if(0 == i){
                        model = new LayerModel({
                            type : 'MULTIS3M',
                            name :  name,
                            thumbnail : obj.path + '/data/path/' + obj.name + '.png',
                            title : title,
                            realName : obj.name,
                            path : obj.path,
                            serviceType : '3D Service'
                        });
                        model.strategy.children = [];
                    }
                    model.strategy.children.push(new LayerModel({
                        url : obj.path + '/config',
                        name :  name,
                        thumbnail : obj.path + '/data/path/' + obj.name + '.png',
                        title : name,
                        realName : obj.name,
                        path : obj.path,
                        type : 'S3M',
                        serviceType : '3D Service'
                    }));
                }
                else if(resourceType == 'map'){
                    if(0 == i){
                        model = new LayerModel({
                            type : 'MULTIIMAGERY',
                            name :  name,
                            thumbnail : 'http://www.supermapol.com/web/../web/static/portal/img/map/cloud.png',
                            title : obj.name,
                            realName : obj.name,
                            path : obj.path,
                            serviceType : 'Map Service'
                        });
                        model.strategy.children = [];
                    }
                    model.strategy.children.push(new LayerModel({
                        url : obj.path,
                        name :  name,
                        thumbnail : 'http://www.supermapol.com/web/../web/static/portal/img/map/cloud.png',
                        title : name,
                        realName : obj.name,
                        path : obj.path,
                        type : 'IMAGERY',
                        serviceType : 'Map Service'
                    }));
                }

            }
            model && models.push(model);
            if(isPublic == true){
                this.publicModels = [].concat(this.publicModels).concat(models);
                this.publicModels.sort(function(a,b){
                    var aName = a.get('realName');
                    var bName = b.get('realName');
                    var da = a.get('type') == 'MULTIS3M' ? 1000 : 10000;
                    var db = b.get('type') == 'MULTIS3M' ? 1000 : 10000;
                    var aValue = Config.SORT_RULE[aName] || da;
                    var bValue = Config.SORT_RULE[bName] || db;
                    return aValue - bValue;
                });
            }
            else{
                this.privateModels = [].concat(this.privateModels).concat(models);
            }
        },
        fetch : function(url,parent,isPublic){
        	var me = this;
        	var defered = Cesium.when.defer();
        	parent.addLoading();
            Cesium.when(Cesium.loadJson(url)).then(function(result){
            	if(isPublic == true){
            		parent.totalPublicPage = result.totalPage;
            	}
            	else{
            		parent.totalPrivatePage = result.totalPage;
            	}
                var totalPromise = me.filterByType(result,me.mergeRes);
                Cesium.when.map(totalPromise,function(colc){
                    me.setModel(colc,isPublic);
                    defered.resolve(true);
                    if(isPublic == true){
                        me.reset(me.publicModels);
                    }
                    else{
                        me.reset(me.privateModels);
                        me.privateModels = [];
                    }
                });
            }).otherwise(function(err){
                me.publicModels = [];
                me.reset([]);
                me.reject(err);
            });
        },
        parse : function(layersJson){
        	var layers = [], layerModel, layerCollection = this, parsed;
            _.each(layersJson, function(json, index) {
                layerModel = new LayerModel(json);
                layers.push(layerModel);
            });
            if (layers.length) {
                this.set(layers);
            }
            return this;
        }
    });
    return LayerCollection;
});