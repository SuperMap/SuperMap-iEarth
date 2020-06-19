define([],function() {
    'use strict';
   /*
   * 地形开挖对象，比较简单，目前只提供了开挖深度接口
   *
   * */

    var excavationTerrain = function () {
    };

    excavationTerrain.remove = function(viewer){
        //移除分析的开挖区域
        viewer.scene.globe.removeAllExcavationRegion();
    };

    excavationTerrain.initializing = function(viewer){
        var digPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        digPolygon.activeEvt.addEventListener(function(isActive){
            //开挖激活后改变cursor
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
        digPolygon.drawEvt.addEventListener(function(result){
            //计算地形开挖的顶点坐标，经纬度表达
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
            //开挖深度
            var dep = $('#depth').val();
            viewer.scene.globe.removeAllExcavationRegion();
            //开挖参数配置
            viewer.scene.globe.addExcavationRegion({
                name : 'excavation' ,
                position : positions,
                height : dep,
                transparent : false
            });
            //交互绘制线面不显示
            digPolygon.polygon.show = false;
            digPolygon.polyline.show = false;
            digPolygon.deactivate();
        });
        digPolygon.activate();
    }

    return excavationTerrain;
});