define(['./Container'],function(Container){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var htmlStr = [
   '<main style="position : absolute;left : 5%; top : 50%;width: 350px">',
       '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeScene" class="myModal-close" title=' + Resource.close + '><span aria-hidden="true">×</span></button><br><br>',
       '<canvas style="background-color:rgba(38, 38, 38, 0.0)" id="pro" height="0" width="0"></canvas>',
   '</main>',
    ].join('');
    var clipForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            var profile = options.profile;
            var buffer = options.buffer
            this.render();
            this.on('componentAdded',function(parent){
                $('main').each(function(index){
                    $(this).myDrag({
                        parent:'body',
                        randomPosition:false,
                        direction:'all',
                        handler:false,
                        dragStart:function(x,y){},
                        dragEnd:function(x,y){},
                        dragMove:function(x,y){}
                    });
                });

                var canvas = document.getElementById("pro");
                canvas.height = profile._textureHeight;
                canvas.width = profile._textureWidth;
                var ctx = canvas.getContext("2d");
                var imgData = ctx.createImageData(profile._textureWidth, profile._textureHeight);
                imgData.data.set(buffer);
                ctx.putImageData(imgData,0,0);
                $("#pro").width(300);
                $("#pro").height(150);
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
    });
    return clipForm;
});
