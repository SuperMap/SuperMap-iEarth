//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.SlopeMap
// 功能：			  坡度分析类，设置坡度分析的各参数
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.SlopeMap = function(sceneControl) {

    SuperMap.Web.Realspace.SlopeMap.initializeBase(this);
    this.displaystyle = 2;
};


SuperMap.Web.Realspace.SlopeMap.prototype = {
    // /*
    //  *DisplayStyle属性:坡度分析显示风格
    //  */
    get_displayStyle : function () {
        ///<value  type="Number"></value>
       return this.displaystyle;
    },

    set_displayStyle : function(mode) {
        ///<value type="void"></value>

        var cmd = {
            func : "SetDisplayStyle",
            arguments : {
                mode : mode
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.SLOPEMAP,
        }
        
        this.displaystyle = mode;
        emitUIInteraction(cmd);
    },

    /*
     *Build方法：分析并显示结果
     */
    build : function() {
        var cmd = {
            func : "Build",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SLOPEMAP,
        }

        emitUIInteraction(cmd);
    },

    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
        var cmd = {
            func : "Clear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.SLOPEMAP,
        }

        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.SlopeMap.registerClass('SuperMap.Web.Realspace.SlopeMap', Sys.Component, Sys.IDisposable);
