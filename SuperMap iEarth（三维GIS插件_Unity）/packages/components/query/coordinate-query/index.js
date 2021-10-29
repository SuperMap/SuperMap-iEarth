import query from './coordinate-query.vue';

query.install = function (app) {
    app.component('SmCoordinateQuery', query);
};

export default query;
