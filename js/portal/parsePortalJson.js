define(function() {
    var parsePortal = function(options){
        this.analysisIndex = 0;
        this.clipIndex = 0;
        this.analysisObjects = options.analysisObjects;
        this.terrainObjects = options.terrainObjects;
        this.sceneModel = options;
    };
    parsePortal.prototype.initialize = function(){
        if(this.analysisObjects.planeClipStore || this.analysisObjects.boxClipStore){
            this.clipIndex++;
            if(this.clipIndex < 2){
                var me = this;
                require(['./views/clipForm'],function(clipForm){
                    var clipForm = new clipForm({
                        parent : me.sceneModel.viewerContainer,
                        sceneModel : me.sceneModel,
                        isPCBroswer : me.sceneModel.isPCBroswer
                    });
                    setTimeout(function(){
                        me.sceneModel.viewerContainer.addComponent(clipForm);
                        clipForm.$el.hide();
                    },3000);
                });
            }

        }
        if(this.analysisObjects.viewshed3DStore || this.analysisObjects.sightLineStore || this.analysisObjects.skylineStore){
            this.analysisIndex++;
            if(this.analysisIndex < 2){
                var me = this;
                require(['./views/analysisTools'],function(analysisTools){
                    var analysisTools = new analysisTools({
                        parent : me.sceneModel.viewerContainer,
                        sceneModel : me.sceneModel,
                        isPCBroswer : me.sceneModel.isPCBroswer
                    });
                    setTimeout(function(){
                        me.sceneModel.viewerContainer.addComponent(analysisTools);
                        analysisTools.$el.hide();
                    },3000);
                });
            }

        }
    }

    return parsePortal;
})