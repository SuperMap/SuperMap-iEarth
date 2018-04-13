define(['Cesium','spectrum','drag'],function(Cesium) {
    'use strict';

    var viewshed = function () {
    };
    viewshed.isStart = false;
    var viewshed3D;
    var pointPosition;
    var vsPointHandler;
    viewshed.start = function (viewer) {
        // var scene = viewer.scene;
        // viewshed.isStart = true;
        // viewshed3D = new Cesium.ViewShed3D(scene);
        // if(vsPointHandler){
        //     vsPointHandler.activate();
        // }
    };
    viewshed.remove = function(viewer){
        var scene = viewer.scene;
        viewer.entities.removeAll();
        viewshed.isStart = false;
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
        viewshed3D = new Cesium.ViewShed3D(scene);
        $("#colorPicker1").spectrum({
            color: "rgb(0, 200, 0, 100)",
            showPalette: true,
            showAlpha: true,
            localStorageKey: "spectrum.demo",
            palette: palette
        });
        $('#colorPicker2').spectrum({
            color: "rgb(200, 0, 0, 100)",
            showPalette: true,
            showAlpha: true,
            localStorageKey: "spectrum.demo",
            palette: palette
        });
        $("#clearVS").click(function(){
            viewer.entities.removeAll();
            viewshed3D.distance = 0.1;
            vsPointHandler.deactivate();
        });
        var viewModel = {
            direction:45.0,
            pitch : 45.0,
            distance : 0.0,
            verticalFov : 60.0,
            horizontalFov : 90.0,
            visibleAreaColor : '#ffffffff',
            invisibleAreaColor : '#ffffffff'
        };
        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById('content1');
        Cesium.knockout.applyBindings(viewModel, toolbar);

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

        Cesium.knockout.getObservable(viewModel,'visibleAreaColor').subscribe(
            function(newValue) {
                var color = Cesium.Color.fromCssColorString(newValue);
                viewshed3D.visibleAreaColor = color;
            }
        );
        Cesium.knockout.getObservable(viewModel,'invisibleAreaColor').subscribe(
            function(newValue) {
                var color = Cesium.Color.fromCssColorString(newValue);
                viewshed3D.hiddenAreaColor = color;
            }
        );


        var viewPosition;
        //先将此标记置为true，不激活鼠标移动事件中对可视域分析对象的操作
        scene.viewFlag = true;
        vsPointHandler = new Cesium.PointHandler(viewer);
        //创建可视域分析对象
        
        var vsHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //鼠标移动时间回调
        vsHandler.setInputAction(function(e){
            //若此标记为false，则激活对可视域分析对象的操作
            if (!scene.viewFlag) {
                //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
                var position = e.endPosition;
                var last = scene.pickPosition(position);

                //计算该点与视口位置点坐标的距离
                var distance = Cesium.Cartesian3.distance(viewPosition, last);

                if(distance > 0 ){
                    //将鼠标当前点坐标转化成经纬度
                    var cartographic = Cesium.Cartographic.fromCartesian(last);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    var height = cartographic.height;

                    //通过该点设置可视域分析对象的距离及方向
                    viewshed3D.setDistDirByPoint([longitude, latitude, height]);
                }
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        vsHandler.setInputAction(function(e){
            if (!scene.viewFlag) {
                //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
                scene.viewFlag = true;
                viewModel.direction = viewshed3D.direction;
                    viewModel.pitch = viewshed3D.pitch;
                    viewModel.distance = viewshed3D.distance;
                    viewModel.horizontalFov = viewshed3D.horizontalFov;
                    viewModel.verticalFov = viewshed3D.verticalFov;
            }
        },Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        
        document.getElementById("chooseView").onclick = function() {
            viewshed3D = new Cesium.ViewShed3D(scene);
            if(vsPointHandler.active) {
                return;
            }
            //先清除之前的可视域分析
            viewer.entities.removeAll();
            if(viewshed3D){
                viewshed3D.distance = 0.1;
            }
            scene.viewFlag = true;
            //激活绘制点类
            vsPointHandler.activate();
        }

        vsPointHandler.drawCompletedEvent.addEventListener(function(point){
            var position = point.position._value;
            pointPosition = point;
            viewPosition = position;

            //将获取的点的位置转化成经纬度
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;

            $('#viewX').val(longitude.toFixed(4));
            $('#viewY').val(latitude.toFixed(4));
            $('#viewZ').val(height.toFixed(4));

            if(scene.viewFlag) {
                //设置视口位置
                viewshed3D.viewPosition = [longitude, latitude, height];
                viewshed3D.build();
                //将标记置为false以激活鼠标移动回调里面的设置可视域操作
                scene.viewFlag = false;
            }
        });
    }
    return viewshed;
});