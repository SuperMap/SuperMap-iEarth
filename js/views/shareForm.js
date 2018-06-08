define(['./Container','Cesium','drag','slider','echartsMin'],function(Container,Cesium, drag, slider,echarts){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var htmlStr = [
        '<div class="graphing" id="skyForm" style="position: absolute;margin:auto; top: 0;left: 0;right: 0;bottom: 0;;width:600px;height: 250px;z-index: 9999;background-color: rgba(38, 38, 38, 0.75);">',
        '<label id="shareID" style="float:left; text-align:left;font-size: 13px;color: lightgrey;">'+ "三维场景分享" +'</label>',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeSkylineForm" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button><br><br>',
        '<div id="map" style="height:220px;margin: 20px" >',
        '<label>密钥共享</label>',
        '<input  id="profileAlt2" class="input" ><br><br>',
        '<label>嵌入网页</label>',
        '<input  id="profileAlt2" class="input"><br><br>',
        '</div>',
        '</div>'
    ].join('');
    var shareForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeSkylineForm'  : 'oncloseSkylineFormClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            this.sceneName = options.sceneName;
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
                document.getElementById('shareID').innerHTML = this.sceneName + "·三维场景分享";
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



    return shareForm;
});
