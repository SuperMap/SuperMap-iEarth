define(['backbone', '../Util', '../Config'], function (Backbone, Util, Config) {
    var S3MLayerModel = Backbone.Model.extend({
        addLayer: function (sceneModel, isFlyMode) {
            var viewer = sceneModel.viewer;
            if (!this.viewer) {
                this.viewer = viewer;
                this.sceneModel = sceneModel;
            }
            var me = this;
            var scpUrl = this.get('url');
            var name = this.get('realName') || this.get('name');
            var originName = this.get('originName');
            var defer = Cesium.when.defer();
            if (Util.S3M_CACHE[scpUrl]) {
                Util.showErrorMsg(Resource.layerExistMsg);
                return defer.reject();
            }
            var promise = viewer.scene.addS3MTilesLayerByScp(scpUrl, {
                name: name
            });
            return Cesium.when(promise, function (layer) {
                me.sceneModel.trigger('layerAdded', me);
                me.sceneModel.layers.add(me);
                me.layer = layer;
                if (isFlyMode) {
                    me.flyTo();
                }
                Util.S3M_CACHE[scpUrl] = name;
                if (me.get('isVisible') == false) {
                    layer.visible = false;
                }
                return defer.resolve(layer);
            }, function(error) {
                /*var s3mbPromise = viewer.scene.addS3MBTilesLayer(scpUrl, {
                    name: name
                });
                return Cesium.when(s3mbPromise, function (layer) {
                    me.sceneModel.trigger('layerAdded', me);
                    me.sceneModel.layers.add(me);
                    me.layer = layer;
                    if (isFlyMode) {
                        me.flyTo();
                    }
                    Util.S3M_CACHE[scpUrl] = name;
                    if (me.get('isVisible') == false) {
                        layer.visible = false;
                    }
                    return defer.resolve(layer);
                }, function() {
                    Util.showErrorMsg(Resource.loadException);
                    return;
                });*/
                console.log(error);
            });
        },
        removeLayer: function (viewer) {
            var name = this.get('name');
            var scpUrl = this.get('url');
            if (Util.S3M_CACHE[scpUrl]) {
                Util.S3M_CACHE[scpUrl] = undefined;
                delete Util.S3M_CACHE[scpUrl];
            }
            viewer.scene.layers.remove(name);
            this.sceneModel.layers.remove(this);
        },
        flyTo: function () {
            var scpName = this.get('originName');
            if (scpName === '点云') {
                if (!($("#data-source").length > 0)) {
                    $("body").append('<span id="data-source" class="data-source"></span>');
                }
                $("#data-source").text("数据来源：日本超图");
            } else if (scpName === '索菲亚大教堂') {
                if (!($("#data-source").length > 0)) {
                    $("body").append('<span id="data-source" class="data-source"></span>');
                }
                $("#data-source").text("数据来源：黑龙江省测绘科学研究院");
            } else if (scpName === '体数据') {
                this.hypsometricSetting();
            }
            else {
                if ($("#data-source").length > 0) {
                    $("#data-source").remove();
                }
            }
            var cameraParam = Config.CAMERA_PARAM[scpName];

            if (cameraParam) {
                this.viewer.scene.camera.flyTo({
                    destination: new Cesium.Cartesian3(cameraParam.Cartesian3.x, cameraParam.Cartesian3.y, cameraParam.Cartesian3.z),
                    orientation: {
                        heading: cameraParam.heading,
                        pitch: cameraParam.pitch,
                        roll: cameraParam.roll
                    }
                });
                return;
            } else {
                var ceterCartesianPosition = this.layer._position;
                var boundingSphere = new Cesium.BoundingSphere(ceterCartesianPosition, 200);
                var camera = this.viewer.scene.camera;
                camera.flyToBoundingSphere(boundingSphere);
            }

        },
        setVisible: function (isVisible, ids) {
            if (ids.length > 0) {
                this.layer.setOnlyObjsVisible(ids, isVisible);
            }
            else {
                this.layer.visible = isVisible;
                this.set('isVisible', isVisible);
            }
        },
        getJsonObj: function () {
            var obj = {
                displayName: this.get("name"),
                isVisible: this.layer.getObjsVisible(-1),
                classType: "OSGB",
                sourceURI: this.get("url")
            };

            return obj;
        },
        hypsometricSetting: function () {
            var colorTable = new Cesium.ColorTable();
            var layer = this.layer;
            colorTable.insert(layer._fMaxValue, new Cesium.Color(210 / 255, 15 / 255, 15 / 255));
            colorTable.insert(2 * (layer._fMinValue + layer._fMaxValue) / 3, new Cesium.Color(221 / 255, 224 / 255, 7 / 255));
            colorTable.insert((layer._fMinValue + layer._fMaxValue) / 2, new Cesium.Color(20 / 255, 187 / 255, 18 / 255));
            colorTable.insert((layer._fMinValue + layer._fMaxValue) / 4, new Cesium.Color(0, 161 / 255, 1));
            colorTable.insert(layer._fMinValue, new Cesium.Color(9 / 255, 9 / 255, 212 / 255));
            var hypsometric = new Cesium.HypsometricSetting();
            hypsometric.MaxVisibleValue = 0;
            hypsometric.ColorTable = colorTable;
            hypsometric.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE_AND_LINE;
            hypsometric.Opacity = 0.618;
            hypsometric.LineInterval = 60.0;
            hypsometric.LineColor = new Cesium.Color(1, 0, 0, 1);
            hypsometric.ColorTableMaxKey = layer._fMaxValue;
            hypsometric.ColorTableMinKey = layer._fMinValue;
            hypsometric.MaxVisibleValue = layer._fMaxValue;
            hypsometric.MinVisibleValue = layer._fMinValue;
            layer.hypsometricSetting = {
                hypsometricSetting: hypsometric,
                analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
            }
        }
    });
    return S3MLayerModel;
});