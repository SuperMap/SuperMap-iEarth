//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.ProjectionImage
// 功能：			投影图片分析
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.ProjectionImage  = function(sceneControl) {
    ///<param name="scene" type="SuperMap.Web.Realspace.Scene">场景对象</param>
    ///<returns type="SuperMap.Web.Realspace.ProjectionImage"></returns>
    SuperMap.Web.Realspace.ProjectionImage.initializeBase(this);
};
SuperMap.Web.Realspace.ProjectionImage.prototype = {
    /**
    *设置图片对象
    */
    setImage : function(url) {
        ///<param name="url" type="String">图片url</param>
        var cmd = {
            func : "SetImage",
            arguments : {
               url : url
            },
            classNumber : SuperMap.Web.Realspace.ClassNumber.PROJECTIONIMAGE
        }
        emitUIInteraction(cmd);
    },


    /**
    *执行分析
    */
    build: function() {
        var cmd = {
            func : "Build",
            classNumber : SuperMap.Web.Realspace.ClassNumber.PROJECTIONIMAGE
        }
        emitUIInteraction(cmd);
    },

    /**
    *清除
    */
    clear: function() {
        var cmd = {
            func : "Clear",
            classNumber : SuperMap.Web.Realspace.ClassNumber.PROJECTIONIMAGE
        }
        emitUIInteraction(cmd);
    },

    set_position : function(position) {
        var cmd = {
            func : "SetPosition",
            arguments : {
                position : position
             },
            classNumber : SuperMap.Web.Realspace.ClassNumber.PROJECTIONIMAGE
        }
        emitUIInteraction(cmd);
    },

    set_heading : function(heading) {
        var cmd = {
            func : "SetHeading",
            arguments : {
                heading : heading
             },
            classNumber : SuperMap.Web.Realspace.ClassNumber.PROJECTIONIMAGE
        }
        emitUIInteraction(cmd);
    },

    set_pitch : function(pitch) {
        var cmd = {
            func : "SetPitch",
            arguments : {
                pitch : pitch
             },
            classNumber : SuperMap.Web.Realspace.ClassNumber.PROJECTIONIMAGE
        }
        emitUIInteraction(cmd);
    }
};
SuperMap.Web.Realspace.ProjectionImage.registerClass('SuperMap.Web.Realspace.ProjectionImage',Sys.Component);
