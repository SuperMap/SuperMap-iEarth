define(['./Container','../lib/qrcode.min'],function(Container){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var viewer;
    var sceneID;
    var shareUrl;
    var htmlStr = [
        '<div class="graphing" id="skyForm" style="position: absolute;margin:auto; top: 0;left: 0;right: 0;bottom: 0;;width:600px;height: 250px;z-index: 9999;background-color: rgba(38, 38, 38,1);">',
        '<label class="shareID" style="float:left; text-align:left;font-size: 13px;color: #4183C4;">'+ "三维场景分享" +'</label>',
        '<button style="top: 10px;position: absolute;left: 90%;background-color: rgba(38, 38, 38, 0.75);" aria-label="Close" id="closeShareForm" class="myModal-close" title="关闭"><span aria-hidden="true">×</span></button><br><br><br>',
        '<div>',
        '<div id="map" style="height:220px;margin: 20px;float:left " >',
        '<label>密钥共享</label>',
        '<input  id="secretKey" class="input secretKey" style="color: #7c7c7c ;width: 200px">',
        '<a style="font-size: 22px;margin-left: 5px" id="CopySecretKey" class="iconfont icon-fuzhi"></a><br><br>',
        '<label>嵌入网页</label>',
        '<input  id="webpage" class="input webpage" style="color: #7c7c7c;width: 200px">',
        '<a id="CopyWebpage"  style="font-size: 22px;margin-left: 5px" class="iconfont icon-fuzhi"></a><br><br>',
        '<label style="font-style:italic;">离线服务只为本地分享</label>',
        '</div>',
        '<div style="float: right;text-align:center;margin:0 auto;">',
        '<div class="qrcode"></div>',
        '<label style="float: left">"扫一扫"分享iEarth</label><br>',
        '<div class="m-box" style="float: right;margin-right: 60px">',
        '<div class="icn"><a href="#" class="wb8" id="shareToFacebook"></a></div>',
        '</div>',
        '<div class="m-box" style="float: right;">',
        '<div class="icn"><a href="#" class="wb1" id = "shareToSinaWB" ></a></div>',
        '</div>',
        '<div class="m-box" style="float: right;">',
        '<div class="icn"><a href="#" class="wb2" id="shareToQzone"></a></div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');
    var shareForm = Container.extend({
        tagName: 'div',
        id: 'sceneAttribute',
        events : {
            'click #CopySecretKey'  : 'onCopySecretKeyClk',
            'click #CopyWebpage'  : 'onCopyWebpageClk',
            'click #shareToSinaWB'  : 'onShareToSinaWBClk',
            'click #shareToQzone'  : 'onShareToQzoneClk',
            'click #shareToFacebook'  : 'onShareToFacebookClk',
            'click #closeShareForm'  : 'onCloseShareFormClk',
        },
        template : _.template(htmlStr),
        initialize : function(options){
            viewer = options.sceneModel.viewer;
            this.sceneName = options.sceneName;
            sceneID = options.sceneID;
            this.render();
            this.on('componentAdded',function(parent){
                var me = this;
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
                $.ajax({
                    type: "GET",
                    url: keyUrl,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success : function (data) {
                        var keyLink = sceneLink + "/share?key=" + data.customResult;
                        shareUrl = keyLink;
                        $(".secretKey").val(keyLink);
                        $(".webpage").val("<iframe src=" + keyLink + "<iframe>");
                        $(".shareID").html(me.sceneName + "·三维场景分享");
                        var content = document.getElementsByClassName("qrcode");
                        var qrcode = new QRCode(content[content.length -1], {
                            width: 120,
                            height: 120
                        });
                        var defaultContent = keyLink;
                        qrcode.makeCode(defaultContent);
                    }
                });

            });
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },

        onCopySecretKeyClk : function(evt){
            var url=document.getElementById("secretKey");
            url.select();
            document.execCommand("Copy");
        },

        onCopyWebpageClk : function(evt){
            var url=document.getElementById("webpage");
            url.select();
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
        },

        onShareToSinaWBClk : function () {
            var _width = 600,
                _height = 600,
                _top = (screen.height-_height)/2,
                _left = (screen.width-_width)/2,
                _url = shareUrl;
            var _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136';
            _shareUrl += '&url='+ encodeURIComponent(_url||document.location);
            _shareUrl += '&content=' + 'utf-8';
            window.open(_shareUrl,'_blank','width='+_width+',height='+_height+',top='+_top+',left='+_left+',toolbar=no,menubar=no,scrollbars=no, resizable=1,location=no,status=0');
        },

        onShareToQzoneClk : function () {
            var _width = 600,
                _height = 600,
                _top = (screen.height-_height)/2,
                _left = (screen.width-_width)/2,
                _url = shareUrl;
            var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
            _shareUrl += 'url=' + encodeURIComponent(_url||document.location);
            window.open(_shareUrl,'_blank','width='+_width+',height='+_height+',top='+_top+',left='+_left+',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
          },

        onShareToFacebookClk : function () {
            var _width = 600,
                _height = 600,
                _top = (screen.height-_height)/2,
                _left = (screen.width-_width)/2;
            var _shareUrl = shareUrl;
            window.open(_shareUrl,'_blank','width='+_width+',height='+_height+',left='+_left+',top='+_top+',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
              }
    });


    return shareForm;
});
