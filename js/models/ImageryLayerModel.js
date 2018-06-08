define(['backbone','../Util','Cesium','../Config'],function(Backbone,Util,Cesium, Config){
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
            document.getElementById('japan_pointCloud_tag').style.display = 'none';
            var scpName = this.get('originName');
            var cameraParam = Config.CAMERA_PARAM[scpName];
            if(cameraParam){
                this.viewer.scene.camera.flyTo({
                    destination : new Cesium.Cartesian3(cameraParam.Cartesian3.x,cameraParam.Cartesian3.y,cameraParam.Cartesian3.z),
                    orientation : {
                        heading : cameraParam.heading,
                        pitch : cameraParam.pitch,
                        roll : cameraParam.roll
                    }
                });
                return ;
            }else{
                var layer = this.layer;
                if(layer){
                    var bounds = layer.layerBounds;
                    if(!bounds){
                        var extend = 0.1;
                        var left = Cesium.Math.toRadians(layer.lon - extend);
                        var right = Cesium.Math.toRadians(layer.lon + extend);
                        var top = Cesium.Math.toRadians(layer.lat + extend);
                        var bottom = Cesium.Math.toRadians(layer.lat - extend);
                        bounds = new Cesium.Rectangle(left,bottom,right,top);
                        layer.layerBounds = bounds;
                    }
                    var camera = this.viewer.scene.camera;
                    var bd = Cesium.BoundingSphere.fromRectangle3D(bounds);
                    camera.flyToBoundingSphere(bd);
                }
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