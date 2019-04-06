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
    var polylineSymbolDrawHandler = null;
    var polylineSymbolType = 0;
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
                '<label class="function-module-sub-section-caption">' + Resource.pointSymbolColor + '</label>',
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
                    '<div class="mark-list" id="polyline-symbol-list">',
                        '<div id="fullLine" class="mark-list-item polyline-symbol-font-normal polyline-symbol-font-selected"><a class="iconfont icon-online-edit_full-line"></a><label>' + Resource.fulline + '</label></div>',
                        '<div id="dottedLine" class="mark-list-item polyline-symbol-font-normal"><a class="iconfont icon-online-edit_dotted-line"></a><label>' + Resource.Virtuallinear + '</label></div>',
                        '<div id="outline" class="mark-list-item polyline-symbol-font-normal"><a class="iconfont icon-online-edit_contour-line"></a><label>' + Resource.contourline + '</label></div>',
                        '<div id="arrowLine" class="mark-list-item polyline-symbol-font-normal"><a class="iconfont icon-online-edit_arrow-line"></a><label>' + Resource.arrowline + '</label></div>',
                        '<div id="glowLine" class="mark-list-item polyline-symbol-font-normal"><a class="iconfont icon-online-edit_halo-line"></a><label>' + Resource.Haloline + '</label></div>',
                        '<div id="TrailLine" class="mark-list-item polyline-symbol-font-normal"><a class="iconfont icon-online-edit_wake-line"></a><label>' + Resource.Wakeline + '</label></div>',
                    '</div>',
                '</div>',
                '<div id="polyline-symbol-common-params">',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineColor + '</label>',
                            '<input class="colorPicker" id="polyline-symbol-line-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineWidth + '</label>',
                            '<input id="polyline-symbol-line-width" class="input" type="number" min="1" step="1.0" value="5" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="polyline-symbol-dash-params" style="display: none;">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineColor + '</label>',
                            '<input id="polyline-symbol-dash-color" class="colorPicker"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolGapColor + '</label>',
                            '<input id="polyline-symbol-gap-color" class="colorPicker"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineWidth + '</label>',
                            '<input id="polyline-symbol-dash-line-width" class="input" type="number" min="1" step="1.0" value="5"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineDashSectionLength + '</label>',
                            '<input id="polyline-dash-section-length" class="input" type="number" min="1"  step="1.0" value="16.0"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="polyline-symbol-outline-params" style="display:none;">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineColor + '</label>',
                            '<input class="colorPicker" id="polyline-symbol-outline-inner-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolOutlineColor + '</label>',
                            '<input class="colorPicker" id="polyline-symbol-outline-color"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineWidth + '</label>',
                            '<input id="polyline-symbol-outline-inner-width" class="input" type="number" min="1" step="1.0" value="5"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolOutlineWdith + '</label>',
                            '<input id="polyline-symbol-outline-width" class="input" type="number" value="2" min="1" step="1"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="polyline-symbol-arrow-params" style="display: none;">',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineColor + '</label>',
                            '<input class="colorPicker" id="polyline-symbol-arror-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineWidth + '</label>',
                            '<input id="polyline-symbol-arrow-width" class="input" type="number" min="1" step="1.0" value="5" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="polyline-symbol-glow-params" style="display: none;">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineColor + '</label>',
                            '<input class="colorPicker" id="polyline-symbol-glow-color"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineWidth + '</label>',
                            '<input id="polyline-symbol-glow-width" class="input" type="number" min="1" step="1" value="5" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolGlowPower + '</label>',
                            '<input id="polyline-symbol-glow-power" class="input" type="number" value="0.5" min="0.05" max="1" step="0.05"/>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div id="polyline-symbol-trail-params" style="display: none;">',
                    '<div class="function-module-sub-section">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineColor + '</label>',
                            '<input id="polyline-symbol-trail-line-color" class="colorPicker"/>',
                        '</div>',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineSymbolLineWidth + '</label>',
                            '<input id="polyline-symbol-trail-width" class="input" type="number" min="1" step="1" value="5" style="height: 29px;"/>',
                        '</div>',
                    '</div>',
                    '<div style="overflow: auto;">',
                        '<div class="half">',
                            '<label class="function-module-sub-section-caption">' + Resource.polylineTrailPercent + '</label>',
                            '<input id="polyline-trail-percent" class="input" type="number" min="0.1" max="1" step="0.1" value="0.3">',
                        '</div>',
                        '<div class="half" style="display:none;">', /* 调整闪烁缺陷 */
                            '<label class="function-module-sub-section-caption">' + Resource.polylineTrailPeriod + '</label>',
                            '<input id="polyline-trail-period" class="input" type="number" min="1"  step="1.0" value="2">',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" id="delAllLine" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
            '<button type="button" id="draw-polyline-symbol" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.draw + '</button>',
        '</section>',
        '<section id="objectContent3">',
            '<div class="function-module-content">',
                '<div class="function-module-sub-section">',
                    '<label class="function-module-sub-section-caption">' + Resource.symbolicLibrary + '</label>',
                    '<div class="mark-list" id="polygon-symbol-list">',
                        '<div id="pureColor" class="mark-list-item polygon-symbol-font-normal polygon-symbol-font-selected"><a class="iconfont icon-online-edit_pure-color-plane"></a><label>' + Resource.pureColor + '</label></div>',
                        '<div id="gridding" class="mark-list-item polygon-symbol-font-normal"><a class="iconfont icon-online-edit_gridview-plane"></a><label>' + Resource.gridding + '</label></div>',
                        '<div id="stripe" class="mark-list-item polygon-symbol-font-normal"><a class="iconfont icon-online-edit_stripe-plane"></a><label>' + Resource.stripe + '</label></div>',
                    '</div>',
                '</div>',
                '<div id="polygon-symbol-common-params">',
                    '<div>',
                        '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolColor + '</label>',
                        '<input type="text" class="colorPicker width-adjust" id="polygon-symbol-full-color"/>',
                    '</div>',
                '</div>',
                '<div id="polygon-symbol-grid-params" style="display: none;">',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.polygonSymbolColor + '</label>',
                        '<input type="text" class="colorPicker width-adjust" id="polygon-symbol-grid-color"/>',
                    '</div>',
                    '<div class="function-module-sub-section">',
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
                        '<div class="half" style="display: none;">', /* 该接口不起作用 */
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
                    color: "rgba(255, 255, 255, 1)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.primitive.type === 'Instanced_Object') {
                            var instance = viewer.selectedEntity.primitive;
                            var index = viewer.selectedEntity.id;
                            instance.updateColor(color, index);
                        }
                    }
                });
                $("#polyline-symbol-line-color").spectrum({ // 实线颜色
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-full') === 0) {
                            viewer.selectedEntity.polyline.material = color;
                        }
                    }
                });
                $('#polyline-symbol-line-width').on('input propertychange', function() { // 实线宽度
                   if ($(this).val() !== '' && Number($(this).val()) > 0) {
                       if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-full') === 0) {
                           viewer.selectedEntity.polyline.width = Number($(this).val());
                       }
                   }
                });

                $('#polyline-symbol-dash-color').spectrum({ // 虚线颜色
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-dash') === 0) {
                            viewer.selectedEntity.polyline.material.color = color;
                        }
                    }
                });

                $('#polyline-symbol-gap-color').spectrum({ // 虚线间隔颜色
                    color: "rgba(255, 255, 255, 0)",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-dash') === 0) {
                            viewer.selectedEntity.polyline.material.gapColor = color;
                        }
                    }
                });

                $('#polyline-symbol-dash-line-width').on('input propertychange', function() { // 虚线宽度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-dash') === 0) {
                            viewer.selectedEntity.polyline.width = Number($(this).val());
                        }
                    }
                });

                $('#polyline-dash-section-length').on('input propertychange', function() { // 虚线分量长度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-dash') === 0) {
                            viewer.selectedEntity.polyline.material.dashLength = Number($(this).val());
                        }
                    }
                });

                $('#polyline-symbol-outline-inner-color').spectrum({ // 轮廓线内层颜色
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-outline') === 0) {
                            viewer.selectedEntity.polyline.material.color = color;
                        }
                    }
                });

                $("#polyline-symbol-outline-color").spectrum({ // 轮廓线轮廓颜色
                    color: "3478bc",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-outline') === 0) {
                            viewer.selectedEntity.polyline.material.outlineColor = color;
                        }
                    }
                });

                $('#polyline-symbol-outline-inner-width').on('input propertychange', function() { // 轮廓线内层宽度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-outline') === 0) {
                            viewer.selectedEntity.polyline.width = Number($(this).val());
                        }
                    }
                });

                $('#polyline-symbol-outline-width').on('input propertychange', function() { // 轮廓线轮廓宽度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-outline') === 0) {
                            viewer.selectedEntity.polyline.material.outlineWidth = Number($(this).val());
                        }
                    }
                });

                $('#polyline-symbol-arror-color').spectrum({ // 箭头线颜色
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-arrow') === 0) {
                            viewer.selectedEntity.polyline.material.color = color;
                        }
                    }
                });

                $('#polyline-symbol-arrow-width').on('input propertychange', function() { // 箭头线宽度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-arrow') === 0) {
                            viewer.selectedEntity.polyline.width = Number($(this).val());
                        }
                    }
                });

                $('#polyline-symbol-glow-color').spectrum({ // 光晕线颜色
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-glow') === 0) {
                            viewer.selectedEntity.polyline.material.color = color;
                        }
                    }
                });

                $('#polyline-symbol-glow-width').on('input propertychange', function() { // 光晕线宽度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-glow') === 0) {
                            viewer.selectedEntity.polyline.width = Number($(this).val());
                        }
                    }
                });

                $('#polyline-symbol-glow-power').on('input propertychange', function() { // 光晕线强度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-glow') === 0) {
                            viewer.selectedEntity.polyline.material.glowPower = Number($(this).val());
                        }
                    }
                });

                $('#polyline-symbol-trail-line-color').spectrum({ // 尾迹线颜色
                    color: "cf9932",
                    showPalette: true,
                    showAlpha: true,
                    localStorageKey: "spectrum.demo",
                    palette: palette,
                    cancelText: Resource.cancel,
                    chooseText: Resource.confirm,
                    change: function(clr) {
                        var color = Cesium.Color.fromCssColorString(clr.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-trail') === 0) {
                            viewer.selectedEntity.polyline.material.color = color;
                        }
                    }
                });

                $('#polyline-symbol-trail-width').on('input propertychange', function() { // 尾迹线宽度
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-trail') === 0) {
                            viewer.selectedEntity.polyline.width = Number($(this).val());
                        }
                    }
                });

                $('#polyline-trail-percent').on('input propertychange', function() { // 尾迹占比
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-trail') === 0) {
                            viewer.selectedEntity.polyline.material.trailLength = Number($(this).val());
                        }
                    }
                });

                $('#polyline-trail-period').on('input propertychange', function() { // 尾迹周期
                    if ($(this).val() !== '' && Number($(this).val()) > 0) {
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polyline-symbol-trail') === 0) {
                            viewer.selectedEntity.polyline.material.period = Number($(this).val());
                        }
                    }
                });

                $("#draw-polyline-symbol").click(function() {
                    if (!isPCBroswer) {
                        me.$el.hide();
                    }
                    if (!polylineSymbolDrawHandler) {
                        initPolylineSymbolDrawHandler();
                    }
                    polylineSymbolDrawHandler.activate();
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
                    $('#polyline-symbol-list > .mark-list-item').removeClass('polyline-symbol-font-selected');
                    $(this).addClass('polyline-symbol-font-selected');

                    $('#polyline-symbol-common-params').css('display', 'block');
                    $('#polyline-symbol-dash-params').css('display', 'none');
                    $('#polyline-symbol-outline-params').css('display', 'none');
                    $('#polyline-symbol-arrow-params').css('display', 'none');
                    $('#polyline-symbol-glow-params').css('display', 'none');
                    $('#polyline-symbol-trail-params').css('display', 'none');

                    createLineType(0, this);
                });
                $("#dottedLine").on("click", function () {
                    $('#polyline-symbol-list > .mark-list-item').removeClass('polyline-symbol-font-selected');
                    $(this).addClass('polyline-symbol-font-selected');

                    $('#polyline-symbol-dash-params').css('display', 'block');
                    $('#polyline-symbol-common-params').css('display', 'none');
                    $('#polyline-symbol-outline-params').css('display', 'none');
                    $('#polyline-symbol-arrow-params').css('display', 'none');
                    $('#polyline-symbol-glow-params').css('display', 'none');
                    $('#polyline-symbol-trail-params').css('display', 'none');

                    createLineType(1, this);
                });
                $("#outline").on("click", function () {
                    $('#polyline-symbol-list > .mark-list-item').removeClass('polyline-symbol-font-selected');
                    $(this).addClass('polyline-symbol-font-selected');

                    $('#polyline-symbol-outline-params').css('display', 'block');
                    $('#polyline-symbol-dash-params').css('display', 'none');
                    $('#polyline-symbol-arrow-params').css('display', 'none');
                    $('#polyline-symbol-common-params').css('display', 'none');
                    $('#polyline-symbol-glow-params').css('display', 'none');
                    $('#polyline-symbol-trail-params').css('display', 'none');

                    createLineType(2, this);
                });
                $("#arrowLine").on("click", function () {
                    $('#polyline-symbol-list > .mark-list-item').removeClass('polyline-symbol-font-selected');
                    $(this).addClass('polyline-symbol-font-selected');

                    $('#polyline-symbol-arrow-params').css('display', 'block');
                    $('#polyline-symbol-common-params').css('display', 'none');
                    $('#polyline-symbol-outline-params').css('display', 'none');
                    $('#polyline-symbol-dash-params').css('display', 'none');
                    $('#polyline-symbol-glow-params').css('display', 'none');
                    $('#polyline-symbol-trail-params').css('display', 'none');

                    createLineType(3, this);
                });
                $("#glowLine").on("click", function () {
                    $('#polyline-symbol-list > .mark-list-item').removeClass('polyline-symbol-font-selected');
                    $(this).addClass('polyline-symbol-font-selected');

                    $('#polyline-symbol-glow-params').css('display', 'block');
                    $('#polyline-symbol-common-params').css('display', 'none');
                    $('#polyline-symbol-outline-params').css('display', 'none');
                    $('#polyline-symbol-arrow-params').css('display', 'none');
                    $('#polyline-symbol-dash-params').css('display', 'none');
                    $('#polyline-symbol-trail-params').css('display', 'none');

                    createLineType(4, this);
                });
                $("#TrailLine").on("click", function () {
                    $('#polyline-symbol-list > .mark-list-item').removeClass('polyline-symbol-font-selected');
                    $(this).addClass('polyline-symbol-font-selected');

                    $('#polyline-symbol-trail-params').css('display', 'block');
                    $('#polyline-symbol-glow-params').css('display', 'none');
                    $('#polyline-symbol-common-params').css('display', 'none');
                    $('#polyline-symbol-outline-params').css('display', 'none');
                    $('#polyline-symbol-arrow-params').css('display', 'none');
                    $('#polyline-symbol-dash-params').css('display', 'none');

                    createLineType(5, this);
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
                    $("#polygon-symbol-common-params").css("display", "none");
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

                $("#polygon-symbol-full-color").spectrum({ // 纯色面颜色
                    color: "cf9932", // 默认颜色
                    showPalette: true, //用于存储过往选择的颜色
                    palette: palette,
                    showAlpha: true, // 支持透明度选择
                    chooseText: "选择",
                    cancelText: "取消",
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-pure') === 0) {
                            viewer.selectedEntity.polygon.material = color;
                        }
                    }
                });

                $("#polygon-symbol-grid-color").spectrum({ // 网格面颜色
                    color: "cf9932", // 默认颜色
                    showPalette: true, //用于存储过往选择的颜色
                    palette: palette,
                    showAlpha: true, // 支持透明度选择
                    chooseText: "选择",
                    cancelText: "取消",
                    change: function(color) {
                        var color = Cesium.Color.fromCssColorString(color.toRgbString());
                        if (viewer.selectedEntity && viewer.selectedEntity.id && viewer.selectedEntity.id.indexOf('polygon-symbol-grid') === 0) {
                            viewer.selectedEntity.polygon.material.color = color;
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
                    color: 'cf9932',
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
                    color: '3478bc',
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
    }

    function initPolylineSymbolDrawHandler() {
        polylineSymbolDrawHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line);
        polylineSymbolDrawHandler.activeEvt.addEventListener(function (isActive) {
            if (isActive == true) {
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            } else {
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        polylineSymbolDrawHandler.drawEvt.addEventListener(function (result) {
            polylineSymbolDrawHandler.polyline.show = false;
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
            switch (polylineSymbolType) {
                case 0:
                    var fullLineColor = Cesium.Color.fromCssColorString($("#polyline-symbol-line-color").spectrum('get').toRgbString());
                    var fullLineWidth = Number($('#polyline-symbol-line-width').val());
                    viewer.entities.add({
                        id: 'polyline-symbol-full-' + (new Date()).getTime(),
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: fullLineWidth,
                            material: fullLineColor,
                        }
                    });
                    break;
                case 1:
                    var dashLineColor = Cesium.Color.fromCssColorString($("#polyline-symbol-dash-color").spectrum('get').toRgbString());
                    var dashLineGapColor = Cesium.Color.fromCssColorString($("#polyline-symbol-gap-color").spectrum('get').toRgbString());
                    var dashLineWidth = Number($('#polyline-symbol-dash-line-width').val());
                    var dashLineDashSectionLength = Number($('#polyline-dash-section-length').val());
                    viewer.entities.add({
                        id: 'polyline-symbol-dash-' + (new Date()).getTime(),
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: dashLineWidth,
                            material: new Cesium.PolylineDashMaterialProperty({
                                color: dashLineColor,
                                gapColor: dashLineGapColor,
                                dashLength: dashLineDashSectionLength
                            })
                        }
                    });
                    break;
                case 2:
                    var outlineInnerColor = Cesium.Color.fromCssColorString($("#polyline-symbol-outline-inner-color").spectrum('get').toRgbString());
                    var outlineOuterColor = Cesium.Color.fromCssColorString($("#polyline-symbol-outline-color").spectrum('get').toRgbString());
                    var outlineInnerWidth = Number($('#polyline-symbol-outline-inner-width').val());
                    var outlineOuterWidth = Number($('#polyline-symbol-outline-width').val());
                    viewer.entities.add({
                        id: 'polyline-symbol-outline-' + (new Date()).getTime(),
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: outlineInnerWidth,
                            material: new Cesium.PolylineOutlineMaterialProperty({
                                color: outlineInnerColor,
                                outlineWidth: outlineOuterWidth,
                                outlineColor: outlineOuterColor,
                            })
                        }
                    });
                    break;
                case 3:
                    var arrowLineColor = Cesium.Color.fromCssColorString($("#polyline-symbol-arror-color").spectrum('get').toRgbString());
                    var arrowLineWidth = Number($('#polyline-symbol-arrow-width').val());
                    viewer.entities.add({
                        id: 'polyline-symbol-arrow-' + (new Date()).getTime(),
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: arrowLineWidth,
                            followSurface: false,
                            material: new Cesium.PolylineArrowMaterialProperty(arrowLineColor)
                        }
                    });
                    break;
                case 4:
                    var glowLineColor = Cesium.Color.fromCssColorString($("#polyline-symbol-glow-color").spectrum('get').toRgbString());
                    var glowLineWidth = Number($('#polyline-symbol-glow-width').val());
                    var glowLinePower = Number($('#polyline-symbol-glow-power').val());
                    viewer.entities.add({
                        id: 'polyline-symbol-glow-' + (new Date()).getTime(),
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: glowLineWidth,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                glowPower: glowLinePower,
                                color: glowLineColor,
                            })
                        }
                    });
                    break;
                case 5:
                    var trailLineColor = Cesium.Color.fromCssColorString($("#polyline-symbol-trail-line-color").spectrum('get').toRgbString());
                    var trailLineWidth = Number($('#polyline-symbol-trail-width').val());
                    var trailLinePercent = Number($('#polyline-trail-percent').val());
                    var trailLinePeroid = Number($('#polyline-trail-period').val());
                    viewer.entities.add({
                        id: 'polyline-symbol-trail-' + (new Date()).getTime(),
                        polyline: {
                            positions: Cesium.Cartesian3.fromDegreesArrayHeights(position),
                            width: trailLineWidth,
                            material: new Cesium.PolylineTrailMaterialProperty({
                                color: trailLineColor,
                                // outlineColor: trailLineOutlineColor, // 不存在这个属性，文档上写错了
                                // outlineWidth: trailLineOutlineWidth,
                                trailLength: trailLinePercent,
                                period: trailLinePeroid
                            })
                        }
                    });
                    break;
                default:
                    break;
            }
        });
    }
    function createLineType(type) {
        polylineSymbolType = type;
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
                    var polygonSymbolPureColor = Cesium.Color.fromCssColorString($("#polygon-symbol-full-color").spectrum('get').toRgbString());
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
                    var polygonSymbolGridColor = Cesium.Color.fromCssColorString($("#polygon-symbol-grid-color").spectrum('get').toRgbString());
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
