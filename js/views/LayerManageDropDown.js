define(['./Container','jquery','bootstrapTree','spectrum','drag','../3DGIS/excavationRegion','../3DGIS/flattenRegion'],function(Container,$,bootstrapTree,spectrum,drag,excavationRegion,flattenRegion){
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        "<div id='layerTree'></div>",
    ].join('');
    var list;
    function calNode(ModeUrl){
        ModeUrl = ModeUrl.substring(0,ModeUrl.length-7) + "/data/path/indexData.dat";
        var nodelist = new Array();var nodedata = new Array();var datalist = new Array();
        var per = new Array();
        $.ajax({
            url: ModeUrl,
            dataType: 'xml',
            type: 'GET',
            async: false,
            timeout: 3000,
            error: function(xml)
            {
                return per;
            },
            success: function(xml)
            {
                $(xml).find("DatasetName").each(function(i)
                {
                    var id = $(this).children("id");
                    nodelist[i] = id.context.innerHTML;
                });
                $(xml).find("DatasetIDRange").each(function(i)
                {
                    var id = $(this).children("id");
                    nodedata[i] = id.context.innerHTML;
                });

            }
        });
        for(var i = 0;i < nodedata.length;i++){
            var t = nodedata[i].indexOf('_');
            var startline = parseInt( nodedata[i].substr(0,t));
            var endline = parseInt( nodedata[i].substr(t+1,nodedata[i].length-t-1));
            var cal = [];
            for(var k = 0;k <=endline - startline; k++){
                cal[k] = startline + k;
            }
            datalist[i] = cal;
        }
        per[0] = new Array();per[1] = new Array();
        per[0] = nodelist; per[1] = datalist;
        return per;
    }
    var LayerManageDropDown = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        initialize : function(options){
            this.model = options.sceneModel;
            this.viewer = options.sceneModel.viewer;
            this.render();
            var me = this;
            this.listenTo(this.model, 'layerAdded', function(layerModel) {
                me.addTreeNode(layerModel);
            });
            this.listenTo(this.model, 'markerAdded', function(name) {
                me.addMarkerNode(name);
            });
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.addClass('dropDown-container');
            this.$el.attr('id', 'layer-manage-drop-down');
            this.$el.css({'min-width' : '260px','text-align' : 'left', 'padding': '8px'});
            return this;
        },
        initZtree : function(){
        	var me = this;
            var $tree = $('#layerTree').treeview({
                data: [{text : Resource.layerList,selectable : false}],
                showIcon: false,
                showCheckbox: true,
                backColor : 'transparent',
                color : '#fff',
                onNodeChecked : function(evt,node){
                	var layerModel = node.layerModel;
                     var ids = [];
                    for(var i = 0;i < list[0].length;i++)
                    {
                        if(list[0][i] == node.text)
                        {
                            ids = list[1][i];
                        }
                    }
                	layerModel && layerModel.setVisible(true,ids);
                }, 
                onNodeUnchecked : function(evt,node){
                    var layerModel = node.layerModel;
                    var ids = [];
                	for(var i = 0;i < list[0].length;i++)
                    {
                        if(list[0][i] == node.text)
                        {
                           ids = list[1][i];
                        }
                    }
                	layerModel && layerModel.setVisible(false,ids);
                },
                onNodeRemove : function(evt,node){
                	var layerModel = node.layerModel;
                	if(!layerModel){
                		return;
                	}
                	if(confirm(Resource.confirmDelLayer)){
                		var pId = node.parentId;
                		var pNode = $('#layerTree').treeview('getNode',[pId]);
                		var len = pNode.nodes.length;
                		$('#layerTree').treeview('removeNode',[node]);
                		var type = node.layerModel.get('type');
                		if('MARKER' === type){
                    		me.model.removeMarker(node.layerModel);
                    		if(len == 1){
                    			me.model.defaultKmlLayer = undefined;
                    			delete me.rootNode['default KML'];
                    			if(!(me.rootNode['KML'].nodes && me.rootNode['KML'].nodes.length > 0)){
                    				delete me.rootNode['KML'];
                    			}
                    		}
                    	}
                    	else{
                    		me.model.removeLayer(node.layerModel);
                    		if(len == 1){
                    			delete me.rootNode[type];
                    		}
                    	}
                    }
                },
                onNodeSelected : function (evt,node) {
                    var layerModel = node.layerModel;
                    layerModel && layerModel.flyTo();
                    showLayerAttribute(layerModel.layer,me.viewer);
                },
                onNodeRightClicked: function (evt,node){
                    var layerModel = node.layerModel;
                    $("#sceneForm").hide();
                    $("#layerForm").show();
                    showLayerAttribute(layerModel.layer,me.viewer);
                }
            });
            this.rootNode = {};
            this.rootNode['root'] = $tree.treeview('getNode',0);
            this.tree = $tree;
        },
        addTreeNode : function(layerModel){
            var type = layerModel.get('type');
            var name = layerModel.get('name');
            var isVisible = layerModel.get('isVisible') == false ? false : true;
            if(!this.rootNode[type]){
                var nodeName = KeyMap[type] || type;
                this.rootNode[type] = this.tree.treeview('addNode',[this.rootNode.root,{text : nodeName,selectable : false}]);
            }
            var childNode = this.tree.treeview('addNode',[this.rootNode[type],{text : name,showDel : true,fontSize : '10pt',state : {checked : isVisible}}]);
            list = calNode(layerModel.get('url'));
            if(list[0].length>0){
                for(var i = 0;i < list[0].length;i++){
                    var sonNode = this.tree.treeview('addNode',[childNode,{text : list[0][i],showDel : true,fontSize : '10pt',state : {checked : isVisible}}]);
                    sonNode.layerModel = layerModel;
                }
            }
            childNode.layerModel = layerModel;
            if(name == 'default KML'){
            	this.rootNode[name] = childNode;
            	childNode.selectable = false;
            	childNode.showDel = false;
            	
            }
        },
        addMarkerNode : function(markerModel){
        	var name = markerModel.get('name');
        	var kmlRootNode = this.rootNode['default KML'];
        	if(!kmlRootNode){
        		return ;
        	}
        	var childNode = this.tree.treeview('addNode',[kmlRootNode,{text : name,showDel : true,fontSize : '10pt'}]);
            childNode.layerModel = markerModel;
        }
    });
    var KeyMap = {
        'S3M' : Resource.s3mLayer,
        'IMAGERY' : Resource.imageryLayer,
        'TERRAIN' : Resource.terrainLayer,
        'KML' : Resource.kmlLayer,
        'MARKER' : Resource.markerLayer
    };
    var initialization = false;
    var selectedLayer;
    function showLayerAttribute(layer,viewer){
        var layerName = document.getElementById('layerName');
        layerName.value = layer._name;
        selectedLayer = layer;
        if(!initialization){
            var foreColor = document.getElementById('foreColorPicker');
            foreColor.oninput = function(){
                var color = Cesium.Color.fromCssColorString(foreColor.value);
                selectedLayer.style3D.fillForeColor = color;
            };
            var lineColor = document.getElementById('lineColorPicker');
            lineColor.oninput = function(){
                var color = Cesium.Color.fromCssColorString(lineColor.value);
                selectedLayer.style3D.lineColor = color;
            };
            var selectColor = document.getElementById('selectColorPicker');
            selectColor.oninput = function(){
                var color = Cesium.Color.fromCssColorString(selectColor.value);
                selectedLayer.selectedColor = color;
            }
            $("#colorStyle").change(function(){
                var value = $(this).val();
                if(value=="0"){
                    selectedLayer.selectColorType = 0;
                }
                else if(value=="1"){
                    selectedLayer.selectColorType = 1;
                }
            })
            //图层可见性
            $("#display").click(function(evt){
                selectedLayer.visible = ! selectedLayer.visible;
            });
            $("#layerClose").click(function(){
                $("#layerForm").hide();
            })
            $("#breleaseColor").click(function(evt){
                selectedLayer.bReleaseColor = !selectedLayer.bReleaseColor;
            });
            $("#cullEnabled").click(function(evt){
                selectedLayer.cullEnabled = !selectedLayer.cullEnabled;
            });
            $("#multiChoose").click(function(evt){
                selectedLayer.multiChoose = !selectedLayer.multiChoose;
            });
            $('#shadowType').change(function(){
                var value = $(this).val();
                if(value=="chooseShadow"){
                    selectedLayer.shadowType = 1;
                }
                else if(value=="allShadow"){
                    selectedLayer.shadowType = 2;
                }
                else if(value=="noShadow"){
                    selectedLayer.shadowType = 0;
                }
            });
            
            $('#fillStyle').change(function(){
                var value = $(this).val();
                if(value=="0"){
                    selectedLayer.style3D.fillStyle = 0;
                }
                else if(value=="1"){
                    selectedLayer.style3D.fillStyle = 1;
                }
                else if(value=="2"){
                    selectedLayer.style3D.fillStyle = 2;
                }
            });
            var bottomAltitude = document.getElementById('bottomAltitude');
            bottomAltitude.onblur = function(){
                selectedLayer.style3D.bottomAltitude = parseInt(bottomAltitude.value);
                selectedLayer.refresh();
            }

            //最小最大可见高度设置
            var height = 152;
            var minHeight = document.getElementById('minHeight');
            var maxHeight = document.getElementById('maxHeight');

            minHeight.onblur = function () {
                selectedLayer.visibleDistanceMin = Number(minHeight.value);
            };
            maxHeight.onblur = function () {
                selectedLayer.visibleDistanceMax = Number(maxHeight.value);
            };
            // document.getElementById('minCurrentHeight').onclick = function () {
            //     minHeight.value = height;
            //     selectedLayer.visibleDistanceMin=height;
            // };
            // document.getElementById('minClear').onclick = function () {
            //     minHeight.value = 0;
            //     selectedLayer.visibleDistanceMin=0;
            // };
            // document.getElementById('maxCurrentHeight').onclick = function () {
            //     maxHeight.value = height;
            //     selectedLayer.visibleDistanceMax=height;
            // };
            // document.getElementById('maxClear').onclick = function () {
            //     maxHeight.value = "None";
            //     selectedLayer.visibleDistanceMax=47836027.5;
            // };
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
                selectedLayer.setObjsVisible(chooseIDs,true);
            }
            //仅选中对象隐藏
            chooseHiddenRadio.onchange = function () {
                 var chooseIDs = layer.getSelection();
                selectedLayer.setObjsVisible(chooseIDs,false);
            }
            viewer.scene.undergroundMode = true;
            $("#undergroundMode").change(function() {
                viewer.scene.undergroundMode = !viewer.scene.undergroundMode;
            });
            viewer.scene.terrainProvider.isCreateSkirt = false;
            $('#minimumZoomDistance').bind('input propertychange', function() {
                viewer.scene.screenSpaceCameraController.minimumZoomDistance = -(parseFloat(this.value));
            });
            $('#groundAlpha').bind('input propertychange', function() {
                viewer.scene.globe.globeAlpha = parseFloat(this.value);
            });
            $('#modelAlpha').bind('input propertychange', function() {
                selectedLayer.style3D.fillForeColor.alpha = parseFloat(this.value);
            });
            $("#excavationRegion").click(function(evt){
                excavationRegion.initializing(selectedLayer,viewer);
            });
            $("#delExcavationRegion").click(function(evt){
                excavationRegion.remove(selectedLayer);
            });
            $("#flattenRegion").click(function(evt){
                flattenRegion.initializing(selectedLayer,viewer);
            });
            $("#delFlattenRegion").click(function(evt){
                flattenRegion.remove(selectedLayer);
            });
            //还原
            initialize.onchange = function () {
                selectedLayer.setObjsVisible([],false);
            }
            initialization = true;
         }
        
    }
    return LayerManageDropDown;
});