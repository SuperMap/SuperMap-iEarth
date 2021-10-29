import tree from './com-layer-tree.vue';

tree.install = function (app) {
    app.component('ComLayerTree', tree);
};

export default tree;
