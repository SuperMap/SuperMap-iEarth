//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.TerrainLayer
// 功能：			 地形图层类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.TerrainLayer = function(strServerRootUrl, strLayerName, strDataName) {
    /// <summary>地形图层对象</summary>
  	///<param name="strServerRootUrl" type="String">服务器地址</param>
  	///<param name="strLayerName" type="String">图层名称</param>
  	///<param name="strDataName" type="String">数据名称</param>
  	///<returns type="SuperMap.Web.Realspace.TerrainLayer">返回地形图层对象</returns>
    SuperMap.Web.Realspace.TerrainLayer.initializeBase(this);

    if(arguments.length === 0){
        return;
    }

    this.url = strServerRootUrl;
    this.name = strLayerName;
    this.dataName = strDataName;
};

SuperMap.Web.Realspace.TerrainLayer.prototype ={
    /*
  	*initialized属性，判断图层对象是否构建成功
  	*/
  	initialized : function() {
        ///<returns type="Boolean">是否成功</returns>
    	if(typeof this.name !== "undefined") {
            return true;
        }
        return false;
  	},

  	/*
  	*属性: 图层名
  	*/
  	get_name : function() {
  	    ///<value type="String">图层名称</value>
        return this.name || null;
  	},

    /*
  	*属性: 图层别名
  	*/
  	get_caption : function() {
  	    ///<value type="String">图层别名</value>
        if(typeof this.name === "undefined") {
            return null;
        }

        var cmd = {
            func : "GetCaption",
            name : this.name,
            needResult : true
        }

  	},

	set_caption : function(caption) {
        if(typeof this.name === "undefined" || typeof caption !== "string") {
            return;
        }

        var cmd = {
            func : "SetCaption",
            name : this.name,
            needResult : false,
            arguments : {
                caption : caption
            }
        }
        
	},

    /*
  	* 属性:图层描述信息
  	*/
  	get_description : function() {
  	    ///<value type="String">图层描述信息</value>
        if(typeof this.name === "undefined") {
            return null;
        }

        var cmd = {
            func : "GetDescription",
            name : this.name,
            needResult : true
        }
    
  	},

  	set_description : function(description) {
        if(typeof this.name === "undefined" || typeof description !== "string") {
            return;
        }

        var cmd = {
            func : "SetDescription",
            name : this.name,
            needResult : false,
            arguments : {
                description : description
            }
        }
  	},

  	/*
  	*属性:数据网络路径
  	*/
   	get_dataName : function() {
   	    ///<value type="String">图层数据存储路径</value>
   		  return this.dataName || null;
   	},

  	/*
  	* 属性:是否可见
  	*/
  	get_isVisible : function() {
  	    ///<value type="Boolean">图层是否可见</value>
        if(typeof this.name === "undefined") {
            return false;
        }

        var cmd = {
            func : "GetIsVisible",
            name : this.name,
            needResult : true
        }

  	},

  	set_isVisible : function(isVisible) {
        if(this.name === "" || typeof isVisible !== "boolean") {
            return;
        }

        var cmd = {
            Func : "SetLayerVisible",
            arguments : {
                visible : isVisible,
                layerName : this.name
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
  	},

    set_hypsometricSetting : function(hypsometricSetting) {
        if(!(hypsometricSetting instanceof SuperMap.Web.Realspace.HypsometricSetting) || this.name === "") {
            return;
        }

        var cmd = {
            Func : "SetHypsometricSetting",
            layerName : this.name,
            arguments : {
                hypsometricSetting : hypsometricSetting
            },
            classNumber : 4023
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    clearHypsometricSetting : function() {
        var cmd = {
            Func : "ClearHypsometricSetting",
            layerName : this.name,
            classNumber : 4023
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    }
};
SuperMap.Web.Realspace.TerrainLayer.registerClass('SuperMap.Web.Realspace.TerrainLayer', Sys.Component, Sys.IDisposable);
