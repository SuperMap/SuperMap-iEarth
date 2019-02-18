define(['./Container', 'Cesium', '../3DGIS/flyRoute', 'drag', 'slider', '../lib/tooltip', '../Util'], function (Container, Cesium, flyRoute, drag, slider, tooltip, Utils) {
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var scene;
    var viewer;
    var camera;
    var handler;
    var me;
    var flyCirclePoint = null;
    var rollerShutterConfig = null;
    var isPCBroswer;
    var lightSourceType = 0; // 光源类型，初始时为点光源
    var pointLightSourceDrawHandler = null; // 绘制点光源位置工具
    var spotOrDirectionalLightSourceDrawHandler = null; // 绘制聚光灯的工具
    var spotOrDirectionalLightSourceCountHandler = null;
    var spotOrDirectionalLightSourceAdding = false;
    var spotOrDirectionalLightPositions = [];
    var entityPointLightPairs = new Map(); // Entity和点光源对象的键值对
    var entitySpotLightPairs = new Map(); // Entity和聚光灯对象的键值对
    var entityDirectionalLightPairs = new Map(); // Entity和平行光对象的键值对
    var flyCircleDrawHandler = null;


    var htmlStr = [
        '<main class="mainView" id="sceneForm">',
        '<button aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">&times</span></button>',

        '<input id="scene-attribute-basic" name="scene-attribute" type="radio" checked/>',
        '<label for="scene-attribute-basic" class="function-module-caption">' + Resource.basicOptions + '</label>',
        '<input id="scene-attribute-camera" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-camera" class="function-module-caption">' + Resource.camera + '</label>',
        '<input id="scene-attribute-light" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-light" class="function-module-caption">' + Resource.light + '</label>',
        '<input id="scene-attribute-others" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-others" class="function-module-caption">' + Resource.otherOptions + '</label>',

        '<section id="scene-attribute-basic-content">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<div class="function-module-sub-indent-section">',
                        '<label class="third">',
                            '<input type="checkbox" id="earth" checked/>',
                            '<span>' + Resource.earth + '</span>',
                        '</label>',
                        '<label class="third">',
                            '<input type="checkbox" id="shadows"/>',
                            '<span>' + Resource.shadowMap + '</span>',
                        '</label>',
                        '<label class="third">',
                            '<input type="checkbox" id="lightRender" checked/>',
                            '<span>' + Resource.sun + '</span>',
                        '</label>',
                    '</div>',
                    '<div class="function-module-sub-indent-section">',
                        '<label class="third">',
                            '<input type="checkbox" id="timeline"/>',
                            '<span>' + Resource.timeline + '</span>',
                        '</label>',
                        '<label class="third">',
                            '<input type="checkbox" id="atomsphereRender" checked/>',
                            '<span>' + Resource.skyAtmosphereEffect + '</span>',
                        '</label>',
                        '<label class="third">',
                            '<input type="checkbox" id="fogEnabled" checked/>',
                            '<span>' + Resource.fogEffect + '</span>',
                        '</label>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<label class="third">',
                            '<input type="checkbox" id="depthAgainst" checked/>',
                            '<span>' + Resource.depthAgainst + '</span>',
                        '</label>',
                        '<label class="third" style="display:none;">',
                            '<input type="checkbox" id="icon" checked/>',
                            '<span>' + Resource.supermapLogo + '</span>',
                        '</label>',
                        /*'<label class="third" style="display:none;">',
                            '<input type="checkbox" id="hdr"/>',
                            '<span>' + Resource.hdr + '</span>',
                        '</label>',*/
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="function-module-sub-indent-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.brightness + '</label>',
                            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "brightness" class="input"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption"">' + Resource.contrast + '</label>',
                            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "contrast" class="input"/>',
                        '</div>',
                    '</div>',
                    '<div class="function-module-sub-indent-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.hue + '</label>',
                            '<input type="number" min="0" max="3" step="0.02" value="0.0" id= "hue" class="input"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.saturation + '</label>',
                            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "saturation" class="input"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.gamma + '</label>',
                            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "gamma" class="input"/>',
                        '</div>',
                    '</div>',
                '</div>',

                '<div>',
                    '<label class="function-module-sub-section-caption"> ' + Resource.queryCoordinates + '</label>',
                    '<div>',
                        '<div class="function-module-sub-indent-section">',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.Spacelongitude + ', ' + Resource.Spacelatitude + ', ' + Resource.Spacealtitude + '</label>',
                            '<input type="text" class="input disabled width-adjust" disabled id="scene-coordinate-search-result"/>',
                        '</div>',
                        '<div style="padding-top: 9px;overflow:auto;">',
                            '<button class="btn btn-info function-module-btn" id="query-coordinates-clear">' + Resource.clear + '</button>',
                            '<button class="btn btn-info function-module-btn" id="queryCoordinates">' + Resource.coordinates + '</button>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</section>',

        '<section id="scene-attribute-others-content">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.viewMode + '</label>',
                    '<select id="sceneMode" class="width-adjust">',
                        '<option value="3D">3D</option>',
                        '<option value="2D">2D</option>',
                        '<option value="columbusView">2.5D</option>',
                    '</select>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.multiViewport + '</label>',
                    '<select id="viewportType" class="width-adjust">',
                        '<option value="NONE" selected>' + Resource.onePort + '</option>',
                        '<option value="HORIZONTAL">' + Resource.horizontalSnap + '</option>',
                        '<option value="VERTICAL">' + Resource.verticalSnap + '</option>',
                        '<option value="TRIPLE">' + Resource.tripeSnap + '</option>',
                        '<option value="QUAD">' + Resource.quadSnap + '</option>',
                    '</select>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.sceneFlood +'</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">',
                            '<input type="checkbox" id="bloom"/>',
                            '<span>' + Resource.openSceneFlood + '</span>',
                        '</label>',
                    '</div>',
                    '<div style="overflow:auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.threshold + '</label>',
                            '<input type="number" id="threshold" class="input" min="0" max="1"  value="0.6" step="0.01">',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.bloomIntensity + '</label>',
                            '<input type="number" id="bloomIntensity" class="input" min="0" max="10"  value="2.0" step="0.5">',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.split + '</label>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">',
                            '<input type="checkbox" id="use-roller"/>',
                            '<span>' + Resource.useRoller + '</span>',
                        '</label>',
                    '</div>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">' +
                            '<input type="checkbox" id="imagery-roller"/>' +
                            '<span>' + Resource.imageryRoller + '</span>' +
                        '</label>',
                    '</div>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">',
                            '<input type="radio" name="roller-category" value="lr-roller" checked/>',
                            '<span>' + Resource.lrRoller + '</span>',
                        '</label>',
                        '<div id="lr-roller-mode" style="margin-left: 15px;">',
                            '<label class="function-module-sub-section-caption-indent">',
                                '<input type="radio" name="roller-mode" value="left-roller" checked/>',
                                '<span>' + Resource.leftRoller + '</span>',
                            '</label>',
                            '<label class="function-module-sub-section-caption-indent">',
                                '<input type="radio" name="roller-mode" value="right-roller"/>',
                                '<span>' + Resource.rightRoller + '</span>',
                            '</label>',
                        '</div>',
                    '</div>',
                    '<div>',
                        '<label class="function-module-sub-section-caption-indent">',
                            '<input type="radio" name="roller-category" value="tb-roller"/>',
                            '<span>' + Resource.tbRoller + '</span>',
                        '</label>',
                        '<div style="display:none;margin-left: 15px;" id="tb-roller-mode">',
                            '<label class="function-module-sub-section-caption-indent">',
                                '<input type="radio" name="roller-mode" value="top-roller"/>',
                                '<span>' + Resource.topRoller + '</span>',
                            '</label>',
                            '<label class="function-module-sub-section-caption-indent">',
                                '<input type="radio" name="roller-mode" value="bottom-roller"/>',
                                '<span>' + Resource.bottomRoller + '</span>',
                            '</label>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</section> ',

        '<section id="scene-attribute-camera-content">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.flyRoute + '</label>',
                    '<div>',
                        '<div class="function-module-sub-indent-section">',
                            '<input type="file" id="flyFile" class="input width-adjust" onchange="" accept=".fpf" style="border: none;"/>',
                        '</div>',
                        '<div class="function-module-sub-indent-section">',
                            '<button class="start" id="startFly" title=' + Resource.startFly + ' style="background-color: transparent;border:none;"></button>',
                            '<button class="pause" id="pauseFly" title=' + Resource.pauseFly + ' style="background-color: transparent;border:none;"></button>',
                            '<button class="stop"  id="stopFly"  title=' + Resource.stopFly + ' style="background-color: transparent;border:none;"></button>',
                        '</div>',
                        '<label class="function-module-sub-section-caption-indent">' + Resource.stopChoose + '</label>',
                        '<select id="stopList" class="input width-adjust">',
                        '</select>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.observe + '</label>',
                    '<div style="display: flex;">',
                        '<label class="param-item-first-level">',
                            '<input type="checkbox" id="stopFlyCircle">',
                            '<span>'+Resource.pauseFly+'</span>',
                        '</label>',
                        '<label class="param-item-first-level">',
                            '<input type="checkbox" id="circulation" checked>',
                            '<span>' + Resource.rotateCirculation + '</span>',
                        '</label>',
                        '<button id="spin" class="btn btn-info" style="margin: 0 0 0 1rem;">' + Resource.rotatePoint + '</button>',
                        '<button id="cancel-spin" class="btn btn-info" style="margin: 0 0 0 1rem;">' + Resource.cancelRotatePoint + '</button>',
                    '</div>',
                '</div>',

                '<div>',
                    '<label class="function-module-sub-section-caption">' + Resource.underground + '</label>',
                    '<div>',
                    '<label class="function-module-sub-section-caption-indent">',
                        '<input type="checkbox" id="underground"/>',
                        '<span>' + Resource.openUnderground + '</span>',
                    '</label>',
                    '<div id="camera-minimum-zoom-distance-wrapper" style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.cameraMinimumZoomDistance + '</label>',
                            '<input type="number" class="input" id="camera-minimum-zoom-distance" value="-1000"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.SurfaceTransparency + '</label>',
                            '<input type="number" class="input" id="groundAlpha" min="0" max="1.0" step="0.01" value="1.0">',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</section>',

        '<section id="scene-attribute-light-content">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.symbolicLibrary + '</label>',
                    '<div class="mark-list" id="light-source-list">',
                        '<div id="point-light" class="mark-list-item light-source-font-normal light-source-font-selected">',
                            '<a class="iconfont icon-point-light-source"></a>',
                            '<label>' + Resource.pointLight + '</label>',
                        '</div>',
                        '<div id="spot-light" class="mark-list-item light-source-font-normal">',
                            '<a class="iconfont icon-spot-light-source"></a>',
                            '<label>' + Resource.spotLight + '</label>',
                        '</div>',
                        '<div id="directional-light" class="mark-list-item light-source-font-normal">',
                            '<a class="iconfont icon-directional-light-source"></a>',
                            '<label>' + Resource.directionalLight + '</label>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="point-light-params">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.lightSourceColor + '</label>',
                            '<input class="colorPicker" id="point-light-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.cutoffDistance + '</label>',
                            '<input type="number" class="input" id="point-light-cutoff-distance" value="100" min="1" step="1" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.decay + '</label>',
                            '<input type="number" class="input" id="point-light-decay" value="5" max="30" min="0" step="1"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.intensity + '</label>',
                            '<input type="number" class="input" id="point-light-intensity" value="5" min="1" max="100" step="1"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="spot-light-params" style="display: none;">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.lightSourceColor + '</label>',
                            '<input class="colorPicker" id="spot-light-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.cutoffDistance + '</label>',
                            '<input type="number" class="input" id="spot-light-cutoff-distance" value="300" min="1" step="1" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.decay + '</label>',
                            '<input type="number" class="input" id="spot-light-decay" value="3" min="0" max="50" step="1"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.intensity + '</label>',
                            '<input type="number" class="input" id="spot-light-intensity" value="3" min="0" step="1" max="30"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.spotLightAngle + '</label>',
                            '<input type="number" class="input" id="spot-light-angle" value="30" min="1" max="180" step="1"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="directional-light-params" style="display: none;">',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.lightSourceColor + '</label>',
                            '<input class="colorPicker" id="directional-light-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.intensity + '</label>',
                            '<input type="number" class="input" id="directional-light-intensity" value="3" min="0" step="1" max="30" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<p style="margin-bottom: 0;">' + Resource.obliqueLightWarning + '</p>',
            '</div>',
            '<div id="light-param-btns" class="light-param-btns">',
                '<button type="button" id="clear-light-source" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
                '<button type="button" id="add-light-source" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.Add + '</button>',
            '</div>',
        '</section>',

        /*/!* 关于 *!/
        '<div class="tabs-content-item">',
            '<label class="label-block text-center" style="font-size: 20px">SuperMap iEarth</label>',
            '<label class="label-block text-center" style="font-size: 16px">' + Resource.Version + ' ： 1.1</label>',
            '<label class="label-block">' + Resource.newContent + '</label>',
            '<textarea id="scenePortalDescription" style="width:220px;height:160px;resize: none;margin-left: 15px;background:transparent">' + Resource.WhatsNew + '</textarea>',
        '</div>',*/

        '</div>',
        '</div>',
    ].join('');
    var sceneAttribute = Container.extend({
            tagName: 'div',
            id: 'sceneAttribute',
            events: {
                'click #closeScene': 'onCloseSceneClk',
                'change input[type=file]': 'onInputChange',
                'click #queryCoordinates': 'onQueryCoordinatesClk',
                'click #query-coordinates-clear': 'onQueryCoordinatesClearClk',
                'click #startFly': 'onStartFlyClk',
                'click #pauseFly': 'onPauseFlyClk',
                'click #stopFly': 'onStopFlyClk',
                'click #spin': 'onSpinClk',
                'click #cancel-spin': 'onCancelSpinClk',
                'click #clear-light-source': 'clearLightSource'
            },
            template: _.template(htmlStr),
            initialize: function (options) {
                viewer = options.sceneModel.viewer;
                scene = viewer.scene;
                isPCBroswer = options.isPCBroswer;
                me = this;
                viewer.scene.bloomEffect.show = false;
                var layers = scene.layers.layerQueue;
                handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                camera = scene.camera;
                camera.flyCircleLoop = true;
                this.render();

                let windowWidth = $('body').width(); // 窗口宽度
                let windowHeight = $('body').height(); // 窗口高度
                rollerShutterConfig = { // 卷帘配置参数，以对象方式实现地址传递
                    splitDirection: Cesium.SplitDirection.NONE,
                    verticalSplitPosition: windowWidth / 2,
                    horizontalSplitPosition: windowHeight / 2,
                    latestSplitDirection: Cesium.SplitDirection.LEFT // 用于在禁用卷帘后恢复之前的卷帘方向
                };

                this.on('componentAdded', function (parent) {
                    var icon = true;
                    $(document).ready(function () {
                        var widget = $('#sceneForm');
                        var tabs = widget.find('.tabs-menu-item > a'); // 左侧的导航菜单
                        var tabsContent = widget.find('.tabs-content-placeholder > .tabs-content-item'); // 右侧的各个属性模块
                        tabs.on('click', function (e) {
                            e.preventDefault();
                            var index = $(this).data('index');
                            tabs.removeClass('tab-active');
                            tabsContent.removeClass('tabs-content-active');
                            $(this).addClass('tab-active');
                            tabsContent.eq(index).addClass('tabs-content-active');
                        });
                    });
                    $('#sceneForm').myDrag({
                        parent: 'body',
                        randomPosition: false,
                        direction: 'all',
                        handler: false,
                        dragStart: function (x, y) {
                        },
                        dragEnd: function (x, y) {
                        },
                        dragMove: function (x, y) {
                        }
                    });
                    var imageryLayers = viewer.imageryLayers;
                    $("#atomsphereRender").click(function (evt) {
                        scene.skyAtmosphere.show = !scene.skyAtmosphere.show;
                    });
                    $("#lightRender").click(function (evt) {
                        scene.globe.enableLighting = !scene.globe.enableLighting;
                    });
                    $("#shadows").click(function (evt) {
                        if ($(this).prop('checked')) {
                            for (var layer of layers) {
                                layer.shadowType = 2;
                                layer.refresh(); // 加这句是因为 不刷新阴影不会立即显示  属于底层问题，待修改
                            }
                            if ($("#shadowType") && ($("#shadowType").val() === 'noShadow')) {
                                $("#shadowType").val('allShadow');
                            }
                        } else {
                            for (var layer of layers) {
                                layer.shadowType = 0;
                            }
                            if ($("#shadowType") && ($("#shadowType").val() !== 'noShadow')) {
                                $("#shadowType").val('noShadow');
                            }
                        }
                    });
                    $("#fogEnabled").click(function (evt) {
                        scene.fog.enabled = !scene.fog.enabled;
                    });
                    $("#depthAgainst").click(function (evt) {
                        scene.globe.depthTestAgainstTerrain = !scene.globe.depthTestAgainstTerrain;
                    });
                    /*$("#hdr").on('input propertychange', function() {
                       scene.hdrEnabled = $(this).prop('checked');
                    });*/
                    $("#earth").click(function (evt) {
                        scene.globe.show = !scene.globe.show;
                    });
                    $("#timeline").click(function () {
                        var timeline = viewer.timeline.container.style.visibility;
                        if (timeline == "visible") {
                            viewer.timeline.container.style.visibility = 'hidden';
                        }
                        else {
                            viewer.timeline.container.style.visibility = 'visible';
                        }
                    });
                    $("#icon").click(function (evt) {
                        if (icon) {
                            $(".cesium-viewer-bottom").hide();
                            icon = false;
                        }
                        else if (!icon) {
                            $(".cesium-viewer-bottom").show();
                            icon = true;
                        }
                    });
                    $("#bloom").on('input propertychange', function (evt) {
                        var isOpenBloom = $(this).prop('checked');
                        viewer.scene.bloomEffect.show = isOpenBloom;
                        viewer.scene.hdrEnabled = isOpenBloom;
                        viewer.scene.toneMappingEnabled = isOpenBloom;
                        viewer.scene.bloomEffect.threshold = Number($("#threshold").val());
                        viewer.scene.bloomEffect.bloomIntensity = Number($("#bloomIntensity").val());
                    });
                    $("#threshold").on("input change", function () {
                        viewer.scene.bloomEffect.threshold = Number(this.value);
                    });
                    $("#bloomIntensity").on("input change", function () {
                        viewer.scene.bloomEffect.bloomIntensity = this.value;
                    });
                    $("#underground").on("input propertychange", function (evt) {
                        var isEnableUnderground = $(this).prop("checked");
                        viewer.scene.undergroundMode = isEnableUnderground;
                        if (isEnableUnderground) {
                            viewer.scene.screenSpaceCameraController.minimumZoomDistance = Number($("#camera-minimum-zoom-distance").val());
                        } else {
                            viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;
                        }
                    });
                    $('#groundAlpha').bind('input propertychange', function () {
                        viewer.scene.globe.globeAlpha = parseFloat(this.value);
                    });
                    $("#camera-minimum-zoom-distance").on("input propertychange", function () {
                        viewer.scene.screenSpaceCameraController.minimumZoomDistance = Number($("#camera-minimum-zoom-distance").val());
                    });
                    $('#circulation').on("input propertychange", function () {
                        camera.flyCircleLoop = this.checked;
                    });
                    $('#stopFlyCircle').on("input propertychange", function () {
                        if (this.checked) {
                            camera.stopFlyCircle();
                        } else {
                            if (flyCirclePoint) {
                                camera.flyCircle(flyCirclePoint);
                            }
                        }
                    });
                    $('#sceneMode').change(function () {
                        var value = $(this).val();
                        if (value === "2D") {
                            viewer.scene.mode = Cesium.SceneMode.SCENE2D;
                        }
                        else if (value === "3D") {
                            viewer.scene.mode = Cesium.SceneMode.SCENE3D;
                        }
                        else if (value === "columbusView") {
                            viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                        }
                    });
                    $('#viewportType').change(function () {
                        var value = $(this).val();
                        scene.multiViewportMode = Cesium.MultiViewportMode[value];
                    });

                    var brightness = document.getElementById('brightness');
                    brightness.oninput = function () {
                        if (imageryLayers.length > 0) {
                            var layer = imageryLayers.get(0);
                            layer['brightness'] = brightness.value;
                        }
                    };
                    var saturation = document.getElementById('saturation');
                    saturation.oninput = function () {
                        if (imageryLayers.length > 0) {
                            var layer = imageryLayers.get(0);
                            layer['saturation'] = saturation.value;
                        }
                    };
                    var contrast = document.getElementById('contrast');
                    contrast.oninput = function () {
                        if (imageryLayers.length > 0) {
                            var layer = imageryLayers.get(0);
                            layer['contrast'] = contrast.value;
                        }
                    };
                    var hue = document.getElementById('hue');
                    hue.oninput = function () {
                        if (imageryLayers.length > 0) {
                            var layer = imageryLayers.get(0);
                            layer['hue'] = hue.value;
                        }
                    };
                    var gamma = document.getElementById('gamma');
                    gamma.oninput = function () {
                        if (imageryLayers.length > 0) {
                            var layer = imageryLayers.get(0);
                            layer['gamma'] = gamma.value;
                        }
                    };
                    this.initRollerShutter(); // 初始化卷帘

                    $('#point-light').click(function() {
                        $('#light-source-list > .mark-list-item').removeClass('light-source-font-selected');
                        $(this).addClass('light-source-font-selected');

                        $('#point-light-params').css('display', 'block');
                        $('#spot-light-params').css('display', 'none');
                        $('#directional-light-params').css('display', 'none');

                        lightSourceType = 0;
                    });

                    $('#spot-light').click(function() {
                        $('#light-source-list > .mark-list-item').removeClass('light-source-font-selected');
                        $(this).addClass('light-source-font-selected');

                        $('#point-light-params').css('display', 'none');
                        $('#spot-light-params').css('display', 'block');
                        $('#directional-light-params').css('display', 'none');

                        lightSourceType = 1;
                    });

                    $('#directional-light').click(function() {
                        $('#light-source-list > .mark-list-item').removeClass('light-source-font-selected');
                        $(this).addClass('light-source-font-selected');

                        $('#point-light-params').css('display', 'none');
                        $('#spot-light-params').css('display', 'none');
                        $('#directional-light-params').css('display', 'block');

                        lightSourceType = 2;
                    });

                    $('#point-light-color').spectrum({
                        color: "cf9932",
                        showPalette: true,
                        showAlpha: true,
                        localStorageKey: "spectrum.demo",
                        palette: palette,
                        cancelText: Resource.cancel,
                        chooseText: Resource.confirm,
                        change: function(clr) {
                            var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                            if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                                entityPointLightPairs.get(viewer.selectedEntity).color = color;
                            }
                        }
                    });
                    $('#point-light-cutoff-distance').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                            entityPointLightPairs.get(viewer.selectedEntity).cutoffDistance = Number($(this).val());
                        }
                    });
                    $('#point-light-decay').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                            entityPointLightPairs.get(viewer.selectedEntity).decay = Number($(this).val());
                        }
                    });
                    $('#point-light-intensity').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                            entityPointLightPairs.get(viewer.selectedEntity).intensity = Number($(this).val());
                        }
                    });

                    $('#spot-light-color').spectrum({
                        color: "cf9932",
                        showPalette: true,
                        showAlpha: true,
                        localStorageKey: "spectrum.demo",
                        palette: palette,
                        cancelText: Resource.cancel,
                        chooseText: Resource.confirm,
                        change: function(clr) {
                            var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                            if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                                entitySpotLightPairs.get(viewer.selectedEntity).color = color;
                            }
                        }
                    });

                    $('#spot-light-cutoff-distance').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                            entitySpotLightPairs.get(viewer.selectedEntity).distance = Number($(this).val());
                        }
                    });

                    $('#spot-light-decay').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                            entitySpotLightPairs.get(viewer.selectedEntity).decay = Number($(this).val());
                        }
                    });

                    $('#spot-light-intensity').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                            entitySpotLightPairs.get(viewer.selectedEntity).intensity = Number($(this).val());
                        }
                    });

                    $('#spot-light-angle').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                            entitySpotLightPairs.get(viewer.selectedEntity).angle = Cesium.Math.toRadians(Number($(this).val()));
                        }
                    });

                    $('#directional-light-color').spectrum({
                        color: "cf9932",
                        showPalette: true,
                        showAlpha: true,
                        localStorageKey: "spectrum.demo",
                        palette: palette,
                        cancelText: Resource.cancel,
                        chooseText: Resource.confirm,
                        change: function(clr) {
                            var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                            if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('directional-light') === 0) {
                                entityDirectionalLightPairs.get(viewer.selectedEntity).color = color;
                            }
                        }
                    });

                    $('#directional-light-intensity').on('input propertychange', function() {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('directional-light') === 0) {
                            entityDirectionalLightPairs.get(viewer.selectedEntity).intensity = Number($(this).val());
                        }
                    });

                    $('#add-light-source').click(function() {
                        if (!isPCBroswer) {
                            me.$el.hide();
                        }
                        switch (lightSourceType) {
                            case 0:
                                if (!pointLightSourceDrawHandler) {
                                    initPointLightSourceDrawHandler();
                                }
                                pointLightSourceDrawHandler.activate();
                                break;
                            case 1:
                            case 2:
                                if (!spotOrDirectionalLightSourceDrawHandler) {
                                    initSpotOrDirectionalLightSourceDrawHandler();
                                }
                                spotOrDirectionalLightSourceAdding = true;
                                spotOrDirectionalLightSourceDrawHandler.activate();
                                break;
                            default:
                                break;
                        }
                    });
                });
            },
            render: function () {
                this.$el.html(this.template());
                return this;
            },
            onCloseSceneClk: function (evt) {
                if (evt && evt.preventDefault) {
                    evt.preventDefault();
                }
                else {
                    window.event.returnValue = false;
                }
                viewer.entities.removeAll();
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                this.$el.hide();
                return false;
            },
            onQueryCoordinatesClk: function (evt) {
                var tooltip = createTooltip(document.body);
                handler.setInputAction(function (movement) {
                    tooltip.showAt(movement.endPosition, Resource.clickToSearchCoordination);
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                handler.setInputAction(function (e) {
                    var position = scene.pickPosition(e.position);
                    var cartographic = Cesium.Cartographic.fromCartesian(position);
                    var searchLongitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
                    var searchLatitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
                    var searchHeight = cartographic.height.toFixed(2);
                    $("#scene-coordinate-search-result").val(searchLongitude + ", " + searchLatitude + ', ' + searchHeight);
                    tooltip.setVisible(false);
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            onQueryCoordinatesClearClk: function() {
                $("#scene-coordinate-search-result").val('');
            },
            onStartFlyClk: function (evt) {
                flyRoute.initializing(viewer);
            },
            onPauseFlyClk: function (evt) {
                flyRoute.pause(viewer);
            },
            onStopFlyClk: function (evt) {
                flyRoute.stop(viewer);
            },
            onSpinClk: function (evt) {
                if (!flyCircleDrawHandler) {
                    flyCircleDrawHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
                    flyCircleDrawHandler.activeEvt.addEventListener(function (isActive) {
                        if (isActive == true) {
                            viewer.enableCursorStyle = false;
                            viewer._element.style.cursor = '';
                            $('body').removeClass('drawCur').addClass('drawCur');
                        } else {
                            viewer.enableCursorStyle = true;
                            $('body').removeClass('drawCur');
                        }
                    });
                    flyCircleDrawHandler.drawEvt.addEventListener(function (result) {
                        flyCirclePoint = result.object.position;
                        viewer.entities.removeById('fly-circle-point');
                        viewer.entities.add({
                            id: 'fly-circle-point',
                            position: flyCirclePoint,
                            billboard: {
                                image: 'images/flyCircle.png',
                                scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
                                disableDepthTestDistance : Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
                            }
                        });
                        camera.stopFlyCircle(); // 先停止之前的旋转，再开始新的旋转
                        camera.flyCircle(flyCirclePoint);
                        flyCircleDrawHandler.clear();
                    });
                }
                flyCircleDrawHandler.activate();
            },
            onCancelSpinClk: function() {
                camera.stopFlyCircle();
                viewer.entities.removeById('fly-circle-point');
                flyCirclePoint = null;
            },
            /**
             * 初始化卷帘。设置分割条初始位置及绑定相关事件。
             *
             */
            initRollerShutter: function () {
                if (!document.getElementById("verticalSlider")) {
                    $("#cesiumContainer").append("<div id='verticalSlider' style='display: none;'></div>");
                    $("#cesiumContainer").append("<div id='horizontalSlider' style='display: none;'></div>");
                }
                this.setRollerShutterSplit();
                this.bindSliderEvt();
                var me = this;
                $('input[type=radio][name="roller-mode"]').on('input propertychange', function () {
                    let splitDirectionCustomStr = $('input[type=radio][name="roller-mode"]:checked').val();
                    if ($("#use-roller").prop("checked")) {
                        switch (splitDirectionCustomStr) {
                            case 'left-roller':
                                rollerShutterConfig.splitDirection = Cesium.SplitDirection.LEFT;
                                break;
                            case 'right-roller':
                                rollerShutterConfig.splitDirection = Cesium.SplitDirection.RIGHT;
                                break;
                            case 'top-roller':
                                rollerShutterConfig.splitDirection = Cesium.SplitDirection.TOP;
                                break;
                            case 'bottom-roller':
                                rollerShutterConfig.splitDirection = Cesium.SplitDirection.BOTTOM;
                                break;
                            default:
                                break;
                        }
                        me.setImageryRollerMode();
                        me.setRollerShutterSplit();
                    } else {
                        switch (splitDirectionCustomStr) {
                            case 'left-roller':
                                rollerShutterConfig.latestSplitDirection = Cesium.SplitDirection.LEFT;
                                break;
                            case 'right-roller':
                                rollerShutterConfig.latestSplitDirection = Cesium.SplitDirection.RIGHT;
                                break;
                            case 'top-roller':
                                rollerShutterConfig.latestSplitDirection = Cesium.SplitDirection.TOP;
                                break;
                            case 'bottom-roller':
                                rollerShutterConfig.latestSplitDirection = Cesium.SplitDirection.BOTTOM;
                                break;
                            default:
                                break;
                        }
                    }
                });

                // 在 “左右模式” 和 “上下模式” 之间切换
                $('input[type=radio][name="roller-category"]').on("input propertychange", function () {
                    let splitDirectionCategory = $('input[type=radio][name="roller-category"]:checked').val();
                    var verticalSlider = document.getElementById('verticalSlider');
                    var horizontalSlider = document.getElementById('horizontalSlider');
                    if ($("#use-roller").prop("checked")) {
                        switch (splitDirectionCategory) {
                            case 'lr-roller':
                                verticalSlider.style.display = 'block';
                                horizontalSlider.style.display = 'none';
                                $("#lr-roller-mode").css("display", "block");
                                $("#tb-roller-mode").css("display", "none");
                                rollerShutterConfig.splitDirection = Cesium.SplitDirection.LEFT;
                                $("input[type=radio][value='left-roller']").prop("checked", "checked");
                                break;
                            case 'tb-roller':
                                verticalSlider.style.display = 'none';
                                horizontalSlider.style.display = 'block';
                                $("#lr-roller-mode").css("display", "none");
                                $("#tb-roller-mode").css("display", "block");
                                rollerShutterConfig.splitDirection = Cesium.SplitDirection.TOP;
                                $("input[type=radio][value='top-roller']").prop("checked", "checked");
                                break;
                            default:
                                break;
                        }
                        me.setImageryRollerMode();
                        me.setRollerShutterSplit();
                    } else {
                        switch (splitDirectionCategory) {
                            case 'lr-roller':
                                $("#lr-roller-mode").css("display", "block");
                                $("#tb-roller-mode").css("display", "none");
                                rollerShutterConfig.latestSplitDirection = Cesium.SplitDirection.LEFT;
                                $("input[type=radio][value='left-roller']").prop("checked", "checked");
                                break;
                            case 'tb-roller':
                                $("#lr-roller-mode").css("display", "none");
                                $("#tb-roller-mode").css("display", "block");
                                rollerShutterConfig.latestSplitDirection = Cesium.SplitDirection.TOP;
                                $("input[type=radio][value='top-roller']").prop("checked", "checked");
                                break;
                            default:
                                break;
                        }
                    }
                });
                // 是否使用卷帘
                $("#use-roller").on("input propertychange", function () {
                    var verticalSlider = document.getElementById('verticalSlider');
                    var horizontalSlider = document.getElementById('horizontalSlider');
                    if ($(this).prop("checked")) {
                        if (rollerShutterConfig.latestSplitDirection === Cesium.SplitDirection.LEFT ||
                            rollerShutterConfig.latestSplitDirection === Cesium.SplitDirection.RIGHT) {
                            verticalSlider.style.display = 'block';
                            horizontalSlider.style.display = 'none';
                        } else {
                            verticalSlider.style.display = 'none';
                            horizontalSlider.style.display = 'block';
                        }
                        rollerShutterConfig.splitDirection = rollerShutterConfig.latestSplitDirection;
                    } else {
                        rollerShutterConfig.latestSplitDirection = rollerShutterConfig.splitDirection;
                        rollerShutterConfig.splitDirection = Cesium.SplitDirection.NONE;
                        verticalSlider.style.display = 'none';
                        horizontalSlider.style.display = 'none';
                    }
                    me.setImageryRollerMode();
                    me.setRollerShutterSplit();
                });
                // 控制影像卷帘显隐
                $("#imagery-roller").on("input propertychange", function () {
                    me.setImageryRollerMode();
                    me.setRollerShutterSplit();
                });
            },
            /**
             * 注册卷帘分割条的拖拽事件。
             *
             */
            bindSliderEvt: function () {
                var verticalSlider = document.getElementById('verticalSlider');
                var horizontalSlider = document.getElementById('horizontalSlider');
                verticalSlider.addEventListener('mousedown', mouseDown, false);
                horizontalSlider.addEventListener('mousedown', mouseDown, false);
                let windowHeight = $('body').height();
                var me = this;
                document.addEventListener('mouseup', mouseUp, false);
                function mouseUp(e) {
                    document.removeEventListener('mousemove', sliderMove, false);
                }

                function mouseDown(e) {
                    document.addEventListener('mousemove', sliderMove, false);
                }

                function sliderMove(e) { // 鼠标拖拽时执行
                    // 解决拖拽鼠标粘滞的问题
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                    if (rollerShutterConfig.splitDirection === Cesium.SplitDirection.LEFT || rollerShutterConfig.splitDirection === Cesium.SplitDirection.RIGHT) {
                        verticalSlider.style.left = e.clientX + 'px';
                        rollerShutterConfig.verticalSplitPosition = e.clientX;
                    } else if (rollerShutterConfig.splitDirection === Cesium.SplitDirection.TOP || rollerShutterConfig.splitDirection === Cesium.SplitDirection.BOTTOM) {
                        let clientY = e.clientY;
                        if (clientY < 0) {
                            clientY = 0;
                        } else if (clientY > windowHeight) {
                            clientY = windowHeight - $('#horizontal-slider').height();
                        }
                        horizontalSlider.style.top = clientY + 'px';
                        rollerShutterConfig.horizontalSplitPosition = windowHeight - clientY;
                    }
                    me.setRollerShutterSplit();
                }
            },
            /**
             * 设置卷帘的分割方向及分割条的位置。
             *
             */
            setRollerShutterSplit: function () {
                let splitPosition = null;
                if (rollerShutterConfig.splitDirection === Cesium.SplitDirection.LEFT || rollerShutterConfig.splitDirection === Cesium.SplitDirection.RIGHT) {
                    splitPosition = rollerShutterConfig.verticalSplitPosition;
                    viewer.scene.imagerySplitPosition.x = rollerShutterConfig.verticalSplitPosition / $("body").width();
                } else if (rollerShutterConfig.splitDirection === Cesium.SplitDirection.TOP || rollerShutterConfig.splitDirection === Cesium.SplitDirection.BOTTOM) {
                    splitPosition = rollerShutterConfig.horizontalSplitPosition;
                    viewer.scene.imagerySplitPosition.y = rollerShutterConfig.horizontalSplitPosition / $("body").height();
                }
                for (let layer of scene.layers.layerQueue) {
                    layer.splitDirection = rollerShutterConfig.splitDirection;
                    if (splitPosition) { // 如果禁用卷帘就没有必要设置分割位置
                        layer.splitPosition = splitPosition;
                    }
                }
            },
            setImageryRollerMode: function () {
                let imageryLayers = viewer.imageryLayers;
                if (($("#imagery-roller").prop("checked"))) {
                    for (let i = 0; i < imageryLayers.length; i++) {
                        let imageryLayer = imageryLayers.get(i);
                        switch (rollerShutterConfig.splitDirection) {
                            case Cesium.SplitDirection.LEFT:
                                imageryLayer.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.RIGHT, Cesium.ImagerySplitDirection.NONE);
                                break;
                            case Cesium.SplitDirection.RIGHT:
                                imageryLayer.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.LEFT, Cesium.ImagerySplitDirection.NONE);
                                break;
                            case Cesium.SplitDirection.TOP:
                                imageryLayer.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.BOTTOM);
                                break;
                            case Cesium.SplitDirection.BOTTOM:
                                imageryLayer.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.TOP);
                                break;
                            default:
                                imageryLayer.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.NONE);
                                break;
                        }
                    }
                } else {
                    for (let i = 0; i < imageryLayers.length; i++) {
                        let imageryLayer = imageryLayers.get(i);
                        imageryLayer.splitDirection = new Cesium.Cartesian2(Cesium.ImagerySplitDirection.NONE, Cesium.ImagerySplitDirection.NONE);
                    }
                }
            },
            clearLightSource: function() {
                while(scene.lightSource.pointLight.values.length > 0) {
                    scene.removeLightSource(scene.lightSource.pointLight.values[0]);
                }
                while(scene.lightSource.spotLight.values.length > 0) {
                    scene.removeLightSource(scene.lightSource.spotLight.values[0]);
                }
                while(scene.lightSource.directionalLight.values.length > 0) {
                    scene.removeLightSource(scene.lightSource.directionalLight.values[0]);
                }
                for(let key of entityPointLightPairs.keys()) {
                    viewer.entities.remove(key);
                }
                entityPointLightPairs.clear();
                for(let key of entitySpotLightPairs.keys()) {
                    viewer.entities.remove(key);
                }
                entitySpotLightPairs.clear();
                for(let key of entityDirectionalLightPairs.keys()) {
                    viewer.entities.remove(key);
                }
                entityDirectionalLightPairs.clear();
            }
        });
        function initPointLightSourceDrawHandler() {
            pointLightSourceDrawHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
            pointLightSourceDrawHandler.activeEvt.addEventListener(function (isActive) {
                if (isActive == true) {
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                } else {
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            pointLightSourceDrawHandler.drawEvt.addEventListener(function (result) {
                var cartesian = result.object.position;
                var option = {
                    color: Cesium.Color.fromCssColorString($("#point-light-color").spectrum('get').toRgbString()),
                    cutoffDistance: Number($('#point-light-cutoff-distance').val()),
                    decay: Number($('#point-light-decay').val()),
                    intensity: Number($('#point-light-intensity').val())
                };
                var pointLight = new Cesium.PointLight(cartesian, option);
                scene.addLightSource(pointLight);
                var entityAsKey = viewer.entities.add({
                    id: 'point-light-' + (new Date()).getTime(),
                    position: cartesian,
                    billboard: {
                        image: 'images/lightSource/pointLight.png',
                        scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
                        disableDepthTestDistance : Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
                    }
                });
                entityPointLightPairs.set(entityAsKey, pointLight);
                pointLightSourceDrawHandler.clear();
            });
        }
        function initSpotOrDirectionalLightSourceDrawHandler() {
            spotOrDirectionalLightSourceDrawHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
            spotOrDirectionalLightSourceCountHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            spotOrDirectionalLightSourceDrawHandler.activeEvt.addEventListener(function (isActive) {
                if (isActive == true) {
                    viewer.enableCursorStyle = false;
                    viewer._element.style.cursor = '';
                    $('body').removeClass('drawCur').addClass('drawCur');
                } else {
                    viewer.enableCursorStyle = true;
                    $('body').removeClass('drawCur');
                }
            });
            spotOrDirectionalLightSourceDrawHandler.drawEvt.addEventListener(function (result) {
                var positions = (result.object && result.object.positions) || result;
                if (positions.length !== 2) {
                    return;
                }
                if (lightSourceType === 1){
                    var spotLightOptions = {
                        color: Cesium.Color.fromCssColorString($("#spot-light-color").spectrum('get').toRgbString()),
                        distance: Number($('#spot-light-cutoff-distance').val()),
                        decay: Number($('#spot-light-decay').val()),
                        intensity: Number($('#spot-light-intensity').val()),
                        angle: Cesium.Math.toRadians(Number($('#spot-light-angle').val()))
                    };
                    var spotLight = new Cesium.SpotLight(positions[0], positions[1], spotLightOptions);
                    scene.addLightSource(spotLight);
                    var entityAsKey = viewer.entities.add({
                        id: 'spot-light-' + (new Date()).getTime(),
                        position: positions[0],
                        billboard: {
                            image: 'images/lightSource/spotLight.png',
                            scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1), // 按照距离调整图片的大小
                            disableDepthTestDistance : Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
                        }
                    });
                    entitySpotLightPairs.set(entityAsKey, spotLight);
                } else if (lightSourceType === 2) {
                    var directionalLightOptions = {
                        targetPosition: positions[1],
                        color: Cesium.Color.fromCssColorString($("#directional-light-color").spectrum('get').toRgbString()),
                        intensity: Number($('#directional-light-intensity').val())
                    };
                    var directionalLight = new Cesium.DirectionalLight(positions[0], directionalLightOptions);
                    scene.addLightSource(directionalLight);
                    var entityAsKey = viewer.entities.add({
                        id: 'directional-light-' + (new Date()).getTime(),
                        position: positions[0],
                        billboard: {
                            image: 'images/lightSource/directionalLight.png',
                            scaleByDistance: new Cesium.NearFarScalar(10, 1.0, 1000, 0.1),
                            disableDepthTestDistance : Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
                        }
                    });
                    entityDirectionalLightPairs.set(entityAsKey, directionalLight);
                }
                spotOrDirectionalLightPositions = [];
                spotOrDirectionalLightSourceDrawHandler.clear();
            });

            spotOrDirectionalLightSourceCountHandler.setInputAction(function(e) {
                if (spotOrDirectionalLightSourceAdding){
                    spotOrDirectionalLightPositions.push(scene.pickPosition(e.position));
                    if (spotOrDirectionalLightPositions.length === 2) {
                        spotOrDirectionalLightSourceDrawHandler.deactivate();
                        spotOrDirectionalLightSourceAdding = false;
                        spotOrDirectionalLightSourceDrawHandler.drawEvt.raiseEvent(spotOrDirectionalLightPositions);
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
        return sceneAttribute;
});
