define(['backbone','jquery','../models/MarkerModel','../models/KmlLayerModel'],function(Backbone,$,MarkerModel,KmlLayerModel){
	"use strict";
    var _ = require('underscore');
    var htmlStr = `
        <div id="tools" style="text-align : right">
            <span style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">对象属性</span>
            <span class="fui-export" id="bubblePosition" style="color: darkgrey; padding:5px" title="停靠"></span>
            <span class="fui-cross" title="关闭" id="bubbleClose" style="color: darkgrey;padding:5px"></span>
        </div>
        <div style="overflow-y:scroll;height:150px" id="tableContainer">
            <table id="tab"></table>
        </div>
    `;
	var Bubble = Backbone.View.extend({
        tagName: 'div',
        id: 'bubble',
        className: 'bubble',
        template : _.template(htmlStr),
        events : {
            'click #bubblePosition' : 'onBubblePositionClk',
            'click #bubbleClose': 'onBubbleColseClk'
        },
        initialize : function(options) {
            this.model = options.sceneModel;
            this.render();
        },
        render : function() {
        	this.$el.html(this.template());
            return this;
        },
        onBubblePositionClk: function(){
            if ($("#bubblePosition").hasClass("fui-export")) {
                this.model.viewer.customInfobox = undefined;
                $("#bubble").removeClass("bubble").addClass("float");
                $("#bubblePosition").removeClass("fui-export").addClass("fui-bubble");
                $("#bubblePosition")[0].title = "悬浮";
                $("#bubble").css({'left': '82%', 'bottom': '45%'});
                $("#tableContainer").css({'height': '350px'});
            }
            else if ($("#bubblePosition").hasClass("fui-bubble")) {
                $("#bubble").removeClass("float").addClass("bubble");
                $("#bubblePosition").removeClass("fui-bubble").addClass("fui-export");
                $("#bubblePosition")[0].title = "停靠";
                $("#tableContainer").css({'height': '150px'});
                this.model.viewer.customInfobox = this.el;
            }
        },
        onBubbleColseClk: function(){
            $("#bubble").hide();
        }
	});
	return Bubble;
});