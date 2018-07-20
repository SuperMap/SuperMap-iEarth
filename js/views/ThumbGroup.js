define(['./Container','jquery','./ThumbnailItem'],function(Container,$,ThumbnailItem){
    var _ = require('underscore');
    var ThumbGroup = Container.extend({
        tagName : 'div',
        className : 'service-items',
        initialize : function(options){
        	this.isPCBroswer = options.isPCBroswer;
        	this.el.id = options.id;
            this.collection = options.collection;
            this.defaultBaseLayer = options.defaultBaseLayer;
            this.collection.on("reset", this.render, this);
        },
        render : function(){
            var me = this;
            var defaultBaseLayer = this.defaultBaseLayer;
            me.$el.empty();
            var $wraper = $('<div>');
            me.$el.append($wraper);
            var isSingle = this.defaultBaseLayer ? true : false;
            this.collection.each(function(item, idx) {
                var thumbnail = new ThumbnailItem({
                    model : item,
                    isSingle : isSingle
                });
                me.listenTo(thumbnail, 'thumbClicked', function(model) {
                    me.trigger('thumbClicked', model);
                });
                $wraper.append(thumbnail.render().$el);
                if(defaultBaseLayer && defaultBaseLayer.get('type') == item.get('type')){
                	thumbnail.iconEl.addClass('service-itemIcon-selected');
                	thumbnail.$el.find('.service-itemUnSelected').removeClass('service-itemSelected').addClass('service-itemSelected');
                }
            });
        }
    });
    return ThumbGroup;
});