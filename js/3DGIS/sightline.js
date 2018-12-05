define(['Cesium'], function (Cesium) {
    'use strict';

    var sgLine = function () {

    };
    var sightline;
    var sightLineHandler;
    var pointHandler;
    var pointPosition;
    var longitude;
    var latitude;
    var height;
    var targetPoint;
    var clickFlag = 0;
    var handler;
    sgLine.initializing = function (viewer, sceneModel) {
        var scene = viewer.scene;
        for (var layer of scene.layers.layerQueue) {
            layer.removeAllObjsColor();
        }
        if (!sightline) {
            sightline = new Cesium.Sightline(scene);
            sightline.build();
        }
        clickFlag += 1;
        sightline.removeAllTargetPoint();
        viewer.entities.removeAll();

        if (handler && !handler.isDestroyed()) {
            handler.destroy();
        }
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        // var visibleColor = document.getElementById('visibleColor');
        // var color1 = Cesium.Color.fromCssColorString(visibleColor.value);
        // sightline.visibleColor = color1;
        // var hiddenColor = document.getElementById('hiddenColor');
        // var color2 = Cesium.Color.fromCssColorString(hiddenColor.value);
        // sightline.hiddenColor = color2;

        sightLineHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
        sightLineHandler.activeEvt.addEventListener(function (isActive) {
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

        sightLineHandler.movingEvt.addEventListener(function (windowPosition) {
            sightLineHandler.polyline && (sightLineHandler.polyline.show = false);
        });

        var store = {};
        sightLineHandler.drawEvt.addEventListener(function (result) {
            var line = result.object;
            var endPoint = line._positions[line._positions.length - 1];
            var ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
            var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            var eheight = ecartographic.height;
            targetPoint = [elongitude, elatitude, eheight];
            sightline.addTargetPoint({
                position: targetPoint,
                name: "point" + new Date()
            });
            store.viewPosition = sightline.viewPosition;
            store.targetPoint = targetPoint;
            sceneModel.analysisObjects.sightLineStore = store;
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        });

        sightLineHandler.activate();

        pointHandler = new Cesium.PointHandler(viewer);

        pointHandler.drawCompletedEvent.addEventListener(function (point) {
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

            handler.setInputAction(function (evt) {
                sightLineHandler.polyline && (sightLineHandler.polyline.show = false);
                var pick = viewer.scene.pickPosition(evt.position);
                var ecartographic = Cesium.Cartographic.fromCartesian(pick);
                var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
                var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
                var eheight = ecartographic.height;
                sightline.addTargetPoint({
                    position: [elongitude, elatitude, eheight],
                    name: "point" + new Date()
                });
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        });

        pointHandler.activate();

        visibleColor.oninput = function () {
            var color = Cesium.Color.fromCssColorString(visibleColor.value);
            sightline.visibleColor = color;
        };

        hiddenColor.oninput = function () {
            var color = Cesium.Color.fromCssColorString(hiddenColor.value);
            sightline.hiddenColor = color;
        };

        $('#viewPointX').on('input propertychange', function () {
            if (this.value === "") {
                $(this).val("0.0");
            }
            var cartesian = Cesium.Cartesian3.fromDegrees(parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val()), Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            sightline.viewPosition = [parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val())];
        })

        $('#viewPointY').on('input propertychange', function () {
            if (this.value === "") {
                $(this).val("0.0");
            }
            var cartesian = Cesium.Cartesian3.fromDegrees(parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val()), Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            sightline.viewPosition = [parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val())];
        })

        $('#viewPointZ').on('input propertychange', function () {
            if (this.value === "") {
                $(this).val("0.0");
            }
            var cartesian = Cesium.Cartesian3.fromDegrees(parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val()), Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            sightline.viewPosition = [parseFloat($('#viewPointX').val()), parseFloat($('#viewPointY').val()), parseFloat($('#viewPointZ').val())];
        })

        document.getElementById("clearSL").onclick = function () {
            $('#viewPointX').val("0.0");
            $('#viewPointY').val("0.0");
            $('#viewPointZ').val("0.0");
            viewer.entities.removeAll();
            sightline && sightline.removeAllTargetPoint();
            for (var layer of scene.layers.layerQueue) {
                layer.removeAllObjsColor();
            }
            sgLine.remove(viewer);
        };



        if (sceneModel.analysisObjects.sightLineStore && clickFlag < 2) {
            var store = sceneModel.analysisObjects.sightLineStore;
            sightline.viewPosition = store.viewPosition;
            sightline.addTargetPoint({
                position: store.targetPoint,
                name: "point" + new Date()
            });
        }
    };

    sgLine.highlightBarrier = function (viewer) {
        if (sightline) {
            if (sightLineHandler) {
                sightLineHandler.deactivate();
            }
            if (pointHandler) {
                pointHandler.deactivate();
            }
            handler && (!handler.isDestroyed()) && handler.destroy();
            for (var index in sightline.getObjectIds()) {
                var layer = viewer.scene.layers.findByIndex(index - 3); // 底层索引从3开始
                layer.setObjsColor(sightline.getObjectIds()[index], new Cesium.Color(255 / 255, 105 / 255, 180 / 255, 1.0));
            }
        }
    }

    sgLine.remove = function (viewer) {
        /*$("#skyForm").hide();*/
        if (sightLineHandler) {
            sightLineHandler.deactivate();
        }
        if (pointHandler) {
            pointHandler.deactivate();
        }
        handler && (!handler.isDestroyed()) && handler.destroy();
        viewer.entities.removeAll();
        if (sightline) {
            sightline.destroy();
            sightline = undefined;
        }
    };
    return sgLine;
});