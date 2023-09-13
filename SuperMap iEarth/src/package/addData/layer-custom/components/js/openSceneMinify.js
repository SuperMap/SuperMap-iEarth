let BingMapkey = "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5";
let terrainToken = "e90d56e5a09d1767899ad45846b0cefd";

function getRootUrl() {
  const path = "/apps";
  let url = "";
  if (window.location.href.indexOf(path) !== -1) {
    url = window.location.href.substring(
      0,
      window.location.href.indexOf(path) + 1
    );
  }
  if (!url) {
    if (location.href.indexOf("/iportal/") !== -1) {
      url = `${location.protocol}//${location.host}/iportal/`;
    } else {
      url = `${location.protocol}//${location.host}/`;
    }
  }
  //模拟本机portal开发
  // url = "http://localhost:8190/iportal/"
  return url;
}

function openExistScene(sceneID) {
  console.log("打开已存在的保存场景");

  let url = getRootUrl() + "web/scenes/" + sceneID + ".json";
  console.log("exit-Scene-url:", url)

  window.axios
    .get(url, { withCredentials: true })
    .then(function (response) {
      console.log("已保存的场景返回信息:", response);
      openScene(response);
    })
    .catch(function (error) {
      console.log(error);
    });

}

function openScene(response) {
  let content = JSON.parse(response.data.content);
  console.log("exit-openScene-content:", content)

  if (content) {
    if (JSON.stringify(content.layers) !== "{}") {
      //需要改动
      openS3M(content);
      openImagery(content);
      openMVT(content);
      openTerrain(content);

      // 场景属性
      if (content.layers.sceneAttrState) {
        setSceneAttr(content.layers.sceneAttrState)
      }
      // 三维特效粒子
      if (content.layers.particleOptions) {
        setParticle(content.layers.particleOptions)
      }
    }
    let cameraX = content.camera.position.x;
    let cameraY = content.camera.position.y;
    let cameraZ = content.camera.position.z;
    setTimeout(function () {
      viewer.scene.camera.setView({
        destination: new SuperMap3D.Cartesian3(cameraX, cameraY, cameraZ),
        orientation: {
          heading: content.camera.heading,
          pitch: content.camera.pitch,
          roll: content.camera.roll
        }
      });
      // 专门处理阴影
      let shadow_value = content.layers.sceneAttrState["shadow"];
      if (shadow_value == true) {
        window.viewer.shadows = true;
        // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
        window.viewer.pcss = true;
        window.viewer.shadowQuality = 0;
        //设置阴影的出现距离
        window.viewer.scene.shadowMap.maximumDistance = 2000;
        //设置阴影的浓度，值越高，阴影越淡
        window.viewer.shadowMap.darkness = 0.4
        //默认值是0.1，值越小越清晰
        window.viewer.shadowMap.penumbraRatio = 0.1

        let layers = window.viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
          // 设置图层的阴影模式
          layers[i].shadowType = 2;
        }
      }

      // 将layerStyleOptions传入 - 需要等layer都加载完在设置图层风格
      if (content.layers.layerStyleOptions) {
        setLayerStyle(content.layers.layerStyleOptions)
      }
    }, 3000);
  } else if (response.data.url) {

    let realspaceUrl = response.data.url;
    let index = realspaceUrl.indexOf("/scenes");
    realspaceUrl = realspaceUrl.substring(0, index);
    viewer.scene.open(realspaceUrl);
  }
}

// 加载S3M
function openS3M(content) {
  let s3mlayer = content.layers.s3mLayer;
  if (s3mlayer.length > 0) {
    for (let t = 0; t < s3mlayer.length; t++) {
      let url = content.layers.s3mLayer[t].url;
      let name = content.layers.s3mLayer[t].name;
      viewer.scene.addS3MTilesLayerByScp(url, { name: name });
    }
  }
}

// 加载影像
function openImagery(content) {
  let imageryLayer = content.layers.imageryLayer;
  let imageryProvider;
  if (imageryLayer.length > 0) {
    for (let i = 0; i < imageryLayer.length; i++) {
      let url = content.layers.imageryLayer[i].url;
      let flag = checkImageryRepeat(url);
      // console.log("flag-open:",flag);
      // console.log("url-open:",url);
      if (!flag && imageryLayer[i].type) {
        let imageryType = content.layers.imageryLayer[i].type;
        switch (imageryType) {
          case "BingMapsImageryProvider":
            imageryProvider = new SuperMap3D.BingMapsImageryProvider({
              url: content.layers.imageryLayer[i].url,
              key: BingMapkey
            });
            break;
          case "TiandituImageryProvider":
            imageryProvider = new SuperMap3D.TiandituImageryProvider({
              url: content.layers.imageryLayer[i].url,
              token: content.layers.imageryLayer[i].token
            });
            break;
          case "SingleTileImageryProvider":
            imageryProvider = new SuperMap3D.SingleTileImageryProvider({
              url: content.layers.imageryLayer[i].url
            });
            break;
          case "UrlTemplateImageryProvider":
            imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
              url: content.layers.imageryLayer[i].url
            });
            break;
          case "SuperMapImageryProvider":
            imageryProvider = new SuperMap3D.SuperMapImageryProvider({
              url: content.layers.imageryLayer[i].url
            });
            break;
          case "GRIDIMAGERY":
            imageryProvider = new SuperMap3D.TileCoordinatesImageryProvider();
            break;
          default:
            break;
        }
        viewer.imageryLayers.addImageryProvider(imageryProvider);
      }
    }
  }

}

// 加载MVT
function openMVT(content) {
  let MVTLayerUrlList = content.layers.MVTLayer;

  MVTLayerUrlList.forEach(item => {
    addMvtLayer(item.url, item.name, "MVT");
  })
}

// 加载地形
function openTerrain(content) {

  viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
  let terrainLayer = content.layers.terrainLayer;
  if (terrainLayer.length > 0) {
    let terrainType = content.layers.terrainLayer[0].type;

    let url = content.layers.terrainLayer[0].url;
    switch (terrainType) {
      case "StkTerrain":
        let isSctFlag = true;
        // 是否为iServer发布的TIN地形服务,stk地形设置为false。
        // if(content.layers.terrainLayer[0].url.indexOf("8090") != -1) isSctFlag = true;
        if (content.layers.terrainLayer[0].url.indexOf("/info/") != -1) isSctFlag = false; // 目前以"/info/"来判断是否为stk地形
        viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
          url: content.layers.terrainLayer[0].url,
          isSct: isSctFlag
        });
        break;
      case "tianDiTuTerrain":
        viewer.terrainProvider = new SuperMap3D.TiandituTerrainProvider({
          token: terrainToken
        });
        break;
      case "supermapOnlineTerrain":
        viewer.terrainProvider = new SuperMap3D.SCTTerrainProvider({
          urls: [content.layers.terrainLayer[0].url]
        });
        break;
    }
  }
}

// 设置场景属性
function setSceneAttr(sceneAttrState) {
  for (let key in sceneAttrState) {
    sceneAttrSwitch(key, sceneAttrState[key]);
  }
}

// 根据key和value分别设置场景属性
function sceneAttrSwitch(key, value) {
  switch (key) {
    case "atomsphereRender":
      window.viewer.scene.skyAtmosphere.show = value;
      break;
    case "depthInspection":
      window.viewer.scene.globe.depthTestAgainstTerrain = value;
      break;
    case "displayFrame":
      window.viewer.scene.debugShowFramesPerSecond = value;
      break;
    case "earthShow":
      window.viewer.scene.globe.show = value;
      break;
    case "fogEffect":
      window.viewer.scene.fog.enabled = value;
      break;
    case "shadow":
      if (value) {
        window.viewer.shadows = true;
        // UE阴影 设置为false，使用原来的软阴影效果；设置为true，实现了新的阴影算法，可以大幅度提升阴影边界的质量，看起来会非常柔和，没有锯齿。这个设置webgl2.0默认开启了。
        window.viewer.pcss = true;
        window.viewer.shadowQuality = 0;
        //设置阴影的出现距离
        window.viewer.scene.shadowMap.maximumDistance = 2000;
        //设置阴影的浓度，值越高，阴影越淡
        window.viewer.shadowMap.darkness = 0.4;
        //默认值是0.1，值越小越清晰
        window.viewer.shadowMap.penumbraRatio = 0.1;


        let layers = window.viewer.scene.layers.layerQueue;
        for (var i = 0; i < layers.length; i++) {
          // 设置图层的阴影模式
          layers[i].shadowType = 2;
        }
      } else {
        window.viewer.shadows = false;
      }
      break;
    case "sunShow":
      window.viewer.scene.globe.enableLighting = value;
      break;
    case "timeAxis":
      let timeline = document.getElementsByClassName(
        "supermap3d-viewer-timelineContainer"
      )[0];
      if (value) {
        timeline.style.visibility = "visible";
        timeline.style['z-index'] = 99999999999;
      } else {
        timeline.style.visibility = "hidden";
      }
      break;
    case "cloudLayer":
      if (value) {
        viewer.scene.cloudBox = cloudBox;
      } else {
        viewer.scene.cloudBox = null;
      }
      break;
    case "skyBoxShow":
      setSkyBox(value);
      break;
    case "brightness":
      window.viewer.scene.colorCorrection.show = true; // 场景颜色开关打开
      window.viewer.scene.colorCorrection.brightness = value;
      break;
    case "contrast":
      window.viewer.scene.colorCorrection.show = true;
      window.viewer.scene.colorCorrection.contrast = value;
      break;
    case "hue":
      window.viewer.scene.colorCorrection.show = true;
      window.viewer.scene.colorCorrection.hue = value;
      break;
    case "saturation":
      window.viewer.scene.colorCorrection.show = true;
      window.viewer.scene.colorCorrection.saturation = value;
      break;
    case "surfaceTransparency":
      window.viewer.scene.globe.globeAlpha = value;
      break;
  };
}

// let iportal_large_screen_url_prefix = getRootUrl() + 'apps/earth/v2';
// let cloudBoxUrl = iportal_large_screen_url_prefix + '/images/sceneProperties/clouds/clouds1.png';
// let cloudBox = new SuperMap3D.CloudBox({ url: cloudBoxUrl });
// // 天空盒
// let bluesky = {
//   positiveX: iportal_large_screen_url_prefix+'/images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.right.jpg',
//   negativeX: iportal_large_screen_url_prefix+'/images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.left.jpg',
//   positiveY: iportal_large_screen_url_prefix+'/images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.front.jpg',
//   negativeY: iportal_large_screen_url_prefix+'/images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.back.jpg',
//   positiveZ: iportal_large_screen_url_prefix+'/images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.top.jpg',
//   negativeZ: iportal_large_screen_url_prefix+'/images/sceneProperties/bluesky/kloofendal_48d_partly_cloudy_puresky_8k_4.bottom.jpg'
// };
// 云层
let cloudBoxUrl = './images/sceneProperties/clouds/clouds1.png';
let cloudBox = new SuperMap3D.CloudBox({ url: cloudBoxUrl });
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

// 设置天空盒
function setSkyBox(skyBoxShow) {
  let defaultSkybox = viewer.scene.skyBox;

  if (skyBoxShow) {
    let cameraHeight = viewer.scene.camera.positionCartographic.height;
    viewer.scene.postRender.addEventListener(watchCameraHeight);
    viewer.scene.skyBox = skybox;
    if (cameraHeight < 22e4) {
      viewer.scene.skyBox.show = true;
      viewer.scene.skyAtmosphere.show = false
    } else {
      viewer.scene.skyAtmosphere.show = true
    }
  } else {
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.skyBox.show = false;
    viewer.scene.skyBox = defaultSkybox;
    viewer.scene.postRender.removeEventListener(watchCameraHeight);
  }
}

// 监听相机高度，一旦高于设定阈值，关闭天空盒显示大气层
function watchCameraHeight(skyBoxShow) {
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

// 设置场景特效 - 粒子系统
function setParticle(particleOptions) {
  if (particleOptions['fire'] != null) {
    let fireOption = particleOptions['fire'];
    addParticleFile(fireOption, 'fire');
  }
  if (particleOptions['water'] != null) {
    let waterOption = particleOptions['water'];
    addParticleFile(waterOption, 'water');
  }
  if (particleOptions['fireWork'] != null) {
    let fireWorkOption = particleOptions['fireWork'];
    addFireWork(fireWorkOption);
  }
}
// 添加场景中已保存的粒子
function addParticleFile(options, type) {
  let modelMatrix_fire = new SuperMap3D.Matrix4();
  SuperMap3D.Transforms.eastNorthUpToFixedFrame(options.particlePosition, undefined, modelMatrix_fire);
  loadParticleFile(options.particleUrl, modelMatrix_fire, type, options.particleAttr);
}
// 加载粒子文件
function loadParticleFile(url, modelMatrix, type, option) {
  let particle = {};
  let scene = window.viewer.scene;
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
  });

}

// 设置保存的图层属性
function setLayerStyle(layerStyleOptions) {
  console.log("layerStyleOptions:", layerStyleOptions);
  let keys = Object.keys(layerStyleOptions);
  for (let i = 0; i < keys.length; i++) {
    let layerName = keys[i];
    let layerStyleOption = layerStyleOptions[layerName];
    let currentLayer = window.viewer.scene.layers.find(layerName);
    if (!currentLayer) return;
    for (let key in layerStyleOption) {
      let lineColor = layerStyleOption["lineColor"];
      layerStyleSwitch(currentLayer, key, layerStyleOption[key], lineColor);
    }
  }
}

// 根据option内容中每个属性赋值
function layerStyleSwitch(currentLayer, key, value, lineColor) {
  switch (key) {
    case "foreColor":
      currentLayer.style3D.fillForeColor = SuperMap3D.Color.fromCssColorString(value);
      break;
    case "lineColor":
      currentLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(value);
      break;
    case "selectedColor":
      currentLayer.selectedColor = SuperMap3D.Color.fromCssColorString(value);
      break;
    case "layerTrans":
      currentLayer.style3D.fillForeColor.alpha = Number(value);
      break;
    case "selectColorMode":
      currentLayer.selectColorType = value;
      break;
    case "bottomAltitude":
      currentLayer.style3D.bottomAltitude = Number(value);
      currentLayer.refresh();
      break;
    case "fillStyle":
      if (currentLayer) {
        switch (value) {
          case 0:
            currentLayer.style3D.fillStyle = SuperMap3D.FillStyle.Fill;
            break;
          case 1:
            currentLayer.style3D.fillStyle = SuperMap3D.FillStyle.WireFrame;
            currentLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(lineColor);
            break;
          case 2:
            currentLayer.style3D.fillStyle = SuperMap3D.FillStyle.Fill_And_WireFrame;
            currentLayer.style3D.lineColor = SuperMap3D.Color.fromCssColorString(lineColor);
            break;
          default:
            break;
        }
        currentLayer.refresh();
      }
      break;
    default:
      break;
  }

}

// 添加烟花
function addFireWork(fireWorkOption) {
  let modelMatrix = new SuperMap3D.Matrix4();
  let setIntervalList = [];
  let scene = window.viewer.scene;
  // scene.skyAtmosphere = new SuperMap3D.SkyAtmosphere();
  // scene.globe.show = false
  // scene.skyAtmosphere.show = false; //关闭大气

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
  }

  function addSpark(centerPosition) {
    SuperMap3D.Transforms.eastNorthUpToFixedFrame(centerPosition, undefined, modelMatrix);
    createSpark();
  }

  addSpark(fireWorkOption.fireWorkPosition);
}

// 添加MVT服务
function addMvtLayer(LayerURL, name, type) {
  // 返回img图层layer
  let mvtMap = window.viewer.scene.addVectorTilesMap({
    url: LayerURL,
    canvasWidth: 512,
    name: name || "mvt",
    viewer: window.viewer,
  });

  SuperMap3D.when(mvtMap.readyPromise, function (data) {
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

  });
}

// 检查当前影像是否重复添加
function checkImageryRepeat(url) {
  // viewer.imageryLayers._layers.find
  let length = viewer.imageryLayers._layers.length
  for (let i = 0; i < length; i++) {
    let imageryLayer = viewer.imageryLayers._layers[i];
    if (imageryLayer._imageryProvider.url) {
      let imgUrl = imageryLayer._imageryProvider.url;
      // if(imgUrl===url){
      //   return true;
      // }
      return imgUrl === url ? true : false;
    }

  }
}

export default {
  openExistScene
}