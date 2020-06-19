define([
    './Container',
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
                    '<div class="squaredTwo squaredTwo-light" id="has-token" style="margin-left: 20px;"><input type="checkbox"><label class="check-icon check-icon-light"></label></div><label id="add-token-caption">' + Resource.addToken + '</label>',
                '</div>',
                '<div class="form-group">',
                    '<input id="urlInput" class="my-form-control" type="url" placeholder=' + Resource.layerUrl + ' title="http://<server>:<port>/iserver/servers/***/rest/realspace/datas/<name>/config"/>',
                '</div>',
                '<div class="form-group">',
                    '<input id="nameInput" class="my-form-control" placeholder=' + Resource.layerName + ' type="text"/>',
                '</div>',
                '<div id="token-input-wrapper" class="form-group" style="display: none;">',
                    '<input id="tokenInput" class="my-form-control" placeholder=' + Resource.addToken + ' type="text"/>',
                '</div>',
                '<button class="btn btn-info function-module-btn function-module-btn-highlight" id="open-layer" style="margin-top:10px;">' + Resource.confirm + '</button>',
            '</div>',
            '<div class="function-module-part">',
                '<label>' + Resource.OpenScene + '</label>',
                '<div class="form-group">',
                    '<input id="sceneUrl" class="my-form-control" style="width: 80%;" placeholder=' + Resource.sceneUrl + ' type="url" title="http://<server>:<port>/iserver/servers/***/rest/realspace"/>',
                    '<div class="squaredTwo squaredTwo-light" id="has-scene-token" style="margin-left: 20px;"><input type="checkbox"><label class="check-icon check-icon-light"></label></div><label id="add-scene-token-caption">' + Resource.addToken + '</label>',
                '</div>',
                '<div id="scene-token-input-wrapper" class="form-group" style="display: none;">',
                    '<input id="sceneTokenInput" class="my-form-control" placeholder=' + Resource.addToken + ' type="text"/>',
                '</div>',
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
            'blur #urlInput': 'onUrlInputBlur',
            'click #has-token, #add-token-caption': 'onAddToken',
            'click #has-scene-token, #add-scene-token-caption': 'onAddSceneToken'
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
            var isHasToken = $('#has-token').find('input[type=checkbox]')[0].checked;
            var token = '';
            if(isHasToken) {
                token = $.trim($('#tokenInput').val());
            }
            if (url === '') {
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }
            if (name === '') {
                Util.showErrorMsg(Resource.layerNameNotNullMsg);
                return;
            }

            if (type === 'S3M') {
                if (!Util.s3mLayerUrlPattern.test(url)) {
                    Util.showErrorMsg(Resource.urlMismatchingPattern);
                    return;
                }
            } else {
                if (!Util.imageryOrTerrainLayerUrlPattern.test(url)) {
                    Util.showErrorMsg(Resource.urlMismatchingPattern);
                    return;
                }
            }
            var layerModel = new LayerModel({
                url: url,
                name: name,
                type: type,
                realName: name
            });
            Cesium.Credential.CREDENTIAL = new Cesium.Credential(token);
            this.model.addLayer(layerModel);
        },
        onOpenScene: function (evt) { // 打开场景
            var sceneUrl = $('#sceneUrl').val();
            var isHasToken = $('#has-scene-token').find('input[type=checkbox]')[0].checked;
            var token = '';
            if(isHasToken) {
                token = $.trim($('#sceneTokenInput').val());
            }
            Cesium.Credential.CREDENTIAL = new Cesium.Credential(token);
            if (sceneUrl === '') {
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }

            if (!Util.sceneUrlPattern.test(sceneUrl)) {
                Util.showErrorMsg(Resource.urlMismatchingPattern);
                return;
            }
            var allUrl = sceneUrl + "/datas.xml";
            if(isHasToken && token !== ''){
                allUrl = allUrl + '?token=' + token;
            }

            // namelist和pathlist下标一一对应
            var namelist = new Array(); // 图层的名称
            var pathlist = new Array(); // 图层的URL
            $.ajax({
                url: allUrl,
                dataType: 'xml',
                type: 'GET',
                async: false,
                timeout: 3000,
                error: function (xml) {
                    Util.showErrorMsg(Resource.loadException);
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
            if(isHasToken && token !== ''){
                jsonUrl = jsonUrl + '?token=' + token;
            }
            var jsonPath;
            $.ajax({
                url: jsonUrl,
                dataType: 'xml',
                type: 'GET',
                async: false,
                timeout: 3000,
                error: function (xml) {
                    Util.showErrorMsg(Resource.loadException);
                },
                success: function (xml) {
                    $(xml).find("path").each(function (i) {
                        var id = $(this).children("id");
                        jsonPath = id.context.innerHTML;
                    });
                }
            });
            var typeUrl = jsonPath + '/layers.xml';
            if(isHasToken && token !== ''){
                typeUrl = typeUrl + '?token=' + token;
            }
            // typeLayerName和typelist下标一一对应
            var typelist = new Array(); // 图层的类型
            var typeLayerName = new Array(); // 图层的名称

            $.ajax({
                url: typeUrl,
                dataType: 'xml',
                type: 'GET',
                async: false,
                timeout: 3000,
                error: function (xml) {
                    Util.showErrorMsg(Resource.loadException);
                },
                success: function (xml) {
                    $(xml).find("name").each(function(i){
                        var id = $(this).children("id");
                        typeLayerName[i] = id.context.innerHTML;
                    });
                    $(xml).find("layer3DType").each(function (i) {
                        var id = $(this).children("id");
                        switch (id.context.innerHTML) {
                            case 'OSGBLayer':
                                typelist[i] = 'S3M';
                                break;
                            case 'ImageFileLayer':
                                typelist[i] = 'IMAGERY';
                                break;
                            case 'TerrainFileLayer':
                                typelist[i] = 'TERRAIN';
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
            // 将图层的名称、类型和URL联系起来
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
            $('#tokenInput').val('');
            $('#sceneTokenInput').val('');
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
        },
        onAddToken: function(evt) {
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            var chk = $('#has-token').find('input[type=checkbox]');
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
                if(chk[0].checked) {
                    $('#token-input-wrapper').css('display', 'block');
                } else {
                    $('#token-input-wrapper').css('display', 'none');
                }
            }

        },
        onAddSceneToken: function(evt) {
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            var chk = $('#has-scene-token').find('input[type=checkbox]');
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
                if(chk[0].checked) {
                    $('#scene-token-input-wrapper').css('display', 'block');
                } else {
                    $('#scene-token-input-wrapper').css('display', 'none');
                }
            }
        }
    });

    return WebServicePan;
});