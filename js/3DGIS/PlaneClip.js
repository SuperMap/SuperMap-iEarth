define([ 'jquery', '../Util'], function ($, Util) {

    var PlaneClip = function () {
    };

    var hasInitialized = false, screenSpaceEventHandler = null, planeClipPolygonHandler = null, layers = [], positions = [];

    PlaneClip.initialize = function (viewer, isPCBroswer) {
        var scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;

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

            if(!positions){ // 当绘制两个点就异常结束时该值为undefined
                Util.showErrorMsg("请至少绘制三个点用于构造裁剪面");
                return;
            }

            var cartographic1 = Cesium.Cartographic.fromCartesian(positions[0]);
            var longitude1 = Cesium.Math.toDegrees(cartographic1.longitude).toFixed(6);
            var latitude1 = Cesium.Math.toDegrees(cartographic1.latitude).toFixed(6);
            var height1 = cartographic1.height.toFixed(2);

            var cartographic2 = Cesium.Cartographic.fromCartesian(positions[1]);
            var longitude2 = Cesium.Math.toDegrees(cartographic2.longitude).toFixed(6);
            var latitude2 = Cesium.Math.toDegrees(cartographic2.latitude).toFixed(6);
            var height2 = cartographic2.height.toFixed(2);

            var cartographic3 = Cesium.Cartographic.fromCartesian(positions[2]);
            var longitude3 = Cesium.Math.toDegrees(cartographic3.longitude).toFixed(6);
            var latitude3 = Cesium.Math.toDegrees(cartographic3.latitude).toFixed(6);
            var height3 = cartographic3.height.toFixed(2);

            var point1PositionInfo = '' + longitude1 + ', ' + latitude1 + ', ' + height1;
            var point2PositionInfo = '' + longitude2 + ', ' + latitude2 + ', ' + height2;
            var point3PositionInfo = '' + longitude3 + ', ' + latitude3 + ', ' + height3;

            // 点的经度、纬度、高度信息文本框
            var planeClipPoint1 = $("#plane-clip-point1-position");
            var planeClipPoint2 = $("#plane-clip-point2-position");
            var planeClipPoint3 = $("#plane-clip-point3-position");

            planeClipPoint1.val(point1PositionInfo);
            planeClipPoint2.val(point2PositionInfo);
            planeClipPoint3.val(point3PositionInfo);

            setClipPlane(viewer, positions);
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

        $("#plane-clip-point1-position").val('');
        $("#plane-clip-point2-position").val('');
        $("#plane-clip-point3-position").val('');

        for (var layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    PlaneClip.destroy = function (viewer) {
        this.clear(viewer);
        layers = [];
        screenSpaceEventHandler && screenSpaceEventHandler.destroy();
        planeClipPolygonHandler && (planeClipPolygonHandler = null);
        hasInitialized = false;
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
    function setClipPlane(viewer, positions) {
        for (var layer of layers) {
            layer.clipLineColor = new Cesium.Color(1, 1, 1, 0);
            layer.setCustomClipPlane(positions[0], positions[1], positions[2]);
        }

        viewer.entities.getById('plane-clip-point1') && viewer.entities.removeById('plane-clip-point1');
        viewer.entities.getById('plane-clip-point2') && viewer.entities.removeById('plane-clip-point2');
        viewer.entities.getById('plane-clip-point3') && viewer.entities.removeById('plane-clip-point3');

        var areaClipPoint1 = new Cesium.Entity({
            id: 'plane-clip-point1',
            position: positions[0],
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15
            }
        });
        viewer.entities.add(areaClipPoint1);

        var areaClipPoint2 = new Cesium.Entity({
            id: 'plane-clip-point2',
            position: positions[1],
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15
            }
        });
        viewer.entities.add(areaClipPoint2);

        var areaClipPoint3 = new Cesium.Entity({
            id: 'plane-clip-point3',
            position: positions[2],
            point: {
                color: Cesium.Color.RED,
                pixelSize: 15
            }
        });
        viewer.entities.add(areaClipPoint3);
    }

    return PlaneClip;
});