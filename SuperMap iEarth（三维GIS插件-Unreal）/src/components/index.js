/***
 * 全局注册ui界面组件
 * */

// iearth的ui组件
import measure from './measure.vue'
import layerTree from './layer-tree.vue'
import analysis from './analysis.vue'
import addLayer from './add-layer.vue'
// import clip from './clip.vue'
import terrain from './terrain.vue'
import scene from './scene.vue'

const components = [
    measure,
    layerTree,
    analysis,
    addLayer,
    // clip,
    terrain,
    scene
];

const names = [
    'measure',
    'layerTree',
    'analysis',
    'addLayer',
    // 'clip',
    'terrain',
    'scene'
]

const install = (app, options) => {
    if (install.installed) return;
    install.installed = true;
    components.forEach((component,i) => {
        app.component(names[i], component);
    });
};


export default {
    install,
    components,
};






