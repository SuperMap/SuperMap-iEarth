/***
 * 完整组件js
 * 统一打包组件库
 * */

import store from "./js/store/store";
export { default as store } from './js/store/store';
export { default as enUS } from './js/locales/enUS';
export { default as darkTheme } from './js/theme/darkTheme';

// 引入组件
import viewer from './components/viewer/index.js'       //viewer组件
import config from './components/_config/index.js'
import measure from './components/measure/index'
import layerTree from './components/layer/layer-tree/index'
import sightline from './components/analysis_3d/sight-line/index'
import skyline from './components/analysis_3d/sky-line/index'
import viewshed from './components/analysis_3d/viewshed/index'
import customService from './components/add-service/custom-service/index'
import publicService from './components/add-service/public-service/index'
import flood from './components/analysis_3d/flood/index'
import clipBox from './components/clip/clip-box/index'
import slope from './components/terrain/terrain-slope/index'
import isoline from './components/terrain/terrain-isoline/index'
import query from './components/query/attributes-query/index'
import coordinate from './components/query/coordinate-query/index'



import comLayerTree from './components/_common/com-layer-tree/index'

const components = [
    viewer,
    config,
    measure,
    layerTree,
    sightline,
    skyline,
    viewshed,
    customService,
    publicService,
    flood,
    clipBox,
    slope,
    isoline,
    query,
    coordinate,


    comLayerTree
];

const install = (app, options) => {
    if (install.installed) return;
    install.installed = true;
    app.use(store, options);
    components.forEach(component => {
        app.use(component);
    });
};


export default {
    install,
    components,
};






