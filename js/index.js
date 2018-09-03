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
    var isPCBroswer = Cesium.FeatureDetection.isPCBroswer();
    var viewer;
    if (isPCBroswer) {
        viewer = new Cesium.Viewer('cesiumContainer', {
            animation: true,
            timeline: true,
            baseLayerPicker: false,
            shadows: true,
            infoBox: false,
            geocoder : true
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
        if (Cesium.defined(scene.skyBox)) {
            scene.skyBox.show = false;
        }
        document.documentElement.style.height = window.innerHeight + 'px';
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }
    if (viewer.geocoder) {
        // 请开发者自行到supermap online官网（http://www.supermapol.com/）申请key
        viewer.geocoder.viewModel.geoKey = 'fvV2osxwuZWlY0wJb8FEb2i5';
    }
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;
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
        $(".cesium-viewer-navigationContainer").hide();

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
                var compassContainer = new Compass({
                    sceneModel : sceneModel
                });
                viewerContainer.addComponent(compassContainer);
                var locationContainer = new GeoLocation({
                    sceneModel : sceneModel
                });
                viewerContainer.addComponent(locationContainer,new Position({
                    mode : 'rt',
                    x : '10px',
                    y : '150px'
                }));
                if(isPCBroswer){
                    var portalFormContainer = new portalForm({
                        sceneModel : sceneModel,
                        isPCBroswer : isPCBroswer
                    });
                    viewerContainer.addComponent(portalFormContainer,new Position({
                        mode : 'rt',
                        x : '10px',
                        y : '200px'
                    }));
                }
                var layerContainer = new layerAttribute({
                    sceneModel: sceneModel
                });
                viewerContainer.addComponent(layerContainer);

                if(Window.iportalAppsRoot && Window.iportalAppsRoot != "${resource.rootPath}"){
                    var sceneViewerUrl = window.location.href;
                    if (sceneViewerUrl.indexOf("?action=") == -1) {
                        var appsRoot =Window.iportalAppsRoot;
                        var pattern = "/apps";
                        appsRoot = appsRoot.replace(new RegExp(pattern), "");
                        sceneViewerUrl = sceneViewerUrl.match(/earth(\S*)/)[1];
                        if(sceneViewerUrl != '/'){
                            var regexp = new RegExp("/");
                            sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                            if(sceneViewerUrl.indexOf("share") > -1){
                                sceneViewerUrl = sceneViewerUrl.match(/(\S*)share/)[1];
                                sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                            }
                            $.ajax({
                                    type: "GET",
                                    url: appsRoot + "/web/scenes/" + sceneViewerUrl + ".json",
                                    contentType: "application/json;charset=utf-8",
                                    dataType: "json",
                                    async: false,
                                    success : function (json) {
                                        if(json.content){
                                            sceneModel.parsePortalJson(json);
                                        }else {
                                            var cesiumScene =  json.url;
                                            var url = cesiumScene.match(/realspace(\S*)/)[1];
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