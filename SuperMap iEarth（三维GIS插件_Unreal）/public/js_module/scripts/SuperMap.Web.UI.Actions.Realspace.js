//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.UI.Action3Ds.js
// 功能：			  用户操作类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.UI.Action3Ds');

SuperMap.Web.UI.Action3Ds.SceneAction = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
  	SuperMap.Web.UI.Action3Ds.SceneAction.initializeBase(this);
  	//初始化子类时，会调用两次基类的构造函数，
  	//第一次基类的参数不会赋值，所以直接导致抛出异常，
  	//这里加个判断将这个异常过滤掉。
  	if(typeof sceneControl !== "undefined") {
    		var e = Function._validateParams(arguments, [{name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
    		if(e) {
    		    var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
    			  throw ex;
    		}
  	}
  	this._sceneControl = sceneControl;
  	this._name = "BaseAction3D";
  	this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.NULL;
};

SuperMap.Web.UI.Action3Ds.SceneAction.prototype ={
  	/*
  	* 属性:Action名称
  	*/
    get_name : function() {
  	    ///<value type="string">Action名称</value>
  		  return this._name;
  	},

  	set_name : function(strName) {
        if(typeof strName === "string") {
            this._name = strName;
        }
  	},

  	/*
  	* 属性:Action类型
  	*/
  	get_type : function() {
  	    ///<value type="SuperMap.Web.UI.Action3Ds.SceneActionType">Action类型</value>
  		  return this._type;
  	},

  	set_type : function(actionType) {
        if(typeof actionType === "number") {
            this._type = actionType;
        }
  	},

  	/*
  	* sceneControl属性
  	*/
  	get_sceneControl : function() {
  	    ///<value type="SuperMap.Web.UI.Controls.SceneControl">sceneControl属性</value>
  		  return this._sceneControl;
  	},

  	set_sceneControl : function(sceneControl) {
  		  this._sceneControl = sceneControl;
  	},

  	/*
  	* 方法
  	*/
  	dispose:function() {
    		///<returns type="void"></returns>
    		this._sceneControl = null;
  	},

  	/*
  	* 底层没有Click事件
  	*/
  	onClick : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理鼠标双击消息
  	*/
  	onDbClick : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理鼠标按下消息
  	*/
  	onMouseDown : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理鼠标抬起消息
  	*/
  	onMouseUp : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

    /*
  	* 方法:处理鼠标滚轮消息
  	*/
  	onMouseWheel : function(e) {
        ///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理键盘按下消息
  	*/
  	onKeyDown : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理键盘抬起消息
  	*/
  	onKeyUp : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理鼠标移动消息
  	*/
  	onMouseMove : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

    /*
  	* 方法:处理鼠标移开消息
  	*/
  	onMouseOut : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/*
  	* 方法:处理鼠标划过消息
  	*/
  	onMouseOver : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
  	},

  	/**
  	*当action完成时，触发此事件。
  	*/
  	add_actionCompleted : function(handler) {
  	    this._addEvent("actionCompleted", handler);
  	},

  	remove_actionCompleted : function(handler) {
  	    this._removeEvent("actionCompleted", handler);
  	},

  	raise_actionCompleted : function(arguments, userContext) {
  	/// <param name="arguments" type="SuperMap.Web.Realspace.EventObject" optional="true"></param>
  	/// <param name="useContext" type="Any" optional="true"></param>
  	/// <returns type="void"> </returns>
  		  this._raiseEvent("actionCompleted", arguments, userContext);
  	},

  	_addEvent : function(eventName, handler) {
  	    this.get_events().addHandler(eventName, handler);
  	},

  	_removeEvent : function(eventName, handler) {
  		  this.get_events().removeHandler(eventName, handler);
  	},

  	_raiseEvent : function(eventName, arguments, userContext) {
        var handler = this.get_events().getHandler(eventName);
    		if(handler) {
    			  handler(arguments, userContext);
    		}
  	}
};
SuperMap.Web.UI.Action3Ds.SceneAction.registerClass('SuperMap.Web.UI.Action3Ds.SceneAction', Sys.Component, Sys.IDisposable);


SuperMap.Web.UI.Action3Ds.NullAction = function(sceneControl) {
  	///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
  	var e = Function._validateParams(arguments, [{name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
  	if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
    		throw ex;
  	}
  	SuperMap.Web.UI.Action3Ds.NullAction.initializeBase(this);

  	this._sceneControl = sceneControl;
  	this._name = "Null";
  	this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.NULL;
};

SuperMap.Web.UI.Action3Ds.NullAction.prototype = {

  	/*
  	* 方法:析构函数，框架调用。
  	*/
  	dispose : function() {
    		///<returns type="void"></returns>
    		this._sceneControl = null;
  	}
};
SuperMap.Web.UI.Action3Ds.NullAction.registerClass('SuperMap.Web.UI.Action3Ds.NullAction', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);


//漫游Action
SuperMap.Web.UI.Action3Ds.Pan = function(sceneControl) {
  	///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
  	var e = Function._validateParams(arguments, [{name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
  	if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
    		throw ex;
  	}
  	SuperMap.Web.UI.Action3Ds.Pan.initializeBase(this,this._sceneControl);

  	this._name = "Pan";
  	this._sceneControl = sceneControl;
  	this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.PAN;
};

SuperMap.Web.UI.Action3Ds.Pan.prototype ={
  	/*
  	* 方法:析构函数，框架调用。
  	*/
  	dispose : function() {
        ///<returns type="void"></returns>
    		this._sceneControl = null;
  	},

  	/*
  	* 方法:处理鼠标抬起消息
  	*/
  	onMouseUp : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
    		this.raise_actionCompleted(e);
  	},

  	/*
  	* 方法:处理鼠标双击消息
  	*/
  	onDbClick : function(e) {
        ///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
    		this.raise_actionCompleted(e);
  	},

  	/*
  	* 方法:处理键盘抬起消息
  	*/
  	onKeyUp : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
    		this.raise_actionCompleted(e);
  	}
};
SuperMap.Web.UI.Action3Ds.Pan.registerClass('SuperMap.Web.UI.Action3Ds.Pan', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);


//距离量算
SuperMap.Web.UI.Action3Ds.MeasureDistance = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>

    var e = Function._validateParams(arguments, [
        {name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}
    ]);
    if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
        throw ex;
    }
    SuperMap.Web.UI.Action3Ds.MeasureDistance.initializeBase(this);
    this._name = "MeasureDistance";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASUREDISTANCE;
};

SuperMap.Web.UI.Action3Ds.MeasureDistance.prototype = {
    /*
    * 方法:析构函数，框架调用。
    */
    dispose : function() {
        ///<returns type="void"></returns>
        this._sceneControl = null;
    },

    /*
     * 方法:处理鼠标抬起消息
     */
    onMouseUp : function(e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        this.raise_actionCompleted(e);
    }
};
SuperMap.Web.UI.Action3Ds.MeasureDistance.registerClass('SuperMap.Web.UI.Action3Ds.MeasureDistance', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

//量算依地形距离
SuperMap.Web.UI.Action3Ds.MeasureTerrainDistance = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>

    var e = Function._validateParams(arguments, [
        {name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}
    ]);
    if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
        throw ex;
    }
    SuperMap.Web.UI.Action3Ds.MeasureTerrainDistance.initializeBase(this);
    this._name = "MeasureTerrainDistance";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASURETERRAINDISTANCE;
};

SuperMap.Web.UI.Action3Ds.MeasureTerrainDistance.prototype = {
    /*
     * 方法:析构函数，框架调用。
     */
    dispose: function () {
        ///<returns type="void"></returns>
        this._sceneControl = null;
    },

    /*
     * 方法:处理鼠标抬起消息
     */
    onMouseUp: function (e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        this.raise_actionCompleted(e);
    }
};
SuperMap.Web.UI.Action3Ds.MeasureTerrainDistance.registerClass('SuperMap.Web.UI.Action3Ds.MeasureTerrainDistance', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

//水平距离量算
SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>

    var e = Function._validateParams(arguments, [
        {name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}
    ]);
    if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
        throw ex;
    }
    SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance.initializeBase(this);
    this._name = "MeasureHorizontalDistance";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASUREHORIZONTALDISTANCE;
};

SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance.prototype = {
    /*
     * 方法:析构函数，框架调用。
     */
    dispose : function () {
        ///<returns type="void"></returns>
        this._sceneControl = null;
    },

    /*
     * 方法:处理鼠标抬起消息
     */
    onMouseUp : function (e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        this.raise_actionCompleted(e);
    }
};
SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance.registerClass('SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

//面积量算
SuperMap.Web.UI.Action3Ds.MeasureArea = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
    var e = Function._validateParams(arguments, [
        {name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}
    ]);
    if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
        throw ex;
    }
    SuperMap.Web.UI.Action3Ds.MeasureArea.initializeBase(this);

    this._name = "MeasureArea";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASUREAREA;
};

SuperMap.Web.UI.Action3Ds.MeasureArea.prototype = {
    /*
     * 方法:析构函数，框架调用。
     */
    dispose : function () {
        ///<returns type="void"></returns>
        this._sceneControl = null;
    },

    /*
     * 方法:处理鼠标抬起消息
     */
    onMouseUp : function (e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        this.raise_actionCompleted(e);
    }
};
SuperMap.Web.UI.Action3Ds.MeasureArea.registerClass('SuperMap.Web.UI.Action3Ds.MeasureArea', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

//依地形面积量算
SuperMap.Web.UI.Action3Ds.MeasureTerrainArea = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
    var e = Function._validateParams(arguments, [
        {name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}
    ]);
    if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
        throw ex;
    }
    SuperMap.Web.UI.Action3Ds.MeasureArea.initializeBase(this);

    this._name = "MeasureTerrainArea";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASURETERRAINAREA;
};

SuperMap.Web.UI.Action3Ds.MeasureTerrainArea.prototype = {
    /*
     * 方法:析构函数，框架调用。
     */
    dispose : function () {
        ///<returns type="void"></returns>
        this._sceneControl = null;
    },

    /*
     * 方法:处理鼠标抬起消息
     */
    onMouseUp : function (e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        this.raise_actionCompleted(e);
    }
};
SuperMap.Web.UI.Action3Ds.MeasureTerrainArea.registerClass('SuperMap.Web.UI.Action3Ds.MeasureTerrainArea', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);


//挖方区域
SuperMap.Web.UI.Action3Ds.ExcavationRegion = SuperMap.Web.UI.Action3Ds.MeasureArea;


//高程量算
SuperMap.Web.UI.Action3Ds.MeasureHeight = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
  	var e = Function._validateParams(arguments, [{name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
  	if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
    		throw ex;
  	}
  	SuperMap.Web.UI.Action3Ds.MeasureHeight.initializeBase(this);

  	this._name = "MeasureHeight";
  	this._sceneControl = sceneControl;
  	this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASUREHEIGHT;
};

SuperMap.Web.UI.Action3Ds.MeasureHeight.prototype ={
  	/*
  	* 方法:析构函数，框架调用。
  	*/
  	dispose : function() {
        ///<returns type="void"></returns>
    		this._sceneControl = null;
  	},
  	/*
  	* 方法:处理鼠标抬起消息
  	*/
  	onMouseUp : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
    		this.raise_actionCompleted(e);
  	}
};
SuperMap.Web.UI.Action3Ds.MeasureHeight.registerClass('SuperMap.Web.UI.Action3Ds.MeasureHeight', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);


// 点选
SuperMap.Web.UI.Action3Ds.Select = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>

  	var e = Function._validateParams(arguments, [{name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
  	if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
    		throw ex;
  	}
  	SuperMap.Web.UI.Action3Ds.Select.initializeBase(this);
  	this._name = "Select";
    this._sceneControl = sceneControl;
  	this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
};

SuperMap.Web.UI.Action3Ds.Select.prototype = {
  	/*
  	* 方法:析构函数，框架调用。
  	*/
  	dispose : function() {
        ///<returns type="void"></returns>
    		this._sceneControl = null;
  	},
  	/*
  	* 方法:处理鼠标抬起消息
  	*/
  	onMouseUp : function(e) {
    		///<param name="e" type="EventObject"></param>
    		///<returns type="void"></returns>
    		this.raise_actionCompleted(e);
  	}
};
SuperMap.Web.UI.Action3Ds.Select.registerClass('SuperMap.Web.UI.Action3Ds.Select', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);


// 漫游选择
SuperMap.Web.UI.Action3Ds.PanSelect = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>

  	var e = Function._validateParams(arguments, [{name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
  	if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
    		throw ex;
  	}
  	SuperMap.Web.UI.Action3Ds.PanSelect.initializeBase(this);
  	this._name = "PanSelect";
    this._sceneControl = sceneControl;
  	this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.PANSELECT;
};

SuperMap.Web.UI.Action3Ds.PanSelect.prototype = {
  	/*
  	* 方法:析构函数，框架调用。
  	*/
  	dispose : function() {
    	///<returns type="void"></returns>
    	this._sceneControl = null;
  	},
  	/*
  	* 方法:处理鼠标抬起消息
  	*/
  	onMouseUp : function(e) {
        ///<param name="e" type="EventObject"></param>
    	///<returns type="void"></returns>
    	this.raise_actionCompleted(e);
  	},

  	/*
  	* 方法:处理鼠标双击消息
  	*/
  	onDbClick : function(e) {
    	///<param name="e" type="EventObject"></param>
    	///<returns type="void"></returns>
    	this.raise_actionCompleted(e);
  	},

  	/*
  	* 方法:处理键盘抬起消息
  	*/
  	onKeyUp : function(e) {
        ///<param name="e" type="EventObject"></param>
    	///<returns type="void"></returns>
    	this.raise_actionCompleted(e);
  	}
};
SuperMap.Web.UI.Action3Ds.PanSelect.registerClass('SuperMap.Web.UI.Action3Ds.PanSelect', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

// 选择扩展，支持栅格对象的选择
SuperMap.Web.UI.Action3Ds.SelectEx = function(sceneControl) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>

    var e = Function._validateParams(arguments, [{ name: "sceneControl", type: SuperMap.Web.UI.Controls.SceneControl}]);
    if(e) {
        var ex = SuperMap.Web.Realspace.Utility._ConvertSysEx2Realspace(e);
        throw ex;
    }
    SuperMap.Web.UI.Action3Ds.SelectEx.initializeBase(this);
    this._name = "SelectEx";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.PANSELECT;
    // 栅格查询高亮成员
    this._mapUrl = "";
    this._layer3D = null;
    this._bUseHighlightImage = false;
    this._queryDatasetName = "";
    this._hasRequestProjection = false;
    this._prjCoordSys = "";
    this._eo = null;
    this._bMouseDownandMoved = false;
    this._bMouseDown = false;
	this._isViewWorldChanged = true;
};

SuperMap.Web.UI.Action3Ds.SelectEx.prototype = {

    _isSupportGridQuery: function() {
        if(this._mapUrl != "" && this._layer3D != null && SuperMap.Web.Realspace.Layer3D.isInstanceOfType(this._layer3D) && this._queryDatasetName != "") {
            return true;
        }

        return false;
    },

    /*
    * 方法:析构函数，框架调用。
    */
    dispose : function() {
        ///<returns type="void"></returns>
		this._layer3D = null;
        this._sceneControl = null;
        this._name = "";
        this._type = null;
        this._bMouseDownandMoved = false;
        this._bMouseDown = false;
		this._isViewWorldChanged = true;
    },

    /*
    * 方法:处理鼠标移动消息
    */
    onMouseMove : function(e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        if(this._bMouseDown) {
            this._bMouseDownandMoved = true;
        }
    },

    /*
    * 方法:处理鼠标按下消息
    */
    onMouseDown : function(e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        if(e.get_flagType() == (SuperMap.Web.Realspace.FlagType.LBUTTON | SuperMap.Web.Realspace.FlagType.HITGLOBE)) {
            this._bMouseDown = true;
            this._bMouseDownandMoved = false;
			this._isViewWorldChanged = this._sceneControl.get_scene().getViewWorldState();
        }
    },

    /*
    * 方法:鼠标左键双击进行查询，与组件桌面保持一致
    */
    onDbClick : function(e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        if(e.get_flagType() === SuperMap.Web.Realspace.FlagType.LBUTTON) {
            // 使用高亮图片时需要查询
            if(this._isSupportGridQuery()) {
                var pos = new SuperMap.Web.Core.Point2D(e.get_longitude(), e.get_latitude());
                // 处理投影
                if(this._prjCoordSys != null && this._prjCoordSys != "") {
                    pos = SuperMap.Web.Realspace.Utility.projectionTranslate(pos, "", this._prjCoordSys); // 从经纬度转向投影
                }

                // 对服务端进行属性查询
                this._queryAttributes(pos);
                return;
            }
        }
        this.raise_actionCompleted(e);
    },

    /*
    * 方法:鼠标抬起进行选择，与组件桌面保持一致
    */
    onMouseUp : function(e) {
        ///<param name="e" type="EventObject"></param>
        ///<returns type="void"></returns>
        this._eo = e;

		if(this._bMouseDownandMoved || this._isViewWorldChanged) {
      	    this.raise_actionCompleted(e);
      		this._bMouseDown = false;
      		return;
		}
        // 与桌面组件的操作方式保持一致
        if (this._bMouseDown && !this._bMouseDownandMoved) {
            trackingLayer.removeAt("SuperMapRealspaceHighLightVectorSelection");
            trackingLayer.removeAt("SuperMapRealspaceHighLightGridSelection");
            trackingLayer.removeAt("SuperMapRealspaceHighLightGridSelectionChild");
        }
		    this._bMouseDown = false;
        // 若不进行栅格查询参数设置的话，则与选择操作无异
        if (e.get_flagType() == SuperMap.Web.Realspace.FlagType.LBUTTON) {
            if(this._isSupportGridQuery()) {
                var pos = new SuperMap.Web.Core.Point2D(e.get_longitude(), e.get_latitude());
                // 处理投影
                // 确保有投影
                if(!this._hasRequestProjection) {
                    var url = this._mapUrl + "prjCoordSys.json";
                    var xhr = SuperMap.Web.Utility.getXmlHttpRequest();
                    xhr.open("get", url, false);
                    xhr.send(null);
                    if(xhr.status == 200) {
                        if(xhr.responseText != null && xhr.responseText != "") {
                            var responsejson = eval('(' + xhr.responseText + ')');
                            if(responsejson.projection != "" && responsejson.projection != null) {
                                // 获取地图投影的sml表述
                                url = this._mapUrl + "prjCoordSys.xml";
                                var innerxhr = SuperMap.Web.Utility.getXmlHttpRequest();
                                innerxhr.open("get", url, false);
                                innerxhr.send(null);
                                // 跨域的时候第一次请求会有错
                                if(innerxhr.status == 200) {
                                    if(innerxhr.responseText != null && innerxhr.responseText != "") {
                                        this._prjCoordSys = innerxhr.responseText;
                                    }
                                }
                            }
                        }
                    }
                    this._hasRequestProjection = true;
                }
                if(this._prjCoordSys != null && this._prjCoordSys != "") {
                    pos = SuperMap.Web.Realspace.Utility.projectionTranslate(pos, "", this._prjCoordSys); // 从经纬度转向投影
                }
                // 对服务端进行高亮查询
                this._queryHighlight(pos);

            }
        }
        // 这里只是原来的事件
        this.raise_actionCompleted(e);
    },

    // 高亮查询
    _queryHighlight : function(point2d) {
        var queryParam = new SuperMap.Web.iServerJava6R.FilterParameter();
        queryParam.name = this._queryDatasetName; // 数据集名或者图层名
        var queryParams = [queryParam];

        var geometry = new SuperMap.Web.Core.GeoPoint(point2d);

        var queryByGeometryParameters = new SuperMap.Web.iServerJava6R.QueryByGeometryParameters();
        queryByGeometryParameters.queryParams = queryParams;
        // 用相交查询精确
        queryByGeometryParameters.spatialQueryMode = SuperMap.Web.iServerJava6R.SpatialQueryMode.INTERSECT;
        queryByGeometryParameters.geometry = geometry;
        if(this._bUseHighlightImage) {
            //如果要服务器返回高亮图片，则需设置 returnContent 为 false，反之为 true（默认值） 时，返回的是矢量记录集 recordSets
            queryByGeometryParameters.returnContent = false;
            // 返回自定义查询信息这里将得到的是bounds,即queryEventArgs.originResult.customResult
            queryByGeometryParameters.returnCustomResult = true;
        }
        else {
            queryByGeometryParameters.returnContent = true;
        }

        //与服务器交互
        var queryService = new SuperMap.Web.iServerJava6R.QueryByGeometryService(this._mapUrl);
        queryService.add_processCompleted(this._onQueryHighlightComplete);
        queryService.processAsync(queryByGeometryParameters);
    },

    // 属性查询
    _queryAttributes : function(point2d) {
        var queryParam = new SuperMap.Web.iServerJava6R.FilterParameter();
        queryParam.name = this._queryDatasetName; // 地图所包含的数据集名或者图层名
        var queryParams = [queryParam];

        var geometry = new SuperMap.Web.Core.GeoPoint(point2d);

        var queryByGeometryParameters = new SuperMap.Web.iServerJava6R.QueryByGeometryParameters();
        queryByGeometryParameters.queryParams = queryParams;
        // 告诉服务端不要再在矢量记录集里包含geometry
        queryByGeometryParameters.customParams = "geometry=null";
        queryByGeometryParameters.spatialQueryMode = SuperMap.Web.iServerJava6R.SpatialQueryMode.INTERSECT;
        queryByGeometryParameters.geometry = geometry;
        //如果要服务器返回高亮图片，则需设置 returnContent 为 false，反之为 true（默认值） 时，返回的是矢量记录集 recordSets
        queryByGeometryParameters.returnContent = true;

        //与服务器交互
        var queryService = new SuperMap.Web.iServerJava6R.QueryByGeometryService(this._mapUrl);
        queryService.add_processCompleted(this._onQueryAttributesComplete);
        queryService.processAsync(queryByGeometryParameters);
    },

    _onQueryHighlightComplete : function(queryEventArgs) {
        var gridselectaction = this._sceneControl.get_sceneAction();
        var scene = this._sceneControl.get_scene();
        var trackingLayer = scene.get_trackingLayer3D();

        var resultSet = queryEventArgs.result;
        var originResult = queryEventArgs.originResult;
        if (gridselectaction._bUseHighlightImage) {
            // 自己对originResult这个对象进行解析，得到bounds
            var bounds = SuperMap.Web.Core.Rectangle2D.fromJson(originResult.customResult);
            if(bounds == null) {
                return;
            }

            if((bounds.rightTop.x - bounds.leftBottom.x) > 180) {
                // 跨国际日期变更线的处理
                var hightlightID = resultSet.resourceInfo.id;
                var boundschild1 = new SuperMap.Web.Core.Rectangle2D();
                boundschild1.leftBottom.x = 0;
                boundschild1.leftBottom.y = bounds.leftBottom.y;
                boundschild1.rightTop.x = bounds.rightTop.x;
                boundschild1.rightTop.y = bounds.rightTop.y;
                var boundschild2 = new SuperMap.Web.Core.Rectangle2D();
                boundschild2.leftBottom.x = bounds.leftBottom.x;
                boundschild2.leftBottom.y = bounds.leftBottom.y;
                boundschild2.rightTop.x = 0;
                boundschild2.rightTop.y = bounds.rightTop.y;

                var picurl1 = gridselectaction._getUrlByParams(hightlightID, 512, 512, boundschild1);
                gridselectaction._addHighlightPicture2Scene(picurl1, boundschild1, true);
                var picurl2 = gridselectaction._getUrlByParams(hightlightID, 512, 512, boundschild2);
                gridselectaction._addHighlightPicture2Scene(picurl2, boundschild2, false);
            }
            else {
                var hightlightID = resultSet.resourceInfo.id;
                var picurl = gridselectaction._getUrlByParams(hightlightID, 256, 256, bounds);
                gridselectaction._addHighlightPicture2Scene(picurl, bounds, true);
            }
        }
        else {
            gridselectaction._addHighlightVector2Scene(resultSet);
        }

    },

    _getUrlByParams : function(hightlightID, height, width, bounds) {
        var gridselectaction = this._sceneControl.get_sceneAction();
        var scene = this._sceneControl.get_scene();
        var selection = gridselectaction.get_currentlayer3D().get_selection3D();

        var style3D = selection.get_style3D();
        var style = new SuperMap.Web.iServerJava6R.ServerStyle();
        style.fillForeColor.red = style3D.get_fillForeColor().get_red();
        style.fillForeColor.green = style3D.get_fillForeColor().get_green();
        style.fillForeColor.blue = style3D.get_fillForeColor().get_blue();
        style.lineColor.red = style3D.get_lineColor().get_red();
        style.lineColor.green = style3D.get_lineColor().get_green();
        style.lineColor.blue = style3D.get_lineColor().get_blue();
        style.fillOpaqueRate = (style3D.get_fillForeColor().get_alpha() / 255.0) * 100;
        style.lineWidth = style3D.get_lineWidth();
        style.markersize = style3D.get_markerSize();
        var stylejson = SuperMap.Web.Utility.toJSON(style);
		    var boundsjson = SuperMap.Web.Utility.toJSON(bounds);

        var url = gridselectaction.get_mapUrl() + "queryResults/" + hightlightID + ".png?" + "rectifyViewer=true" + "&viewBounds=" + boundsjson + "&style=" + stylejson + "&useGeoCoordSys=true";
        url = encodeURI(url);   // 由于json表述中有特殊字符所以在使用之前要进行编码
        var re = /#/g;
        url = url.replace(re, "%23"); // 将#号转义为%23
        return url;

    },

    // 将url给pic去下载并添加到跟踪层上
    _addHighlightPicture2Scene: function(picurl, bounds, bclear) {
        var scene = this._sceneControl.get_scene();
        var trackingLayer = scene.get_trackingLayer3D();

        var geoPicture3D = new SuperMap.Web.Core.GeoPicture3D();
        geoPicture3D.fromImageFile(picurl);
        geoPicture3D.set_height(bounds.height());
        geoPicture3D.set_width(bounds.width());

        // 服务端提供bounds若有投影则是投影转换后的bounds，并通过bounds来计算中心点
        var pnt3D = new SuperMap.Web.Core.Point3D(bounds.center().x, bounds.center().y);
        geoPicture3D.set_position(pnt3D);
        var feature3d = new SuperMap.Web.Core.Feature3D();
        feature3d.set_geometry(geoPicture3D);

        trackingLayer.set_isVisible(true);
        //清除上次高亮结果，使用新的高亮图片
        if (bclear) {
            // 新添加的根图片
            trackingLayer.removeAt("SuperMapRealspaceHighLightVectorSelection");
            trackingLayer.removeAt("SuperMapRealspaceHighLightGridSelection");
            trackingLayer.removeAt("SuperMapRealspaceHighLightGridSelectionChild");
            trackingLayer.add(feature3d, "SuperMapRealspaceHighLightGridSelection");
        }
        else {
            // 再添加的子图片，需要保证根图片没有被删除
            trackingLayer.add(feature3d, "SuperMapRealspaceHighLightGridSelectionChild");
        }
    },

    _addHighlightVector2Scene : function(resultSet) {
        if(resultSet && resultSet.totalCount > 0) {
            var gridselectaction = this._sceneControl.get_sceneAction();
            var scene = this._sceneControl.get_scene();
            var trackingLayer = scene.get_trackingLayer3D();
            trackingLayer.removeAt("SuperMapRealspaceHighLightVectorSelection");
            trackingLayer.removeAt("SuperMapRealspaceHighLightGridSelection");
            trackingLayer.removeAt("SuperMapRealspaceHighLightGridSelectionChild");

            //显示查找到的矢量要素
            for(var i = 0; i < resultSet.recordsets.length; i++) {
                if (resultSet.recordsets[i].features) {
                    for(var j = 0; j < resultSet.recordsets[i].features.length; j++) {
                        if(resultSet.recordsets[i].features[j].geometry) {
                            gridselectaction._drawResultShape(resultSet.recordsets[i].features[j].geometry);
                        }
                    }
                }
            }
        }
    },

    _drawResultShape : function(geometry) {
        var gridselectaction = this._sceneControl.get_sceneAction();
        var scene = this._sceneControl.get_scene();
        var trackingLayer = scene.get_trackingLayer3D();

        // 一个点一个点的转投影
        if(gridselectaction._prjCoordSys != null && gridselectaction._prjCoordSys != "") {
            if(SuperMap.Web.Core.GeoPoint.isInstanceOfType(geometry)) {
                var pnt = new SuperMap.Web.Core.Point2D(geometry.x, geometry.y);
                pnt = SuperMap.Web.Realspace.Utility.projectionTranslate(pnt, gridselectaction._prjCoordSys, ""); // 从投影转向经纬度
                geometry.x = pnt.x;
                geometry.y = pnt.y;
            }
            else if (SuperMap.Web.Core.GeoLine.isInstanceOfType(geometry) || SuperMap.Web.Core.GeoRegion.isInstanceOfType(geometry)) {
                for(var polycount = 0; polycount < geometry.parts.length; polycount++) {
                    var pnt2ds = geometry.parts[polycount];
                    for(var pntcount = 0; pntcount < pnt2ds.length; pntcount++) {
                        pnt2ds[pntcount] = SuperMap.Web.Realspace.Utility.projectionTranslate(pnt2ds[pntcount], gridselectaction._prjCoordSys, "");   // 从投影转向经纬度
                    }
                }
            }
            else {
                return;
            }
        }
        var selection = gridselectaction.get_currentlayer3D().get_selection3D();
        var style3D = selection.get_style3D().clone();

        var feature3D = new SuperMap.Web.Core.Feature3D();
        feature3D.set_geometry(geometry);
        feature3D.set_style3D(style3D);
        trackingLayer.add(feature3D, "SuperMapRealspaceHighLightVectorSelection");
    },


    _onQueryAttributesComplete : function(queryEventArgs) {
        // 将SuperMap.Web.iServerJava6R.QueryEventArgs类型的属性信息抛出去
        // 若是几何查询则有geometry，若是高亮查询则没有geometry
        var gridselectaction = this._sceneControl.get_sceneAction();
        gridselectaction.raise_actionCompleted(gridselectaction._eo, queryEventArgs);
    },

    /*
    * 属性:设置所要选择的二维栅格地图Url
    */
    set_mapUrl : function(url) {
        ///<param name="url" type="string"></param>
        ///<returns type="void"></returns>
        if(url == null || typeof (url) != "string") {
            return;
        }
        this._mapUrl = url;
        if(this._mapUrl.lastIndexOf("/") != this._mapUrl.length) {
            this._mapUrl += "/";
        }
    },
    get_mapUrl : function() {
        ///<returns type="string"></returns>
        return this._mapUrl;
    },

    /*
    * 属性:设置所要查询的二维栅格地图所包含的数据集或者图层名
    */
    set_queryName : function(name) {
        ///<param name="name" type="string"></param>
        ///<returns type="void"></returns>
        if(name == null || typeof (name) !== "string") {
            return;
        }
        this._queryDatasetName = name;
    },
    get_queryName: function() {
        ///<returns type="string"></returns>
        return this._queryDatasetName;
    },

    /*
    * 属性:设置所要选择的三维图层
    */
    set_currentlayer3D : function(layer) {
        ///<param name="layer" type="SuperMap.Web.Realspace.Layer3D"></param>
        ///<returns type="void"></returns>
        this._layer3D = layer;
    },
    get_currentlayer3D: function() {
        ///<value type="SuperMap.Web.Realspace.Layer3D"></value>
        return this._layer3D;
    },

    /*
    * 属性:设置用高亮图片显示还是用矢量对象显示
    */
    set_highlightMode : function(btrue) {
        ///<param name="btrue" type="bool"></param>
        ///<returns type="void"></returns>
        this._bUseHighlightImage = btrue;
    },
    get_highlightMode : function() {
        ///<value type="Boolean"></value>
        return this._bUseHighlightImage;
    },

    /*
    * 属性:设置当前的ActionType，默认是选择漫游，还可以是选择
    */
    set_currentAction3DType : function(actiontype) {
        ///<param name="actiontype" type="SuperMap.Web.UI.Action3Ds.SceneActionType"></param>
        ///<returns type="void"></returns>
        if(actiontype == SuperMap.Web.UI.Action3Ds.SceneActionType.SELECT || actiontype == SuperMap.Web.UI.Action3Ds.SceneActionType.PANSELECT) {
            this._type = actiontype;
        }
    },
    get_currentAction3DType : function() {
        ///<value type="SuperMap.Web.UI.Action3Ds.SceneActionType"></value>
        return this._type;
    }
};
SuperMap.Web.UI.Action3Ds.SelectEx.registerClass('SuperMap.Web.UI.Action3Ds.SelectEx', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
