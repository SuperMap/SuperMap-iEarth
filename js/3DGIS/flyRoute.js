define(['Cesium', '../lib/Convert'], function (Cesium, Convert) {
    'use strict';
    var $ = require('jquery');

    /*
     * 飞行管理对象
     * 飞行路线加载
     * 飞行过程管理，开始，暂停，结束
     * 飞行点管理
     *
     * */
    var flyManager;

    var flyRoute = function () {
    };

    flyRoute.remove = function (viewer) {
    };

    flyRoute.initializing = function (viewer) {
        if (flyManager) {
            flyManager.play();
        } else {
            var scene = viewer.scene;
            var routes = new Cesium.RouteCollection(viewer.entities);
            var fileInput = document.getElementById("flyFile");
            var file = fileInput.files[0];
            if(!file){
                return; // 没有选择fpf文件无法开始执行
            }
            var reader = new FileReader();
            reader.onload = function (e) { // 读取操作完成时出发
                var XMLContent = e.target.result;
                routes.fromXML(XMLContent);
            };
            reader.readAsBinaryString(file);
            //创建飞行管理对象
            flyManager = new Cesium.FlyManager({
                scene: scene,
                routes: routes
            });
            flyManager.stopArrived.addEventListener(function (routeStop) {
                routeStop.waitTime = 1;
            });
            if (flyManager.readyPromise) {
                Cesium.when(flyManager.readyPromise, function () {
                    var currentRoute = flyManager.currentRoute;
                    currentRoute.isLineVisible = true;
                    currentRoute.isStopVisible = true;

                    var allStops = flyManager.getAllRouteStops();
                    var menu = document.getElementById('stopList');
                    for (var i = 0, j = allStops.length; i < j; i++) {
                        var option = document.createElement('option');
                        option.textContent = "站点 " + (i + 1);
                        option.value = allStops[i].index;
                        menu.appendChild(option);
                    }
                    //各个站点事件
                    $('#stopList').change(function () {
                        flyManager && flyManager.pause();
                        var index = parseInt($(this).val());
                        var route = flyManager.currentRoute;
                        var stop = route.get(index);
                        flyManager.currentStopIndex = index;
                        flyManager.viewToStop(stop);
                    });
                    flyManager.play();
                });
            }
        }
    };

    flyRoute.pause = function () {
        flyManager && flyManager.pause();
    };

    flyRoute.stop = function () {
        flyManager && flyManager.stop();
    };

    return flyRoute;
});