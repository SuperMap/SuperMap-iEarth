var store = {
  debug: true,
  state: {
    isInitViewer: false,
    // 控制界面显隐，0默认隐藏，1显示
    ToolBarShow: false,
    toolBar: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    addLayer: [1, 0, 0],
    sceneAtttribute: [1, 0, 0, 0, 0],
    terrain: [1, 0, 0, 0],
    clip: [1, 0, 0, 0],
    analysis: [1, 0, 0, 0, 0],
    cityPlan: [1, 0, 0, 0, 0],
    onlineEdit: [1, 0, 0, 0],
    specialEffects: [0, 0, 0, 0,0], //特效
    hotSpots: [0, 0], //热点
    compass: true,
    infoManage:true,
    // 图层管理
    S3MLayerManage: null,
    imgLayerManage: null,
    terrainLayerManage: null,
    LayerAttributeToolbar: false, //图层属性显隐
    LayerAttribute: [1, 0, 0, 0],
    selectedLayerName: null, //当前选中编辑图层name
    // 编辑
    isEdit:false,
    isEditZ:false,
    zindex:99,  //动态改变z-index
    toolBaseColor:[true,true,true,true,true,true,true,true,true],
    isInitEcharts:false
  },
  setZindex(newValue) {
    this.state.zindex = newValue;
  },
  setisInitViewer(newValue) {
    this.state.isInitViewer = newValue;
  },
  setToolBarShow(newValue) {
    this.state.ToolBarShow = newValue;
  },
  setSpecialEffects(id,val) {
    this.state.specialEffects[id] = val;
    this.state.specialEffects = [...this.state.specialEffects];
  },
  setHotSpots(id,val) {
    this.state.hotSpots[id] = val;
    this.state.hotSpots = [...this.state.hotSpots];
  },
  setCompass(newValue) {
    this.state.compass = newValue;
  },
  setInfoManage(newValue){
    this.state.infoManage = newValue;
  },
  // 设置导航工具显隐
  setToolBarAction(newValue) {
    switch (newValue) {
      case 0:
        this.state.toolBar[0] = !this.state.toolBar[0];
        break;
      case 1:
        this.state.toolBar[1] = !this.state.toolBar[1];
        this.state.toolBaseColor[1] = !this.state.toolBaseColor[1];
        break;
      case 2:
        this.state.toolBar[2] = !this.state.toolBar[2];
        this.state.toolBaseColor[2] = !this.state.toolBaseColor[2];
        break;
      case 3:
        this.state.toolBar[3] = !this.state.toolBar[3];
        this.state.toolBaseColor[3] = !this.state.toolBaseColor[3];
        break;
      case 4:
        this.state.toolBar[4] = !this.state.toolBar[4];
        this.state.toolBaseColor[4] = !this.state.toolBaseColor[4];
        break;
      case 5:
        this.state.toolBar[5] = !this.state.toolBar[5];
        this.state.toolBaseColor[5] = !this.state.toolBaseColor[5];
        break;
      case 6:
        this.state.toolBar[6] = !this.state.toolBar[6];
        this.state.toolBaseColor[6] = !this.state.toolBaseColor[6];
        break;
      case 7:
        this.state.toolBar[7] = !this.state.toolBar[7];
        this.state.toolBaseColor[7] = !this.state.toolBaseColor[7];
        break;
      case 8:
        this.state.toolBar[8] = !this.state.toolBar[8];
        this.state.toolBaseColor[8] = !this.state.toolBaseColor[8];
        break;
      case 9:
        this.state.toolBar[9] = !this.state.toolBar[9];
        break;
      case 10:
        this.state.toolBar[10] = !this.state.toolBar[10];
        break;
      case 11:
        this.state.toolBar[11] = !this.state.toolBar[11];
        break;
      default:
        this.state.toolBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.state.toolBar = [...this.state.toolBar];
  },
  // 设置各功能组件子组件显隐
  setAddLayerAction(newValue) {
    this.state.addLayer = newValue;
  },
  setTerrainAction(newValue) {
    this.state.terrain = newValue;
  },
  setSceneAtttribute(newValue) {
    this.state.sceneAtttribute = newValue;
  },
  setClipAction(newValue) {
    this.state.clip = newValue;
  },
  setAnalysisAction(newValue) {
    this.state.analysis = newValue;
  },
  setCityPlanAction(newValue) {
    this.state.cityPlan = newValue;
  },
  setOnlineEditrAction(newValue) {
    this.state.onlineEdit = newValue;
  },
  // 设置图层管理
  setS3MLayerManage(newValue) {
    this.state.S3MLayerManage = newValue;
  },
  setImgLayerManage(newValue) {
    this.state.imgLayerManage = newValue;
  },
  setTerrainLayerManage(newValue) {
    this.state.terrainLayerManage = newValue;
  },
  setLayerAttributeToolbal(newValue) {
    this.state.LayerAttributeToolbar = newValue;
  },
  setLayerAttribute(newValue) {
    this.state.LayerAttribute = newValue;
  },
  setSelectedLayerName(newValue) {
    this.state.selectedLayerName = newValue;
  },
  setIsEdit(newValue) {
    this.state.isEdit = newValue;
  },
  setIsEditZ(newValue) {
    this.state.isEditZ = newValue;
  },
}

export default store
