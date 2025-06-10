

const SuperMap3D = window.SuperMap3D;

// 获取渐变色函数
function gradientColors(start: any, end: any, steps: number, gamma: number) {
  var i, j, ms, me, output: any[] = [], so: any[] = [];
  gamma = gamma || 1;
  var normalize = function (channel) {
    return Math.pow(channel / 255, gamma);
  };
  start = parseColor(start).map(normalize);
  end = parseColor(end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
    }
    output.push('#' + so.join(''));
  }
  return output;
  function parseColor(hexStr) {
    return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
  };
  // zero-pad 1 digit to 2
  function pad(s) {
    return (s.length === 1) ? '0' + s : s;
  }
};

// 设置鼠标样式
function setMouseCursor(type: string) {
  const viewer = window.viewer;
  if (!viewer) return;
  if (type === 'normal') {
    viewer.enableCursorStyle = true; // 直接切换成SuperMap3D默认鼠标样式，同时之前修改的鼠标样式无效，一旦设为true，就会恢复viewer._element.style.cursor
    document.body.classList.remove('measureCur'); // 可先用contains判断是否存在
    document.body.classList.remove('drawCur');
  } else if (type === 'drawCur') {
    viewer.enableCursorStyle = false; // 关闭这个，让鼠标设置可以生效
    viewer._element.style.cursor = ''; // 改为‘’，避免覆盖我们设置的鼠标样式
    document.body.classList.add("drawCur"); // 绘制模式常用鼠标
  } else if (type === 'measureCur') {
    viewer.enableCursorStyle = false;
    viewer._element.style.cursor = '';
    document.body.classList.add("measureCur"); // 添加点模式
  } else {
    viewer.enableCursorStyle = true; // 恢复默认
  }
}

// 打开文件管理获取选定文件内容
function openLocalFile(fileType = '.json'){
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none'; // 创建一个隐藏的input元素
    input.accept = fileType; // 过滤文件类型

    document.body.appendChild(input);
    input.addEventListener('change', function (event:any) {
      const file = event.target.files[0]; // 获取文件引用
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e:any) {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsText(file);
    });

    input.click();
  })
}

// 检测当前URL服务是否能够被访问
const checkURLAccess = (url) => {
  return fetch(url)
    .then(response => {
      if (response && response.status == 404) {
        console.log(`此服务无法访问：${url}`);
        return false;
      }else{
        // console.log(`URL ${url} 可以访问`);
        return true;
      }
    })
    .catch(error => {
      console.log(`此服务无法访问：${url}`);
      return false;
    });
}

// rgba => css string
const rgbaToCssString = (color) => {
  let rgba = SuperMap3D.clone(color);
  if (rgba.red != undefined && rgba.green != undefined && rgba.blue != undefined && rgba.alpha != undefined) { // 标准rgba
    if (rgba.alpha > 1) { // 当alpha大于1时，需要各分量除以alpha,才能得到真实值
      rgba = SuperMap3D.Color.divideByScalar(rgba, rgba.alpha, new SuperMap3D.Color())
    }
    const red = floatToByte(rgba.red);
    const green = floatToByte(rgba.green);
    const blue = floatToByte(rgba.blue);
    const alpha = (rgba.alpha > 1 || rgba.alpha < 0) ? 1 : rgba.alpha;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  } else if (rgba.x != undefined && rgba.y != undefined && rgba.z != undefined && rgba.w != undefined) { // 水面参数
    if (rgba.w > 1) { // 当alpha大于1时，需要各分量除以alpha,才能得到真实值
      rgba = SuperMap3D.Color.divideByScalar(rgba, rgba.w, new SuperMap3D.Color())
    }
    const red = floatToByte(rgba.x);
    const green = floatToByte(rgba.y);
    const blue = floatToByte(rgba.z);
    const alpha = (rgba.w > 1 || rgba.w < 0) ? 1 : rgba.w;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  } else {
    return undefined;
  }

  function floatToByte(float) {
    const byte = SuperMap3D.Color.floatToByte(float);
    if (Number(byte) >= 0 && Number(byte) <= 255) {
      return byte;
    } else {
      return 255;
    }
  }
}

/** 时间倒序，多少小时之前
 * @param timestamp 时间毫秒数
 */
function dateDiff(timestamp) {
  // 补全为13位
  let arrTimestamp: any = (timestamp + "").split("");
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = "0";
    }
  }
  timestamp = arrTimestamp.join("") * 1;
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return "不久前";
  }
  // 计算差异时间的量级
  let monthC: any = diffValue / month;
  let weekC: any = diffValue / (7 * day);
  let dayC: any = diffValue / day;
  let hourC: any = diffValue / hour;
  let minC: any = diffValue / minute;

  // 数值补0方法
  let zero = function (value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (monthC > 4) {
    // 超过1年，直接显示年月日
    return (function () {
      let date = new Date(timestamp);
      return (
        date.getFullYear() +
        $t("year") +
        zero(date.getMonth() + 1) +
        $t("month") +
        zero(date.getDate()) +
        $t("day")
      );
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + $t("monthsAgo");
  } else if (weekC >= 1) {
    return parseInt(weekC) + $t("weeksAgo");
  } else if (dayC >= 1) {
    return parseInt(dayC) + $t("daysAgo");
  } else if (hourC >= 1) {
    return parseInt(hourC) + $t("hoursAgo");
  } else if (minC >= 1) {
    return parseInt(minC) + $t("minutesAgo");
  }
  return $t("secondsAgo");
}

// 获取数据服务中的数据源
async function computedDataSourceOptions(dataUrl, tokenString=undefined, useWithCredentials=false) {
  if (!dataUrl) return;

  dataUrl = dataUrl.trim().replace(/\/+$/, "");
  let dataSourceUrl = dataUrl + '/datasources.json';

  // 请求时加上Token
  if (tokenString && tokenString != '') {
    dataSourceUrl = dataSourceUrl + '?token=' + tokenString;
  }

  try {
    const axiosParam =  useWithCredentials ? { withCredentials:true } : undefined;
    const result = await window.axios.get(dataSourceUrl, axiosParam);
  
    if(!result || !result.data) return;
    const datasourceNames = result.data.datasourceNames;
    if(!datasourceNames || datasourceNames.length==0) return;

    const options:any = [];
    datasourceNames.forEach(sourceName => {
        const obj = {
            label: sourceName,
            value: sourceName,
        }
        options.push(obj);
    });

    return options;
  } catch (error:any) {
    console.log('请求服务失败:', error);
    if(error.response) return error.response.status;
  }
}

// 获取数据服务中指定数据源下的数据集
async function computedDataSetOptions(dataUrl, sourceName, tokenString=undefined, useWithCredentials=false) {
  if (!dataUrl || !sourceName) return;

  dataUrl = dataUrl.trim().replace(/\/+$/, "");
  let dataSetUrl = dataUrl + '/datasources/' + sourceName + '/datasets.json';

  // 请求时加上Token
  if (tokenString && tokenString != '') {
    dataSetUrl = dataSetUrl + '?token=' + tokenString;
  }

  try {
    const axiosParam =  useWithCredentials ? { withCredentials:true } : undefined;
    const result = await window.axios.get(dataSetUrl, axiosParam);
    
    if(!result || !result.data) return;
    const datasetNames = result.data.datasetNames;
    if(!datasetNames || datasetNames.length==0) return;

    const options:any = [];
    datasetNames.forEach(datasetName => {
        const obj = {
            label: datasetName,
            value: datasetName,
        }
        options.push(obj);
    });

    return options;
  } catch (error:any) {
    console.log('请求服务失败:', error);
    if(error.response) return error.response.status;
  }
}

// 获取地图服务中地图名称
async function computedMapNameOptions(mapUrl, tokenString=undefined, useWithCredentials=false) {
  if (!mapUrl) return;

  mapUrl = mapUrl.trim().replace(/\/+$/, "");
  let mapJsonUrl = mapUrl + '/maps.json';

  // 请求时加上Token
  if (tokenString && tokenString != '') {
    mapJsonUrl = mapJsonUrl + '?token=' + tokenString;
  }

  try {
    const axiosParam =  useWithCredentials ? { withCredentials:true } : undefined;
    const result = await window.axios.get(mapJsonUrl, axiosParam);
  
    if(!result || !result.data) return;
    const mapData = result.data;
    if(!mapData || mapData.length==0) return;

    const options:any = [];
    mapData.forEach((item) => {
        const obj = {
            label: item.name,
            value: item.path || item.name,
        }
        options.push(obj);
    });

    return options;
  } catch (error:any) {
    console.log('请求服务失败:', error);
    if(error.response) return error.response.status;
  }
}

// 获取场景服务中存在的场景名称
async function computedSceneNameOptions(sceneUrl, tokenString=undefined, useWithCredentials=false) {
  if (!sceneUrl) return;

  sceneUrl = sceneUrl.trim().replace(/\/+$/, "");
  if(sceneUrl.includes("/realspace")) sceneUrl = sceneUrl.replace("/realspace", "");
  let sceneJsonUrl = sceneUrl + '/realspace/scenes.json';

  // 请求时加上Token
  if (tokenString && tokenString != '') {
    sceneJsonUrl = sceneJsonUrl + '?token=' + tokenString;
  }

  try {
    const axiosParam =  useWithCredentials ? { withCredentials:true } : undefined;
    const result = await window.axios.get(sceneJsonUrl, axiosParam);
    if (!result || !result.data) return;
    const sceneData = result.data;
    if (!sceneData || sceneData.length == 0) return;

    const options: any = [];
    sceneData.forEach((item) => {
      const obj = {
        label: item.name,
        value: item.name,
      }
      options.push(obj);
    });

    return options;
  } catch (error:any) {
    console.log('请求服务失败:', error);
    if(error.response) return error.response.status;
  }
}

// 获取指定数据源的坐标系
async function computedDataSourceEpsgCode(dataUrl, dataSourceName, tokenString=undefined, useWithCredentials=false) {
  if (!dataUrl || !dataSourceName) return;
  dataUrl = dataUrl.trim().replace(/\/+$/, "");

  let sourceJsonUrl = `${dataUrl}/data/datasources/${dataSourceName}.json`;

  // 请求时加上Token
  if (tokenString && tokenString != '') {
    sourceJsonUrl = sourceJsonUrl + '?token=' + tokenString;
  }

  const axiosParam =  useWithCredentials ? { withCredentials:true } : undefined;
  const result = await window.axios.get(sourceJsonUrl, axiosParam);
  
  if(!result || !result.data) return;
  const data = result.data;

  if(data && data.datasourceInfo && data.datasourceInfo.prjCoordSys){
    const prjCoordSys = data.datasourceInfo.prjCoordSys;
    return String(prjCoordSys.epsgCode);
  }
}

// 获取指定数据源中数据集的坐标系
async function computedDataSetEpsgCode(dataUrl, dataSourceName, datasetName, tokenString=undefined, useWithCredentials=false) {
  if (!dataUrl || !dataSourceName || !datasetName) return;
  dataUrl = dataUrl.trim().replace(/\/+$/, "");
  if (dataUrl.includes('/rest/data')) { // 去除末尾的/data，防止URL路径不对
    dataUrl = dataUrl.replace('/rest/data', '/rest');
  }
  
  let dataSetJsonUrl = `${dataUrl}/data/datasources/${dataSourceName}/datasets/${datasetName}.json`;

  // 请求时加上Token
  if (tokenString && tokenString != '') {
    dataSetJsonUrl = dataSetJsonUrl + '?token=' + tokenString;
  }

  const axiosParam =  useWithCredentials ? { withCredentials:true } : undefined;
  const result = await window.axios.get(dataSetJsonUrl, axiosParam);
  
  if(!result || !result.data) return;
  const data = result.data;

  if(data && data.datasetInfo && data.datasetInfo.prjCoordSys){
    const prjCoordSys = data.datasetInfo.prjCoordSys;
    return String(prjCoordSys.epsgCode);
  }
}

/**
 * 检测服务可用性并返回状态码
 * @param {string} url 待检测的服务地址
 * @returns {Promise<number|boolean>} 返回状态码（如404/401），网络错误返回false
 */
async function checkServiceStatus(url) {
  if(!window.axios) return 'no axios';
  try {
    const response = await window.axios.get(url,  {
      validateStatus: (status) => status < 500 // 允许接收400+状态码而非直接报错
    });

    // 服务被重定向了，说明当前服务需要token才能加载
    if(response.data.disableRememberMe || response.request.responseURL.includes('/security/login')){
      // return '302-Redirect'
      return 302;
    }

    return response.status;  // 正常状态码（如200）
  } catch (error:any) {
    if (error.response)  {
      // 服务返回明确状态码（如401、404）
      return error.response.status;  
    } else {
      // 网络错误或无响应（如跨域阻断）
      return false;
    }
  }
}

// 使用正则校验URL并匹配提取信息作为图层名称
function checkUrlByRegex(url, regex){
  if(!url || !regex) return;

  const isPass = regex.test(url);
  const matchInfo = url.match(regex);
  return {
    isPass: isPass,
    matchInfo: matchInfo
  }
}

// 解析地址: 从URL中获取IP和端口号
function parseURL(urlString) {
  try {
      const url = new URL(urlString);
      return {
          protocol: url.protocol,  // 协议（如 "http:"）
          hostname: url.hostname,  // 主机名（如 "192.168.1.1" 或 "example.com" ）
          port: url.port || (url.protocol === "https:" ? "443" : "80"), // 端口（自动补默认值）
          path: url.pathname  // 路径（如 "/api/data"）
      };
  } catch (e) {
      console.error("URL  解析失败:", e);
      return null;
  }
}

// 涉及到代理服务,需要跨域请求,再请求时携带cooike
// 例子:iPortal-三维地球中我的服务需要请求iPortal的一个代理服务,从URL中获取IP+Port,纳入TrustedServers
// 再之后scene.open(IP+Port),就能正常加载场景了
function setTrustedServers(url) {
  const result:any = parseURL(url);
  if(SuperMap3D.TrustedServers.contains(url)) return;

  if(result.hostname && result.port){
    SuperMap3D.TrustedServers.add(result.hostname, result.port);
  }
}


export default {
  gradientColors,
  setMouseCursor,
  openLocalFile,
  checkURLAccess,
  rgbaToCssString,
  dateDiff,
  computedDataSourceOptions,
  computedDataSetOptions,
  computedMapNameOptions,
  computedSceneNameOptions,
  computedDataSourceEpsgCode,
  computedDataSetEpsgCode,
  checkServiceStatus,
  checkUrlByRegex,
  parseURL,
  setTrustedServers,
}