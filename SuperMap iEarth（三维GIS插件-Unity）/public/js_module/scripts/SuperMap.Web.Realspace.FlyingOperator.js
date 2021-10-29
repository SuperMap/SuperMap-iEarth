//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2014。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.FlyingOperator
// 功能：			 飞行操作类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.FlyingOperator = function (scenecontrol) {
    /// <summary>飞行操作对象</summary>
  	SuperMap.Web.Realspace.FlyingOperator.initializeBase(this);
  	//this._innerFlyingOperator = scenecontrol._get_innerSceneControl();
};

SuperMap.Web.Realspace.FlyingOperator.prototype = {
    // flyTo : function(camera, nMillSec, flyingMode) {
    //     /// <summary>飞行到指定的相机位置</summary>
    //     ///<param name="camera" type="SuperMap.Web.Realspace.Camera">相机参数</param>
    //     ///<param name="nMillSec" type="number" integer="true" optional="true">飞行时间</param>
    //     ///<param name="flyingMode" type="SuperMap.Web.Realspace.FlyingMode" optional="true">飞行方式</param>
    //     ///<returns type="void"></returns>
    //     if((this._innerFlyingOperator === null)) {
    //         return;
    //     }
    //     if(SuperMap.Web.Realspace.Camera.isInstanceOfType(camera)) {
    //         var sec = parseFloat(nMillSec) || 5000;
    //         var mode = parseInt(flyingMode) || 6;
    //         var cmd = {
    //             func : "FlyTo",
    //             needResult : false,
    //             arguments : {
    //                 camera : camera,
    //                 millSec : sec
    //             }
    //         }

    //         this._innerFlyingOperator.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR);
    //     }
    // },

	//  flyToLookAt : function(lookat, nMillSec) {
    //     /// <summary>飞行到指定的相机位置</summary>
    //     ///<param name="LookAt" type="SuperMap.Web.Realspace.LookAt">相机参数</param>
    //     ///<param name="nMillSec" type="number" integer="true" optional="true">飞行时间</param>
    //     ///<returns type="void"></returns>
    //     if((this._innerFlyingOperator === null)) {
    //         return;
    //     }
    //     if(SuperMap.Web.Realspace.LookAt.isInstanceOfType(lookat)) {
    //         var sec = parseFloat(nMillSec) || 5000;

    //         var cmd = {
    //             func : "FlyToLookAt",
    //             needResult : false,
    //             arguments : {
    //                 lookat : lookat,
    //                 millSec : sec
    //             }
    //         }

    //         this._innerFlyingOperator.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR);
    //     }
    // },

    // play : function(geoline3d, speedRatio, relativeDistance) {
    //     /// <summary>沿线飞行</summary>
    //     ///<param name="geoline3d" type="SuperMap.Web.Core.GeoLine3D">三维线对象</param>
    //     ///<param name="speedRatio" type="number" integer="false" optional="true">飞行速度倍数</param>
    //     ///<param name="relativeDistance" type="number" integer="false" optional="true">飞行相对高度</param>
    //     ///<returns type="void"></returns>
    //     if((this._innerFlyingOperator == null)) {
    //         return;
    //     }

    //     var n_speedRatio = parseFloat(speedRatio) || 1;
    //     var n_relativeDistance = parseFloat(relativeDistance) || 2000;


    //     if(SuperMap.Web.Core.GeoLine3D.isInstanceOfType(geoline3d)) {
    //         var copy = {};
    //         $.extend(copy, geoline3d);
    //         delete copy._innerGeometry;

    //         if(typeof copy.makeWithGeometry !== "undefined") {
    //             delete copy.makeWithGeometry._innerGeometry;
    //         }

    //         var cmd = {
    //             func : "Play",
    //             needResult : false,
    //             arguments : {
    //                 line : copy,
    //                 speedRatio : n_speedRatio,
    //                 relativeDistance : n_relativeDistance
    //             }
    //         }

    //         this._innerFlyingOperator.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR);
    //     }
    // },

    // flyToBounds : function(rect2D, nMillSec) {
    //     /// <summary>飞行到指定的Bounds区域</summary>
    //     ///<param name="rect2D" type="SuperMap.Web.Core.Rectangle2D">指定的Bounds区域</param>
    //     ///<param name="nMillSec" type="number" integer="true" optional="true">飞行时间</param>
    //     ///<returns type="void"></returns>
    //     if((this._innerFlyingOperator === null)) {
    //         return;
    //     }

    //     var n_nMillSec = parseFloat(nMillSec) || 1;
    //     if(SuperMap.Bounds.isInstanceOfType(rect2D)) {

    //   	    if(rect2D.getSize().w == 0 && rect2D.getSize().h == 0) {
    //   				return;
    //   			}

    //         var cmd = {
    //             func : "FlyToBounds",
    //             needResult : false,
    //             arguments : {
    //                 bounds : {
    //                     left : rect2D.left,
    //                     right : rect2D.right,
    //                     top : rect2D.top,
    //                     bottom : rect2D.bottom
    //                 },
    //                 millSec : n_nMillSec
    //             }
    //         }

    //         this._innerFlyingOperator.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR);
    //     }
    // },

    // /*
    // *flyToGeometry:根据指定的目标对象和飞行时间进行飞行
    //  */
    // flyToGeometry : function(geoObject, nMillSec, flyingMode) {
    //     /// <summary>根据指定的飞行模式和目标对象进行飞行</summary>
    //     ///<param name="geoObject" type="SuperMap.Web.Core.Geometry3D">几何对象参数</param>
    //     ///<param name="nMillSec" type="number" integer="true" optional="true">飞行时间</param>
    //     ///<param name="flyingMode" type="SuperMap.Web.Realspace.FlyingMode" optional="true">飞行方式</param>
    //     ///<returns type="void"></returns>
    //     if((this._innerFlyingOperator === null)) {
    //         return;
    //     }
    //     if(SuperMap.Geometry.isInstanceOfType(geoObject)) {
    //         var n_nMillSec = parseFloat(nMillSec) || 1000;
    //         var n_flyingMode = parseInt(flyingMode) || 4;

    //         var copy = {};
    //         $.extend(copy, geoObject);
    //         delete copy._innerGeometry;

    //         if(typeof copy.makeWithGeometry !== "undefined") {
    //             delete copy.makeWithGeometry._innerGeometry;
    //         }

    //         var cmd = {
    //             func : "FlyToGeometry",
    //             needResult : false,
    //             arguments : {
    //                 geometry : copy,
    //                 millSec : n_nMillSec,
    //                 flyingMode : n_flyingMode
    //             }
    //         }

    //         this._innerFlyingOperator.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR);
    //     }
    // },

    // /*
    // *flyCircle:围绕指定地点旋转飞行模式，飞行过程中可以控制飞行的速度
    //  */
    // flyCircle : function(geometry, speedRatio) {
    //     if(this._innerFlyingOperator !== null && typeof speedRatio === "number") {
    //         var copy = {};
    //         $.extend(copy, geometry);
    //         delete copy._innerGeometry;

    //         if(typeof copy.makeWithGeometry !== "undefined") {
    //             delete copy.makeWithGeometry._innerGeometry;
    //         }
            
    //         var cmd = {
    //             func : "FlyCircle",
    //             needResult : false,
    //             arguments : {
    //                 geometry : copy,
    //                 speedRatio : speedRatio
    //             }
    //         }

    //         this._innerFlyingOperator.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR);
    //     }
    // },
    flyToLayer : function(layer) {
        var cmd = {
            Func : "FlyToLayer",
            arguments : {
                layerName : layer.name
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR,
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    }
};
SuperMap.Web.Realspace.FlyingOperator.registerClass('SuperMap.Web.Realspace.FlyingOperator', Sys.Component, Sys.IDisposable);
