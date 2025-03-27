class ModelEdit {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.init(options);
  }

  init(params={}){
    this.callback = params.callback; // 模型被编辑后的回调函数
    this.translation = params.translation; // 平移
    this.rotation = params.rotation;  // 旋转
    this.scale = params.scale;// 缩放
    this.size = params.size;// 缩放
    this.model = null; // 需要编辑的模型
    this.follow = null; // 传入的跟随模型编辑而变化的对象
    this.modelEditor = null;
  }

  // 打开模型编辑器
  open(model,follow) {
    if (!SuperMap3D.defined(model)) return;
    
    // model必须是Entity或者S3Mintance
    if (!((model instanceof SuperMap3D.Entity) || (model instanceof SuperMap3D.S3MInstance))) {
      alert('模型编辑器目前只支持Entity或者S3Mintance类型'); 
      return;
    };
    
    this.model = model;
    this.follow = follow;

    // 模型编辑已创建
    if (this.modelEditor) {
      this.modelEditor.setEditObject(this.model);
      this.modelEditor.activate();
      return;
    }

    this.modelEditor = new SuperMap3D.ModelEditor({
      model: this.model,
      scene: this.viewer.scene,
      // lineWidthScale: 20, // 放大轴方便操作，只有第一次设置后操作管用
      scale: this.size || 1,
      axesShow: {
        translation: this.translation === false ? false : true, // 默认打开，只有直接设置为false才会关闭
        rotation: this.rotation === false ? false : true,
        scale: this.scale === false ? false : true,
      }
    });

    this.modelEditor.changedEvt.addEventListener((param) => {
      if(this.callback && this.follow){
        this.callback(this.model,this.follow);
      }
    })

    this.modelEditor.activate();
  }
  

  // 关闭模型编辑器
  close() {
    if (this.modelEditor) this.modelEditor.deactivate();
  }

  // 销毁模型编辑器
  destroy(){
    if (this.modelEditor) {
      this.modelEditor.deactivate();
      this.modelEditor.destroy();
      this.modelEditor = null;
    }

    this.model = null;
    this.follow = null;
  }
}

export default ModelEdit;