//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Scene
// 功能：			 场景类，负责场景渲染与飞行浏览
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.Scene = function (scenecontrol) {
    SuperMap.Web.Realspace.Scene.initializeBase(this);
	

    

	this._scenecontrol = scenecontrol;
  	
  	this._flyingOperator = new SuperMap.Web.Realspace.FlyingOperator(scenecontrol);
  	
  	this._layer3Ds = new SuperMap.Web.Realspace.Layer3Ds(scenecontrol);
  	this._terrainLayers = new SuperMap.Web.Realspace.TerrainLayers(scenecontrol);
  	this._trackingLayer3D = new SuperMap.Web.Realspace.TrackingLayer3D(scenecontrol);
  

  	this._underground = null;
  	this._globalImage = null;
  	this._atmosphere = null;
  	this._splitter = [];

  	this._stereo = null;
  	this._sun = null;

  	this._lockTarget = null;
};

SuperMap.Web.Realspace.Scene.prototype = {

    /**
    *SceneOption对象
    */
    get_sceneOption : function() {
        ///<value type="SuperMap.Web.Realspace.SceneOption"></value>
        return this._sceneOption;
    },

    /**
    *FlyingOperator对象
    */
    get_flyingOperator : function() {
        ///<value type="SuperMap.Web.Realspace.FlyingOperator"></value>
        return this._flyingOperator;
    },

    /**
    *Layer3Ds对象
    */
    get_layer3Ds : function() {
        ///<value type="SuperMap.Web.Realspace.Layer3Ds"></value>
        return this._layer3Ds;
    },

    /**
    *TerrainLayer3Ds对象
    */
    get_terrainLayers : function() {
        ///<value type="SuperMap.Web.Realspace.TerrainLayers"></value>
        return this._terrainLayers;
    },

    /**
    *TrackingLayer3D对象
    */
    get_trackingLayer3D : function() {
        ///<value type="SuperMap.Web.Realspace.TrackingLayer3D"></value>
        return this._trackingLayer3D;
    }
};
SuperMap.Web.Realspace.Scene.registerClass('SuperMap.Web.Realspace.Scene', Sys.Component);
