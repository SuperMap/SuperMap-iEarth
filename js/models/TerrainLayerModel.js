define(['backbone','../Util','Cesium'],function(Backbone,Util,Cesium){
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
            	Util.showErrorMsg('改图层已经存在，请勿重复加载！');
                return defer.reject();
            }
            var terrainProvider = new Cesium.CesiumTerrainProvider({
                url : url,
                requestWaterMask : true,
                requestVertexNormals : true,
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
        	var layer = this.layer;
            if(layer){
            	var bound = layer._bounds;
                if(bound){
                	this.viewer.scene.camera.flyTo({
                		destination : Cesium.Rectangle.fromDegrees(bound.west, bound.south, bound.east, bound.north)
                	});
                }
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
            return ;
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