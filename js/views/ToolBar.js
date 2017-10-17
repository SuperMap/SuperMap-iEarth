define([
    "./Container",
    '../tools/Position',
    './Bubble',
    './LayerManageDropDown'
    ], function(
    Container,
    Position,
    Bubble,
    LayerManageDropDown
    ) {
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
                   "<div id='toolbar' class='btn-group' style='margin: 5px 5px 5px 8px;'>",
                   "<a data-toggle='dropdown' id='layerMangerBtn' title='" + Resource.layerManager + "' class='btn btn-inverse'><span style='font-size : 17px;' class='smicon-layerlist' ></span></a>",
                   "<a class='btn btn-inverse' style='padding : 10px 0px;'><span style='border-left : 1px solid #dddddd;'></span></a>",
                   "<a id='expandBtn' style='display : none;' title='" + Resource.expand + "' class='btn btn-inverse'><span class='fui-arrow-right'></span></a>",
                   "<div id='btnGroup' class='btn-group'>",
                   "<a id='addLayerBtn'  title='" + Resource.addLayer + "' class='btn btn-inverse'><span class='fui-plus'></span></a>",
                   "<a data-toggle='dropdown' id='baseLayerBtn' title='" + Resource.setBaseLayer + "' class='btn btn-inverse' ><span class='fui-list-large-thumbnails'></span></a>",
                   "<a id='addMarkerBtn' title='" + Resource.addMarker + "' class='btn btn-inverse'><span class='smicon-marker'></span></a>",
                   "<a data-toggle='dropdown' id='measureBtn' title='" + Resource.measure + "' class='btn btn-inverse'><span class='smicon-mesure'></span></a>",
                    "<a data-toggle='dropdown' id='visBtn' title='" + Resource.visualization + "' class='btn btn-inverse'><span class='fui-star'></span></a>",
                   "<a data-toggle='dropdown' id='settingBtn'  title='" + Resource.setEffect + "' class='btn btn-inverse'><span class='fui-gear'></span></a>",
                   "<a id='foldBtn' title='" + Resource.fold + "' class='btn btn-inverse'><span class='fui-arrow-left'></span></a>",
                   "</div>",
                   "</div>"
                   ].join('');
    var ToolBar = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'click #layerMangerBtn' : 'onLayerMangerBtnClk',
            'click #expandBtn' : 'onExpandBtnClk',
            'click #addLayerBtn' : 'onAddLayerBtnClk',
            'click #addMarkerBtn' : 'onAddMarkerBtnClk',
            'click #baseLayerBtn' : 'onBaseLayerBtnClk',
            'click #measureBtn' : 'onMeasureBtnClk',
            'click #visBtn' : 'onVisBtnClk',
            'click #settingBtn' : 'onSettingBtnClk',
            'click #foldBtn' : 'onFoldBtnClk'
        },
        initialize : function(options) {
            this.model = options.sceneModel;
            this.isPCBroswer = options.isPCBroswer;
            this.render();
            this.on('componentAdded',function(parent){
                if(parent){
                	this.parent = parent;
                	var bubble = new Bubble({
                    	sceneModel : options.sceneModel
                    });
                    parent.addComponent(bubble,new Position({
                        x : '0',
                        y : '0'
                    }));
                    this.bubble = bubble;
                    
                    var layerManageDropDownView = new LayerManageDropDown({
                        sceneModel : this.model
                    });
                    $('#layerMangerBtn').append(layerManageDropDownView.$el);
                    layerManageDropDownView.initZtree();
                    this.layerManageDropDownView = layerManageDropDownView;
                }
            });
            if(!this.isPCBroswer){
            	$('.cesium-geocoder-input').on('focus',function(){
            		$('.dropDown-container').removeClass('dropDown-visible');
                	$('#btnGroup').hide();
                    $('#expandBtn').show();
                });
            }
            $(document).on('click.dropDown-container touchstart.dropDown-container', function(evt){
            	var len = $('#layerMangerBtn div.dropDown-visible').length + $('#measureBtn div.dropDown-visible').length;
            	if(len > 0){
            		return ;
            	}
            	$('.dropDown-container').removeClass('dropDown-visible');
            }).on('click.dropDown-container touchstart.dropDown-container','[data-toggle=dropdown]',function(evt){
            	evt.stopPropagation();
            	var target = evt.target;
            	if(!target.contains(evt.currentTarget) && target.tagName != 'SPAN'){
            		return ;
            	}
            	var $this = $(this), $parent, isActive;
            	var $target = $this.children('div.dropDown-container');
            	if($target.length == 0){
            		$('.dropDown-container').removeClass('dropDown-visible');
            		return ;
            	}
            	isActive = $target.hasClass('dropDown-visible');
            	$('.dropDown-container').removeClass('dropDown-visible');
            	if(!isActive){
            		$target.addClass('dropDown-visible');
            	}
            	return false;
            });
        },
        render : function() {
            this.$el.addClass('btn-toolbar');
            this.$el.html(this.template());
            return this;
        },
        onLayerMangerBtnClk : function(evt) {
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var target = evt.target;
        	if(!target.contains(evt.currentTarget) && target.tagName != 'SPAN'){
        		return;
        	}
        },
        onExpandBtnClk : function(evt) {
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	$('#btnGroup').show();
        	$('#expandBtn').hide();
        	if(!this.isPCBroswer){
            	$('#addMarkerBtn').hide();
            	$('#measureBtn').hide();
            }
        },
        onFoldBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	$('#btnGroup').hide();
            $('#expandBtn').show();
        },
        onAddLayerBtnClk : function (evt) {
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            if(this.modal){
                this.modal.$el.show();
                this.model.trigger('modalOpen',this.model);
            }
            else{
            	var me = this;
            	require(['./views/ModalFrame'],function(ModalFrame){
            		var modal = new ModalFrame({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(modal);
                    me.modal = modal;
                    modal.$el.show();
                    me.model.trigger('modalOpen',me.model);
            	});
            }
        },
        onAddMarkerBtnClk : function (evt) {
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            var addMarkerHandler = this.model.addMarkerHandler;
            if(!addMarkerHandler){
            	addMarkerHandler = this.model.createAddMarkerHandler(this.bubble);
            }
            if(addMarkerHandler.active){
            	addMarkerHandler.deactivate();
            	$('body').removeClass('cur-addMarker');
            }
            else{
            	addMarkerHandler.activate();
            	$('body').removeClass('cur-addMarker').addClass('cur-addMarker');
            }
        },
        onBaseLayerBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            if(!this.baselayerDropDown){
            	var me = this;
            	require(['./views/BaseLayerDropDown'],function(BaseLayerDropDown){
            		var baseLayerDropDown = new BaseLayerDropDown({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
            		$('#baseLayerBtn').append(baseLayerDropDown.$el);
                    me.baselayerDropDown = baseLayerDropDown;
                    baseLayerDropDown.trigger('componentAdded');
                    baseLayerDropDown.$el.addClass('dropDown-visible');
            	});
            }
        },
        onMeasureBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var target = evt.target;
        	if(!target.contains(evt.currentTarget) && target.tagName != 'SPAN'){
        		return;
        	}
        	if(!this.measureDropDown){
        		var me = this;
            	require(['./views/MeasureDropDown'],function(MeasureDropDown){
            		var measureDropDown = new MeasureDropDown({
                        sceneModel : me.model
                    });
            		$('#measureBtn').append(measureDropDown.$el);
                    me.measureDropDown = measureDropDown;
                    measureDropDown.$el.addClass('dropDown-visible');
            	});
        	}
        },

        onVisBtnClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            if(!this.visualization){
                var me = this;
                require(['./views/visualization'],function(visualization){
                    var visualization = new visualization({
                        sceneModel : me.model
                    });
                    $('#visBtn').append(visualization.$el);
                    me.visualization = visualization;
                    require(['./views/VisTools'],function(VisTools){
                        var visTools = new VisTools({
                            sceneModel : me.model,
                            isPCBroswer : me.isPCBroswer
                        });
                        me.parent.addComponent(visTools);
                        me.visTools = visTools;
                    });
                });
            }
        },
        
        onSettingBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	if(!this.settingDropDown){
        		var me = this;
            	require(['./views/SettingDropDown'],function(SettingDropDown){
            		var settingDropDown = new SettingDropDown({
                        sceneModel : me.model       
                    });
            		$('#settingBtn').append(settingDropDown.$el);
                    me.settingDropDown = settingDropDown;
                    settingDropDown.trigger('componentAdded');
                    settingDropDown.$el.addClass('dropDown-visible');
            	});
            }
        }

    });
    return ToolBar;
});
