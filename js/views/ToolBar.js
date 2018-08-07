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
                   "<div id='toolbar' class='toolbar' style='margin: 5px 5px 5px 8px;'>",
                   "<a data-toggle='dropdown' id='layerMangerBtn' title='" + Resource.layerList + "' class='btn btn-inverse'><span style='font-size : 16px;' class='iconfont icon-tuceng' ></span></a>",
                   "<a class='btn btn-inverse' style='padding : 10px 0px;'><span style='border-left : 1px solid #dddddd;'></span></a>",
                   "<a id='expandBtn' style='display : none;' title='" + Resource.expand + "' class='btn btn-inverse'><span class='iconfont icon-cebianlanzhankai'></span></a>",
                   "<div id='btnGroup' class='btn-group'>",
                   "<a id='addLayerBtn'  title='" + Resource.addLayer + "' class='btn btn-inverse'><span class='iconfont icon-tianjia'></span></a>",
                   "<a data-toggle='dropdown' id='baseLayerBtn' title='" + Resource.setBaseLayer + "' class='btn btn-inverse' ><span class='fui-list-large-thumbnails'></span></a>",
                   "<a data-toggle='dropdown' id='settingBtn'  title='" + Resource.scene + "' class='btn btn-inverse'><span class='iconfont icon-shezhi'></span></a>",
                   "<a class='btn btn-inverse' style='padding : 10px 0px;'><span style='border-left : 1px solid #dddddd;'></span></a>",
                   "<a data-toggle='dropdown' id='clipBtn' title='" + Resource.clip + "' class='btn btn-inverse'><span class='iconfont icon-ai50'></span></a>",
                   "<a data-toggle='dropdown' id='terrainBtn' title='" + Resource.terrain + "' class='btn btn-inverse'><span class='iconfont icon-1'></span></a>",
                   "<a data-toggle='dropdown' id='analysisBtn'  title='" + Resource.analysis + "' class='btn btn-inverse'><span class='fui-window'></span></a>",
                   "<a data-toggle='dropdown' id='measureBtn' title='" + Resource.measure + "' class='btn btn-inverse'><span class='smicon-message'></span></a>",
                  // "<a data-toggle='dropdown' id='bookmarkBtn' title='" + "书签" + "' class='btn btn-inverse'><span class='smicon-bookmark '></span></a>",
                   "<a class='btn btn-inverse' style='padding : 10px 0px;'><span style='border-left : 1px solid #dddddd;'></span></a>",
                   "<a id='addMarkerBtn' title='" + Resource.onlineEditing + "' class='btn btn-inverse'><span class='iconfont icon-edit'></span></a>",
                   "<a data-toggle='dropdown' id='propertyBtn' title='" + Resource.interspaceQuery + "' class='btn btn-inverse'><span class='iconfont icon-zhcc_chaxun'></span></a>",
                   "<a id='foldBtn' title='" + Resource.fold + "' class='btn btn-inverse'><span class='iconfont icon-cebianlanshouqi'></span></a>",
                   "</div>",
                   "</div>"
                   ].join('');
    var ToolBar = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'touchstart #layerMangerBtn' : 'onLayerMangerBtnClk',
            'click #layerMangerBtn' : 'onLayerMangerBtnClk',
            'click #expandBtn' : 'onExpandBtnClk',
            'click #addLayerBtn' : 'onAddLayerBtnClk',
            'click #addMarkerBtn' : 'onAddMarkerBtnClk',
            'touchstart #baseLayerBtn' : 'onBaseLayerBtnClk',
            'click #baseLayerBtn' : 'onBaseLayerBtnClk',
            'click #measureBtn' : 'onMeasureBtnClk',
            'click #terrainBtn' : 'onTerrainBtnClk',
            'click #bookmarkBtn' : 'onBookmarkBtnClk',
            'click #propertyBtn' : 'onPropertyBtnClk',
            'click #visBtn' : 'onVisBtnClk',
            'click #analysisBtn' : 'onAnalysisBtnClk',
            'click #clipBtn' : 'onClipBtnClk',
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
                    $('body').append(bubble.el);
                    this.model.viewer.customInfobox = bubble.el;
                    
                    var layerManageDropDownView = new LayerManageDropDown({
                        sceneModel : this.model
                    });
                    $('#layerMangerBtn').append(layerManageDropDownView.$el);
                    layerManageDropDownView.initZtree();
                    this.layerManageDropDownView = layerManageDropDownView;
                }
            });
            // if(!this.isPCBroswer){
            // 	$('.cesium-geocoder-input').on('focus',function(){
            // 		$('.dropDown-container').removeClass('dropDown-visible');
            //     	$('#btnGroup').hide();
            //         $('#expandBtn').show();
            //     });
            // }
            $(document).on('click.dropDown-container touchstart.dropDown-container', function(evt){
            	var len = $('#layerMangerBtn div.dropDown-visible').length + $('#measureBtn div.dropDown-visible').length;
            	if(len > 0){
            		return ;
            	}
            	$('.dropDown-container').removeClass('dropDown-visible');
            }).on('click.dropDown-container touchstart.dropDown-container', '[data-toggle=dropdown]',function(evt){
            	evt.stopPropagation();
            	var target = evt.target;
            	if(!target.contains(evt.currentTarget) && target.parentNode.tagName != 'A'){
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
            /*if($("#layer-manage-drop-down").hasClass("dropDown-visible")){
                $("#layer-manage-drop-down").removeClass("dropDown-visible");
            }else{
                $("#layer-manage-drop-down").addClass("dropDown-visible");
            }*/
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
            if(this.markerForm){
                this.markerForm.$el.show();
            }
            if(!this.markerForm){
                var me = this;
                require(['./views/markerForm'],function(markerForm){
                    var markerForm = new markerForm({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(markerForm);
                    me.markerForm = markerForm;
                    markerForm.$el.show();
                });
            }


            // if(evt && evt.preventDefault){
        		// evt.preventDefault();
            // }
            // else{
            //     window.event.returnValue = false;
            // }
            // var addMarkerHandler = this.model.addMarkerHandler;
            // if(!addMarkerHandler){
            // 	addMarkerHandler = this.model.createAddMarkerHandler(this.bubble);
            // }
            // if(addMarkerHandler.active){
            // 	addMarkerHandler.deactivate();
            // 	$('body').removeClass('cur-addMarker');
            // }
            // else{
            // 	addMarkerHandler.activate();
            // 	$('body').removeClass('cur-addMarker').addClass('cur-addMarker');
            // }
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

        onTerrainBtnClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            if(this.terrainForm){

                this.terrainForm.$el.show();
            }
            if(!this.terrainForm){
                var me = this;
                require(['./views/terrainForm'],function(terrainForm){
                    var terrainForm = new terrainForm({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(terrainForm);
                    me.terrainForm = terrainForm;
                    terrainForm.$el.show();
                });
            }
        },

        onBookmarkBtnClk : function(evt){
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
                require(['./views/bookmarkDropDown'],function(bookmark){
                    var book = new bookmark({
                        sceneModel : me.model
                    });
                    $('#bookmarkBtn').append(book.$el);
                    me.book = book;
                    book.$el.addClass('dropDown-visible');
                });
            }
        },

        onPropertyBtnClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            if(this.propertyForm){
                this.propertyForm.$el.show();
            }
            if(!this.propertyForm){
                var me = this;
                require(['./views/propertyForm'],function(propertyForm){
                    var propertyForm = new propertyForm({
                        parent : me,
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(propertyForm);
                    me.propertyForm = propertyForm;
                    propertyForm.$el.show();
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
                    visualization.$el.addClass('dropDown-visible');
                });
            }
        },
        
        onAnalysisBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            if(this.analysisTools){
                this.analysisTools.$el.show();
            }
        	if(!this.analysisTools){
                var me = this;
                require(['./views/analysisTools'],function(analysisTools){
                    var analysisTools = new analysisTools({
                        parent : me,
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(analysisTools);
                    me.analysisTools = analysisTools;
                    analysisTools.$el.show();
                });
            }
        },

        onClipBtnClk : function(evt){
        if(evt && evt.preventDefault){
            evt.preventDefault();
        }
        else{
            window.event.returnValue = false;
        }
        if(this.clipForm){
            this.clipForm.$el.show();
        }
        if(!this.clipForm){
            var me = this;
            require(['./views/clipForm'],function(clipForm){
                var clipForm = new clipForm({
                    parent : me,
                    sceneModel : me.model,
                    isPCBroswer : me.isPCBroswer
                });
                me.parent.addComponent(clipForm);
                me.clipForm = clipForm;
                clipForm.$el.show();
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
            if(this.sceneAttribute){
                $("#layerForm").hide();
                $("#sceneForm").show();
                this.sceneAttribute.$el.show();
            }
        	if(!this.sceneAttribute){
                var me = this;
                require(['./views/sceneAttribute'],function(sceneAttribute){
                    var sceneAttribute = new sceneAttribute({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(sceneAttribute);
                    me.sceneAttribute = sceneAttribute;
                    sceneAttribute.$el.show();
                });
            }
        }

    });
    return ToolBar;
});
