define(['Cesium'],function(Cesium) {
    'use strict';
    var $ = require('jquery');

    /*
    * 坡度坡向分析对象
    * 需要带法线地形
    * 分析区域
    * 坡度区间
    * 填充模式
    * 透明度
    *
    * */

    var SlopePolygon;
    var terrainSlopeAnalysis = function () {
    };

    terrainSlopeAnalysis.remove = function(viewer){
        //清理坡度坡向分析结果
        viewer.scene.globe.SlopeSetting = {
            analysisMode : Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE
        };
        if(SlopePolygon){
            SlopePolygon.polygon.show=false;
            SlopePolygon.polyline.show=false;
        }
    };

    terrainSlopeAnalysis.initializing = function(viewer){
        //坡度坡向对象
        var slope = new Cesium.SlopeSetting();

        //坡度坡向分析初始化参数
        slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE;
        slope.MaxVisibleValue = document.getElementById("widemaxR").value;
        slope.MinVisibleValue =  document.getElementById("wideminR").value;
        var colorTable = new Cesium.ColorTable();
        colorTable.insert(0, new Cesium.Color(255/255, 0/255, 0/255));
        colorTable.insert(20, new Cesium.Color(221/255, 224/255, 7/255));
        colorTable.insert(30, new Cesium.Color(20/255, 187/255, 18/255));
        colorTable.insert(50, new Cesium.Color(0, 161/255, 1));
        colorTable.insert(80, new Cesium.Color(9/255, 9/255, 255/255));
        var wide =  Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION;
        slope.ColorTable = colorTable;
        slope.Opacity = document.getElementById("trans").value;

        //交互区域
        SlopePolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        SlopePolygon.activeEvt.addEventListener(function(isActive){
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
        SlopePolygon.drawEvt.addEventListener(function(result){
            if(!result.object.positions){
                SlopePolygon.polygon.show = false;
                SlopePolygon.polyline.show = false;
                SlopePolygon.deactivate();
                SlopePolygon.activate();
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
            //坡度坡向分析参数设置
            slope.CoverageArea = positions;
            viewer.scene.globe.SlopeSetting = {
                slopeSetting : slope,
                analysisMode : wide
            };
            SlopePolygon.polygon.show = false;
            SlopePolygon.deactivate();
        });
        SlopePolygon.activate();

        //最小分析坡度值
        $("#wideminR").on("input change",function(){
            $("#wideminRShow").text(this.value+'°');
            slope.MinVisibleValue = this.value;
            viewer.scene.globe.SlopeSetting = {
                slopeSetting : slope,
                analysisMode : wide
            };
        });

        //最大分析坡度值
        $("#widemaxR").on("input change",function(){
            $("#widemaxRShow").text(this.value+'°');
            slope.MaxVisibleValue = this.value;
            viewer.scene.globe.SlopeSetting = {
                slopeSetting : slope,
                analysisMode : wide
            };
        });

        //显示模式
        $("#calMode").on("input change",function(){
            var index = document.getElementById("calMode").selectedIndex;
            switch (index){
                case 0:   wide =  Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_REGION; break;
                case 1:   wide =  Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL; break;
                case 2:   wide =  Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_NONE; break;
                default:break;
            }
            viewer.scene.globe.SlopeSetting = {
                slopeSetting : slope,
                analysisMode : wide
            };
        });

        //分析区域
        $("#showMode").on("input change",function(){
            var index = document.getElementById("showMode").selectedIndex;
            switch (index){
                case 0:   slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE; break;
                case 1:   slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.ARROW; break;
                case 2:   slope.DisplayMode = Cesium.SlopeSettingEnum.DisplayMode.FACE_AND_ARROW; break;
                default:break;
            }
            viewer.scene.globe.SlopeSetting = {
                slopeSetting : slope,
                analysisMode : wide
            };
        });

        //透明度调节
        $("#trans").on("input change",function(){
            slope.Opacity = this.value;
            viewer.scene.globe.SlopeSetting = {
                slopeSetting : slope,
                analysisMode : wide
            };
        });
    }

    return terrainSlopeAnalysis;
});