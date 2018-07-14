define(['./Container', '../3DGIS/SpatialProperty'],function(Container,SpatialProperty){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
       '<div class="property mainView" id="propertyForm" style="position: absolute;width:320px;;z-index: 1;cursor: auto">',
        '<div class="adaptation">',
        '<div>',
        '<label style="text-align: left;margin-bottom: 10px;margin-top: -10px;font-size: 13px;color: lightgrey;">'+ "空间查询" +'</label>',
        '<button style="top: 10px;position: absolute;right: 1rem;" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '</div>',
        '<div>',
        '<a class="ui tag label">数据服务URL</a><br>',
        '<input id="urlName" style="color: green;border: green 1px solid;background-color: transparent;width: 100%;margin-top: 10px"/>',
        '<label  style="font-size:13px">(与模型同步发布的iserver REST-数据服务地址)</label><br><br>',
        '<a class="ui red tag label">数据源数据集</a><br>',
        '<select id="dataSource" style="color: green;border: green 1px solid;background-color: transparent;width: 100%;margin-top: 10px">',
        '<option>-----选择数据源名称------</option>',
        '</select><br><br>',
        '<select id="dataSet" style="color: green;border: green 1px solid;background-color: transparent;width: 100%"><br><br>',
        '<option>-----选择数据集名称------</option>',
        '</select><br><br>',
        '<a class="ui teal tag label">空间字段</a><br>',
        '<p><span>经度：</span><select  id="dataLongitude" style="color: green;border: green 1px solid;background-color: transparent;width: 234px;margin-top: 10px"/></p>',
        '<p><span>纬度：</span><select  id="dataLatitude" style="color: green;border: green 1px solid;background-color: transparent;width: 234px"/></p>',
        '<p><span>高度：</span><select  id="dataHeight" style="color: green;border: green 1px solid;background-color: transparent;width: 234px"/></p>',
        '</div><br><br>',
        '<div class="ui large buttons" style="">',
        '<button class="ui button" id="spatialQuery" style="float: right;">启动查询</button>',
        '<div class="or"></div>',
        '<button class="ui button" id="spatialQueryDel" style="float: right">清理图表</button>',
        '</div>',
       '</div>',
    '<div>'
    ].join('');
    var parent;
    var propertyForm = Container.extend({
        tagName: 'div',
        id: 'spatialQueryForm',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #spatialQuery'  : 'onSpatialQueryClk',
            'click #spatialQueryDel'  : 'onSpatialQueryDelClk',
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
                $('#urlName').bind('keypress',function(event){
                    if(event.keyCode == 13)
                    {
                        var url =  $('#urlName').val()+"/datasources.xml";
                        $.ajax({
                            url: url,
                            dataType: 'xml',
                            type: 'GET',
                            async: false,
                            timeout: 3000,
                            error: function(xml){
                            },
                            success: function(xml){
                                $(xml).find("datasourceNames").each(function(i)                                {
                                    var id = $(this).children("id");
                                    var datasource = id.context.innerHTML;
                                    datasource = datasource.substring(0,datasource.length-12);
                                    datasource = datasource.substring(13,datasource.length);
                                    var option = document.createElement('option');
                                    option.textContent = datasource;
                                    document.getElementById("dataSource").appendChild(option);
                                });
                            }
                        });
                    }
                });
                $('#dataSource').change(function(){
                    var index = $("#dataSource option:selected").text();
                    var dataset = $('#urlName').val() + "/datasources/" + index + "/datasets.xml";
                    $.ajax({
                        url: dataset,
                        dataType: 'xml',
                        type: 'GET',
                        async: false,
                        timeout: 3000,
                        error: function(xml){
                        },
                        success: function(xml){
                            $(xml).find("string").each(function(i)                                {
                                var id = $(this).children("id");
                                var datasource = id.context.innerHTML;
                                var option = document.createElement('option');
                                option.textContent = datasource;
                                document.getElementById("dataSet").appendChild(option);
                            });


                        }
                    });

                });
                $('#dataSet').change(function(){
                    var index = $("#dataSet option:selected").text();
                    var dataset = $('#urlName').val() + "/datasources/" + $('#dataSource').val() + "/datasets/" + index + "/fields.xml";
                    $.ajax({
                        url: dataset,
                        dataType: 'xml',
                        type: 'GET',
                        async: false,
                        timeout: 3000,
                        error: function(xml){
                        },
                        success: function(xml){
                            $(xml).find("string").each(function(i)                                {
                                var id = $(this).children("id");
                                var datasource = id.context.innerHTML;                             ;
                                var option = document.createElement('option');
                                var option1 = document.createElement('option');
                                var option2 = document.createElement('option');
                                option.textContent = datasource;
                                option1.textContent = datasource;
                                option2.textContent = datasource;
                                document.getElementById("dataLongitude").appendChild(option);
                                document.getElementById("dataLatitude").appendChild(option1);
                                document.getElementById("dataHeight").appendChild(option2);
                            });
                        }
                    });

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
        onSpatialQueryDelClk : function(evt){
            SpatialProperty.remove(this.viewer);
    }
    });
    return propertyForm;
});
