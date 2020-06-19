define(['backbone','../Util'],function(Backbone,Util){
    var MultiImageryLayerModel = Backbone.Model.extend({
        addLayer : function(viewer,isFlyMode){
        	var len = this.children.length;
        	for(var i = 0,j = len;i < j;i++){
        		var layerModel = this.children[i];
        		if(i == 0){
        			layerModel.addLayer(viewer,true);
        		}
        		else{
        			layerModel.addLayer(viewer,false);
        		}
        	}
        }
    });
    return MultiImageryLayerModel;
});