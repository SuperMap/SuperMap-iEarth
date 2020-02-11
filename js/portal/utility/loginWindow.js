/**
 * Created by liucy on 2015/4/25.
 */
//============================弹窗登录对接说明=======================/
//登录按钮点击事件绑定方法：SuperMapSSO.doLogin(true,callBackName);
//登出：SuperMapSSO.doLogin(false,callBackName);
//callBackName处请填写回调函数名称。isLogin填true(登录) or false(登出)
// 例如：回调函数为function a(){}，则SuperMapSSO.doLogin(true,"a");
//注意！！需自主设置CLIENT_LOGIN_URL为登录的URL地址，SSO_LOGOUT_URL为登出地址
//===================================================================/
window.SuperMapSSO={
    CLIENT_LOGIN_URL:"http://192.168.17.193:9090/cas-test-client/login?popup=true",
    SSO_LOGOUT_URL:"https://sso.supermap.com/v1/cas/logout",
    WINDOW_ID:"",
    CALLBACKNAME:"",
    /*
     * 设置登录URL
     */
    setLoginUrl:function(loginUrl){
        this.CLIENT_LOGIN_URL = loginUrl;
    },
    /* 加入登陆框
     * callBackName:回调函数名称
     */
    doLogin:function(callBackName){
        if (window.casEnable) {
            this.createDiv(true,this.CLIENT_LOGIN_URL,callBackName);
            window.SuperMapSSO.isShowWindow = true;
            return;
        }
        window.location.href = this.CLIENT_LOGIN_URL;
    },
    /*
     * 登录状态同步
     */
    doSynchronize:function(callBackName){
        this.CALLBACKNAME = callBackName;
        this.createDiv(false,this.CLIENT_LOGIN_URL,callBackName,true);
    },
    /*
     * 执行登出操作
     * redirectBackUrl:登出后自定义的回跳地址，未传递时默认为当前地址
     */
    doLogout:function(redirectBackUrl){
        var url = window.location.href;
        if(redirectBackUrl != undefined && redirectBackUrl != ""){
            url = redirectBackUrl;
        }
        window.location.href = this.SSO_LOGOUT_URL + "?service=" + url;
    },
    /*
     * 创建并显示弹出框（同步登陆状态，所以需要传入参数表示）
     * isShow:是否可见弹出框
     * serviceUrl:服务地址（登录或登出地址）
     * callBackName:回调函数名称
     */
    createDiv:function(isShow,serviceUrl,callBackName, isAutoClose){
        this.CALLBACKNAME = callBackName;
        var fullUrl, displayHtml="",
            windowDiv=document.createElement("div"),
            random=Math.round(Math.random()*1000);
            windowDiv.id="login_window"+random;
            this.WINDOW_ID=windowDiv.id;
            if(serviceUrl.indexOf("?")==-1){
                serviceUrl+="?";
            }
            fullUrl=serviceUrl+"&id="+windowDiv.id+"&callBackName="+callBackName;
        displayHtml=isShow?"":"display:none";
        //加入随机数，避免和客户端id冲突
        windowDiv.innerHTML="<style>.supermapSSO_loginWindow_cross{position:fixed;top:calc(25% + 12px); right:calc(50% - 180px + 12px); line-height: 0.6em; cursor:pointer; z-index:1;color:#c5c5c5; font-size:26px;font-family:microsoft yahei;transition:color 0.3s; } .supermapSSO_loginWindow_cross:hover{ color:#818181;}</style>"
                            +"<div style='position: fixed;top:0;left:0;width:100%; height:100%;background:rgba(0,0,0,0.6);"+displayHtml+"'></div>"
                            +"<span class='supermapSSO_loginWindow_cross' title=' + Resource.close + ' style='z-index:100001;"+displayHtml+"' onclick='SuperMapSSO.closeMe(\""+windowDiv.id+"\")'>&times;</span>"
                            +"<iframe style='position: fixed; top:0;left:0; width:100%; height:100%; border:none;z-index:100000;"+displayHtml+"' src='"+fullUrl+"'></iframe>";
        document.body.appendChild(windowDiv);

        if(isAutoClose){
            setTimeout("window.SuperMapSSO.closeMe('"+windowDiv.id+"')", 5000);
        }
    },
    /*
     * 判断是否要关闭登录框
     */
    checkIfCloseWindow:function(){
        console.log("测试关闭" + window.location.href);
        var url=window.location.search,
            _id=this.getQueryString(url,"id"),
            _callBack=this.getQueryString(url,"callBackName");
        if(_id!=null){
            window.parent.window.SuperMapSSO.closeMe(_id,_callBack);
        }
    },
    /*
     * 关闭登陆框
     */
    closeMe:function(id,callBackName) {
        window.SuperMapSSO.isShowWindow = false;
        console.log("关闭，当前url" +  window.location.href);
        var _element;
        if(id==undefined||id==""){
            id=this.WINDOW_ID;
        }
        _element=document.getElementById(id);
        if(_element != null){
            document.body.removeChild(_element);
        }
        if(callBackName != undefined && callBackName != ""){
            if(window[callBackName]){
                window[callBackName]();
            }
        }
    },

    /*
     * 根据请求体获得参数
     * urlSearch:请求体（?之后的）
     * name:查询参数
     */
    getQueryString : function(urlSearch,name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var parameter =urlSearch.substr(1).match(reg);
        if (parameter != null){
            return parameter[2];
        }else{
            return null;
        }
    }
};