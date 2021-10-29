//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.ContourMap
// 功能：			  等高线分析类，设置天际线分析的各参数
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.ContourMap = function(sceneControl) {

    SuperMap.Web.Realspace.ContourMap.initializeBase(this);
    this.displayStyle = -1;
    this.interval = -1;
};


SuperMap.Web.Realspace.ContourMap.prototype ={

    /*
    *DisplayStyle属性:等高线分析显示风格
    */
    get_displayStyle : function() {
        ///<value  type="Number"></value>
        return this.displayStyle;
    },

    set_displayStyle: function(value) {
        ///<value type="void"></value>
        var cmd = {
            Func : "SetDisplayStyle",
            arguments : {
                style : value
            },
            classNumber : 4008
        }
        this.displayStyle = value;
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },

    /*
     *Interval属性:等高线的间隔
     */
    get_interval : function() {
        ///<value type="Number"></value>
        return this.interval;

    },

    set_interval : function(value) {
        ///<value type="void"></value>

        var cmd = {
            Func : "SetInterval",
            arguments : {
                interval : value
            },
            classNumber : 4008
        }
        this.interval = value;
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
    },


     /*
     *Build方法：分析并显示结果
     */
    build : function() {
        

        var cmd = {
            Func : "Build",
            classNumber : 4008
        }
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
        
    },
    /*
     *Clear方法：清除分析结果
     */
    clear : function() {
       

        var cmd = {
            Func : "Clear",
            classNumber : 4008
        }
        unityInstance.SendMessage('SuperMapJSObject', 'JSFunction', JSON.stringify(cmd));
        
    }
};
SuperMap.Web.Realspace.ContourMap.registerClass('SuperMap.Web.Realspace.ContourMap', Sys.Component, Sys.IDisposable);
