// 这一句必须加，和以前直接在main.ts中直接引入不同，因为有个模块加载和引用先后的问题，具体参考: https://blog.csdn.net/zlting_/article/details/127495583
import store from '../store';
import { useLayerStore } from '../store/layerStore/layer';

const layerStore = useLayerStore(store);

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
    if (sceneName === 'BeijingCBD') {
      addCBD(url);
    }
    if (sceneName === 'transformerStation') {
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
    let bounds = mvtMap.rectangle;
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
    name = $t(attr);
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
      // layer._visibleDistanceMax = 60000; // 设置图层最大可见距离
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
        if (!imageLayerName) {
          if (url.indexOf('http') != -1) {
            if (url.indexOf('/rest/maps/') != -1) {
              let name = url.split('/rest/maps/')[1];
              if (name.indexOf('%') != -1) {
                let str = decodeURIComponent(name);
                if (str.indexOf('@')) {
                  let newName = str.split('@')[0];
                  return newName;
                }
              } else {
                return name;
              }
            }
            if (url.indexOf('%') != -1) {
              let newName = url.split('%')[0];
              return newName;
            }
            // 支持地图服务
            if (url.indexOf('/maps/') != -1) {
              let newName = url.split('/maps/')[1].replace('/', '');
              return newName;
            }
            return url;
          } else {
            return 'Unnamed';
          }
        } else {
          return imageLayerName;
        }
      }
    case "Terrain":
      {
        let terrainLayerName = url.split('/rest/realspace/datas/')[1];
        return terrainLayerName;
      }
    default:
      return '';
  }
}

// 专门添加CBD场景
function addCBD(url: string) {
  // 新版CBD属性
  const scene = viewer.scene;
  const widget = viewer.cesiumWidget;
  scene.camera.frustum.fov = 1.57;
  scene.fog.enabled = false;
  scene.globe.depthTestAgainstTerrain = false;
  scene.context.shaderPreprocess = true;
  scene.fog.enabled = false;
  scene.globe.depthTestAgainstTerrain = false;
  scene.context.shaderPreprocess = true;
  viewer.resolutionScale = window.devicePixelRatio; // 设置渲染分辨率的缩放因子

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
  // scene.lightSource.ambientLightColor = new SuperMap3D.Color(0.0, 0.0, 0.0, 1); // 环境光
  scene.lightSource.sunLightColor = new SuperMap3D.Color(1 * 1, 1 * 1, 1 * 1, 1);

  // 测试光照：
  viewer.clock.currentTime = SuperMap3D.JulianDate.fromDate(new Date(2023, 3, 5, 10));
  scene.sun.show = true;
  scene.envMapIntensity = 1.0;

  let L00 = new SuperMap3D.Cartesian3(0.255985647439957, 0.324294656515121, 0.448104858398438);
  let L1_1 = new SuperMap3D.Cartesian3(0.052135497331619, 0.127489775419235, 0.259717047214508);
  let L10 = new SuperMap3D.Cartesian3(-0.043244555592537, -0.037950038909912, -0.036239303648472);
  let L11 = new SuperMap3D.Cartesian3(0.014937655068934, -0.003836219897494, -0.021041290834546);
  let L2_2 = new SuperMap3D.Cartesian3(0.037908826023340, 0.013326642103493, -0.008756417781115);
  let L2_1 = new SuperMap3D.Cartesian3(-0.040351137518883, -0.020264262333512, -0.004807807970792);
  let L20 = new SuperMap3D.Cartesian3(0.004116172902286, 0.001403471920639, -0.004473014734685);
  let L21 = new SuperMap3D.Cartesian3(-0.039947938174009, -0.028241466730833, -0.011872956529260);
  let L22 = new SuperMap3D.Cartesian3(0.042825646698475, 0.035332202911377, 0.014503183774650);
  scene.specularEnvironmentMaps = "./Resource/CBD/HongKong_sphere_original_1k.ktx2";

  let coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
  scene.sphericalHarmonicCoefficients = coefficients;

  // 整个场景的后处理
  let correction = scene.colorCorrection;//创建颜色校正对象
  correction.show = true;//开启颜色校正
  correction.brightness = 1.0;
  correction.contrast = 1.3;
  correction.saturation = 1.0;
  correction.hue = 0.0;

  // 添加光源
  //光源位置--公园中心点
  let position1 = new SuperMap3D.Cartesian3.fromDegrees(116.459972821387, 39.9098456272661, 200);
  //光源方向点--打向东偏南方向，补光
  let targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(116.461118031787, 39.9083142302968, 20);
  let dirLightOptions = {
    targetPosition: targetPosition1,
    color: new SuperMap3D.Color(1, 1, 1, 1),
    intensity: 3.0
  };
  //光源方向点--打向西偏北方向，模拟日出之后4h的效果
  let targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(116.455700406131, 39.9115056668316, 20);
  let dirLightOptions1 = {
    targetPosition: targetPosition2,
    color: new SuperMap3D.Color(255 / 255, 229 / 255, 191 / 255, 1),
    intensity: 5.0
  };
  let directionalLight_1 = new SuperMap3D.DirectionalLight(position1, dirLightOptions);
  scene.addLightSource(directionalLight_1);
  let directionalLight_2 = new SuperMap3D.DirectionalLight(position1, dirLightOptions1);
  scene.addLightSource(directionalLight_2);

  try {
    let promise = scene.open(url);

    SuperMap3D.when(promise, function (layers) {
      if (!scene.pickPositionSupported) {
        alert('不支持深度拾取,属性查询功能无法使用！');
      }

      //设置建筑的外部金属框架的可见距离，解决摩尔纹的问题
      for (let layer of layers) {
        layer.cullMode = SuperMap3D.WindingOrder.COUNTER_CLOCKWISE;
        // layer.envMapIntensity = 1.2;
        //开启阴影
        layer.shadowType = 2;
        // layer.lodRangeScale = 0.1;

        // 根节点驻留与不立即释放
        layer.residentRootTile = true;
        layer.clearMemoryImmediately = false;
      }

      // 针对单个图层的处理：
      let layer1 = scene.layers.find("RoadRe");
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

      let layer2 = scene.layers.find("Ground_smallRe");
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
      // lod层级
      layer2.lodRangeScale = 0.1;

      let layer3 = scene.layers.find("Building_v1Re");
      //色相，默认是0，值域-1-1
      layer3.hue = 0;
      //亮度，默认0
      layer3.brightness = 0.85;
      // 对比度，默认1
      layer3.contrast = 1.3;
      // 饱和度，默认1
      layer3.saturation = 0.5;
      // gamma
      layer3.gamma = 1;

      let layer4 = scene.layers.find("Building_v2_mainRe");
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
      let layer5 = scene.layers.find("Waters@CBD");
      //设置水面的颜色
      // layer5.waterColor = new SuperMap3D.Color(0/255,66/255,61/255,1);
      layer5.waterColor = new SuperMap3D.Color(0 / 255, 53 / 255, 43 / 255, 1);
      // 设置水面的波动速度
      layer5.waterSpeed = new SuperMap3D.Cartesian2(0.3, 0.3);
      //设置水面的波动幅度
      layer5.waterWaveScale = 1;

      let layer6 = scene.layers.find("Building_NoCBD_5huan_WebGL");
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

    }, function (e) {
      if (widget._showRenderLoopErrors) {
        let title = '渲染时发生错误，已停止渲染。';
        widget.showErrorPanel(title, undefined, e);
      }
    });
  }
  catch (e) {
    if (widget._showRenderLoopErrors) {
      let title = '渲染时发生错误，已停止渲染。';
      widget.showErrorPanel(title, undefined, e);
    }
  }
}

// 专门添加石油场站
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
  let correction = scene.colorCorrection; //创建颜色校正对象
  correction.show = true //开启颜色校正
  correction.brightness = 1.0
  correction.contrast = 1.15
  correction.saturation = 1.0
  correction.hue = 0.0

  //来自西北平行光
  let position1 = new SuperMap3D.Cartesian3.fromDegrees(
    115.998460430547,
    40.0005740797481,
    3
  );
  let targetPosition1 = new SuperMap3D.Cartesian3.fromDegrees(
    115.999464851774,
    39.999780713494,
    3
  );
  let dirLightOptions1 = {
    targetPosition: targetPosition1,
    color: new SuperMap3D.Color(255 / 255, 237 / 255, 217 / 255, 1),
    intensity: 0,
  };
  //来自东北平行光
  let position2 = new SuperMap3D.Cartesian3.fromDegrees(
    116.000333104312,
    40.0005771848742,
    3
  );
  let targetPosition2 = new SuperMap3D.Cartesian3.fromDegrees(
    115.999464851774,
    39.999780713494,
    3
  );
  let dirLightOptions2 = {
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

  // 添加场景
  let promise = scene.open(url);
  promise.then(function (layers) {
    for (let layer of layers) {
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
    let layer1 = scene.layers.find("PI_UV");
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

  loadShadow(true);

  function loadLight(lightChecked) {
    if (lightChecked) {
      //环境光贴图ktx压缩测试--原始工具生成的
      let L00 = new SuperMap3D.Cartesian3(0.170253232121468, 0.186530470848083, 0.250162333250046);
      let L1_1 = new SuperMap3D.Cartesian3(-0.019948856905103, 0.036114457994699, 0.121223092079163);
      let L10 = new SuperMap3D.Cartesian3(0.021870676428080, 0.031954143196344, 0.039059657603502);
      let L11 = new SuperMap3D.Cartesian3(-0.016260044649243, -0.026163732632995, -0.032524436712265);
      let L2_2 = new SuperMap3D.Cartesian3(-0.026016067713499, -0.025068568065763, -0.024604434147477);
      let L2_1 = new SuperMap3D.Cartesian3(0.029782924801111, 0.029722381383181, 0.029306791722775);
      let L20 = new SuperMap3D.Cartesian3(0.007061737123877, 0.008292092941701, 0.010273135267198);
      let L21 = new SuperMap3D.Cartesian3(-0.025165025144815, -0.026656696572900, -0.027361012995243);
      let L22 = new SuperMap3D.Cartesian3(0.013707554899156, 0.018742486834526, 0.026223894208670);
      scene.specularEnvironmentMaps = './Resource/BDZ/drakensberg_solitary_mountain_1k_2_S-20.hdr';

      let coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22];
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
  setSkyBox
}