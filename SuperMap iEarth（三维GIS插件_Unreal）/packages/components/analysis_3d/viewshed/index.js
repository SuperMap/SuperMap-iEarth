import viewshed from './viewshed.vue';

viewshed.install = function (app) {
    app.component('SmViewshed', viewshed);
};

export default viewshed;
