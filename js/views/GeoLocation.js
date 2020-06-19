define(['./Container', '../Util'],function(Container, Util){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
                   '<a id="btnLocation" class="btn btn-inverse" title="' + Resource.location + '" style="width : 32px;height : 32px;border-radius : 32px;padding : 5px 8px;">',
                   '<span id="location" class="smicon-location"></span>',
                   '</a>'
               ].join('');
    var GeoLocation = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options) {
            this.viewer = options.sceneModel.viewer || null;
            var ua = window.navigator.userAgent.toLowerCase();
            var me = this;
            if(ua.match(/MicroMessenger/i) == "micromessenger"){
            	me.isWechatBrowser = true;
            }else{
                me.isWechatBrowser = false;
            }
            /*if(window.location.protocol === 'http:'){ // http协议不支持定位服务
                this.$el.hide();
            }*/
            this.$el.hide(); // https下因为要访问谷歌api所以不FQ也访问不到，故暂时将该控件隐藏
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #btnLocation' : 'showLocation'
        },
        showLocation : function() {
        	var viewer = this.viewer;
        	var me = this;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    viewer.scene.camera.flyTo({
                        destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 500)
                    });
                }, function(error){
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            Util.showErrorMsg("用户拒绝了地理定位请求");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            Util.showErrorMsg("无法获得位置信息");
                            break;
                        case error.TIMEOUT:
                            Util.showErrorMsg("请求超时");
                            break;
                        case error.UNKNOWN_ERROR:
                            Util.showErrorMsg("未知错误");
                            break;
                    }
                });
            }
            else {
                Util.showErrorMsg(Resource.notSupportLocation);
            }
        }
    });
    return GeoLocation;
});
