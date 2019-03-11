define(['./Container', '../lib/AqiService'],function(Container, AqiService){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
                   '<a id="btnAqi" class="btn btn-inverse" title="' + Resource.aqiTitle + '" style="width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
                   '<span class="smicon-pm"></span>',
                   '</a>'
               ].join('');
    var AqiQuery = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options) {
            this.viewer = options.sceneModel.viewer || null;
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #btnAqi' : 'onBtnAqiClk'
        },
        onBtnAqiClk : function(){
        	var viewer = this.viewer;
        	var spanEl = this.$el.find('span.smicon-pm');
        	if(AqiService.isStart == false){
        		AqiService.start(viewer);
        		spanEl && spanEl.removeClass('smicon-pm-selected').addClass('smicon-pm-selected');
        	}
        	else{
        		AqiService.remove(viewer);
        		spanEl && spanEl.removeClass('smicon-pm-selected');
        	}
        	
        }
    });
    return AqiQuery;
});
