define([
    './Container',
    'Cesium',
    'jquery',
    '../models/LayerModel',
    '../Util'], function (Container, Cesium, $, LayerModel, Util) {
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        '<div style="padding: 10px; border:1px solid #417BB3">',
        '<label>' + Resource.OpenLayer + '</label>',
        '<div class="form-group" style="text-align: left;">',
        '<select class="cesium-button" style="width : 50%;" id="typeInput">',
        '<option value="S3M">' + Resource.s3mLayer + '</option>',
        '<option value="IMAGERY">' + Resource.imageryLayer + '</option>',
        '<option value="TERRAIN">' + Resource.sctTerrainLayer + '</option>',
        '</select>',
        /*'<span id="queryFeatureSpan">',
         '<div class="squaredTwo" id="chkContainer"> <input type="checkbox" id="queryFeatureChk"> <label class="check-icon"></label></div>' + Resource.featureQuery,
         '</span>',*/
        '</div>',
        '<div class="form-group">',
        '<input id="urlInput" class="my-form-control" type="url" placeholder=' + Resource.layerUrl + ' title="http://<server>:<port>/iserver/servers/***/rest/realspace/datas/<name>/config"/>',
        '</div>',
        '<div class="form-group">',
        '<input id="nameInput" class="my-form-control" placeholder=' + Resource.layerName + ' type="text" title="<layer name>" />',
        '</div>',
        '<div class="form-group" id="dataUrlDiv" style="display: none;">',
        '<input id="dataUrlInput" style="display: none;"/>',
        '<select class="cesium-button" id="datasourceSel" style="width: 48%;float: left">',
        '<option selected="selected" value="undefined">--' + Resource.selDataSource + '--</option>',
        '</select>',
        '<select class="cesium-button" id="datasetSel" style="width: 48%">',
        '<option selected="selected" value="undefined">--' + Resource.selDataSet + '--</option>',
        '</select>',
        '</div>',
        '</div><br>',
        '<div style="padding: 10px; border:1px solid #417BB3">',
        '<label>' + Resource.OpenScene + '</label>',
        '<input id="sceneUrl" class="my-form-control" placeholder=' + Resource.sceneUrl + ' type="url" title="http://<server>:<port>/iserver/servers/***/rest/realspace"/>',
        '</div><br>',
        '<button class="btn btn-info function-module-btn-highlight" data-dismiss="myModal-body" id="btnOk" style="float: right;margin-top:28px;">' + Resource.confirm + '</button>',

    ].join('');
    var WebServicePan = Container.extend({
        tagName: 'div',
        template: _.template(htmlStr),
        events: {
            'click #btnOk': 'onBtnOkClk',
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
        onBtnOkClk: function (evt) {
            var url = $('#urlInput').val();
            var sceneUrl = $('#sceneUrl').val();
            var name = $('#nameInput').val();
            if (url === '' && name != '') {
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }
            if (name === '' && url != '') {
                Util.showErrorMsg(Resource.layerNameNotNullMsg);
                return;
            }
            if (url === '' && sceneUrl === '') {
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }
            if (name === '' && sceneUrl === '') {
                Util.showErrorMsg(Resource.layerNameNotNullMsg);
                return;
            }

            if (url != '' && name != '') {
                var type = $('#typeInput').val();
                var layerModel = new LayerModel({
                    url: url,
                    sceneUrl: sceneUrl,
                    name: name,
                    type: type,
                    realName: name
                });
                if ("S3M" == type) {
                    if ($('#queryFeatureChk').is(':checked') && $('#dataUrlInput').val() !== '' && $('#datasourceSel').val() && $('#datasetSel').val()) {
                        var dataUrl = $('#dataUrlInput').val(), datasource = $('#datasourceSel').val(),
                            dataset = $('#datasetSel').val();
                        Util.SCPURL_SET[name] = {
                            dataUrl: dataUrl,
                            datasource: datasource,
                            dataset: dataset
                        };
                        /*layerModel.strategy.attrQueryPars = {
                         url: dataUrl,
                         dataSourceName: datasource,
                         dataSetName: dataset,
                         keyWorld: 'SmID'
                         };*/
                        if (dataset === 'merge') {
                            layerModel.strategy.attrQueryPars = {
                                url: dataUrl,
                                dataSourceName: datasource,
                                isMerge: true
                            };
                        } else {
                            layerModel.strategy.attrQueryPars = {
                                url: dataUrl,
                                dataSourceName: datasource,
                                dataSetName: dataset,
                                keyWord: 'SmID'
                            };
                        }
                    }
                }
                this.model.addLayer(layerModel);
            }

            if (sceneUrl != '') {
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
            }

            evt.stopPropagation();
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