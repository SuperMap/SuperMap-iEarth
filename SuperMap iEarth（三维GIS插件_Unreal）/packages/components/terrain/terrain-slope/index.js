import slope from './terrain-slope.vue';

slope.install = function (app) {
    app.component('SmTerrainSlope', slope);
};

export default slope;
