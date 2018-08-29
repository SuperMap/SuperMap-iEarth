/**
 * Box裁剪
 */
define(['Cesium', 'jquery', '../Util'], function(Cesium, $, Util){
    var BoxClip = function(){};
    var hasInitialized = false, startClip = false, hasClipped = false, layers = [], screenSpaceEventHandler = null, position = null;
    var width, height, length, rotate, clipMode;

    BoxClip.initialize = function(viewer){
        var scene = viewer.scene;
        layers = scene.layers.layerQueue;
        var $boxClipLength = $('#box-clip-length'),
            $boxClipWidth = $('#box-clip-width'),
            $boxClipHeight = $('#box-clip-height'),
            $boxClipRotate = $('#box-clip-rotate'),
            $boxClipMode = $('#box-clip-mode');

        if(Number($boxClipLength.val()) <= 0){
            if($.trim($boxClipLength.val()) === ''){
                Util.showErrorMsg("裁剪盒长度不应为空");
            }else{
                Util.showErrorMsg("裁剪盒长度应为正值");
            }
            return false;
        }

        if(Number($boxClipWidth.val()) <= 0){
            if($.trim($boxClipWidth.val()) === ''){
                Util.showErrorMsg("裁剪盒宽度不应为空");
            }else{
                Util.showErrorMsg("裁剪盒宽度应为正值");
            }
            return false;
        }

        if(Number($boxClipHeight.val()) <= 0){
            if($.trim($boxClipHeight.val()) === ''){
                Util.showErrorMsg("裁剪盒高度不应为空");
            }else{
                Util.showErrorMsg("裁剪盒高度应为正值");
            }
            return false;
        }

        if($.trim($boxClipRotate.val()) === ''){
            Util.showErrorMsg("旋转角度不应为空");
            return false;
        }

        $boxClipLength.on('input propertychange', function () {
            var temp_length = Number($(this).val());
            if(temp_length <= 0){
                return;
            }
            length = temp_length;
            if(hasClipped){
                setClipBox();
            }
        });
        $boxClipLength.on('blur', function(){
            var temp_length = Number($(this).val());
            if(temp_length <= 0){
                $(this).val(length);
            }
        });

        $boxClipWidth.on('input propertychange', function () {
            var temp_width = Number($(this).val());
            if(temp_width <= 0){
                return;
            }
            width = temp_width;
            if(hasClipped){
                setClipBox();
            }
        });
        $boxClipWidth.on('blur', function(){
            var temp_width = Number($(this).val());
            if(temp_width <= 0){
                $(this).val(width);
            }
        });

        $boxClipHeight.on('input propertychange', function () {
            var temp_height = Number($(this).val());
            if(temp_height <= 0){
                return;
            }
            height = temp_height;
            if(hasClipped){
                setClipBox();
            }
        });
        $boxClipHeight.on('blur', function(){
            var temp_height = Number($(this).val());
            if(temp_height <= 0){
                $(this).val(height);
            }
        });

        $boxClipMode.on('input propertychange', function () {
            clipMode = $(this).val();
            if(hasClipped){
                setClipBox();
            }
        });

        $boxClipRotate.on('input propertychange', function () {
            if($.trim($(this).val()) === ''){
                return;
            }
            rotate = Cesium.Math.toRadians(Number($(this).val()));
            if(hasClipped){
                setClipBox();
            }
        });
        $boxClipRotate.on('blur', function(){
            if($.trim($(this).val()) === ''){
                $(this).val(rotate);
            }
        });

        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        screenSpaceEventHandler.setInputAction(function (evt) {
            height = Number($boxClipHeight.val());
            width = Number($boxClipWidth.val());
            length = Number($boxClipLength.val());
            if(height <= 0 || width <= 0 || length <= 0){
                return;
            }
            rotate = Cesium.Math.toRadians(Number($boxClipRotate.val()));
            clipMode = $boxClipMode.val();
            if(startClip){
                position = scene.pickPosition(evt.position);
                setClipBox();
                startClip = false;
                hasClipped = true;
            }
            /*
            // iPortal对接代码
            var boxEntityStore = {};
            boxEntityStore.length = length;
            boxEntityStore.width = width;
            boxEntityStore.height = width;
            boxEntityStore.rotate = rotate;
            boxEntityStore.position = cartesian;
            boxEntityStore.index = document.getElementById("clipMode").selectedIndex;
            boxEntityStore.clipMode = $('#clipMode').val();
            sceneModel.analysisObjects.boxClipStore = boxEntityStore;
            */
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        /*
         // iPortal对接代码
        if (sceneModel.analysisObjects.boxClipStore) {
            var box = sceneModel.analysisObjects.boxClipStore;
            var length = box.length;
            var width = box.width;
            var height = box.height;
            var hpr = new Cesium.HeadingPitchRoll(box.rotate, 0, 0);
            var orientation = Cesium.Transforms.headingPitchRollQuaternion(box.position, hpr);
            boxEntity = viewer.entities.add({
                id: "box-clip-custom-box",
                box: {
                    dimensions: new Cesium.Cartesian3(length, width, height),
                    material: Cesium.Color.fromRandom({alpha: 0.1})
                },
                position: box.position,
                orientation: orientation
            });
            boxEntity.index = box.index;
            boxEntity.clipMode = box.clipMode;
            boxEntity.rotate = box.rotate;
            setClipBox();
        }*/

        hasInitialized = true;

        return true;
    };

    BoxClip.startClip = function(viewer){
        if(!hasInitialized){
            var initialSuccess = this.initialize(viewer);
            if(!initialSuccess){
                return;
            }
        }
        startClip = true;
    };

    BoxClip.clear = function(){
        for (var layer of layers) {
            layer.clearCustomClipBox();
        }
    };

    BoxClip.destroy = function(viewer){
        this.clear();
        viewer.entities.getById('box-clip-custom-box') && viewer.entities.removeById('box-clip-custom-box');
        screenSpaceEventHandler && screenSpaceEventHandler.destroy();
        hasInitialized = false;
    };

    function setClipBox() {
        var dim = new Cesium.Cartesian3(length, width, height);
        var hasClipLine = false;
        var clipModeOption = null;
        switch (clipMode){
            case 'clip_behind_all_plane_with_line_frame':
                hasClipLine = true;
                clipModeOption = 'clip_behind_all_plane';
                break;
            case 'clip_behind_any_plane_with_line_frame':
                hasClipLine = true;
                clipModeOption = 'clip_behind_any_plane';
                break;
            case 'clip_behind_all_plane_without_line_frame':
                hasClipLine = false;
                clipModeOption = 'clip_behind_all_plane';
                break;
            case 'clip_behind_any_plane_without_line_frame':
                hasClipLine = false;
                clipModeOption = 'clip_behind_any_plane';
                break;
        }
        var boxOptions = {
            dimensions: dim,
            position: position,
            clipMode: clipModeOption,
            heading: rotate
        };

        for (var layer of layers) {
            hasClipLine ? (layer.clipLineColor = new Cesium.Color(1, 1, 1, 1)) : (layer.clipLineColor = new Cesium.Color(1, 1, 1, 0));
            layer.setCustomClipBox(boxOptions);
        }
    }

    return BoxClip;
});