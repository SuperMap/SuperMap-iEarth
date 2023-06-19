//DrawHandler封装
// import tool from './tool'
/**
 * 初始化-package
 * DrawMode：类型：主要是封装常用的绘制线和面两种
 * clampMode：模式：空间，贴地
 */

const Cesium = window.SuperMap3D;

const initHandler = function (DrawMode:string, clampMode?:number) {
    let handler:any, clampmode:number = 0;
    // if (Cesium.defined(clampMode)) clampmode = clampMode;
    switch (DrawMode) {
        case "Polyline":
            handler = new Cesium.DrawHandler(window.viewer, Cesium.DrawMode.Line, clampmode);
            break;
        case "Polygon":
            handler = new Cesium.DrawHandler(window.viewer, Cesium.DrawMode.Polygon, clampmode);
            break;
    };
    // 半透线创建
    let polylineCollection = new Cesium.PolylineCollection({
        translucentRS: Cesium.RenderState.fromCache({
            depthMask: false,
            depthTest: {
                enabled: false
            }
        })
    });
    handler.polylineTransparent = polylineCollection.add({
        width: 2,
        material: Cesium.Material.fromType(Cesium.Material.ColorType, {
            color: Cesium.Color.fromCssColorString("#51ff00").withAlpha(
                0.3
            )
        })
    });
    window.viewer.scene.primitives.add(polylineCollection);

    handler.handlerDrawing = function () {
        return new Promise((resolve, reject) => {
            let clearActFn = handler.activeEvt.addEventListener((isActive:any) => {
                if (isActive == true) {
                    window.viewer.enableCursorStyle = false;
                    window.viewer._element.style.cursor = '';
                    document.body.classList.add("drawCur");
                } else {
                    window.viewer.enableCursorStyle = true;
                    document.body.classList.remove('drawCur');
                }
            });

            let clearMovFn = handler.movingEvt.addEventListener((windowPosition:any) => {
                if (handler.polyline && handler.isDrawing) {
                    // let p = [...handler.polyline.positions];
                    // if (DrawMode == "Polygon") p.push(p[0]);
                    // handler.polylineTransparent.show = true;
                    // handler.polylineTransparent.positions = p;
                }
            });

            let clearDrawFn = handler.drawEvt.addEventListener((result:any) => {
                if (!result.object.positions) {
                    handler.deactivate();
                    handler.activate();
                    return;
                };
                if (handler.polygon) handler.polygon.show = false;
                if (handler.polyline) handler.polyline.show = false;
                handler.deactivate();
                // let positions = tool.CartesiantoDegrees(result.object.positions);
                if (DrawMode == "Polygon") {
                    handler.polygon._polygon._material._color._value.alpha = 0.1 //绘制面透明度
                    let p2 = [...result.object.positions]; //画面时，需要首尾相连
                    p2.push(p2[0]);
                    handler.polylineTransparent.positions = p2;
                };
                resolve(result);
                //清除监听事件
                clearActFn();
                clearMovFn();
                clearDrawFn();
            });
        });
    };

    handler.clearHandler = function () {
        if (!handler) return;
        handler.deactivate();
        handler.clear()
        window.viewer.enableCursorStyle = true;
        handler.polylineTransparent.show = false;
        document.body.classList.remove("drawCur");
    };


    handler.destroy = function () {
        if (!handler) return;
        handler = null;
        window.viewer.scene.primitives.remove(polylineCollection);
    }

    return handler
};

export default initHandler
