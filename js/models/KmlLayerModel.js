define(['backbone'],function(Backbone){
    var KmlLayerModel = Backbone.Model.extend({
    	defaults : {
            type : 'KML'
        },
        addLayer : function(sceneModel,isFlyMode){
        	var viewer = sceneModel.viewer;
        	if(!this.viewer){
                this.viewer = viewer;
                this.sceneModel = sceneModel;
            }
            var me = this;
            var file = this.get('file');
            if(!file){
            	this.sceneModel.trigger('layerAdded',this);
            	this.sceneModel.layers.add(this);
            	return true;
            }
            return viewer.dataSources.add(Cesium.KmlDataSource.importFile(file,{
            	camera : viewer.scene.camera,
                canvas : viewer.scene.canvas
            })).then(function(dataSource){
                me.set('name', me.get('file').name.substring(0, me.get('file').name.lastIndexOf('.kml')));
                me.sceneModel.trigger('layerAdded',me);
                me.sceneModel.layers.add(me);
                if(isFlyMode){
                	viewer.flyTo(dataSource);
                }
                me.layer = dataSource;
            });
        },
        addLayerByUrl : function(viewer,url){
        	var me = this;
        	if(!url){
        		return undefined;
        	}
        	return viewer.dataSources.add(Cesium.KmlDataSource.load(url,{
        		 camera : viewer.scene.camera,
                 canvas : viewer.scene.canvas
        	})).then(function(dataSource){
        		me.set('name','default KML');
        		me.layer = dataSource;
        		return dataSource.entities.values;
        	});
        },
        addMarker : function(markerModel,sceneModel,marker){
        	markerModel.addMarker(sceneModel,marker);
        },
        removeLayer : function(viewer){
        	viewer.dataSources.remove(this.layer,true);
        },
        flyTo : function(){
            if(this.layer && this.viewer){
                this.viewer.flyTo(this.layer);
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
        	return null;
        	var obj = {
            		displayName: this.get("name"),
            		isVisible: this.layer.show,
            		classType: "KML",
            		sourceURI: this.get("url")
            	};
        	
        	return null;
        },
        writeToKml : function(){
        	
        }

    });
    return KmlLayerModel;
});