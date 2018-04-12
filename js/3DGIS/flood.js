define(['Cesium','../lib/SuperMap','../lib/Convert'],function(Cesium, Super, Convert) {
    'use strict';
  /*
  * 淹没分析对象，和等值线同源
  * 交互区域内分析
  * 播放设置
  * */

    var hyp;
    var interval;
    var floodPolygon;
    var flood = function () {
    };

    flood.remove = function(viewer){
        if(hyp){
            self.clearInterval(interval);
            hyp.MaxVisibleValue = 0;
            viewer.scene.globe.HypsometricSetting = {
                hypsometricSetting : hyp,
                analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
            }
        }
    };

    flood.initializing = function(viewer){
        hyp = new Cesium.HypsometricSetting();
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        hyp._lineColor = new Cesium.Color(1.0, 0.0, 0.0, 1.0);
        hyp.MinVisibleValue = 0;
        hyp.ColorTableMinKey = 1;
        hyp.ColorTableMaxKey = 9000;
        var colorTable = new Cesium.ColorTable();
        colorTable.insert(9000, new Cesium.Color(0, 39/255, 148/255));
        colorTable.insert(0, new Cesium.Color(149/255, 232/255, 249/255));
        hyp.ColorTable = colorTable;
        hyp.Opacity = parseFloat(document.getElementById("floodTransparency").value);
        hyp.LineInterval = 200.0;
        floodPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        floodPolygon.activeEvt.addEventListener(function(isActive){
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
        floodPolygon.drawEvt.addEventListener(function(result){
            if(!result.object.positions){
                floodPolygon.polygon.show = false;
                floodPolygon.polyline.show = false;
                floodPolygon.deactivate();
                floodPolygon.activate();
                return;
            };
            var array = [].concat(result.object.positions);
            var positions = [];
            for(var i = 0, len = array.length; i < len; i ++){
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h=cartographic.height;
                if(positions.indexOf(longitude)==-1&&positions.indexOf(latitude)==-1){
                    positions.push(longitude);
                    positions.push(latitude);
                    positions.push(h);
                }
            }
            flood(positions);
            floodPolygon.polygon.show = false;
            floodPolygon.polyline.show = false;
            floodPolygon.deactivate();
        });
        floodPolygon.activate();
        function flood(positions){
           var currentHeight = 0;
           interval = self.setInterval("flood()", 100);
           var maxValue = parseFloat(document.getElementById("maxFloodHeight").value);
           var minValue = parseFloat(document.getElementById("minFloodHeight").value);
            hyp.MinVisibleValue = minValue;
            currentHeight = minValue;
            window.flood = function() {
                if(currentHeight <= maxValue) {
                    $("#speedElevation").val(currentHeight);
                }
                if(currentHeight > maxValue) {
                    self.clearInterval(interval);
                    return;
                }
                hyp.MaxVisibleValue = currentHeight;
                hyp.CoverageArea = positions;
                viewer.scene.globe.HypsometricSetting = {
                    hypsometricSetting : hyp,
                    analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                };
                currentHeight += (parseFloat(document.getElementById("speed").value))/10;
            }
        }
    }

    return flood;
});