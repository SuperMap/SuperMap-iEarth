import { defineStore } from 'pinia';
import { GlobalStateType } from './global.d'

export const GlobalStoreCreate = defineStore({
  id: 'globalStoreState', // id必填，且需要唯一
  state: (): GlobalStateType => ({
    headerFold: true, // 页头是否折叠，默认为折叠
    SceneLayerChangeCount: 0, // 用来更新图层树的，当我们向场景中添加或者删除一个图层，让其自增++，在layerTree中监听他，一旦发生改变，就调用updateTree更新图层树，从而实现实时刷新
    isViewer: false, // Cesium.Viewer这个东西初始化完成的标志
    isEditMode: false,// 是否为iportal场景编辑模式
    layerTreeCheckedKeys: { // iportal中保存场景，有些图层没有勾选（隐藏不显示），就不保存，这个对象是哪里存储勾选了的
      s3mLayerCheckedList: [], // S3M图层
      imageryLayerCheckedList: [], // 影像图层
      mvtLayerCheckedList: [], // MVT图层（其实场景中一般只有一个）
    },
    currentLanguage: '', // 当前语言
    storageSceneCurrentTime: '', // 时间,这里先做一下保存,后面要改
    isNormalMode: false,
  }),
  actions: {}
});
