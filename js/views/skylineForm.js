define(['./Container','Cesium','drag','slider','echartsMin'],function(Container,Cesium, drag, slider,echarts){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var htmlStr = [
        '<div class="graphing" id="skyForm" style="position: absolute;left : 5%; top : 50%;;width:330px;height: 250px;background-color: rgba(38, 38, 38, 0.75);">',
        '<label style="float:left; text-align:left;font-size: 13px;color: lightgrey;">'+ "二维天际线" +'</label>',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeSkylineForm" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<div id="map" style="height:220px;width: 280px;margin: 20px" >',
        '</div>'
    ].join('');

    var skylineForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeSkylineForm'  : 'oncloseSkylineFormClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;

            this.render();
            this.on('componentAdded',function(parent){
                $('#skyForm').myDrag({
                    parent:'body',
                    randomPosition:false,
                    direction:'all',
                    handler:false,
                    dragStart:function(x,y){},
                    dragEnd:function(x,y){},
                    dragMove:function(x,y){}
                });
                  var object = options.object;
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
                      ],
                      grid: {
                          left: '3%',
                          right: '3%',
                          bottom: '10%',
                          top : '10%',
                          containLabel: true
                      },
                  }
                  myChart.setOption(option);


            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        oncloseSkylineFormClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        },
    });



    return skylineForm;
});
