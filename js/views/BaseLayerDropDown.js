define(['./Container','../models/BaseLayerCollection','./ThumbGroup','iScroll'],function(Container,BaseLayerCollection,ThumbGroup,iScroll){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<div id="baseLayerGroup" >',
        '</div>',
        '<div>',
        '<div style="text-align : left;"><div class="squaredTwo" id="chkTerrain"><input type="checkbox" ><label class="check-icon"></label></div><label>' + Resource.stkTerrain + '</label></div>'
    ].join('');
    var Menu = Container.extend({
        template : _.template(htmlStr),
        tagName : 'div',
        events : {
        	'click #chkTerrain' : 'onChkTerrain',
            'touchstart #chkTerrain' : 'onChkTerrain'
        },
        initialize : function(options){
        	this.model = options.sceneModel;
        	this.isPCBroswer = options.isPCBroswer;
            var layerCollection = new BaseLayerCollection();
            var defaultBaseLayer = this.model.baseLayer;
            var thumbGroup = new ThumbGroup({
                collection : layerCollection,
                defaultBaseLayer : defaultBaseLayer,
                isPCBroswer : options.isPCBroswer,
                id : 'baselayerWraper'
            });
            this.thumbGroup = thumbGroup;
            if(!this.isPCBroswer){
            	thumbGroup.$el.css('white-space','normal');
            }
            var me = this;
            this.listenTo(thumbGroup, 'thumbClicked', function(model) {
                me.model.setBaseLayer(model);
                $('#baseLayerBtn').removeClass('open');
            });
            this.on('componentAdded',function(parent){

            	 layerCollection.fetch();
            	 if(me.model.isSTKTerrain){
                 	$('#chkTerrain input[type="checkbox"]').prop('checked',true);
                 }
            });
            this.render();
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.addClass('dropDown-container');
            var container = this.$('#baseLayerGroup');
            this.setContainerElement(container);
            container.append(this.thumbGroup.$el);
            return this;
        },
        onChkTerrain : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var chk = $(evt.target).prev();
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
            }
        	var isStkTerrain = chk[0].checked;
        	this.model.setTerrain(isStkTerrain);
        	$('#baseLayerBtn').removeClass('open');
        	if ( evt && evt.stopPropagation ) {
        		evt.stopPropagation();
        	}
        		 
        	else{
        		window.event.cancelBubble = true;
        	}
        }
    });
    return Menu;
});