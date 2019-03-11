define(['./Container','Cesium','drag','slider','echartsMin','underscore','jquery'],function(Container,Cesium, drag, slider,echarts,_,$){
    "use strict";
    var viewer;
    var layers = [];
    var dataset;
    var dataX = [];
    var dataY = [];
    var dataZ = [];
    var x_axis = "";
    var y_axis = "";
    var z_axis = "";
    var htmlStr = [
       '<div class="graphing" id="graphingForm" style="position: absolute;top: 10%;width:350px;height:600px;z-index: 1; left: 0px;cursor: auto;">',
        '<div style="float: left">',
        '</div>',
        '<div>',
        '<div id="graph" style="height: 300px;width: 300px;" >还未选择统计字段</div>',
        '<select id="graphXSelect"></select>',
        '<select id="graphYSelect"></select>',
        '<select id="graphZSelect"></select>',
        '</div>',
        '<div id="graph1" style="height: 300px;width: 300px;"></div>',
        '</div>',
       '</div>'
    ].join('');
    var graphingForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #custom'  : 'onCustomClk',
            'change input[type=file]' : 'onInputChange'
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            dataset = options.dataset;
            for(var i = 0; i < options.sceneModel.layers.models.length; i++){
                layers.push(options.sceneModel.layers.models[i].layer);
            }
            this.render();
            this.on('componentAdded',function(parent){
                $('#graphingForm').myDrag({
                    parent:'body',
                    randomPosition:false,
                    direction:'all',
                    handler:false,
                    dragStart:function(x,y){},
                    dragEnd:function(x,y){},
                    dragMove:function(x,y){}
                });
                $("#packUP").on("click",function () {
                    $("#graphingForm").slideUp(500);
                })
                for(var j = 0;j < dataset.originResult.features[0].fieldNames.length;j++){
                    var optionX = document.createElement('option');
                    var optionY = document.createElement('option');
                    var optionZ= document.createElement('option');
                    var field = dataset.originResult.features[0].fieldNames[j];
                    if(j == 0){
                        var optionX0 = document.createElement('option');
                        var optionY0 = document.createElement('option');
                        var optionZ0= document.createElement('option');
                        optionX0.textContent = "----X轴字段选择----";
                        optionY0.textContent = "----Y轴字段选择----";
                        optionZ0.textContent = "----Z轴字段选择----";
                        document.getElementById("graphXSelect").appendChild(optionX0);
                        document.getElementById("graphYSelect").appendChild(optionY0);
                        document.getElementById("graphZSelect").appendChild(optionZ0);
                    }
                    optionX.textContent = field;
                    optionY.textContent = field;
                    optionZ.textContent = field;
                    document.getElementById("graphXSelect").appendChild(optionX);
                    document.getElementById("graphYSelect").appendChild(optionY);
                    document.getElementById("graphZSelect").appendChild(optionZ);
                }
                var dom = document.getElementById("graph");
                var myChart = echarts.init(dom);
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    toolbox: {
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: 'X轴',
                            data: dataX,
                            axisPointer: {
                                type: 'shadow'
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: 'Y轴',
                            data: dataY,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                        },
                        {
                            type: 'value',
                            min: 0,
                            max: 25,
                            interval: 5,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name:x_axis,
                            type:'bar',
                            data:dataX
                        },
                        {
                            name:y_axis,
                            type:'bar',
                            data:dataY
                        },
                        {
                            name:z_axis,
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                        }
                    ]
                };
                myChart.setOption(option);


                var dom1 = document.getElementById("graph1");
                var myChart1 = echarts.init(dom1);
                var option1 = {
                    xAxis: {
                        scale: true,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    yAxis: {
                        scale: true,
                          axisLabel: {
                                show: true,
                                textStyle: {
                                color: '#fff'
                                }
                            }
                    },
                    series: [{
                        type: 'effectScatter',
                        symbolSize: 20,
                        data: [
                            [172.7, 105.2],
                            [153.4, 42]
                        ]
                    }, {
                        type: 'scatter',
                        data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                            [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                            [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                            [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                            [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                            [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                            [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                            [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                            [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                            [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                            [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                            [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                            [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                            [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                            [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                            [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                            [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                            [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                            [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                            [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                            [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                            [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                            [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                            [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                            [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                            [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                            [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                            [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                            [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                            [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                            [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                            [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                            [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                            [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                            [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                            [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                            [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
                        ],
                    }]
                };
                myChart1.setOption(option1);


                $('#graphXSelect').change(function(){
                    x_axis = $("#graphXSelect option:selected").text();
                    for(var k = 0;k < dataset.result.features.length;k++){
                        dataX[k] =parseFloat(dataset.result.features[k].data[x_axis]);
                    }
                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                name: 'X轴',
                                data: dataX,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: 'Y轴',
                                data: dataY,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: 25,
                                interval: 5,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            }
                        ],
                        series: [
                            {
                                name:x_axis,
                                type:'bar',
                                data:dataX
                            },
                            {
                                name:y_axis,
                                type:'bar',
                                data:dataY
                            },
                            {
                                name:z_axis,
                                type:'line',
                                yAxisIndex: 1,
                                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                            }
                        ]
                    };
                    myChart.setOption(option);
                });
                $('#graphYSelect').change(function(){
                    var y_axis = $("#graphYSelect option:selected").text();
                    for(var k = 0;k < dataset.result.features.length;k++){
                        dataY[k] =parseFloat(dataset.result.features[k].data[y_axis]);
                    }
                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                name: 'x-axis',
                                data: dataX,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: 'y-axis',
                                data: dataY,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            },
                            {
                                type: 'value',
                                min: 0,
                                max: 25,
                                interval: 5,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            }
                        ],
                        series: [
                            {
                                name:x_axis,
                                type:'bar',
                                data:dataX
                            },
                            {
                                name:y_axis,
                                type:'bar',
                                data:dataY
                            },
                            {
                                name:z_axis,
                                type:'line',
                                yAxisIndex: 1,
                                data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                            }
                        ]
                    };
                    myChart.setOption(option);


                });
                $('#graphZSelect').change(function(){
                    var z_axis = $("#graphZSelect option:selected").text();
                    for(var k = 0;k < dataset.result.features.length;k++){
                        dataZ[k] =parseFloat(dataset.result.features[k].data[z_axis]);
                    }
                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                name: 'x-axis',
                                data: dataX,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: 'y-axis',
                                data: dataY,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            },
                            {
                                type: 'value',
                                data: dataZ,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                            }
                        ],
                        series: [
                            {
                                name:x_axis,
                                type:'bar',
                                data:dataX
                            },
                            {
                                name:y_axis,
                                type:'bar',
                                data:dataY
                            },
                            {
                                name:z_axis,
                                type:'line',
                                data:dataZ
                            }
                        ]
                    };
                    myChart.setOption(option);


                });

            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        },
        onCustomClk : function(evt){
            clip.initializing(viewer,layers);
        }
    });
    return graphingForm;
});
