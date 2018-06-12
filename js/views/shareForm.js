define(['./Container','Cesium','drag','slider','echartsMin'],function(Container,Cesium, drag, slider,echarts){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var sceneID;
    var htmlStr = [
        '<div class="graphing" id="skyForm" style="position: absolute;margin:auto; top: 0;left: 0;right: 0;bottom: 0;;width:600px;height: 250px;z-index: 9999;background-color: rgba(38, 38, 38, 0.75);">',
        '<label id="shareID" style="float:left; text-align:left;font-size: 13px;color: lightgrey;">'+ "三维场景分享" +'</label>',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeShareForm" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button><br><br>',
        '<div id="map" style="height:220px;margin: 20px" >',
        '<label>密钥共享</label>',
        '<input  id="secretKey" class="input" style="color: #7c7c7c ">',
        '<a style="font-size: 25px" id="CopySecretKey" class="iconfont icon-fuzhi"></a>',
        '<label>嵌入网页</label>',
        '<input  id="webpage" class="input" style="color: #7c7c7c ">',
        '<a id="CopyWebpage"  style="font-size: 25px" class="iconfont icon-fuzhi"></a>',
        '</div>',
        '</div>'
    ].join('');
    var shareForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #CopySecretKey'  : 'onCopySecretKeyClk',
            'click #CopyWebpage'  : 'onCopyWebpageClk',
            'click #closeShareForm'  : 'onCloseShareFormClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            this.sceneName = options.sceneName;
            sceneID = options.sceneID;
            this.render();
            this.on('componentAdded',function(parent){
                $('#skyForm').myDrag({
                    parent:'body',
                    randomPosition:false,
                    direction:'all',
                    handler:false,
                    dragStart:function(x,y){},
                    dragEnd:function(x,y){},
                    dragMove:function(x,y){}
                });
                var appsRoot =Window.iportalAppsRoot;
                var pattern = "apps";
                appsRoot = appsRoot.replace(new RegExp(pattern), "");
                var keyUrl = appsRoot + "web/mycontent/keys/default.json";
                var  sceneLink = appsRoot + "apps/earth/" + sceneID;
                // request.sendRequest(keyUrl, "GET", "json", null, function(data) {
                //     var keyLink = sceneLink + "/share?key=" + data.customResult;
                // });
                $.ajax({
                    type: "GET",
                    url: keyUrl,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success : function (data) {
                        var keyLink = sceneLink + "/share?key=" + data.customResult;
                        document.getElementById("secretKey").value =keyLink;
                        document.getElementById("webpage").value = "<iframe src=" + keyLink + "<iframe>";
                    },
                    error: function()
                    {

                    },
                });
                document.getElementById('shareID').innerHTML = this.sceneName + "·三维场景分享";

            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        onCopySecretKeyClk : function(evt){
            var Url2=document.getElementById("secretKey");
            Url2.select(); // 选择对象
            document.execCommand("Copy");
        },
        onCopyWebpageClk : function(evt){
            var Url2=document.getElementById("webpage");
            Url2.select(); // 选择对象
            document.execCommand("Copy");
        },
        onCloseShareFormClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            this.$el.hide();
            return false;
        }
    });
    return shareForm;
});
