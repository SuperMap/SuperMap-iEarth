
const global =  {

  /**
   * UI界面
   * */

  // header 页头
  earth3D: '3D Earth',
  control: 'control board',
  control_title: 'IEarth control board',
  save: 'save',
  share: 'share',
  loginPlease: 'Please log in',
  tourists:'tourists',

  // widgets 组件列表
  w_search: 'search',
  w_north: 'North',
  w_reset: 'reset',
  w_zoomOut: 'zoomOut',
  w_zoomIn: 'zoomIn',
  w_fullScreen: 'fullScreen',
  w_home: 'home',

  // toolBar 侧边栏
  t_layerList: 'Layer List',
  t_addData: 'Add Data',
  t_analyse3d: 'Analyse 3D',
  t_measure: 'Measure',
  t_sceneProperties: 'Scene Properties',
  t_objectPainting: 'Object Painting',


  // 面板-header
  layerList: 'Layer List',
  addData: 'Add Data',
  analyseSeries: 'Analyse 3D',
  sceneProperties: 'Scene Properties',
  measure: 'Measure',
  objectPainting: 'Object Painting',

  // 操作面板 - 添加数据
  publicService: "Public",
  customService: "Custom",
  onlineBaseMap: "Map",
  onlineTerrain: "Terrain",

  // 操作面板-三维分析
  clip: 'clip', // 内嵌
  terrainOperation: 'terrain Operation',
  analysis3d: '3D-analysis',


  Intervisibility: 'Intervisibility',   // 三维分析
  viewableRange: 'viewableRange',
  ligShadowAnalysisth: 'ligShadow',
  profile: 'profile',
  Skyline: 'Skyline',

  boxClip: 'Box',  // 裁剪
  planeClip: 'Plane',
  crossClip: 'Cross',
  polygonClip: 'Polygon',

  terrain: 'Operation', // 地形操作
  inundationAnalysis: 'Inundation',
  slopeAspect: 'Slope',
  Isoline: 'Isoline',

  //操作面板-量算-无

  // 操作面板-参数设置
  baseAttribute: 'Attribute',
  flying: 'Flying',
  ligth: 'Ligth',
  viewPorts: 'ViewPorts',
  speciallyEffect: 'SpecialEffects',

  // 操作面板-对象绘制
  Line: 'Line',
  Polygon: 'Polygon',
  Skit: 'Skit',
  Particle: 'Particle',

  /**
 * 组件内部界面
 * */

  // 全局
  s3mLayer: 's3mLayer',
  imgLayer: 'imgLayer',
  mvtLayer: 'mvtLayer',
  terrainLayer: 'terrainLayer',
  sure: 'Sure',
  cancle: 'Cancle',
  analysis: 'Analysis',
  clear: 'Clear',

  // 图层列表-无
  allLayer: 'All Layer',
  deleteLayer: 'Delete Layer',
  defaultTerrain: 'Default Terrain',
  defaultImage: 'Default imagery',
  lnglatMap: 'Underlay Map',
  unnamedLayer: 'Unnamed Layer',
  stkTerrain: 'STK Terrain',
  unnamedTerrain: 'Unnamed Terrain',
  superMapTerrain: 'SuperMap Terrain',
  tiandituTerrain: 'Tianditu Terrain',
  noTerrain: 'No Terrain',

  // 添加数据
  type: 'Type',
  layer: 'Layer',
  scene: 'Scene',
  localData: 'LocalData',

  address: 'address',
  name: 'name',
  addToken: 'Add Token',

  localFilePath: 'Local file path',
  fileFold: 'Folder',

  inputAdress: 'Please enter the address',
  inputLayerName: "Layer Name",
  urlIsNull: 'Layer URL cannot be empty, please enter URL!',
  urlCheckedsuccess: 'Layer URL verification successful',
  addScpFailed: 'Loading SCP failed. Please check if the network connection status or URL address is correct?',

  longitude: 'Longitude',
  latitude: 'Latitude',
  elevation: 'Elevation',
  visibleAreaColor: 'VisibleAreaColor',
  invisibleAreaColor: 'InvisibleAreaColor',
  barrierHighlightColor: 'Barrier Color',
  displayBarrier: 'Display Barrier',
  highlightBarrier: 'Highlight Barrier',

  additionalHeight: 'additional Height',
  horizontalFov: 'horizontal Fov',
  verticalFov: 'vertical Fov',
  hintLineColor: 'Tip line Color',
  visibleBody: 'VisibleBody',
  visibleBodyColor: 'VisibleBody Color',
  invisibleBody: 'InvisibleBody',
  hiddenAreaColor: 'InvisibleBody Color',
  viewshedAnimation: 'Animation Viewshed',
  viewshedAnimationTip: 'Draw the model motion path, right-click to end',

  timeInterval: 'timeInterval',
  space: 'space',
  bottomHeight: 'bottomHeight',
  stretchingHeight: 'stretchingHeight',
  bodyDisplay: 'bodyDisplay',
  showShadow: 'showShadow',
  filterInterval: 'filterInterval',
  startTime: 'startTime',
  endTime: 'endTime',
  ShadowStartTip: 'Play a day long animation of sunlight and shadows',
  ShadowStartTip2: 'Play a year long animation of sunshine and shadows',
  ShadowStopTip: 'Stop Animation',
  DaylightingRate: 'DaylightingRate',

  startLongitude: 'startLongitude',
  startLatitude: 'startLatitude',
  startElevation: 'startElevation',
  endLongitude: 'endLongitude',
  endLatitude: 'endLatitude',
  endElevation: 'endElevation',
  disPlayInfo: 'disPlayInfo',
  section: 'Section',
  GPUProfile: "GPUProfile",

  DisplayMode: 'DisplayMode',
  AnalysisRadius: 'AnalysisRadius',
  LineWidth: 'LineWidth',
  SkylineColor: 'SkylineColor',
  SkylineBodyColor: 'SkylineBodyColor',
  ObstacleColor: 'ObstacleColor',
  Display2D: 'Display2D',
  HighlightObstacles: 'HighlightObstacles',
  GlobeNoAnalysis: 'GlobeNoAnalysis',
  LineDisplay: 'LineDisplay',
  BodyDisplay: 'BodyDisplay',
  drawHeightLimitingBody: 'drawHeightLimitingBody',
  Skyline2D: 'Skyline2D',
  


  /**
   * 图片资源名称 - 演示
   * */
  BeijingCBD:"BeijingCBD",
  SophiaChurch:"SophiaChurch",
  MountEverest:"MountEverest",
  BIMBuilding:"BIMBuilding",
  Pointcloud:"Pointcloud",
  Histogram:"Histogram",
  PhotographyModel:"PhotographyModel",
  JingJinMVT:"JingJinMVT",
  ChongqingBaimo:"ChongqingBaimo",
  YokohamaBaimo:"YokohamaBaimo",

  LocalImage:'LocalImage',
  BingMap:'BingMap',
  TIANDITU:'TIANDITU',
  OSM:'OSM',
  GRIDIMAGERY:'GRIDIMAGERY',

  SuperMapOnlineTerrain:'SuperMapTerrain',
  TiandituTerrain:'TiandituTerrain',
  STKTerrain:'STKTerrain',
}

export default {
  global
}

