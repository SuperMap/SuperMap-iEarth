define(function() {
    var parsePortal = function(options){
        this.analysisObjects = options.analysisObjects;
        this.terrainObjects = options.terrainObjects;
        this.sceneModel = options;
    };
    parsePortal.prototype.initialize = function(){
        if(this.analysisObjects.planeClipStore || this.analysisObjects.boxClipStore){
            var me = this;
            require(['./views/clipForm'],function(clipForm){
                var clipForm = new clipForm({
                    parent : me.sceneModel.viewerContainer,
                    sceneModel : me.sceneModel,
                    isPCBroswer : me.sceneModel.isPCBroswer
                });
                me.sceneModel.viewerContainer.addComponent(clipForm);
                clipForm.$el.show();
            });
        }
        if(this.analysisObjects.viewshed3DStore){
            var me = this;
            require(['./views/analysisTools'],function(analysisTools){
                var analysisTools = new analysisTools({
                    parent : me.sceneModel.viewerContainer,
                    sceneModel : me.sceneModel,
                    isPCBroswer : me.sceneModel.isPCBroswer
                });
                me.sceneModel.viewerContainer.addComponent(analysisTools);
                analysisTools.$el.show();
            });
        }
    }

    return parsePortal;
})