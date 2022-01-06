//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.TerrainLayer.js
// 功能：			 地形图层集合类，负责地形图层的管理
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.TerrainLayers = function(scenecontrol) {
    /// <summary>地形图层集合对象</summary>
    SuperMap.Web.Realspace.TerrainLayers.initializeBase(this);

    this._terrainLayerArray = [];   // 只用来存脚本对象，不实现排序，查找算法，Layer3Ds上的脚本数组也是如此

    this._terrainLayerName = [];  // 由于支持添加tin地形,所以创建图层时图层已经自动加入图层列表,上层需要增加此数组来判断该图层是否添加

    this._scenecontrol = scenecontrol;
};

SuperMap.Web.Realspace.TerrainLayers.prototype = {
  	/*
  	* 地形图层列表中的层数
  	*/
  	get_count : function() {
  	    ///<returns type="number" integer="true">层数</returns>
        //return this._innerTerrainLayers.Count;
        return this._terrainLayerArray.length;
  	},

  	/*
  	* 获得地形图层列表中的地形图层
  	*/
  	get_item : function(index) {
  	    ///<param name="index" type="string/number">索引或名称</param>
  		///<returns type="TerrainLayer">返回指定的地形图层</returns>

        if (typeof index === "number") {
            return this._terrainLayerArray[index];
        }

        if (typeof index === "string") {
            for (var i = 0, len = this._terrainLayerArray.length; i < len; i++) {
                if (this._terrainLayerArray[i].name === index) {
                    return this._terrainLayerArray[i];
                }
            }
        }

        return null;
  	},

    /*
  	*向地形图层集合中添加新图层
  	*/
    add : function(strServerRootUrl, strLayerName, strDataName, addToHead) {
        ///<param name="strServerRootUrl" type="string">服务器地址</param>
    	///<param name="strLayerName" type="string">地形图层名</param>
    	///<param name="strDataName" type="string">地形数据名</param>
    	///<param name="addToHead" type="boolean">是否添加到头部</param>
    	///<returns type="SuperMap.Web.Realspace.TerrainLayer">添加的地形图层</returns>

        var terrainLayer = new SuperMap.Web.Realspace.TerrainLayer(strServerRootUrl, strLayerName, strDataName);

        if(terrainLayer.initialized()) {
			if(typeof addToHead !== "undefined") {
				return this.insert(terrainLayer);
            }else {
				var index = this.get_count();
				return this.insert(terrainLayer,index);
			}
        }
        return null;
    },

    
    removeAt : function() {
        var layer = this.get_item(index);

    	if(layer !== null) {
    		Array.remove(this._terrainLayerArray,layer);
    	}

        var marker = "TerrainLayersRemoveAt" + (new Date()).toGMTString();
    
        var cmd = {
            func : "Remove",
            arguments : {
                layer : {
                    layername : layer.name
                }
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.TERRAINLAYERS,
            marker : marker
        }

        emitUIInteraction(cmd);
        
        var promise = new Promise((resolve, reject) => {
        var eventString = "TerrainLayers" + (new Date()).toGMTString();
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
  	* 将创建出来的的图层插入列表中，默认插入列表顶部
  	*/
  	insert : function(terrainLayer, nIndex) {
        ///<param name="terrainLayer" type="TerrainLayer">要插入的地形图层</param>
    	///<param name="nIndex" type="number">插入的位置</param>
    	///<returns type="boolean">是否成功</returns>
    	if(!SuperMap.Web.Realspace.TerrainLayer.isInstanceOfType(terrainLayer)) {
    		return false;
        }

        index = nIndex || 0;

        var marker = "TerrainLayersInsert" + (new Date()).toGMTString();
        var cmd = {
            func : "AddUrlLayer",
            arguments : {
                layer : {
                    url : terrainLayer.url,
                    layerName : terrainLayer.name,
                    dataName : terrainLayer.dataName,
                    Type : 1
                },
                index : index
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.TERRAINLAYERS,
            marker : marker
        }

        emitUIInteraction(cmd);
        var that = this;
        var promise = new Promise((resolve, reject) => {
			var eventString = "TerrainLayers" + (new Date()).toGMTString();
			addResponseEventListener(eventString, (data) => {
                var obj = JSON.parse(data);
                if (obj.marker === marker) {
                    if (obj.Success === "true") {
                        that._terrainLayerName.push(terrainLayer.get_name());
                        that._terrainLayerArray.push(terrainLayer);
                        //that._scenecontrol.get_scene().resetTerrain();
                        resolve(terrainLayer);
                    } else {
                        resolve(null);
                    }
                    removeResponseEventListener(eventString);
                }
			});
		});

        return promise; 
  	}
};
SuperMap.Web.Realspace.TerrainLayers.registerClass('SuperMap.Web.Realspace.TerrainLayers', Sys.Component, Sys.IDisposable);
