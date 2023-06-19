
/**
 * 编辑功能
 */


function setEditHandler(entity:any,isEditZ:any, callback ?:any) {
    if (!window.SuperMap3D.defined(entity)) {
        if (window.SuperMap3D.defined(window.editHandler)) window.editHandler.clear();
        else { };
        return;
    }
    if (!window.SuperMap3D.defined(window.editHandler)) {
        window.editHandler = new window.SuperMap3D.EditHandler(viewer, entity);
        window.editHandler.isEditZ = isEditZ ? isEditZ : false;
        window.editHandler.changedEvt.addEventListener(() => {
            if (window.SuperMap3D.defined(callback)) callback(window.editHandler._positions);
        })
    } else {
        window.editHandler.deactivate();
        window.editHandler.setEditObject(entity);
        window.editHandler.activate();
    }
}

export default setEditHandler;