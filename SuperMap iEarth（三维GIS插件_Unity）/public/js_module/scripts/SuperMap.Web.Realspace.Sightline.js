//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Sightline
// 功能：			  通视分析类，设置通视分析的各参数
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.Sightline = function(sceneControl) {

    SuperMap.Web.Realspace.Sightline.initializeBase(this);

    // if(typeof sceneControl === "undefined" || !(sceneControl instanceof SuperMap.Web.UI.Controls.SceneControl)) {
    //     this._innerSightline = SuperMap.Web.Realspace.Utility._SceneControl._get_innerObjectManager();
    // }else {
    //     this._innerSightline = sceneControl._get_innerObjectManager();
    // }

    // var cmd = {
    //     func : "Create",
    //     needResult : true
    // }

    // var result = this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // if(result === "") {
    //     this.name = null;
    //     return;
    // }

    // this.name = JSON.parse(result);
};

SuperMap.Web.Realspace.Sightline.prototype ={
    /*
     *-ViewerPosition:通视分析的观察点
     */
    // get_viewerPosition : function() {
    //     ///<value type="void"></value>
    //     if(this._innerSightline == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetViewerPosition",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "object"));
    //     return new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
    // },

    // set_viewerPosition : function(pt3d) {
    //     ///<value type="SuperMap.Web.Core.Point3D"></value>
    //     if(this._innerSightline == null || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
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

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // },

    // /*
    //  *VisibleColor:通视分析的可见线颜色
    //  */
    // get_visibleColor : function() {
    //     if(this._innerSightline == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetVisibleColor",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var num = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "number")));
    //     var color = new SuperMap.Web.Core.Color();
    //     color.fromLongABGR(num);
    //     return color;
    // },

    // set_visibleColor : function(color) {
    //     ///<value type="SuperMap.Web.Core.Point3D"></value>
    //     if(this._innerSightline == null || !(color instanceof SuperMap.Web.Core.Color)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetVisibleColor",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             color : color.toLongABGR()
    //         }
    //     }

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // },

    // /*
    //  *HiddenColor:通视分析的不可见线颜色
    //  */
    // get_hiddenColor : function() {
    //     ///<value type="void"></value>
    //     if(this._innerSightline == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetHiddenColor",
    //         name : this.name,
    //         needResult : true
    //     }

    //     var num = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "number")));
    //     var color = new SuperMap.Web.Core.Color();
    //     color.fromLongABGR(num);
    //     return color;
    // },

    // set_hiddenColor : function(color) {
    //     if(this._innerSightline == null || !(color instanceof SuperMap.Web.Core.Color)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetHiddenColor",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             color : color.toLongABGR()
    //         }
    //     }

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // },

    // /*
    //  *getVisibleResult:返回指定索引通视线的分析结果
    //  */
    // getVisibleResult : function(index) {
    //     if(this._innerSightline == null || typeof index !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetSightlineResult",
    //         name : this.name,
    //         needResult : true,
    //         arguments : {
    //             index : index
    //         }
    //     }

    //     /*
    //       该返回对象包含如下属性
    //         viewerPosition  观察者位置  {x:1,y:2,z:3}
    //         targetPoint     指定索引的分析对象 {x:1,y:2,z:3}
    //         barrierPoint  障碍点   {x:1,y:2,z:3}
    //         isVisible   是否可见  boolean
    //     */
    //     var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "object"));

    //     return new SuperMap.Web.Realspace.SightlineResult(object);
    // },

    // /*
    //  *TargetPointCount属性:通视分析目标点个数
    //  */
    // get_targetPointCount : function() {
    //     ///<return type="number" integer="true">目标点个数</return>
    //     if(this._innerSightline == null) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetTargetPointCount",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "number")));
    // },

    // /*
    //  *AddTargetPoint:通视分析添加目标点
    //  */
    // addTargetPoint : function(pt3d) {
    //     ///<value type="Number"></value>
    //     if(this._innerSightline == null || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "AddTargetPoint",
    //         name : this.name,
    //         needResult : true,
    //         arguments : {
    //             point : {
    //                 x : pt3d.x,
    //                 y : pt3d.y,
    //                 z : pt3d.z
    //             }
    //         }
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "number")));
    // },

    // /*
    //  *GetTargetPoint:通视分析获取指定索引的目标点
    //  */
    // getTargetPoint : function(index) {
    //     ///<value type="Number"></value>
    //     if(this._innerSightline == null || typeof index !== "number") {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "GetTargetPoint",
    //         name : this.name,
    //         needResult : true,
    //         arguments : {
    //             index : index
    //         }
    //     }

    //     var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "object"));
    //     return new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
    // },

    // /*
    //  *SetTargetPoint:通视分析设置目标点
    //  */
    // setTargetPoint : function(index,pnt3d) {
    //     ///<value type="Number"></value>
    //     if(this._innerSightline == null || typeof index !== "number" || !(pt3d instanceof SuperMap.Web.Core.Point3D)) {
    //         return null;
    //     }

    //     var cmd = {
    //         func : "SetTargetPoint",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             index : index,
    //             point : {
    //                 x : pnt3d.x,
    //                 y : pnt3d.y,
    //                 z : pnt3d.z
    //             }
    //         }
    //     }

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // },

    // /*
    //  *RemoveTargetPoint：通视分析移除指定索引目标点
    //  */
    // removeTargetPoint : function(index) {
    //     ///<value type="Number"></value>
    //     if(this._innerSightline == null || typeof index !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "RemoveTargetPoint",
    //         name : this.name,
    //         needResult : false,
    //         arguments : {
    //             index : index
    //         }
    //     }

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // },

    // /*
    //  *RemoveAllTargetPoints:通视分析移除所有目标点
    //  */
    // removeAllTargetPoints : function() {
    //     if(this._innerSightline == null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "RemoveAllTargetPoints",
    //         name : this.name,
    //         needResult : false
    //     }

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // },


    /*
     *Build方法：分析并显示结果
     */
    build : function() {
        var cmd = {
            Func : "SightlineDoBuild",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SIGHTLINE,
        }
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },
    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
        var cmd = {
            Func : "SightlineDoClear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SIGHTLINE,
        }

        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    // /*
    //  *分析基于的视口
    //  */
    // get_inViewport : function () {
    //     /// <summary>获取基于的视口</summary>
    //     /// <returns type="Number"></returns>
    //     if(this._innerSightline == null) {
    //         return;
    //     }

    //     var cmd = {
    //         func : "GetInViewport",
    //         name : this.name,
    //         needResult : true
    //     }

    //     return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE), "number")));
    // },

    // set_inViewport : function (value) {
    //     /// <summary>设置视口的索引</summary>
    //     ///<param name="value" type="Number"></param>
    //     if(this._innerSightline == null || typeof value !== "number") {
    //         return;
    //     }

    //     var cmd = {
    //         func : "SetInViewport",
    //         name : this.name,
    //         needResult : true,
    //         arguments : {
    //             port : value
    //         }
    //     }

    //     this._innerSightline.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SIGHTLINE);
    // }
};
SuperMap.Web.Realspace.Sightline.registerClass('SuperMap.Web.Realspace.Sightline', Sys.Component, Sys.IDisposable);



