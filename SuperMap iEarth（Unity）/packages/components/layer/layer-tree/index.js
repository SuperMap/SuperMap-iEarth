import layerTree from './layer-tree.vue';

layerTree.install = function (app) {
    app.component('SmLayerTree', layerTree);
};

export default layerTree;
