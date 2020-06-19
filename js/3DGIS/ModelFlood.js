/**
 * 模型上的淹没分析
 */
define([], function(){
    var ModelFlood = function(){
    };

    var hasInitialized = false, hyp = null, colorTable = null, currentHeight = 0, timer = null;
    ModelFlood.initialize = function(){
        hyp = new Cesium.HypsometricSetting();
        colorTable = new Cesium.ColorTable();
        colorTable.insert(71, new Cesium.Color(0, 39/255, 148/255));
        colorTable.insert(0, new Cesium.Color(149/255, 232/255, 249/255));
        hyp.ColorTable = colorTable;
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
        hyp.Opacity = 0.7;
        hyp.LineInterval = 10.0;

        hasInitialized = true;
    };

    ModelFlood.startAnalysis = function(layer){
        if(!hasInitialized){
            this.initialize();
        }
        var maxHeight = parseInt(document.getElementById("flood-max-height").value);
        var minHeight = parseInt(document.getElementById("flood-min-height").value);
        var speed = parseInt(document.getElementById("flood-speed").value);
        currentHeight = minHeight;

        timer = window.requestAnimationFrame(function(){
            floodTimer(layer, maxHeight, minHeight, speed);
        });
    };

    function floodTimer(layer, maxHeight, minHeight, speed){
        if(currentHeight >= maxHeight){
            window.cancelAnimationFrame (timer);
            timer = null;
            return;
        }
        hyp.MaxVisibleValue = currentHeight;
        hyp.MinVisibleValue = minHeight;

        layer.hypsometricSetting = {
            hypsometricSetting : hyp,
            analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        };

        currentHeight += (parseInt(document.getElementById("flood-speed").value)) / 20;

        timer = window.requestAnimationFrame(function(){
            floodTimer(layer, maxHeight, minHeight, speed);
        });
    }

    ModelFlood.clear = function(layer){
        window.cancelAnimationFrame(timer);
        hyp.MaxVisibleValue = 0;
        layer.hypsometricSetting = {
            hypsometricSetting : hyp,
            analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
        }
    };

    ModelFlood.destroy = function(layer){
        this.clear(layer);
        hyp = null;
        colorTable = null;
        hasInitialized = false;
    };

    return ModelFlood;
});