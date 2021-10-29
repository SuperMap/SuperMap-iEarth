import flood from './flood.vue';

flood.install = function (app) {
    app.component('SmFlood', flood);
};

export default flood;
