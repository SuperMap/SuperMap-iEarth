class EditHandler {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.editHandler = null;
    this.init(options);
  }

  init(parmas = {}) {
    this.isEditZ = parmas.isEditZ;
    this.callback = parmas.callback;
  }

  open(entity, isEditZ = false, callback = undefined) {
    if (!entity || !(entity instanceof SuperMap3D.Entity)) return;


    if (this.editHandler) {
      this.editHandler.deactivate();
      this.editHandler.setEditObject(entity);
      this.editHandler.isEditZ = isEditZ === true ? true : false;
      this.editHandler.activate();
      return;
    }

    this.editHandler = new SuperMap3D.EditHandler(viewer, entity);
    this.editHandler.isEditZ = isEditZ === true ? true : false;
    this.editHandler.changedEvt.addEventListener(() => {
      console.log("this.editHandler._positions:",this.editHandler._positions)
      if (!callback || !(callback instanceof Function)) return;
      callback(this.editHandler._positions);
    })
    // this.editHandler.activate();
  }

  close(){
    if(this.editHandler) this.editHandler.deactivate();
    if(this.editHandler) this.editHandler.clear(); // 清除标志点
  }

  destroy(){
    this.close();
    this.isEditZ = false;
    this.callback = null;
    if(this.editHandler) this.editHandler = null;
  }
}

export default EditHandler;