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
            spectrum: 'lib/spectrum/spectrum',
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
    var location = window.location;
    var protocol = location.protocol;
    var host = location.host;
    var systemJSONUrl = `${protocol}//${host}/iportal/web/config/system.json`;
    Cesium.loadJson(systemJSONUrl).then(function(jsonData) {
        Window.isSuperMapOL = jsonData.isSuperMapOL
    });
    Window.isSuperMapOL = "${resource.customVariables.isSuperMapOL?c}";
    var isPCBroswer = Cesium.FeatureDetection.isPCBroswer();
    var viewer;
    if (isPCBroswer) {
        viewer = new Cesium.Viewer('cesiumContainer', {
            animation: true,
            timeline: true,
            baseLayerPicker: false,
            shadows: true,
            infoBox: false,
            geocoder : true,
            // skyBox: false, // 关闭天空盒会一同关闭太阳，场景会变暗
            navigation: false
        });
        viewer.animation.container.style.visibility = 'hidden';
        viewer.timeline.container.style.visibility = 'hidden';
    }
    else {
        viewer = new Cesium.Viewer('cesiumContainer', {
            infoBox: false,
            skyBox: false,
            navigation: false
        });

        var scene = viewer.scene;
        if (Cesium.defined(scene.sun)) {
            scene.sun.show = false;
        }
        if (Cesium.defined(scene.moon)) {
            scene.moon.show = false;
        }
        document.documentElement.style.height = window.innerHeight + 'px';
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }

    if (viewer.geocoder) {
        // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
        viewer.geocoder.viewModel.geoKey = 'fvV2osxwuZWlY0wJb8FEb2i5';
        document.querySelector('.cesium-geocoder-input').placeholder = Resource.searchPlaceHolder;
    }
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.baseColor = Cesium.Color.BLACK; // 没有影像图层时地球的底色

    viewer.camera.setView({
        destination: new Cesium.Cartesian3(6788287.844465209, -41980756.10214644, 29619220.04004376)
    });
    viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(110.60396458865515,34.54408834959379,30644793.325518917),
        duration: 5
    });
    viewer.pickEvent.addEventListener(function (feature) {
        var name = feature[Resource.name];
        var des = getDescription(feature);
        viewer.selectedEntity = new Cesium.Entity({
            name: name,
            description: des
        });
    });

    require(['jquery'], function ($) {
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
        $("body").append('<span id="baselayer-source" class="baselayer-source">' + Resource.baseLayerSource + '：' + Resource.localImage + '</span>');

        require(['Tabs', 'dropdown', './views/ToolBar', './tools/Position', './views/ViewerContainer', './models/SceneModel', './views/ErrorPannel', './views/layerAttribute','./views/Compass','./views/GeoLocation','./portal/portalForm'],
            function (Tabs, dropdown, ToolBar, Position, ViewerContainer, SceneModel, ErrorPannel,layerAttribute,Compass,GeoLocation,portalForm) {
                var sceneModel = new SceneModel(viewer);
                var viewerContainer = new ViewerContainer();
                sceneModel.viewerContainer =  viewerContainer;
                var toolBar = new ToolBar({
                    sceneModel: sceneModel,
                    isPCBroswer: isPCBroswer
                });
                viewerContainer.addComponent(toolBar, new Position());

                var errorPannel = new ErrorPannel();
                viewerContainer.addComponent(errorPannel);

                if(isPCBroswer){
                    var compassContainer = new Compass({
                        sceneModel : sceneModel
                    });
                    viewerContainer.addComponent(compassContainer);
                }

                if(isPCBroswer){
                    var portalFormContainer = new portalForm({
                        sceneModel : sceneModel,
                        isPCBroswer : isPCBroswer
                    });
                    viewerContainer.addComponent(portalFormContainer,new Position({
                        mode : 'rt',
                        x : '10px',
                        y : '150px'
                    }));
                }

                document.body.removeChild(document.getElementById('transition-loader')); // 移除加载动画

                if(isPCBroswer){
                    var locationContainer = new GeoLocation({
                        sceneModel : sceneModel
                    });
                    viewerContainer.addComponent(locationContainer,new Position({
                        mode : 'rt',
                        x : '10px',
                        y : '200px'
                    }));
                }

                var layerContainer = new layerAttribute({
                    sceneModel: sceneModel
                });
                viewerContainer.addComponent(layerContainer);

                var sceneViewerUrl = window.location.href;
                if (sceneViewerUrl.indexOf("?action=") == -1) {
                    sceneViewerUrl = sceneViewerUrl.match(/id=(\S*)/);
                    if(sceneViewerUrl) {
                        sceneViewerUrl = sceneViewerUrl[1];
                        if(sceneViewerUrl != '/'){
                            var regexp = new RegExp("/");
                            sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                            if(sceneViewerUrl.indexOf("share") > -1){
                                sceneViewerUrl = sceneViewerUrl.match(/(\S*)share/)[1];
                                sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                            }
                            $.ajax({
                                    type: "GET",
                                    url: "../../web/scenes/" + sceneViewerUrl + ".json",
                                    contentType: "application/json;charset=utf-8",
                                    dataType: "json",
                                    async: false,
                                    success : function (json) {
                                        if(json.content){
                                            sceneModel.parsePortalJson(json);
                                        }else {
                                            var cesiumScene =  json.url;
                                            var url = cesiumScene.match(/\/rest\/realspace(\S*)/)[1];
                                            var regexp = new RegExp(url);
                                            cesiumScene = cesiumScene.replace(regexp,"");
                                            sceneModel.openScene(cesiumScene);
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
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