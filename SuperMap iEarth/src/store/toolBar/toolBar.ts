import { defineStore } from 'pinia';
import { ToolStateType } from './toolBar.d'

export const toolBarStoreCreate = defineStore({
  id: 'toolBarStoreState', // id必填，且需要唯一
  state: (): any => {
    return {
      leftToolBarData: [
        {
          id: 1,
          title: "global.t_layerList",
          label: '图层列表',
          name: "layerList",
          iconName: "ui-toolbar-layer",
          isShow: false
        },
        {
          id: 2,
          title: "global.t_addData",
          label: '添加数据',
          name: "addData",
          iconName: "ui-toolbar-addData",
          isShow: false
        }
      ],
      rightToolBarData: [
        {
          id: 3,
          title: "global.t_analyse3d",
          label: '三维分析',
          name: "analyseSeries",
          iconName: "iconfenxi",
          isShow: false
        },
        {
          id: 4,
          title: "global.t_measure",
          label: '量算',
          name: "measure",
          iconName: "iconliangsuan",
          isShow: false
        },
        {
          id: 5,
          title: "global.t_sceneProperties",
          label: '场景属性',
          name: "sceneProperties",
          iconName: "iconkapianshi",
          isShow: false
        },
        {
          id: 6,
          title: "global.t_objectPainting",
          label: '对象绘制',
          name: "objectPainting",
          iconName: "iconhuizhi",
          isShow: false
        },
      ],
      analyseSeries: [ // 三维分析
        {
          id: 1,
          title: "global.analysis3d",
          label: "三维分析",
          name: "analysis3d",
          iconName: "iconkongjianfenxi",
        },
        {
          id: 2,
          title: "global.clip",
          label: "裁剪",
          name: "clip",
          iconName: "iconjianqie",
        },
        {
          id: 3,
          title: "global.terrainOperation",
          label: "地形操作",
          name: "terrainOperation",
          iconName: "icondixing",
        },

      ],
    };
  },

  actions: {
    setToolBarShow(id: any, isShow: Boolean) {
      switch (id) {
        case 1:
          this.leftToolBarData[0].isShow = isShow;
          this.leftToolBarData[1].isShow = false;
          break;
        case 2:
          this.leftToolBarData[0].isShow = false;
          this.leftToolBarData[1].isShow = isShow;
          break;
        case 3:
          this.rightToolBarData[0].isShow = isShow;
          this.rightToolBarData[1].isShow = false;
          this.rightToolBarData[2].isShow = false;
          this.rightToolBarData[3].isShow = false;
          break;
        case 4:
          this.rightToolBarData[0].isShow = false;
          this.rightToolBarData[1].isShow = isShow;
          this.rightToolBarData[2].isShow = false;
          this.rightToolBarData[3].isShow = false;
          break;
        case 5:
          this.rightToolBarData[0].isShow = false;
          this.rightToolBarData[1].isShow = false;
          this.rightToolBarData[2].isShow = isShow;
          this.rightToolBarData[3].isShow = false;
          break;
        case 6:
          this.rightToolBarData[0].isShow = false;
          this.rightToolBarData[1].isShow = false;
          this.rightToolBarData[2].isShow = false;
          this.rightToolBarData[3].isShow = isShow;
          break;
        default:
          break;
      }
    }
  }

});
