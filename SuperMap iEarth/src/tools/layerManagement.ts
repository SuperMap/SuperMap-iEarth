// 这一句必须加，和以前直接在main.ts中直接引入不同，因为有个模块加载和引用先后的问题，具体参考: https://blog.csdn.net/zlting_/article/details/127495583
import store from '../store';
import { useLayerStore } from '../store/layerStore/index';
import { storeToRefs } from 'pinia';

const layerStore = useLayerStore(store);
const { onlineBaseLayerList } = storeToRefs(layerStore);

// 检验url地址
function checkURL(url: string) {
  if (url === null || url === "") {
    return false;
  }
  if (url.charAt(0) == '"' || url.charAt(0) == "'") {
    let reg = /^['|"](.*)['|"]$/;
    url = url.replace(reg, "$1");
  }
  return true;
}

// 打开realSpace场景
function openScene(url: string, type: any, sceneName?: string) {
  if (checkURL(url)) {
    // 专门对CBD和变电站场景做设置
    // if (sceneName === 'global.BeijingCBD') {
    //   addCBD(url);
    // } 
    if (sceneName === 'global.transformerStation') {
      addBDZ(url);
    } else {
      let promiseArray = [
        window.viewer.scene.open(url, undefined, { autoSetView: true }),
      ];
      SuperMap3D.when.all(promiseArray, function (layers: any) {
        layerStore.updateLayer({ type: "s3m" });
      });
      return promiseArray[0];
    }
  }
}

// 添加MVT服务
function addMvtLayer(LayerURL: string, name: string, type: any) {
  // 返回img图层layer
  let mvtMap = window.viewer.scene.addVectorTilesMap({
    url: LayerURL,
    canvasWidth: 512,
    name: name || "mvt",
    viewer: window.viewer,
  });

  SuperMap3D.when(mvtMap.readyPromise, function (data: any) {
    layerStore.MVTLayerNameList.push(name); // 存入MVT图层名称，以便删除
    var bounds = mvtMap.rectangle;
    window.viewer.scene.camera.flyTo({
      destination: new SuperMap3D.Cartesian3.fromRadians(
        (bounds.east + bounds.west) * 0.5,
        (bounds.north + bounds.south) * 0.5,
        10000
      ),
      duration: 0,
      orientation: {
        heading: 0,
        roll: 0,
      },
    });
    layerStore.updateLayer({ type: "mvt" });

  });
  return mvtMap;
}

// 添加白膜
function addBaiMo(url: string, sceneName: string, type: any) {
  let name: string = sceneName;
  if (sceneName.indexOf('global') != -1) {
    let attr = sceneName.split('.')[1];
    name = GlobalLang[attr];
  }
  window.viewer.scene
    .addS3MTilesLayerByScp(url, {
      name: name,
    })
    .then((layer: any) => {
      if (layer.name === '重庆白模' || layer.name === 'Chongqing') {
        window.viewer.scene.camera.flyTo({
          destination: new SuperMap3D.Cartesian3(-1598174.3966915242, 5337632.74785581, 3107040.200761407),
          orientation: {
            heading: 0.009298990045627065,
            pitch: -0.4119163433938109,
            roll: 0.0000036814461790157793
          }
        });
      } else if (layer.name === '横滨白模' || layer.name === 'Yokohama') {
        window.viewer.scene.camera.flyTo({
          destination: new SuperMap3D.Cartesian3(-3970986.6586428955, 3373639.6081622997, 3666841.2351276176),
          orientation: {
            heading: 5.97633670854477,
            pitch: -0.08168840183891524,
            roll: 0.000003064219816550917
          }
        });
      } else {
        window.viewer.flyTo(layer);
      }

      layer.lodRangeScale = 5;
      layer.style3D.fillStyle = SuperMap3D.FillStyle.Fill_And_WireFrame;
      let initialColor = "rgb(67,67,67)";
      layer.style3D.lineColor =
        SuperMap3D.Color.fromCssColorString(initialColor);
      // layer.wireFrameMode = SuperMap3D.WireFrameType.Sketch; //草图模式,即线框
      // layer._visibleDistanceMax = 60000;
      layerStore.updateLayer({ type: "s3m" });
    });
}

// 根据输入的lauerUrl，自动匹配其图层名称
function getLayerNameFromUrl(url: any, type: string): any {

  switch (type) {
    case "S3M":
      {
        if (url.indexOf('/config') != -1) {
          let list = url.split('/datas/')
          if (list.length === 2) {
            let layerNameFromUrl = list[1].split('/')[0]
            return layerNameFromUrl;
          }
        }
      }
      break;
    case "Imagery":
      {
        let imageLayerName = url.split('/rest/realspace/datas/')[1];
        if(!imageLayerName){
          if (url.indexOf('http') != -1) {
            if(url.indexOf('/rest/maps/') != -1){
              let name = url.split('/rest/maps/')[1];
              if(name.indexOf('%') != -1){
                let str = decodeURIComponent(name);
                if(str.indexOf('@')){
                  let newName = str.split('@')[0];
                  return newName;
                }
              }else{
                return name;
              }
            }
            if (url.indexOf('%') != -1) {
              let newName = url.split('%')[0];
              return newName;
            }
            // 支持地图服务
            if(url.indexOf('/maps/') != -1) {
              let newName = url.split('/maps/')[1].replace('/', '');
              return newName;
            }
            return url;
          } else {
            return 'Unnamed';
          }
        }else{
          return imageLayerName;
        }
      }
      break;
    case "Terrain":
      {
        let terrainLayerName = url.split('/rest/realspace/datas/')[1];
        return terrainLayerName;
      }
      break;
    default:
      return '';
      break;
  }
}


// 传入影像图层，获取并返回他在项目中的名称
function getImageryLayerName(imageryLayer: any) {
  let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;

  if (!imageUrl) return '经纬底图';

  if (imageUrl.indexOf("earth-skin.jpg") != -1) {
    return '默认影像';
  }

  let targetItem = onlineBaseLayerList.value.find((item: any) => item.url === imageUrl)
  if (targetItem) {
    return targetItem.name;
  } else if (imageUrl) {
    //    let otherImageLayerName = imageUrl.split('realspace/services/')[1].split('/rest/realspace')[0]

    if (imageUrl.indexOf("realspace/datas/") != -1) {
      let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
      return otherImageLayerName;
    } else {
      return '未命名图层';
    }
  } else {
    return '未命名图层';
  }
}

// 获取地形图层名称
function getTerrainLayerName(): any {
  if (window.viewer.terrainProvider._baseUrl) {
    let baseUrl = window.viewer.terrainProvider._baseUrl
    if (baseUrl.indexOf('3D-stk_terrain') != -1) {
      return 'STK地形';
    } else {
      if (baseUrl.indexOf('supermapol.com') != -1) {
        return baseUrl.split('realspace/services/')[1].split('/rest/realspace')[0]
      } else {
        return '未命名地形';
      }
    }
  } else if (window.viewer.terrainProvider._urls) {
    let url0 = window.viewer.terrainProvider._urls[0]
    if (url0.indexOf('supermapol.com') != -1) {
      return 'SuperMapOnline 地形';
    } else {
      return '天地图地形'; // viewer.terrainProvider._urls[0].indexOf('tianditu') 看情况在加
    }
  } else {
    // return '标准椭球'
    return '无地形';
  }
}

// 等用到iportal统一放到util中管理
// //检查请求是否带cookie
// function setTrustedServers(url) {
//     if (window.store.isPortal) {
//         if (window.store.portalConfig) {
//             let serviceProxy = window.store.portalConfig.serviceProxy;
//             let withCredentials = isIportalProxyServiceUrl(url, serviceProxy);
//             if (withCredentials) {
//                 let ip = getHostName(url);
//                 if (
//                     !Cesium.TrustedServers.contains(
//                         "http://" + ip + "/" + serviceProxy.port
//                     )
//                 ) {
//                     Cesium.TrustedServers.add(ip, serviceProxy.port);
//                 }
//             }
//         }
//     }
// }


// 专门添加CBD场景
function addCBD(url: string) {
  // 新版CBD属性
  const scene = viewer.scene;
  scene.camera.frustum.fov = 1.57;
  //帧率显示
  // scene.debugShowFramesPerSecond = true;
  var canvas = scene.canvas;
  var widget = viewer.cesiumWidget;
  scene.fog.enabled = false;
  scene.globe.depthTestAgainstTerrain = false;
  scene.context.shaderPreprocess = true;
  viewer.resolutionScale = window.devicePixelRatio; // 设置渲染分辨率的缩放因子

  scene.fog.enabled = false;
  scene.globe.depthTestAgainstTerrain = false;
  scene.context.shaderPreprocess = true;
  viewer.resolutionScale = window.devicePixelRatio;

  //设置阴影的出现距离
  scene.shadowMap.maximumDistance = 2000;
  // SuperMap3D.S3MTaskManager.useMultiWebWorker = false;
  //设置为false之后，直接绘制到颜色缓冲区，效果更好，但有些分析功能不能用，操作场景拾取不准确，建议只在录制视频的时候使用
  // scene.enableCompositor = false;

  //设置阴影的浓度，值越高，阴影越淡
  viewer.shadowMap.darkness = 0.4;
  //默认值是0.1，值越小越清晰
  viewer.shadowMap.penumbraRatio = 0.1;

  // scene.logarithmicDepthBuffer = false; 


  //设置太阳光的颜色与强度
  // scene.lightSource.sunLightColor = new SuperMap3D.Color(0.996*2, 0.85*2, 0.675*2,  1);
  // scene.lightSource.sunLightColor = new SuperMap3D.Color(255/255*1.0, 224/255*1.0, 179/255*1.0,  1);
  scene.lightSource.sunLightColor = new SuperMap3D.Color(1 * 1, 1 * 1, 1 * 1, 1);

  //添加全球影像
  // viewer.imageryLayers.addImageryProvider(new SuperMap3D.BingMapsImageryProvider({
  //     key: URL_CONFIG.BING_MAP_KEY,//可至官网（https://www.bingmapsportal.com/）申请key
  //     url: URL_CONFIG.BINGMAP
  // }));

  var L00 = new SuperMap3D.Cartesian3(0.255985647439957, 0.324294656515121, 0.448104858398438);
  var L1_1 = new SuperMap3D.Cartesian3(0.052135497331619, 0.127489775419235, 0.259717047214508);
  var L10 = new SuperMap3D.Cartesian3(-0.043244555592537, -0.037950038909912, -0.036239303648472);
  var L11 = new SuperMap3D.Cartesian3(0.014937655068934, -0.003836219897494, -0.021041290834546);
  var L2_2 = new SuperMap3D.Cartesian3(0.037908826023340, 0.013326642103493, -0.008756417781115);
  var L2_1 = new SuperMap3D.Cartesian3(-0.040351137518883, -0.020264262333512, -0.004807807970792);
  var L20 = new SuperMap3D.Cartesian3(0.004116172902286, 0.001403471920639, -0.004473014734685);
  var L21 = new SuperMap3D.Cartesian3(-0.039947938174009, -0.028241466730833, -0.011872956529260);
  var L22 = new SuperMap3D.Cartesian3(0.042825646698475, 0.035332202911377, 0.014503183774650);
  scene.specularEnvironmentMaps = "./Resource/CBD/HongKong_sphere_original_1k.ktx2";

  var coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
  scene.sphericalHarmonicCoefficients = coefficients;


  // 测试光照：
  //凌晨
  // viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(new Date(2023,3,5,0));
  viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(new Date(2023, 3, 5, 10));
  // scene.lightSource.ambientLightColor = new SuperMap3D.Color(0.0, 0.0, 0.0, 1);
  scene.sun.show = true;
  scene.envMapIntensity = 1.0;

  // viewer.scene.globe.enableLighting = true;

  // 整个场景的后处理
  var correction = scene.colorCorrection;//创建颜色校正对象
  correction.show = true;//开启颜色校正
  correction.brightness = 1.0;
  correction.contrast = 1.3;
  correction.saturation = 1.0;
  correction.hue = 0.0;


  // 添加光源
  //光源位置--公园中心点
  var position1 = new SuperMap3D.Cartesian3.fromDegrees(116.459972821387, 39.9098456272661, 200);
  //光源方向点--打向西北方向，模拟日出之后的朝阳的效果
  // var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.455768896303    ,  39.9120854569244    , 100);
  //光源方向点--打向西偏北方向，模拟日出之后1h的效果
  // var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.455703152747     ,  39.9111393953965     , 100);
  //光源方向点--打向西偏北方向，模拟日出之后2h的效果
  // var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.455700406131, 39.9115056668316, 100);
  //光源方向点--打向东偏南方向，补光
  var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.461118031787, 39.9083142302968, 20);
  var dirLightOptions = {
    targetPosition: targetPosition1,
    // color: new SuperMap3D.Color(2.0, 1.46, 0.98, 1),
    // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
    // color: new SuperMap3D.Color(255/255, 224/255, 179/255, 1),
    // color: new SuperMap3D.Color(133/255, 149/255, 177/255, 1),
    color: new SuperMap3D.Color(1, 1, 1, 1),
    intensity: 3.0
  };
  //光源方向点--打向西偏北方向，模拟日出之后4h的效果
  var targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(116.455700406131, 39.9115056668316, 20);
  var dirLightOptions1 = {
    targetPosition: targetPosition2,
    // color: new SuperMap3D.Color(2.0, 1.46, 0.98, 1),
    // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
    // color: new SuperMap3D.Color(255/255, 214/255, 153/255, 1),
    color: new SuperMap3D.Color(255 / 255, 229 / 255, 191 / 255, 1),
    // color: new SuperMap3D.Color(255/255, 234/255, 204/255, 1),
    // color: new SuperMap3D.Color(1, 1, 1, 1),
    intensity: 5.0
  };
  let directionalLight_1 = new SuperMap3D.DirectionalLight(position1, dirLightOptions);
  scene.addLightSource(directionalLight_1);
  let directionalLight_2 = new SuperMap3D.DirectionalLight(position1, dirLightOptions1);
  scene.addLightSource(directionalLight_2);


  //点光源
  var pointLightPoshuatan1 = new SuperMap3D.Cartesian3.fromDegrees(116.454972817356, 39.9120224613012, 80.0);

  var pointLightOptionshuatan1 = {
    cutoffDistance: 900.0,
    color: new SuperMap3D.Color(1.0, 1.0, 1.0, 1.0),
    intensity: 10.6
  };
  let pointLighthuatan1 = new SuperMap3D.PointLight(pointLightPoshuatan1, pointLightOptionshuatan1);
  // scene.addLightSource(pointLighthuatan1);

  // 新增聚光灯
  var spotLightPosludeng4_1 = new SuperMap3D.Cartesian3.fromDegrees(116.454972817356, 39.9120224613012, 80);
  var spotLightTargetPosludeng4_1 = new SuperMap3D.Cartesian3.fromDegrees(116.454972817356, 39.9120224613012, 0);

  var spotLightOtionsludeng4_1 = {
    color: new SuperMap3D.Color(10.0, 1.0, 1.0, 1),
    distance: 100,
    decay: 3,
    intensity: 12,
    angle: Math.PI / 2
  };
  let spotLightludeng4_1 = new SuperMap3D.SpotLight(spotLightPosludeng4_1, spotLightTargetPosludeng4_1, spotLightOtionsludeng4_1);
  // scene.addLightSource(spotLightludeng4_1);



  // const scene = viewer.scene;
  // const widget = viewer.cesiumWidget;
  try {

    //测试场景
    // var promise = scene.open("http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace");
    //测试场景
    // var promise = scene.open("http://localhost:8090/iserver/services/3D-XiaoGuoDuiBi0207/rest/realspace");
    //椭球场景E:\DEMO1205\Data3椭球
    // var promise = scene.open("http://localhost:8090/iserver/services/3D-TuoQiuChangJing0220/rest/realspace");

    // 椭球场景E:\DEMO1205\Data4椭球-重切片-整体场景
    // var promise = scene.open("http://localhost:8090/iserver/services/3D-CBD2-4/rest/realspace");
    // var promise = scene.open("http://localhost:8090/iserver/services/3D-CBDChangJing2/rest/realspace");
    // var promise = scene.open("http://172.16.12.68:8090/iserver/services/3D-CBDChangJing2/rest/realspace");
    var promise = scene.open(url);
    // var promise = scene.open("http://localhost:8090/iserver/services/3D-0315ZhongQiePianWanZhengChangJing/rest/realspace");
    // var promise = scene.open("http://10.10.7.245:8090/iserver/services/3D-0315ZhongQiePianWanZhengChangJing/rest/realspace");



    SuperMap3D.when(promise, function (layers) {
      if (!scene.pickPositionSupported) {
        alert('不支持深度拾取,属性查询功能无法使用！');
      }
      //设置建筑的外部金属框架的可见距离，解决摩尔纹的问题
      // var layer1 = scene.layers.find('Buildlding_v2_detail');
      // layer1.visibleDistanceMax = 100;
      //设置
      var layer1 = scene.layers.find('Ground_smallRe');
      layer1.lodRangeScale = 0.1;


      for (var layer of layers) {
        layer.cullMode = SuperMap3D.WindingOrder.COUNTER_CLOCKWISE;
        // layer.envMapIntensity = 1.2;
        // layer.envMapIntensity = 0.0;
        // layer_envMapIntensity = 0.0;
        //开启阴影
        layer.shadowType = 2;

        // layer.lodRangeScale = 0.1;

        // 根节点驻留与不立即释放
        layer.residentRootTile = true;
        layer.clearMemoryImmediately = false;


      }

      // 针对单个图层的处理：
      var layer1 = scene.layers.find("RoadRe");
      //色相，默认是0，值域-1-1
      layer1.hue = 0;
      //亮度，默认0
      layer1.brightness = 0.95;
      // 对比度，默认1
      layer1.contrast = 1.5;
      // 饱和度，默认1
      layer1.saturation = 1;
      // gamma
      layer1.gamma = 1;

      var layer2 = scene.layers.find("Ground_smallRe");
      //色相，默认是0，值域-1-1
      layer2.hue = 0.0;
      //亮度，默认0
      layer2.brightness = 1.0;
      // 对比度，默认1
      layer2.contrast = 1.5;
      // 饱和度，默认1
      layer2.saturation = 0.5;
      // gamma
      layer2.gamma = 1;

      // var layer3 = scene.layers.find("Building_v1Re");
      // //色相，默认是0，值域-1-1
      // layer3.hue =0;
      // //亮度，默认0
      // layer3.brightness= 0.85;
      // // 对比度，默认1
      // layer3.contrast = 1.3;
      // // 饱和度，默认1
      // layer3.saturation = 0.5;
      // // gamma
      // layer3.gamma = 1;

      var layer4 = scene.layers.find("Building_v2_mainRe");
      //色相，默认是0，值域-1-1
      layer4.hue = -0.0;
      //亮度，默认0
      layer4.brightness = 1.0;
      // 对比度，默认1
      layer4.contrast = 1.0;
      // 饱和度，默认1
      layer4.saturation = 1.0;
      // gamma
      layer4.gamma = 1;

      // 找到水面的图层：
      var layer5 = scene.layers.find("Waters@CBD");
      //设置水面的颜色
      // layer5.waterColor = new SuperMap3D.Color(0/255,66/255,61/255,1);
      layer5.waterColor = new SuperMap3D.Color(0 / 255, 53 / 255, 43 / 255, 1);
      // 设置水面的波动速度
      layer5.waterSpeed = new SuperMap3D.Cartesian2(0.3, 0.3);
      //设置水面的波动幅度
      layer5.waterWaveScale = 1;

      var layer6 = scene.layers.find("Building_NoCBD_5huan_WebGL");
      //色相，默认是0，值域-1-1
      layer6.hue = -0.0;
      //亮度，默认0
      layer6.brightness = 0.8;
      // 对比度，默认1
      layer6.contrast = 1.2;
      // 饱和度，默认1
      layer6.saturation = 1.0;
      // gamma
      layer6.gamma = 1;


      // setTimeout(() => {
      //     //添加树木
      //     $.getJSON("./CBD/(32)小区.json", function (data) {
      //         console.log('datahh：', data);
      //         growTreeByJSON(data)
      //     }).fail(function () {
      //         console.log("An erro.");
      //     });

      //     $.getJSON("./CBD/(36)道路_Del.json", function (data) {
      //         console.log('datahh：', data);
      //         growTreeByJSON(data)
      //     }).fail(function () {
      //         console.log("An erro.");
      //     });
      // }, 1000)

    }, function (e) {
      if (widget._showRenderLoopErrors) {
        var title = '渲染时发生错误，已停止渲染。';
        widget.showErrorPanel(title, undefined, e);
      }
    });
  }
  catch (e) {
    if (widget._showRenderLoopErrors) {
      var title = '渲染时发生错误，已停止渲染。';
      widget.showErrorPanel(title, undefined, e);
    }
  }
}

// // 专门添加变电站场景 - 老版 old 加的很慢
// function addBDZ(url: string) {
//   // scene.camera.frustum.fov = 1.57;
//   // scene.camera.frustum.near = 0.01;
//   const scene = viewer.scene;
//   viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(new Date(2023, 4, 15, 10)); // 设定比当前时间更好的光照效果
//   //帧率显示
//   // scene.debugShowFramesPerSecond = true;
//   // viewer.scene.hdrEnabled = true;
//   var camera = scene.camera;

//   //设置阴影的出现距离
//   scene.shadowMap.maximumDistance = 200;

//   //设置阴影的浓度，值越高，阴影越淡
//   viewer.shadowMap.darkness = 0.3;
//   //默认值是0.1，值越小越清晰
//   viewer.shadowMap.penumbraRatio = 0.2;

//   // scene.logarithmicDepthBuffer = false;

//   //设置太阳光的颜色与强度
//   scene.lightSource.sunLightColor = new SuperMap3D.Color(1 * 3, 1 * 3, 1 * 3, 1);
//   // scene.lightSource.sunLightColor = new SuperMap3D.Color(0.996 * 2, 0.85 * 2, 0.675 * 2, 1);
//   scene.sun.show = true;

//   var L00 = new SuperMap3D.Cartesian3(0.492085933685303, 0.492085874080658, 0.492085933685303);
//   var L1_1 = new SuperMap3D.Cartesian3(0.078874699771404, 0.078874610364437, 0.078874692320824);
//   var L10 = new SuperMap3D.Cartesian3(0.078090153634548, 0.078090116381645, 0.078090183436871);
//   var L11 = new SuperMap3D.Cartesian3(0.025034775957465, 0.025034755468369, 0.025034774094820);
//   var L2_2 = new SuperMap3D.Cartesian3(0.031029928475618, 0.031029941514134, 0.031029921025038);
//   var L2_1 = new SuperMap3D.Cartesian3(0.035155173391104, 0.035155214369297, 0.035155173391104);
//   var L20 = new SuperMap3D.Cartesian3(-0.005440676584840, -0.005440662149340, -0.005440671462566);
//   var L21 = new SuperMap3D.Cartesian3(0.008016115985811, 0.008016133680940, 0.008016110397875);
//   var L22 = new SuperMap3D.Cartesian3(-0.071910448372364, -0.071910388767719, -0.071910433471203);
//   scene.specularEnvironmentMaps = "./Resource/BDZ/Studio_set2_02_KFJR.ktx2";

//   var coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
//   scene.sphericalHarmonicCoefficients = coefficients;

//   // 整个场景的后处理
//   var correction = scene.colorCorrection;//创建颜色校正对象
//   correction.show = true;//开启颜色校正
//   correction.brightness = 1.0;
//   correction.contrast = 1.15;
//   correction.saturation = 1.0;
//   correction.hue = 0.0;

//   //来自西北平行光
//   var position1 = new SuperMap3D.Cartesian3.fromDegrees(115.998460430547, 40.0005740797481, 3);
//   var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(115.999464851774, 39.999780713494, 3);
//   var dirLightOptions1 = {
//     targetPosition: targetPosition1,
//     // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
//     //color: new SuperMap3D.Color(1.0, 0.84, 0.57, 1),
//     // color: new SuperMap3D.Color(230/255, 243/255, 255/255, 1),
//     // color: new SuperMap3D.Color(255/255, 247/255, 255/255, 1),
//     color: new SuperMap3D.Color(255 / 255, 237 / 255, 217 / 255, 1),
//     intensity: 0
//   };
//   //来自东北平行光
//   var position2 = new SuperMap3D.Cartesian3.fromDegrees(116.000333104312, 40.0005771848742, 3);
//   var targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(115.999464851774, 39.999780713494, 3);
//   var dirLightOptions2 = {
//     targetPosition: targetPosition2,
//     // color: new SuperMap3D.Color(0.996, 0.85, 0.675, 1),
//     //color: new SuperMap3D.Color(1.0, 0.84, 0.57, 1),
//     // color: new SuperMap3D.Color(230/255, 243/255, 255/255, 1),
//     // color: new SuperMap3D.Color(255/255, 247/255, 255/255, 1),
//     // color: new SuperMap3D.Color(255/255, 237/255, 217/255, 1),
//     intensity: 0
//   };

//   let directionalLight_1 = new SuperMap3D.DirectionalLight(position1, dirLightOptions1);
//   scene.addLightSource(directionalLight_1);
//   let directionalLight_2 = new SuperMap3D.DirectionalLight(position2, dirLightOptions2);
//   scene.addLightSource(directionalLight_2);

//   scene.envMapIntensity = 0.55;

//   //测试场景
//   // var promise = scene.open("http://10.10.7.245:8090/iserver/services/3D-0315ZhongQiePianWanZhengChangJing/rest/realspace");
//   // var promise = scene.open("http://localhost:8090/iserver/services/3D-BianDianZhan3/rest/realspace");
//   var promise = scene.open(url);
//   // var promise = scene.open("http://localhost:8090/iserver/services/3D-0423ZhongQiePian-2/rest/realspace");
//   promise.then(function (layers) {
//     for (var layer of layers) {
//       // layer.cullMode = SuperMap3D.WindingOrder.COUNTER_CLOCKWISE;
//       //开启阴影
//       layer.shadowType = 2;

//       layer.residentRootTile = true;
//       layer.clearMemoryImmediately = false;
//     }

//     // // 新的种树
//     // var instanceLayer = new SuperMap3D.InstanceLayer(scene._context);
//     // scene.primitives.add(instanceLayer);

//     // //默认1000，设置大了，拉远可见，设置小了，拉近才能看到
//     // // instanceLayer.tileWidth = 100;

//     // //分到不同的地形块里面，
//     // instanceLayer.tileWidth = 50;
//     // //默认是2，范围是0-5，理解成lodscale
//     // instanceLayer.maxSSE = 1.5;

//     // // 根据传入的数据来种树
//     // function growTreeByJSON(treeDataChild) {

//     //     treeDataChild.forEach(child => {
//     //         if (child.name === '单个添加') {// 遍历点
//     //             child.child.forEach(pointItem => {
//     //                 if (pointItem.options.position) {
//     //                     instanceLayer.add(pointItem.url, pointItem.options)
//     //                 }
//     //             });
//     //         } else if (child.name === '沿线添加') {// 遍历线进行添加
//     //             child.child.forEach(polylineCollection => {
//     //                 if (polylineCollection.child.length > 0) {
//     //                     polylineCollection.child.forEach(polylineItem => {
//     //                         instanceLayer.add(polylineItem.url, polylineItem.options)
//     //                     })
//     //                 }
//     //             });
//     //         } else if (child.name === '区域添加') {// 遍历面进行添加
//     //             child.child.forEach(polygonCollection => {
//     //                 if (polygonCollection.child.length > 0) {
//     //                     polygonCollection.child.forEach(polygonItem => {
//     //                         instanceLayer.add(polygonItem.url, polygonItem.options)
//     //                     })
//     //                 }
//     //             });
//     //         }
//     //     })

//     // }

//     // //添加树木
//     // $.getJSON("./CBD/tree (5).json", function (data) {
//     //     console.log('datahh：', data);
//     //     growTreeByJSON(data[0].child)
//     // }).fail(function () {
//     //     console.log("An erro.");
//     // });



//     // var routes = new SuperMap3D.RouteCollection(viewer.entities);
//     // //添加fpf飞行文件，fpf由SuperMap iDesktop生成
//     // var fpfUrl = './SampleData/fpf/Substation002.fpf';
//     // routes.fromFile(fpfUrl);
//     // //初始化飞行管理
//     // var flyManager = new SuperMap3D.FlyManager({
//     //     scene: scene,
//     //     routes: routes
//     // });
//     // //注册站点到达事件
//     // flyManager.stopArrived.addEventListener(function (routeStop) {
//     //     routeStop.waitTime = 1; // 在每个站点处停留1s
//     // });

//     // flyManager.readyPromise.then(function () { // 飞行路线就绪
//     //     var currentRoute = flyManager.currentRoute;
//     //     currentRoute.isLineVisible = false;
//     //     currentRoute.isStopVisible = false;
//     //     //生成飞行文件中的所有站点列表
//     //     var allStops = flyManager.getAllRouteStops();
//     //     var menu = document.getElementById('stopList');
//     //     for (var i = 0, j = allStops.length; i < j; i++) {
//     //         var option = document.createElement('option');
//     //         option.innerHTML = "站点 " + (i + 1);
//     //         option.value = allStops[i].index;
//     //         menu.appendChild(option);
//     //     }

//     //     $('#stopList').change(function () { //注册站点切换事件
//     //         flyManager && flyManager.stop();
//     //         var index = parseInt($(this).val()); // 站点的索引
//     //         var route = flyManager.currentRoute;
//     //         var stop = route.get(index);
//     //         flyManager.currentStopIndex = index;
//     //         flyManager.viewToStop(stop);
//     //     });

//     //     $('#play').click(function () {
//     //         flyManager && flyManager.play();
//     //     });
//     //     $('#pause').click(function () {
//     //         flyManager && flyManager.pause();
//     //     });
//     //     $('#stop').click(function () {
//     //         flyManager && flyManager.stop();
//     //     });

//     //     $('#show-line').change(function () {
//     //         currentRoute.isLineVisible = $(this).prop('checked');
//     //     });

//     //     $('#show-stop').change(function () {
//     //         currentRoute.isStopVisible = $(this).prop('checked');
//     //     });

//     //     $('#toolbar').show();
//     //     $('#loadingbar').remove();
//     // });
//   });
// }

// 专门添加变电站场景 - 新版，加载场景较快


function addBDZ(url: string) {
  // 设定比当前时间更好的光照效果
  viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(
    new Date(2023, 4, 15, 11)
  )

  const scene = viewer.scene;
  //设置太阳光的颜色与强度
  scene.lightSource.sunLightColor = new SuperMap3D.Color(
    1 * 2,
    1 * 2,
    1 * 2,
    1
  );
  scene.sun.show = true

  // 整个场景的后处理
  var correction = scene.colorCorrection; //创建颜色校正对象
  correction.show = true //开启颜色校正
  correction.brightness = 1.0
  correction.contrast = 1.15
  correction.saturation = 1.0
  correction.hue = 0.0

  //来自西北平行光
  var position1 = new SuperMap3D.Cartesian3.fromDegrees(
    115.998460430547,
    40.0005740797481,
    3
  );
  var targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(
    115.999464851774,
    39.999780713494,
    3
  );
  var dirLightOptions1 = {
    targetPosition: targetPosition1,
    color: new SuperMap3D.Color(255 / 255, 237 / 255, 217 / 255, 1),
    intensity: 0,
  };
  //来自东北平行光
  var position2 = new SuperMap3D.Cartesian3.fromDegrees(
    116.000333104312,
    40.0005771848742,
    3
  );
  var targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(
    115.999464851774,
    39.999780713494,
    3
  );
  var dirLightOptions2 = {
    targetPosition: targetPosition2,
    intensity: 0,
  };

  let directionalLight_1 = new SuperMap3D.DirectionalLight(
    position1,
    dirLightOptions1
  )
  scene.addLightSource(directionalLight_1)
  let directionalLight_2 = new SuperMap3D.DirectionalLight(
    position2,
    dirLightOptions2
  )
  scene.addLightSource(directionalLight_2)

  scene.envMapIntensity = 1.0;

  //测试场景
  var promise = scene.open(
    'http://www.supermapol.com/realspace/services/3D-0725RVM/rest/realspace'
  )
  promise.then(function (layers) {
    for (var layer of layers) {
      //开启阴影
      layer.shadowType = 2
      layer.residentRootTile = true
      layer.clearMemoryImmediately = false
      //开启线框
      // layer.style3D.fillStyle = SuperMap3D.FillStyle.Fill_And_WireFrame;
      // layer.wireFrameMode = SuperMap3D.WireFrameType.EffectOutline;
      // layer.style3D.lineColor = new SuperMap3D.Color(0 / 255, 0 / 255, 0 / 255, 1);
      // layer.style3D.lineWidth  = 0.3;
    }


    // 针对单个图层的处理：
    var layer1 = scene.layers.find("PI_UV");
    //色相，默认是0，值域-1-1        
    layer1.hue = 0;
    //亮度，默认0
    layer1.brightness = 1.0;
    // 对比度，默认1
    layer1.contrast = 1.0;
    // 饱和度，默认1
    layer1.saturation = 1.3;
    // gamma
    layer1.gamma = 1;
  })

  function loadShadow(shadowChecked) {
    if (shadowChecked) {
      viewer.shadows = true;
      //  UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
      viewer.pcss = true,
        viewer.shadowQuality = 2,
        //设置阴影的出现距离
        scene.shadowMap.maximumDistance = 100;
      //设置阴影的浓度，值越高，阴影越淡
      viewer.shadowMap.darkness = 0.3;
      //默认值是0.1，值越小越清晰
      viewer.shadowMap.penumbraRatio = 0.7;
    } else {
      viewer.shadows = false;
    }
  }

  // loadShadow(true);

  function loadLight(lightChecked) {
    if (lightChecked) {
      //环境光贴图ktx压缩测试--原始工具生成的
      var L00 = new SuperMap3D.Cartesian3(0.170253232121468, 0.186530470848083, 0.250162333250046);
      var L1_1 = new SuperMap3D.Cartesian3(-0.019948856905103, 0.036114457994699, 0.121223092079163);
      var L10 = new SuperMap3D.Cartesian3(0.021870676428080, 0.031954143196344, 0.039059657603502);
      var L11 = new SuperMap3D.Cartesian3(-0.016260044649243, -0.026163732632995, -0.032524436712265);
      var L2_2 = new SuperMap3D.Cartesian3(-0.026016067713499, -0.025068568065763, -0.024604434147477);
      var L2_1 = new SuperMap3D.Cartesian3(0.029782924801111, 0.029722381383181, 0.029306791722775);
      var L20 = new SuperMap3D.Cartesian3(0.007061737123877, 0.008292092941701, 0.010273135267198);
      var L21 = new SuperMap3D.Cartesian3(-0.025165025144815, -0.026656696572900, -0.027361012995243);
      var L22 = new SuperMap3D.Cartesian3(0.013707554899156, 0.018742486834526, 0.026223894208670);
      scene.specularEnvironmentMaps = './Resource/BDZ/drakensberg_solitary_mountain_1k_2_S-20.hdr';

      var coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
      scene.sphericalHarmonicCoefficients = coefficients;
    } else {
      scene.sphericalHarmonicCoefficients = undefined;
      scene.specularEnvironmentMaps = undefined;
    }
  }

  loadLight(true);
}

// 天空盒
let bluesky = {
  positiveX: './images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.right.jpg',
  negativeX: './images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.left.jpg',
  positiveY: './images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.front.jpg',
  negativeY: './images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.back.jpg',
  positiveZ: './images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.top.jpg',
  negativeZ: './images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.bottom.jpg'
};

let skybox = new SuperMap3D.SkyBox({ sources: bluesky });
skybox.USpeed = 0;  //获取或者设置天空盒子绕x轴运动的动画速度。设置为1时表示0.01弧度每秒
skybox.VSpeed = 0;  //获取或者设置天空盒子绕y轴运动的动画速度。
skybox.WSpeed = 0;  //获取或者设置天空盒子绕z轴运动的动画速度。

function setSkyBox(skyBoxShow: boolean) {
  let defaultSkybox = viewer.scene.skyBox;

  if (skyBoxShow) {
    let cameraHeight = viewer.scene.camera.positionCartographic.height;
    viewer.scene.postRender.addEventListener(watchCameraHeight);
    viewer.scene.skyBox = skybox;
    if (cameraHeight < 22e4) {
      viewer.scene.skyBox.show = true;
      viewer.scene.skyAtmosphere.show = false;
    } else {
      viewer.scene.skyAtmosphere.show = true;
    }
  } else {
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.skyBox.show = false;
    viewer.scene.skyBox = defaultSkybox;
    viewer.scene.postRender.removeEventListener(watchCameraHeight);
  }
}

// 监听相机高度，一旦高于设定阈值，关闭天空盒显示大气层
function watchCameraHeight(skyBoxShow: boolean) {
  if (skyBoxShow) {
    let cameraHeight = viewer.scene.camera.positionCartographic.height;
    if (cameraHeight > 22e4) {
      viewer.scene.skyBox.show = false;
      viewer.scene.skyAtmosphere.show = true;
    } else {
      viewer.scene.skyBox.show = true;
      viewer.scene.skyAtmosphere.show = false;
    }
  }
}

export default {
  openScene,
  addMvtLayer,
  addBaiMo,
  getLayerNameFromUrl,
  getImageryLayerName,
  getTerrainLayerName,
  setSkyBox
}

