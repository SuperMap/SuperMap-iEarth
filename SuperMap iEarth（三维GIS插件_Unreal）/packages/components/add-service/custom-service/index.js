import custom from './custom-service.vue';

custom.install = function (app) {
    app.component('SmCustomService', custom);
};

export default custom;
