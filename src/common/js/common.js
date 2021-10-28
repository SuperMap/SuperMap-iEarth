import createTooltip from './tooltip';
//DrawHandler封装
const initHandler = function (DrawMode, clampMode) { //初始化，传入需要的类型
  let clampmode = 0;
  if (clampMode) {
    clampmode = clampMode
  };
  switch (DrawMode) {
    case "Point":
      window.handlerPoint = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
      break;
    case "Polyline":
      window.handlerPolyline = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Line, clampmode);
      break;
    case "Polygon":
      window.handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, clampmode);
      break;
    case "Marker ":
      window.handlerMarker = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Marker, clampmode);
      break;
    case "Box ":
      window.handlerBox = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Box, clampmode);
      break;
    default:
      null;
  };
  if (!window.tooltip) {
    window.tooltip = createTooltip(viewer._element);
  }
  // 半透线创建
  if (!window.polylineCollection) {
    window.polylineCollection = new Cesium.PolylineCollection({
      translucentRS: Cesium.RenderState.fromCache({
        depthMask: false,
        depthTest: {
          enabled: false
        }
      })
    });
    window.polylineTransparent = window.polylineCollection.add({
      width: 2,
      material: Cesium.Material.fromType(Cesium.Material.ColorType, {
        color: Cesium.Color.fromCssColorString("#51ff00").withAlpha(
          0.5
        )
      })
    });
    viewer.scene.primitives.add(window.polylineCollection);
  }
};


const handlerDrawing = function (PolyType, tooltipNum) { //（传入操作的DrawHandler类型的字符串，如"Polygon"）
  let DrawHandler = judgeDrawHandlerType(PolyType); //获取操作对象
  return new Promise((resolve, reject) => { //做一些异步操作
    let tooltip = window.tooltip;
    let clearActFn = DrawHandler.activeEvt.addEventListener((isActive) => {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
        if (PolyType == "Polygon" || PolyType == "Polyline") {
          document.body.classList.add("drawCur");
        } else {
          document.body.classList.add("measureCur");
        }
      } else {
        viewer.enableCursorStyle = true;
        tooltip.setVisible(false);
        if (PolyType == "Polygon" || PolyType == "Polyline") {
          document.body.classList.remove('drawCur');
        } else {
          document.body.classList.remove('measureCur');
        }
      }
    });

    let clearMovFn = DrawHandler.movingEvt.addEventListener((windowPosition) => {
      if (windowPosition.x < 200 && windowPosition.y < 150) {
        tooltip.setVisible(false);
        return;
      };
      // if (DrawHandler.isDrawing) {
      switch (tooltipNum) {
        case 1:
          tooltip.showAt(windowPosition, '<p>点击确定多边形中间点</p><p>绘制三点即可</p><p>右键单击结束绘制</p>');
          break;
        case 2:
          tooltip.showAt(windowPosition, '<p>点击开始绘制</p><p>右键单击结束绘制</p><p>选中可进行编辑属性</p>');
          break;
        default:
          tooltip.showAt(windowPosition, '<p>点击左键确定操作区域中间点</p><p>右键单击结束绘制</p>');
          null;
      };
      // }
      if (DrawHandler.polyline && DrawHandler.isDrawing) {
        let p = [...DrawHandler.polyline.positions]
        if (PolyType == "Polygon") { //画面时，需要首尾相连
          p.push(p[0])
        };
        window.polylineTransparent.positions = p
        window.polylineTransparent.show = true
      }
    });
    let clearDrawFn = DrawHandler.drawEvt.addEventListener((result) => {
      if (!result.object.positions && PolyType != "Point") {
        tooltip.showAt(result, '<p>请绘制正确的多边形</p>');
        DrawHandler.polygon.show = false;
        DrawHandler.polyline.show = false;
        DrawHandler.deactivate();
        DrawHandler.activate();
        return;
      };
      tooltip.setVisible(false);
      if (PolyType == "Point" || PolyType == "Marker") {
        DrawHandler.clear(); // 不显示绘制的点
        resolve({
          result: result
        });
      } else { //半透线
        window.polylineTransparent.show = true;
        if (PolyType == "Polygon") {
          DrawHandler.polygon._polygon._material._color._value.alpha = 0.5 //绘制面透明度
          let p2 = [...result.object.positions]; //画面时，需要首尾相连
          p2.push(p2[0]);
          window.polylineTransparent.positions = p2;
        };
        let positions = cartographic(result.object.positions)
        resolve({
          result: result,
          positions: positions
        });
      };
      //清除监听事件
      clearActFn();
      clearMovFn();
      clearDrawFn()
    });
  });
};

const clearHandlerDrawing = (PolyType) => {
  let DrawHandler
  if (!PolyType) {
    DrawHandler = window.handlerPolygon
  } else {
    DrawHandler = judgeDrawHandlerType(PolyType);
  };
  DrawHandler.deactivate();
  DrawHandler.clear()
  viewer.enableCursorStyle = true;
  document.body.classList.remove("drawCur");
  document.body.classList.remove("measureCur");
  window.tooltip.setVisible(false);
  if (window.polylineTransparent) {
    window.polylineTransparent.show = false
  }
};

//编辑功能
const Edit = (_this, callback, PolyType) => {
  if (!window.selectHandler) {
    window.selectHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  }
  let selectHandler = window.selectHandler;
  if (PolyType == "Polygon") {
    if (window.handlerPolygon.polygon) {
      window.handlerPolygon.polygon.show = true;
    }
  }
  selectHandler.setInputAction(() => {
    let entity = viewer.selectedEntity;
    let editHandler = window.editHandler
    if (!entity) {
      if (editHandler) {
        editHandler && editHandler.deactivate();
      }
      return;
    }
    if (!editHandler) {
      window.editHandler = new Cesium.EditHandler(viewer, entity);
      if (_this.isEditZ) {
        window.editHandler.isEditZ = _this.isEditZ;
      } else {
        window.editHandler.isEditZ = false
      }
      window.editHandler.activate();
    } else {
      editHandler.deactivate();
      editHandler.setEditObject(entity);
      editHandler.activate();
    }
    selectHandler.setInputAction(() => {
      let entity = viewer.selectedEntity;
      let editHandler = window.editHandler
      if (!entity) {
        return;
      }
      if (editHandler && editHandler._positions) {
        if (isSame(_this.EditPositions, window.editHandler._positions)) {
          return;
        } else {
          _this.EditPositions = [...window.editHandler._positions]
          let positions = cartographic(_this.EditPositions)
          if (callback) {
            callback(positions)
          }
        }
        if (PolyType == "Polygon") {
          let p3 = [...window.editHandler._positions]
          p3.push(p3[0])
          window.polylineTransparent.positions = p3; //半透线
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
};
const clearEditHandler = () => {
  if (window.editHandler) {
    window.editHandler.deactivate();
    window.editHandler.clear()
  };
  if (window.selectHandler) {
    //移除鼠标移动事件监听
    window.selectHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_UP
    );
    window.selectHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    window.selectHandler.destroy()
    window.selectHandler = null
  }
};
//判断两数组或对象相等
const isSame = (arg1, arg2) => {
  let bol = true;
  if (Object.keys(arg1).length != Object.keys(arg2).length) {
    return false;
  }
  for (let key in arg1) {
    if (typeof arg1[key] == 'object') {
      bol = isSame(arg1[key], arg2[key])
      if (!bol) {
        break;
      }
    } else if (arg1[key] != arg2[key]) {
      bol = false;
      break;
    }
  }
  return bol
};

//转化
const cartographic = (objPosition) => {
  let array = [].concat(objPosition);
  let positions = [];
  for (let i = 0, len = array.length; i < len; i++) {
    let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let h = cartographic.height;
    if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
      positions.push(longitude);
      positions.push(latitude);
      positions.push(h);
    }
  }
  return positions
};
// 类型判断
const judgeDrawHandlerType = (PolyType) => {
  let DrawHandler;
  switch (PolyType) {
    case "Point":
      DrawHandler = window.handlerPoint;
      break;
    case "Polyline":
      DrawHandler = window.handlerPolyline;
      break;
    case "Polygon":
      DrawHandler = window.handlerPolygon;
      break;
    case "Marker ":
      DrawHandler = window.handlerMarker;
      break;
    case "Box ":
      DrawHandler = window.handlerBox;
      break;
    default:
      null;
  }
  return DrawHandler;
};

//axios本版本不支持jsonp 自己拓展一个
const axiosJsonp = (url) => {
  if (!url) {
    console.error('Axios.JSONP 至少需要一个url参数!')
    return;
  }
  return new Promise((resolve, reject) => {
    window.jsonCallBack = (result) => {
      resolve(result)
    }
    var JSONP = document.createElement("script");
    JSONP.type = "text/javascript";
    JSONP.src = `${url}&callback=jsonCallBack`;
    document.getElementsByTagName("head")[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(JSONP)
    }, 500)
  })
}



export default {
  initHandler,
  handlerDrawing,
  clearHandlerDrawing,
  Edit,
  clearEditHandler,
  axiosJsonp,
  cartographic
}
