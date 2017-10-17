define(['./Container','jquery','bootstrapTree'],function(Container,$,bootstrapTree){
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        "<div id='layerTree'></div>"
    ].join('');
    var LayerManageDropDown = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        initialize : function(options){
            this.model = options.sceneModel;
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
            var height = $('body').height()*0.85 + 'px';
            this.$el.css({'height' : height,'min-width' : '260px','text-align' : 'left'});
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
                	layerModel && layerModel.setVisible(true);
                }, 
                onNodeUnchecked : function(evt,node){
                	var layerModel = node.layerModel;
                	layerModel && layerModel.setVisible(false);
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
    return LayerManageDropDown;
});