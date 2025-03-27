class MouseMove {
  constructor(viewer,options) {
    this.viewer = viewer;
    this.mouseHandler = new SuperMap3D.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.init(options);
  }

  init(params={}){
    if(!params || !params.body) return;
    this.mouseTip = new MouseTip(params.body);
    this.disableDomClassName = params.disableDomClassName;
  }

  openTip(){
    this.mouseHandler.setInputAction(e => {
     (this.tipString && this.tipString != '') ? this.mouseTip.showAt(e.endPosition, `<p>${this.tipString}</p>`) : this.mouseTip.setVisible(false);
    }, SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);

    // 传入当鼠标移动时tip需要失效的DOM
    // const domCollection = document.getElementsByClassName(this.disableDomClassName);
    // if(domCollection && domCollection.length > 0){
    //   this.disableDom = domCollection[0];
    //   this.disableDom.addEventListener('mousemove', function(){
    //     if(this.mouseTip) this.mouseTip.setVisible(false);
    //   });
    // }
  }

  setText(tipString){
    this.tipString = tipString;
  }

  closeTip(){
    this.mouseTip.setVisible(false);
  }


  destroy(){
    this.closeTip();
    this.mouseHandler.removeInputAction(SuperMap3D.ScreenSpaceEventType.MOUSE_MOVE);
    if(!this.mouseHandler.isDestroyed()) this.mouseHandler.destroy();
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

export default MouseMove;