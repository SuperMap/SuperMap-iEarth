//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Layer3Ds
// 功能：			 三维图层集合类，负责三维图层的管理
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.Layer3Ds = function (scenecontrol) {

    SuperMap.Web.Realspace.Layer3Ds.initializeBase(this);
    this._layer3DArray = [];

};


SuperMap.Web.Realspace.Layer3Ds.prototype = {
  	/*
  	*获得三维图层集中图层个数
  	*/
  	get_count : function() {
  	    ///<return type="number" integer="true">图层个数</return>
  		return this._layer3DArray.length;
    },

  	/*
  	*获得三维图层集中指定图层
  	*/
  	get_item : function(index) {
  	    ///<param name="index" type="string/number">名称或索引</param>
  	    ///<returns type="SuperMap.Web.Realspace.Layer3D">指定图层</returns>
  		///<value type="SuperMap.Web.Realspace.Layer3D">指定图层</value>
  		if (typeof index === "undefined") {
            return null;
        }

        if (typeof index === "number") {
            return this._layer3DArray[index];
        }

        if (typeof index === "string") {
            for(var i = 0; i < this._layer3DArray.length; i++) {
                if(this._layer3DArray[i].name === index) {
                    return this._layer3DArray[i];
                }
            }
        }

        return null;
    },
    
  	/*
  	*添加图层
  	*/
  	add : function(strServerRootUrl, strLayerName, strDataName, l3dType, addToHead) {
        ///<param name="strServerRootUrl" type="string">服务器地址</param>
      	///<param name="strLayerName" type="string">图层名</param>
      	///<param name="strDataName" type="string">数据名</param>
      	///<param name="l3dType" type="SuperMap.Web.Realspace.Layer3DType">图层类型</param>
      	///<param name="addToHead" type="boolean">是否添加到头部</param>
        ///<returns type="SuperMap.Web.Realspace.Layer3D">添加的图层</returns>
        var layer3D;

        switch(l3dType) {
            case SuperMap.Web.Realspace.Layer3DType.OSGB:
                layer3D = new SuperMap.Web.Realspace.Layer3DOSGB(strServerRootUrl, strLayerName, strDataName);
                break;
            default:
                layer3D = new SuperMap.Web.Realspace.Layer3D(strServerRootUrl, strLayerName, strDataName, l3dType);
        }

        if (layer3D.initialized()){
      	    if (addToHead || (null==addToHead)) {
                return this.insert(layer3D);
      		}else {
          		var index = this.get_count();
          		return this.insert(layer3D,index);
      		}
        }
        return null;
  	},

  	/*
  	*方法:移除所有图层
  	*/
  	removeAll : function() {
  	    ///<returns type="void"></returns>

        Array.clear(this._layer3DArray);
        var cmd = {
            func : "RemoveAll",
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3DS
        }

        emitUIInteraction(cmd);
  	},

  	/*
  	*方法:移除指定图层
  	*/
  	removeAt : function(index) {
  	    ///<param name="index" type="string/number">要移除的图层索引或名称</param>
  		///<returns type="boolean">是否成功</returns>


        var layer = this.get_item(index);
        var layername;
    	if (layer !== null) {
    		Array.remove(this._layer3DArray,layer);
            layername = layer.name;
    	} else {
            layername = index;
        }

        var marker = "Layer3DsRemoveAt" + (new Date()).toGMTString();
    
        var cmd = {
            func : "Remove",
            arguments : {
                layer : {
                    layername : layername
                }
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3DS,
            marker : marker
        }

        emitUIInteraction(cmd);
        
        var promise = new Promise((resolve, reject) => {
        var eventString = "Layer3Ds" + (new Date()).toGMTString();
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

  	/*
  	*方法:向三维图层集合中的指定位置插入图层
  	*/
  	insert : function(layer3D, nIndex) {
        ///<param name="layer3D" type="SuperMap.Web.Realspace.Layer3D">要插入的图层</param>
    	///<param name="nIndex" type="number" integer="true" optional="true">插入位置</param>
    	///<returns type="boolean">是否成功</returns>

        if( !SuperMap.Web.Realspace.Layer3D.isInstanceOfType(layer3D)
            && !SuperMap.Web.Realspace.Layer3DOSGB.isInstanceOfType(layer3D)
        ) {
            return false;
        }

        var marker = "Layer3DsInsert" + (new Date()).toGMTString();
        var cmd = {
            func : "AddUrlLayer",
            arguments : {
                layer : {
                    url : layer3D.url,
                    layername : layer3D.name,
                    dataName : layer3D.dataName,
                    Type : layer3D.type,
                },
                index : nIndex
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3DS,
            marker : marker
        }

        emitUIInteraction(cmd);
        var that = this;
        var promise = new Promise((resolve, reject) => {
			var eventString = "Layer3Ds" + (new Date()).toGMTString() + Math.random().toFixed(4);
            
			addResponseEventListener(eventString, (data) => {
                var obj = JSON.parse(data);
                if (obj.marker === marker) {
                   
                    if (obj.Success === "true") {
                        that._layer3DArray.unshift(layer3D);
                        resolve(layer3D);
                    } else {
                        resolve(null);
                    }
                    removeResponseEventListener(eventString);
                }
			});
		});

    	return promise;
  	},

    getAllLayers : function() {
        var layers = [];

        return layers.concat(this._layer3DArray);
    }
};
SuperMap.Web.Realspace.Layer3Ds.registerClass('SuperMap.Web.Realspace.Layer3Ds', Sys.Component, Sys.IDisposable);
