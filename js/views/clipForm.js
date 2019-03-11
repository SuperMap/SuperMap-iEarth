define(['./Container', '../3DGIS/CrossClip', '../3DGIS/BoxClip', '../3DGIS/PlaneClip', '../3DGIS/PolygonClip'], function (Container, CrossClip, BoxClip, PlaneClip, PolygonClip) {
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var parent;
    var sceneModel;
    var isPCBroswer;

    var htmlStr = [
        '<main class="mainView" style="width: 360px;">',
            '<button type="button" aria-label="Close" id="closeScene" class="myModal-close"><span aria-hidden="true">&times;</span></button>',
            '<input id="clipTab1" type="radio" name="clipTab" checked>',
            '<label for="clipTab1" class="function-module-caption">' + Resource.BoxClip + '</label>',
            '<input id="clipTab2" type="radio" name="clipTab">',
            '<label for="clipTab2" class="function-module-caption">' + Resource.PlaneClip + '</label>',
            '<input id="cross-clip-panel-radio" type="radio" name="clipTab">',
            '<label for="cross-clip-panel-radio" id="cross-clip-panel-label" class="function-module-caption">' + Resource.CrossClip + '</label>',
            '<input id="polygon-clip-panel-radio" type="radio" name="clipTab">',
            '<label for="polygon-clip-panel-radio" class="function-module-caption">' + Resource.PolygonClip + '</label>',
            '<section id="clipContent1">',
                '<div class="function-module-content">',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.length + '</label>',
                        '<input type="number" id="box-clip-length" class="input" min="0" step="1" value="10">',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.width + '</label>',
                        '<input type="number" id="box-clip-width" class="input" min="0" step="1" value="10">',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.height + '</label>',
                        '<input type="number" id="box-clip-height" class="input" min="0" step="1" value="10">',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.rotate + '</label>',
                        '<input type="number" id="box-clip-rotate" class="input" min="-180" max="180" step="1" value="0">',
                    '</div>',
                    '<div>',
                        '<label class="function-module-sub-section-caption">' + Resource.ClipModel + '</label>',
                        '<select id="box-clip-mode" class="cesium-button" style="font-size: 12px;margin: 0px 0px -5px 0px;width: 90%">',
                            '<option value="clip_behind_all_plane_without_line_frame" selected>' + Resource.CutInsideBoxNOFrame + '</option>',
                            '<option value="clip_behind_any_plane_without_line_frame">' + Resource.CutOutBoxNOFrame + '</option>',
                            '<option value="clip_behind_all_plane_with_line_frame">' + Resource.CutInsideBoxFrame + '</option>',
                            '<option value="clip_behind_any_plane_with_line_frame">' + Resource.CutOutBoxFrame + '</option>',
                        '</select>',
                    '</div>',
                '</div>',
                '<button type="button" id="clear-box-clip" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
                '<button type="button" id="box-clip-analysis" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.analyze + '</button>',
            '</section>',
            '<section id="clipContent2">',
                '<div class="function-module-content">',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.firstPoint + '</label>',
                        '<div>',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.Spacelongitude + ', ' + Resource.Spacelatitude + ', ' + Resource.Spacealtitude + '</label>',
                            '<input type="text" id="plane-clip-point1-position" disabled class="input disabled">',
                        '</div>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.secondPoint + '</label>',
                        '<div>',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.Spacelongitude + ', ' + Resource.Spacelatitude + ', ' + Resource.Spacealtitude + '</label>',
                            '<input type="text" id="plane-clip-point2-position" disabled class="input disabled">',
                        '</div>',
                    '</div>',
                    '<div>',
                        '<label class="function-module-sub-section-caption">' + Resource.thirdPoint + '</label>',
                        '<div>',
                            '<label class="function-module-sub-section-caption-indent">' + Resource.Spacelongitude + ', ' + Resource.Spacelatitude + ', ' + Resource.Spacealtitude + '</label>',
                            '<input type="text" id="plane-clip-point3-position" disabled class="input disabled">',
                        '</div>',
                    '</div>',
                    '</div>',
                '</div>',
                '<button id="clear-plane-clip" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
                '<button id="plane-clip-analysis" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.analyze + '</button>',
            '</section>',
            '<section id="cross-clip-panel">',
                '<div class="function-module-content">',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.ClipWidth + '</label>',
                        '<input type="number" id="cross-clip-width" class="input" min="1" max="100" step="1" value="5"/>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.ClipHeight + '</label>',
                        '<input type="number" id="cross-clip-height" class="input" min="1" max="100" step="1" value="5"/>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.Xrotation + '</label>',
                        '<input type="number" id="cross-clip-pitch" class="input" min="0" max="360" step="1" value="0"/>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.Yrotation + '</label>',
                        '<input type="number" id="cross-clip-roll" class="input" min="0" max="360" step="1" value="0"/>',
                    '</div>',
                    '<div class="function-module-sub-section">',
                        '<label class="function-module-sub-section-caption">' + Resource.Zrotation + '</label>',
                        '<input type="number" id="cross-clip-heading" class="input" min="0" max="360" step="1" value="0"/>',
                    '</div>',
                    '<div>',
                        '<label class="function-module-sub-section-caption">' + Resource.extrude + '</label>',
                        '<input type="number" id="cross-clip-extrude" class="input" min="1" max="30" step="1" value="1">',
                    '</div>',
                '</div>',
                '<button id="clear-cross-clip" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
                '<button id="choose-cross-clip-pos" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.analyze + '</button>',
            '</section>',
            '<section id="polygon-clip-panel">',
                '<div class="function-module-content">',
                    '<div>',
                        '<label class="function-module-sub-section-caption">' + Resource.polygonClipMode + '</label>',
                        '<select id="polygon-clip-mode" class="cesium-button">',
                            '<option value="polygon-clip-outside" selected>' + Resource.PolygonClipOutside + '</option>',
                            '<option value="polygon-clip-inside">' + Resource.PolygonClipInside + '</option>',
                        '</select>',
                    '</div>',
                '</div>',
                '<button id="clear-polygon-clip" class="btn btn-info function-module-btn">' + Resource.eliminate + '</button>',
                '<button id="choose-polygon-clip-pos" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.analyze + '</button>',
            '</section/>',
        '</main>'
    ].join('');
    var clipForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events: {
            'click #closeScene': 'onCloseSceneClk',
            'click #plane-clip-analysis': 'onPlaneClip',
            'click #clear-plane-clip': 'onClearPlaneClip',
            'click #box-clip-analysis': 'onBoxClip',
            'click #clear-box-clip': 'onClearBoxClip',
            'click #choose-cross-clip-pos': 'onCrossClip',
            'click #clear-cross-clip': 'onClearCrossClip',
            'click #choose-polygon-clip-pos': 'onPolygonClip',
            'click #clear-polygon-clip': 'onClearPolygonClip',
            'change input[type=file]': 'onInputChange'
        },
        template: _.template(htmlStr),
        initialize: function (options) {
            sceneModel = options.sceneModel;
            viewer = options.sceneModel.viewer;
            parent = options.parent;
            isPCBroswer = options.isPCBroswer;
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
            });
            /*if (sceneModel.analysisObjects.planeClipStore) {
                clip.initializing(viewer, sceneModel, true, isPCBroswer);
            }
            if (sceneModel.analysisObjects.boxClipStore) {
                clip.initializing(viewer, sceneModel, false, isPCBroswer);
            }*/
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk: function (evt) {
            this.$el.hide();
            BoxClip.destroy(viewer);
            PlaneClip.destroy(viewer);
            CrossClip.destroy(viewer);
            PolygonClip.destroy();
        },
        onPlaneClip: function (evt) {
            PlaneClip.startClip(viewer, isPCBroswer);
            if (!isPCBroswer) {
                this.$el.hide();
            }
        },
        onClearPlaneClip: function (evt) {
            PlaneClip.clear(viewer);
        },
        onBoxClip: function (evt) {
            BoxClip.startClip(viewer);
            if (!isPCBroswer) {
                this.$el.hide();
            }
        },
        onClearBoxClip: function (evt) {
            BoxClip.clear();
        },
        onCrossClip: function(){
            CrossClip.startClip(viewer);
            if (!isPCBroswer) {
                this.$el.hide();
            }
        },
        onClearCrossClip: function(){
            CrossClip.clear();
        },
        onPolygonClip: function(){
            PolygonClip.startClip(viewer);
            if (!isPCBroswer) {
                this.$el.hide();
            }
        },
        onClearPolygonClip: function(){
            PolygonClip.clear();
        }
    });
    return clipForm;
});
