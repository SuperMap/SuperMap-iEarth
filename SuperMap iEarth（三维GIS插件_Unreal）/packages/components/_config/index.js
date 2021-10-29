import config from './config-provider.vue';

config.install = function (app) {
    app.component("smConfigProvider", config);
};

export default config;
