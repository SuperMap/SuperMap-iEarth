define(['./Container','../lib/knob','../3DGIS/viewshed3D','../3DGIS/skyline','../3DGIS/shadowQuery','../3DGIS/sightline','drag','spectrum','slider','../3DGIS/profile'],function(Container, knob, viewshed, skyLine, shadow, sgline, drag, spectrum, slider, profile){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var parentContainer;
    var sceneModel;
    var isPCBroswer;

    var htmlStr = [
        '<main class="mainView">',
        '<button aria-label="Close" id="closeMain" class="myModal-close"><span aria-hidden="true">&times;</span></button>',
        '<input id="tab3" type="radio" name="tabs" checked>',
        '<label for="tab3" class="function-module-caption">' + Resource.sightline + '</label>',
        '<input id="tab1" type="radio" name="tabs" >',
        '<label for="tab1" class="function-module-caption">' + Resource.viewShed + '</label>',
        '<input id="tab2" type="radio" name="tabs">',
        '<label id="tab2Label" for="tab2" class="function-module-caption">' + Resource.shadowAnalysis + '</label>',
        '<input id="tab5" type="radio" name="tabs">',
        '<label for="tab5" class="function-module-caption">' + Resource.profile + '</label>',
        '<input id="tab4" type="radio" name="tabs">',
        '<label for="tab4" class="function-module-caption">' + Resource.skyline + '</label>',
        '<section id="content1">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.ObserverInformation +'</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">'+ Resource.longitude + ', ' + Resource.latitude + ', ' + Resource.altitude + '</label>',
                        '<input type="text" id="viewshed-observation-place" class="input disabled" disabled style="width: 95%;"/>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.additionalHeight +'</label>',
                        '<input type="number" id="heightView" class="input" step="0.1" min="0" value="1.8">',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.visualRange +'</label>',
                        '<input type="number" id="distance" class="input" min="1" step="1" value="1.0" title='+Resource.distance +'>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.directionAngle +'</label>',
                        '<input type="number" id="direction" class="input" min="0" max="360" step="1.0" value="0.0" title='+Resource.direction +'>',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.ElevationAngle +'</label>',
                        '<input type="number" id="viewshed-pitch" class="input" min="-90" max="90" step="1.0" value="0.0" title='+Resource.roll +'>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.horizontalFov +'</label>',
                        '<input type="number" id="horizontalFov" class="input" min="1" max="120" step="1.0" value="90" title='+Resource.horizontalFov +'>',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.verticalFov +'</label>',
                        '<input type="number" id="verticalFov"  class="input" min="1" max="90" step="1.0" value="60" title='+ Resource.verticalFov +' >',
                    '</div>',
                '</div>',
                '<div style="overflow: auto;">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.visibleColor +'</label>',
                        '<input class="colorPicker" id="colorPicker1"/>',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.invisibleColor +'</label>',
                        '<input class="colorPicker" id="colorPicker2"/>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button"  class="btn btn-info function-module-btn" id="clearVS">'+ Resource.eliminate +'</button>',
            '<button type="button"  class="btn btn-info function-module-btn function-module-btn-highlight" id="chooseView">'+ Resource.analyze +'</button>',
        '</section>',

        '<section id="content2">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.date + '</label>',
                    '<input id="selDate" type="date" value="2017-11-27" style="width: 95%;"/>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.startTime +'</label>',
                        '<select id="startTime">',
                            '<option value="0">0:00</option>',
                            '<option value="2">2:00</option>',
                            ' <option value="4">4:00</option>',
                            '<option value="6">6:00</option>',
                            '<option value="8">8:00</option>',
                            '<option value="10" selected>10:00</option>',
                            '<option value="12">12:00</option>',
                            '<option value="14">14:00</option>',
                            '<option value="16">16:00</option>',
                            '<option value="18">18:00</option>',
                            ' <option value="20">20:00</option>',
                            ' <option value="22">22:00</option>',
                        '</select>',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.endTime +'</label>',
                        '<select id="endTime">',
                            '<option value="2">2:00</option>',
                            '<option value="4">4:00</option>',
                            '<option value="6">6:00</option>',
                            '<option value="8">8:00</option>',
                            '<option value="10">10:00</option>',
                            '<option value="12">12:00</option>',
                            '<option value="14" selected>14:00</option>',
                            '<option value="16">16:00</option>',
                            '<option value="18">18:00</option>',
                            '<option value="20">20:00</option>',
                            '<option value="22">22:00</option>',
                            '<option value="24">24:00</option>',
                        '</select>',
                    '</div>',
                '</div>',
                '<div style="overflow: auto;">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.bottomAltitude +'</label>',
                        '<input id="bottomHeight" class="input" value="20" type="number"/>',
                        /*'<button id="clickQuery" class="btn btn-info" style="margin-top: -5px">'+Resource.ClickToSearchAltitude+'</button>',*/
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.extrudeHeight +'</label>',
                        '<input id="extrudeHeight" class="input" value="20" type="number"/>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" class="btn btn-info function-module-btn" id="clear">'+ Resource.clear +'</button>',
            '<button type="button" class="btn btn-info function-module-btn" id="sunlight">'+ Resource.sunlight +'</button>',
            '<button type="button" class="btn btn-info function-module-btn function-module-btn-highlight" id="shadowAnalysis">'+ Resource.shadowAnalysis +'</button>',
        '</section>',

        '<section id="content3">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.ObserverInformation + '</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">'+ Resource.longitude + ', ' + Resource.latitude + ', ' + Resource.altitude + '</label>',
                        '<input type="text" id="sight-observation-place" class="input disabled" disabled style="width: 95%;"/>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.visibleColor +'</label>',
                        '<input class="colorPicker" id="visibleColor"/>',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.hideenColor +'</label>',
                        '<input class="colorPicker" id="hiddenColor"/>',
                    '</div>',
                '</div>',
                '<div style="overflow: auto;">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.highlightBarrierColor +'</label>',
                        '<input class="colorPicker" id="sightline-highlight-barrier-color"/>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" class="btn btn-info function-module-btn" id="clearSL">'+ Resource.eliminate +'</button>',
            '<button type="button" class="btn btn-info function-module-btn" id="sightline-highlight-barrier">' + Resource.highlightBarrier + '</button>',
            '<button type="button" class="btn btn-info function-module-btn function-module-btn-highlight" id="addViewpoint">'+ Resource.analyze +'</button>',
        '</section>',

        '<section id="content4">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">'+ Resource.ObserverInformation +'</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">'+ Resource.longitude + ', ' + Resource.latitude + ', ' + Resource.altitude + '</label>',
                        '<input type="text" id="skyview-observation-position" class="input disabled width-adjust" disabled/>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.skylineColor +'</label>',
                        '<input class="colorPicker" id="skylineColor"/>',
                    "</div>",
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.highlightBarrierColor +'</label>',
                        '<input class="colorPicker" id="skyline-highlight-barrier-color"/>',
                    "</div>",
                '</div>',
                '<div style="overflow: hidden;">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.displayMode +'</label>',
                        '<select id="skylineMode">',
                            '<option value="0" selected>'+ Resource.polyline +'</option>',
                            '<option value="1">'+ Resource.polygon +'</option>',
                            /*'<option value="2">'+ Resource.skylinesectorbody +'</option>', // 需要iServer910支持 */
                        '</select>',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">'+ Resource.skylineRadius +'</label>',
                        '<input class="input" type="number" value="1000" step="10" id="skylineRadius"/>',
                    '</div>',
                '</div>',
            '</div>',
            '<button class="btn btn-info function-module-btn" id="clearSkyline">'+ Resource.clear +'</button>',
            '<button class="btn btn-info function-module-btn" id="skyline-highlight-barrier">'+ Resource.highlightBarrier +'</button>',
            '<button class="btn btn-info function-module-btn" id="getSkyline2D">'+ Resource.graphDisplay +'</button>',
            '<button class="btn btn-info function-module-btn function-module-btn-highlight"  id="getSkyline">'+ Resource.skyline +'</button>',
        '</section>',
        '<section id="content5">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">'+ Resource.startingInformation +'</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">'+ Resource.longitude + ', ' + Resource.latitude + ',' + Resource.altitude + '</label>',
                        '<input type="text" id="profile-start-position" class="input disabled" disabled/>',
                    '</div>',
                '</div>',
                '<div>',
                    '<label class="function-module-sub-section-caption">'+ Resource.endInformation +'</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">'+ Resource.longitude + ', ' + Resource.latitude + ',' + Resource.altitude + '</label>',
                        '<input type="text" id="profile-end-position" class="input disabled" disabled/>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" id="profileDel" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
            '<button type="button" id="profile" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.analyze + '</button>',
        '</section>',
        '</main>'
    ].join('');

    var analysisTools = Container.extend({
        tagName: 'div',
        id: 'analysisTools',
        template: _.template(htmlStr),
        events : {
            'click #closeMain'  : 'onCloseMainClk',
            'click #tab1' : 'onCheckTab1',
            'click #tab2' : 'onCheckTab2',
            'click #tab3' : 'onCheckTab3',
            'click #tab4' : 'onCheckTab4',
            'click #tab5' : 'onCheckTab5',
            'click #addViewpoint'  : 'onAddViewpointClk',
            'click #sightline-highlight-barrier': 'onSightlineHighlightBarrier',
            'click #chooseView'  : 'onChooseViewClk',
            'click #shadowAnalysis'  : 'onShadowAnalysisClk',
            'click #profile'  : 'onProfileClk',
            'click #getSkyline'  : 'onGetSkylineClk',
            'click #skyline-highlight-barrier': 'onSkylineHighlightBarrier',
            'click #profileDel'  : 'onProfileDelClk',
            'click #clickQuery'  : 'onClickQueryClk'
        },
        initialize : function(options){
            this.viewer = options.sceneModel.viewer;
            sceneModel = options.sceneModel;
            parentContainer = options.parent;
            isPCBroswer = options.isPCBroswer
            this.render();
            this.on('componentAdded',function(parent){
                viewer = this.viewer;
                $('main').each(function(index){
                    $(this).myDrag({
                        parent:'body',
                        randomPosition:false,
                        direction:'all',
                        handler:false,
                        dragStart:function(x,y){},
                        dragEnd:function(x,y){},
                        dragMove:function(x,y){}
                    });
                });
                $(".colorPicker").spectrum({
                    color: "#fff",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette
                });
                $("#visibleColor").spectrum({
                    change:function(){
                        $('#visibleColor').trigger('input');
                    },
                    color: "rgb(0, 200, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                });
                $("#hiddenColor").spectrum({
                    change:function(){
                        $('#hiddenColor').trigger('input');
                    },
                    color: "rgb(200, 0, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm
                });
                $('#sightline-highlight-barrier-color').spectrum({ // 通视分析障碍物高亮颜色
                    color: "rgba(255, 255, 255, 1)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(color) {
                        sgline.highlightBarrier(viewer);
                    }
                });
                $("#colorPicker1").spectrum({
                    change:function(){
                        $('#colorPicker1').trigger('input');
                    },
                    color: "rgb(0, 200, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm
                });
                $('#colorPicker2').spectrum({
                    change:function(){
                        $('#colorPicker2').trigger('input');
                    },
                    color: "rgb(200, 0, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm
                });
                $("#skylineColor").spectrum({
                    change:function(){
                        $('#skylineColor').trigger('input');
                    },
                    color: "rgb(200, 0, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm
                });

                $("#skyline-highlight-barrier-color").spectrum({ // 天际线高亮障碍物颜色
                    color: "rgb(200, 0, 0, 100)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(color) {
                        skyLine.highlightBarrier(viewer);
                    }
                });
                $("#selDate").val(getNowFormatDate());
                if(sceneModel.analysisObjects.viewshed3DStore){
                    viewshed.initializing(viewer,sceneModel);
                }
                if(sceneModel.analysisObjects.sightLineStore){
                    sgline.initializing(viewer,sceneModel);
                }
                if(sceneModel.analysisObjects.skylineStore){
                    skyLine.initializing(viewer,parentContainer,sceneModel);
                }

            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseMainClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            var viewer = this.viewer;
            viewshed.remove(viewer);
            skyLine.remove(viewer);
            sgline.remove(viewer);
            skyLine.remove(viewer);
            return false;
        },
        onCheckTab1 : function(){
            var viewer = this.viewer;
            shadow.remove(viewer);
            skyLine.remove(viewer);
            sgline.remove(viewer);
            profile.remove(viewer,parentContainer);
        },
        onCheckTab2 : function(){
            var viewer = this.viewer;
            viewshed.remove(viewer);
            skyLine.remove(viewer);
            sgline.remove(viewer);
            profile.remove(viewer,parentContainer);
        },
        onCheckTab3 : function(){
            var viewer = this.viewer;
            shadow.remove(viewer);
            skyLine.remove(viewer);
            viewshed.remove(viewer);
            profile.remove(viewer,parentContainer);
        },
        onCheckTab4 : function(){
            var viewer = this.viewer;
            viewshed.remove(viewer);
            shadow.remove(viewer);
            sgline.remove(viewer);
            profile.remove(viewer,parentContainer);
        },
        onCheckTab5 : function(){
            var viewer = this.viewer;
            viewshed.remove(viewer);
            shadow.remove(viewer);
            skyLine.remove(viewer);
            sgline.remove(viewer);

        },
        onAddViewpointClk : function(){
            sgline.initializing(viewer,sceneModel);
            if(!isPCBroswer){
                this.$el.hide();
            }
        },
        onSightlineHighlightBarrier: function(){
            sgline.highlightBarrier(viewer);
        },
        onProfileClk : function(evt){
            profile.initializing(viewer,parentContainer,sceneModel, isPCBroswer);
            if(!isPCBroswer){
                this.$el.hide();
            }
        },
        onProfileDelClk : function(evt){
            profile.remove(viewer,parentContainer,sceneModel);
        },
        onChooseViewClk : function(evt){
            viewshed.initializing(viewer,sceneModel, isPCBroswer);
            if(!isPCBroswer){
                this.$el.hide();
            }
        },
        onShadowAnalysisClk : function(evt){
            shadow.initializing(viewer,sceneModel);
            if(!isPCBroswer){
                this.$el.hide();
            }
        },
        onGetSkylineClk : function(evt){
            skyLine.initializing(viewer,parentContainer,sceneModel);
            if(!isPCBroswer){
                this.$el.hide();
            }
        },
        onSkylineHighlightBarrier: function(evt){
            skyLine.highlightBarrier(viewer);
        },
        onClickQueryClk : function(evt){
            var scene = viewer.scene;
            var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function(e) {
                var position = scene.pickPosition(e.position);
                var cartographic = Cesium.Cartographic.fromCartesian(position);
                var height = cartographic.height;
                $("#bottomHeight").val(height.toFixed(9));
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            if(!isPCBroswer){
                this.$el.hide();
            }
        },
    });

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    return analysisTools;
});
