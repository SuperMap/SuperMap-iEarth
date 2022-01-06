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
};

SuperMap.Web.Realspace.TrackingLayer3D.prototype = {
    removeAll : function() {
        ///<returns type="void"></returns>
       
        var cmd = {
            func : "Clear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D
        }

        emitUIInteraction(cmd);
    },
    
    add : function(geometry, tag) {
        var cmd = {
            func : "Add",
            classNumber : SuperMap.Web.Realspace.ClassNumber.TRACKINGLAYER3D,
            arguments : {
                geometry : geometry,
                tag : tag
            }
        };
        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.TrackingLayer3D.registerClass('SuperMap.Web.Realspace.TrackingLayer3D', Sys.Component);
