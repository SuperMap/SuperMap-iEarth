//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.FlyManager
// 功能：			 飞行操作类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.FlyManager = function(scenecontrol) {
    /// <summary>飞行操作对象</summary>
    SuperMap.Web.Realspace.FlyManager.initializeBase(this);
    this.flyRoutes = new SuperMap.Web.Realspace.FlyRoutes();
    this.flystatus = null;
};

SuperMap.Web.Realspace.FlyManager.prototype = {
    dispose : function() {
        ///<returns type="void">析构函数</returns>
        this._innerFlyManager = null;
    },
    /*
    *FlyStatusChange：飞行状态改变回调函数
     */
    FlyStatusChange : function(flystatus, stopEvent, pauseEvent, flyEvent) {
        /// <param name="_flystatus" type="SuperMap.Web.Realspace.FlyStatus">飞行状态</param>
        /// <param name="stopEvent" type="function">停止回调函数</param>
        /// <param name="pauseEvent" type="function">暂停回调函数</param>
        /// <param name="flyEvent" type="function">飞行回调函数</param>
        switch(flystatus) {
            case 0:
                stopEvent();
                break;
            case 1:
                pauseEvent();
                break;
            case 2:
                flyEvent();
                break;
            default:
        }
    },

    /*
    *routes：获取路线集合
     */
    get_routes : function() {
        /// <summary>获取飞行路线对象</summary>
        ///<value type="SuperMap.Web.Realspace.FlyRoutes">飞行路线对象</value>

        return this.flyRoutes;
    },

    /*
    *play：按照返回的路线集合（Routes）指定的路线开始飞行，或继续进行中断的飞行。
     */
    play : function() {
        /// <summary>沿路线飞行</summary>
        ///<returns type="void"></returns>

        var cmd = {
            func : "Play",
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYMANAGER
        }

        emitUIInteraction(cmd);
        this.set_flystatus(SuperMap.Web.Realspace.FlyStatus.FPLAY, this.FlyStatusChange);
    },

    /*
    *pause：暂停当前飞行
     */
    pause : function() {
        /// <summary>暂停飞行</summary>
        ///<returns type="void"></returns>

        var cmd = {
            func : "Pause",
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYMANAGER
        }

        emitUIInteraction(cmd);
        this.set_flystatus(SuperMap.Web.Realspace.FlyStatus.FPAUSE, this.FlyStatusChange);
    },

    /*
    *Stop： 停止当前飞行。
     */
    stop : function() {
        /// <summary>停止飞行</summary>
        ///<returns type="void"></returns>

        var cmd = {
            func : "Stop",
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYMANAGER
        }

        emitUIInteraction(cmd);
        this.set_flystatus(SuperMap.Web.Realspace.FlyStatus.FSTOP, this.FlyStatusChange);
    },


    set_playRate : function(playRate) {
        if(typeof playRate !== "number") {
            return;
        }
        var cmd = {
            func : "SetPlayRate",
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYMANAGER,
            arguments : {
                playRate : playRate
            }
        }

        emitUIInteraction(cmd);
    },


    /*
    *set_flystatus：设置飞行状态
     */
    set_flystatus : function(_flystatus, FlyStatusChange) {
        /// <param name="_flystatus" type="SuperMap.Web.Realspace.FlyStatus">飞行状态</param>
        /// <param name="FlyStatusChange" type="function">回调函数</param>
        if (this.flystatus !== _flystatus){
            this.flystatus = _flystatus;
        if (typeof(stopEvent) === "undefined"){
          stopEvent = function(){};
        }
        if (typeof(pauseEvent) === "undefined"){
          pauseEvent = function(){};
        }
        if (typeof(flyEvent) === "undefined"){
          flyEvent = function(){};
        }
        FlyStatusChange(this.flystatus,stopEvent,pauseEvent,flyEvent);
      }
    }
};
SuperMap.Web.Realspace.FlyManager.registerClass('SuperMap.Web.Realspace.FlyManager', Sys.Component, Sys.IDisposable);
