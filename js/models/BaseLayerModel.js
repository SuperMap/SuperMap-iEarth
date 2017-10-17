define(['backbone','Cesium','../Util'],function(Backbone,Cesium,Util){
    var BaseLayerModel = Backbone.Model.extend({
        defaults : {
            title : '',
            url : '',
            thumbnail : '',
            name : '',
            type : ''
        },
        initialize : function(){
        	var type = this.get('type');
        	var url = this.get('url');
        	switch(type){
	        	case 'BINGMAP' : this.imageryProvider = new Cesium.BingMapsImageryProvider({
	        		url : url,
	        		key : "AjQhMyw76oicHqFz7cUc3qTEy3M2fC2YIbcHjqgyMPuQprNVBr3SsvVdOfmlVc0v"
	        		});break;
	        	case 'TIANDITU' : this.imageryProvider = new Cesium.TiandituImageryProvider();break;
	        	case 'IMAGE' : this.imageryProvider = new Cesium.SingleTileImageryProvider({url : url});break;
	        	case 'OSM' : this.imageryProvider = new Cesium.createOpenStreetMapImageryProvider({url : url});break;
	        	default : break;
        	}
        },
        setBaseLayer : function(Cesium,viewer){
        	if(!Cesium || !viewer){
        		return ;
        	}
    		var url = this.get('url');
    		var imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
            var layer = imageryLayerCollection.get(0);
            imageryLayerCollection.remove(layer, true);
            imageryLayerCollection.addImageryProvider(this.imageryProvider, 0);
        }
    });
    return BaseLayerModel;
});