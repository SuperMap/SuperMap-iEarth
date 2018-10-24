define(['../views/Container','../portal/loginWindow'],function(Container,SuperMapSSO){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var htmlStr = [
        '<a id="home" class="btn btn-inverse" title="' + Resource.home + '" style="width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
        '<span class="iconfont icon-home"></span>',
        '</a><br><br>',
        '<a id="portalOpen" class="btn btn-inverse" title="' + Resource.storage + '" style="display: none; width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
        '<span class="iconfont icon-yunduan1"></span>',
        '</a><br><br>',
        '<a id="portalShare" class="btn btn-inverse" title="' + Resource.share + '" style="display: none; width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
        '<span class="iconfont icon-fenxiang"></span>',
        '</a><br><br>',
        '<a id="login" class="btn btn-inverse" title="' + Resource.login + '" style="display: none; width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
        '<span class="iconfont icon-home"></span>',
        '</a>'
    ].join('');
    var portalForm = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options) {
            this.model = options.sceneModel;
            this.isPCBroswer = options.isPCBroswer;
            viewer = options.sceneModel.viewer;
            this.render();
            this.on('componentAdded',function(parent){
                if(Window.isSuperMapOL == "true"){
                    $("#portalShare").show();
                    $("#login").show();
                 }
            });
        },
        render : function() {
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #home' : 'home',
            'click #portalOpen' : 'portalOpen',
            'click #portalShare' : 'portalShare',
            'click #login' : 'login'
        },
        portalOpen : function() {
            var me = this;
            if(me.savePortalForm){
                $("#portalTab1").click();
                me.savePortalForm.$el.show();
                var promise = viewer.scene.outputSceneToFile();
                Cesium.when(promise,function (buffer) {
                    var canvas = document.getElementById("sceneCanvas");
                    //canvas.css("background","url(" + buffer + ")") ;
                    var ctx = canvas.getContext("2d");
                    var img = new Image();
                    img.src = buffer;
                    img.onload = function () {
                        ctx.drawImage(img,0,0,290,150)
                    }
                })
            }
            else
            {
                require(['./portal/savePortalForm'],function(savePortalForm){
                    var savePortalForm = new savePortalForm({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(savePortalForm);
                    me.savePortalForm = savePortalForm;
                    $("#portalTab1").click();
                    savePortalForm.$el.show();
                });
            }
        },

        portalShare : function() {
            var me = this;
            if(me.sharePortalForm){
                $("#portalTab2").click();
                me.sharePortalForm.$el.show();
            }
            else
            {
                require(['./portal/sharePortalForm'],function(sharePortalForm){
                    var sharePortalForm = new sharePortalForm({
                        sceneModel : me.model,
                        isPCBroswer : me.isPCBroswer
                    });
                    me.parent.addComponent(sharePortalForm);
                    me.sharePortalForm = sharePortalForm;
                    $("#portalTab2").click();
                    sharePortalForm.$el.show();
                });
            }

        },

        home : function () {
            viewer.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(110.60396458865515,34.54408834959379,30644793.325518917),
                duration: 5
            });
        },

        login : function (event) {
            window.reCallBack = function(){
                window.location.href = window.location.href;
            }
            var appsRoot =Window.iportalAppsRoot;
            var pattern = "/apps";
            appsRoot = appsRoot.replace(new RegExp(pattern), "");
            var loginURL = appsRoot + "/web/login?popup=true";
            SuperMapSSO.setLoginUrl(loginURL);
            SuperMapSSO.doSynchronize("reCallBack");
            SuperMapSSO.doLogin("reCallBack");
            if(event && event.preventDefault){
                event.preventDefault();
            }else{
                window.event.returnValue = false;
            }
            return false;
        }
    });
    return portalForm;
});
