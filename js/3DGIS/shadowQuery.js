define(['Cesium'], function (Cesium) {
    'use strict';
    var shadow = function () {

    };
    var shadowQuery;
    var handlerPolygon;
    var positions;
    shadow.initializing = function (viewer, sceneModel) {
        if (viewer.shadows == false) {
            viewer.shadows = true;//开启场景阴影
        }
        var scene = viewer.scene;
        var layers = scene.layers.layerQueue;

        for (var i = 0; i < layers.length; i++) {
            layers[i].shadowType = 2;
            layers[i].refresh();
        }
        //创建阴影查询对象
        if (!shadowQuery) {
            shadowQuery = new Cesium.ShadowQueryPoints(scene);
            shadowQuery.build();
        }

        setCurrentTime();
        handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        handlerPolygon.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            } else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        var points = [];

        handlerPolygon.drawEvt.addEventListener(function (result) {
            points.length = 0;
            var polygon = result.object;
            if (!polygon) {
                return;
            }
            polygon.show = false;
            handlerPolygon.polyline.show = false;
            positions = [].concat(polygon.positions);
            positions = Cesium.arrayRemoveDuplicates(positions, Cesium.Cartesian3.equalsEpsilon);
            //遍历多边形，取出所有点
            for (var i = 0, len = positions.length; i < len; i++) {
                //转化为经纬度，并加入至临时数组
                var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                points.push(longitude);
                points.push(latitude);
            }
            //设置分析对象的开始结束时间
            var dateValue = $("#selDate").val();
            var startTime = new Date(dateValue);
            startTime.setHours(Number($("#startTime :selected").val()));
            shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime);

            var endTime = new Date(dateValue);
            endTime.setHours(Number($("#endTime :selected").val()));
            shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime);

            //设置当前时间
            setCurrentTime();

            shadowQuery.spacing = 10;
            shadowQuery.timeInterval = 60;

            //设置分析区域、底部高程和拉伸高度
            var bh = Number($('#bottomHeight').val());
            var eh = Number($('#extrudeHeight').val());
            shadowQuery.qureyRegion({
                position: points,
                bottom: bh,
                extend: eh
            });
            shadowQuery.build();
        });
        handlerPolygon.deactivate();
        handlerPolygon.activate();

        var store = {};
        store.startTime = shadowQuery.startTime;
        store.endTime = shadowQuery.endTime;
        store.position = positions;
        store.bottom = Number($('#bottomHeight').val());
        store.extend = Number($('#extrudeHeight').val());
        sceneModel.analysisObjects.shadowQueryStore = store;


        $('#sunlight').click(function () {
            var dateVal = $("#selDate").val();
            var startTime = new Date(dateVal);
            var endTime = new Date(dateVal);
            var shour = Number($("#startTime :selected").val());
            var ehour = Number($("#endTime :selected").val());
            for (var i = 0; i < layers.length; i++) {
                layers[i].shadowType = 2;
            }
            if (shour > ehour) {
                return;
            }

            // shadowQuery.qureyRegion({
            //     position : [0,0],
            //     bottom : 0,
            //     extend : 0
            // });

            var nTimer = 0.0;
            var nIntervId = setInterval(function () {
                if (shour < ehour) {
                    startTime.setHours(shour);
                    startTime.setMinutes(nTimer);
                    viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
                    nTimer += 10.0;
                    if (nTimer > 60.0) {
                        shour += 1.0;
                        nTimer = 0.0;
                    }
                } else {
                    clearInterval(nIntervId);
                }
            }, 20);

        });


        $('#clear').click(function () {
            handlerPolygon.deactivate();
            // handlerPolygon.polygon.show = false;
            // handlerPolygon.polyline.show = false;
            viewer.entities.removeAll();
            for (var i = 0; i < layers.length; i++) {
                layers[i].shadowType = 0;
            }
            shadowQuery.qureyRegion({
                position: [0, 0],
                bottom: 0,
                extend: 0
            });
        });

        $('#startTime').change(function () {
            var startTime = new Date($("#selDate").val());
            startTime.setHours(Number($(this).val()));
            shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime);
        });
        $('#endTime').change(function () {
            var endTime = new Date($("#selDate").val());
            endTime.setHours(Number($(this).val()));
            shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime);
            setCurrentTime();
        });

        $('#bottomHeight').on("input propertychange", function () {
            if (this.value === "") {
                $(this).val("0.0");
            }
            var bh = Number($(this).val());
            var eh = Number($('#extrudeHeight').val());
            shadowQuery.qureyRegion({
                position: points,
                bottom: bh,
                extend: eh
            });
        });

        $('#extrudeHeight').on("input propertychange", function () {
            if (this.value === "") {
                $(this).val("0.0");
            }
            var bh = Number($('#bottomHeight').val());
            var eh = Number($(this).val());
            shadowQuery.qureyRegion({
                position: points,
                bottom: bh,
                extend: eh
            });
        });

        function setCurrentTime() {
            var endTime = new Date($("#selDate").val());
            endTime.setHours(Number($("#endTime :selected").val()));
            viewer.clock.currentTime = Cesium.JulianDate.fromDate(endTime);
            viewer.clock.multiplier = 1;
            viewer.clock.shouldAnimate = true;
        }
    }
    shadow.remove = function (viewer) {
        if (!handlerPolygon) {
            return;
        } else {
            handlerPolygon.deactivate();
        }
        var layers = viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
            layers[i].shadowType = 0;
        }
        if (shadowQuery) {
            shadowQuery.qureyRegion({
                position: [0, 0],
                bottom: 0,
                extend: 0
            });
            shadowQuery.destroy();
            shadowQuery = undefined;
        }
    };

    return shadow;
});
