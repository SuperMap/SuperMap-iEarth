define([ "views/uicomponents/container", "lib/tools/delay-caller",'util' ], function(Container, DelayCaller, Util) {
    var $ = require("jquery"), widthCache = 0, heightCache = 0, DURATION = 50, $window = $(window);
    var viewlang = MapViewer.Lang.View.Mapview;
    var MapView = Container.extend({
        el : "#mapviewer",
        lastMapJson: null,
        initialize : function() {
            var delayCaller = new DelayCaller({
                duration : DURATION,
                func : this.resizeHandler.bind(this),
                context : this
            });
            var mapView = this;
            Container.prototype.initialize.apply(this, arguments);
            widthCache = $window.width();
            heightCache = $window.height();
            this.listenTo(this.model, "change:title", this.changeTitle);
            this.listenTo(this.model, "change",function(){
                //判断从地图界面加载地图是否结束,mapModel会被修改三次,  fetch / setCenter / set loading三次
               this.model.tag++;
               if(this.model.tag > 3){
                   this.model.isSaved = false;
               }
            });
            this.listenTo(this.model, "beforesavevector", function(){
                Util.showWarningMessage(viewlang.isSaving);
            });
            this.listenTo(this.model, "savesucceed", function(){
                Util.closeMessage();
            });
            this.listenTo(this.model, "savefailed", function(){
                Util.closeMessage();
            });
            $window.resize(function() {
                widthCache = $window.width();
                heightCache = $window.height();
                delayCaller.delayCall();
            });
            $window[0].onbeforeunload = function() {
                var readOnly = mapView.model.readOnly;
                if (!readOnly && !mapView.model.isSaved) {
                    return MapViewer.Lang.View.Mapview.comformToleave;
                }
            };

        },
        resizeHandler : function() {
            this.trigger('mapviewresize', widthCache, heightCache);
        },
        getHeight : function() {
            return heightCache;
        },
        getWidth : function() {
            return widthCache;
        },
        changeTitle : function() {
            $("title").text(this.model.get("title"));
        },
        render : function() {
            return this;
        }
    });
    return MapView;
});