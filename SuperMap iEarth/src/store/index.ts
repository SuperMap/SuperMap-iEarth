
import { createPinia } from 'pinia'
// 引入持久化存储插件
import PiniaPluginPersist from 'pinia-plugin-persist'

export { useLayerTreeStore } from './layerTreeStore/index';

const store: any = createPinia();
store.use(PiniaPluginPersist);

export default store

