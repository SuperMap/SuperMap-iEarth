define(['Cesium','../lib/SuperMap','../lib/Convert'],function(Cesium, Super, Convert) {
    'use strict';
    var $ = require('jquery');

  /*
  * 剖面分析对象
  * 画线截取剖面
  * 起点信息和终点信息
  * 分析结果小窗口显示
  *
  * */
    var handlerLine;
    var profile = function () {
    };

    profile.remove = function(viewer,parent){
        $('#profileLong1').val(0.0);
        $('#profileLat1').val(0.0);
        $('#profileAlt1').val(0.0);
        $('#profileLong2').val(0.0);
        $('#profileLat2').val(0.0);
        $('#profileAlt2').val(0.0);
         if(handlerLine){
             handlerLine.clear();
         }
        if(parent.profileForm){
            parent.profileForm.$el.hide();
            $("#pro").width(0);
            $("#pro").height(0);
        }
    };

    profile.initializing = function(viewer,parent){
        var scene = viewer.scene;
        var profile = new Cesium.Profile(scene);
        handlerLine = new Cesium.DrawHandler(viewer,Cesium.DrawMode.Line);
        handlerLine.activeEvt.addEventListener(function(isActive){
            if(isActive == true){
                viewer.enableCursorStyle = false;
                viewer._element.style.cursor = '';
                $('body').removeClass('drawCur').addClass('drawCur');
            }
            else{
                viewer.enableCursorStyle = true;
                $('body').removeClass('drawCur');
            }
        });
        handlerLine.movingEvt.addEventListener(function(windowPosition){
        });
        handlerLine.drawEvt.addEventListener(function(result) {
            var line=result.object;
            var startPoint = line._positions[0];
            var endPoint = line._positions[line._positions.length - 1];

            //起止点相关信息
            var scartographic = Cesium.Cartographic.fromCartesian(startPoint);
            var slongitude = Cesium.Math.toDegrees(scartographic.longitude);
            var slatitude = Cesium.Math.toDegrees(scartographic.latitude);
            var sheight = scartographic.height;

            var ecartographic = Cesium.Cartographic.fromCartesian(endPoint);
            var elongitude = Cesium.Math.toDegrees(ecartographic.longitude);
            var elatitude = Cesium.Math.toDegrees(ecartographic.latitude);
            var eheight = ecartographic.height;
            $('#profileLong1').val(slongitude);
            $('#profileLat1').val(slatitude);
            $('#profileAlt1').val(sheight);
            $('#profileLong2').val(elongitude);
            $('#profileLat2').val(elatitude);
            $('#profileAlt2').val(eheight);

            //剖面分析的起止点
            profile.startPoint = [slongitude, slatitude, sheight];
            profile.endPoint = [elongitude, elatitude, eheight];
            profile.extendHeight = 40;

            //剖面数据
            profile.getBuffer(function(buffer) {
                if(parent.profileForm){
                    var canvas = document.getElementById("pro");
                    canvas.height = profile._textureHeight;
                    canvas.width = profile._textureWidth;
                    var ctx = canvas.getContext("2d");
                    var imgData = ctx.createImageData(profile._textureWidth, profile._textureHeight);
                    imgData.data.set(buffer);
                    ctx.putImageData(imgData,0,0);
                    $("#pro").width(300);
                    $("#pro").height(150);
                    parent.profileForm.$el.show();
                }
                if(!parent.profileForm){
                    var me = parent;
                    //结果显示窗口
                    require(['./views/profileForm'],function(profileForm){
                        var profileForm = new profileForm({
                            buffer : buffer,
                            profile : profile,
                            sceneModel : me.model,
                            isPCBroswer : me.isPCBroswer
                        });
                        me.parent.addComponent(profileForm);
                        me.profileForm = profileForm;
                        profileForm.$el.show();
                    });
                }
            });
            profile.build();
        });
        handlerLine.activate();
    }

    return profile;
});