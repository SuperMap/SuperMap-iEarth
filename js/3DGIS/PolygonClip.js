define(['Cesium', 'jquery', '../Util'], function(Cesium, $, Util){
    var PolygonClip = function(){
    };

    var hasInitialized = false, polygonClipHandler = null, layers = [], regions = [], clipMode = Cesium.ModifyRegionMode.CLIP_OUTSIDE;
    PolygonClip.initialize = function(viewer){
        layers = viewer.scene.layers.layerQueue;
        polygonClipHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        polygonClipHandler.activeEvt.addEventListener(function (isActive) { // 绘制过程中控制光标样式
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        polygonClipHandler.drawEvt.addEventListener(function (result){
            polygonClipHandler.polygon.show = false;
            polygonClipHandler.polyline.show = false;
            var positions = [];
            clipMode = $("#polygon-clip-mode").val() === 'polygon-clip-inside' ? Cesium.ModifyRegionMode.CLIP_INSIDE : Cesium.ModifyRegionMode.CLIP_OUTSIDE;
            for (var pt of result.object.positions) {
                var cartographic = Cesium.Cartographic.fromCartesian(pt);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height;
                positions.push(longitude, latitude, height);
            }
            regions = [];
            regions.push(positions);
            for(var layer of layers){
                layer.setModifyRegions(regions, clipMode);
            }
        });
        $('#polygon-clip-mode').on('propertychange input', function () {
            clipMode = $(this).val() === 'polygon-clip-inside' ? Cesium.ModifyRegionMode.CLIP_INSIDE : Cesium.ModifyRegionMode.CLIP_OUTSIDE;
            for(var layer of layers){
                layer.setModifyRegions(regions, clipMode);
            }
        });
        hasInitialized = true;
    };
    PolygonClip.startClip = function(viewer){
        if(!hasInitialized){
            this.initialize(viewer);
        }
        polygonClipHandler.activate();
    };
    PolygonClip.clear = function(){
        polygonClipHandler && polygonClipHandler.clear();
        regions = [];
        for(var layer of layers){
            layer.clearModifyRegions();
        }
    };
    PolygonClip.destroy = function(){
        this.clear();
        layers = [];
        polygonClipHandler && (polygonClipHandler = null);
        hasInitialized = false;
    };
    return PolygonClip;
});