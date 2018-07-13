define(['Cesium', 'jquery'], function (Cesium, $) {

    var PlaneClip = function () {
    };

    var hasInitialized = false, screenSpaceEventHandler = null, planeClipPolygonHandler = null, layers = [], positions = [];

    PlaneClip.initialize = function (viewer, isPCBroswer) {
        var scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;

        var $planeClipPoint1Longitude = $("#plane-clip-point1-longitude"),
            $planeClipPoint1Latitude = $("#plane-clip-point1-latitude"),
            $planeClipPoint1Height = $("#plane-clip-point1-height"),
            $planeClipPoint2Longitude = $("#plane-clip-point2-longitude"),
            $planeClipPoint2Latitude = $("#plane-clip-point2-latitude"),
            $planeClipPoint2Height = $("#plane-clip-point2-height"),
            $planeClipPoint3Longitude = $("#plane-clip-point3-longitude"),
            $planeClipPoint3Latitude = $("#plane-clip-point3-latitude"),
            $planeClipPoint3Height = $("#plane-clip-point3-height");

        planeClipPolygonHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        planeClipPolygonHandler.activeEvt.addEventListener(function (isActive) { // 绘制过程中控制光标样式
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
        planeClipPolygonHandler.drawEvt.addEventListener(function (result) { // 绘制结束事件
            // 显示裁剪面
            planeClipPolygonHandler.polygon.show = false;
            planeClipPolygonHandler.polyline.show = false;
            // 平面裁剪三点坐标信息
            positions = result.object ? result.object.positions : result;

            var scartographic0 = Cesium.Cartographic.fromCartesian(positions[0]);
            var slongitude0 = Cesium.Math.toDegrees(scartographic0.longitude).toFixed(9);
            var slatitude0 = Cesium.Math.toDegrees(scartographic0.latitude).toFixed(9);
            var sheight0 = scartographic0.height.toFixed(2);

            var ecartographic1 = Cesium.Cartographic.fromCartesian(positions[1]);
            var elongitude1 = Cesium.Math.toDegrees(ecartographic1.longitude).toFixed(9);
            var elatitude1 = Cesium.Math.toDegrees(ecartographic1.latitude).toFixed(9);
            var eheight1 = ecartographic1.height.toFixed(2);

            var ecartographic2 = Cesium.Cartographic.fromCartesian(positions[2]);
            var elongitude2 = Cesium.Math.toDegrees(ecartographic2.longitude).toFixed(9);
            var elatitude2 = Cesium.Math.toDegrees(ecartographic2.latitude).toFixed(9);
            var eheight2 = ecartographic2.height.toFixed(2);

            $("#plane-clip-point1-longitude").val(parseFloat(slongitude0));
            $("#plane-clip-point1-latitude").val(parseFloat(slatitude0));
            $("#plane-clip-point1-height").val(parseFloat(sheight0));

            $("#plane-clip-point2-longitude").val(parseFloat(elongitude1));
            $("#plane-clip-point2-latitude").val(parseFloat(elatitude1));
            $("#plane-clip-point2-height").val(parseFloat(eheight1));

            $("#plane-clip-point3-longitude").val(parseFloat(elongitude2));
            $("#plane-clip-point3-latitude").val(parseFloat(elatitude2));
            $("#plane-clip-point3-height").val(parseFloat(eheight2));

            setClipPlane(viewer);
            positions = [];
            /*if (layers.length > 0) {
                var clipRegion = layers[0].getClipRegion();
                if (clipRegion) { // 数据有问题可能会返回undefined
                    viewer.entities.add(clipRegion);
                }
            }*/
            // sceneModel.analysisObjects.planeClipStore = positions;
        });

        if(!isPCBroswer){
            screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            screenSpaceEventHandler.setInputAction(function (evt) {
                positions.push(viewer.scene.pickPosition(evt.position));
                if (positions.length >= 3) {
                    planeClipPolygonHandler.drawEvt.raiseEvent(positions);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        $planeClipPoint1Longitude.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint1Latitude.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint1Height.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint2Longitude.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint2Latitude.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint2Height.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint3Longitude.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint3Latitude.on('input propertychange', function () {
            setClipPlane(viewer);
        });

        $planeClipPoint3Height.on('input propertychange', function () {
            setClipPlane(viewer);
        });
    };

    PlaneClip.startClip = function (viewer, isPCBroswer) {
        if(!hasInitialized){
            this.initialize(viewer, isPCBroswer);
        }
        planeClipPolygonHandler && planeClipPolygonHandler.polygon && (planeClipPolygonHandler.polygon.show = true);
        planeClipPolygonHandler && planeClipPolygonHandler.polyline && (planeClipPolygonHandler.polyline.show = true);
        planeClipPolygonHandler.activate();
    };

    PlaneClip.clear = function (viewer) {
        viewer.entities.getById('plane-clip-point1') && viewer.entities.removeById('plane-clip-point1');
        viewer.entities.getById('plane-clip-point2') && viewer.entities.removeById('plane-clip-point2');
        viewer.entities.getById('plane-clip-point3') && viewer.entities.removeById('plane-clip-point3');
        for (var layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    PlaneClip.destroy = function () {
        this.clear();
        layers = null;
        screenSpaceEventHandler && (screenSpaceEventHandler = null);
        planeClipPolygonHandler && (planeClipPolygonHandler = null);
    };

    /*
     // iPortal对接代码
     if(sceneModel.analysisObjects.planeClipStore){
         var positions = sceneModel.analysisObjects.planeClipStore;
         for(var i = 0; i < layers.length; i ++){
         layers[i].setCustomClipPlane(positions[0],positions[1],positions[2]);
         }
         if(layers.length > 0){
         var clipRegion = layers[0].getClipRegion();
         if(clipRegion){
         viewer.entities.add(clipRegion);
        }
        }
     }*/
    function setClipPlane(viewer) {
        var pt1 = Cesium.Cartesian3.fromDegrees(Number($("#plane-clip-point1-longitude").val()), Number($("#plane-clip-point1-latitude").val()), Number($("#plane-clip-point1-height").val()));
        var pt2 = Cesium.Cartesian3.fromDegrees(Number($("#plane-clip-point2-longitude").val()), Number($("#plane-clip-point2-latitude").val()), Number($("#plane-clip-point2-height").val()));
        var pt3 = Cesium.Cartesian3.fromDegrees(Number($("#plane-clip-point3-longitude").val()), Number($("#plane-clip-point3-latitude").val()), Number($("#plane-clip-point3-height").val()));
        for (var layer of layers) {
            layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
            layer.setCustomClipPlane(pt1, pt2, pt3);
        }

        viewer.entities.getById('plane-clip-point1') && viewer.entities.removeById('plane-clip-point1');
        viewer.entities.getById('plane-clip-point2') && viewer.entities.removeById('plane-clip-point2');
        viewer.entities.getById('plane-clip-point3') && viewer.entities.removeById('plane-clip-point3');

        var areaClipPoint1 = new Cesium.Entity({
            id: 'plane-clip-point1',
            position: pt1,
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15
            }
        });
        viewer.entities.add(areaClipPoint1);

        var areaClipPoint2 = new Cesium.Entity({
            id: 'plane-clip-point2',
            position: pt2,
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15
            }
        });
        viewer.entities.add(areaClipPoint2);

        var areaClipPoint3 = new Cesium.Entity({
            id: 'plane-clip-point3',
            position: pt3,
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15
            }
        });
        viewer.entities.add(areaClipPoint3);
    }

    return PlaneClip;
});