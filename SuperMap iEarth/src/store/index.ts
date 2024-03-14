export { useLayerStore } from './layerStore/layer';
export { usePanelStore } from './panelStore/index';
export { IportalStoreCreate } from './iportalManage/index';


import { createPinia } from 'pinia'
// 引入持久化存储插件
import PiniaPluginPersist from 'pinia-plugin-persist'

const store: any = createPinia();
store.use(PiniaPluginPersist);

export default store;