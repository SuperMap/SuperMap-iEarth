import { reactive } from "vue"
import { useMessage } from "naive-ui"
import { IportalStoreCreate } from "@/store/index";
import { usePanelStore } from "@/store/panelStore/index";
import { useLayerStore } from "@/store/layerStore/layer";
import { getRootUrl, isIportalProxyServiceUrl, getHostName } from "@/tools/iportal/portalTools";
import layerManagement from "@/tools/layerManagement";

const IportalStore = IportalStoreCreate();
const panelStore = usePanelStore();
const message = useMessage();
const layerStore = useLayerStore();

let state = reactive({
  storageSceneShow: false,
  storageSceneCurrentTime: '',
  scenePortalName: '',
  scenePortalTages: '',
  scenePortalUser: "",
  scenePortalDescription: '',
  sceneID: '',
  updateTime: undefined,
  isNewVersion: true,
  key: layerStore.configToken.BingMapKey, // 必应地图key
  TiandituToken: layerStore.configToken.TiandituToken, // 天地图token
})

// 打开已保存的场景
function openExistScene() {
  let openExistSceneUrl = window.location.href;
  let parmeter = openExistSceneUrl.split("id=")[1];
  state.sceneID = parmeter.split("&")[0];
  let url = getRootUrl() + "web/scenes/" + state.sceneID + ".json";
  if (window.iEarthConsole) console.log("exit-Scene-url:", url)
  panelStore.showSavePanel = false;

  window.axios
    .get(url, { withCredentials: true })
    .then(function (response) {
      if (window.iEarthConsole) console.log("已保存的场景返回信息:", response);
      // state.updateTime = response.data.updateTime;
      if (response.status === 200) {
        let highestpermissionurl =
          getRootUrl() +
          "web/permissions/highestpermission.json?resourceIds=" +
          encodeURIComponent("[" + state.sceneID + "]") +
          "&resourceType=SCENE";

        window.axios
          .get(highestpermissionurl, { withCredentials: true })
          .then(function (responseHigh) {
            if (responseHigh.data[state.sceneID] === "DELETE") {
              // 编辑/删除，可以编辑保存
              openScene(response);
            } else if (responseHigh.data[state.sceneID] === "READ") {
              // 查看，能看到内容，不能编辑保存
              openScene(response);
            } else {
              // 私有 或者 检索，看不到内容
              message.error("没有权限");
            }
          });
      } else if (response.status === 401) {
        //无权限，未登录或者访问的是私有场景
        message.error("没有权限");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 打开场景
function openScene(response?: any) {
  let content = JSON.parse(response.data.content);
  if (window.iEarthConsole) console.log("已保存的场景返回内容:", content)
  if (content.layers.sceneAttrState) { // 新版的layers才有sceneAttrState属性
    state.isNewVersion = true;
  } else {
    state.isNewVersion = false;
  }
  state.scenePortalName = response.data.name;
  state.scenePortalTages = response.data.tags.join(",");
  state.scenePortalUser = response.data.userName;
  state.scenePortalDescription = response.data.description;
  IportalStore.saveInfo = {
    scenePortalName: state.scenePortalName || '',
    scenePortalTages: state.scenePortalTages || '',
    scenePortalUser: state.scenePortalUser || '',
    scenePortalDescription: state.scenePortalDescription || '',
  }

  if (content) {
    if (JSON.stringify(content.layers) !== "{}") {
      if (content.environmentState && content.environmentState.sceneMode) {
        viewer.scene.mode = content.environmentState.sceneMode;
      }

      // 将layerTreeAlias传入 (需要在打开图层前导入到store当中)
      if (content.layers.layerTreeAlias) {
        layerStore.layerTreeAlias = content.layers.layerTreeAlias;
        layerStore.setLayerTreeAlias(content.layers.layerTreeAlias);
      }

      //需要改动
      openS3M(content);
      openImagery(content);
      openMVT(content);
      openTerrain(content);

      // 将SelectedOptions传入
      if (content.layers.SelectedOptions) {
        layerStore.SelectedOptions = content.layers.SelectedOptions;
        layerStore.updateSelectedOption(content.layers.SelectedOptions);
      }
      // 将layerQueryOptions传入
      if (content.layers.layerQueryOptions) {
        layerStore.layerQueryOptions = content.layers.layerQueryOptions;
      }
      // 将mapQueryOptions传入
      if (content.layers.mapQueryOptions) {
        layerStore.mapQueryOptions = content.layers.mapQueryOptions;
      }
      // 将mediaFeildOptions传入
      if (content.layers.mediaFeildOptions) {
        layerStore.mediaFeildOptions = content.layers.mediaFeildOptions;
      }
      // 将sceneAttrState传入
      if (content.layers.sceneAttrState) {
        layerStore.sceneAttrState = content.layers.sceneAttrState;
        layerStore.setSceneAttr(content.layers.sceneAttrState)
      }
      // 将particleOptions传入
      if (content.layers.particleOptions) {
        layerStore.particleOptions = content.layers.particleOptions;
        layerStore.setParticle(content.layers.particleOptions)
      }
      // 将wmtsLayerOption传入 
      if (content.layers.wmtsLayerOption) {
        layerStore.wmtsLayerOption = content.layers.wmtsLayerOption;
        layerStore.setWmts(content.layers.wmtsLayerOption)
      }
    }

    let cameraX = content.camera.position.x;
    let cameraY = content.camera.position.y;
    let cameraZ = content.camera.position.z;
    let positionCartographic = content.camera.positionCartographic;

    setTimeout(function () {
      // 平面场景下（哥伦布视图），如果保存了弧度制的经纬度，就通过经纬度跳转，没有则通过s3m图层跳转
      if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) {
        if (positionCartographic) {
          let longitude: number = Number(SuperMap3D.Math.toDegrees(positionCartographic.longitude));
          let latitude: number = Number(SuperMap3D.Math.toDegrees(positionCartographic.latitude));
          let height: number = Number(positionCartographic.height);
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3.fromDegrees(longitude, latitude, height),
            orientation: {
              heading: content.camera.heading,
              pitch: content.camera.pitch,
              roll: content.camera.roll
            }
          });
        } else {
          let s3mLayer = viewer.scene.layers._layerQueue[0];
          viewer.flyTo(s3mLayer, { duration: 0 });
        }
      } else {
        if (state.isNewVersion) {
          // 新版保存的场景
          if (window.iEarthConsole) console.log('新版IEarth保存的场景');
          viewer.scene.camera.setView({
            destination: new SuperMap3D.Cartesian3(cameraX, cameraY, cameraZ),
            orientation: {
              heading: content.camera.heading,
              pitch: content.camera.pitch,
              roll: content.camera.roll
            }
          });
        } else {
          // 旧版保存的场景
          if (window.iEarthConsole) console.log('旧版IEarth保存的场景');
          let position = CartesiantoDegrees(new SuperMap3D.Cartesian3(cameraX, cameraY, cameraZ))
          viewer.scene.camera.setView({
            destination: position,
            orientation: {
              heading: content.camera.heading,
              pitch: content.camera.pitch,
              roll: content.camera.roll
            }
          });
        }
      }

      layerStore.refreshLayerTree();

      // 将layerStyleOptions传入 - 需要等layer都加载完在设置图层风格
      if (content.layers.layerStyleOptions) {
        layerStore.layerStyleOptions = content.layers.layerStyleOptions;
        layerStore.setLayerStyle(content.layers.layerStyleOptions)
      }
    }, 3000);

  } else if (response.data.url) {
    let realspaceUrl = response.data.url;
    let index = realspaceUrl.indexOf("/scenes");
    realspaceUrl = realspaceUrl.substring(0, index);
    setTrustedServers(realspaceUrl);
    viewer.scene.open(realspaceUrl);
  }
}

// 老版Cesium保存的圆球相机坐标转椭球
function CartesiantoDegrees(Cartesians) {
  // 当坐标为Cesium中保存的，使用圆球进行转换
  var ellipsoid = new SuperMap3D.Ellipsoid(6378137.0, 6378137.0, 6378137.0)
  let array = [].concat(Cartesians);
  let positions: any = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i], ellipsoid);
    let longitude = Number(SuperMap3D.Math.toDegrees(cartographic.longitude));
    let latitude = Number(SuperMap3D.Math.toDegrees(cartographic.latitude));
    let h = Number(cartographic.height);
    if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
      positions.push(longitude);
      positions.push(latitude);
      positions.push(h);
    }
    return SuperMap3D.Cartesian3.fromDegrees(longitude, latitude, h);
  }
};

// 打开s3m图层
function openS3M(content: any) {
  let s3mlayer = content.layers.s3mLayer;
  if (s3mlayer && s3mlayer.length > 0) {
    for (let t = 0; t < s3mlayer.length; t++) {
      let url = content.layers.s3mLayer[t].url;
      let name = content.layers.s3mLayer[t].name;
      setTrustedServers(url);
      let bindName = content.layers.s3mLayer[t].bindName || '';
      let promise = viewer.scene.addS3MTilesLayerByScp(url, { name: name });
      SuperMap3D.when(promise, function (layer: any) {
        layer.bindName = bindName;
      });
      layerStore.updateLayer({ type: "s3m" });
    }
  }
}

// 打开影像图层
function openImagery(content: any) {
  let imageryLayer = content.layers.imageryLayer;
  let imageryProvider;
  if (imageryLayer && imageryLayer.length > 0) {
    for (let i = 0; i < imageryLayer.length; i++) {
      let url = content.layers.imageryLayer[i].url;
      if (url.indexOf('static/Cesium') != -1) {
        console.log('该url不存在');
        continue;
      }
      if (url.length > 1) {
        setTrustedServers(url);
      }
      let flag = checkImageryRepeat(url);
      if (!flag && imageryLayer[i].type) {
        let imageryType = content.layers.imageryLayer[i].type;
        switch (imageryType) {
          case "BingMapsImageryProvider":
            imageryProvider = new SuperMap3D.BingMapsImageryProvider({
              url: content.layers.imageryLayer[i].url,
              key: state.key
              // key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
            });
            break;
          case "TiandituImageryProvider":
            imageryProvider = new SuperMap3D.TiandituImageryProvider({
              url: content.layers.imageryLayer[i].url,
              token: state.TiandituToken
              // token: content.layers.imageryLayer[i].token
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
        let imagerlayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
        let bindName = imageryLayer[i].bindName || '';
        imagerlayer.bindName = bindName;
        layerStore.updateLayer({ type: "imagery" });
      }
    }
  }
}

// 打开MVT
function openMVT(content: any) {
  let MVTLayerUrlList = content.layers.MVTLayer;
  if (MVTLayerUrlList && MVTLayerUrlList.length > 0) {
    MVTLayerUrlList.forEach(item => {
      layerManagement.addMvtLayer(item.url, item.name, "MVT");
    })
  }
}

// 打开地形
function openTerrain(content: any) {
  viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
  let terrainLayer = content.layers.terrainLayer;
  if (terrainLayer && terrainLayer.length > 0) {
    let terrainType = content.layers.terrainLayer[0].type;
    let url = content.layers.terrainLayer[0].url;
    setTrustedServers(url);

    layerStore.updateLayer({ type: "terrain" });

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
          token: state.TiandituToken
        });
        break;
      case "supermapOnlineTerrain":
        viewer.terrainProvider = new SuperMap3D.SCTTerrainProvider({
          urls: [content.layers.terrainLayer[0].url]
        });
        break;
    }
    let bindName = content.layers.terrainLayer[0].bindName || '';
    viewer.terrainProvider.bindName = bindName;
  }
}

// 检查请求是否带cookie
function setTrustedServers(url: string) {
  if (IportalStore.isPortal) {
    if (IportalStore.portalConfig) {
      let serviceProxy = IportalStore.portalConfig.serviceProxy;
      let withCredentials = isIportalProxyServiceUrl(url, serviceProxy);
      if (withCredentials) {
        let ip = getHostName(url);
        if (
          !SuperMap3D.TrustedServers.contains(
            "http://" + ip + "/" + serviceProxy.port
          )
        ) {
          SuperMap3D.TrustedServers.add(ip, serviceProxy.port);
        }
      }
    }
  }
}

// 检查当前影像是否重复添加
function checkImageryRepeat(url: string) {
  let length = viewer.imageryLayers._layers.length
  for (let i = 0; i < length; i++) {
    let imageryLayer = viewer.imageryLayers._layers[i];
    if (imageryLayer._imageryProvider.url) {
      let imgUrl = imageryLayer._imageryProvider.url;
      return imgUrl === url ? true : false;
    }
  }
}

export default {
  openExistScene
}