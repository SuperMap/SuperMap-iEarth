define(['./Container','../tools/Area'],function(Container,Area){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var handlerDis;
    var handlerArea;
    var handlerHeight;
    var height = 0;
    var isoline;
    var sceneModel;
    var layers = [];
    var htmlStr = [
       "<div class='btn-toolbar'>",
           "<div class='btn-group' style='margin: 5px 5px 5px 8px;'>",
               "<a id='measureDisBtn' title='" + Resource.measureDis + "' class='btn btn-inverse' style='margin: 5px;'><span class='iconfont icon-measure_length'></span></a>",
               "<a id='measureAreaBtn'  title='" + Resource.measureArea + "' class='btn btn-inverse' style='margin : 5px;'><span class='iconfont icon-measure_area'></span></a>",
               "<a id='measureHeightBtn'  title='" + Resource.measureHeight + "' class='btn btn-inverse' style='margin: 5px;'><span class='iconfont icon-measure_height'></span></a>",
               "<a id='delResBtn' title='" + Resource.close + "' class='btn btn-inverse' style='margin: 5px;'><span class='iconfont icon-measure_clear'></span></a>",
           "</div>",
       "</div>",
        '<div style="display: flex;flex-direction:row;align-items:center;margin: 10px 0 0 10px;">',
            '<label style="font-size: 12px;vertical-align: middle;" id="singleIsolineLabel"><input type="radio" id="singleIsoline" name="showIsoline" <%= isolineMode == "singleIsoline" ? "checked" : "" %>/><span>'+ Resource.SingleContour +'</span></label>',
            '<label style="font-size: 12px;vertical-align: middle;margin-left: 10px" id="multiIsolineLabel"><input type="radio" id="multiIsoline" name="showIsoline" <%= isolineMode == "multiIsoline" ? "checked" : "" %>/><span>'+ Resource.MoreContour +'</span></label>',
        '</div>',
        '<div id="isoline-interval-setting" style="display: flex;flex-direction:row;align-items:center;">',
            "<div class='measure-title' style='float:left;font-size: 12px'>" + Resource.heightInterval + "</div>",
            "<input type='number' class='input' id='isoline-interval' style='width: 80px;font-size: 12px;' value='50' step='1' min='1'/>",
        '</div>',
       ].join('');
    var isolineMode = "singleIsoline";
    var MeasureDropDown = Container.extend({
        tagName : 'div',
        id : 'measureDropDown',
        template : _.template(htmlStr),
        events : {
            'click #measureDisBtn' : 'onMeasureDisBtnClk',
            'click #measureAreaBtn' : 'onMeasureAreaBtnClk',
            'click #measureHeightBtn' : 'onMeasureHeightBtnClk',
            'click #delResBtn' : 'onDelResBtnClk',
            'click #singleIsolineLabel': 'onShowSingleIsoline',
            'click #multiIsolineLabel': 'onShowMultiIsoline'
        },
        initialize : function(options){
        	sceneModel = options.sceneModel;
        	viewer = sceneModel.viewer;
        	layers = viewer.scene.layers._layers._array;
            handlerDis = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.Distance,0);
            handlerArea = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.Area,0);
            handlerHeight = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.DVH);
        	this.render();
            this.on('componentAdded',function(parent){
            });
        },
        render : function(){
        	this.$el.html(this.template({isolineMode: isolineMode}));
        	this.$el.addClass('dropDown-container');
        	this.$el.css('min-width','210px');
            return this;
        },
        onMeasureDisBtnClk : function(evt){
            $("#selOpt").on("input change",function() {
                var value = $(this).val();
                if(value == '1'){
                    handlerDis.clampMode = 0;
                    handlerArea.clampMode = 0;
                }
                else{
                    handlerDis.clampMode = 1;
                    handlerArea.clampMode = 1;
                }
            });
            handlerDis.measureEvt.addEventListener(function(result){
                var distance = result.distance > 1000 ? (result.distance/1000).toFixed(2) + 'km' : result.distance + 'm';
                handlerDis.disLabel.text = Resource.distance + ':' + distance;
            });
            handlerDis.activeEvt.addEventListener(function(isActive){
                if(isActive == true){
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                }
                else{
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            handlerDis.activate();
        },
        onMeasureAreaBtnClk : function(evt){
            $("#selOpt").on("input change",function() {
                var value = $(this).val();
                if(value == '1'){
                    handlerDis.clampMode = 0;
                    handlerArea.clampMode = 0;
                }
                else{
                    handlerDis.clampMode = 1;
                    handlerArea.clampMode = 1;
                }
            });
            handlerArea.measureEvt.addEventListener(function(result){
                var mj = Number(result.area);
                var area = mj > 1000000 ? (mj/1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡';
                handlerArea.areaLabel.text = Resource.area+ ':' + area;
            });
            handlerArea.activeEvt.addEventListener(function(isActive){
                if(isActive == true){
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                }
                else{
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            handlerArea.activate();
        },
        onMeasureHeightBtnClk : function(evt){
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function(evt){
                var pick = viewer.scene.pickPosition(evt.position);
                var ecartographic = Cesium.Cartographic.fromCartesian(pick);
                height = ecartographic.height;
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },Cesium.ScreenSpaceEventType.LEFT_CLICK);

            handlerHeight.measureEvt.addEventListener(function(result){
                var distance = result.distance > 1000 ? (result.distance/1000).toFixed(2) + 'km' : result.distance + 'm';
                var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight/1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
                var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance/1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
                createIsoline(result.verticalHeight);
                handlerHeight.disLabel.text = Resource.SpatialDistance +':' + distance;
                handlerHeight.vLabel.text = Resource.VerticalHeight +':' + vHeight;
                handlerHeight.hLabel.text = Resource.HorizontalDistance +':' + hDistance;
            });
            handlerHeight.activeEvt.addEventListener(function(isActive){
                if(isActive == true){
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                }
                else{
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            handlerHeight.activate();
        },
        onDelResBtnClk : function(evt){
            handlerDis  && handlerDis.clear();
            handlerArea  && handlerArea.clear();
            handlerHeight && handlerHeight.clear();
            viewer.scene.globe.HypsometricSetting = undefined;
            if(isoline){
                for(var i = 0;i < layers.length;i++){
                    layers[i].hypsometricSetting = undefined;
                }
            }
        },
        onShowSingleIsoline: function(){
            isolineMode = "singleIsoline";
            this.render();
        },
        onShowMultiIsoline: function(){
            isolineMode = "multiIsoline";
            this.render();
        }

    });
    function  createIsoline(verticalHeight) {
        if(!isoline){
            isoline = new Cesium.HypsometricSetting();
        }
        isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
        isoline._lineColor =  Cesium.Color.YELLOW ;
        var interval = parseFloat($("#isoline-interval").val());
        isoline.LineInterval = interval;
        if($('#singleIsoline').is(':checked')){
            isoline.MinVisibleValue = height + parseFloat(verticalHeight);
            isoline.MaxVisibleValue = height +parseFloat(verticalHeight) + interval;
        }
        else{
            isoline.MinVisibleValue = height;
            isoline.MaxVisibleValue = height +parseFloat(verticalHeight);
        }
        var colorTable = new Cesium.ColorTable();
        isoline.ColorTable = colorTable;
        isoline.Opacity = 0.4;
        viewer.scene.globe.HypsometricSetting = {
            hypsometricSetting : isoline,
            analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        };
        for(var i = 0;i < layers.length;i++){
            layers[i].hypsometricSetting = {
                hypsometricSetting : isoline,
                analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
            };
        }
    }
    return MeasureDropDown;
});