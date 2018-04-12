define(['backbone','../Util','Cesium'],function(Backbone,Util,Cesium){
    var ImageryLayerModel = Backbone.Model.extend({
        addLayer : function(sceneModel,isFlyMode){
        	var viewer = sceneModel.viewer;
        	if(!this.viewer){
                this.viewer = viewer;
                this.sceneModel = sceneModel;
            }
            var me = this;
            var type = this.get('type');
            var imageryUrl = this.get('url');
            var name = this.get('name');
            var defer = Cesium.when.defer();
            if(Util.IMAGERY_CACHE[imageryUrl]){
            	Util.showErrorMsg(Resource.layerExistMsg);
                return defer.reject();
            }
            var imageryLayers = viewer.imageryLayers;
            var imageryLayer = new Cesium.SuperMapImageryProvider({
                url : imageryUrl,
                name : name
            });
            
            return Cesium.when(imageryLayer.readyPromise,function(){
                var layer =  imageryLayers.addImageryProvider(imageryLayer);
                me.sceneModel.trigger('layerAdded',me);
                me.sceneModel.layers.add(me);
                me.layer = layer;
                if(isFlyMode){
                	me.flyTo();
                }
                Util.IMAGERY_CACHE[imageryUrl] = name;
                if(me.get('isVisible') == false){
                	layer.show = false;
                }
                return defer.resolve(layer);
            },function(error){
            	var msg;
            	if(error && error.message){
            		msg = error.message
            	}
            	else{
            		msg = Resource.imgUrlErrorMsg;
            	}
            	
                Util.showErrorMsg(msg);
                return defer.reject();
            });
        },
        removeLayer : function(viewer){
        	var imageryUrl = this.get('url');
        	if(Util.IMAGERY_CACHE[imageryUrl]){
        		Util.IMAGERY_CACHE[imageryUrl] = undefined;
        		delete Util.IMAGERY_CACHE[imageryUrl];
            }
        	viewer.scene.imageryLayers.remove(this.layer);
        	this.sceneModel.layers.remove(this);
        },
        flyTo : function(){
            var layer = this.layer;
            if(layer){
            	this.viewer.flyTo(layer);
            }
        },
        setVisible : function(isVisible){
            var layer = this.layer;
            if(layer){
                layer.show = isVisible;
            }
            this.set('isVisible',isVisible);
        },
        getJsonObj : function(){
        	var obj = {
            		displayName: this.get("name"),
            		isVisible: this.layer.show,
            		classType: "IMAGERY",
            		sourceURI: this.get("imageryUrl")
            	};
        	
        	return obj;
        }
    });
    return ImageryLayerModel;
});