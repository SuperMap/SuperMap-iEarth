//@ sourceURL=UserPannel.js
define([
    "./Container"], function(Container) {
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        '<shiro:guest>',
        '<a class="btn btn-inverse userBtn-before" style="display: block;" title="登陆" id="btnLogin">',
        '<span style="top: -5px; bottom: 3px; right: 8px" class="fui-user"> </span>',
        '</a>',
        '</shiro:guest>',
        '<shiro:user>',
        '<a class="btn btn-inverse userBtn-before" style="display: block;" title="登出" data-toggle="dropdown" data-target="#myModal">',
        '<span style="top: -5px; bottom: 3px; right: 8px" class="fui-user"> </span>',
        '</a>',
        '<ul class="dropdown-menu" style="position : absolute;right : 0;left : auto;" role="menu">',
        '<li><a href="http://www.supermapol.com/web/mycontent/cloud/account" target="_blank">我的账户  : 11</a></li>',
        '<li><a href="http://www.supermapol.com/web/mycontent/message" target="_blank">我的消息</a></li>',
        '<li><a href="#" id="save">保存</a></li>',
        '<li class="divider"></li>',
        '<li><a id="btnLogout" href="">退出</a></li>',
        '</ul>',
        '</shiro:user>'
    ].join('');
    var UserPannel = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'click #save' : 'onSaveClk',
            'click #btnLogin' : 'onBtnLoginClk'
        },
        initialize : function(options) {
            this.model = options.sceneModel;
            this.render();
        },
        render : function() {
        	var str = $('#userPannelContent').html();
            this.$el.html(str);
            return this;
        },
        onSaveClk : function(evt){
            if(this.model){
                this.model.save();
            }
            evt.stopPropagation();
        },
        onBtnLoginClk : function(event){
        	window.SuperMapSSO.doLogin("reCallBack");
        	 if(event && event.preventDefault){
     	        event.preventDefault();
     	    }else{
     	        window.event.returnValue = false;
     	    }
     	    return false;
        }
    });
    //window.SuperMapSSO.setLoginUrl('http://127.0.0.1/SuperMapEarth/login?popup=true');
    return UserPannel;
});
