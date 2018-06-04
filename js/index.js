require.config({
    waitSeconds: 60, // 加载超时时间，单位为秒
    paths: {
        Cesium: '../Build/Cesium/Cesium',
        Zlib: '../Build/Cesium/Workers/zlib.min',
        jquery: "lib/jquery.min",
        underscore: "lib/underscore-min.1.4.4",
        backbone: "lib/backbone-min",
        Config: 'Config',
        bootstrapTree: 'lib/bootstrap-treeview',
        iScroll: 'lib/iscroll',
        Tabs: 'views/tabs',
        dropdown: 'views/dropdown',
        CesiumHeatmap: 'lib/heatmap.min',
        echarts: 'lib/echarts.simple.min',
        echartsMin: 'lib/echarts.min',
        colorPicker: 'lib/jquery.colorpicker',
        spectrum: 'lib/spectrum',
        drag: 'lib/drag',
        slider: 'lib/slider',
        popLayer: 'lib/layer/src/layer',
        resourceCN: 'resource/resourceCN',
        resourceEN: 'resource/resourceEN'
    },
    shim: { // 配置非AMD规范模块
        underscore: {
            deps: [],
            exports: "_"
        },
        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        CesiumHeatmap: {
            exports: "CesiumHeatmap"
        },
        echarts: {
            exports: "echarts"
        },
        echartsMin: {
            exports: "echartsMin"
        },
        Cesium: {
            exports: 'Cesium'
        },
        Zlib: {
            exports: 'Zlib'
        },
        colorPicker: {
            exports: 'colorPicker'
        },
        bootstrapTree: {
            exports: 'bootstrapTree'
        },
        iScroll: {
            exports: 'iScroll'
        },
        Tabs: {
            exports: 'Tabs',
            deps: ['jquery']
        },
        dropdown: {
            exports: 'dropdown',
            deps: ['jquery']
        },
        spectrum: {
            exports: 'spectrum'
        },
        slider: {
            exports: 'slider'
        },
        popLayer: {
            deps: ["jquery"],
            exports: "mylayer"
        }
    }
});

var currentLanguage = (navigator.language || navigator.browserLanguage).toLowerCase(); // 获取当前浏览器的语言
if (currentLanguage == 'zh-cn') {
    require(['resourceCN', 'Cesium', 'Zlib'], function (ResourceCN, Cesium, Zlib) {
        window.Resource = ResourceCN;
        init(Cesium, Zlib);
    });
} else {
    require(['resourceEN', 'Cesium', 'Zlib'], function (ResourceEN, Cesium, Zlib) {
        window.Resource = ResourceEN;
        init(Cesium, Zlib);
    });
}

function init(Cesium, Zlib) {
    var options = {
        geocoder: true
    };
    var isPCBroswer = Cesium.FeatureDetection.isPCBroswer();
    var viewer;
    if (isPCBroswer) {
        viewer = new Cesium.Viewer('cesiumContainer', {
            animation: true,
            timeline: true,
            baseLayerPicker: false,
            shadows: true,
            infoBox: false
        });
        viewer.animation.container.style.visibility = 'hidden';
        viewer.timeline.container.style.visibility = 'hidden';
    }
    else {
        viewer = new Cesium.Viewer('cesiumContainer', {
            infoBox: false
        });
        var scene = viewer.scene;
        if (Cesium.defined(scene.sun)) {
            scene.sun.show = false;
        }
        if (Cesium.defined(scene.moon)) {
            scene.moon.show = false;
        }
        if (Cesium.defined(scene.skyAtmosphere)) {
            scene.skyAtmosphere.show = false;
        }
        if (Cesium.defined(scene.skyBox)) {
            scene.skyBox.show = false;
        }
        document.documentElement.style.height = window.innerHeight + 'px';
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }
    if (viewer.geocoder) {
        viewer.geocoder.viewModel.geoKey = 'NGyNBR7nqy1edmqO6NpnIECG';
    }
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;
    if (!window.isLogin) {
        viewer.camera.setView({
            destination: new Cesium.Cartesian3(6788287.844465209, -41980756.10214644, 29619220.04004376)
        });
        viewer.camera.flyTo({
            destination: new Cesium.Cartesian3(-5668622.32641487, 21155586.53109959, 12644793.325518927),
            duration: 5
        });
    }
    viewer.pickEvent.addEventListener(function (feature) {
        var name = feature[Resource.name];
        var des = getDescription(feature);
        viewer.selectedEntity = new Cesium.Entity({
            name: name,
            description: des
        });
    });
    require(['jquery'], function ($) {
        $('#myActTitle').text(Resource.account);
        $('#myMsgTitle').text(Resource.myMsg);
        $('#saveTitle').text(Resource.save);
        $('#uploadDataTitle').text(Resource.uploadData);
        $('#exitTitle').text(Resource.exit);
        if (!isPCBroswer) {
            var supportsOrientationChange = "onorientationchange" in window,
                orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
            window.addEventListener(orientationEvent, function () {
                $("html").css("width", window.innerWidth);
                $("html").css("height", window.innerHeight);
                $("#cesiumContainer").css("width", window.innerWidth);
                $("#cesiumContainer").css("height", window.innerHeight);
            }, false);
        }
        $("#loadOverlay").hide();
        $('#loadbar').removeClass('ins');
        $(".cesium-viewer-navigationContainer").hide();
        Window.LOADING_FLAG = false;
        $('#btnLogin').on('click', function () {
            window.SuperMapSSO.doLogin("reCallBack");
            if (event && event.preventDefault) {
                event.preventDefault();
            } else {
                window.event.returnValue = false;
            }
            return false;
        });
        require(['Tabs', 'dropdown', './views/ToolBar', './tools/Position', './views/ViewerContainer', './models/SceneModel', './views/ErrorPannel', './views/GeoLocation', './views/layerAttribute'],
            function (Tabs, dropdown, ToolBar, Position, ViewerContainer, SceneModel, ErrorPannel, GeoLocation, layerAttribute) {
                var sceneModel = new SceneModel(viewer);
                var viewerContainer = new ViewerContainer();
                var toolBar = new ToolBar({
                    sceneModel: sceneModel,
                    isPCBroswer: isPCBroswer
                });
                viewerContainer.addComponent(toolBar, new Position());
                if (!isPCBroswer) { // 移动端隐藏在线编辑和量算按钮
                    $('#addMarkerBtn').hide();
                    $('#measureBtn').hide();
                }
                else {
                    $('#btnLogin').show();
                }
                var errorPannel = new ErrorPannel();
                viewerContainer.addComponent(errorPannel);
                var layerContainer = new layerAttribute({
                    sceneModel: sceneModel
                });
                viewerContainer.addComponent(layerContainer);

                $('#btnLogout').on('click', function () {
                    $("body").append("<iframe id='innerIframe' style='top:10000px;left:0;border:none;display:none;' src='https://www.supermapol.com/services/security/logout'></iframe>");
                    window.SuperMapSSO.doLogout();
                    if (event && event.preventDefault) {
                        event.preventDefault();
                    } else {
                        window.event.returnValue = false;
                    }
                    return false;
                });
                $('#save').on('click', function (evt) {
                    if (sceneModel) {
                        sceneModel.save();
                    }
                    evt.stopPropagation();
                    return false;
                });
                if (window.isLogin) {
                    window.USERNAME = $('#accountID').text();
                    if (sceneModel) {
                        sceneModel.open();
                    }
                }
                /*else if (isPCBroswer) { // 会链接到iPortal，引入iPortal自身的一个后台报错，暂时注释掉，目前没有出现问题
                    $("body").append("<iframe id='innerIframe' style='top:10000px;left:0;border:none;display:none;' src='https://www.supermapol.com/services/security/logout'></iframe>");
                }*/
            });
    });
}

function getDescription(feature) {
    var simpleStyleIdentifiers = [Resource.name, Resource.address];
    var html = '';
    for (var key in feature) {
        if (feature.hasOwnProperty(key)) {
            if (simpleStyleIdentifiers.indexOf(key) == -1) {
                continue;
            }
            var value = feature[key];
            if (value !== '') {
                html += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
            }
        }
    }
    if (html.length > 0) {
        html = '<table class="zebra"><tbody>' + html + '</tbody></table>';
    }
    return html;
}