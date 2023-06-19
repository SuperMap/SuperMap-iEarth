// 通视分析封装类
class SightlineAnalysis {
    /**
       * Creates an instance of Roaming.
       * @param {*} viewer 需要传入
       * @param {*} options.visibleColor  需要传入
       * @param {*} options.hiddenColor  需要传入
       * @param {*} options.lineWidth  可选，显隐容器
       * @memberof Roaming
       * @example
       * 
   */
    constructor(viewer, options) {
        this.viewer = viewer;
        this.init(viewer);
        this.updateOptionsParams(options);
    }

    //初始化
    init(viewer) {
        this.sightline = new Cesium.Sightline(viewer.scene);
        this.sightline.visibleColor = Cesium.Color.fromCssColorString("rgb(0, 200, 0)");
        this.sightline.hiddenColor = Cesium.Color.fromCssColorString("rgb(200, 0, 0)");
        this.sightline.lineWidth = 3;
        this.barrierColor = Cesium.Color.fromCssColorString("rgba(255, 186, 1, 1)");
        this.viewPosition = null;  //观察点坐标
        this.sightTargetPoints = []; //目标点坐标数组
        this.allEntityIds = [];    //ids
        this.barrierIds = null;
        this.barrierPointsVisible = true;
        this.sightBarrierPoints = []; //障碍物坐标数组
    }

    /**
      * 更新可配置的内部参数
      * @param {object} options 配置项
      */
    updateOptionsParams(options) {
        if (!options) return;
        if (Cesium.defined(options.visibleColor)) this.sightline.visibleColor = options.visibleColor;
        if (Cesium.defined(options.hiddenColor)) this.sightline.hiddenColor = options.hiddenColor;
        if (Cesium.defined(options.lineWidth)) this.sightline.lineWidth = options.lineWidth;
    }


    /**
     * 开始执行分析
     * @param {Array} _positions 添加点的笛卡尔坐标
     * 
    */
    addPoints(_position) {
        let position = CartesiantoDegrees(_position); // 将获取的点的位置转化成经纬度
        // 观察点设置
        if (!this.viewPosition) {
            this.sightline.viewPosition = position;
            this.viewPosition = _position;
            this.sightline.build();
            this.addEntityPoints('view');
            return;
        }
        this.sightTargetPoints.push(_position);
        let index = this.sightTargetPoints.length - 1;
        this.addEntityPoints('target', index);
        // 目标点设置
        this.sightline.addTargetPoint({
            position: position,
            name: "sightPoint_target" + index
        });
        this.addBarrierPoints(index);
    };

    /**
    * 添加目标点和观察点
    */
    addEntityPoints(type, index) {
        let id = 'sightPoint_' + type + index;
        this.allEntityIds.push(id);
        viewer.entities.add(new Cesium.Entity({
            id: id,
            point: new Cesium.PointGraphics({
                color: this.barrierColor,
                pixelSize: 10
            }),
            position: new Cesium.CallbackProperty(() => {
                if (Cesium.defined(index)) return this.sightTargetPoints[index];
                return this.viewPosition;
            }, false),
        }));
    }

    /**
    * 设置移动鼠标显示实时分析结果
    */
    addMoveTargetPoint(cartesians) {
        if (!this.viewPosition || !cartesians) return;
        let position = CartesiantoDegrees(cartesians); // 将获取的点的位置转化成经纬度
        this.sightline.addTargetPoint({
            position: position,
            name: "sightPoint_move",
        });
    }
    
    /**
    * 清除移动鼠标显示实时分析结果
    */
    removeMoveTargetPoint() {
        this.sightline.removeTargetPoint('sightPoint_move');
    }

    /**
    * 设置障碍物高亮
    */
    setBarrierHighLight() {
        this.barrierIds = this.sightline.getObjectIds();
        if (!this.barrierIds) return;
        for (const key in this.barrierIds) {
            let layer = this.viewer.scene.layers.findByIndex(Number(key) - 3); // 底层索引从3开始
            if (layer) layer.setObjsColor(this.barrierIds[key], this.barrierColor);
        }
    }

    /**
    * 清除障碍物高亮
    */
    clearBarrierHighLight() {
        for (let layer of this.viewer.scene.layers.layerQueue) {
            layer.removeAllObjsColor();
        }
    }

    /**
    * 添加障碍点
    */
    addBarrierPoints(index) {
        setTimeout(() => {
            this.sightline.getBarrierPoint(('sightPoint_target' + index), (obj) => {
                if (obj && obj.position) {
                    obj.position.height += 2;
                    let position = Cesium.Cartographic.toCartesian(obj.position);
                    this.sightBarrierPoints.push(position);  //记录障碍点信息
                } else {
                    this.sightBarrierPoints.push({ x: 6378137, y: 0, z: 0 });
                }
                let ab = viewer.entities.add({
                    name: 'Point_Barrier' + index,
                    position: new Cesium.CallbackProperty(() => {
                        return this.sightBarrierPoints[index]
                    }, false),
                    cylinder: {
                        show: new Cesium.CallbackProperty(() => {
                            return this.barrierPointsVisible
                        }, false),
                        length: 3,
                        topRadius: 2,
                        bottomRadius: 0,
                        material: Cesium.Color.fromCssColorString("#d60000")
                    }
                });
            })
        }, 500);

    }

    /**
    * 设置障碍点显隐 val Boolean
    */
    setBarrierPointsVisible(val) {
        this.barrierPointsVisible = val
    }

     /**
    * 销毁
    */
    clear() {
        this.sightline.removeAllTargetPoint();
        this.viewPosition = null;
        this.sightTargetPoints.length = 0; //目标点坐标数组
        this.allEntityIds.forEach((id, i) => {
            this.viewer.entities.removeById(id);
            let barrierId = 'Point_Barrier' + i;
            this.viewer.entities.removeById(barrierId);
        })
        this.allEntityIds.length = 0;
        this.clearBarrierHighLight();
        this.barrierIds = null;
        this.sightBarrierPoints.length = 0;
    }

    /**
    * 销毁
    */
    destroy() {
        this.clear();
        this.sightline = undefined;
    }
}


//笛卡尔转经纬度
const CartesiantoDegrees = (Cartesians) => {
    let array = [].concat(Cartesians);
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



export default SightlineAnalysis
