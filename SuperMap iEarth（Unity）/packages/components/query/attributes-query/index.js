import query from './attributes-query.vue';

query.install = function (app) {
    app.component('SmAttributesQuery', query);
};

export default query;
