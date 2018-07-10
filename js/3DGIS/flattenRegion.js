define(['Cesium'],function(Cesium) {
    'use strict';
    var $ = require('jquery');
    var flattenRegion = function () {
    };
    flattenRegion.remove = function(selectedLayer){
        selectedLayer.removeAllFlattenRegion();
    };
    flattenRegion.initializing = function(selectedLayer,viewer){
        var handlerPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon);
        handlerPolygon.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerPolygon.movingEvt.addEventListener(function(windowPosition){

        });
        handlerPolygon.drawEvt.addEventListener(function(result){
            handlerPolygon.polygon.show = false;
            handlerPolygon.polyline.show = false;
            var polygon = result.object;
            var positions = polygon.positions;
            var flatPoints = [];
            for(var i = 0,j = positions.length;i < j;i++){
                var position = positions[i];
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var lon = Cesium.Math.toDegrees(cartographic.longitude);
                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height;
                flatPoints.push(lon);
                flatPoints.push(lat);
                flatPoints.push(height);
            }
            selectedLayer.addFlattenRegion({
                position : flatPoints,
                name : 'flatten' + Math.random()
            });
        });
        handlerPolygon.activate();
    }
    return flattenRegion;
});