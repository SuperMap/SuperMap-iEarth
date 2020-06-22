define([],function() {
    var splitSrc = function () {
    };
    var layers;
    var Marble;
    var blackMarble;
    splitSrc.isStart = false;
    splitSrc.start = function (viewer) {
        if (splitSrc.isStart == true) {
            return;
        }
        splitSrc.isStart = true;
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewer.scene.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(116.46, 39.92, 6378137*3),
            duration : 0.1
        });
        document.getElementById('slider').style.display='block';
        layers = viewer.imageryLayers;
        Marble=layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: './images/BlackMarble_2016_3km.jpg'
        }));
        blackMarble = layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: './images/BlackMarble_2012_3km.jpg'
        }));
        blackMarble.splitDirection = Cesium.ImagerySplitDirection.RIGHT; // 新添加的影像图层只显示在滑块左侧

        //分割条位置与slider同步
        var slider = document.getElementById('slider');
        viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

        var dragStartX = 0;

        document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);

        function mouseUp() {
            window.removeEventListener('mousemove', sliderMove, true);
        }

        function mouseDown(e) {
            var slider = document.getElementById('slider');
            dragStartX = e.clientX - slider.offsetLeft;
            window.addEventListener('mousemove', sliderMove, true);
        }

        function sliderMove(e) {
            var slider = document.getElementById('slider');
            var splitPosition = (e.clientX - dragStartX) / slider.parentElement.offsetWidth;
            slider.style.left = 100.0 * splitPosition + "%";
            viewer.scene.imagerySplitPosition = splitPosition;
        }

    };
    splitSrc.remove = function(viewer){
        document.getElementById('slider').style.display='none';
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: './images/baseImage.png'
        }));
        viewer.scene.globe.depthTestAgainstTerrain = true;
        splitSrc.isStart = false;
    };
    return splitSrc;
});
