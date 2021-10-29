import isoline from './terrain-isoline.vue';

isoline.install = function (app) {
    app.component('SmTerrainIsoline', isoline);
};

export default isoline;
