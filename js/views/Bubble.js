define(['./Container','jquery','../models/MarkerModel','../models/KmlLayerModel'],function(Container,$,MarkerModel,KmlLayerModel){
	"use strict";
    var _ = require('underscore');
    var htmlStr = [
               '<div class="se-popup-header"><span id="closeMarkerBtn" class="fui-cross se-popup-close"></span><label class="header-title">' + Resource.objectEditor + '</label></div>',
               '<div class="se-popup-content"><label class="title-name">' + Resource.title + '</label><input id="markerName" class="title-txt"><label class="description">' + Resource.description + '</label><textarea id="markerDes" class="description-txt"></textarea></div>',
               '<div class="se-popup-footer"><a id="saveMarkerBtn" class="se-popup-ok">' + Resource.confirm + '</a><span class="se-popup-division"></span><a id="delMarkerBtn" class="se-popup-cancel">' + Resource.cancel + '</a> </div>'
               ].join('');
	var Bubble = Container.extend({
		tagName : 'div',
		className : 'se-popup-container',
        template : _.template(htmlStr),
        events : {
            'click #saveMarkerBtn' : 'onSaveMarkerClk',
            'click #delMarkerBtn' : 'onDelMarkerClk',
            'click #closeMarkerBtn' : 'onCloseMarkerClk'
        },
        initialize : function(options) {
            this.model = options.sceneModel;
            this.render();
        },
        render : function() {
        	this.$el.html(this.template());
            return this;
        },
        onSaveMarkerClk : function(evt){
            var markerName = $('#markerName').val();
            var description = $('#markerDes').val();
            this.model.currentMarker.name = markerName;
            this.model.currentMarker.description = description;
            this.model.currentMarker.label.text = markerName;
            if(!this.model.defaultKmlLayer){
            	this.model.defaultKmlLayer = new KmlLayerModel({
                	name : 'default KML'
                });
            	this.model.addLayer(this.model.defaultKmlLayer);
            }
            this.model.addMarker(new MarkerModel({
            	name : markerName,
            	description : description
            }));
            this.$el.hide();
            $('#markerName').val('');
            $('#markerDes').val('');
            evt.stopPropagation();
        },
        onDelMarkerClk : function(evt){
        	this.model.removeCurrentMarker();
        	$('#markerName').val('');
            $('#markerDes').val('');
            this.$el.hide();
            evt.stopPropagation();
        },
        onCloseMarkerClk : function(evt){
        	this.model.removeCurrentMarker();
        	$('#markerName').val('');
            $('#markerDes').val('');
            this.$el.hide();
            evt.stopPropagation();
        }
	});
	return Bubble;
});