/**
 * Cross裁剪
 */
define(['Cesium', 'jquery', '../Util'], function(Cesium, $, Util){

    var CrossClip = function(){
    };

    var box, boxPosition, position, dim, width, height, heading = 0, pitch = 0, roll = 0, extrudeDistance = 1.0, startClip = true, hasClipped = false;
    var hasInitialized = false, screenSpaceEventHandler = null, layers = [];

    CrossClip.initialize = function(viewer){
        var $crossClipWidth = $('#cross-clip-width'),
            $crossClipHeight = $('#cross-clip-height'),
            $crossClipPitch = $('#cross-clip-pitch'),
            $crossClipRoll = $('#cross-clip-roll'),
            $crossClipHeading = $('#cross-clip-heading'),
            $crossClipExtrude = $('#cross-clip-extrude');

        var scene = viewer.scene;
        layers = viewer.scene.layers.layerQueue;

        boxPosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
        width = Number($crossClipWidth.val());
        height = Number($crossClipHeight.val());
        heading = Number($crossClipHeading.val());
        pitch = Number($crossClipPitch.val());
        roll = Number($crossClipRoll.val());
        extrudeDistance = Number($crossClipExtrude.val());

        if(width <= 0){
            if($.trim($crossClipWidth.val()) === ''){
                Util.showErrorMsg('裁剪盒宽度不应为空');
            }else{
                Util.showErrorMsg('裁剪盒宽度应为正值');
            }
            return false;
        }

        if(height <= 0){
            if($.trim($crossClipHeight.val()) === ''){
                Util.showErrorMsg('裁剪盒高度不应为空');
            }else{
                Util.showErrorMsg('裁剪盒高度应为正值');
            }
            return false;
        }

        if($.trim($crossClipPitch.val()) === ''){
            Util.showErrorMsg('绕X轴旋转角度不应为空');
            return false;
        }

        if($.trim($crossClipRoll.val()) === ''){
            Util.showErrorMsg('绕Y轴旋转角度不应为空');
            return;
        }

        if($.trim($crossClipHeading.val()) === ''){
            Util.showErrorMsg('绕Z轴旋转角度不应为空');
            return;
        }

        if(extrudeDistance <= 0){
            if($.trim($crossClipExtrude.val()) === ''){
                Util.showErrorMsg('裁剪盒拉伸距离不应为空');
            }else{
                Util.showErrorMsg('裁剪盒拉伸距离应为正值');
            }
            return false;
        }

        dim = new Cesium.Cartesian3(width, height, extrudeDistance);

        box = viewer.entities.add({ // 标识盒
            id: 'cross-clip-identify-box',
            position: boxPosition,
            show: true,
            box : {
                dimensions : new Cesium.Cartesian3(width, height, 0.1),
                fill : false,
                outline : true,
                outlineColor : Cesium.Color.WHITE,
                outlineWidth: 5.0
            }
        });

        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        screenSpaceEventHandler.setInputAction(function(movement){
            if(startClip){
                boxPosition = scene.pickPosition(movement.endPosition);
                if(!boxPosition){
                    return ;
                }
                box.position = boxPosition;
                var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
                var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
                box.orientation = orientation;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        screenSpaceEventHandler.setInputAction(function (evt) {
            if(startClip){
                position = scene.pickPosition(evt.position);
                if(!position){
                    return ;
                }
                updateClip();
                startClip = false;
                hasClipped = true;
                box.show = false;

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        $crossClipWidth.on('input propertychange', function() {
            var temp_width = Number($(this).val());
            if(temp_width <= 0){
                return;
            }
            width = temp_width;
            box.box.dimensions = new Cesium.Cartesian3(width, height, 0.1);
            dim = new Cesium.Cartesian3(width, height, extrudeDistance);
            if(hasClipped){
                updateClip();
            }
        });
        $crossClipWidth.on('blur', function(){
            var temp_width = Number($(this).val());
            if(temp_width <= 0){
                $(this).val(width);
            }
        });

        $crossClipHeight.on('input propertychange', function() {
            var temp_height = Number($(this).val());
            if(temp_height <= 0){
                return;
            }
            height = Number($(this).val());
            box.box.dimensions = new Cesium.Cartesian3(width, height, 0.1);
            dim = new Cesium.Cartesian3(width, height, extrudeDistance);
            if(hasClipped){
                updateClip();
            }
        });
        $crossClipHeight.on('blur', function(){
            var temp_height = Number($(this).val());
            if(temp_height <= 0){
                $(this).val(height);
            }
        });

        $crossClipPitch.on('input propertychange', function() {
            if($.trim($(this).val()) === ''){
                return;
            }
            pitch = Number($(this).val());
            var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            box.orientation = orientation;
            if(hasClipped){
                updateClip();
            }
        });
        $crossClipPitch.on('blur', function(){
            if($.trim($(this).val()) === ''){
                $(this).val(pitch);
            }
        });

        $crossClipRoll.on('input propertychange', function() {
            if($.trim($(this).val()) === ''){
                return;
            }
            roll = Number($(this).val());
            var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            box.orientation = orientation;
            if(hasClipped){
                updateClip();
            }
        });
        $crossClipRoll.on('blur', function(){
            if($.trim($(this).val()) === ''){
                $(this).val(roll);
            }
        });

        $crossClipHeading.on('input propertychange', function() {
            if($.trim($(this).val()) === ''){
                return;
            }
            heading = Number($(this).val());
            var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            box.orientation = orientation;
            if(hasClipped){
                updateClip();
            }
        });
        $crossClipHeading.on('blur', function(){
            if($.trim($(this).val()) === ''){
                $(this).val(heading);
            }
        });

        $crossClipExtrude.on('input propertychange', function(){
            var temp_extrudeDistance = Number($(this).val());
            if(temp_extrudeDistance <= 0){
                return;
            }
            extrudeDistance = temp_extrudeDistance;
            if(hasClipped){
                updateClip();
            }
        });
        $crossClipExtrude.on('blur', function(){
            var temp_extrudeDistance = Number($(this).val());
            if(temp_extrudeDistance <= 0){
                $(this).val(extrudeDistance);
            }
        });

        hasInitialized = true;

        return true;
    };

    CrossClip.startClip = function(viewer){
        if(!hasInitialized){
            var initialSuccess = this.initialize(viewer);
            if(!initialSuccess){
                return;
            }
        }
        startClip = true;
        box.show = true;
    };

    CrossClip.clear = function(){
        hasClipped = false;
        for (var layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    CrossClip.destroy = function(viewer){
        this.clear();
        layers && (layers = []);
        screenSpaceEventHandler && screenSpaceEventHandler.destroy();
        box && viewer.entities.removeById('cross-clip-identify-box');
        hasInitialized = false;
    };

    function updateClip() {
        for(var layer of layers){
            layer.setCustomClipCross({
                position : position,
                dimensions : dim,
                heading : heading,
                pitch : pitch,
                roll : roll,
                extrudeDistance : extrudeDistance
            });
        }
    }

    return CrossClip;
});