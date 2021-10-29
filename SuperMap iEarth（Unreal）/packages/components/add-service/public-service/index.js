import publicService from './public-service.vue';

publicService.install = function (app) {
    app.component('SmPublicService', publicService);
};

export default publicService;
