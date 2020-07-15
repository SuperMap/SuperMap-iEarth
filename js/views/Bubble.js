define(['./Container', , 'jquery', '../models/MarkerModel', '../models/KmlLayerModel'], function (Container, $, MarkerModel, KmlLayerModel) {
    "use strict";
    var $ = require('jquery');
    var _ = require('underscore');
    var htmlStr = [
        '<div id="tools" style="text-align : right">',
        '<span style="color: rgb(95, 74, 121);padding: 5px;position: absolute;left: 10px;top: 4px;">对象属性</span>',
        '<span class="fui-export" id="bubblePosition" style="color: darkgrey; padding:5px" title="停靠"></span>',
        '<span class="fui-cross" title="' + Resource.close + '" id="bubbleClose" style="color: darkgrey;padding:5px"></span>',
        '</div>',
        '<div style="overflow-y:auto;" id="tableContainer">',
        '<table id="tab" style="height: 100px;"></table>',
        '</div>'
    ].join('');
    var Bubble = Container.extend({
        tagName: 'div',
        id: 'bubble',
        className: 'bubble',
        template: _.template(htmlStr),
        events: {
            'click #bubblePosition': 'onBubblePositionClk',
            'click #bubbleClose': 'onBubbleColseClk'
        },
        initialize: function (options) {
            this.model = options.sceneModel;
            this.viewer = options.sceneModel.viewer;
            var scene = this.viewer.scene;
            this.render();


            var scenePosition = null; // 记录在场景中点击的笛卡尔坐标点
            var dock = false; // 是否停靠


            scene.postRender.addEventListener(function () {
                if (scenePosition && !dock) {
                    var infoboxContainer = document.getElementById("bubble");
                    var table = document.getElementById("tab"); // 气泡内的表格

                    var canvasHeight = scene.canvas.height;
                    var windowPosition = new Cesium.Cartesian2();
                    Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, scenePosition, windowPosition);
                    infoboxContainer.style.bottom = (canvasHeight - windowPosition.y + 45) + 'px';
                    infoboxContainer.style.left = (windowPosition.x - 70) + 'px';
                    infoboxContainer.style.visibility = "visible";
                }
            })


            var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            handler.setInputAction(function (e) {
                var selectedEntity = viewer.selectedEntity;

                // 获取点击位置笛卡尔坐标
                var cameraPosition = scene.camera.position;
                // 获取点击位置笛卡尔坐标
                var position = scene.pickPosition(e.position);
                scenePosition = position; // 气泡相关 2/4

                $("#bubble").hide();

                var table = document.getElementById("tab"); // 气泡内的表格

                var layer = window.selectedLayer;
                if (layer && layer.getSelection().length > 0) {
                    var SMId = Number(layer.getSelection()[0]);
                    layer.getAttributesById(SMId).then(function (data) {
                        for (i = table.rows.length - 1; i > -1; i--) {
                            table.deleteRow(i);
                        }
                        $("#bubble").show();

                        var newRow = table.insertRow();
                        var cell1 = newRow.insertCell();
                        var cell2 = newRow.insertCell();
                        cell1.innerHTML = "<b style='font-size: 1.00rem;'>属性</b>";
                        cell2.innerHTML = "<b style='font-size: 1.00rem;'>值</b>";

                        //添加图层和id信息
                        var newRow = table.insertRow();
                        var cell1 = newRow.insertCell();
                        var cell2 = newRow.insertCell();
                        cell1.innerHTML = "图层";
                        cell2.innerHTML = layer.name;

                        newRow = table.insertRow();
                        var cell1 = newRow.insertCell();
                        var cell2 = newRow.insertCell();
                        cell1.innerHTML = "ID";
                        cell2.innerHTML = SMId;

                        for (var attName in data) {
                            var attVlalue = data[attName];

                            var newRow = table.insertRow();
                            var cell1 = newRow.insertCell();
                            var cell2 = newRow.insertCell();
                            cell1.innerHTML = attName;
                            cell2.innerHTML = attVlalue;
                        }
                    });
                }


            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


            this.viewer.selectedEntityChanged.addEventListener(function (entity) {
                console.log(entity);
            });

        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        onBubblePositionClk: function () {
            this.dock = !this.dock;
            if ($("#bubblePosition").hasClass("fui-export")) {
                $("#bubble").removeClass("bubble").addClass("float");
                $("#bubblePosition").removeClass("fui-export").addClass("fui-bubble");
                $("#bubblePosition")[0].title = "悬浮";
                $("#bubble").css({
                    'left': '82%',
                    'bottom': '45%'
                });
                $("#tableContainer").css({
                    'height': '350px'
                });
            } else if ($("#bubblePosition").hasClass("fui-bubble")) {
                $("#bubble").removeClass("float").addClass("bubble");
                $("#bubblePosition").removeClass("fui-bubble").addClass("fui-export");
                $("#bubblePosition")[0].title = "停靠";
                $("#tableContainer").css({
                    'height': '150px'
                });
            }
        },
        onBubbleColseClk: function () {
            $("#bubble").hide();
        }
    });
    return Bubble;
});