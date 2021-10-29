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
  	//SuperMap.Web.Realspace.Utility._SceneControl = scenecontrol;
    /////////////////////Scene的属性与scene绑定/////////////////////////////////////
  	// this._sceneOption = new SuperMap.Web.Realspace.SceneOption(scenecontrol);
  	this._flyingOperator = new SuperMap.Web.Realspace.FlyingOperator(scenecontrol);
  	// this._flyManager = new SuperMap.Web.Realspace.FlyManager(scenecontrol);
  	this._terrainLayers = new SuperMap.Web.Realspace.TerrainLayers(scenecontrol);
    this._layer3Ds = new SuperMap.Web.Realspace.Layer3Ds(scenecontrol);
  	this._trackingLayer3D = new SuperMap.Web.Realspace.TrackingLayer3D(scenecontrol);
  	// this._screenLayer3D = new SuperMap.Web.Realspace.ScreenLayer3D(scenecontrol);
  	// this._camera = new SuperMap.Web.Realspace.Camera({});
  	// this._camera._set_innerCamera(this._innerScene);
  	// this._firstPersonCamera = new SuperMap.Web.Realspace.Camera({});
  	// this._firstPersonCamera._set_innerCamera(this._innerScene);

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
    *innerScene对象
    */
    _get_innerScene : function() {
        ///<value type="SuperMap.Web.Realspace.Scene"></value>
        return this._innerScene;
    },

    /**
    *name属性
    */
    get_name : function() {
        ///<value type="string"></value>
        var cmd = {
            func : "GetName",
            needResult : true
        }

        return JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "string"));
    },

    set_name : function(name) {
        if(typeof name !== "string") {
            return;
        }
        var cmd = {
            func : "SetName",
            needResult : false,
            arguments : {
                name : name
            }
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },


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
    *FlyManager对象
    */
    get_flyManager : function() {
        ///<value type="SuperMap.Web.Realspace.FlyManager"></value>
        return this._flyManager;
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
    },

    /**
    *ScreenLayer3D对象
    */
    get_screenLayer3D : function() {
        ///<value type="SuperMap.Web.Realspace.ScreenLayer3D"></value>
        return this._screenLayer3D;
    },

    /**
    *camera对象
    */
    get_camera : function() {
        ///<value type="SuperMap.Web.Realspace.Camera"></value>
        var cmd = {
            func : "GetCamera",
            needResult : true,
        }

        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "object"));
        this._camera = new SuperMap.Web.Realspace.Camera(object);
        return this._camera;
    },

    set_camera : function(camera) {
        if(SuperMap.Web.Realspace.Camera.isInstanceOfType(camera)) {
            var cmd = {
                func : "SetCamera",
                needResult : false,
                arguments : {
                    camera : camera
                }
            }

            this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);

            this._camera = camera;
        }
    },

    /**
    *第一人称相机
    */
    get_firstPersonCamera : function() {
        ///<value type="SuperMap.Web.Realspace.Camera"></value>
        var cmd = {
            func : "GetFirstPersonCamera",
            needResult : true,
        }

        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "object"));
        this._firstPersonCamera = new SuperMap.Web.Realspace.Camera(object);
        return this._firstPersonCamera;
    },
    set_firstPersonCamera : function(camera) {
        if (SuperMap.Web.Realspace.Camera.isInstanceOfType(camera)) {
            var cmd = {
                func : "SetFirstPersonCamera",
                needResult : false,
                arguments : {
                    camera : camera
                }
            }

            this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);

            this._firstPersonCamera = camera;
        }
    },

  	//场景的视角
  	get_fov : function(){
    		///<value type="number" integer="false"></value>
        var cmd = {
            func : "GetFov",
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
  	},

  	set_fov : function(fov){
    		var f_fov = parseFloat(fov);
        if(isNaN(f_fov) || fov < 0 || fov > 180) {
            return;
    		}

        var cmd = {
            func : "SetFov",
            needResult : false,
            arguments : {
                fov : f_fov
            }
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
  	},
    /**
    *terrainExaggeration属性
    */
    get_terrainExaggeration : function() {
        ///<value type="number"></value>
        var cmd = {
            func : "GetTerrainExaggeration",
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    set_terrainExaggeration : function(exaggerationRatio) {
        var n_exaggerationRatio = parseFloat(exaggerationRatio);
        if(isNaN(n_exaggerationRatio)) {
            return;
        }

        var cmd = {
            func : "SetTerrainExaggeration",
            needResult : false,
            arguments : {
                exaggerationRatio : n_exaggerationRatio
            }
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
        //刷新地形图层
        this.resetTerrain();
    },

    /**
    *currentScale属性
    */
    get_currentScale : function() {
        ///<value type="Number"></value>
        var cmd = {
            func : "GetCurrentScale",
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

  	get_viewBounds : function() {

        var cmd = {
            func : "GetViewBounds",
            needResult : true
        }

        var bounds =  JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "null"));

  		  if(bounds === null) {
  			    return null;
  		  }

        var reslut = new SuperMap.Bounds();

        reslut.extend(new SuperMap.LonLat(bounds.left, bounds.bottom));
		    reslut.extend(new SuperMap.LonLat(bounds.right, bounds.top));
        return reslut;
  	},

  	get_viewWndHeight : function() {
        var cmd = {
            func : "GetViewWndHeight",
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
  	},

  	get_viewWndWidth : function() {
        var cmd = {
            func : "GetViewWndWidth",
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
  	},


    /**
    *打开场景文件
    */
    open : function(strServerRootUrl, sceneName) {
        ///<param name="strServerRootUrl" type="String">场景文件的URL</param>
        ///<param name="sceneName" type="String">场景名称</param>
        ///<returns type="boolean">是否成功</returns>

        this.close();

        var cmd = {
            func : "OpenScene",
            needResult : true,
            arguments : {
                url : strServerRootUrl,
                name : sceneName
            }
        }

        var isdone = (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");

        if(isdone) {
            var innerLayer3Ds = this._innerScene;
            var cmd = {
                func : "GetCount",
                needResult : true
            }

            var layerCount = Number(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(JSON.parse(innerLayer3Ds.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3DS)), "number"));

            var cmd = {
                func : "GetAllItems",
                needResult : true,
            }

            var arr = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(innerLayer3Ds.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.LAYER3DS), "array"));
            for(var i = 0; i < layerCount; i++) {

                var object = arr[i];

                var layerName = object.layerName;
                var dataName = object.dataName;
                var type = object.type;

                var layer3D;

                switch(type) {
                    case SuperMap.Web.Realspace.Layer3DType.OSGB:
                        layer3D = new SuperMap.Web.Realspace.Layer3DOSGB(strServerRootUrl, layerName, dataName);
                        break;
                    case SuperMap.Web.Realspace.Layer3DType.VolumeFile:
                        layer3D = new SuperMap.Web.Realspace.Layer3DVolumeFile(strServerRootUrl, layerName, dataName);
                        break;
                    case SuperMap.Web.Realspace.Layer3DType.DynamicModel:
                        layer3D = new SuperMap.Web.Realspace.Layer3DDynamicObject(layerName, dataName);
                        break;
                    case SuperMap.Web.Realspace.Layer3DType.Group3D:
                        layer3D = new SuperMap.Web.Realspace.Layer3DGroup(layerName);
                        break;
                    default:
                        layer3D = new SuperMap.Web.Realspace.Layer3D(strServerRootUrl, layerName, dataName, type);
                }

                this.get_layer3Ds()._get_layer3DArray().push(layer3D);

            }

            var cmd = {
                func : "GetCount",
                needResult : true
            }
            layerCount = Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TERRAINLAYERS), "number")));

            for(var i = 0; i < layerCount; i++) {
                var cmd = {
                    func : "GetItem",
                    needResult : true,
                    arguments : {
                        index : i
                    }
                }

                var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.TERRAINLAYERS), "object"));

                var layerName = object.layerName;
                var dataName = object.dataName;

                var terrain = new SuperMap.Web.Realspace.TerrainLayer(strServerRootUrl, layerName, dataName, innerLayer3Ds);
                this.get_terrainLayers()._get_terrainLayerArray().push(terrain);
                this.get_terrainLayers()._terrainLayerName.push(layerName);
            }
        }
        return isdone;
    },

    /**
    *关闭场景
    */
    close : function() {
        ///<returns type="void"></returns>
        this.get_layer3Ds().removeAll();

        var cmd = {
            func : "Close",
            needResult : false
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },


    /**
    *刷新场景
    */
    refresh : function() {
        ///<returns type="void"></returns>
        var cmd = {
            func : "Refresh",
            needResult : false
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },
    /**
    * 场景视图是否改变
    */
    getViewWorldState : function() {
        ///<returns type="void"></returns>
        var cmd = {
            func : "GetViewProjectMatrixState",
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");
    },

    /**
    * 全幅显示场景
    */
    viewEntire : function() {
        ///<returns type="void"></returns>
        var cmd = {
            func : "ViewEntire",
            needResult : false
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /**
    * 设置实时栅格化是否更新，解决kml的面数据
    */
    setRefreshRaster : function(bRefreshRaster) {
        ///<param name="bRefreshRaster" type="bool">是否刷新标识</param>
        ///<returns type="void"></returns>
        var cmd = {
            func : "SetRefreshRaster",
            needResult : false,
            arguments : {
                refreshRaster : bRefreshRaster
            }
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /**
    *重置地形图层 涉及地形的添、删、可见不可见操作时，解决地形数据的刷新问题
    */
    resetTerrain : function() {
        ///<returns type="void"></returns>
        var cmd = {
            func : "ResetTerrain",
            needResult : false
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /**
    *获取平均帧数方法，不开放仅供内部测试使用。
    */
    getAverageFPS : function() {
        ///<returns type="Number"></returns>
        var cmd = {
            func : "GetAverageFPS",
            needResult : true
        }

        return  Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    /**
    *获取当前三维场景中的选择集集合,
    */
    findSelection3Ds : function(hasObjectSelected) {
        ///<param name="HasObjectSelected" type="bool">是否只返回不为空的选择集</param>
        ///<returns type="Array" elementType="SuperMap.Web.Realspace.Selection3D"></returns>
        var arr = [];

        var cmd = {
            func : "FindSelection3Ds",
            needResult : true
        }

        var selection3Ds = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "array"));

        for(var i = 0, len = selection3Ds.length; i < len; i++) {
            arr.push(new SuperMap.Web.Realspace.Selection3D({
                ids : selection3Ds[i].selection
            }, this.get_layer3Ds().get_item(selection3Ds[i].layerName)));
        }
        if(!hasObjectSelected) {
            this.setRefreshRaster(true);
        }
        return arr;
    },
    /**
    *删除该场景缓存数据
    */
    updateCacheFile : function() {
        var size = 0;
        for(var i = 0; i < this._layer3Ds.get_count(); i++) {
            var layer3D = this._layer3Ds.get_item(i);
            size += layer3D.updateCacheFile();
        }

        for(var i = 0; i < this._terrainLayers.get_count(); i++) {
            var terrainLayer = this._terrainLayers.get_item(i);
            size += terrainLayer.updateCacheFile();
        }
        return size;
    },

    /**
    *获取场景数据下载进度，以图层为基础，即所有图层下载进度的均值
    */
    getDataStreamingProgress : function() {
        var progress = 0;
        for(var i = 0; i < this._layer3Ds.get_count(); i++) {
            var layer3D = this._layer3Ds.get_item(i);
            progress += layer3D.getDataStreamingProgress();
        }

        for(var i = 0; i < this._terrainLayers.get_count(); i++) {
            var terrainLayer = this._terrainLayers.get_item(i);
            progress += terrainLayer.getDataStreamingProgress();
        }
        var averageProgress = progress/(this._layer3Ds.get_count() + this._terrainLayers.get_count());
        return averageProgress;
    },

    /**
    *underground对象
    */
    get_underground : function() {
        ///<value type="SuperMap.Web.Realspace.Underground"></value>
        if(this._underground === null) {
            this._underground = new SuperMap.Web.Realspace.Underground();
            this._underground._innerUnderground = this._innerScene;
        }
        return this._underground;
    },

    /**
    *globalImage对象
    */
    get_globalImage : function() {
        ///<value type="SuperMap.Web.Realspace.GlobalImage"></value>
        if(this._globalImage === null) {
            this._globalImage = new SuperMap.Web.Realspace.GlobalImage();
            this._globalImage._innerGlobalImage = this._innerScene;
        }
        return this._globalImage;
    },

    /**
    *atmosphere对象
    */
    get_atmosphere : function () {
        ///<return type="SuperMap.Web.Realspace.Atmosphere">返回大气对象</value>
        if (this._atmosphere === null) {
            this._atmosphere = new SuperMap.Web.Realspace.Atmosphere();
            this._atmosphere._innerAtmosphere = this._innerScene;
        }
        return this._atmosphere;
    },
    /**
    *获得指定名称的splitter对象
    */
    getSplitter : function (name) {
        ///<param name="name" type="String">分隔条名称</param>
        ///<return type="SuperMap.Web.Realspace.Splitter">返回分隔条对象</value>
        var splitter = new SuperMap.Web.Realspace.Splitter();
        splitter._innerSplitter = this._innerScene;
        splitter.name = name;
        return splitter;
    },
    /**
    *增加指定名称的splitter对象
    */
    addSplitter : function (name) {
        ///<param name="name" type="String">分隔条名称</param>
        ///<return type="SuperMap.Web.Realspace.Splitter">返回分隔条对象</value>
        var splitter = new SuperMap.Web.Realspace.Splitter();
        var cmd = {
            func : "AddSplitter",
            needResult : false,
            arguments : {
                name : name
            }
        }

        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);

        splitter._innerSplitter = this._innerScene;

        splitter.name = name;
        this._splitter.push(splitter);
        return splitter;
    },
    /**
    *删除指定名称的splitter对象
    */
    removeSplitter : function (name) {
        ///<param name="name" type="String">分隔条名称</param>

        var cmd = {
            func : "RemoveSplitter",
            needResult : true,
            arguments : {
                name : name
            }
        }

        var bSuccess = (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");

        return bSuccess;
    },
    /**
    *获得分隔条对象的数量
    */
    get_splitterCount : function () {
        ///<return type="Number">返回分隔条对象数量</value>
        var cmd = {
            func : "GetSplitterCount",
            needResult : true
        }

        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },
    /**
    *stereo对象
    */
    get_stereo : function() {
        ///<value type="SuperMap.Web.Realspace.Stereo"></value>

        if(this._stereo === null) {
            this._stereo = new SuperMap.Web.Realspace.Stereo(this._scenecontrol);
        }
        return this._stereo;
    },

    /**
    *sun对象
    */
    get_sun : function() {
        ///<value type="SuperMap.Web.Realspace.Sun"></value>

        if(this._sun === null) {
            this._sun = new SuperMap.Web.Realspace.Sun(this._scenecontrol);
        }
        return this._sun;
    },

    /**
    *场景的跟踪对象
    */
    get_autoLockTarget : function () {
		    ///<value type="SuperMap.Web.Core.GeoModel"></value>
		    return this._lockTarget;
	  },

    set_autoLockTarget : function(geoModel) {
        ///<param name="geoModel" type="SuperMap.Web.Core.GeoModel">跟踪对象</param>
        if(SuperMap.Web.Core.GeoModel.isInstanceOfType(geoModel)) {

            var copy = {};
            $.extend(copy, geometry);
            delete copy._innerGeometry;

            if(typeof copy.makeWithGeometry !== "undefined") {
                delete copy.makeWithGeometry._innerGeometry;
            }

			      this._lockTarget = geoModel;
            var cmd = {
                func : "SetAutoLockTarget",
                needResult : false,
                arguments : {
                    autoLockTarget : copy
                }
            }

            this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
        }else {
			      this._lockTarget = null;
            var cmd = {
                func : "UnLockTarget",
                needResult : false
            }

            this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
        }
    },

    /**
    *场景跟踪对象的偏移量
    */
    get_autoLockOffset : function() {
        ///<value type="SuperMap.Web.Core.Point3D"></value>
        var cmd = {
            func : "GetAutoLockOffset",
            needResult : true
        }
        var object = JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "object"));
        return new SuperMap.Web.Core.Point3D(object.x, object.y, object.z);
    },

    set_autoLockOffset : function(autoLockOffset) {
        if(SuperMap.Web.Core.Point3D.isInstanceOfType(autoLockOffset)) {
            var cmd = {
                func : "SetAutoLockOffset",
                needResult : false,
                arguments : {
                    point : autoLockOffset
                }
            }
            this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
        }
    },

    /**
    *场景类型
    */
    get_type : function() {
        ///<value type="SuperMap.Web.Realspace.SceneType"></value>
		    if ((this._innerScene === null)) {
             return ;
        }
        var cmd = {
            func : "GetType",
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    set_type : function(type) {
		    if(this._innerScene === null || typeof type !== "number") {
            return ;
        }

        var cmd = {
            func : "SetType",
            needResult : false,
            arguments : {
                type : type
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /**
    *小场景操作范围
    */
    get_bounds : function() {
        ///<value type="SuperMap.Web.Core.Rectangle2D">小场景操作范围</value>
        if(this._innerScene === null) {
            return ;
        }

        var cmd = {
            func : "GetBounds",
            needResult : true
        }
        var object =  JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "object"));

        var reslut = new SuperMap.Bounds();

        reslut.extend(new SuperMap.LonLat(object.left, object.bottom));
        reslut.extend(new SuperMap.LonLat(object.right, object.top));
        return reslut;
    },

    set_bounds : function(bounds) {
		    if(this._innerScene === null || !(bounds instanceof SuperMap.Bounds)) {
            return ;
        }

        var cmd = {
            func : "SetBounds",
            needResult : false,
            arguments : {
                bounds : {
                    left : bounds.left,
                    bottom : bounds.bottom,
                    right : bounds.right,
                    top : bounds.top
                }
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /*
    *属性:是否第一人称方式操作摄像机
    */
    get_isFirstPersonView : function() {
		    ///<value type="boolean"></value>
	      if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetIsFirstPersonView",
            needResult : true
        }
        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");
    },

  	set_isFirstPersonView : function(bVisible) {
  	    if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "SetIsFirstPersonView",
            needResult : false,
            arguments : {
                visible : bVisible
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);

  	},


	   /**
    *获取地面上某点的海拔高度
    */
    getAltitude : function(longitude, latitude) {
        ///<param name="longitude" type="number">经度</param>
        ///<param name="latitude" type="number">纬度</param>
        ///<returns type="number" >海拔高度</returns>
        if(this._innerScene === null) {
            return;
        }

        if(typeof longitude !== "number" || typeof latitude !== "number") {
            return null;
        }
        var cmd = {
            func : "GetAltitude",
            needResult : true,
            arguments : {
                longitude : longitude,
                latitude : latitude
            }
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

		/**
    *获取场景中地面和模型上某点的海拔高度
		*/
    getHeight : function(longitude, latitude, trackingLayerHeightAvailable) {
        ///<param name="longitude" type="number">经度</param>
				///<param name="latitude" type="number">纬度</param>
				///<returns type="number" >海拔高度</returns>
        if(this._innerScene === null) {
            return;
        }

        if(typeof longitude !== "number" || typeof latitude !== "number") {
            return -1;
        }

        if(typeof trackingLayerHeightAvailable !== "boolean") {
            trackingLayerHeightAvailable = true;
        }

        var cmd = {
            func : "GetHeight",
            needResult : true,
            arguments : {
                longitude : longitude,
                latitude : latitude,
                trackingLayerHeightAvailable : trackingLayerHeightAvailable
            }
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
		},



    /**
    *输出场景为图片
    */
    outputSceneToFile : function(strFilePath, imageType) {
        ///<param name="strFilePath" type="String">文件全路径URL</param>
        ///<param name="imageType" type="SuperMap.Web.Realspace.ImageType">图片类型</param>
        ///<returns type="boolean">是否成功</returns>
        if(this._innerScene === null) {
            return;
        }

        if(typeof strFilePath !== "string" || typeof imageType !== "number") {
            return null;
        }
        var cmd = {
            func : "OutputSceneToFile",
            needResult : true,
            arguments : {
                filePath : strFilePath,
                imageType : imageType,
                flag : true
            }
        }
        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");
    },

    /**
     *输出场景为图片(不需要数据下载完成时)
     */
    outputSceneToImg : function(strFilePath, imageType) {
        ///<param name="strFilePath" type="String">文件全路径URL</param>
        ///<param name="imageType" type="SuperMap.Web.Realspace.ImageType">图片类型</param>
        ///<returns type="boolean">是否成功</returns>

        if(this._innerScene === null) {
            return;
        }

        if(typeof strFilePath !== "string" || typeof imageType !== "number") {
            return null;
        }
        var cmd = {
            func : "OutputSceneToFile",
            needResult : true,
            arguments : {
                filePath : strFilePath,
                imageType : imageType,
                flag : false
            }
        }
        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");
    },

    /**
     * 获得碰撞检测状态
     */
    get_collisionDetection : function() {
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetCollisionDetection",
            needResult : true
        }
        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");
    },

    /**
     * 设置是否开启碰撞检测
     */
    set_collisionDetection : function(bValue) {
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "SetCollisionDetection",
            needResult : false,
            arguments : {
                open : bValue
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },


    /**
    * 获得碰撞检测距离
    */
    get_collisionDistanceThreshold : function() {
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetCollisionDistanceThreshold",
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    /**
     * 设置碰撞检测距离
     */
    set_collisionDistanceThreshold : function(distance){
        if(this._innerScene === null || typeof distance !== "number") {
            return;
        }

        var cmd = {
            func : "SetCollisionDistanceThreshold",
            needResult : false,
            arguments : {
                distance : distance
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },


    /**
     * 获得多视口模式
     */
    get_multiViewportMode : function() {
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetMultiViewportMode",
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    /**
     * 设置多视口模式
     */
    set_multiViewportMode : function(value) {
        if(this._innerScene === null || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetMultiViewportMode",
            needResult : false,
            arguments : {
                mode : value
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /**
     * 获得场景行走模式
     */
    get_walkingMode : function() {
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetWalkingMode",
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    /**
     * 设置场景行走模式
     */
    set_walkingMode : function(value) {
        if(this._innerScene === null || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetWalkingMode",
            needResult : false,
            arguments : {
                mode : value
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

    /**
     * 设置下载的方式
     */
    set_configueDownloadStyle : function(value) {
        ///<param name="value" type="SuperMap.Web.Realspace.ConfigueDownLoadStyle">配置文件下载方式</param>
        if(this._innerScene === null || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetConfigueDownType",
            needResult : false,
            arguments : {
                downLoadStyle : value
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    },

		/**
		 * 获取或设置相机到近裁剪面的距离，即相机能看见的最近距离
		 */
		get_cameraNearClipDistance : function() {
			  ///<returns type="number"></returns>
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetCameraNearClipDistance",
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
		},

		set_cameraNearClipDistance : function(value) {
				///<param name="value" type="number"></param>
        if(this._innerScene === null || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetCameraNearClipDistance",
            needResult : false,
            arguments : {
                distance : value
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
		},

		/**
		 * 获取或设置相机到远裁剪面的距离，即相机能看见的最远距离
		 */
    get_cameraFarClipDistance : function() {
				///<returns type="number"></returns>
        if(this._innerScene === null) {
            return;
        }

        var cmd = {
            func : "GetCameraFarClipDistance",
            needResult : true
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
		},

		set_cameraFarClipDistance : function(value) {
				///<param name="value" type="number"></param>
        if(this._innerScene === null || typeof value !== "number") {
            return;
        }

        var cmd = {
            func : "SetCameraFarClipDistance",
            needResult : false,
            arguments : {
                distance : value
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
		},

    /**
    * 计算两点的球面距离
		*/
    computeSphericalDistance : function(point1, point2) {
		    if(this._innerScene === null) {
				    return;
				}

		    if(!SuperMap.LonLat.isInstanceOfType(point1) || !SuperMap.LonLat.isInstanceOfType(point2)){
				    return;
				}

        var cmd = {
            func : "ComputeSphericalDistance",
            needResult : true,
            arguments : {
                left : {
                    x : point1.lon,
                    y : point2.lat
                },
                right : {
                    x : point2.lon,
                    y : point2.lat
                }
            }
        }
        return Number(JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "number")));
    },

    /**
    * 获取/设置是否文字过滤
    */
    get_isOverlapDisplayed : function() {
        if(this._innerScene === null) {
            return false;
        }

        var cmd = {
            func : "GetIsOverlapDisplayed",
            needResult : true
        }

        return (JSON.parse(SuperMap.Web.Realspace.Utility._SceneControl.returnDefaultString(this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE), "boolean")) === "true");
    },

    set_isOverlapDisplayed : function(display) {
        if(this._innerScene === null || typeof display !== "boolean") {
            return;
        }

        var cmd = {
            func : "SetIsOverlapDisplayed",
            needResult : false,
            arguments : {
                isOverlapDisplayed : display
            }
        }
        this._innerScene.SuperMapHandle(JSON.stringify(cmd), SuperMap.Web.Realspace.ClassNumber.SCENE);
    }
};
SuperMap.Web.Realspace.Scene.registerClass('SuperMap.Web.Realspace.Scene', Sys.Component);
