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

    var bSuccess = false;
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
            Func : "GetLayerVisible",
            arguments : {
                layerName : this.name
            },
            marker : marker,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D
        }

        var promise = new Promise((resolve, reject) => {      
            var insertFunction = function(data) {
                var obj = data.detail;
                if (obj.marker === marker) {
                    resolve(obj.isVisible === 1);
                    window.removeEventListener("event" + SuperMap.Web.Realspace.ClassNumber.LAYER3D, insertFunction);
                }
            };
            window.addEventListener("event" + SuperMap.Web.Realspace.ClassNumber.LAYER3D, insertFunction);
		});
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    	return promise;
    },

    set_isVisible : function(isVisible) {
        ///<summary>设置图层可见性</summary>
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
                Func : "GetSelection3D",
                layerName : this.name,
                classNumber : 4020,
                marker : marker
            }
            
            var promise = new Promise((resolve, reject) => {      
                var getSelectionFunction = function(data) {
                    var obj = data.detail;
                    if (obj.marker === marker) {
                        resolve(obj.ids);
                        window.removeEventListener("event" + 4020, getSelectionFunction);
                    }
                };
                window.addEventListener("event" + 4020, getSelectionFunction);
            });
            unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
            return promise;
        }
    },

    getAttributesById : function(id) {
        if (this.name == "" || typeof id !== "number") {
            return null;
        }

        var marker = "Layer3DGetAttributesById" + (new Date()).toGMTString();
        var cmd = {
            Func : "GetAttributesById",
            layerName : this.name,
            classNumber : 4020,
            marker : marker,
            arguments : {
                id : id
            }
        }

        var promise = new Promise((resolve, reject) => {      
            var getAttributesFunction = function(data) {
                var obj = data.detail;
                if (obj.marker === marker) {
                    resolve(obj.result);
                    window.removeEventListener("event" + 4020, getAttributesFunction);
                }
            };
            window.addEventListener("event" + 4020, getAttributesFunction);
        });
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));

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
            Func : "ClipByBox",
            layerName : this.name,
            needResult : false,
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
        
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    clearClipByBox : function() {
        if(this.name === "" ) {
            return;
        }

        var cmd = {
            Func : "ClearClipByBox",
            layerName : this.name,
            classNumber : SuperMap.Web.Realspace.ClassNumber.LAYER3D
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    /**
     *添加一个压平对象，指定对象标签
     * @returns bool
     */
    addFlattenRegion : function(geometry,tag) {
        if(this.name === "") {
            return;
        }

        if(this.type !== 1) {
            return;
        }

        var cmd = {
            Func : "AddFlattenRegion",
            layerName : this.name,
            arguments : {
                geometry : geometry,
                tag : tag
            },
            classNumber : 4023
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    /*
     *清空压平
     */
    clearFlattenRegions : function() {
        if(this.name === "") {
            return;
        }

        if(this.type !== 1) {
            return;
        }

        var cmd = {
            Func : "ClearFlattenRegions",
            layerName : this.name,
            classNumber : 4023
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
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
    this.hypsometricSetting = null;
};

SuperMap.Web.Realspace.Layer3DOSGB.prototype = {

    /**
     *分层设色对象  目前S3M暂不支持分层设色,故先注掉
    */
    // get_hypsometricSetting : function() {
    //     if(this.name === "") {
    //         return;
    //     }

    //     return this.hypsometricSetting;
    // },

    // set_hypsometricSetting : function(hypsometricSetting) {
    //     if(!(hypsometricSetting instanceof SuperMap.Web.Realspace.HypsometricSetting) || this.name === "") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetHypsometricSetting",
    //         layerName : this.name,
    //         classNumber : 4023,
    //         arguments : {
    //             hypsometricSetting : hypsometricSetting
    //         }
    //     }

    //     this.hypsometricSetting = hypsometricSetting;
    //     unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    // }
};

SuperMap.Web.Realspace.Layer3DOSGB.registerClass('SuperMap.Web.Realspace.Layer3DOSGB', SuperMap.Web.Realspace.Layer3D, Sys.IDisposable);

