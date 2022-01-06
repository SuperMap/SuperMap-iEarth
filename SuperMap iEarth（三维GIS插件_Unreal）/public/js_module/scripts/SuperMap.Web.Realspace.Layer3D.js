//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Layer3D
// 功能：			 三维图层类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.Layer3D = function(strServerRootUrl, strLayerName, strDataName, l3dType, innerLayer3D ,theme3D) {
    /// <summary>3D图层对象</summary>
    ///<param name="strServerRootUrl" type="String">服务器地址</param>
    ///<param name="strLayerName" type="String">图层名</param>
    ///<param name="strDataName" type="String">数据名</param>
    ///<param name="l3dType" type="SuperMap.Web.Realspace.Layer3DType">图层类型</param>
    /// <returns type="SuperMap.Web.Realspace.Layer3D">返回3D图层对象。</returns>

    SuperMap.Web.Realspace.Layer3D.initializeBase(this);
    //this._innerLayer = SuperMap.Web.Realspace.Utility._SceneControl._get_innerSceneControl();
    // 没有自己的成员，完全依赖COM

    this._selection3D = null;
    this._feature3ds = null;

    this._style3D = null;
    this._selectStyle = null;
    this._transparentColor = null;
    this._fieldInfos = null;
    
    if(arguments.length === 1 && arguments[0] instanceof SuperMap.Web.Realspace.Layer3DURLParam) {
        //变相重载，此处strServerRootUrl为SuperMap.Web.Realspace.Layer3DURLParam对象
        this.url = strServerRootUrl.layerURL;
        this.name = strServerRootUrl.layerName;
        this.dataName = strServerRootUrl.dataName;
        this.type = strServerRootUrl.layerType;
        return;
    }
    this.url = strServerRootUrl || "";
    this.name = strLayerName || "";
    this.dataName = strDataName || "";
    this.type = l3dType || "";
    this.theme3D = theme3D || "";
    this.selectionValueID = null;
    this.selectionInfoID = null;
    this.fieldValues = null;
};

SuperMap.Web.Realspace.Layer3D.prototype = {
    /*
    *initialized方法
    */
    initialized : function() {
        ///<returns type="Boolean">判断图层对象是否被创建</returns>
        if(this.name !== "") {
            return true;
        }else {
            return false;
        }
    },

    /*
    *name属性
    */
    get_name : function() {
        ///<value type="String">返回图层名</value>
        if(this.initialized()) {
            return this.name;
        }
    },

    /*
    *数据存储路径
    */
     get_dataName : function() {
         ///<value type="String">返回图层数据存储路径</value>
         if(this.name === "") {
             return null;
         }

         return this.dataName;
     },

    /*
    *图层可见性属性
    */
    get_isVisible : function() {
        ///<value type="Boolean">返回图层是否可见</value>
        if(this.name === "") {
            return false;
        }

        var marker = "Layer3DGetVisible" + (new Date()).toGMTString();
        var cmd = {
            func : "GetIsVisible",
            layerName : this.name,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D,
            marker : marker
        }

        emitUIInteraction(cmd);
        var promise = new Promise((resolve, reject) => {
			var eventString = "Layer3D" + (new Date()).toGMTString() + Math.random().toFixed(4);
            
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
        ///<summary>设置图层可见性</summary>
        if(this.name === "" || typeof isVisible !== "boolean") {
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
    },

    /*
    *图层类型属性
    */
    get_type : function() {
        ///<value type="SuperMap.Web.Realspace.Layer3DType">返回图层类型</value>
        if(this.name === "") {
            return null;
        }

        return this.type;
    },

    /*
    *图层选择集属性
    */
    get_selection3D : function() {
        ///<value type="SuperMap.Web.Realspace.Selection3D">返回图层选择集属性</value>
        if(this.name !== "") {
            var marker = "Layer3DGetSelection" + (new Date()).toGMTString();
            var cmd = {
                func : "GetSelection3D",
                layerName : this.name,
                classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D,
                marker : marker
            }

            var promise = new Promise((resolve, reject) => {
                var eventString = "Layer3DGetSelection" + (new Date()).toGMTString() + Math.random().toFixed(4);
                
                addResponseEventListener(eventString, (data) => {
                    var obj = JSON.parse(data);
                    if (obj.marker === marker) {
                    
                        resolve(parseInt(obj.values[0]));
                        removeResponseEventListener(eventString);
                    }
                });
            });
            emitUIInteraction(cmd);
    	    return promise;
        }
    },

    getAttributesById : function(id) {
        if (this.name == "" || typeof id !== "number") {
            return null;
        }

        var marker = "Layer3DGetAttributesById" + (new Date()).toGMTString();
        var cmd = {
            func : "GetAttributesById",
            layerName : this.name,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D,
            marker : marker,
            arguments : {
                id : id
            }
        }
        emitUIInteraction(cmd);

        var promise = new Promise((resolve, reject) => {
            var eventString = "Layer3DGetAttributesById" + (new Date()).toGMTString() + Math.random().toFixed(4);
            
            addResponseEventListener(eventString, (data) => {
                var obj = JSON.parse(data);
                if (obj.marker === marker) {
                
                    resolve(parseInt(obj.values[0]));
                    removeResponseEventListener(eventString);
                }
            });
        });

        return promise;
    },
    
    /*
     *剖切查看
     */
    clipByBox : function(geometry,part) {
        ///<value type="SuperMap.Web.Core.Box">设置剖切面</value>
        ///<param name="part" type="SuperMap.Web.Realspace.BoxClipPart">裁剪模式</param>
        if(this.name === "" || !(geometry instanceof SuperMap.Web.Core.GeoBox)) {
            return;
        }

        var cmd = {
            func : "ClipByBox",
            layerName : this.name,
            arguments : {
                part : part,
                box : {
                    length : geometry.get_length(),
                    width : geometry.get_width(),
                    height : geometry.get_height(),
                    position : geometry.get_position()
                }
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D
        }

        emitUIInteraction(cmd);
    },

    clearClipByBox : function() {
        if(this.name === "" ) {
            return;
        }

        var cmd = {
            func : "ClearClipByBox",
            layerName : this.name,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D
        }

        emitUIInteraction(cmd);
    },


    set_swipeEnabled : function(isswipeEnabled) {
        ///<summary>设置图层是否开启卷帘</summary>
        if(this.name === "" || typeof isswipeEnabled !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetSwipeEnabled",
            layerName : this.name,
            arguments : {
                enable : isswipeEnabled
            },
            classNumber : 4020
        }
        emitUIInteraction(cmd);
       
    },

    set_swipeRegion : function(rec2d) {
        ///<summary>设置卷帘范围</summary>
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "SetSwipeRegion",
            layerName : this.name,
            arguments : {
                bounds : {
                    left : rec2d.left,
                    bottom : rec2d.bottom,
                    right : rec2d.right,
                    top : rec2d.top
                }
            },
            classNumber : 4020
        }
        emitUIInteraction(cmd);
    },

     /**
     *添加一个压平对象，指定对象标签
     * @returns bool
     */
     addFlattenRegion : function(geometry,tag) {
        if(this.name === "") {
            return;
        }

        if(this.type !== SuperMap.Web.Realspace.Layer3DType.OSGB) {
            return;
        }

        var cmd = {
            func : "AddFlattenRegion",
            layerName : this.name,
            arguments : {
                geometry : geometry,
                tag : tag
            },
            classNumber : 4023
        }

        emitUIInteraction(cmd);
    },

    /*
     *清空压平
     */
    clearFlattenRegions : function() {
        if(this.name === "") {
            return;
        }

        if(this.type !== SuperMap.Web.Realspace.Layer3DType.OSGB) {
            return;
        }

        var cmd = {
            func : "ClearFlattenRegions",
            layerName : this.name,
            classNumber : 4023
        }

        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.Layer3D.registerClass('SuperMap.Web.Realspace.Layer3D', Sys.Component, Sys.IDisposable);


//OSGB图层
SuperMap.Web.Realspace.Layer3DOSGB = function(strServerRootUrl, strLayerName, strDataName, innerLayer3D) {
    /// <summary>OSGB图层对象</summary>
    ///<param name="strServerRootUrl" type="String">服务器地址</param>
    ///<param name="strLayerName" type="String">图层名</param>
    ///<param name="strDataName" type="String">数据名</param>
    /// <returns type="SuperMap.Web.Realspace.Layer3DCustom">返回OSGB图层对象。</returns>

    SuperMap.Web.Realspace.Layer3DOSGB.initializeBase(this);

    //this._innerLayer = SuperMap.Web.Realspace.Utility._SceneControl._get_innerSceneControl();

    this.url = strServerRootUrl || "";
    this.name = strLayerName || "";
    this.dataName = strDataName || "";
    this.type = SuperMap.Web.Realspace.Layer3DType.OSGB;
};

SuperMap.Web.Realspace.Layer3DOSGB.prototype = {


    set_hypsometricSetting : function(hypsometricSetting) {
        if(!(hypsometricSetting instanceof SuperMap.Web.Realspace.HypsometricSetting) || this.name === "") {
            return;
        }

        var cmd = {
            func : "SetHypsometricSetting",
            layerName : this.name,
            arguments : {
                hypsometricSetting : hypsometricSetting
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3DOSGB
        }

        emitUIInteraction(cmd);
    },

    clearHypsometricSetting : function() {
        var cmd = {
            func : "ClearHypsometricSetting",
            layerName : this.name,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3DOSGB
        }

        emitUIInteraction(cmd);
    }
};

SuperMap.Web.Realspace.Layer3DOSGB.registerClass('SuperMap.Web.Realspace.Layer3DOSGB', SuperMap.Web.Realspace.Layer3D, Sys.IDisposable);
