define(['./Container','./WebServicePan','./CustomServicePan','./LocalFilePan','./myScenes'],function(Container,WebServicePan,CustomServicePan,LocalFilePan,myScenes){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        "<div class='myModal-content'>",
            "<div class='myModal-header'>",
                "<button aria-label='Close' class='myModal-close' title='" + Resource.close + "' id='btnCloseModal'><span aria-hidden='true'>&times;</span></button>",
                "<ul class='nav nav-tabs' role='tablist'>",
                    '<li role="presentation" id="servicePan" class="active"><a href="#webServicePan" aria-controls="home" role="tab" data-toggle="tab">' + Resource.smOnlineService + '</a></li>',
                    '<li role="presentation"><a href="#customServicePan" aria-controls="home" role="tab" data-toggle="tab">' + Resource.customService + '</a></li>',
                    '<li role="presentation"><a href="#localFilePan" aria-controls="profile" role="tab" data-toggle="tab">' + Resource.localKML + '</a></li>',
                    '<li role="presentation" id = "getMyScenes" style="display: none"><a href="#myScenes" aria-controls="profile" role="tab" data-toggle="tab">' + Resource.myScenes + '</a></li>',
                '</ul>',
            "</div>",
            '<div class="myModal-body">',
                '<div class="tab-content">',
                '</div>',
            '</div>',
        "</div>"
    ].join('');
    var ModalFrame = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'click #btnCloseModal'  : 'onBtnCloseModalClk'
        },
        initialize : function(options){
            this.model = options.sceneModel;
            this.isPCBroswer = options.isPCBroswer;
            this.render();
            var modalFrame = this;
            this.on('componentAdded',function(parent){

                var webServicePan = new WebServicePan({
                    sceneModel : options.sceneModel,
                    isPCBroswer : this.isPCBroswer
                });
                modalFrame.addComponent(webServicePan);
                if(modalFrame.isPCBroswer){
                	var customServicePan = new CustomServicePan({
                        sceneModel : options.sceneModel
                    });
                    modalFrame.addComponent(customServicePan);
                    var localFilePan = new LocalFilePan({
                        sceneModel : options.sceneModel
                    });
                    modalFrame.addComponent(localFilePan);
                    var portalScenes = new myScenes({
                        sceneModel : options.sceneModel,
                        isPCBroswer : this.isPCBroswer
                    });
                    modalFrame.addComponent(portalScenes);
                }
            });
            this.listenTo(this.model,'layerAdded',function(){
                this.$el.hide();
            });
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.addClass('myModal');
            var tabContainer = this.$('.tab-content');
            this.setContainerElement(tabContainer);
            return this;
        },
        onBtnCloseModalClk : function(evt){
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
    return ModalFrame;
});