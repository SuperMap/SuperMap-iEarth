define(['./Container','Cesium','../tools/Area'],function(Container,Cesium,Area){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var handlerDis;
    var handlerArea;
    var handlerHeight;
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
        '<label style="position: absolute;left: 10px;" for="show-isoline";>',
            '<input type="checkbox" id="show-isoline" style="vertical-align: middle;" onclick="return false;" checked="checked"/>',
            '<span style="font-size: 12px;vertical-align: middle;">显示等高线</span>',
        '</label><br>',
        '<div id="isoline-interval-setting" style="margin-top:10px;display: flex;flex-direction:row;align-items:center;">',
            "<div class='measure-title' style='float:left;font-size: 12px'>" + "等高距：" + "</div>",
            "<input type='number' class='input' id='isoline-interval' style='width: 80px;font-size: 12px;' value='20' step='1' min='1'/>",
        '</div>',
       ].join('');

    var isoline;
    var sceneModel;
    var layers = [];
    var MeasureDropDown = Container.extend({
        tagName : 'div',
        id : 'measureDropDown',
        template : _.template(htmlStr),
        events : {
        	'click #measureDisBtn' : 'onMeasureDisBtnClk',
        	'click #measureAreaBtn' : 'onMeasureAreaBtnClk',
            'click #measureHeightBtn' : 'onMeasureHeightBtnClk',
        	'click #delResBtn' : 'onDelResBtnClk'
        },
        initialize : function(options){
        	sceneModel = options.sceneModel;
        	viewer = sceneModel.viewer;
            handlerDis = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.Distance,0);
            handlerArea = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.Area,0);
            handlerHeight = new Cesium.MeasureHandler(viewer,Cesium.MeasureMode.DVH);
        	this.render();
            this.on('componentAdded',function(parent){
                $('#MeasureDropDown').myDrag({
                    parent:'body',
                    randomPosition:false,
                    direction:'all',
                    handler:false,
                    dragStart:function(x,y){},
                    dragEnd:function(x,y){},
                    dragMove:function(x,y){}
                });
            });
        },
        render : function(){
        	this.$el.html(this.template());
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
            $('#show-isoline').click(function () {
                this.checked = !this.checked;
                this.blur();
                this.focus();
            });
            createIsoline();
            handlerHeight.measureEvt.addEventListener(function(result){
                var distance = result.distance > 1000 ? (result.distance/1000).toFixed(2) + 'km' : result.distance + 'm';
                var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight/1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
                var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance/1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
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
        },
    });
    function  createIsoline() {
        if(!isoline){
            isoline = new Cesium.HypsometricSetting();
        }
        isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
        isoline._lineColor =  new Cesium.Color(1.0, 0.0, 0.0, 1.0);
        isoline.LineInterval = 1;
        isoline.MaxVisibleValue = 171;
        isoline.MinVisibleValue = 166;
        isoline.ColorTableMinKey = 2736.88110351563;
        isoline.ColorTableMaxKey = 5597.06640625;
        var colorTable = new Cesium.ColorTable();
        colorTable.insert(5597.06640625,new Cesium.Color(0, 0, 255/255));
        colorTable.insert(5406.3873860677086,new Cesium.Color(0, 51/255, 255/255));
        colorTable.insert(5215.7083658854172,new Cesium.Color(0, 102/255, 255/255));
        colorTable.insert(5025.0293457031257,new Cesium.Color(0, 153/255, 255/255));
        colorTable.insert(4834.3503255208343,new Cesium.Color(0, 204/255, 255/255));
        colorTable.insert(4643.6713053385429,new Cesium.Color(0, 255/255, 255/255));
        colorTable.insert(4452.9922851562524,new Cesium.Color(51/255, 255/255, 204/255));
        colorTable.insert(4262.3132649739609,new Cesium.Color(102/255, 255/255, 153/255));
        colorTable.insert(4071.6342447916695,new Cesium.Color(153/255, 255/255, 102/255));
        colorTable.insert(3880.9552246093781,new Cesium.Color(204/255, 255/255, 51/255));
        colorTable.insert(3690.2762044270867,new Cesium.Color(255/255, 255/255, 0));
        colorTable.insert(3499.5971842447952,new Cesium.Color(255/255, 204/255, 0));
        colorTable.insert(3308.9181640625038,new Cesium.Color(255/255, 153/255, 0));
        colorTable.insert(3118.2391438802129,new Cesium.Color(255/255, 102/255, 0));
        colorTable.insert(2927.5601236979214,new Cesium.Color(255/255, 51/255, 0));
        colorTable.insert(2736.88110351563,new Cesium.Color(255/255, 0, 0));
        isoline.ColorTable = colorTable;
        isoline.Opacity = 0.4;
        // viewer.scene.globe.HypsometricSetting = {
        //     hypsometricSetting : isoline,
        //     analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        // };

        for(var i = 0; i < sceneModel.layers.models.length; i++){
            if(sceneModel.layers.models[i].layer.clipLineColor){
                layers.push(sceneModel.layers.models[i].layer);
            }
        }
        for(var i = 0;i < layers.length;i++)
        layers[i].hypsometricSetting = {
            hypsometricSetting : isoline,
            analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        };
    }
    return MeasureDropDown;
});