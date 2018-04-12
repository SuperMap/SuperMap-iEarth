define([
    './Container',
    'Cesium',
    'jquery',
    '../models/LayerModel',
    '../Util'],function(Container,Cesium,$,LayerModel,Util){
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        '<div class="form-group" style="text-align: left;">',
        '<select class="cesium-button" style="width : 50%;" id="typeInput">',
        '<option value="S3M">' + Resource.s3mLayer + '</option>',
        '<option value="IMAGERY">' + Resource.imageryLayer + '</option>',
        '<option value="TERRAIN">' + Resource.sctTerrainLayer + '</option>',
        '</select>',
        '<span id="queryFeatureSpan">',
        '<div class="squaredTwo" id="chkContainer"> <input  type="checkbox" id="queryFeatureChk"> <label class="check-icon"></label></div>' + Resource.featureQuery,
        '</span>',
        '</div>',
        '<div class="form-group">',
        '<input id="urlInput" class="my-form-control" type="url" placeholder="enter url" />',
        '</div>',
        '<div class="form-group">',
        '<input id="nameInput" class="my-form-control" type="text" placeholder="enter layer name" />',
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
        '<div class="form-group" style="text-align : right;">',
        '<button class="cesium-button" data-dismiss="myModal-body" id="btnOk">' + Resource.confirm + '</button>',
        '</div>'
    ].join('');
    var scpUrlValueBak;
    var WebServicePan = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'click #btnOk' : 'onBtnOkClk',
            'click #btnCancel' : 'onBtnCancelClk',
            'change #typeInput' : 'onSelectChange',
            'click #chkContainer' : 'onCheckboxChange',
            'blur #urlInput' : 'onUrlInputBlur'
        },
        initialize : function(options){
            this.model = options.sceneModel;
            this.render();
            this.listenTo(this.model,'modalOpen',this.clear);
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.attr({'role' : 'tabpanel','id' : 'customServicePan'});
            this.$el.addClass('tab-pane');
            return this;
        },
        onBtnOkClk : function(evt){
            var url = $('#urlInput').val();
            var name = $('#nameInput').val();
            if(url === ''){
                Util.showErrorMsg(Resource.urlNotNullMsg);
                return;
            }
            if(name == ''){
                Util.showErrorMsg(Resource.urlNotNullMsg.layerNameNotNullMsg);
                return;
            }

            var type = $('#typeInput').val();
            
            var layerModel = new LayerModel({
            	url : url,
            	name : name,
            	type : type,
            	realName : name
            });
            if("S3M" == type){
            	if($('#queryFeatureChk').is(':checked') && $('#dataUrlInput').val() !== '' && $('#datasourceSel').val() && $('#datasetSel').val()){
            		var dataUrl = $('#dataUrlInput').val(),datasource = $('#datasourceSel').val(),dataset = $('#datasetSel').val();
                    Util.SCPURL_SET[name] = {
                        dataUrl : dataUrl,
                        datasource : datasource,
                        dataset : dataset
                    };
                    layerModel.strategy.attrQueryPars = {
                        url: dataUrl,
                        dataSourceName: datasource,
                        dataSetName: dataset,
                        keyWorld: 'SmID'
                    };
                }
            }
            this.model.addLayer(layerModel);
            evt.stopPropagation();
        },
        onBtnCancelClk : function(evt){
            evt.stopPropagation();
        },
        onSelectChange : function(evt){
            var target = evt.target;
            var value = target.value;
            if(value == 'IMAGERY' || value === 'TERRAIN'){
                $('#queryFeatureSpan').hide();
                $('#dataUrlDiv').hide();
            }
            else{
                $('#queryFeatureSpan').show();
                $('#queryFeatureChk').attr('checked',false);
            }
            evt.stopPropagation();
        },
        onCheckboxChange : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var chk = $(evt.target).prev();
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
            }
            var isChecked = chk[0].checked;
            if(isChecked){
                $('#dataUrlDiv').show();
                $('#urlInput').blur();
            }
            else{
                $('#dataUrlDiv').hide();
            }
            evt.stopPropagation();
        },
        onUrlInputBlur : function(evt){
            var target = evt.target;
            if($('#queryFeatureChk').is(':checked')){
                var scpUrl = $(target).val();
                if(scpUrlValueBak !== scpUrl && scpUrl !== ''){
                    scpUrlValueBak = scpUrl;
                    var scpUri = new Cesium.Uri(scpUrl);
                    var authority = scpUri.authority;
                    var path = scpUri.path;
                    var index1 = path.indexOf('/3D-');
                    var prefixPath = path.substring(0,index1);
                    var index2 = path.indexOf('/rest');
                    var name = path.substring(index1 + 4,index2);
                    var dataUrl = 'http://' + scpUri.authority + prefixPath + '/data-' + name + '/rest/data';
                    $('#dataUrlInput').val(dataUrl);
                    var dataSourceUrl = dataUrl + '/datasources.json';
                    $('#datasourceSel option').each(function(){
                        if($(this).val() !== 'undefined'){
                            $(this).remove();
                        }

                    });
                    $('#datasetSel option').each(function(){
                        if($(this).val() !== 'undefined'){
                            $(this).remove();
                        }
                    });
                    $('#dataUrlInput').val();
                    Cesium.when(Cesium.loadJson(dataSourceUrl),function(datasources){
                        var datasource = datasources['datasourceNames'][0];
                        var str = '<option value="{value}">{text}</option>'.replace('{value}',datasource).replace('{text}',datasource);
                        $('#datasourceSel').append(str);
                        var dataSetUrl = dataUrl + '/datasources/' + datasource + '/datasets.json';
                        Cesium.when(Cesium.loadJson(dataSetUrl),function(dataSets){
                            var names = dataSets['datasetNames'];
                            var arr = [];
                            var str = '';
                            for(var i = 0,j = names.length;i < j;i++){
                                var str = '<option>{text}</option>'.replace('{text}',names[i]);
                                arr.push(str);
                            }
                            arr.join('');
                            $('#datasetSel').append(arr);
                        });
                    });
                }
            }
            evt.stopPropagation();
        },
        clear : function(){
            $('#typeInput option:first').prop('selected','selected');
            $('#urlInput').val('');
            $('#nameInput').val('');
            $('#queryFeatureChk').attr('checked',false);
            $('#dataUrlDiv').hide();
            $('#datasourceSel option').each(function(){
                if($(this).val() !== 'undefined'){
                    $(this).remove();
                }

            });
            $('#datasetSel option').each(function(){
                if($(this).val() !== 'undefined'){
                    $(this).remove();
                }
            });
            $('#dataUrlInput').val();
        }
    });

    return WebServicePan;
});