define(['./Container', '../3DGIS/clip'],function(Container,clip){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var parent;
    var sceneModel;
    var htmlStr = [
        '<main style="position : absolute;right: 0px; top : 10%;width: 300px;">',
        '<button style="top: 10px;position: absolute;right: 1rem;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<input id="clipTab2" type="radio" name="clipTab" checked>',
        '<label for="clipTab2" style="font-size: 13px">' + "Box裁剪" + '</label>',
        '<input id="clipTab3" type="radio" name="clipTab">',
        '<label for="clipTab3" style="font-size: 13px">' + "平面裁剪" + '</label>',

        '<section id="clipContent2">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
            '<div>',
                '<a class="ui blue ribbon label">参数设置</a><br>',
                '<p><span>长度：</span><input type="number" id="length" class="input clip-input" min="0" step="1" value="100" ><span>&nbsp;米</span></p>',
                '<p><span>宽度：</span><input type="number" id="width" class="input clip-input" min="0" step="1" value="100"><span>&nbsp;米</span></p>',
                '<p><span>高度：</span><input type="number" id="height" class="input clip-input" min="0"  step="1" value="100"><span>&nbsp;米</span></p>',
                '<p><span>旋转：</span><input type="number" id="rotate" class="input clip-input" min="0" max="360" step="1" value="0"><span>&nbsp;度</span></p>',
                '<a class="ui teal ribbon label">裁剪模式</a><br><br>',
                '<select id="clipMode" class="cesium-button" style="font-size: 12px;margin: 0px 0px -5px 0px;width: 90%">',
                '<option value="clip_behind_all_plane">带线框盒内裁剪</option>',
                '<option value="clip_behind_any_plane">带线框盒外裁剪</option>',
                '<option value="clip_behind_all_plane1">不带线框盒内裁剪</option>',
                '<option value="clip_behind_any_plane1">不带线框盒外裁剪</option>',
                '</select><br/><br/>',
                '<label><input type="checkbox" id="box-clip-can-move" style="vertical-align: middle;"/>&nbsp;<span style="vertical-align: middle;">支持Box移动</span></label>',
                '<input type="button" id="customDel" class="btn btn-info" style="float:right" value="清除">',
                '<input type="button" id="custom" class="btn btn-info" style="float:right" value="分析">',
           '</div>',
        ' </div>',
        '</section>',
        '<section id="clipContent3">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">第一点</a>',
        '<p><span>经度：</span><input type="number" id="plane-clip-point1-longitude" class="input clip-input" min="-180" max="180" step="0.0001" value="0" size="5"><span>&nbsp;度</span></p>',
        '<p><span>纬度：</span><input type="number" id="plane-clip-point1-latitude" class="input clip-input" min="-180" max="180" step="0.0001" value="0" size="5"><span>&nbsp;度</span></p>',
        '<p><span>高度：</span><input type="number" id="plane-clip-point1-height" class="input clip-input" step="1" value="0" size="5"><span>&nbsp;米</span></p>',
        '<a class="ui teal ribbon label clip-label">第二点</a>',
        '<p><span>经度：</span><input type="number" id="plane-clip-point2-longitude" class="input clip-input" min="-180" max="180" step="0.0001" value="0" size="5"><span>&nbsp;度</span></p>',
        '<p><span>纬度：</span><input type="number" id="plane-clip-point2-latitude" class="input clip-input" min="-180" max="180" step="0.0001" value="0" size="5"><span>&nbsp;度</span></p>',
        '<p><span>高度：</span><input type="number" id="plane-clip-point2-height" class="input clip-input" step="1" value="0" size="5"><span>&nbsp;米</span></p>',
        '<a class="ui green ribbon label">第三点</a>',
        '<p><span>经度：</span><input type="number" id="plane-clip-point3-longitude" class="input clip-input" min="-180" max="180" step="0.0001" value="0" size="5"><span>&nbsp;度</span></p>',
        '<p><span>纬度：</span><input type="number" id="plane-clip-point3-latitude" class="input clip-input" min="-180" max="180" step="0.0001" value="0" size="5"><span>&nbsp;度</span></p>',
        '<p><span>高度：</span><input type="number" id="plane-clip-point3-height" class="input clip-input" step="1" value="0" size="5"><span>&nbsp;米</span></p>',

        '<button  id="sectionDel"  class="btn btn-info" style="float:right">清除</button>',
        '<button  id="section"  class="btn btn-info"  style="float:right">分析</button><br><br>',

        '</section>',
    '</main>',
    ].join('');
    var clipForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #section'  : 'onSectionClk',
            'click #sectionDel'  : 'onSectionDelClk',
            'click #custom'  : 'onCustomClk',
            'click #customDel'  : 'onCustomDelClk',
            'change input[type=file]' : 'onInputChange'
        },
        template : _.template(htmlStr),
        initialize : function(options){
            sceneModel = options.sceneModel;
            viewer = options.sceneModel.viewer;
            parent = options.parent;
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
            });
            clip.init(viewer);
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
            clip.remove(viewer,sceneModel,true);
            clip.remove(viewer,sceneModel,false);

            return false;
        },
        onSectionClk : function(evt){
            clip.initializing(viewer,sceneModel,true);
        },
        onSectionDelClk : function(evt){
            clip.remove(viewer,sceneModel,true);
        },
        onCustomClk : function(evt){
            clip.initializing(viewer,sceneModel,false);
        },
        onCustomDelClk : function(evt){
            clip.remove(viewer,sceneModel,false);
        }
    });
    return clipForm;
});
