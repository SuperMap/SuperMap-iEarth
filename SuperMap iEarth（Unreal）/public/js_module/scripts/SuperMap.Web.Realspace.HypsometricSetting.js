//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.HypsometricSetting
// 功能：			 分层设色类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.HypsometricSetting = function(object) {
    /// <summary>分层设色对象</summary>
    SuperMap.Web.Realspace.HypsometricSetting.initializeBase(this);
    //this._innerHypsometricSetting = SuperMap.Web.Realspace.Utility._SceneControl._get_innerObjectManager();

    if(arguments.length === 0) {
        this.interval = 10;
        this.opacity = 1;
        this.minVisibleValue = -(1.7976931348623158e+308);
        this.maxVisibleValue = 1.7976931348623158e+308;
        this.displayMode = 1;
        var color = new SuperMap.Web.Core.Color(0, 1, 1);
        this.lineColor = color.toLongABGR();
        this.colorTable = new Object();
        this.colorTable.keys = [];
        this.colorTable.values = [];
        return;
    }

    this.interval = object.interval || 10;
    this.opacity = object.opacity || 1;
    this.minVisibleValue = object.minVisibleValue || -(1.7976931348623158e+308);
    this.maxVisibleValue = object.maxVisibleValue || 1.7976931348623158e+308;
    this.displayMode = object.displayMode || 1;
    var color = new SuperMap.Web.Core.Color(0, 1, 1);
    this.lineColor = object.lineColor || color.toLongABGR();
    this.colorTable = object.colorTable || null;
};

SuperMap.Web.Realspace.HypsometricSetting.prototype = {
    /*
    * 线的间隔
    */
    get_interval : function() {
        ///<return type="number"></value>
        return this.interval;
    },

    set_interval : function(value) {
        ///<param name="value" type="number"></param>
        if(typeof value !== "number") {
            this.interval = value;
        }
    },

    /*
    * 获取/设置线的不透明度,1是完全不透明,0完全透明
    */
    get_opacity : function() {
        ///<return type="number"></value>
        return this.opacity;
    },

    set_opacity : function(value) {
        ///<param name="value" type="number"></param>
        if(typeof value !== "number" || value < 0 || value > 1) {
            this.opacity = value;
        }
    },

    /*
    * 获取/设置最小可见值
    */
    get_minVisibleValue : function() {
        ///<return type="number"></value>
        return this.minVisibleValue;
    },

    set_minVisibleValue: function(value) {
        ///<param name="value" type="number"></param>
        if(typeof value === "number"){
            this.minVisibleValue = value;
        }
    },

    /*
    * 获取/设置最大可见值
    */
    get_maxVisibleValue : function() {
        ///<return type="number"></value>
        return this.maxVisibleValue
    },

    set_maxVisibleValue : function(value) {
        ///<param name="value" type="number"></param>
        if(typeof value === "number"){
            this.maxVisibleValue = value;
        }
    },

    /*
    * 获取/设置显示风格
    */
    get_displayMode: function() {
        ///<return type="SuperMap.Web.Realspace.HypsometricSettingDisplayMode"></value>
        return this.displayMode;
    },

    set_displayMode: function(value) {
        ///<param name="value" type="SuperMap.Web.Realspace.HypsometricSettingDisplayMode"></param>
        if(typeof value === "number"){
            this.displayMode = value;
        }
    },

    /*
    * 获取/设置线的颜色
    */
    get_lineColor : function() {
        ///<return type="SuperMap.Web.Core.Color"></value>
        var color =new SuperMap.Web.Core.Color();
        color.fromLongABGR(this.lineColor);
        return color;
    },

    set_lineColor : function(color) {
        ///<param name="color" type="SuperMap.Web.Core.Color"></param>
        if(color instanceof SuperMap.Web.Core.Color){
            this.lineColor = color.toLongABGR();
        }
    },

    /*
    * 获取颜色对照表
    */
    getColorTable : function() {
        ///<return type="array"></value>
        return this.colorTable;
    },

    /*
    * 设置颜色对照表
    */
    setColorTable: function(keys,colors) {
        ///<param name="keys" type="array"></param>
        ///<param name="colors" type="array"></param>
        if(keys instanceof Array && colors instanceof Array){
            if(this.colorTable === null){
                this.colorTable = new Object();
            }

            var intColors = new Array();
            for(var i = 0; i < colors.length; i++) {
                intColors[i] = colors[i].toLongABGR();
            }
            this.colorTable.keys = keys;
            this.colorTable.colors = intColors;
        }
    }
};
SuperMap.Web.Realspace.HypsometricSetting.registerClass('SuperMap.Web.Realspace.HypsometricSetting', Sys.Component, Sys.IDisposable);

