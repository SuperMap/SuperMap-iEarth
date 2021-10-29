import Viewer from './viewer.vue';

Viewer.install = function (app) {
    app.component('viewer', Viewer);
};
export default Viewer;
