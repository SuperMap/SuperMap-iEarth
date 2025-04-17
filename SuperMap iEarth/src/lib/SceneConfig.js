class SceneConfig {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.sceneConfig = null;
    this.init(options);
  }

  init(params={}) {
    // this.sceneName = params.sceneName;
    // this.sceneDescription = params.sceneDescription;
  }

  // 计算场景信息
  computedSceneInfo(){
    if(!this.viewer || !(this.viewer instanceof SuperMap3D.Viewer)) return;
    // this.sceneName = sceneName;
    // this.sceneDescription = sceneDescription;

    const sceneConfigData = {
      // SceneName: this.sceneName, // 场景名称
      // SceneDescription: this.sceneDescription, // 场景描述
      SceneMode: this.viewer.scene.mode, // 场景模式：二维 三维 哥伦布
      MouseOption: this.getMouseOption(), // 获取鼠标操作模式：Arcgis或者SuperMap3D
      Camera: this.getCamera(), // 相机位置
      SaveTime: this.getTime(), // 保存时间
      // // ClockTime: this.viewer.clockViewModel.currentTime, // 时间轴时间
      SceneClockTime: SuperMap3D.JulianDate.toIso8601(this.viewer.clock.currentTime), // 当前场景时间轴时间
    }
    sceneConfigData.LayerOptions = this.getLayersList(); // 场景中所有图层
    sceneConfigData.LayerStyles = this.getLayerStyles(); // 场景中所有图层的样式
    sceneConfigData.SceneAdjust = this.getSceneAdjust(); // 场景属性调节后的效果参数
    sceneConfigData.ParticleSystem = window.iEarthBindData.ParticleOptions; // 粒子系统
    
    this.sceneConfig = sceneConfigData;

    // this.saveObjToJsonFile(this.sceneConfig, this.sceneName);

    return Promise.resolve(sceneConfigData);
  }

  // 将对象保存为json文件并下载
  saveObjToJsonFile(jsonString, fileName){
    if(typeof jsonString !== 'string'){
      jsonString = JSON.stringify(jsonString, null, '\t');
    }
    if(!fileName) fileName = this.sceneName;

    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const alink = document.createElement("a");
    alink.style.display = "none";
    alink.download = fileName ? `${fileName}.json` : `${new Date().getTime()}.json`; // 下载后文件名
    alink.href = href;
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink); // 下载完成移除元素
    URL.revokeObjectURL(href); // 释放掉blob对象
  }

  // 获取当前相机的操作模式
  getMouseOption() {
    const params = {
      mode: viewer.scene.screenSpaceCameraController.customMouseMode,  // 该属性为自定义绑定，并无此API
      zoomFactor: viewer.scene.screenSpaceCameraController.zoomFactor, // 相机缩放速度
    }
    return params;
  }

  // 获取相机位置
  getCamera() {
    if(window.iEarthTool && window.iEarthTool.getCamera){ // 优先使用window.iEarthTool，便于统一
      return window.iEarthTool.getCamera();
    }

    const camera = this.viewer.scene.camera;
    if (this.viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) { // 平面场景
      const params = {
        position: {
          longitude: camera.positionCartographic.longitude,
          latitude: camera.positionCartographic.latitude,
          height: camera.positionCartographic.height,
        },
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
      };
      return params;
    } else { // 球面场景
      const params = {
        position: {
          x: camera.positionWC.x,
          y: camera.positionWC.y,
          z: camera.positionWC.z,
        },
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
        positionCartographic: camera.positionCartographic, //供平面场景（哥伦布视图）下使用
      };
      return params;
    }
  }

  // 获取当前时间：作为保存时间
  getTime() {
    const nowDate = new Date();
    return `${nowDate.toLocaleDateString()}-${nowDate.toLocaleTimeString()}`;
  }

  /**
  * 保存当前场景中的所有图层
  * S3M图层
  * 影像图层 todo
  * 地形图层 todo
  * MVT图层 todo
  */
  getLayersList(){
    const s3mLayerList = this.getS3MLayerList();
    const imgLayerList = this.getIMGLayerList();
    const mvtLayerList = this.getMVTLayerList();
    const tinLayerOption = this.getTINLayerOption(); // 地形只有一个
  
    return {
      s3mLayers:s3mLayerList,
      imgLayers:imgLayerList,
      mvtLayers:mvtLayerList,
      tinLayer:tinLayerOption,
    }
  }
  // 保存S3M图层
  getS3MLayerList() {
    const s3mlayerUrlList = [];
    for (let i = 0; i < this.viewer.scene.layers._layerQueue.length; i++) {
      const layer = this.viewer.scene.layers._layerQueue[i];
      if(!(layer instanceof SuperMap3D.S3MTilesLayer)) return; // 确保layer是S3MTilesLayer实例

      const s3mLayerOption = {};
      const baseUri = layer._baseUri;
      if(baseUri){
        s3mLayerOption["type"] = "S3MTilesLayer";
        s3mLayerOption["name"] = layer.name;
        s3mLayerOption["visible"] = layer.visible || layer._visible;
        s3mLayerOption["lodRangeScale"] = layer.lodRangeScale || layer._lodRangeScale;
        s3mLayerOption["cullEnabled"] = layer._cullEnabled || layer.cullEnabled; // 这个属性有点奇怪
        s3mLayerOption["ignoreNormal"] = layer._ignoreNormal || layer.ignoreNormal; // 获取或者设置是否在GPU中自动计算法线
        s3mLayerOption["ignoreVertexColor"] = layer._ignoreVertexColor || layer.ignoreVertexColor; // 是否忽略顶点颜色
        s3mLayerOption["minTransparentAlpha"] = layer._minTransparentAlpha || layer.minTransparentAlpha; // 最小透明度阈值
        s3mLayerOption["visibleDistanceMin"] = layer.visibleDistanceMin || layer._visibleDistanceMin; // 图层最小可见距离
        s3mLayerOption["visibleDistanceMax"] = layer.visibleDistanceMax || layer._visibleDistanceMax; // 图层最大可见距离
        
        // 多子域
        s3mLayerOption["subdomains"] = layer._subdomains;
        s3mLayerOption["subdomainsUrlScheme"] = layer._subdomainsUrlScheme;

        // 加载的优先级模式
        s3mLayerOption["LoadingPriority"] = layer.LoadingPriority;

        // 判断token
        if(layer._urlArguments && layer._urlArguments.token){
          s3mLayerOption["token"] = layer._urlArguments.token;
        }

        let layerUrl = baseUri.scheme + "://" + baseUri.authority + baseUri.path;
        if(baseUri._string) layerUrl = baseUri._string;
        layerUrl = getScpUrl(layerUrl);
        s3mLayerOption["url"] = layerUrl;
        s3mLayerOption["residentRootTile"] = layer.residentRootTile; // 记录该图层是否开启了根节点驻留
        
        if(layer.customPassIdOptions) s3mLayerOption["customPassIdOptions"] = layer.customPassIdOptions;
        s3mlayerUrlList.push(s3mLayerOption);
      }
    }

    return s3mlayerUrlList;

    // 获取s3m图层的ScpUrl
    function getScpUrl(url) {
      if(url && !url.includes('/realspace')) return;

      const scpUrl = url.replace("data/path/", "config");
      return scpUrl;
    }
  }
  // 保存影像图层
  getIMGLayerList() {
    let imgLayerList = [];
    this.viewer.imageryLayers._layers.forEach((imageryLayer, index) => {
      const imageryProvider = imageryLayer.imageryProvider || imageryLayer._imageryProvider;
      if(!imageryProvider) return;
      if(imageryProvider.url && imageryProvider.url.includes('earth-skin2.jpg')) return; // 默认底图不管

      let imgLayerOption = {};
      imgLayerOption["show"] = imageryLayer.show || imageryLayer._show;
      if(imageryLayer.customName) imgLayerOption["customName"] = imageryLayer.customName; // 保存影像图层在图层列表的自定义名称
      if(imageryProvider instanceof SuperMap3D.SuperMapImageryProvider){
        imgLayerOption["type"] = "SuperMapImageryProvider";
        imgLayerOption["url"] = imageryProvider.url || imageryProvider._url || imageryProvider._baseUrl;
        imgLayerOption["token"] = imageryProvider.token || imageryProvider._token;
        if(imageryProvider.ready){ // 读取maximumLevel属性前,imageryProvider.ready必须为true,否则会报错导致保存json失败
          imgLayerOption["maximumLevel"] = imageryProvider.maximumLevel || imageryProvider._maximumLevel;
        }else{
          imgLayerOption["maximumLevel"] = '该影像图层保存时其imageryProvider.ready为false,未能成功获取到maximumLevel属性真实数值;如需自定义,请在此处直接改为数值';
        }
      }else if(imageryProvider instanceof SuperMap3D.CGCS2000MapServerImageryProvider){
        imgLayerOption["type"] = "CGCS2000MapServerImageryProvider";
        imgLayerOption["url"] = imageryProvider._baseUrl || imageryProvider.url;
      }else if(imageryProvider instanceof SuperMap3D.BingMapsImageryProvider){
        imgLayerOption["type"] = "BingMapsImageryProvider";
        imgLayerOption["url"] = imageryProvider.url || imageryProvider._url;
        imgLayerOption["key"] = imageryProvider.key || imageryProvider._key;
      }else if(imageryProvider instanceof SuperMap3D.TiandituImageryProvider){
        imgLayerOption["type"] = "TiandituImageryProvider";
        imgLayerOption["url"] = imageryProvider.url || imageryProvider._url;
        imgLayerOption["token"] = imageryProvider.token || imageryProvider._token;
      }else if(imageryProvider instanceof SuperMap3D.UrlTemplateImageryProvider){
        imgLayerOption["type"] = "UrlTemplateImageryProvider";
        imgLayerOption["url"] = imageryProvider.url || imageryProvider._url || imageryProvider.tablename;
        imgLayerOption["subdomains"] = imageryProvider.subdomains || imageryProvider._subdomains;
      }else if(imageryProvider instanceof SuperMap3D.SingleTileImageryProvider){
        imgLayerOption["type"] = "SingleTileImageryProvider";
        imgLayerOption["url"] = imageryProvider.url || imageryProvider._url;
      }else if(imageryProvider instanceof SuperMap3D.TileCoordinatesImageryProvider){
        imgLayerOption["type"] = "TileCoordinatesImageryProvider";
      }

      // 不保存空option 
      if(imgLayerOption.type) imgLayerList.push(imgLayerOption);
    })
  
    return imgLayerList;
  }
  // 保存MVT图层
  getMVTLayerList(){
    let mvtLayerList = [];
    for (let k = 0; k < viewer.scene._vectorTileMaps._layerQueue.length; k++) {
      let mvtLayer = viewer.scene._vectorTileMaps._layerQueue[k];
      let mvtLayerOption = {};
      if (mvtLayer._provider) {
        mvtLayerOption["url"] = mvtLayer._provider.tablename;
        mvtLayerOption["name"] = mvtLayer._name;
      } else if (mvtLayer._url && mvtLayer._name) {
        mvtLayerOption["url"] = mvtLayer._url;
        mvtLayerOption["name"] = mvtLayer._name || mvtLayer.name;
      }
      mvtLayerList.push(mvtLayerOption);
    }
  
    return mvtLayerList;
  }
  // 保存地形图层 TODO:支持其他类型的地形
  getTINLayerOption(){
    let tinOption = {};
    let terrainProvider = this.viewer.terrainProvider;
    if(terrainProvider instanceof SuperMap3D.SuperMapTerrainProvider){
      tinOption["type"] = "SuperMapTerrainProvider";
      tinOption["url"] = terrainProvider.baseUrl || terrainProvider._baseUrl;
      // tinOption["isSct"] = tinOption["url"].includes('info/data/path') ? false : true; // 如果URL包含info..说明该服务为STK地形，将isSct设置为false；否则为正常地形默认为true
    }else if(terrainProvider instanceof SuperMap3D.SCTTerrainProvider){
      tinOption["type"] = "SCTTerrainProvider";
      tinOption["url"] = terrainProvider.urls || terrainProvider._urls;
    }else{} 
  
    return tinOption;
  }


  /**
  * 获取场景调节修改的属性
  * 全局属性：地球显隐、深度检测、大气渲染、控件（时间轴和帧率）
  * 视觉效果：泛光、地下、场景颜色调节、阴影、光照（太阳光+环境光+自定义灯光）
  * 场景要素：云层、天空盒
  * 特殊加持：环境光贴图
  */
  getSceneAdjust(){
    const SceneAdjust = {};
    SceneAdjust.GlobalAttr = this.getGlobalAttr();
    SceneAdjust.VisualEffect = this.getVisualEffect();
    SceneAdjust.SceneFeature = this.getSceneFeature();
    SceneAdjust.SpecialBuff = this.getSpecialBuff();

    return SceneAdjust;
  }
  // 全局属性：地球显隐、深度检测、大气渲染、控件（时间轴和帧率）
  getGlobalAttr(){
    const timeline = document.getElementsByClassName("supermap3d-viewer-timelineContainer")[0];
    const GlobalAttr = {
      earthShow: this.viewer.scene.globe.show, //地球显隐
      depthInspection: this.viewer.scene.globe.depthTestAgainstTerrain ? true : false,//深度检测
      atomsphereRender: this.viewer.scene.skyAtmosphere.show, //大气渲染
      timeAxis: (timeline && timeline.style.visibility === "visible") ? true : false,//时间轴
      displayFrame: this.viewer.scene.debugShowFramesPerSecond,//显示帧率
      hdrEnabled: this.viewer.scene.hdrEnabled,//是否开启HDR
      // fogEffect: this.viewer.scene.fog.enabled, //雾化效果
    }

    return GlobalAttr;
  }
  // 视觉效果：泛光、地下、场景颜色调节、阴影、光照（太阳光+环境光+自定义灯光）
  getVisualEffect(){
    const VisualEffect = {
      bloomEffect: this.getBloomEffect(),
      underGround: this.getUnderGround(),
      sceneColor: this.getSceneColor(),
      shadow: this.getShadow(),
      lightSource: this.getLightSource(),
      msaaLevel: this.getMsaaLevel(),
      sceneDepth: this.getSceneDepth(),
    };
    return VisualEffect;
  }
  // 视觉效果：泛光
  getBloomEffect(){
    const BloomEffect = {
      isOpen: this.viewer.scene.bloomEffect.show, 
      threshold: this.viewer.scene.bloomEffect.threshold, // 亮度阈值
      bloomIntensity: this.viewer.scene.bloomEffect.bloomIntensity // 泛光强度
    }
    return BloomEffect;
  }
  // 视觉效果：地下
  getUnderGround(){
    const UnderGround = {
      isOpen: this.viewer.scene.undergroundMode ? true : false, // 是否开启地下
      globeAlpha: this.viewer.scene.globe.globeAlpha // 地表透明度
    }
    return UnderGround;
  }
  // 视觉效果：硬件反走样
  getMsaaLevel(){
    const MsaaLevel = {
      isOpen: this.viewer.scene._msaaSamples === 1 ? false : true, // 是否开启反走样
      msaaLevel: this.viewer.scene._msaaSamples // 反走样强度值
    }
    return MsaaLevel;
  }
  // 视觉效果：设置景深
  getSceneDepth(){
    const SceneDepth = {
      isOpen: viewer.scene.depthOfFieldEffect.show, // 是否开启景深
      fStop: viewer.scene.depthOfFieldEffect.fStop,
      focalDistance: viewer.scene.depthOfFieldEffect.focalDistance,
      focalRange: viewer.scene.depthOfFieldEffect.focalRange,
      blurRadius: viewer.scene.depthOfFieldEffect.blurRadius,
    }
    return SceneDepth;
  }
  // 视觉效果：场景颜色调节
  getSceneColor(){
    const ColorCorrection = {
      isOpen: this.viewer.scene.colorCorrection.show, // 是否开启颜色调整开发
      brightness: this.viewer.scene.colorCorrection.brightness, // 亮度
      contrast: this.viewer.scene.colorCorrection.contrast, // 对比度
      hue: this.viewer.scene.colorCorrection.hue, // 色调
      saturation: this.viewer.scene.colorCorrection.saturation // 饱和度
    }
    return ColorCorrection;
  }
  // 视觉效果：阴影
  getShadow(){
    const Shadow = {
      isOpen: this.viewer.shadows ? true : false, // 是否开启阴影 - 阴影的效果还需要开启太阳和图层shadowType
      darkness: this.viewer.shadowMap.darkness, // 阴影浓度 - 使用时记得取反
      penumbraRatio: this.viewer.shadowMap.penumbraRatio, // 可见距离
      maximumDistance: this.viewer.scene.shadowMap.maximumDistance // 边界清晰度
    }
    return Shadow;
  }
  // 视觉效果：光照（太阳光+环境光+自定义灯光）
  getLightSource(){
    const LightSource = {
      // 不在设置enableLighting,否则会影响影像导致很亮
      sunLight: this.getSunLight(),
      // ambientLight: this.getAmbientLight(), // 不再保存环境光，环境光使用默认值
      customLights: this.getCustomLight(),
      lightModelSize: window.customConfig.lightModelSize || 5,
    }
    return LightSource;
  }
  // 视觉效果：光照-太阳光
  getSunLight(){
    const SunLight = {
      isOpen: this.viewer.scene.sun.show ? true : false, 
      sunLightColor: this.viewer.scene.lightSource.sunLightColor // 太阳光颜色 - 比较特殊是由color * intensity计算出 
    }
    return SunLight;
  }
  // 视觉效果：光照-自定义灯光
  getCustomLight(){
    const CustomLights = [];
    const isPlane = this.viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW;
    // 计算点光源
    const pointLights = this.viewer.scene.lightSource.pointLight.values;
    if(pointLights.length > 0){
      pointLights.forEach(point => {
        if(point instanceof SuperMap3D.PointLight){ // 平面场景下，采用_positionCV
          let position = isPlane ? SuperMap3D.Transforms.convertTo3DCartesian(point._positionCV) : point.position;
          const pointOption = {
            type:'pointLight',
            position: position, 
            option:{
              color:point.color,
              cutoffDistance:point.cutoffDistance,
              decay:point.decay,
              intensity:point.intensity,
            }
          };
          CustomLights.push(pointOption);
        }
      })
    }

    // 计算聚光灯
    const spotLights = this.viewer.scene.lightSource.spotLight.values;
    if(spotLights.length > 0){
      spotLights.forEach(spot => {
        if(spot instanceof SuperMap3D.SpotLight){ 
          let position = [spot.position, spot.targetPosition];
          if(isPlane){ // 平面场景下，采用_positionCV 转为 3DCartesian3
            let positionCVtoC3 = SuperMap3D.Transforms.convertTo3DCartesian(spot._positionCV);
            let targetPositionCVtoC3 = SuperMap3D.Transforms.convertTo3DCartesian(spot._targetPositionCV);
            position = [positionCVtoC3, targetPositionCVtoC3];
          }

          const spotOption = {
            type:'spotLight',
            position: position,
            option:{
              color:spot.color,
              distance:spot.distance,
              decay:spot.decay,
              intensity:spot.intensity,
              angle:spot.angle
            }
          };
          CustomLights.push(spotOption);
        }
      })
    }

    // 计算平行光
    const directionLights = this.viewer.scene.lightSource.directionalLight.values;
    if(directionLights.length > 0){
      directionLights.forEach(direction => {
        if(direction instanceof SuperMap3D.DirectionalLight){ // 平行光再球面和平面上position和_position坐标一样
          const directionOption = {
            type:'directionLight',
            position:direction.position,
            option:{
              color:direction.color,
              targetPosition:direction.targetPosition              ,
              intensity:direction.intensity,
            }
          };
          CustomLights.push(directionOption);
        }
      })
    }

    return CustomLights;
  }
  // 场景要素：云层、天空盒
  getSceneFeature(){
    const SceneFeature = {
      cloudLayer: this.getCloudLayer(),
      skyBox: this.getSkyBox()
    }
    return SceneFeature;
  }
  // 场景要素：云层
  getCloudLayer(){
    const cloudBox = this.viewer.scene.cloudBox;
    const CloudLayer = {
      isOpen: cloudBox ? true : false,
      imgUrl: (cloudBox && cloudBox.url) ? cloudBox.url : undefined
    }
    return CloudLayer;
  }
  // 场景要素：天空盒
  getSkyBox(){
    const skyBox = this.viewer.scene.skyBox;
    const Skybox = {
      isOpen: (skyBox.imageUrl && skyBox.imageUrl.includes('jpg')) ? true : false, // 通过imageUrl来判断是否开启的天空盒
      imageUrl: skyBox.imageUrl, // 天空盒图片资源路径
      WSpeed:skyBox.WSpeed, // 旋转速度
      horizontalRotationAngle:skyBox.horizontalRotationAngle // 旋转角度 - 旋转速度和旋转角度一起使用会有问题，优先开启旋转角度
    }
    return Skybox;
  }
  // 特殊加持：环境光贴图
  getSpecialBuff(){
    const SpecialBuff = {
      envMap: this.getEnvMap()
    }
    return SpecialBuff;
  }
  // 环境光贴图
  getEnvMap(){
    const EnvMap = {
      isOpen: this.viewer.scene.specularEnvironmentMaps ? true : false, // 没有开启时默认为un
      envMapUrl: this.viewer.scene.specularEnvironmentMaps, // 设置环境光贴图后的资源路径
      envMapIntensity: this.viewer.scene.envMapIntensity // 贴图强度
    }
    return EnvMap;
  }


  /**
  * 保存当前场景中的所有图层的图层风格
  * S3M图层
  * 影像图层 todo
  * 地形图层 todo
  * MVT图层 todo
  */
  getLayerStyles(){
    const LayerStyles = {
      s3mLayerStyles: this.getS3MLayerListStyle(),
    }
    return LayerStyles;
  }

  // 获取S3M图层的风格：
  getS3MLayerListStyle(){
    const s3mLayerList = this.viewer.scene.layers.layerQueue;
    const styleList = [];
    for(let i=0; i<s3mLayerList.length; i++){
      const s3mLayer = s3mLayerList[i];
      if(s3mLayer.isChangedStyle){ // 限制只有修改过图层风格的s3m图层才保存其样式参数
        const layerStyle = this.getS3MLayerStyles(s3mLayer);
        styleList.push(layerStyle);
      }
    }

    return styleList;
  }

  // 获取指定S3M图层风格
  getS3MLayerStyles(layer){
    if(!layer || !(layer instanceof SuperMap3D.S3MTilesLayer)) return;

    const obj = {
      name:layer.name,
      style:{}
    }

    // 颜色校正
    if(layer.brightness) obj.style.brightness = layer.brightness;
    if(layer.contrast) obj.style.contrast = layer.contrast;
    if(layer.hue) obj.style.hue = layer.hue;
    if(layer.saturation) obj.style.saturation = layer.saturation;
    if(layer.gamma) obj.style.gamma = layer.gamma;

    // 单项
    if(layer.selectedColor) obj.style.selectedColor = layer.selectedColor;
    // if(layer.selectColorType) obj.style.selectColorType = layer.selectColorType;
    // if(layer.lodRangeScale) obj.style.lodRangeScale = layer.lodRangeScale; // S3M图层的LOD属性已保存在layerOption中

    // style3D
    if(layer.style3D){
      const style3D = layer.style3D;
      obj.style.style3D = {
        fillStyle: style3D.fillStyle,
        lineColor: style3D.lineColor,
        fillForeColor: style3D.fillForeColor,
        alpha: style3D.fillForeColor ? style3D.fillForeColor.alpha : undefined,
        lineWidth: style3D.lineWidth,
        bottomAltitude: style3D.bottomAltitude,
      }
    }

    // 水面效果
    if(layer.waterParameter){
      const waterParameter = layer.waterParameter;
      obj.style.waterParameter = {
        waterbodySize: waterParameter.waterbodySize,
        waveStrength: waterParameter.waveStrength,
        color: waterParameter.color,
        waveDirection: waterParameter.waveDirection,
      }
    }

    // pbr材质 
    if(layer.pbrJsonDataSave) obj.style.pbrJson = layer.pbrJsonDataSave;

    return obj;
  }
}

export default SceneConfig;