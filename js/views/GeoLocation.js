define(['./Container', 'Cesium'],function(Container, Cesium){
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
                            x.innerHTML="User denied the request for Geolocation.";
                            console.log();
                            break;
                        case error.POSITION_UNAVAILABLE:
                            x.innerHTML="Location information is unavailable."
                            break;
                        case error.TIMEOUT:
                            x.innerHTML="The request to get user location timed out."
                            break;
                        case error.UNKNOWN_ERROR:
                            x.innerHTML="An unknown error occurred."
                            break;
                    }
                });
            }
            else {
            	alert(Resource.notSupportLocation);
            }
        }
    });
    return GeoLocation;
});
