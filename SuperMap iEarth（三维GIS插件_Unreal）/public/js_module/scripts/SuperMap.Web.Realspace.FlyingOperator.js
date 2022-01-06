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
};

SuperMap.Web.Realspace.FlyingOperator.prototype = {
    flyToLayer : function(layer) {
        var cmd = {
            func : "FlyToLayer",
            arguments : {
                layer : {
                    layername : layer.name
                }
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR,
        }

        emitUIInteraction(cmd);
    },
    flyTo : function(camera, time) {
        var cmd = {
            func : "FlyTo",
            arguments : {
                camera : camera,
                time : time
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.FLYINGOPERATOR,
        }

        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.FlyingOperator.registerClass('SuperMap.Web.Realspace.FlyingOperator', Sys.Component, Sys.IDisposable);
