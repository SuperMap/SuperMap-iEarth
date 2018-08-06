define(['./Container',
    '../lib/Semantic/semantic',
    '../3DGIS/modifyTerrain',
    '../3DGIS/excavationTerrain',
    '../3DGIS/isoline',
    '../3DGIS/terrainSlopeAnalysis',
    '../3DGIS/flood'
],function(Container,
           semantic,
           modifyTerrain,
           excavationTerrain,
           isoline,
           terrainSlopeAnalysis,
           flood
){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var layers = [];
    var sceneModel;
    var htmlStr = [
        '<main style="position : absolute;right:50px; top : 10%;width: 300px">',
        '<button style="top: 10px;position: absolute;left: 90%;" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<input id="terrainTab2" type="radio" name="terrainTab" checked>',
        '<label for="terrainTab2" style="font-size: 13px">' + Resource.terrainSlope + '</label>',
        '<input id="terrainTab4" type="radio" name="terrainTab">',
        '<label for="terrainTab4" style="font-size: 13px">' + Resource.isoline + '</label>',
        '<input id="terrainTab3" type="radio" name="terrainTab" >',
        '<label for="terrainTab3" style="font-size: 13px">' + Resource.submergeAnalyze + '</label>',
        '<input id="terrainTab1" type="radio" name="terrainTab" >',
        '<label for="terrainTab1" style="font-size: 13px">' + Resource.TerrainOperation + '</label>',
        '<section id="terrainContent1">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<div>',
        '<a class="ui blue ribbon label">' + Resource.TilesetEditor + '</a><br><br>',
        '<button class="btn btn-info" id="modifyTerrainDel" style="float: right">'+ Resource.eliminate +'</button>',
        '<button class="btn btn-info" id="modifyTerrain" style="float: right">'+ Resource.analyze +'</button>',
        '</div><br><br>',
        '<div>',
        '<a class="ui teal ribbon label">' + Resource.TerrainMining + '</a>',
        '<label style="font-size:13px;">' + Resource.TerrainMiningDepth + '</label><br><br>',
        '<input id="depth" class="inputLine" value="1000" required="required" class="form-control"/>',
        '<button class="btn btn-info" id="excavationTerrainDel" style="float: right">'+ Resource.eliminate +'</button>',
        '<button class="btn btn-info" id="excavationTerrain" style="float: right">'+ Resource.analyze +'</button><br>',
        '</div>',
        '</div>',
        '</section>',
        '<section id="terrainContent2">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<div>',
        '<a class="ui blue ribbon label">'+ Resource.analysisArea +'</a><br><br>',
        '<select id="calMode" class="cesium-button" style="font-size: 12px;margin: 0px 0px -5px 0px;width: 90%">',
        '<option value="calModeall_plane" >'+ Resource.SpecifyPolygon +'</option>',
        '<option value="calModeall_any">' + Resource.AllRegionsAnalysis + '</option>',
        '<option value="calModeall_none">' + Resource.AllRegionsNOAnalysis + '</option>',
        '</select><br><br>',
        '</div>',
        '<div>',
        '<a class="ui teal ribbon label">'+ Resource.SlopeRange +'</a>',
        '<label>'+ Resource.minimumGrade +'</label>',
        '<input type="number"  id="wideminR" class="input" min="0" max="90"  value="0" step="0.01">',
        '<label>'+ Resource.maximumGrade +'</label>',
        '<input type="number"  id="widemaxR" class="input" min="0" max="90"  value="78" step="0.01"><br><br>',
        '</div>',
        '<div>',
        '<a class="ui green ribbon label">' + Resource.displayStyle + '</a>',
        '<label>'+ Resource.fill +'</label>',
        '<select id="showMode" class="cesium-button" style="font-size: 12px;margin: 0px 0px -5px 0px;width: 90%">',
        ' <option value="calModeall_plane">' + Resource.ShowFillColor +'</option>',
        '<option value="calModeall_any">' + Resource.ShowSlopeArrow +'</option>',
        '<option value="calModeall_none">' + Resource.ShowColorArrow + '</option>',
        '</select>',
        '<label>'+ Resource.transparency +'</label>',
        '<input type="number" id="trans" class="input" min="0" max="1"  value="1" step="0.01">',
        '<label>'+ Resource.SlopeExplain +'</label>',
        '<button type="button" id="terrainSlopeDel" class="btn btn-info" style="float: right">'+ Resource.eliminate +'</button>',
        '<button type="button" id="terrainSlope" class="btn btn-info" style="float: right">'+ Resource.analyze +'</button>',
        '</div>',
        '</section>',
        '<section id="terrainContent3">',

        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">' + Resource.parameterSetting +'</a><br>',
        '<label  style="font-size:13px">' + Resource.MaximumVisibleElevation + '</label>',
        '<input type="number" id="maxFloodHeight" class="input" value="9000" required="required"/>',
        '<label  style="font-size:13px">'+ Resource.MinimumVisibleElevation +'</label>',
        '<input type="number" id="minFloodHeight" class="input" value="1000" required="required"/>',
        '<label  style="font-size:13px">'+ Resource.transparency +'</label>',
        '<input type="number" id="floodTransparency" class="input" value="0.8" min="0.0" max="1.0" step="0.01" required="required"/><br><br>',
        '<a class="ui teal ribbon label">'+ Resource.PlayerSettings +'</a><br>',
        '<label  style="font-size:13px">'+ Resource.TheCurrentLevel +'</label>',
        '<input  type="number" id="speedElevation" class="input" value="0.0" disabled="disabled"  style="width: 50%"/><br>',
        '<label  style="font-size:13px">'+ Resource.speed +'</label>',
        '<input  type="number" id="speed" class="input" value="1000" required="required"/><br>',
        '<button type="button" id="floodDel" class="btn btn-info" style="float: right">'+ Resource.eliminate +'</button>',
        '<button type="button" id="flood" class="btn btn-info" style="float: right">'+ Resource.analyze +'</button>',
        '</div>',
        '</section>',
        '<section id="terrainContent4">',
        '<div class="ui raised segment" style="margin: 10px; background: #3b4547 ">',
        '<a class="ui blue ribbon label">'+ Resource.parameterSetting +'</a><br>',
        '<label>'+ Resource.MaximumVisibleElevation +'</label>',
        '<input type="number" id="fillmaxHeight" class="input" value="9000" required="required" class="form-control"/>',
        '<label>'+ Resource.MinimumVisibleElevation + '</label>',
        '<input type="number" id="fillminHeight" class="input" value="0.0" required="required" class="form-control"/>',
        '<label>'+ Resource.isolineInterval +'</label>',
        '<input type="number" id="equivalent" class="input" value="100.0" required="required" class="form-control"/>',
        '<label>'+ Resource.lineColor +'</label>',
        '<input id="colorPicker3" value="rgb(62, 245, 216)"><br><br>',
        '<a class="ui teal ribbon label">'+ Resource.displayMode +'</a><br><br>',
        '<select id="fillOptions" class="cesium-button" style="font-size: 12px;margin: 0px 0px -5px 0px;width: 90%">',
        '<option selected value="Line">'+ Resource.ContourFilling +'</option>',
        '<option value="Region">'+ Resource.panelFilling +'</option>',
        '<option value="Line_Region">'+ Resource.ContourPanelFilling +'</option>',
        '<option  value="None">'+ Resource.noColorTable +'</option>',
        '</select>',
        '<button type="button" id="fillDel" class="btn btn-info" style="float: right">'+ Resource.eliminate +'</button>',
        '<button type="button" id="fill" class="btn btn-info" style="float: right">'+ Resource.analyze +'</button>',
        '</div>',
        '</section>',
        '</main>',
    ].join('');
    var terrainForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #modifyTerrain'  : 'onModifyTerrainClk',
            'click #modifyTerrainDel'  : 'onModifyTerrainDelClk',
            'click #excavationTerrain'  : 'onExcavationTerrainClk',
            'click #excavationTerrainDel'  : 'onExcavationTerrainDelClk',
            'click #terrainSlope'  : 'onTerrainSlopeClk',
            'click #terrainSlopeDel'  : 'onTerrainSlopeDelClk',
            'click #flood'  : 'onFloodClk',
            'click #floodDel'  : 'onFloodDelClk',
            'click #fill'  : 'onFillClk',
            'click #fillDel'  : 'onFillDelClk',
            'change input[type=file]' : 'onInputChange'
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            sceneModel = options.sceneModel;
            for(var i = 0; i < options.sceneModel.layers.models.length; i++){
                layers.push(options.sceneModel.layers.models[i].layer);
            }
            this.render();
            this.on('componentAdded',function(parent){
                $('main').each(function(index){
                    $(this).myDrag({
                        parent:'body', //定义拖动不能超出的外框,拖动范围
                        randomPosition:false, //初始化随机位置
                        direction:'all', //方向
                        handler:false, //把手
                        dragStart:function(x,y){}, //拖动开始 x,y为当前坐标
                        dragEnd:function(x,y){}, //拖动停止 x,y为当前坐标
                        dragMove:function(x,y){} //拖动进行中 x,y为当前坐标
                    });
                });

                $("#colorPicker3").spectrum({
                    color: "rgb(62, 245, 216)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            modifyTerrain.remove(viewer);
            excavationTerrain.remove(viewer);
            terrainSlopeAnalysis.remove(viewer);
            flood.remove(viewer);
            isoline.remove(viewer);

            return false;
        },
        onModifyTerrainClk : function(evt){
            modifyTerrain.initializing(viewer,sceneModel);
        },
        onModifyTerrainDelClk : function(evt){
            modifyTerrain.remove(viewer);
        },
        onExcavationTerrainClk : function(evt){
            excavationTerrain.initializing(viewer,sceneModel);
        },
        onExcavationTerrainDelClk : function(evt){
            excavationTerrain.remove(viewer);
        },
        onTerrainSlopeClk : function(evt){
            terrainSlopeAnalysis.initializing(viewer,sceneModel);
        },
        onTerrainSlopeDelClk : function(evt){
            terrainSlopeAnalysis.remove(viewer);
        },
        onFloodClk : function(evt){
            flood.initializing(viewer,sceneModel);
        },
        onFloodDelClk : function(evt){
            flood.remove(viewer);
        },
        onFillClk : function(evt){
            isoline.initializing(viewer,sceneModel);
        },
        onFillDelClk : function(evt){
            isoline.remove(viewer);
        }

    });
    return terrainForm;
});
