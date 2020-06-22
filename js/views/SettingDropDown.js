define(['./Container'],function(Container){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
               "<div id='settingDropDown' style='min-width : 140px;border-radius : 4px;text-align : left;padding : 10px;'>",
               '<div><div class="squaredTwo" id="atomsphereRender"><input type="checkbox" checked=""><label class="check-icon"></label></div><label>' + Resource.skyAtmosphereEffect + '</label></div>',
               '<div><div class="squaredTwo" id="lightRender"><input type="checkbox" checked=""><label class="check-icon"></label></div><label>' + Resource.lightEffect + '</label></div>',
               '<div><div class="squaredTwo" id="fogEnabled"><input type="checkbox" checked=""><label class="check-icon"></label></div><label>' + Resource.fogEffect + '</label></div>',
               '<div><div class="squaredTwo" id="depthAgainst"><input type="checkbox" checked=""><label class="check-icon"></label></div><label>' + Resource.depthAgainst + '</label></div>',
               "</div>"
               ].join('');
    var SettingDropDown = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
        	'click #atomsphereRender' : 'onChkAtomsphere',
        	'click #lightRender' : 'onChkLight',
        	'click #fogEnabled' : 'onChkFogEnabled',
            'click #depthAgainst' : 'onChkdepthAgainst'
        },
        initialize : function(options){
        	this.sceneModel = options.sceneModel;
        	this.viewer = this.sceneModel.viewer;
        	var me = this;
        	this.on('componentAdded',function(parent){
            	var enableLighting = me.viewer.scene.globe.enableLighting;
            	var saShow = me.viewer.scene.skyAtmosphere.show;
            	$('#lightRender input[type="checkbox"]').prop('checked',enableLighting);
            	$('#atomsphereRender input[type="checkbox"]').prop('checked',saShow);
            });
        	this.render();
        },
        render : function(){
        	this.$el.html(this.template());
        	this.$el.addClass('dropDown-container');
            this.$el.attr('role' , "menu").attr('aria-labelledby','settingBtn');
            return this;
        },
        onChkAtomsphere : function(evt){
        	var chk = $(evt.target).prev();
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
            }
        	var scene = this.viewer.scene;
        	scene.skyAtmosphere.show = !scene.skyAtmosphere.show;
        	this.$el.parent().removeClass('open');
        },
        
        onChkLight : function(evt){
        	var chk = $(evt.target).prev();
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
            }
        	var scene = this.viewer.scene;
        	scene.globe.enableLighting = !scene.globe.enableLighting;
        	this.$el.parent().removeClass('open');
        },
        onChkFogEnabled : function(evt){
        	var chk = $(evt.target).prev();
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
            }
        	var scene = this.viewer.scene;
        	scene.fog.enabled = !scene.fog.enabled ;
        	this.$el.parent().removeClass('open');
        },
        onChkdepthAgainst : function(evt){
            var chk = $(evt.target).prev();
            if(chk && chk[0]){
                chk[0].checked = !chk[0].checked;
            }
            var scene = this.viewer.scene;
            scene.globe.depthTestAgainstTerrain = !scene.globe.depthTestAgainstTerrain;
            this.$el.parent().removeClass('open');
        }

        
    });
    return SettingDropDown;
});