//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.ViewShed3D
// 功能：			  可视域分析类，设置可视域分析的各参数
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.ViewShed3D = function(sceneControl) {

    SuperMap.Web.Realspace.ViewShed3D.initializeBase(this);

    // if(typeof sceneControl === "undefined" || !(sceneControl instanceof SuperMap.Web.UI.Controls.SceneControl)) {
    //     this._innerViewShew3D = SuperMap.Web.Realspace.Utility._SceneControl._get_innerObjectManager();
    // }else {
    //     this._innerViewShew3D = sceneControl._get_innerObjectManager();
    // }

    // var cmd = {
    //      func : "Create",
    //      needResult : true
    // }

    // var result = this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // if(result === "") {
    //     this.name = null;
    //     return;
    // }

    // this.name = JSON.parse(result);
};


SuperMap.Web.Realspace.ViewShed3D.prototype ={
     /*
     *visibleAreaColor属性：分析结果的可见区域颜色
     */
    // get_visibleAreaColor : function() {
    //     ///<value type="SuperMap.Web.Core.Color"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetVisibleAreaColor",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var num = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    //     var color = new SuperMap.Web.Core.Color();
    //     color.fromLongABGR(num);
    //     return color;
    // },

    // set_visibleAreaColor : function(color) {
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(color instanceof SuperMap.Web.Core.Color)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetVisibleAreaColor",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             color : color.toLongABGR()
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    // *HiddenAreaColor属性:分析结果中的不可见区域颜色
    // */
    // get_hiddenAreaColor : function() {
    //     ///<value type="SuperMap.Web.Core.Color"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetHiddenAreaColor",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var num = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    //     var color = new SuperMap.Web.Core.Color();
    //     color.fromLongABGR(num);
    //     return color;
    // },

    // set_hiddenAreaColor : function(color) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(color instanceof SuperMap.Web.Core.Color)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetHiddenAreaColor",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             color : color.toLongABGR()
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *ViewerPosition:可视域分析的观察点
    //  */
    // get_viewerPosition : function() {
    //     ///<value type="SuperMap.Web.Core.Point3D"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetViewerPosition",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "object"));
    //     return new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
    // },

    // set_viewerPosition : function(pt3d) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetViewerPosition",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             position : {
    //                 x : pt3d.x,
    //                 y : pt3d.y,
    //                 z : pt3d.z
    //             }
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    // *Quality属性:分析质量
    // */
    // get_quality : function() {
    //     ///<value  type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetQuality",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_quality : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetQuality",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             quality : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *HintLineColor:分析结果中的不可见区域颜色
    //  */
    // get_hintLineColor : function() {
    //     ///<value type="SuperMap.Web.Core.Color"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetHintLineColor",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var num = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    //     var color = new SuperMap.Web.Core.Color();
    //     color.fromLongABGR(num);
    //     return color;
    // },

    // set_hintLineColor : function(color) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(color instanceof SuperMap.Web.Core.Color)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetHintLineColor",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             color : color.toLongABGR()
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    // *set_targetPoint:通过目标点计算距离、方向(设置距离、方向的一种辅助手段)
    //  */
    // set_targetPoint : function(pt3d) {
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetDistDirByPoint",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             position : {
    //                 x : pt3d.x,
    //                 y : pt3d.y,
    //                 z : pt3d.z
    //             }
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *Direction属性:可视域分析视域的方向角
    //  */
    // get_direction : function() {
    //     ///<value  type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetDirection",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_direction : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetDirection",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             direction : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *Pitch属性:可视域分析视域的俯仰角
    //  */
    // get_pitch : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetPitch",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_pitch : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetPitch",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             pitch : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *HorizontalFov属性:可视域分析视域的水平夹角
    //  */
    // get_horizontalFov : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetHorizontalFov",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_horizontalFov : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetHorizontalFov",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             horizontalFov : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *VerticalFov属性:可视域分析视域的垂直夹角
    //  */
    // get_verticalFov : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetVerticalFov",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_verticalFov : function(value) {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetVerticalFov",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             verticalFov : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *Distance属性：可视域分析视域的半径距离
    //  */
    // get_distance : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetDistance",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_distance : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetDistance",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             distance : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    // *setTargetPoint:通过目标点计算距离、方向(设置距离、方向的一种辅助手段
    //  */
    // setTargetPoint : function(pt3d) {
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetDistDirByPoint",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             position : {
    //                 x : pt3d.x,
    //                 y : pt3d.y,
    //                 z : pt3d.z
    //             }
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },



    // setDistDirByPoint : function(pt3d) {
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetDistDirByPoint",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             position : {
    //                 x : pt3d.x,
    //                 y : pt3d.y,
    //                 z : pt3d.z
    //             }
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    /*
     *Build方法：分析并显示结果
     */
    build : function() {
        var cmd = {
            Func : "ViewShedDoBuild",
            classNumber : SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D,
        }
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
        var cmd = {
            Func : "ViewShedDoClear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D,
        }
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },
    // /*
    //  *分析基于的视口
    //  */
    // get_inViewport : function() {
    //     /// <summary>获取基于的视口</summary>
    //     /// <returns type="Number"></returns>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetInViewport",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number")));
    // },

    // set_inViewport : function(value) {
    //     /// <summary>设置视口的索引</summary>
    //     ///<param name="value" type="Number"></param>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerViewShew3D == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetInViewport",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             inViewport : value
    //         }
    //     }

    //     this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D);
    // },

    // /*
    //  *获取可视区域闭合体
    // */
    // getVisibleBody : function() {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetVisibleBody",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var geometryId = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number"));
    //     var geoModel3D = new SuperMap.Web.Core.GeoModel3D();
    //     geoModel3D.geometryId = Number(geometryId);
    //     return geoModel3D;
    // },

    // /*
    //  *获取整个视锥闭合体
    // */
    // getFrustumBody : function() {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetFrustumBody",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var geometryId = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number"));
    //     var geoModel3D = new SuperMap.Web.Core.GeoModel3D();
    //     geoModel3D.geometryId = Number(geometryId);
    //     return geoModel3D;
    // },

    // /*
    //  *获取隐藏区域闭合体
    // */
    // getHiddenBody : function() {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetHiddenBody",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var geometryId = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number"));
    //     var geoModel3D = new SuperMap.Web.Core.GeoModel3D();
    //     geoModel3D.geometryId = Number(geometryId);
    //     return geoModel3D;
    // },

    // /*
    //  *获取可见区域与隐藏区域交界面
    // */
    // getVisibleInterface : function() {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetVisibleInterface",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var geometryId = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerViewShew3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.VIEWSHED3D), "number"));
    //     var geoModel3D = new SuperMap.Web.Core.GeoModel3D();
    //     geoModel3D.geometryId = Number(geometryId);
    //     return geoModel3D;
    // }
 };
SuperMap.Web.Realspace.ViewShed3D.registerClass('SuperMap.Web.Realspace.ViewShed3D', Sys.Component, Sys.IDisposable);
