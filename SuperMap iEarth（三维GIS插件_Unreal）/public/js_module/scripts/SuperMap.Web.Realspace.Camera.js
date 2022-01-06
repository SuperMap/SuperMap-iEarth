//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Camera
// 功能：			  照相机类，设置场景中照相机的各参数
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.Camera = function(object) {
    ///<param name="object" type="object">包含构造相机需要的参数对象</param>

    SuperMap.Web.Realspace.Camera.initializeBase(this);
    //this._innerCamera = SuperMap.Web.Realspace.Utility._SceneControl._get_innerSceneControl();

    if(arguments.length ===3) {
        this.longitude = parseFloat(arguments[0]);
        this.latitude = parseFloat(arguments[1]);
        this.altitude = parseFloat(arguments[2]);
        this.tilt = 0;
        this.heading = 0;
        this.altitudeMode = 1;
        return;
    }

	if(arguments.length ===0) {
        this.longitude = 0;
        this.latitude = 0;
        this.altitude = 0;
        this.tilt = 0;
        this.heading = 0;
        this.altitudeMode = 1;
        return;
    }
    this.longitude = parseFloat(object.longitude) || 0;
    this.latitude = parseFloat(object.latitude) || 0;
    this.altitude = parseFloat(object.altitude) || 0;

    this.tilt = parseFloat(object.tilt) || 0;
    this.heading = parseFloat(object.heading) || 0;
    this.altitudeMode = parseFloat(object.altitudeMode) || 1;
};

SuperMap.Web.Realspace.Camera.prototype ={

  	/*
  	*altitude属性:相机高度
  	*/
  	get_altitude : function() {
        ///<returns type="number">相机高度</returns>
    		return this.altitude;
  	},

  	set_altitude : function(altitude) {
        if(typeof altitude === "number") {
            this.altitude = altitude;
        }
  	},

  	/*
  	*latitude属性:相机纬度
  	*/
  	get_latitude : function() {
        ///<returns type="number">相机纬度</returns>
    		return this.latitude;
  	},

  	set_latitude : function(latitude) {
    		if(typeof latitude === "number") {
    		    this.latitude = latitude;
        }
  	},

  	/*
  	*longitude属性:相机经度
  	*/
  	get_longitude : function() {
  	    ///<returns type="number">相机经度</returns>
  		  return this.longitude;
  	},

  	set_longitude:function(longitude) {
    		if(typeof longitude === "number") {
            this.longitude = longitude;
    		}
  	},

  	/*
  	*tilt属性:相机的仰（俯）角
  	*/
	get_tilt : function() {
        ///<returns type="number">相机的仰（俯）角</returns>
    	return this.tilt;
    },

  	set_tilt : function(tilt) {
    	if(typeof tilt === "number") {
    		this.tilt = tilt;
    	}
  	},

  	/*
  	*heading属性:相机的方位角
  	*/
  	get_heading : function() {
        ///<returns type="number">相机的方位角</returns>
    		return this.heading;
  	},

  	set_heading : function(heading) {
    		if(typeof heading === "number") {
            this.heading = heading;
    	  }
  	},

  	/*
  	*altitudeMode属性:相机高度模式
  	*/
  	get_altitudeMode : function() {
    		///<returns type="number">相机高度模式</returns>
    	  return this.altitudeMode;
  	},

  	set_altitudeMode : function(altitudeMode) {
  	    if(typeof altitudeMode === "number") {
            this.altitudeMode = altitudeMode;
        }
  	},

  	/*
  	*验证相机的参数是否有效。
  	*/
  	isValid : function() {
  	    ///<returns type="boolean">是否有效</returns>
  		  return true;
  	}
};
SuperMap.Web.Realspace.Camera.registerClass('SuperMap.Web.Realspace.Camera', Sys.Component, Sys.IDisposable);
