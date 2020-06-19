define(['echarts'],function(echarts) {
    var animationLand = function () {
    };
    var imageryLayers;
    animationLand.isStart = false;
    animationLand.start = function (viewer) {
        if (animationLand.isStart == true) {
            return;
        }
        animationLand.isStart = true;
        var scene = viewer.scene;
        if(scene.globe.enableLighting){
            scene.globe.enableLighting = !scene.globe.enableLighting;
        }

        scene.skyBox.show = !scene.skyBox.show;
        scene.sun.show = false;
        scene.moon.show = false;

        viewer.animation.container.style.visibility='visible';
        viewer.timeline.container.style.visibility='visible';
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var clock=viewer.clock;
        var viewModel = {
            days: 0
        };
        var defaultDays = 7;
        Cesium.knockout.track(viewModel);
        var toolbar = document.getElementById('toolbar2');
        toolbar.style.display='block';
        document.getElementById("tempStatis").style.display='block';
        Cesium.knockout.applyBindings(viewModel, toolbar);

        function subscribeLayerParameter(name) {
            Cesium.knockout.getObservable(viewModel, name).subscribe(
                function(newValue) {
                    if(clock){
                        clock.multiplier = 1*60*60*24*newValue;
                    }
                }
            );
        }
        subscribeLayerParameter('days');
        viewModel.days = defaultDays;

        ///////////////////////////////
        var startDay = new Date("1 2,2006");
        var endDay = new Date("12 30,2016");
        var startTime = Cesium.JulianDate.fromDate(startDay);
        var stopTime = Cesium.JulianDate.fromDate(endDay);
        clock.startTime=startTime;
        clock.currentTime=startTime;
        clock.stopTime=stopTime;
        clock.multiplier=1*60*60*24*defaultDays;

        var timeline = viewer.timeline;
        timeline.zoomTo(startTime,stopTime);
        clock = viewer.clock;
        ///////////////////////////
        var dateArray = [];

        var myChart = echarts.init(document.getElementById("tempStatis"));
        for(var i = 2006;i<2017;i++){
            for (var j=1;j<13;j++){
                dateArray.push(i.toString() + "." + j.toString());
            }
        }
        var itemStyle = {
            normal: {
                color:'rgba(204, 65, 169, 0.8)'
            }
        };

        var tempArray = [
            0.708,1.235,0.99,0.712,0.431,0.917,0.635,0.985,0.769,1.03,0.832,1.348,1.995,1.03,1.167,1.476,1.164,0.793,0.813,0.843,0.83,1.073,0.969,0.872,0.262,0.383,1.59,0.939,0.69,0.619,0.767,0.68,0.691,1.134,1.092,0.737,1.104,0.895,0.757,0.991,0.755,0.678,0.828,0.749,1.047,0.866,0.896,0.662,1.149,1.191,1.415,1.309,1.055,0.88,0.803,0.86,0.764,1.184,1.362,0.647,0.7,0.549,0.7,2,1.141,0.633,0.852,1.076,1.096,0.806,1.09,0.69,1.029,0.573,0.435,0.699,1.329,1.231,0.972,0.661,0.803,0.905,1.162,1.025,0.45,1.093,1.023,0.939,0.692,0.84,1.041,0.588,0.836,1.034,0.987,1.295,1.071,1.144,0.3,1.057,1.237,1.213,0.812,0.458,0.967,0.976,1.057,0.575,1.193,1.296,1.463,1.428,0.965,0.965,0.977,0.637,0.839,0.869,1.494,1.287,1.789,1.618,2.186,2.137,1.805,1.253,0.846,0.89,1.375,1.008,1.002,1.089,1.261];
        var option = {
            grid: {
                left: '12%',
                right: '110'
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : dateArray,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff'
                        },
                        formatter: '{value}'
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel : {
                        textStyle: {
                            color: '#ffffff'
                        },
                        formatter: '{value}'
                    },
                    nameTextStyle: {
                        color: '#ccc',
                        fontSize: 18
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    splitLine: {
                        show: false
                    }

                }
            ],
            series : [
                {
                    name:'当前',
                    type:'scatter',
                    symbolSize: 8,
                    data:[["2006.1",0.708]],
                    itemStyle:itemStyle
                },
                {
                    name:'温差',
                    type:'line',
                    data:tempArray,
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };

        myChart.setOption(option);
        ///////////////////////////


        /////////////////////////////////////////////////
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewer.scene.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(116.46, 39.92, 6378137*3),
            duration : 0.1
        });
        imageryLayers = viewer.imageryLayers;
        var p0 = new Cesium.SingleTileImageryProvider({
            url : 'http://support.supermap.com.cn:8090/webgl/data/LandTemperature/2006.1.jpg'
        });
        var p1 = new Cesium.SingleTileImageryProvider({
            url : 'http://support.supermap.com.cn:8090/webgl/data/LandTemperature/2006.2.jpg'
        });
        var layer0 = imageryLayers.addImageryProvider(p0);
        var layer1 = imageryLayers.addImageryProvider(p1);
        layer1.alpha = 0;
        document.getElementById('year').textContent='YEAR: 2006';
        document.getElementById('month').textContent='MONTH: 1';
        ////////////////////////////////////////////////

        var currentMonth = 1;
        viewer.animation.viewModel.dateFormatter = function(date, viewModel) {
            var gregorianDate = Cesium.JulianDate.clone(clock.currentTime);
            var currentTime = Cesium.JulianDate.toGregorianDate(gregorianDate);
            var nY = currentTime.year;
            var nM = currentTime.month;
            var nD = currentTime.day;

            if(layer0.alpha >= 0 ) {
                var alpha = nD/30;
                layer0.alpha = 1 - alpha;
                layer1.alpha = alpha;
            }
            if(currentMonth != nM) {
                updateLayers(nY,nM);
                currentMonth = nM;
            }

            var strIndex = nY + "." + nM;
            var value = tempArray[(nY-2006) * 12 + nM - 1];
            document.getElementById('year').textContent='YEAR: '+nY;
            document.getElementById('month').textContent='MONTH: '+nM;
            myChart.addData([
                [
                    0,        // 系列索引
                    [strIndex,value], // 新增数据
                    false,     // 新增数据是否从队列头部插入
                    false
                ]
            ]);
            return monthNames[currentTime.month - 1] + ' ' + currentTime.day + ' ' + currentTime.year;
        };
        function updateLayers(nY,nM) {
            var urlNew = 'http://support.supermap.com.cn:8090/webgl/data/LandTemperature/' + nY + "." + nM + ".jpg";
            var pNew = new Cesium.SingleTileImageryProvider({
                url :urlNew
            });
            var layerNew = imageryLayers.addImageryProvider(pNew);
            imageryLayers.remove(layer0);
            layer0 = layer1;
            layer0.alpha = 1;
            layer1 = layerNew;
            layer1.alpha = 0;
        }
    };
    animationLand.remove = function(viewer){
        viewer.animation.container.style.visibility='hidden';
        viewer.timeline.container.style.visibility='hidden';
        document.getElementById('toolbar2').style.display='none';
        document.getElementById("tempStatis").style.display='none';
        viewer.imageryLayers.removeAll();
        Cesium.knockout.cleanNode(document.getElementById('toolbar2'));
        viewer.animation.viewModel.dateFormatter = function () {
        };
        viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: './images/baseImage.png'
        }));
        viewer.scene.globe.depthTestAgainstTerrain = true;
        animationLand.isStart = false;
        viewer.clock.multiplier=1;
        var scene = viewer.scene;
        scene.skyBox.show = !scene.skyBox.show;
        scene.sun.show = true;
        scene.moon.show = true;
    };
    return animationLand;
});
