define([
    './Container',
    'Cesium',
    'jquery',
    '../models/LayerModel',
    '../Util'], function (Container, Cesium, $, LayerModel, Util) {
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        '<div class="function-module-content">',
            '<div class="function-module-sub-section function-module-part">',
                '<label>' + Resource.OpenLayer + '</label>',
                '<div class="form-group">',
                    '<select class="my-form-control" style="width:50%;" id="typeInput">',
                        '<option value="S3M">' + Resource.s3mLayer + '</option>',
                        '<option value="IMAGERY">' + Resource.imageryLayer + '</option>',
                        '<option value="TERRAIN">' + Resource.sctTerrainLayer + '</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input id="urlInput" class="my-form-control" type="url" placeholder=' + Resource.layerUrl + ' title="http://<server>:<port>/iserver/servers/***/rest/realspace/datas/<name>/config"/>',
                '</div>',
                '<div>',
                    '<input id="nameInput" class="my-form-control" placeholder=' + Resource.layerName + ' type="text"/>',
                '</div>',
                '<button class="btn btn-info function-module-btn function-module-btn-highlight" id="open-layer" style="margin-top:10px;">' + Resource.confirm + '</button>',
            '</div>',
            '<div class="function-module-part">',
                '<label>' + Resource.OpenScene + '</label>',
                '<input id="sceneUrl" class="my-form-control" placeholder=' + Resource.sceneUrl + ' type="url" title="http://<server>:<port>/iserver/servers/***/rest/realspace"/>',
                '<button class="btn btn-info function-module-btn function-module-btn-highlight" id="open-scene" style="margin-top:10px;">' + Resource.confirm + '</button>',
            '</div>',
        '</div>',
    ].join('');
    var WebServicePan = Container.extend({
        tagName: 'div',
        template: _.template(htmlStr),
        events: {
            'click #open-layer': 'onOpenLayer',
            'click #open-scene': 'onOpenScene',
            'change #typeInput': 'onSelectChange',
            'click #chkContainer': 'onCheckboxChange',
            'blur #urlInput': 'onUrlInputBlur'
        },
        initialize: function (options) {
            this.model = options.sceneModel;
            this.render();
            this.listenTo(this.model, 'modalOpen', this.clear);
        },
        render: function () {
            this.$el.html(this.template());
            this.$el.attr({'role': 'tabpanel', 'id': 'customServicePan'});
            this.$el.addClass('tab-pane');
            return this;
        },
        onOpenLayer: function () { // 打开图层
            var type = $('#typeInput').val();
            var url = $('#urlInput').val();
            var name = $('#nameInput').val();

            if (url === '') {
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }
            if (name === '') {
                Util.showErrorMsg(Resource.layerNameNotNullMsg);
                return;
            }
            var s3mLayerUrlPattern = /^http(s?):\/\/\S+\/(realspace|iserver)\/services\/3D-\S+\/rest\/realspace\/datas\/\S+\/config$/; // S3M图层URL正则表达式
            var imageryOrTerrainLayerUrlPattern = /^http(s?):\/\/\S+\/(realspace|iserver)\/services\/3D-\S+\/rest\/realspace\/datas((?!\/config).)*$/; // 影像或地形图层URL正则表达式

            if (type === 'S3M') {
                if (!s3mLayerUrlPattern.test(url)) {
                    Util.showErrorMsg(Resource.urlMismatchingPattern);
                    return;
                }
            } else {
                if (!imageryOrTerrainLayerUrlPattern.test(url)) {
                    Util.showErrorMsg(Resource.urlMismatchingPattern);
                    return;
                }
            }
            var layerModel = new LayerModel({
                url: url,
                sceneUrl: sceneUrl,
                name: name,
                type: type,
                realName: name
            });
            this.model.addLayer(layerModel);
        },
        onOpenScene: function (evt) { // 打开场景
            var sceneUrl = $('#sceneUrl').val();
            if (sceneUrl === '') {
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }
            var sceneUrlPattern = /^http(s?):\/\/\S+\/(realspace|iserver)\/services\/3D-\S+\/rest\/realspace$/; // 场景URL正则表达式
            if (!sceneUrlPattern.test(sceneUrl)) {
                Util.showErrorMsg(Resource.urlMismatchingPattern);
                return;
            }
            var allUrl = sceneUrl + "/datas.xml";
            var namelist = new Array();
            var pathlist = new Array();
            $.ajax({
                url: allUrl,
                dataType: 'xml',
                type: 'GET',
                async: false,
                timeout: 3000,
                error: function (xml) {

                },
                success: function (xml) {
                    $(xml).find("name").each(function (i) {
                        var id = $(this).children("id");
                        namelist[i] = id.context.innerHTML;
                    });
                    $(xml).find("path").each(function (i) {
                        var id = $(this).children("id");
                        pathlist[i] = id.context.innerHTML;
                    });
                }
            });

            var jsonUrl = sceneUrl + '/scenes.xml';
            var jsonPath;
            $.ajax({
                url: jsonUrl,
                dataType: 'xml',
                type: 'GET',
                async: false,
                timeout: 3000,
                error: function (xml) {

                },
                success: function (xml) {
                    $(xml).find("path").each(function (i) {
                        var id = $(this).children("id");
                        jsonPath = id.context.innerHTML;
                    });

                }
            });
            var typeUrl = jsonPath + '/layers.xml';
            var typelist = new Array();
            var typeLayerName = new Array();

            $.ajax({
                url: typeUrl,
                dataType: 'xml',
                type: 'GET',
                async: false,
                timeout: 3000,
                error: function (xml) {
                },
                success: function (xml) {
                    $(xml).find("name").each(function(i){
                        var id = $(this).children("id");
                        typeLayerName[i] = id.context.innerHTML;
                    });
                    $(xml).find("layer3DType").each(function (i) {
                        var id = $(this).children("id");
                        typelist[i] = id.context.innerHTML;
                    });
                }
            });
            for (var j = 0; j < typelist.length; j++) {
                if (typelist[j] == 'OSGBLayer') {
                    typelist[j] = 'S3M';
                }
                else if (typelist[j] == 'ImageFileLayer') {
                    typelist[j] = 'IMAGERY';
                }
                else if (typelist[j] == 'TerrainFileLayer') {
                    typelist[j] = 'TERRAIN';
                }
            }

            for (var i = 0; i < namelist.length; i++) {
                var typeIndex = typeLayerName.indexOf(namelist[i]);
                var type = typelist[typeIndex];
                if (type == 'S3M') {
                    pathlist[i] = pathlist[i] + "/config";
                }

                var layerModel = new LayerModel({
                    url: pathlist[i],
                    name: namelist[i],
                    type: type,
                    realName: name
                });
                this.model.addLayer(layerModel);
            }
            $('#sceneUrl').val("");
        },
        onSelectChange: function (evt) {
            var target = evt.target;
            var value = target.value;
            if (value == 'IMAGERY' || value === 'TERRAIN') {
                $('#queryFeatureSpan').hide();
                $('#dataUrlDiv').hide();
            }
            else {
                $('#queryFeatureSpan').show();
                $('#queryFeatureChk').attr('checked', false);
            }
            evt.stopPropagation();
        },
        onCheckboxChange: function (evt) {
            if (evt && evt.preventDefault) {
                evt.preventDefault();
            }
            else {
                window.event.returnValue = false;
            }
            var chk = $(evt.target).prev();
            if (chk && chk[0]) {
                chk[0].checked = !chk[0].checked;
            }
            var isChecked = chk[0].checked;
            if (isChecked) {
                $('#dataUrlDiv').show();
                $('#urlInput').blur();
            }
            else {
                $('#dataUrlDiv').hide();
            }
            evt.stopPropagation();
        },
        onUrlInputBlur: function (evt) {
            var target = evt.target;
            if ($('#queryFeatureChk').is(':checked')) {
                var scpUrl = $(target).val();
                if (scpUrl !== '') {
                    var scpUri = new Cesium.Uri(scpUrl);
                    var authority = scpUri.authority;
                    var path = scpUri.path;
                    var index1 = path.indexOf('/3D-');
                    var prefixPath = path.substring(0, index1);
                    var index2 = path.indexOf('/rest');
                    var name = path.substring(index1 + 4, index2);
                    var dataUrl = 'http://' + authority + prefixPath + '/data-' + name + '/rest/data';
                    $('#dataUrlInput').val(dataUrl);
                    var dataSourceUrl = dataUrl + '/datasources.json';
                    $('#datasourceSel option').each(function () {
                        if ($(this).val() !== 'undefined') {
                            $(this).remove();
                        }
                    });
                    $('#datasetSel option').each(function () {
                        if ($(this).val() !== 'undefined') {
                            $(this).remove();
                        }
                    });
                    $('#dataUrlInput').val();
                    Cesium.when(Cesium.loadJson(dataSourceUrl), function (datasources) {
                        var datasource = datasources['datasourceNames'][0];
                        var str = '<option value="{value}">{text}</option>'.replace('{value}', datasource).replace('{text}', datasource);
                        $('#datasourceSel').append(str);
                        var dataSetUrl = dataUrl + '/datasources/' + datasource + '/datasets.json';
                        Cesium.when(Cesium.loadJson(dataSetUrl), function (dataSets) {
                            var names = dataSets['datasetNames'];
                            var arr = [];
                            var str = '';
                            for (var dataSetName of names) {
                                var str = `<option value="${dataSetName}">${dataSetName}</option>'`;
                                arr.push(str);
                            }
                            arr.unshift('<option value="merge">查询所有数据集</option>');
                            $('#datasetSel').append(arr.join(''));
                        });
                    });
                }
            }
            evt.stopPropagation();
        },
        clear: function () {
            $('#typeInput option:first').prop('selected', 'selected');
            $('#urlInput').val('');
            $('#nameInput').val('');
            $('#queryFeatureChk').attr('checked', false);
            $('#dataUrlDiv').hide();
            $('#datasourceSel option').each(function () {
                if ($(this).val() !== 'undefined') {
                    $(this).remove();
                }

            });
            $('#datasetSel option').each(function () {
                if ($(this).val() !== 'undefined') {
                    $(this).remove();
                }
            });
            $('#dataUrlInput').val();
        }
    });

    return WebServicePan;
});