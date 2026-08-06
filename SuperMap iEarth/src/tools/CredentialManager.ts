/**
 * 凭证管理器
 * 基于全局 SuperMap3D.Credential.CREDENTIAL 进行增量增删，无需重建实例
 */
class CredentialManager {
  constructor() {
    // 确保全局凭证实例已初始化
    if (!SuperMap3D.Credential.CREDENTIAL) {
      SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential([]);
    }
  }

  /**
   * 从完整 URL 提取 key，与 Credential.addToken 逻辑保持一致
   * @private
   */
  _extractKey(url) {
    if (url.indexOf("/rest/data") !== -1) {
      return url.substring(0, url.indexOf("/rest/data") + 10);
    } else if (url.indexOf("/realspace") !== -1) {
      return url.substring(0, url.indexOf("/realspace") + 10);
    } else if (url.indexOf("/rest/maps") !== -1) {
      return url.substring(0, url.indexOf("/rest/maps") + 5);
    }
    return url;
  }

  /**
   * 添加或更新凭证
   * 当 url 和 type 相同时，覆盖之前的 token
   * @param {Object} option 配置项 {url, token, type}
   * @param {String} option.url 服务 URL（完整或前缀均可）
   * @param {String} option.token 凭证值
   * @param {String} [option.type='token'] 凭证类型，默认 token
   */
  addToken(option) {
    const { url, token, type } = option || {};
    if (!url || !token) {
      console.warn('CredentialManager.addToken: option.url 和 option.token 必填');
      return;
    }
    const credType = type || 'token';
    const key = this._extractKey(url);
    const keymap = SuperMap3D.Credential.CREDENTIAL._keymap;
    // 直接覆盖相同 key 的配置
    keymap[key] = {
      type: credType,
      value: token
    };
    // 三维服务自动补全父级 key，与 addCredential 逻辑一致
    if (key.indexOf("/realspace") !== -1) {
      const parentKey = key.substring(0, key.lastIndexOf("/realspace") + 10);
      keymap[parentKey] = {
        type: credType,
        value: token
      };
    }
  }

  /**
   * 删除凭证
   * @param {String} url 服务 URL
   */
  deleteToken(url) {
    if (!url) return;
    const key = this._extractKey(url);
    const keymap = SuperMap3D.Credential.CREDENTIAL._keymap;
    delete keymap[key];
    // 清理三维服务自动补全的父级 key
    if (key.indexOf("/realspace") !== -1) {
      const parentKey = key.substring(0, key.lastIndexOf("/realspace") + 10);
      delete keymap[parentKey];
    }
  }

  /**
   * 获取当前所有凭证配置
   * @returns {Array} 适合传给 new SuperMap3D.Credential 的配置数组
   */
  getCredentialOptions() {
    const keymap = SuperMap3D.Credential.CREDENTIAL._keymap;
    const options: any = [];
    for (const key in keymap) {
      if (!Object.prototype.hasOwnProperty.call(keymap, key)) continue;
      if (key === 'default') continue;
      const entry = keymap[key];
      options.push({
        rooturl: key,
        type: entry.type,
        value: entry.value
      });
    }
    return options;
  }

  /**
   * 将配置数组设置为全局凭证
   * @param {Array} options getCredentialOptions 返回的配置数组
   */
  setCredentialOptions(options) {
    SuperMap3D.Credential.CREDENTIAL = new SuperMap3D.Credential(options || []);
  }
}

export default CredentialManager;