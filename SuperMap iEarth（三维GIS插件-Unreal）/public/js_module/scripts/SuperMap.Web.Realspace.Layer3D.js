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
                    
                        resolve(data.ids);
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
                
                    resolve(data);
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


    /*
     *是否开启卷帘效果
     */
    get_swipeEnabled: function() {
        ///<value type="Boolean">返回图层是否开启卷帘效果</value>
        if(this.name === "") {
            return false;
        }

        

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

    /*
     *SwipeRegion属性
     */
    get_swipeRegion : function() {
        ///<value type="SuperMap.Web.Core.Rectangle2D">返回卷帘范围</value>
       
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
                //geometry : geometry,
                geometry : {
                    regionArray : [
                        {x : 118.555542268925, y : 24.8059979090872, z : 37.531}, {x : 118.557435628855, y : 24.8074227570938, z : 31.536},
                        {x : 118.558692800722, y : 24.8057358280742, z : 33.431}, {x : 118.556943743935, y : 24.8042396384471, z : 44.430}
                    ],
                },
                tag : tag
            },
            classNumber : 4023
        }

        addResponseEventListener("123", (data) => {
            console.log(data);
        });
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
    },

    /*
     *osgb图层删除指定索引的压平对象
     */
    removeFlattenRegion : function(index){
        if(this.name === "" || typeof index !== "number") {
            return;
        }

        if(this.type !== SuperMap.Web.Realspace.Layer3DType.OSGB) {
            return null;
        }

        var cmd = {
            func : "RemoveFlattenRegion",
            layerName : this.name,
            needResult : true,
            arguments : {
                index : index
            }
        }

    },

    /*
     *获取所选中OSGB的属性信息
     */
    getAllFieldValueOfLastSelectedObject : function() {
        ///<returns type="Array">返回包含OSGB各项属性的数组</returns>
        if(this.name === "") {
            return;
        }

        var cmd = {
            func : "GetAllFieldValueOfLastSelectedObject",
            layerName : this.name,
            needResult : true
        }

        return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerLayer.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3DOSGB), "array"));

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
