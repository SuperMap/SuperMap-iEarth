class OpenConfig {
  constructor(viewer, options) {
    if (!viewer || !(viewer instanceof SuperMap3D.Viewer)) return;

    this.viewer = viewer;
    this.scene = viewer.scene;
    this.isAllS3MAdded = false;
    this.init(options);
  }

  // 初始化
  init(params = {}) {
    this.tiandituKey = params.tiandituKey;
    this.bingMapkey = params.bingMapkey;
  }

  // 打开文件管理获取选定文件内容
  openLocalFile(fileType = '.json') {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.style.display = 'none'; // 创建一个隐藏的input元素
      input.accept = '.json'; // 过滤文件类型

      document.body.appendChild(input);
      input.addEventListener('change', function (event) {
        const file = event.target.files[0]; // 获取文件引用
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const data = JSON.parse(e.target.result);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = function (error) {
          reject(error);
        };

        reader.readAsText(file);
      });

      input.click();
    })


  }

  // 将之前老版本iEarth保存的数据转为新版可用的场景数据
  oldSceneDataToNewSceneInfo(content) {
    let sceneInfo = {};
    sceneInfo.SceneMode = content.environmentState.sceneMode || 3;
    sceneInfo.Camera = content.camera;

    // 各类图层
    // TODO:支持MVT
    sceneInfo.LayerOptions = {
      s3mLayers: content.layers.s3mLayer,
      imgLayers: content.layers.imageryLayer,
      mvtLayers: content.layers.MVTLayer,
      tinLayer: content.layers.terrainLayer[0]
    }

    // 场景调节
    const sceneAttrState = content.layers.sceneAttrState;
    if (sceneAttrState) {
      sceneInfo.SceneAdjust = {
        GlobalAttr: {
          earthShow: sceneAttrState.earthShow,
          depthInspection: sceneAttrState.depthInspection,
          atomsphereRender: sceneAttrState.atomsphereRender,
          timeAxis: sceneAttrState.timeAxis,
          displayFrame: sceneAttrState.displayFrame,
        },
        VisualEffect: {
          shadow: {
            isOpen: sceneAttrState.shadow,
          },
          underGround: {
            isOpen: sceneAttrState.showUnderground,
            globeAlpha: sceneAttrState.surfaceTransparency
          },
          sceneColor: {
            isOpen: true,
            brightness: sceneAttrState.brightness,
            contrast: sceneAttrState.contrast,
            hue: sceneAttrState.hue,
            saturation: sceneAttrState.saturation
          }
        },
        SceneFeature: {
          cloudLayer: {
            isOpen: sceneAttrState.cloudLayer
          },
          skyBox: {
            isOpen: sceneAttrState.skyBoxShow
          }
        }
      }
    }

    // 图层风格
    // TODO:新版暂无selectColorMode,暂不考虑LODScale
    const layerStyleOptions = content.layers.layerStyleOptions;
    if (layerStyleOptions && Object.keys(layerStyleOptions).length > 0) {
      sceneInfo.LayerStyles = {
        s3mLayerStyles: []
      }
      Object.keys(layerStyleOptions).forEach(layerName => {
        const item = layerStyleOptions[layerName];
        const obj = {
          name: layerName,
          style: {
            selectedColor: item.selectedColor,
            style3D: {
              fillStyle: item.fillStyle,
              lineColor: item.lineColor,
              fillForeColor: item.foreColor,
              bottomAltitude: item.bottomAltitude,
              alpha: item.layerTrans,
            },
          }
        }
        sceneInfo.LayerStyles.s3mLayerStyles.push(obj);
      })
    }

    // 粒子系统
    if (content.layers && content.layers.particleOptions) {
      sceneInfo.ParticleSystem = content.layers.particleOptions;
    }

    return sceneInfo;
  }

  // 使得跨域请求当前URL时携带上Cooike,仅用于iPortal我的服务保存场景
  setTrustedServers(url) {
    const result = parseURL(url);
    if(SuperMap3D.TrustedServers.contains(url)) return;
  
    if(result.hostname && result.port){
      SuperMap3D.TrustedServers.add(result.hostname, result.port);
    }

    function parseURL(urlString) {
      try {
          const url = new URL(urlString);
          return {
              protocol: url.protocol,  // 协议（如 "http:"）
              hostname: url.hostname,  // 主机名（如 "192.168.1.1" 或 "example.com" ）
              port: url.port || (url.protocol === "https:" ? "443" : "80"), // 端口（自动补默认值）
              path: url.pathname  // 路径（如 "/api/data"）
          };
      } catch (e) {
          console.error("URL  解析失败:", e);
          return null;
      }
    }
  }

  // 打开本地场景
  async openScene(data) {
    if (!this.viewer || !(this.viewer instanceof SuperMap3D.Viewer)) return;
    data = data.content ? data.content : data;
    let SceneConfigData = data.sceneInfo ? data.sceneInfo : data;

    // 兼容打开之前版本保存的场景：environmentState为特征字段，为历史版本保存的场景所特有的，
    // 需要使用oldSceneDataToNewSceneInfo函数转成新版本iEarth可用的
    if (SceneConfigData.environmentState) {
      if (Array.isArray(SceneConfigData.layers)) {
        let temp = {
          s3mLayer: [],
          imageryLayer: [
          ],
          MVTLayer: [],
          terrainLayer: []
        };
        SceneConfigData.layers.forEach((layerInfo) => {
          if (layerInfo.type === 'S3M') {
            temp.s3mLayer.push({
              type: 'S3MTilesLayer',
              name: layerInfo.name,
              url: layerInfo.url
            });
          } else if (layerInfo.type === 'SingleTileImageryProvider' && layerInfo.url.includes('earth-skin')) {
            temp.imageryLayer.push({
              type: layerInfo.type,
              url: layerInfo.url
            });
          }
        });
        SceneConfigData.layers = temp;
      }
      SceneConfigData = this.oldSceneDataToNewSceneInfo(SceneConfigData);
    }

    if (!SceneConfigData || !SceneConfigData.Camera) return;
    // if(!SceneConfigData.SceneMode || SceneConfigData.SceneMode !== 3) return; // 目前只管球面场景

    this.setSceneMode(SceneConfigData.SceneMode) // 场景模式
    this.setSceneClockTime(SceneConfigData.SceneClockTime); // 当前场景和时间轴时间
    this.openCamera(SceneConfigData.Camera); // 相机定位
    this.setMouseOption(SceneConfigData.MouseOption); // 设置鼠标操作模式
    const S3MPromises = await this.openLayer(SceneConfigData.LayerOptions);
    if (S3MPromises) { // 如果本地场景没有保存任何S3M图层时,S3MPromises为undefined,如果所有S3M图层都不能访问,S3MPromises为空数组[]
      Promise.all(S3MPromises).then(results => {
        this.isAllS3MAdded = true; // 当前S3M图层已全部被加载的判断标志
        console.log('S3M-Results:', results);
        if (window.iEarthCustomFunc && window.iEarthCustomFunc.afterSceneOpen) {
          window.iEarthCustomFunc.afterSceneOpen(results);
        }
        this.openLayerStyles(SceneConfigData.LayerStyles); // 打开S3M图层之后在设置图层风格和阴影  
        SceneConfigData.SceneAdjust && this.openShadow(SceneConfigData.SceneAdjust.VisualEffect.shadow);
      }).catch(error => {
        console.error(error);
      });
    }

    // 延时五秒：待五秒后查看当前图层是否加载完成，
    // 没有加载完成说明上面的Promise.all没有走设置风格，用来托底判断是否需要再走设置风格，确保当前场景下存在的图层能够设置风格
    setTimeout(() => {
      if (this.isAllS3MAdded) {
        // console.log('所有S3M图层服务都能访问，已全部纳入加载');
      } else {
        if (SceneConfigData.LayerOptions.s3mLayers.length > 0) console.log('部分S3M图层服务无法访问,请排查JSON文件');
        this.openLayerStyles(SceneConfigData.LayerStyles); // 打开S3M图层之后在设置图层风格和阴影  
        SceneConfigData.SceneAdjust && this.openShadow(SceneConfigData.SceneAdjust.VisualEffect.shadow);
        this.isAllS3MAdded = true;
      }
    }, 8000)

    SceneConfigData.SceneAdjust && this.openSceneAdjust(SceneConfigData.SceneAdjust); // 打开场景属性参数

    // 这里不能用SuperMap3D，来操作Promise，因为这里调用栈执行环境会导致this为undefined
    // SuperMap3D.when.all(S3MPromises,function(layers){
    //   console.log("layers:",layers);
    //   this.openLayerStyles(SceneConfigData.LayerStyles); // 打开图层风格    
    // })

    this.setParticle(SceneConfigData.ParticleSystem);
  }

  setSceneMode(sceneMode) {
    this.scene.mode = sceneMode; // 场景模式
  }

  setSceneClockTime(Iso8601String) {
    if (Iso8601String) {
      let time = SuperMap3D.JulianDate.fromIso8601(Iso8601String)
      this.viewer.clock.currentTime = time.clone();
    }
  }

  // 设置鼠标操作模式
  setMouseOption(param) {
    if (!param) return;
    if (param.mode == 'ArcGIS') {
      this.scene.screenSpaceCameraController.customMouseMode = 'ArcGIS';
      this.scene.screenSpaceCameraController.zoomEventTypes = [SuperMap3D.CameraEventType.WHEEL, SuperMap3D.CameraEventType.MIDDLE_DRAG];
      this.scene.screenSpaceCameraController.tiltEventTypes = [SuperMap3D.CameraEventType.RIGHT_DRAG];
      this.scene.screenSpaceCameraController.inverseTilt = true;
    } else if(param.mode == 'SuperMap3D') {
      this.scene.screenSpaceCameraController.customMouseMode = 'SuperMap3D';
      this.scene.screenSpaceCameraController.inverseTilt = false;
      // 这是默认的不需要重新设置
      // this.scene.screenSpaceCameraController.zoomEventTypes = [SuperMap3D.CameraEventType.RIGHT_DRAG, SuperMap3D.CameraEventType.WHEEL, SuperMap3D.CameraEventType.PINCH];
      // this.scene.screenSpaceCameraController.tiltEventTypes = [SuperMap3D.CameraEventType.MIDDLE_DRAG, SuperMap3D.CameraEventType.PINCH, {
      //     eventType: SuperMap3D.CameraEventType.LEFT_DRAG,
      //     modifier: SuperMap3D.KeyboardEventModifier.CTRL
      // }, {
      //     eventType: SuperMap3D.CameraEventType.RIGHT_DRAG,
      //     modifier: SuperMap3D.KeyboardEventModifier.CTRL
      // }];
    }
    this.scene.screenSpaceCameraController.zoomFactor = Number(param.zoomFactor);
  }

  // 打开相机定位
  openCamera(param) {
    if (!param || !param.position) return;
    if (window.iEarthTool && window.iEarthTool.openCamera) { // 优先使用window.iEarthTool，便于统一
      return window.iEarthTool.openCamera(param);
    }

    const curCamera = param;
    if (this.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) { // 平面场景
      const position = param.position;
      this.scene.camera.setView({
        convert: this.scene.mode !== SuperMap3D.SceneMode.SCENE3D,
        destination: SuperMap3D.Cartesian3.fromRadians(
          position.longitude,
          position.latitude,
          position.height,
        ),
        orientation: {
          heading: param.heading,
          pitch: param.pitch,
          roll: param.roll,
        }
      })
    } else {     // 三维场景
      const cameraX = curCamera.position.x;
      const cameraY = curCamera.position.y;
      const cameraZ = curCamera.position.z;
      this.scene.camera.setView({
        destination: new SuperMap3D.Cartesian3(cameraX, cameraY, cameraZ),
        orientation: {
          heading: curCamera.heading,
          pitch: curCamera.pitch,
          roll: curCamera.roll
        }
      });
    }
  }

  // 打开所有图层
  async openLayer(param) {
    if (!param) return;
    let s3mPromises = null;
    if (param.s3mLayers && param.s3mLayers.length > 0) s3mPromises = await this.openS3M(param.s3mLayers);
    if (param.imgLayers && param.imgLayers.length > 0) this.openIMG(param.imgLayers);
    if (param.mvtLayers && param.mvtLayers.length > 0) this.openMVT(param.mvtLayers);
    if (param.tinLayer && param.tinLayer.url) this.openTIN(param.tinLayer);
    return s3mPromises;
  }

  // 检测当前URL服务是否能够被访问
  checkURLAccess(option) {
    let url = option.url;
    if(option.token && (typeof option.token === "string") && option.token.length > 5){ // token的长度肯定大于5
      url = url + "?token=" + option.token;
    }
    if(!url || (typeof url != 'string')) return false;
    const fetchParam = url.includes("/portalproxy/") ? {credentials:"include"} : undefined;
    return fetch(url,fetchParam)
      .then(response => {
        // console.log(`URL ${url} 可以访问`);
        return true;
      })
      .catch(error => {
        console.log(`此服务无法访问：${url}`);
        return false;
      });
  }

  // 打开S3M
  async openS3M(option) {
    if (!option || option.length === 0) return;
    const s3mLayerOptions = option;
    const promiseList = [];

    // 校验URL是否可以访问
    for (let j = 0; j < s3mLayerOptions.length; j++) { // forEach中无法使用await，在这里改为for循环
      let s3mOption = s3mLayerOptions[j];
      const isAccess = await this.checkURLAccess(s3mOption); // 判断当前URL是否可以访问
      s3mOption.isAccess = isAccess;
    }

    // console.log("s3mLayerOptions-checkURL:", s3mLayerOptions)

    for (let i = 0; i < s3mLayerOptions.length; i++) {
      let s3mOption = s3mLayerOptions[i];
      if (s3mOption.url && s3mOption.name && s3mOption.type === 'S3MTilesLayer') {
        const url = s3mOption.url;
        const name = s3mOption.name;
        const isExist = this.scene.layers.find(name); // 当前S3M不存在时添加

        // 判断token
        if (s3mOption.token) {
          SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(
            s3mOption.token
          );
        }

        // 判断是否为iPortal代理服务,需要跨域请求,必须携带Cooike
        if (url.includes("/portalproxy/")) {
          this.setTrustedServers(url);
        }

        if (s3mOption.isAccess && !isExist) {
          let promise = undefined;
          if (s3mOption.subdomains && s3mOption.subdomainsUrlScheme) {
            let scpConfig = {};
            scpConfig.name = name;
            scpConfig.subdomains = s3mOption.subdomains;
            scpConfig.subdomainConfig = {
              urlScheme: s3mOption.subdomainsUrlScheme,
              subdomains: s3mOption.subdomains
            };
            let suffix = url.split('rest/realspace')[1];
            let scpSubDomainUrl = s3mOption.subdomainsUrlScheme + suffix;
            console.log(`${name}-subDoMain-scpOption：`, {
              scpSubDomainUrl: scpSubDomainUrl,
              scpConfig: scpConfig
            })

            promise = this.scene.addS3MTilesLayerByScp(scpSubDomainUrl, scpConfig);
          } else {
            promise = this.scene.addS3MTilesLayerByScp(url, { name: name });
          }
          promiseList.push(promise);
          SuperMap3D.when(promise, function (s3mLayer) {
            if (s3mLayer && (s3mLayer instanceof SuperMap3D.S3MTilesLayer)) {
              // console.log(`${s3mLayer.name}-option:`,s3mOption);

              // 是否在GPU中自动计算法线+忽略顶点颜色
              s3mLayer.ignoreNormal = s3mOption.ignoreNormal == true ? true : false;
              s3mLayer.ignoreVertexColor = s3mOption.ignoreVertexColor == true ? true : false;

              // 最小透明度阈值
              if (s3mOption.minTransparentAlpha) s3mLayer.minTransparentAlpha = Number(s3mOption.minTransparentAlpha);

              // 设置根节点驻留
              s3mLayer.residentRootTile = s3mOption.residentRootTile == true ? true : false;

              // 加载的优先级模式
              s3mLayer.LoadingPriority = s3mOption.LoadingPriority;

              // 设置图层选中效果
              // s3mLayer.selectColorType = SuperMap3D.SelectColorType.SILHOUETTE_EDGE; 
              s3mLayer.selectedColor = new SuperMap3D.Color(
                128 / 255 * 1.5,
                198 / 255 * 1.5,
                226 / 255 * 1.5,
                1
              );

              // 图层最大最小可见距离
              if (s3mOption.visibleDistanceMin) s3mLayer.visibleDistanceMin = Number(s3mOption.visibleDistanceMin);
              if (s3mOption.visibleDistanceMax) s3mLayer.visibleDistanceMax = Number(s3mOption.visibleDistanceMax);

              // 图层最大最小可见高度
              if (s3mOption.minVisibleAltitude) s3mLayer.minVisibleAltitude = Number(s3mOption.minVisibleAltitude);
              if (s3mOption.maxVisibleAltitude) s3mLayer.maxVisibleAltitude = Number(s3mOption.maxVisibleAltitude);

              // 设置IDs显隐
              if (s3mOption.customPassIdOptions) {
                let customPassIdOptions = s3mOption.customPassIdOptions;
                let mode = customPassIdOptions.mode;
                let passIDs = customPassIdOptions.passIDs;
                if (mode && passIDs) {
                  if (mode == 'all') {
                    s3mLayer.setObjsVisible([], false);
                  } else if (mode == 'hidden') {
                    s3mLayer.setObjsVisible(passIDs, false);
                  } else if (mode == 'show') {
                    s3mLayer.setObjsVisible(passIDs, true);
                  }
                  s3mLayer.customPassIdOptions = customPassIdOptions;
                }
              }

              // 控制图层显隐
              if (s3mOption.visible === false) s3mLayer.visible = false; // 只有强制写了false才会隐藏

              // 设置图层lodRangeScale
              if (s3mOption.lodRangeScale) s3mLayer.lodRangeScale = Number(s3mOption.lodRangeScale);

              // 设置图层单/双面渲染
              s3mLayer._cullEnabled = s3mOption.cullEnabled == true ? true : false;
              s3mLayer.cullEnabled = s3mOption.cullEnabled == true ? true : false; // 这个属性有点奇怪，直接设置cullEnabled没效果，得_cullEnabled好像才行,但是效果还得用这个赋值
            }
          })
        }
      }
    }
    return promiseList;
  }

  // 打开影像 TODO:支持打开其他类型的影像
  openIMG(option) {
    if (!option || option.length === 0) return;
    const imgLayerOptions = option;
    imgLayerOptions.forEach(imgOption => {
      let imageryProvider = null;
      const type = imgOption.type;
      const imgLayerUrl = imgOption.url;

      // 判断是否为iPortal代理服务,需要跨域请求,必须携带Cooike
      if (imgLayerUrl && imgLayerUrl.includes("/portalproxy/")) {
        this.setTrustedServers(imgLayerUrl);
      }

      switch (type) {
        case "SuperMapImageryProvider":
          imageryProvider = new SuperMap3D.SuperMapImageryProvider({
            url: imgLayerUrl,
            maximumLevel: imgOption.maximumLevel ? Number(imgOption.maximumLevel) : undefined
          });
          break;
        case "CGCS2000MapServerImageryProvider":
          imageryProvider = new SuperMap3D.CGCS2000MapServerImageryProvider({
            url: imgLayerUrl
          });
          break;
        case "BingMapsImageryProvider":
          imageryProvider = new SuperMap3D.BingMapsImageryProvider({
            url: imgLayerUrl,
            key: this.bingMapkey || imgOption.key
          });
          break;
        case "TiandituImageryProvider":
          imageryProvider = new SuperMap3D.TiandituImageryProvider({
            url: imgLayerUrl,
            token: this.tiandituKey || imgOption.token
          });
          break;
        case "UrlTemplateImageryProvider":
          imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
            url: imgLayerUrl,
            subdomains: imgOption.subdomains
          });
          break;
        case "SingleTileImageryProvider":
          // 针对默认球皮底图，先确认当前场景添加过没有，避免再次添加
          if (imgLayerUrl && imgLayerUrl.includes("Assets/Textures/GlobalBkLayer.jpg")) {
            const result = this.viewer.imageryLayers._layers.filter((imgLayer) => {
              if (imgLayer._imageryProvider && imgLayer._imageryProvider.url) {
                return imgLayer._imageryProvider.url.includes("Assets/Textures/GlobalBkLayer.jpg");
              }
            })
            if (result && result.length == 0) {
              imageryProvider = new SuperMap3D.SingleTileImageryProvider({
                url: imgLayerUrl,
              });
            }
          } else { // 非默认球皮直接添加
            imageryProvider = new SuperMap3D.SingleTileImageryProvider({
              url: imgLayerUrl,
            });
          }
          break;
        case "TileCoordinatesImageryProvider":
          imageryProvider = new SuperMap3D.TileCoordinatesImageryProvider();
          break;
        default:
          break;
      }

      if (imageryProvider) {
        let imgLayer = this.viewer.imageryLayers.addImageryProvider(imageryProvider);
        if (imgOption.show === false) imgLayer.show = false; // 只有强制写了false才会隐藏
        if (imgOption.customName) imgLayer.customName = imgOption.customName;
        if (window.iEarthCustomFunc && window.iEarthCustomFunc.afterImageLayerAdd) {
          window.iEarthCustomFunc.afterImageLayerAdd(imgLayer);
        }

        // // 默认球皮影像图层还需要设置效果
        // if (imgLayerUrl && imgLayerUrl.includes("earth-skin2.jpg")) {
        //   imgLayer.brightness = 0.8; // > 1.0 增加亮度  < 1.0减少亮度
        //   imgLayer.contrast = 1.3; // 图层对比度 > 1 增加   < 1 减少
        // }
      }
    });
  }

  // 打开MVT
  openMVT(option) {
    if (!option || option.length === 0) return;
    const mvtLayerOptions = option;
    mvtLayerOptions.forEach(mvtOption => {
      if (!mvtOption.url) return;
      this.scene.addVectorTilesMap({
        url: mvtOption.url,
        canvasWidth: 512,
        name: mvtOption.name,
        viewer: this.viewer,
      });
    })
  }

  // 打开地形
  openTIN(option) {
    if (!option || !option.type) return;
    const tinOption = option;
    let type = tinOption.type;
    if (type == 'StkTerrain') type = "SuperMapTerrainProvider"; // 兼容老版本iEarth保存地形类型
    switch (type) {
      case "SuperMapTerrainProvider":
        const tinUrl = tinOption.url;
        const isSct = tinUrl.includes('info/data/path') ? false : true;  // STK地形，需要设置isSct为false
        this.viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
          url: tinUrl,
          isSct: isSct,
        });
        break;
      case "SCTTerrainProvider":
        this.viewer.terrainProvider = new SuperMap3D.SCTTerrainProvider({
          urls: tinOption.url,
        });
        break;
      default:
        break;
    }
  }

  // 打开场景属性
  openSceneAdjust(param) {
    param.GlobalAttr && this.openGlobalAttr(param.GlobalAttr);
    param.VisualEffect && this.openVisualEffect(param.VisualEffect);
    this.openSceneFeature(param.SceneFeature);
    this.openSpecialBuff(param.SpecialBuff);
  }
  // 场景属性：全局属性
  openGlobalAttr(option) {
    const keys = Object.keys(option);
    keys.forEach(key => {
      const value = option[key];
      switch (key) {
        case "earthShow":
          this.scene.globe.show = value;
          break;
        case "depthInspection":
          this.scene.globe.depthTestAgainstTerrain = value;
          break;
        case "atomsphereRender":
          this.scene.skyAtmosphere.show = value;
          break;
        case "fogEffect":
          this.scene.fog.enabled = value;
          break;
        case "timeAxis":
          const val = value;
          const timeline = document.getElementsByClassName(
            "supermap3d-viewer-timelineContainer"
          )[0];
          if (timeline && timeline.style) timeline.style.visibility = val ? "visible" : "hidden";
          break;
        case "displayFrame":
          this.scene.debugShowFramesPerSecond = value;
          break;
        case "hdrEnabled":
          this.scene.hdrEnabled = value;
          break;
        default:
          break;
      }
    })
  }
  // 场景属性：视觉效果
  openVisualEffect(options) {
    this.openBloomEffect(options.bloomEffect);
    this.openUnderGound(options.underGround);
    this.openMsaaLevel(options.msaaLevel);
    this.openSceneDepth(options.sceneDepth);
    this.openSceneColor(options.sceneColor);
    // this.openShadow(options.shadow); // 设置阴影也需要等S3M图层加载完成后再设置
    this.openLightSource(options.lightSource);
    this.openLightShaft(options.lightShaft);
  }
  // 场景属性：场景要素
  openSceneFeature(options) {
    this.openCloudLayer(options.cloudLayer);
    this.openSkyBox(options.skyBox);
    this.openVolumetricCloud(options.volumetricCloud);
    this.openHighAltitudeFog(options.highAltitudeFog);
  }
  // 场景属性：特殊加持
  openSpecialBuff(options) {
    if (!options) return;
    this.openEnvMap(options.envMap);
  }

  // 视觉效果:泛光
  openBloomEffect(option) {
    if (!option) return;
    if (option.isOpen) {
      this.scene.bloomEffect.show = true;
      this.scene.bloomEffect.threshold = option.threshold;
      this.scene.bloomEffect.bloomIntensity = option.bloomIntensity;
    } else {
      this.scene.bloomEffect.show = false;
    }
  }
  // 视觉效果：地下
  openUnderGound(option) {
    if (!option) return;
    if (option.isOpen) {
      this.scene.screenSpaceCameraController.minimumZoomDistance = -1000; //设置相机最小缩放距离,距离地表-1000米
      this.scene.globe.showSkirts = false; // 关闭裙边
      this.scene.undergroundMode = true;
      if (option.globeAlpha != undefined) this.scene.globe.globeAlpha = option.globeAlpha;
    } else {
      this.scene.screenSpaceCameraController.minimumZoomDistance = 1;
      this.scene.globe.showSkirts = true; // 开启裙边
      this.scene.globe.globeAlpha = 1;
    }
  }
  // 视觉效果：反走样
  openMsaaLevel(option) {
    if (!option) return;
    if (option.isOpen) {
      this.scene._msaaSamples = Number(option.msaaLevel)
    } else {
      this.scene._msaaSamples = 1;
    }
  }
  // 视觉效果：景深
  openSceneDepth(option) {
    if (!option) return;
    if (option.isOpen) {
      this.scene.depthOfFieldEffect.show = true;
      this.scene.depthOfFieldEffect.fStop = Number(option.fStop);
      this.scene.depthOfFieldEffect.focalDistance = Number(option.focalDistance);
      this.scene.depthOfFieldEffect.focalRange = Number(option.focalRange);
      this.scene.depthOfFieldEffect.blurRadius = Number(option.blurRadius);
    } else {
      this.scene.depthOfFieldEffect.show = false;
    }
  }
  // 视觉效果：场景颜色
  openSceneColor(option) {
    if (!option) return;
    if (option.isOpen) {
      this.scene.colorCorrection.show = true;
      this.scene.colorCorrection.brightness = option.brightness;
      this.scene.colorCorrection.contrast = option.contrast;
      this.scene.colorCorrection.hue = option.hue;
      this.scene.colorCorrection.saturation = option.saturation;
    } else {
      this.scene.colorCorrection.show = false;
    }
  }
  // 视觉效果：阴影
  openShadow(option) {
    if (!option) return;
    if (option.isOpen) {
      const layers = this.scene.layers.layerQueue;
      for (var i = 0; i < layers.length; i++) {
        // 设置图层的阴影模式（必须设置）
        layers[i].shadowType = 2;
      }

      this.viewer.shadows = true;
      // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
      this.viewer.pcss = true;
      this.viewer.shadowQuality = 0;
      //设置阴影的出现距离
      if (option.maximumDistance) this.scene.shadowMap.maximumDistance = option.maximumDistance;
      //设置阴影的浓度，值越高，阴影越淡
      if (option.darkness) this.viewer.shadowMap.darkness = option.darkness; // 从json里面读取的值就是其真实值，无需取反
      //默认值是0.1，值越小越清晰
      if (option.penumbraRatio) this.viewer.shadowMap.penumbraRatio = option.penumbraRatio;
    } else {
      this.viewer.shadows = false;
    }
  }
  // 视觉效果：光照（太阳光+环境光+自定义灯光）
  openLightSource(options) {
    if (!options) return;
    // this.scene.globe.enableLighting = options.enableLighting; // 使用enableLighting默认值，让太阳光始终作用于模型，避免影响球皮导致过亮
    this.openSunLight(options.sunLight);
    // this.openAmbientLight(options.ambientLight); // 不再设置环境光，环境光使用默认值
    this.openCustomLight(options.customLights);
    if (window.customConfig) { // 获取当前场景使用时的一些自定义参数
      window.customConfig.lightModelSize = Number(options.lightModelSize) || 5;
    }
  }
  openLightShaft(options){
    if (!options) return;
    if(this.viewer.scene.postProcessStages.lightShaft == undefined) return;
    this.viewer.scene.postProcessStages.lightShaft.enabled = options.isOpen;
    this.viewer.scene.postProcessStages.lightShaft.bloomScale = options.bloomScale;
    this.viewer.scene.postProcessStages.lightShaft.maxBrightness = options.maxBrightness;
  }
  // 视觉效果: 太阳光
  openSunLight(option) {
    if (!option) return;
    if (option.isOpen) {
      this.scene.lightSource.sunLightColor = option.sunLightColor;
    } else {
      this.scene.sun.show = false;
      this.scene.lightSource.sunLightColor = SuperMap3D.Color.multiplyByScalar(new SuperMap3D.Color(1, 1, 1, 1), 0, new SuperMap3D.Color);
    }
  }
  // 视觉效果: 自定义灯光
  openCustomLight(option) {
    if (!option || !(option instanceof Array)) return;
    option.forEach(node => {
      if (node.type == "pointLight") {
        const pointLight = new SuperMap3D.PointLight(node.position, node.option);
        this.scene.addLightSource(pointLight);
      } else if (node.type == "spotLight") {
        const positionList = node.position;
        const spotLight = new SuperMap3D.SpotLight(positionList[0], positionList[1], node.option);
        // spotLight.angle = SuperMap3D.Math.toRadians(Number(node.option.angle));存储的就是弧度制
        this.scene.addLightSource(spotLight);
      } else if (node.type == "directionLight") {
        const directionalLight = new SuperMap3D.DirectionalLight(node.position, node.option);
        this.scene.addLightSource(directionalLight);
      }
    });
  }

  // 场景要素：云层
  openCloudLayer(option) {
    if (!option) return;
    if (option.isOpen) {
      const cloudBoxUrl = option.imgUrl;
      if (cloudBoxUrl && cloudBoxUrl.includes('.png')) {
        const cloudBox = new SuperMap3D.CloudBox({ url: cloudBoxUrl });
        this.scene.cloudBox = cloudBox;
      } else {
        this.scene.cloudBox = null;
      }
    } else {
      this.scene.cloudBox = null;
    }
  }
  // 场景要素：天空盒
  openSkyBox(option) {
    if (!option || !option.imageUrl) return;
    if (!option.imageUrl.includes('.jpg')) return;
    const defaultSkyBox = this.scene.skyBox;
    if (option.isOpen) {
      const blueSkyBox = new SuperMap3D.SkyBox({ imageUrl: option.imageUrl });
      blueSkyBox.show = true;
      if (option.WSpeed != undefined) blueSkyBox.WSpeed = Number(option.WSpeed);
      if (option.horizontalRotationAngle != undefined) blueSkyBox.horizontalRotationAngle = option.horizontalRotationAngle; // 旋转速度和旋转角度一起使用会有问题，优先开启旋转角度
      this.scene.skyAtmosphere.show = false; // 关闭大气渲染
      this.scene.skyBox = blueSkyBox;
    } else {
      this.scene.skyBox = defaultSkyBox;
      this.scene.skyAtmosphere.show = true;
    }
  }
  // 场景要素：体积云
  openVolumetricCloud(option) {
    if (!option) return;
    if(this.viewer.scene.volumetricClouds == undefined) return;
    const volumetricClouds = this.viewer.scene.volumetricClouds;
    volumetricClouds.enabled = option.isOpen; // 是否开启体积云
    volumetricClouds.cirrusEnabled = option.cirrusEnabled; // 是否显示高层云
    volumetricClouds.quality = option.quality; // 渲染质量
    volumetricClouds.thickness = option.thickness; // 云层厚度
    volumetricClouds.densityMultiplier = option.densityMultiplier; // 云层密度
    volumetricClouds.lowestCloudAltitude = option.lowestCloudAltitude; // 云层底部高度
    volumetricClouds.shapeCoverage = option.shapeCoverage; // 云层覆盖度
    volumetricClouds.windSpeed = option.windSpeed; // 风速
    volumetricClouds.windHeading = option.windHeading; // 风向
  }
  // 场景要素：高度雾
  openHighAltitudeFog(option) {
    if (!option) return;
    if(this.viewer.scene.fog.advanced == undefined) return;
    const scene = this.viewer.scene;
    scene.fog.advanced = option.isOpen; // 是否开启高度雾
    scene.fog.density = option.density; // 雾气密度
    scene.fog.heightFalloff = option.heightFalloff; // 衰减系数
    scene.fog.color = option.color; // 雾气颜色
  }

  // 特殊加持：环境光贴图
  openEnvMap(option) {
    if (!option || !option.envMapUrl) return;
    if (option.isOpen) {
      // 解决重复导入JSON环境光切换失效问题：需要undefined然后延时设置
      this.scene.specularEnvironmentMaps = undefined;
      setTimeout(() => {
        this.scene.specularEnvironmentMaps = option.envMapUrl;
        this.scene.envMapIntensity = option.envMapIntensity;
      }, 1000)
    }
  }


  // 设置图层风格
  openLayerStyles(options) {
    if (!options) return;
    this.openS3MStyleList(options.s3mLayerStyles);
    // this.openImgStyleList(); to do...
    // this.openTINStyleList(); to do...
    // this.openMVTStyleList(); to do...
  }
  // 设置图层风格: S3M
  openS3MStyleList(options) {
    if (!options || !(options instanceof Array)) return;
    if (options.length === 0) return;

    const layerStyles = options;
    layerStyles.forEach(node => {
      const layerName = node.name;
      if (layerName) {
        const s3mLayer = this.scene.layers.find(layerName);
        if (s3mLayer && (s3mLayer instanceof SuperMap3D.S3MTilesLayer)) {
          this.openS3MlayerStyle(s3mLayer, node.style);
        }
      }
    })
  };

  // 设置指定S3M图层的风格
  openS3MlayerStyle(s3mLayer, style) {
    if (!style) return;
    if (!s3mLayer && !(s3mLayer instanceof SuperMap3D.S3MTilesLayer)) return;

    s3mLayer.isChangedStyle = true;

    const keys = Object.keys(style);
    keys.forEach(key => {
      let styleValue = style[key];
      // if (styleValue != undefined) {} // 排除掉undefined to do:看是在这里过滤，还是保存的时候剔除
      switch (key) {
        case "brightness":
          s3mLayer.brightness = styleValue;
          break;
        case "contrast":
          s3mLayer.contrast = styleValue;
          break;
        case "hue":
          s3mLayer.hue = styleValue;
          break;
        case "saturation":
          s3mLayer.saturation = styleValue;
          break;
        case "gamma":
          s3mLayer.gamma = styleValue;
          break;
        case "selectedColor":
          if (typeof styleValue == 'object') {
            s3mLayer.selectedColor = styleValue;
          } else {
            s3mLayer.selectedColor = SuperMap3D.Color.fromCssColorString(styleValue);
          }
          break;
        // case "selectColorType":
        //   s3mLayer.selectColorType = styleValue;
        //   break;
        // case "lodRangeScale": // S3M图层的LOD属性已保存在LayerOption中
        //   s3mLayer.lodRangeScale = styleValue;
        //   break;
        case "style3D":
          this.setLayerStyle3D(s3mLayer, styleValue);
          // s3mLayer.refresh(); // 会导致上海测绘院那边导入JSON时刷新两次
          break;
        case "waterParameter":
          this.setLayerWaterParameter(s3mLayer, styleValue);
          break;
        case "pbrJson":
          const jsonString = styleValue;
          if (!jsonString) return;
          let pbrObj = JSON.parse(jsonString);
          s3mLayer.setPBRMaterialFromJSON(pbrObj);
          s3mLayer.pbrJsonDataSave = jsonString; // 将pbr材质绑定在图层上
          break;
        default:
          break;
      }
    })
  }
  // 设置S3M的Style3D属性 
  setLayerStyle3D(s3mLayer, style3dOption) {
    if (!style3dOption) return;
    if (!s3mLayer && !(s3mLayer instanceof SuperMap3D.S3MTilesLayer)) return;

    const keys = Object.keys(style3dOption);
    keys.forEach(key => {
      const optionValue = style3dOption[key];
      switch (key) {
        case "fillStyle":
          s3mLayer.style3D.fillStyle = optionValue;
          break;
        case "lineColor":
          if (typeof optionValue == 'object') {
            s3mLayer.style3D.lineColor = optionValue;
          } else {
            s3mLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(optionValue);
          }
          break;
        case "fillForeColor":
          if (typeof optionValue == 'object') {
            s3mLayer.style3D.fillForeColor = optionValue;
          } else {
            s3mLayer.style3D.fillForeColor = SuperMap3D.Color.fromCssColorString(optionValue);
          }
          break;
        case "alpha":
          s3mLayer.style3D.fillForeColor.alpha = optionValue;
          break;
        case "lineWidth":
          s3mLayer.style3D.lineWidth = optionValue;
          break;
        case "bottomAltitude":
          s3mLayer.style3D.bottomAltitude = optionValue;
          break;
        default:
          break;
      }
    })
  }
  // 设置S3M图层的水面效果
  setLayerWaterParameter(s3mLayer, waterOption) {
    if (!waterOption) return;
    if (!s3mLayer && !(s3mLayer instanceof SuperMap3D.S3MTilesLayer)) return;

    const keys = Object.keys(waterOption);
    keys.forEach(key => {
      const optionValue = waterOption[key];
      switch (key) {
        case "waterbodySize":
          s3mLayer.waterParameter.waterbodySize = optionValue;
          break;
        case "waveStrength":
          s3mLayer.waterParameter.waveStrength = optionValue;
          break;
        case "color":
          // s3mLayer.waterParameter.color = optionValue; // color set 时做了 instanceOf Color的判读，所以不能直接赋值
          const color = optionValue;
          const waterColor = new SuperMap3D.Color(color.x, color.y, color.z, color.w);
          s3mLayer.waterParameter.color = waterColor;
          break;
        case "waveDirection":
          s3mLayer.waterParameter.waveDirection = optionValue;
          break;
        default:
          break;
      }
    })
  }

  // 添加粒子系统
  setParticle(particleOptions) {
    if (!particleOptions) return;
    if (window.iEarthBindData) {
      window.iEarthBindData['ParticleOptions'] = particleOptions;
    }

    if (particleOptions['fire'] != null) {
      let fireOption = particleOptions['fire'];
      this.addParticleFile(fireOption, 'fire');
    }
    if (particleOptions['water'] != null) {
      let waterOption = particleOptions['water'];
      this.addParticleFile(waterOption, 'water');
    }
    if (particleOptions['fireWork'] != null) {
      let fireWorkOption = particleOptions['fireWork'];
      this.addFireWork(fireWorkOption);
    }
  }
  // 添加场景中已保存的粒子
  addParticleFile(options, type) {
    let modelMatrix_fire = new SuperMap3D.Matrix4();
    SuperMap3D.Transforms.eastNorthUpToFixedFrame(options.particlePosition, undefined, modelMatrix_fire);
    this.loadParticleFile(options.particleUrl, modelMatrix_fire, type, options.particleAttr);
  }
  // 加载粒子文件
  loadParticleFile(url, modelMatrix, type, option) {
    let particle = {};
    let scene = this.scene;
    SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
      particle = particleSystem;
      particle.modelMatrix = modelMatrix;
      // 设置参数
      if (option) {
        for (let key in option) {
          switch (key) {
            case "emitRate":
              particle['emitRate'] = Number(option[key]);
              break;
            case "minLifeTime":
              particle['minLifeTime'] = Number(option[key]);
              break;
            case "maxLifeTime":
              particle['maxLifeTime'] = Number(option[key]);
              break;
            case "minEmitPower":
              particle['minEmitPower'] = Number(option[key]);
              break;
            case "maxEmitPower":
              particle['maxEmitPower'] = Number(option[key]);
              break;
            case "minSize":
              particle['minSize'] = Number(option[key]);
              break;
            case "maxSize":
              particle['maxSize'] = Number(option[key]);
              break;
            case "minScaleX":
              particle['minScaleX'] = Number(option[key]);
              break;
            case "minScaleY":
              particle['minScaleY'] = Number(option[key]);
              break;
            case "maxScaleX":
              particle['maxScaleX'] = Number(option[key]);
              break;
            case "maxScaleY":
              particle['maxScaleY'] = Number(option[key]);
              break;
            case "gravity":
              particle.gravity = new SuperMap3D.Cartesian3(0, 0, Number(option[key]));
              break;
            case "emitType":
              switch (option[key]) {
                case "Cone":
                  particle.createConeEmitter(1.0, 1.05);
                  break;
                case "Sphere":
                  particle.createSphereEmitter(1.0);
                  break;
                case "Box":
                  let direction1 = new SuperMap3D.Cartesian3(-1, 1, 1);
                  let direction2 = new SuperMap3D.Cartesian3(1, 1, -1);
                  let minBox = new SuperMap3D.Cartesian3(-10, 0, -10);
                  let maxBox = new SuperMap3D.Cartesian3(10, 0, 10);
                  particle.createBoxEmitter(direction1, direction2, minBox, maxBox);
                  break;
              }
              break;
            default:
              break;
          }
        }
      }

      if (window.iEarthBindData) {
        window.iEarthBindData['Particle'][type] = particle;
      }
    });
  }
  // 添加烟花
  addFireWork(fireWorkOption) {
    let modelMatrix = new SuperMap3D.Matrix4();
    let setIntervalList = [];
    let scene = this.scene;
    scene.skyAtmosphere = new SuperMap3D.SkyAtmosphere();
    scene.globe.show = false
    scene.skyAtmosphere.show = false; //关闭大气

    let sparkOneUrl = './Resource/particle/babylon/sparkGravityOne.json';
    let sparkTwoUrl = './Resource/particle/babylon/sparkGravityTwo.json';
    let sparkThreeUrl = './Resource/particle/babylon/sparkGravityThree.json';
    let sparkFourUrl = './Resource/particle/babylon/sparkGravityFour.json';

    let numberOfSparks = 8;
    let xMin = -2100.0;
    let xMax = 300.0;
    let yMin = 0.0;
    let yMax = 2000.0;
    let zMin = 150.0;
    let zMax = 550.0;
    // 创建烟花
    let sparkInterval = (xMax - xMin) / numberOfSparks;

    function createSpark() {
      for (let i = 0; i < numberOfSparks; ++i) {
        let x = SuperMap3D.Math.randomBetween(xMin + i * sparkInterval, xMin + (i + 1) * sparkInterval);
        let y = SuperMap3D.Math.randomBetween(yMin, yMax);
        let z = SuperMap3D.Math.randomBetween(zMin, zMax);
        let offset = new SuperMap3D.Cartesian3(x, y, z);
        let url = '';
        if (i % 4 === 0)
          url = sparkOneUrl;
        if (i % 4 === 1)
          url = sparkTwoUrl;
        if (i % 4 === 2)
          url = sparkThreeUrl;
        if (i % 4 === 3)
          url = sparkFourUrl;
        SuperMap3D.ParticleHelper.fromJsonUrl(url, scene).then(function (particleSystem) {
          settingParticleSys(particleSystem, offset, i);
        });
      }
    }

    // 设置当前粒子系统
    function settingParticleSys(particleSystem, offset, index) {

      // 添加多个
      particleSystem.modelMatrix = modelMatrix;
      particleSystem.worldOffset.x = offset.x;
      particleSystem.worldOffset.y = offset.y;
      particleSystem.worldOffset.z = offset.z;
      let setIntervalFlag = setInterval(() => {
        particleSystem.start();
      }, 2000 + index * 50);
      scene.primitives.add(particleSystem);
      setIntervalList.push(setIntervalFlag);

      if (window.iEarthBindData) {
        window.iEarthBindData['Particle']["fireWork"] = setIntervalList;
      }
    }

    function addSpark(centerPosition) {
      SuperMap3D.Transforms.eastNorthUpToFixedFrame(centerPosition, undefined, modelMatrix);
      createSpark();
    }

    addSpark(fireWorkOption.fireWorkPosition);
  }
}

window.OpenConfig = OpenConfig;