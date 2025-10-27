
class DrawHandler {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.handlerPoint = null; 
    this.handlePolyline = null;
    this.handlePolygon = null;
    this.isDrawing = false;
    const body = (options && options.body) ? options.body : document.body;
    this.mouseTip = new MouseTip(body);
    this.handlerRightClick =  new SuperMap3D.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.init(options);
  }

  init(parmas={}) {
    this.openMouseTip = parmas.openMouseTip === false ? false : true; // 是否开启鼠标提示
    this.useDefaultTip = parmas.useDefaultTip === false ? false : true;; // 是否使用默认提示，开启后传入的提示语将失效，默认开启
    this.tipContent = parmas.tipContent; // 传入的鼠标提示语，为使其生效，请传入时设置useDefaultTip为false
    this.defaultTipContent = { // 默认的鼠标提示语
      pointMoving: '点击左键添加，点击右键结束',
      polylineMoving:'点击左键添加线节点，点击右键结束绘制',
      polylineFinish:'点击左键继续添加节点，点击右键获取线节点数据',
      polygonMoving:'点击左键添加面节点，点击右键结束绘制',
      polygonFinish:'点击左键继续添加节点，点击右键获取面节点数据',
    }

    // 新增右键结束事件
    this.handlerRightClick.setInputAction(e => {
      this.setMouseCursor('normal');
      this.mouseTip.setVisible(false);
      this.isDrawing = false;

      // 关闭点绘制
      if(this.handlerPoint) {
        this.closePoint();
      }

      // 关闭线绘制
      if(this.handlePolyline && this.handlePolyline.positions.length <= 1){
        this.closePolyline();
      }

      // 关闭面绘制
      if(this.handlePolygon && this.handlePolygon.positions.length <= 2){
        this.closePolygon();
      }
    }, SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
  }

  // 开启或关闭绘制点
  startPoint() {
    this.isDrawing = true;
    return new Promise((resolve, reject) => {
      try {
        this.closePoint(); // 先销毁之前的，再重新创建

        const clampmode = 0; // 是否贴地贴模型：todo...
        this.handlerPoint = new SuperMap3D.DrawHandler(this.viewer, SuperMap3D.DrawMode.Point, clampmode);
        this.handlerPoint.activeEvt.addEventListener((isActive) => {
          if (isActive == true) {
            this.setMouseCursor('measureCur');
          } else {
            this.setMouseCursor('normal');
          }
        });
    
        this.handlerPoint.movingEvt.addEventListener((windowPosition) => {
          if(this.openMouseTip) {
            const tipContent = this.computedMouseTipContent('point');
            (tipContent && tipContent != '') ? this.mouseTip.showAt(windowPosition, `<p>${tipContent}</p>`) : this.mouseTip.setVisible(false);
          }
        });
    
        this.handlerPoint.drawEvt.addEventListener((result) => {
          this.handlerPoint.point.show = false;
          this.handlerPoint.deactivate();
          this.mouseTip.setVisible(false);
          this.isDrawing = false;
          // 对数据做简单处理在返回：直接返回对应坐标
          if(result && result.object && result.object.position){
            const newArray = [].concat(result.object.position); // 重新创建一个坐标数组，避免引用清空
            resolve(newArray[0]);
          }else{
            resolve(undefined);
          }
        });
    
        this.handlerPoint.activate();
      } catch (error) {
        reject(error);
      }
    })
  }
  closePoint(){
    this.setMouseCursor('normal');
    this.mouseTip.setVisible(false);
    if(this.handlerPoint){
      this.handlerPoint.deactivate();
      this.handlerPoint.clear();
    }
  }


  // 开启或关闭绘制线
  startPolyline() {
    this.isDrawing = true;
    return new Promise((resolve, reject) => {
      try {
        this.closePolyline(); // 先销毁之前的，再重新创建

        const clampmode = 0; // 是否贴地贴模型：todo...
        this.handlePolyline = new SuperMap3D.DrawHandler(this.viewer, SuperMap3D.DrawMode.Line, clampmode);
        this.handlePolyline.activeEvt.addEventListener((isActive) => {
          if (isActive == true) {
            this.setMouseCursor('drawCur');
          } else {
            this.setMouseCursor('normal');
          }
        });
    
        this.handlePolyline.movingEvt.addEventListener((windowPosition) => {
          if(this.openMouseTip) {
            const tipContent = this.computedMouseTipContent('polyline');
            (tipContent && tipContent != '') ? this.mouseTip.showAt(windowPosition, `<p>${tipContent}</p>`) : this.mouseTip.setVisible(false);
          }
        });
    
        this.handlePolyline.drawEvt.addEventListener((result) => {
          this.handlePolyline.polyline.show = false;
          this.handlePolyline.deactivate();
          this.mouseTip.setVisible(false);
          this.isDrawing = false;

          // 直接返回坐标
          if(result && result.positions){
            const newArray = [].concat(result.positions); // 重新创建一个坐标数组，避免引用清空
            resolve(newArray);
          }else if(result && result.object.positions){
            const newArray = [].concat(result.object.positions);
            resolve(newArray);
          }else{
            resolve(undefined);
          }
        });
    
        this.handlePolyline.activate();

        // 这种方式，第一次可以，第二次以后就获取不了结果了
        /**
          // 当前polylineHandler已创建，只需要再次激活即可
          if(this.handlePolyline && this.handlePolyline.active === false){
            this.handlePolyline.activate();
          }else{ // 重新创建
          this.handlePolyline = new SuperMap3D.DrawHandler(this.viewer, SuperMap3D.DrawMode.Line, clampmode);
          this.handlePolyline.activeEvt.addEventListener((isActive) => {
            if (isActive == true) {
              this.setMouseCursor('drawCur');
            } else {
              this.setMouseCursor('normal');
            }
          });
      
          this.handlePolyline.movingEvt.addEventListener((windowPosition) => {
            if (this.handlePolyline.isDrawing) { }
          });
      
          this.handlePolyline.drawEvt.addEventListener((result) => {
            this.handlePolyline.deactivate();
            this.handlePolyline.polyline.show = false;
            resolve(result);
          });
      
          this.handlePolyline.activate();
        }
         */
      } catch (error) {
        reject(error);
      }
    })
  }
  closePolyline(){
    this.setMouseCursor('normal');
    this.mouseTip.setVisible(false);
    if(this.handlePolyline){
      this.handlePolyline.deactivate();
      this.handlePolyline.clear();
    }
  }


  // 开启或关闭绘制面
  startPolygon() {
    this.isDrawing = true;
    return new Promise((resolve, reject) => {
      try {
        this.closePolygon(); // 先销毁之前的，再重新创建

        const clampmode = 0; // 是否贴地贴模型：todo...
        this.handlePolygon = new SuperMap3D.DrawHandler(this.viewer, SuperMap3D.DrawMode.Polygon, clampmode);
        this.handlePolygon.activeEvt.addEventListener((isActive) => {
          if (isActive == true) {
            this.setMouseCursor('drawCur');
          } else {
            this.setMouseCursor('normal');
          }
        });

        this.handlePolygon.movingEvt.addEventListener((windowPosition) => {
          if(this.openMouseTip) {
            const tipContent = this.computedMouseTipContent('polygon');
            (tipContent && tipContent != '') ? this.mouseTip.showAt(windowPosition, `<p>${tipContent}</p>`) : this.mouseTip.setVisible(false);
          }
        });

        this.handlePolygon.drawEvt.addEventListener((result) => {
          this.handlePolygon.polygon.show = false;
          this.handlePolygon.polyline.show = false; 
          this.handlePolygon.deactivate();
          this.mouseTip.setVisible(false);
          this.isDrawing = false;

          // 直接返回坐标
          if (result && result.positions) {
            const newArray = [].concat(result.positions); // 重新创建一个坐标数组，避免引用清空
            resolve(newArray);
          } else if (result && result.object.positions) {
            const newArray = [].concat(result.object.positions);
            resolve(newArray);
          } else {
            resolve(undefined);
          }
        });

        this.handlePolygon.activate();
      } catch (error) {
        reject(error);
      }
    })
  }
  closePolygon(){
    this.setMouseCursor('normal');
    this.mouseTip.setVisible(false);
    if(this.handlePolygon){
      this.handlePolygon.deactivate();
      this.handlePolygon.clear();
    }
  }


  // 计算鼠标移动时的显示内容
  computedMouseTipContent(type){
    if(!type) return;
    let tipContent = undefined;

    if(type === 'polyline'){
      if(!this.handlePolyline && !this.handlePolyline.active) return '';
      if(this.handlePolyline.positions.length <= 1){
        tipContent = this.useDefaultTip ? this.defaultTipContent.polylineMoving : this.tipContent.polylineMoving;
      }else {
        tipContent = this.useDefaultTip ? this.defaultTipContent.polylineFinish : this.tipContent.polylineFinish;
      }
    }else if(type === 'polygon'){
      if(!this.handlePolygon && !this.handlePolygon.active) return '';
      if(this.handlePolygon.positions.length <= 2){
        tipContent = this.useDefaultTip ? this.defaultTipContent.polygonMoving : this.tipContent.polygonMoving;
      }else {
        tipContent = this.useDefaultTip ? this.defaultTipContent.polygonFinish : this.tipContent.polygonFinish;
      }
    }else if(type === 'point'){
      if(!this.handlerPoint && !this.handlerPoint.active) return '';
      tipContent = this.useDefaultTip ? this.defaultTipContent.pointMoving : this.tipContent.pointMoving;
    }else {
      tipContent = '计算失败';
    }

    return tipContent;
  }

  // 设置鼠标样式
  setMouseCursor(type) {
    if (!this.viewer) return;
    if (type === 'normal') {
      this.viewer.enableCursorStyle = true; // 直接切换成SuperMap3D默认鼠标样式，同时之前修改的鼠标样式无效，一旦设为true，就会恢复viewer._element.style.cursor
      document.body.classList.remove('measureCur'); // 可先用contains判断是否存在
      document.body.classList.remove('drawCur');
    } else if (type === 'drawCur') {
      this.viewer.enableCursorStyle = false; // 关闭这个，让鼠标设置可以生效
      this.viewer._element.style.cursor = ''; // 改为‘’，避免覆盖我们设置的鼠标样式
      document.body.classList.add("drawCur"); // 绘制模式常用鼠标
    } else if (type === 'measureCur') {
      this.viewer.enableCursorStyle = false;
      this.viewer._element.style.cursor = '';
      document.body.classList.add("measureCur"); // 添加点模式
    } else {
      this.viewer.enableCursorStyle = true; // 恢复默认
    }
  }

  // 获取当前绘制状态
  getIsDrawing(){
    return this.isDrawing;
  }

  // 清除点线面
  clear(){
    this.isDrawing = false;
    this.setMouseCursor('normal');
    this.mouseTip.setVisible(false);
    this.closePoint();
    this.closePolyline();
    this.closePolygon();
  }

  // 销毁点线面
  destroy(){
    this.clear();

    this.handlerPoint = null;
    this.handlePolyline = null;
    this.handlePolygon = null;

    this.handlerRightClick.removeInputAction(SuperMap3D.ScreenSpaceEventType.RIGHT_CLICK);
  }
}

class MouseTip {
  constructor(body){
    this.body = body;
    this.init();
  }

  init() {
    const div = document.createElement('DIV');
    div.className = "twipsy right";

    const arrow = document.createElement('DIV');
    arrow.className = "twipsy-arrow";
    div.appendChild(arrow);

    const title = document.createElement('DIV');
    title.className = "twipsy-inner";
    div.appendChild(title);

    this._div = div;
    this._title = title;
    this.message = '';

    // add to frame div and display coordinates
    this.body.appendChild(div);
    const that = this;
    div.onmousemove = function (evt) {
      that.showAt({ x: evt.clientX, y: evt.clientY }, that.message);
    };
  }

  setVisible(visible){
    this._div.style.display = visible ? 'block' : 'none';
  }

  showAt(position, message) {
    if (position && message) {
      this.setVisible(true);
      this._title.innerHTML = message;
      this._div.style.left = position.x + 10 + "px";
      this._div.style.top = (position.y - this._div.clientHeight / 2) + "px";
      this.message = message;
    }
  }

  destroy(){
    this.setVisible(false);
    // console.log('销毁tooltip');
  }
}

export default DrawHandler;