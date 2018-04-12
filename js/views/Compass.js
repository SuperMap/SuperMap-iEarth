define(['./Container', 'Cesium'],function(Container, Cesium){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
                   '<a id="btnCompass" title="' + Resource.compass + '" class="btn btn-inverse" style="width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
                   '<span id="compass" class="smicon-compass" style="transform : rotate(-45deg);display : inline-block;"></span>',
                   '</a>'
               ].join('');
    var Compass = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options){
            this.viewer = options.sceneModel.viewer;
            var scene = this.viewer.scene;
            scene.postRender.addEventListener(function(){
                var heading = scene.camera.heading;
                var x = Cesium.Math.toDegrees(heading) - 45;
                var degrees = "rotate(" + x + "deg)";
                $("#compass").css("transform", degrees);
            })
            this.render();
            this.$el.addClass('compass');
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #btnCompass' : 'reduceCompass'
        },
        reduceCompass : function(){
            var scene = this.viewer.scene;
            $("#compass").css("transform", "rotate(-45deg)");
            scene.camera.flyTo({
              destination : scene.camera.position,
              orientation : {
                  heading : Cesium.Math.toRadians(0)
              }
            });
        }
    });
    return Compass;
});
