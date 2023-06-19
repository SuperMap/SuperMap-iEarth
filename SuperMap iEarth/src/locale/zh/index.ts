
const global = {

  /**
   * UI界面
   * */

  // header 页头
  earth3D: '三维地球',
  control: '控制台',
  control_title: 'IEarth Pro 控制台',
  save: '保存',
  share: '分享',
  loginPlease: '请登录',
  tourists:'游客',

  // widgets 组件列表
  w_search: '搜索',
  w_north: '指北',
  w_reset: '重置',
  w_zoomOut: '缩小',
  w_zoomIn: '放大',
  w_fullScreen: '全屏',
  w_home: '首页',

  // toolBar 侧边栏
  t_layerList: '图层列表',
  t_addData: '添加数据',
  t_analyse3d: '三维分析',
  t_measure: '量算',
  t_sceneProperties: '场景属性',
  t_objectPainting: '对象绘制',


  // 面板-header
  layerList: '图层列表',
  addData: '添加数据',
  analyseSeries: '三维分析',
  sceneProperties: '场景属性',
  measure: '量算',
  objectPainting: '对象绘制',

  // 操作面板-添加数据
  publicService: "公共服务",
  customService: "自定义服务",
  onlineBaseMap: "在线底图",
  onlineTerrain: "在线地形",

  // 操作面板-三维分析
  clip: '裁剪', // 内嵌
  terrain: '地形操作',
  analysis3d: '三维分析',

  Intervisibility: '通视', // 三维分析
  viewableRange: '可视域',
  ligShadowAnalysisth: '阴影',
  profile: '剖面',
  Skyline: '天际线',

  boxClip: 'Box裁剪',  // 裁剪
  planeClip: '平面裁剪',
  crossClip: 'Cross裁剪',
  polygonClip: '多边形裁剪',

  terrainOperation: '地形操作', // 地形操作
  inundationAnalysis: '淹没分析',
  slopeAspect: '坡度坡向',
  Isoline: '等值线',

  //操作面板-量算-无

  // 操作面板-参数设置
  baseAttribute: '基本属性',
  flying: '飞行',
  ligth: '灯光',
  viewPorts: '视口',
  speciallyEffect: '特效',

  // 操作面板-对象绘制
  Line: '绘制线',
  Polygon: '绘制面',
  Skit: '小品',
  Particle: '粒子',


  /**
   * 组件内部界面
   * */

  // 全局
  s3mLayer: 'S3M图层',
  imgLayer: '影像图层',
  mvtLayer: 'MVT图层',
  terrainLayer: '地形图层',
  sure: '确定',
  cancle: '取消',
  analysis: '分析',
  clear: '清除',

  // 图层列表-无
  allLayer: '所有图层',
  deleteLayer: '删除图层',
  defaultTerrain: '默认地形',
  defaultImage: '默认影像',
  lnglatMap: '经纬底图',
  unnamedLayer: '未命名图层',
  stkTerrain: 'STK地形',
  unnamedTerrain: '未命名地形',
  superMapTerrain: 'SuperMapOnline 地形',
  tiandituTerrain: '天地图地形',
  noTerrain: '无地形',

  // 添加数据
  type: '类型',
  layer: '图层',
  scene: '场景',
  localData: '本地数据',

  address: '地址',
  name: '名称',
  addToken: '添加token',
  localFilePath: '本地文件路径',
  fileFold: '文件夹',

  inputAdress: '请输入地址',
  inputLayerName: "图层名称",
  urlIsNull: '图层URL不能为空，请输入URL !',
  urlCheckedsuccess: '图层URL校验成功',
  addScpFailed: '加载SCP失败，请检查网络连接状态或者url地址是否正确？',

  // 三维分析-3D
  longitude: '经度',
  latitude: '纬度',
  elevation: '高程',
  visibleAreaColor: '可视区域颜色',
  invisibleAreaColor: '不可视区域颜色',
  barrierHighlightColor: '障碍物高亮颜色',
  displayBarrier: '显示障碍点',
  highlightBarrier: '高亮障碍物',

  additionalHeight: '附加高度',
  horizontalFov: '水平视角',
  verticalFov: '垂直视角',
  hintLineColor: '提示线颜色',
  visibleBody: '显示可视体',
  visibleBodyColor: '可视体颜色',
  invisibleBody: '显示不可视体',
  hiddenAreaColor: '不可视体颜色',
  viewshedAnimation: '动态可视域',
  viewshedAnimationTip: '绘制模型运动路线，鼠标右键结束',

  timeInterval: '时间间隔',
  space: '间距',
  bottomHeight: '底部高程',
  stretchingHeight: '拉伸高度',
  bodyDisplay: '体显示',
  showShadow: '开启阴影',
  filterInterval: '过滤区间',
  startTime: '开始时间',
  endTime: '结束时间',
  ShadowStartTip: '播放一天时间段内阳光和阴影动画',
  ShadowStartTip2: '播放一年的阳光和阴影动画',
  ShadowStopTip: '停止动画',
  DaylightingRate: '采光率',

  startLongitude: '起点经度',
  startLatitude: '起点纬度',
  startElevation: '起点高程',
  endLongitude: '终点经度',
  endLatitude: '终点纬度',
  endElevation: '终点高程',
  disPlayInfo: '剖面信息展示',
  section: '截面',
  GPUProfile: "GPU剖面",

  DisplayMode: '显示模式',
  AnalysisRadius: '分析半径',
  LineWidth: '线宽度',
  SkylineColor: '天际线颜色',
  SkylineBodyColor: '天际体颜色',
  ObstacleColor: '障碍物颜色',
  Display2D: '二维显示',
  HighlightObstacles: '高亮障碍物',
  GlobeNoAnalysis: '地表不参与分析',
  LineDisplay: '线显示',
  BodyDisplay: '体显示',
  drawHeightLimitingBody: '绘制限高体',
  Skyline2D: '二维天际线',



  /**
   * 图片资源名称 - 演示
   * */
  BeijingCBD:"北京CBD",
  SophiaChurch:"索菲亚教堂",
  MountEverest:"珠峰地形影像",
  BIMBuilding:"BIM建筑",
  Pointcloud:"点云",
  Histogram:"柱状图",
  PhotographyModel:"倾斜摄影模型",
  JingJinMVT:"京津地区MVT",
  ChongqingBaimo:"重庆白模",
  YokohamaBaimo:"横滨白模",

  LocalImage:'本地图片',
  BingMap:'必应底图',
  TIANDITU:'天地图',
  OSM:'OSM底图',
  GRIDIMAGERY:'经纬底图',
  

  SuperMapOnlineTerrain:'超图在线地形',
  TiandituTerrain:'天地图地形',
  STKTerrain:'STK地形',


}

export default {
  global
}
