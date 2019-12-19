define(['backbone','../Util','Cesium','../Config'],function(Backbone,Util,Cesium, Config){
    var TerrainLayerModel = Backbone.Model.extend({
        addLayer : function(sceneModel,isFlyMode){
        	var viewer = sceneModel.viewer;
        	if(!this.viewer){
                this.viewer = viewer;
                this.sceneModel = sceneModel;
            }
            var me = this;
            var type = this.get('type');
            var url = this.get('url');
            var name = this.get('name');
            var defer = Cesium.when.defer();
            if(Util.TERRAIN_CACHE[url]){
            	Util.showErrorMsg('该图层已经存在，请勿重复加载！');
                return defer.reject();
            }
            var terrainProvider = new Cesium.CesiumTerrainProvider({
                url : url,
                requestWaterMask : false,
                requestVertexNormals : false,
                isSct : true
            });
            
            return Cesium.when(terrainProvider.readyPromise,function(){
            	me.sceneModel.trigger('layerAdded',me);
                me.sceneModel.layers.add(me);
                viewer.terrainProvider = terrainProvider;
                me.layer = terrainProvider;
                Util.TERRAIN_CACHE[url] = name;
                if(isFlyMode){
                	me.flyTo();
                }
                return defer.resolve(terrainProvider);
            },function(error){
                Util.showErrorMsg('SCT URL 错误，地形加载失败！');
                return defer.reject();
            });
        },
        flyTo : function(){
            if($("#scene-logo").length > 0){
                $("#scene-logo").remove();
            }
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
                var west = Cesium.Math.toRadians(layer._bounds.west);
                var south = Cesium.Math.toRadians(layer._bounds.south);
                var east = Cesium.Math.toRadians(layer._bounds.east);
                var north = Cesium.Math.toRadians(layer._bounds.north);
                var rectangle = new Cesium.Rectangle(west, south, east, north);
                var camera = this.viewer.scene.camera;
                camera.flyTo({
                    destination: rectangle
                });
            }
        },
        removeLayer : function(viewer){
        	var url = this.get('url');
            var name = this.get('name');
        	if(Util.TERRAIN_CACHE[url]){
        		Util.TERRAIN_CACHE[url] = undefined;
        		delete Util.TERRAIN_CACHE[url];
            }
        },
        setVisible : function(isVisible){
            return;
        },
        getJsonObj : function(){
        	var obj = {
            		displayName: this.get("name"),
            		isVisible: true,
            		classType: "TERRAIN",
            		sourceURI: this.get("url")
            	};
        	
        	return obj;
        }
    });
    return TerrainLayerModel;
});