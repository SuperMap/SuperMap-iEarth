define(['./Container', 'jquery', 'bootstrapTree', 'spectrum', 'drag', '../3DGIS/excavationRegion', '../3DGIS/flattenRegion', '../3DGIS/ModelFlood', './layerAttribute'], function (Container, $, bootstrapTree, spectrum, drag, excavationRegion, flattenRegion, ModelFlood, LayerAttribute) {
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        "<div id='layerTree'></div>",
    ].join('');
    var list;
    var nodeListInfo = {};

    function calNode(ModeUrl) {
        if (!ModeUrl) {
            return;
        }
        ModeUrl = ModeUrl.substring(0, ModeUrl.length - 7) + "/data/path/indexData.dat";
        var nodelist = new Array();
        var nodedata = new Array();
        var datalist = new Array();
        var per = new Array();
        $.ajax({
            url: ModeUrl,
            dataType: 'xml',
            type: 'GET',
            async: false,
            timeout: 3000,
            error: function (xml) {
                return per;
            },
            success: function (xml) {
                $(xml).find("DatasetName").each(function (i) {
                    var id = $(this).children("id");
                    nodelist[i] = id.context.innerHTML;
                });
                $(xml).find("DatasetIDRange").each(function (i) {
                    var id = $(this).children("id");
                    nodedata[i] = id.context.innerHTML;
                });

            }
        });
        for (var i = 0; i < nodedata.length; i++) {
            var t = nodedata[i].indexOf('_');
            var startline = parseInt(nodedata[i].substr(0, t));
            var endline = parseInt(nodedata[i].substr(t + 1, nodedata[i].length - t - 1));
            var cal = [];
            for (var k = 0; k <= endline - startline; k++) {
                cal[k] = startline + k;
            }
            datalist[i] = cal;
        }
        per[0] = new Array();
        per[1] = new Array();
        per[0] = nodelist;
        per[1] = datalist;
        return per;
    }

    var LayerManageDropDown = Container.extend({
        tagName: 'div',
        template: _.template(htmlStr),
        initialize: function (options) {
            this.model = options.sceneModel;
            this.viewer = options.sceneModel.viewer;
            this.render();
            var me = this;
            this.listenTo(this.model, 'layerAdded', function (layerModel) {
                me.addTreeNode(layerModel);
            });
            this.listenTo(this.model, 'markerAdded', function (name) {
                me.addMarkerNode(name);
            });
        },
        render: function () {
            this.$el.html(this.template());
            this.$el.addClass('dropDown-container');
            this.$el.attr('id', 'layer-manage-drop-down');
            this.$el.css({'min-width': '260px', 'text-align': 'left', 'padding': '8px'});
            return this;
        },
        initZtree: function () {
            var me = this;
            var $tree = $('#layerTree').treeview({
                data: [{text: Resource.layerList, selectable: false}],
                showIcon: false,
                showCheckbox: true,
                backColor: 'transparent',
                color: '#fff',
                onNodeChecked: function (evt, node) {
                    var layerModel = node.layerModel;
                    var ids = [];
                    var url = layerModel.get('url');
                    var components = nodeListInfo[url];
                    for (var i = 0; i < components[0].length; i++) {
                        if (components[0][i] == node.text) {
                            ids = components[1][i];
                        }
                    }
                    layerModel && layerModel.setVisible(true, ids);
                },
                onNodeUnchecked: function (evt, node) {
                    var layerModel = node.layerModel;
                    var ids = [];
                    var url = layerModel.get('url');
                    var components = nodeListInfo[url];
                    for (var i = 0; i < components[0].length; i++) {
                        if (components[0][i] == node.text) {
                            ids = components[1][i];
                        }
                    }
                    layerModel && layerModel.setVisible(false, ids);
                },
                onNodeRemove: function (evt, node) {
                    var layerModel = node.layerModel;
                    if (!layerModel) {
                        return;
                    }
                    if (confirm(Resource.confirmDelLayer)) {
                        var pId = node.parentId;
                        var pNode = $('#layerTree').treeview('getNode', [pId]);
                        var len = pNode.nodes.length;
                        $('#layerTree').treeview('removeNode', [node]);
                        var type = node.layerModel.get('type');
                        if ('MARKER' === type) {
                            me.model.removeMarker(node.layerModel);
                            if (len == 1) {
                                me.model.defaultKmlLayer = undefined;
                                delete me.rootNode['default KML'];
                                if (!(me.rootNode['KML'].nodes && me.rootNode['KML'].nodes.length > 0)) {
                                    delete me.rootNode['KML'];
                                }
                            }
                        }
                        else {
                            me.model.removeLayer(node.layerModel);
                            if (len == 1) {
                                delete me.rootNode[type];
                            }
                        }
                    }
                },
                onNodeSelected: function (evt, node) {
                    var layerModel = node.layerModel;
                    layerModel && layerModel.flyTo();
                },
                onNodeRightClicked: function (evt, node) {
                    var layerModel = node.layerModel;
                    $("#sceneForm").hide();
                    $("#layerForm").show();
                    showLayerAttribute(layerModel.layer, me.viewer);
                }
            });
            this.rootNode = {};
            this.rootNode['root'] = $tree.treeview('getNode', 0);
            this.tree = $tree;
        },
        addTreeNode: function (layerModel) {
            var type = layerModel.get('type');
            var name = layerModel.get('name');
            var isVisible = layerModel.get('isVisible') == false ? false : true;
            if (!this.rootNode[type]) {
                var nodeName = KeyMap[type] || type;
                this.rootNode[type] = this.tree.treeview('addNode', [this.rootNode.root, {
                    text: nodeName,
                    selectable: false
                }]);
            }
            var childNode = this.tree.treeview('addNode', [this.rootNode[type], {
                text: name,
                showDel: true,
                fontSize: '10pt',
                state: {checked: isVisible}
            }]);
            list = calNode(layerModel.get('url'));
            if (!(layerModel.get('url') in nodeListInfo)) {
                nodeListInfo[layerModel.get('url')] = list;
            }
            if (list && list[0].length > 0) {
                for (var i = 0; i < list[0].length; i++) {
                    var sonNode = this.tree.treeview('addNode', [childNode, {
                        text: list[0][i],
                        showDel: true,
                        fontSize: '10pt',
                        state: {checked: isVisible}
                    }]);
                    sonNode.layerModel = layerModel;
                }
            }
            childNode.layerModel = layerModel;
            if (name == 'default KML') {
                this.rootNode[name] = childNode;
                childNode.selectable = false;
                childNode.showDel = false;

            }
        },
        addMarkerNode: function (markerModel) {
            var name = markerModel.get('name');
            var kmlRootNode = this.rootNode['default KML'];
            if (!kmlRootNode) {
                return;
            }
            var childNode = this.tree.treeview('addNode', [kmlRootNode, {text: name, showDel: true, fontSize: '10pt'}]);
            childNode.layerModel = markerModel;
        }
    });
    var KeyMap = {
        'S3M': Resource.s3mLayer,
        'IMAGERY': Resource.imageryLayer,
        'TERRAIN': Resource.terrainLayer,
        'KML': Resource.kmlLayer,
        'MARKER': Resource.markerLayer
    };
    var initialization = false;
    var selectedLayer;

    function showLayerAttribute(layer, viewer) {
        var layerName = document.getElementById('layerName');
        layerName.value = layer._name;
        selectedLayer = layer;
        if(selectedLayer instanceof Cesium.S3MTilesLayer){
            document.getElementById('layer-brightness').value = selectedLayer.brightness;
            document.getElementById('layer-contrast').value = selectedLayer.contrast;
            document.getElementById('layer-hue').value = selectedLayer.hue;
            document.getElementById('layer-saturation').value = selectedLayer.saturation;

            // 这里有问题：DOM改变了界面不会改变，可能和Backbone的模板渲染有关系
            switch (selectedLayer.style3D.fillStyle){
                case Cesium.FillStyle.Fill:
                    $('input[name="layer-fill-style"][value="fill"]').attr("checked", "checked");
                    break;
                case Cesium.FillStyle.WireFrame:
                    $('input[name="layer-fill-style"][value="wireframe"]').attr("checked", "checked");
                    break;
                case Cesium.FillStyle.Fill_And_WireFrame:
                    $('input[name="layer-fill-style"][value="fill-and-wireframe"]').attr("checked", "checked");
                    break;
                default:
                    break;
            }
            switch (selectedLayer.wireFrameMode){
                case Cesium.WireFrameType.Triangle:
                    $('input[name="layer-wireframe-mode"][value="triangle"]').attr("checked", "checked");
                    break;
                case Cesium.FillStyle.WireFrame:
                    $('input[name="layer-wireframe-mode"][value="quad"]').attr("checked", "checked");
                    break;
                case Cesium.WireFrameType.Sketch:
                    $('input[name="layer-wireframe-mode"][value="sketch"]').attr("checked", "checked");
                    break;
                default:
                    break;
            }
        }
        if (!initialization) {
            $("#foreColorPicker").spectrum({
                color: "#fff", // 默认颜色
                showPalette: true, //用于存储过往选择的颜色
                palette: palette,
                showAlpha: true, // 支持透明度选择
                chooseText: "选择",
                cancelText: "取消",
                hide: function(color){
                    selectedLayer.style3D.fillForeColor = Cesium.Color.fromCssColorString(color.toRgbString());
                }
            });
            var lineColor = document.getElementById('lineColorPicker');
            lineColor.oninput = function () {
                var color = Cesium.Color.fromCssColorString(lineColor.value);
                selectedLayer.style3D.lineColor = color;
            };
            var selectColor = document.getElementById('selectColorPicker');
            selectColor.oninput = function () {
                var color = Cesium.Color.fromCssColorString(selectColor.value);
                selectedLayer.selectedColor = color;
            }
            $("#colorStyle").change(function () {
                var value = $(this).val();
                if (value == "0") {
                    selectedLayer.selectColorType = 0;
                }
                else if (value == "1") {
                    selectedLayer.selectColorType = 1;
                }
            })
            //图层可见性
            $("#display").click(function (evt) {
                selectedLayer.visible = !selectedLayer.visible;
            });
            $("#layerClose").click(function () {
                $("#layerForm").hide();
            })
            $("#breleaseColor").click(function (evt) {
                selectedLayer.bReleaseColor = !selectedLayer.bReleaseColor;
            });
            $("#cullEnabled").click(function (evt) {
                selectedLayer.cullEnabled = !selectedLayer.cullEnabled;
            });
            $("#multiChoose").click(function (evt) {
                selectedLayer.multiChoose = !selectedLayer.multiChoose;
            });
            $('#shadowType').change(function () {
                var value = $(this).val();
                if (value == "chooseShadow") {
                    selectedLayer.shadowType = 1;
                    selectedLayer.refresh();
                }
                else if (value == "allShadow") {
                    selectedLayer.shadowType = 2;
                    selectedLayer.refresh();
                }
                else if (value == "noShadow") {
                    selectedLayer.shadowType = 0;
                }
            });

            $('#fillStyle').change(function () {
                var value = $(this).val();
                if (value == "0") {
                    selectedLayer.style3D.fillStyle = 0;
                }
                else if (value == "1") {
                    selectedLayer.style3D.fillStyle = 1;
                }
                else if (value == "2") {
                    selectedLayer.style3D.fillStyle = 2;
                }
            });
            var bottomAltitude = document.getElementById('bottomAltitude');
            bottomAltitude.onblur = function () {
                selectedLayer.style3D.bottomAltitude = parseInt(bottomAltitude.value);
                selectedLayer.refresh();
            }

            // 最小最大可见高度设置
            $("#min-visible-height").on("input propertychange", function(){
                if($.trim($(this).val()) === ''){
                    selectedLayer.visibleDistanceMin = 0.0;
                    return;
                }
                selectedLayer.visibleDistanceMin = Number($(this).val());
            });
            $("#max-visible-height").on("input propertychange", function(){
                if($.trim($(this).val()) === ''){
                    selectedLayer.visibleDistanceMax = Number.MAX_VALUE;
                    return;
                }
                selectedLayer.visibleDistanceMax = Number($(this).val());
            });

            //LOD缩放比例系数设置
            var LODScale = document.getElementById('LODScale');
            LODScale.oninput = function () {
                selectedLayer.lodRangeScale = parseFloat(LODScale.value);
            }
            //对象可见性设置
            var choosenDisplayRadio = document.getElementById('choosenDisplay');
            var chooseHiddenRadio = document.getElementById('chooseHidden');
            var initialize = document.getElementById('initialize');
            //仅选中对象可见
            choosenDisplayRadio.onchange = function () {
                var chooseIDs = layer.getSelection();
                selectedLayer.setObjsVisible(chooseIDs, true);
            }
            //仅选中对象隐藏
            chooseHiddenRadio.onchange = function () {
                var chooseIDs = layer.getSelection();
                selectedLayer.setObjsVisible(chooseIDs, false);
            }
            viewer.scene.terrainProvider.isCreateSkirt = false;
            $('#modelAlpha').bind('input propertychange', function () {
                selectedLayer.style3D.fillForeColor.alpha = parseFloat(this.value);
            });
            $("#excavationRegion").click(function (evt) {
                excavationRegion.initializing(selectedLayer, viewer);
            });
            $("#delExcavationRegion").click(function (evt) {
                excavationRegion.remove(selectedLayer);
            });
            $("#flattenRegion").click(function (evt) {
                flattenRegion.initializing(selectedLayer, viewer);
            });
            $("#delFlattenRegion").click(function (evt) {
                flattenRegion.remove(selectedLayer);
            });
            $("#execute-flood").click(function () { // 执行淹没分析
                ModelFlood.startAnalysis(selectedLayer);
            });
            $("#clear-flood").click(function () { // 清除淹没分析
                ModelFlood.clear(selectedLayer);
            });
            $("#choose-offset").on("input propertychange", function () {
                if ($(this).prop("checked")) {
                    var xOffset = Number($("#choose-x-offset").val());
                    var yOffset = Number($("#choose-y-offset").val());
                    var zOffset = Number($("#choose-z-offset").val());
                    selectedLayer.selectColorType = 1.0; // 替换模式
                    selectedLayer.selectedTranslate = new Cesium.Cartesian3(xOffset, yOffset, zOffset);
                } else {
                    selectedLayer.selectedTranslate = new Cesium.Cartesian3(0, 0, 0);
                    selectedLayer.selectColorType = 0.0; // 混合模式
                    selectedLayer.releaseSelection(); // 释放选择集
                }
            });
            $("#choose-x-offset,#choose-y-offset,#choose-z-offset").on("input propertychange", function () {
                if ($("#choose-offset").prop("checked")) {
                    var xOffset = Number($("#choose-x-offset").val());
                    var yOffset = Number($("#choose-y-offset").val());
                    var zOffset = Number($("#choose-z-offset").val());
                    selectedLayer.selectedTranslate = new Cesium.Cartesian3(xOffset, yOffset, zOffset);
                }
            });

            $("#layer-brightness").on('propertychange input', function(){ // 调整S3M图层亮度
                if($.trim($(this).val()) === ''){
                    return;
                }
                selectedLayer.brightness = Number($(this).val());
            });
            $("#layer-contrast").on('propertychange input', function(){ // 调整S3M图层对比度
                if($.trim($(this).val()) === ''){
                    return;
                }
                selectedLayer.contrast = Number($(this).val());
            });
            $("#layer-hue").on('propertychange input', function(){ // 调整S3M图层色调
                if($.trim($(this).val()) === ''){
                    return;
                }
                selectedLayer.hue = Number($(this).val());
            });
            $("#layer-saturation").on('propertychange input', function(){ // 调整S3M图层饱和度
                if($.trim($(this).val()) === ''){
                    return;
                }
                selectedLayer.saturation = Number($(this).val());
            });

            // 线框模式
            $("input[name='layer-fill-style']").on('input propertychange', function(){
                var layerFillStyle = $(this).val();
                switch (layerFillStyle){
                    case 'fill':
                        selectedLayer.style3D.fillStyle = Cesium.FillStyle.Fill;
                        break;
                    case 'wireframe':
                        selectedLayer.style3D.fillStyle = Cesium.FillStyle.WireFrame;
                        break;
                    case 'fill-and-wireframe':
                        selectedLayer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
                        break;
                    default:
                        break;
                }
                selectedLayer.refresh();
            });
            $("input[name='layer-wireframe-mode']").on('input propertychange', function(){
                var layerWireframeMode = $(this).val();
                switch (layerWireframeMode){
                    case 'triangle':
                        selectedLayer.wireFrameMode = Cesium.WireFrameType.Triangle;
                        break;
                    case 'quad':
                        selectedLayer.wireFrameMode = Cesium.WireFrameType.Quad;
                        break;
                    case 'sketch':
                        selectedLayer.wireFrameMode = Cesium.WireFrameType.Sketch;
                        break;
                    default:
                        break;
                }
                selectedLayer.refresh();
            });

            $("#layer-polygon-factor,#layer-polygon-unit").on("input propertychange", function(){
                var polygonOffsetFactor = Number($("#layer-polygon-factor").val());
                var polygonOffsetUnit = Number($("#layer-polygon-unit").val());
                selectedLayer.setPolygonoffset(polygonOffsetFactor, polygonOffsetUnit);
            });

            //还原
            initialize.onchange = function () {
                selectedLayer.setObjsVisible([], false);
            }
            initialization = true;
        }

    }

    return LayerManageDropDown;
});