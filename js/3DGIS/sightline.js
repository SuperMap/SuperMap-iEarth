define(['Cesium'],function(Cesium) {
    'use strict';

    var sgLine = function () {

    };
    var sightline;
    var sightLineHandler;
    var pointPosition;
    var longitude;
    var latitude;
    var height ;
    sgLine.initializing =function(viewer){
        var scene = viewer.scene;
        sightline = new Cesium.Sightline(scene);
        sightline.build();

        sightLineHandler = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);

        sightLineHandler.activeEvt.addEventListener(function(isActive){
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

        sightLineHandler.movingEvt.addEventListener(function(windowPosition){
            sightLineHandler.polyline.show = false;
            // if($("#dyAnalysis").is(":checked")) {
            //     var pick = viewer.scene.pickPosition(windowPosition);
            //     var ecartographic = Cesium.Cartographic.fromCartesian(pick);
            //     var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            //     var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            //     var eheight = ecartographic.height;
            //
            //     sightline.addTargetPoint({
            //         position: [elongitude, elatitude, eheight],
            //         name: "point" + new Date()
            //     });
            // }
            handler.setInputAction(function(evt){
                var pick = viewer.scene.pickPosition(evt.position);
                var ecartographic = Cesium.Cartographic.fromCartesian(pick);
                var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
                var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
                var eheight = ecartographic.height;
                sightline.addTargetPoint({
                    position: [elongitude, elatitude, eheight],
                    name: "point" + new Date()
                });
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        });

        sightLineHandler.drawEvt.addEventListener(function(result) {
            var line=result.object;
            var endPoint = line._positions[line._positions.length - 1];
            var ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
            var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            var eheight = ecartographic.height;
            sightline.addTargetPoint({
                position : [elongitude, elatitude, eheight],
                name : "point" + new Date()
            });
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        });

        sightLineHandler.activate();

        var  pointHandler = new Cesium.PointHandler(viewer);

        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        pointHandler.drawCompletedEvent.addEventListener(function(point){
            pointPosition = point;
            var position = point.position._value;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            longitude = Cesium.Math.toDegrees(cartographic.longitude);
            latitude = Cesium.Math.toDegrees(cartographic.latitude);
            height = cartographic.height;
            $('#viewPointX').val(longitude.toFixed(4));
            $('#viewPointY').val(latitude.toFixed(4));
            $('#viewPointZ').val(height.toFixed(4));
            sightline.viewPosition = [longitude, latitude, height];
        });

        pointHandler.activate();

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

        $('#viewPointX').on('input propertychange',function(){
            var  cartesian =  Cesium.Cartesian3.fromDegrees(parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val()),Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            sightline.viewPosition = [parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val())];
        })

        $('#viewPointY').on('input propertychange',function(){
            var  cartesian =  Cesium.Cartesian3.fromDegrees(parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val()),Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            sightline.viewPosition = [parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val())];
        })

        $('#viewPointZ').on('input propertychange',function(){
            var  cartesian =  Cesium.Cartesian3.fromDegrees(parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val()),Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            sightline.viewPosition = [parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val())];
        })

        document.getElementById("clearSL").onclick = function() {
            $('#viewPointX').val("0.0");
            $('#viewPointY').val("0.0");
            $('#viewPointZ').val("0.0");
            viewer.entities.removeAll();
            sightline.removeAllTargetPoint();
        }
    };
    sgLine.remove = function(viewer){
        if(sightLineHandler){
            sightLineHandler.deactivate();
        }
        viewer.entities.removeAll();
        if(sightline){
            sightline.destroy();
            sightline = undefined;
        }
    };
    return sgLine;
});