import roller from './roller.vue';

roller.install = function (app) {
    app.component('SmRoller', roller);
};

export default roller;
