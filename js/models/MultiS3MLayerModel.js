define(['backbone','../Util'],function(Backbone,Util){
    var MultiS3MLayerModel = Backbone.Model.extend({
        addLayer : function(viewer,isFlyMode){
        	var len = this.children.length;
        	for(var i = 0,j = len;i < j;i++){
        		var s3mLayerModel = this.children[i];
                if(i == len - 1){
                    s3mLayerModel.addLayer(viewer,true);
                }
                else{
                    s3mLayerModel.addLayer(viewer,false);
                }
        	}
        }
    });
    return MultiS3MLayerModel;
});