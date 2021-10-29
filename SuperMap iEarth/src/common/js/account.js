import request, { getIPortalUrl, isSuperMapOnline } from './request';
import Vue from 'vue';

const accountRoot = `${getIPortalUrl()}/web/mycontent/account.json`;
export function getAccount(openLoginPopup = false) {
  if (!openLoginPopup) {
    return request(accountRoot, { time: new Date().getTime() }, 'get', true, false);
  } else {
    return request(accountRoot, { time: new Date().getTime() }, 'get', true, false)
      .then(res => {
        return new Promise((resolve, reject) => {
          resolve(res);
        });
      })
      .catch(() => {
        return new Promise((resolve, reject) => {
          Vue.prototype.$loading && Vue.prototype.$loading.hide();
          // 弹出登录框
          let loginComponent = Vue.prototype.$loginPopup;
          loginComponent.show();
          loginComponent.$on('login-success', () => {
            resolve();
            loginComponent.hide();
          });
          loginComponent.$on('login-failed', e => {});
          loginComponent.$on('login-cancel', e => {
            setTimeout(() => {
              reject(new Error());
            }, 0);
          });
        });
      });
  }
}
export function openUserDetails() {
  // ONLINE的账户信息：https://itest.supermapol.com/web/mycontent/cloud/account
  // iportal的账户地址
  let url = `${getIPortalUrl()}/web-ui/my-account/account`;
  if (isSuperMapOnline()) {
    // online的账户地址
    url = `${getIPortalUrl()}/web/mycontent/cloud/account`;
  }
  window.open(url);
}
