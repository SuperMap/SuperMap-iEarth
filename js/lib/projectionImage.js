define(['Cesium'],function(Cesium){
    'use strict';

    function projectionImage(){

    }


    var proj;
    projectionImage.start = function(viewer,layer){
        var defer = Cesium.when.defer();
        var scene = viewer.scene;
        proj = new Cesium.ProjectionImage(scene);
        proj.viewPosition = [113.7164,34.7663,233.29];
        proj.horizontalFov = 10;
        proj.verticalFov = 8;
        proj.hintLineVisible = false;
        var p = new Cesium.Cartesian3(-2107517.6435329816, 4797070.671934844, 3637238.60361943);
        var p2 = Cesium.Cartographic.fromCartesian(p);
        var lon = Cesium.Math.toDegrees(p2.longitude);
        var lat = Cesium.Math.toDegrees(p2.latitude);
        var h = p2.height;
        proj.setDistDirByPoint([lon,lat,h]);
        projectionImage.distance = 200;
        var videoElement = document.getElementById('trailer');
        proj.setImage({video : videoElement});
        scene.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(113.7164,34.7663,233.29),
            orientation : {
                heading : 0.5921,
                pitch : -0.3795,
                roll : 0
            },
            easingFunction : Cesium.EasingFunction.LINEAR_NONE,
            complete : function(){
                $('#info').text('视频投放');
                proj.build();
                setTimeout(function(){
                    defer.resolve(true);
                    proj.destroy();
                    proj = undefined;
                    $('#info').text('');
                },6000);
            }
        });

        return defer;
    };
    projectionImage.remove = function(){
        if(proj){
            proj.destroy();
        }
    };

    return projectionImage;
});