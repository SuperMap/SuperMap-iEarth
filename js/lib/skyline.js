define(['Cesium','echartsMin'],function(Cesium,echartsMin) {
    'use strict';
    var skyLine = function () {
    };
    skyLine.isStart = false;
    var skyline;//创建天际线分析对象
    var parent;
    skyLine.start = function (viewer) {
        var defer = Cesium.when.defer();
        $("#skyToolbar").show();
        skyLine.isStart = true;
        var scene = viewer.scene;
        skyline = new Cesium.Skyline(scene);
        return defer;
    };
    skyLine.initializing = function(viewer,parentContainer){
        var scene = viewer.scene;
        parent =  parentContainer
        skyline = new Cesium.Skyline(scene);
        document.getElementById("getSkyline").onclick = function() {
            var cartographic = scene.camera.positionCartographic;
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            //天际线分析的视口位置设置成当前相机位置
            skyline.viewPosition = [longitude, latitude, height];
            $('#skyviewX').val(longitude);
            $('#skyviewY').val(latitude);
            $('#skyviewZ').val(height);
            //设置俯仰和方向
            skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
            skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);
            skyline.build();
        }
        var skylineColorStr = skyline.color.toCssColorString();
        $("#skylineColor").spectrum({
            change:function(){
                $('#skylineColor').trigger('input');
            },
            color: skylineColorStr,
            showPalette: true,
            showAlpha: true,
            localStorageKey: "spectrum.demo",
            palette: palette
        });
        var skylineColor = document.getElementById('skylineColor');
        skylineColor.oninput = function(){
            var color = Cesium.Color.fromCssColorString(skylineColor.value);
            skyline.color = color;
        };
        $('#skylineMode').change(function(){
            var value = $(this).val();
            if(value=="0"){
                skyline.displayStyle = 0;
            }
            else if(value=="1"){
                skyline.displayStyle = 1;
            }
        });

        $('#clearSkyline').click(function(){
            viewer.entities.removeAll();
            if(parent.skylineForm){
                parent.skylineForm.$el.hide();
            }
            skyline.clear();
        });

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
        $("#skyToolbar").hide();
        $("#skyline2dChart").hide();
        skyLine.isStart = false;
        if(skyline){
            skyline.destroy();
            skyline = undefined;
        }
    };
    return skyLine;
});
