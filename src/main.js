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

//引入portal处理公共类
import {
  getRootUrl
} from './common/js/portalTools'

//组件引用
import components from './components/index'
Vue.use(components);
const vue = new Vue({
  render: h => h(App)
})

function mountVue() {
  vue.$mount('#app');
}

window.store.isPortal = true;

//获取iport配置及用户信息
function initPortal() {
  let userProfileUrl = getRootUrl() + "web/config/userprofile.json";
  let portalConfigUrl = getRootUrl() + "web/config/portal.json";
  let systemJSONUrl = getRootUrl() + "web/config/system.json";
  //验证用户的登录状态
  let userInfoPromise = window.axios.get(userProfileUrl, {
    //需要cookie验证
    withCredentials: true
  });
  let portalConfigPromise = window.axios.get(portalConfigUrl);
  let portalSystemPromise = window.axios.get(systemJSONUrl);
  Promise.all([userInfoPromise, portalConfigPromise, portalSystemPromise]).then(results => {
    window.store.portalUserprofile = results[0].data;
    window.store.portalConfig = results[1].data;
    window.store.systemConfig = results[2].data;
    mountVue();
  }).catch(e => {
    mountVue();
  });
}



if (window.store.isPortal) {
  initPortal();
} else {
  mountVue();
}