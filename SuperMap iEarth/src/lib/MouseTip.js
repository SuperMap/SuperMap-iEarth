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

export default MouseTip;