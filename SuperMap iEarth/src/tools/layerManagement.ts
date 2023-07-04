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
  function openScene(url: string, type: any) {
    if (checkURL(url)) {
      let promiseArray = [
        window.viewer.scene.open(url, undefined, { autoSetView: true }),
      ];
      SuperMap3D.when.all(promiseArray, function (layers: any) {
        layerStore.updateLayer({ type: "s3m" });
      });
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
    window.viewer.scene
      .addS3MTilesLayerByScp(url, {
        name: sceneName,
      })
      .then((layer: any) => {
        window.viewer.flyTo(layer);
        layer.lodRangeScale = 5;
        layer.style3D.fillStyle = SuperMap3D.FillStyle.Fill_And_WireFrame;
        let initialColor = "rgb(67,67,67)";
        layer.style3D.lineColor =
          SuperMap3D.Color.fromCssColorString(initialColor);
        layer.wireFrameMode = SuperMap3D.WireFrameType.Sketch; //草图模式,即线框
        layer._visibleDistanceMax = 60000;
  
        layerStore.updateLayer({ type: "s3m" });
      });
  }

// 根据输入的lauerUrl，自动匹配其图层名称
function getLayerNameFromUrl(url: any): any {
    if (url.indexOf('/config') != -1) {
        let list = url.split('/datas/')
        if (list.length === 2) {
            let layerNameFromUrl = list[1].split('/')[0]
            return layerNameFromUrl;
        }
    }

    return ''
}


// 传入影像图层，获取并返回他在项目中的名称
function getImageryLayerName(imageryLayer: any) {
    let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;

    if(!imageUrl) return '经纬底图';

    if(imageUrl.indexOf("earth-skin.jpg")!=-1){
        return '默认影像';
    }

    let targetItem =  onlineBaseLayerList.value.find((item: any) => item.url === imageUrl)
    if (targetItem) {
        return targetItem.name;
    }else if(imageUrl){
    //    let otherImageLayerName = imageUrl.split('realspace/services/')[1].split('/rest/realspace')[0]

        if(imageUrl.indexOf("realspace/datas/")!=-1){
            let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
            return otherImageLayerName;
        }else{
            return '未命名图层';
        }
    }else{
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

export default {
    openScene,
    addMvtLayer,
    addBaiMo,
    getLayerNameFromUrl,
    getImageryLayerName,
    getTerrainLayerName
}

