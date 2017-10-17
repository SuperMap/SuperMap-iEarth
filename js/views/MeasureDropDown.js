define(['./Container','Cesium','../tools/Area'],function(Container,Cesium,Area){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
                   "<div class='btn-toolbar'>",
                   "<div class='btn-group' style='margin: 5px 5px 5px 8px;'>",
                   "<a id='measureDisBtn' title='" + Resource.measureDis + "' class='btn btn-inverse' style='margin : 5px;'><span class='smicon-distance' ></span></a>",
                   "<a id='measureAreaBtn'  title='" + Resource.measureArea + "' class='btn btn-inverse' style='margin : 5px;'><span class='smicon-area' ></span></a>",
                   "<a id='delResBtn' title='" + Resource.close + "' class='btn btn-inverse' style='margin : 5px;'><span class='fui-cross' ></span></a>",
                   "</div>",
                   "</div>",
                   "<div id='measureTitle' class='measure-title'>" + Resource.measure + "</div>",
                   "<div id='measureResult' class='measure-result'>&nbsp;</div>"
                   ].join('');
    var MeasureDropDown = Container.extend({
        tagName : 'div',
        id : 'measureDropDown',
        template : _.template(htmlStr),
        events : {
        	'click #measureDisBtn' : 'onMeasureDisBtnClk',
        	'click #measureAreaBtn' : 'onMeasureAreaBtnClk',
        	'click #delResBtn' : 'onDelResBtnClk'
        },
        initialize : function(options){
        	this.sceneModel = options.sceneModel;
        	var viewer = this.sceneModel.viewer;
        	this.polylineHandler = new Cesium.PolylineHandler(viewer);
            this.polygonHandler = new Cesium.PolygonHandler(viewer);
            this.doHandler();
        	this.render();
        },
        render : function(){
        	this.$el.html(this.template());
        	this.$el.addClass('dropDown-container');
        	this.$el.css('min-width','180px');
            return this;
        },
        doHandler : function(){
        	if(!this.polylineHandler || !this.polygonHandler){
        		return;
        	}
        	var me = this;
        	var viewer = me.sceneModel.viewer;
        	this.polylineHandler.drawCompletedEvent.addEventListener(function(polyline){
        		me.sceneModel.viewer.scene.globe.depthTestAgainstTerrain = true;
        		$('body').removeClass('cur-measure');
                var distance = 0;
                var positions = polyline.positions;
                for(var i = 0, len = positions.length - 1; i < len ; i++){
                    distance += Cesium.Cartesian3.distance(positions[i], positions[i+1]);
                }

                var labelPosition = positions[i];
                var cartographic = Cesium.Cartographic.fromCartesian(labelPosition);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var height = cartographic.height + 5;

                var label;
                if(distance >= 1000){
                    distance /= 1000;

                    $("#measureResult").html(distance.toFixed(2) + Resource.kmUnit);
                }else {
                	$("#measureResult").html(distance.toFixed(2) + Resource.mUnit);
                }
                me.disResult = {
                		polyline : polyline
                };
            });
        	this.polylineHandler.singleClick.addEventListener(function(distance) {
        		if(distance >= 1000){
                    distance /= 1000;

                    $("#measureResult").html(distance.toFixed(2) + Resource.kmUnit);
                }else {
                    $("#measureResult").html(distance.toFixed(2) + Resource.kmUnit);
                }
        	});
        	this.polygonHandler.drawCompletedEvent.addEventListener(function(polygon){
        		me.sceneModel.viewer.scene.globe.depthTestAgainstTerrain = true;
        		$('body').removeClass('cur-measure');
                var positions = polygon.positions;
                var array = [];
                for(var i = 0, len = positions.length; i < len; i ++){
                    var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
                    array.push({x: longitude, y: latitude});
                }

                var arrs = new Array();
                var tems = new Array();
                arrs.push(tems);
                for(var i = 0, len = array.length; i < len; i ++) {
                    tems.push([array[i].x, array[i].y])
                }

                var polygons = {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": arrs
                            }
                        }, {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0],
                                    [0, 0]
                                ]]
                            }
                        }
                    ]
                };

                var area = Area(polygons);
                var label;
                if(area >= 1000000){
                    area /= 1000000;

                    $("#measureResult").html(area.toFixed(2) + Resource.sqkmUnit);
                }else{
                	$("#measureResult").html(area.toFixed(2) + Resource.sqmUnit);
                }
                me.areaResult = {
                    polygon : polygon
                };
            });
        	
        },
        onMeasureDisBtnClk : function(evt){
        	$("#measureTitle").html(Resource.distance);
        	$("#measureResult").html("&nbsp;");
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	this.sceneModel.viewer.scene.globe.depthTestAgainstTerrain = false;
        	if(!this.polylineHandler){
        		return;
        	}
        	if(this.disResult){
        	
        		this.polylineHandler.polylines.removeAll();
        	}
        	
           	if(this.areaResult && this.areaResult.polygon){
        		this.sceneModel.viewer.scene.primitives.remove(this.areaResult.polygon);
        	}
        	if(this.polygonHandler.active){
        		this.polygonHandler.deactive();
        	}
        	if(this.polylineHandler.active){
        		this.polylineHandler.deactive();
        		$('body').removeClass('cur-measure');
        	}
        	else{
        		this.polylineHandler.activate();
        		$('body').removeClass('cur-addMarker').addClass('cur-measure');
        	}
        	return false;
        },
        onMeasureAreaBtnClk : function(evt){
        	$("#measureTitle").html(Resource.area);
        	$("#measureResult").html("&nbsp;");
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	this.sceneModel.viewer.scene.globe.depthTestAgainstTerrain = false;
        	if(!this.polygonHandler){
        		return;
        	}
        	
        	if(this.disResult){
            	
        		this.polylineHandler.polylines.removeAll();
        	}
        	
        	if(this.areaResult && this.areaResult.polygon){
        		this.sceneModel.viewer.scene.primitives.remove(this.areaResult.polygon);
        	}
        	if(this.polylineHandler.active){
        		this.polylineHandler.deactive();
        	}
        	if(this.polygonHandler.active){
        		this.polygonHandler.deactive();
        		$('body').removeClass('cur-addMarker');
        	}
        	else{
        		this.polygonHandler.activate();
        		$('body').removeClass('cur-addMarker').addClass('cur-measure');
        	}
        	return false;
        },
        onDelResBtnClk : function(evt){
        	$("#measureTitle").html(Resource.measure);
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	if(this.disResult){
        		this.polylineHandler.polylines.removeAll();
        	}
        	
        	if(this.areaResult && this.areaResult.polygon){
        		this.sceneModel.viewer.scene.primitives.remove(this.areaResult.polygon);
        	}
        	$("#measureResult").html("&nbsp;");
            return false;
        }
    });
    return MeasureDropDown;
});