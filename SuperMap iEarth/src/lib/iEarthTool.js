
// cartesian3/[cartesian3] => [lng,lat,height,....]
const Cartesian3ToDegreeArray = (cartesian3) => {
  let array = [].concat(cartesian3);
  let positions = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
    let longitude = Number(SuperMap3D.Math.toDegrees(cartographic.longitude));
    let latitude = Number(SuperMap3D.Math.toDegrees(cartographic.latitude));
    let height = Number(cartographic.height);
    if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
      positions.push(longitude);
      positions.push(latitude);
      positions.push(height);
    }
  }
  return positions;
}

// cartesian3/[cartesian3] => [degree,degree,...]
const Cartesian3ToDegreeObjs = (cartesian3) => {
  let array = [].concat(cartesian3);
  let positionObjs = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic = SuperMap3D.Cartographic.fromCartesian(array[i]);
    let obj = {
      longitude: SuperMap3D.Math.toDegrees(cartographic.longitude),
      latitude: SuperMap3D.Math.toDegrees(cartographic.latitude),
      height: cartographic.height
    };
    positionObjs.push(obj);
  }
  return positionObjs;
}

// 获取相机坐标和朝向：支持平面+球面
const getCamera = () => {
    if(!viewer) return;
    const camera = viewer.scene.camera;
    if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) { // 平面场景
        const params = {
            position: {
                longitude: camera.positionCartographic.longitude,
                latitude: camera.positionCartographic.latitude,
                height: camera.positionCartographic.height,
            },
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll,
        };
        return params;
    } else { // 球面场景
        const params = {
            position: {
                x: camera.positionWC.x,
                y: camera.positionWC.y,
                z: camera.positionWC.z,
            },
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll,
        };
        return params;
    }
}

// 设置相机坐标和朝向：支持平面+球面
const openCamera = (param) => {
    if(!param || !param.position) return;
    const position = param.position;
    if (viewer.scene.mode == SuperMap3D.SceneMode.COLUMBUS_VIEW) { // 平面场景
      viewer.scene.camera.setView({
        convert: viewer.scene.mode !== SuperMap3D.SceneMode.SCENE3D,
        destination: SuperMap3D.Cartesian3.fromRadians(
          position.longitude,
          position.latitude,
          position.height,
        ),
        orientation: {
          heading: param.heading,
          pitch: param.pitch,
          roll: param.roll,
        }
      })
    } else { // 三维场景
      const cameraX = position.x;
      const cameraY = position.y;
      const cameraZ = position.z;
      viewer.scene.camera.setView({
        destination: new SuperMap3D.Cartesian3(cameraX, cameraY, cameraZ),
        orientation: {
          heading: param.heading,
          pitch: param.pitch,
          roll: param.roll
        }
      });
    }
}

// 将对象保存为json文件并下载
const saveObjToJsonFile = (obj, fileName) => {
  let jsonString = undefined;
  if (typeof obj !== 'string') {
    jsonString = JSON.stringify(obj, null, '\t');
  }else{
    jsonString = obj;
  }

  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const alink = document.createElement("a");
  alink.style.display = "none";
  alink.download = fileName ? `${fileName}.json` : `${new Date().getTime()}.json`; // 下载后文件名
  alink.href = href;
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink); // 下载完成移除元素
  URL.revokeObjectURL(href); // 释放掉blob对象
}

export default {
    getCamera,
    openCamera,
    saveObjToJsonFile,
    Cartesian3ToDegreeArray,
    Cartesian3ToDegreeObjs
}