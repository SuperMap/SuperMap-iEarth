//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.Constants.js
// 功能：			三维常量类库
// 最后修改时间：
//==========================================================================
Type.registerNamespace("SuperMap.Web.Realspace");

/**
* 枚举名 : SRPixelToGlobeMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.PixelToGlobeMode = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.PixelToGlobeMode.prototype = {

    TerrainAndModel: 0,         //地形和模型都参与求交点
    Terrain: 1					 //只与地形求交点
}

SuperMap.Web.Realspace.PixelToGlobeMode.registerEnum("SuperMap.Web.Realspace.PixelToGlobeMode");

/**
* 枚举名 : FlyStatus
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.FlyStatus = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.FlyStatus.prototype = {
	/// <summary>FlyStatus 飞行状态</summary>
	/// <field name="SRFSTOP">停止</field>
	/// <field name="SRFPAUSE">暂停</field>
	/// <field name="SRFPLAY">飞行</field>

    FSTOP : 0,		//停止
    FPAUSE : 1,		//暂停
    FPLAY : 2		//飞行
}

SuperMap.Web.Realspace.FlyStatus.registerEnum("SuperMap.Web.Realspace.FlyStatus");

/**
* 枚举名 : AltitudeMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.AltitudeMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.AltitudeMode.prototype = {
	/// <summary>AltitudeMode 高度模式枚举</summary>
	/// <field name="CLAMP_TO_GROUND">依地形</field>
	/// <field name="RELATIVE_TO_GROUND">相对高程</field>
	/// <field name="ABSOLUTE">绝对高程</field>
    /// <field name="RELATIVE_TO_UNDERGROUND">相对于地下</field>
    /// <field name="CLAMP_TO_OBJECT">依模型</field>

    CLAMP_TO_GROUND : 0,		//依地形
    RELATIVE_TO_GROUND : 1,		//相对高程
    ABSOLUTE : 2,				//绝对高程
    RELATIVE_TO_UNDERGROUND: 3 ,//相对于地下
    CLAMP_TO_OBJECT : 6         //依模型,应用场景osgb上的矢量面贴在osgb模型上
}

SuperMap.Web.Realspace.AltitudeMode.registerEnum("SuperMap.Web.Realspace.AltitudeMode");

/**
* 枚举名 : ScreenCoordinateUnit
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.ScreenCoordinateUnit = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.ScreenCoordinateUnit.prototype = {
	/// <summary>ScreenCoordinateUnit 屏幕单位枚举</summary>
	/// <field name="RATIO">百分比单位</field>
	/// <field name="PIXEL">像素单位</field>

    RATIO : 0,		//百分比单位。值范围为[0.0，1.0]
    PIXEL : 1  		//像素单位
}

SuperMap.Web.Realspace.ScreenCoordinateUnit.registerEnum("SuperMap.Web.Realspace.ScreenCoordinateUnit");


/**
* 枚举名 : FlagType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.FlagType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.FlagType.prototype = {
	/// <summary>FlagType 按键枚举</summary>
	/// <field name="NOKEY">空</field>
	/// <field name="LBUTTON">鼠标左键</field>
	/// <field name="RBUTTON">鼠标右键</field>
	/// <field name="SHIFT">Shift键</field>
	/// <field name="CONTROL">Control键</field>
	/// <field name="ALT">Alt键</field>
	/// <field name="MBUTTON">鼠标中键</field>
	/// <field name="WHEEL">鼠标滚轮</field>
	/// <field name="HITGLOBE">命中地球</field>
	/// <field name="ESC">Esc键</field>
	/// <field name="DELETE">Delete键</field>

    NOKEY	: 0,					//空
    LBUTTON : 1,				//鼠标左键
    RBUTTON : 2,				//鼠标右键
    SHIFT : 4,					//Shift键
    CONTROL : 8,				//Control键
    ALT : 16,						//Alt键
    MBUTTON : 32,				//鼠标中键
    WHEEL : 64,					//鼠标滚轮
    HITGLOBE : 1024,		//命中地球
    ESC    : 2048,      // Esc键
    DELETE  : 4096      // Delete键
}

SuperMap.Web.Realspace.FlagType.registerEnum("SuperMap.Web.Realspace.FlagType",true);

/**
* 枚举名 : FlyingMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.FlyingMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.FlyingMode.prototype = {
	/// <summary>FlyingMode 飞行模式枚举</summary>
	/// <field name="JUMP">跳到指定点</field>
	/// <field name="ROTATE">绕指定点旋转</field>
	/// <field name="PLAY">绕指定线飞行</field>
	/// <field name="MULTIPOINTFLY_NORMAL">绕多点常规飞行</field>
	/// <field name="MULTIPOINTFLY_DIRECT">绕多点直接飞行</field>
	/// <field name="CAMERA_NORMAL">常规飞到指定相机</field>
	/// <field name="CAMERASTATE_DIRECT">直接飞到指定相机</field>
	/// <field name="EYEPLAY">眼睛绕指定线飞行</field>
	/// <field name="LIMITSPEED">定速飞行</field>
	/// <field name="FLYDISTANCE">缩放大小飞行</field>
	/// <field name="FLYTILT">tilt飞行</field>
	/// <field name="FLYHEADING">Heading飞行</field>

    JUMP : 1,										//跳到指定点
    ROTATE : 2,									//绕指定点旋转
    PLAY : 3,										//绕指定线飞行
    MULTIPOINTFLY_NORMAL : 4,   //绕多点常规飞行
    MULTIPOINTFLY_DIRECT : 5,   //绕多点直接飞行
    CAMERA_NORMAL : 6,   	    	//常规飞到指定相机
    CAMERASTATE_DIRECT : 7,  		//直接飞到指定相机
    EYEPLAY : 8,								//眼睛绕指定线飞行
    LIMITSPEED : 9,							//定速飞行
    FLYDISTANCE : 10,		    		//缩放大小飞行
    FLYTILT : 11,								//tilt飞行
    FLYHEADING : 12							//Heading飞行
}

SuperMap.Web.Realspace.FlyingMode.registerEnum("SuperMap.Web.Realspace.FlyingMode");

/**
* 枚举名 : Layer3DType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.Layer3DType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.Layer3DType.prototype = {
	/// <summary>Layer3DType 图层类型枚举</summary>
	/// <field name="NONE">空图层</field>
    /// <field name="IMAGE">影像图层</field>
	/// <field name="KML">KML图层</field>
	/// <field name="MODEL">模型图层</field>
	/// <field name="TERRAIN">地形图层</field>
	/// <field name="KMZ">KMZ图层</field>

    
    IMAGE: 2, 				//影像图层
   
	OSGB : 0,          //OSGB图层

}

SuperMap.Web.Realspace.Layer3DType.registerEnum("SuperMap.Web.Realspace.Layer3DType");

/**
* 枚举名 : Layer3DDataType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.Layer3DDataType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.Layer3DDataType.prototype = {
    /// <summary>Layer3DDataType 三维图层的数据类型</summary>
    /// <field name="UNKNOWNDATA">未知or无效数据类型</field>
    /// <field name="POINTDATA">点数据</field>
    /// <field name="LINEDATA">线数据</field>
    /// <field name="REGIONDATA">多边形数据</field>
    /// <field name="TEXTDATA">文本数据</field>
    /// <field name="IMAGEDATA">影像数据</field>
    /// <field name="GRIDDATA">栅格数据</field>
    /// <field name="DEMDATA">DEM数据</field>
    /// <field name="POINTZDATA">三维点数据</field>
    /// <field name="LINEZDATA">三维线数据</field>
    /// <field name="REGIONZDATA">三维面数据</field>
    /// <field name="MODELDATA">模型数据</field>
    /// <field name="OVERLAYDATA">OverLay影像数据</field>
    /// <field name="KMLDATA">KML数据</field>
    /// <field name="TINDATA">TIN数据</field>
    /// <field name="CADDATA">CAD数据</field>

    UNKNOWNDATA : -1,
    POINTDATA: 1,
    LINEDATA: 3,
    REGIONDATA : 5,
    TEXTDATA : 7,
    IMAGEDATA : 81,
    GRIDDATA	: 83,
    DEMDATA : 84,
    POINTZDATA : 101,
    LINEZDATA : 102,
    REGIONZDATA : 105,
    MODELDATA : 106,
    OVERLAYDATA : 107,
    KMLDATA : 108,
    TINDATA : 139,
    CADDATA : 149,
    MODELDATASETDATA: 203,
    NETWORK3DDDATA : 205
}

SuperMap.Web.Realspace.Layer3DDataType.registerEnum("SuperMap.Web.Realspace.Layer3DDataType");

/*
SuperMap.Web.Realspace.VectorDrawMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.VectorDrawMode.prototype = {
	/// <summary>VectorDrawMode 矢量绘制方式枚举</summary>
	/// <field name="DRAW_3D">真三维</field>
	/// <field name="REAL_TIME_RASTER">实时栅格化</field>
	/// <field name="DRAW_SCREEN">渲染到屏幕</field>

    DRAW_3D : 0,						//真三维
    REAL_TIME_RASTER : 1,		//实时栅格化
    DRAW_SCREEN : 2					//渲染到屏幕
}

SuperMap.Web.Realspace.VectorDrawMode.registerEnum("SuperMap.Web.Realspace.VectorDrawMode");
*/


/**
* 枚举名 : ExceptionName
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.ExceptionName = function() {
    throw Error.notImplemented();
}


SuperMap.Web.Realspace.ExceptionName.prototype = {
	/// <summary>Exception 异常枚举</summary>
	/// <field name="BrowserNotSupport">浏览器不支持</field>
	/// <field name="PlugInNotInstalled">还未安装插件</field>
	/// <field name="OperationFailed">操作失败</field>
	/// <field name="ArgumentIllegal">参数非法</field>
	/// <field name="ArgumentNullIllegal">参数有无效值null</field>
	/// <field name="ArgumentOutOfRange">参数值在可接受范围之外</field>
	/// <field name="ArgumentTypeIllegal">参数不是允许的类型</field>
	/// <field name="ParameterCountIllegal">传递给函数的参数的个数无效</field>
	/// <field name="ArgumentUndefinedIllegal">需要的方法形参的实参为未定义</field>
	/// <field name="FileOrDownloadFailed">下载失败或打开文件失败</field>
	/// <field name="RenderSystemIsNotSupported">OpenGL版本较低需要更新驱动</field>
	/// <field name="PluginVersionLower">插件库版本低</field>
	/// <field name="LibVersionLower">脚本库版本低</field>
	/// <field name="SceneAntialiasFailed">场景反走样失败</field>

    BrowserNotSupport : 1,		      //浏览器不支持
    PlugInNotInstalled : 2,		      //还未安装插件
    OperationFailed : 3,		        //操作失败
    ArgumentIllegal : 4,		        //参数非法
    ArgumentNullIllegal : 5,	      //参数有无效值null
    ArgumentOutOfRange : 6,		      //参数值在可接受范围之外
    ArgumentTypeIllegal : 7,	      //参数不是允许的类型
    ParameterCountIllegal : 8,	    //传递给函数的参数的个数无效
    ArgumentUndefinedIllegal : 9,   //需要的方法形参的实参为未定义
    FileOrDownloadFailed : 10,       //下载失败或打开文件失败
    RenderSystemIsNotSupported : 11,  // OpenGL版本较低显示效果不支持
    PluginVersionLower : 12,                 //插件库版本低
    LibVersionLower : 13,                   //脚本库版本低
    SceneAntialiasFailed : 14               //场景反走样失败
}

SuperMap.Web.Realspace.ExceptionName.registerEnum("SuperMap.Web.Realspace.ExceptionName");

Type.registerNamespace("SuperMap.Web.UI.Action3Ds");

/*
* 枚举名 : SceneActionType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.UI.Action3Ds.SceneActionType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.UI.Action3Ds.SceneActionType.prototype = {
	/// <summary>SceneUserAction 用户操作模式枚举</summary>
	/// <field name="NULL">空操作</field>
	/// <field name="PAN">漫游</field>
	/// <field name="ZOOMIN">放大</field>
	/// <field name="ZOOMOUT">缩小</field>
	/// <field name="ZOOMFREE">自由缩放</field>
	/// <field name="POINTSELECT">点选</field>
	/// <field name="MEASUREDISTANCE">距离量算</field>
	/// <field name="MEASUREAREA">面积量算</field>
	/// <field name="MEASUREHEIGHT">高程量算</field>
	/// <field name="MEASURETERRAINDISTANCE">量算依地形距离</field>
	/// <field name="PANSELECT">点选允许漫游</field>

	NULL : 5,							//空操作
	PAN : 6,							//漫游
	ZOOMIN : 7,						    //放大
	ZOOMOUT : 8,					    //缩小
	ZOOMFREE : 4,					    //自由缩放
	POINTSELECT : 10,                   // 点选
	MEASUREDISTANCE : 0,	            //距离量算
	MEASUREAREA : 2,			        //面积量算
	MEASUREHEIGHT : 3,		            //高程量算
	MEASURETERRAINDISTANCE : 37,		//依地形距离量算
    MEASURETERRAINAREA:38,              //依地形面积量算
    MEASUREHORIZONTALDISTANCE:1,   // 水平距离量算
	PANSELECT : 105			            //点选允许漫游
}
SuperMap.Web.UI.Action3Ds.SceneActionType.registerEnum("SuperMap.Web.UI.Action3Ds.SceneActionType");

Type.registerNamespace("SuperMap.Web.Core");

/**
* 枚举名 : Fill3DMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Core.Fill3DMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Core.Fill3DMode.prototype = {
	/// <summary>Fill3DMode 面填充类型枚举</summary>
	/// <field name="FACE">区域填充模式</field>
	/// <field name="LINE">轮廓填充模式</field>
	/// <field name="FACEANDLINE">区域和轮廓填充模式</field>

	FACE : 1,					//区域填充模式
	LINE : 2,					//轮廓填充模式
	FACEANDLINE : 3		//区域和轮廓填充模式

}
SuperMap.Web.Core.Fill3DMode.registerEnum("SuperMap.Web.Core.Fill3DMode");


/**
* 枚举名 : Feature3DSearchOption
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Core.Feature3DSearchOption = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Core.Feature3DSearchOption.prototype = {
	/// <summary>Feature3DSearchOption 查询选项</summary>
	/// <field name="AllFeatures">查询所有的三维要素</field>
	/// <field name="TopFeaturesOnly">只查询顶层三维要素</field>

	AllFeatures : 0,					//查询所有的三维要素
	TopFeaturesOnly : 1				//只查询顶层三维要素

}
SuperMap.Web.Core.Feature3DSearchOption.registerEnum("SuperMap.Web.Core.Feature3DSearchOption");

/**
* 枚举名 : TextAlignment
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Core.TextAlignment = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Core.TextAlignment.prototype = {
	/// <summary>TextAlignment 文本对齐方式枚举</summary>
	/// <field name="TopLeft">左上角对齐</field>
	/// <field name="TopCenter">顶部居中对齐</field>
	/// <field name="TopRight">右上角对齐</field>


    TopLeft : 0,          //左上角对齐
    TopCenter	: 1,      	//顶部居中对齐
    TopRight : 2,         //右上角对齐
    BaselineLeft	: 3,    //基准线左对齐
    BaselineCenter : 4,   //基准线居中对齐
    BaselineRight : 5,    //基准线右对齐
    BottomLeft	: 6,    	//左下角对齐
    BottomCenter : 7,    	//底部居中对齐
    BottomRight : 8,      //右下角对齐
    MiddleLeft : 9,   		//左中对齐
    MiddleCenter : 10,   	//中心对齐
    MiddleRight : 11    	//右中对齐
}
SuperMap.Web.Core.TextAlignment.registerEnum("SuperMap.Web.Core.TextAlignment");


/**
* 枚举名 : GeometryType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Core.GeometryType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Core.GeometryType.prototype = {
	/// <summary>GeometryType 几何数据类型枚举</summary>
	/// <field name="GEONULL">空类型</field>
	/// <field name="GEOPOINT3D">三维点类型</field>
	/// <field name="GEOLINE3D">三维线类型</field>
	/// <field name="GEOREGION3D">三维面类型</field>
    /// <field name="GEOTEXT3D">三维文本类型</field>
    /// <field name="GEOPLACEMARK">三维地标类型</field>
	/// <field name="GEOCOMPOUND">复合对象类型</field>
	/// <field name="GEOMODEL">三维模型类型</field>
	/// <field name="GEOPICTURE3D">三维中依地形的图片类型</field>
	/// <field name="GEOSPHERE">三维球</field>
	/// <field name="GEOHEMISPHERE">三维半球体</field>
	/// <field name="GEOBOX">三维盒</field>
	/// <field name="GEOCYLINDER">三维圆柱</field>
	/// <field name="GEOCONE">三维椎体</field>
	/// <field name="GEOPYRAMID">三棱锥</field>
	/// <field name="GEOPIE3D">三维扇面</field>
	/// <field name="GEOCIRCLE3D">三维圆</field>
	/// <field name="GEOPIECYLINDER">三维扇面圆柱</field>
	/// <field name="GEOELLIPSOID">三维椭球体</field>
	/// <field name="GEOPARTICLE">粒子</field>

    GEONULL : 0,          //空类型
    GEOPOINT3D : 101,     //三维点
    GEOLINE3D	: 103,    	//三维线
    GEOREGION3D : 105,    //三维面
    GEOTEXT3D : 107,      //三维文本
    GEOPLACEMARK : 108,   //三维地标
    GEOCOMPOUND : 1000,   //复合对象
    GEOMODEL	 : 1201,  	//三维模型
    GEOPICTURE3D : 1202,   //三维中依地形的图片
    GEOSPHERE   : 1203,      //三维球
    GEOHEMISPHERE :1204,    //三维半球体
    GEOBOX        :1205,     //三维盒
    GEOCYLINDER  : 1206,      //三维圆柱
    GEOCONE     :1207,      //三维椎体
    GEOPYRAMID   :1208,      //三棱锥
    GEOPIE3D     :1209,      //三维扇面
    GEOCIRCLE3D  :1210,     //三维圆
    GEOPIECYLINDER     :1211,      //三维扇面圆柱
    GEOELLIPSOID :1212,     //三维椭球体
    GEOPARTICLE	 : 1213,    //粒子
    GEOMODELPRO : 1218,   //GeoModel3D
    GEOBILLBOARD : 1220   //布告板
}
SuperMap.Web.Core.GeometryType.registerEnum("SuperMap.Web.Core.GeometryType");

/**
* 枚举名 : Feature3DType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Core.Feature3DType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Core.Feature3DType.prototype = {
	/// <summary>Feature3DType 要素对象枚举</summary>
	/// <field name="FEATURE3DOBJECT">三维要素对象</field>
	/// <field name="FEATURE3DTREE">三维要素对象集合</field>

    FEATURE3DOBJECT : 2,			//三维要素对象
    FEATURE3DTREE : 3					//三维要素对象集合
}

SuperMap.Web.Core.Feature3DType.registerEnum("SuperMap.Web.Core.Feature3DType");

/**
* 枚举名 : ParticleType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Core.ParticleType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Core.ParticleType.prototype = {
	/// <summary>ParticleType 粒子类型枚举</summary>
	/// <field name="Fire">火焰效果</field>
	/// <field name="Smoke">烟雾效果</field>
	/// <field name="FireSmoke">烟火效果</field>
	/// <field name="Fountain">喷泉效果</field>
    /// <field name="Explode">爆炸效果</field>
    /// <field name="Rain">降雨效果</field>
	/// <field name="Snow">降雪效果</field>
	/// <field name="Tailflame">尾焰效果</field>

    Fire : 1,       //火焰效果
    Smoke	: 2,    //烟雾效果
    FireSmoke : 3,  //烟火效果
    Fountain : 4,   //喷泉效果
    Explode : 5,    //爆炸效果
    Rain : 6,       //降雨效果
    Snow	 : 7,  	//降雪效果
    Tailflame : 8   //尾焰效果
}
SuperMap.Web.Core.ParticleType.registerEnum("SuperMap.Web.Core.ParticleType");

/**
* 枚举名 : StereoMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.StereoMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.StereoMode.prototype = {
	/// <summary>StereoMode 立体显示模式</summary>

	/// <field name="Anaglyphic">互补色方式</field>
	/// <field name="QuadBuffer">四缓存方式</field>
	/// <field name="HorizontalSplit">水平分割</field>
	/// <field name="VerticalSplit">垂直分割</field>
  /// <field name="OculusVR">oculus dk2虚拟现实头盔</field>
  /// <field name="  HTCVIVE_VR"  HTCVIVE_VR虚拟现实头盔</field>

    Anaglyphic : 0,        //互补色方式
    QuadBuffer : 1,        //四缓存方式
    HorizontalSplit : 2,   //水平分割
    VerticalSplit : 3  ,    //垂直分割
    OculusVR  : 9 ,   //oculus dk2虚拟现实头盔
    HTCVIVE_VR  : 10    //HTCVIVE虚拟现实头盔
}
SuperMap.Web.Realspace.StereoMode.registerEnum("SuperMap.Web.Realspace.StereoMode");

/**
 * 枚举名 : Theme3DType
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.Theme3DType = function(){
    throw Error.notImplemented();
}
SuperMap.Web.Realspace.Theme3DType.prototype={
    THEME3DUNIQUE:1,      //单值专题图
    THEME3DRANGE:2,        //分段专题图
    THEME3DLABEL:3,         //标签专题图
    THEME3DGRAPH:4,         //统计专题图
    THEME3DCUSTOM:5         //统计专题图
}
SuperMap.Web.Realspace.Theme3DType.registerEnum("SuperMap.Web.Realspace.Theme3DType");


/**
 * 枚举名 : Theme3DGraphType
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.Theme3DGraphType = function(){
    throw Error.notImplemented();
}
SuperMap.Web.Realspace.Theme3DType.prototype={
    BAR:4,      //柱状专题图
    PIE:6,        //饼状专题图
    STACK_BAR:12       //堆叠专题图
}
SuperMap.Web.Realspace.Theme3DGraphType.registerEnum("SuperMap.Web.Realspace.Theme3DGraphType");

/**
 * 枚举名 : Theme3DGraphTextFormat
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.Theme3DGraphTextFormat = function(){
    throw Error.notImplemented();
}
SuperMap.Web.Realspace.Theme3DGraphTextFormat.prototype={
    PERCENT:1,      //
    VALUE:2,        //
    CAPTION:3,       //
    CAPTION_PERCENT:4,
    CAPTION_VALUE:5
}
SuperMap.Web.Realspace.Theme3DGraphTextFormat.registerEnum("SuperMap.Web.Realspace.Theme3DGraphTextFormat");

/**
 * 枚举名 : GraduatedMode3D
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.GraduatedMode3D = function(){
    throw Error.notImplemented();
}
SuperMap.Web.Realspace.GraduatedMode3D.prototype={
    CONSTANT:1,      //
    LOGARITHM:2,        //
    SQUAREROOT:3       //
}
SuperMap.Web.Realspace.GraduatedMode3D.registerEnum("SuperMap.Web.Realspace.GraduatedMode3D");


/**
 * 枚举名 : Graph3DType
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.Graph3DType = function(){
    throw Error.notImplemented();
}
SuperMap.Web.Realspace.Graph3DType.prototype={
    Bar :4,      //
    Pie :6,        //
    StackedBar :12      //
}
SuperMap.Web.Realspace.Graph3DType.registerEnum("SuperMap.Web.Realspace.Graph3DType");


/**
* 枚举名 : ParallaxMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.ParallaxMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.ParallaxMode.prototype = {
	/// <summary>ParallaxMode 立体视差模式</summary>

	/// <field name="NegativeParallax">负视差，即景物在屏幕前</field>
	/// <field name="PositiveParallax">正视差，即景物在屏幕后</field>

    NegativeParallax : 0,        //负视差，即景物在屏幕前
    PositiveParallax : 1         //正视差，即景物在屏幕后
}
SuperMap.Web.Realspace.ParallaxMode.registerEnum("SuperMap.Web.Realspace.ParallaxMode");

/**
* 枚举名 : SceneType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.SceneType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.SceneType.prototype = {
	/// <summary>SceneType 场景类型</summary>

	/// <field name="Globe">球三维</field>
	/// <field name="Flat">平面三维</field>

    Globe : 0,        //球三维
    Flat  : 1         //平面三维
}
SuperMap.Web.Realspace.SceneType.registerEnum("SuperMap.Web.Realspace.SceneType");

/**
* 枚举名 : ImageType
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.ImageType = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.ImageType.prototype = {
	/// <summary>ImageType 图片类型</summary>

	/// <field name="BMP">BMP</field>
	/// <field name="JPG">JPG</field>
	/// <field name="PNG">PNG</field>
    /// <field name="GIF">GIF</field>
    /// <field name="JPGPNG">JPGPNG</field>

    BMP : 121,          //BMP
    JPG : 122,          //JPG
    PNG : 123,           //PNG
    GIF : 124,           //GIF
    JPGPNG : 147        //JPGPNG
}
SuperMap.Web.Realspace.ImageType.registerEnum("SuperMap.Web.Realspace.ImageType");

/**
 * 枚举名 : ContourDisplayStyle
 * 描   述：等高线分析结果显示风格
 * 版 本 号：
 */
SuperMap.Web.Realspace.ContourDisplayStyle = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.ContourDisplayStyle.prototype = {
    /// <summary>ContourDisplayStyle 等高线显示风格</summary>
    /// <field name="CONTOUR_STYLE_LINES">显示等高线</field>
    /// <field name="CONTOUR_STYLE_LINES">显示颜色</field>
    /// <field name="CONTOUR_STYLE_LINES_AND_COLORS">同时显示等高线和颜色</field>

    COLORS : 0,		//等高线分层设色
    LINES : 1,		//在设置的高程值上显示等高线
    LINES_AND_COLORS : 2   //同时显示等高线和等高线分层颜色
}
SuperMap.Web.Realspace.ContourDisplayStyle.registerEnum("SuperMap.Web.Realspace.ContourDisplayStyle");

/**
 * 枚举名 : SkylineDisplayStyle
 * 描   述：天际线的显示模式
 * 版 本 号：
 */
SuperMap.Web.Realspace.SkylineDisplayStyle = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.SkylineDisplayStyle.prototype = {
    LINE : 1,		//显示线模式
    FACE: 2		//显示面模式
}
SuperMap.Web.Realspace.SkylineDisplayStyle.registerEnum("SuperMap.Web.Realspace.SkylineDisplayStyle");

/**
 * 枚举名 : AnalysisQuality
 * 描   述：GPU分析质量
 * 版 本 号：
 */
SuperMap.Web.Realspace.AnalysisQuality = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.AnalysisQuality.prototype = {
    LOW : 0,
    MEDIUM: 1,
    HIGH:2
}
SuperMap.Web.Realspace.AnalysisQuality.registerEnum("SuperMap.Web.Realspace.AnalysisQuality");

/**
 * 枚举名 : SlopeDisplayStyle
 * 描   述：坡度分析结果显示风格
 * 版 本 号：
 */
SuperMap.Web.Realspace.SlopeDisplayStyle = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.SlopeDisplayStyle.prototype = {
    /// <summary>SlopeDisplayStyle 坡度显示风格</summary>
    /// <field name="SLOP_STYLE_DIRECTION">显示坡向</field>
    /// <field name="CONTOUR_STYLE_COLORS">显示颜色</field>
    /// <field name="CONTOUR_STYLE_DIRECTION_AND_COLORS">同时显示坡向和颜色</field>

    ARROW : 1,		//显示坡向箭头
    COLORS : 0,		//显示颜色
    ARROW_AND_COLORS : 2  //同时显示坡向和颜色
}
SuperMap.Web.Realspace.SlopeDisplayStyle.registerEnum("SuperMap.Web.Realspace.SlopeDisplayStyle");

/**
 * 枚举名 : playMode
 * 描   述：播放模式
 * 版 本 号：
 */
SuperMap.Web.Realspace.PlayMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.PlayMode.prototype = {
    /// <summary>PlayMode 播放模式</summary>


    SRONCE : 1,		//播放一次
    SRLOOP : 2	//循环播放

}
SuperMap.Web.Realspace.PlayMode.registerEnum("SuperMap.Web.Realspace.PlayMode");

/**
* 枚举名 : WalkingMode
* 描   述：
* 版 本 号：
*/
SuperMap.Web.Realspace.WalkingMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.WalkingMode.prototype = {

    None : 0,			//默认值，不开启行走模式
    ByKeyboard : 1,		//键盘驱动行走
    AutoWalk : 2,		//自动行走
    AutoRun: 3 			//跑步
}

SuperMap.Web.Realspace.WalkingMode.registerEnum("SuperMap.Web.Realspace.WalkingMode");

/**
 * 枚举名 : BoxClipPart
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.BoxClipPart = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.BoxClipPart.prototype = {

    ClipNothing :0,	//不裁剪
    ClipBehindAnyPlane : 1,		//裁剪掉位于任意裁剪面后面的部分
    ClipBehindAllPlane :2,	   //裁剪掉位于所有裁剪面后面的部分
    ClipKeepLine : 3				  // 只保留裁线，裁剪掉其他部分
}

SuperMap.Web.Realspace.BoxClipPart.registerEnum("SuperMap.Web.Realspace.BoxClipPart");

/**
 * 枚举名 : MultiViewportMode
 * 描   述：
 * 版 本 号：
 */
SuperMap.Web.Realspace.MultiViewportMode = function() {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.MultiViewportMode.prototype = {

    None  : 0,		//非多视口, 也就是只有一个视口
    Horizontal  : 1	,	//水平跨越多视口
    Vertical  : 2 ,		//垂直跨越多视口
    Quad  : 3 ,	       //四视口
    Triple : 4       //三分屏 (水平方向上)


}

SuperMap.Web.Realspace.MultiViewportMode.registerEnum("SuperMap.Web.Realspace.MultiViewportMode");

/**
 * 枚举名 : DownLoadStyle
 * 描   述： 选择是否采用Zip压缩的方式进行传输
 * 版 本 号：
 */
SuperMap.Web.Realspace.ConfigueDownLoadStyle = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.ConfigueDownLoadStyle.prototype = {

    UnZip: 0,         //不采用Zip压缩的传输方式
    Zip:   1,         //采用Zip压缩的传输方式
    Local: 2          //不下载，加载本地资源
}
SuperMap.Web.Realspace.ConfigueDownLoadStyle.registerEnum("SuperMap.Web.Realspace.ConfigueDownLoadStyle");

/**
 * 枚举名 : SplitterOrientation
 * 描   述： 分隔条方向
 * 版 本 号：
 */
SuperMap.Web.Realspace.SplitterOrientation = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.SplitterOrientation.prototype = {

    Horizontal: 0,         //垂直方向
    Vertical: 1               //水平方向
}
SuperMap.Web.Realspace.SplitterOrientation.registerEnum("SuperMap.Web.Realspace.SplitterOrientation");

/**
 * 枚举名 : HypsometricSettingDisplayMode
 * 描   述： 分层设色显示模式
 * 版 本 号：
 */
SuperMap.Web.Realspace.HypsometricSettingDisplayMode = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.HypsometricSettingDisplayMode.prototype = {

    None: 0,         //不使用显示模式
    Face: 1,         //显示填充
    Line: 2,         //显示轮廓线
    Face_And_Line: 3 //显示填充和轮廓
}
SuperMap.Web.Realspace.HypsometricSettingDisplayMode.registerEnum("SuperMap.Web.Realspace.HypsometricSettingDisplayMode");

/**
 * 枚举名 : SnapMode
 * 描   述： 顶点捕捉模式
 * 版 本 号：
 */
SuperMap.Web.Realspace.SnapMode = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.SnapMode.prototype = {

    Sm3D_None:  0,         //不捕捉
    Sm3D_Point: 1          //捕捉点
}
SuperMap.Web.Realspace.SnapMode.registerEnum("SuperMap.Web.Realspace.SnapMode");

/**
 * 枚举名 : Class
 * 描   述： 所有类名枚举
 * 版 本 号：
 */
SuperMap.Web.Realspace.ClassNumber = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.ClassNumber.prototype = {

    BOUNDINGBOX : 1001,
    COLOR : 1002,
    FEATURE : 1003,
    FEATURE3D : 1004,
    FEATURE3DS : 1005,
    GEOBOX : 1006,
    GEOCIRCLE	: 1007,
    GEOCIRCLE3D	:	1008,
    GEOCONE	:	1009,
    GEOCYLINDER :	1010,
    GEOELLIPSE : 1011,
    GEOELLIPSOID : 1012,
    GEOHEMISPHERE :	1013,
    GEOLINE : 1014,
    GEOLINE3D :	1015,
    GEOMETRY : 1016,
    GEOMETRY3D : 1017,
    GEOMODEL : 1018,
    GEOMODEL3D : 1019,
    GEOPARTICLE : 1020,
    GEOPICTURE3D : 1021,
    GEOPIE3D : 1022,
    GEOPIECYLINDE : 1023,
    GEOPLACEMARK : 1024,
    GEOPOINT : 1025,
    GEOPOINT3D : 1026,
    GEOPYRAMID : 1027,
    GEOREGION :	1028,
    GEOREGION3D : 1029,
    GEOSPHERE : 1030,
    GEOTEXT3D : 1031,
    POINT : 1032,
    POINT2D : 1033,
    POINT3D : 1034,
    POINT3DS : 1035,
    RECTANGLE : 1036,
    RECTANGLE2D : 1037,
    STYLE3D : 1038,
    TEXTPART3D : 1039,
    TEXTSTYLE3D : 1040,
    VECTOR3D : 1041,


    FILTERPARAMETER :	2001,
    SERVICEBASE : 2002,


    GETFEATURE3DSBYBOUNDSPARAMETERS : 3001,
    GETFEATURE3DSBYBOUNDSSERVICE : 3002,
    GETFEATURE3DSBYSQLPARAMETERS : 3003,
    GETFEATURE3DSBYSQLSERVICE : 3004,
    GETFEATURE3DSEVENTARGS : 3005,
    GETFEATURE3DSPARAMETERSBASE : 3006,
    GETFEATURE3DSRESULT :	3007,


    ANIMATION : 4001,
    ASYNCHELPER :	4002,
    ATMOSPHERE : 4003,
    BUBBLE : 4004,
    BUBBLES : 4005,
    CAMERA : 4006,
    CACHECONFIGUE : 4007,
    CONTOURMAP : 4008,
    DOWNLOADREQUEST : 4009,
    ENVIRONMENT : 4010,
    EVENTOBJECT :	4011,
    FIELDINFO : 4012,
    FIELDINFOS : 4013,
    FLYINGOPERATOR : 4014,
    FLYMANAGER : 4015,
    FLYROUTE : 4016,
    FLYROUTES : 4017,
    GLOBALIMAGE : 4018,
    HYPSOMETRICSETTING : 4019,
    LAYER3D : 4020,
    LAYER3DCUSTOM : 4021,
    LAYER3DDYNAMICRESTMAP : 4022,
    LAYER3DOSGB : 4023,
    LAYER3DS : 4024,
    LAYER3DSERVICEINFO : 4025,
    LAYER3DSERVICESLIST : 4026,
    LAYER3DTIANDITU : 4027,
    LAYER3DVOLUMEFILE : 4028,
    LAYER3DWMS : 4029,
    LAYER3DWMTS : 4030,
    LAYER3DWMTSSERVICEINFO : 4031,
    LAYER3DWMTSSERVICESLIST : 4032,
    LOOKAT : 4033,
    MATERIAL : 4034,
    MESH : 4035,
    MESHES : 4036,
    MODEL :	4037,
    NODEANIMATION : 4038,
    PARTICLESYSTEM : 4039,
    PROFILE : 4040,
    RESOURCES : 4041,
    ROUTESTOP :	4042,
    ROUTESTOPS : 4043,
    SCENE : 4044,
    SCENEOPTION : 4045,
    SCENESERVICEINFO : 4046,
    SCENESERVICESLIST : 4047,
    SCREENLAYER3D : 4048,
    SELECTION3D : 4049,
    SHADOWQUERY : 4050,
    SIGHTLINE : 4051,
    SIGHTLINERESULT : 4052,
    SKYLINE : 4053,
    SLOPEMAP : 4054,
    SPLITTER : 4055,
    STEREO : 4056,
    SUN	: 4057,
    TERRAINLAYER : 4058,
    TERRAINLAYERS : 4059,
    THEME3D : 4060,
    THEME3DGRAPH : 4061,
    THEME3DGRAPHITEM : 4062,
    THEME3DLABEL : 4063,
    THEME3DRANGE : 4064,
    THEME3DRANGEITEM : 4065,
    THEME3DUNIQUE : 4066,
    THEME3DUNIQUEITEM : 4067,
    TRACKINGLAYER3D : 4068,
    UNDERGROUND	: 4069,
    VIEWSHED3D : 4070,
    VOLUME3D : 4071,
    PROJECTIONIMAGE : 4072,
    Layer3DDynamicObject : 4073,
    Layer3DGroup : 4074,
    ModifyTerrainSetting : 4075,

    EXCAVATIONREGION : 5001,
    MEASUREAREA : 5002,
    MEASUREDISTANCE : 5003,
    MEASUREHEIGHT : 5004,
    MEASURETERRAINDISTANCE : 5005,
    NULLACTION : 5006,
    PAN	: 5007,
    PANSELECT : 5008,
    SCENEACTION : 5009,
    SELECT : 5010,
    SELECTEX : 5011,

    SCENECONTROL : 6001
}
SuperMap.Web.Realspace.ClassNumber.registerEnum("SuperMap.Web.Realspace.ClassNumber");

/**
 * 枚举名 : BillBoardMode
 * 描   述： 布告板模式
 * 版 本 号：
 */
SuperMap.Web.Realspace.BillBoardMode = function () {
    throw Error.notImplemented();
}

SuperMap.Web.Realspace.BillBoardMode.prototype = {

    SCREEN_ALIGNED: 0,//对齐于屏幕的，始终面向观察点
  	AUTO_Z_AXIAL: 1,//轴对齐布告板,围绕某个固定轴旋转
  	FIXED_ANGLE: 2,//固定角度的（目前是贴地，具体角度以后可再开接口）
  	FIXED_ROTATE_ANGLE: 3 // 固定旋转角度
}
SuperMap.Web.Realspace.BillBoardMode.registerEnum("SuperMap.Web.Realspace.BillBoardMode");
