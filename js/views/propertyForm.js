define(['./Container', '../3DGIS/SpatialProperty'],function(Container,SpatialProperty){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
       '<div class="property" id="propertyForm" style="position: absolute;top: 10%;width:320px;;z-index: 1; right:0;cursor: auto;">',
        '<div>',
        '<label style="text-align: left;margin-bottom: 10px;margin-top: -10px;font-size: 13px;color: lightgrey;">'+ "空间查询" +'</label>',
        '<button style="top: 10px;position: absolute;left: 90%;" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '</div>',
        '<div>',
        '<label  style="font-size:13px">数据服务URL：</label>',
        '<input id="urlName" style="color: green;border: green 1px solid;background-color: transparent;width: 100%"/>',
        '<label  style="font-size:13px">数据源名称：</label>',
        '<input id="dataSource" style="color: green;border: green 1px solid;background-color: transparent;width: 100%"/>',
        '<label  style="font-size:13px">数据集名称：</label>',
        '<input id="dataSet" style="color: green;border: green 1px solid;background-color: transparent;width: 100%"/><br><br>',
        '</div>',
        '<div class="ui large buttons" style="">',
        '<button class="ui button" id="spatialQuery" style="float: right">启动查询</button>',
        '<div class="or"></div>',
        '<button class="ui button" id="graphing " style="float: right">数据图表</button>',
        '</div>',
       '</div>'
    ].join('');
    var parent;
    var propertyForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #spatialQuery'  : 'onSpatialQueryClk',
            'click #graphing'  : 'onGraphingClk',
            'change input[type=file]' : 'onInputChange'
        },
        template : _.template(htmlStr),
        initialize : function(options){
            this.viewer = options.sceneModel.viewer;
            parent = options.parent;
            this.render();
            this.on('componentAdded',function(parent){
                $('#propertyForm').myDrag({
                    parent:'body',
                    randomPosition:false,
                    direction:'all',
                    handler:false,
                    dragStart:function(x,y){},
                    dragEnd:function(x,y){},
                    dragMove:function(x,y){}
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
        onSpatialQueryClk : function(evt){
            SpatialProperty.initializing(this.viewer,parent,$("#urlName").val(),$("#dataSource").val(),$("#dataSet").val());
        },
        onGraphingClk : function(evt){
            if(parent.graphingForm){
                parent.graphingForm.$el.show();
            }else{
                require(['views/graphingForm'], function (graphingForm) {
                    var graphingForm = new graphingForm({
                        sceneModel: parent.model,
                        isPCBroswer: parent.isPCBroswer
                    });
                    parent.parent.addComponent(graphingForm);
                    parent.propertyForm = graphingForm;
                    graphingForm.$el.show();
                });
            }
        }
    });
    return propertyForm;
});
