define(['./Container', '../lib/viewshed3D','../lib/skyline','../lib/shadowQuery','../lib/sightline'],function(Container, viewshed,skyLine,shadow,sgline){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewShedInit, skylineInit, shadowInit, sgInit;
    var htmlStr = [
        "<div class='btn-toolbar'>",
        "<div class='btn-group' style='margin: 5px 5px 5px 8px;'>",
        '<a id="btnViewShed" class="btn btn-inverse" title="' + Resource.viewShed + '" style="margin: 5px;">',
        '<span class="smicon-viewShed"></span>',
        '</a>',
        '<a id="btnShadow" class="btn btn-inverse" title="' + Resource.shadow + '" style="margin: 5px;">','<span class="smicon-shadow"></span>',
        '</a>',
        '<a id="btnSkyline" class="btn btn-inverse" title="' + Resource.skyline + '" style="margin: 5px;">','<span class="smicon-skyline"></span>',
        '</a>',
        '<a id="btnSightline" class="btn btn-inverse" title="' + Resource.sightline + '" style="margin: 5px;">','<span class="smicon-sightline"></span>',
        '</a>',
        "</div>",
        "</div>",
        "<div id='analysisTitle' class='analysis-title'>" + Resource.analysis + "</div>",
        '</div>'
    ].join('');
    var analysis = Container.extend({
        tagName : 'div',
        id : 'analysis',
        template : _.template(htmlStr),
        initialize : function(options) {
            this.viewer = options.sceneModel.viewer || null;
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            this.$el.addClass('dropDown-container');
            this.$el.css('min-width','335px');
            return this;
        },
        events : {
            'click #btnViewShed' : 'onBtnViewShedClk',
            'click #btnShadow' : 'onBtnShadowClk',
            'click #btnSkyline' : 'onBtnSkylineClk',
            'click #btnSightline' : 'onBtnSightlineClk'
        },
        onBtnViewShedClk : function(){
            $("#analysisTitle").html(Resource.viewShed);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = $("#btnViewShed");
            if(viewshed.isStart == false){
                shadow.remove(viewer);
                skyLine.remove(viewer);
                sgline.remove(viewer);
                viewshed.start(viewer);
                if (!viewShedInit){
                    viewshed.initializing(viewer);
                    viewShedInit = true; 
                }
                $(".btn-inverse-selected").removeClass('btn-inverse-selected');
                spanEl && spanEl.addClass('btn-inverse-selected');
            }
            else{
                viewshed.remove(viewer);
                spanEl && spanEl.removeClass('btn-inverse-selected');
            };
            return false;
        },
        onBtnShadowClk : function(){
            $("#analysisTitle").html(Resource.shadow);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = $("#btnShadow");
            if(shadow.isStart == false){
                viewshed.remove(viewer);
                skyLine.remove(viewer);
                sgline.remove(viewer);
                shadow.start(viewer);
                if(!shadowInit){
                    shadow.initializing(viewer);
                    shadowInit = true;
                }
                $(".btn-inverse-selected").removeClass('btn-inverse-selected');
                spanEl && spanEl.addClass('btn-inverse-selected');
            }
            else{
                shadow.remove(viewer);
                spanEl && spanEl.removeClass('btn-inverse-selected');
            };
            return false;
        },
        onBtnSkylineClk : function(){
            $("#analysisTitle").html(Resource.skyline);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = $("#btnSkyline");
            if(skyLine.isStart == false){
                shadow.remove(viewer);
                viewshed.remove(viewer);
                sgline.remove(viewer);
                skyLine.start(viewer);
                if(!skylineInit){
                    skyLine.initializing(viewer);
                    skylineInit = true;
                }
                $(".btn-inverse-selected").removeClass('btn-inverse-selected');
               spanEl && spanEl.addClass('btn-inverse-selected');
            }
            else{
                skyLine.remove(viewer);
                spanEl && spanEl.removeClass('btn-inverse-selected');
            };
            return false;
        },
        onBtnSightlineClk : function(){
            $("#analysisTitle").html(Resource.sightline);
            var viewer = this.viewer;
            viewer.entities.removeAll();
            var spanEl = $("#btnSightline");
            if(sgline.isStart == false){
                shadow.remove(viewer);
                viewshed.remove(viewer);
                skyLine.remove(viewer);
                sgline.start(viewer);
                if(!sgInit){
                    sgline.initializing(viewer);
                    sgInit = true;
                }
                $(".btn-inverse-selected").removeClass('btn-inverse-selected');
                spanEl && spanEl.addClass('btn-inverse-selected');
            }
            else{
                sgline.remove(viewer);
                spanEl && spanEl.removeClass('btn-inverse-selected');
            };
            return false;
        }
    });
    return analysis;
});