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
	        		key : "AqgBIfrBG50dl7Ykc9nANoj5UJnIxg5YyEZu-UE7sY_sHoZT1db1jGZAalBsU73w"
	        		});break;
	        	case 'TIANDITU' : this.imageryProvider = new Cesium.TiandituImageryProvider({token: '4a00a1dc5387b8ed8adba3374bd87e5e'});break;
	        	case 'IMAGE' : this.imageryProvider = new Cesium.SingleTileImageryProvider({url : url});break;
	        	case 'OSM' : this.imageryProvider = new Cesium.createOpenStreetMapImageryProvider({url : url});break;
                case 'MAPBOX' : this.imageryProvider = new Cesium.MapboxImageryProvider({mapId: 'mapbox.dark'});break;
                case 'SUPERMAPDARK' : this.imageryProvider = new Cesium.SuperMapImageryProvider({url : url});break;
                case 'SUPERMAPLIGHT' : this.imageryProvider = new Cesium.SuperMapImageryProvider({url : url});break;
                case 'GRIDIMAGERY' :  this.imageryProvider = this.imageryProvider;break;
                default : break;
        	}
        },
        setBaseLayer : function(Cesium,viewer){
        	if(!Cesium || !viewer){
        		return ;
        	}
    		 var imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
             var layer = imageryLayerCollection.get(0);
            if(imageryLayerCollection.get(2)){
                imageryLayerCollection.remove(imageryLayerCollection.get(2));
            }
            if(imageryLayerCollection.get(1)){
                imageryLayerCollection.remove(imageryLayerCollection.get(1));
            }
            switch (this.get('type')){
                case 'IMAGE': // 本地图片
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.localImage);
                    break;
                case 'BINGMAP': // BingMaps
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.bingMaps);
                    break;
                case 'TIANDITU': // 天地图
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.tianditu);
                    break;
                case 'OSM': // Open Street Map
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.OpenStreetMap);
                    break;
                case 'SUPERMAPDARK': // SuperMap China Dark
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.SuperMapChinaDark);
                    break;
                case 'GRIDIMAGERY': // 网格影像
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.gridImagery);
                    break;
                case 'SUPERMAPLIGHT': // SuperMap China Light
                    $("#baselayer-source").text(Resource.baseLayerSource +  "：" + Resource.superMapChinaLight);
                    break;
            }
            if(this.get('type') != "GRIDIMAGERY"){
                imageryLayerCollection.remove(layer);
                imageryLayerCollection.addImageryProvider(this.imageryProvider, 0);
            }
            if(this.get('type') == "GRIDIMAGERY"){
                imageryLayerCollection.addImageryProvider(new Cesium.TileCoordinatesImageryProvider(),1);
                imageryLayerCollection.addImageryProvider(new Cesium.GridImageryProvider(),2);
            }
        }
    });
    return BaseLayerModel;
});