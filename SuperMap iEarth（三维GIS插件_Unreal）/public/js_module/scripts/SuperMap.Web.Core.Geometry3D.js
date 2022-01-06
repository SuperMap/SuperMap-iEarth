//==========================================================================
// SuperMap Realspace客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Core.Geometry3D.js
// 功能：			三维集几何对象类库
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Core');

/**
* 类名 : Geometry3D
* 描   述： 三维几何对象基类
* 版 本 号：
*/
SuperMap.Web.Core.Geometry3D = function() {

    SuperMap.Web.Core.Geometry3D.initializeBase(this);

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;
    this.id = 0;
};
SuperMap.Web.Core.Geometry3D.prototype = {


    /*
    *返回几何对象的类型
     */
    get_type:function(){
        return this.type;
    },


    /*
    *设置和获取几何对象的位置，目前只对模型、图片有效
    */
    get_position : function() {
        ///<value type="SuperMap.Web.Core.Point3D"></value>
        return this.position;
    },
    set_position : function(position) {
       
        if(SuperMap.Web.Core.Point3D.isInstanceOfType(position)) {
            this.position = position;
        }
    },

    /*
    *设置和获取几何对象的绕X轴的旋转角度，目前只对模型、图片有效
    */
    get_rotationX : function() {
        ///<value type="Number" integer="false"></value>
        return this.rotationX;
    },
    set_rotationX: function(rotationX) {
        this.rotationX = parseFloat(rotationX) || 0;
    },

    /*
    *设置和获取几何对象的id
    */
    get_id : function() {
        ///<value type="Number" integer="false"></value>
        return this.id;
    },
    set_id: function(id) {
        this.id = parseInt(id) || 0;
    },

    /*
    *设置和获取几何对象的绕Y轴的旋转角度，目前只对模型、图片有效
    */
    get_rotationY : function() {
        ///<value type="Number" integer="false"></value>
        return this.rotationY;
    },

    set_rotationY : function(rotationY) {
        this.rotationY = parseFloat(rotationY) || 0;
    },

    /*
    *设置和获取几何对象的绕Z轴的旋转角度，目前只对模型、图片有效
    */
    get_rotationZ : function() {
        ///<value type="Number" integer="false"></value>
        return this.rotationZ;
    },

    set_rotationZ : function(rotationZ) {
        this.rotationZ = parseFloat(rotationZ) || 0;
    },

    /*
    *设置和获取几何对象的绕X轴的旋转角度，目前只对模型、图片有效
    */
    get_scaleX : function() {
        ///<value type="Number" integer="false"></value>
        return this.scaleX;
    },
    set_scaleX : function(scaleX) {

        this.scaleX = parseFloat(scaleX) || 1;
    },

    /*
    *设置和获取几何对象的绕Y轴的旋转角度，目前只对模型、图片有效
    */
    get_scaleY : function() {
        ///<value type="Number" integer="false"></value>
        return this.scaleY;
    },
    set_scaleY : function(scaleY) {
        this.scaleY = parseFloat(scaleY) || 1;
    },

    /*
    *设置和获取几何对象的绕Z轴的旋转角度，目前只对模型、图片有效
    */
    get_scaleZ : function() {
        ///<value type="Number" integer="false"></value>
        return this.scaleZ;
    },

    set_scaleZ : function(scaleZ) {
        this.scaleZ = parseFloat(scaleZ) || 1;
    }
}

SuperMap.Web.Core.Geometry3D.registerClass('SuperMap.Web.Core.Geometry3D', SuperMap.Geometry, Sys.IDisposable);

/**
* 类名 : GeoPoint3D
* 描   述： 三维几何点对象基类
* 版 本 号：
*/
SuperMap.Web.Core.GeoPoint3D = function(point3D) {
    ///<param name="point3D" type="SuperMap.Web.Core.Point3D"></param>
    ///<returns type="SuperMap.Web.Core.GeoPoint3D"></returns>

	SuperMap.Web.Core.GeoPoint3D.initializeBase(this);

    this.type = SuperMap.Web.Core.GeometryType.GEOPOINT3D;

    if(arguments.length === 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return;
    }
    this.x = point3D.x || 0;
    this.y = point3D.y || 0;
    this.z = point3D.z || 0;
};

SuperMap.Web.Core.GeoPoint3D.prototype = {

    convertToGeoPoint : function() {
        var geoPoint = new SuperMap.Geometry.Point();
        geoPoint.x = this.get_x();
        geoPoint.y = this.get_y();
        return geoPoint;
    },

    get_x : function() {
        ///<value type="Number" integer="false"></value>

        return this.x;
    },

    set_x : function(x) {
        if(typeof x !== "number") {
            return;
        }

        this.x = x;
    },

    get_y : function() {
        ///<value type="Number" integer="false"></value>

        return this.y;
    },

    set_y : function(y) {
        if(typeof y !== "number") {
            return;
        }

        this.y = y;
    },

    get_z : function() {
        ///<value type="Number" integer="false"></value>
        return this.z;
    },

    set_z : function(z) {
        if(typeof z !== "number") {
            return;
        }

        this.z = z;
    },
    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoPoint3D"></returns>
        var geoPoint3D = new SuperMap.Web.Core.GeoPoint3D();
        geoPoint3D.x = this.x;
        geoPoint3D.y = this.y;
        geoPoint3D.z = this.z;
        return geoPoint3D;
    }
}
SuperMap.Web.Core.GeoPoint3D.registerClass('SuperMap.Web.Core.GeoPoint3D', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoLine3D
* 描   述： 三维几何线对象类
* 版 本 号：
*/
SuperMap.Web.Core.GeoLine3D = function(point3DsArray) {

    ///<param name="point3Ds" type="Array" elementType="SuperMap.Web.Core.Point3Ds"></param>
    ///<returns type="SuperMap.Web.Core.GeoLine3D"></returns>

    SuperMap.Web.Core.GeoLine3D.initializeBase(this);


    this.type = SuperMap.Web.Core.GeometryType.GEOLINE3D;
    this.part = [];
    if(point3DsArray instanceof Array) {
        if(point3DsArray.length = 1 && point3DsArray[0] instanceof SuperMap.Web.Core.Point3Ds) {
            this.part = [point3DsArray[0].pntArray];
            return;
        }
        this.part = [point3DsArray];
    }

    if(point3DsArray instanceof SuperMap.Web.Core.Point3Ds) {
        this.part = [point3DsArray.pntArray];
    }
};

SuperMap.Web.Core.GeoLine3D.prototype = {
   
    convertToGeoLine : function() {
        if (this.get_partCount() > 0) {
            var geoLine = new SuperMap.Geometry.MultiLineString();
            for(var polycount = 0; polycount < this.part.length; polycount++) {
               var pnt3Ds = new SuperMap.Web.Core.Point3Ds(this.part[i]);
               var pnt2Ds = pnt3Ds.toPoint2Ds();
               geoLine.components[polycount] = pnt2Ds;
            }
            return geoLine;
        }
        return null;
    },

    get_partCount : function() {
        ///<value type="Number" integer="true"></value>
        return this.part.length;
    },


    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoLine3D"></returns>
        var geoLine3D = new SuperMap.Web.Core.GeoLine3D();
        geoLine3D.part = this.part;
        return geoLine3D;
    },

    addPart : function(point3Ds) {
        ///<param name="point3Ds" type="SuperMap.Web.Core.Point3Ds"></param>
        ///<returns type="Number" integer="true"></returns>
        if(!(point3Ds instanceof SuperMap.Web.Core.Point3Ds)) {
            return;
        }

        this.part.push(point3Ds.pntArray);
    },

    getPart : function(nIndex) {
        ///<param name="nIndex" type="Number" integer="true"></param>
        ///<returns type="SuperMap.Web.Core.Point3Ds"></returns>
        if(typeof nIndex !== "number") {
            return null;
        }
        return this.part[nIndex];
    },


    removePart : function(nIndex) {
        ///<param name="nIndex" type="Number" integer="true"></param>
        ///<returns type="Boolean"></returns>
        return (this.part.splice(nIndex, 1).length === 1)
    },

    setPart : function(nIndex, point3Ds) {
        if(point3Ds instanceof SuperMap.Web.Core.Point3Ds) {
            this.part[nIndex] = [point3Ds.pntArray];
        }
    }

}
SuperMap.Web.Core.GeoLine3D.registerClass('SuperMap.Web.Core.GeoLine3D', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoRegion3D
* 描   述： 三维几何面对象类
* 版 本 号：
*/
SuperMap.Web.Core.GeoRegion3D = function(point3DsArray) {

    ///<param name="point3DsArray" type="Array" elementType="SuperMap.Web.Core.Point3Ds"></param>
    ///<returns type="SuperMap.Web.Core.GeoRegion3D"></returns>

	SuperMap.Web.Core.GeoRegion3D.initializeBase(this);

    this.type = SuperMap.Web.Core.GeometryType.GEOREGION3D;
    this.regionArray = [];
    if(Function._validateParams(arguments, [{name: "point3DsArray", type: Array, elementType: SuperMap.Web.Core.Point3Ds}]) == null) {
        for(var i = 0; i < point3DsArray.length; i++) {
            this.regionArray.push(point3DsArray[i].pntArray);
        }
    }
};
SuperMap.Web.Core.GeoRegion3D.prototype = {


    convertToGeoRegion: function() {
        if(this.get_partCount() > 0) {
            var geoRegion = new SuperMap.Geometry.Polygon();
            for (var polycount = 0; polycount < this.get_partCount(); polycount++) {
               var pnt3Ds = this.getPart(polycount);
               var pnt2Ds = pnt3Ds.toPoint2Ds();
               geoRegion.components[polycount] = pnt2Ds;
            }
           return geoRegion;
        }
        return null;
    },

    get_partCount : function() {
         ///<value type="Number" integer="true"></value>

        return this.regionArray.length;
    },


    clone : function() {
        ///<return type="SuperMap.Web.Core.GeoRegion3D"></return>
        var result = new SuperMap.Web.Core.GeoRegion3D();
        result.regionArray = this.regionArray;
        return result;
    },

    addPart : function(point3Ds) {
        ///<param name="point3Ds" type="SuperMap.Web.Core.Point3Ds"></param>
        ///<returns type="Number" integer="true"></returns>

        if(SuperMap.Web.Core.Point3Ds.isInstanceOfType(point3Ds)) {
            this.regionArray.push(point3Ds.pntArray);
        }
    },

    getPart : function(nIndex) {
        ///<param name="nIndex" type="Number" integer="true"></param>
        ///<returns type="SuperMap.Web.Core.Point3Ds"></returns>
        if(typeof nIndex !== "number") {
            return;
        }
        return this.regionArray[nIndex];
    },



    removePart : function(nIndex) {
        ///<param name="nIndex" type= "Number" integer="true"></param>
        ///<returns type="Boolean"></returns>
        if(typeof nIndex !== "number") {
            return;
        }

        return (this.regionArray.splice(nIndex, 0).length === 1);
    },

    setPart : function(nIndex, point3Ds) {
        ///<param name="nIndex" type="Number" integer="true"></param>
        ///<param name="point3Ds" type="SuperMap.Web.Core.Point3Ds"></param>
        ///<returns type="Boolean"></returns>
        if(!(point3Ds instanceof SuperMap.Web.Core.Point3Ds)) {
            return -1;
        }

        this.regionArray[nIndex] = point3Ds.pntArray;
    }

}
SuperMap.Web.Core.GeoRegion3D.registerClass('SuperMap.Web.Core.GeoRegion3D', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);



/**
* 类名 : GeoSphere
* 描   述： 三维几何球对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoSphere = function(radius) {
    ///<param name="radius" type="Number" integer="false">球的半径</param>
    ///<returns type="SuperMap.Web.Core.GeoSphere"></returns>
	SuperMap.Web.Core.GeoSphere.initializeBase(this);

    this.radius = 0;
    if(typeof radius === "number") {
        this.radius = radius;
    }
    this.type = SuperMap.Web.Core.GeometryType.GEOSPHERE;

};
SuperMap.Web.Core.GeoSphere.prototype = {

    get_radius: function() {
        ///<value type="Number" integer="false">球半径</value>
        return this.radius;
    },
    set_radius: function(x) {
        if(typeof x === "number") {
            this.radius = x;
        }
    },
    

    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoSphere"></returns>

        var geoSphere = new SuperMap.Web.Core.GeoSphere();
        geoSphere.radius = this.radius;
        return geoSphere;
    }
}
SuperMap.Web.Core.GeoSphere.registerClass('SuperMap.Web.Core.GeoSphere', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoCircle3D
* 描   述： 三维几何圆对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoCircle3D = function(radius) {
    ///<param name="radius" type="Number" integer="false"></param>
    ///<returns type="SuperMap.Web.Core.GeoCircle3D"></returns>
	SuperMap.Web.Core.GeoCircle3D.initializeBase(this);
    this.type = SuperMap.Web.Core.GeometryType.GEOCIRCLE3D;

    this.radius = 0;
    if(typeof radius === "number") {
        this.radius = radius;
    }
};

SuperMap.Web.Core.GeoCircle3D.prototype = {


    get_radius : function() {
        ///<value type="Number" integer="false">圆半径</value>

        return this.radius;
    },
    set_radius : function(x) {
        if(typeof x === "number") {
            this.radius = x;
        }
    },

    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoCircle3D"></returns>
        var geoCircle3D = new SuperMap.Web.Core.GeoCircle3D();
        geoCircle3D.radius = this.radius;
        return geoCircle3D;
    }
}
SuperMap.Web.Core.GeoCircle3D.registerClass('SuperMap.Web.Core.GeoCircle3D', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoCone
* 描   述： 三维几何圆椎体对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoCone = function(radius,height) {
     ///<param name="radius" type="Number" integer="false">圆锥底面半径</param>
     ///<param name="height" type="Number" integer="false">圆锥高度</param>
     ///<returns type="SuperMap.Web.Core.GeoCone"></returns>
	SuperMap.Web.Core.GeoCone.initializeBase(this);


    this.type = SuperMap.Web.Core.GeometryType.GEOCONE;

    this.radius = 0;
    this.height = 0;
    if(typeof radius === "number" && typeof height === "number") {
        this.radius = radius;
        this.height = height;
    }
};
SuperMap.Web.Core.GeoCone.prototype = {

    get_radius : function() {
        ///<value type="Number" integer="false">圆锥底面半径</value>
        return this.radius;
    },

    set_radius: function(x) {
        if(typeof x === "number") {
            this.radius = x;
        }
    },


    get_height : function(){
        ///<value type="Number" integer="false">圆锥高度</value>
        return this.height;
    },

    set_height : function(x) {
        if(typeof x === "number") {
            this.height = x;
        }
    },

    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoCone"></returns>

        var geoCone = new SuperMap.Web.Core.GeoCone();
        geoCone.height = this.height;
        geoCone.radius = this.radius;
        return geoCone;
    }
}
SuperMap.Web.Core.GeoCone.registerClass('SuperMap.Web.Core.GeoCone', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);

/**
* 类名 : GeoCylinder
* 描   述： 三维几何圆柱对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoCylinder = function(radiusTop,radiusBottom,height) {
    ///<param name="radiusTop" type="Number" integer="false">圆柱顶面半径</param>
    ///<param name="radiusBottom" type="Number" integer="false">圆柱底面半径</param>
    ///<param name="height" type="Number" integer="false">圆柱体高度</param>
    ///<returns type="SuperMap.Web.Core.GeoCylinder"></returns>
	  SuperMap.Web.Core.GeoCylinder.initializeBase(this);

    if(typeof radiusTop !== "number" || typeof radiusBottom !== "number" || typeof height !== "number") {
        return;
    }

    this.type = SuperMap.Web.Core.GeometryType.GEOCYLINDER;
    this.radiusTop = radiusTop;
    this.radiusBottom = radiusBottom;
    this.height = height;
};

SuperMap.Web.Core.GeoCylinder.prototype = {

    get_radiusTop: function() {
        ///<value type="Number" integer="false">圆柱顶面半径</value>
        return this.radiusTop;
    },
    set_radiusTop: function(x) {
        if(typeof x === "number") {
            this.radiusTop = x;
        }
    },
    get_radiusBottom: function() {
        ///<value type="Number" integer="false">圆柱底面半径</value>
        return this.radiusBottom;
    },

    set_radiusBottom : function(x) {
        if(typeof x === "number") {
            this.radiusBottom = x;
        }
    },

    get_height : function() {
         ///<value type="Number" integer="false">圆柱体高度</value>
        return this.height;
    },

    set_height : function(x) {
        if(typeof x === "number") {
            this.height = x;
        }
    },

    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoCylinder"></returns>

        var geoCylinder = new SuperMap.Web.Core.GeoCylinder();
        geoCylinder.radiusTop = this.radiusTop;
        geoCylinder.radiusBottom = this.radiusBottom;
        geoCylinder.height = this.height;
        return geoCylinder;
    }
}
SuperMap.Web.Core.GeoCylinder.registerClass('SuperMap.Web.Core.GeoCylinder', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoEllipsoid
* 描   述： 三维几何椭球对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoEllipsoid = function(xAxis,yAxis,zAxis,angle) {
    ///<param name="xAxis" type="Number" integer="false">椭球的x轴值</param>
    ///<param name="yAxis" type="Number" integer="false">椭球的y轴值</param>
    ///<param name="zAxis" type="Number" integer="false">椭球的z轴值</param>
    ///<param name="angle" type="Number" integer="false">椭球旋转角度</param>
    ///<returns type="SuperMap.Web.Core.GeoEllipsoid"></returns>
	  SuperMap.Web.Core.GeoEllipsoid.initializeBase(this);

    if(typeof xAxis !== "number" || typeof yAxis !== "number" || typeof zAxis !== "number" || typeof angle !== "number") {
        return;
    }
    this.type = SuperMap.Web.Core.GeometryType.GEOELLIPSOID;

    this.priAxis = xAxis;
    this.thiAxis = yAxis;
    this.secAxis = zAxis;
    this.angle = angle;

};
SuperMap.Web.Core.GeoEllipsoid.prototype = {
    get_xAxis : function() {
        ///<value type="Number" integer="false">椭球的x轴值</value>
        return this.priAxis;
    },

    set_xAxis : function(x) {
        if(typeof x === "number") {
            this.priAxis = x;
        }
    },

    get_yAxis : function() {
        ///<value type="Number" integer="false">椭球的y轴值</value>
        return this.thiAxis;
    },

    set_yAxis : function(x) {
        if(typeof x === "number") {
            this.thiAxis = x;
        }
    },

    get_zAxis : function() {
         ///<value type="Number" integer="false">椭球的z轴值</value>
        return this.secAxis;
    },
    set_zAxis : function(x) {
        if(typeof x === "number") {
            this.secAxis = x;
        }
    },

    get_angle : function(){
        ///<value type="Number" integer="false">椭球旋转角度值</value>
        return this.angle;
    },

    set_angle:function(x){
        if(typeof x === "number") {
            this.angle = x;
        }
    },

    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoEllipsoid"></returns>
        var geoEllipsoid = new SuperMap.Web.Core.GeoEllipsoid();
        geoEllipsoid.priAxis = this.priAxis;
        geoEllipsoid.thiAxis = this.thiAxis;
        geoEllipsoid.secAxis = this.secAxis;
        geoEllipsoid.angle = this.angle;

        return geoEllipsoid;
    }
}
SuperMap.Web.Core.GeoEllipsoid.registerClass('SuperMap.Web.Core.GeoEllipsoid', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoHemiSphere
* 描   述： 三维几何半球对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoHemiSphere = function(radius) {
    ///<param name="radius" type="Number" integer="false">几何半球半径</param>
    ///<returns type="SuperMap.Web.Core.GeoHemiSphere"></returns>

	SuperMap.Web.Core.GeoHemiSphere.initializeBase(this);

    if(typeof radius !== "number") {
        return;
    }

    this.type = SuperMap.Web.Core.GeometryType.GEOHEMISPHERE;

    this.radius = radius;

};
SuperMap.Web.Core.GeoHemiSphere.prototype = {

    get_radius : function() {
        ///<value type="Number" integer="false">几何半球半径</value>
        return this.radius;
    },

    set_radius : function(x) {
        if(typeof x === "number") {
            this.radius = x;
        }
    },

    clone: function() {
        ///<returns type="SuperMap.Web.Core.GeoHemiSphere"></returns>

        var geoHemiSphere = new SuperMap.Web.Core.GeoHemiSphere();
        geoHemiSphere.radius = this.radius;
        return geoHemiSphere;
    }
}
SuperMap.Web.Core.GeoHemiSphere.registerClass('SuperMap.Web.Core.GeoHemiSphere', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);

/**
* 类名 : GeoPie3D
* 描   述： 三维几何扇形对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoPie3D = function() {
    ///<returns type="SuperMap.Web.Core.GeoPie3D"></returns>
	SuperMap.Web.Core.GeoPie3D.initializeBase(this);
    this.type = SuperMap.Web.Core.GeometryType.GEOPIE3D;
};

SuperMap.Web.Core.GeoPie3D.prototype = {
    get_semiMajorAxis : function() {
        ///<value type="Number" integer="false">长半轴</value>
        return this.semiMajorAxis;
    },

    set_semiMajorAxis : function(x) {
        if(typeof x === "number") {
            this.semiMajorAxis = x;
        }
    },

    get_semiMinorAxis : function() {
        ///<value type="Number" integer="false">短半轴</value>
        return this.semiMinorAxis;
    },

    set_semiMinorAxis : function(x) {
        if(typeof x === "number") {
            this.semiMinorAxis = x;
        }
    },

    get_startAngle : function() {
        ///<value type="Number" integer="false">起始角度</value>
        return this.startAngle;
    },

    set_startAngle : function(x) {
        if(typeof x === "number") {
            this.startAngle = x;
        }
    },

    get_endAngle : function() {
        ///<value type="Number" integer="false">终止角度</value>
        return this.endAngle;
    },

    set_endAngle : function(x) {
        if(typeof x === "number") {
            this.endAngle = x;
        }
    },

    get_rotationAngle : function() {
        ///<value type="Number" integer="false">旋转角度</value>
        return this.rotationAngle;
    },

    set_rotationAngle : function(x) {
        if(typeof x === "number") {
            this.rotationAngle = x;
        }
    },

    clone: function() {
        ///<returns type="SuperMap.Web.Core.GeoPie3D"></returns>
        var innerGeoPie3D = this._innerGeometry.Clone();

        var geoPie3D = new SuperMap.Web.Core.GeoPie3D();
        geoPie3D.semiMajorAxis = this.semiMajorAxis;
        geoPie3D.semiMinorAxis = this.semiMinorAxis;
        geoPie3D.startAngle = this.startAngle;
        geoPie3D.endAngle = this.endAngle;
        geoPie3D.rotationAngle = this.rotationAngle;
        return geoPie3D;
    }
}
SuperMap.Web.Core.GeoPie3D.registerClass('SuperMap.Web.Core.GeoPie3D', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);

/**
* 类名 : GeoPieCylinder
* 描   述： 三维几何扇面圆柱体对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoPieCylinder = function() {
    ///<returns type="SuperMap.Web.Core.GeoPieCylinder"></returns>
	SuperMap.Web.Core.GeoPieCylinder.initializeBase(this);

    this.type = SuperMap.Web.Core.GeometryType.GEOPIECYLINDER;
};
SuperMap.Web.Core.GeoPieCylinder.prototype = {

    get_semiMajorAxis : function() {
        ///<value type="Number" integer="false">扇面的长半轴</value>
        return this.semiMajorAxis;
    },
    set_semiMajorAxis : function(x) {
        if(typeof x === "number") {
            this.semiMajorAxis = x;
        }
    },
    get_semiMinorAxis : function() {
        ///<value type="Number" integer="false">扇面的短半轴</value>
        return this.semiMinorAxis;
    },
    set_semiMinorAxis : function(x) {
        if(typeof x === "number") {
            this.semiMinorAxis = x;
        }
    },
    get_startAngle : function() {
        ///<value type="Number" integer="false">扇面的起始角度</value>
        return this.startAngle;
    },
    set_startAngle : function(x) {
        if(typeof x === "number") {
            this.startAngle = x;
        }
    },
    get_endAngle : function() {
         ///<value type="Number" integer="false">扇面的终止角度</value>
        return this.endAngle;
    },
    set_endAngle : function(x) {
        if(typeof x === "number") {
            this.endAngle = x;
        }
    },
    get_rotationAngle : function() {
         ///<value type="Number" integer="false">旋转角度</value>
        return this.rotationAngle;
    },
    set_rotationAngle : function(x) {
        if(typeof x === "number") {
            this.rotationAngle = x;
        }
    },
    get_height : function() {
        ///<value type="Number" integer="false">扇面圆柱的高度</value>
        return this.height;
    },
    set_height : function(x) {
        if(typeof x === "number") {
            this.height = x;
        }
    },
    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoPieCylinder"></returns>
        var geoPieCylinder = new SuperMap.Web.Core.GeoPieCylinder();
        geoPieCylinder.semiMajorAxis = this.semiMajorAxis;
        geoPieCylinder.semiMinorAxis = this.semiMinorAxis;
        geoPieCylinder.startAngle = this.startAngle;
        geoPieCylinder.endAngle = this.endAngle;
        geoPieCylinder.rotationAngle = this.rotationAngle;
        geoPieCylinder.height = this.height;
        return geoPieCylinder;
    },
}
SuperMap.Web.Core.GeoPieCylinder.registerClass('SuperMap.Web.Core.GeoPieCylinder', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoPyramid
* 描   述： 三维棱锥对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoPyramid = function(length,width,height) {
    ///<param name="length" type="Number" integer="false">棱锥底部的长度</param>
    ///<param name="width" type="Number" integer="false">棱锥底部的宽度</param>
    ///<param name="height" type="Number" integer="false">棱锥的高度</param>
    ///<returns type="SuperMap.Web.Core.GeoPyramid"></returns>
	SuperMap.Web.Core.GeoPyramid.initializeBase(this);


    this.pyramidLength = length || 0;
    this.pyramidWidth = width || 0;
    this.pyramidHeight = height || 0;
};
SuperMap.Web.Core.GeoPyramid.prototype = {

    dispose : function() {
        ///<returns type="void">析构函数</returns>
        this._innerGeometry = null;
    },

    get_pyramidLength : function() {
        ///<value type="Number" integer="false">棱锥底部的长度</value>
        return this.pyramidLength;
    },

    set_pyramidLength : function(x) {
        var n_x = parseFloat(x);
        if(!isNaN(n_x)) {
            this.pyramidLength = n_x;
        }
    },

    get_pyramidWidth : function() {
        ///<value type="Number" integer="false">棱锥底部的宽度</value>
        return this.pyramidWidth;
    },

    set_pyramidWidth: function(x) {
        var n_x = parseFloat(x);
        if (!isNaN(n_x)) {
            this.pyramidWidth = n_x;
        }
    },
    get_pyramidHeight: function(){
        ///<value type="Number" integer="false">棱锥底部的高度</value>
        return this.pyramidHeight;
    },
    set_pyramidHeight:function(x){
        var n_x = parseFloat(x);
        if (!isNaN(n_x)) {
            this.pyramidHeight = n_x;
        }
    },
   
    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoPyramid"></returns>

        var geoPyramid = new SuperMap.Web.Core.GeoPyramid();
        geoPyramid.pyramidLength = this.pyramidLength;
        geoPyramid.pyramidWidth = this.pyramidWidth;
        geoPyramid.pyramidHeight = this.pyramidHeight;
        return geoPyramid;
    }
}
SuperMap.Web.Core.GeoPyramid.registerClass('SuperMap.Web.Core.GeoPyramid', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);


/**
* 类名 : GeoBox
* 描   述： 三维盒对象
* 版 本 号：
*/
SuperMap.Web.Core.GeoBox = function(length,width,height) {
    ///<param name="length" type="Number" integer="false">盒的长度(z)</param>
    ///<param name="width"  type="Number" integer="false">盒的宽度(x)</param>
    ///<param name="height" type="Number" integer="false">盒的高度(y)</param>
    ///<returns type="SuperMap.Web.Core.GeoBox"></returns>
  	SuperMap.Web.Core.GeoBox.initializeBase(this);

    this.type = SuperMap.Web.Core.GeometryType.GEOBOX;

    this.length = length || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.center = new SuperMap.Web.Core.Point3D(0, 0, 0);
};

SuperMap.Web.Core.GeoBox.prototype = {

    dispose : function() {
        ///<returns type="void">析构函数</returns>
        this._innerGeometry = null;
    },

    get_length : function() {
        ///<value type="Number" integer="false">盒的长度(z)</value>
        return this.length;
    },

    set_length : function(x) {
        if(typeof x !== "number") {
            return;
        }
        this.length = x;
    },

    get_width : function() {
        ///<value type="Number" integer="false">盒的宽度(x)</value>
        return this.width;
    },

    set_width : function(x) {
        if(typeof x !== "number") {
            return;
        }

        this.width = x;
    },

    get_height : function(){
        ///<value type="Number" integer="false">盒的高度(y)</value>
        return this.height;
    },

    set_height : function(x){
        if(typeof x !== "number") {
            return;
        }

        this.height = x;
    },

    clone : function() {
        ///<returns type="SuperMap.Web.Core.GeoBox"></returns>
        return new SuperMap.Web.Core.GeoBox(this.length, this.width, this.height);
    }
}
SuperMap.Web.Core.GeoBox.registerClass('SuperMap.Web.Core.GeoBox', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);

/**
* 类名 : GeoBillboard
* 描   述： 布告板类
* 版 本 号：
*/
SuperMap.Web.Core.GeoBillboard = function() {
    ///<returns type="SuperMap.Web.Core.GeoBillboard"></returns>

  	SuperMap.Web.Core.GeoBillboard.initializeBase(this);

    this.type = SuperMap.Web.Core.GeometryType.GEOBILLBOARD;

    this.width = 100;
    this.height = 100;
    this.tag = "";
};
SuperMap.Web.Core.GeoBillboard.prototype = {

   
	get_width : function() {
		///<value type="Number" integer="false">宽度</value>
		return this.width;
	},

	set_width : function(x) {
		var n_x = parseFloat(x);
		if(!isNaN(n_x)) {
			this.width = n_x;
		}
    },

	get_height : function() {
		///<value type="Number" integer="false">高度</value>
		return this.height;
	},

	set_height:function(x) {
		var n_x = parseFloat(x);
		if (!isNaN(n_x)) {
			this.height = n_x;
		}
	},

	getTag : function() {
		return this.tag;
	},

	setTag : function(tag) {
		this.tag = tag;
	}
}
SuperMap.Web.Core.GeoBillboard.registerClass('SuperMap.Web.Core.GeoBillboard', SuperMap.Web.Core.Geometry3D, Sys.IDisposable);