define(['Cesium'],function(Cesium) {
    'use strict';

    var sgLine = function () {
    };
    sgLine.isStart = false;
    var sightline;
    var sgPointHandler;
    sgLine.start = function (viewer) {
        var defer = Cesium.when.defer();
        sgLine.isStart = true;
        var scene = viewer.scene;
        var scene = viewer.scene;
        sightline = new Cesium.Sightline(scene);
        sightline.couldRemove = false;
        return defer;
    };
    sgLine.initializing =function(viewer){
        var scene = viewer.scene;
        sightline = new Cesium.Sightline(scene);
        sightline.couldRemove = false;
        sgPointHandler = new Cesium.PointHandler(viewer);
        document.getElementById("addViewpoint").onclick = function() {
            if(sgPointHandler.active) {
                return;
            }
            scene.sgFlag = true;
            viewer.entities.removeAll();
            if(sightline.couldRemove) {
                sightline.removeAllTargetPoint();
            }
            sgPointHandler.activate();
        };
        var visibleColorStr = sightline.visibleColor.toCssColorString();
        var hiddenColorStr = sightline.hiddenColor.toCssColorString();
        $("#visibleColor").spectrum({
            change:function(){
                $('#visibleColor').trigger('input');
            },
            color: visibleColorStr,
            showPalette: true,
            showAlpha: true,
            localStorageKey: "spectrum.demo",
            palette: palette
        });
        $("#hiddenColor").spectrum({
            change:function(){
                $('#hiddenColor').trigger('input');
            },
            color: hiddenColorStr,
            showPalette: true,
            showAlpha: true,
            localStorageKey: "spectrum.demo",
            palette: palette
        });
        sgPointHandler.drawCompletedEvent.addEventListener(function(point){
            var position = point.position._value;
            sightline.build();
            //将获取的点的位置转化成经纬度
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;

            if(scene.sgFlag) {
                //设置视口位置
                sightline.viewPosition = [longitude, latitude, height];
                scene.sgFlag = false;
                $('#viewPointX').val(longitude);
                $('#viewPointY').val(latitude);
                $('#viewPointZ').val(height);
            }
            else{
                viewer.entities.remove(point);
                //添加视点
                sightline.addTargetPoint({
                    position : [longitude, latitude, height],
                    name : "point" + new Date()
                });
                
                sightline.couldRemove = true;
            }
        });
        var visibleColor = document.getElementById('visibleColor');
        visibleColor.oninput = function(){
            var color = Cesium.Color.fromCssColorString(visibleColor.value);
            sightline.visibleColor = color;
        };
        var hiddenColor = document.getElementById('hiddenColor');
        hiddenColor.oninput = function(){
            var color = Cesium.Color.fromCssColorString(hiddenColor.value);
            sightline.hiddenColor = color;
        };
        document.getElementById("addTarget").onclick = function() {
            scene.sgFlag = false;
            sgPointHandler.activate();
        };

        document.getElementById("clearSL").onclick = function() {
            viewer.entities.removeAll();
            if(sightline.couldRemove){
                sightline.removeAllTargetPoint();
                sightline.couldRemove = false;
            }
        }
    };
    sgLine.remove = function(viewer){
        sgLine.isStart = false;
        if(sgPointHandler){
            sgPointHandler.deactivate();
        }
        viewer.entities.removeAll();
        if(sightline){
            sightline = sightline.destroy();
            sightline = undefined;
        }
    };
    return sgLine;
});