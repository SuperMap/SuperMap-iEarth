define(['./Container','Cesium','drag','slider','echartsMin','underscore','jquery'],function(Container,Cesium, drag, slider,echarts,_,$){
    "use strict";
    var viewer;
    var layers = [];
    var htmlStr = [
       '<div class="graphing" id="graphingForm" style="position: absolute;top: 55%;width:70%;height: 42%;z-index: 1; left:31%;cursor: auto;">',

        '<div style="float: left">',
        '<label style="float:left; text-align:left;font-size: 13px;color: lightgrey;">'+ "数据图表化" +'</label>',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<button style="top: 10px;position: absolute;left: 94%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="packUP" class="myModal-close" title="收起"><span aria-hidden="true">--</span></button>',
        '</div>',

        '<div id="graph" style="height: 90%;width: 27%; float: left" >',
        '</div>',
        '<div id="graph1" style="height: 98%;width: 27%; float: left">',
        '</div>',
        '<div id="graph2" style="height: 98%;width: 27%; float: left">',
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


                var dom = document.getElementById("graph");
                var myChart = echarts.init(dom);
                var base = +new Date(1968, 9, 3);
                var oneDay = 24 * 3600 * 1000;
                var date = [];
                var data = [Math.random() * 300];
                for (var i = 1; i < 20000; i++) {
                    var now = new Date(base += oneDay);
                    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                }
                var option = {
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    title: {
                        left: 'center',
                        text: '',
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    dataZoom: [{
                        type: 'inside',
                        start: 0,
                        end: 10
                    }, {
                        start: 0,
                        end: 10,
                        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                        handleSize: '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                            shadowOffsetX: 2,
                            shadowOffsetY: 2
                        }
                    }],
                    series: [
                        {
                            name:'模拟数据',
                            type:'line',
                            smooth:true,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(255, 70, 131)'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgb(255, 158, 68)'
                                    }, {
                                        offset: 1,
                                        color: 'rgb(255, 70, 131)'
                                    }])
                                }
                            },
                            data: data
                        }
                    ]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

                var dom1 = document.getElementById("graph1");
                var myChart1 = echarts.init(dom1);
                var option1 = {
                    angleAxis: {
                    },
                    radiusAxis: {
                        type: 'category',
                        data: ['周一', '周二', '周三', '周四'],
                        z: 10
                    },
                    polar: {
                    },
                    series: [{
                        type: 'bar',
                        data: [1, 2, 3, 4],
                        coordinateSystem: 'polar',
                        name: 'A',
                        stack: 'a'
                    }, {
                        type: 'bar',
                        data: [2, 4, 6, 8],
                        coordinateSystem: 'polar',
                        name: 'B',
                        stack: 'a'
                    }, {
                        type: 'bar',
                        data: [1, 2, 3, 4],
                        coordinateSystem: 'polar',
                        name: 'C',
                        stack: 'a'
                    }],
                    legend: {
                        show: true,
                        data: ['A', 'B', 'C']
                    }
                };
                myChart1.setOption(option1, true);

                var dom2 = document.getElementById("graph2");
                var myChart2 = echarts.init(dom2);
                var option2 = {
                    title : {
                        text: '',
                        subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['蒸发量','降水量']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'蒸发量',
                            type:'bar',
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                            markPoint : {
                                data : [
                                    {type : 'max', name: '最大值'},
                                    {type : 'min', name: '最小值'}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name:'降水量',
                            type:'bar',
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                            markPoint : {
                                data : [
                                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                                ]
                            },
                            markLine : {
                                data : [
                                    {type : 'average', name : '平均值'}
                                ]
                            }
                        }
                    ]
                };
                myChart2.setOption(option2, true);



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
