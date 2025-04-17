/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 解决：类型“Window & typeof globalThis”上不存在属性“SuperMap3D”。
declare interface Window {
  // 全局访问属性
  SuperMap3D: any,
  SuperMap: any,
  viewer: any,
  scene: any,
  axios: any,

  // 打开场景
  OpenConfig:any,

  // 在public/config下绑定的配置项
  layerServiceData: any,
  tokenConfig: any,
  skitConfig: any,
  initViewerConfig: any,
  customConfig: any,
  iEarthCustomFunc: any,

  // 语言资源环境相关
  lang_support_list: any,
  lang_default: string,
  lang_data: any,
  $t: any,

  // 仅用于打印信息
  iEarthConsole: boolean,

  // 用于绑定在iEarth上的信息和工具
  iEarthBindData: any,
  iEarthTool:any,


  // 图层列表信息
  layerTreeData: any,

  // 待后续剔除
  editHandler: any,
  L: any, // 二维地图库：iclient-leaflet
}

//全局声明Cesium和viewer
declare var SuperMap3D : Window.SuperMap3D;
declare var SuperMap : Window.SuperMap;
declare var viewer : Window.viewer;
declare var scene : Window.scene;
declare var axios : Window.axios;
declare var editHandler : Window.editHandler;
declare var L : Window.L;
declare var iEarthConsole : Window.iEarthConsole;
declare var lang_support_list : Window.lang_support_list;
declare var lang_default : Window.lang_default;
declare var lang_data : Window.lang_data;
declare var $t : Window.$t;
declare var iEarthBindData : window.iEarthBindData;
declare var iEarthTool : window.iEarthTool;
declare var layerTreeData : window.layerTreeData;
declare var layerServiceData : window.layerServiceData;
declare var tokenConfig : window.tokenConfig;
declare var skitConfig : window.skitConfig;
declare var initViewerConfig : window.initViewerConfig;
declare var customConfig : window.customConfig;
declare var iEarthCustomFunc : window.iEarthCustomFunc;
declare var OpenConfig : window.OpenConfig;