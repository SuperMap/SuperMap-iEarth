import { reactive, onMounted } from "vue"
import { useMessage } from "naive-ui"
import { IportalStoreCreate } from "@/store/index";
import { usePanelStore } from "@/store/panelStore/index";
import { GlobalStoreCreate } from '@/store/global/global';
import { getRootUrl, isIportalProxyServiceUrl, getHostName } from "@/tools/iportal/portalTools";
import layerManagement from "@/tools/layerManagement";
import { useLayerStore } from "@/store/layerStore";

const IportalStore = IportalStoreCreate();
const GlobalStore = GlobalStoreCreate();
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

  key: "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
  token: "7933ae29d47bcf1440889ad983dbe0af",
  terrainToken: "e90d56e5a09d1767899ad45846b0cefd",
})

function openExistScene() {
    console.log("打开已存在的保存场景");
  
    let openExistSceneUrl = window.location.href;
    let parmeter = openExistSceneUrl.split("id=")[1];
    state.sceneID = parmeter.split("&")[0];
  
    panelStore.showSavePanel = false;
    let url = getRootUrl() + "web/scenes/" + state.sceneID + ".json";
    console.log("exit-Scene-url:", url)
  
    window.axios
      .get(url, { withCredentials: true })
      .then(function (response) {
        console.log("已保存的场景返回信息:",response);
  
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
  
  function openScene(response?: any) {
    let content = JSON.parse(response.data.content);
    console.log("exit-openScene-content:", content)
  
    state.scenePortalName = response.data.name;
    state.scenePortalTages = response.data.tags.join(",");
    state.scenePortalUser = response.data.userName;
    state.scenePortalDescription = response.data.description;
    IportalStore.saveInfo = {
      scenePortalName:state.scenePortalName || '',
      scenePortalTages:state.scenePortalTages || '',
      scenePortalUser:state.scenePortalUser || '',
      scenePortalDescription:state.scenePortalDescription || '',
    }
    console.log("IportalStore.saveInfo-openExit:",IportalStore.saveInfo);
  
    if (content) {
      if (JSON.stringify(content.layers) !== "{}") {
        //需要改动
        openS3M(content);
        openImagery(content);
        openMVT(content);
        openTerrain(content);

        // 将SelectedOptions传入
        if(content.layers.SelectedOptions){
          layerStore.SelectedOptions = content.layers.SelectedOptions;
          layerStore.updateSelectedOption(content.layers.SelectedOptions);
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
  
        // GlobalStore.SceneLayerChangeCount++;
        layerStore.refreshLayerTree();
      }, 3000);
    } else if (response.data.url) {
  
      let realspaceUrl = response.data.url;
      let index = realspaceUrl.indexOf("/scenes");
      realspaceUrl = realspaceUrl.substring(0, index);
  
      setTrustedServers(realspaceUrl);
  
      viewer.scene.open(realspaceUrl);
    }
  }
  
  function openS3M(content: any) {
    let s3mlayer = content.layers.s3mLayer;
    if (s3mlayer.length > 0) {
      for (let t = 0; t < s3mlayer.length; t++) {
        let url = content.layers.s3mLayer[t].url;
        let name = content.layers.s3mLayer[t].name;
        setTrustedServers(url);
        viewer.scene.addS3MTilesLayerByScp(url, { name: name });
  
        // GlobalStore.SceneLayerChangeCount++;
        layerStore.updateLayer({ type: "s3m" });
      }
    }
  }
  function openImagery(content: any) {
    let imageryLayer = content.layers.imageryLayer;
    let imageryProvider;
    if (imageryLayer.length > 0) {
      for (let i = 0; i < imageryLayer.length; i++) {
        let url = content.layers.imageryLayer[i].url;
        if (url.length > 1) {
          setTrustedServers(url);
        }
        let flag = checkImageryRepeat(url);
        // console.log("flag-open:",flag);
        // console.log("url-open:",url);
        if(!flag && imageryLayer[i].type){
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
                // token: this.token
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
          // GlobalStore.SceneLayerChangeCount++;
          layerStore.updateLayer({ type: "imagery" });
    
          viewer.imageryLayers.addImageryProvider(imageryProvider);
        }
        
        // let imageryType = content.layers.imageryLayer[i].type;
        // switch (imageryType) {
        //   case "BingMapsImageryProvider":
        //     imageryProvider = new SuperMap3D.BingMapsImageryProvider({
        //       url: content.layers.imageryLayer[i].url,
        //       key: state.key
        //       // key: "Aq0D7MCY5ErORA9vrwFtfE9aancUq5J6uNjw0GieF0ostaIrVuJZ8ScXxNHHvEwS",
        //     });
        //     break;
        //   case "TiandituImageryProvider":
        //     imageryProvider = new SuperMap3D.TiandituImageryProvider({
        //       url: content.layers.imageryLayer[i].url,
        //       // token: this.token
        //       token: content.layers.imageryLayer[i].token
        //     });
        //     break;
        //   case "SingleTileImageryProvider":
        //     imageryProvider = new SuperMap3D.SingleTileImageryProvider({
        //       url: content.layers.imageryLayer[i].url
        //     });
        //     break;
        //   case "UrlTemplateImageryProvider":
        //     imageryProvider = new SuperMap3D.UrlTemplateImageryProvider({
        //       url: content.layers.imageryLayer[i].url
        //     });
        //     break;
        //   case "SuperMapImageryProvider":
        //     imageryProvider = new SuperMap3D.SuperMapImageryProvider({
        //       url: content.layers.imageryLayer[i].url
        //     });
        //     break;
        //   case "GRIDIMAGERY":
        //     imageryProvider = new SuperMap3D.TileCoordinatesImageryProvider();
        //     break;
        //   default:
        //     break;
        // }
        // // GlobalStore.SceneLayerChangeCount++;
        // layerStore.updateLayer({ type: "imagery" });
  
        // viewer.imageryLayers.addImageryProvider(imageryProvider);
      }
    }
  
  }
  function openMVT(content: any) {
    let MVTLayerUrlList = content.layers.MVTLayer;
  
    MVTLayerUrlList.forEach(item => {
      layerManagement.addMvtLayer(item.url, item.name,"MVT");
    })
  }
  function openTerrain(content: any) {
  
    viewer.terrainProvider = new SuperMap3D.EllipsoidTerrainProvider();
    let terrainLayer = content.layers.terrainLayer;
    if (terrainLayer.length > 0) {
      let terrainType = content.layers.terrainLayer[0].type;
  
      let url = content.layers.terrainLayer[0].url;
      setTrustedServers(url);
  
      // GlobalStore.SceneLayerChangeCount++;
      layerStore.updateLayer({ type: "terrain" });
  
      switch (terrainType) {
        case "StkTerrain":
          let isSctFlag = false;
          if(content.layers.terrainLayer[0].url.indexOf("8090") != -1) isSctFlag = true;
          viewer.terrainProvider = new SuperMap3D.SuperMapTerrainProvider({
            url: content.layers.terrainLayer[0].url,
            isSct: isSctFlag
          });
          break;
        case "tianDiTuTerrain":
          viewer.terrainProvider = new SuperMap3D.TiandituTerrainProvider({
            token: state.terrainToken
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
  
  // 检查请求是否带cookie
  function setTrustedServers(url:string) {
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
  function checkImageryRepeat(url:string){
    // viewer.imageryLayers._layers.find
    let length = viewer.imageryLayers._layers.length
    for(let i=0;i<length;i++){
      let imageryLayer = viewer.imageryLayers._layers[i];
      if(imageryLayer._imageryProvider.url){
        let imgUrl = imageryLayer._imageryProvider.url;
        // if(imgUrl===url){
        //   return true;
        // }
        return imgUrl===url ? true : false;
      }

    }
  }

  export default {
    openExistScene
}