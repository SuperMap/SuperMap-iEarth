define(['Cesium','../lib/SuperMap','../lib/Convert'],function(Cesium, Super, Convert) {
    'use strict';

   /*
   * 地形修改对象
   * 地形修改目前区域点底层不可交互编辑
   * */
    var modifyPolygon;
    var modifyTerrain = function () {
    };

    modifyTerrain.remove = function(viewer){
        //移除地形修改结果
        viewer.scene.globe.removeAllModifyRegion();
        if(modifyPolygon){
            modifyPolygon.polygon.show=false;
            modifyPolygon.polyline.show=false;
        }
    };

    modifyTerrain.initializing = function(viewer){
        modifyPolygon = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Polygon,0);
        modifyPolygon.activeEvt.addEventListener(function(isActive){
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
        modifyPolygon.drawEvt.addEventListener(function(result){
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
            viewer.scene.globe.removeAllModifyRegion();
            //地形修改参数设置
            viewer.scene.globe.addModifyRegion({
                name:'ggg',
                position:positions,
            });
            modifyPolygon.polygon.show = false;
            modifyPolygon.polyline.show = false;
            modifyPolygon.deactivate();

        });
        modifyPolygon.activate();

    }

    return modifyTerrain;
});