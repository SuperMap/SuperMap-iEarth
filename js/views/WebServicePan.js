define(['./Container','./ThumbGroup','../models/LayerCollection','./LoadingProgress','iScroll','Cesium'],function(Container,ThumbGroup,LayerCollection,LoadingProgress,iScroll,Cesium){
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<div class="selTypeContainer">',
        '<select id="selType" class="cesium-button" style="width : 50%;border-radius : none;">',
        '</select>',
        '</div>'
    ].join('');
    var WebServicePan = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
        	'change #selType' : 'onSelChange'
        },
        initialize : function(options){
        	this.isPCBroswer = options.isPCBroswer;
            this.model = options.sceneModel;
            this.loadingProgess = new LoadingProgress();
            var layerCollection = new LayerCollection();
            var thumbGroup = new ThumbGroup({
                collection : layerCollection,
                isPCBroswer : options.isPCBroswer,
                id : 'webServicesWraper'
            });
            this.privateUrl = 'https://www.supermapol.com/web/mycontent/datas.jsonp?t=' + new Date().getTime() + "&currentPage=1&pageSize=10&orderBy=LASTMODIFIEDTIME&orderType=DESC";
            var texCompressType = this.model.viewer.scene._supportCompressType;
            this.texCompressType = texCompressType;
            this.thumbGroup = thumbGroup;
            this.layerCollection = layerCollection;
            var me = this;
            this.listenTo(thumbGroup, 'thumbClicked', function(model) {
                me.model.addLayer(model);
            });
            this.render();
            this.on('componentAdded',function(parent){
            	var url = "https://www.supermapol.com/web/services.json?enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&types=[REALSPACE,MAP]&userNames=[399055,366379]&pageSize=18";
            	me.currentPublicPage = 1;
            	me.totalPublicPage = 0;
            	me.currentPrivatePage = 1;
            	me.totalPrivatePage = 0;
            	var $selTypeEl = $('#selType');
            	me.addLoading();
            	layerCollection.filterByTexture(texCompressType);
            	layerCollection.fetch(url,me,true);
            	if(me.isPCBroswer){
            		$('#webServicesWraper').scroll(function(){  
                        var scrollTop = $(this).scrollTop();
                        var height = $(this).height();
                        var scrollHeight = this.scrollHeight;
                        if(height + scrollTop == scrollHeight){
                        	var selType = $selTypeEl.val();
                        	var newUrl;
                        	if(selType == 'public'){
                            	if(me.currentPublicPage > me.totalPublicPage){
                            		//$('#webServicesWraper').unbind('scroll');
                            		return ;
                            	}
                            	me.currentPublicPage += 1;
                            	if(me.currentPublicPage > me.totalPublicPage){
                            		return ;
                            	}
                            	newUrl = "https://www.supermapol.com/web/services.json?enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&types=[REALSPACE,MAP]&userNames=[399055,366379]&pageSize=18&currentPage=" + me.currentPublicPage;
                        		layerCollection.fetch(newUrl,me,true);
                        	}
                        	else{
                        		if(me.currentPrivatePage > me.totalPrivatePage){
                            		//me.thumbGroup.scroll.options.onScrollEnd = undefined;
                            		return ;
                            	}
                        		me.currentPrivatePage += 1;
                        		if(me.currentPrivatePage > me.totalPrivatePage){
                            		return ;
                            	}
                        		newUrl = 'https://www.supermapol.com/web/services.json?offline=false&enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&keywords=[' + window.USERNAME+ ']&filterFields=["RESTITLE","LINKPAGE","USERNAME"]&t=1480990924314&currentPage=' + me.currentPrivatePage;
                        		layerCollection.fetch(newUrl,me,false);
                        	}
                        	
                        }
                    }); 
            	}
            	else{
            		me.listenTo(me.thumbGroup,"addScroll", function(){
            			me.thumbGroup.scroll.options.onScrollEnd = function(){
                        	var selType = $selTypeEl.val();
                        	var newUrl;
                        	if(selType == 'public'){
                            	if(me.currentPublicPage > me.totalPublicPage){
                            		//me.thumbGroup.scroll.options.onScrollEnd = undefined;
                            		return ;
                            	}
                            	me.currentPublicPage += 1;
                            	if(me.currentPublicPage > me.totalPublicPage){
                            		return ;
                            	}
                            	newUrl = "https://www.supermapol.com/web/services.json?enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&types=[REALSPACE,MAP]&userNames=[399055,366379]&pageSize=18&currentPage=" + me.currentPublicPage;
                            	layerCollection.fetch(newUrl,me,true);
                        	}
                        	else{
                            	if(me.currentPrivatePage > me.totalPrivatePage){
                            		//me.thumbGroup.scroll.options.onScrollEnd = undefined;
                            		return ;
                            	}
                            	me.currentPrivatePage += 1;
                            	if(me.currentPrivatePage > me.totalPrivatePage){
                            		return ;
                            	}
                        		newUrl = 'https://www.supermapol.com/web/services.json?offline=false&enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&keywords=[' + window.USERNAME+ ']&filterFields=["RESTITLE","LINKPAGE","USERNAME"]&t=1480990924314&currentPage=' + me.currentPrivatePage;
                            	layerCollection.fetch(newUrl,me,false);
                        	}
                		};
                		me.stopListening(me.thumbGroup,"addScroll");
            		});
            	}
            	 
            });
        },
        render : function(){
            this.$el.html(this.template());
            this.$('#selType').append('<option value="public">' + Resource.publicService + '</option>');
            if(window.isLogin){
            	this.$('#selType').append('<option value="private">' + Resource.mycontent + '</option>');
            }
            this.$el.prop({'id' : 'webServicePan'});
            this.$el.attr({'role' : 'tabpanel'});
            this.$el.addClass('tab-pane active');
            this.$el.append(this.thumbGroup.$el);
            return this;
        },
        onSelChange : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var target = evt.target;
        	var value = target.value;
        	var items,url;
        	if(value === 'public'){
        		this.layerCollection.reset(this.layerCollection.publicModels);
        	}
        	else if(value === 'private'){
        		url = 'https://www.supermapol.com/web/services.json?currentPage=1&offline=false&enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&keywords=[' + window.USERNAME+ ']&filterFields=["RESTITLE","LINKPAGE","USERNAME"]&t=1480990924314'
        		this.layerCollection.fetch(url,this,false);
        	}
        	evt.stopPropagation();
        	return false;
        },
        addLoading : function(){
        	this.thumbGroup.$el.append(this.loadingProgess.$el);
        	this.loadingProgess.start();
        }
    });
    return WebServicePan;
});