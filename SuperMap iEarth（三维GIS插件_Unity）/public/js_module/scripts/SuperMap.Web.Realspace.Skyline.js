//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Skyline
// 功能：			  天际线分析类，设置天际线分析的各参数
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.Skyline = function(sceneControl) {
    SuperMap.Web.Realspace.Skyline.initializeBase(this);
};


SuperMap.Web.Realspace.Skyline.prototype ={
    /*
    *ViewerPosition:天际线分析的观察点
    */
    // get_viewerPosition : function() {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetViewerPosition",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var result = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "object"));
    //     this.viewerPosition = new SuperMap.Web.Core.Point3D(result.x, result.y, result.z);
    //     return this.viewerPosition;
    // },

    // set_viewerPosition : function(pt3d) {
    //     ///<value type="SuperMap.Web.Core.Point3D"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(pt3d instanceof SuperMap.Web.Core.Point3D) {
    //         if(!isNaN(pt3d.x) && !isNaN(pt3d.y) && !isNaN(pt3d.z)) {
    //             var cmd = {
    //                 func : "SetViewerPosition",
    //                 name : this.name,
    //                 needResult : false,
    //                 arguments : {
    //                     position : pt3d
    //                 }
    //             }

    //             this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //             this.viewerPosition = pt3d;
    //         }
    //     }
    // },

    // /*
    // *Color属性：天际线颜色
    //  */
    // get_color : function() {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetColor",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var result = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number"));
    //     this.color = result;
    //     var color = new SuperMap.Web.Core.Color();
    //     color.fromLongABGR(this.color);
    //     return color;
    // },

    // set_color : function(value) {
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(value instanceof SuperMap.Web.Core.Color) {
    //         this.color = value.toLongABGR();
    //         var cmd = {
    //             func : "SetColor",
    //             name : this.name,
    //             needResult : false,
    //             arguments : {
    //                 color : this.color
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //     }
    // },

    // /*
    //  *Direction属性:天际线分析视点的方向角
    //  */
    // get_direction : function() {
    //     ///<value  type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetDirection",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var result = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
    //     this.direction = result;
    //     return this.direction;
    // },

    // set_direction : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(typeof value === "number") {
    //         var cmd = {
    //             func : "SetDirection",
    //             name : this.name,
    //             needResult : false,
    //             arguments : {
    //                 direction : value
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //         this.direction = value;
    //     }
    // },

    // /*
    //  *Pitch属性:天际线分析视点的俯仰角
    //  */
    // get_pitch : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetPitch",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var result = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
    //     this.pitch = result;

    //     return this.pitch;
    // },

    // set_pitch : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(typeof value === "number") {
    //         var cmd = {
    //             func : "SetPitch",
    //             name : this.name,
    //             needResult : false,
    //             arguments : {
    //                 pitch : value
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //         this.pitch = value;
    //     }
    // },

    // /*
    //  *Quality属性:天际线的分析质量
    //  */
    // get_quality : function() {
    //     ///<value  type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetQuality",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var result = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
    //     this.quality = result;
    //     return this.quality;
    // },

    // set_quality : function(value) {
    //     ///<value type="void"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(typeof value === "number") {
    //         var cmd = {
    //             func : "SetQuality",
    //             name : this.name,
    //             needResult : false,
    //             arguments : {
    //                 quality : value
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //         this.quality = value;
    //     }
    // },


    // /*
    //  *DisplayStyle:天际线的显示模式
    //  */
    // get_displayStyle : function() {
    //     ///<value  type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetDisplayMode",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var result = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
    //     this.displayMode = result;
    //     return this.displayMode;
    // },

    // set_displayStyle : function(value) {
    //     ///<value type="void"></value>
    //       if(this.name === null) {
    //           return;
    //       }

    //       if(typeof value === "number") {
    //         var cmd = {
    //             func : "SetDisplayMode",
    //             name : this.name,
    //             needResult : true,
    //             arguments : {
    //                 mode : value
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //         this.displayMode = value;
    //     }
    // },

    // /*
    // *AddLimitBody:天际线分析添加限高对象
    // */
    // addLimitBody : function(feature3d) {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(SuperMap.Web.Core.Feature3D.isInstanceOfType(feature3d)) {
    //         if (feature3d.get_geometry() === null) {
    //             return null;
    //         }

    //         var cmd = {
    //             func : "AddLimitBody",
    //             name : this.name,
    //             needResult : false,
    //             arguments : {
    //                 is3D : true,
    //                 feature3D : feature3d.name
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //     }
    // },

    // /*
    // *GetLimitBody:天际线分析获取限高对象
    // */
    // getLimitBody : function(index) {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerSkyline !== null && typeof index === "number") {
    //         var cmd = {
    //             func : "GetLimitBody",
    //             name : this.name,
    //             needResult : true,
    //             arguments : {
    //                 index : index
    //             }
    //         }

    //         return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "object"));
    //     }
    // },

    // /*
    //  *setLimitBody:设置指定索引的限高体区域
    //  */
    // setLimitBody : function( index, geoRegion) {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(this._innerSkyline !== null) {
    //         if(!(geoRegion.points instanceof Array) || typeof index !== "number") {
    //             return;
    //         }
    //         var cmd = {
    //             func : "SetLimitBody",
    //             name : this.name,
    //             needResult : false,
    //             arguments : {
    //                 is3D : true,
    //                 part : geoRegion.points,
    //                 index : index
    //             }
    //         }

    //         this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    //     }
    // },

    // /*
    //  *LocateToViewerPosition:相机定位到观察者的位置
    //  */
    // locateToViewerPosition : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var position = this.get_viewerPosition();
    //     var object = {longitude : position.x, latitude : position.y, altitude : position.z};
    //     var camera = new SuperMap.Web.Realspace.Camera(object);

    //     //调用飞行操作器进行飞行
    //     SuperMap.Web.Realspace.Utility._SceneControl.get_scene().get_flyingOperator().flyTo(camera, 0);
    // },

    // /*
    //  *GetLimitModel:返回指定索引值的限制体的顶点，法线和索引的网格数据
    //  */
    // getLimitModel : function(index) {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     if(typeof index !== "number") {
    //         return;
    //     }
    //     var cmd = {
    //         func : "GetLimitModel",
    //         name : this.name,
    //         needResult : true,
    //         arguments : {
    //             index : index
    //         }
    //     }

    //     return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "object"));
    // },

    // /*
    //  *GetSkyline:获取天际线
    //  */
    // getSkyline : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetSkyline",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "object"));
    // },

    // /*
    // *GetLimitBodyCount:获取限高体的个数
    //  */
    // getLimitBodyCount : function() {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetLimitBodyCount",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
    // },

    // /*
    //  *RemoveLimitBody:天际线分析移除指定索引限高对象
    //  */
    // removeLimitBody : function(index) {
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "RemoveLimitBody",
    //         name : this.name,
    //         needResult : true,
    //         arguments : {
    //             index : index
    //         }
    //     }

    //     return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "boolean")) === "true");
    // },

    // /*
    //  *RemoveAllLimitBodies：天际线分析移除所有限高对象
    //  */
    // removeAllLimitBodies : function() {
    //     ///<value type="Number"></value>
    //     if(this.name === null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "RemoveAllLimitBodies",
    //         name : this.name,
    //         needResult : false
    //     }

    //     this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
    // },

    /*
     *Build方法：分析并显示结果
     */
    build : function() {
        var cmd = {
            Func : "SkylineDoBuild",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SKYLINE,
        }
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },
    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
        var cmd = {
            Func : "SkylineDoClear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SKYLINE,
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },
//     /*
//      *分析基于的视口
//      */
//     get_inViewport : function () {
//         /// <summary>获取基于的视口</summary>
//         /// <returns type="Number"></returns>
//         if(this.name === null) {
//             return;
//         }

//         var cmd = {
//             func : "GetInViewport",
//             name : this.name,
//             needResult : true
//         }

//         var result = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
//         this.inViewport = result;
//         return this.inViewport;
//     },
//     set_inViewport : function (value) {
//         /// <summary>设置视口的索引</summary>
//         ///<param name="value" type="Number"></param>
//         if(this.name === null) {
//             return;
//         }

//         if(typeof value === "number") {
//             var cmd = {
//                 func : "SetInViewport",
//                 name : this.name,
//                 needResult : false,
//                 arguments : {
//                     viewport : value
//                 }
//             }

//             this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
//             this.inViewport = value;
//         }
//     },

//     /*
//      *是否生成360度天际线
//      */
//     get_lookAround : function() {
//         ///<value  type="Number"></value>
//         if(this.name === null) {
//             return;
//         }

//         var cmd = {
//             func : "GetLookAround",
//             name : this.name,
//             needResult : true
//         }

//         var result = (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "boolean")) === "true");

//         return result;
//     },

//     set_lookAround : function(value) {
//         ///<value type="void"></value>
//         if(this.name === null) {
//             return;
//         }

//         if(typeof value === "boolean") {
//             var cmd = {
//                 func : "SetLookAround",
//                 name : this.name,
//                 needResult : false,
//                 arguments : {
//                     lookaround : value
//                 }
//             }

//             this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
//         }
//     },

//     /*
//      *获取二维天际线
//      */
//     get_skyline2D : function() {
//         if(this.name === null) {
//             return;
//         }

//         var cmd = {
//             func : "GetSkyline2D",
//             name : this.name,
//             needResult : true
//         }

//         var skylineArray = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "array"));

//         var xarr = [];
//         var yarr = [];
//         for(var i = 0, len = skylineArray.length;i < len; i+=2) {
//             xarr.push(skylineArray[i]);
//             yarr.push(skylineArray[i+1]);
//         }

//         return {
//             x : xarr,
//             y : yarr
//         }
//   },

//     /*
//      *获取天际线与观察点构成的扇形面
//     */
//    getSkylineSector : function() {
//        if(this.name === null) {
//            return null;
//        }

//        var cmd = {
//            func : "GetSkylineSector",
//            name : this.name,
//            needResult : true
//        }

//        var geometryId = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number"));
//        var geoModel3D = new SuperMap.Web.Core.GeoModel3D();
//        geoModel3D.geometryId = Number(geometryId);
//        return geoModel3D;
//    },

//    /*
//     *获取天际线与观察点构成的扇形面拉伸体
//    */
//    getSkylineSectorBody : function(height) {
//        if(this.name === null || typeof height !== "number") {
//            return null;
//        }

//        var cmd = {
//            func : "GetSkylineSectorBody",
//            name : this.name,
//            needResult : true,
//            arguments : {
//               height : height
//            }
//        }

//        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "object"));

//        var geometryId = Number(object.id);
//        if(geometryId === -1) {
//            var msg = "高度必须大于" + object.max + "或小于" + object.min;
//            var ex = new Error(msg);

//            alert(msg);
//            throw ex;
//        }
//        var geoModel3D = new SuperMap.Web.Core.GeoModel3D();
//        geoModel3D.geometryId = geometryId;
//        return geoModel3D;
//    },

//    /*
//     *天际线分析半径
//     */
//    get_raduis : function() {
//        ///<value  type="Number"></value>
//        if(this.name === null) {
//            return;
//        }

//        var cmd = {
//            func : "GetRaduis",
//            name : this.name,
//            needResult : true
//        }

//        var result = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE), "number")));
//        this.raduis = result;
//        return this.raduis;
//    },

//    set_raduis : function(value) {
//        ///<value type="void"></value>
//        if(this.name === null) {
//            return;
//        }

//        if(typeof value === "number") {
//            var cmd = {
//                func : "SetRaduis",
//                name : this.name,
//                needResult : false,
//                arguments : {
//                    raduis : value
//                }
//            }

//            this._innerSkyline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SKYLINE);
//            this.raduis = value;
//        }
//    }
};
SuperMap.Web.Realspace.Skyline.registerClass('SuperMap.Web.Realspace.Skyline', Sys.Component, Sys.IDisposable);
