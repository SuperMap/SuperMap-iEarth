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
};

SuperMap.Web.Realspace.Sightline.prototype ={
    /*
     *Build方法：分析并显示结果
     */
    build : function() {
        var cmd = {
            func : "Build",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SIGHTLINE
        }

        emitUIInteraction(cmd);
    },
    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
        var cmd = {
            func : "Clear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SIGHTLINE
        }

        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.Sightline.registerClass('SuperMap.Web.Realspace.Sightline', Sys.Component, Sys.IDisposable);

