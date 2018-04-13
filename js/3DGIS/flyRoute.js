define(['Cesium','../lib/SuperMap','../lib/Convert'],function(Cesium, Super, Convert) {
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

    flyRoute.remove = function(viewer){

    };

    flyRoute.initializing = function(viewer){
       if(flyManager){
           flyManager.play();
       } else {
           var scene = viewer.scene;
           var routes = new Cesium.RouteCollection();
           var fileInput = document.getElementById("flyFile");
           var file = fileInput.files[0];
           var reader = new FileReader();
           reader.onload=function(e) {
               var XMLContent = e.target.result;
               routes.fromXML(XMLContent);
           };
           reader.readAsBinaryString(file)
           //创建飞行管理对象
           flyManager = new Cesium.FlyManager({
               scene : scene,
               routes : routes
           });
           flyManager.stopArrived.addEventListener(function(routeStop){
               var stopName = routeStop.stopName;
               var entity = new Cesium.Entity({
                   description : '到达站点 : ' + stopName,
                   name : stopName
               });
               viewer.selectedEntity = entity;
               setTimeout(function(){
                   viewer.selectedEntity = undefined;
               },1000);
               routeStop.waitTime = 1;
           });
           if(flyManager.readyPromise){
               Cesium.when(flyManager.readyPromise,function(){
                   var allStops = flyManager.getAllRouteStops();
                   var menu = document.getElementById('stopList');
                   var flyLine =[];
                   for(var i = 0,j = allStops.length;i < j;i++){
                       var option = document.createElement('option');
                       option.textContent = "站点 "+(i+1);
                       option.value = allStops[i].index;
                       menu.appendChild(option);
                       flyLine.push(allStops[i].point);
                       viewer.entities.add({
                           position : allStops[i].point,
                           billboard :{
                               image : './images/station.png',
                               width:30,
                               height:40,
                           }
                       });
                   }
                 viewer.entities.add({
                       polyline : {
                           positions : flyLine,
                           width : 10,
                           followSurface : false,
                           material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                       }
                   });
                   flyManager.play();

               });
          }
        }
        //各个站点事件
        $('#stopList').change(function(){
            flyManager && flyManager.pause();
            var index = parseInt($(this).val());
            var route = flyManager.currentRoute;
            var stop = route.get(index);
            flyManager.currentStopIndex = index;
            flyManager.viewToStop(stop);
            flyManager && flyManager.pause();
        });
    }

    flyRoute.pause = function () {
        flyManager && flyManager.pause();
    }

    flyRoute.stop = function () {
        flyManager && flyManager.stop();
    }

    return flyRoute;
});