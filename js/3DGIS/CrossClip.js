/**
 * Cross裁剪
 */
define(['Cesium', 'jquery'], function(Cesium, $){

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

        boxPosition = new Cesium.Cartesian3(0, 0, 0);
        width = Number($crossClipWidth.val());
        height = Number($crossClipHeight.val());
        heading = Number($crossClipHeading.val());
        pitch = Number($crossClipPitch.val());
        roll = Number($crossClipRoll.val());
        extrudeDistance = Number($crossClipExtrude.val());

        var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
        var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);

        dim = new Cesium.Cartesian3(width, height, extrudeDistance);

        box = viewer.entities.add({ // 标识盒
            id: 'cross-clip-identify-box',
            position: boxPosition,
            orientation: orientation,
            show: true,
            box : {
                dim : dim,
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
            width = Number($(this).val());
            box.box.dimensions = new Cesium.Cartesian3(width, height, 0.1);
            dim = new Cesium.Cartesian3(width, height, extrudeDistance);
            if(hasClipped){
                updateClip();
            }
        });

        $crossClipHeight.on('input propertychange', function() {
            height = Number($(this).val());
            box.box.dimensions = new Cesium.Cartesian3(width, height, 0.1);
            dim = new Cesium.Cartesian3(width, height, extrudeDistance);
            if(hasClipped){
                updateClip();
            }
        });

        $crossClipPitch.on('input propertychange', function() {
            pitch = Number($(this).val());
            var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            box.orientation = orientation;
            if(hasClipped){
                updateClip();
            }
        });

        $crossClipRoll.on('input propertychange', function() {
            roll = Number($(this).val());
            var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            box.orientation = orientation;
            if(hasClipped){
                updateClip();
            }
        });

        $crossClipHeading.on('input propertychange', function() {
            heading = Number($(this).val());
            var hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(pitch), Cesium.Math.toRadians(roll));
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(boxPosition, hpr);
            box.orientation = orientation;
            if(hasClipped){
                updateClip();
            }
        });

        $crossClipExtrude.on('input propertychange', function(){
            extrudeDistance = Number($(this).val());
            if(hasClipped){
                updateClip();
            }
        });

        hasInitialized = true;
    };

    CrossClip.startClip = function(viewer){
        if(!hasInitialized){
            this.initialize(viewer);
        }
        startClip = true;
        box.show = true;
    };

    CrossClip.clear = function(){
        for (var layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    CrossClip.destroy = function(){
        this.clear();
        layers && (layers = null);
        screenSpaceEventHandler && (screenSpaceEventHandler = null);
        box && viewer.entities.removeById('cross-clip-identify-box');
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