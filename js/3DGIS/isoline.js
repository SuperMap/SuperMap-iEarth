define([],function() {
    'use strict';
  /*
  * 等值线分析对象，分层设色运用
  * 可见高程范围
  * 等值距
  * 线条颜色
  * 填充模式
  *
  * */

    var hyp;
    var isoline = function () {
    };

    isoline.remove = function(viewer){
        viewer.scene.globe.HypsometricSetting = undefined;
        hyp && (hyp.MaxVisibleValue = -1000);
        hyp && (hyp.MinVisibleValue = -1000);
    };

    isoline.initializing = function(viewer){
        var currentValue = $("#fillOptions").val();
        hyp = new Cesium.HypsometricSetting();

        //默认参数配置
        hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
        hyp._lineColor =  Cesium.Color.fromCssColorString($("#colorPicker3").val());
        hyp.LineInterval = parseFloat($("#equivalent").val());
        hyp.MaxVisibleValue = parseFloat($("#fillmaxHeight").val());
        hyp.MinVisibleValue = parseFloat($("#fillminHeight").val());
        hyp.ColorTableMinKey = 2736.88110351563;
        hyp.ColorTableMaxKey = 5597.06640625;

        //建立颜色表
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
        hyp.ColorTable = colorTable;
        hyp.Opacity = 0.4;

        //交互绘制
        var fillPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        fillPolygon.activeEvt.addEventListener(function(isActive){
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
        fillPolygon.drawEvt.addEventListener(function(result){
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

            //分析区域为指定区域
            hyp.CoverageArea = positions;
            switch (currentValue){
                case 'None' : viewer.scene.globe.HypsometricSetting = undefined;break;
                case 'Line' : {
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
                    viewer.scene.globe.HypsometricSetting = {
                        hypsometricSetting : hyp,
                        analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                    };
                }
                    break;
                case 'Region' : {
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
                    viewer.scene.globe.HypsometricSetting = {
                        hypsometricSetting : hyp,
                        analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                    };
                }
                    break;
                case 'Line_Region' : {
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
                    viewer.scene.globe.HypsometricSetting = {
                        hypsometricSetting : hyp,
                        analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                    };
                }
                    break;
                default : break;
            }

            fillPolygon.polygon.show = false;
            fillPolygon.polyline.show = false;
        });
        fillPolygon.activate();

        //填充模式
        $('#fillOptions').change(function(){
            var currentValue = $(this).val();
            switch (currentValue){
                case 'None' : viewer.scene.globe.HypsometricSetting = undefined;break;
                case 'Line' : {
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
                    viewer.scene.globe.HypsometricSetting = {
                        hypsometricSetting : hyp,
                        analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                    };
                }
                    break;
                case 'Region' : {
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
                    viewer.scene.globe.HypsometricSetting = {
                        hypsometricSetting : hyp,
                        analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                    };
                }
                    break;
                case 'Line_Region' : {
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
                    viewer.scene.globe.HypsometricSetting = {
                        hypsometricSetting : hyp,
                        analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
                    };
                }
                    break;
                default : break;
            }
        });

        //等值距
        $('#equivalent').on('input propertychange',function(){
            hyp.LineInterval = parseFloat(this.value);
            viewer.scene.globe.HypsometricSetting = {
                hypsometricSetting : hyp,
                analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
        })

        //最大可见高程
        $('#fillmaxHeight').on('input propertychange',function(){
            hyp.MaxVisibleValue = parseFloat(this.value);
            viewer.scene.globe.HypsometricSetting = {
                hypsometricSetting : hyp,
                analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
        })

        //最小可见高程
        $('#fillminHeight').on('input propertychange',function(){
            hyp.MinVisibleValue = parseFloat(this.value);
            viewer.scene.globe.HypsometricSetting = {
                hypsometricSetting : hyp,
                analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
        })

        //等值线的颜色
        $('#colorPicker3').change(function(){
            hyp._lineColor = Cesium.Color.fromCssColorString(this.value);
            viewer.scene.globe.HypsometricSetting = {
                hypsometricSetting : hyp,
                analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION
            };
        })
    }

    return isoline;
});