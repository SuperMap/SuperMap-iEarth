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
        sightline.visibleColor = Cesium.Color.fromCssColorString($('#visibleColor').spectrum("get").toRgbString());
        sightline.hiddenColor = Cesium.Color.fromCssColorString($('#hiddenColor').spectrum("get").toRgbString());
        viewer.entities.removeAll();

        if (handler && !handler.isDestroyed()) {
            handler.destroy();
        }
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

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

        //鼠标点击第一下，调用drawEvt；再点击，调用handler.setInputAction
        pointHandler.drawEvt.addEventListener(function(result){
            var point = result.object;
            point.show = false;

            pointPosition = point;
            var position = point.position;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            longitude = Cesium.Math.toDegrees(cartographic.longitude);
            latitude = Cesium.Math.toDegrees(cartographic.latitude);
            height = cartographic.height;

            viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.WHITE
                }
            });

            var sightObservationPlace = longitude.toFixed(4) + ', ' + latitude.toFixed(4) + ', ' + height.toFixed(2);
            $("#sight-observation-place").val(sightObservationPlace);

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
            var color = Cesium.Color.fromCssColorString($('#visibleColor').spectrum("get").toRgbString());
            sightline.visibleColor = color;
        };

        hiddenColor.oninput = function () {
            var color = Cesium.Color.fromCssColorString($('#hiddenColor').spectrum("get").toRgbString());
            sightline.hiddenColor = color;
        };

        document.getElementById("clearSL").onclick = function () {
            $("#sight-observation-place").val('');
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
            var sightlineHighlightBarrierColor = Cesium.Color.fromCssColorString($("#sightline-highlight-barrier-color").spectrum('get').toRgbString());
            for (var index in sightline.getObjectIds()) {
                var layer = viewer.scene.layers.findByIndex(index - 3); // 底层索引从3开始
                layer.setObjsColor(sightline.getObjectIds()[index], sightlineHighlightBarrierColor);
            }
        }
    };

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