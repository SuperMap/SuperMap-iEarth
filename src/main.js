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
const vue = new Vue({
  render: h => h(App)
})

function mountVue(){
  vue.$mount('#app');
}

function getRootUrl () {
  const path = '/apps';
  let url = '';
  if (window.location.href.indexOf(path) !== -1) {
    url = window.location.href.substring(0, window.location.href.indexOf(path) + 1);
  }
  if (!url) {
    if (location.href.indexOf('/iportal/') !== -1) {
      url = `${location.protocol}//${location.host}/iportal/`;
    } else {
      url = `${location.protocol}//${location.host}/`;
    }
  }
  return url;
}

function getUserprofile(){
  let userProfileUrl = getRootUrl() + "web/config/userprofile.json";
  //验证用户的登陆状态
  Cesium.loadJson(userProfileUrl).then(function(data){
    window.store.portalUserprofile = data;
    mountVue();
  })
}

getUserprofile();