define(['backbone','jquery'],function(Backbone,$){
    var _ = require('underscore');
    var htmlStr = [
        '<div class="service-itemIcon">',
        '<img src="<%- thumbnail %>" title="<%- title%>">',
        '<div class="service-itemAttr">',
        '<div class="service-itemBg"></div>',
        '<div class="service-itemUnSelected"><span class="fui-check"></span></div>',
        '</div>',
        '</div>',
        '<div class="service-itemLabel"><%- title%></div>'
    ].join('');
    var ThumbnailItem = Backbone.View.extend({
        template : _.template(htmlStr),
        tagName : 'div',
        className : 'service-item',
        events : {
            'click .service-itemIcon' : 'onThumbnailClk'
        },
        initialize : function(options){
            this.model = options.model;
            this.isSingle = options.isSingle;
        },
        render : function(){
            var json = this.model.toJSON();
            this.$el.html(this.template(json));
            this.iconEl = this.$('.service-itemIcon');
            this.labelEl = this.$('.service-itemLabel');
            var $img = this.$('img');
            $img.one('error', function() {
                $img.attr('src', './images/thumbnail.jpg');
            });
            return this;
        },
        onThumbnailClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var $el = this.$el.find('.service-itemUnSelected');
        	if(this.isSingle){
        		if(this.iconEl.hasClass('service-itemIcon-selected')){
        			return;
        		}
        		this.$el.parent().find('.service-itemIcon-selected').removeClass('service-itemIcon-selected');
        		this.$el.parent().find('.service-itemSelected').removeClass('service-itemSelected');
        		this.iconEl.removeClass('service-itemIcon-selected').addClass('service-itemIcon-selected');
        	}
        	$el.removeClass('service-itemSelected').addClass('service-itemSelected');
            this.trigger('thumbClicked', this.model);
            return false;
        }
    });
    return ThumbnailItem;
});