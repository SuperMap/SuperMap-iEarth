define(['./Container', '../lib/AqiService','../lib/splitSrc','../lib/animation'],function(Container, AqiService,splitSrc,animationLand){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        "<div class='btn-toolbar'>",
        "<div class='btn-group' style='margin: 5px 5px 5px 8px;'>",
        '<a id="btnAqi" class="btn btn-inverse" title="' + Resource.aqiTitle + '" style="margin: 5px;">',
        '<span class="smicon-pm"></span>',
        '</a>',
        '<a id="btnSplit" class="btn btn-inverse" title="' + Resource.splitSrc + '" style="margin: 5px;">','<span class="smicon-split"></span>',
        '</a>',
        '<a id="btnAnimation" class="btn btn-inverse" title="' + Resource.animationLand + '" style="margin: 5px;">','<span class="smicon-animt"></span>',
        '</a>',
        "</div>",
        "</div>",
        "<div id='visTitle' class='vis-title'>" + Resource.visualization + "</div>"
    ].join('');
    var visualization = Container.extend({
        tagName : 'div',
        id : 'visualization',
        template : _.template(htmlStr),
        initialize : function(options) {
            this.viewer = options.sceneModel.viewer || null;
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            this.$el.addClass('dropDown-container');
            this.$el.css('min-width','435px');
            return this;
        },
        events : {
            'click #btnAqi' : 'onBtnAqiClk',
            'click #btnSplit' : 'onBtnSplitClk',
            'click #btnAnimation' : 'onBtnAnimationClk'
        },
        onBtnAqiClk : function(){
            $("#visTitle").html(Resource.aqiTitle);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = this.$el.find('span.smicon-pm');
            if(AqiService.isStart == false){
                AqiService.start(viewer);
                spanEl && spanEl.removeClass('smicon-pm-selected').addClass('smicon-pm-selected');
            }
            else{
                AqiService.remove(viewer);
                spanEl && spanEl.removeClass('smicon-pm-selected');
            }

        },
        onBtnSplitClk : function(){
            $("#visTitle").html(Resource.splitSrc);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = this.$el.find('span.smicon-split');
            if(splitSrc.isStart == false){
                splitSrc.start(viewer);
                spanEl && spanEl.removeClass('smicon-split-selected').addClass('smicon-split-selected');
            }
            else{
                splitSrc.remove(viewer);
                spanEl && spanEl.removeClass('smicon-split-selected');
            }
        },
        onBtnAnimationClk : function(){
            $("#visTitle").html(Resource.animationLand);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = this.$el.find('span.smicon-animt');
            if(animationLand.isStart == false){
                animationLand.start(viewer);
                spanEl && spanEl.removeClass('smicon-animt-selected').addClass('smicon-animt-selected');
            }
            else{
                animationLand.remove(viewer);
                spanEl && spanEl.removeClass('smicon-animt-selected');
            }

        }
    });
    return visualization;
});