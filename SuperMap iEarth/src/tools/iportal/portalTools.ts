import axios from 'axios';
import { IportalStoreCreate } from "@/store/iportalManage/index";


function getRootUrl(suffix?: string) {
  var pathName = window.location.pathname.substring(1);
  var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
  suffix = suffix ? suffix : '';
  if (webName == "") {
    return window.location.protocol + '//' + window.location.host + suffix;
  }
  else {
    return window.location.protocol + '//' + window.location.host + '/' + webName + suffix;
  }
}

// 判断访问协议解决跨域问题（支持网站http和https访问）
// var ishttps = 'https:' == document.location.protocol ? true : false;
// // debugger
// // if (ishttps) {
// if (true) {
//   addMeta("Content-Security-Policy", "upgrade-insecure-requests")
// }

// function addMeta(http_equiv: any, content : any) { //手动添加mata标签
//   let meta = document.createElement('meta');
//   meta.httpEquiv = http_equiv;
//   meta.content = content;
//   document.getElementsByTagName('head')[0].appendChild(meta);
// }

function isIportalProxyServiceUrl(serviceUrl: string, serviceProxy: any) {
  if (serviceProxy && serviceProxy.enable) {
    let proxyStr = '';
    if (serviceProxy.proxyServerRootUrl) {
      proxyStr = `${serviceProxy.proxyServerRootUrl}/`;
    } else if (serviceProxy.rootUrlPostfix) {
      proxyStr = `${serviceProxy.port}/${serviceProxy.rootUrlPostfix}/`;
    } else if (!serviceProxy.rootUrlPostfix) {
      proxyStr = `${serviceProxy.port}/`;
    }
    if (serviceProxy.port !== 80) {
      return serviceUrl.indexOf(proxyStr) >= 0;
    } else {
      //代理端口为80,url中不一定有端口,满足一种情况即可
      return serviceUrl.indexOf(proxyStr) >= 0 || serviceUrl.indexOf(proxyStr.replace(
        ':80', '')) >= 0;
    }
  } else {
    return false;
  }
}

//获取ip或者域名
function getHostName(serviceUrl: string) {
  // ''http://localhost:8195/portalproxy/iserver/services/3D-ifc/rest/realspace''
  // http://localhost/portalproxy/iserver/services/3D-ifc/rest/realspace'
  let array = serviceUrl.split('://');
  let index = array[1].indexOf(':');
  let ip = '';
  if (index < 0) {
    let array2 = array[1].split('/');
    ip = array2[0];
  } else {
    let array3 = array[1].split(':');
    ip = array3[0];
  }
  return ip;
}

//获取iport配置及用户信息
function initPortal() {
  // 用户信息
  let rootUrl = getRootUrl();
  const IportalStore = IportalStoreCreate();

  let token = "?token=BTKYtyi2bsoLNUA2xn7nRg3V9IfETNnmskQhpsmCz8Q5ClFYCWGAMJSX1ESedBqCF1jFmHLY_20jhpHssvwNQg.."

  let userProfileUrl = "/web/config/userprofile.json"
  let portalConfigUrl = "/web/config/portal.json"
  let systemJSONUrl = "/web/config/system.json"
  // let userProfileUrl = getRootUrl() + "/web/config/userprofile.json";
  // let portalConfigUrl = getRootUrl() + "/web/config/portal.json";
  // let systemJSONUrl = getRootUrl() + "/web/config/system.json";

  let userUrl = rootUrl.includes("iportal")
    ? rootUrl + userProfileUrl
    : "/iportal" + userProfileUrl + token;

  let portalUrl = rootUrl.includes("iportal")
    ? rootUrl + portalConfigUrl
    : "/iportal" + portalConfigUrl + token;

  let systemUrl = rootUrl.includes("iportal")
    ? rootUrl + systemJSONUrl
    : "/iportal" + systemJSONUrl + token;

  //验证用户的登录状态
  let userInfoPromise = axios.get(userUrl, {
    //需要cookie验证
    withCredentials: true
  });
  let portalConfigPromise = axios.get(portalUrl);
  let portalSystemPromise = axios.get(systemUrl);

  Promise.all([userInfoPromise, portalConfigPromise, portalSystemPromise]).then(results => {
    // console.log("results", results);
    const userInfoObj = results[0];
    const portalConfigObj = results[1];
    const portalSystemObj = results[2];

    IportalStore.portalUserprofile = results[0].data;
    IportalStore.portalConfig = results[1].data;
    IportalStore.systemConfig = results[2].data;

    // 暂时先用这个进行判断是否登录
    if (userInfoObj.status == 200 && userInfoObj.data.userName !== "GUEST") {
      IportalStore.isLogin = true;
      if (userInfoObj.data.modulePermissions[0] = '*' && userInfoObj.data.roles[0] == 'ADMIN') {
        IportalStore.isSuperAdmin = true;
      }
      IportalStore.setUserInfo(userInfoObj.data);
    }
  });
  //验证用户的登录状态
  // let userInfoPromise = window.axios.get(userProfileUrl, {
  //     //需要cookie验证
  //     withCredentials: true
  // });
  // let portalConfigPromise = window.axios.get(portalConfigUrl);
  // let portalSystemPromise = window.axios.get(systemJSONUrl);
  // Promise.all([userInfoPromise, portalConfigPromise, portalSystemPromise]).then(results => {
  //     window.store.portalUserprofile = results[0].data;
  //     window.store.portalConfig = results[1].data;
  //     window.store.systemConfig = results[2].data;
  //     mountVue();
  // }).catch(e => {
  //     mountVue();
  // });
}

export {
  getRootUrl,
  initPortal,
  isIportalProxyServiceUrl,
  getHostName
}