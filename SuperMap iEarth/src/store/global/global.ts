import { defineStore } from 'pinia';
import { GlobalStateType } from './global.d'

export const GlobalStoreCreate = defineStore({
  id: 'globalStoreState', // id必填，且需要唯一
  state: (): any => ({
    headerFold: true, // 页头是否折叠，默认为折叠
    SceneLayerChangeCount: 0, // 用来更新图层树的，当我们向场景中添加或者删除一个图层，让其自增++，在layerTree中监听他，一旦发生改变，就调用updateTree更新图层树，从而实现实时刷新
    isViewer: false, // Cesium.Viewer这个东西初始化完成的标志
    showSavePanel: false, // 保存面板是否显示
    isEditMode: false, // iportal中用来控制保存面板的与showSavePanel搭配使用，以便适应不同环境
    layerTreeCheckedKeys: { // iportal中保存场景，有些图层没有勾选（隐藏不显示），就不保存，这个对象是哪里存储勾选了的
      s3mLayerCheckedList: [], // S3M图层
      imageryLayerCheckedList: [], // 影像图层
      mvtLayerCheckedList: [], // MVT图层（其实场景中一般只有一个）
    },
    MVTLayerNameList: [], // 用来存储添加到场景中MVT图层的名称，在删除MVT图层时会用到
    currentLanguage: '', // 当前语言
    // 时间  这里先做一下保存 后面要改
    storageSceneCurrentTime: ''
  }),
  actions: {
  }


});
