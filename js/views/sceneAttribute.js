define(['./Container', 'Cesium', '../3DGIS/flyRoute', 'drag', 'slider', '../lib/tooltip', '../Util'], function (Container, Cesium, flyRoute, drag, slider, tooltip, Utils) {
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var scene;
    var viewer;
    var camera;
    var handler;
    var flyCirclePoint;
    var rollerShutterConfig = null;

    var htmlStr = [
        '<main class="mainView" id="sceneForm">',
        '<button aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">&times</span></button>',

        '<input id="scene-attribute-basic" name="scene-attribute" type="radio" checked/>',
        '<label for="scene-attribute-basic" class="function-module-caption">' + Resource.basicOptions + '</label>',
        '<input id="scene-attribute-others" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-others" class="function-module-caption">' + Resource.otherOptions + '</label>',
        '<input id="scene-attribute-camera" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-camera" class="function-module-caption">' + Resource.camera + '</label>',

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
                        '<label class="third">',
                            '<input type="checkbox" id="icon" checked/>',
                            '<span>' + Resource.supermapLogo + '</span>',
                        '</label>',
                        '<label class="third">',
                            '<input type="checkbox" id="full-screen"/>',
                            '<span>' + Resource.fullScreen + '</span>',
                        '</label>',
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
            },
            template: _.template(htmlStr),
            initialize: function (options) {
                viewer = options.sceneModel.viewer;
                scene = viewer.scene;
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
                    /* 全屏相关 start */
                    $("#full-screen").on("input propertychange", function() {
                        if ($(this).prop("checked")) { // 全屏
                            Utils.launchFullscreen(document.documentElement);
                        } else { // 退出全屏
                            Utils.exitFullscreen();
                        }
                    });
                    document.addEventListener("fullscreenchange", function( event ) {
                        if (!document.fullscreenElement) { // fullscreenElement属性返回正处于全屏状态的Element节点，没有节点处于全屏状态返回null
                            $("#full-screen").prop("checked", false);
                        } else {
                            $("#full-screen").prop("checked", true);
                        }
                    });
                    /*document.addEventListener("keydown", function(e) {
                        console.log(e.keyCode);
                        f(e && e.keyCode == 122){ // 按 F11
                            console.log(document.fullscreenElement);
                        }
                    });*/
                    /*document.addEventListener("resize", function() {
                       console.log("尺寸变化");
                    });*/
                    /* 全屏相关 end */
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
                    $("#bloom").click(function (evt) {
                        viewer.scene.bloomEffect.show = !viewer.scene.bloomEffect.show;
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
                    $('#circulation').on("input change", function () {
                        camera.flyCircleLoop = this.checked;
                    });
                    $('#stopFlyCircle').on("input change", function () {
                        if (this.checked) {
                            camera.stopFlyCircle();
                        } else {
                            camera.flyCircle(flyCirclePoint);
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
                var center = new Cesium.Cartesian3(0, 0, 0);
                var flyCircle = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
                flyCircle.drawEvt.addEventListener(function (result) {
                    center = result.object.position;
                    flyCirclePoint = center;
                    camera.flyCircle(center);
                });
                flyCircle.activate();
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
            }
        })
    ;
    return sceneAttribute;
});
