import axios from '../../../static/js/axios.min';
import Vue from 'vue';
import { getAccount } from './account';
import cloneDeep from 'lodash.clonedeep';
import Authenticate from '@ispeco/authentication-sdk';

const axiosService = axios.create({
  baseURL: process.env.API_ROOT, // 接口的域名地址
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
});
export default function request(url, params = {}, method = 'get', withCredentials = true, loginCheck = true) {
  if (loginCheck) {
    return new Promise((resolve, reject) => {
      getAccount()
        .then(res => {
          realRequest(url, params, method, withCredentials, resolve, reject);
        })
        .catch(() => {
          Vue.prototype.$loading && Vue.prototype.$loading.hide();
          let loginComponent = Vue.prototype.$loginPopup;
          loginComponent.show();
          loginComponent.$on('login-success', () => {
            loginComponent.hide();
            realRequest(url, params, method, withCredentials, resolve, reject);
          });
          loginComponent.$on('login-failed', e => {
          });
          loginComponent.$on('login-cancel', e => {
            setTimeout(() => {
              reject(new Error());
            }, 0);
          });
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method,
        withCredentials,
        loginCheck
      };
      if (method.toLowerCase() === 'get') {
        options.params = params;
      } else {
        options.data = params;
      }
      axiosService(options)
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
function realRequest(url, params = {}, method = 'get', withCredentials = true, resolve, reject) {
  const options = {
    url,
    method,
    withCredentials
  };
  if (method.toLowerCase() === 'get') {
    options.params = params;
  } else {
    options.data = params;
  }
  axiosService(options)
    .then(res => {
      resolve(res.data);
    })
    .catch(error => {
      reject(error);
    });
}

export function showLoginBox(option = {}) {
  const { authSucceed, ...restOption } = option;
  const authInstance = new Authenticate({
    loginOptions: {
      theme: 'dark',
      logoUrl: replativePath2FullPath('./static/images/logo.ico'),
    },
    onSucceed: authSucceed,
    ...restOption
  });
  authInstance.create();
}

export function getIPortalUrl() {
  return process.env.IPORTAL_URL || _getRootUrl();
}

export function getOnlineUrl() {
  return 'https://www.supermapol.com';
}

export function getDatavizUrl(id) {
  let withId = id ? `?id=${id}` : '';
  return `${getIPortalUrl()}/apps/dataviz/edit.html${withId}`;
}

export function urlHasLocalhost(url) {
  return url.indexOf('://localhost') > -1;
}

export function getiPortalDataUrl(url, type, dataId) {
  if (!url) {
    return;
  }
  if (!urlHasLocalhost(url)) {
    return url;
  }
  if (!dataId) {
    let arr = url && url.split(type);
    dataId = arr && arr.length > 1 && arr[1];
  }
  return dataId && getIPortalUrl() + type + dataId;
}
export function isSuperMapOnline() {
  let url = window.location.href;
  let testIndex = url.indexOf('https://itest.supermapol.com/apps');
  let onlineIndex = url.indexOf('https://www.supermapol.com/apps');
  return testIndex > -1 || onlineIndex > -1;
}

export function getProxy(type = 'data') {
  let extType = 'json';
  if (type === 'image') {
    extType = 'png';
  }
  return `${getIPortalUrl()}/apps/viewer/getUrlResource.${extType}?url=`;
}
/**
 * 获取url的某个查询参数值
 */
export function getQueryValue(url, key) {
  const reg = new RegExp('(^|&|\\?)' + key + '=([^&]*)(&|$)');
  const match = reg.exec(url);
  if (match && match.length >= 3) {
    return match[2];
  }
  return null;
}
/**
 * 获取?前的url
 */
export function getURL(url) {
  if (url.indexOf('?') > -1) {
    return url.split('?')[0];
  }
  return url;
}
/**
 * 向url追加参数
 * appendQueryParam(window.location.href, { action: 'view', mode :'aaa'})
 */
export function appendQueryParam(url, queryParam) {
  for (const key in queryParam) {
    const value = queryParam[key];
    if (!value) {
      continue;
    }
    const reg = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = url.indexOf('?') !== -1 ? '&' : '?';
    if (url.match(reg)) {
      url = url.replace(reg, '$1' + key + '=' + value + '$2');
    } else {
      url = url + separator + key + '=' + value;
    }
  }
  return url;
}

// 下载存储的iportal地址
let savedRootUrl = '';
function _getRootUrl(url = window.location.href) {
  if (savedRootUrl) {
    return savedRootUrl;
  }
  // 在iportal 内部访问的时候
  const appsIndex = url.indexOf('apps');
  // http://lab.supermapol.com/iwebi/ 这种情况访问的时候
  let labIndex = url.indexOf('lab.supermapol.com');
  if (labIndex > -1) {
    return 'http://lab.supermapol.com/';
  }
  return appsIndex > -1 ? url.substring(0, appsIndex - 1) : window.location.origin;
}
export const getConfigData = () => {
  // 下载的预览页zip包，获取config.json文件
  return axios({
    method: 'get',
    url: './config.json',
    responseType: 'json'
  })
    .then(res => res.data)
    .catch(error => {
      throw new Error(error);
    });
};

axiosService.interceptors.request.use(
  // 请求拦截
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axiosService.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        // 返回 401 清除token信息并跳转到登录页面
        // permissionDeniedHandler();
      }
    }
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
  }
);

// 获取自定义组件国际化配置文件
export const getCustomLanguage = language => {
  return axios({
    method: 'get',
    url: `./static/locale/${language}.json`,
    responseType: 'json'
  })
    .then(res => res.data)
    .catch(() => {
      return undefined;
    });
};

// 获取自定义组件配置文件
export const getCustomComponentConfig = () => {
  const customBaseUri = `${getIPortalUrl()}/resources/mapDashboard/customComponents`;
  return axios({
    method: 'get',
    url: `${customBaseUri}/components.json`,
    responseType: 'json'
  })
    .then(res => res.data)
    .catch(() => {
      return undefined;
    });
};
// 获取自定义组件-renderer/setting
export const getCustomComponent = uri => {
  const customBaseUri = `${getIPortalUrl()}/resources/mapDashboard/customComponents`;
  return axios({
    method: 'get',
    url: `${customBaseUri}/${uri}.js`
  })
    .then(res => res.data)
    .catch(() => {
      return undefined;
    });
};

export function setSavedRootUrl(rootUrl) {
  savedRootUrl = rootUrl;
}

export function getDashboardConfig() {
  return axios({
    method: 'get',
    url: './static/dashboard.json'
  })
    .then(res => res.data)
    .catch(() => {
      return undefined;
    });
}

export function replaceLocalhostToIportalUrl(datas, rootUrl) {
  const nextDatas = cloneDeep(datas);
  let iportalUrl = rootUrl;
  if (!iportalUrl) {
    const localhostIportalReg = /(.*)\/web\/datas.*/;
    const matchData = Object.values(datas).find(data => data.dataInfo && data.dataInfo.url.match(localhostIportalReg));
    if (matchData) {
      iportalUrl = matchData.dataInfo.url.replace(localhostIportalReg, '$1');
    }
  }
  if (iportalUrl) {
    for (let key in nextDatas) {
      const data = nextDatas[key];
      if (data.dataInfo && urlHasLocalhost(data.dataInfo.url)) {
        data.dataInfo.url = data.dataInfo.url.replace(iportalUrl, getIPortalUrl());
      }
    }
  }
  return nextDatas;
}

export function replaceReplativeUrl(datas) {
  const replativeReg = /^(\.\/static|static).+/;
  const nextDatas = cloneDeep(datas);
  for (let key in nextDatas) {
    const data = nextDatas[key];
    const dataInfo = data.dataInfo;
    if (dataInfo && replativeReg.test(dataInfo.url)) {
      const originUrl = dataInfo.url;
      const fullPath = replativePath2FullPath(dataInfo.url);
      data.dataInfo.url = fullPath;
      if (originUrl === data.dataInfo.id) {
        data.dataInfo.id = fullPath;
      }
    }
  }
  return nextDatas;
}

export function replativePath2FullPath(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.href;
}

export function getPredefinedTemplate(path) {
  return axios({
    method: 'get',
    url: path
  })
    .then(res => res.data)
    .catch(() => {
      return undefined;
    });
}
