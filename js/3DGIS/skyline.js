define(['Cesium','echartsMin'],function(Cesium,echarts) {
    'use strict';
    var skyLine = function () {
    };
    var skyline;
    var parent;
    var s3mInstance;
    var clickFlag = 0;
    skyLine.initializing = function(viewer,parentContainer,sceneModel){
        var scene = viewer.scene;
        clickFlag += 1;
        parent =  parentContainer;
        if(!skyline){
            skyline = new Cesium.Skyline(scene);
        }
        clear(); // 清除上一次分析结果
        var cartographic = scene.camera.positionCartographic;
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;
        //天际线分析的视口位置设置成当前相机位置
        skyline.viewPosition = [longitude, latitude, height];
        $('#skyviewX').val(longitude.toFixed(4));
        $('#skyviewY').val(latitude.toFixed(4));
        $('#skyviewZ').val(height.toFixed(4));
        //设置俯仰和方向
        skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
        skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);
        skyline.radius = parseFloat($("#skylineRadius").val());
        skyline.build();

        for(var index in skyline.getObjectIds()){
            var layer = scene.layers.findByIndex(index - 3); // 底层索引从3开始
            layer.setObjsColor(skyline.getObjectIds()[index], new Cesium.Color(1.0, 0.0, 0.0, 0.5));
        }

        var skylineColor = document.getElementById('skylineColor');
        skylineColor.oninput = function(){
            var color = Cesium.Color.fromCssColorString(skylineColor.value);
            skyline.color = color;
        };
        $('#skylineMode').change(function(){
            var value = $(this).val();
            if(value=="0"){
                skyline.displayStyle = 0;
                scene.primitives._primitives = [];
            }
            else if(value=="1"){
                skyline.displayStyle = 1;
                scene.primitives._primitives = [];
            }
            else if(value=="2"){
                skyline.displayStyle = 0;
                if(!s3mInstance){
                    s3mInstance = new Cesium.S3MInstanceCollection(scene._context);
                    scene.primitives.add(s3mInstance);
                }
                var param = skyline.getSkylineSectorParameter();
                var geometrySkylineSectorBodyPostParameter = {};
                geometrySkylineSectorBodyPostParameter.viewerPoint  = param.viewPos;
                geometrySkylineSectorBodyPostParameter.line3D  = param.geoLine3D;
                geometrySkylineSectorBodyPostParameter.height = 0;
                geometrySkylineSectorBodyPostParameter.lonlat = true;
                var url = "http://localhost:8090/iserver/services/spatialAnalysis-qiang/restjsr/spatialanalyst/geometry/3d/skylinesectorbody.json";
                var queryData = JSON.stringify(geometrySkylineSectorBodyPostParameter);
                $.ajax({
                    url : url,
                    async : true,
                    data : queryData,
                    method : "POST"
                }).done(function(data) {
                    $.ajax({
                        url : data.newResourceLocation + ".json",
                        method : "GET"
                    }).done(function(data) {
                        if (data.geometry === null) {
                            return;
                        }
                        var uint8Array = new Uint8Array(data.geometry.model);
                        var buffer = uint8Array.buffer;
                        s3mInstance.add("result",{
                            position : Cesium.Cartesian3.fromDegrees(data.geometry.position.x, data.geometry.position.y, data.geometry.position.z),
                            hpr : new Cesium.HeadingPitchRoll(0,0,0),
                            color : new Cesium.Color(0, 160/255, 233/255, 0.5)
                        }, buffer);
                    })
                });
            }
        });

        $('#clearSkyline').click(clear);

        function clear(){
            viewer.entities.removeAll();
            if(parent.skylineForm){
                parent.skylineForm.$el.hide();
            }
            scene.primitives._primitives = [];
            skyline.clear();
            for(var layer of scene.layers.layerQueue){
                layer.removeAllObjsColor();
            }
        }

        if(sceneModel.analysisObjects.skylineStore && clickFlag < 2){
            var store = sceneModel.analysisObjects.skylineStore;
            skyline.viewPosition = store.viewPosition;
            skyline.pitch = store.pitch;
            skyline.direction = store.direction;
            skyline.radius = store.radius;
        }

        var store = {};
        store.viewPosition = skyline.viewPosition;
        store.pitch = skyline.pitch;
        store.direction = skyline.direction;
        store.radius = skyline.radius;
        sceneModel.analysisObjects.skylineStore = store;


        document.getElementById("getSkyline2D").onclick = function() {
            var object = skyline.getSkyline2D();
            var me = parent;
            if(parent.skylineForm){
                var myChart = echarts.init(document.getElementById("map"));
                var option = {
                    backgroundColor : "rgba(73,139,156,0.0)",
                    tooltip : {
                        trigger : "axis"
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : "category",
                            boundaryGap : false,
                            data : object.x,
                            show : false
                        }
                    ],
                    yAxis : [
                        {
                            type : "value",
                            min : 0,
                            max : 1,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name : "",
                            type : "line",
                            data : object.y
                        }
                    ]
                }
                myChart.setOption(option);
                parent.skylineForm.$el.show();
            }else {
                require(['./views/skylineForm'], function (skylineForm) {
                    var skylineForm = new skylineForm({
                        object: object,
                        sceneModel: me.model,
                        isPCBroswer: me.isPCBroswer
                    });
                    me.parent.addComponent(skylineForm);
                    me.skylineForm = skylineForm;
                    skylineForm.$el.show();
                });
            }


        }
    }
    skyLine.remove = function(viewer){
        if(skyline){
            skyline.destroy();
            skyline = undefined;
        }
    };
    return skyLine;
});
