define(['../views/Container', '../Util','./parsePortalJson'],function(Container, Util, parsePortalJson){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var sceneModel;
    // var appsRoot;
    var isPCBroswer;
    var htmlStr = [
        '<main class="myModal-content">',
        '<button aria-label="Close" id="closeScene" class="myModal-close"><span aria-hidden="true">&times;</span></button>',
        '<input id="portalTab1" type="radio" name="portalTab" checked>',
        '<label for="portalTab1" class="function-module-caption">' + Resource.SceneSave + '</label>',
        '<section id="portalTabContent1">',
            '<div class="function-module-content">',
                '<div style="overflow: auto;">',
                    '<div id="sceneImage" class="half">',
                       '<canvas id="sceneCanvas" style="width: 100%;margin: 35px 0 10px 0;"/>',
                       '<label id ="saveDateLabel" class="italic">'+Resource.SaveDate +'</label>',
                       '<label id="saveDate" class="italic" style="margin-left: 20px"></label>',
                    '</div>',
                    '<div id="sceneMessage" class="half" style="padding-left: 15px;">',
                        '<div class="function-module-sub-section">',
                            '<label class="function-module-sub-section-caption label-block">'+Resource.SceneName +'</label>',
                            '<input id="scenePortalName" class="input block"/>',
                        '</div>',
                        '<div class="function-module-sub-section">',
                            '<label class="function-module-sub-section-caption label-block">'+Resource.SceneLabel +'</label>',
                            '<input id="scenePortalTages" class="input block"/>',
                        '</div>',
                        '<div class="function-module-sub-section">',
                            '<label class="function-module-sub-section-caption label-block">'+Resource.author +'</label>',
                            '<input id="scenePortalUser" class="input block"/>',
                        '</div>',
                        '<div>',
                            '<label class="function-module-sub-section-caption label-block">'+Resource.description +'</label>',
                            '<textarea id="scenePortalDescription" class="input block" style="height: 55px;"></textarea>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<button type="button" id="updateUser" class="btn btn-info function-module-btn">' + Resource.UpdateCurrentScene + '</button>',
            '<button type="button" id="saveUser" class="btn btn-info function-module-btn function-module-btn-highlight">' + Resource.save + '</button>',
        '</section>',
   '</main>',
    ].join('');
    var savePortalForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #closeScene'  : 'onCloseSceneClk',
            'click #saveUser'  : 'onSaveUserClk',
            'click #updateUser'  : 'onUpdateUserClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            sceneModel = options.sceneModel;
            isPCBroswer = options.isPCBroswer;
            this.render();
            this.on('componentAdded',function(parent){
                var that = viewer.scene;
                document.getElementById("saveDate").innerText = getNowFormatDate();
                // appsRoot =Window.iportalAppsRoot;
                // var pattern = "/apps";
                // appsRoot = appsRoot.replace(new RegExp(pattern), "");
                var promise = that.outputSceneToFile();
                Cesium.when(promise,function (buffer) {
                    var canvas = document.getElementById("sceneCanvas");
                    var ctx = canvas.getContext("2d");
                    var img = new Image();
                    img.src = buffer;
                    img.onload = function () {
                        ctx.drawImage(img,0,0,298,150);
                    }
                });
                var sceneViewerUrl = window.location.href;
                if (sceneViewerUrl.indexOf("?action=") == -1) {
                    /*var appsRoot =Window.iportalAppsRoot;
                    var pattern = "/apps";
                    appsRoot = appsRoot.replace(new RegExp(pattern), "");*/
                    sceneViewerUrl = sceneViewerUrl.match(/earth(\S*)/)[1];
                    if(sceneViewerUrl != '/'){
                        var regexp = new RegExp("/");
                        var sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                        $.ajax({
                                type: "GET",
                                url: "../../web/scenes/" + sceneViewerUrl + ".json",
                                contentType: "application/json;charset=utf-8",
                                dataType: "json",
                                async: false,
                                success : function (json) {
                                    $('#scenePortalName').val(json.name);
                                    $('#scenePortalTages').val(json.tags);
                                    $('#scenePortalUser').val(json.nickname);
                                    $('#scenePortalDescription').val(json.description);
                                    $('#saveUser').val(Resource.saveAs);
                                }
                            }
                        )
                    }
                }
                /*if(Window.iportalAppsRoot && Window.iportalAppsRoot != "${resource.rootPath}"){
                    var sceneViewerUrl = window.location.href;
                    if (sceneViewerUrl.indexOf("?action=") == -1) {
                        var appsRoot =Window.iportalAppsRoot;
                        var pattern = "/apps";
                        appsRoot = appsRoot.replace(new RegExp(pattern), "");
                        sceneViewerUrl = sceneViewerUrl.match(/earth(\S*)/)[1];
                        if(sceneViewerUrl != '/'){
                            var regexp = new RegExp("/");
                            var sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                            $.ajax({
                                    type: "GET",
                                    url: appsRoot + "/web/scenes/" + sceneViewerUrl + ".json",
                                    contentType: "application/json;charset=utf-8",
                                    dataType: "json",
                                    async: false,
                                    success : function (json) {
                                        $('#scenePortalName').val(json.name);
                                        $('#scenePortalTages').val(json.tags);
                                        $('#scenePortalUser').val(json.nickname);
                                        $('#scenePortalDescription').val(json.description);
                                        $('#saveUser').val(Resource.saveAs);
                                    }
                                }
                            )
                        }
                    }
                }*/
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseSceneClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        },

        onSaveUserClk : function(evt){
            var me = this;
            if($('#scenePortalName').val() == ""){
                Util.showErrorMsg(Resource.saveErrorWhileSceneEmpty);
                return;
            }
            var canvas = document.getElementById("sceneCanvas");
            var base64 =  canvas.toDataURL("image/jpeg");
            base64 = base64.split(",")[1];
            var data = {};
            data.layers = [];
            for(var i = 0,j = sceneModel.layers.length;i < j;i++){
                var layerModel = sceneModel.layers.at(i);
                if(layerModel.get("type") !== "KML"){
                    var obj = layerModel.toJSON();
                    data.layers.push(obj);
                }
            }
            var camera = sceneModel.viewer.scene.camera;
            data.camera = {
                position : {
                    x : camera.position.x,
                    y : camera.position.y,
                    z : camera.position.z
                },
                heading : camera.heading,
                pitch : camera.pitch,
                roll : camera.roll
            };
            data.environmentState = {
                enableLighting : sceneModel.viewer.scene.globe.enableLighting,
                skyAtmosphereShow : sceneModel.viewer.scene.skyAtmosphere.show,
                enableFog : sceneModel.viewer.scene.fog.enabled
            };
            data.isSTKTerrain = sceneModel.isSTKTerrain;
            if(sceneModel.baseLayer && 'IMAGE' != sceneModel.baseLayer.get('type')){
                data.baseLayer = sceneModel.baseLayer.toJSON();
            }
            data.analysisObjects = sceneModel.analysisObjects;
            data.terrainObjects = sceneModel.terrainObjects;
            var saveData = {
                "name":$('#scenePortalName').val(),
                "tags":$('#scenePortalTages').val(),
                "userName":$('#scenePortalUser').val(),
                "description":$('#scenePortalDescription').val(),
                "content": JSON.stringify(data)
            };
            saveData =  JSON.stringify(saveData);
            $.ajax({
                type: "POST",
                url: "../../web/scenes.json",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: saveData,
                success : function (jsonResult) {
                    $.ajax({
                        type: "PUT",
                        url: "../../web/scenes/" + parseInt(jsonResult.newResourceID) + "/thumbnail.json",
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        data: base64,
                        success : function (result) {
                            me.$el.hide();
                            Util.showErrorMsg(Resource.saveSceneSuccess);
                            window.location.href= "../../apps/earth/index.html?id=" + jsonResult.newResourceID;
                        },
                        error: function(error)
                        {
                            Util.showErrorMsg(Resource.saveSceneFailed);
                        },
                    });
                },
                error: function()
                {
                    Util.showErrorMsg(Resource.saveSceneFailed);
                },
            });
        },

        onUpdateUserClk : function(evt){
            var me = this;
            var canvas = document.getElementById("sceneCanvas");
            var base64 =  canvas.toDataURL("image/jpeg",0.1);
            base64 = base64.split(",")[1];
            var data = {};
            data.layers = [];
            for(var i = 0,j = sceneModel.layers.length;i < j;i++){
                var layerModel = sceneModel.layers.at(i);
                if(layerModel.get("type") !== "KML"){
                    var obj = layerModel.toJSON();
                    data.layers.push(obj);
                }
            }
            var camera = sceneModel.viewer.scene.camera;
            data.camera = {
                position : {
                    x : camera.position.x,
                    y : camera.position.y,
                    z : camera.position.z
                },
                heading : camera.heading,
                pitch : camera.pitch,
                roll : camera.roll
            };
            data.environmentState = {
                enableLighting : sceneModel.viewer.scene.globe.enableLighting,
                skyAtmosphereShow : sceneModel.viewer.scene.skyAtmosphere.show,
                enableFog : sceneModel.viewer.scene.fog.enabled
            };
            data.isSTKTerrain = sceneModel.isSTKTerrain;
            if(sceneModel.baseLayer && 'IMAGE' != sceneModel.baseLayer.get('type')){
                data.baseLayer = sceneModel.baseLayer.toJSON();
            }
            data.analysisObjects = sceneModel.analysisObjects;
            data.terrainObjects = sceneModel.terrainObjects;

            var updateData = {
                "name":$('#scenePortalName').val(),
                "tags":$('#scenePortalTages').val(),
                "userName":$('#scenePortalUser').val(),
                "description":$('#scenePortalDescription').val(),
                "content": JSON.stringify(data)
            };
            updateData =  JSON.stringify(updateData);

            var sceneViewerUrl = window.location.href;
            sceneViewerUrl = sceneViewerUrl.match(/earth(\S*)/)[1];
            if(sceneViewerUrl != '/'){
                var regexp = new RegExp("/");
                var sceneViewerUrl = sceneViewerUrl.replace(regexp,"");
                $.ajax({
                        type: "PUT",
                        url: "../../web/scenes/" + sceneViewerUrl + ".json",
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        data: updateData,
                        success : function (json) {
                            $.ajax({
                                type: "PUT",
                                url: "../../web/scenes/" + sceneViewerUrl + "/thumbnail.json",
                                contentType: "application/json;charset=utf-8",
                                dataType: "json",
                                data: base64,
                                success : function (result) {
                                    me.$el.hide();
                                    Util.showErrorMsg(Resource.updateSceneSuccess);
                                }
                            })
                        },
                        error: function(error)
                        {
                            Util.showErrorMsg(Resource.updateSceneFailed);
                        },
                    })

            }
        },

    });
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }
    return savePortalForm;
});
