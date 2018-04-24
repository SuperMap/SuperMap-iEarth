define(['Cesium','spectrum','drag'],function(Cesium) {
    'use strict';

    var viewshed = function () {
    };
    var viewshed3D;
    var pointPosition;
    var vsPointHandler;
    viewshed.remove = function(viewer){
        var scene = viewer.scene;
        viewer.entities.removeAll();
        scene.viewFlag = true;
        if(vsPointHandler){
            vsPointHandler.deactivate();
        }
        if(viewshed3D){
            viewshed3D.destroy();
            viewshed3D = undefined;
        };
    };
    viewshed.initializing = function(viewer){
        var scene = viewer.scene;
        if(!viewshed3D){
            viewshed3D = new Cesium.ViewShed3D(scene);
        }
        viewer.entities.removeAll();
        viewshed3D.distance = 0.1;
        $("#clearVS").click(function(){
            viewer.entities.removeAll();
            viewshed3D.distance = 0.1;
            vsPointHandler.deactivate();
        });

        $('#viewX').on('input propertychange',function(){
            var  cartesian =  Cesium.Cartesian3.fromDegrees(parseFloat($('#viewX').val()), parseFloat($('#viewY').val()), parseFloat($('#viewZ').val())+ parseFloat($('#heightView').val()),Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            viewshed3D.viewPosition = [parseFloat($('#viewX').val()), parseFloat($('#viewY').val()), parseFloat($('#viewZ').val())+ parseFloat($('#heightView').val())];
        })

        $('#viewY').on('input propertychange',function(){
            var  cartesian =  Cesium.Cartesian3.fromDegrees(parseFloat($('#viewX').val()), parseFloat($('#viewY').val()), parseFloat($('#viewZ').val())+ parseFloat($('#heightView').val()),Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            viewshed3D.viewPosition = [parseFloat($('#viewX').val()), parseFloat($('#viewY').val()), parseFloat($('#viewZ').val())+ parseFloat($('#heightView').val())];
        })

        $('#viewZ').on('input propertychange',function(){
            var  cartesian =  Cesium.Cartesian3.fromDegrees(parseFloat($('#viewX').val()), parseFloat($('#viewY').val()), parseFloat($('#viewZ').val())+ parseFloat($('#heightView').val()),Cesium.Ellipsoid.WGS84);
            pointPosition.position._value = cartesian;
            viewshed3D.viewPosition = [parseFloat($('#viewX').val()), parseFloat($('#viewY').val()), parseFloat($('#viewZ').val()) + parseFloat($('#heightView').val())];
        })

        $('#heightView').on('input propertychange',function(){
            var longitude = parseFloat($('#viewX').val())
            var latitude = parseFloat($('#viewY').val())
            var height =parseFloat($('#viewZ').val()) + parseFloat(this.value);
            var  cartesian =  Cesium.Cartesian3.fromDegrees(longitude,latitude,height);
            pointPosition.position._value = cartesian;
            viewshed3D.viewPosition = [longitude, latitude, height];

        })

        $('#distance').on('input propertychange',function(){
            viewshed3D.distance = parseFloat(this.value);
        })

        $('#pitch').on('input propertychange',function(){
            viewshed3D.pitch = parseFloat(this.value);
        })

        $('#direction').on('input propertychange',function(){
            viewshed3D.direction = parseFloat(this.value);
        })

        $('#verticalFov').on('input propertychange',function(){
            viewshed3D.verticalFov = parseFloat(this.value);
        })

        $('#horizonalFov').on('input propertychange',function(){
            viewshed3D.horizontalFov = parseFloat(this.value);
        })

        // var visibleColor = document.getElementById('colorPicker1');
        // var color1 = Cesium.Color.fromCssColorString(visibleColor.value);
        // viewshed3D.visibleAreaColor = color1;
        // var hiddenColor = document.getElementById('colorPicker2');
        // var color2 = Cesium.Color.fromCssColorString(hiddenColor.value);
        // viewshed3D.hiddenAreaColor = color2;

        $('#colorPicker1').on('input propertychange',function(){
            var color = Cesium.Color.fromCssColorString(this.value);
            viewshed3D.visibleAreaColor = color;
        })

        $('#colorPicker2').on('input propertychange',function(){
            var color = Cesium.Color.fromCssColorString(this.value);
            viewshed3D.hiddenAreaColor = color;
        })
        var viewPosition;
        scene.viewFlag = true;
        vsPointHandler = new Cesium.PointHandler(viewer);

        var vsHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        vsHandler.setInputAction(function(e){
            //若此标记为false，则激活对可视域分析对象的操作
            if (!scene.viewFlag) {
                //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
                var position = e.endPosition;
                var last = scene.pickPosition(position);
                //计算该点与视口位置点坐标的距离
                var distance = Cesium.Cartesian3.distance(viewPosition, last);
                if(distance > 0 ){
                    var cartographic = Cesium.Cartographic.fromCartesian(last);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    var height = cartographic.height;
                    viewshed3D.setDistDirByPoint([longitude, latitude, height]);
                }
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        vsHandler.setInputAction(function(e){
            if (!scene.viewFlag) {
                scene.viewFlag = true;
                $('#direction').val(viewshed3D.direction);
                $('#pitch').val(viewshed3D.pitch);
                $('#distance').val(viewshed3D.distance);
                $('#horizontalFov').val(viewshed3D.horizontalFov);
                $('#verticalFov').val(viewshed3D.verticalFov);
            }
        },Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        vsPointHandler.drawCompletedEvent.addEventListener(function(point){
            var position = point.position._value;
            pointPosition = point;
            viewPosition = position;
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            $('#viewX').val(longitude.toFixed(4));
            $('#viewY').val(latitude.toFixed(4));
            $('#viewZ').val(height.toFixed(4));
            if(scene.viewFlag) {
                viewshed3D.viewPosition = [longitude, latitude, height];
                viewshed3D.build();
                scene.viewFlag = false;
            }
        });

        vsPointHandler.activate();

    }
    return viewshed;
});