/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 解决：类型“Window & typeof globalThis”上不存在属性“SuperMap3D”。
declare interface Window {
  SuperMap3D: any,
  viewer: any,
  scene: any,
  axios: any,
  editHandler:any,
  L:any, // 二维地图库：iclient-leaflet
  EarthGlobal:any, 
  iEarthConsole:boolean,
  lang_support_list:any,
  lang_default:string,
  lang_data:any,
  $t:any,
  layerServiceData:any,
  configToken:any
}

//全局声明Cesium和viewer
declare var viewer : Window.viewer
declare var SuperMap3D : Window.SuperMap3D
declare var h337 : Window.h337
declare var L : Window.L
declare var EarthGlobal : Window.EarthGlobal
declare var iEarthConsole : Window.iEarthConsole
declare var lang_support_list : Window.lang_support_list
declare var lang_default : Window.lang_default
declare var lang_data : Window.lang_data
declare var $t : Window.$t
declare var layerServiceData : window.layerServiceData
declare var configToken : window.configToken
