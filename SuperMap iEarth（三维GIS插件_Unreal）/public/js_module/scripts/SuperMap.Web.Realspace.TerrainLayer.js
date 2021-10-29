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
        if(this.name === "") {
            return false;
        }

        var marker = "TerrainLayerGetVisible" + (new Date()).toGMTString();
        var cmd = {
            func : "GetIsVisible",
            layerName : this.name,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D,
            marker : marker
        }

        emitUIInteraction(cmd);
        var promise = new Promise((resolve, reject) => {
			var eventString = "TerrainLayer" + (new Date()).toGMTString() + Math.random().toFixed(4);
            
			addResponseEventListener(eventString, (data) => {
                var obj = JSON.parse(data);
                if (obj.marker === marker) {
                   
                    if (obj.Success === "true") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                    removeResponseEventListener(eventString);
                }
			});
		});

    	return promise;

  	},

  	set_isVisible : function(isVisible) {
        if(typeof this.name === "undefined" || typeof isVisible !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsVisible",
            layerName : this.name,
            arguments : {
                isVisible : isVisible
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D
        }

        emitUIInteraction(cmd);
  	}
};
SuperMap.Web.Realspace.TerrainLayer.registerClass('SuperMap.Web.Realspace.TerrainLayer', Sys.Component, Sys.IDisposable);
