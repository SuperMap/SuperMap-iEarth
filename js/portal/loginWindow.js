define(function(){
window.SuperMapSSO = {
    CLIENT_LOGIN_URL: "http://192.168.17.193:9090/cas-test-client/login?popup=true",
    SSO_LOGOUT_URL: "https://sso.supermap.com/v1/cas/logout",
    WINDOW_ID: "",
    CALLBACKNAME: "",
    setLoginUrl: function(e) {
        this.CLIENT_LOGIN_URL = e
    },
    doLogin: function(e) {
        this.createDiv(!0, this.CLIENT_LOGIN_URL, e),
        window.SuperMapSSO.isShowWindow = !0
    },
    doSynchronize: function(e) {
        this.CALLBACKNAME = e,
        this.createDiv(!1, this.CLIENT_LOGIN_URL, e, !0)
    },
    doLogout: function(e) {
        var t = window.location.href;
        e != undefined && e != "" && (t = e),
        window.location.href = this.SSO_LOGOUT_URL + "?service=" + t
    },
    createDiv: function(e, t, n, r) {
        this.CALLBACKNAME = n;
        var i, s = "", o = document.createElement("div"), u = Math.round(Math.random() * 1e3);
        o.id = "login_window" + u,
        this.WINDOW_ID = o.id,
        t.indexOf("?") == -1 && (t += "?"),
        i = t + "&id=" + o.id + "&callBackName=" + n,
        s = e ? "" : "display:none",
        o.innerHTML = "<style>.supermapSSO_loginWindow_cross{position:fixed;top:calc(25% + 12px); right:calc(50% - 180px + 12px); line-height: 0.6em; cursor:pointer; z-index:1;color:#c5c5c5; font-size:26px;font-family:microsoft yahei;transition:color 0.3s; } .supermapSSO_loginWindow_cross:hover{ color:#818181;}</style><div style='position: fixed;top:0;left:0;width:100%; height:100%;background:rgba(0,0,0,0.4);z-index: 99999;" + s + "'></div>" + "<span class='supermapSSO_loginWindow_cross' title=' + Resource.close + ' style='z-index:100001;" + s + "' onclick='SuperMapSSO.closeMe(\"" + o.id + "\")'>&times;</span>" + "<iframe style='position: fixed; top:0;left:0; width:100%; height:100%; border:none;z-index:100000;" + s + "' src='" + i + "'></iframe>",
        document.body.appendChild(o),
        r && setTimeout("window.SuperMapSSO.closeMe('" + o.id + "')", 5e3)
    },
    checkIfCloseWindow: function() {
        console.log("测试关闭" + window.location.href);
        var e = window.location.search
          , t = this.getQueryString(e, "id")
          , n = this.getQueryString(e, "callBackName");
        t != null && window.parent.window.SuperMapSSO.closeMe(t, n)
    },
    closeMe: function(e, t) {
        window.SuperMapSSO.isShowWindow = !1,
        console.log("关闭，当前url" + window.location.href);
        var n;
        if (e == undefined || e == "")
            e = this.WINDOW_ID;
        n = document.getElementById(e),
        n != null && document.body.removeChild(n),
        t != undefined && t != "" && window[t] && window[t]()
    },
    getQueryString: function(e, t) {
        var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)","i")
          , r = e.substr(1).match(n);
        return r != null ? r[2] : null
    }
};
return window.SuperMapSSO;
});
