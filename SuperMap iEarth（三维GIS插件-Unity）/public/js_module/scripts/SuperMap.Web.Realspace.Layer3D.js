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
    *innerLayer3D对象，不对外开放
    */
    _get_innerLayer3D : function() {
        return this._innerLayer;
    },

    _set_innerLayer3D : function(innerLayer3D) {
        this._innerLayer = innerLayer3D;
    },

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
    *caption属性
    */
    get_caption : function() {
        ///<value type="String">返回图层标题</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetCaption",
            layerName : this.name,
            needResult : true
        }

        return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "string"));
    },

    set_caption : function(caption) {
        /// <summary>设置图层标题</summary>
        if(this.name === "" || typeof caption !== "string") {
            return;
        }

        if(typeof (caption) !== "string") {
            return;
        }

        var cmd = {
            func : "SetCaption",
            layerName : this.name,
            needResult : false,
            arguments : {
                caption : caption
            }
        }
        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
     *updatesize属性
     */
    get_updateSize : function() {
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "GetUpdateSize",
            layerName : this.name,
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_updateSize : function(value) {
        ///<value type="int">设置图层更新块大小</value>
        if(this.name === "" || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetUpdateSize",
            layerName : this.name,
            needResult : false,
            arguments : {
                updateSize : value
            }
        }
        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *description属性
    */
    get_description : function() {
        ///<value type="String">返回图层描述信息</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetDescription",
            layerName : this.name,
            needResult : true
        }
        return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "string"));
    },

    set_description : function(description) {
        /// <summary>设置图层描述信息</summary>
        if (typeof description !== "string" || this.name === "") {
            return;
        }

        var cmd = {
            func : "SetDescription",
            layerName : this.name,
            needResult : false,
            arguments : {
                description : description
            }
        }
        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
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
     *图层类型属性
     */
    get_theme : function() {
        ///<value type="SuperMap.Web.Realspace.Layer3DType">返回图层类型</value>
        if(this.name === "") {
            return null;
        }

        return this.type;
    },

    /*
    *三维图层的数据类型属性
    */
    get_dataType : function() {
        ///<value type="SuperMap.Web.Realspace.Layer3DDataType">返回三维图层包含的数据类型</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetDataType",
            layerName : this.name,
            needResult : true,
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    /*
    *图层是否可选择
    */
    get_isSelectable : function() {
        ///<value type="Boolean">返回图层是否可选择</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetIsSelectable",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_isSelectable : function(isSelectable) {
        ///<summary>设置图层是否可选择</summary>
        if(this.name === "" || typeof isSelectable !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsSelectable",
            layerName : this.name,
            needResult : false,
            arguments : {
                isSelectable : isSelectable
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *图层是否可编辑
    */
    get_isEditable : function() {
        ///<value type="Boolean">返回图层是否可编辑</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetIsEditable",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_isEditable : function(isEditable) {
        ///<summary>设置图层是否可编辑</summary>
        if(this.name === "" || typeof isEditable !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsEditable",
            layerName : this.name,
            needResult : false,
            arguments : {
                isEditable : isEditable
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
     *图层是否显示阴影
     */
    get_isShadowEnable : function() {
        ///<value type="Boolean">返回图层是否显示阴影</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetIsShadowEnable",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_isShadowEnable : function(value) {
        ///<summary>设置图层是否可显示阴影</summary>
        if(this.name === "" || typeof value !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsShadowEnable",
            layerName : this.name,
            needResult : false,
            arguments : {
                isShadowEnable : value
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *图层是否始终进行渲染
    */
    get_isAlwaysRender : function() {
        ///<value type="Boolean">返回图层是否始终进行渲染</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetIsAlwaysRender",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_isAlwaysRender : function(isable) {
        ///<summary>设置图层是否始终进行渲染</summary>
        if(this.name === "" || typeof isable !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsAlwaysRender",
            layerName : this.name,
            needResult : false,
            arguments : {
                isAlwaysRender : isable
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
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
     *IsExcavation属性
     * OSGB图层是否参与开挖，默认不参与
     */
    get_isExcavation: function() {
        ///<value type="Boolean">返回OSGB图层是否参与开挖</value>
        if(this.name === "") {
            return null;
        }

        if(this.type !== 15) {
            return false;
        }

        var cmd = {
            func : "GetIsExcavation",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_isExcavation : function(isExcavation) {
        ///<summary>设置OSGB图层是否参与开挖</summary>
        if(this.name === "" || typeof isExcavation !== "boolean") {
            return;
        }

        if(this.type !== 15) {
            return;
        }

        var cmd = {
            func : "SetIsExcavation",
            layerName : this.name,
            needResult : false,
            arguments : {
                isExcavation : isExcavation
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },


    /*
    *图层对象的最大可见距离(矢量、模型)
    */
    get_maxObjectVisibleDistance : function() {
        ///<value type="Number">返回图层对象的最大可见距离</value>
        if(this.name === "") {
            return null;
        }

        if(this.type !== 7 && this.type !== 10 && this.type !== 15) {
            return null;
        }

        var cmd = {
            func : "GetMaxObjectVisibleDistance",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_maxObjectVisibleDistance : function(maxVisibleDistance) {
        ///<summary>设置图层对象的最大可见距离</summary>
        if(this.name === "" || typeof maxVisibleDistance !== "number") {
            return;
        }

        if(this.type !== 7 && this.type !== 10 && this.type !== 15) {
            return;
        }

        var cmd = {
            func : "SetMaxObjectVisibleDistance",
            layerName : this.name,
            needResult : false,
            arguments : {
                maxVisibleDistance : maxVisibleDistance
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *图层对象的最小可见距离(矢量、模型)
    */
    get_minObjectVisibleDistance : function() {
        ///<value type="Number">返回图层对象的最小可见距离</value>
        if(this.name === "") {
            return null;
        }

        if(this.type !== 7 && this.type !== 10 && this.type !== 15) {
            return null;
        }

        var cmd = {
            func : "GetMinObjectVisibleDistance",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_minObjectVisibleDistance : function(minVisibleDistance) {
        ///<summary>设置图层对象的最小可见距离</summary>
        if(this.name === "" || typeof minVisibleDistance !== "number") {
            return;
        }

        if(this.type !== 7 && this.type !== 10 && this.type !== 15) {
            return;
        }

        var cmd = {
            func : "SetMinObjectVisibleDistance",
            layerName : this.name,
            needResult : false,
            arguments : {
                minVisibleDistance : minVisibleDistance
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *属性三维图层的最大可见高程值
    */
    get_maxVisibleAltitude : function() {
        ///<value type="Number">返回图层的最大可见高程值</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetMaxVisibleAltitude",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_maxVisibleAltitude : function(maxVisibleAltitude) {
        ///<summary>设置图层的最大可见高程值</summary>
        if(this.name === "" || typeof maxVisibleAltitude !== "number") {
            return;
        }

        var cmd = {
            func : "SetMaxVisibleAltitude",
            layerName : this.name,
            needResult : false,
            arguments : {
                maxVisibleAltitude : maxVisibleAltitude
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },


    /*
    *属性三维图层的最小可见高程值
    */
    get_minVisibleAltitude : function() {
        ///<value type="Number">返回图层的最小可见高程值</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetMinVisibleAltitude",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_minVisibleAltitude : function(minVisibleAltitude) {
        ///<summary>设置图层的最小可见高程值</summary>
        if(this.name === "" || typeof minVisibleAltitude !== "number") {
            return;
        }

        var cmd = {
            func : "SetMinVisibleAltitude",
            layerName : this.name,
            needResult : false,
            arguments : {
                minVisibleAltitude : minVisibleAltitude
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *获取三维渲染要素集合对象
    */
    get_feature3Ds : function() {
        ///<value type="SuperMap.Web.Core.Feature3Ds"></value>
        if(this.name === "") {
            return;
        }

        if(this.get_type() === SuperMap.Web.Realspace.Layer3DType.KML || this.get_type() === SuperMap.Web.Realspace.Layer3DType.KMZ) {
            if(this._feature3ds == null) {
                this._feature3ds = new SuperMap.Web.Core.Feature3Ds(this);
                var cmd = {
                    func : "GetFeature3Ds",
                    layerName : this.name,
                    needResult : true
                }

                var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "array"));
                for(var i = 0, len = object.length; i < len; i ++) {
                    var result = new SuperMap.Web.Core.Feature3D({
                                     name : object[i],
                                     layerName : this.name
                                 });
                    this._feature3ds._feature3dArray.push(result);
                }
            }
            return this._feature3ds;
        }
        return null;
    },

    /*
    *图层的范围
    */
    get_bounds : function() {
        ///<value type="SuperMap.Web.Core.Rectangle2D">返回图层的范围</value>
        if(this.name === "") {
            return null;
        }
        var cmd = {
            func : "GetBounds",
            layerName : this.name,
            needResult : true
        }

        var bounds = this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);

        var result = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(bounds, "object"));

        return new SuperMap.Bounds(result.left, result.bottom, result.right, result.top);
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

    /*
    *设置图层中指定的批量对象可见状态,只对模型图层有效。
    */
    setObjectVisible : function(objectIds, bVisible) {
        ///<param name="objectIds" type="Array" elementType="Number" integer="true">对象Id数组</param>
        ///<param name="bVisible" type="Boolean">是否可见</param>
        ///<returns type="boolean">是否成功</returns>
        if(this.name === "") {
            return;
        }

        var e = Function._validateParams(arguments, [{ name: "objectIds", type: Array, elementType: Number }, { name: "bVisible", type: Boolean}]);
        if(e) {
            var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
            throw ex;
        }

        var cmd = {
            func : "SetObjectVisible",
            layerName : this.name,
            needResult : false ,
            arguments : {
                objectIds : objectIds,
                visible : bVisible
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },


    /*
    *Style3D属性
    */
    get_style3D : function() {
        ///<value type="SuperMap.Web.Core.Style3D">返回矢量类型图层的风格属性</value>
        if(this.name === "") {
            return null;
        }
        var cmd = {
            func : "GetStyle3D",
            layerName : this.name,
            needResult : true
        }

        var result = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "object"));

        return new SuperMap.Web.Core.Style3D(result);
    },

    set_style3D : function(style3D) {
        ///<summary>设置矢量类型图层的显示风格</summary>
        if(this.name === "" || !(style3D instanceof SuperMap.Web.Core.Style3D)) {
            return;
        }

        if(this.type !== SuperMap.Web.Realspace.Layer3DType.VECTOR && this.type !== SuperMap.Web.Realspace.Layer3DType.OSGB) {
            return;
        }

        var cmd = {
            func : "SetStyle3D",
            layerName : this.name,
            needResult : false ,
            arguments : {
                style3D : style3D
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
        this._style3D = style3D;
    },


    /*
     *是否开启卷帘效果
     */
    get_swipeEnabled: function() {
        ///<value type="Boolean">返回图层是否开启卷帘效果</value>
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetSwipeEnabled",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_swipeEnabled : function(isswipeEnabled) {
        ///<summary>设置图层是否开启卷帘</summary>
        if(this.name === "" || typeof isswipeEnabled !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetSwipeEnabled",
            layerName : this.name,
            needResult : false,
            arguments : {
                swipeEnabled : isswipeEnabled
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },



    /*
     *SwipeRegion属性
     */
    get_swipeRegion : function() {
        ///<value type="SuperMap.Web.Core.Rectangle2D">返回卷帘范围</value>
        if(this.name === "") {
            return null;
        }
        var cmd = {
            func : "GetSwipeRegion",
            layerName : this.name,
            needResult : true
        }

        var result = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "object"));

        return new SuperMap.Bounds(result.left, result.bottom, result.right, result.top);
    },

    set_swipeRegion : function(rec2d) {
        ///<summary>设置卷帘范围</summary>
        if(this.name === "" || !(rec2d instanceof SuperMap.Bounds)) {
            return;
        }

        var cmd = {
            func : "SetSwipeRegion",
            layerName : this.name,
            needResult : false,
            arguments : {
                bounds : {
                    left : rec2d.left,
                    bottom : rec2d.bottom,
                    right : rec2d.right,
                    top : rec2d.top
                }
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },


    /*
    *SelectStyle属性
    */
    get_selectStyle : function() {
        ///<value type="SuperMap.Web.Core.Style3D">返回矢量类型图层的选择风格属性</value>
        if(this.name === "") {
            return null;
        }

        if(this.type !== 2 && this.type !== 7 && this.type !== 10 && this.type !== 15) {
            return null;
        }

        var cmd = {
            func : "GetSelectStyle",
            layerName : this.name,
            needResult : true
        }

        var result = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "object"));

        this._selectStyle = new SuperMap.Web.Core.Style3D(result);

        return this._selectStyle;
    },

    set_selectStyle : function(selectStyle) {
        ///<summary>设置矢量类型图层的选择风格</summary>
        if(this.name === "" || !(selectStyle instanceof SuperMap.Web.Core.Style3D)) {
            return;
        }

        if(this.type !== 2 && this.type !== 7 && this.type !== 10 && this.type !== 15) {
            return;
        }

        var cmd = {
            func : "SetSelectStyle",
            layerName : this.name,
            needResult : false ,
            arguments : {
                selectStyle : selectStyle
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
        this._selectStyle = selectStyle;
    },


    /*
    *IsTransparent属性
    */
    get_isTransparent : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetIsTransparent",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },

    set_isTransparent : function(isTransparent) {
        if(this.name === "" || typeof isTransparent !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsTransparent",
            layerName : this.name,
            needResult : false,
            arguments : {
                isTransparent : isTransparent
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },


    /*
     *OpaqueRate属性:影像图层的透明度
     */
    get_opaqueRate : function() {
        if(this.name === "" || this.type !== SuperMap.Web.Realspace.Layer3DType.IMAGE) {
            return null;
        }

        var cmd = {
            func : "GetOpaqueRate",
            layerName : this.name,
            needResult : true
        }

        return  Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_opaqueRate : function(nOpaque) {
        if(this.name === "" || typeof nOpaque !== "number" || this.type !== SuperMap.Web.Realspace.Layer3DType.IMAGE) {
            return;
        }

        var cmd = {
            func : "SetOpaqueRate",
            layerName : this.name,
            needResult : false,
            arguments : {
                opaqueRate : nOpaque
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
     *SelectionFiltrateByTransparency属性:透明不选择
     */
    get_selectionFiltrateByTransparency : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetSelectionFiltrateByTransparency",
            layerName : this.name,
            needResult : true
        }

        return  Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_SelectionFiltrateByTransparency : function(value) {
        if(this.name === "" || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetSelectionFiltrateByTransparency",
            layerName : this.name,
            needResult : false,
            arguments : {
                selectionFiltrateByTransparency : value
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *TransparentColor属性
    */
    get_transparentColor : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetTransparentColor",
            layerName : this.name,
            needResult : true
        }

        if(this._transparentColor === null) {
            this._transparentColor = new SuperMap.Web.Core.Color();
        }

        var value = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));

        this._transparentColor.fromLongABGR(value);
        return this._transparentColor;
    },

    set_transparentColor : function(transparentColor) {
        if(this.name === "" || !(transparentColor instanceof SuperMap.Web.Core.Color)) {
            return;
        }

        var cmd = {
            func : "SetTransparentColor",
            layerName : this.name,
            needResult : false,
            arguments : {
                transparentColor : transparentColor.toLongABGR()
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
        this._transparentColor = transparentColor;
    },

    /*
    *TransparentColorTolerance属性
    */
    get_transparentColorTolerance : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "GetTransparentColorTolerance",
            layerName : this.name,
            needResult : true
        }

        return  Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    set_transparentColorTolerance: function(transparentColorTolerance) {
        if(this.name === "" || typeof transparentColorTolerance !== "number") {
            return;
        }

        if(transparentColorTolerance > 255 || transparentColorTolerance < 0) {
    				return;
    		}

        var cmd = {
            func : "SetTransparentColorTolerance",
            layerName : this.name,
            needResult : false,
            arguments : {
                transparentColorTolerance : transparentColorTolerance
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *findFeature3DByID方法
    */
    findFeature3DByID : function(id) {
        ///<param name="id" type="Int" elementType="Number" integer="true">对象Id</param>
        ///<returns type="SuperMap.Web.Core.Feature3D">若查找成功返回根据ID查找到三维要素对象，否则返回null</returns>
        if(this.name === "" || typeof id !== "number") {
            return null;
        }

        var cmd = {
            func : "FindFeature3DByID",
            layerName : this.name,
            needResult : true,
            arguments : {
                id : id
            }
        }

        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "object"));
        var feature = new SuperMap.Web.Core.Feature3D(object);
        feature.layerName = this.name;
        feature.geometry = new SuperMap.Web.Core.Geometry3D();
        feature.geometry.position = new SuperMap.Web.Core.Point3D(object.position.x, object.position.y, object.position.z);
        return feature;
    },
    /**
    *删除该图层属性缓存数据
    */
    updateAttributeCacheFile : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "UpdateAttributeCacheFile",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

     /**
    *删除该图层属性缓存数据
    */
    updateCacheFile : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "UpdateCacheFile",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    /*
    * 更新选择集
    */
    updateSelection : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "UpdateSelection",
            layerName : this.name,
            needResult : false
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },
    /**
    *更新该图层缓存数据
    */
    updateData : function () {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "UpdateData",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
    },
    /*
    * 释放选择集，包括清除选择集里面的id，以及高亮效果
    */
    releaseSelection : function() {
        if(this.name === "") {
            return null;
        }

        var cmd = {
            func : "ReleaseSelection",
            layerName : this.name,
            needResult : false
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *矢量文件缓存属性字段信息
    */
    get_fieldInfos : function() {
		///<value type="SuperMap.Web.Realspace.FieldInfos">返回属性字段信息集合</value>
        if(this.name === "") {
            return null;
        }

        var currentId = this.get_selection3D().ids[0];

        if(currentId === this.selectionInfoID && this._fieldInfos !== null) {
            return this._fieldInfos;
        }


        var cmd = {
            func : "GetFieldInfos",
            layerName : this.name,
            needResult : true
        }

        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "object"));
        if(this._fieldInfos == null) {
            this._fieldInfos = new SuperMap.Web.Realspace.FieldInfos(this);
        }
        this._fieldInfos.infos = object;
        this.selectionInfoID = currentId;
        return this._fieldInfos;
    },

    /*
    *获取矢量文件缓存属性字段值
    */
    getFieldValue : function(index) {
        if(this.name === "") {
            return null;
        }

        if(typeof index !== "number" && typeof index !== "string") {
            return null;
        }

        var currentId = this.get_selection3D().ids[0];
        if(currentId === this.selectionValueID && this.fieldValues !== null) {
            if(typeof index === "string") {
                for(var i = 0; i < this._fieldInfos.infos.length; i++) {
                    if(this._fieldInfos.infos[i].name === index) {
                        return this.fieldValues[i];
                    }
                }
            }
            return this.fieldValues[index];
        }


        var cmd = {
            func : "GetAllFieldValues",
            layerName : this.name,
            needResult : true
        }

        this.fieldValues =  JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "array"));
        this.selectionValueID = currentId;

        if(typeof index === "string") {
            for(var i = 0; i < this._fieldInfos.infos.length; i++) {
                if(this._fieldInfos.infos[i].name === index) {
                    return this.fieldValues[i];
                }
            }
        }
        return this.fieldValues[index];
    },

    /*
    *获取矢量文件缓存属性字段值
    */
    getAllFieldInfosAndValues : function(needInfos) {
        if(this.name === "") {
            return null;
          }

        var currentId = this.get_selection3D().ids[0];

        var cmd = {
          func : "GetFieldInfos",
          layerName : this.name,
          needResult : true
        }

        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "object"));
        if(this._fieldInfos == null) {
            this._fieldInfos = new SuperMap.Web.Realspace.FieldInfos(this);
        }
        this._fieldInfos.infos = object;
        this.selectionInfoID = currentId;

        var cmd = {
            func : "GetAllFieldValues",
            layerName : this.name,
            needResult : true
        }

        this.fieldValues =  JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "array"));
        this.selectionValueID = currentId;

        var infosAndValues = [];
        if(needInfos instanceof Array) {
            if(!Array.prototype.indexOf) {
                Array.prototype.indexOf = function(obj, start) {
                    for(var i = (start || 0), j = this.length; i < j; i++) {
                        if(this[i] === obj) {
                            return i;
                        }
                    }
                    return -1;
                }
            }
            var nameArr = [];
            for(var i = 0, len = this._fieldInfos.infos.length; i < len; i++) {
                nameArr.push(this._fieldInfos.infos[i].name);
            }
            for(var i = 0, len = needInfos.length; i < len; i++) {
                var index = nameArr.indexOf(needInfos[i]);
                if(index !== -1) {
                   infosAndValues.push({
                      name : needInfos[i],
                      value : this.fieldValues[index]
                   });
                }else {
                  infosAndValues.push({
                     name : needInfos[i],
                     value : null
                  });
                }
            }

            return infosAndValues;
        }

				fieldCount = this._fieldInfos.get_count();
				for(var i=0;i<fieldCount;i++) {
            infosAndValues.push({
               name : this._fieldInfos.get_item(i).get_name(),
               value : this.fieldValues[i]
            });
				}
        return infosAndValues;
    },

    refresh : function() {
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "Refresh",
            layerName : this.name,
            needResult : false
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *获取图层数据下载进度
    */
    getDataStreamingProgress : function() {
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "GetDataStreamingProgress",
            layerName : this.name,
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "number")));
    },

    setLoadTextureLOD : function(bLoadLOD0, bLoadLOD1, bLoadLOD2) {
        ///<param name="bLoadLOD0" type="Boolean">精细</param>
    		///<param name="bLoadLOD1" type="Boolean">普通</param>
    		///<param name="bLoadLOD2" type="Boolean">粗糙</param>
        if(this.name === "") {
            return;
        }

        if(typeof bLoadLOD0 !== "boolean" || typeof bLoadLOD1 !== "boolean" || typeof bLoadLOD2 !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetLoadTextureLOD",
            layerName : this.name,
            needResult : false,
            arguments : {
                bLoadLOD0 : bLoadLOD0,
                bLoadLOD1 : bLoadLOD1,
                bLoadLOD2 : bLoadLOD2
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    renderWithoutTexture : function(bLoad) {
		    ///<param name="bLoad" type="Boolean">是否加载无纹理模型</param>
        if(this.name === "" || typeof bLoad !== "boolean") {
            return;
        }

        var cmd = {
            func : "RenderWithoutTexture",
            layerName : this.name,
            needResult : false,
            arguments : {
                bLoad : bLoad
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },

    /*
    *XML
    */
    fromXML : function(xml) {
        if(this.name === "" || typeof xml !== "string") {
            return;
        }

        var cmd = {
            func : "FromXML",
            layerName : this.name,
            needResult : false,
            arguments : {
                xml : xml
            }
        }

        this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D);
    },


    toXML : function() {
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "ToXML",
            layerName : this.name,
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3D), "boolean")) === "true");
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
    },


    /*
     * 清除裁剪面
     */
    ClearCustomClipPlane : function() {
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "ClearCustomClipPlane",
            layerName : this.name,
            needResult : true
        }
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

    /**
     *分层设色对象
    */
    get_hypsometricSetting : function() {
        if(this.name === "") {
            return;
        }

        
    },

    set_hypsometricSetting : function(hypsometricSetting) {
        if(!(hypsometricSetting instanceof SuperMap.Web.Realspace.HypsometricSetting) || this.name === "") {
            return;
        }

        var cmd = {
            func : "SetHypsometricSetting",
            layerName : this.name,
            needResult : false,
            arguments : {
                hypsometricSetting : hypsometricSetting
            }
        }

       
    }
};

SuperMap.Web.Realspace.Layer3DOSGB.registerClass('SuperMap.Web.Realspace.Layer3DOSGB', SuperMap.Web.Realspace.Layer3D, Sys.IDisposable);

