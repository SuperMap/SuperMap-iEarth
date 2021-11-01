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

            var styleUrl = this.attributes.sceneUrl + '/scenes/' + this.attributes.sceneName + '/layers/' + name + '/extendxml.xml';
            var promise = this.getS3MLayerConfig(styleUrl).then(function (config) {
                return viewer.scene.addS3MTilesLayerByScp(scpUrl, config)
            }).otherwise(function () {
                return viewer.scene.addS3MTilesLayerByScp(scpUrl, {name: name})
            }).then(function (res) {
                return Cesium.when(res, function (layer) {
                    layer.indexedDBSetting.isAttributesSave = true;
                    me.sceneModel.trigger('layerAdded', me);
                    me.sceneModel.layers.add(me);
                    me.layer = layer;
                    // if (isFlyMode) {
                    //     me.flyTo();
                    // }

                    var name = me.get('name');

                    Util.S3M_CACHE[scpUrl] = name;
                    if (me.get('isVisible') == false) {
                        layer.visible = false;
                    }
                    return defer.resolve(layer);
                }, function (error) {
                    console.log(error);
                });
            });
            return promise;
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
        },
        getS3MLayerConfig: function(url) {
            var rgbMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
            var rgbaMatcher2 = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)\)$/i;
            let XML = Cesium.XML;
            let CesiumMath = Cesium.Math;
            let defined = Cesium.defined;
            let Color = Cesium.Color;
            let Style3D = Cesium.Style3D;
            return Cesium.loadXML(url).then(function(doc) {
            if(!defined(doc)){
                throw new DeveloperError('get s3m layer config failed,xml document undefined.');
            }

            var rootNode = doc.firstChild;
            var namespace = rootNode.namespaceURI;
            var layerName = XML.queryStringValue(rootNode, 'LayerName', namespace);
            var optionsNode = XML.queryFirstNode(rootNode, 'Options', namespace);
            var groupName = XML.queryStringValue(rootNode, 'WithinLayer3DGroup', namespace);
            var selectable = XML.queryBooleanValue(optionsNode, 'Selectable', namespace);
            var isVisible = XML.queryBooleanValue(optionsNode, 'Visible', namespace);
            var minVisibleAltitude = XML.queryNumericValue(optionsNode, 'VisibleAltitudeMin', namespace);
            var maxVisibleAltitude = XML.queryNumericValue(optionsNode, 'VisibleAltitudeMax', namespace);
            maxVisibleAltitude = maxVisibleAltitude == 0.0 ? Number.MAX_VALUE : maxVisibleAltitude;
            var minVisibleDistance = XML.queryNumericValue(optionsNode, 'VisibleDistanceMin', namespace);
            var maxVisibleDistance = XML.queryNumericValue(optionsNode, 'VisibleDistanceMax', namespace);
            var shadowTypeStr = XML.queryStringValue(optionsNode, 'ShadowType', namespace);
            var shadowType = 0;
            if(shadowTypeStr == 'SELECTION'){
                shadowType = 1;
            }
            else if(shadowTypeStr == 'ALL'){
                shadowType = 2;
            }

            var cacheFileTypeStr = XML.queryStringValue(rootNode, 'CacheFileType', namespace);
            var isS3MB = false;
            if(cacheFileTypeStr == 'S3MB'){
                isS3MB = true;
            }

            var styleNode = XML.queryFirstNode(rootNode, 'Style', namespace);
            if(!defined(styleNode)){
                var layerStyleNode = XML.queryFirstNode(rootNode, 'LayerStyle', namespace);
                if(defined(layerStyleNode)){
                    styleNode = XML.queryFirstNode(layerStyleNode, 'Style', namespace);
                    if(!defined(styleNode)){
                        throw new DeveloperError('get s3m layer config failed,extendxml.xml foamat error,layer name is ' + layerName);
                    }
                }
            }

            var lineWidth = XML.queryNumericValue(styleNode, 'LineWidth', namespace);
            var fillForeColor = XML.queryStringValue(styleNode, 'FillForeColor', namespace);
            var matches = rgbMatcher.exec(fillForeColor);
            var ffColor = new Color();
            if (matches !== null) {
                var red = parseFloat(matches[1]);
                red = red == 189.0 ? 255.0 : red;
                var green = parseFloat(matches[2]);
                green = green == 235.0 ? 255.0 : green;
                ffColor.red = CesiumMath.clamp(red / 255.0, 0.0, 1.0);
                ffColor.green = CesiumMath.clamp(green / 255.0, 0.0, 1.0);
                ffColor.blue = CesiumMath.clamp((parseFloat(matches[3]) % 0x100) / 255.0, 0.0, 1.0);
                ffColor.alpha = CesiumMath.clamp(((parseFloat(matches[3]) % 0x10000) / 0x100) / 255.0, 0.0, 1.0);
            }

            var style3DNode = XML.queryFirstNode(styleNode, 'Style3D', namespace);
            var style3D = new Style3D();
            if(defined(style3DNode)){
                var fillStyleStr = XML.queryNumericValue(style3DNode, 'FillStyle', namespace);
                var fillStyle = Cesium.FillStyle.Fill;
                if(fillStyleStr == 'FILL_LINE'){
                    fillStyle = Cesium.FillStyle.WireFrame;
                }
                else if(fillStyleStr == 'FILL_FACEANDLINE'){
                    fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
                }

                var pointSize = XML.queryNumericValue(style3DNode, 'PointSize', namespace);
                var lineColorStr = XML.queryStringValue(style3DNode, 'LineColor', namespace);
                var matches = rgbaMatcher2.exec(lineColorStr);
                var lineColor = new Color();
                if(matches !== null){
                    lineColor.red = CesiumMath.clamp(parseFloat(matches[1]), 0.0, 1.0);
                    lineColor.green = CesiumMath.clamp(parseFloat(matches[2]), 0.0, 1.0);
                    lineColor.blue = CesiumMath.clamp(parseFloat(matches[3]), 0.0, 1.0);
                    lineColor.alpha = CesiumMath.clamp(parseFloat(matches[4]), 0.0, 1.0);
                }

                var pointColorStr = XML.queryStringValue(style3DNode, 'ColorPoint', namespace);
                matches = rgbaMatcher2.exec(pointColorStr);
                var pointColor = new Color();
                if (matches !== null) {
                    pointColor.red = CesiumMath.clamp(parseFloat(matches[1]), 0.0, 1.0);
                    pointColor.green = CesiumMath.clamp(parseFloat(matches[2]), 0.0, 1.0);
                    pointColor.blue = CesiumMath.clamp(parseFloat(matches[3]), 0.0, 1.0);
                    pointColor.alpha = CesiumMath.clamp(parseFloat(matches[4]), 0.0, 1.0);
                }

                var bottomAltitude = XML.queryNumericValue(style3DNode, 'BottomAltitude', namespace);
                var altitudeMode = XML.queryStringValue(style3DNode, 'AltitudeMode', namespace);
                var rotateX = CesiumMath.toRadians(XML.queryNumericValue(style3DNode, 'RotateX', namespace));
                var rotateY = CesiumMath.toRadians(XML.queryNumericValue(style3DNode, 'RotateY', namespace));
                var rotateZ = CesiumMath.toRadians(XML.queryNumericValue(style3DNode, 'RotateZ', namespace));
                var hpr = new Cesium.HeadingPitchRoll(rotateX, rotateY ,rotateZ);
                style3D.fillForeColor = ffColor;
                style3D.bottomAltitude = bottomAltitude;
                style3D.lineWidth = lineWidth;
                style3D.lineColor = lineColor;
                style3D.pointSize = pointSize;
                style3D.pointColor = pointColor;
                style3D.fillStyle = fillStyle;
                //style3D.altitudeMode = altitudeMode;
            }

            var effect = undefined;
            var effectNode = XML.queryFirstNode(rootNode, 'Effect', namespace);
            if(defined(effectNode)) {
                var effectType = XML.queryStringValue(effectNode, 'EffectType', namespace);
                if(effectType === 'Region') {
                    effect = new Cesium.S3MRegionEffect();
                    var type = XML.queryNumericValue(effectNode, 'Type', namespace);
                    effect.setValue('RegionType',type);

                    var foreColorStr = XML.queryNumericValue(effectNode, 'ForeColor', namespace);
                    var foreColor = Color.fromRgba(foreColorStr);
                    effect.setValue('ForeColor',foreColor);

                    var backColorStr = XML.queryNumericValue(effectNode, 'BackColor', namespace);
                    var backColor = Color.fromRgba(backColorStr);
                    effect.setValue('BackColor',backColor);

                    var widthX = XML.queryNumericValue(effectNode, 'WidthX', namespace);
                    effect.setValue('WidthX',widthX);
                    var widthY = XML.queryNumericValue(effectNode, 'WidthY', namespace);
                    effect.setValue('WidthY',widthY);

                    var offsetX = XML.queryNumericValue(effectNode, 'OffsetX', namespace);
                    effect.setValue('OffsetX',offsetX);
                    var offsetY = XML.queryNumericValue(effectNode, 'OffsetY', namespace);
                    effect.setValue('OffsetY',offsetY);

                    var repeatX = XML.queryNumericValue(effectNode, 'RepeatX', namespace);
                    effect.setValue('RepeatX',repeatX);
                    var repeatY = XML.queryNumericValue(effectNode, 'RepeatY', namespace);
                    effect.setValue('RepeatY',repeatY);

                    var rotationAngle = XML.queryNumericValue(effectNode, 'RotationAngle', namespace);
                    effect.setValue('RotationAngle',rotationAngle);
                }
                else if(effectType === 'Polyline') {
                    effect = new Cesium.S3MPolylineEffect();

                    var type = XML.queryNumericValue(effectNode, 'Type', namespace);
                    effect.setValue('PolylineType',type);

                    var colorStr = XML.queryNumericValue(effectNode, 'Color', namespace);
                    var color = Color.fromRgba(colorStr);
                    effect.setValue('Color',color);

                    var width = XML.queryNumericValue(effectNode, 'Width', namespace);
                    effect.setValue('Width',width);

                    var isArrow = XML.queryBooleanValue(effectNode, 'IsArrow', namespace);
                    effect.setValue('IsArrow',isArrow);

                    var gapColorStr = XML.queryNumericValue(effectNode, 'GapColor', namespace);
                    var gapColor = Color.fromRgba(gapColorStr);
                    effect.setValue('GapColor',gapColor);

                    var dashLength = XML.queryNumericValue(effectNode, 'DashLength', namespace);
                    effect.setValue('DashLength',dashLength);
                    var dashPattern = XML.queryNumericValue(effectNode, 'DashPattern', namespace);
                    effect.setValue('DashPattern',dashPattern);

                    var isMove = XML.queryBooleanValue(effectNode, 'IsMove', namespace);
                    effect.setValue('IsMove',isMove);

                    var glowPower = XML.queryNumericValue(effectNode, 'GlowPower', namespace);
                    effect.setValue('GlowPower',glowPower);

                    var outlineColorStr = XML.queryNumericValue(effectNode, 'OutlineColor', namespace);
                    var outlineColor = Color.fromRgba(outlineColorStr);
                    effect.setValue('OutlineColor',outlineColor);

                    var outlineWidth = XML.queryNumericValue(effectNode, 'OutlineWidth', namespace);
                    effect.setValue('OutlineWidth',outlineWidth);
                }
            }

            var lodRangeScale = XML.queryNumericValue(rootNode, 'LODRangeScale', namespace);
            var polygonOffsetNode = XML.queryFirstNode(rootNode, 'PolygonOffset', namespace);
            var polygonOffsetConstant = XML.queryNumericValue(polygonOffsetNode, 'Constant', namespace);
            var polygonOffsetScale = XML.queryNumericValue(polygonOffsetNode, 'SlopeScale', namespace);
            var polygonOffsetScaleEnable = (polygonOffsetConstant !== 0.0 && polygonOffsetScale !== 0.0);
            var colorParamNode = XML.queryFirstNode(rootNode, 'ColorParams', namespace);
            var brightness = XML.queryNumericValue(colorParamNode, 'Brightness', namespace);
            var constrast = XML.queryNumericValue(colorParamNode, 'Constrast', namespace);
            var hue = XML.queryNumericValue(colorParamNode, 'Hue', namespace);
            var saturation = XML.queryNumericValue(colorParamNode, 'Saturation', namespace);
            var gamma = XML.queryNumericValue(colorParamNode, 'Gamma', namespace);
            return {
                name : layerName,
                groupName : groupName,
                isS3MB : isS3MB,
                style3D : style3D,
                selectEnable : selectable,
                isVisible : isVisible,
                minVisibleAltitude : minVisibleAltitude,
                maxVisibleAltitude : maxVisibleAltitude,
                minVisibleDistance : minVisibleDistance,
                maxVisibleDistance : maxVisibleDistance,
                shadowType : shadowType,
                heading : rotateZ,
                lodRangeScale : lodRangeScale,
                polygonOffset : {
                    enabled : polygonOffsetScaleEnable,
                    units : polygonOffsetConstant,
                    factor : polygonOffsetScale
                },
                brightness : brightness,
                constrast : constrast,
                hue : hue,
                saturation : saturation,
                gamma : gamma,
                effect : effect
            };

        });
        }
    });
    return S3MLayerModel;
});