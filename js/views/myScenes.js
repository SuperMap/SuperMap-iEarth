define(['./Container','jquery','../models/LayerModel','../Util','./shareForm'],function(Container,$,LayerModel,Util,shareForm){
    var _ = require('underscore');
    var htmlStr = [
        '<div class="form-group has-success">',
        '<div id="scenePreview" class="service-items">',
        '</div>',
        '</div>'
    ].join('');
    var myScenes = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'change input' : 'onInputChange',
            'click #a'  : 'onBtnMyScenesClk'
        },
        initialize : function(options){
            this.model = options.sceneModel;
            this.isPCBroswer = options.isPCBroswer
            this.render();
            this.on('componentAdded',function(parent){
                    var me = this;
                    $("#getMyScenes").on("click",function(){
                        $.ajax({
                            type: "GET",
                            url: "../../web/mycontent/scenes.json",
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success : function (jsonResult) {
                                $('#scenePreview').empty();
                                for(var i = 0; i < jsonResult.content.length; i++){
                                    var item = jsonResult.content[i];
                                    var id = item.id;
                                    $.ajax({
                                            type: "GET",
                                            url: appsRoot + "/web/scenes/" + id + ".json",
                                            contentType: "application/json;charset=utf-8",
                                            dataType: "json",
                                            success : function (json) {
                                                var thumbnail;
                                                if(json.content) {
                                                    thumbnail = appsRoot + "/resources/thumbnail/scene/scene" + json.id + ".png";
                                                }else{
                                                    // thumbnail = Window.iportalAppsRoot + '/static/iearth/'+'images/sceneThumbnail.png';
                                                    thumbnail = './images/sceneThumbnail.png';
                                                }
                                                var sceneThumbnail = '<div class="service-item"><div class="service-itemIcon"><img style="width:100%;height:100%;" src= ' + thumbnail + ' title=' + json.name + '><div class="service-itemAttr"><div class="service-itemBg"  id=' + json.name + '  ></div><div class="service-itemDes">iEarth:analyze scene</div><div class="service-itemUnSelected"><span class="fui-check"></span></div></div></div><div class="service-itemLabel" id = ' + json.name +"label" + '>' + json.name + "·分享"+'</div></div>';
                                                $('#scenePreview').append(sceneThumbnail);
                                                $("#"+json.name).append("<div id='sceneShare' style='float: right;right: 0px;bottom: 0px;background-color: #3c5876'>" + json.userName + "</div>");
                                                $("#"+json.name + "label").on('click',function () {
                                                    $(this).addClass("visited");
                                                    require(['views/shareForm'], function (shareForm) {
                                                        var shareForm = new shareForm({
                                                            sceneModel: me.model,
                                                            isPCBroswer: me.isPCBroswer,
                                                            sceneName : json.name,
                                                            sceneID : json.id
                                                        });
                                                        me.model.viewerContainer.addComponent(shareForm);
                                                        shareForm.$el.show();
                                                    });
                                                })
                                                $("#"+json.name).on('click',function(){
                                                    $("#"+json.name).addClass('service-itemIcon-selected');
                                                    if(json.content){
                                                        me.model.parsePortalJson(json);
                                                    }else {
                                                        var cesiumScene =  json.url;
                                                        var url = cesiumScene.match(/realspace(\S*)/)[1];
                                                        var regexp = new RegExp(url);
                                                        cesiumScene = cesiumScene.replace(regexp,"");
                                                        me.model.openScene(cesiumScene);
                                                    }
                                                });
                                            }
                                        }
                                    )
                                }
                            },
                            error: function()
                            {
                                Util.showErrorMsg("场景信息获取失败！请先登陆iPortal或Online账户......");
                            },
                        });
                    });
            });
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.attr({'id' : 'myScenes','role' : 'tabpanel'});
            this.$el.addClass('tab-pane');
            return this;
        }
    });
    return myScenes;
});