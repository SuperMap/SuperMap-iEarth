import { defineStore } from 'pinia';
import { CurrentComponenentNameType } from './panel.d'

export const PanelStoreCreate = defineStore({
  id: 'PanelStoreState', // id必填，且需要唯一
  state: (): any => {
    return {
      currentComponenentName: '', //这里不能有值，不然panle-bg背景图片会有点问题
      panelShow: false, // 控制操作面板的显隐
      panelBgName: '', // 操作面板背景图片名称（全局化，因为这个背景图片机制按照设计稿来实现有点麻烦复杂，我实现了一部分用来演示，如果完全按照设计稿，有点恼火）
      
    };
  }
});
