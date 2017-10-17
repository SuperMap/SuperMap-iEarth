define(['./Container','jquery'],function(Container,$){
	var htmlStr = [
	    '<ul id="progress">',
	    '<li><div id="layer1" class="ball"></div><div id="layer7" class="pulse"></div></li>',
        '<li><div id="layer2" class="ball"></div><div id="layer8" class="pulse"></div></li>',
        '<li><div id="layer3" class="ball"></div><div id="layer9" class="pulse"></div></li>',
        '<li><div id="layer4" class="ball"></div><div id="layer10" class="pulse"></div></li>',
        '<li><div id="layer5" class="ball"></div><div id="layer11" class="pulse"></div></li>',
        '</ul>'
    ].join('');
	var _ = require('underscore');
    var LoadingProgess = Container.extend({
    	template : _.template(htmlStr),
        tagName : 'div',
        className : 'progessContainer',
        initialize : function(options){
        	this.render();
        },
        render : function(){
        	this.$el.html(this.template());
            return this;
        },
        start : function(){
        	this.$el.removeClass("progress-hide").addClass("progress-show");
        	$('#progress').removeClass('running').addClass('running');
        },
        stop : function(){
        	$('#progress').removeClass('running');
        	this.$el.removeClass("progress-show").addClass("progress-hide");
        }
    });
    return LoadingProgess;
});