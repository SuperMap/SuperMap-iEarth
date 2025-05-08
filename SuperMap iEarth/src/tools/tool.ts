

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
  if (rgba.red && rgba.green && rgba.blue && rgba.alpha) { // 标准rgba
    if (rgba.alpha > 1) { // 当alpha大于1时，需要各分量除以alpha,才能得到真实值
      rgba = SuperMap3D.Color.divideByScalar(rgba, rgba.alpha, new SuperMap3D.Color())
    }
    const red = floatToByte(rgba.red);
    const green = floatToByte(rgba.green);
    const blue = floatToByte(rgba.blue);
    const alpha = (rgba.alpha > 1 || rgba.alpha < 0) ? 1 : rgba.alpha;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  } else if (rgba.x && rgba.y && rgba.z && rgba.w) { // 水面参数
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
async function computedDataSourceOptions(dataUrl) {
  if (!dataUrl) return;

  dataUrl = dataUrl.trim().replace(/\/+$/, "");
  const dataSourceUrl = dataUrl + '/datasources.json';
  const isAccess = await checkURLAccess(dataSourceUrl);
  if(!isAccess) return;
  const result = await window.axios.get(dataSourceUrl);
  
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
}

// 获取数据服务中指定数据源下的数据集
async function computedDataSetOptions(dataUrl, sourceName) {
  if (!dataUrl || !sourceName) return;

  dataUrl = dataUrl.trim().replace(/\/+$/, "");
  const dataSetUrl = dataUrl + '/datasources/' + sourceName + '/datasets.json';
  const isAccess = await checkURLAccess(dataSetUrl);
  if(!isAccess) return;
  const result = await window.axios.get(dataSetUrl);
  
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
}

// 获取地图服务中地图名称
async function computedMapNameOptions(mapUrl) {
  if (!mapUrl) return;

  mapUrl = mapUrl.trim().replace(/\/+$/, "");
  const mapJsonUrl = mapUrl + '/maps.json';
  const isAccess = await checkURLAccess(mapJsonUrl);
  if(!isAccess) return;
  const result = await window.axios.get(mapJsonUrl);
  
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
}

// 获取场景服务中存在的场景名称
async function computedSceneNameOptions(sceneUrl) {
  if (!sceneUrl) return;

  sceneUrl = sceneUrl.trim().replace(/\/+$/, "");
  if(sceneUrl.includes("/realspace")) sceneUrl = sceneUrl.replace("/realspace", "");
  const sceneJsonUrl = sceneUrl + '/realspace/scenes.json';
  const isAccess = await checkURLAccess(sceneJsonUrl);
  if(!isAccess) return;
  const result = await window.axios.get(sceneJsonUrl);
  
  if(!result || !result.data) return;
  const sceneData = result.data;
  if(!sceneData || sceneData.length==0) return;

  const options:any = [];
  sceneData.forEach((item) => {
      const obj = {
          label: item.name,
          value: item.name,
      }
      options.push(obj);
  });

  return options;
}

// 获取指定数据源的坐标系
async function computedDataSourceEpsgCode(dataUrl, dataSourceName) {
  if (!dataUrl || !dataSourceName) return;
  dataUrl = dataUrl.trim().replace(/\/+$/, "");

  const sourceJsonUrl = `${dataUrl}/data/datasources/${dataSourceName}.json`;
  const isAccess = await checkURLAccess(sourceJsonUrl);
  if(!isAccess) return;
  const result = await window.axios.get(sourceJsonUrl);
  
  if(!result || !result.data) return;
  const data = result.data;

  if(data && data.datasourceInfo && data.datasourceInfo.prjCoordSys){
    const prjCoordSys = data.datasourceInfo.prjCoordSys;
    return String(prjCoordSys.epsgCode);
  }
}

// 获取指定数据源中数据集的坐标系
async function computedDataSetEpsgCode(dataUrl, dataSourceName, datasetName) {
  if (!dataUrl || !dataSourceName || !datasetName) return;
  dataUrl = dataUrl.trim().replace(/\/+$/, "");
  if (dataUrl.includes('/rest/data')) { // 去除末尾的/data，防止URL路径不对
    dataUrl = dataUrl.replace('/rest/data', '/rest');
  }
  
  const dataSetJsonUrl = `${dataUrl}/data/datasources/${dataSourceName}/datasets/${datasetName}.json`;
  const result = await window.axios.get(dataSetJsonUrl);
  
  if(!result || !result.data) return;
  const data = result.data;

  if(data && data.datasetInfo && data.datasetInfo.prjCoordSys){
    const prjCoordSys = data.datasetInfo.prjCoordSys;
    return String(prjCoordSys.epsgCode);
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
}