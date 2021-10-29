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
     *Build方法：分析并显示结果
     */
    build : function() {
        var cmd = {
            func : "Build",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SKYLINE,
        }

        emitUIInteraction(cmd);
    },
    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
        var cmd = {
            func : "Clear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SKYLINE,
        }

        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.Skyline.registerClass('SuperMap.Web.Realspace.Skyline', Sys.Component, Sys.IDisposable);
