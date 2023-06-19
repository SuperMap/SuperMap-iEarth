// 这一句必须加，和以前直接在main.ts中直接引入不同，因为有个模块加载和引用先后的问题，具体参考: https://blog.csdn.net/zlting_/article/details/127495583
import store from '../store';

import { GlobalStoreCreate } from '../store/global/global';
import { storeToRefs } from 'pinia';
import { UrlDataSetCreate } from '../store/layerUrlSet/dataSet';

// import { useLayerTreeStore } from "@/store/index";
import { useLayerTreeStore } from "@/store/layerTreeStore/index";



const GlobalStore = GlobalStoreCreate(store); /// nnn
const urlDataSetStore = UrlDataSetCreate(store);
const { onlineBaseLayerList } = storeToRefs(urlDataSetStore);
const layerTreeStore = useLayerTreeStore();

const Cesium = window.SuperMap3D;
const viewer = window.viewer;

enum SceneType {
    Scene = 'SCENE',
    S3M = 'S3M'
}

// 检验url地址
function checkURL(url: string) {
    if (url === null || url === "") {
        return false;
    }
    if (url.charAt(0) == '"' || url.charAt(0) == "'") {
        let reg = /^['|"](.*)['|"]$/;
        url = url.replace(reg, "$1");
    }
    return true
};

// 根据输入的lauerUrl，自动匹配其图层名称
function getLayerNameFromUrl(url: string): string {
    if (url.indexOf('/config') != -1) {
        let list = url.split('/datas/')
        if (list.length === 2) {
            let layerNameFromUrl = list[1].split('/')[0]
            return layerNameFromUrl;
        }
    }

    return ''
}

// 根据传入的promiseList，加载s3m和场景函数
function promiseWhen(promiseArray: any, callback: any, type: SceneType) {
    Cesium.when.all(
        promiseArray,
        function (layers: any) {
            debugger
            console.log("layerTreeStore.layerList", layerTreeStore.layerList);
            layerTreeStore.updatelayerList();
            callback(layers[0], type);
            // return Promise.resolve('hhhhhh'); // 尝试将回调callBack改为promise形式

        },
        function (e: any) {
            let widget = window.viewer.cesiumWidget;
            if (widget._showRenderLoopErrors) {
                let title = '请检查url地址是否正确？';
                widget.showErrorPanel(title, undefined, e);
            }
        }
    );
};

// 打开realSpace场景
function openScene(url: string, options?: any, callback?: any) {
    if (options && options.SceneToken) {
        Cesium.Credential.CREDENTIAL = new Cesium.Credential(options.SceneToken);
    }
    let flag = true;
    if (options && options.autoSetView) {
        flag = options.autoSetView
    }
    if (checkURL(url)) {
        try {
            let s = [window.viewer.scene.open(url, undefined, { 'autoSetView': flag })];
            promiseWhen(s, callback, SceneType.Scene);
        } catch (e) {
            let widget = window.viewer.cesiumWidget;
            if (widget._showRenderLoopErrors) {
                let title = "渲染时发生错误，已停止渲染。";
                widget.showErrorPanel(title, undefined, e);
            }
        }
    }
}

// 添加MVT服务
function addMvtLayer(LayerURL: string, name: string, callback?: any) {    // 返回img图层layer
    try {
        let mvtMap = window.viewer.scene.addVectorTilesMap({
            url: LayerURL,
            canvasWidth: 512,
            name: name || 'mvt',
            viewer: window.viewer
        });

        Cesium.when(mvtMap.readyPromise, function (data: any) {
            GlobalStore.MVTLayerNameList.push(name); // 存入MVT图层名称，以便删除
            var bounds = mvtMap.rectangle;
            window.viewer.scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromRadians(
                    (bounds.east + bounds.west) * 0.5,
                    (bounds.north + bounds.south) * 0.5,
                    10000
                ),
                duration: 0,
                orientation: {
                    heading: 0,
                    roll: 0
                }
            });
            callback(mvtMap)
        });
        return mvtMap
    } catch (e) {
        let widget = window.viewer.cesiumWidget;
        if (widget._showRenderLoopErrors) {
            let title = "渲染时发生错误，已停止渲染。";
            widget.showErrorPanel(title, undefined, e);
        }
    }

};

// 添加白膜
function addBaiMo(url: string, sceneName?: string) {
    // let infos = [
    //     {
    //       url: url,
    //       cullEnabled: true
    //     }
    //   ];
    //   let scene = viewer.scene
    //   let promises = [];
    //   for (let i = 0; i < infos.length; i++) {
    //     let promise = scene.addS3MTilesLayerByScp(url, {
    //       name: sceneName
    //     });
    //     promises.push(promise);
    //   }
    //   Cesium.when.all(promises, function(layers:any[]) {
    //     // console.log("layers:",layers)
    //     let layer = scene.layers.find(sceneName);
    //     viewer.flyTo(layer);
    //     layer.lodRangeScale = 5;
    //     layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
    //     let initialColor = "rgb(67,67,67)";
    //     layer.style3D.lineColor = Cesium.Color.fromCssColorString(initialColor);
    //     layer.wireFrameMode = Cesium.WireFrameType.Sketch; //草图模式,即线框
    //     layer._visibleDistanceMax = 60000;
    //   });

    window.viewer.scene.addS3MTilesLayerByScp(url, {
        name: sceneName
    }).then((layer: any) => {
        // console.log("layer:",layer)
        // let layer = viewer.scene.layers.find(sceneName);
        window.viewer.flyTo(layer);
        layer.lodRangeScale = 5;
        layer.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
        let initialColor = "rgb(67,67,67)";
        layer.style3D.lineColor = Cesium.Color.fromCssColorString(initialColor);
        layer.wireFrameMode = Cesium.WireFrameType.Sketch; //草图模式,即线框
        layer._visibleDistanceMax = 60000;
    })
}

// 传入影像图层，获取并返回他在项目中的名称
function getImageryLayerName(imageryLayer: any): string {

    let imageUrl = imageryLayer._imageryProvider.url || imageryLayer._imageryProvider._url;

    if (!imageUrl) return window.LangGlobal.global.lnglatMap;

    if (imageUrl.indexOf("earth-skin.jpg") != -1) {
        return window.LangGlobal.global.defaultImage;
    }

    let targetItem = onlineBaseLayerList.value.find((item: any) => item.url === imageUrl)

    if (targetItem) {
        let imgName = targetItem.name.split(".")[1];
        return window.LangGlobal.global[imgName];
    } else if (imageUrl) {
        //    let otherImageLayerName = imageUrl.split('realspace/services/')[1].split('/rest/realspace')[0]

        if (imageUrl.indexOf("realspace/datas/") != -1) {
            let otherImageLayerName = imageUrl.split('realspace/datas/')[1].replace('/', '');
            return otherImageLayerName;
        } else {
            return window.LangGlobal.global.unnamedLayer;
        }
    } else {
        return window.LangGlobal.global.unnamedLayer;
    }
}

// 获取地形图层名称
function getTerrainLayerName(): string {
    if (window.viewer.terrainProvider._baseUrl) {
        let baseUrl = window.viewer.terrainProvider._baseUrl
        if (baseUrl.indexOf('3D-stk_terrain') != -1) {
            return window.LangGlobal.global.stkTerrain;
        } else {
            if (baseUrl.indexOf('supermapol.com') != -1) {
                return baseUrl.split('realspace/services/')[1].split('/rest/realspace')[0]
            } else {
                return window.LangGlobal.global.unnamedTerrain;
            }
        }
    } else if (window.viewer.terrainProvider._urls) {
        let url0 = window.viewer.terrainProvider._urls[0]
        if (url0.indexOf('supermapol.com') != -1) {
            return window.LangGlobal.global.superMapTerrain;
        } else {
            return window.LangGlobal.global.tiandituTerrain; // viewer.terrainProvider._urls[0].indexOf('tianditu') 看情况在加
        }
    } else {
        // return '标准椭球'
        return window.LangGlobal.global.noTerrain;
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

