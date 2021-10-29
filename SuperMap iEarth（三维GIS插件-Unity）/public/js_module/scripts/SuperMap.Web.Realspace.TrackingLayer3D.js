//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.TrackingLayer3D.js
// 功能：			 三维屏幕图层类
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.TrackingLayer3D = function(scenecontrol) {
	/// <summary>3D跟踪图层对象</summary>

  	SuperMap.Web.Realspace.TrackingLayer3D.initializeBase(this);

  	// this._innerTrackingLayer3D = scenecontrol._get_innerSceneControl();
    // this._feature3Dlist = [];

};

SuperMap.Web.Realspace.TrackingLayer3D.prototype = {

    // dispose : function() {
    //     ///<returns type="void">析构函数</returns>
    //     this._innerTrackingLayer3D = null;
    //     Array.clear(this._feature3Dlist);
    // },

    // /*
    // *图层可见性属性
    // */
    // get_isVisible : function() {
    //     ///<value type="Boolean">返回图层是否可见</value>
    //     if(this._innerTrackingLayer3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetIsVisible",
    //         needResult : true
    //     }

    //     return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "boolean")) === "true");
    // },

    // set_isVisible : function(isVisible) {
    //     ///<summary>设置图层可见性</summary>
    //     if(this._innerTrackingLayer3D == null || typeof isVisible !== "boolean") {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "SetIsVisible",
    //         needResult : false,
    //         arguments : {
    //             visible : isVisible
    //         }
    //     }

    //     this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D);
    // },

    // /*
    //  *图层可选择性属性
    //  */
	//  /*底层未实现暂不对外开放*/
    // get_isSelectable : function() {
    //     ///<value type="Boolean">返回图层是否可选择</value>
    //     if(this._innerTrackingLayer3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetIsSelectable",
    //         needResult : true
    //     }

    //     return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "boolean")) === "true");
    // },

    // set_isSelectable : function(isSelectable) {
    //     ///<summary>设置图层可见性</summary>
    //     if(this._innerTrackingLayer3D == null || typeof isSelectable !== "boolean") {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "SetIsSelectable",
    //         needResult : false,
    //         arguments : {
    //             selectable : isSelectable
    //         }
    //     }

    //     this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D);
    // },


    // /*
    //  *图层可编辑性属性
    //  */
    // get_isEditable : function() {
    //     ///<value type="Boolean">返回图层是否可编辑</value>
    //     if(this._innerTrackingLayer3D == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetIsEditable",
    //         needResult : true
    //     }

    //     return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "boolean")) === "true");
    // },

    // set_isEditable : function(isEditable) {
    //     ///<summary>设置图层可见性</summary>
    //     if(this._innerTrackingLayer3D == null || typeof isEditable !== "boolean") {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "SetIsEditable",
    //         needResult : false,
    //         arguments : {
    //             editable : isEditable
    //         }
    //     }

    //     this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D);
    // },


    // /*
    // *几何对象的数量
    // */
    // get_count : function() {
    //     ///<value type="Number" integer="true">几何对象的数量</value>
    //     return this._feature3Dlist.length;
    // },

    // get_item : function(index) {
    //     ///<param name="index" type="String" type="Number"></param>
    //     ///<value type="SuperMap.Web.Core.Feature3D"></value>

    //     if (this._innerTrackingLayer3D == null) {
    //         return null;
    //     }

    //     var nIndex = -1;
    //     if(typeof index === "number") {
    //         nIndex = index;
    //     }else if (typeof index === "string") {
    //         nIndex = this.indexOf(index);
    //     }

    //     return this._feature3Dlist[nIndex];
    // },

    // set_item : function(index, feature3D) {

    //     if(this._innerTrackingLayer3D == null) {
    //         return;
    //     }
    //     if(SuperMap.Web.Core.Feature3D.isInstanceOfType(feature3D)) {
    //        if(feature3D.get_geometry() == null) {
    //            return ;
    //        }
    //         var nIndex = null;
    //         if(typeof index == "string") {
    //             nIndex = this.indexOf(index);
    //         }else if (typeof index === "number") {
    //             nIndex = index;
    //         }
    //         // 这里不必像add一样再做处理，因为是替换就应该保持队列中的feature3d也被对应替换，
    //         // 其实应该是直接替换feature3d中的geometry就可以了，但是在这个体系里，牢记加进去的其实只是geometry。
    //         if(nIndex >= 0 && nIndex < this.get_count() && nIndex !== null) {

    //             var cmd = {
    //                 func : "SetItem",
    //                 needResult : false,
    //                 arguments : {
    //                     feature3D : feature3D.name,
    //                     index : nIndex
    //                 }
    //             }

    //             this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D);

    //             this._feature3Dlist[nIndex] = feature3D;
    //             feature3D._innerTrackingLayer3D = this;
    //         }
    //     }
    // },

    // add : function(feature3d, tag) {
    //     ///<param name="feature3D" type="SuperMap.Web.Core.Feature3D"></param>
    //     ///<param name="tag" type="String"></param>
    //     ///<returns type="Number" integer="true"></returns>
    //     if(this._innerTrackingLayer3D === null || typeof tag !== "string") {
    //         return null;
    //     }

    //     if(SuperMap.Web.Core.Feature3D.isInstanceOfType(feature3d)) {
    //         if(feature3d.get_geometry() == null) {
    //             return null;
    //         }

    //         var cmd = {
    //             func : "Add",
    //             needResult : true,
    //             arguments : {
    //                 feature3D : feature3d.name,
    //                 tag : tag
    //             }
    //         }

    //         var index = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "number")));


    //         feature3d._innerTrackingLayer3D = this;
    //         feature3d.set_name(tag);
	// 		      feature3d._nIndex = index;
    //         if(index >= 0 && index == this._feature3Dlist.length) {
    //             // var pos = this._isAlreadyHaveOne(feature3d);
    //             // if (pos >= 0) {
    //             //     return index;
    //             // }

    //             this._feature3Dlist.push(feature3d);
    //             return index;
    //         }
    //     }
    //     return -1;
    // },

    // _isAlreadyHaveOne: function(feature3d) {
    //     var featureinlist = null;
    //     for (var i = 0; i < this._feature3Dlist.length; i++) {
    //         featureinlist = this._feature3Dlist[i];
    //         if(feature3d.name == featureinlist.name) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // },

    // indexOf : function(tag) {
    //     ///<param name="tag" type="String"></param>
    //     ///<returns type="Number" integer="true"></returns>
    //     if(this._innerTrackingLayer3D == null || typeof tag !== "string") {
    //         return -1;
    //     }

    //     var cmd = {
    //         func : "IndexOf",
    //         needResult : true,
    //         arguments : {
    //             tag : tag
    //         }
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "number")));
    // },

    removeAll : function() {
        ///<returns type="void"></returns>
       
        var cmd = {
            Func  : "DelSceneAction",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SCENECONTROL
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

//     removeAt : function(index) {
//         ///<param name="index" type="Number" integer="true"></param>
//         ///<returns type="Boolean"></returns>
//         if(this._innerTrackingLayer3D == null) {
//             return;
//         }
//         if (index != null && (!isNaN(index) || typeof (index) == "string")) {
//             var feature3d = this.get_item(index);
//             if(feature3d != null) {
//                 Array.remove(this._feature3Dlist, feature3d);
//                 var cmd = {
//                     func : "RemoveAt",
//                     needResult : true,
//                     arguments : {
//                         index : index
//                     }
//                 }

//                 return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "boolean")) === "true");
//             }
//         }
//         return false;

//     },

//     /*
//     *获取几何对象的标签
//     */
//     getTag : function(index) {
//         /// <summary>获取指定序号的几何对象的标签</summary>
//         ///<param name="index" type="Number" integer="true">几何对象序号</param>
//         ///<returns type="String">返回几何对象的标签</returns>
//         if(this._innerTrackingLayer3D == null || typeof index !== "number") {
//             return null;
//         }

//         var cmd = {
//             func : "GetTag",
//             needResult : true,
//             arguments : {
//                 index : index
//             }
//         }

//         return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "string"));
//     },

//     /*
//     *设置几何对象的标签
//     */
//     setTag : function(index, tag) {
//         /// <summary>设置指定序号的几何对象的标签</summary>
//         ///<param name="index" type="Number">几何对象的序号</param>
//         ///<param name="tag" type="String">几何对象的标签</param>
//         ///<returns type="void"></returns>

//         if(this._innerTrackingLayer3D == null || typeof index !== "number" || typeof tag  !== "string") {
//             return;
//         }

//         var cmd = {
//             func : "SetTag",
//             needResult : false,
//             arguments : {
//                 index : index,
//                 tag : tag
//             }
//         }

//         this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D);
//     },


//     refresh : function() {
//         if(this._innerTrackingLayer3D == null) {
//             return null;
//         }

//         var cmd = {
//             func : "Refresh",
//             needResult : false
//         }

//         this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D);
//     },

//     hitTest : function(hitPoint) {
// 		    ///<param name="hitPoint" type="SuperMap.Pixel"></param>
//         ///<returns type="SuperMap.Web.Core.Feature3D"></returns>
//         if(this._innerTrackingLayer3D == null) {
//             return null;
//         }

//         if(SuperMap.Pixel.isInstanceOfType(hitPoint)) {
//             var cmd = {
//                 func : "HitTest",
//                 needResult : true,
//                 arguments : {
//                     point : {
//                         x : hitPoint.x,
//                         y : hitPoint.y
//                     }
//                 }
//             }

//             var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "object"));

//             var index = Number(object.index);

//             if(index < 0) {
//                 return null;
//             }

//             return this._feature3Dlist[index];
//         }
//     },

//     getIndexAndGeometryId : function(hitPoint) {
//         ///<param name="hitPoint" type="SuperMap.Pixel"></param>
//         ///<returns type="SuperMap.Web.Core.Feature3D"></returns>
//         if(this._innerTrackingLayer3D == null) {
//             return null;
//         }

//         if(SuperMap.Pixel.isInstanceOfType(hitPoint)) {
//             var cmd = {
//                 func : "HitTest",
//                 needResult : true,
//                 arguments : {
//                     point : {
//                         x : hitPoint.x,
//                         y : hitPoint.y
//                     }
//                 }
//             }

//             var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "object"));

//             return {
//                 index : Number(object.index),
//                 id : Number(object.geometryID)
//             };
//         }
//     },

//     addGeometries : function(geometries, style, bused, heatMapInfo, tag) {
//       ///<param name="geometries" type="Array">geometry数组</param>
//       ///<param name="style" type="SuperMap.Web.Core.Style3D">风格</param>
//       ///<param name="bused" type="Boolean">是否是热力图</param>
//       ///<param name="heatMapInfo" type="SuperMap.Web.Realspace.HeatMapInfo">热力图信息</param>
//       ///<param name="tag" type="String">标签</param>
//       ///<returns type="Number">索引</returns>
//       if(!(geometries instanceof Array) || !(style instanceof SuperMap.Web.Core.Style3D) || typeof bused !== "boolean" || !(heatMapInfo instanceof SuperMap.Web.Realspace.HeatMapInfo) || typeof tag !== "string") {
//           return -1;
//       }

//       var arr = [];
//       for(var i = 0, len = geometries.length; i < len; i++) {
//           arr.push({
//               x : geometries[i].x,
//               y : geometries[i].y,
//               z : geometries[i].z,
//               id : geometries[i].id
//           });
//       }
//       var cmd = {
//           func : "AddGeometries",
//           needResult : true,
//           arguments : {
//               geometries : arr,
//               style : style,
//               used : bused,
//               heatMapInfo : heatMapInfo,
//               tag : tag
//           }
//       }

//       var index = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerTrackingLayer3D.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D), "number")));
//       this._feature3Dlist.push({tag : tag});
//       return index;
//   }

};
SuperMap.Web.Realspace.TrackingLayer3D.registerClass('SuperMap.Web.Realspace.TrackingLayer3D', Sys.Component);


// SuperMap.Web.Realspace.HeatMapInfo = function() {
// 	  /// <summary>热力图信息</summary>

//   	SuperMap.Web.Realspace.HeatMapInfo.initializeBase(this);

//   	//this._innerHeatMapInfo = SuperMap.Web.Realspace.Utility._SceneControl._get_innerObjectManager();

//     this.pointPixel = 30;
//     this.intension = 200;
//     this.bounds = new SuperMap.Bounds(0, 0, 0, 0);
// };

// SuperMap.Web.Realspace.HeatMapInfo.prototype = {

//     /*
//     *像素大小
//     */
//     get_pointPixel : function() {
//         ///<returns type="Number"></returns>
//         return this.pointPixel;
//     },

//     set_pointPixel : function(value) {
//         ///<param name="value" type="Number"></param>
//         if(typeof value !== "number") {
//             return;
//         }

//         this.pointPixel = value;
//     },

//     /*
//     *强度
//     */
//     get_intension : function() {
//         ///<returns type="Number"></returns>
//         return this.intension;
//     },

//     set_intension : function(value) {
//         ///<param name="value" type="Number"></param>
//         if(typeof value !== "number") {
//             return;
//         }

//         this.intension = value;
//     },

//     get_bounds : function() {
//         return bounds;
//     },

//     set_bounds : function(bounds) {
//         if(!(bounds instanceof SuperMap.Bounds)) {
//             return;
//         }
//         this.bounds = bounds;
//     }
// }

// SuperMap.Web.Realspace.HeatMapInfo.registerClass('SuperMap.Web.Realspace.HeatMapInfo', Sys.Component);
