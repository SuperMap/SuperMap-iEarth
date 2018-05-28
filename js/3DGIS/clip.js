define(['Cesium'],function(Cesium) {
    'use strict';
    var $ = require('jquery');

    /*
    * 裁剪对象，平面裁剪和Box裁剪，底层实际统一为一个shader,这里一个类统一管理
    * 平面裁剪目前还不能交互控制点，先这样
    * Box裁剪变换与四种模式
    *
    * */

    var clip = function(){};

    var layers = [];
    var screenSpaceEventHandler = null, planeClipPolygonHandler = null;

    clip.init = function(viewer){
        var scene = viewer.scene;
        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        planeClipPolygonHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    };

    clip.remove = function(viewer,sceneModel,beacon){
        if(beacon){ // 平面裁剪
            if(planeClipPolygonHandler){
                planeClipPolygonHandler.clear(); // 清除绘制的所有图元
                viewer.entities.removeAll();
                $("#plane-clip-point1-longitude").val(0);
                $("#plane-clip-point1-latitude").val(0);
                $("#plane-clip-point1-latitude").val(0);

                $("#plane-clip-point2-longitude").val(0);
                $("#plane-clip-point2-latitude").val(0);
                $("#plane-clip-point2-height").val(0);

                $("#plane-clip-point3-longitude").val(0);
                $("#plane-clip-point3-latitude").val(0);
                $("#plane-clip-point3-height").val(0);
            }
        }else{
            viewer.entities.removeById("Custom");
            $("#length").val(100);
            $("#width").val(100);
            $("#height").val(100);
            $("#rotate").val(0);
        }
        //清除裁剪结果
        for(var i = 0; i < layers.length; i ++){
            layers[i].clearCustomClipBox();
        }
    };

    clip.initializing = function(viewer,sceneModel,beacon){
        layers = viewer.scene.layers._layers._array;
        if(beacon){//平面裁剪
            var $planeClipPoint1Longitude = $("#plane-clip-point1-longitude"),
                $planeClipPoint1Latitude = $("#plane-clip-point1-latitude"),
                $planeClipPoint1Height = $("#plane-clip-point1-height"),
                $planeClipPoint2Longitude = $("#plane-clip-point2-longitude"),
                $planeClipPoint2Latitude = $("#plane-clip-point2-latitude"),
                $planeClipPoint2Height = $("#plane-clip-point2-height"),
                $planeClipPoint3Longitude = $("#plane-clip-point3-longitude"),
                $planeClipPoint3Latitude = $("#plane-clip-point3-latitude"),
                $planeClipPoint3Height = $("#plane-clip-point3-height");
            for(var i = 0; i < layers.length; i ++){
                layers[i].clearCustomClipBox();
            }
            if(screenSpaceEventHandler){ // 进行平面裁剪时就禁用掉Box裁剪或之前设置的面裁剪，并清除Box裁剪的结果
                screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                viewer.entities.removeById("Custom");
            }
            planeClipPolygonHandler.activeEvt.addEventListener(function(isActive){
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
            planeClipPolygonHandler.drawEvt.addEventListener(function(result){
                //显示裁剪面
                planeClipPolygonHandler.polygon.show = false;
                planeClipPolygonHandler.polyline.show = false;

                //平面裁剪三点坐标信息
                var positions = result.object.positions;

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

                //平面裁剪参数设定
                for(var i = 0; i < layers.length; i ++){
                    layers[i].setCustomClipPlane(positions[0],positions[1],positions[2]);
                }
                if(layers.length > 0){
                    var clipRegion = layers[0].getClipRegion();
                    if(clipRegion){ // 数据有问题可能会返回undefined
                        viewer.entities.add(clipRegion);
                    }
                }
                sceneModel.analysisObjects.planeClipStore = positions;
            });




            $planeClipPoint1Longitude.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint1Latitude.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint1Height.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint2Longitude.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint2Latitude.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint2Height.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint3Longitude.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint3Latitude.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });

            $planeClipPoint3Height.bind('input propertychange', function(){
                setClipPlane(viewer, layers, planeClipPolygonHandler);
            });
            planeClipPolygonHandler.activate();
        }else if(!beacon){//Box裁剪
            var $clipMode = $('#clipMode'),$length = $('#length'),$width = $('#width'),$height = $('#height'),$rotate = $('#rotate'), $boxClipCanMove = $('#box-clip-can-move');
            var boxEntity = undefined;
            viewer.entities.removeById("Custom");
            var scene = viewer.scene;
            for(var i = 0; i < layers.length; i ++){
                layers[i].clearCustomClipBox();
            }
            //参数绑定变换
            $length.bind('input propertychange',function(){
                if(!boxEntity){
                    return ;
                }
                var dim = boxEntity.box.dimensions.getValue();
                var newValue = Number($(this).val());
                boxEntity.box.dimensions = new Cesium.Cartesian3(newValue,dim.y,dim.z);
                setClipBox(layers,boxEntity);
            });
            $width.bind('input propertychange',function(){
                if(!boxEntity){
                    return ;
                }
                var dim = boxEntity.box.dimensions.getValue();
                var newValue = Number($(this).val());
                boxEntity.box.dimensions = new Cesium.Cartesian3(dim.x,newValue,dim.z);
                setClipBox(layers,boxEntity);
            });
            $height.bind('input propertychange',function(){
                if(!boxEntity){
                    return ;
                }
                var dim = boxEntity.box.dimensions.getValue();
                var newValue = Number($(this).val());
                boxEntity.box.dimensions = new Cesium.Cartesian3(dim.x,dim.y,newValue);
                setClipBox(layers,boxEntity);
            });
            $rotate.bind('input propertychange',function(){
                if(!boxEntity){
                    return ;
                }
                var position = boxEntity.position.getValue(0);
                var newValue = Number($(this).val());
                var rotate = Cesium.Math.toRadians(newValue);
                var hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
                var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
                boxEntity.orientation = orientation;
                setClipBox(layers,boxEntity);
            });

            $clipMode.change(function(){
                setClipBox(layers,boxEntity);
            });

            screenSpaceEventHandler.setInputAction(function(evt){
                var cartesian = scene.pickPosition(evt.position);
                if(boxEntity){
                    if($boxClipCanMove.get(0).checked){
                        boxEntity.position = cartesian;
                        setClipBox(layers, boxEntity);
                    }
                }else{
                    var length = Number($length.val());
                    var width = Number($width.val());
                    var height = Number($height.val());
                    var rotate = Number($rotate.val());
                    var hpr = new Cesium.HeadingPitchRoll(rotate, 0, 0);
                    var orientation = Cesium.Transforms.headingPitchRollQuaternion(cartesian, hpr);
                    boxEntity = viewer.entities.add({
                        id : "Custom",
                        box : {
                            dimensions : new Cesium.Cartesian3(length,width,height),
                            material : Cesium.Color.fromRandom({alpha : 0.1})
                        },
                        position : cartesian,
                        orientation : orientation
                    });
                    setClipBox(layers, boxEntity);
                }
                var boxEntityStore = {};
                boxEntityStore.length  = length;
                boxEntityStore.width = width;
                boxEntityStore.height = width;
                boxEntityStore.rotate = rotate;
                boxEntityStore.position = cartesian;
                sceneModel.analysisObjects.boxClipStore = boxEntityStore;
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    };

    function setClipPlane(viewer, layers, planeClipPolygonHandler){
        var pt1 = Cesium.Cartesian3.fromDegrees(Number($("#plane-clip-point1-longitude").val()), Number($("#plane-clip-point1-latitude").val()), Number($("#plane-clip-point1-height").val()));
        var pt2 = Cesium.Cartesian3.fromDegrees(Number($("#plane-clip-point2-longitude").val()), Number($("#plane-clip-point2-latitude").val()), Number($("#plane-clip-point2-height").val()));
        var pt3 = Cesium.Cartesian3.fromDegrees(Number($("#plane-clip-point3-longitude").val()), Number($("#plane-clip-point3-latitude").val()), Number($("#plane-clip-point3-height").val()));
        for(var i = 0; i < layers.length; i ++){
            layers[i].clipLineColor = new Cesium.Color(1,1,1,0);
            layers[i].setCustomClipPlane(pt1,pt2,pt3);
        }
        viewer.entities.removeAll();
        if(layers.length > 0){
            var clipRegion = layers[0].getClipRegion();
            viewer.entities.add(clipRegion);
        }
    }

    function setClipBox(layers,boxEntity){
        var index = document.getElementById("clipMode").selectedIndex;
        var newDim = boxEntity.box.dimensions.getValue();
        var position = boxEntity.position.getValue(0);
        var clipMode = $('#clipMode').val();
        var heading = Cesium.Math.toRadians($('#rotate').val());
        var boxOptions;
        switch (index){
            case 0:
                for(var i = 0,j = layers.length;i < j;i++){
                    layers[i].clipLineColor = new Cesium.Color(1,1,1,1);
                }
                boxOptions = {
                    dimensions : newDim,
                    position : position,
                    clipMode : clipMode,
                    heading : heading
                };
                break;
            case 1:
                for(var i = 0,j = layers.length;i < j;i++){
                    layers[i].clipLineColor = new Cesium.Color(1,1,1,1);
                }
                boxOptions = {
                    dimensions : newDim,
                    position : position,
                    clipMode : clipMode,
                    heading : heading
                };
                break;
            case 2:
                for(var i = 0,j = layers.length;i < j;i++){
                    layers[i].clipLineColor = new Cesium.Color(1,1,1,0.0);
                }
                boxOptions = {
                    dimensions : newDim,
                    position : position,
                    clipMode : "clip_behind_all_plane",
                    heading : heading
                };
                break;
            case 3:
                for(var i = 0,j = layers.length;i < j;i++){
                    layers[i].clipLineColor = new Cesium.Color(1,1,1,0.0);
                }
                boxOptions = {
                    dimensions : newDim,
                    position : position,
                    clipMode : "clip_behind_any_plane",
                    heading : heading
                };
                break;
            default:
                break;
        }
        for(var i = 0,j = layers.length;i < j;i++){
            layers[i].setCustomClipBox(boxOptions);
        }
    }
    return clip;
});