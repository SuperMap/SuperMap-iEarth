<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="overridesTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <dialog-content></dialog-content>
        <loading-content></loading-content>
        <n-notification-provider>
          <n-message-provider>
            <message-content></message-content>
            <I18n></I18n>
            <layout></layout>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { I18n } from "@/components/I18n";
import { MessageContent } from "@/components/Plugins/MessageContent";
import { DialogContent } from "@/components/Plugins/DialogContent";
import { LoadingContent } from "@/components/Plugins/LoadingContent";
import { loadAsyncComponent } from "@/utils/index";
import { darkTheme, zhCN, dateZhCN } from "naive-ui";

import {
  getRootUrl,
  isIportalProxyServiceUrl,
  getHostName,
} from "@/tools/iportal/portalTools";
import { onMounted, ref } from "vue";
import { useLayerTreeStore } from "@/store/layerTreeStore/index";

const layerTreeStore = useLayerTreeStore();

if (window.SuperMap3D) {
  window.Cesium = window.SuperMap3D;
}

onMounted(() => {
  openExistScene();
});

let iportalToken = ref(
  "?token=BTKYtyi2bsoLNUA2xn7nRg3V9IfETNnmskQhpsmCz8Q5ClFYCWGAMJSX1ESedBqCF1jFmHLY_20jhpHssvwNQg.."
);

// 如果打开是有保存的场景
function openExistScene() {
  let openExistSceneUrl = window.location.href;
  let parmeter = openExistSceneUrl.split("id=")[1];
  if (!parmeter) {
    return;
  }
  let sceneID = parmeter.split("&")[0];
  let requestUrl = "/web/scenes/" + sceneID + ".json";

  // let requestUrl = "web/scenes/" + "1229861295" + ".json";
  // let requestUrl = "web/scenes/" + "1229861295" + ".json";
  let rootUrl = getRootUrl();
  let url = rootUrl.includes("iportal")
    ? rootUrl + requestUrl
    : "/iportal" + requestUrl + iportalToken.value;

  window.axios.get(url, { withCredentials: true }).then(function (response) {
    openScene(response);
  });
}

// 打开已保存的场景
function openScene(response?: any) {
  let content = JSON.parse(response.data.content);

  if (content) {
    if (JSON.stringify(content.layers) !== "{}") {
      let layers = content.layers;
      //需要改动
      if (layers.s3mLayer.length !== 0) {
        openS3M(content);
      }
      if (layers.imageryLayer.length !== 0) {
        openImagery(content);
      }
      if (layers.MVTLayer.length !== 0) {
        openMVT(content);
      }
      if (layers.terrainLayer.length !== 0) {
        openTerrain(content);
      }
      setTimeout(() => {
        layerTreeStore.updatelayerList("REALSPACE");
        layerTreeStore.updateBaseTerrain(content.layers.terrainLayer[0]);
      }, 3000);
    }
    let cameraX = content.camera.position.x;
    let cameraY = content.camera.position.y;
    let cameraZ = content.camera.position.z;
    viewer.scene.camera.setView({
      destination: new Cesium.Cartesian3(cameraX, cameraY, cameraZ),
      orientation: {
        heading: content.camera.heading,
        pitch: content.camera.pitch,
        roll: content.camera.roll,
      },
    });
  } else if (response.data.url) {
    let realspaceUrl = response.data.url;
    let index = realspaceUrl.indexOf("/scenes");
    realspaceUrl = realspaceUrl.substring(0, index);

    setTrustedServers(realspaceUrl);

    viewer.scene.open(realspaceUrl);
  }
}

// 打开s3m
function openS3M(content: any) {
  let s3mlayer = content.layers.s3mLayer;
  if (s3mlayer.length > 0) {
    for (let t = 0; t < s3mlayer.length; t++) {
      let url = content.layers.s3mLayer[t].url;
      let name = content.layers.s3mLayer[t].name;
      setTrustedServers(url);
      viewer.scene.addS3MTilesLayerByScp(url, { name: name });
    }
  }
}

// 打开影像
function openImagery(content: any) {
  let imageryLayer = content.layers.imageryLayer;
  let imageryProvider;
  if (imageryLayer.length > 0) {
    for (let i = 0; i < imageryLayer.length; i++) {
      let url = content.layers.imageryLayer[i].url;
      if (url.length > 1) {
        setTrustedServers(url);
      }

      let imageryType = content.layers.imageryLayer[i].type;
      switch (imageryType) {
        case "BingMapsImageryProvider":
          imageryProvider = new Cesium.BingMapsImageryProvider({
            url: content.layers.imageryLayer[i].url,
            // key: state.key,
            key: "Av63hPkCmH18oGGn5Qg3QhLBJvknZ97xbhyw3utDLRtFv7anHjXNOUQbyWBL5fK5",
          });
          break;
        case "TiandituImageryProvider":
          imageryProvider = new Cesium.TiandituImageryProvider({
            url: content.layers.imageryLayer[i].url,
            // token: this.token
            // token: content.layers.imageryLayer[i].token,
            token: "7933ae29d47bcf1440889ad983dbe0af",
          });
          break;
        case "SingleTileImageryProvider":
          imageryProvider = new Cesium.SingleTileImageryProvider({
            url: content.layers.imageryLayer[i].url,
          });
          break;
        case "UrlTemplateImageryProvider":
          imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: content.layers.imageryLayer[i].url,
          });
          break;
        case "SuperMapImageryProvider":
          imageryProvider = new Cesium.SuperMapImageryProvider({
            url: content.layers.imageryLayer[i].url,
          });
          break;
        case "GRIDIMAGERY":
          imageryProvider = new Cesium.TileCoordinatesImageryProvider();
          break;
        default:
          break;
      }

      viewer.imageryLayers.addImageryProvider(imageryProvider);
    }
  }
}

// 打开mvt
function openMVT(content: any) {
  let MVTLayerUrlList = content.layers.MVTLayer;

  // MVTLayerUrlList.forEach((item) => {
  //   layerManagement.addMvtLayer(item.url, item.name);
  // });
}

// 打开地形
function openTerrain(content: any) {
  viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
  let terrainLayer = content.layers.terrainLayer;
  if (terrainLayer.length > 0) {
    let terrainType = content.layers.terrainLayer[0].type;

    let url = content.layers.terrainLayer[0].url;
    setTrustedServers(url);

    switch (terrainType) {
      case "StkTerrain":
        let flag: boolean;
        if (
          content.layers.terrainLayer[0].url.indexOf("3D-stk_terrain") != -1
        ) {
          // stk地形
          flag = false;
        } else {
          // 普通地形(自定义添加)
          flag = true;
        }
        viewer.terrainProvider = new Cesium.SuperMapTerrainProvider({
          url: content.layers.terrainLayer[0].url,
          isSct: flag,
        });
        break;
      case "tianDiTuTerrain":
        viewer.terrainProvider = new Cesium.TiandituTerrainProvider({
          // token: state.terrainToken,
          token: "e90d56e5a09d1767899ad45846b0cefd",
        });
        break;
      case "supermapOnlineTerrain":
        viewer.terrainProvider = new Cesium.SCTTerrainProvider({
          urls: [content.layers.terrainLayer[0].url],
        });
        break;
    }
  }
}

// 检查请求是否带cookie
function setTrustedServers(url) {
  // if (IportalStore.isPortal) {
  //   if (IportalStore.portalConfig) {
  //     let serviceProxy = IportalStore.portalConfig.serviceProxy;
  //     let withCredentials = isIportalProxyServiceUrl(url, serviceProxy);
  //     if (withCredentials) {
  //       let ip = getHostName(url);
  //       if (
  //         !Cesium.TrustedServers.contains(
  //           "http://" + ip + "/" + serviceProxy.port
  //         )
  //       ) {
  //         Cesium.TrustedServers.add(ip, serviceProxy.port);
  //       }
  //     }
  //   }
  // }
}

// 组件界面的入门vue文件：承载布局 组件 控件（这里必须异步调用，不然执行顺序会有问题）
const layout = loadAsyncComponent(() => import("@/views/layout.vue"));

// 读取scss变量
// import scssVariable from '@/stylesMine/variables.module.scss'
// console.log("scssVariable:",scssVariable)

// 重写主题样式
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const overridesTheme = {
  common: {
    // primaryColor: "#3499E5",
    primaryColor: "rgba(52, 153, 229, 1)",
    primaryColorHover: "rgba(52, 153, 229, 1)",
    primaryColorPressed: "rgba(255,255,255,0.85)",
    primaryColorSuppl: "rgba(255,255,255,0.45)",
  },
  Button: {
    textColor: "#fff",
    // textColor: scssVariable.midColorNormal,
  },
  Input: {
    color: "none",
    paddingRight: "12px", // 又不起作用
    border: "1px solid yellow;",
  },
  // 完全不起作用
  Tabs: {
    tabGap: "14px",
    tabgap: "14px",
    "tab-gap": "14px",
    "--n-tab-gap": "14px", //这四个都不行，但是打包后效果还行
    tabColor: "yellow", //这个起作用了
  },
  Checkbox: {
    colorChecked: "#3499E5",
    checkMarkColor: "#fff",
  },
  Slider: {
    fillColor: "#3499E5",
    fillColorHover: "#3499E5",
  },
  Switch: {
    railColorActive: "#3499E5",
  },
};
</script>

<style lang="scss">
.n-tabs .n-tabs-bar {
  background-color: #3499e5 !important;
}
.n-color-picker-trigger {
  border: none;
}
.n-layout .n-layout-scroll-container {
  overflow: visible;
}

.n-tree .n-tree-node-content .n-tree-node-content__text {
  max-width: 144px;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏超出元素的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.n-slider .n-slider-handles .n-slider-handle-wrapper .n-slider-handle {
  background: #414141;
  border: 3px solid #3499E5;
}
.n-slider .n-slider-handles .n-slider-handle-wrapper .n-slider-handle {
  height: 12px;
  width: 12px;
}
</style>