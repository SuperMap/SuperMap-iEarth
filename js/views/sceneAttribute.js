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
    var ParticleSystemSourceType = 0; // 粒子特效类型，初始时为火焰
    var pointLightSourceDrawHandler = null; // 绘制点光源位置工具
    var pointParticleSystemDrawHandler = null; // 绘制点粒子特效位置工具
    var spotOrDirectionalLightSourceDrawHandler = null; // 绘制聚光灯的工具
    var spotOrDirectionalLightSourceCountHandler = null;
    var spotOrDirectionalLightSourceAdding = false;
    var spotOrDirectionalLightPositions = [];
    var entityPointLightPairs = new Map(); // Entity和点光源对象的键值对
    var entitySpotLightPairs = new Map(); // Entity和聚光灯对象的键值对
    var entityParticleSystemPairs = new Map(); // Entity和粒子特效对象的键值对
    var selectedParticleSystem = null; //选中的粒子
    var entityDirectionalLightPairs = new Map(); // Entity和平行光对象的键值对
    var flyCircleDrawHandler = null;
    var viewModelFire;
    var viewModelFountain;


    var htmlStr = [
        '<main class="mainView" id="sceneForm">',
        '<button aria-label="Close" id="closeScene" class="myModal-close" title="关闭"><span aria-hidden="true">&times</span></button>',

        '<input id="scene-attribute-basic" name="scene-attribute" type="radio" checked/>',
        '<label for="scene-attribute-basic" class="function-module-caption">' + Resource.basicOptions + '</label>',
        '<input id="scene-attribute-camera" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-camera" class="function-module-caption">' + Resource.camera + '</label>',
        '<input id="scene-attribute-light" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-light" class="function-module-caption">' + Resource.light + '</label>',
        '<input id="scene-attribute-ParticleSystem" name="scene-attribute" type="radio"/>',
        '<label for="scene-attribute-ParticleSystem" class="function-module-caption">' + Resource.ParticleSystem + '</label>',
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
        '<label class="function-module-sub-section-caption">' + Resource.sceneFlood + '</label>',
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
        '<span>' + Resource.pauseFly + '</span>',
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

        '<section id="scene-attribute-ParticleSystem-content">',
        '<div class="function-module-content">',
        '<div class="function-module-sub-section">',
        '<label class="function-module-sub-section-caption">' + Resource.symbolicLibrary + '</label>',
        '<div class="mark-list" id="ParticleSystem-source-list">',
        '<div id="point-Fire-select" class="mark-list-item light-source-font-normal light-source-font-selected">',
        '<a class="iconfont icon-ICON_huoyan-shangchuan"></a>',
        '<label>' + Resource.Fire + '</label>',
        '</div>',
        '<div id="point-Fountain-select" class="mark-list-item light-source-font-normal">',
        '<a class="iconfont icon-ICON_penquan-shangchuan"></a>',
        '<label>' + Resource.Fountain + '</label>',
        '</div>',
        '</div>',
        '</div>',

        '<div id="toolbar" class="params-setting-container">',
        '<span class="fui-expand"></span>',
        '</div>',
        '<div class="params-setting">',
        '<table>',
        '<tbody>',
        '<tr>',
        '<td style="text-align:left;">数量</td>',
        '<td>',
        '<input type="range" min="0.0" max="1000.0" step="1" style="width: 140px;text-align:center;" id="emissionRate" value="200">',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="emissionRateValue" style=" float:right;" value="200">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">粒子大小</td>',
        '<td>',
        '<input type="range" id="particleSize" min="0" max="60.0" step="0.1" style="width: 140px;text-align:center;" value="2">',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="particleSizeValue" style=" float:right;" value="2">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">最小生命周期</td>',
        '<td>',
        '<input type="range" id="minimumParticleLife" min="0.1" max="30.0" step="1" style="width: 140px;text-align:center;" value="1.5">',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="minimumParticleLifeValue" style=" float:right;" value="1.5">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">最大生命周期</td>',
        '<td>',
        '<input type="range" id="maximumParticleLife" min="0.1" max="30.0" step="1" style="width: 140px;text-align:center;" value="1.8">',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="maximumParticleLifeValue" style=" float:right;" value="1.8">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">最小速度</td>',
        '<td>',
        '<input type="range" min="0.0" max="30.0" step="1" style="width: 140px;text-align:center;" id="minimumSpeed" value="7"> ',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="minimumSpeedValue" style=" float:right;" value="7">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">最大速度</td>',
        '<td>',
        '<input type="range" min="0.0" max="30.0" step="1" style="width: 140px;text-align:center;" id="maximumSpeed" value="9"> ',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="maximumSpeedValue" style=" float:right;" value="9">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">初始比例</td>',
        '<td>',
        '<input type="range" min="0.0" max="10.0" step="1" style="width: 140px;text-align:center;" id="startScale" value="3"> ',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="startScaleValue" style=" float:right;" value="3">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">终止比例</td>',
        '<td>',
        '<input type="range" min="0.0" max="10.0" step="1" style="width: 140px;text-align:center;"  id="endScale" value="1.5"> ',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="endScaleValue" style=" float:right;" value="1.5">',
        '</td>',
        '</tr>',

        '<tr>',
        '<td style="text-align:left;">重力</td>',
        '<td>',
        '<input type="range" min="-10.0" max="10.0" step="1" style="width: 140px;text-align:center;"   id="gravity" value="0"> ',
        '</td>',
        '<td>',
        '<input type="text" size="2" id="gravityValue" style=" float:right;" value="0">',
        '</td>',
        '</tr>',


        '<tr>',
        '<td style="text-align:left;">发射类型</td>',
        '<td>',
        '<select  id="particleSystemType">',
        '<option value="圆形放射">圆形放射</option>',
        '<option value="球体放射">球体放射</option>',
        '<option value="圆锥体放射" selected>圆锥体放射</option>',
        '<option value="盒状放射">盒状放射</option>',
        '</select>',
        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',

        '</div>',
        '</div>',

        '<div>',
        '<button type="button" id="clear-ParticleSystem-source" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
        '<button type="button" id="add-ParticleSystem-source" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.Add + '</button>',
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
            'click #clear-light-source': 'clearLightSource',
            'click #clear-ParticleSystem-source': 'clearParticleSystemSource'
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

            // var promise = scene.open('http://www.supermapol.com/realspace/services/3D-OlympicGreenNight/rest/realspace');
            // Cesium.when(promise, function (layer) {
            //     //设置相机位置，定位至火炬模型
            //     scene.camera.setView({
            //         destination: new Cesium.Cartesian3(-2172452.746832496, 4377356.868615968, 4099136.06237212),
            //         orientation: {
            //             heading: 5.054900943887144,
            //             pitch: -0.4649655279451754,
            //             roll: 6.283185307179446
            //         }
            //     });
            // });


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
                        // if ($("#shadowType") && ($("#shadowType").val() === 'noShadow')) {
                        //     $("#shadowType").val('allShadow');
                        // }
                    } else {
                        for (var layer of layers) {
                            layer.shadowType = 0;
                        }
                        // if ($("#shadowType") && ($("#shadowType").val() !== 'noShadow')) {
                        //     $("#shadowType").val('noShadow');
                        // }
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
                $("#timeline").on("input propertychange", function () {
                    var isTimelineShow = $(this).prop('checked');
                    if (isTimelineShow) {
                        $("#baselayer-source").addClass('baselayer-source-adjust');
                        viewer.timeline.container.style.visibility = 'visible';
                    } else {
                        $("#baselayer-source").removeClass('baselayer-source-adjust');
                        viewer.timeline.container.style.visibility = 'hidden';
                    }
                });
                $("#icon").click(function (evt) {
                    if (icon) {
                        $(".cesium-viewer-bottom").hide();
                        icon = false;
                    } else if (!icon) {
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
                    } else if (value === "3D") {
                        viewer.scene.mode = Cesium.SceneMode.SCENE3D;
                    } else if (value === "columbusView") {
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

                $('#point-light').click(function () {
                    $('#light-source-list > .mark-list-item').removeClass('light-source-font-selected');
                    $(this).addClass('light-source-font-selected');

                    $('#point-light-params').css('display', 'block');
                    $('#spot-light-params').css('display', 'none');
                    $('#directional-light-params').css('display', 'none');

                    lightSourceType = 0;
                });

                $('#spot-light').click(function () {
                    $('#light-source-list > .mark-list-item').removeClass('light-source-font-selected');
                    $(this).addClass('light-source-font-selected');

                    $('#point-light-params').css('display', 'none');
                    $('#spot-light-params').css('display', 'block');
                    $('#directional-light-params').css('display', 'none');

                    lightSourceType = 1;
                });

                $('#directional-light').click(function () {
                    $('#light-source-list > .mark-list-item').removeClass('light-source-font-selected');
                    $(this).addClass('light-source-font-selected');

                    $('#point-light-params').css('display', 'none');
                    $('#spot-light-params').css('display', 'none');
                    $('#directional-light-params').css('display', 'block');

                    lightSourceType = 2;
                });

                //取色器
                $('#point-light-color').spectrum({
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function (clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                            entityPointLightPairs.get(viewer.selectedEntity).color = color;
                        }
                    }
                });
                $('#point-light-cutoff-distance').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                        entityPointLightPairs.get(viewer.selectedEntity).cutoffDistance = Number($(this).val());
                    }
                });
                $('#point-light-decay').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('point-light') === 0) {
                        entityPointLightPairs.get(viewer.selectedEntity).decay = Number($(this).val());
                    }
                });
                $('#point-light-intensity').on('input propertychange', function () {
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
                    change: function (clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                            entitySpotLightPairs.get(viewer.selectedEntity).color = color;
                        }
                    }
                });

                $('#spot-light-cutoff-distance').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                        entitySpotLightPairs.get(viewer.selectedEntity).distance = Number($(this).val());
                    }
                });

                $('#spot-light-decay').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                        entitySpotLightPairs.get(viewer.selectedEntity).decay = Number($(this).val());
                    }
                });

                $('#spot-light-intensity').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('spot-light') === 0) {
                        entitySpotLightPairs.get(viewer.selectedEntity).intensity = Number($(this).val());
                    }
                });

                $('#spot-light-angle').on('input propertychange', function () {
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
                    change: function (clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('directional-light') === 0) {
                            entityDirectionalLightPairs.get(viewer.selectedEntity).color = color;
                        }
                    }
                });

                $('#directional-light-intensity').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('directional-light') === 0) {
                        entityDirectionalLightPairs.get(viewer.selectedEntity).intensity = Number($(this).val());
                    }
                });

                //光源 添加  按钮
                $('#add-light-source').click(function () {
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


                viewer.selectedEntityChanged.addEventListener(function (entity) {
                    var entityID = entity.collection._textureAtlasGUID;
                    var p = viewer.selectedEntity;
                    console.log(entityID);
                    console.log(p);
                });

                //特效相关
                $('#point-Fire-select').click(function () {
                    $('#ParticleSystem-source-list > .mark-list-item').removeClass('light-source-font-selected');
                    $(this).addClass('light-source-font-selected');

                    ParticleSystemSourceType = 0;

                    //默认参数
                    $("#emissionRate").val(viewModelFire.emissionRate);
                    $("#emissionRateValue").val(viewModelFire.emissionRate);
                    $("#particleSize").val(viewModelFire.particleSize);
                    $("#particleSizeValue").val(viewModelFire.particleSize);
                    $("#minimumParticleLife").val(viewModelFire.minimumParticleLife);
                    $("#minimumParticleLifeValue").val(viewModelFire.minimumParticleLife);
                    $("#maximumParticleLife").val(viewModelFire.maximumParticleLife);
                    $("#maximumParticleLifeValue").val(viewModelFire.maximumParticleLife);
                    $("#minimumSpeed").val(viewModelFire.minimumSpeed);
                    $("#minimumSpeedValue").val(viewModelFire.minimumSpeed);
                    $("#maximumSpeed").val(viewModelFire.maximumSpeed);
                    $("#maximumSpeedValue").val(viewModelFire.maximumSpeed);
                    $("#startScale").val(viewModelFire.startScale);
                    $("#startScaleValue").val(viewModelFire.startScale);
                    $("#endScale").val(viewModelFire.endScale);
                    $("#endScaleValue").val(viewModelFire.endScale);
                    $("#gravity").val(viewModelFire.gravity);
                    $("#gravityValue").val(viewModelFire.gravity);
                    console.log($("#particleSystemType").find("option:contains('圆锥体放射')"));
                    $("#particleSystemType").find("option:contains('放射')").attr("selected", false);
                    $("#particleSystemType").find("option:contains('圆锥体放射')").attr("selected", true);

                });

                $('#point-Fountain-select').click(function () {
                    $('#ParticleSystem-source-list > .mark-list-item').removeClass('light-source-font-selected');
                    $(this).addClass('light-source-font-selected');

                    ParticleSystemSourceType = 1;

                    //默认参数
                    $("#emissionRate").val(viewModelFountain.emissionRate);
                    $("#emissionRateValue").val(viewModelFountain.emissionRate);
                    $("#particleSize").val(viewModelFountain.particleSize);
                    $("#particleSizeValue").val(viewModelFountain.particleSize);
                    $("#minimumParticleLife").val(viewModelFountain.minimumParticleLife);
                    $("#minimumParticleLifeValue").val(viewModelFountain.minimumParticleLife);
                    $("#maximumParticleLife").val(viewModelFountain.maximumParticleLife);
                    $("#maximumParticleLifeValue").val(viewModelFountain.maximumParticleLife);
                    $("#minimumSpeed").val(viewModelFountain.minimumSpeed);
                    $("#minimumSpeedValue").val(viewModelFountain.minimumSpeed);
                    $("#maximumSpeed").val(viewModelFountain.maximumSpeed);
                    $("#maximumSpeedValue").val(viewModelFountain.maximumSpeed);
                    $("#startScale").val(viewModelFountain.startScale);
                    $("#startScaleValue").val(viewModelFountain.startScale);
                    $("#endScale").val(viewModelFountain.endScale);
                    $("#endScaleValue").val(viewModelFountain.endScale);
                    $("#gravity").val(viewModelFountain.gravity);
                    $("#gravityValue").val(viewModelFountain.gravity);


                    $("#particleSystemType").find("option:contains('放射')").attr("selected", false);
                    // $("#particleSystemType option:first").prop("selected", 'selected');
                    // $("#particleSystemType").find("option:contains('圆形放射')").attr("selected",true);

                });

                //特效调节
                $('#add-ParticleSystem-source').click(function () {
                    if (!isPCBroswer) {
                        me.$el.hide();
                    }
                    if (!pointParticleSystemDrawHandler) {
                        initParticleSystemDrawHandler();
                    }
                    pointParticleSystemDrawHandler.activate();
                });


                //粒子参数编辑
                $("#emissionRate").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#emissionRateValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.emissionRate = parseFloat(newValue);
                        }
                    }
                });

                $("#particleSize").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#particleSizeValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            var particleSize = parseFloat(newValue);
                            particleSystem.minimumImageSize.x = particleSize;
                            particleSystem.minimumImageSize.y = particleSize;
                            particleSystem.maximumImageSize.x = particleSize;
                            particleSystem.maximumImageSize.y = particleSize;
                        }
                    }
                });

                $("#minimumParticleLife").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#minimumParticleLifeValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.minimumParticleLife = parseFloat(newValue);
                        }
                    }
                });

                $("#maximumParticleLife").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#maximumParticleLifeValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.maximumParticleLife = parseFloat(newValue);
                        }
                    }
                });


                $("#minimumSpeed").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#minimumSpeedValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.minimumSpeed = parseFloat(newValue);
                        }
                    }
                });

                $("#maximumSpeed").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#maximumSpeedValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.maximumSpeed = parseFloat(newValue);
                        }
                    }
                });

                $("#startScale").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#startScaleValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.startScale = parseFloat(newValue);
                        }
                    }
                });

                $("#endScale").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#endScaleValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            particleSystem.endScale = parseFloat(newValue);
                        }
                    }
                });

                $("#gravity").on('input propertychange', function () {
                    var newValue = $(this).val();
                    $("#gravityValue").val(newValue);
                    if (selectedParticleSystem) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            //更新重力，待完成
                        }
                    }
                });


                $("#particleSystemType").change(function () {
                    if (viewer.selectedEntity) {
                        var particleSystem = selectedParticleSystem;
                        if (particleSystem) {
                            var newValue = $(this).val();
                            switch (newValue) {
                                case "圆形放射":
                                    particleSystem.emitter = new Cesium.CircleEmitter(2.0);
                                    break;
                                case "球体放射":
                                    particleSystem.emitter = new Cesium.SphereEmitter(2.5);
                                    break;
                                case "圆锥体放射":
                                    particleSystem.emitter = new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0));
                                    break;
                                case "盒状放射":
                                    particleSystem.emitter = new Cesium.BoxEmitter(new Cesium.Cartesian3(10.0, 10.0, 10.0));
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                });
            });

            //火焰粒子特效
            viewModelFire = {
                emissionRate: 200.0,
                gravity: 0.0,
                minimumParticleLife: 1.5,
                maximumParticleLife: 1.8,
                minimumSpeed: 7.0,
                maximumSpeed: 9.0,
                startScale: 3.0,
                endScale: 1.5,
                particleSize: 2,
            };

            //喷泉粒子特效
            viewModelFountain = {
                emissionRate: 20.0,
                gravity: -3.5,
                minimumParticleLife: 6,
                maximumParticleLife: 7,
                minimumSpeed: 9,
                maximumSpeed: 9.5,
                startScale: 1,
                endScale: 15,
                particleSize: 1,
            };

            //获取选中的粒子
            viewer.selectedEntityChanged.addEventListener(function (selectedEntity) {
                var entityID = selectedEntity.collection._textureAtlasGUID;
                if (entityParticleSystemPairs) {
                    for (let key of entityParticleSystemPairs.keys()) {
                        var particleSystem = entityParticleSystemPairs.get(key);
                        if (particleSystem) {
                            if (particleSystem._billboardCollection._textureAtlasGUID == entityID) {
                                selectedParticleSystem = particleSystem;

                                //默认参数
                                $("#emissionRate").val(selectedParticleSystem.emissionRate);
                                $("#emissionRateValue").val(viewModelFire.emissionRate);
                                $("#particleSize").val(viewModelFire.particleSize);
                                $("#particleSizeValue").val(viewModelFire.particleSize);
                                $("#minimumParticleLife").val(viewModelFire.minimumParticleLife);
                                $("#minimumParticleLifeValue").val(viewModelFire.minimumParticleLife);
                                $("#maximumParticleLife").val(viewModelFire.maximumParticleLife);
                                $("#maximumParticleLifeValue").val(viewModelFire.maximumParticleLife);
                                $("#minimumSpeed").val(viewModelFire.minimumSpeed);
                                $("#minimumSpeedValue").val(viewModelFire.minimumSpeed);
                                $("#maximumSpeed").val(viewModelFire.maximumSpeed);
                                $("#maximumSpeedValue").val(viewModelFire.maximumSpeed);
                                $("#startScale").val(viewModelFire.startScale);
                                $("#startScaleValue").val(viewModelFire.startScale);
                                $("#endScale").val(viewModelFire.endScale);
                                $("#endScaleValue").val(viewModelFire.endScale);
                                $("#gravity").val(viewModelFire.gravity);
                                $("#gravityValue").val(viewModelFire.gravity);

                                break;
                            }
                        }
                    }
                }
            });


            viewer.scene.preUpdate.addEventListener(function (scene, time) {
                //循循环数组
                if (entityParticleSystemPairs) {
                    for (let key of entityParticleSystemPairs.keys()) {
                        var particleSystem = entityParticleSystemPairs.get(key);
                        if (particleSystem) {
                            particleSystem.modelMatrix = computeModelMatrix(key, time);
                            // Account for any changes to the emitter model matrix.
                            // particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
                        }
                    }
                }
            });

            function computeModelMatrix(entity, time) {
                return entity.computeModelMatrix(time, new Cesium.Matrix4());
            }

            var emitterModelMatrix = new Cesium.Matrix4();
            var translation = new Cesium.Cartesian3();
            var rotation = new Cesium.Quaternion();
            var hpr = new Cesium.HeadingPitchRoll();
            var trs = new Cesium.TranslationRotationScale();

            //改变粒子系统的位置
            function computeEmitterModelMatrix() {
                hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
                trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0.5, translation);
                trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
                return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
            }

        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk: function (evt) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else {
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
        onQueryCoordinatesClearClk: function () {
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
                            disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
                        }
                    });
                    camera.stopFlyCircle(); // 先停止之前的旋转，再开始新的旋转
                    camera.flyCircle(flyCirclePoint);
                    flyCircleDrawHandler.clear();
                });
            }
            flyCircleDrawHandler.activate();
        },
        onCancelSpinClk: function () {
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
        clearLightSource: function () {
            while (scene.lightSource.pointLight.values.length > 0) {
                scene.removeLightSource(scene.lightSource.pointLight.values[0]);
            }
            while (scene.lightSource.spotLight.values.length > 0) {
                scene.removeLightSource(scene.lightSource.spotLight.values[0]);
            }
            while (scene.lightSource.directionalLight.values.length > 0) {
                scene.removeLightSource(scene.lightSource.directionalLight.values[0]);
            }
            for (let key of entityPointLightPairs.keys()) {
                viewer.entities.remove(key);
            }
            entityPointLightPairs.clear();
            for (let key of entitySpotLightPairs.keys()) {
                viewer.entities.remove(key);
            }
            entitySpotLightPairs.clear();
            for (let key of entityDirectionalLightPairs.keys()) {
                viewer.entities.remove(key);
            }
            entityDirectionalLightPairs.clear();
        },
        clearParticleSystemSource: function () {
            for (let key of entityParticleSystemPairs.keys()) {
                viewer.entities.remove(key);
                var particleSystem = entityParticleSystemPairs.get(key);
                scene._primitives.remove(particleSystem);
            }
            entityParticleSystemPairs.clear();
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
                    disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
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
            if (lightSourceType === 1) {
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
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
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
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 关闭深度检测，使billboard不至于被裁剪
                    }
                });
                entityDirectionalLightPairs.set(entityAsKey, directionalLight);
            }
            spotOrDirectionalLightPositions = [];
            spotOrDirectionalLightSourceDrawHandler.clear();
        });

        spotOrDirectionalLightSourceCountHandler.setInputAction(function (e) {
            if (spotOrDirectionalLightSourceAdding) {
                spotOrDirectionalLightPositions.push(scene.pickPosition(e.position));
                if (spotOrDirectionalLightPositions.length === 2) {
                    spotOrDirectionalLightSourceDrawHandler.deactivate();
                    spotOrDirectionalLightSourceAdding = false;
                    spotOrDirectionalLightSourceDrawHandler.drawEvt.raiseEvent(spotOrDirectionalLightPositions);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    function initParticleSystemDrawHandler() {
        pointParticleSystemDrawHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
        pointParticleSystemDrawHandler.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            } else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        pointParticleSystemDrawHandler.drawEvt.addEventListener(function (result) {
            var cartesian = result.object.position;

            var entityFire;
            var entityFountain;

            var imageurl;
            switch (ParticleSystemSourceType) {
                case 0:
                    entityFire = viewer.entities.add({
                        id: 'Particle-System-' + (new Date()).getTime(),
                        // position: cartesian,
                        position: new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z + 5),
                    });


                    imageurl = './images/ParticleSystem/fire.png';
                    var particleSystemFire = scene.primitives.add(new Cesium.ParticleSystem({
                        image: imageurl,
                        startColor: new Cesium.Color(1, 1, 1, 1),
                        endColor: new Cesium.Color(1, 0, 0, 0),
                        startScale: viewModelFire.startScale,
                        endScale: viewModelFire.endScale,
                        minimumParticleLife: viewModelFire.minimumParticleLife,
                        maximumParticleLife: viewModelFire.maximumParticleLife,
                        minimumSpeed: viewModelFire.minimumSpeed,
                        maximumSpeed: viewModelFire.maximumSpeed,
                        imageSize: new Cesium.Cartesian2(viewModelFire.particleSize, viewModelFire.particleSize),
                        emissionRate: viewModelFire.emissionRate,
                        lifetime: 6.0,
                        //循环是否开启
                        loop: true,
                        emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
                        // emitterModelMatrix: computeEmitterModelMatrix(),
                        updateCallback: applyGravityFire,
                        sizeInMeters: true,
                        performance: false,
                    }));
                    entityParticleSystemPairs.set(entityFire, particleSystemFire);
                    break;
                case 1:
                    entityFountain = viewer.entities.add({
                        id: 'Particle-System2-' + (new Date()).getTime(),
                        // position: cartesian,
                        position: new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z + 5),
                    });

                    imageurl = './images/ParticleSystem/fountain.png';
                    var particleSystemFountain = scene.primitives.add(new Cesium.ParticleSystem({
                        image: imageurl,
                        startColor: new Cesium.Color(1, 1, 1, 0.6),
                        endColor: new Cesium.Color(0.80, 0.86, 1, 0.4),
                        startScale: viewModelFountain.startScale,
                        endScale: viewModelFountain.endScale,
                        minimumParticleLife: viewModelFountain.minimumParticleLife,
                        maximumParticleLife: viewModelFountain.maximumParticleLife,
                        minimumSpeed: viewModelFountain.minimumSpeed,
                        maximumSpeed: viewModelFountain.maximumSpeed,
                        imageSize: new Cesium.Cartesian2(viewModelFountain.particleSize, viewModelFountain.particleSize),
                        emissionRate: viewModelFountain.emissionRate,
                        lifetime: 16.0,
                        //粒子发射器
                        emitter: new Cesium.CircleEmitter(0.2),
                        // emitterModelMatrix: computeEmitterModelMatrix(),
                        updateCallback: applyGravityFountain,
                        sizeInMeters: true,
                        performance: false,
                    }));
                    entityParticleSystemPairs.set(entityFountain, particleSystemFountain);
                    break;
            }

            var gravityScratchFire = new Cesium.Cartesian3();

            function applyGravityFire(p, dt) {
                // We need to compute a local up vector for each particle in geocentric space.
                var position = p.position;
                Cesium.Cartesian3.normalize(position, gravityScratchFire);
                Cesium.Cartesian3.multiplyByScalar(gravityScratchFire, viewModelFire.gravity * dt, gravityScratchFire);
                p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratchFire, p.velocity);

                // if (selectedParticleSystem){
                //     var pp = selectedParticleSystem;
                //     Cesium.Cartesian3.normalize(selectedParticleSystem.position, gravityScratchFire);
                //     Cesium.Cartesian3.multiplyByScalar(gravityScratchFire, viewModelFire.gravity * dt, gravityScratchFire);
                //     selectedParticleSystem.velocity = Cesium.Cartesian3.add(pp.velocity, gravityScratchFire, pp.velocity);
                // }
            };

            var gravityScratchFountain = new Cesium.Cartesian3();

            function applyGravityFountain(p, dt) {
                // We need to compute a local up vector for each particle in geocentric space.
                var position = p.position;
                Cesium.Cartesian3.normalize(position, gravityScratchFountain);
                Cesium.Cartesian3.multiplyByScalar(gravityScratchFountain, viewModelFountain.gravity * dt, gravityScratchFountain);
                p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratchFountain, p.velocity);

                // if (selectedParticleSystem){
                //     var pp = selectedParticleSystem;
                //     Cesium.Cartesian3.normalize(selectedParticleSystem.position, gravityScratchFountain);
                //     Cesium.Cartesian3.multiplyByScalar(gravityScratchFountain, viewModelFountain.gravity * dt, gravityScratchFountain);
                //     selectedParticleSystem.velocity = Cesium.Cartesian3.add(pp.velocity, gravityScratchFountain, pp.velocity);
                // }
            };

            pointParticleSystemDrawHandler.clear();
        });
    }


    return sceneAttribute;
});
