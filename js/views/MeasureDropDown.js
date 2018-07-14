define(['./Container','Cesium','../tools/Area'],function(Container,Cesium,Area){
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
               "<a id='measureDisBtn' title='" + Resource.measureDis + "' class='btn btn-inverse' style='margin : 5px;'><span class='smicon-distance' ></span></a>",
               "<a id='measureAreaBtn'  title='" + Resource.measureArea + "' class='btn btn-inverse' style='margin : 5px;'><span class='smicon-area' ></span></a>",
               "<a id='measureHeightBtn'  title='" + Resource.measureHeight + "' class='btn btn-inverse' style='margin : 5px;'><span class='smicon-height' ></span></a>",
               "<a id='delResBtn' title='" + Resource.close + "' class='btn btn-inverse' style='margin : 5px;'><span class='fui-cross' ></span></a>",
           "</div>",
       "</div>",
        '<div>',
            "<div class='measure-title' style='float:left;font-size: 12px'>" + "模式：" + "</div>",
            '<select id="selOpt" class="cesium-button" style="font-size: 12px">',
                '<option value="1">空间量算</option>',
                '<option value="2">贴地量算</option>',
            '</select>',
        '</div><br>',
        '<div>',
        '<label style="font-size: 12px;vertical-align: middle;margin: 7px" id="singleIsolineLabel"><input type="radio" id="singleIsoline" name="showIsoline" <%= isolineMode == "singleIsoline" ? "checked" : "" %>/><span>单等高线</span></label>',
        '<label style="font-size: 12px;vertical-align: middle;margin: 7px" id="multiIsolineLabel"><input type="radio" id="multiIsoline" name="showIsoline" <%= isolineMode == "multiIsoline" ? "checked" : "" %>/><span>多等高线</span></label>',
        '</div>',
        '<div id="isoline-interval-setting" style="margin-top:10px;display: flex;flex-direction:row;align-items:center;">',
            "<div class='measure-title' style='float:left;font-size: 12px'>" + "等高距(米)：" + "</div>",
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
        	this.$el.css('min-width','180px');
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
                handlerDis.disLabel.text = '距离:' + distance;
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
                var area = result.area > 1000000 ? (result.area/1000000).toFixed(2) + 'km²' : result.area + '㎡'
                handlerArea.areaLabel.text = '面积:' + area;
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
                handlerHeight.disLabel.text = '空间距离:' + distance;
                handlerHeight.vLabel.text = '垂直高度:' + vHeight;
                handlerHeight.hLabel.text = '水平距离:' + hDistance;
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