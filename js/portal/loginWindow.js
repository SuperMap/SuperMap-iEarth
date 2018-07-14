define(['backbone','./util','./mapview','./SuperMap'], function(Backbone, Util, MapViewer, SuperMap) {
    var viewLang = MapViewer.Lang.View.Editor,showMessageTime = 3000,
        modalLang = MapViewer.Lang.View.Modal,
        //组件高度的缓存，主要是用来计算modal居中位置的
        HCACHE = 334,
        //登陆类型 SuperMap.Cloud.Security.IPORTAL OR SuperMap.Cloud.Security.SUPERMAPOL
        LOGIN_TYPE = SuperMap.Cloud.Security.IPORTAL,//-v- iclient 写错了IPORTAL
        //这是一串特殊字符字符串，用来验证的userName是否合法
        SPECTIAL_KEY = "[`·~!#$%^&*()|\\/:;'',.@<>?{}-+]=\"\"，。、》《？；【）（￥！；‘’“”",
        //站点定义的rootUrl
        BASE_URL = Util.getRootUrl();
    var LogWindow = Backbone.View.extend({
            tagName : 'div',
            className : 'modal fade',
            //attributes属性用来设置一些组件容器标签的属性
            attributes : {
                role : 'dialog',
                tabindex : -1
            },
            events : {
                'click .log-btn' : 'login',
                'keyup .log-name>input' : 'keyBoradLogName',
                'keypress  .log-psd>input' : 'keyBoradLog'
            },
            template : _.template(   '<div class="modal-dialog log-container" >' +
                                          '<div class="modal-content  log-content" >' +
                                              '<div class="modal-body">' +
                                                '<div data-dismiss="modal" class="close-btn supermapol-icons-clear"></div>' +
                                                '<div class="log-title">' + viewLang.logIn + '</div>' +
                                                '<div class="log-name"><input type="text" placeholder="' + viewLang.userName + '"></div>' +
                                                '<div class="log-psd"><input type="password" placeholder="' + viewLang.passWord + '"></div>' +
                                                '<div><button class="log-btn">' + viewLang.logInBtn + '</button></div>' +
                                              '</div>'+
                                          '</div>' +
                                      '</div>'),
            onLoginSuccessed:null,
            initialize : function() {
                var me = this;
                me.security = new SuperMap.Cloud.Security(LOGIN_TYPE, BASE_URL);
                me.render();
                me.$el.on('show.bs.modal', function(e) {
                    me.resetPosition();
                });
                $(window).on('resize', function() {me.resetPosition()});
            },
            render : function() {
                var me = this;
                this.$el.html(this.template());
                return this;
            },
            show : function(onLoginSuccessed) {
                this.onLoginSuccessed = onLoginSuccessed;
                var $modal = this.$el;
                $modal.modal({show : true, backdrop : 'static'});
            },
            hide : function() {
                this.$el.modal('hide');
            },
            resetPosition : function() {
                var marHeight = $(window).height()/2 - HCACHE/2;
                this.$('.modal-dialog').css({'margin-top' : marHeight});
            },
            keyBoradLog : function(e) {
                if(e.keyCode === 13) {
                    this.login();
                }
            },
        /**
         * 输入userName调用本方法
         * method keyBoradLogName
         * @param e
         */
            keyBoradLogName : function(e) {
                    var value = $(e.target).val();
                    if(this.checkUserName(value)) {
                        this.$('.log-btn').removeAttr('disabled').removeClass('disabled-log');
                    }
                    else{
                        this.$('.log-btn').attr('disabled', 'disabled').addClass('disabled-log');
                        Util.showMessage({
                            type : 'danger',
                            content : modalLang.unLegalInput
                        }, 500);
                    }
            },
        /**
         * 校验userName字符串是否合法
         * method checkUserName
         * @param value
         * @returns {boolean}
         */
            checkUserName : function(value) {
                for(var i = 0, length = value.length; i < length ; i++) {
                    if(SPECTIAL_KEY.indexOf(value[i]) > -1){
                        return false;
                    }
                }
                    return true;
            },
        /**
         * 利用SuperMap.Cloud.Security来登陆iportal
         * method login
         * no param
         */
            login : function() {
                var userName = this.$('.log-name>input').val(),
                    passWord = this.$('.log-psd>input').val();
                if(userName && passWord) {
                       this.security.login(userName, passWord, function (data) {
                           this.onLoginSuccessed && this.onLoginSuccessed.call(this,data);
                           this.trigger('loginsuccess');
                           this.hide();
                           Util.showMessage({
                               type: "success",
                               content: viewLang.logInSuccess
                           },showMessageTime);
                       }, function (err) {
                           Util.showMessage({
                               type: "danger",
                               content: viewLang.nameOrPassIsWrong
                           },showMessageTime);
                       }, this);
                }
                else {
                    Util.showMessage({
                        type : "warning",
                        content : viewLang.nameAndPassNotNull
                    },showMessageTime);
                }
            }
    });
        return LogWindow;
});