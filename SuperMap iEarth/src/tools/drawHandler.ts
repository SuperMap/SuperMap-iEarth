//DrawHandler封装
/**
 * 初始化-package
 * DrawMode：类型：主要是封装常用的绘制线和面两种
 * clampMode：模式：空间，贴地
 */

const initHandler = function (DrawMode: string, clampMode?: number) {
    let handler: any, clampmode: number = 0;
    // if (SuperMap3D.defined(clampMode)) clampmode = clampMode;
    switch (DrawMode) {
        case "Polyline":
            handler = new SuperMap3D.DrawHandler(window.viewer, SuperMap3D.DrawMode.Line, clampmode);
            break;
        case "Polygon":
            handler = new SuperMap3D.DrawHandler(window.viewer, SuperMap3D.DrawMode.Polygon, clampmode);
            break;
    };
    // 半透线创建
    let polylineCollection = new SuperMap3D.PolylineCollection({
        translucentRS: SuperMap3D.RenderState.fromCache({
            depthMask: false,
            depthTest: {
                enabled: false
            }
        })
    });
    handler.polylineTransparent = polylineCollection.add({
        width: 2,
        material: SuperMap3D.Material.fromType(SuperMap3D.Material.ColorType, {
            color: SuperMap3D.Color.fromCssColorString("#51ff00").withAlpha(
                0.3
            )
        })
    });
    window.viewer.scene.primitives.add(polylineCollection);

    handler.handlerDrawing = function () {
        return new Promise((resolve, reject) => {
            let clearActFn = handler.activeEvt.addEventListener((isActive: any) => {
                if (isActive == true) {
                    window.viewer.enableCursorStyle = false;
                    window.viewer._element.style.cursor = '';
                    document.body.classList.add("drawCur");
                } else {
                    window.viewer.enableCursorStyle = true;
                    document.body.classList.remove('drawCur');
                }
            });

            let clearMovFn = handler.movingEvt.addEventListener((windowPosition: any) => {
                if (handler.polyline && handler.isDrawing) {
                    // let p = [...handler.polyline.positions];
                    // if (DrawMode == "Polygon") p.push(p[0]);
                    // handler.polylineTransparent.show = true;
                    // handler.polylineTransparent.positions = p;
                }
            });

            let clearDrawFn = handler.drawEvt.addEventListener((result: any) => {
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

export default initHandler;
