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
           "<a id='measureHeightBtn'  title='" + "测高" + "' class='btn btn-inverse' style='margin : 5px;'><span class='smicon-height' ></span></a>",
           "<a id='delResBtn' title='" + Resource.close + "' class='btn btn-inverse' style='margin : 5px;'><span class='fui-cross' ></span></a>",
           "</div>",
       "</div>",
        '<div>',
        "<div class='measure-title' style='float:left;font-size: 12px'>" + "模式：" + "</div>",
        '<select id="selOpt" class="cesium-button" style="font-size: 12px">',
        '<option value="1">空间量算</option>',
        '<option value="2">贴地量算</option>',
        '</select>',
        '</div>'
       ].join('');
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
        	this.sceneModel = options.sceneModel;
        	viewer = this.sceneModel.viewer;
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
        }
    });
    return MeasureDropDown;
});