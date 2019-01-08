define(['./Container',
    'Cesium',
    'spectrum'
], function (Container,
             Cesium) {
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var s3mInstanceColc;
    var defaultUrl;
    var handlerPoint;
    var isPCBroswer;
    var me;
    var polygonSymbolDrawHandler = null;
    var polygonSymbolType = 0;
    var htmlStr = [
        '<main class="mainView">',
        '<button aria-label="Close" id="closeScene" class="myModal-close"><span aria-hidden="true">&times;</span></button>',
        '<input id="objectTab1" type="radio" name="objectTab" checked>',
        '<label for="objectTab1" id ="objectLabel1" class="function-module-caption">' + Resource.AddPoint + '</label>',
        '<input id="objectTab2" type="radio" name="objectTab">',
        '<label for="objectTab2" id ="objectLabel2" class="function-module-caption">' + Resource.AddLine + '</label>',
        '<input id="objectTab3" type="radio" name="objectTab" >',
        '<label for="objectTab3" id ="objectLabel3" class="function-module-caption">' + Resource.AddFaces + '</label>',
        '<section id="objectContent1">',
        '<div class="function-module-content">',
            '<div class="function-module-sub-section">',
                '<label class="function-module-sub-section-caption">' + Resource.symbolicLibrary + '</label>',
                '<div id="icons" class="mark-list"></div>',
            '</div>',
            '<div class="function-module-sub-section">',
                '<label class="function-module-sub-section-caption">' + Resource.colorPicker + '</label>',
                '<input class="colorPicker" size="8" data-bind="value: material," id="colorPicker">',
            '</div>',
            '<div>',
                '<label class="function-module-sub-section-caption">' + Resource.conversion + '</label>',
                '<div class="function-module-sub-indent-section">',
                    '<label id="markerX" class="function-module-sub-section-caption-indent">' + Resource.Xrotation + '</label>',
                    '<input id="pitch" class="input" type="number" min="0" max="360" step="1.0" value="0" title="pitch"/>',
                '</div>',
                '<div class="function-module-sub-indent-section">',
                    '<label id="markerY" class="function-module-sub-section-caption-indent">' + Resource.Yrotation + '</label>',
                    '<input id="roll" class="input" type="number" min="0" max="360" step="1.0" value="0" title="roll"/>',
                '</div>',
                '<div class="function-module-sub-indent-section">',
                    '<label id="markerZ" class="function-module-sub-section-caption-indent">' + Resource.Zrotation + '</label>',
                    '<input id="heading" class="input" type="number" min="0" max="360" step="1.0" value="0" title="heading"/>',
                '</div>',
                '<div>',
                    '<label id="markerR" class="function-module-sub-section-caption-indent">' + Resource.zoom + '</label>',
                    '<input type="number" id="scale" class="input" step="0.1" min="0.1" value="1" title="模型缩放比例"/>',
                '</div>',
            '</div>',
        '</div>',
        '<button type="button" id="del1" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
        '</section>',
        '<section id="objectContent2">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.symbolicLibrary + '</label>',
                    '<div class="mark-list">',
                        '<div id="fullLine" class="mark-list-item"><a class="iconfont icon-online-edit_full-line"></a><label>' + Resource.fulline + '</label></div>',
                        '<div id="dottedLine" class="mark-list-item"><a class="iconfont icon-online-edit_dotted-line"></a><label>' + Resource.Virtuallinear + '</label></div>',
                        '<div id="outline" class="mark-list-item"><a class="iconfont icon-online-edit_contour-line"></a><label>' + Resource.contourline + '</label></div>',
                        '<div id="arrowLine" class="mark-list-item"><a class="iconfont icon-online-edit_arrow-line"></a><label>' + Resource.arrowline + '</label></div>',
                        '<div id="glowLine" class="mark-list-item"><a class="iconfont icon-online-edit_halo-line"></a><label>' + Resource.Haloline + '</label></div>',
                        '<div id="TrailLine" class="mark-list-item"><a class="iconfont icon-online-edit_wake-line"></a><label>' + Resource.Wakeline + '</label></div>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">' + Resource.lineWidth + '</label>',
                        '<input id="lineWidth" class="input" type="number" value="5.0" min="0.1" step="0.1" style="height: 30px;">',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">' + Resource.LineColor + '</label>',
                        '<input class="colorPicker" id="lineColor"/>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">' + Resource.outlineWidth + '</label>',
                        '<input id="outline-width" class="input" type="number" value="1.0" min="0.1" step="0.1" style="height: 30px;">',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">' + Resource.outlineColor + '</label>',
                        '<input class="colorPicker" id="outlineColor"/>',
                    '</div>',
                '</div>',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.polylineDashSectionLength + '</label>',
                    '<input id="polyline-dash-section-length" class="input" type="number" min="1"  step="1.0" value="16.0" style="width:95%;">',
                '</div>',
                '<div style="overflow: auto;">',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">' + Resource.polylineTrailPeriod + '</label>',
                        '<input id="polyline-trail-period" class="input" type="number" min="1"  step="1.0" value="2">',
                    '</div>',
                    '<div class="half">',
                        '<label class="function-module-sub-section-caption">' + Resource.polylineTrailPercent + '</label>',
                        '<input id="polyline-trail-percent" class="input" type="number" min="0.1" max="1" step="0.1" value="0.3">',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" id="delAllLine" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
        '</section>',
        '<section id="objectContent3">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.symbolicLibrary + '</label>',
                    '<div class="mark-list width-adjust" id="polygon-symbol-list">',
                        '<div id="pureColor" class="mark-list-item polygon-symbol-font-normal polygon-symbol-font-selected"><a class="iconfont icon-online-edit_pure-color-plane"></a><label>' + Resource.pureColor + '</label></div>',
                        '<div id="gridding" class="mark-list-item polygon-symbol-font-normal"><a class="iconfont icon-online-edit_gridview-plane"></a><label>' + Resource.gridding + '</label></div>',
                        '<div id="stripe" class="mark-list-item polygon-symbol-font-normal"><a class="iconfont icon-online-edit_stripe-plane"></a><label>' + Resource.stripe + '</label></div>',
                    '</div>',
                '</div>',
                '<div id="polygon-symbol-common-params">',
                    '<div>',
                        '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolColor + '</label>',
                        '<input type="text" class="colorPicker width-adjust" id="polygon-symbol-color"/>',
                    '</div>',
                '</div>',
                '<div id="polygon-symbol-grid-params" style="display: none;">',
                    '<div class="function-module-sub-section" style="margin-top: 18px;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolGridCellAlpha + '</label>',
                            '<input type="number" class="input" id="polygon-symbol-grid-cell-alpha" value="0.1" min="0.1" max="1" step="0.1"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolGridLineCount + '</label>',
                            '<input type="number" class="input" id="polygon-symbol-grid-line-count" value="8" min="2"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolGridLineThickness + '</label>',
                            '<input type="number" class="input" id="polygon-symbol-grid-line-thickness" value="1" min="1"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolGridLineOffset + '</label>',
                            '<input type="number" class="input" id="polygon-symbol-grid-line-offset" value="0"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="polygon-symbol-stripe-params" style="display: none;">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolStripeEvenColor + '</label>',
                            '<input type="text" class="colorPicker" id="polygon-symbol-stripe-even-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolStripeOddColor + '</label>',
                            '<input type="text" class="colorPicker" id="polygon-symbol-stripe-odd-color"/>',
                        '</div>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolStripeRepeat + '</label>',
                            '<input type="number" class="input" id="polygon-symbol-stripe-repeat" value="12" min="1"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolStripeOffset + '</label>',
                            '<input type="number" class="input" id="polygon-symbol-stripe-offset" value="0"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolStripeOrientation + '</label>',
                            '<select id="polygon-symbol-stripe-orientation" class="input">',
                                '<option selected value='+ Cesium.StripeOrientation.HORIZONTAL +'>' + Resource.horizontal + '</optionselected>',
                                '<option value=' + Cesium.StripeOrientation.VERTICAL + '>' + Resource.vertical + '</option>',
                            '</select>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" id="delAllPolygon" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
            '<button type="button" id="draw-polygon-symbol" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.draw + '</button>',
        '</section>',
        '</main>',
    ].join('');
    var markerForm = Container.extend({
        tagName: 'div',
        id: 'marker-form',
        events: {
            'click #closeScene': 'onCloseSceneClk',
        },
        template: _.template(htmlStr),
        initialize: function (options) {
            viewer = options.sceneModel.viewer;
            viewer.infobox = false;
            var scene = viewer.scene;
            isPCBroswer = options.isPCBroswer;
            me = this;
            handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
            s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
            scene.primitives.add(s3mInstanceColc);
            this.render();
            this.on('componentAdded', function (parent) {
                $('main').each(function (index) {
                    $(this).myDrag({
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
                });
                $("#colorPicker").spectrum({
                    color: "2EC5AD",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity) {
                            var instance = viewer.selectedEntity.primitive;
                            var index = viewer.selectedEntity.id;
                            instance.updateColor(color, index);
                        }
                    }
                });
                $("#lineColor").spectrum({
                    color: "b6d7a8",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm
                });
                $("#outlineColor").spectrum({
                    color: "5d6d56",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm
                });

                $("#pitch,#roll,#heading").on("input propertychange", updatePointMarkerRotation);
                $("#pitch,#roll,#heading").on("blur", function () {
                    if ($.trim(this.value) === "") {
                        $(this).val("0");
                        updatePointMarkerRotation();
                    }
                });

                $("#scale").on("input propertychange", updatePointMarkerScale);
                $("#scale").blur(function () {
                    if ($.trim(this.value) === "") {
                        $(this).val("1");
                        updatePointMarkerScale();
                    }
                });
                $("#del1").on("click", function () {
                    if (viewer.selectedEntity) {
                        var instance = viewer.selectedEntity.primitive;
                        var index = viewer.selectedEntity.index;
                        instance.updateScale(new Cesium.Cartesian3(0, 0, 0), index);
                    }
                });
                $("#delAllLine").on("click", function () {
                    var entities = viewer.entities.values;
                    for (var i = 0; i < entities.length; i++) {
                        if (entities[i].polyline) {
                            entities[i].polyline.show = false;
                        }
                    }
                });
                $("#delAllPolygon").on("click", function () {
                    var entities = viewer.entities.values;
                    for (var i = 0; i < entities.length; i++) {
                        if (entities[i].polygon) {
                            entities[i].polygon.show = false;
                        }
                    }
                });
                $("#fullLine").on("click", function () {
                    createLineType(0, this);
                });
                $("#dottedLine").on("click", function () {
                    createLineType(1, this);
                });
                $("#outline").on("click", function () {
                    createLineType(2, this);
                });
                $("#arrowLine").on("click", function () {
                    createLineType(3, this);
                });
                $("#glowLine").on("click", function () {
                    createLineType(4, this);
                });
                $("#TrailLine").on("click", function () {
                    createLineType(5, this);
                });
                $("#lineWidth").blur(function () {
                    if ($.trim(this.value) === "") {
                        $(this).val("1.0");
                    }
                });
                $("#pureColor").on("click", function () {
                    $("#polygon-symbol-list > .mark-list-item").removeClass('polygon-symbol-font-selected');
                    $(this).addClass('polygon-symbol-font-selected');
                    $("#polygon-symbol-grid-params").css("display", "none");
                    $("#polygon-symbol-stripe-params").css("display", "none");
                    $("#polygon-symbol-common-params").css("display", "block");
                    createPolygonType(0);
                });
                $("#gridding").on("click", function () {
                    $("#polygon-symbol-list > .mark-list-item").removeClass('polygon-symbol-font-selected');
                    $(this).addClass('polygon-symbol-font-selected');
                    $("#polygon-symbol-stripe-params").css("display", "none");
                    $("#polygon-symbol-common-params").css("display", "block");
                    $("#polygon-symbol-grid-params").css("display", "block");
                    createPolygonType(1);
                });
                $("#stripe").on("click", function () {
                    $("#polygon-symbol-list > .mark-list-item").removeClass('polygon-symbol-font-selected');
                    $(this).addClass('polygon-symbol-font-selected');
                    $("#polygon-symbol-common-params").css("display", "none");
                    $("#polygon-symbol-grid-params").css("display", "none");
                    $("#polygon-symbol-stripe-params").css("display", "block");
                    createPolygonType(2);
                });

                $("#polygon-symbol-color").spectrum({
                    color: "#fff", // 默认颜色
                    showPalette: true, //用于存储过往选择的颜色
                    palette: palette,
                    showAlpha: true, // 支持透明度选择
                    chooseText: "选择",
                    cancelText: "取消",
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol') === 0) {
                            if (viewer.selectedEntity.id.indexOf('polygon-symbol-pure') === 0) { // 纯色
                                viewer.selectedEntity.polygon.material = color;
                            } else if (viewer.selectedEntity.id.indexOf('polygon-symbol-grid') === 0) { // 网格
                                viewer.selectedEntity.polygon.material.color = color;
                            }
                        }
                    }
                });
                $('#polygon-symbol-grid-cell-alpha').on('input propertychange', function() {
                    if ($(this).val() !== '' && Number($(this).val()) >= 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-grid') === 0) {
                            viewer.selectedEntity.polygon.material.cellAlpha = Number($(this).val());
                        }
                    }
                });
                $('#polygon-symbol-grid-line-count').on('input propertychange', function() {
                    if ($(this).val() !== '' && Number($(this).val()) >= 2) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-grid') === 0) {
                            viewer.selectedEntity.polygon.material.lineCount = new Cesium.Cartesian2(Number($(this).val()), Number($(this).val()));
                        }
                    }
                });
                $('#polygon-symbol-grid-line-thickness').on('input propertychange', function () {
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-grid') === 0) {
                            viewer.selectedEntity.polygon.material.lineThickness = new Cesium.Cartesian2(Number($(this).val()), Number($(this).val()));
                        }
                    }
                });
                $('#polygon-symbol-grid-line-offset').on('input propertychange', function() {
                    if ($(this).val() !== '') {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-grid') === 0) {
                            viewer.selectedEntity.polygon.material.lineOffset = new Cesium.Cartesian2(Number($(this).val()), Number($(this).val()));
                        }
                    }
                });
                $("#polygon-symbol-stripe-even-color").spectrum({
                    color: '#fff',
                    showPalette: true, //用于存储过往选择的颜色
                    palette: palette,
                    showAlpha: true, // 支持透明度选择
                    chooseText: "选择",
                    cancelText: "取消",
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-stripe') === 0) {
                            viewer.selectedEntity.polygon.material.evenColor = color;
                        }
                    }
                });
                $("#polygon-symbol-stripe-odd-color").spectrum({
                    color: '#000',
                    showPalette: true, //用于存储过往选择的颜色
                    palette: palette,
                    showAlpha: true, // 支持透明度选择
                    chooseText: "选择",
                    cancelText: "取消",
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-stripe') === 0) {
                            viewer.selectedEntity.polygon.material.oddColor = color;
                        }
                    }
                });
                $('#polygon-symbol-stripe-repeat').on('input propertychange', function() {
                    if ($(this).val() !== '' && Number($(this).val()) > 1) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-stripe') === 0) {
                            viewer.selectedEntity.polygon.material.repeat = Number($(this).val());
                        }
                    }
                });
                $('#polygon-symbol-stripe-offset').on('input propertychange', function() {
                    if ($(this).val() !== '') {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-stripe') === 0) {
                            viewer.selectedEntity.polygon.material.offset = Number($(this).val());
                        }
                    }
                });
                $('#polygon-symbol-stripe-orientation').on('input propertychange', function () {
                    if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-stripe') === 0) {
                        viewer.selectedEntity.polygon.material.orientation = Number($(this).val());
                    }
                });
                $("#draw-polygon-symbol").click(function() {
                    if (!isPCBroswer) {
                        me.$el.hide();
                    }
                    if (!polygonSymbolDrawHandler) {
                        initPolygonSymbolDrawHandler();
                    }
                    polygonSymbolDrawHandler.activate();
                });
            });

            Cesium.loadJson('data/models.json').then(function (data) {
                var result = data.s3mModels;
                for (var i = 0, j = result.length; i < j; i++) {
                    addItem(result[i]);
                }
            });

            handlerPoint.drawEvt.addEventListener(function (result) {
                handlerPoint.clear(); // 不显示绘制的点
                var point = result.object;
                s3mInstanceColc.add(defaultUrl, {
                    position: point.position,
                    hpr: new Cesium.HeadingPitchRoll(parseFloat($("#heading").val()), parseFloat($("#pitch").val()), parseFloat($("#roll").val())),
                    scale: new Cesium.Cartesian3(parseFloat($("#scale").val()), parseFloat($("#scale").val()), parseFloat($("#scale").val())),
                });
                handlerPoint && handlerPoint.deactivate();
            });
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
            this.$el.hide();
            return false;
        }
    });

    function addItem(data) {
        var str = '<div class="mark-list-item"><img title=' + data.name + ' src={thumbnail} id={name}></a>'.replace('{thumbnail}', data.thumbnail).replace('{name}', data.name);
        $('#icons').append(str);
        var $child = $("#" + data.name);
        $child.on('click', function () {
            if (!isPCBroswer) {
                me.$el.hide();
            }
            defaultUrl = data.path;
            if ($("img").hasClass("selected")) {
                $("img").removeClass("selected");
            } else {
                $(this).addClass("selected");
            }
            $("#heading").val(0);
            $("#pitch").val(0);
            $("#roll").val(0);
            $("#scale").val(1);
            handlerPoint.activate();
        });
    };
    function createLineType(type, line) {
        if (!isPCBroswer) {
            me.$el.hide();
        }
        if ($("a").hasClass("selected")) {
            $("a").removeClass("selected");
        }
        $(line).children("a").addClass("selected");

        var handlerLine = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
        handlerLine.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerLine.drawEvt.addEventListener(function (result) {
            handlerLine.polyline.show = false;
            var linecolor = Cesium.Color.fromCssColorString($("#lineColor").spectrum('get').toRgbString());
            var outlinecolor = Cesium.Color.fromCssColorString($("#outlineColor").spectrum('get').toRgbString());
            var lineWidth = parseFloat($("#lineWidth").val());
            var outlineWidth = parseFloat($("#outline-width").val());
            var dashSectionLength = parseFloat($("#polyline-dash-section-length").val());
            var polylineTrailPeriod = parseFloat($("#polyline-trail-period").val());
            var polylineTrailPercent = parseFloat($("#polyline-trail-percent").val());
            var array = [].concat(result.object.positions);
            var position = [];
            for (var i = 0, len = array.length; i < len; i++) {
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h = cartographic.height;
                if (position.indexOf(longitude) == -1 && position.indexOf(latitude) == -1) {
                    position.push(longitude);
                    position.push(latitude);
                    position.push(h);
                }
            }
            switch (type) {
                case 0:
                    viewer.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: lineWidth,
                            material: linecolor ? linecolor : Cesium.Color.YELLOW,
                        }
                    });
                    break;
                case 1:
                    viewer.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: lineWidth,
                            material: new Cesium.PolylineDashMaterialProperty({
                                dashLength: dashSectionLength,
                                color: linecolor ? linecolor : Cesium.Color.YELLOW,
                            })
                        }
                    });
                    break;
                case 2:
                    viewer.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: lineWidth,
                            material: new Cesium.PolylineOutlineMaterialProperty({
                                color: linecolor ? linecolor : Cesium.Color.YELLOW,
                                outlineWidth: outlineWidth,
                                outlineColor: outlinecolor ? outlinecolor : Cesium.Color.FIREBRICK,
                            })
                        }
                    });
                    break;
                case 3:
                    viewer.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: lineWidth * 2.0,
                            followSurface: false,
                            material: new Cesium.PolylineArrowMaterialProperty(linecolor ? linecolor : Cesium.Color.YELLOW)
                        }
                    });
                    break;
                case 4:
                    viewer.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: lineWidth * 2.0,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                glowPower: 0.25,
                                color: linecolor ? linecolor : Cesium.Color.YELLOW,
                            })
                        }
                    });
                    break;
                case 5:
                    viewer.entities.add({
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: lineWidth,
                            material: new Cesium.PolylineTrailMaterialProperty({
                                color: linecolor ? linecolor : Cesium.Color.YELLOW,
                                trailLength: polylineTrailPercent,
                                period: polylineTrailPeriod
                            })
                        }
                    });
                    break;
                default:
                    break;
            }
        });
        handlerLine.activate();
    }

    function initPolygonSymbolDrawHandler() {
        polygonSymbolDrawHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
        polygonSymbolDrawHandler.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            } else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        polygonSymbolDrawHandler.drawEvt.addEventListener(function (result) {
            polygonSymbolDrawHandler.polygon.show = false;
            polygonSymbolDrawHandler.polyline.show = false;
            var array = [].concat(result.object.positions);
            var position = [];
            for (var i = 0, len = array.length; i < len; i++) {
                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                var h = cartographic.height;
                if (position.indexOf(longitude) == -1 && position.indexOf(latitude) == -1) {
                    position.push(longitude);
                    position.push(latitude);
                    position.push(h);
                }
            }
            switch (polygonSymbolType) {
                case 0:
                    var polygonSymbolPureColor = Cesium.Color.fromCssColorString($("#polygon-symbol-color").spectrum('get').toRgbString());
                    viewer.entities.add({
                        id: 'polygon-symbol-pure-' + (new Date()).getTime(),
                        polygon: {
                            perPositionHeight: true,
                            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material: polygonSymbolPureColor
                        }
                    });
                    break;
                case 1:
                    var polygonSymbolGridColor = Cesium.Color.fromCssColorString($("#polygon-symbol-color").spectrum('get').toRgbString());
                    var polygonSymbolGridCellAlpha = Number($('#polygon-symbol-grid-cell-alpha').val());
                    var polygonSymbolGridLineCount = Number($('#polygon-symbol-grid-line-count').val());
                    var polygonSymbolGridLineThickness = Number($('#polygon-symbol-grid-line-thickness').val());
                    var polygonSymbolGridLineOffset = Number($('#polygon-symbol-grid-line-offset').val());
                    viewer.entities.add({
                        id: 'polygon-symbol-grid-' + (new Date()).getTime(),
                        polygon: {
                            perPositionHeight: true,
                            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material: new Cesium.GridMaterialProperty({
                                color: polygonSymbolGridColor,
                                cellAlpha: polygonSymbolGridCellAlpha,
                                lineCount: new Cesium.Cartesian2(polygonSymbolGridLineCount, polygonSymbolGridLineCount),
                                lineThickness: new Cesium.Cartesian2(polygonSymbolGridLineThickness, polygonSymbolGridLineThickness),
                                lineOffset: new Cesium.Cartesian2(polygonSymbolGridLineOffset, polygonSymbolGridLineOffset)
                            })
                        }
                    });
                    break;
                case 2:
                    var polygonSymbolStripeEvenColor = Cesium.Color.fromCssColorString($("#polygon-symbol-stripe-even-color").spectrum('get').toRgbString());
                    var polygonSymbolStripeOddColor = Cesium.Color.fromCssColorString($("#polygon-symbol-stripe-odd-color").spectrum('get').toRgbString());
                    var polygonSymbolStripeRepeat = Number($('#polygon-symbol-stripe-repeat').val());
                    var polygonSymbolStripeOffset = Number($('#polygon-symbol-stripe-offset').val());
                    var polygonSymbolStripeOrientation = Number($('#polygon-symbol-stripe-orientation').val());
                    viewer.entities.add({
                        id: 'polygon-symbol-stripe-' + (new Date()).getTime(),
                        polygon: {
                            perPositionHeight: true,
                            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            material: new Cesium.StripeMaterialProperty({
                                evenColor: polygonSymbolStripeEvenColor,
                                oddColor: polygonSymbolStripeOddColor,
                                repeat: polygonSymbolStripeRepeat,
                                offset: polygonSymbolStripeOffset,
                                orientation: polygonSymbolStripeOrientation
                            })
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }

    function createPolygonType(type) {
        polygonSymbolType = type;
    }

    function updatePointMarkerRotation() {
        if ($("#heading").val() === "" || $("#pitch").val() === "" || $("#roll").val() === "") {
            return;
        }
        var headingValue = Cesium.Math.toRadians($("#heading").val());
        var pitchValue = Cesium.Math.toRadians($("#pitch").val());
        var rollValue = Cesium.Math.toRadians($("#roll").val());
        if (viewer.selectedEntity) {
            var instance = viewer.selectedEntity.primitive;
            var index = viewer.selectedEntity.index;
            instance.updateRotation(new Cesium.HeadingPitchRoll(headingValue, pitchValue, rollValue), index);
        }
    }

    function updatePointMarkerScale() {
        if ($.trim($("#scale").val()) === "") {
            return;
        }
        var scale = Number($("#scale").val());
        if (viewer.selectedEntity) {
            var instance = viewer.selectedEntity.primitive;
            var index = viewer.selectedEntity.index;
            instance.updateScale(new Cesium.Cartesian3(scale, scale, scale), index);
        }
    }

    return markerForm;
});
