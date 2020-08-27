define(['./Container','./ThumbGroup','../models/LayerCollection','./LoadingProgress','iScroll','popLayer' ,'../../data/SpecialEffects'],function(Container,ThumbGroup,LayerCollection,LoadingProgress,iScroll,popLayer, SpecialEffects){
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
		'<div class="selTypeContainer">',
			'<select id="selType" class="my-form-control" style="width: 50%;">',
			'</select>',
		'</div>',
    ].join('');

    popLayer.config({ //  通过模块化方式调用该插件时配置layer.js所在的目录，从而去加载它的一些配件
        path: "js/lib/layer/src/"
    });

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
                /*$("ul.list-group > li").removeClass("node-selected");*/
            });
            this.render();
            this.on('componentAdded',function(parent){
            	// var url = "https://www.supermapol.com/web/services.json?enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&types=[REALSPACE,MAP]&userNames=[399055,361143]&pageSize=18";
                var lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
                lang = lang.substr(0, 2);//截取lang前2位字符
				var url = "";
				if (lang == 'zh') {
					url = "./data/iEarth_resource_services_CN.json";
                    // url = location.protocol + "//www.supermapol.com/earth/iEarth_resource_temp_location/iEarth_resource_services_CN.json";
                } else {
					url = "./data/iEarth_resource_services_EN.json";
                    // url = location.protocol + "//www.supermapol.com/earth/iEarth_resource_temp_location/iEarth_resource_services_EN.json";
                }

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
                        	var selType = $selTypeEl.val();
                        	var newUrl;
                        	if(selType == 'public'){
                            	if(me.currentPublicPage > me.totalPublicPage){
                            		return ;
                            	}
                            	me.currentPublicPage += 1;
                            	if(me.currentPublicPage > me.totalPublicPage){
                            		return ;
                            	}
                            	// newUrl = "https://www.supermapol.com/web/services.json?enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&types=[REALSPACE,MAP]&userNames=[399055,361143]&pageSize=18&currentPage=" + me.currentPublicPage;
                                newUrl = "data/services.json";
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
                            	newUrl = "https://www.supermapol.com/web/services.json?enable=true&checkStatus=SUCCESSFUL&orderBy=UPDATETIME&orderType=DESC&types=[REALSPACE,MAP]&userNames=[399055,361143]&pageSize=18&currentPage=" + me.currentPublicPage;
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
            this.$('#selType').append('<option value="effects">' + Resource.specialEffects + '</option>');
            if(window.isLogin){
            	this.$('#selType').append('<option value="private">' + Resource.mycontent + '</option>');
            }
            this.$el.prop({'id' : 'webServicePan'});
            this.$el.attr({'role' : 'tabpanel'});
            this.$el.addClass('tab-pane active function-module-content');
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
        	}else if(value === 'effects'){
                $("#webServicesWraper").children().remove();
                var specialEffectsData = SpecialEffects();
                var effects = specialEffectsData.effects;

				effects.forEach(function(effect){
					var effectName = effect.name;
					var effectPath = effect.path;
					var effectThumbnail = effect.thumbnail;
					var effectDescription = effect.description;

                    var $effectImg = $("<div class='service-itemIcon'><div class='service-itemBg'></div><img src="+ effectThumbnail +"></div>");
                    var $effectLabel = $("<div class='service-itemLabel'>"+ effectName +"</div>");
                    var $effectItem = $("<div class='service-item'></div>");

					$effectItem.append($effectImg);
					$effectItem.append($effectLabel);

					$effectItem.click(function(){
						popLayer.open({
							title: effectDescription,
							move: false,
							area: ['100%', '100%'],
							type: 2,
							content: effectPath
						});
					});
					$("#webServicesWraper").append($effectItem);
				});
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