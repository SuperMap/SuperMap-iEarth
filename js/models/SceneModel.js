define([
        'backbone',
        'Cesium',
        'jquery',
        '../Util',
        '../lib/WriteKml',
        '../models/LayerCollection',
        '../models/KmlLayerModel',
        '../models/MarkerModel',
        '../models/BaseLayerModel',
        './LayerModel',
        '../portal/parsePortalJson'],
        function(Backbone,Cesium,$,Util,WriteKml,LayerCollection,KmlLayerModel,MarkerModel,BaseLayerModel,LayerModel,parsePortalJson){
	var _ = require('underscore');
    var SceneModel = Backbone.Model.extend({
        initialize : function(viewer,isPCBroswer){
            this.viewer = viewer;
            this.isPCBroswer = isPCBroswer;
            this.stkTerrainProvider = new Cesium.CesiumTerrainProvider({
                //url: '//assets.agi.com/stk-terrain/world',
            	url : 'https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path',
                requestWaterMask : true,
                requestVertexNormals : true,
                credit : ''
            });
            this.ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider({
                ellipsoid : viewer.scene.globe.ellipsoid
            });
            this.layers = new LayerCollection();
            this.baseLayer = new BaseLayerModel({type : 'IMAGE'});
            this.isSTKTerrain = false;
            this.analysisObjects = {};
            this.terrainObjects = {};
            this.markerObjects = {};
        },
        addLayer : function(layerModel,sceneContent,isFlyMode){
            var me = this;
            if(!layerModel){
                return;
            }
           var promise =  layerModel.addLayer(this,isFlyMode);
            Cesium.when(promise,function(layer){
                if(Window.iportalAppsRoot != "${resource.rootPath}"){
                    var cameraStore = sceneContent.camera;
                    var camera = me.viewer.scene.camera;
                    camera.flyTo({
                        destination : new Cesium.Cartesian3(cameraStore.position.x,cameraStore.position.y,cameraStore.position.z),
                        orientation : {
                            heading : cameraStore.heading,
                            pitch : cameraStore.pitch,
                            roll : cameraStore.roll
                        }
                    });
                    var parseObject =sceneContent.parseObject;
                    parseObject.initialize();
                }
            })
        },
        addLayers : function(layers,isFlyMode){
        	if(!layers){
        		return;
        	}
        	var me = this;
        	isFlyMode = isFlyMode == false ? false : true;
        	layers.each(function(layerModel, idx) {
                me.addLayer(layerModel,isFlyMode);
            });
        },
        removeLayer : function(layerModel){
        	if(!layerModel){
                return;
            }
        	if(layerModel.get('type') == 'TERRAIN'){
        		this.setTerrain($("#chkTerrain").is(':checked'));
        	}
        	layerModel.removeLayer(this.viewer);
        	if(layerModel.get('originName') === '点云'){
                document.getElementById('japan_pointCloud_tag').style.display = 'none';
            }
        },
        addMarker : function(markerModel){
        	if(this.defaultKmlLayer){
        		this.defaultKmlLayer.addMarker(markerModel,this,this.currentMarker);
        		this.trigger('markerAdded',markerModel);
        	}
        },
        removeMarker : function(markerModel){
        	if(!markerModel){
        		return;
        	}
        	var entity = markerModel.layer;
        	if(this.viewer.entities.contains(entity)){
        		this.viewer.entities.remove(entity);
        	}
        	else{
        		var ds = this.viewer.dataSources.get(0);
        		if(ds && ds.entities.contains(entity)){
        			ds.entities.remove(entity);
        		}
        	}
        },
        removeCurrentMarker : function(){
        	var marker = this.currentMarker;
        	if(marker){
        		this.viewer.entities.remove(marker);
        		this.currentMarker = undefined;
        	}
        },
        setEnvironment : function(envState){
        	this.viewer.scene.skyAtmosphere.show = envState.skyAtmosphereShow;
        	this.viewer.scene.globe.enableLighting = envState.enableLighting;
        	this.viewer.scene.fog.enabled = envState.enableFog;
        },
        setTerrain : function(isStkTerrain){
        	if(isStkTerrain){
        		this.viewer.terrainProvider = this.stkTerrainProvider;
        		this.isSTKTerrain = true;
        	}
        	else{
        		this.viewer.terrainProvider = this.ellipsoidTerrainProvider;
        		this.isSTKTerrain = false;
        	}
        },
        setBaseLayer : function(baseLayerModel){
        	if(!baseLayerModel){
        		return ;
        	}
        	baseLayerModel.setBaseLayer(Cesium,this.viewer);
        	this.baseLayer = baseLayerModel;
        },
        createAddMarkerHandler : function(bubble){
        	var scene = this.viewer.scene;
            var canvas = scene.canvas;
            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;
        	var addMarkerHandler = new Cesium.AddMarkerHandler(this.viewer);
        	var me = this;
            addMarkerHandler.drawCompletedEvent.addEventListener(function(evt,marker){
            	$('body').removeClass('cur-addMarker');
            	var dx = canvasWidth - evt.position.x;
                var dy = canvasHeight - evt.position.y;
                var left,top;
                if(dx > 350){
                    left = evt.position.x + 'px';
                }
                else{
                    left = (evt.position.x - 345) + 'px';
                }
                if(dy > 200){
                    top = evt.position.y + 'px';
                }
                else{
                    top = (evt.position.y - 200) + 'px';
                }
                bubble.$el.css({
                	'left' : left,
                	'top' : top
                });
            	bubble.$el.show();
            	me.currentMarker = marker;
            });
            this.addMarkerHandler = addMarkerHandler;
            
            var tickChangePosition = function(){
            	if(!me.currentMarker){
            		return;
            	}
                var pos = me.currentMarker.position._value;
                var windowPos = new Cesium.Cartesian2();
                Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(scene,pos,windowPos);
                windowPos.x = Math.floor(windowPos.x);
                windowPos.y = Math.floor(windowPos.y);
                var dx = canvasWidth - windowPos.x;
                var dy = canvasHeight - windowPos.y;
                var left,top;
                if(dx > 350){
                    left = windowPos.x + 'px';
                }
                else{
                    left = (windowPos.x - 345) + 'px';
                }
                if(dy > 200){
                    top = windowPos.y + 'px';
                }
                else{
                    top = (windowPos.y - 200) + 'px';
                }
                bubble.el.style.left = left;
                bubble.el.style.top = top;

            };
            this.viewer.clock.onTick.addEventListener(tickChangePosition);
            return addMarkerHandler;
        },
        save : function(){
        	var saveData = {};
        	if(this.baseLayer && 'IMAGE' != this.baseLayer.get('type')){
        		saveData.baseLayer = this.baseLayer.toJSON();
        	}
        	saveData.isSTKTerrain = this.isSTKTerrain;
        	saveData.envState = {
        			enableLighting : this.viewer.scene.globe.enableLighting,
        			skyAtmosphereShow : this.viewer.scene.skyAtmosphere.show,
        			enableFog : this.viewer.scene.fog.enabled
        	};
            saveData.layers = [];
            var layers = this.layers;
            for(var i = 0,j = this.layers.length;i < j;i++){
            	var layerModel = this.layers.at(i);
            	if(layerModel.get("type") !== "KML"){
            		var obj = layerModel.toJSON();
                	saveData.layers.push(obj);
            	}
            	
            }
            var camera = this.viewer.scene.camera;
            saveData.camera = {
            		position : {
            			x : camera.position.x,
            			y : camera.position.y,
            			z : camera.position.z
            		},
            		heading : camera.heading,
            		pitch : camera.pitch,
            		roll : camera.roll
            };
            if(this.defaultKmlLayer){
            	var entities = [].concat(this.viewer.entities.values);
        		var kmlStr = WriteKml.write(entities);
        		saveData.kml = kmlStr;
            }
            var saveData = JSON.stringify(saveData);
            $.ajax({
                type: "POST",
                url: "/supermapearth/Workspace",
                contentType: "application/json;charset=utf-8",
                dataType: "json", 
                data: saveData,  
                success : function (jsonResult) {
                   if(jsonResult){
                	   if(jsonResult.status === true){
                		   Util.showErrorMsg(Resource.workspaceSaveOK);
                		   return ;
                	   }
                   }
                   Util.showErrorMsg(Resource.workspaceSaveFail);
                }
            });
        },
        open : function(){
        	var me = this;
        	$.ajax({
                type: "GET",
                url: "/supermapearth/Workspace",
                contentType: "application/json;charset=utf-8",
                dataType: "json", 
                success: function (jsonResult) {
                	var sceneJson = jsonResult.scene;
                	me.parse(jsonResult);
                }
            });
        },
        parse : function(jsonResult) {
            if(!jsonResult){
            	return;
            }
            var sceneJson = jsonResult.scene;
            if(sceneJson){
            	var envState = sceneJson.envState;
            	if(envState){
            		this.setEnvironment(envState);
            	}
            	if(sceneJson.baseLayer){
            		var baseLayerModel = new BaseLayerModel(sceneJson.baseLayer);
            		this.setBaseLayer(baseLayerModel);
            	}
            	this.isSTKTerrain = sceneJson.isSTKTerrain;
            	if(this.isSTKTerrain == true){
            		this.setTerrain(true);
            	}
            	var layersJson = sceneJson.layers;
                var layers = new LayerCollection();
                layers.parse(layersJson);
                this.addLayers(layers,false);
                var cameraJson = sceneJson.camera;
                this.setCamera(cameraJson);
            }
            var kmlPath = jsonResult.kml;
            if(kmlPath){
            	this.defaultKmlLayer = new KmlLayerModel({
            		name : 'default KML'
            	});
            	var promise = this.defaultKmlLayer.addLayerByUrl(this.viewer,kmlPath);
            	var me = this;
            	Cesium.when(promise,function(entities){
            		if(entities && entities.length > 0){
            			me.trigger('layerAdded',me.defaultKmlLayer);
            			for(var i = 0,j = entities.length;i < j;i++){
                			var entity = entities[i];
                			var billboard = entity.billboard;
                			var label = entity.label;
                			if(billboard && label){//暂时只支持billboard -> marker(地标)
                				var name = entity.name;
                				var des = entity.description.getValue();
                				var markerModel = new MarkerModel({
                					name : name,
                	            	description : des
                				});
                				if(me.defaultKmlLayer){
                	        		me.defaultKmlLayer.addMarker(markerModel,me,entity);
                	        		me.trigger('markerAdded',markerModel);
                	        	}
                			}
                		}
            		}
            		else{
            			me.defaultKmlLayer = undefined;
            		}
            		
            	});
            }
            
        },
        setCamera : function(cameraJson){
        	if(!cameraJson){
        		return ;
        	}
        	
        	var camera = this.viewer.scene.camera;
        	var ps = cameraJson.position;
        	camera.setView({
                destination : new Cesium.Cartesian3(ps.x,ps.y,ps.z),
                orientation : {
                    heading : cameraJson.heading,
                    pitch : cameraJson.pitch,
                    roll : cameraJson.roll
                }
            });
        },
        parsePortalJson : function (request) {
             if(!request.content){
                 return;
             }
            this.viewer.scene.name = request.name;
            var sceneContent = $.parseJSON(request.content);
            if(sceneContent.environmentState){
                this.setEnvironment(sceneContent.environmentState);
            }
            this.isSTKTerrain = sceneContent.isSTKTerrain;
            if(this.isSTKTerrain == true){
                this.setTerrain(true);
            }
            if(sceneContent.baseLayer){
                var baseLayerModel = new BaseLayerModel(sceneContent.baseLayer);
                this.setBaseLayer(baseLayerModel);
            }
            var layersStore = sceneContent.layers;
            this.analysisObjects = sceneContent.analysisObjects;
            this.terrainObjects = sceneContent.terrainObjects;
            var parseObject = new parsePortalJson(this);
            sceneContent.parseObject = parseObject;
            for(var i = 0; i < layersStore.length; i++){
                var layerModel = new LayerModel(layersStore[i]);
                this.addLayer(layerModel,sceneContent);
            }

        },
        openScene : function (sceneUrl) {
                var that = this;
                var allUrl = sceneUrl + "/datas.xml";
                var namelist = new Array();
                var pathlist = new Array()
                $.ajax({
                    url: allUrl,
                    dataType: 'xml',
                    type: 'GET',
                    async: false,
                    timeout: 3000,
                    error: function(xml){

                    },
                    success: function(xml){
                        $(xml).find("name").each(function(i)
                        {
                            var id = $(this).children("id");
                            namelist[i] = id.context.innerHTML;
                        });
                        $(xml).find("path").each(function(i)
                        {
                            var id = $(this).children("id");
                            pathlist[i] = id.context.innerHTML;
                        });

                    }
                });

                var jsonUrl = sceneUrl + '/scenes.xml';
                var jsonPath;
                $.ajax({
                    url: jsonUrl,
                    dataType: 'xml',
                    type: 'GET',
                    async: false,
                    timeout: 3000,
                    error: function(xml){

                    },
                    success: function(xml){
                        $(xml).find("path").each(function(i)
                        {
                            var id = $(this).children("id");
                            jsonPath = id.context.innerHTML;
                        });

                    }
                });
                var typeUrl = jsonPath + '/layers.xml';

                // typeLayerName和typelist下标一一对应
                var typelist = new Array(); // 图层的类型
                var typeLayerName = new Array(); // 图层的名称

                $.ajax({
                    url: typeUrl,
                    dataType: 'xml',
                    type: 'GET',
                    async: false,
                    timeout: 3000,
                    error: function(xml){
                    },
                    success: function(xml){
                        $(xml).find("name").each(function(i){
                            var id = $(this).children("id");
                            typeLayerName[i] = id.context.innerHTML;
                        });

                        $(xml).find("layer3DType").each(function(i)
                        {
                            var id = $(this).children("id");
                            switch (id.context.innerHTML) {
                                case 'OSGBLayer':
                                    typelist[i] = 'S3M';
                                    break;
                                case 'ImageFileLayer':
                                    typelist[i] = 'IMAGERY';
                                    break;
                                case 'TerrainFileLayer':
                                    typelist[i] = 'TERRAIN';
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                });

                for(var i = 0;i < namelist.length;i++){
                    var typeIndex = typeLayerName.indexOf(namelist[i]);
                    var type = typelist[typeIndex];
                    if (type == 'S3M') {
                        pathlist[i] = pathlist[i] + "/config";
                    }

                    var layerModel = new LayerModel({
                        url : pathlist[i],
                        name : namelist[i],
                        type : typelist[i],
                        realName : name
                    });
                    that.addLayer(layerModel);
                }

        }
    });
    return SceneModel;
});