define(['Cesium', 'spectrum', 'drag'], function (Cesium) {
    'use strict';

    var viewshed = function () {
    };
    var viewshed3D;
    var point;
    var vsPointHandler;
    var clickFlag = 0;
    var clickCount = 0;
    var originViewshedObservationPlace = null;
    viewshed.remove = function (viewer) {
        var scene = viewer.scene;
        scene.viewFlag = true;
        if (vsPointHandler) {
            vsPointHandler && vsPointHandler.clear();
            vsPointHandler.deactivate();
        }
        if (viewshed3D) {
            viewshed3D.destroy();
            viewshed3D = undefined;
        }

        $('#viewshed-observation-place').val('');
        $('#direction').val('0.0');
        $('#viewshed-pitch').val('0.0');
        $('#distance').val('1.0');
        $('#horizontalFov').val('90');
        $('#verticalFov').val('60');
    };

    viewshed.initializing = function (viewer, sceneModel, isPCBroswer) {
        var scene = viewer.scene;
        clickFlag += 1;
        clickCount = 0;
        if (!viewshed3D) {
            viewshed3D = new Cesium.ViewShed3D(scene);
        }
        vsPointHandler && vsPointHandler.clear();
        viewshed3D.distance = 0.1;
        viewshed3D.visibleAreaColor = Cesium.Color.fromCssColorString($('#colorPicker1').spectrum("get").toRgbString());
        viewshed3D.hiddenAreaColor = Cesium.Color.fromCssColorString($('#colorPicker2').spectrum("get").toRgbString());
        var store = {};
        $("#clearVS").click(function () {
            viewshed.remove(viewer);
        });

        $('#heightView').on('input propertychange', function () {
            if (!originViewshedObservationPlace || !viewshed3D) {
                return;
            }
            var longitude = originViewshedObservationPlace.longitude;
            var latitude = originViewshedObservationPlace.latitude;
            if (this.value === "") { // 避免删除导致崩溃
                this.value = "0.0";
            }
            var height = originViewshedObservationPlace.height + parseFloat(this.value);
            var cartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            point.position = cartesian;
            viewshed3D.viewPosition = [longitude, latitude, height];
        });

        $('#distance').on('input propertychange', function () {
            if (Number(this.value) < 0.1) {
                $(this).val("0.1");
            }
            viewshed3D.distance = Number(this.value);
        });

        $('#viewshed-pitch').on('input propertychange', function () {
            if (this.value === "") {
                $(this).val("0");
            }
            viewshed3D.pitch = parseFloat(this.value);
        });

        $('#direction').on('input propertychange', function () {
            if (this.value === "") {
                $(this).val("0");
            }
            viewshed3D.direction = parseFloat(this.value);
        });

        $('#verticalFov').on('input propertychange', function () {
            if (Number(this.value) < 1) {
                $(this).val("1");
            }
            viewshed3D.verticalFov = parseFloat(this.value);
        });

        $('#horizonalFov').on('input propertychange', function () {
            if (Number(this.value) < 1) {
                $(this).val("1");
            }
            viewshed3D.horizontalFov = parseFloat(this.value);
        });


        $('#colorPicker1').on('input propertychange', function () {
            var color = Cesium.Color.fromCssColorString(this.value);
            viewshed3D.visibleAreaColor = color;
        });

        $('#colorPicker2').on('input propertychange', function () {
            var color = Cesium.Color.fromCssColorString(this.value);
            viewshed3D.hiddenAreaColor = color;
        });

        var viewPosition;
        scene.viewFlag = true;
        vsPointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point, Cesium.ClampMode.Space);

        var vsHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        if(!isPCBroswer) {
            vsHandler.setInputAction(function(evt) {
                clickCount++;
                if(clickCount === 2) {
                    var endPosition = viewer.scene.pickPosition(evt.position);
                    var distance = Cesium.Cartesian3.distance(viewPosition, endPosition);
                    if (distance > 0) {
                        var cartographic = Cesium.Cartographic.fromCartesian(endPosition);
                        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                        var height = cartographic.height;
                        viewshed3D.setDistDirByPoint([longitude, latitude, height]);
                    }
                    $('#direction').val(viewshed3D.direction);
                    $('#viewshed-pitch').val(viewshed3D.pitch);
                    $('#distance').val(viewshed3D.distance);
                    $('#horizontalFov').val(viewshed3D.horizontalFov);
                    $('#verticalFov').val(viewshed3D.verticalFov);

                    store.viewPosition = viewshed3D.viewPosition;
                    store.distance = viewshed3D.distance;
                    store.pitch = viewshed3D.pitch;
                    store.direction = viewshed3D.direction;
                    store.verticalFov = viewshed3D.verticalFov;
                    store.horizontalFov = viewshed3D.horizontalFov;
                    sceneModel.analysisObjects.viewshed3DStore = store;

                    vsHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        if(isPCBroswer) {
            vsHandler.setInputAction(function (e) {
                // 若此标记为false，则激活对可视域分析对象的操作
                if (!scene.viewFlag) {
                    // 获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
                    var position = e.endPosition;
                    var last = scene.pickPosition(position);
                    // 计算该点与视口位置点坐标的距离
                    var distance = Cesium.Cartesian3.distance(viewPosition, last);
                    if (distance > 0) {
                        var cartographic = Cesium.Cartographic.fromCartesian(last);
                        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                        var height = cartographic.height;
                        viewshed3D.setDistDirByPoint([longitude, latitude, height]);
                    }
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }

        if(isPCBroswer) {
            vsHandler.setInputAction(function (e) {
                if (!scene.viewFlag) {
                    scene.viewFlag = true;
                    $('#direction').val(viewshed3D.direction);
                    $('#viewshed-pitch').val(viewshed3D.pitch);
                    $('#distance').val(viewshed3D.distance);
                    $('#horizontalFov').val(viewshed3D.horizontalFov);
                    $('#verticalFov').val(viewshed3D.verticalFov);
                }
                store.viewPosition = viewshed3D.viewPosition;
                store.distance = viewshed3D.distance;
                store.pitch = viewshed3D.pitch;
                store.direction = viewshed3D.direction;
                store.verticalFov = viewshed3D.verticalFov;
                store.horizontalFov = viewshed3D.horizontalFov;
                sceneModel.analysisObjects.viewshed3DStore = store;
                vsHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }

        vsPointHandler.drawEvt.addEventListener(function (result) {
            point = result.object;
            var position = point.position;
            viewPosition = position;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            originViewshedObservationPlace = {longitude, latitude, height};
            var additionalHeight = Number($("#heightView").val());

            var pointPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height + additionalHeight);
            point.position = pointPosition;

            var viewshedObservationPlace = longitude.toFixed(4) + ', ' + latitude.toFixed(4) + ', ' + height.toFixed(2);
            $('#viewshed-observation-place').val(viewshedObservationPlace);
            if (scene.viewFlag) {
                viewshed3D.viewPosition = [longitude, latitude, height + additionalHeight];
                viewshed3D.build();
                scene.viewFlag = false;
            }
        });

        if (sceneModel.analysisObjects.viewshed3DStore && clickFlag < 2) {
            var store = sceneModel.analysisObjects.viewshed3DStore;
            viewshed3D.build();
            viewshed3D.viewPosition = store.viewPosition;
            viewshed3D.distance = store.distance;
            viewshed3D.pitch = store.pitch;
            viewshed3D.direction = store.direction;
            viewshed3D.verticalFov = store.verticalFov;
            viewshed3D.horizontalFov = store.horizontalFov;
        }
        vsPointHandler.activate();
    };
    return viewshed;
});