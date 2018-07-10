define(['../views/Container', '../Util','./parsePortalJson'],function(Container, Util, parsePortalJson){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var sceneModel;
    var appsRoot;
    var isPCBroswer;
    var htmlStr = [
        '<main style="position : absolute;margin:auto;right: 0;left: 0; bottom:0; top : 0;width: 600px;height: 400px">',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeShare" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button>',

        '<input id="portalTab2" type="radio" name="portalTab">',
        '<label for="portalTab2" id="portalTab2Lab" style="font-size: 13px;">' + "iEarth场景" + '</label>',

        '<section id="portalTabContent2">',
        '<h1 class="title"></h1>',
            '<div id="scenePreview" class="service-items">',
            '</div>',
        '</section>',
   '</main>',
    ].join('');
    var sharePortalForm = Container.extend({
        tagName: 'div',
        id: 'sceneShare',
        events : {
            'click #closeShare'  : 'onCloseShareClk',
            'click #portalTab2' : 'onPortalTab2Clk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            sceneModel = options.sceneModel;
            isPCBroswer = options.isPCBroswer
            this.render();
            this.on('componentAdded',function(parent){
                // $('main').each(function(index){
                //     $(this).myDrag({
                //         parent:'body',
                //         randomPosition:false,
                //         direction:'all',
                //         handler:false,
                //         dragStart:function(x,y){},
                //         dragEnd:function(x,y){},
                //         dragMove:function(x,y){}
                //     });
                // });
                var that = viewer.scene;
                appsRoot =Window.iportalAppsRoot;
                var pattern = "/apps";
                appsRoot = appsRoot.replace(new RegExp(pattern), "");
            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCloseShareClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        },

        onPortalTab2Clk : function (evt) {
            var me = this;
            $.ajax({
                type: "GET",
                url: appsRoot + "/web/scenes.json",
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
                              // var thumbnail =  appsRoot + "/resources/thumbnail/scene/scene" + json.id + ".png";
                              // var str = '<div class="service-item"><div class="service-itemIcon"><img style="width:100%;height:100%;" src= ' + thumbnail + '  title=' + json.name + '><div class="service-itemAttr"><div class="service-itemBg"  id=' + json.name + '  ></div><div class="service-itemDes">iEarth:analyze scene</div><div class="service-itemUnSelected"><span class="fui-check"></span></div></div></div><div class="service-itemLabel">' + json.name + '</div></div>';
                              // $('#scenePreview').append(str);
                              // $("#"+json.name).on('click',function(){
                              //     $("#"+json.name).addClass('service-itemIcon-selected');
                              //     sceneModel.parsePortalJson(json);
                              //     me.$el.hide();
                              // });
                              var thumbnail =  appsRoot + "/resources/thumbnail/scene/scene" + json.id + ".png";
                              var sceneThumbnail = '<div class="service-item"><div class="service-itemIcon"><img style="width:100%;height:100%;" src= ' + thumbnail + ' title=' + json.name + '><div class="service-itemAttr"><div class="service-itemBg"  id=' + json.name + '  ></div><div class="service-itemDes">iEarth:analyze scene</div><div class="service-itemUnSelected"><span class="fui-check"></span></div></div></div><div class="service-itemLabel" id = ' + json.name +"label" + '>' + json.name + "·分享"+'</div></div>';
                              $('#scenePreview').append(sceneThumbnail);
                              $("#"+json.name).append("<div id='sceneShare' style='float: right;right: 0px;bottom: 0px;background-color: #3c5876'>" + json.userName + "</div>");
                              $("#"+json.name + "label").on('click',function () {
                                  $(this).addClass("visited");
                                  require(['views/shareForm'], function (shareForm) {
                                      var shareForm = new shareForm({
                                          sceneModel: sceneModel,
                                          isPCBroswer: isPCBroswer,
                                          sceneName : json.name,
                                          sceneID : json.id
                                      });
                                      sceneModel.viewerContainer.addComponent(shareForm);
                                      shareForm.$el.show();
                                  });
                              })
                              $("#"+json.name).on('click',function(){
                                  $("#"+json.name).addClass('service-itemIcon-selected');
                                  sceneModel.parsePortalJson(json);
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
        }
    });
    return sharePortalForm;
});
