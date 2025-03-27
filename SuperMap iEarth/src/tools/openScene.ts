import { reactive } from "vue"
import { useMessage } from "naive-ui"
import { IportalStoreCreate } from "@/store/index";
import { usePanelStore } from "@/store/panelStore/index";
import { useLayerStore } from "@/store/layerStore/layer";
import { getRootUrl, isIportalProxyServiceUrl, getHostName } from "@/tools/iportal/portalTools";
import OpenConfig from "@/lib/OpenConfig";

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
})

// 打开已保存的场景
function openExistScene() {
  let openExistSceneUrl = window.location.href;
  let parmeter = openExistSceneUrl.split("id=")[1];
  state.sceneID = parmeter.split("&")[0];
  let url = getRootUrl() + "web/scenes/" + state.sceneID + ".json";
  panelStore.showSavePanel = false;

  window.axios
    .get(url, { withCredentials: true })
    .then(function (response) {
      if (window.iEarthConsole) console.log("已保存的场景返回信息:", response);
      if (response && response.data) IportalStore.SceneName = response.data.name; // 获取iPortal保存的场景名称
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
  if (!response) return;
  if (response && response.data) IportalStore.SceneName = response.data.name; // 获取iPortal保存的场景名称（二次确认:本地测试环境）
  let content = JSON.parse(response.data.content);
  if (window.iEarthConsole) console.log("已保存的场景返回内容:", content)
  
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
    let sceneInfo:any = undefined;
    let bindiEarthData:any = undefined;
    if(content.sceneInfo){
      sceneInfo = content.sceneInfo;
      bindiEarthData = content.bindiEarthData;
    }else{
      sceneInfo = oldSceneDataToNewSceneInfo(content);
      bindiEarthData = oldSceneDataToBindData(content);
    }

    // 计算layerTreeData
    let layerTreeData: any = undefined;
    if (content.layerTreeData) {
      layerTreeData = content.layerTreeData;
    }

    // 统一处理:打开场景 计算图层树 绑定数据
    handleSceneContent({
      sceneInfo:sceneInfo,
      layerTreeData: layerTreeData,
      bindiEarthData:bindiEarthData
    })

    // 兼容老版本iEarth采用Cesium圆球相机定位
    if (content.layer && !content.layers.sceneAttrState) {
      if (window.iEarthConsole) console.log('旧版IEarth保存的场景');
      let cameraX = content.camera.position.x;
      let cameraY = content.camera.position.y;
      let cameraZ = content.camera.position.z;
      let position = CartesiantoDegreesByEllipsoid(new SuperMap3D.Cartesian3(cameraX, cameraY, cameraZ))
      viewer.scene.camera.setView({
        destination: position,
        orientation: {
          heading: content.camera.heading,
          pitch: content.camera.pitch,
          roll: content.camera.roll
        }
      });
    }
  } else if (response.data.url) {
    let realspaceUrl = response.data.url;
    let index = realspaceUrl.indexOf("/scenes");
    realspaceUrl = realspaceUrl.substring(0, index);
    setTrustedServers(realspaceUrl);
    viewer.scene.open(realspaceUrl);
  }
}

// 统一处理:打开场景 计算图层树 绑定数据
function handleSceneContent(config) {
  const sceneInfo = config.sceneInfo;
  const layerTreeData = config.layerTreeData;
  const bindiEarthData = config.bindiEarthData;
  if (!sceneInfo) return;

  // 打开场景
  const openConfig = new OpenConfig(viewer);
  if (sceneInfo.SceneAdjust) {
    openConfig.openScene(sceneInfo);
  }

  // 计算图层树
  if (layerTreeData) {
    let s3mTreeData = openConfig.computedTreeData(layerTreeData);
    console.log("保存的图层树结构:", s3mTreeData);
    if (s3mTreeData && s3mTreeData.length > 0) {
      layerStore.layerTreeData[0].children = s3mTreeData;
    }
    window.layerTreeData = layerStore.layerTreeData;
  }

  // 绑定数据
  if (bindiEarthData) {
    if (bindiEarthData.layerQueryOptions) {
      window.iEarthBindData.layerQueryOptions = bindiEarthData.layerQueryOptions;
    }
    if (bindiEarthData.mapQueryOptions) {
      window.iEarthBindData.mapQueryOptions = bindiEarthData.mapQueryOptions;
    }
    // 将mediaFeildOptions传入
    if (bindiEarthData.mediaFeildOptions) {
      layerStore.mediaFeildOptions = bindiEarthData.mediaFeildOptions;
    }
    // 将wmtsLayerOption传入 
    if (bindiEarthData.wmtsLayerOption) {
      layerStore.wmtsLayerOption = bindiEarthData.wmtsLayerOption;
      layerStore.setWmts(bindiEarthData.wmtsLayerOption)
    }
    // 将baseMapOption传入 
    if (bindiEarthData.baseMapOption) {
      window.iEarthBindData.BaseMapOption = bindiEarthData.baseMapOption;
      const layerResult = viewer.imageryLayers._layers.filter((imgLayer) => { // 删除默认球皮
        if (imgLayer._imageryProvider && imgLayer._imageryProvider.url) {
          return imgLayer._imageryProvider.url == "./images/earth-skin2.jpg";
        }
      })
      if (layerResult.length === 1) viewer.imageryLayers.remove(layerResult[0]);
    }
    // 将媒体字段信息传入
    if (bindiEarthData.mediaResourceOptions) {
      window.iEarthBindData.mediaResourceOptions = bindiEarthData.mediaResourceOptions;
    }
  }
}

// 老版Cesium保存的圆球相机坐标转椭球
function CartesiantoDegreesByEllipsoid(Cartesians) {
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

// 将之前老版本iEarth保存的数据转为新版可用的场景数据
function oldSceneDataToNewSceneInfo(content){
  let sceneInfo:any = {};
  sceneInfo.SceneMode = content.environmentState.sceneMode;
  sceneInfo.Camera = content.camera;

  // 各类图层
  // TODO:支持MVT
  sceneInfo.LayerOptions = { 
    s3mLayers:content.layers.s3mLayer,
    imgLayers:content.layers.imageryLayer,
    mvtLayers:content.layers.MVTLayer,
    tinLayer:content.layers.terrainLayer[0]
  }

  // 场景调节
  const sceneAttrState = content.layers.sceneAttrState;
  sceneInfo.SceneAdjust = {
    GlobalAttr:{
      earthShow:sceneAttrState.earthShow,
      depthInspection:sceneAttrState.depthInspection,
      atomsphereRender:sceneAttrState.atomsphereRender,
      timeAxis:sceneAttrState.timeAxis,
      displayFrame:sceneAttrState.displayFrame,
    },
    VisualEffect:{
      shadow:{
        isOpen:sceneAttrState.shadow,
      },
      underGround:{
        isOpen:sceneAttrState.showUnderground,
        globeAlpha:sceneAttrState.surfaceTransparency
      },
      sceneColor:{
        isOpen: true,
        brightness: sceneAttrState.brightness,
        contrast: sceneAttrState.contrast,
        hue: sceneAttrState.hue,
        saturation: sceneAttrState.saturation
      }
    },
    SceneFeature:{
      cloudLayer:{
        isOpen:sceneAttrState.cloudLayer
      },
      skyBox:{
        isOpen:sceneAttrState.skyBoxShow
      }
    }
  }

  // 图层风格
  // TODO:新版暂无selectColorMode,暂不考虑LODScale
  const layerStyleOptions = content.layers.layerStyleOptions;
  if(layerStyleOptions && Object.keys(layerStyleOptions).length>0){
    sceneInfo.LayerStyles = {
      s3mLayerStyles:[]
    }
    Object.keys(layerStyleOptions).forEach(layerName=>{
      const item = layerStyleOptions[layerName];
      const obj = {
        name:layerName,
        style:{
          selectedColor:item.selectedColor,
          style3D:{
            fillStyle:item.fillStyle,
            lineColor:item.lineColor,
            fillForeColor:item.foreColor,
            bottomAltitude:item.bottomAltitude,
            alpha:item.layerTrans,
          },
        }
      }
      sceneInfo.LayerStyles.s3mLayerStyles.push(obj);
    })
  }

  // 粒子系统
  if(content.layers && content.layers.particleOptions){
    sceneInfo.ParticleSystem = content.layers.particleOptions;
  }

  return sceneInfo;
}
function oldSceneDataToBindData(content){
  if(!content || !content.layers) return;
  const bindData = {};
  bindData["layerQueryOptions"] = content.layers.layerQueryOptions; // s3m图层绑定的查询数据源信息
  bindData["mapQueryOptions"] = content.layers.mapQueryOptions; // 地图查询绑定的数据源信息
  bindData["mediaFeildOptions"] = content.layers.mediaFeildOptions; // 地图查询中媒体字段的绑定信息
  bindData["wmtsLayerOption"] = content.layers.wmtsLayerOption; // wmts服务
  bindData["baseMapOption"] = content.layers.baseMapOption; // 默认底图选项
  return bindData;
}
export default {
  openExistScene,
  handleSceneContent
}