class SceneMeasure {
  constructor(viewer, options) {
    if (!viewer || !(viewer instanceof SuperMap3D.Viewer)) return;

    this.viewer = viewer;
    this.scene = viewer.scene;
    this.init(options);
  }

  // 初始化
  init(params = {}) {
    if (!SuperMap3D || !window.SuperMap3D) {
      console.error('量算类依赖SuperMap3D');
      return;
    }

    this.calculateMode = params.calculateMode ?? 'Space';
    this.clampMode = params.clampMode ?? SuperMap3D.ClampMode.Space;
    this.isContinuousDrawing = params.isContinuousDrawing === false ? false : true;
    this.isShowContourLine = params.isShowContourLine === false ? false : true;
    this.isPickPoint = params.isPickPoint === true ? true : false;

    this.curHandler = null;
    this.disHandlerList = [];
    this.areaHandlerList = [];
    this.heightHandlerList = [];

    // 量算模式枚举
    this.measureModeEnum = {
      Distance: 'Distance',
      Area: 'Area',
      Height: 'Height',
    }

    // 计算模式枚举
    this.calculateModeEnum = {
      Space: 'Space',
      Ground: 'Ground',
      CGCS2000: 'CGCS2000',
      XIAN80: 'XIAN80',
      WGS84: 'WGS84',
      Projection: 'Projection',
    }

    // 量算模式
    this.measureMode = this.measureModeEnum.Distance;

    // 等高线
    this.isoline = null;

    // 量算结果
    this.measureResult = null;
  }

  // 设置几何对象模式
  setClampMode(value) {
    if (typeof value !== 'number') return;
    this.clampMode = value;

    // 测高模式下不支持设置clampMode
    if (this.curHandler && this.measureMode !== this.measureModeEnum.Height) {
      if(this.curHandler.active){ // 只有量算还在绘制中才支持修改，一旦绘制结束便固定不在设置clampMode
        this.curHandler.clampMode = value;
      }
    }
  }

  // 设置计算模式，传入椭球枚举
  setCalculateMode(value) {
    if (typeof value !== 'string') return;
    this.calculateMode = this.calculateModeEnum[value] || this.calculateModeEnum.Space;
  }

  // 设置是否开启连续绘制
  setContinueDrawEnable(value) {
    if (typeof true !== 'boolean') return;
    this.isContinuousDrawing = value;
  }

  // 设置是否开启顶点捕捉
  setPickPointEnable(value) {
    if (typeof true !== 'boolean') return;
    this.isPickPoint = value;
    this.viewer.scene.pickPointEnabled = value;
    this.viewer.scene.pickPointInterval = 20;
    this.curHandler && (this.curHandler.snappingEnabled = value);
  }

  // 设置是否开启等高线
  setContourLineEnable(value) {
    if (typeof true !== 'boolean') return;
    this.isShowContourLine = value;
    if (!value) this.clearContourLine();
  }

  startDistence() {
    return new Promise((resolve,reject)=>{
      try {
        if (!this.isContinuousDrawing) {
          this.clearCurrentHandle();
        }
        this.curHandler = new SuperMap3D.MeasureHandler(this.viewer, SuperMap3D.MeasureMode.Distance, this.clampMode);
        this.curHandler.measureEvt.addEventListener(this.handlerDistance.bind(this, resolve));
        this.curHandler.activeEvt.addEventListener(this.activeMouse.bind(this));
        this.curHandler.activate();
        this.disHandlerList.push(this.curHandler);
        this.measureMode = this.measureModeEnum.Distance;
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })
  }
  startArea() {
    return new Promise((resolve,reject)=>{
      try {
        if (!this.isContinuousDrawing) {
          this.clearCurrentHandle();
        }
        this.curHandler = new SuperMap3D.MeasureHandler(this.viewer, SuperMap3D.MeasureMode.Area, this.clampMode);
        this.curHandler.measureEvt.addEventListener(this.handlerArea.bind(this, resolve));
        this.curHandler.activeEvt.addEventListener(this.activeMouse.bind(this));
        this.curHandler.activate();
        this.areaHandlerList.push(this.curHandler);
        this.measureMode = this.measureModeEnum.Area;
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })

  }
  startHeight() {
    return new Promise((resolve,reject)=>{
      try {
        if (!this.isContinuousDrawing) {
          this.clearCurrentHandle();
        }
        if (this.isShowContourLine) {
          if (!this.isoline) this.isoline = this.createIsoline();
          this.setHypsometricSetting(this.isoline);
        }
        this.curHandler = new SuperMap3D.MeasureHandler(this.viewer, SuperMap3D.MeasureMode.DVH);
        this.curHandler.measureEvt.addEventListener(this.handlerHeight.bind(this, resolve));
        this.curHandler.activeEvt.addEventListener(this.activeMouse.bind(this));
        this.curHandler.activate();
        this.heightHandlerList.push(this.curHandler);
        this.measureMode = this.measureModeEnum.Height;
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })
  }

  // 清除上一次量算
  clearCurrentHandle() {
    if (!this.curHandler) return;
    this.curHandler.clear();
    this.curHandler.clearLabelContainer && this.curHandler.clearLabelContainer.remove();

    // 清除当前等高线
    if (this.measureMode === this.measureModeEnum.Height) {
      this.clearContourLine();
    }
  }

  // 处理距离量算
  handlerDistance(resolve, result) {
    let dis = Number(result.distance);
    const positions = result.positions;
    if (this.calculateMode == this.calculateModeEnum.CGCS2000 ||
      this.calculateMode == this.calculateModeEnum.XIAN80 ||
      this.calculateMode == this.calculateModeEnum.WGS84
    ) {
      dis = Number(this.calcClampDistance(positions));
    }
    const distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
    this.curHandler.disLabel.text = '距离:' + distance;

    // 返回结果
    this.measureResult = {distance:dis};
    if (!this.curHandler.active) { // 当handle绘制结束-> 调用activeEvt将激活状态改为false -> 再调用measureEvt拿到最终结果
      resolve(this.measureResult);
    }
  }

  // 处理面积量算
  handlerArea(resolve, result) {
    let mj = Number(result.area);
    const positions = result.positions;
    if (this.calculateMode == this.calculateModeEnum.CGCS2000 ||
      this.calculateMode == this.calculateModeEnum.XIAN80 ||
      this.calculateMode == this.calculateModeEnum.WGS84
    ) {
      mj = Number(this.calcClampArea(positions));
    } else if (this.calculateMode == this.calculateModeEnum.Projection) {
      mj = Number(this.calcAreaWithoutHeight(positions));
    }

    const area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
    this.curHandler.areaLabel.text = '面积:' + area;

    // 返回结果
    this.measureResult = {area:mj};
    if (!this.curHandler.active) { // 当handle绘制结束-> 调用activeEvt将激活状态改为false -> 再调用measureEvt拿到最终结果
      resolve(this.measureResult);
    }
  }

  // 处理测高量算
  handlerHeight(resolve, result) {
    const distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
    const vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
    const hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
    this.curHandler.disLabel.text = '空间距离:' + distance;
    this.curHandler.vLabel.text = '垂直高度:' + vHeight;
    this.curHandler.hLabel.text = '水平距离:' + hDistance;

    // 实时显示等高线
    const lineHeight = Number(result.endHeight);
    if (this.isShowContourLine) this.updateContourLine(lineHeight);

    // 返回结果
    this.measureResult = {
      distance: result.distance,
      verticalHeight: result.verticalHeight,
      horizontalDistance: result.horizontalDistance
    };
    if (!this.curHandler.active) { // 当handle绘制结束-> 调用activeEvt将激活状态改为false -> 再调用measureEvt拿到最终结果
      resolve(this.measureResult);
    }
  }

  // 创建等值线对象
  createIsoline() {
    const isoline = new SuperMap3D.HypsometricSetting();
    isoline.DisplayMode = SuperMap3D.HypsometricSettingEnum.DisplayMode.LINE;
    isoline.ColorTable = new SuperMap3D.ColorTable();
    isoline.LineColor = SuperMap3D.Color.fromCssColorString('#ff7d00');
    isoline.Opacity = 0.6;
    isoline.MaxVisibleValue = -100;
    isoline.MinVisibleValue = -100;
    return isoline;
  }

  // 给场景和S3M模型绑定等高线
  setHypsometricSetting(isoline) {
    if (!isoline) return;
    // 全局的，支持地形等
    this.viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: isoline,
      analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
    };

    // S3M模型
    const layers = this.viewer.scene.layers.layerQueue;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      layer.hypsometricSetting = {
        hypsometricSetting: isoline,
        analysisMode: SuperMap3D.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
      };
    }
  }

  // 更新等高线
  updateContourLine(height) {
    if(this.viewer.scene.globe.HypsometricSetting.hypsometricSetting){
      this.viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
      this.viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue = height;
    }

    const layers = this.viewer.scene.layers.layerQueue;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.hypsometricSetting && layer.hypsometricSetting.hypsometricSetting) {
        layer.hypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
        layer.hypsometricSetting.hypsometricSetting.MinVisibleValue = height;
      }
    }
  }

  // 关闭等高线
  clearContourLine() {
    this.updateContourLine(-1000); // 其实就是把高度设成负数隐藏了
  }

  // 设置鼠标样式
  activeMouse(isActive) {
    if (isActive == true) {
      this.viewer.enableCursorStyle = false;
      this.viewer._element.style.cursor = '';
      document.body.classList.add("measureCur");
      this.curHandler.snappingEnabled = this.isPickPoint;
    }
    else {
      this.viewer.enableCursorStyle = true;
      document.body.classList.remove('measureCur');
      document.body.classList.remove('drawCur'); 1
      this.curHandler.snappingEnabled = false;

      this.addClearLabel();
    }
  }

  // 给每个量算添加删除按钮
  addClearLabel() {
    // console.log("curHandler:", this.curHandler);
    if (!this.curHandler || !(this.curHandler instanceof SuperMap3D.MeasureHandler)) return;

    // 获取量算标签定位
    const handlerLabel = this.curHandler.disLabel || this.curHandler.areaLabel;
    let labelPosition = handlerLabel.position;
    if (!labelPosition) return;

    // 测高时该删除标签位于相互垂直的相交点
    if(this.measureMode === this.measureModeEnum.Height){
      labelPosition = this.curHandler.fpEntity.position._value || labelPosition;
    }

    // 删除按钮:这里可以根据需要,在类初始化时传入一个HTML元素,然后在这里克隆cloneNode
    const container = document.createElement('div');
    container.className = 'clear-handle-box';
    container.innerHTML = '&times;';
    container.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        text-align: center;
        background-color: #2A2A2AD9;
        color: #f0f0f0;
        border-radius: 3px;
        cursor: pointer;
    `;
    document.body.appendChild(container);
    container.addEventListener('click', this.clearHandle.bind(this, this.curHandler)); // 指定this同时传入参数

    this.curHandler.clearLabelContainer = container;

    // 计算当前删除按钮位置
    this.scene.postRender.addEventListener(this.computedBubblePosition.bind(this, container, labelPosition));
  }

  // 清除当前量算
  clearHandle(handler, event) {
    if (handler) handler.clear();
    if (event && event.currentTarget) {
      const clickDom = event.currentTarget;
      clickDom.remove();
    }
    // 清除等高线
    if (this.measureMode === this.measureModeEnum.Height) {
      if (handler === this.curHandler) { // 点击其他的量高删除标签不会将当前的删除掉
        this.clearContourLine();
      }
    }
  }

  // 实时计算弹窗位置
  computedBubblePosition(container, position) {
    if (!container || !position) return;
    const windowPosition = new SuperMap3D.Cartesian2();
    SuperMap3D.SceneTransforms.wgs84ToWindowCoordinates(this.scene, position, windowPosition);

    if (windowPosition && windowPosition.y && windowPosition.x) {
      // 左下角锚点
      // container.style.top = windowPosition.y - container.offsetHeight + "px";
      // container.style.left = windowPosition.x + "px";

      // 右上角作为锚点
      container.style.top = windowPosition.y + "px";
      container.style.left = windowPosition.x - container.offsetWidth + "px";
    }
  }

  // 椭球贴地距离
  calcClampDistance(positions) {
    const lonlat = [];
    for (let i = 0; i < positions.length; i++) {
      const cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
      const lon = SuperMap3D.Math.toDegrees(cartographic.longitude);

      const lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
      lonlat.push(lon, lat);
    }

    const gemetry = new SuperMap3D.PolylineGeometry({
      positions: SuperMap3D.Cartesian3.fromDegreesArray(lonlat)
    });

    let value = 0;
    if (this.calculateMode == this.calculateModeEnum.CGCS2000) {
      value = this.scene.globe.computeSurfaceDistance(gemetry, SuperMap3D.Ellipsoid.CGCS2000);

    } else if (this.calculateMode == this.calculateModeEnum.XIAN80) {
      value = this.scene.globe.computeSurfaceDistance(gemetry, SuperMap3D.Ellipsoid.XIAN80);
    }
    return value;
  }

  // 椭球贴地面积
  calcClampArea(positions) {
    const lonlat = [];
    for (var i = 0; i < positions.length; i++) {
      const cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
      const lon = SuperMap3D.Math.toDegrees(cartographic.longitude);

      const lat = SuperMap3D.Math.toDegrees(cartographic.latitude);
      lonlat.push(lon, lat);
    }

    const gemetry = new SuperMap3D.PolygonGeometry.fromPositions({
      positions: SuperMap3D.Cartesian3.fromDegreesArray(lonlat)
    });

    let value = 0;
    if (this.calculateMode == this.calculateModeEnum.CGCS2000) {
      value = this.scene.globe.computeSurfaceArea(gemetry, SuperMap3D.Ellipsoid.CGCS2000);

    } else if (this.calculateMode == this.calculateModeEnum.XIAN80) {
      value = this.scene.globe.computeSurfaceArea(gemetry, SuperMap3D.Ellipsoid.XIAN80);
    }
    return value;
  }

  // 计算平面场景下的面积
  calcAreaWithoutHeight(positions) {
    let totalLon = 0;
    for (let i = 0; i < positions.length; i++) {
      const cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);
      const lon = SuperMap3D.Math.toDegrees(cartographic.longitude);
      totalLon += lon;
    }

    const dh = Math.round((totalLon / positions.length + 6) / 6);//带号
    const centralMeridian = dh * 6 - 3;
    //高斯投影
    const projection = new SuperMap3D.CustomProjection({
      name: "tmerc",
      centralMeridian: centralMeridian,
      primeMeridian: 0,
      standardParallel_1: 0,
      standardParallel_2: 0,
      eastFalse: 500000.0,
      northFalse: 0.0,
      semimajorAxis: 6378137,
      inverseFlattening: 298.257222101

    });
    const cartesians = [];
    for (let i = 0; i < positions.length; i++) {
      const cartographic = SuperMap3D.Cartographic.fromCartesian(positions[i]);

      const cartesian = projection.project(cartographic);
      cartesians.push(cartesian);
    }

    cartesians.push(cartesians[0]);//首尾相接
    const value = SuperMap3D.getPreciseArea(cartesians, "China2000", centralMeridian, dh, 1);
    return value;
  }

  // 清除所有量算
  clear() {
    // 直接销毁量算对象
    this.disHandlerList.forEach(handler => {
      // handler && handler.clear();
      handler = handler && handler.destroy();
    })
    this.disHandlerList = [];
    this.areaHandlerList.forEach(handler => {
      handler = handler && handler.destroy();
    })
    this.areaHandlerList = [];
    this.heightHandlerList.forEach(handler => {
      handler = handler && handler.destroy();
    })
    this.heightHandlerList = [];

    // 清除标签
    const elements = document.getElementsByClassName('clear-handle-box');
    for (let i = elements.length - 1; i >= 0; i--) { // 反向遍历，避免数组索引变化问题
      elements[i].remove();
    }

    // 清除等高线
    this.clearContourLine();
  }

  // 销毁绘制类
  destroy() {
    this.clear();
    this.curHandler = null;
    this.isoline = null;
  }
}

export default SceneMeasure;