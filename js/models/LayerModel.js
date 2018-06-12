define([ 'backbone', 
         './S3MLayerModel',
         './MultiS3MLayerModel',
         './ImageryLayerModel',
         './TerrainLayerModel',
         './KmlLayerModel',
         './MultiImageryLayerModel'
         ], function(Backbone,S3MLayerModel,MultiS3MLayerModel,ImageryLayerModel,TerrainLayerModel,KmlLayerModel,MultiImageryLayerModel) {
    var _ = require('underscore');
    var typeToLayer = {
        'S3M' : S3MLayerModel,
        'MULTIS3M' : MultiS3MLayerModel,
        'IMAGERY' : ImageryLayerModel,
        'TERRAIN' : TerrainLayerModel,
        'KML' : KmlLayerModel,
        'MULTIIMAGERY' : MultiImageryLayerModel
    };
    var LayerModel = Backbone.Model.extend({
        defaults : {
            id : null,
            isVisible : true,
            name : null,
            type : null, 
            url : null,
            thumbnail : null,
            title : null
        },
        initialize : function() {
            var type = this.get('type');
            var Clazz = typeToLayer[type];
            if(Clazz){
                this.strategy = new Clazz(this.toJSON());
            }
        },
        addLayer : function(viewer,isFlyMode) {
           // document.getElementById('japan_pointCloud_tag').style.display = 'none';
        	isFlyMode = isFlyMode == false ? false : true;
            return this.strategy.addLayer(viewer,isFlyMode);
        },
        removeLayer : function(viewer){
            this.strategy.removeLayer(viewer);
        },
        flyTo : function(){
            this.strategy.flyTo();
        },
        setVisible : function(isVisible){
            this.strategy.setVisible(isVisible);
            this.set('isVisible',isVisible);
        }
    });
    return LayerModel;
});