define(['./Container',
    '../3DGIS/modifyTerrain',
    '../3DGIS/excavationTerrain',
    '../3DGIS/isoline',
    '../3DGIS/terrainSlopeAnalysis',
    '../3DGIS/flood'
],function(Container,
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
        '<main class="mainView">',
        '<button aria-label="Close" id="closeScene" class="myModal-close"><span aria-hidden="true">&times;</span></button>',
        '<input id="terrainTab2" type="radio" name="terrainTab" checked>',
        '<label for="terrainTab2" class="function-module-caption">' + Resource.terrainSlope + '</label>',
        '<input id="terrainTab4" type="radio" name="terrainTab">',
        '<label for="terrainTab4" class="function-module-caption">' + Resource.isoline + '</label>',
        '<input id="terrainTab3" type="radio" name="terrainTab" >',
        '<label for="terrainTab3" class="function-module-caption">' + Resource.submergeAnalyze + '</label>',
        '<input id="terrainTab1" type="radio" name="terrainTab" >',
        '<label for="terrainTab1" class="function-module-caption">' + Resource.TerrainOperation + '</label>',

        '<section id="terrainContent1">',
        '<div class="function-module-content">',
            '<div class="function-module-sub-section">',
                '<label class="function-module-sub-section-caption">' + Resource.TilesetEditor + '</label>',
                '<div style="overflow: auto;">',
                    '<button class="btn btn-info function-module-btn" id="modifyTerrainDel" style="margin-top: 10px;">'+ Resource.eliminate +'</button>',
                    '<button class="btn btn-info function-module-btn function-module-btn-highlight" id="modifyTerrain" style="margin-top: 10px;">'+ Resource.analyze +'</button>',
                '</div>',
            '</div>',
            '<div>',
                '<label class="function-module-sub-section-caption">' + Resource.TerrainMining + '</label>',
                '<div>',
                    '<label class="function-module-sub-section-caption-indent">' + Resource.TerrainMiningDepth + '</label>',
                    '<input type="number" id="depth" class="input" value="1000" min="1" max="2000" required="required"/>',
                    '<div style="overflow: auto;">',
                        '<button class="btn btn-info function-module-btn" id="excavationTerrainDel" style="margin-top: 10px;">'+ Resource.eliminate +'</button>',
                        '<button class="btn btn-info function-module-btn function-module-btn-highlight" id="excavationTerrain" style="margin-top: 10px;">'+ Resource.analyze +'</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
        '</section>',
        '<section id="terrainContent2">',
        '<div class="function-module-content">',
            '<div class="function-module-sub-section">',
                '<label class="function-module-sub-section-caption">'+ Resource.analysisArea +'</label>',
                '<select id="calMode" class="cesium-button" style="margin: 0;font-size: 12px;width: 90%">',
                    '<option value="calModeall_plane" >'+ Resource.SpecifyPolygon +'</option>',
                    '<option value="calModeall_any">' + Resource.AllRegionsAnalysis + '</option>',
                    '<option value="calModeall_none">' + Resource.AllRegionsNOAnalysis + '</option>',
                '</select>',
            '</div>',
            '<div class="function-module-sub-section">',
                '<label class="function-module-sub-section-caption">'+ Resource.SlopeRange +'</label>',
                '<div class="function-module-sub-indent-section">',
                    '<label class="function-module-sub-section-caption-indent">'+ Resource.minimumGrade +'</label>',
                    '<input type="number" id="wideminR" class="input" min="0" max="90" value="0" step="0.01">',
                '</div>',
                '<div class="function-module-sub-indent-section">',
                    '<label class="function-module-sub-section-caption-indent">'+ Resource.maximumGrade +'</label>',
                    '<input type="number"  id="widemaxR" class="input" min="0" max="90"  value="78" step="0.01">',
                '</div>',
            '</div>',
            '<div>',
                '<label class="function-module-sub-section-caption">' + Resource.displayStyle + '</label>',
                '<div class="function-module-sub-indent-section">',
                    '<label class="function-module-sub-section-caption-indent">'+ Resource.fill +'</label>',
                    '<select id="showMode" class="cesium-button" style="font-size: 12px;margin: 0;width: 90%">',
                        ' <option value="calModeall_plane">' + Resource.ShowFillColor +'</option>',
                        '<option value="calModeall_any">' + Resource.ShowSlopeArrow +'</option>',
                        '<option value="calModeall_none">' + Resource.ShowColorArrow + '</option>',
                    '</select>',
                '</div>',
                '<label class="function-module-sub-section-caption-indent">'+ Resource.transparency +'</label>',
                '<input type="number" id="trans" class="input" min="0" max="1"  value="1" step="0.01">',
                '<label class="label-block">'+ Resource.SlopeExplain +'</label>',
            '</div>',
        '</div>',
        '<button type="button" id="terrainSlopeDel" class="btn btn-info function-module-btn">'+ Resource.eliminate +'</button>',
        '<button type="button" id="terrainSlope" class="btn btn-info function-module-btn function-module-btn-highlight">'+ Resource.analyze +'</button>',
        '</section>',

        '<section id="terrainContent3">',
        '<div class="function-module-content">',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">' + Resource.MaximumVisibleElevation + '</label>',
            '<input type="number" id="maxFloodHeight" class="input" value="9000" required="required"/>',
        '</div>',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">'+ Resource.MinimumVisibleElevation +'</label>',
            '<input type="number" id="minFloodHeight" class="input" value="1000" required="required"/>',
        '</div>',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">'+ Resource.transparency +'</label>',
            '<input type="number" id="floodTransparency" class="input" value="0.8" min="0.0" max="1.0" step="0.01" required="required"/>',
        '</div>',
        '<div>',
            '<label class="function-module-sub-section-caption">'+ Resource.PlayerSettings +'</label>',
            '<div class="function-module-sub-indent-section">',
                '<label class="function-module-sub-section-caption-indent">'+ Resource.TheCurrentLevel +'</label>',
                '<input type="number" id="speedElevation" class="input disabled" value="0.0" disabled="disabled" />',
            '</div>',
            '<div>',
                '<label class="function-module-sub-section-caption-indent">'+ Resource.speed +'</label>',
                '<input type="number" id="speed" class="input" value="1000" required="required"/>',
            '</div>',
        '</div>',
        '</div>',
        '<button type="button" id="floodDel" class="btn btn-info function-module-btn">'+ Resource.eliminate +'</button>',
        '<button type="button" id="flood" class="btn btn-info function-module-btn function-module-btn-highlight">'+ Resource.analyze +'</button>',
        '</section>',
        '<section id="terrainContent4">',
        '<div class="function-module-content">',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">'+ Resource.MaximumVisibleElevation +'</label>',
            '<input type="number" id="fillmaxHeight" class="input" value="9000" required="required" class="form-control"/>',
        '</div>',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">'+ Resource.MinimumVisibleElevation + '</label>',
            '<input type="number" id="fillminHeight" class="input" value="0.0" required="required" class="form-control"/>',
        '</div>',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">'+ Resource.isolineInterval +'</label>',
            '<input type="number" id="equivalent" class="input" value="100.0" required="required" class="form-control"/>',
        '</div>',
        '<div class="function-module-sub-section">',
            '<label class="function-module-sub-section-caption">'+ Resource.lineColor +'</label>',
            '<input id="colorPicker3" value="rgb(62, 245, 216)">',
        '</div>',
        '<div>',
            '<label class="function-module-sub-section-caption">'+ Resource.displayMode +'</label>',
            '<select id="fillOptions" class="cesium-button" style="font-size: 12px;margin: 0;width: 90%">',
                '<option selected value="Line">'+ Resource.ContourFilling +'</option>',
                '<option value="Region">'+ Resource.panelFilling +'</option>',
                '<option value="Line_Region">'+ Resource.ContourPanelFilling +'</option>',
                '<option value="None">'+ Resource.noColorTable +'</option>',
            '</select>',
        '</div>',
        '</div>',
        '<button type="button" id="fillDel" class="btn btn-info function-module-btn">'+ Resource.eliminate +'</button>',
        '<button type="button" id="fill" class="btn btn-info function-module-btn function-module-btn-highlight">'+ Resource.analyze +'</button>',
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
