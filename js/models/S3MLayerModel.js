define(['backbone','Cesium','../Util','../Config'],function(Backbone,Cesium,Util,Config){
    var S3MLayerModel = Backbone.Model.extend({
        addLayer : function(sceneModel,isFlyMode){
        	var viewer = sceneModel.viewer;
            if(!this.viewer){
                this.viewer = viewer;
                this.sceneModel = sceneModel;
            }
            var me = this;
            var scpUrl = this.get('url');
            var name = this.get('realName') || this.get('name');
            var defer = Cesium.when.defer();
            if(Util.S3M_CACHE[scpUrl]){
            	Util.showErrorMsg(Resource.layerExistMsg);
                return defer.reject();
            }
            if(this.get('originName') == '点云'){
                document.getElementById('japan_pointCloud_tag').style.display = 'block';
            }else{
                document.getElementById('japan_pointCloud_tag').style.display = 'none';
            }
            var promise = viewer.scene.addS3MTilesLayerByScp(scpUrl,{
                name : name
            });
		return Cesium.when(promise,function(layer){
            if(!Cesium.FeatureDetection.isPCBroswer()){
				layer._supportCompressType = 0;
            }
			me.sceneModel.trigger('layerAdded',me);
			me.sceneModel.layers.add(me);
			me.layer = layer;
			if(isFlyMode){
				me.flyTo();
			}
			Util.S3M_CACHE[scpUrl] = name;
			if(me.get('isVisible') == false){
				layer.visible = false;
			}
			return defer.resolve(layer);
		})
        },
        removeLayer : function(viewer){
        	var name = this.get('name');
        	var scpUrl = this.get('url');
        	if(Util.S3M_CACHE[scpUrl]){
        		Util.S3M_CACHE[scpUrl] = undefined;
        		delete Util.S3M_CACHE[scpUrl];
            }
        	viewer.scene.layers.remove(name);
        	this.sceneModel.layers.remove(this);
        },
        flyTo : function(){
        	var scpName = this.get('originName');
            if(scpName === '点云'){
                document.getElementById('japan_pointCloud_tag').style.display = 'block';
            }else{
                document.getElementById('japan_pointCloud_tag').style.display = 'none';
            }
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
        setVisible : function(isVisible,ids){
            if(ids.length>0)
			{
				this.layer.setOnlyObjsVisible(ids,isVisible);
			}
			else{
                this.layer.visible = isVisible;
				this.set('isVisible',isVisible);
			}
        },
        getJsonObj : function(){
        	var obj = {
            		displayName: this.get("name"),
            		isVisible: this.layer.getObjsVisible(-1),
            		classType: "OSGB",
            		sourceURI: this.get("url")
            	};
        	
        	return obj;
        }
    });
    return S3MLayerModel;
});