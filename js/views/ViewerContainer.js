define(['./Container'],function(Container){
    var ViewerContainer = Container.extend({
        el : '#cesiumContainer',
        render : function() {
            return this;
        }
    });
    return ViewerContainer;
});