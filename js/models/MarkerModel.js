define(['backbone','Cesium'],function(Backbone,Cesium){
	var MarkerModel = Backbone.Model.extend({
		defaults : {
            name : '',
            description : '',
            type : 'MARKER'
        },
        initialize : function(){
        	
        },
        addMarker : function(sceneModel,marker){
        	this.viewer = sceneModel.viewer;
        	this.layer = marker;
        },
        removeMarker : function(){
        	
        },
        flyTo : function(){
        	if(this.layer){
                this.viewer.flyTo(this.layer);
            }
        },
        setVisible : function(isVisible){
        	if(this.layer){
        		this.layer.show = isVisible;
        	}
            this.set('isVisible',isVisible);
        }
	});
	return MarkerModel;
});