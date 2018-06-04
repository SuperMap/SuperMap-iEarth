define(['../views/Container'],function(Container){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var htmlStr = [
        '<a id="portalOpen" class="btn btn-inverse" title="' + "存储" + '" style="width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
        '<span class="iconfont icon-yunduan1"></span>',
        '</a>'
    ].join('');
    var portalForm = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options) {
            this.model = options.sceneModel;
            viewer = options.sceneModel.viewer;;
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #portalOpen' : 'portalOpen'
        },
        portalOpen : function() {
            var me = this;
            if(me.savePortalForm){
                me.savePortalForm.$el.show();
                var that = viewer.scene;
                // that.postRender.addEventListener(function(){
                //     var buffer = that.context.readPixels({
                //         frameBuffer:that.fxaa._fbo
                //     });
                //     var canvas = document.getElementById("sceneCanvas");
                //     canvas.height = that.context.drawingBufferHeight;
                //     canvas.width = that.context.drawingBufferWidth;
                //     var ctx = canvas.getContext("2d");
                //     var imgData = ctx.createImageData(canvas.width,canvas.height);
                //     imgData.data.set(buffer);
                //     ctx.putImageData(imgData,0,0);
                //     var imagedata = ctx.getImageData(0,0,canvas.width,canvas.height);
                //     var W = imagedata.width;
                //     var H = imagedata.height;
                //     for(var i = 0;i < imagedata.height/2;++i){
                //         for(var j = 0;j < imagedata.width;++j){
                //             var x = i*4*imagedata.width + 4*j;
                //             var y = (imagedata.height-i)*4*imagedata.width + 4*j;
                //             var r = imagedata.data[x];
                //             var g = imagedata.data[x+1];
                //             var b = imagedata.data[x+2];
                //             var a = imagedata.data[x+3];
                //             imagedata.data[x] = imagedata.data[y];
                //             imagedata.data[x+1] = imagedata.data[y+1];
                //             imagedata.data[x+2] = imagedata.data[y+2];
                //             imagedata.data[x+3] = imagedata.data[y+3];
                //             imagedata.data[y] = r;
                //             imagedata.data[y+1] = g;
                //             imagedata.data[y+2] = b;
                //             imagedata.data[y+3] = a;
                //         }
                //     }
                //     ctx.clearRect(0,0,W,H);
                //     ctx.putImageData(imagedata,0,0);
                //     var t =  canvas.toDataURL("image/png",0.5);
                //     console.log(t)
                // });
                // that.postRender.removeEventListener();
            }
            else
            {
                require(['./portal/savePortalForm'],function(savePortalForm){
                    var savePortalForm = new savePortalForm({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(savePortalForm);
                    me.savePortalForm = savePortalForm;
                    savePortalForm.$el.show();
                });
            }
        }
    });
    return portalForm;
});
