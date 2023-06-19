/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 解决：类型“Window & typeof globalThis”上不存在属性“Cesium”。
declare interface Window {
  Cesium: any,
  viewer: any,
  scene: any,
  axios: any,
  editHandler:any,
  LangGlobal:any, // 全局语言管理
}

//全局声明Cesium和viewer
declare var viewer : Window.viewer
declare var Cesium : Window.Cesium
declare var SuperMap3D : Window.SuperMap3D
declare var h337 : Window.h337