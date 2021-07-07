// import Vue from 'vue'
import App from './App.vue'

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  error: require('@/../static/images/thumbnail.jpg'),
  loading: require('@/../static/images/loading.jpg')
})


import "./common/scss/globe.scss"; //全局样式
import store from "@/store/store.js" // 局部变量状态管理
window.store = store;

// 工具配置
import Resource from "./common/js/language" //语言选择
Vue.prototype.Resource = window.Resource = Resource;
import URL_CONFIG from './common/js/config';
window.URL_CONFIG = URL_CONFIG;
import tooltip from './common/js/tooltip';
window.createTooltip = tooltip;

//组件引用
import components from './components/index'
Vue.use(components);
new Vue({
  el: '#app',
  render: h => h(App)
})
