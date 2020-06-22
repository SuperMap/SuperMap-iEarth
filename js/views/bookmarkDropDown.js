define(['./Container','../tools/Area'],function(Container,Area){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var scene;
    var index = 0;
    var htmlStr = [
           "<div class='btn-toolbar' id='pointsList' >",
               '<button type="button" id="viewPoint" class="btn btn-inverse">添加书签</button><br><br>',
            '</div>'
                   ].join('');
    var bookmarkDropDown = Container.extend({
        tagName : 'div',
        id : 'measureDropDown',
        template : _.template(htmlStr),
        events : {
        	'click #measureDisBtn' : 'onMeasureDisBtnClk',
            'click #viewPoint' : 'onViewPointBtnClk',
        },
        initialize : function(options){
        	this.sceneModel = options.sceneModel;
        	viewer = this.sceneModel.viewer;
            scene = viewer.scene;
        	this.render();
            this.on('componentAdded',function(parent){
            });
        },
        render : function(){
        	this.$el.html(this.template());
        	this.$el.addClass('dropDown-container');
        	this.$el.css('min-width','180px');
            return this;
        },
        onViewPointBtnClk : function(evt){
            index++;
            var lonR = viewer.camera.positionCartographic.longitude;
            var latR = viewer.camera.positionCartographic.latitude;
            var height = viewer.camera.positionCartographic.height;
            var lonD = Cesium.Math.toDegrees(lonR).toFixed(4);
            var latD = Cesium.Math.toDegrees(latR).toFixed(4);
            var heading = viewer.camera.heading.toFixed(4);
            var pitch = viewer.camera.pitch.toFixed(4);
            var html = "<div id='location"+ index.toString() +"'><span class='fui-eye' style='margin: 10px;'></span><label style='width:50%'>书签"+ index +"</label></div>"
            $("#pointsList").append(html);
            var location;
            location = "#location" + index.toString();
            $(location).click(function(){
                scene.camera.setView({
                    destination : new Cesium.Cartesian3.fromDegrees(parseFloat(lonD), parseFloat(latD),height),
                    orientation : {
                        heading : parseFloat(heading),
                        pitch : parseFloat(pitch),
                        roll : 6.283185307179563
                    }
                });
            })
        }
    });
    return bookmarkDropDown;
});