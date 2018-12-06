define(['./Container', 'Cesium', '../3DGIS/flyRoute', '../3DGIS/dynamicScene', 'drag', 'slider', '../lib/tooltip', '../lib/HeadControls', '../lib/jeelizFaceFilter'], function (Container, Cesium, flyRoute, dynamicScene, drag, slider, tooltip, HeadControls, jeelizFaceFilter) {
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
        '<div class="tabs-vertical mainView" id="sceneForm" style="position: absolute;width:350px;z-index: 1;cursor: auto;">',
        '<label style="width: 100%; text-align: left;margin-bottom: 10px;margin-top: -10px;font-size: 13px;color: lightgrey;">' + Resource.sceneOptions + '</label>',
        '<button style="top: 10px;position: absolute;right: 1rem;" aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',
        '<ul class="tabs-menu">',
            '<li class="tabs-menu-item"><a class="tab-active" data-index="0" href="#">' + Resource.basicOptions + '</a></li>',
            '<li class="tabs-menu-item"><a data-index="1" href="#">' + Resource.otherOptions + '</a></li>',
            '<li class="tabs-menu-item"><a data-index="2" href="#">' + Resource.sceneColor + '</a></li>',
            '<li class="tabs-menu-item"><a data-index="3" href="#">' + Resource.flood + '</a></li>',
            '<li class="tabs-menu-item"><a data-index="4" href="#">' + Resource.camera + '</a></li>',
            '<li class="tabs-menu-item"><a data-index="5" href="#">' + Resource.about + '</a></li>',
        '</ul>',

        '<div class="tabs-content-placeholder" style="height:100%" id="scene-placeholder">',

        '<div class="tabs-content-item tabs-content-active">',
        '<label>' + Resource.viewMode + '</label>',
        '<select id="sceneMode" class="cesium-button param-item-first-level">',
        '<option value="3D">3D</option>',
        '<option value="2D">2D</option>',
        '<option value="columbusView">2.5D</option>',
        '</select>',
        '<label> ' + Resource.multiViewport + '</label>',
        '<select id="viewportType" class="cesium-button param-item-first-level">',
        '<option value="NONE" selected>' + Resource.onePort + '</option>',
        '<option value="HORIZONTAL">' + Resource.horizontalSnap + '</option>',
        '<option value="VERTICAL">' + Resource.verticalSnap + '</option>',
        '<option value="TRIPLE">' + Resource.tripeSnap + '</option>',
        '<option value="QUAD">' + Resource.quadSnap + '</option>',
        '</select>',

        /* 卷帘 start */
        '<section id="roller-setting" class="scene-attribute-sub-module">',
        '<label class="label-block">' + Resource.split + '</label>',
        '<div class="roller-param-item">',
            '<label class="param-item-first-level">' +
                '<input type="checkbox" id="use-roller"/>' +
                '<span>' + Resource.useRoller + '</span>' +
            '</label>',
        '</div>',

        '<div class="roller-param-item tab-content-active">',
            '<label class="param-item-first-level">' +
                '<input type="checkbox" id="imagery-roller"/>' +
                '<span>' + Resource.imageryRoller + '</span>' +
            '</label>',
        '</div>',

        '<div class="roller-param-item">',
            '<label class="param-item-first-level">' +
                '<input type="radio" name="roller-category" value="lr-roller" checked/>' +
                '<span>' + Resource.lrRoller + '</span>' +
            '</label>',
            '<div class="roller-param-sub-item" id="lr-roller-mode">',
                '<label class="param-item-second-level">' +
                    '<input type="radio" name="roller-mode" value="left-roller" checked/>' +
                    '<span>' + Resource.leftRoller + '</span>' +
                '</label>',
                '<label class="param-item-second-level">' +
                    '<input type="radio" name="roller-mode" value="right-roller"/>' +
                    '<span>' + Resource.rightRoller + '</span>' +
                '</label>',
            '</div>',
        '</div>',

        '<div class="roller-param-item">',
            '<label class="param-item-first-level">' +
                '<input type="radio" name="roller-category" value="tb-roller"/>' +
                '<span>' + Resource.tbRoller + '</span>' +
            '</label>',
            '<div class="roller-param-sub-item" style="display:none;" id="tb-roller-mode">',
                '<label class="param-item-second-level">' +
                    '<input type="radio" name="roller-mode" value="top-roller"/>' +
                    '<span>' + Resource.topRoller + '</span>' +
                '</label>',
                '<label class="param-item-second-level">' +
                    '<input type="radio" name="roller-mode" value="bottom-roller"/>' +
                    '<span>' + Resource.bottomRoller + '</span>' +
                '</label>',
            '</div>',
        '</div>',
        '</section>',
        /* 卷帘 end */

        /* 坐标查询 */
        '<label class="label-block"> ' + Resource.queryCoordinates + '</label>',
        '<div class="param-item-first-level">',
        '<button class="btn btn-info" id="queryCoordinates">' + Resource.coordinates + '</button>',
        '<div class="param-item" style="display: block;text-indent: 1rem;"><span>' + Resource.Spacelongitude + '</span><input type="text" class="input" style="width: 70%;margin-left: 0.5rem;" disabled id="scene-coordinate-longitude"/></div>',
        '<div class="param-item" style="display: block;text-indent: 1rem;"><span>' + Resource.Spacelatitude + '</span><input type="text" class="input" style="width: 70%;margin-left: 0.5rem;" disabled id="scene-coordinate-latitude"/></div>',
        '<div class="param-item" style="display: block;text-indent: 1rem;"><span>' + Resource.Spacealtitude + '</span><input type="text" class="input" style="width: 70%;margin-left: 0.5rem;" disabled id="scene-coordinate-height"/></div>',
        '</div>',
        '</div>',

        '<div class="tabs-content-item">',
        '<div class="square" >' +
            '<label>' +
                '<input type="checkbox" id="earth" checked/>' +
                '<span>' + Resource.earth + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square" >' +
            '<label>' +
                '<input type="checkbox" id="shadows"/>' +
                '<span>' + Resource.shadowMap + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square" >' +
            '<label>' +
                '<input type="checkbox" id="lightRender" checked/>' +
                '<span>' + Resource.sun + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square">' +
            '<label>' +
                '<input type="checkbox" id="timeline"/>' +
                '<span>' + Resource.timeline + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square">' +
            '<label>' +
                '<input type="checkbox" id="atomsphereRender" checked/>' +
                '<span>' + Resource.skyAtmosphereEffect + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square">' +
            '<label>' +
                '<input type="checkbox" id="fogEnabled" checked/>' +
                '<span>' + Resource.fogEffect + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square">' +
            '<label>' +
                '<input type="checkbox" id="depthAgainst" checked/>' +
                '<span>' + Resource.depthAgainst + '</span>' +
            '</label>' +
        '</div>',
        '<div class="square">' +
            '<label>' +
                '<input type="checkbox" id="icon" checked/>' +
                '<span>' + Resource.supermapLogo + '</span>' +
            '</label>' +
        '</div>',
        /*'<div class="square">' +
            '<label>' +
                '<input type="checkbox" id="removeInvalidTerrainRegion"/>' +
                '<span>' + Resource.removeInvalidTerrainRegion + '</span>' +
            '</label>' +
        '</div>',*/
        '</div> ',

        '<div class="tabs-content-item">',
            '<label class="label-block">' + Resource.brightness + '</label>',
            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "brightness" class="input" >',
            '<label class="label-block">' + Resource.contrast + '</label>',
            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "contrast" class="input" >',
            '<label class="label-block">' + Resource.hue + '</label>',
            '<input type="number" min="0" max="3" step="0.02" value="0.0" id= "hue" class="input">',
            '<label class="label-block">' + Resource.saturation + '</label>',
            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "saturation" class="input" >',
            '<label class="label-block">' + Resource.gamma + '</label>',
            '<input type="number" min="0" max="3" step="0.02" value="1.0" id= "gamma" class="input" >',
        '</div>',

        '<div class="tabs-content-item">',
        '<label class="label-block">' + Resource.sceneFlood +'</label>',
        '<div class="param-item-first-level">',
            '<label class="label-block">' +
                '<input type="checkbox" id="bloom"/>' +
                '<span>' + Resource.openSceneFlood + '</span>' +
            '</label>',
            '<label>' + Resource.threshold + '</label>',
            '<input type="number" id="threshold" class="input" min="0" max="1"  value="0.6" step="0.01">',
            '<label>' + Resource.bloomIntensity + '</label>',
            '<input type="number" id="bloomIntensity" class="input" min="0" max="10"  value="2.0" step="0.5">',
        '</div>',
        '</div>',

        '<div class="tabs-content-item">',
        '<label class="label-block">' + Resource.flyRoute + '</label>',
        '<div class="param-item-first-level">',
        '<input style="background-color:#2EC5AD; width: 80%;" type="file" id="flyFile" onchange="" accept=".fpf"  /><br><br>',
        '<button class="start" id="startFly" title=' + Resource.startFly + ' style="background-color: transparent;border:none;"></button>',
        '<button class="pause" id="pauseFly" title=' + Resource.pauseFly + ' style="background-color: transparent;border:none;"></button>',
        '<button class="stop"  id="stopFly"  title=' + Resource.stopFly + ' style="background-color: transparent;border:none;"></button><br><br>',
        '<select id="stopList" style="background-color:#2EC5AD;width: 80%">',
        '</select>',
        '</div>',

        '<label class="label-block">' + Resource.observe + '</label>',
        '<div class="param-item-first-level">',
        '<button id="spin" class="btn btn-info" style="margin: 0 10px 0px 2px;">' + Resource.rotatePoint + '</button>',
        '<label style="margin-right: 1rem;">' +
            '<input type="checkbox" id="stopFlyCircle">' +
            '<span>'+Resource.pauseFly+'</span>' +
        '</label>',
        '<label style="margin-right: 0.2rem;">' +
            '<input type="checkbox" id="circulation" checked>' +
            '<span>' + Resource.rotateCirculation + '</span>' +
        '</label>',
        '<label style="display: none;">' +
            '<input type="checkbox" id="interaction"/>' +
            '<span>' + Resource.interactive + '</span>' +
        '</label>',
        '<canvas id="headControlsCanvas" style="width: 250px;height: 512px;display: none"></canvas>',
        '<button id="startHeadControlsButton" style="display: none">' + Resource.enableWebcam + '</button>',
        '</div>',

        '<label class="label-block">' + Resource.underground + '</label>',
        '<div class="param-item-first-level">',
        '<label>' +
            '<input type="checkbox" id="underground"/>' +
            '<span>' + Resource.openUnderground + '</span>' +
        '</label>',
        '<div id="camera-minimum-zoom-distance-wrapper" class="param-item">',
            '<label class="label-block">' + Resource.cameraMinimumZoomDistance + '</label>',
            '<input type="number" class="input" style="width: 80%;margin-left: 0.5rem;" id="camera-minimum-zoom-distance" value="-1000" />',
            '<label class="label-block">' + Resource.SurfaceTransparency + '</label>',
            '<input type="number" class="input" style="width: 80%;margin-left: 0.5rem;" id="groundAlpha" min="0" max="1.0" step="0.01" value="1.0">',
        '</div>',
        '</div>',
        '</div>',


        /* 关于 */
        '<div class="tabs-content-item">',
            '<label class="label-block text-center" style="font-size: 20px">SuperMap iEarth</label>',
            '<label class="label-block text-center" style="font-size: 16px">' + Resource.Version + ' ： 1.1</label>',
            '<label class="label-block">' + Resource.newContent + '</label>',
            '<textarea id="scenePortalDescription" style="width:220px;height:160px;resize: none;margin-left: 15px;background:transparent">' + Resource.WhatsNew + '</textarea>',
        '</div>',

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
                    $("#removeInvalidTerrainRegion").on("input propertychange", function () {
                        viewer.terrainProvider.isShowGlobe = !$(this).prop("checked");
                    });
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
                    $('#interaction').on("input change", function () {
                        var SETTINGS = {
                            zoomSensibility: 5.5,
                            panSensibility: 0.00000015
                        };
                        var ISHEADCONTROLSON = false, ISHEADCONTROLSINITIALIZED = false;
                        $("#startHeadControlsButton").show();
                        if (!this.checked) {
                            ISHEADCONTROLSON = true;
                            $("#headControlsCanvas").hide();
                            $("#startHeadControlsButton").hide();
                            toggleHeadControls(!ISHEADCONTROLSON);
                            return;
                        }
                        $("#startHeadControlsButton").on("click", function () {
                            $("#headControlsCanvas").show();
                            $("#startHeadControlsButton").hide();
                            if (ISHEADCONTROLSINITIALIZED) {
                                toggleHeadControls(!ISHEADCONTROLSON);
                                return;
                            }
                            ISHEADCONTROLSINITIALIZED = true;
                            HeadControls.init({
                                canvasId: 'headControlsCanvas',
                                callbackMove: callbackMove,
                                callbackReady: function (err) {
                                    if (err) {
                                        console.log('ERROR in index.html : HEAD CONTROLS NOT READY. err =', err);
                                    } else {
                                        console.log('INFO in index.html : HEAD CONTROLS ARE READY :)');
                                        toggleHeadControls(true);
                                    }
                                },
                                NNCpath: 'js/lib/',
                                animateDelay: 2
                            });
                        })
                        function toggleHeadControls(isOn) {
                            HeadControls.toggle(isOn);
                            ISHEADCONTROLSON = isOn;
                        }

                        function callbackMove(mv) {
                            var cameraHeight = scene.camera.positionCartographic.height / 1000.0
                            if (mv.dZ !== 0) {
                                var zoomAmount = mv.dZ * SETTINGS.zoomSensibility * cameraHeight;
                                camera.moveForward(zoomAmount);
                            }
                            if (mv.dRx !== 0) {
                                var panAmountX = SETTINGS.panSensibility * mv.dRx * cameraHeight;
                                camera.rotateUp(panAmountX);
                            }
                            if (mv.dRy !== 0) {
                                var panAmountY = SETTINGS.panSensibility * mv.dRy * cameraHeight;
                                camera.rotate(Cesium.Cartesian3.UNIT_Z, panAmountY);
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
                    tooltip.showAt(movement.endPosition, '点击查询坐标值');
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                handler.setInputAction(function (e) {
                    var position = scene.pickPosition(e.position);
                    var cartographic = Cesium.Cartographic.fromCartesian(position);
                    $('#scene-coordinate-longitude').val(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                    $('#scene-coordinate-latitude').val(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                    $('#scene-coordinate-height').val(cartographic.height.toFixed(3));
                    tooltip.setVisible(false);
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
