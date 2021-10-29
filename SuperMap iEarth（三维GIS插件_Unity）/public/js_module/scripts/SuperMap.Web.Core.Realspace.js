//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Core.Realspace.js
// 功能：			三维核心类库
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Core');


/**
* 类名 : Point3D
* 描   述： 三维几何点对象
* 版 本 号：
*/
SuperMap.Web.Core.Point3D = function(x, y, z) {
    /// <param name="x" type="Number">x值</param>
    /// <param name="y" type="Number">y值</param>
    /// <param name="z" type="Number">z值</param>
    /// <returns type="SuperMap.Web.Core.Point3D"></returns>
    /// <field name="x" type="Number">x轴方向坐标。</field>
    /// <field name="y" type="Number">y轴方向坐标。</field>
    /// <field name="z" type="Number">z轴方向坐标。</field>
    //改用parseFloat，传入非数值参数都返回NaN值
    this.x = parseFloat(x) || 0;
    this.y = parseFloat(y) || 0;
    this.z = parseFloat(z) || 0;
};

SuperMap.Web.Core.Point3D.prototype = {

    toString : function() {
      	/// <summary>返回一个表示此三维点对象坐标的格式化字符串，如点(2.0,3.0,4.0)。</summary>
      	/// <returns type="String">表示此 Point3D的字符串，格式为（x,y,z）。</returns>
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    },

    copy : function(point3D) {
    	/// <summary>复制三维点对象</summary>
    	/// <param name="point3D" type="SuperMap.Web.Core.Point3D">点对象</param>
    	/// <returns type="void"></returns>
        //判断point3D类型。
    	if (SuperMap.Web.Core.Point3D.isInstanceOfType(point3D)) {
    		this.x = point3D.x;
            this.y = point3D.y;
            this.z = point3D.z;
    	}
    },

	 /**
	 * 地图点对象比较
	 * @param {SuperMap.Web.Core.Point3D} object
	 */
    equals : function(object) {
    		/// <summary>判断当前对象与参数对象是否相等</summary>
    		///<param name="object" type="SuperMap.Web.Core.Point3D"></param>
    		///<returns type="Boolean">是否相等</returns>
    		//当前对象与object不相等时，返回为false
		    if(!SuperMap.Web.Core.Point3D.isInstanceOfType(object)) {
			      return false;
		    }
		    if((object.x == this.x && object.y == this.y && object.z == this.z) || (object.isEmpty() && this.isEmpty())) {
			      return true;
		    }else {
			      return false;
		    }
    },
	  /**
	  * 判断点对象是否为空，当x,y其中一个为NaN或Null返回true，否则返回false
	  */
    isEmpty : function() {
        ///<returns type="Boolean"></returns>
    		if(isNaN(this.x) || isNaN(this.y) || isNaN(this.z)) {
    		    return true;
    		}else {
    			  return false;
    		}
	  }
};

SuperMap.Web.Core.Point3D.fromJson = function(jsonObject){
    /// <summary>将 JSON 对象转换为点对象。</summary>
  	/// <param name="jsonObject" type="JSONObject">要转换的 JSON 对象。</param>
  	/// <returns type="SuperMap.Point3D">&lt;see cref="T:SuperMap.Point3D"&gt;Point3D&lt;/see&gt;点对象。</returns>
    if(!jsonObject) {
        return null;
    }
    var object = jsonObject;
    if(typeof(jsonObject) === "string") {
        object = eval('(' + jsonObject + ')');
        object = eval('(' + jsonObject + ')');
    }
    var point3D = new SuperMap.Web.Core.Point3D(object.x, object.y,object.z);
    return point3D;
};
SuperMap.Web.Core.Point3D.registerClass('SuperMap.Web.Core.Point3D');

/**
* 类名 : Point3Ds
* 描   述： 三维点集合对象
* 版 本 号：
*/
SuperMap.Web.Core.Point3Ds = function(pntArray) {

    ///<returns type="SuperMap.Web.Core.Point3Ds"></returns>

    if(arguments.length === 0) {
        this.pntArray = [];
        this.length = 0;
        return;
    }
    if(Function._validateParams(arguments, [{ name: "pntArray", type: Array, elementType: SuperMap.Web.Core.Point3D}]) === null) {
        this.length = pntArray.length;
        this.pntArray = pntArray;
    }
};

SuperMap.Web.Core.Point3Ds.prototype = {
    get_count : function() {
        ///<value type="Number" integer="true"></value>

        return this.length;
    },

    get_item : function(index) {
        /// <summary>获取三维点对象</summary>
        /// <param name="index" type="Number" integer="true">点对象</param>
        /// <value type="SuperMap.Web.Core.Point3D"></value>
        //判断SuperMap.Web.Core.Point3Ds类型。
        if(this._innerPoint3Ds === null || typeof index !== "number") {
            return null;
        }
        return this.pntArray[index];
    },

    /**
    * 判断点集合对象是否为空，若集合中点的个数为0则返回true
    *
    */
    isEmpty : function() {
        /// <summary>判断当前对象是否为空</summary>
        ///<returns type="Boolean">是否相等</returns>
        if( this._innerPoint3Ds === null) {
            return true;
        }
        if(this.length !== 0) {
            return false;
        }else {
            return true;
        }
    },
    /**
    * 往三维点集合中添加三维点对象
    */
    add : function(pnt) {
        ///<param name="pnt" type="SuperMap.Web.Core.Point3D"></param>
        ///<returns type="Number" integer="true"></returns>
        if(this._innerPoint3Ds === null) {
            return -1;
        }
        if(!SuperMap.Web.Core.Point3D.isInstanceOfType(pnt) || pnt.isEmpty()) {
            return -1;
        }

        this.pntArray.push(pnt);
        this.length  = this.pntArray.length;
    },

    removeAll : function() {
        ///<returns type="void"></returns>
        if(this._innerPoint3Ds === null) {
            return;
        }
        this.pntArray = [];
        this.length = 0;
    },

    removeAt : function(nIndex, nCount) {
        ///<param name="nIndex" type="Number"></param>
        ///<param name="nCount" type="Number"></param>
        ///<returns type="Boolean"></returns>
        if(this._innerPoint3Ds === null) {
            return 0;
        }

        if(typeof nIndex !== "number" || typeof nCount !== "number") {
            return;
        }

        this.pntArray.splice(nIndex, nCount);
        this.length = this.pntArray.length;
    },

    insert : function(pnt, nIndex) {
        ///<param name="pnt" type="SuperMap.Web.Core.Point3D"></param>
        ///<param name="nIndex" type="Number" integer="true"></param>
        ///<returns type="Boolean"></returns>

        if(this._innerPoint3Ds === null || typeof nIndex !== "number") {
            return false;
        }

        if(!SuperMap.Web.Core.Point3D.isInstanceOfType(pnt) || pnt.isEmpty()) {
            return false;
        }

        this.pntArray.splice(nIndex, 0, pnt);
        this.length = this.pntArray.length;
    },

    toPoint2Ds : function() {
        ///<returns type="Array" elementType="SuperMap.Web.Core.Point2D"></returns>

        var pnt2ds = [];
        for(var i = 0, len = this.pntArray.length; i < len; i++) {
            pnt2ds.push(new SuperMap.Web.Core.Point2D(this.pntArray[i].x, this.pntArray[i].y));
        }
        return pnt2ds;
    }

};
SuperMap.Web.Core.Point3Ds.registerClass('SuperMap.Web.Core.Point3Ds');


/**
* 类名 : Vector3D
* 描   述： 三维向量对象,与Point3D的区别是向量有长度和方向
* 版 本 号：
*/
SuperMap.Web.Core.Vector3D = function(x, y, z) {
    /// <param name="x" type="Number">x值</param>
    /// <param name="y" type="Number">y值</param>
    /// <param name="z" type="Number">z值</param>
    ///<returns type="SuperMap.Web.Core.Vector3D"></returns>

    //改用parseFloat，传入非数值参数都返回NaN值
    this.x = parseFloat(x) || 0;
    this.y = parseFloat(y) || 0;
    this.z = parseFloat(z) || 0;

};

SuperMap.Web.Core.Vector3D.prototype = {
  	toString : function() {
  	    /// <summary>返回一个表示此向量对象坐标的格式化字符串，如点(2.0,3.0,4.0)。</summary>
  	    /// <returns type="String">表示此 Vector3D的字符串，格式为（x,y,z）。</returns>
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    },

    get_x : function() {
        ///<value type="Number"></value>
        if(this._innerVector3D == null) {
            return null;
        }
        return this.x;
    },

    set_x : function(x) {
        if(this._innerVector3D == null || typeof x !== "number") {
            return;
        }
        this.x = x;
    },

    get_y : function() {
        ///<value type="Number"></value>

        if(this._innerVector3D == null) {
            return null;
        }
        return this.y;
    },

    set_y : function(y) {
        if(this._innerVector3D == null || typeof y !== "number") {
            return;
        }
        this.y = y;
    },

    get_z : function() {
        ///<value type="Number"></value>

        if(this._innerVector3D == null) {
            return null;
        }
        return this.z;
    },

    set_z : function(z) {
        if(this._innerVector3D == null || typeof z !== "number") {
            return;
        }
        this.z = z;
    },

    get_length : function() {
        ///<value type="Number"></value>

        if ( this._innerVector3D == null) {
            return null;
        }
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    copy : function(vector3D) {
        /// <summary>复制向量对象</summary>
    		/// <param name="vector3D" type="SuperMap.Web.Core.Vector3D">点对象</param>
    		/// <returns type="void"></returns>
        //判断vector类型。
        if(this._innerVector3D == null) {
            return null;
        }
    	if(SuperMap.Web.Core.Vector3D.isInstanceOfType(vector3D)) {
    		this.x = vector3D.x;
            this.y = vector3D.y;
            this.z = vector3D.z;
    	}
    },

    /**
	  * 地图向量对象比较
	  * @param {SuperMap.Web.Core.Vector3D} object
    */
    equals : function(object) {
        /// <summary>判断当前对象与参数对象是否相等</summary>
    		///<param name="object" type="SuperMap.Web.Core.Vector3D"></param>
    		///<returns type="Boolean">是否相等</returns>
    		//当前对象与object不相等时，返回为false
		    if( this._innerVector3D === null) {
                return false;
            }

    		if(!SuperMap.Web.Core.Vector3D.isInstanceOfType(object)) {
    			return false;
    		}

    		if(this.get_x() === object.get_x() && this.get_y() === object.get_y() && this.get_z() === object.get_z()) {
    			  return true;
    		}else {
			      return false;
		    }
    },
    /**
	  * 判断向量对象是否为空，当x,y，z其中一个为NaN或Null返回true，否则返回false
	  */
	  isEmpty : function() {
		    ///<returns type="Boolean"></returns>
		    if(this._innerVector3D == null) {
            return true;
        }

        if(isNaN(this.get_x()) || isNaN(this.get_y()) || isNaN(this.get_z())){
            return true;
        }else {
            return false;
        }
    }
};
SuperMap.Web.Core.Vector3D.registerClass('SuperMap.Web.Core.Vector3D');

/**
* 类名 : BoundingBox
* 描   述： 三维包围盒对象
* 版 本 号：
*/
SuperMap.Web.Core.BoundingBox = function(lower, upper) {
    /// <param name="lower" type="SuperMap.Web.Core.Vector3D">lower值</param>
    /// <param name="upper" type="SuperMap.Web.Core.Vector3D">upper值</param>
    /// <returns type="SuperMap.Web.Core.BoundingBox"></returns>
    this.center = null;
    this.lower = null;
    this.upper = null;
    if((SuperMap.Web.Core.Vector3D.isInstanceOfType(lower) && SuperMap.Web.Core.Vector3D.isInstanceOfType(upper))) {
        this.lower = lower;
        this.upper = upper;
        this.center = SuperMap.Web.Core.Vector3D((lower.x + upper.x)/2, (lower.y + upper.y)/2, (lower.z + upper.z)/2);
    }else {
        return;
    }
};

SuperMap.Web.Core.BoundingBox.prototype = {

    toString : function() {
        /// <summary>返回一个表示此包围盒对象坐标的格式化字符串，如{(2.0,3.0,4.0)，(2.0,3.0,4.0)}。</summary>
        /// <returns type="String">表示此BoundingBox的字符串，格式为{（x,y,z),（x,y,z）}</returns>
        if(this._innerBoundingBox == null) {
            return null;
        }

        return "{ " + this.get_lower() + ", " + this.get_upper() + " }";
    },

    get_lower : function() {
        ///<value type="SuperMap.Web.Core.Vector3D"></value>

        return this.lower;
    },

    set_lower : function(lower) {
        if(SuperMap.Web.Core.Vector3D.isInstanceOfType(lower)) {
            this.lower = lower;
        }
    },

    get_upper : function() {
        ///<value type="SuperMap.Web.Core.Vector3D"></value>
        return this.upper;
    },

    set_upper : function(upper) {
        if(SuperMap.Web.Core.Vector3D.isInstanceOfType(upper)) {
            this.upper = upper;
        }
    },

    get_center : function() {
        ///<value type="SuperMap.Web.Core.Vector3D"></value>
        return this._center;
    },

    copy : function(boundingBox) {
        /// <summary>复制包围盒对象</summary>
        /// <param name="boundingBox" type="SuperMap.Web.Core.BoundingBox">包围盒对象</param>
        /// <returns type="void"></returns>

        //判断BoundingBox类型。
        if(SuperMap.Web.Core.BoundingBox.isInstanceOfType(boundingBox)) {

            this.lower = boundingBox.lower;
            this.upper = boundingBox.upper;
        }
    },

    /**
    * 包围盒对象比较
    * @param {SuperMap.Web.Core.BoundingBox} object
    */
    equals : function(object) {
        /// <summary>判断当前对象与参数对象是否相等</summary>
        ///<param name="object" type="SuperMap.Web.Core.BoundingBox"></param>
        ///<returns type="Boolean">是否相等</returns>

        if(!SuperMap.Web.Core.BoundingBox.isInstanceOfType(object)) {
            return false;
        }

        if(object.get_lower() === this.get_lower() && object.get_upper() === this.get_upper()) {
            return true;
        }else {
            return false;
        }
    },
    /**
    * 判断包围盒对象是否为空
    */
    isEmpty : function() {
        ///<returns type="Boolean"></returns>

        if(SuperMap.Web.Core.Vector3D.isInstanceOfType(this._lower) && SuperMap.Web.Core.Vector3D.isInstanceOfType(this._upper)) {
            if(this._lower.isEmpty() || this._upper.isEmpty()) {
                return true;
            }
        }
        return false;
    }
};
SuperMap.Web.Core.BoundingBox.registerClass('SuperMap.Web.Core.BoundingBox');


/**
* 类名 : Color
* 描   述： 颜色对象，其中red/green/blue/alpha的值都为0—255
* 版 本 号：
*/
SuperMap.Web.Core.Color  = function(red, green, blue, alpha) {
	/// <param name="red" type="number">red值</param>
    /// <param name="green" type="number">green值</param>
    /// <param name="blue" type="number">blue值</param>
    /// <param name="alpha" type="number">alpha值</param>
    /// <returns type="SuperMap.Web.Core.Color"></returns>

    this._red = this._getColorInRange(red) || 0;
    this._green = this._getColorInRange(green) || 0;
    this._blue = this._getColorInRange(blue) || 0;
    this._alpha = parseInt(alpha) || 255;
    if(isNaN(this._alpha)) {
        this._alpha = 255;
    }else {
        this._alpha = this._getColorInRange(this._alpha);
    }
};

SuperMap.Web.Core.Color.prototype = {

    _getColorInRange : function(colorValue) {
        //改用parseInt，传入非数值参数都返回NaN值
        var nColorValue = parseInt(colorValue);
        if(isNaN(nColorValue)) {
            nColorValue = 0;
        }
        return nColorValue > 255 ? 255 : (nColorValue < 0 ? 0 : nColorValue);
    },

    get_red : function() {
        ///<value type="Number" integer="true"></value>
        return this._red;
    },

    set_red : function(red) {
        this._red = this._getColorInRange(red);
    },

    get_green : function() {
        ///<value type="Number" integer="true"></value>
        return this._green;
    },

    set_green : function(green) {
        this._green = this._getColorInRange(green);
    },

    get_blue : function() {
        ///<value type="Number" integer="true"></value>
        return this._blue;
    },

    set_blue : function(blue) {
        this._blue = this._getColorInRange(blue);
    },

    get_alpha : function() {
        ///<value type="Number" integer="true"></value>
        return this._alpha;
    },

    set_alpha : function(alpha) {
        this._alpha = parseInt(alpha);
        if(isNaN(this._alpha)) {
            this._alpha = 255;
        }else {
            this._alpha = this._getColorInRange(alpha);
        }
    },

    copy : function(color) {
        /// <summary>复制颜色对象</summary>
        /// <param name="color" type="SuperMap.Web.Core.Color">颜色对象</param>
        /// <returns type="void"></returns>
        //判断color类型。
        if(SuperMap.Web.Core.Color.isInstanceOfType(color)) {
            this._red = color.get_red();
            this._green = color.get_green();
            this._blue = color.get_blue();
            this._alpha = color.get_alpha();
        }
    },


    /**
    * css中使用#FFFFFF的字符串格式来表示颜色，需进行解析转换成RGB格式的。
    */
    fromRGB : function(rgb) {
        ///<param name="rgb" type="String"></param>
        ///<returns type="void"></returns>
        if(typeof rgb == "string") {
            var start = rgb.search(/#/);
            var colorStr = rgb.slice(start + 1, start + 7);
            var color = parseInt(colorStr, 16);
            this._red = parseInt(color >> 16, 10) & 0x00FF;
            this._green = parseInt(color >> 8, 10) & 0x00FF;
            this._blue = parseInt(color, 10) & 0x00FF;
        }
    },

    /**
    * css中使用#FFFFFF的字符串格式来表示颜色
    */
    toRGB : function() {
        ///<returns type="String"></returns>

        var red = "";
        if (this._red < 16) {
            red = "0" + this._red.toString(16);
        }else {
            red = this._red.toString(16);
        }

        var green = "";
        if (this._green < 16) {
            green = "0" + this._green.toString(16);
        }else {
            green = this._green.toString(16);
        }

        var blue = "";
        if(this._blue < 16) {
            blue = "0" + this._blue.toString(16);
        }else {
            blue = this._blue.toString(16);
        }
        return ("#" + red + green + blue);
    },

    //Com层使用的OLE_COLOR是以ABGR的顺序排列的32位整型
    toLongABGR : function() {
        ///<returns type="Long"></returns>
        return (this._alpha << 24) | (this._blue << 16) | (this._green << 8) | (this._red);
    },

    fromLongABGR : function(longABGR) {
        ///<param name="longABGR" type="Number"></param>
        ///<returns type="void"></returns>

        if (!isNaN(longABGR) && (longABGR !== "")) {
            this._alpha = (longABGR >> 24) & 0x00FF;
            this._blue = (longABGR >> 16) & 0x00FF;
            this._green = (longABGR >> 8) & 0x00FF;
            this._red = longABGR & 0x00FF;
        }

    },

    toString : function(){
        return "red="+this.get_red()+",green="+this.get_green()+",blue="+this.get_blue()+",alpha="+this.get_alpha();
    }
};
SuperMap.Web.Core.Color.registerClass('SuperMap.Web.Core.Color');



/**
* 类名 : Style3D
* 描   述： 三维风格对象
* 版 本 号：
*/
SuperMap.Web.Core.Style3D  = function(object) {
    ///<returns type="SuperMap.Web.Core.Style3D"></returns>
    SuperMap.Web.Core.Style3D.initializeBase(this);

    this._innerStyle3D = "style";

    if(arguments.length === 0) {
        var fillForeColor = new SuperMap.Web.Core.Color(189,235,255);
        this.fillForeColor = fillForeColor.toLongABGR();

        var markerColor = new SuperMap.Web.Core.Color(255,255,255);
        this.markerColor = markerColor.toLongABGR();
        this.altitudeMode =  0;
        this.bottomAltitude = 0;
        this.extendHeight = 0;
        this.fill3DMode = 3;
        this.lineColor = markerColor.toLongABGR();
        this.lineWidth = 1;
        this.markerSymbolID = 0;
        this.lineSymbolID = 0;
        this.fillSymbolID = 0;
        this.markerFile = "";
        this.markerScale = 1;
        this.markerSize = 2.4;
        this.sideTextureFiles = "";
        this.topTextureFile = "";
        this.tilingU = 1;
        this.tilingV = 1;
        this.iconAnchorPoint = new SuperMap.LonLat(0,0);
        this.isMarkerSizeFixed = true;
        this.markerBillboardMode = 0;
        return;
    }
    var fillForeColor = new SuperMap.Web.Core.Color(189,235,255);
	  this.fillForeColor = object.fillForeColor || fillForeColor.toLongABGR();

    var markerColor = new SuperMap.Web.Core.Color(0,0,0);
	  this.markerColor = object.markerColor || markerColor.toLongABGR();
    this.altitudeMode = object.altitudeMode || 0;
    this.bottomAltitude = object.bottomAltitude || 0;
    this.extendHeight = object.extendHeight || 0;
    this.fill3DMode = object.fill3DMode || 3;
    this.lineColor = object.lineColor || markerColor.toLongABGR();
    this.lineWidth = object.lineWidth || 1;
    this.markerSymbolID = object.markerSymbolID || 0;
    this.lineSymbolID = object.lineSymbolID || 0;
    this.fillSymbolID = object.fillSymbolID || 0;
    this.markerFile = object.markerFile || "";
    this.markerScale = object.markerScale || 1;
    this.markerSize = object.markerSize || 24;
    this.sideTextureFiles = object.sideTextureFiles || "";
    this.topTextureFile = object.topTextureFile || "";
    this.tilingU = object.tilingU || 1;
    this.tilingV = object.tilingV || 1;
    this.iconAnchorPoint = object.iconAnchorPoint || new SuperMap.LonLat(0,0);
    this.isMarkerSizeFixed = object.isMarkerSizeFixed || true;
    this.markerBillboardMode = object.markerBillboardMode || 0;
};

SuperMap.Web.Core.Style3D.prototype = {


    get_altitudeMode : function() {
        ///<value type="SuperMap.Web.Realspace.AltitudeMode" integer="true"></value>

        return this.altitudeMode;
    },

    set_altitudeMode : function(altitudeMode) {
        if(this._innerStyle3D === null || typeof altitudeMode !=="number") {
            return;
        }

        this.altitudeMode = altitudeMode;
    },

    get_bottomAltitude : function() {
        ///<value type="Number"></value>
        return this.bottomAltitude;
    },

    set_bottomAltitude : function(bottomAltitude) {
        if(typeof bottomAltitude !== "number") {
            return;
        }
        this.bottomAltitude = bottomAltitude;
    },

    get_extendHeight : function() {
        ///<value type="Number"></value>
        if(this._innerStyle3D === null) {
            return null;
        }
        return this.extendHeight;
    },

    set_extendHeight : function(extendHeight) {
        if(typeof extendHeight !== "number") {
            return;
        }
        this.extendHeight = extendHeight;
    },


    get_fillForeColor : function() {
        ///<value type="SuperMap.Web.Core.Color"></value>
        var color = new SuperMap.Web.Core.Color();
        color.fromLongABGR(this.fillForeColor);
        return color;
    },

    set_fillForeColor : function(fillForeColor) {
        if(this._innerStyle3D == null || !(fillForeColor instanceof SuperMap.Web.Core.Color)) {
            return;
        }

        this.fillForeColor = fillForeColor.toLongABGR();
    },

    get_fill3DMode : function() {
        ///<value type="SuperMap.Web.Core.Fill3DMode" integer="true"></value>
        return this.fill3DMode;
    },

    set_fill3DMode : function(fill3DMode) {
        if(this._innerStyle3D == null || typeof fill3DMode !== "number") {
            return;
        }

        this.fill3DMode = fill3DMode;
    },

    get_lineColor : function() {
        ///<value type="SuperMap.Web.Core.Color"></value>
        var color = new SuperMap.Web.Core.Color();
        color.fromLongABGR(this.lineColor);
        return color;
    },

    set_lineColor : function(lineColor) {
        if(this._innerStyle3D === null || !(lineColor instanceof SuperMap.Web.Core.Color)) {
            return;
        }

        this.lineColor = lineColor.toLongABGR();
    },

    get_lineWidth : function() {
        ///<value type="Number" integer="false"></value>
        return this.lineWidth;
    },

    set_lineWidth : function(lineWidth) {
        if(this._innerStyle3D === null || typeof lineWidth !== "number") {
            return;
        }

        this.lineWidth = lineWidth;
    },

    get_markerSymbolID : function() {
        ///<value type="Number" integer="false"></value>
        return this.markerSymbolID;
    },

    set_markerSymbolID : function(markerSymbolID) {
        if(this._innerStyle3D === null || typeof markerSymbolID !== "number") {
            return;
        }

        this.markerSymbolID = markerSymbolID;
    },

    get_lineSymbolID : function () {
        ///<value type="Number" integer="false"></value>
        return this.lineSymbolID;
    },

    set_lineSymbolID : function (lineSymbolID) {
        if(this._innerStyle3D === null || typeof lineSymbolID !== "number") {
            return;
        }

        this.lineSymbolID = lineSymbolID;
    },

    get_fillSymbolID : function () {
        ///<value type="Number" integer="false"></value>
        return this.fillSymbolID;
    },

    set_fillSymbolID : function (fillSymbolID) {
        if(this._innerStyle3D === null || typeof fillSymbolID !== "number") {
            return;
        }

        this.fillSymbolID = fillSymbolID;
    },

    get_markerColor : function() {
        ///<value type="SuperMap.Web.Core.Color"></value>
        var color = new SuperMap.Web.Core.Color();
        color.fromLongABGR(this.markerColor);
        return color;
    },

    set_markerColor : function(markerColor) {
        if(this._innerStyle3D === null || !(markerColor instanceof SuperMap.Web.Core.Color)) {
            return;
        }

        this.markerColor = markerColor.toLongABGR();
    },

    get_markerFile : function() {
        ///<value type="String"></value>
        return this.markerFile;
    },

    set_markerFile : function(markerFile) {
        if(this._innerStyle3D === null || typeof markerFile !== "string") {
            return;
        }

        this.markerFile = markerFile;
    },

    get_markerScale : function() {
        ///<value type="Number"></value>
        return this.markerScale;
    },

    set_markerScale : function(markerScale) {
        if(this._innerStyle3D === null || typeof markerScale !== "number") {
            return;
        }

        this.markerScale = markerScale;
    },

    get_markerSize : function() {
        ///<value type="Number"></value>
        return this.markerSize;
    },

    set_markerSize : function(markerSize) {
        if(this._innerStyle3D === null || typeof markerSize !== "number") {
            return;
        }

        this.markerSize = markerSize;
    },

    get_sideTextureFiles : function() {
        ///<value type="Array" elementType="String"></value>
        return this.sideTextureFiles;
    },

    set_sideTextureFiles : function(sideTextureFiles) {
        if(this._innerStyle3D === null || typeof sideTextureFiles !== "string") {
            return;
        }

        this.sideTextureFiles = sideTextureFiles;
    },

    get_topTextureFile : function() {
        ///<value type="String"></value>
        return this.topTextureFile;
    },

    set_topTextureFile : function(topTextureFile) {
        if(this._innerStyle3D == null || typeof topTextureFile !== "string") {
            return;
        }

        this.topTextureFile = topTextureFile;
    },


    get_tilingU : function() {
        ///<value type="Number"></value>
        return this.tilingU;
    },

    set_tilingU : function(tilingU) {
        if(this._innerStyle3D === null || typeof tilingU !== "number") {
            return;
        }

        this.tilingU = tilingU;
    },

    get_tilingV : function() {
        ///<value type="Number"></value>
        return this.tilingV;
    },

    set_tilingV : function(tilingV) {
        if(this._innerStyle3D === null || typeof tilingV !== "number") {
            return;
        }

        this.tilingV = tilingV;
    },

    get_iconAnchorPoint : function() {
        ///<value type="SuperMap.Web.Core.Point2D"></value>
        return this.iconAnchorPoint;
    },

    set_iconAnchorPoint : function(iconAnchorPoint) {
        if(this._innerStyle3D === null) {
            return;
        }
        if( SuperMap.LonLat.isInstanceOfType(iconAnchorPoint)) {
            this.iconAnchorPoint = iconAnchorPoint;
        }
    },

    get_isMarkerSizeFixed : function() {
        ///<value type="Boolean"></value>
        return this.isMarkerSizeFixed;
    },

    set_isMarkerSizeFixed : function(isFixed) {
        if(this._innerStyle3D === null || typeof isFixed !== "boolean") {
            return;
        }

        this.isMarkerSizeFixed = isFixed;
    },

    get_markerBillboardMode : function() {
        ///<value type="Number"></value>
        return this.markerBillboardMode;
    },

    set_markerBillboardMode : function(mode) {
        ///<value type="Number"></value>
        if(typeof mode !== "number") {
            return;
        }
        this.markerBillboardMode = mode;
    },

    clone : function() {
        /// <summary>克隆三维风格对象</summary>
        /// <returns type="SuperMap.Web.Core.Style3D"></returns>
        if(this._innerStyle3D === null) {
            return null;
        }

        var style3D = new SuperMap.Web.Core.Style3D(this);

        return style3D;
    }
};
SuperMap.Web.Core.Style3D.registerClass('SuperMap.Web.Core.Style3D',Sys.Component);


/**
* 类名 : TextStyle3D
* 描   述： 三维文本风格类
* 版 本 号：
*/
SuperMap.Web.Core.TextStyle3D  = function(object) {

    ///<returns type="SuperMap.Web.Core.TextStyle3D"></returns>

    this._innerTextStyle3D = "TextStyle";
    if(arguments.length === 0) {
        this.alignment = 0;
        var color = new SuperMap.Web.Core.Color(0, 0, 0);
        this.backColor = color.toLongABGR();
        this.backOpaque = false;
        this.bold = false;
        this.fontHeight = 6;
        this.fontName = "IMl001";
        this.fontWidth = 0;
        this.isSizeFixed = false;
        this.fixedSize = 0;
        this.isItalic = false;
        this.outline = false;
        this.rotation = 0;
        this.shadow = false;
        this.strikeout = false;
        this.underline = false;
        this.weight = 0;
        this.opaqueRate = 100;
        this.fontScale = 1;
        this.foreColor = color.toLongABGR();
        return;
    }
    this.alignment = object.alignment || 0;
    var color = new SuperMap.Web.Core.Color(0, 0, 0);
    this.backColor = object.backColor || color.toLongABGR();
    this.backOpaque = object.backOpaque || false;
    this.bold = object.bold || false;
    this.fontHeight = object.fontHeight || 6;
    this.fontName = object.fontName || "IMl001";
    this.fontWidth = object.fontWidth || 0;
    this.isSizeFixed = object.isSizeFixed || false;
    this.fixedSize = object.fixedSize || 0;
    this.isItalic = object.isItalic || false;
    this.outline = object.outline || false;
    this.rotation = object.rotation || 0;
    this.shadow = object.shadow || false;
    this.strikeout = object.strikeout || false;
    this.underline = object.underline || false;
    this.weight = object.weight || 0;
    this.opaqueRate = object.opaqueRate || 100;
    this.fontScale = object.fontScale || 1;
    this.foreColor = object.foreColor || color.toLongABGR();
};

SuperMap.Web.Core.TextStyle3D.prototype = {


    /*
    *对齐方式
    */
    get_alignment : function() {
        ///<value type="SuperMap.Web.Core.TextAlignment"></value>
        return this.alignment;
    },

    set_alignment : function(alignment) {
        if(this._innerTextStyle3D === null || typeof alignment !== "number") {
            return;
        }

        this.alignment = alignment;
    },

    /*
    *背景色
    */
    get_backColor : function() {
        ///<value type="SuperMap.Web.Core.Color"></value>
        var color =new SuperMap.Web.Core.Color();
        color.fromLongABGR(this.backColor);
        return color;
    },

    set_backColor : function(backColor) {
        if(this._innerTextStyle3D === null || !(backColor instanceof SuperMap.Web.Core.Color)) {
            return;
        }
        this.backColor = backColor.toLongABGR();
    },

    /*
    *是否背景不透明
    */
    get_backOpaque : function() {
        ///<value type="Boolean"></value>
        return this.backOpaque;
    },

    set_backOpaque : function(bOpaque) {
        if(typeof bOpaque !== "boolean" || this._innerTextStyle3D === null) {
            return;
        }

        this.bOpaque = bOpaque;
    },

    /*
    *是否加粗
    */
    get_bold : function() {
        ///<value type="Boolean"></value>
        return this.bold;
    },

    set_bold : function(bBold) {
        if(typeof bBold !== "boolean" || this._innerTextStyle3D === null) {
            return;
        }

        this.bold = bBold;
    },

    /*
    *字体高度
    */
    get_fontHeight : function() {
        ///<value type="Number"></value>
        return this.fontHeight;
    },

    set_fontHeight : function(fontHeight) {
        if(this._innerTextStyle3D === null || typeof fontHeight !== "number") {
            return;
        }

        this.fontHeight = fontHeight;
    },

    /*
    *字体名称
    */
    get_fontName : function() {
        ///<value type="String"></value>
        return this.fontName;
    },

    set_fontName : function(name) {
        if(this._innerTextStyle3D === null) {
            return;
        }
        if(typeof name === "string") {
            this.fontName = name;
        }
    },

    /*
    *字体宽度
    */
    get_fontWidth : function() {
        ///<value type="Number"></value>
        return this.fontWidth;
    },

    set_fontWidth : function(fontWidth) {
        if(this._innerTextStyle3D === null || typeof fontWidth !== "number") {
            return;
        }

        this.fontWidth = fontWidth;
    },

    /*
    *是否固定大小
    */
    get_isSizeFixed : function() {
        ///<value type="Boolean"></value>
        return this.isSizeFixed;
    },

    set_isSizeFixed : function(isSizeFixed) {
        if(this._innerTextStyle3D === null || typeof isSizeFixed !== "boolean") {
            return;
        }

        this.isSizeFixed = isSizeFixed;
    },

    /*
    *固定大小的尺寸
    */
    get_fixedSize : function() {
        ///<value type="Number"></value>
        return this.fixedSize;
    },

    set_fixedSize : function(fixedSize) {
        if(this._innerTextStyle3D === null || typeof fixedSize !== "number") {
            return;
        }

        this.fixedSize = fixedSize;
    },

    /*
    *是否斜体
    */
    get_isItalic : function() {
        ///<value type="Boolean"></value>
        return this.isItalic;
    },

    set_isItalic : function(isItalic) {
        if(this._innerTextStyle3D === null || typeof isItalic !== "boolean") {
            return;
        }

        this.isItalic = isItalic;
    },

    /*
    *是否显示外框
    */
    get_outline : function() {
        ///<value type="Boolean"></value>
        return this.outline;
    },

    set_outline : function(outline) {
        if(this._innerTextStyle3D === null || typeof outline !== "boolean") {
            return;
        }

        this.outline = outline;
    },

    /*
    *旋转角度 单位度
    */
    get_rotation : function() {
        ///<value type="Number"></value>
        return this.rotation;
    },

    set_rotation : function(rotation) {
        if(this._innerTextStyle3D == null || typeof rotation !== "number") {
            return;
        }

        this.rotation = rotation;
    },

    /*
    *是否阴影
    */
    get_shadow : function() {
        ///<value type="Boolean"></value>
        return this.shadow;
    },

    set_shadow : function(shadow) {
        if(this._innerTextStyle3D === null || typeof shadow !== "boolean") {
            return;
        }

        this.shadow = shadow;
    },

    /*
    *是否删除线
    */
    get_strikeout : function() {
        ///<value type="Boolean"></value>
        return this.strikeout;
    },

    set_strikeout : function(strikeout) {
        if(this._innerTextStyle3D === null || typeof strikeout !== "boolean") {
            return;
        }

        this.strikeout = strikeout;
    },

    /*
    *是否下划线
    */
    get_underline : function() {
        ///<value type="Boolean"></value>
        return this.underline;
    },
    set_underline : function(underline) {
        if(this._innerTextStyle3D === null || typeof underline !== "boolean") {
            return;
        }

        this.underline = underline;
    },

    /*
    *文本的笔划宽度
    */
    get_weight : function() {
        ///<value type="Number"></value>
        return this.weight;
    },

    set_weight : function(weight) {
        if(this._innerTextStyle3D === null || typeof weight !== "number") {
            return;
        }

        this.weight = weight;
    },

    //value range:0-100,default value is 100
    get_opaqueRate : function() {
        ///<value type="Number"></value>
        return this.opaqueRate;
    },

    set_opaqueRate : function(opaqueRate) {
        if(this._innerTextStyle3D === null || typeof opaqueRate !== "number") {
            return;
        }

        this.opaqueRate = opaqueRate;
    },

    get_fontScale : function() {
        ///<value type="Number"></value>
        return this.fontScale;
    },

    set_fontScale : function(fontScale) {
        if(this._innerTextStyle3D === null || typeof fontScale !== "number") {
            return;
        }

        this.fontScale = fontScale;
    },

    //default value rgb(0, 0, 0)
    get_foreColor : function() {
        ///<value type="SuperMap.Web.Core.Color"></value>
        var color =new SuperMap.Web.Core.Color();
        color.fromLongABGR(this.foreColor);
        return color;
    },

    set_foreColor : function(foreColor) {
        if(this._innerTextStyle3D === null) {
            return;
        }

        if(SuperMap.Web.Core.Color.isInstanceOfType(foreColor)) {
            this.foreColor = foreColor.toLongABGR();
        }
    },

    clone : function() {
        /// <summary>克隆三维文本风格对象</summary>
        /// <returns type="SuperMap.Web.Core.TextStyle3D"></returns>
        if(this._innerTextStyle3D === null) {
            return null;
        }

        return  new SuperMap.Web.Core.TextStyle3D(this);
    }

};
SuperMap.Web.Core.TextStyle3D.registerClass('SuperMap.Web.Core.TextStyle3D');